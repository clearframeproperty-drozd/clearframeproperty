/**
 * ClearFrame — Telegram notification proxy (Cloudflare Worker).
 *
 * Keeps TELEGRAM_BOT_TOKEN off the public site. The browser posts form data
 * here (no secret involved); this Worker builds the message and calls the
 * Telegram Bot API server-side, using the token/chat id from Worker secrets.
 *
 * Deploy: Cloudflare dashboard → Workers & Pages → Create Worker → paste this
 * file → Settings → Variables and Secrets → add TELEGRAM_BOT_TOKEN and
 * TELEGRAM_CHAT_ID as *secrets* (not plain text vars) → Deploy.
 *
 * Then put the Worker's *.workers.dev URL into config.js as TELEGRAM_PROXY_URL.
 */

// Only these origins are allowed to call this Worker. Add your custom domain
// here once you connect one (e.g. "https://clearframerecords.com").
const ALLOWED_ORIGINS = [
  "https://clearframeproperty-drozd.github.io",
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders(origin) });
    }

    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ ok: false, error: "Origin not allowed" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    let data, formName;
    try {
      const body = await request.json();
      data = body.data || {};
      formName = body.formName || "form";
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const lines = Object.entries(data)
      .filter(([k]) => k !== "company_website")
      .map(([k, v]) => `${k}: ${v || "-"}`)
      .join("\n");
    const text = `New request (${formName})\n${lines}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
    });

    if (!tgRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: "Telegram send failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  },
};
