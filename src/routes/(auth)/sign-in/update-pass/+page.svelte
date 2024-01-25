<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator";
    import {goto, invalidateAll} from "$app/navigation";
	import { scale } from "svelte/transition";
	import BtnWraper from "$lib/mycomp/BtnWraper.svelte";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { Session } from "@supabase/supabase-js";
	import type { ServerNews } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { navState } from "$lib";

    type ResetPassVal = {
        new_password: string[]
        confirm_new_password: string[]
    };

    type ResetPassNews = {
        msg: string
        errors: ResetPassVal
    };

    let inputErrors: ResetPassVal | null = null;
    let resetPassLoader = false;

    const resetPassNews: SubmitFunction = () => 
    {
        resetPassLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {msg, errors} } = result as ServerNews<ResetPassNews>
                
            switch (status) {
                case 200:
                    toast.success("Password reset success", {description: msg});
                    invalidateAll();
                    resetPassLoader = false;
                    break;
                
                case 402:
                    toast.error("Password reset failed", {description: msg});
                    resetPassLoader = false;
                    inputErrors = null;
                    break;
                
                case 403:
                    inputErrors = errors;
                    resetPassLoader = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };

   
</script>

<div class="min-h-screen flex flex-col justify-center" in:scale>

    <form method="POST" enctype="multipart/form-data" use:enhance={resetPassNews}
    class="w-full sm:w-[400px] mx-auto p-4 flex flex-col gap-2">
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">Password Reset </h3>
        <div class="">
            <Label for="new_password">New Password</Label>
            <Input title="Enter your new password" name="new_password" type="password" id="new_password" placeholder="Enter your new password" class="border-slate-400 dark:border-slate-700" />
            {#each inputErrors?.new_password ?? [] as err}
                <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
            {/each}
        </div>
    
        <div class="">
            <Label for="confirm_new_password">Confirm New Passsword</Label>
            <Input title="Make sure to confirm your new password." name="confirm_new_password" type="password" id="confirm_new_password" placeholder="Confirm your new password" class="border-slate-400 dark:border-slate-700" />
            {#each inputErrors?.confirm_new_password ?? [] as err}
                <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
            {/each}
        </div>

        <Button type="submit" title="Click to login." >
            <BtnWraper name="Update" loader={resetPassLoader} loader_name="Updating.." />
        </Button>

        <Separator class="mt-5 border-slate-400 dark:border-slate-700" />
 
    </form> 
    
</div>