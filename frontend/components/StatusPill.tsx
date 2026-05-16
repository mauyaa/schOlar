type Tone = "success" | "info" | "warning" | "danger" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "border-[color:var(--success)] text-[color:var(--success)]",
  info: "border-[color:var(--info)] text-[color:var(--info)]",
  warning: "border-[color:var(--warning)] text-[color:var(--warning)]",
  danger: "border-[color:var(--danger)] text-[color:var(--danger)]",
  neutral: "border-[color:var(--line-strong)] text-[color:var(--text-muted)]",
};

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
