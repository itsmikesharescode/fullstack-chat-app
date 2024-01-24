<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator";
    import {goto} from "$app/navigation";
	import { scale } from "svelte/transition";

</script>

<div class="min-h-screen flex flex-col justify-center" in:scale>
    <div class="w-full sm:w-[400px] mx-auto p-4 flex flex-col gap-2">
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">Forgot Password</h3>
        <div class="">
            <Label for="email">Email</Label>
            <Input title="Enter your account email address." name="email" type="email" id="email" placeholder="Enter your email" class="border-slate-400 dark:border-slate-700" />
        </div>
    
        <Button title="Click to send password reset link to your email." >Send Password Reset</Button>

        <Separator class="mt-5 border-slate-400 dark:border-slate-700" />
        
        <div class="flex justify-between">
            <Button title="Click to log in your account." variant="link" on:click={() => goto("/sign-in")} >Log in here</Button>
        </div>

    </div> 
</div>