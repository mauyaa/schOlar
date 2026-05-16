export function MetricBlock({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="border-l border-[color:var(--line)] pl-4">
      <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold leading-none text-[color:var(--text)] md:text-3xl">
        {value}
      </div>
      {detail && (
        <div className="mt-2 max-w-[14rem] text-xs leading-5 text-[color:var(--text-muted)]">
          {detail}
        </div>
      )}
    </div>
  );
}
