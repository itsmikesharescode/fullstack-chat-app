import { redirect, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { ZodError } from "zod";
import { sendChatSchema } from "$lib/validation-schemas/hasAuthSchemas";

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
    }
};