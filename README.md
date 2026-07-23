# RV3 — Rural Veterans Vanguard of Valor Foundation

Static website for **RV3**, the philanthropic arm of the Lighthouse rural-veterans
ecosystem in Louisiana. Sibling site to Lighthouse Rural Communities (main),
Eagle Enterprises Consortium, and Guardian Angels Enterprises.

**Brand:** patriot crimson (`#4A0E1B` / `#7A1F33` / `#A33249`) + gold `#F4B41A`
accents (text-safe gold `#9A6A00`) + slate-navy `#243B5E` support. Outfit display
font, same layout/component vocabulary as the main Lighthouse site, WCAG 2.2 AA.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — "Honoring service. Channeling support." |
| `about.html` | Mission, vision, name story, governance & stewardship |
| `programs.html` | What RV3 funds (Eagle's Nest, VAPE Network, M-TOC, scholarships, navigation, Legacy Fund) |
| `donate.html` | One-time & recurring giving, impact anchors, matching, stock/DAF/planned |
| `sponsors.html` | Sponsorship tiers + M-TOC unit naming flagship + inquiry form |
| `grants.html` | Grantmakers & institutional funders + funder form |
| `impact.html` | VI-PAR accountability + dashboard + verified stats |
| `honor.html` | Guardian Light memorial, tributes, ceremonies, Legacy Activation Fund |
| `ecosystem.html` | Four entities + how a donated dollar travels |
| `contact.html` | Contact + donor/sponsor inquiry form |

Plus: `css/styles.css`, `js/main.js`, `assets/logo-mark.svg`, `sitemap.xml`,
`robots.txt`, `vercel.json`.

## Deploy (GitHub → Vercel, same as the main repo)

1. Create a GitHub repo (e.g. `rv3-vanguard-of-valor`) and push this folder's contents
   to the repo root (`index.html` at the top level).
2. In Vercel: **Add New → Project → Import** the GitHub repo.
   Framework preset: **Other**. No build command, no output directory (static site).
3. Deploy. `vercel.json` (`"cleanUrls": true`) gives extension-less URLs
   (`/about`, `/donate`, …) matching the canonicals and sitemap.
4. Every push to `main` auto-deploys.

## Donate-link wiring (TODO before launch)

The Donate button on `donate.html` uses the placeholder pattern:

```html
<a class="btn btn-gold btn-block" href="#give-now" data-donate="rv3-main">Donate Securely</a>
```

When the Donorbox campaign (or PayPal donate link) is created, replace the `href`
with the live URL, e.g.:

```html
<a class="btn btn-gold btn-block" href="https://donorbox.org/rv3-vanguard-of-valor" data-donate="rv3-main">Donate Securely</a>
```

and remove/soften the "processing is being connected" hint text next to it.

## Forms

All forms use the shared ecosystem pattern:
`<form data-form="TYPE" data-success="…" data-fallback-email="give@rv3vanguardofvalor.org" novalidate>`
with a `.form-status` div. `js/main.js` POSTs to `/api/submit`; if the API is not
wired, it falls back to a prefilled `mailto:` so no submission is lost.
Form types on this site: `sponsor` (sponsors.html, contact.html), `funder` (grants.html).

## Placeholders & domains (mark clearly, swap when live)

- **This site's URL:** `https://www.rv3vanguardofvalor.org` — placeholder until
  the production domain is purchased. Update `canonical`/`og:url` tags on all 10 pages,
  `sitemap.xml`, and `robots.txt` when the real domain lands.
- **Sibling placeholders:** `https://www.eagleenterprisesconsortiuml3c.org` and
  `https://www.guardianangelsenterprises.org` (footer roll-call + ecosystem page)
  — swap for final domains when those launch. Lighthouse main is live:
  `https://www.lighthouseruralcommunities.org`.
- **Email `give@rv3vanguardofvalor.org` — TO BE CREATED.** Used as the form fallback
  in `js/main.js` and shown across the site. Create the mailbox (or change to an
  existing address) before launch.
- Memorial email `memorial@lighthouseruralcommunities.org` (honor.html, contact.html)
  is the address from the Guardian Light memorial plan.

## Owner to confirm

- [ ] RV3 legal status details (EIN / 501(c)(3) determination or fiscal sponsorship) —
      grants.html deliberately says these are "provided in the due-diligence packet."
      Confirm actual status before responding to funders.
- [ ] Donation platform choice (Donorbox vs PayPal) and live link (see above).
- [ ] `give@rv3vanguardofvalor.org` mailbox creation, or substitute address.
- [ ] Donation impact-anchor amounts on donate.html ($65 / $85 / $250 / $1,200 /
      $2,500 / $10,000) — labeled "representative" on-page; adjust to real program costs.
- [ ] Sponsorship tier floor amounts ($1,000 / $5,000 / $10,000 / $25,000) — labeled
      "starting frameworks"; confirm against the discovery-led sponsorship valuation.
- [ ] Guardian Angels memorial URL (currently the sibling-site placeholder root; the
      memorial currently lives as a page on the Lighthouse main site).
- [ ] Pilot metrics (312 / 184 / 4 / 8) are labeled "pilot demonstration data"
      throughout — keep the label until audited cohort data replaces them.
- [ ] Phone (504) 505-1512 is the shared ecosystem line — confirm routing for RV3.
