export type StudentRecord = {
  address: string;
  name: string;
  country: string;
  field: string;
  institution: string;
  impactStory: string;
  needLevel: number;
  verificationStatus: "verified" | "under-review" | "pending";
  cohort: string;
  requestedAmount: number;
  lastReviewedAt: string;
};

export type MilestoneRecord = {
  id: number;
  description: string;
  tuitionAmount: string;
  stipendAmount: string;
  status: "Pending" | "Approved" | "Paid" | "Revoked";
  dueDate?: string;
  proof?: string;
};

export type AuditEventRecord = {
  id: string;
  title: string;
  detail: string;
  actor: string;
  timestamp: string;
  tone: "success" | "info" | "warning" | "danger" | "neutral";
};

export type VaultRecord = {
  vaultAddress: string;
  studentAddress: string;
  caseId: string;
  committed: number;
  disbursed: number;
  totalCommitted: number;
  totalDisbursed: number;
  targetAmount: number;
  needScore: number;
  completionRate: number;
  stableToken: string;
  activeMilestone: string;
  verifier: string;
  confidence: number;
  riskNote: string;
  learningObjective: string;
  lastVerifiedAt: string;
  milestones: MilestoneRecord[];
  auditTrail: AuditEventRecord[];
};

const STABLE_TOKEN = "0x0000000000000000000000000000000000000001";

const STUDENTS: StudentRecord[] = [
  {
    address: "0xA1b2c3D4e5F60718293aBcDeF1234567890aBCd1",
    name: "Amina Okoro",
    country: "Nigeria",
    field: "Computer Science",
    institution: "University of Lagos",
    impactStory:
      "Amina is building a campus blockchain lab that helps classmates document skills, verify work, and reach remote technical roles.",
    needLevel: 9,
    verificationStatus: "verified",
    cohort: "2026 East and West Africa",
    requestedAmount: 18000,
    lastReviewedAt: "2026-05-12",
  },
  {
    address: "0xB2c3d4E5f60718293Abcdef1234567890abCdEf2",
    name: "Mateo Rojas",
    country: "Colombia",
    field: "Sustainable Engineering",
    institution: "Universidad Nacional",
    impactStory:
      "Mateo is designing low-cost water purification kits for rural schools in the Andes, with field testing tied to each scholarship release.",
    needLevel: 8,
    verificationStatus: "verified",
    cohort: "2026 Climate Builders",
    requestedAmount: 15000,
    lastReviewedAt: "2026-05-09",
  },
  {
    address: "0xC3D4e5F60718293aBcDeF1234567890aBCd1E3f4",
    name: "Leila Njeri",
    country: "Kenya",
    field: "Clinical Data Science",
    institution: "Jomo Kenyatta University",
    impactStory:
      "Leila is training community clinics to read maternal health signals earlier by combining field records with simple predictive models.",
    needLevel: 7,
    verificationStatus: "verified",
    cohort: "2026 Health Systems",
    requestedAmount: 14000,
    lastReviewedAt: "2026-05-14",
  },
];

