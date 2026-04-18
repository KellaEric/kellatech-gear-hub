// Virtual assistant — streams replies from Lovable AI Gateway.
// Public function (verify_jwt = false). User auth is optional and used only to
// fetch the caller's own orders when they ask about order status.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are Kella, the friendly virtual shopping assistant for KellasTech — a Ghana-based computers & accessories store serving all of Africa.

About the store:
- We sell laptops, desktops, monitors, printers, computer parts, accessories, and networking tools.
- All prices are in Ghana Cedis (GH₵).
- We also offer IT services: Software Development, IT Support, Mentoring, Hardware Repairs, and CCTV Camera Installation.
- Payment methods at checkout: Mobile Money (MTN, Vodafone, AirtelTigo) and Card.
- Shipping is currently free.
- Customers can browse the catalog at /shop, view their orders at /orders, and reach out via /contact.

How to behave:
- Be warm, concise, and helpful. Use short paragraphs and bullet points.
- When recommending products, ALWAYS pull from the "Live product catalog" provided below — never invent products, prices, or specs.
- Format prices as "GH₵ 1,234".
- When the user asks about THEIR orders, use the "Your recent orders" context if present. If they aren't logged in, politely tell them to log in at /login to see order details.
- For IT services questions, suggest they fill the contact form at /contact for a quote.
- If you don't know something, say so honestly and point to /contact.
- Keep replies under ~150 words unless the user asks for detail.
- You can include markdown links like [Shop laptops](/shop?category=Laptops) — they will be rendered as clickable links.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY =
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Build context from the database ----
    const adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Public catalog (RLS allows public read).
    const { data: products } = await adminClient
      .from("products")
      .select("name, category, price, original_price, in_stock, badge, description, specs")
      .order("category");

    const catalogText =
      products && products.length > 0
        ? products
            .map(
              (p: any) =>
                `- ${p.name} [${p.category}] — GH₵ ${Number(p.price).toLocaleString()}${
                  p.original_price ? ` (was GH₵ ${Number(p.original_price).toLocaleString()})` : ""
                } · ${p.in_stock ? "In stock" : "Out of stock"}${p.badge ? ` · ${p.badge}` : ""}\n   ${p.description?.slice(0, 140) ?? ""}`,
            )
            .join("\n")
        : "(catalog is empty)";

    // Caller's orders, if logged in.
    let ordersBlock = "";
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userOrders } = await userClient
        .from("orders")
        .select("id, status, total, created_at, items, shipping_city")
        .order("created_at", { ascending: false })
        .limit(5);

      if (userOrders && userOrders.length > 0) {
        ordersBlock =
          "\n\nYour recent orders:\n" +
          userOrders
            .map((o: any) => {
              const items = (o.items as any[]) ?? [];
              const itemList = items.map((i) => `${i.quantity}× ${i.name}`).join(", ");
              return `- #${o.id.slice(0, 8).toUpperCase()} · ${o.status.toUpperCase()} · GH₵ ${Number(
                o.total,
              ).toLocaleString()} · ${new Date(o.created_at).toLocaleDateString("en-GH")} · ${itemList}`;
            })
            .join("\n");
      } else {
        ordersBlock = "\n\nYour recent orders: (none yet)";
      }
    }

    const systemContent = `${SYSTEM_PROMPT}\n\nLive product catalog:\n${catalogText}${ordersBlock}`;

    // ---- Stream from Lovable AI ----
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [
          { role: "system", content: systemContent },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests, please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted — please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "Assistant temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("assistant-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
