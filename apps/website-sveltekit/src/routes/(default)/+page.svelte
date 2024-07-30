<script lang="ts">
  import { onMount } from "svelte";
  import { trpcClient } from "$lib/trpc/client";

  import type { PageData } from "./$types";

  export let data: PageData;
  let clientMessage = "";

  onMount(async () => {
    console.log("onMount");
    const message = await trpcClient.etc.hello.query();
    console.log(message);
    clientMessage = message;
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<div class="flex items-center justify-center">{data?.loggedInStatus}</div>
<div class="flex items-center justify-center">{data?.message}</div>
<div class="flex items-center justify-center">{clientMessage}</div>
