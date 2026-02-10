import "./config/instrument.js";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import dotenvx from "@dotenvx/dotenvx";
import helmet from "helmet";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./config/cloudinay.js";
import { errorHandler } from "./middleware/errorHandler.js";
import jobRoutes from "./routes/jobRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { clerkMiddleware } from "@clerk/express";
dotenvx.config();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAne7cLNWTWPYHpy3OT8BC9D2PVLHsS-dU",
  authDomain: "job-portal-2e4c0.firebaseapp.com",
  projectId: "job-portal-2e4c0",
  storageBucket: "job-portal-2e4c0.firebasestorage.app",
  messagingSenderId: "353884136734",
  appId: "1:353884136734:web:b7876a64309352561d950f",
  measurementId: "G-1C24R457XL"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);


// Initialize Express
const app = express();

// connect to DataBase
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "From backend" });
});

// for clerkwebhook
app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/users",userRoutes)

// Error Check
// app.use(()=>errorHandler);

// sentry for checking
Sentry.setupExpressErrorHandler(app);
// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express is running on ${PORT}`);
});
