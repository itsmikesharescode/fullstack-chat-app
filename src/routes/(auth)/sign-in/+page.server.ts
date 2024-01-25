import { fail, type Actions, redirect } from "@sveltejs/kit";
import type { ZodError } from "zod";
import { loginSchema, registerSchema, forgotPasswordSchema } from "$lib/validation-schemas/loginSchemas";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals: {supabase, getSession}}) => {
    
    const session = await getSession();

    if(session) throw redirect(302, "/has-auth");

};

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
                        },
                    },
                });

                if(registerError) return fail(402, {msg: registerError.message});
                else if (session) {

                    const { error: insertError } = await supabase.from("user_list").insert([{

                        user_id: session.user.id,
                        display_name: session.user.user_metadata.display_name,
                        email: session.user.email,

                    }]);

                    if(insertError) return fail(402, {msg: insertError.message});
                    else return fail(200, {msg: "Registered successfully.", session});

                };


            }else return fail(402, {msg: "Passwords do not match."})
            
        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors});
        };
    },

    forgot: async ({request, locals: {supabase}}) => 
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = forgotPasswordSchema.parse(formData);

            const { error: resetPassError } = await supabase.auth.resetPasswordForEmail(result.email);

            if(resetPassError) return fail(402, {msg: resetPassError.message});
            else return fail(200, {msg: `An email containing a password reset has been sent to your email ${result.email}`});

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();

            return fail(403, {errors: fieldErrors});
        };
    },

    logout: async ({locals: {supabase}}) => 
    {
        const {error: logoutError} = await supabase.auth.signOut();

        if(logoutError) return fail(402, {msg: logoutError.message});
        else return fail(200, {msg: "Logged out successfully."});
    }

}; 