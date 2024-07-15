<script lang="ts">
  import { SignupForm } from "$lib/components/auth/SignupForm";

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<SignupForm {data} />
