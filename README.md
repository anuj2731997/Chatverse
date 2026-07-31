# Chatverse

Chatverse is a realtime chat application built with **Next.js**, **Convex**, and **Clerk**. It combines a reactive Convex backend for instant message delivery with Clerk-based authentication, Cloudinary-powered media uploads, and a modern shadcn/ui interface.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| Language | TypeScript |
| Backend / Realtime DB | [Convex](https://convex.dev/) |
| Authentication | [Clerk](https://clerk.com/) (`@clerk/nextjs`, `@convex-dev/auth`) |
| Media Storage | [Cloudinary](https://cloudinary.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/), Radix/`@base-ui/react`, `lucide-react` |
| Styling | Tailwind CSS v4 |
| Other | `emoji-picker-react`, `cmdk`, `recharts`, `embla-carousel-react`, `sonner`, `next-themes` |

## Features

- Realtime, reactive messaging powered by Convex subscriptions
- Secure authentication and session management via Clerk
- Image/file uploads via Cloudinary
- Emoji picker for message composition
- Command menu (`cmdk`) for quick navigation/actions
- Toast notifications and responsive, resizable panel layouts

## Project Structure

```
Chatverse/
├── app/                 # Next.js App Router pages, layouts, and routes
├── components/          # Reusable UI components (shadcn/ui based)
├── convex/              # Convex schema, queries, mutations, and auth config
├── features/            # Feature-specific modules/logic
├── hooks/                # Custom React hooks
├── lib/                 # Shared utilities/helpers
├── public/              # Static assets
├── .agents/skills        # Agent skill configs
├── .claude/skills        # Claude skill configs
├── proxy.ts              # Proxy configuration
├── sample.env             # Example environment variables
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (or your preferred package manager)
- A [Convex](https://convex.dev/) account/project
- A [Clerk](https://clerk.com/) application
- A [Cloudinary](https://cloudinary.com/) account with an unsigned upload preset

### 1. Clone the repository

```bash
git clone https://github.com/anuj2731997/Chatverse.git
cd Chatverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `sample.env` to `.env.local` and fill in your own values:

```bash
cp sample.env .env.local
```

```env
# Convex Configuration
CONVEX_DEPLOYMENT="your-convex-deployment"
NEXT_PUBLIC_CONVEX_URL="https://your-project.convex.cloud"
NEXT_PUBLIC_CONVEX_SITE_URL="https://your-app.vercel.app"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_JWT_ISSUER_DOMAIN="https://your-project.clerk.accounts.dev"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
```

### 4. Start Convex

```bash
npx convex dev
```

This provisions/links your Convex deployment and generates the `CONVEX_DEPLOYMENT` value.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Contributing

Contributions are welcome! Please open an issue to discuss significant changes before submitting a pull request.

## License

No license has been specified for this repository yet. Contact the repository owner for usage terms.