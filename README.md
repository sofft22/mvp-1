# BIOSHOP MVP

Link-in-bio storefront for Nigerian sellers. Runs entirely on Cloudflare (Pages, Pages Functions, D1, R2). No build step, no framework.

**What's in it**

| Piece | Where |
|---|---|
| Landing page | `public/index.html` |
| Sign up / log in | `public/signup.html`, `public/login.html` |
| Seller dashboard (products, photos, store details, plan) | `public/dashboard.html` |
| Public store at `/store/<name>` (server-rendered, WhatsApp + bank transfer) | `functions/store/[slug].js`, `shared/render.js`, `public/store.js` |
| API (accounts, store, products, images) | `functions/api/*` |
| Plan limits (Free 5/1, Starter 30/3, Pro unlimited/5) | `shared/plans.js` |
| Admin page to switch a seller's plan after they pay | `public/admin.html` |
| Database schema | `migrations/0001_init.sql` |

## Deploy (about 10 minutes)

You need a free Cloudflare account and Node 18 or newer.

```bash
npm install
npx wrangler login

# 1. Database and image storage
npx wrangler d1 create bioshop            # copy the database_id it prints into wrangler.toml
npx wrangler r2 bucket create bioshop-images
npm run db:remote                         # creates the tables

# 2. Pages project and your admin password
npx wrangler pages project create bioshop --production-branch main
npx wrangler pages secret put ADMIN_KEY --project-name bioshop    # choose a long random password

# 3. Fill in BIOSHOP's own bank details and WhatsApp number
#    edit public/config.js, then:
npm run deploy
```

Your site will be at `https://bioshop.pages.dev` (or a similar name if that one is taken).
Update the store link text in `public/index.html` and `public/dashboard.html` if your domain differs. Both read it from `location.host`, so nothing needs changing in code.

## Run it locally

```bash
npm install
echo "ADMIN_KEY=dev-key" > .dev.vars
npm run db:local
npm run dev            # http://localhost:8788
```

## How upgrades work (no payment gateway)

1. A seller opens the **Plan** tab and sees BIOSHOP's bank details from `public/config.js`.
2. They pay, then message you on WhatsApp (the button pre-fills their email and plan).
3. You open `/admin`, enter your `ADMIN_KEY`, and set their plan for 1 or more months.
4. When a plan expires, the store drops back to Free limits automatically. Extra products stay saved but are hidden until the seller renews.

**Launch offer (50% off the first month, first 20 sellers):** the page promises it, and you give it by hand. Charge ₦2,500 (Starter) or ₦5,000 (Pro) for that first month, then set the plan for 1 month in `/admin`.

## Tests

```bash
npm test          # unit tests plus 23 end-to-end API tests (needs Node 22.5+)
npm run check     # syntax-checks every script, including the ones inside the HTML pages
```

The end-to-end tests run the real API code against an in-memory SQLite database that stands in for D1.

## Security notes

- Passwords are hashed with PBKDF2-SHA256 (100,000 iterations, the Workers maximum) and a random salt.
- Sessions are random 256-bit tokens stored hashed; cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` on https.
- Cross-site writes to `/api/*` are blocked by `functions/_middleware.js`.
- Login (8 tries per 15 min per email and IP) and sign-up (10 per hour per IP) are rate limited.
- All seller text is escaped before it is put on a page.
- Uploaded files are checked by their real file signature (JPG, PNG, WebP only) and capped at 2 MB. The dashboard shrinks photos to about 1000 px before uploading, which keeps stores fast on mobile data.

## Not in this MVP yet

- **Password reset and email verification.** Both need an email service (Resend, Mailgun and similar). Until then, reset passwords by hand if a seller gets locked out.
- **Automatic payments for plans.** Paystack or Flutterwave subscriptions are the next step once you have paying sellers.
- **Orders, stock counts, analytics.** Sellers mark items Sold out by hand.
- **Custom domains, drag-to-reorder products, categories.**
