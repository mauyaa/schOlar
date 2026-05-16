import type { NextApiRequest, NextApiResponse } from "next";
import { findStudent, findVault } from "../../../lib/mockStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query as { address: string };

  if (!address) {
    res.status(400).json({ error: "Missing address" });
    return;
  }

  const vault = findVault(address);
  if (!vault) {
    res.status(404).json({ error: "Vault not found (mock data)" });
    return;
  }

  const student = findStudent(vault.studentAddress);

  res.status(200).json({
    ...vault,
    studentName: student?.name,
    country: student?.country,
    field: student?.field,
    institution: student?.institution,
    impactStory: student?.impactStory,
  });
}
