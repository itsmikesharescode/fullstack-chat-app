<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";
	import BtnWraper from "$lib/mycomp/BtnWraper.svelte";
	import type { ServerNews } from "$lib/types";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { toast } from "svelte-sonner";


    let logoutLoader = false;

    const logoutNews: SubmitFunction = () => 
    {
        logoutLoader = true;

        return async ({ result, update }) => 
        {
            const {status, data: {msg}} = result as ServerNews<{msg: string}>
                
            switch (status) {
                case 200:
                    toast.success("Logout success", {description: msg});
                    invalidateAll();
                    logoutLoader = false;
                    break;
                
                case 402:
                    toast.error("Logout failed", {description: msg});
                    logoutLoader = false;
                    break;
    
                default:
                    break;
            };
            await update();
        };
    };


</script>

<form method="POST" action="/sign-in?/logout" enctype="multipart/form-data" use:enhance={logoutNews}> 
    <Button type="submit" variant="destructive">
        <BtnWraper name="Log out" loader={logoutLoader} loader_name="Logging out.." />
    </Button>
</form>