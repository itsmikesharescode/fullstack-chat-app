<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator";
    import {goto} from "$app/navigation";
	import { scale } from "svelte/transition";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { Session } from "@supabase/supabase-js";
	import type { ServerNews } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { navState } from "$lib";
	import BtnWraper from "$lib/mycomp/BtnWraper.svelte";

    type RegisterVal = {
        display_name: string[]
        email: string[]
        password: string[]
        confirm_password: string[]
    };
    
    type RegisterNews = {
        session: Session
        msg: string
        errors: RegisterVal
    };

    let inputErrors: RegisterVal | null = null;
    let registerLoader = false;

    const registerNews: SubmitFunction = () => 
    {
        registerLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {session, msg, errors} } = result as ServerNews<RegisterNews>;
                
            switch (status) {
                case 200:
                    $navState.session = session;
                    toast.success("Register succes", {description: msg});
                    registerLoader = false;
                    break;
                
                case 402:
                    toast.error("Register failed", {description: msg});
                    inputErrors = null;
                    registerLoader = false;
                    break;
                
                case 403:
                    inputErrors = errors;
                    registerLoader = false;

                    break;
                default:
                    break;
            };
            await update();
        };
    };

</script>

<div class="min-h-screen flex flex-col justify-center" in:scale>

    <form method="POST" action="?/register" enctype="multipart/form-data" use:enhance={registerNews}  
    class="w-full sm:w-[400px] mx-auto p-4 flex flex-col gap-2">
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">Register</h3>
        <div class="">
            <Label for="display_name">Display Name</Label>
            <Input title="Enter your account display name." name="display_name" type="text" id="displayName" placeholder="Enter your display name" class="border-slate-400 dark:border-slate-700" />
            {#each inputErrors?.display_name ?? [] as err}
                <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
            {/each}
        </div>

        <div class="">
            <Label for="email">Email</Label>
            <Input title="Enter your account email address." name="email" type="email" id="email" placeholder="Enter your email" class="border-slate-400 dark:border-slate-700" />
            {#each inputErrors?.email ?? [] as err}
                <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
            {/each}
        </div>

        <div class="">
            <Label for="password">Password</Label>
            <Input title="Enter your account password." name="password" type="password" id="password" placeholder="Enter your password" class="border-slate-400 dark:border-slate-700" />
            {#each inputErrors?.password ?? [] as err}
                <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
            {/each}
        </div>

    
        <div class="">
            <Label for="confirm_password">Confirm Password</Label>
            <Input title="Confirm your account password." name="confirm_password" type="password" id="confirm_password" placeholder="Confirm your password" class="border-slate-400 dark:border-slate-700" />
            {#each inputErrors?.confirm_password ?? [] as err}
                <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
            {/each}
        </div>

        <Button type="submit" title="Click to register your account." >
            <BtnWraper name="Register" loader={registerLoader} loader_name="Registering.." />
        </Button>

        <Separator class="mt-5 border-slate-400 dark:border-slate-700" />
        
        <div class="flex justify-between">
            <Button title="Click to log in your account." variant="link" on:click={() => goto("/sign-in")} >Log in here</Button>
        </div>

    </form> 

</div>