import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps {
  id?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function Section({ id, title, subtitle, children, className, align = "left" }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-24 lg:py-32", className)}>
      <Container>
        {(title || subtitle) && (
          <div className={cn("mb-16 max-w-3xl", align === "center" && "mx-auto text-center")}>
            {title && <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">{title}</h2>}
            {subtitle && <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">{subtitle}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}