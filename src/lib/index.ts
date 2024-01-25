import type { Session } from "@supabase/supabase-js";
import {writable} from "svelte/store";
import type { Message_List } from "./types";

export const navState = writable({
    session:<Session | null> null
})

export const chatsArray = writable<Message_List[] | null>(null);