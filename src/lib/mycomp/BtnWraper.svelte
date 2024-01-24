<script lang="ts">

    import { Loader2 } from "lucide-svelte";

    export let name = "your name";
    export let loader = false;
    export let loader_name = "loading...";

</script>

<div class="truncate">
    {#if loader} 
        <div class="flex items-center gap-1 w-full justify-center">
            {loader_name}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        </div>
    {:else}
        {name}
    {/if}
</div>