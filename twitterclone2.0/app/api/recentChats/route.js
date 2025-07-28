// import { supabase } from "../../../lib/supabaseClient";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const currentUserEmail = searchParams.get("currentUserEmail");

//     if (!currentUserEmail) {
//       return Response.json({ error: "Missing currentUserEmail" }, { status: 400 });
//     }

//     // 1. Get all chats involving this user
//     const { data: chats, error } = await supabase
//       .from("chats")
//       .select("id, users")
//       .contains("users", [currentUserEmail]);

//     if (error) {
//       console.error(error);
//       return Response.json({ error: "Failed to load chats" }, { status: 500 });
//     }

//     const results = [];

//     for (const chat of chats) {
//       const { data: messages, error: msgError } = await supabase
//         .from("messages")
//         .select("*")
//         .eq("chat_id", chat.id)
//         .order("inserted_at", { ascending: true });

//       if (msgError) continue;

//       const lastMessage = messages[messages.length - 1];
//       const unreadMessages = messages.filter(
//         (m) => m.receiver_email === currentUserEmail && !m.seen
//       );

//       results.push({
//         chat_id: chat.id,
//         peer_email: chat.users.find((u) => u !== currentUserEmail),
//         last_message: lastMessage ? lastMessage.message : "",
//         last_message_timestamp: lastMessage ? lastMessage.inserted_at : null,
//         last_message_seen: lastMessage?.seen || false,
//         unread_count: unreadMessages.length,
//         last_messages: unreadMessages.slice(-3).map((m) => ({
//           message: m.message,
//           id: m.id,
//         })),
//       });
//     }

//     return Response.json(results);
//   } catch (err) {
//     console.error(err);
//     return new Response("Server error", { status: 500 });
//   }
// }


export async function GET(request) {
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
