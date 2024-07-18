<script lang="ts">
  import "../app.css";

  import { invalidate, invalidateAll, onNavigate } from "$app/navigation";
  import { rafInterval } from "$lib/svelte/lifecycle/raf-interval";

  import { AuthKitStatus } from "@template/authkit";
  import { isEmpty } from "@template/utils/assertion";

  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  const updateSession = async () => {
    if (!data.user || isEmpty(data.user)) {
      return;
    }

    switch (data.loggedInStatus) {
      case AuthKitStatus.Refreshed:
      case AuthKitStatus.LoggedIn: {
        await invalidate((url) => url.pathname === "/");
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

<slot></slot>
