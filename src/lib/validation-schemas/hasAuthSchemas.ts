import { z } from "zod";


export const sendChatSchema = z.object({
    send_chat: z.string().min(1, {message: "Must enter a message."}),
});

export const updateChatSchema = z.object({
    update_chat: z.string().min(1, {message: "Must enter a updated message."}),
    chat_id: z.string().min(1, {message: "Must enter a chat id."}),
});