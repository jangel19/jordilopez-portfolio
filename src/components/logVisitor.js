import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

async function logVisitor() {
   try{
    if (sessionStorage.getItem("visited")) return;
    sessionStorage.setItem("visited", "true");
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    const ip_address = data.ip;
    const city = data.city;
    const country = data.country_name;
    const user_agent = navigator.userAgent;
    const timestamp = new Date().toISOString();
    await supabase
        .from('visitors')
        .insert([
        {
            ip_address,
            city,
            user_agent,
            country,
            timestamp
        },
    ]);
    await fetch(import.meta.env.VITE_DISCORD_WEBHOOK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: `New visitor logged:\nIP: ${ip_address}\nCity: ${city}\nCountry: ${country}\nUser Agent: ${user_agent}`,
        }),
    });
} catch (error) {
    console.error("Error logging visitor:", error);
}
    }
window.addEventListener('load', logVisitor);
export default logVisitor;