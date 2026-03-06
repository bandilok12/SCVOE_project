import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  newStatus: string;
  trackingNumber?: string;
}

const getStatusMessage = (status: string): { subject: string; message: string } => {
  switch (status) {
    case 'confirmed':
      return {
        subject: 'Order Confirmed - AgriHub',
        message: 'Your order has been confirmed and is being prepared for processing.'
      };
    case 'processing':
      return {
        subject: 'Order Processing - AgriHub',
        message: 'Your order is now being processed and will be packed soon.'
      };
    case 'packed':
      return {
        subject: 'Order Packed - AgriHub',
        message: 'Your order has been packed and is ready for shipping.'
      };
    case 'shipped':
      return {
        subject: 'Order Shipped - AgriHub',
        message: 'Great news! Your order has been shipped and is on its way to you.'
      };
    case 'delivered':
      return {
        subject: 'Order Delivered - AgriHub',
        message: 'Your order has been delivered. Thank you for shopping with AgriHub!'
      };
    case 'cancelled':
      return {
        subject: 'Order Cancelled - AgriHub',
        message: 'Your order has been cancelled. If you have any questions, please contact us.'
      };
    default:
      return {
        subject: 'Order Update - AgriHub',
        message: `Your order status has been updated to: ${status}`
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received order notification request");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { orderId, newStatus, trackingNumber }: OrderNotificationRequest = await req.json();
    
    console.log(`Processing notification for order ${orderId}, status: ${newStatus}`);

    // Fetch order details with user email
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, profiles!orders_user_id_fkey(email, full_name)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error("Error fetching order:", orderError);
      
      // Try fetching order and profile separately
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (orderErr || !orderData) {
        throw new Error(`Order not found: ${orderId}`);
      }

      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', orderData.user_id)
        .single();

      if (profileErr || !profile) {
        console.error("Error fetching profile:", profileErr);
        throw new Error(`Profile not found for user: ${orderData.user_id}`);
      }

      const { subject, message } = getStatusMessage(newStatus);
      const shippingAddress = orderData.shipping_address as { fullName?: string };
      const customerName = profile.full_name || shippingAddress?.fullName || 'Valued Customer';

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .order-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .status-badge { display: inline-block; background: #22c55e; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; text-transform: capitalize; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .tracking { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌾 AgriHub</h1>
              <p>Fresh from Farm to Your Door</p>
            </div>
            <div class="content">
              <h2>Hello ${customerName}!</h2>
              <p>${message}</p>
              
              <div class="order-info">
                <p><strong>Order ID:</strong> #${orderId.slice(0, 8).toUpperCase()}</p>
                <p><strong>Status:</strong> <span class="status-badge">${newStatus}</span></p>
                <p><strong>Total:</strong> ₹${Number(orderData.total_amount).toLocaleString()}</p>
              </div>

              ${trackingNumber ? `
              <div class="tracking">
                <p><strong>📦 Tracking Number:</strong> ${trackingNumber}</p>
                <p>Use this number to track your shipment.</p>
              </div>
              ` : ''}

              <p>If you have any questions about your order, please don't hesitate to contact us.</p>
              
              <p>Thank you for choosing AgriHub!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} AgriHub. All rights reserved.</p>
              <p>Fresh agricultural products delivered to your doorstep.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      console.log(`Sending email to: ${profile.email}`);

      const emailResponse = await resend.emails.send({
        from: "AgriHub <onboarding@resend.dev>",
        to: [profile.email],
        subject: subject,
        html: emailHtml,
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, emailResponse }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const profile = order.profiles;
    const { subject, message } = getStatusMessage(newStatus);
    const shippingAddress = order.shipping_address as { fullName?: string };
    const customerName = profile?.full_name || shippingAddress?.fullName || 'Valued Customer';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .order-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .status-badge { display: inline-block; background: #22c55e; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; text-transform: capitalize; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          .tracking { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 AgriHub</h1>
            <p>Fresh from Farm to Your Door</p>
          </div>
          <div class="content">
            <h2>Hello ${customerName}!</h2>
            <p>${message}</p>
            
            <div class="order-info">
              <p><strong>Order ID:</strong> #${orderId.slice(0, 8).toUpperCase()}</p>
              <p><strong>Status:</strong> <span class="status-badge">${newStatus}</span></p>
              <p><strong>Total:</strong> ₹${Number(order.total_amount).toLocaleString()}</p>
            </div>

            ${trackingNumber ? `
            <div class="tracking">
              <p><strong>📦 Tracking Number:</strong> ${trackingNumber}</p>
              <p>Use this number to track your shipment.</p>
            </div>
            ` : ''}

            <p>If you have any questions about your order, please don't hesitate to contact us.</p>
            
            <p>Thank you for choosing AgriHub!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} AgriHub. All rights reserved.</p>
            <p>Fresh agricultural products delivered to your doorstep.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`Sending email to: ${profile?.email}`);

    const emailResponse = await resend.emails.send({
      from: "AgriHub <onboarding@resend.dev>",
      to: [profile?.email || ''],
      subject: subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
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
