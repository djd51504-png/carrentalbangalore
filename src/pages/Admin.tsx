import { useState } from "react";
import { Plus, Trash2, Car, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

interface Car {
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
  const [cars, setCars] = useState<Car[]>([
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

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    const newCar: Car = {
      id: Date.now().toString(),
      name: formData.name,
      brand: formData.brand,
      price: Number(formData.price),
      kmLimit: Number(formData.kmLimit),
      extraKmCharge: Number(formData.extraKmCharge),
      fuel: formData.fuel,
      transmission: formData.transmission,
      category: formData.category,
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
    toast({
      title: "Car Added",
      description: `${newCar.brand} ${newCar.name} has been added to inventory.`,
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
                {/* Basic Info */}
                <div className="space-y-3">
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

                <Button type="submit" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
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
                        <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center">
                          <Car className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">{car.brand} {car.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{car.category}</span>
                            <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{car.fuel}</span>
                            <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{car.transmission}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">₹{car.price.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{car.kmLimit}km limit</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
