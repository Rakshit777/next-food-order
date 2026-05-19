import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { Header } from "../components/Header";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gourmet Delivery",
  description: "Premium food delivery application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main style={{ paddingTop: '80px' }}>
            {children}
          </main>
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
