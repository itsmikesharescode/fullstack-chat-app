<script lang="ts">
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";
	import Button from "$lib/components/ui/button/button.svelte";
	import { scale } from "svelte/transition";
	import ForgotPass from "./ForgotPass.svelte";
	import Login from "./Login.svelte";
	import Register from "./Register.svelte";

</script>

<div class="" transition:scale>

    {#if $page.url.search === "?register"}
        <Register />
    {:else if $page.url.search === "?forgot"}
        <ForgotPass />
    {:else}
        <Login />
    {/if}

    <div class="w-full sm:w-[400px] mx-auto p-4 flex flex-col gap-2">
        <Button title="Click to go back home." variant="link" on:click={() => goto("/")} >Back to home?</Button>
    </div>
</div>
