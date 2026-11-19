import "./globals.css";

import { Manrope } from "next/font/google";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import Loader from "@/components/layout/Loader";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.luneblaze.com"),
  applicationName: "Luneblaze",
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${manrope.variable} min-h-screen bg-[#F4F8F8] font-sans antialiased`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
        <Loader />
      </body>
    </html>
  );
}