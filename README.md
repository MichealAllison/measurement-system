# Measurement Book

A small tool for recording client measurements - either she types them in during
a fitting, or she sends a client a link and they fill in their own from home.
Both paths write to the same database, so it always shows up on her dashboard.

Stack: Next.js (App Router) + Tailwind CSS + Prisma + Neon Postgres.

## 1. Create a free Neon database

1. Go to https://neon.tech and sign up (free tier is enough for this).
2. Create a new project.
3. On the project dashboard, click **Connect** and copy:
   - The **pooled connection string** - this is `DATABASE_URL`
   - The **direct connection string** - this is `DIRECT_URL`
     (Neon shows both - direct is used only for running migrations.)

## 2. Configure the project

```bash
cp .env.example .env
```

Paste your two Neon connection strings into `.env`.

## 3. Install and set up the database

```bash
npm install
npx prisma db push
```

`db push` creates the tables (Client, Measurement, LinkCode) in your Neon database
from `prisma/schema.prisma`.

Measurements keep the common body fields as columns for quick reporting and also
support additional labeled fields from the form. Extra values are stored in the
`Measurement.custom` JSON field, so new garment or fitting requirements do not
need a schema change.

## 4. Run it locally

```bash
npm run dev
```

Open http://localhost:3000.

## 5. Deploy so she has a real link

The easiest path is Vercel (also free for this):

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com  New Project  import the repo.
3. In the project's Environment Variables, add `DATABASE_URL` and `DIRECT_URL`
   (same values as your `.env`).
4. Deploy.

She'll get a real URL (e.g. `https://studio-measurements.vercel.app`) she can
bookmark, add to her home screen, or eventually point a custom domain at.
Client self-entry links look like `https://her-domain.com/m/7QQ2XM` and work
from any device, since everything is stored in the shared database.

## How it's organized

- `app/page.tsx` - dashboard (list + search clients)
- `app/clients/new` - add a client
- `app/clients/[id]` - client profile, history, "send link" button
- `app/clients/[id]/measure` - she records a measurement in person
- `app/m/[code]` - the page a client opens from their link
- `app/api/**` - the backend routes, all reading/writing through Prisma
- `prisma/schema.prisma` - the three tables: Client, Measurement, LinkCode
