# FORC3MOD Website - Search, favicon and indexing

<!-- Split out of CLAUDE.md on 2026-10-03 to keep the auto-loaded file small.
     CLAUDE.md is read into every session; this file is read on demand.
     Content is verbatim from CLAUDE.md -- keep updating it the same way. -->

Google Search Console, the favicon, `sitemap.xml` and `robots.txt`. Mostly a
record of questions already answered, so they don't get re-investigated.

---

## Favicon and Google search results

The owner asked on 2026-09-19 why `forc3mod.com` shows a blank placeholder
icon in Google results. **Nothing was broken** — diagnosis worth keeping,
because the same question will come back:

- **The search snippet's own title dated it.** It read "FORC3MOD | FORC3
  Designer — Free Livery Maker for …", a title the homepage last carried on
  **2026-08-17**. `favicon.ico` only landed 2026-09-15. So Google's crawl
  predated the file by a month, and the icon in the result was Google's
  generic placeholder, not a broken one of ours. **Check the snippet's title
  against git history before debugging a favicon** — it tells you how old the
  crawl is for free.
- **Before 2026-09-15 there was nothing for Google to fetch at all**: the
  favicon was an inline `data:image/svg+xml` URI, and Google can't use a
  `data:` URI favicon — it needs a real crawlable URL. Don't ever go back to
  an inline one.
- Verified at the time: `/favicon.ico` returns 200 `image/vnd.microsoft.icon`,
  there is no `robots.txt` (404, so nothing blocks Googlebot), and every page
  declares `<link rel="icon" href="/favicon.ico" sizes="any" />`.
- **Google wants favicon frames that are a multiple of 48px** (48, 96,
  144…). The original 16/32/64/128/256 set contained none, so a **96** was
  added 2026-09-19 — the only generated frame in the file (see the file map
  row). The other five are still byte-identical to the artist's PNGs;
  verified by diffing them against the previous `favicon.ico` after the
  repack.
- **Timing, so nobody chases this again**: page title/snippet refreshes on
  the next normal recrawl (days to weeks; **Request Indexing** in Search
  Console makes it ~a day). The **favicon is fetched on a separate, much
  slower schedule** — weeks is normal and there's no way to force it.
  Request Indexing does not speed the icon up.

### Google Search Console — already verified, via Cloudflare DNS

`forc3mod.com`'s nameservers are Cloudflare (`dana`/`alexis.ns.cloudflare.com`)
and the domain already carries
`google-site-verification=7nJIkg9iK5RJJKji2jibQJthEBC6hGObTZz3NmgvbjM` as a
TXT record — i.e. a **Domain property already exists**. Don't add a
`google-site-verification` meta tag or `googleXXXX.html` file to this repo;
neither is needed, and their absence is NOT evidence the site is unverified
(that's the wrong conclusion to draw from grepping the repo — the DNS method
leaves no trace here). A Domain property covers the apex, `www` and every
subdomain, so `grid.forc3mod.com` is in scope too.

URL Inspection is the search bar across the top of
[Search Console](https://search.google.com/search-console) once the property
is selected — it is not in Chrome DevTools, which is where the owner looked
first.

### Sitemap and robots.txt

`sitemap.xml` (added 2026-09-19, on request) currently lists four pages:
`/`, `/forc3designer.html`, `/grid.html`, `/SupportUs.html`.

- **It is hand-maintained** — no build step generates it. Add a `<url>` when
  a new public page ships; update a `<lastmod>` when that page's *content*
  changes, not when a `?v=` bump or a CSS tweak touches the file.
- **A page is listed only while it's shown.** A noindex page in a sitemap is
  a Search Console error, so pages go in and out with the "Showing / hiding
  a product page" checklist. As of 2026-09-22 `forc3grid.html` is in (four round
  trips so far) and `gt3forc3.html` is out.
- **The redirect shims are excluded too** (`designer.html`,
  `forc3-designer-download/`). A sitemap is for URLs that answer 200 with
  their own content, not for redirects.
- **No `<changefreq>` or `<priority>`** — Google ignores both, and a wrong
  value is worse than none. Don't "improve" the file by adding them.
- **URL forms**: the homepage is listed as bare `/`; the others keep their
  `.html`, matching every internal link on the site. GitHub Pages happens to
  answer 200 on the extensionless form too (`/forc3designer` works), but
  nothing links that way, so the `.html` form is the one to list — don't mix
  both, that's two URLs for one page.
- **Registering it**: Search Console → Sitemaps → submit
  `https://www.forc3mod.com/sitemap.xml`.

`robots.txt` (added 2026-09-19, right after) exists almost entirely for its
`Sitemap:` line. It allows everything — which is exactly what the previous
404 already meant — so it changed nothing about crawling.

- ⚠️ **Never `Disallow` a page you want kept out of search.** It's the
  obvious-looking move for `forc3grid.html` and it backfires: `Disallow` blocks
  **crawling**, and a page Google can't crawl is a page whose
  `<meta name="robots" content="noindex">` Google can never read. It can
  still get indexed from an external link, just with no title or
  description — strictly worse than the current state. Allowing the crawl so
  the noindex tag *is* read is what actually keeps a page out. The same
  applies to any future hidden page. This reasoning is repeated inside
  `robots.txt` itself, because that's where someone will be standing when
  they get the idea.
- Consequence worth knowing: whenever a page is hidden with `noindex`, its
  exclusion from search rests entirely on that meta tag — the page stays
  crawlable on purpose.
