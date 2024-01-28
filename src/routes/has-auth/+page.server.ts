import { redirect, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { ZodError } from "zod";
import { sendChatSchema, updateChatSchema } from "$lib/validation-schemas/hasAuthSchemas";

export const load: PageServerLoad = async ({locals: {getSession, supabase}}) => {

    
    const session = await getSession();
    if(!session) throw redirect(302, "/sign-in?msg=not-logged-in.");

    return {session};


};

export const actions: Actions = {

    sendChat: async ({request, locals: {supabase, getSession}}) =>
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = sendChatSchema.parse(formData);

            const session = await getSession();

            if(session){

                const { error: sendChatError } = await supabase.from("message_list").insert([{
                    user_id: session.user.id,
                    user_email: session.user.email,
                    user_display_name: session.user.user_metadata.display_name,
                    user_message: result.send_chat,
                }]);

                if(sendChatError) return fail(402, {msg: sendChatError.message});
                else return fail(200, {msg: "Message sent successfully."});

            }else return fail(402, {msg: "You do not have a token try reloading."});

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors});
            
        }
    },

    deleteChat: async ({request, locals: {supabase}}) => 
    {
        const formData = await request.formData();

        const chat_id = formData.get("chat_id") as string;
        const { error: deleteChatError } = await supabase.from("message_list").delete().match({id: chat_id});

        if(deleteChatError) return fail(402, {msg: deleteChatError.message});
        else return fail(200, {msg: "Message deleted successfully."});

    },

    updateChat: async ({request, locals: {supabase}}) => 
    {
        const formData = Object.fromEntries(await request.formData());
        try {
            
            const result = updateChatSchema.parse(formData);
            
            const {error: updateChatError} = await supabase.from("message_list").update([{
                user_message: result.update_chat,
                is_updated: true,
            }]).match({id: result.chat_id});

            if(updateChatError) return fail(402, {msg: updateChatError.message});
            else return fail(200, {msg: "Chat updated successfully."});

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();

            return fail(403, {errors: fieldErrors});

        }
    }
};