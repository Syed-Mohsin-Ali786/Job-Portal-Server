import "./config/instrument.js";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import dotenvx from "@dotenvx/dotenvx";
import helmet from "helmet";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";
dotenvx.config();

// Initialize Express
const app = express();

// connect to DataBase
await connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "From backend" });
});

// for clerkwebhook
app.post('/webhooks',clerkWebhooks)

// sentry for checking
Sentry.setupExpressErrorHandler(app);
// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express is running on ${PORT}`);
});
