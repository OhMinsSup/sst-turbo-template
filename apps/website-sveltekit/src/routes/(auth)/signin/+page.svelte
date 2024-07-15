<script lang="ts">
  import { SignInForm } from "$lib/components/auth/SignInForm";

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<SignInForm {data} />
