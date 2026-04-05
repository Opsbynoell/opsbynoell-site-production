import { cn } from "@/lib/utils";

type SectionShellProps = {
  children: React.ReactNode;
  className?: string;
  /** Tighter vertical padding — for hero-lite intros and adjacent sections */
  compact?: boolean;
  /** Inner max-width container */
  contained?: boolean;
  id?: string;
};

export function SectionShell({
  children,
  className,
  compact = false,
  contained = true,
  id,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        compact ? "py-12 md:py-16" : "py-16 md:py-24",
        className
      )}
    >
      {contained ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
