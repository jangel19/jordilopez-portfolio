import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    let ip = "Unknown", city = "Unknown", country_name = "Unknown";

    try {
      const clientIp = req.headers.get("x-forwarded-for") || "Unknown";
      const geoRes = await fetch(`https://ipapi.co/${clientIp}/json/`);
      if (!geoRes.ok) throw new Error("Geo API request failed");
      const geoData = await geoRes.json();
      ip = geoData.ip || "Unknown";
      city = geoData.city || "Unknown";
      country_name = geoData.country_name || "Unknown";
    } catch (geoErr) {
      console.error("Geo API error:", geoErr);
    }

    const user_agent = req.headers.get("user-agent") || "Unknown";
    const timestamp = new Date().toISOString();

    const supabase = createClient(
      Deno.env.get("SUP_URL")!,
      Deno.env.get("SUP_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("visitors").insert([{ ip_address: ip, city, country: country_name, user_agent, timestamp }]);

    if (error) {
      console.error("Supabase insert error:", JSON.stringify(error, null, 2));
      return new Response("Supabase insert failed", { status: 500 });
    }

    await fetch(Deno.env.get("DISCORD_WEBHOOK")!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `New visitor:\nIP: ${ip}\nCity: ${city}\nCountry: ${country_name}\nUA: ${user_agent}` }),
    });

    return new Response("Logged!", { status: 200 });

  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response("Server error", { status: 500 });
  }
});