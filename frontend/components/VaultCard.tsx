import Link from "next/link";
import { compactAddress, formatCurrency } from "../lib/format";
import { FundingProgress } from "./FundingProgress";
import { StatusPill } from "./StatusPill";

interface Props {
  vaultAddress: string;
  studentAddress: string;
  studentName?: string;
  country?: string;
  field?: string;
  institution?: string;
  committed: number;
  disbursed: number;
  targetAmount?: number;
  needScore: number;
  completionRate: number;
  activeMilestone?: string;
  confidence?: number;
  caseId?: string;
}

export function VaultCard(props: Props) {
  const fundingGap = Math.max(0, (props.targetAmount ?? props.committed) - props.committed);

  return (
    <Link
      href={`/donor/student/${props.vaultAddress}`}
      className="group block rounded-[var(--radius-lg)] focus-ring"
    >
      <article className="surface grid min-h-full gap-5 rounded-[var(--radius-lg)] p-5 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-[color:var(--line-strong)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{props.caseId ?? "Vault"}</span>
              <StatusPill tone="success">verified</StatusPill>
            </div>
            <h3 className="mt-4 text-2xl font-semibold leading-tight text-[color:var(--text)]">
              {props.studentName ?? "Verified learner"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
              {props.field} at {props.institution ?? "verified institution"} in {props.country}
            </p>
          </div>
          <div className="text-right">
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
              Confidence
            </div>
            <div className="mt-1 text-2xl font-semibold text-[color:var(--accent)]">
              {props.confidence ?? 90}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 border-y border-[color:var(--line)] py-4">
          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
              Need
            </div>
            <div className="mt-1 text-lg font-semibold">{props.needScore}/10</div>
          </div>
          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
              Released
            </div>
            <div className="mt-1 text-lg font-semibold">{props.completionRate.toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
              Gap
            </div>
            <div className="mt-1 text-lg font-semibold">{formatCurrency(fundingGap)}</div>
          </div>
        </div>

        <FundingProgress
          committed={props.committed}
          disbursed={props.disbursed}
          target={props.targetAmount}
        />

        <div className="flex items-center justify-between gap-4 text-xs text-[color:var(--text-soft)]">
          <span>{props.activeMilestone ?? "Next milestone review"}</span>
          <span>{compactAddress(props.studentAddress)}</span>
        </div>
      </article>
    </Link>
  );
}
