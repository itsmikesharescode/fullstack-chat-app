<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
	import type { Message_List, ServerNews } from "$lib/types";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
    import BtnWraper from "$lib/mycomp/BtnWraper.svelte";
	import { toast } from "svelte-sonner";
	import Update from "./Update.svelte";
	
    export let chats: Message_List;

    
    let deleteLoader = false;
    let showDropDown = false;
    
    const deleteNews: SubmitFunction = () => 
    {
        deleteLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {msg} } = result as ServerNews<{msg: string}>
                
            switch (status) {
                case 200:
                    toast.success("Delete success", {description: msg});
                    deleteLoader = false;
                    showDropDown = false;
                    break;
                
                case 402:
                    toast.error("Delete failed", {description: msg});
                    deleteLoader = false;
                    break;
                default:
                    break;
            };
            await update();
        };
    };
  
  
</script>

<DropdownMenu.Root bind:open={showDropDown}>
    <DropdownMenu.Trigger asChild let:builder>
        <Button variant="ghost" builders={[builder]} class="z-10">* * *</Button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content class="flex flex-col gap-2">

        <form method="POST" action="?/deleteChat" enctype="multipart/form-data" use:enhance={deleteNews}>
            <input name="chat_id" type="hidden" class="hidden" value={chats.id} />
            <Button type="submit" variant="destructive" class="w-full">
                <BtnWraper name="Delete Chat" loader={deleteLoader} loader_name="Deleting.." />
            </Button>
        </form>

        <Button on:click={() => alert("Lazy but the concept the same just delete it haha")} >Update</Button>
       
    </DropdownMenu.Content>

</DropdownMenu.Root>