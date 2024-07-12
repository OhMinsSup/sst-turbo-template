<script>
  import { afterNavigate } from "$app/navigation";

  import "./styles.css";

  afterNavigate(() => {
    console.log("Navigated to a new page");
  });
</script>

<slot></slot>
