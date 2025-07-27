import { msg } from "../components/layout/ChatLayouts/ChatMainComponent";
import { IMessage } from "../interfaces/chat/Imessages";

export const formateChat = async (
  rawMessages: IMessage[],
  currentUserId: string
): Promise<msg[]> => {
  return rawMessages.map((msg): msg => {
    const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender._id;

    let replyTo: msg["replyTo"] | undefined;

    if (msg.replayTo && typeof msg.replayTo === "object") {
      const replySenderId =
        typeof msg.replayTo.sender === "string"
          ? msg.replayTo.sender
          : msg.replayTo.sender._id;

      replyTo = {
        _id: msg.replayTo._id,
        message: msg.replayTo.message || "",
        mediaType: msg.replayTo.mediaType ?? undefined, 
        sender: replySenderId === currentUserId ? "me" : "other",
      };
    }

    return {
      _id: msg._id, 
      message: msg.message,
      sender: senderId === currentUserId ? "me" : "other", 
      time: new Date(msg.createdAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
       mediaType: msg.mediaType ?? undefined,
       mediaUrl: msg.mediaUrl ?? undefined,

      ...(replyTo && { replyTo }), 
    };
  });
};
