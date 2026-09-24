import Script from "next/script";
import { config } from "@/lib/config";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

interface AdvancedMatchingInfo {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

// Déclenche l'événement standard "Lead" avec Advanced Matching activé.
// No-op sûr si aucun pixel n'est configuré.
export function trackLeadWithMatching(
  user: AdvancedMatchingInfo,
  eventParams?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.fbq) return;
  const id = config.META_PIXEL_ID;
  if (!id) return;

  const userData: Record<string, string> = {};
  if (user.email) userData.em = user.email.trim().toLowerCase();
  if (user.phone) userData.ph = user.phone.replace(/\D/g, "");
  if (user.firstName) userData.fn = user.firstName.trim().toLowerCase();
  if (user.lastName) userData.ln = user.lastName.trim().toLowerCase();

  window.fbq("init", id, userData);
  window.fbq("track", "Lead", eventParams);
}

export function MetaPixel() {
  const id = config.META_PIXEL_ID;
  if (!id) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${id}'); fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
