<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/components/ui/button/button.svelte";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import BtnWraper from "$lib/mycomp/BtnWraper.svelte";
	import type { ServerNews } from "$lib/types";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { toast } from "svelte-sonner";

    type SendChatVal = {
        send_chat: string[]
    };
    
    type SendChatNews = {
        msg: string
        errors: SendChatVal
    };

    let sendChatLoader = false;
    let inputErrors: SendChatVal | null = null;
    let chatVal = "";

    const sendChatNews: SubmitFunction = () => 
    {
        sendChatLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {msg, errors}} = result as ServerNews<SendChatNews>
                
            switch (status) {
                case 200:
                    toast.success("Chat sent", {description: msg});
                    sendChatLoader = false;
                    chatVal = "";
                    inputErrors = null;
                    break;
                
                case 402:
                    toast.error("Chat failed", {description: msg});
                    sendChatLoader = false;
                    inputErrors = null;
                    break;
                
                case 403:
                    inputErrors = errors;
                    sendChatLoader = false;
                    break;
                default:
                    break;
            };
            await update();
        };
    };

</script>

<form method="POST" action="?/sendChat" enctype="multipart/form-data" use:enhance={sendChatNews}
class="flex flex-col w-full justify-end gap-2 mt-5">

    <Textarea name="send_chat" placeholder="Type your message here." class="border-slate-400 dark:border-slate-700 shadow-lg" bind:value={chatVal} />

    {#each inputErrors?.send_chat ?? [] as err}
        <small class="text-sm px-2 font-medium leading-none text-red-500">{err}</small>
    {/each}
    <div class="flex justify-end">
        <Button type="submit">
            <BtnWraper name="Send" loader={sendChatLoader} loader_name="Sending.." />
        </Button>
    </div>
</form>