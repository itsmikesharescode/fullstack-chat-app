<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator";
    import {goto} from "$app/navigation";
	import { scale } from "svelte/transition";
	import BtnWraper from "$lib/mycomp/BtnWraper.svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { ServerNews } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { enhance } from "$app/forms";

    type ForgotVal = {
        email: string[]
    };

    type ForgotNews = {
        msg: string
        errors: ForgotVal
    };

    let inputErrors: ForgotVal | null = null;
    let forgotLoader = false;

    const forgotNews: SubmitFunction = () => 
    {
        forgotLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {msg, errors} } = result as ServerNews<ForgotNews>
                
            switch (status) {
                case 200:
                    toast.success("Password reset link sent", {description: msg});
                    forgotLoader = false;
                    break;
                
                case 402:
                    toast.error("Password reset failed", {description: msg});
                    forgotLoader = false;
                    inputErrors = null;
                    break;
                
                case 403:
                    inputErrors = errors;
                    forgotLoader = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };

</script>

<div class="min-h-screen flex flex-col justify-center" in:scale>

    <form method="POST" action="?/forgot" enctype="multipart/form-data" use:enhance={forgotNews}
    class="w-full sm:w-[400px] mx-auto p-4 flex flex-col gap-2">

        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">Forgot Password</h3>
        <small class="text-center text-green-700 font-bold dark:text-green-500">A password reset link will be sent to your email</small>
        <div class="">
            <Label for="email">Email</Label>
            <Input title="Enter your account email address." name="email" type="email" id="email" placeholder="Enter your email" class="border-slate-400 dark:border-slate-700" />
            {#each inputErrors?.email ?? [] as err}
                <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
            {/each}
        </div>
    
        <Button type="submit" title="Click to send password reset link to your email." >
            <BtnWraper name="Send Password Reset" loader={forgotLoader} loader_name="Sending.." />
        </Button>

        <Separator class="mt-5 border-slate-400 dark:border-slate-700" />
        
        <div class="flex justify-between">
            <Button title="Click to log in your account." variant="link" on:click={() => goto("/sign-in")} >Log in here</Button>
        </div>

    </form> 

</div>