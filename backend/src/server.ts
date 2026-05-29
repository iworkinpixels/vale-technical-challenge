import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config";

interface PingRequestBody {
  message?: unknown;
}

interface PingResponseBody {
  echo: string;
  timestamp: number;
  env: string;
  version: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.post("/ping", async (req, res) => {
  await delay(3000);

  const { message } = req.body;

  res.json({
    echo: message,
    timestamp: Math.floor(Date.now() / 1000),
    env: config.env,
    version: config.version
  });
});

app.listen(config.port, () => {
  console.log(`API server running on http://localhost:${config.port}`);
});
