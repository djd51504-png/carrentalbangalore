import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AvailabilityNotificationRequest {
  customerName: string;
  customerPhone: string;
  pickupDate: string;
  dropDate: string;
  pickupLocation: string;
  totalDays: number;
  totalHours: number;
  transmission: string;
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
      pickupDate,
      dropDate,
      pickupLocation,
      totalDays,
      totalHours,
      transmission,
    }: AvailabilityNotificationRequest = await req.json();

    console.log("Sending availability notification for:", customerName, customerPhone);

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

    // Send email notification to admin using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Car Rental Bangalore <onboarding@resend.dev>",
        to: ["selfdrivecars2500@gmail.com"],
        subject: `🔍 New Availability Check - ${customerName} (${customerPhone})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🔍 New Availability Check</h1>
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
                    <a href="tel:${customerPhone}" style="color: #3b82f6;">${customerPhone}</a>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #1f2937; margin-top: 0;">Rental Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Pickup:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${formatDate(pickupDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Drop:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${formatDate(dropDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Location:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${pickupLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Duration:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${totalDays} days${totalHours > 0 ? ` + ${totalHours} hours` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Transmission:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${transmission}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #dbeafe; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                ℹ️ This customer is currently browsing available cars on your website.
              </p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="https://api.whatsapp.com/send?phone=91${customerPhone}&text=${encodeURIComponent(`Hi ${customerName}, I saw you're looking for a car rental. How can I help you?`)}" 
                 style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                📱 Contact on WhatsApp
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
              This notification was sent from Car Rental Bangalore website.
            </p>
          </div>
        `,
      }),
    });

    const emailData = await emailResponse.json();
    console.log("Email notification sent:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-availability-notification function:", error);
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
