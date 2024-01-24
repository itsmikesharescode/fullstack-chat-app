<script lang="ts">
	import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";

</script>

<div class="min-h-[100dvh] flex  justify-center items-center p-4">
    <Card.Root class="w-[560px] border-slate-400 dark:border-slate-700 shadow-lg">
    
        <Card.Header>
            <Card.Title class="">Simple Chat App</Card.Title>
        </Card.Header>
    
        <Card.Content>
            <p class="leading-7 [&:not(:first-child)]:mt-6">
                Lonely nights got you swiping left in despair?  Ditch the endless profiles and awkward bios with our revolutionary chat app! Connect instantly with real people, just like you, without the pressure of algorithms or picture-perfect selfies. ✨
            </p>
        </Card.Content>
    
        <Card.Footer class="flex justify-end">
            <Button on:click={() => goto("/sign-in")}>Proceed</Button>
        </Card.Footer>
    
    </Card.Root>
</div>