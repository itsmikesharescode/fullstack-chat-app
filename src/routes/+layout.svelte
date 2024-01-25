<script lang="ts">
    import Footer from "$lib/mycomp/Footer.svelte";
    import { ModeWatcher } from "mode-watcher";
    import "../app.pcss";
    import { Toaster } from "$lib/components/ui/sonner";
	import type { LayoutData } from "./$types";

</script>

<ModeWatcher />
<Toaster richColors={true} />

<div class="min-h-screen p-2">
    <slot/>
</div>

<Footer />