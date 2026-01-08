import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RazorpayOrderRequest {
  amount: number;
  customerName: string;
  customerPhone: string;
  carName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, customerName, customerPhone, carName }: RazorpayOrderRequest = await req.json();

    console.log("Creating Razorpay order for:", { amount, customerName, carName });

    // Razorpay API credentials - using the publishable key provided
    const razorpayKeyId = "rzp_live_RdfKByvlt3bKWF";
    
    // For now, we'll return the order details for client-side checkout
    // Since Razorpay requires secret key for server-side order creation
    // We'll use the standard checkout flow
    
    const orderDetails = {
      key: razorpayKeyId,
      amount: amount * 100, // Convert to paise
      currency: "INR",
      name: "Car Rental Bangalore",
      description: `Advance payment for ${carName}`,
      prefill: {
        name: customerName,
        contact: customerPhone,
      },
      notes: {
        car_name: carName,
        customer_name: customerName,
        customer_phone: customerPhone,
      },
      theme: {
        color: "#7C3AED",
      },
    };

    console.log("Order details created:", orderDetails);

    return new Response(JSON.stringify(orderDetails), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);