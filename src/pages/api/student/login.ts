import { type NextApiRequest, type NextApiResponse } from "next/types";

interface StudentLoginBody {
  name: string;
  teacher: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body = req.body as StudentLoginBody;
    console.log("student login", body);
    res.status(200).end();
  }

  res.status(400).end();
}
