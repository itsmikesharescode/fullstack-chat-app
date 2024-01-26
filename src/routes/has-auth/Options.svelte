<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
  
  
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button variant="ghost" builders={[builder]} class="z-10">* * *</Button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content class="flex flex-col gap-2">
    
        <Button variant="destructive">Delete Chat</Button>
        <Button>Update</Button>
       
    </DropdownMenu.Content>

</DropdownMenu.Root>