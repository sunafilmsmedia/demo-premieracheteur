import type { Metadata, Viewport } from "next";
import { Montserrat, DM_Sans } from "next/font/google";
import "./globals.css";
import { broker } from "@/lib/broker";
import { MetaPixel } from "@/components/MetaPixel";
import { Clarity } from "@/components/Clarity";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Premier achat — ${broker.name}`,
  description:
    "Tu veux acheter ta première propriété ? Découvre où tu en es et tes prochaines étapes vers ta préapprobation.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr-CA" className={`${montserrat.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <MetaPixel />
        <Clarity />
      </body>
    </html>
  );
}
