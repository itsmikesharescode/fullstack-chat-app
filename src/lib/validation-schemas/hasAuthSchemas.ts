import { z } from "zod";


export const sendChatSchema = z.object({
    send_chat: z.string().min(1, {message: "Must enter a message."}),
})