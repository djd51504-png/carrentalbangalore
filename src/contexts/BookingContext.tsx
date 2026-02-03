import { createContext, useContext, useState, ReactNode } from "react";

export interface BookingData {
  // Step 1: Customer & Dates
  customerName: string;
  customerPhone: string;
  pickupDate: string;
  pickupTime: string;
  dropDate: string;
  dropTime: string;
  pickupLocation: string;
  
  // Car Selection
  carId: string;
  carName: string;
  carBrand: string;
  carImage: string;
  
  // Calculated values
  totalDays: number;
  extraHours: number;
  basePrice: number;
  
  // Step 3: Security Deposit
  depositType: "cash" | "bike" | null;
  depositAmount: number;
  
  // Final
  totalAmount: number;
  bookingId: string | null;
}

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
}

const initialBookingData: BookingData = {
  customerName: "",
  customerPhone: "",
  pickupDate: "",
  pickupTime: "10:00",
  dropDate: "",
  dropTime: "10:00",
  pickupLocation: "",
  carId: "",
  carName: "",
  carBrand: "",
  carImage: "",
  totalDays: 0,
  extraHours: 0,
  basePrice: 0,
  depositType: null,
  depositAmount: 0,
  totalAmount: 0,
  bookingId: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingData(initialBookingData);
    setTermsAccepted(false);
  };

  return (
    <BookingContext.Provider value={{ 
      bookingData, 
      updateBookingData, 
      resetBooking, 
      termsAccepted, 
      setTermsAccepted 
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
