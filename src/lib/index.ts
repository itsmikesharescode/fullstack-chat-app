import type { Session } from "@supabase/supabase-js";
import {writable} from "svelte/store";

export const navState = writable({
    session:<Session | null> null
})