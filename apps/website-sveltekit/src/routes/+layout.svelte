<script lang="ts">
  import "../app.css";

  import { invalidate, invalidateAll, onNavigate } from "$app/navigation";
  import { rafInterval } from "$lib/svelte/lifecycle/raf-interval";

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
    if (!data.data || isEmpty(data.data)) {
      return;
    }

    const {
      data: { status },
    } = data;

    switch (status) {
      case "action:refreshed":
      case "action:loggedIn": {
        console.log("refreshing....", status);
        await invalidateAll();
        console.log("refreshed....", status);
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
