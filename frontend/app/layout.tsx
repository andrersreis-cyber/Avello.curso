import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AffiliateTracker } from "@/components/affiliate-tracker";
import { AuthProvider } from "@/contexts/auth-context";
import { QueryProvider } from "@/providers/query-provider";
import { FacebookPixel, FacebookPixelScript } from "@/components/facebook-pixel";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Área de Membros | Pack IA",
  description: "Acesse +6000 recursos de IA: workflows n8n, prompts, templates e muito mais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && (
          <FacebookPixelScript pixelId={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID} />
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <AffiliateTracker />
            <Suspense fallback={null}>
              <FacebookPixel />
            </Suspense>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
