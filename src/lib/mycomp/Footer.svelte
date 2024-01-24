<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Sun, Moon } from "lucide-svelte";
  
    import { setMode, resetMode } from "mode-watcher";
</script>

<div class="flex items-center justify-between p-2 bg-stone-300 dark:bg-stone-900">
    <div class="flex flex-col sm:flex-row items-center">
        <p class="leading-7 [&:not(:first-child)]:mt-6 text-sm">Created and maintained by</p>
        <Button title="View my youtube channel?" variant="link" class="text-red-800 dark:text-red-500" on:click={() => window.open("https://www.youtube.com/@mikeSharesCode")}>@mikeSharesCode</Button>
    </div>

    <DropdownMenu.Root>
    
        <DropdownMenu.Trigger asChild let:builder>
            <Button builders={[builder]} variant="outline" size="icon">
            <Sun
                class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenu.Trigger>
    
        <DropdownMenu.Content align="end">
            <DropdownMenu.Item on:click={() => setMode("light")}
            >Light</DropdownMenu.Item
            >
            <DropdownMenu.Item on:click={() => setMode("dark")}>Dark</DropdownMenu.Item>
            <DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
        </DropdownMenu.Content>
    
    </DropdownMenu.Root>
</div>