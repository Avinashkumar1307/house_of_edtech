import { auth } from "@/lib/auth";

// If you want different logic for each, do:
export const GET = (req: Request) => {
  // Handle GET
  return auth.handler(req); // Or your custom GET logic
};

export const POST = (req: Request) => {
  // Handle POST
  return auth.handler(req); // Or your custom POST logic
};
