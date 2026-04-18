export function localBusinessSchema(vertical: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `AI front desk for ${vertical}`,
    provider: {
      "@type": "LocalBusiness",
      name: "Ops by Noell",
      url: "https://www.opsbynoell.com",
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Orange County, California",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lake Forest",
        addressRegion: "CA",
        addressCountry: "US",
      },
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

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ops by Noell",
  url: "https://www.opsbynoell.com",
  logo: "https://www.opsbynoell.com/logo.png",
  sameAs: [] as string[],
};
