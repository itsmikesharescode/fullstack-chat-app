<script lang="ts">
    import Footer from "$lib/mycomp/Footer.svelte";
    import { ModeWatcher } from "mode-watcher";
    import "../app.pcss";
    
</script>
<ModeWatcher />
<div class="min-h-screen p-2">
    <slot/>
</div>

<Footer />