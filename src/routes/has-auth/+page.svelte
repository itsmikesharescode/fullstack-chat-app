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
	import { chatsArray, navState, notif, scrollVal } from "$lib";
	import SendChat from "./SendChat.svelte";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";
	import { dateConvert } from "$lib/helpers/convertDate";
	import { scale, fly, fade } from "svelte/transition";
    import {bounceInOut} from "svelte/easing";
    import { ArrowDown } from 'lucide-svelte';
    import { MessageSquare } from 'lucide-svelte';
	import type { Message_List } from "$lib/types";
	
    export let data: PageData;

    const getChats = async () => 
    {
        const qChats = "id, created_at, user_email, user_display_name, user_message, is_updated";

        const {data:allChats, error:allChatsError} = await data.supabase.from("message_list").select(qChats).order("created_at", {ascending: true});

        chatsArray.set(allChats);        

    };
   
    onMount( async () => {
        
        $navState.session = data.session;

        await getChats();

        if($scrollVal){
            $scrollVal.scrollTop = $scrollVal.scrollHeight;
        };


    });

    let msgCount = 0;
    let showArrowDown = false;

    //notif window if there is new chat whil scroll to top
    const handleScroll = () =>
    {
        showArrowDown = $scrollVal.scrollTop < $scrollVal.scrollHeight - $scrollVal.clientHeight - 10;

        showArrowDown ? "" : msgCount = 0;
    };


    const channels = data.supabase.channel('custom-all-channel')
    .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'message_list' },
        async (payload) => {

            if(payload.eventType === "INSERT"){
                msgCount++
                if($scrollVal.scrollHeight > $scrollVal.clientHeight) showArrowDown = true;
            };

            await getChats();

            const {user_email} = payload.new as any;

            if(user_email === $navState.session?.user.email) $scrollVal.scrollTop = $scrollVal.scrollHeight;
            
        }
    )
    .subscribe();

   
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
            <div class="h-[70dvh] py-5 overflow-auto flex flex-col gap-2" on:scroll={handleScroll} bind:this={$scrollVal}>
                {#each $chatsArray ?? [] as chats }
                    <div class="flex flex-col break-words" in:fly={{x:100, duration: 400, easing: bounceInOut}}>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <Avatar.Root>
                                    <Avatar.Image src="https://i.pinimg.com/236x/f8/86/53/f886538d352ab338162dee243651ed0c.jpg" alt="@mikeyIcon" />
                                    <Avatar.Fallback>CN</Avatar.Fallback>
                                </Avatar.Root>
                                
                                <div class="">
                                    <p class="font-bold">{chats.user_display_name}</p>
                                    <small class="text-sm font-medium leading-none opacity-50">{dateConvert(chats.created_at)}</small>
                                </div>
                                
                                {#if chats.is_updated}
                                    <div class="">
                                        <small class="opacity-50 sm:ml-5">Edited</small>
                                    </div>
                                {/if}
                            </div>

                            {#if $navState.session?.user.email == chats.user_email}
                                <div class="sm:mr-5">
                                    <Options chats={chats} />
                                </div>
                            {/if}
                            
                            
                        </div>

                    
                        <p class="leading-7 [&:not(:first-child)]:mt-0 text-sm">{chats.user_message}</p>
                        
                        <Separator class="mt-5 border-slate-400 dark:border-slate-700" />
                    </div>
                {/each}
            </div>
            
            <div class="absolute left-0 right-0 flex justify-center"> 
                {#if showArrowDown}
                    {#if msgCount}
                        <button class="p-2 rounded-lg backdrop-lg bg-green-500 dark:bg-green-700 text-white font-bold flex items-center transition-all animate-bounce hover:animate-none" on:click={() => {
                            showArrowDown = false;
                            $scrollVal.scrollTop = $scrollVal.scrollHeight;
                            msgCount = 0;
                        }}>
                            <p>{msgCount} {msgCount > 1 ? "New Messages" : "New Message"}</p>
                            <MessageSquare />
                        </button>
                    {:else}
                        <button class="p-2 rounded-lg backdrop-lg bg-green-500 dark:bg-green-700 text-white font-bold flex items-center transition-all animate-bounce hover:animate-none" on:click={() => {
                            showArrowDown = false;
                            $scrollVal.scrollTop = $scrollVal.scrollHeight;
                            msgCount = 0;
                        }} >
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
