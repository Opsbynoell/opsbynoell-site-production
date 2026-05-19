import type { Metadata } from "next";
import { AddOnsContent } from "@/components/add-ons-content";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";

const PATH = "/add-ons";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: "Add-On Services, Build Your Own Stack",
  description:
    "Layer additional services onto any Ops by Noell base package. SEO, social media, brand identity, conversion copy, operational systems, and more. One partner, one invoice.",
});

export default function AddOnsPage() {
  return (
    <>
      <JsonLd
        data={[
          servicePageSchema({
            name: "Ops by Noell Add-On Services",
            description:
              "Modular add-on services for service businesses and B2B companies. Layer SEO, social media, brand identity, conversion copy, and operational systems onto any base package.",
            path: PATH,
            serviceType: "Business Operations and Marketing Services",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Add-On Services", path: PATH },
          ]),
        ]}
        id="add-ons-schema"
      />
      <AddOnsContent />
    </>
  );
}
