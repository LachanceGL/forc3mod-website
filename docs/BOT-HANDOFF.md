# Bot handoff — from the `forc3mod-website` conversation

Findings/requests raised while working on **forc3mod.com** that belong to the
**`forc3-discordbot`** repo. Written here rather than edited into that repo
directly, per the handoff workflow — paste the relevant section's *content*
into the bot conversation (a relative path won't resolve from that repo's
working directory).

---

## 2026-08-18 — Contact form should post into Discord channel `1534649367573827879`

### What the owner asked for

The contact form on forc3mod.com should stop opening a `mailto:` link and
instead have the message written into Discord channel
**`1534649367573827879`**. The owner wants this **tracked in the bot repo**.

### What's already done (website side, shipped)

`js/main.js` on forc3mod.com now POSTs JSON to an HTTP endpoint instead of
building a `mailto:` URL:

```
POST <endpoint>
Content-Type: application/json

{ "name": "...", "email": "...", "type": "...", "message": "..." }
```

- Expects `2xx` on success; any non-OK or network error makes the site fall
  back to the old `mailto:` hand-off, so messages are never silently lost.
- The endpoint it currently targets is
  `https://raspy-salad-d894.contact-eb9.workers.dev/contact`, which **does
  not exist yet** (verified: returns 404). So today every submission takes
  the email fallback.
- Nothing on the website needs to change once a real endpoint answers — it
  will just start getting 200s.

### ⚠️ The bot cannot be the HTTP receiver — please read before implementing

I checked `forc3-discordbot/index.js` and `package.json`: there is **no HTTP
server**. No `express`, no `http.createServer`, no `.listen(` anywhere.
Dependencies are `discord.js`, `dotenv`, `node-cron`, `puppeteer` only, and
the process runs locally (`run-bot.ps1`, `bot.lock`, `nightly-restart.ps1`).

That means:

- The bot has **no public URL**, so a visitor's browser cannot POST to it.
- Even if one were added, the machine would need to be publicly reachable and
  stay up — and the bot is restarted nightly, so submissions during a restart
  would be dropped.

So a **public entry point is required regardless**, and the natural one is
the existing Cloudflare Worker (`gt3forc3-website/workers.js`): it is already
public, already CORS-enabled, and already holds `DISCORD_BOT_TOKEN` as a
secret. It already does exactly this pattern for `/discord/verify-request`.

A Discord **webhook URL** was deliberately rejected: forc3mod-website is a
public repo, so the URL would be world-readable (channel spam), and GitHub's
secret scanning gets Discord webhooks auto-revoked.

### Recommended: implement in the Worker (no bot code needed)

Add to `workers.js`, above the `/discord/stats` block:

```javascript
if (url.pathname === "/contact" && request.method === "POST") {
  const CONTACT_CHANNEL_ID = "1534649367573827879";
  let body;
  try { body = await request.json(); } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
  const clean = (v, n) => String(v || "").trim().slice(0, n);
  const name = clean(body.name, 100), email = clean(body.email, 150);
  const type = clean(body.type, 60), message = clean(body.message, 1500);
  if (!name || !email || !type || !message) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${CONTACT_CHANNEL_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [{
          title: `New contact message — ${type}`,
          description: message,
          color: 0x2f6fff,
          fields: [
            { name: "Name", value: name, inline: true },
            { name: "Email", value: email, inline: true }
          ],
          timestamp: new Date().toISOString()
        }]
      })
    });
    if (!res.ok) throw new Error("Discord returned " + res.status);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to deliver message" }), {
      status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
}
```

Two non-obvious details:

- The message goes in the embed **`description`** (4096 char cap), not a
  `field` (1024 cap) — a long message in a field makes Discord return 400.
- **`allowed_mentions: { parse: [] }`** is required: without it someone can
  type `@everyone` into a public form and have the bot fire it.

The bot account also needs **Send Messages** permission on
`1534649367573827879`. Worth confirming from the bot side, since that repo
owns the bot's permissions/config.

Remember `workers.js` is deployed **by hand via the Cloudflare dashboard** —
committing it to `gt3forc3-website` does not ship it.

### If the bot really should own the posting

Only meaningful reason would be to reuse bot-side formatting/logging. It
would need a queue, because the bot can't be reached directly:

1. Worker accepts `POST /contact`, validates, and pushes the payload into
   Workers KV (or a Durable Object) instead of calling Discord.
2. Bot polls that queue on a `node-cron` tick, posts each message to
   `1534649367573827879`, and marks it consumed.

Trade-offs to weigh from the bot side: adds a KV dependency and polling
latency, and messages queue up (rather than post) across the nightly
restart. The Worker-direct version above has none of those and needs no bot
changes — recommend that unless there's a bot-side reason not to.

### Decision needed

Which route do you want — Worker posts directly (recommended, no bot
changes), or Worker queues and the bot drains it? Nothing more is needed
from the website either way.
