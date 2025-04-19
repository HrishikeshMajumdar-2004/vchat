import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VChat App",
  description: "Vchat is a seamless video conferencing app that allows users to host and join virtual meetings with high-quality video and audio, featuring an intuitive interface and essential collaboration tools.",
  icons : {
    icon : "/icons/logo.jpg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsVariant: "iconButton",
          logoImageUrl: "/icons/logo.jpg",
        },
      }}
    >
      <html lang="en">
        <body className={`${geistMono.className} bg-dark-2`}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
