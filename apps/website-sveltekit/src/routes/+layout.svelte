<script lang="ts">
  import "../app.css";

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { invalidate, onNavigate } from "$app/navigation";
	import { onMount } from 'svelte';

  import type { LayoutData } from "./$types";

  export let data: LayoutData;
	$: ({ session, authenticates } = data);
  const queryClient = new QueryClient();

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });


	onMount(() => {
		const { data: { subscription } } = authenticates.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('authenticates:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

</script>

<QueryClientProvider client={queryClient}>
  <slot></slot>
</QueryClientProvider>