const VAULTS: VaultRecord[] = [
  {
    vaultAddress: "0xVault000000000000000000000000000000000001",
    studentAddress: STUDENTS[0].address,
    caseId: "SC-2601",
    committed: 15000,
    disbursed: 4500,
    totalCommitted: 15000,
    totalDisbursed: 4500,
    targetAmount: 18000,
    needScore: 9,
    completionRate: 30,
    stableToken: STABLE_TOKEN,
    activeMilestone: "Semester 2 tuition approval",
    verifier: "ScOlar verification desk",
    confidence: 94,
    riskNote: "Institution invoice confirmed. Awaiting bursar receipt for next release.",
    learningObjective: "Complete distributed systems track and open the campus lab to 40 students.",
    lastVerifiedAt: "2026-05-12",
    milestones: [
      {
        id: 0,
        description: "Semester 1 tuition",
        tuitionAmount: "5000",
        stipendAmount: "500",
        status: "Paid",
        dueDate: "2026-02-01",
        proof: "Invoice, enrollment letter, and receipt reconciled.",
      },
      {
        id: 1,
        description: "Semester 2 tuition",
        tuitionAmount: "5000",
        stipendAmount: "500",
        status: "Approved",
        dueDate: "2026-08-15",
        proof: "Verifier approved release after academic standing review.",
      },
      {
        id: 2,
        description: "Capstone project grant",
        tuitionAmount: "2000",
        stipendAmount: "1000",
        status: "Pending",
        dueDate: "2027-01-10",
        proof: "Release requires mentor sign-off and demo notes.",
      },
    ],
    auditTrail: [
      {
        id: "a1",
        title: "Milestone 2 approved",
        detail: "Verifier matched enrollment record, invoice, and transcript note.",
        actor: "Verifier",
        timestamp: "2026-05-12 09:42",
        tone: "success",
      },
      {
        id: "a2",
        title: "Donor pool increased",
        detail: "Three donors added 2,800 USDC to the active vault.",
        actor: "Protocol",
        timestamp: "2026-05-10 16:20",
        tone: "info",
      },
      {
        id: "a3",
        title: "Receipt reconciled",
        detail: "Semester 1 payment was marked paid after institution confirmation.",
        actor: "Institution",
        timestamp: "2026-04-28 11:05",
        tone: "neutral",
      },
    ],
  },
  {
    vaultAddress: "0xVault000000000000000000000000000000000002",
    studentAddress: STUDENTS[1].address,
    caseId: "SC-2602",
    committed: 12000,
    disbursed: 2000,
    totalCommitted: 12000,
    totalDisbursed: 2000,
    targetAmount: 15000,
    needScore: 8,
    completionRate: 20,
    stableToken: STABLE_TOKEN,
    activeMilestone: "Field deployment kit",
    verifier: "Regional engineering reviewer",
    confidence: 89,
    riskNote: "Field site partner verified. Equipment quote expires in 18 days.",
    learningObjective: "Run a field trial with two schools and publish an open build guide.",
    lastVerifiedAt: "2026-05-09",
    milestones: [
      {
        id: 0,
        description: "Foundation year",
        tuitionAmount: "4000",
        stipendAmount: "400",
        status: "Paid",
        dueDate: "2026-03-01",
        proof: "Tuition receipt and term registration verified.",
      },
      {
        id: 1,
        description: "Field deployment",
        tuitionAmount: "3000",
        stipendAmount: "700",
        status: "Pending",
        dueDate: "2026-09-15",
        proof: "Release waits for lab supervisor review.",
      },
      {
        id: 2,
        description: "Open guide publication",
        tuitionAmount: "1800",
        stipendAmount: "600",
        status: "Pending",
        dueDate: "2027-02-18",
        proof: "Draft bill of materials and school partner notes required.",
      },
    ],
    auditTrail: [
      {
        id: "m1",
        title: "Partner site checked",
        detail: "Rural school deployment site was confirmed by the reviewer.",
        actor: "Verifier",
        timestamp: "2026-05-09 13:14",
        tone: "success",
      },
      {
        id: "m2",
        title: "Quote window opened",
        detail: "Equipment pricing is valid until the next review cycle.",
        actor: "Institution",
        timestamp: "2026-05-06 08:30",
        tone: "warning",
      },
    ],
  },
  {
    vaultAddress: "0xVault000000000000000000000000000000000003",
    studentAddress: STUDENTS[2].address,
    caseId: "SC-2603",
    committed: 9200,
    disbursed: 1800,
    totalCommitted: 9200,
    totalDisbursed: 1800,
    targetAmount: 14000,
    needScore: 7,
    completionRate: 13,
    stableToken: STABLE_TOKEN,
    activeMilestone: "Clinic data practicum",
    verifier: "Health systems review panel",
    confidence: 91,
    riskNote: "Program fit is strong. Next proof item is practicum placement confirmation.",
    learningObjective: "Complete clinical data practicum and train five clinic administrators.",
    lastVerifiedAt: "2026-05-14",
    milestones: [
      {
        id: 0,
        description: "Core coursework",
        tuitionAmount: "3600",
        stipendAmount: "450",
        status: "Paid",
        dueDate: "2026-04-12",
        proof: "Course registration and payment receipt verified.",
      },
      {
        id: 1,
        description: "Clinic data practicum",
        tuitionAmount: "2800",
        stipendAmount: "800",
        status: "Approved",
        dueDate: "2026-10-03",
        proof: "Placement supervisor approved learning plan.",
      },
      {
        id: 2,
        description: "Community training sprint",
        tuitionAmount: "1200",
        stipendAmount: "500",
        status: "Pending",
        dueDate: "2027-03-20",
        proof: "Release requires participant roster and training outline.",
      },
    ],
    auditTrail: [
      {
        id: "l1",
        title: "Practicum plan approved",
        detail: "Supervisor signed the learning plan and reporting cadence.",
        actor: "Verifier",
        timestamp: "2026-05-14 15:55",
        tone: "success",
      },
      {
        id: "l2",
        title: "Need score reviewed",
        detail: "Financial need remains high after stipend and family support review.",
        actor: "ScOlar desk",
        timestamp: "2026-05-13 10:18",
        tone: "neutral",
      },
    ],
  },
];

export function addStudent(
  student: Omit<
    StudentRecord,
    "address" | "verificationStatus" | "cohort" | "requestedAmount" | "lastReviewedAt"
  > & {
    address?: string;
    requestedAmount?: number;
  }
) {
  const record: StudentRecord = {
    address:
      student.address ??
      `0x${Math.random().toString(16).slice(2, 42).padEnd(40, "0")}`,
    name: student.name,
    country: student.country,
    field: student.field,
    institution: student.institution,
    impactStory: student.impactStory,
    needLevel: student.needLevel,
    verificationStatus: "under-review",
    cohort: "Applicant intake",
    requestedAmount: student.requestedAmount ?? 0,
    lastReviewedAt: new Date().toISOString().slice(0, 10),
  };
  STUDENTS.push(record);
  return record;
}

export function listStudents() {
  return STUDENTS;
}

export function listVaults() {
  return VAULTS;
}

export function findStudent(address: string) {
  return STUDENTS.find((s) => s.address.toLowerCase() === address.toLowerCase());
}

export function findVault(address: string) {
  return VAULTS.find((v) => v.vaultAddress.toLowerCase() === address.toLowerCase());
}
