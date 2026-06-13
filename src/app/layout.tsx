import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/layout/WhatsAppFAB";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ram Chashma Ghar — Premium Indian Eyewear",
    template: "%s | Ram Chashma Ghar",
  },
  description:
    "Discover handpicked eyeglasses, sunglasses & reading glasses. Trusted by thousands across India. Free shipping, COD available, easy returns.",
  keywords: [
    "eyeglasses",
    "sunglasses",
    "reading glasses",
    "eyewear India",
    "spectacles online",
    "Ram Chashma Ghar",
    "Gujarat eyewear",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Ram Chashma Ghar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${plusJakarta.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFAB />
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1A1A1A",
              color: "#FAF5EF",
              fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
              fontSize: "0.875rem",
            },
          }}
        />
      </body>
    </html>
  );
}
