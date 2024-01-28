<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
	import type { Message_List, ServerNews } from "$lib/types";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
    import BtnWraper from "$lib/mycomp/BtnWraper.svelte";
	import { toast } from "svelte-sonner";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import { MoreHorizontal } from 'lucide-svelte';
	
    export let chats: Message_List;

    
    let deleteLoader = false;
    let showDropDown = false;
    let updateDialog = false;
    
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

    type UpdateVal = {
        update_chat: string[]
    };

    let inputErrors: UpdateVal | null = null;
    let updateLoader = false;

    const updateNews: SubmitFunction = () => 
    {
        updateLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {msg, errors} } = result as ServerNews<{msg: string, errors: UpdateVal}>
                
            switch (status) {
                case 200:
                    toast.success("Update success", {description: msg});
                    updateDialog = false;
                    inputErrors = null;
                    updateLoader = false;
                    
                    break;
                
                case 402:
                    toast.error("Update failed", {description: msg});
                    inputErrors = null;
                    updateLoader = false;
                    
                    break;
                
                case 403:
                    inputErrors = errors;
                    updateLoader = false;
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
        <Button variant="ghost" builders={[builder]} class=""><MoreHorizontal /></Button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content class="flex flex-col gap-2">

        <form method="POST" action="?/deleteChat" enctype="multipart/form-data" use:enhance={deleteNews}>
            <input name="chat_id" type="hidden" class="hidden" value={chats.id} />
            <Button type="submit" variant="destructive" class="w-full">
                <BtnWraper name="Delete Chat" loader={deleteLoader} loader_name="Deleting.." />
            </Button>
        </form>

        <Button on:click={() => {
            showDropDown = false;
            updateDialog = true;
        }} >Update</Button>
       
    </DropdownMenu.Content>

</DropdownMenu.Root>



<AlertDialog.Root bind:open={updateDialog}>

    
        <AlertDialog.Content class="border-slate-400 dark:border-slate-700">

            <form method="POST" action="?/updateChat" enctype="multipart/form-data" use:enhance={updateNews}> 

                <AlertDialog.Header>
                    <AlertDialog.Title class="">Update your chat?</AlertDialog.Title>
                    <AlertDialog.Description class="flex flex-col gap-2">
                        This action cannot be undone. This will permanently update your chat.
                        <Textarea name="update_chat" placeholder="Type your message here." class="border-slate-400 dark:border-slate-700 shadow-lg" />
                        {#each inputErrors?.update_chat ?? [] as err}
                            <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
                        {/each}
                        <input type="hidden" class="hidden" value={chats.id} name="chat_id" />

                    </AlertDialog.Description>
                </AlertDialog.Header>

                <AlertDialog.Footer class="mt-5">
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    
                    <Button type="submit" >
                        <BtnWraper name="Continue Update" loader={updateLoader} loader_name="Updating.." />
                    </Button>
                    
                </AlertDialog.Footer>

            </form>

        </AlertDialog.Content>
    
</AlertDialog.Root>
