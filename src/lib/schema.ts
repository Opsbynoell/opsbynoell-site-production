import { SITE_URL, absoluteUrl } from "./seo";

const ORG_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "23710 El Toro Road #1086",
  addressLocality: "Lake Forest",
  addressRegion: "CA",
  postalCode: "92630",
  addressCountry: "US",
} as const;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Ops by Noell",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo-favicon-o.png`,
  },
  email: "hello@opsbynoell.com",
  address: ORG_ADDRESS,
  areaServed: { "@type": "Country", name: "United States" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@opsbynoell.com",
      areaServed: "US",
      availableLanguage: ["English"],
    },
  ],
  sameAs: [] as string[],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Ops by Noell",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
};

export function localBusinessSchema(vertical: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `AI front desk for ${vertical}`,
    provider: {
      "@type": "LocalBusiness",
      name: "Ops by Noell",
      url: SITE_URL,
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Orange County, California",
      },
      address: ORG_ADDRESS,
    },
    areaServed: "United States",
    description: `Done-for-you AI front desk and missed-call recovery system for ${vertical} businesses.`,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      lowPrice: 197,
      highPrice: 1497,
    },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type FaqEntry = { question: string; answer: string };

export function faqPageSchema(faqs: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nikki Noell",
    jobTitle: "Co-founder",
    worksFor: { "@id": `${SITE_URL}/#organization` },
    affiliation: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/about`,
  };
}

export function servicePageSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  vertical?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? "AI front desk for service businesses",
    provider: { "@id": `${SITE_URL}/#organization` },
    url: absoluteUrl(input.path),
    areaServed: input.vertical
      ? `${input.vertical} across the United States`
      : "United States",
  };
}

export type OfferTier = {
  name: string;
  priceMonthly?: number;
  priceSetup?: number;
  description: string;
  url?: string;
};

export function pricingProductSchema(tiers: OfferTier[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "The Noell System",
    description:
      "Done-for-you AI front desk and operations layer for service businesses.",
    brand: { "@id": `${SITE_URL}/#organization` },
    offers: tiers.map((t) => ({
      "@type": "Offer",
      name: t.name,
      description: t.description,
      priceCurrency: "USD",
      price: t.priceMonthly ?? 0,
      priceSpecification: t.priceMonthly
        ? {
            "@type": "UnitPriceSpecification",
            price: t.priceMonthly,
            priceCurrency: "USD",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: 1,
              unitCode: "MON",
            },
          }
        : undefined,
      url: t.url ? absoluteUrl(t.url) : absoluteUrl("/pricing"),
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE_URL}/#organization` },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    url: absoluteUrl(input.path),
    image: input.image
      ? absoluteUrl(input.image)
      : absoluteUrl("/images/og-grid-master.jpg"),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Person",
      name: input.author ?? "Nikki Noell",
      url: `${SITE_URL}/about`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function caseStudySchema(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  about?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    articleSection: "Case study",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    url: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: input.image
      ? absoluteUrl(input.image)
      : absoluteUrl("/images/og-grid-master.jpg"),
    about: input.about,
    author: {
      "@type": "Person",
      name: "Nikki Noell",
      url: `${SITE_URL}/about`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
