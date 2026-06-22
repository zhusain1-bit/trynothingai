# nothing.ai — landing page

A production-ready, single-page marketing website for nothing.ai.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Set the environment variable (see below).
4. Click Deploy.

No other services required.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LOOPS_API_KEY` | No (but recommended for prod) | Your Loops API key from [app.loops.so/settings/api](https://app.loops.so/settings/api) |

Without `LOOPS_API_KEY`, waitlist signups are logged to the console and return success — the site works fully out of the box without any backend.

**Local setup:**
```bash
cp .env.example .env.local
# then paste your Loops key into .env.local
```

**Vercel:** add `LOOPS_API_KEY` in Project Settings → Environment Variables.

## Swapping in real images

See `public/images/README.md` for the list of placeholder slots. Drop your images there and pass the `src` prop to the relevant illustration component:

```tsx
<ShortsCard src="/images/shorts-product.jpg" brand="H&M" price="$17.99" />
```

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion v12
- Loops for email collection (optional)
