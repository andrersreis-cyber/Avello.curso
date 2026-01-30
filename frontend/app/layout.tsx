import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AffiliateTracker } from "@/components/affiliate-tracker";
import { AuthProvider } from "@/contexts/auth-context";

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
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <AffiliateTracker />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
