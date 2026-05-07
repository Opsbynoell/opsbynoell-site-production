export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth enforcement is handled by proxy.ts middleware.
  // This layout strips the public Navbar/Footer.
  return <div className="min-h-screen bg-[#f8f4f0]">{children}</div>;
}
