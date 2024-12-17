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


============================

TO DO LIST:

npx prisma init
npx prisma db push
npx prisma migrate dev --name init

Generate a secret using:
bashCopyopenssl rand -base64 32

====================
onetimpass/
    .next/
    app/
        api/
            auth/signup/
                route.ts
            check-call-status/
                route.ts
            check-payment/
                route.ts
            create-payment/
                route.ts
            make-otp-call/
                route.ts
             payment-webhook/
                  route.ts
            buy-credits/
                page.tsx
        dashboard/
            page.tsx
        help/
            page.tsx
        pricing/
            page.tsx
        signin/
            page.tsx
        signup/
            page.tsx
            actions.ts
        favicon.ico
        globals.css
        layout.tsx
        otpService.ts
        page.tsx
        providers.tsx
        components/
            ui/
                button.tsx
                card.tsx
                dialog.tsx
                input.tsx
                label.tsx
                select.tsx
                sheet.tsx
                CountryCodeSelector.tsx
                CryptoPaymentModal.tsx
                DashboardHeader.tsx
                Header.tsx
                OneCaller.tsx
                SignInForm.tsx
                SignUpForm.tsx
        fonts/
        lib/
            auth.ts
            next-auth-handler.ts
            utils.ts
    node_modules/
    prisma/
        migrations/
        schema.prisma
    types/
        next-auth.d.ts
    .env
    .eslintrc.json
    .gitignore
    components.json
    middleware.ts
    next-env.d.ts
    next.config.js
    next.config.mjs
    package-lock.json
    package.json