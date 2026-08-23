// Central WhatsApp link builder.
// On Android we return an intent:// URL that forces the WhatsApp Business app
// (package com.whatsapp.w4b). If Business is not installed, Chrome falls back
// to the wa.me web link automatically. On iOS/desktop both WhatsApp apps share
// the same handler, so we use the universal wa.me link there.

export const WHATSAPP_NUMBER = "919448277091";

const WHATSAPP_BUSINESS_PACKAGE = "com.whatsapp.w4b";

export const isAndroid = (): boolean =>
  typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);

/**
 * Builds a fully encoded WhatsApp link.
 * - Android: opens WhatsApp Business directly (falls back to wa.me).
 * - iOS / Desktop: opens wa.me (system picks the available app).
 */
export type WhatsAppApp = "auto" | "business" | "messenger";

const WHATSAPP_CONSUMER_PACKAGE = "com.whatsapp";

export function buildWhatsAppLink(
  message: string,
  phone: string = WHATSAPP_NUMBER,
  app: WhatsAppApp = "auto",
): string {
  const encoded = encodeURIComponent(message);
  const waMe = `https://wa.me/${phone}?text=${encoded}`;
  if (isAndroid()) {
    const pkg =
      app === "messenger" ? WHATSAPP_CONSUMER_PACKAGE : WHATSAPP_BUSINESS_PACKAGE;
    return (
      `intent://send?phone=${phone}&text=${encoded}` +
      `#Intent;scheme=whatsapp;package=${pkg};` +
      `S.browser_fallback_url=${encodeURIComponent(waMe)};end`
    );
  }
  return waMe;
}

