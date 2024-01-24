import { fail, type Actions } from "@sveltejs/kit";
import type { ZodError } from "zod";
import { loginSchema, registerSchema } from "$lib/validation-schemas/loginSchemas";

export const actions: Actions = {
    
    login: async ({request, locals: {supabase} }) => 
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            
            const result = loginSchema.parse(formData);

            const {data: {session}, error: loginError} = await supabase.auth.signInWithPassword({
                email: result.email,
                password: result.password,
            });

            if(loginError) return fail(402, {msg: loginError.message});
            else if(session) return fail(200, {msg: "Logged in successfully.", session});

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors});
        }
    },

    register: async ({request, locals: {supabase}}) =>
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = registerSchema.parse(formData);

            if(result.confirm_password === result.password){

                const {data: {session}, error: registerError} = await supabase.auth.signUp({
                    email: result.email,
                    password: result.password,
                    options: {
                        data: {
                            display_name: result.display_name,
                        }
                    }
                });

                if(registerError) return fail(402, {msg: registerError.message});
                else if (session) {
                    // database connection here!
                }


            }else return fail(402, {msg: "Passwords do not match."})
            
        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors});
        }
    }

}; 