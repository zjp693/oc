<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
html,
body,
#app,
uni-page-body {
  height: 100%;
  overflow: hidden;
  overscroll-behavior: none;
}

page {
  overscroll-behavior: none;
}
</style>
