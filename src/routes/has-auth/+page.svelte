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
	import { chatsArray, navState, notif } from "$lib";
	import SendChat from "./SendChat.svelte";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";
	import { dateConvert } from "$lib/helpers/convertDate";
	import { scale } from "svelte/transition";
    import { ArrowDown } from 'lucide-svelte';
    import { MessageSquare } from 'lucide-svelte';
	
    export let data: PageData;

    const getChats = async () => 
    {
        const qChats = "id, created_at, user_email, user_display_name, user_message";

        const {data:allChats, error:allChatsError} = await data.supabase.from("message_list").select(qChats).order("created_at", {ascending: false});

        chatsArray.set(allChats);
    };
   
    onMount( async () => {
        
        $navState.session = data.session;

        await getChats();

    });

    let msgCount = 0;
    let showArrowDown = false;
    let elementScrollValue: HTMLDivElement;

    const channels = data.supabase.channel('custom-all-channel')
    .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'message_list' },
        async (payload) => {
            msgCount++
            await getChats();
            console.log("AW")
            
        }
    )
    .subscribe();

    //notif window if there is new chat whil scroll to top
    const handleScroll = () =>
    {
        Math.abs(elementScrollValue.scrollTop) > 120 ? showArrowDown = true : (showArrowDown = false, msgCount = 0);

        
    };

   
</script>

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
    
        <Card.Content>
            <div class="h-[70dvh] py-5 overflow-auto flex flex-col-reverse gap-2" on:scroll={handleScroll} bind:this={elementScrollValue}>
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

                            <Options {chats} />
                            
                            
                        </div>

                    
                        <p class="leading-7 [&:not(:first-child)]:mt-0 text-sm">{chats.user_message}</p>
                        
                        <Separator class="mt-5 border-slate-400 dark:border-slate-700" />
                    </div>
                {/each}
            </div>
            

            
            <div class="absolute left-0 right-0 flex justify-center" in:scale>
             
                <!-- <button class="p-2 rounded-lg backdrop-lg bg-[#5933c250]">{displayNewMsg} New Message</button> -->
              
                {#if showArrowDown}
                    {#if msgCount}
                        <button class="p-2 rounded-lg backdrop-lg bg-green-500 dark:bg-green-700 text-white font-bold flex items-center transition-all animate-bounce hover:animate-none" on:click={() => {
                            elementScrollValue.scrollTop = 0;
                            msgCount = 0;
                        }}>
                            <p>{msgCount} {msgCount > 1 ? "New Messages" : "New Message"}</p>
                            <MessageSquare />
                        </button>
                    {:else}
                        <button class="p-2 rounded-lg backdrop-lg bg-green-500 dark:bg-green-700 text-white font-bold flex items-center transition-all animate-bounce hover:animate-none" on:click={() => elementScrollValue.scrollTop = 0} >
                            <p>Go down</p>
                            <ArrowDown />
                        </button>
                    {/if}
                {/if}
                
               
            </div>

        </Card.Content>
        
        <Separator class=" border-slate-400 dark:border-slate-700" />
        
        <Card.Footer>
        
            <SendChat />
        </Card.Footer>
        
    
    </Card.Root>
