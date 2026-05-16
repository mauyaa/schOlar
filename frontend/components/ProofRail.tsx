import { StatusPill } from "./StatusPill";

type RailTone = "success" | "info" | "warning" | "danger" | "neutral";

export type ProofRailItem = {
  id: string | number;
  title: string;
  detail?: string;
  meta?: string;
  tone?: RailTone;
};

const dotClass: Record<RailTone, string> = {
  success: "bg-[color:var(--success)]",
  info: "bg-[color:var(--info)]",
  warning: "bg-[color:var(--warning)]",
  danger: "bg-[color:var(--danger)]",
  neutral: "bg-[color:var(--text-soft)]",
};

export function ProofRail({
  eyebrow = "Proof rail",
  title,
  items,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  items: ProofRailItem[];
  compact?: boolean;
}) {
  return (
    <aside className="surface rounded-[var(--radius-lg)] p-4 md:p-5">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-3 text-lg font-semibold leading-tight text-[color:var(--text)]">
        {title}
      </h2>
      <div className={`mt-5 ${compact ? "space-y-3" : "space-y-5"}`}>
        {items.map((item, index) => {
          const tone = item.tone ?? "neutral";
          return (
            <div key={item.id} className="grid grid-cols-[1rem_1fr] gap-3">
              <div className="flex flex-col items-center">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dotClass[tone]}`} />
                {index !== items.length - 1 && (
                  <span className="mt-2 h-full min-h-8 w-px bg-[color:var(--line)]" />
                )}
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold leading-5 text-[color:var(--text)]">
                    {item.title}
                  </p>
                  <StatusPill tone={tone}>{tone}</StatusPill>
                </div>
                {item.detail && (
                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">
                    {item.detail}
                  </p>
                )}
                {item.meta && (
                  <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                    {item.meta}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
