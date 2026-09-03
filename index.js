const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","\'":"&#39;"}[c]));
const escAttr = esc;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ReviewBooster — More Genuine Reviews</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#101828;background:#f8fafc}
.wrap{max-width:1050px;margin:auto;padding:24px}.nav{display:flex;justify-content:space-between;align-items:center;padding:12px 0}
.logo{font-size:22px;font-weight:800}.logo span{color:#2563eb}
.hero{text-align:center;background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:70px 25px;margin-top:20px}
.badge{display:inline-block;padding:8px 12px;border-radius:999px;background:#eef4ff;color:#2457a6;font-weight:700;font-size:13px}
h1{font-size:clamp(40px,6vw,68px);line-height:1.02;letter-spacing:-2px;max-width:820px;margin:20px auto}
p{color:#667085;line-height:1.6}.hero p{max-width:680px;margin:0 auto 28px;font-size:18px}
.btn{display:inline-block;text-decoration:none;background:#2563eb;color:#fff;padding:15px 23px;border-radius:12px;font-weight:800}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:22px}.card{background:#fff;border:1px solid #e5e7eb;border-radius:17px;padding:24px}
.price{font-size:38px;font-weight:900;color:#101828}.small{font-size:13px;color:#98a2b3}
footer{text-align:center;padding:30px;color:#98a2b3}
@media(max-width:700px){.grid{grid-template-columns:1fr}h1{letter-spacing:-1px}}
</style>
</head>
<body>
<div class="wrap">
<div class="nav"><div class="logo">Review<span>Booster</span></div><a href="#pricing" style="color:#101828;text-decoration:none;font-weight:700">Pricing</a></div>
<section class="hero">
<div class="badge">Real customers · Simple automation</div>
<h1>Get More Genuine Google Reviews Automatically</h1>
<p>After a purchase, make it easy for your real customers to leave feedback. ReviewBooster handles the request and one follow-up.</p>
<a class="btn" href="#pricing">Start Free Trial</a>
<p class="small">No fake reviews. No buying reviews. No rating manipulation.</p>
</section>
<div class="grid">
<div class="card"><h3>📩 Automatic Requests</h3><p>Trigger a review request after a customer purchase.</p></div>
<div class="card"><h3>🔔 One Reminder</h3><p>Follow up once when the customer has not clicked.</p></div>
<div class="card"><h3>📊 Simple Tracking</h3><p>Track requests, clicks and reminders from one place.</p></div>
</div>
<section id="pricing" class="card" style="margin-top:22px;text-align:center">
<h2>Simple pricing</h2>
<div class="grid">
<div class="card"><h3>Starter</h3><div class="price">$29<span class="small">/mo</span></div><p>1 business · 300 requests</p><a class="btn" href="/onboarding">Start</a></div>
<div class="card"><h3>Pro</h3><div class="price">$49<span class="small">/mo</span></div><p>3 businesses · 1,000 requests</p><a class="btn" href="/onboarding">Start</a></div>
<div class="card"><h3>Done-For-You</h3><div class="price">Custom</div><p>We handle setup and customer outreach using genuine customers.</p><a class="btn" href="/onboarding?dfy=1">Request</a></div>
</div>
</section>
</div>
<footer>© 2026 ReviewBooster</footer>
</body>
</html>`;

const onboarding = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>ReviewBooster Setup</title>
<style>body{font-family:Arial;background:#f8fafc;margin:0}.box{max-width:600px;margin:50px auto;background:#fff;padding:30px;border-radius:20px}input,select{width:100%;padding:13px;margin:7px 0 17px;border:1px solid #ddd;border-radius:10px}button{width:100%;padding:14px;background:#2563eb;color:#fff;border:0;border-radius:10px;font-weight:800}</style></head>
<body><div class="box"><h1>Set up your business</h1><p>أدخل بيانات متجرك ورابط Google Reviews. بعدها ننتقل لربط العملاء والإرسال التلقائي.</p>
<form id="f"><label>Business name</label><input id="name" required><label>Shop domain</label><input id="shop" placeholder="store.myshopify.com" required><label>Google review link</label><input id="review" type="url" required><label>Plan</label><select id="plan"><option>starter</option><option>pro</option><option>done-for-you</option></select><button>Create setup</button></form><p id="msg"></p></div>
<script>document.getElementById('f').onsubmit=async e=>{e.preventDefault();const b={name:name.value,shop_domain:shop.value,review_url:review.value,plan:plan.value};const r=await fetch('/api/businesses',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});const d=await r.json();msg.textContent=r.ok?'Created. Business ID: '+d.id:('Error: '+(d.error||'failed'));}</script>
</body></html>`;

const json = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers: {"content-type":"application/json"}
});

async function dbReady(env) {
  return !!env.DB;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") return new Response(html, {headers:{"content-type":"text/html;charset=UTF-8"}});
    if (request.method === "GET" && url.pathname === "/onboarding") return new Response(onboarding, {headers:{"content-type":"text/html;charset=UTF-8"}});
    if (request.method === "GET" && url.pathname === "/dashboard") {
      if (!env.DB) return new Response("Database not connected",{status:503});
      const businesses = await env.DB.prepare("SELECT id,name,shop_domain,review_url,plan,created_at FROM businesses ORDER BY created_at DESC LIMIT 50").all();
      const rows=(businesses.results||[]).map(b=>`<tr><td>${esc(b.name)}</td><td>${esc(b.plan)}</td><td><a href="${escAttr(b.review_url)}" target="_blank">Google Reviews</a></td><td>${esc(b.created_at||"")}</td></tr>`).join("");
      return new Response(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>ReviewBooster Dashboard</title><style>body{font-family:Arial;margin:0;background:#f8fafc;color:#101828}.wrap{max-width:1000px;margin:40px auto;padding:20px}.card{background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:24px}table{width:100%;border-collapse:collapse}th,td{padding:12px;border-bottom:1px solid #eee;text-align:left}a{color:#2563eb}</style></head><body><div class="wrap"><div class="card"><h1>ReviewBooster Dashboard</h1><p>Businesses registered: ${(businesses.results||[]).length}</p><table><thead><tr><th>Business</th><th>Plan</th><th>Review link</th><th>Created</th></tr></thead><tbody>${rows||'<tr><td colspan="4">No businesses yet.</td></tr>'}</tbody></table></div></div></body></html>`,{headers:{"content-type":"text/html;charset=UTF-8"}});
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ok:true, service:"ReviewBooster", database:await dbReady(env) ? "connected" : "not_connected"});
    }

    if (request.method === "POST" && url.pathname === "/api/businesses") {
      if (!env.DB) return json({error:"Database is not connected yet. Create/bind D1 first."},503);
      const b = await request.json();
      if (!b.name || !b.shop_domain || !b.review_url) return json({error:"name, shop_domain and review_url are required"},400);
      const id = crypto.randomUUID();
      await env.DB.prepare("INSERT INTO businesses(id,name,shop_domain,review_url,plan,done_for_you) VALUES(?,?,?,?,?,?)")
        .bind(id,b.name,b.shop_domain,b.review_url,b.plan||"starter",b.plan==="done-for-you"?1:0).run();
      return json({ok:true,id});
    }

    if (request.method === "POST" && url.pathname === "/api/customers") {
      if (!env.DB) return json({error:"Database is not connected yet."},503);
      const c = await request.json();
      if (!c.business_id || (!c.phone && !c.email)) return json({error:"business_id and phone or email are required"},400);
      const id=crypto.randomUUID();
      await env.DB.prepare("INSERT INTO customers(id,business_id,external_id,name,email,phone) VALUES(?,?,?,?,?,?)")
        .bind(id,c.business_id,c.external_id||null,c.name||null,c.email||null,c.phone||null).run();
      return json({ok:true,id});
    }

    if (request.method === "POST" && url.pathname === "/api/review-requests") {
      if (!env.DB) return json({error:"Database is not connected yet."},503);
      const r = await request.json();
      if (!r.business_id || !r.customer_id) return json({error:"business_id and customer_id are required"},400);
      const id=crypto.randomUUID();
      const scheduledAt=r.scheduled_at || new Date().toISOString();
      await env.DB.prepare("INSERT INTO review_requests(id,business_id,customer_id,order_id,status,scheduled_at) VALUES(?,?,?,?,?,?)")
        .bind(id,r.business_id,r.customer_id,r.order_id||null,"scheduled",scheduledAt).run();
      return json({ok:true,id,status:"scheduled"});
    }

    if (request.method === "GET" && url.pathname === "/api/stats") {
      if (!env.DB) return json({error:"Database is not connected yet."},503);
      const row = await env.DB.prepare(`
        SELECT COUNT(*) total_requests,
        SUM(CASE WHEN status='sent' THEN 1 ELSE 0 END) sent,
        SUM(CASE WHEN clicked_at IS NOT NULL THEN 1 ELSE 0 END) clicks,
        SUM(CASE WHEN reminder_sent_at IS NOT NULL THEN 1 ELSE 0 END) reminders
        FROM review_requests`).first();
      return json(row || {});
    }

    if (request.method === "GET" && url.pathname === "/r") {
      if (!env.DB) return new Response("Database not connected",{status:503});
      const id=url.searchParams.get("id");
      const row=await env.DB.prepare(`
        SELECT rr.id,b.review_url FROM review_requests rr
        JOIN businesses b ON b.id=rr.business_id WHERE rr.id=?`).bind(id).first();
      if(!row) return new Response("Not found",{status:404});
      await env.DB.prepare("UPDATE review_requests SET clicked_at=?,status='clicked' WHERE id=?")
        .bind(new Date().toISOString(),id).run();
      return Response.redirect(row.review_url,302);
    }

    return json({error:"Not found"},404);
  },

  async scheduled(event, env, ctx) {
    if (!env.DB) return;
    ctx.waitUntil(runAutomation(env));
  }
};

async function runAutomation(env) {
  const now=new Date().toISOString();
  const due=await env.DB.prepare(`
    SELECT id FROM review_requests
    WHERE status='scheduled' AND scheduled_at<=? LIMIT 100`).bind(now).all();
  for(const r of due.results||[]){
    // Next integration: connect approved email/SMS provider here.
    await env.DB.prepare("UPDATE review_requests SET status='sent',sent_at=? WHERE id=?")
      .bind(now,r.id).run();
  }
}