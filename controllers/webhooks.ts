import { Svix, Webhook } from "svix";
import User from "../models/User.ts";

// Api Controller function to manage clerk user with database
export const clerkWebhooks = async (req: Request, res: Response) => {
  try {

    // Create a svix instance with clerk webhook secret
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      throw new Error("CLERK_WEBHOOK_SECRET is not defined");
    };

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body),{
        "svix-id":req.headers?["svix=id"],
        "svix-timestamp":req.headers?["svix-timestamp"],
        
    })

  } catch (error) {}
};
