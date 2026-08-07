"use client";

import Image from "next/image";
import { broker } from "@/lib/broker";

// Wordmark texte par défaut. Dépose /public/logo-broker.png et
// /public/logo-franchise.png puis renseigne broker.brokerLogo / franchiseLogo.
export function TopLogos() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 sm:px-8">
      <div className="flex items-center">
        {broker.brokerLogo ? (
          <Image
            src={broker.brokerLogo}
            alt={broker.name}
            width={140}
            height={40}
            className="h-8 w-auto object-contain sm:h-10"
            priority
          />
        ) : (
          <span className="font-display text-sm tracking-tight text-brand-100 sm:text-base">
            {broker.name}
          </span>
        )}
      </div>
      <div className="flex items-center">
        {broker.franchiseLogo ? (
          <Image
            src={broker.franchiseLogo}
            alt={broker.franchise}
            width={120}
            height={36}
            className="h-7 w-auto object-contain sm:h-9"
          />
        ) : (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500 sm:text-sm">
            {broker.franchise}
          </span>
        )}
      </div>
    </div>
  );
}
