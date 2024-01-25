import { fail, type Actions, redirect } from "@sveltejs/kit";
import { resetPassSchema } from "$lib/validation-schemas/loginSchemas";
import type { ZodError } from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({url ,locals: {supabase}}) => {

    const {data: {session}, error: tokenError} = await supabase.auth.verifyOtp({token_hash: url.search.slice(1), type: "email"});

    if(tokenError) throw redirect(302, "/sign-in?msg=invalid-token.");
    else if(!session) throw redirect(302, "/sign-in?msg=invalid-token.");

};

export const actions: Actions = {

    default: async ({request, locals: {supabase}}) => 
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            
            const result = resetPassSchema.parse(formData);

            if(result.confirm_new_password === result.new_password){

                const {data: {user}, error: updatePassError} = await supabase.auth.updateUser({
                    password: result.new_password,
                });
    
                if(updatePassError) return fail(402, {msg: updatePassError.message});
                else return fail(200, {msg: "Password updated successfully.", user});

            }else return fail(402, {msg: "Passwords do not match."});

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors});
        }
    },

};