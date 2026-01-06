import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    }: BookingEmailRequest = await req.json();

    console.log("Sending booking email for:", customerName, carName);

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
        subject: `New Booking Enquiry - ${carName} from ${customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🚗 New Booking Enquiry</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
              <h2 style="color: #1f2937; margin-top: 0;">Customer Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Name:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">
                    <a href="tel:${customerPhone}" style="color: #f97316;">${customerPhone}</a>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Car:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${carName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Pickup Location:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${pickupLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Pickup:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${formatDate(pickupDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Drop:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${formatDate(dropDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Duration:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${totalDays} days${totalHours > 0 ? ` + ${totalHours} hours` : ''}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #92400e; margin-top: 0; font-size: 18px;">Estimated Total</h2>
              <p style="font-size: 28px; font-weight: bold; color: #f97316; margin: 0;">₹${estimatedPrice.toLocaleString()}</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="https://wa.me/919448277091?text=Hi%20${encodeURIComponent(customerName)}%2C%20regarding%20your%20${encodeURIComponent(carName)}%20booking%20enquiry..." 
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

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
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
