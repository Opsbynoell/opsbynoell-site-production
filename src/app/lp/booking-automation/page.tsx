import { pageMetadata } from "@/lib/seo";
import { BookingAutomationPageClient } from "@/components/booking-automation-page";

export const metadata = pageMetadata({
  path: "/lp/booking-automation",
  title: "Automate Client Booking for Service Businesses — Free Guide",
  description:
    "Free guide for service businesses. Stop losing booked jobs to no-shows and missed calls. Learn how to automate your client booking system and fill your calendar 24/7.",
  ogTitle: "Automate Client Booking — Stop Losing Jobs to No-Shows",
  ogDescription:
    "Most service businesses lose 5–8 jobs per month to no-shows and missed booking requests. This free guide shows you exactly how to automate your calendar and recover that revenue.",
});

export default function BookingAutomationPage() {
  return <BookingAutomationPageClient />;
}
