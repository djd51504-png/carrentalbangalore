import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  customerName: string;
  customerPhone: string;
  carName: string;
  pickupDate: string;
  dropDate: string;
  pickupLocation: string;
  totalDays: number;
  totalHours: number;
  estimatedPrice: number;
}

function sanitize(str: string, maxLen = 200): string {
  return String(str || "").replace(/[<>&"']/g, "").trim().slice(0, maxLen);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      carName,
      pickupDate,
      dropDate,
      pickupLocation,
      totalDays,
      totalHours,
      estimatedPrice,
    } = body as BookingEmailRequest;

    // Input validation
    const name = sanitize(customerName, 100);
    const phone = sanitize(customerPhone, 15);
    const car = sanitize(carName, 100);
    const location = sanitize(pickupLocation, 100);

    if (!name || name.length < 2) {
      return new Response(JSON.stringify({ error: "Invalid customer name" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!car) {
      return new Response(JSON.stringify({ error: "Invalid car name" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const days = Number(totalDays);
    const hours = Number(totalHours);
    const price = Number(estimatedPrice);
    if (!Number.isFinite(days) || days < 2 || !Number.isFinite(price) || price <= 0) {
      return new Response(JSON.stringify({ error: "Invalid booking data" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Rate limiting: max 5 emails per phone per hour
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count } = await supabaseClient
      .from("booking_enquiries")
      .select("*", { count: "exact", head: true })
      .eq("customer_phone", phone)
      .gte("created_at", oneHourAgo);

    if (count !== null && count > 5) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending booking email for:", name, car);

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString('en-IN', { 
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    };

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Car Rental Bangalore <onboarding@resend.dev>",
        to: ["vikas@carrentalbanglore.site"],
        subject: `New Booking Enquiry - ${car} from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🚗 New Booking Enquiry</h1>
            </div>
            <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
              <h2 style="color: #1f2937; margin-top: 0;">Customer Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280;">Name:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold;"><a href="tel:${phone}" style="color: #f97316;">${phone}</a></td></tr>
              </table>
            </div>
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280;">Car:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${car}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Pickup Location:</td><td style="padding: 8px 0; color: #1f2937;">${location}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Pickup:</td><td style="padding: 8px 0; color: #1f2937;">${formatDate(pickupDate)}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Drop:</td><td style="padding: 8px 0; color: #1f2937;">${formatDate(dropDate)}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Duration:</td><td style="padding: 8px 0; color: #1f2937;">${days} days${hours > 0 ? ` + ${hours} hours` : ''}</td></tr>
              </table>
            </div>
            <div style="background: #fef3c7; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #92400e; margin-top: 0; font-size: 18px;">Estimated Total</h2>
              <p style="font-size: 28px; font-weight: bold; color: #f97316; margin: 0;">₹${price.toLocaleString()}</p>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <a href="https://wa.me/919448277091?text=Hi%20${encodeURIComponent(name)}%2C%20regarding%20your%20${encodeURIComponent(car)}%20booking%20enquiry..." 
                 style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                📱 Reply on WhatsApp
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
              This enquiry was submitted via Car Rental Bangalore website.
            </p>
          </div>
        `,
      }),
    });

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
