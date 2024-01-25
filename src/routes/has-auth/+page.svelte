<script lang="ts">
	import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Separator } from "$lib/components/ui/separator";
    import * as Avatar from "$lib/components/ui/avatar";
	import Options from "./Options.svelte";
	import { enhance } from "$app/forms";
	import Logout from "./Logout.svelte";
	import { chatsArray, navState } from "$lib";
	import SendChat from "./SendChat.svelte";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";
	import type { Message_List } from "$lib/types";
	import { dateConvert } from "$lib/helpers/convertDate";
	
    export let data: PageData;

    const getChats = async () => 
    {
        const qChats = "id, created_at, user_email, user_display_name, user_message";

        const {data:allChats, error:allChatsError} = await data.supabase.from("message_list").select(qChats);

        chatsArray.set(allChats);
    }
    
    onMount( async () => {
        
        $navState.session = data.session;

        const channels = data.supabase.channel('custom-all-channel')
        .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'message_list' },
        async (payload) => {
            await getChats();
        }
        )
        .subscribe();

        await getChats();

    });


</script>

<div class="min-h-[100dvh] flex  justify-center items-center p-4">
    <Card.Root class="w-full">
    
        <Card.Header class="">

            <Card.Title class="flex items-center justify-between">

                <div class="">
                    Welcome <b class="text-green-600">{$navState.session?.user.user_metadata.display_name}</b>
                </div>
                
                <Logout />
            </Card.Title>

        </Card.Header>

        <Separator class=" border-slate-400 dark:border-slate-700" />
    
        <Card.Content class="h-[70dvh] py-5 overflow-auto flex flex-col gap-2">
            
            {#each $chatsArray ?? [] as chats }
                <div class="flex flex-col">

                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Avatar.Root>
                                <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
                                <Avatar.Fallback>CN</Avatar.Fallback>
                            </Avatar.Root>
                            
                            <div class="">
                                <p class="font-bold">{chats.user_display_name}</p>
                                <small class="text-sm font-medium leading-none opacity-50">{dateConvert(chats.created_at)}</small>
                            </div>
                        </div>

                        <Options />
                        
                    </div>

                    <p class="leading-7 [&:not(:first-child)]:mt-2 text-sm">{chats.user_message}</p>
                    <Separator class="mt-5 border-slate-400 dark:border-slate-700" />
                </div>
            {/each}

            

        </Card.Content>
        
        <Separator class="mt-5 border-slate-400 dark:border-slate-700" />
        
       
      
        <Card.Footer>
        
            <SendChat />
        </Card.Footer>
        
    
    </Card.Root>
</div>