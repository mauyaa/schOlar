import type { NextApiRequest, NextApiResponse } from "next";
import {
  addStudent,
  listStudents,
  listVaults,
  findStudent,
} from "../../../lib/mockStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, country, field, institution, impactStory, needLevel, requestedAmount, address } =
      req.body;

    if (!name || !country || !field || !institution || !impactStory) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const student = addStudent({
      name,
      country,
      field,
      institution,
      impactStory,
      needLevel: Number(needLevel) || 5,
      requestedAmount: Number(requestedAmount) || 0,
      address,
    });

    res.status(201).json({ ok: true, student });
    return;
  }

  if (req.method === "GET") {
    const students = listStudents();
    const vaults = listVaults().map((v) => {
      const student = findStudent(v.studentAddress);
      return {
        ...v,
        studentName: student?.name,
        country: student?.country,
        field: student?.field,
        institution: student?.institution,
        impactStory: student?.impactStory,
      };
    });

    res.status(200).json({ students, vaults });
    return;
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
