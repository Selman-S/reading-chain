import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reading Chain - Okuma Takip Uygulaması",
  description: "Günlük okuma alışkanlığınızı takip edin, zincirinizi kırmayın!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Reading Chain",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <RegisterServiceWorker />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
