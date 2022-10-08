<template>
  <div class="d-flex flex-column align-items-center">
    <button @click="onCreateGame">Host new game</button>
    <button @click="onSimulate">Simulate</button>
  </div>
</template>

<script lang="ts">
import { httpPost, sleep } from "@/utilities/utilities";
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
      const gameId = await service.createGame();
      this.$router.push({ path: `/games/${gameId}/join` });
    },
    async onSimulate() {
      // create game
      const baseUrl: string = "http://localhost:4000";
      const gameId = await service.createGame();
      await service.joinGame(gameId, "Simulated player");

      // simulate lobby
      this.$router.push({ path: `/games/${gameId}/lobby` });
      await sleep(500);
      await httpPost(`${baseUrl}/games/${gameId}/simulate-lobby`, {});
      await sleep(1000);

      // simulate round 1
      this.$router.push({ path: `/games/${gameId}/overview` });
      await sleep(500);
      // await httpPost(`${baseUrl}/games/${gameId}/simulate-round`, {});
    },
  }
})
</script>
