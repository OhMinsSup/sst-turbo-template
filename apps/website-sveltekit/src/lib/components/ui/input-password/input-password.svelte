<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { Icons } from "$lib/components/icon/index.js";
  import { Button } from "$lib/components/ui/button";
  import { cn } from "$lib/utils.js";
  import { EyeOff } from "lucide-svelte";

  import type { InputEvents } from "./index.js";

  type $$Props = Omit<HTMLInputAttributes, "type">;
  type $$Events = InputEvents;

  let className: $$Props["class"] = undefined;
  let showPassword = false;
  export let value: $$Props["value"] = undefined;
  export { className as class };

  // Workaround for https://github.com/sveltejs/svelte/issues/9305
  // Fixed in Svelte 5, but not backported to 4.x.
  export let readonly: $$Props["readonly"] = undefined;

  const onClickInputType = () => {
    showPassword = !showPassword;
  };
</script>

<div class="relative rounded-md">
  {#if showPassword}
    <input
      type="text"
      class={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      bind:value
      {readonly}
      on:blur
      on:change
      on:click
      on:focus
      on:focusin
      on:focusout
      on:keydown
      on:keypress
      on:keyup
      on:mouseover
      on:mouseenter
      on:mouseleave
      on:mousemove
      on:paste
      on:input
      on:wheel|passive
      {...$$restProps}
    />
  {:else}
    <input
      type="password"
      class={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      bind:value
      {readonly}
      on:blur
      on:change
      on:click
      on:focus
      on:focusin
      on:focusout
      on:keydown
      on:keypress
      on:keyup
      on:mouseover
      on:mouseenter
      on:mouseleave
      on:mousemove
      on:paste
      on:input
      on:wheel|passive
      {...$$restProps}
    />
  {/if}

  <Button
    type="button"
    variant="ghost"
    size="icon"
    class="absolute right-1 top-1/2 size-6 -translate-y-1/2 rounded-md text-muted-foreground"
    on:click={onClickInputType}
  >
    {#if showPassword}
      <Icons.eye />
    {:else}
      <Icons.eyeOff />
    {/if}
  </Button>
</div>
