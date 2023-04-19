import type { NextApiRequest } from "next";

export type SignedURLResponse = {
  signed_url: string;
};

export interface SignedURLRequest extends NextApiRequest {
  body: {
    file_name: string;
    file_type: string;
  };
}
