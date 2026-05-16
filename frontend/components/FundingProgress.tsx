import { formatCurrency, percent } from "../lib/format";

interface Props {
  committed: number;
  disbursed: number;
  target?: number;
  label?: string;
}

export function FundingProgress({
  committed,
  disbursed,
  target,
  label = "Disbursement progress",
}: Props) {
  const pct = percent(disbursed, committed);
  const fundingPct = target ? percent(committed, target) : undefined;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
            {label}
          </div>
          <div className="mt-1 text-sm text-[color:var(--text-muted)]">
            {formatCurrency(disbursed)} released from {formatCurrency(committed)}
          </div>
        </div>
        <div className="text-right text-2xl font-semibold leading-none">
          {pct.toFixed(0)}%
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--background-soft)]">
        <div
          aria-label={`${pct.toFixed(0)} percent disbursed`}
          className="h-full rounded-full bg-[color:var(--accent)] transition-[width] duration-500 ease-out"
          role="progressbar"
          style={{ width: `${pct}%` }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Number(pct.toFixed(0))}
        />
      </div>
      {typeof fundingPct === "number" && (
        <div className="flex justify-between text-xs leading-5 text-[color:var(--text-soft)]">
          <span>{formatCurrency(committed)} committed</span>
          <span>{fundingPct.toFixed(0)}% of {formatCurrency(target ?? 0)} target</span>
        </div>
      )}
    </div>
  );
}
