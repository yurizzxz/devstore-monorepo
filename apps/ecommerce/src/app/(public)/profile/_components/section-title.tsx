import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SectionTitleProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
};

export function SectionTitle({ icon: Icon, title, children }: SectionTitleProps) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <Icon className="mt-0.5 size-5 text-primary" />
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-zinc-400">{children}</p>
      </div>
    </div>
  );
}
