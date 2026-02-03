import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, User, Phone, ArrowRight, AlertCircle } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";

const locations = [
  "Hebbal", "Thanisandra", "KR Puram", "Bellandur", 
  "Hongasandra", "Kengeri", "Nagarabhavi", "Kadugodi"
];

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingModal = ({ open, onOpenChange }: BookingModalProps) => {
  const navigate = useNavigate();
  const { updateBookingData } = useBooking();
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    pickupDate: "",
    pickupTime: "10:00",
    dropDate: "",
    dropTime: "10:00",
    pickupLocation: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const calculation = useMemo(() => {
    if (!formData.pickupDate || !formData.dropDate) {
      return null;
    }

    const pickup = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const drop = new Date(`${formData.dropDate}T${formData.dropTime}`);
    const diffMs = drop.getTime() - pickup.getTime();
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (totalHours < 48) {
      return { error: "Minimum rental period is 2 days (48 hours)." };
    }

    const fullDays = Math.floor(totalHours / 24);
    const extraHours = totalHours % 24;

    return { fullDays, extraHours, totalHours };
  }, [formData.pickupDate, formData.pickupTime, formData.dropDate, formData.dropTime]);

  const handleProceed = () => {
    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      return;
    }
    if (formData.customerPhone.length < 10) {
      return;
    }
    if (!calculation || calculation.error) {
      return;
    }

    // Save data to context
    updateBookingData({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      dropDate: formData.dropDate,
      dropTime: formData.dropTime,
      pickupLocation: formData.pickupLocation,
      totalDays: calculation.fullDays,
      extraHours: calculation.extraHours,
    });

    onOpenChange(false);
    navigate("/booking/terms");
  };

  const isFormValid = 
    formData.customerName.trim() && 
    formData.customerPhone.length >= 10 && 
    calculation && 
    !calculation.error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-charcoal border-primary-foreground/20 text-primary-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading bg-gradient-to-r from-primary via-purple to-pink bg-clip-text text-transparent">
            Check Availability
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-primary" />
                Full Name *
              </Label>
              <Input
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter your name"
                className="bg-primary-foreground/10 border-primary-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                Mobile Number *
              </Label>
              <Input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) 
                }))}
                placeholder="10-digit number"
                className="bg-primary-foreground/10 border-primary-foreground/20"
              />
            </div>
          </div>

          {/* Pickup Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                Pick-up Date *
              </Label>
              <Input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => setFormData(prev => ({ ...prev, pickupDate: e.target.value }))}
                min={today}
                className="bg-primary-foreground/10 border-primary-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                Pick-up Time *
              </Label>
              <Input
                type="time"
                value={formData.pickupTime}
                onChange={(e) => setFormData(prev => ({ ...prev, pickupTime: e.target.value }))}
                className="bg-primary-foreground/10 border-primary-foreground/20"
              />
            </div>
          </div>

          {/* Drop Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gold" />
                Drop-off Date *
              </Label>
              <Input
                type="date"
                value={formData.dropDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dropDate: e.target.value }))}
                min={formData.pickupDate || today}
                className="bg-primary-foreground/10 border-primary-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gold" />
                Drop-off Time *
              </Label>
              <Input
                type="time"
                value={formData.dropTime}
                onChange={(e) => setFormData(prev => ({ ...prev, dropTime: e.target.value }))}
                className="bg-primary-foreground/10 border-primary-foreground/20"
              />
            </div>
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-whatsapp" />
              Pick-up Location (Optional)
            </Label>
            <Select 
              value={formData.pickupLocation} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, pickupLocation: val }))}
            >
              <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error/Duration Display */}
          {calculation?.error && (
            <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 rounded-lg p-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{calculation.error}</span>
            </div>
          )}

          {calculation && !calculation.error && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
              <span className="text-primary-foreground/70 text-sm">Duration: </span>
              <span className="text-primary font-semibold">
                {calculation.fullDays} days {calculation.extraHours > 0 ? `+ ${calculation.extraHours} hours` : ""}
              </span>
            </div>
          )}

          {/* Proceed Button */}
          <Button
            onClick={handleProceed}
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-primary via-purple to-pink text-primary-foreground py-6 text-lg font-bold shadow-button hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Terms
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
