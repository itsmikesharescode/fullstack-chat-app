<script lang="ts">
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Button } from "$lib/components/ui/button";

    let showDialog = false;

</script>

<AlertDialog.Root bind:open={showDialog}>
    <AlertDialog.Trigger asChild let:builder>
        <Button builders={[builder]} class="w-full z-100" >Update</Button>
    </AlertDialog.Trigger>

    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
                This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
            </AlertDialog.Description>
        </AlertDialog.Header>

        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Continue</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
    
</AlertDialog.Root>