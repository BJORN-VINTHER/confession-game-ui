<template>
  <div class="d-flex flex-column align-items-center">
    <h1>Join game</h1>

    <div class="d-flex flex-row m-5">
      Player name:
      <input v-model="playerName" class="ml-3" type="text" maxlength="25" />
    </div>

    <button :disabled="!isValidName" @click="joinGame">Join</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { service } from "../service/service";

export default defineComponent({
  data() {
    return {
      playerName: "",
    };
  },
  async mounted() {
    const gameState = await service.getGameState(this.gameId);
    if (gameState.players.some(x => x.ip === service.ip)) {
      this.$router.push({ path: `/games/${this.gameId}` });
    }
  },
  methods: {
    async joinGame() {
      const gameState = await service.getGameState(this.gameId);
      await service.joinGame(this.gameId, this.playerName.trim());
      if (gameState.hostIp === service.ip) {
        this.$router.push({ path: `/games/${this.gameId}/lobby` });
      } else {
        this.$router.push({ path: `/games/${this.gameId}` });
      }
    },
  },
  computed: {
    isValidName(): boolean {
      return this.playerName.trim().length >= 2;
    },
    gameId(): string {
      return this.$route.params.gameId as string
    }
  },
})
</script>

<style></style>
