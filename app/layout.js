// This file remains a server component (No "use client")
import { Inter } from "next/font/google";
import Header from "@/components/header";
import "./globals.css";
import { metadata } from "./metadata"; // Import metadata from a separate file
import ClientThemeProvider from "@/components/ClientThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { dark } from "@clerk/themes";

const inter = Inter({ substes: ["latin"] });



export { metadata }; // Keep metadata in a server component

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}
  >
    <html lang="en" suppressHydrationWarning>
      <body className={` ${inter.className} `}>
        <ClientThemeProvider>
        {/* header */}
        <Header/>
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          {/*footer*/}
          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-200">
              <p>footer</p>
            </div>
          </footer>
        </ClientThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
