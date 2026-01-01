import { useState, useCallback } from "react";
import { Plus, Trash2, Car, AlertTriangle, ArrowLeft, Upload, X, ImageIcon, Loader2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  image?: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState<CarData[]>([
    { id: "1", name: "Swift", brand: "Maruti Suzuki", price: 2500, kmLimit: 300, extraKmCharge: 10, fuel: "Petrol", transmission: "Manual", category: "5-Seater" },
    { id: "2", name: "Baleno", brand: "Maruti Suzuki", price: 3000, kmLimit: 300, extraKmCharge: 10, fuel: "Petrol", transmission: "Manual & Automatic", category: "5-Seater" },
    { id: "3", name: "Thar", brand: "Mahindra", price: 6500, kmLimit: 300, extraKmCharge: 15, fuel: "Diesel", transmission: "Manual & Automatic", category: "5-Seater" },
  ]);

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

  const handleDeleteSelected = () => {
    setCars(cars.filter((car) => !selectedCars.includes(car.id)));
    setSelectedCars([]);
    toast({
      title: "Cars Deleted",
      description: `${selectedCars.length} car(s) have been removed from inventory.`,
    });
  };

  const handleDeleteAll = () => {
    setCars([]);
    setSelectedCars([]);
    toast({
      title: "Inventory Cleared",
      description: "All cars have been removed from inventory.",
      variant: "destructive",
    });
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

    const newCar: CarData = {
      id: Date.now().toString(),
      name: formData.name,
      brand: formData.brand,
      price: Number(formData.price),
      kmLimit: Number(formData.kmLimit),
      extraKmCharge: Number(formData.extraKmCharge),
      fuel: formData.fuel,
      transmission: formData.transmission,
      category: formData.category,
      image: imageUrl,
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
    });
    setImageFile(null);
    setImagePreview(null);
    setIsUploading(false);
    toast({
      title: "Car Added",
      description: `${newCar.brand} ${newCar.name} has been added to inventory.`,
    });
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
      image: imageUrl,
    };

    setCars(cars.map((car) => (car.id === editingCar.id ? updatedCar : car)));
    setIsEditUploading(false);
    closeEditDialog();
    toast({
      title: "Car Updated",
      description: `${updatedCar.brand} ${updatedCar.name} has been updated.`,
    });
  };

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
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            <span className="font-semibold">{cars.length} Vehicles</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-Seater">5-Seater Hatchbacks/SUVs</SelectItem>
                        <SelectItem value="7-Seater">7-Seater MUVs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pricing & Limits</h3>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Day (₹)</Label>
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
                      <Label htmlFor="kmLimit">KM Limit</Label>
                      <Input
                        id="kmLimit"
                        type="number"
                        value={formData.kmLimit}
                        onChange={(e) => setFormData({ ...formData, kmLimit: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extraKmCharge">Extra KM (₹)</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select value={editFormData.category} onValueChange={(v) => setEditFormData({ ...editFormData, category: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5-Seater">5-Seater Hatchbacks/SUVs</SelectItem>
                          <SelectItem value="7-Seater">7-Seater MUVs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pricing & Limits</h3>
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Price per Day (₹)</Label>
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
                        <Label htmlFor="edit-kmLimit">KM Limit</Label>
                        <Input
                          id="edit-kmLimit"
                          type="number"
                          value={editFormData.kmLimit}
                          onChange={(e) => setEditFormData({ ...editFormData, kmLimit: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-extraKmCharge">Extra KM (₹)</Label>
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

                  <Button type="submit" className="w-full mt-4" disabled={isEditUploading}>
                    {isEditUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Update Vehicle
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
