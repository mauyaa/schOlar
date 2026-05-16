import type { NextApiRequest, NextApiResponse } from "next";
import { findStudent, listVaults } from "../../../lib/mockStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query as { address: string };

  if (!address) {
    res.status(400).json({ error: "Missing address" });
    return;
  }

  const student = findStudent(address);
  const vaults = listVaults()
    .filter((v) => v.studentAddress.toLowerCase() === address.toLowerCase())
    .map((v) => ({
      ...v,
      studentName: student?.name,
      country: student?.country,
      field: student?.field,
      institution: student?.institution,
      impactStory: student?.impactStory,
    }));

  res.status(200).json({ student, vaults });
}
