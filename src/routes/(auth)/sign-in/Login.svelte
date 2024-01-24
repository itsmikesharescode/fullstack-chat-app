<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator";
    import {goto, invalidate, invalidateAll} from "$app/navigation";
	import { scale } from "svelte/transition";
	import BtnWraper from "$lib/mycomp/BtnWraper.svelte";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { Session } from "@supabase/supabase-js";
	import type { ServerNews } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { navState } from "$lib";

    type LoginVal = {
        email: string[]
        password: string[]
    };

    type LoginNews = {
        session: Session
        msg: string
        errors: LoginVal
    };

    let inputErrors: LoginVal | null = null;
    let loginLoader = false;

    const loginNews: SubmitFunction = () => 
    {
        loginLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {session, msg, errors} } = result as ServerNews<LoginNews>;
                
            switch (status) {
                case 200:
                    toast.success("Login success", {description: msg});
                    $navState.session = session;
                    loginLoader = false;
                    await invalidateAll();
                    break;
                
                case 402:
                    toast.error("Login failed", {description: msg});
                    inputErrors = null;
                    loginLoader = false;
                    break;
                
                case 403:
                    inputErrors = errors;
                    loginLoader = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };

</script>

<div class="min-h-screen flex flex-col justify-center" in:scale>

    <form method="POST" action="?/login" enctype="multipart/form-data" use:enhance={loginNews} class="w-full sm:w-[400px] mx-auto p-4 flex flex-col gap-2">
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">Log in</h3>
        <div class="">
            <Label for="email">Email</Label>
            <Input title="Enter your account email address." name="email" type="email" id="email" placeholder="Enter your email" class="border-slate-400 dark:border-slate-700" />
            {#each inputErrors?.email ?? [] as err}
                <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
            {/each}
        </div>
    
        <div class="">
            <Label for="password">Passsword</Label>
            <Input title="Enter your account password." name="password" type="password" id="password" placeholder="Enter your password" class="border-slate-400 dark:border-slate-700" />
            {#each inputErrors?.password ?? [] as err}
                <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
            {/each}
        </div>

        <Button type="submit" title="Click to login." >
            <BtnWraper name="Log in" loader={loginLoader} loader_name="Logging in.." />
        </Button>

        <Separator class="mt-5 border-slate-400 dark:border-slate-700" />
        
        <div class="flex justify-between">
            <Button title="Click to create your account." variant="link" on:click={() => goto("/sign-in?register")} >Create Account</Button>
            <Button title="Click to recover your account via email." variant="link" on:click={() => goto("/sign-in?forgot")} >Forgot Password?</Button>
        </div>

    </form> 
</div>