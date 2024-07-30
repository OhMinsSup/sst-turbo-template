<script lang="ts">
  import "../app.css";

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { invalidateAll, onNavigate } from "$app/navigation";
  import { rafInterval } from "$lib/svelte/lifecycle/raf-interval";

  import { AuthKitStatus } from "@template/authkit";
  import { isEmpty } from "@template/utils/assertion";

  import type { LayoutData } from "./$types";

  export let data: LayoutData;

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

  const refresh = async () => {
    try {
      await fetch("/api/auth/refresh", {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    } finally {
      await invalidateAll();
    }
  };

  const updateSession = async () => {
    if (!data.user || isEmpty(data.user)) {
      return;
    }

    switch (data.loggedInStatus) {
      case AuthKitStatus.Refreshed:
      case AuthKitStatus.LoggedIn: {
        await refresh();
        return;
      }
      default: {
        return;
      }
    }
  };

  rafInterval(
    updateSession, // 1분
    1000 * 60 * 1,
  );
</script>

<QueryClientProvider client={queryClient}>
  <slot></slot>
</QueryClientProvider>
