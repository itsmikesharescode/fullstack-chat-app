<script lang="ts">
    import { page } from "$app/stores";
	import ForgotPass from "./ForgotPass.svelte";
	import Login from "./Login.svelte";
	import Register from "./Register.svelte";

</script>

{#if $page.url.search === "?register"}
    <Register />
{:else if $page.url.search === "?forgot"}
    <ForgotPass />
{:else}
    <Login />
{/if}
