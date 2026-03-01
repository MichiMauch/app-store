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

## Upload APK + App Icon

Use the upload script to publish an APK, upload its icon, and automatically maintain `apps.json` metadata on the server.

```bash
npm run upload:apk -- \
  --apk app/build/outputs/apk/debug/app-debug.apk \
  --icon app/src/main/res/mipmap-xxxhdpi/ic_launcher.png \
  --name "My App" \
  --version "1.2.3" \
  --description "Internal beta"
```

Defaults:

- `--remote`: `root@78.46.189.129`
- `--remote-dir`: `/data/apps`

What the script does:

- uploads the APK to `<remote-dir>/<filename>.apk`
- uploads the icon to `<remote-dir>/icons/<apk-basename>.<ext>`
- creates or updates `<remote-dir>/apps.json` entry for that APK
- sets `iconUrl` automatically to `/api/icons/<icon-filename>`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
