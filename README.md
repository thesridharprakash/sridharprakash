This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Analytics Setup (GA4)

Set this environment variable to enable analytics:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Tracked events currently include:

- `page_view` on route changes
- `cta_click` on key homepage CTAs
- `lead_click` on contact email click
- `social_click` on social profile clicks
- `volunteer_submit_attempt`
- `volunteer_submit_success`
- `volunteer_submit_error`
- `contact_submit_attempt`
- `contact_submit_success`
- `contact_submit_error`

Attribution data (`utm_*`, `gclid`, `fbclid`) is captured from the URL and persisted as first-touch and last-touch in browser local storage.

## Lead Ops (Volunteer API)

Optional environment variables for volunteer lead delivery and notifications:

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your-script-id/exec
CONTACT_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your-contact-script-id/exec
TELEGRAM_BOT_TOKEN=123456:ABCDEF
TELEGRAM_CHAT_ID=-1001234567890
```

Important for deployment: add these variables in your hosting provider's project settings (for Vercel: `Settings -> Environment Variables`) and redeploy after saving changes.

The volunteer endpoint now includes:

- Request timeout + retry when forwarding to upstream
- Basic rate limiting per IP
- Honeypot spam field check (`website`)
- Optional Telegram alert on successful lead capture

## YouTube Live Feed

To auto-show active YouTube live streams on the homepage, set:

```bash
YOUTUBE_API_KEY=your-youtube-data-api-key
YOUTUBE_CHANNEL_ID=your-channel-id
```

Notes:

- `YOUTUBE_API_KEY` must have access to YouTube Data API v3.
- `YOUTUBE_CHANNEL_ID` is your channel's ID (for example: `UC...`), not the `@handle`.

## Telegram Bot Linking

1. Create a bot with `@BotFather` and copy the bot token.
2. Add your bot to the target chat/channel.
3. Send at least one message in that chat (or mention the bot once for groups).
4. Get the chat id from:

```bash
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

5. Set env vars:

```bash
TELEGRAM_BOT_TOKEN=123456:ABCDEF
TELEGRAM_CHAT_ID=-1001234567890
# optional: protects test endpoint
TELEGRAM_TEST_SECRET=your-random-secret
```

6. Test delivery from this app:

```bash
curl -X POST http://localhost:3000/api/telegram/test ^
  -H "Content-Type: application/json" ^
  -H "x-telegram-test-secret: your-random-secret" ^
  -d "{\"message\":\"Test message from local app\"}"
```

If `TELEGRAM_TEST_SECRET` is not set, you can omit the `x-telegram-test-secret` header.

Browser test is also supported with `GET`:

```bash
http://localhost:3000/api/telegram/test?message=Hello%20from%20browser&secret=your-random-secret
```

For deployed environments, call the same endpoint on your production domain:

```bash
https://your-domain.com/api/telegram/test?message=Prod%20test&secret=your-random-secret
```
