<template>
  <div
    id="header"
    class="d-flex flex-row justify-content-center align-items-center"
  >
    <MaerskIcon />
    <div id="title" class="ml-4">
      {{ title }}
    </div>
    <!-- <div id="ip-text" class="ml-4">
      {{ ip }}
    </div> -->
  </div>
</template>

<script lang="ts">
import { def } from "@vue/shared";
import { defineComponent } from "vue";
import MaerskIcon from "../assets/icons/IconMaersk.vue";

export default defineComponent({
  components: {
    MaerskIcon
  },
  props: {
    title: String,
    ip: String
  }
}
)
</script>

<style scoped>
#header {
  padding: 20px 20px;
  font-size: 20pt;
  background-color: white;
  color: #222;
}
#logo {
  transform: scale(1.4);
  width: 40px;
  height: 40px;
}
#ip-text {
  font-family: "Calibri", "Times New Roman", Times, serif;
  color: #9aacb9;
  font-size: 1rem;
}
</style>
