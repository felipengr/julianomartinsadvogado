import type { SiteContent } from "./content/types";

// "(11) 97472-6844" -> "https://wa.me/5511974726844?text=..."
export function whatsappLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

// Mensagem dos cartões: a mensagem padrão + o nome da área.
export function whatsappAreaLink(contact: SiteContent["contact"], area: string) {
  return whatsappLink(contact.phone, `${contact.whatsappMessage} Assunto: ${area}.`);
}

export function telLink(phone: string) {
  return `tel:+55${phone.replace(/\D/g, "")}`;
}

export function fullAddress({ street, district, city, state, postalCode }: SiteContent["contact"]) {
  return `${street}, ${district}, ${city} - ${state}, ${postalCode}`;
}

export function mapsLink(contact: SiteContent["contact"]) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(contact))}`;
}

// "https://www.instagram.com/julianomartins.adv/" -> "@julianomartins.adv"
export function instagramHandle(url: string) {
  const handle = url.replace(/\/+$/, "").split("/").pop();
  return handle ? `@${handle}` : "";
}
