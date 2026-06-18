import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "@/lib/auth-context";
import { A11yProvider } from "@/lib/a11y-context";
import { SeniorProvider } from "@/lib/senior-context";
import { ApplicationsProvider } from "@/lib/applications-context";

export const metadata: Metadata = {
  title: "SENIOR HOUSE — Péče, koordinovaně.",
  description:
    "SENIOR HOUSE pomáhá rodinám a seniorům najít, financovat a zvládnout péči — jasně, eticky a bez chaosu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <A11yProvider>
          <AuthProvider>
            <SeniorProvider>
              <ApplicationsProvider>{children}</ApplicationsProvider>
            </SeniorProvider>
          </AuthProvider>
        </A11yProvider>
      </body>
    </html>
  );
}
