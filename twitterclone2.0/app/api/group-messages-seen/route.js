import { supabase } from "../../lib/supabaseClient";
import clientPromise from "../lib/clientpromisedbmongo"; // you must have this


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message_id, user_email } = req.body;

  if (!message_id || !user_email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Step 1: Connect to MongoDB and fetch the username
    const client = await clientPromise;
    const db = client.db(); // default DB
    const userDoc = await db.collection("user_profiles").findOne({ email: user_email });

    const username = userDoc?.profile?.displayName || user_email.split("@")[0];

    // Step 2: Upsert into Supabase
    const { error } = await supabase
      .from("group_message_seen")
      .upsert(
        {
          message_id,
          user_email,
          username,
          seen_at: new Date().toISOString(),
        },
        {
          onConflict: ["message_id", "user_email"],
        }
      );

    if (error) {
      return res.status(500).json({ error: "Failed to mark as seen" });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
