<template>
  <div class="d-flex flex-column align-items-center">
    <button @click="onCreateGame">Host new game</button>
    <button @click="onCreateTestGame">Host test game</button>
    <button @click="joinTestGame">player test game</button>
  </div>
</template>

<script lang="ts">
import { sleep } from "@/utilities/utilities";
import { service } from "../service/service";
import MaerskIcon from "../assets/icons/IconMaersk.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    MaerskIcon
  },
  props: {
    title: String,
    ip: String
  },
  methods: {
    async onCreateGame() {
      const inviteCode = await service.createGame();
      this.$router.push({ path: `/games/${inviteCode}/lobby` });
    },
    onCreateTestGame() {
      // const inviteCode = await service.createTestGame();
      // this.$router.push({ path: `/games/${inviteCode}/lobby` });
    },
    joinTestGame() {
      // const inviteCode = await service.joinTestGame();
      // await sleep(1000);
      // this.$router.push({ path: `/games/${inviteCode}` });
    }
  }
})
</script>
