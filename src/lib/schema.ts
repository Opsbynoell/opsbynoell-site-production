import { SITE_META } from "@/lib/constants";

// Local business JSON-LD schema
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_META.name,
    description: SITE_META.description,
    url: SITE_META.url,
    sameAs: [],
  };
}

// Service schema for individual systems
export function serviceSchema(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: SITE_META.name,
      url: SITE_META.url,
    },
  };
}

// FAQ schema — accepts array of { question, answer }
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
