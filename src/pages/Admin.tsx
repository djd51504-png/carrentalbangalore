import { useState, useCallback, useEffect } from "react";
import { Plus, Trash2, Car, AlertTriangle, ArrowLeft, Upload, X, ImageIcon, Loader2, Pencil, Lock, LogOut, Mail, ClipboardList, Phone, Calendar, Clock, CheckCircle, XCircle, MessageCircle } from "lucide-react";
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
import type { User, Session } from "@supabase/supabase-js";

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
    }
  }, [isAdmin]);

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
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [isEditDragging, setIsEditDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG, WebP)",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `cars/${fileName}`;

    const { error } = await supabase.storage
      .from("car-images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("car-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

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

    let imageUrl: string | undefined;
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Car added without image.",
          variant: "destructive",
        });
      }
    }

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
          image: imageUrl,
          price_3_days: formData.price3Days ? Number(formData.price3Days) : null,
          price_7_days: formData.price7Days ? Number(formData.price7Days) : null,
          price_15_days: formData.price15Days ? Number(formData.price15Days) : null,
          price_30_days: formData.price30Days ? Number(formData.price30Days) : null,
        })
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
      });
      setImageFile(null);
      setImagePreview(null);
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
    });
    setEditImagePreview(car.image || null);
    setEditImageFile(null);
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
    });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEditDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsEditDragging(true);
  }, []);

  const handleEditDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsEditDragging(false);
  }, []);

  const handleEditDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsEditDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG, WebP)",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const removeEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    setIsEditUploading(true);

    let imageUrl = editingCar.image;
    if (editImageFile) {
      const uploadedUrl = await uploadImage(editImageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Keeping existing image.",
          variant: "destructive",
        });
      }
    } else if (!editImagePreview) {
      imageUrl = undefined;
    }

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
          image: imageUrl,
          price_3_days: editFormData.price3Days ? Number(editFormData.price3Days) : null,
          price_7_days: editFormData.price7Days ? Number(editFormData.price7Days) : null,
          price_15_days: editFormData.price15Days ? Number(editFormData.price15Days) : null,
          price_30_days: editFormData.price30Days ? Number(editFormData.price30Days) : null,
        })
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
        image: imageUrl,
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
      setIsEditUploading(false);
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
    const message = `Hi ${enquiry.customer_name}, regarding your booking enquiry for ${enquiry.car_name} from ${formatDate(enquiry.pickup_date)} to ${formatDate(enquiry.drop_date)}. Total: ₹${enquiry.estimated_price.toLocaleString()}. Please confirm your booking with ₹1000 advance payment.`;
    window.open(`https://wa.me/91${enquiry.customer_phone}?text=${encodeURIComponent(message)}`, '_blank');
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
                      {/* Image Upload */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Photo</h3>
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-40 object-contain rounded-lg border border-border bg-muted"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                              isDragging
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Upload className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Drag & drop or click to upload
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  JPG, PNG, WebP up to 5MB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
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
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="category">Seating</Label>
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
                          <div className="space-y-2">
                            <Label htmlFor="categoryLabel">Type</Label>
                            <Select value={formData.categoryLabel} onValueChange={(v) => setFormData({ ...formData, categoryLabel: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Hatchback">Hatchback</SelectItem>
                                <SelectItem value="SUV">SUV</SelectItem>
                                <SelectItem value="MUV">MUV</SelectItem>
                                <SelectItem value="Sedan">Sedan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
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
                            <Label htmlFor="price15Days">16+ Days (₹/day)</Label>
                            <Input
                              id="price15Days"
                              type="number"
                              placeholder="e.g., 1800"
                              value={formData.price15Days}
                              onChange={(e) => setFormData({ ...formData, price15Days: e.target.value })}
                            />
                          </div>
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
                        <Card key={car.id} className={`transition-colors ${selectedCars.includes(car.id) ? "border-primary bg-primary/5" : ""}`}>
                          <CardContent className="py-4">
                            <div className="flex items-center gap-4">
                              <Checkbox
                                checked={selectedCars.includes(car.id)}
                                onCheckedChange={(checked) => handleSelectCar(car.id, checked as boolean)}
                              />
                              <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                {car.image ? (
                                  <img src={car.image} alt={car.name} className="h-full w-full object-contain" />
                                ) : (
                                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground">{car.brand} {car.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{car.category}</span>
                                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{car.fuel}</span>
                                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{car.transmission}</span>
                                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{car.categoryLabel}</span>
                                </div>
                              </div>
                              <div className="text-right mr-2">
                                <p className="text-lg font-bold text-primary">₹{car.price.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{car.kmLimit}km limit</p>
                              </div>
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
                {enquiries.map((enquiry) => (
                  <Card key={enquiry.id}>
                    <CardContent className="py-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Customer Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">{enquiry.customer_name}</h3>
                            {getStatusBadge(enquiry.status)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {enquiry.customer_phone}
                            </span>
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
                          <p className="text-sm text-muted-foreground mt-1">
                            📍 {enquiry.pickup_location}
                          </p>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <p className="text-2xl font-bold text-primary">₹{enquiry.estimated_price.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            Enquired: {formatDate(enquiry.created_at)}
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
              {/* Image Upload */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Photo</h3>
                {editImagePreview ? (
                  <div className="relative">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-full h-40 object-contain rounded-lg border border-border bg-muted"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={removeEditImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleEditDragOver}
                    onDragLeave={handleEditDragLeave}
                    onDrop={handleEditDrop}
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                      isEditDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG, WebP up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Seating</Label>
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
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={editFormData.categoryLabel} onValueChange={(v) => setEditFormData({ ...editFormData, categoryLabel: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="MUV">MUV</SelectItem>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    <Label htmlFor="edit-price15Days">16+ Days (₹/day)</Label>
                    <Input
                      id="edit-price15Days"
                      type="number"
                      placeholder="e.g., 1800"
                      value={editFormData.price15Days}
                      onChange={(e) => setEditFormData({ ...editFormData, price15Days: e.target.value })}
                    />
                  </div>
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

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={closeEditDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isEditUploading}>
                  {isEditUploading ? (
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
