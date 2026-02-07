import { useState, useCallback, useEffect } from "react";
import { Plus, Trash2, Car, AlertTriangle, ArrowLeft, ImageIcon, Loader2, Pencil, Lock, LogOut, Mail, ClipboardList, Phone, Calendar, Clock, CheckCircle, XCircle, MessageCircle, Eye, EyeOff, MapPin, CalendarDays, Settings, CreditCard, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MultiImageUpload from "@/components/MultiImageUpload";
import type { User, Session } from "@supabase/supabase-js";

// Available locations
const AVAILABLE_LOCATIONS = [
  "Hebbal",
  "Thanisandra",
  "KR Puram",
  "Bellandur",
  "Hongasandra",
  "Kengeri",
  "Nagarabhavi",
  "Kadugodi",
];

interface CarData {
  id: string;
  name: string;
  brand: string;
  price: number;
  kmLimit: number;
  extraKmCharge: number;
  fuel: string;
  transmission: string;
  category: string;
  categoryLabel: string;
  image?: string;
  images: string[];
  isAvailable: boolean;
  locations: string[];
  availableFrom: string | null;
  availableUntil: string | null;
  price3Days?: number | null;
  price7Days?: number | null;
  price15Days?: number | null;
  price30Days?: number | null;
}

interface BookingEnquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  car_name: string;
  pickup_date: string;
  drop_date: string;
  pickup_location: string;
  total_days: number;
  total_hours: number | null;
  estimated_price: number;
  status: string;
  created_at: string;
  notes: string | null;
}

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [cars, setCars] = useState<CarData[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(false);

  // Booking enquiries state
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);
  const [activeTab, setActiveTab] = useState("fleet");

  // Settings state
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  // Check auth status and admin role
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          checkAdminRole(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setIsCheckingAuth(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (err) {
      console.error('Error:', err);
      setIsAdmin(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Fetch cars when authenticated as admin
  useEffect(() => {
    if (isAdmin) {
      fetchCars();
      fetchEnquiries();
      fetchSettings();
    }
  }, [isAdmin]);

  const fetchSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'razorpay_key_id')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setRazorpayKeyId(data.value || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveRazorpayKey = async () => {
    setIsSavingSettings(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update({ value: razorpayKeyId })
        .eq('key', 'razorpay_key_id');
      
      if (error) throw error;
      
      toast({
        title: "Settings Saved",
        description: "Razorpay Key ID has been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const fetchCars = async () => {
    setIsLoadingCars(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      
      setCars(data.map(car => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        price: car.price,
        kmLimit: car.km_limit,
        extraKmCharge: car.extra_km_charge,
        fuel: car.fuel,
        transmission: car.transmission,
        category: car.category,
        categoryLabel: car.category_label || 'Hatchback',
        image: car.image || undefined,
        images: (car as any).images || [],
        isAvailable: (car as any).is_available ?? true,
        locations: (car as any).locations || [],
        availableFrom: (car as any).available_from || null,
        availableUntil: (car as any).available_until || null,
        price3Days: car.price_3_days,
        price7Days: car.price_7_days,
        price15Days: car.price_15_days,
        price30Days: car.price_30_days,
      })));
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast({
        title: "Error",
        description: "Failed to load cars from database.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCars(false);
    }
  };

  const fetchEnquiries = async () => {
    setIsLoadingEnquiries(true);
    try {
      const { data, error } = await supabase
        .from('booking_enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast({
        title: "Error",
        description: "Failed to load booking enquiries.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEnquiries(false);
    }
  };

  const updateEnquiryStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('booking_enquiries')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setEnquiries(enquiries.map(e => 
        e.id === id ? { ...e, status: newStatus } : e
      ));
      
      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const toggleCarAvailability = async (carId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cars')
        .update({ is_available: !currentStatus } as any)
        .eq('id', carId);
      
      if (error) throw error;
      
      setCars(cars.map(car => 
        car.id === carId ? { ...car, isAvailable: !currentStatus } : car
      ));
      
      toast({
        title: currentStatus ? "Car Hidden" : "Car Available",
        description: currentStatus 
          ? "Car is now hidden from customers." 
          : "Car is now visible to customers.",
      });
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        toast({
          title: "Welcome!",
          description: "Checking admin access...",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
      setPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setCars([]);
    setEnquiries([]);
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin dashboard.",
    });
  };

  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    kmLimit: "300",
    extraKmCharge: "10",
    fuel: "Petrol",
    transmission: "Manual",
    category: "5-Seater",
    categoryLabel: "Hatchback",
    price3Days: "",
    price7Days: "",
    price15Days: "",
    price30Days: "",
    availableFrom: "",
    availableUntil: "",
  });
  const [formLocations, setFormLocations] = useState<string[]>([]);

  // Multi-image state for add form
  const [formImages, setFormImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Edit mode state
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    brand: "",
    price: "",
    kmLimit: "",
    extraKmCharge: "",
    fuel: "Petrol",
    transmission: "Manual",
    category: "5-Seater",
    categoryLabel: "Hatchback",
    price3Days: "",
    price7Days: "",
    price15Days: "",
    price30Days: "",
    availableFrom: "",
    availableUntil: "",
  });
  // Multi-image state for edit form
  const [editFormImages, setEditFormImages] = useState<string[]>([]);
  const [editFormLocations, setEditFormLocations] = useState<string[]>([]);


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCars(cars.map((car) => car.id));
    } else {
      setSelectedCars([]);
    }
  };

  const handleSelectCar = (carId: string, checked: boolean) => {
    if (checked) {
      setSelectedCars([...selectedCars, carId]);
    } else {
      setSelectedCars(selectedCars.filter((id) => id !== carId));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .in('id', selectedCars);
      
      if (error) throw error;
      
      setCars(cars.filter((car) => !selectedCars.includes(car.id)));
      setSelectedCars([]);
      toast({
        title: "Cars Deleted",
        description: `${selectedCars.length} car(s) have been removed from inventory.`,
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete cars. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) throw error;
      
      setCars([]);
      setSelectedCars([]);
      toast({
        title: "Inventory Cleared",
        description: "All cars have been removed from inventory.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Delete all error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to clear inventory. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const { data, error } = await supabase
        .from('cars')
        .insert({
          name: formData.name,
          brand: formData.brand,
          price: Number(formData.price),
          km_limit: Number(formData.kmLimit),
          extra_km_charge: Number(formData.extraKmCharge),
          fuel: formData.fuel,
          transmission: formData.transmission,
          category: formData.category,
          category_label: formData.categoryLabel,
          image: formImages[0] || null,
          images: formImages,
          locations: formLocations,
          available_from: formData.availableFrom || null,
          available_until: formData.availableUntil || null,
          price_3_days: formData.price3Days ? Number(formData.price3Days) : null,
          price_7_days: formData.price7Days ? Number(formData.price7Days) : null,
          price_15_days: formData.price15Days ? Number(formData.price15Days) : null,
          price_30_days: formData.price30Days ? Number(formData.price30Days) : null,
        } as any)
        .select()
        .single();
      
      if (error) throw error;
      
      const newCar: CarData = {
        id: data.id,
        name: data.name,
        brand: data.brand,
        price: data.price,
        kmLimit: data.km_limit,
        extraKmCharge: data.extra_km_charge,
        fuel: data.fuel,
        transmission: data.transmission,
        category: data.category,
        categoryLabel: data.category_label || 'Hatchback',
        image: data.image || undefined,
        images: (data as any).images || [],
        isAvailable: true,
        locations: (data as any).locations || [],
        availableFrom: (data as any).available_from || null,
        availableUntil: (data as any).available_until || null,
        price3Days: data.price_3_days,
        price7Days: data.price_7_days,
        price15Days: data.price_15_days,
        price30Days: data.price_30_days,
      };
      
      setCars([...cars, newCar]);
      setFormData({
        name: "",
        brand: "",
        price: "",
        kmLimit: "300",
        extraKmCharge: "10",
        fuel: "Petrol",
        transmission: "Manual",
        category: "5-Seater",
        categoryLabel: "Hatchback",
        price3Days: "",
        price7Days: "",
        price15Days: "",
        price30Days: "",
        availableFrom: "",
        availableUntil: "",
      });
      setFormImages([]);
      setFormLocations([]);
      toast({
        title: "Car Added",
        description: `${newCar.brand} ${newCar.name} has been added to inventory.`,
      });
    } catch (error) {
      console.error('Add car error:', error);
      toast({
        title: "Add Failed",
        description: "Failed to add car. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Edit handlers
  const openEditDialog = (car: CarData) => {
    setEditingCar(car);
    setEditFormData({
      name: car.name,
      brand: car.brand,
      price: car.price.toString(),
      kmLimit: car.kmLimit.toString(),
      extraKmCharge: car.extraKmCharge.toString(),
      fuel: car.fuel,
      transmission: car.transmission,
      category: car.category,
      categoryLabel: car.categoryLabel,
      price3Days: car.price3Days?.toString() || "",
      price7Days: car.price7Days?.toString() || "",
      price15Days: car.price15Days?.toString() || "",
      price30Days: car.price30Days?.toString() || "",
      availableFrom: car.availableFrom || "",
      availableUntil: car.availableUntil || "",
    });
    setEditFormImages(car.images || []);
    setEditFormLocations(car.locations || []);
  };

  const closeEditDialog = () => {
    setEditingCar(null);
    setEditFormData({
      name: "",
      brand: "",
      price: "",
      kmLimit: "",
      extraKmCharge: "",
      fuel: "Petrol",
      transmission: "Manual",
      category: "5-Seater",
      categoryLabel: "Hatchback",
      price3Days: "",
      price7Days: "",
      price15Days: "",
      price30Days: "",
      availableFrom: "",
      availableUntil: "",
    });
    setEditFormImages([]);
    setEditFormLocations([]);
  };

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    setIsUploading(true);

    try {
      const { error } = await supabase
        .from('cars')
        .update({
          name: editFormData.name,
          brand: editFormData.brand,
          price: Number(editFormData.price),
          km_limit: Number(editFormData.kmLimit),
          extra_km_charge: Number(editFormData.extraKmCharge),
          fuel: editFormData.fuel,
          transmission: editFormData.transmission,
          category: editFormData.category,
          category_label: editFormData.categoryLabel,
          image: editFormImages[0] || null,
          images: editFormImages,
          locations: editFormLocations,
          available_from: editFormData.availableFrom || null,
          available_until: editFormData.availableUntil || null,
          price_3_days: editFormData.price3Days ? Number(editFormData.price3Days) : null,
          price_7_days: editFormData.price7Days ? Number(editFormData.price7Days) : null,
          price_15_days: editFormData.price15Days ? Number(editFormData.price15Days) : null,
          price_30_days: editFormData.price30Days ? Number(editFormData.price30Days) : null,
        } as any)
        .eq('id', editingCar.id);
      
      if (error) throw error;

      const updatedCar: CarData = {
        id: editingCar.id,
        name: editFormData.name,
        brand: editFormData.brand,
        price: Number(editFormData.price),
        kmLimit: Number(editFormData.kmLimit),
        extraKmCharge: Number(editFormData.extraKmCharge),
        fuel: editFormData.fuel,
        transmission: editFormData.transmission,
        category: editFormData.category,
        categoryLabel: editFormData.categoryLabel,
        image: editFormImages[0] || undefined,
        images: editFormImages,
        isAvailable: editingCar.isAvailable,
        locations: editFormLocations,
        availableFrom: editFormData.availableFrom || null,
        availableUntil: editFormData.availableUntil || null,
        price3Days: editFormData.price3Days ? Number(editFormData.price3Days) : null,
        price7Days: editFormData.price7Days ? Number(editFormData.price7Days) : null,
        price15Days: editFormData.price15Days ? Number(editFormData.price15Days) : null,
        price30Days: editFormData.price30Days ? Number(editFormData.price30Days) : null,
      };

      setCars(cars.map((car) => (car.id === editingCar.id ? updatedCar : car)));
      closeEditDialog();
      toast({
        title: "Car Updated",
        description: `${updatedCar.brand} ${updatedCar.name} has been updated.`,
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update car. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const openWhatsApp = (enquiry: BookingEnquiry) => {
    const message = `Hi ${enquiry.customer_name}, regarding your booking enquiry for ${enquiry.car_name} from ${formatDate(enquiry.pickup_date)} to ${formatDate(enquiry.drop_date)}. Total: ₹${enquiry.estimated_price.toLocaleString()}. Please confirm your booking.`;
    window.open(`https://api.whatsapp.com/send?phone=91${enquiry.customer_phone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const callCustomer = (phone: string) => {
    window.open(`tel:+91${phone}`, '_self');
  };

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Login with your admin credentials
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login to Admin Panel"
                )}
              </Button>
              <div className="text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Back to website
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin but logged in
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              You don't have admin privileges to access this dashboard.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Logged in as: <span className="font-medium text-foreground">{user.email}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Link to="/" className="flex-1">
                <Button variant="default" className="w-full">
                  Go to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Site</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="fleet" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Fleet ({cars.length})
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Enquiries ({enquiries.length})
            </TabsTrigger>
          </TabsList>

          {/* Fleet Management Tab */}
          <TabsContent value="fleet">
            {isLoadingCars ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading cars...</span>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Add New Vehicle Form */}
                <Card className="lg:col-span-1 h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-primary" />
                      Add New Vehicle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddCar} className="space-y-4">
                      {/* Multi-Image Upload */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Photos</h3>
                        <MultiImageUpload
                          images={formImages}
                          onImagesChange={setFormImages}
                          maxImages={10}
                          disabled={isUploading}
                        />
                      </div>

                      {/* Basic Info */}
                      <div className="space-y-3 pt-2 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Basic Info</h3>
                        <div className="space-y-2">
                          <Label htmlFor="brand">Brand</Label>
                          <Input
                            id="brand"
                            placeholder="e.g., Maruti Suzuki"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Model Name</Label>
                          <Input
                            id="name"
                            placeholder="e.g., Swift"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Seating Capacity</Label>
                            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5-Seater">5-Seater</SelectItem>
                                <SelectItem value="7-Seater">7-Seater</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                      </div>

                      {/* Pricing */}
                      <div className="space-y-3 pt-2 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Per Day Pricing</h3>
                        <div className="space-y-2">
                          <Label htmlFor="price">1-2 Days (₹/day)</Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="e.g., 2500"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="price3Days">3-7 Days (₹/day)</Label>
                            <Input
                              id="price3Days"
                              type="number"
                              placeholder="e.g., 2200"
                              value={formData.price3Days}
                              onChange={(e) => setFormData({ ...formData, price3Days: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price7Days">8-15 Days (₹/day)</Label>
                            <Input
                              id="price7Days"
                              type="number"
                              placeholder="e.g., 2000"
                              value={formData.price7Days}
                              onChange={(e) => setFormData({ ...formData, price7Days: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price15Days">16-30 Days (₹/day)</Label>
                            <Input
                              id="price15Days"
                              type="number"
                              placeholder="e.g., 1800"
                              value={formData.price15Days}
                              onChange={(e) => setFormData({ ...formData, price15Days: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price30Days">30+ Days (₹/day)</Label>
                            <Input
                              id="price30Days"
                              type="number"
                              placeholder="e.g., 1600"
                              value={formData.price30Days}
                              onChange={(e) => setFormData({ ...formData, price30Days: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="space-y-2">
                            <Label htmlFor="kmLimit">KM Limit/Day</Label>
                            <Input
                              id="kmLimit"
                              type="number"
                              value={formData.kmLimit}
                              onChange={(e) => setFormData({ ...formData, kmLimit: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="extraKmCharge">Extra KM Charge (₹)</Label>
                            <Input
                              id="extraKmCharge"
                              type="number"
                              value={formData.extraKmCharge}
                              onChange={(e) => setFormData({ ...formData, extraKmCharge: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Specifications */}
                      <div className="space-y-3 pt-2 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Specifications</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Fuel Type</Label>
                            <Select value={formData.fuel} onValueChange={(v) => setFormData({ ...formData, fuel: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Petrol">Petrol</SelectItem>
                                <SelectItem value="Diesel">Diesel</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Transmission</Label>
                            <Select value={formData.transmission} onValueChange={(v) => setFormData({ ...formData, transmission: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Manual">Manual</SelectItem>
                                <SelectItem value="Automatic">Automatic</SelectItem>
                                <SelectItem value="Manual & Automatic">Both</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Available Locations */}
                      <div className="space-y-3 pt-2 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Available Locations
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {AVAILABLE_LOCATIONS.map((location) => (
                            <label
                              key={location}
                              className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                              <Checkbox
                                checked={formLocations.includes(location)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormLocations([...formLocations, location]);
                                  } else {
                                    setFormLocations(formLocations.filter((l) => l !== location));
                                  }
                                }}
                              />
                              <span className="text-sm">{location}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Availability Dates */}
                      <div className="space-y-3 pt-2 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          Availability Dates
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Leave empty if car is always available. Set dates to restrict availability.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="availableFrom">Available From</Label>
                            <Input
                              id="availableFrom"
                              type="date"
                              value={formData.availableFrom}
                              onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="availableUntil">Available Until</Label>
                            <Input
                              id="availableUntil"
                              type="date"
                              value={formData.availableUntil}
                              onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full mt-4" disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Vehicle
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Inventory List */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Bulk Actions */}
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="selectAll"
                            checked={cars.length > 0 && selectedCars.length === cars.length}
                            onCheckedChange={handleSelectAll}
                            disabled={cars.length === 0}
                          />
                          <Label htmlFor="selectAll" className="text-sm font-medium">
                            Select All ({selectedCars.length}/{cars.length})
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedCars.length > 0 && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Selected ({selectedCars.length})
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Selected Cars?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove {selectedCars.length} car(s) from your inventory. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" disabled={cars.length === 0}>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Clear All
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                  <AlertTriangle className="h-5 w-5" />
                                  Clear Entire Inventory?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-base">
                                  Are you sure you want to clear your <strong>entire inventory</strong>? This will remove all {cars.length} vehicles and <strong>cannot be undone</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Yes, Clear Everything
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Car List or Empty State */}
                  {cars.length === 0 ? (
                    <Card className="py-16">
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Car className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Cars Found</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                          Your inventory is empty. Add your first vehicle using the form to get started.
                        </p>
                        <Button onClick={() => document.getElementById("brand")?.focus()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Car
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {cars.map((car) => (
                        <Card key={car.id} className={`transition-colors ${selectedCars.includes(car.id) ? "border-primary bg-primary/5" : ""} ${!car.isAvailable ? "opacity-60" : ""}`}>
                          <CardContent className="py-4">
                            <div className="flex items-center gap-4">
                              <Checkbox
                                checked={selectedCars.includes(car.id)}
                                onCheckedChange={(checked) => handleSelectCar(car.id, checked as boolean)}
                              />
                              <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden relative">
                                {car.image ? (
                                  <img src={car.image} alt={car.name} className="h-full w-full object-contain" />
                                ) : (
                                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                )}
                                {car.images.length > 1 && (
                                  <span className="absolute bottom-1 right-1 text-xs bg-charcoal/70 text-white px-1.5 py-0.5 rounded">
                                    +{car.images.length - 1}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-foreground">{car.brand} {car.name}</h3>
                                  {!car.isAvailable && (
                                    <Badge variant="outline" className="text-xs border-destructive text-destructive">
                                      Hidden
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{car.category}</span>
                                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{car.fuel}</span>
                                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{car.transmission}</span>
                                </div>
                              </div>
                              <div className="text-right mr-2">
                                <p className="text-lg font-bold text-primary">₹{car.price.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{car.kmLimit}km limit</p>
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className={`shrink-0 ${car.isAvailable ? 'text-green-600 border-green-300 hover:bg-green-50' : 'text-muted-foreground'}`}
                                onClick={() => toggleCarAvailability(car.id, car.isAvailable)}
                                title={car.isAvailable ? "Hide from customers" : "Show to customers"}
                              >
                                {car.isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0"
                                onClick={() => openEditDialog(car)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Enquiries Tab */}
          <TabsContent value="enquiries">
            {isLoadingEnquiries ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading enquiries...</span>
              </div>
            ) : enquiries.length === 0 ? (
              <Card className="py-16">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ClipboardList className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Enquiries Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Customer booking enquiries will appear here when they submit their details on the website.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="py-4 text-center">
                      <p className="text-2xl font-bold text-foreground">{enquiries.length}</p>
                      <p className="text-xs text-muted-foreground">Total Enquiries</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{enquiries.filter(e => e.status === 'pending' || e.status === 'Pending').length}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{enquiries.filter(e => e.status === 'confirmed' || e.status === 'Confirmed').length}</p>
                      <p className="text-xs text-muted-foreground">Confirmed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{enquiries.filter(e => e.status === 'completed' || e.status === 'Completed').length}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </CardContent>
                  </Card>
                </div>

                {enquiries.map((enquiry) => (
                  <Card key={enquiry.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Customer Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">{enquiry.customer_name}</h3>
                            {getStatusBadge(enquiry.status)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <a 
                              href={`tel:+91${enquiry.customer_phone}`}
                              className="flex items-center gap-1 text-primary hover:underline font-medium"
                            >
                              <Phone className="h-4 w-4" />
                              +91 {enquiry.customer_phone}
                            </a>
                            <span className="flex items-center gap-1">
                              <Car className="h-4 w-4" />
                              {enquiry.car_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {enquiry.total_days} days {enquiry.total_hours ? `+ ${enquiry.total_hours}h` : ''}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(enquiry.pickup_date)} → {formatDate(enquiry.drop_date)}
                            </span>
                          </div>
                          {enquiry.pickup_location && (
                            <p className="text-sm text-muted-foreground mt-1">
                              📍 {enquiry.pickup_location}
                            </p>
                          )}
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-col items-end gap-3">
                          {enquiry.estimated_price > 0 && (
                            <p className="text-2xl font-bold text-primary">₹{enquiry.estimated_price.toLocaleString()}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDate(enquiry.created_at)}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-whatsapp/10 border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white"
                              onClick={() => openWhatsApp(enquiry)}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-primary/10 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                              onClick={() => callCustomer(enquiry.customer_phone)}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                            <Select
                              value={enquiry.status}
                              onValueChange={(value) => updateEnquiryStatus(enquiry.id, value)}
                            >
                              <SelectTrigger className="w-32 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Vehicle Dialog */}
        <Dialog open={!!editingCar} onOpenChange={(open) => !open && closeEditDialog()}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-primary" />
                Edit Vehicle
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateCar} className="space-y-4">
              {/* Multi-Image Upload */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Photos</h3>
                <MultiImageUpload
                  images={editFormImages}
                  onImagesChange={setEditFormImages}
                  maxImages={10}
                  disabled={isUploading}
                />
              </div>

              {/* Basic Info */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Basic Info</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Input
                    id="edit-brand"
                    placeholder="e.g., Maruti Suzuki"
                    value={editFormData.brand}
                    onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Model Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g., Swift"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                    <Label>Seating Capacity</Label>
                    <Select value={editFormData.category} onValueChange={(v) => setEditFormData({ ...editFormData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-Seater">5-Seater</SelectItem>
                        <SelectItem value="7-Seater">7-Seater</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Per Day Pricing</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">1-2 Days (₹/day)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    placeholder="e.g., 2500"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price3Days">3-7 Days (₹/day)</Label>
                    <Input
                      id="edit-price3Days"
                      type="number"
                      placeholder="e.g., 2200"
                      value={editFormData.price3Days}
                      onChange={(e) => setEditFormData({ ...editFormData, price3Days: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price7Days">8-15 Days (₹/day)</Label>
                    <Input
                      id="edit-price7Days"
                      type="number"
                      placeholder="e.g., 2000"
                      value={editFormData.price7Days}
                      onChange={(e) => setEditFormData({ ...editFormData, price7Days: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price15Days">16-30 Days (₹/day)</Label>
                    <Input
                      id="edit-price15Days"
                      type="number"
                      placeholder="e.g., 1800"
                      value={editFormData.price15Days}
                      onChange={(e) => setEditFormData({ ...editFormData, price15Days: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price30Days">30+ Days (₹/day)</Label>
                    <Input
                      id="edit-price30Days"
                      type="number"
                      placeholder="e.g., 1600"
                      value={editFormData.price30Days}
                      onChange={(e) => setEditFormData({ ...editFormData, price30Days: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-kmLimit">KM Limit/Day</Label>
                    <Input
                      id="edit-kmLimit"
                      type="number"
                      value={editFormData.kmLimit}
                      onChange={(e) => setEditFormData({ ...editFormData, kmLimit: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-extraKmCharge">Extra KM Charge (₹)</Label>
                    <Input
                      id="edit-extraKmCharge"
                      type="number"
                      value={editFormData.extraKmCharge}
                      onChange={(e) => setEditFormData({ ...editFormData, extraKmCharge: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    <Select value={editFormData.fuel} onValueChange={(v) => setEditFormData({ ...editFormData, fuel: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Transmission</Label>
                    <Select value={editFormData.transmission} onValueChange={(v) => setEditFormData({ ...editFormData, transmission: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual & Automatic">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Available Locations (Edit) */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Available Locations
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_LOCATIONS.map((location) => (
                    <label
                      key={location}
                      className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={editFormLocations.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditFormLocations([...editFormLocations, location]);
                          } else {
                            setEditFormLocations(editFormLocations.filter((l) => l !== location));
                          }
                        }}
                      />
                      <span className="text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Dates (Edit) */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Availability Dates
                </h3>
                <p className="text-xs text-muted-foreground">
                  Leave empty if car is always available. Set dates to restrict availability.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-availableFrom">Available From</Label>
                    <Input
                      id="edit-availableFrom"
                      type="date"
                      value={editFormData.availableFrom}
                      onChange={(e) => setEditFormData({ ...editFormData, availableFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-availableUntil">Available Until</Label>
                    <Input
                      id="edit-availableUntil"
                      type="date"
                      value={editFormData.availableUntil}
                      onChange={(e) => setEditFormData({ ...editFormData, availableUntil: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={closeEditDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
