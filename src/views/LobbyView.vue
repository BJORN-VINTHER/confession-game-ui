<script lang="ts">
import type { Player } from "@/service/dtos";
import { defineComponent } from "vue";
import { service } from "../service/service";

export default defineComponent({
  data() {
    const players: Player[] = [];
    return {
      players,
    };
  },
  methods: {
    async startGame() {
      this.$router.push({
        path: `/games/${this.$route.params.gameId}/overview`,
      });
    },
  },
  async mounted() {
    const gameState = await service.getGameState(this.gameId);
    this.players = gameState.players;

    service.io.onPlayerJoined((player) => {
      console.log("Player joined game", player.name);
      this.players.push(player);
    });
  },
  computed: {
    gameId(): string {
      return this.$route.params.gameId as string;
    },
  },
});
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <h1>Join game</h1>

    <a class="small-text">{{
      `https://green-sand-0c2c0b503.1.azurestaticapps.net/game/${$route.params.gameId}/join`
    }}</a>

    <button class="mt-5" @click="startGame">Start game</button>

    <h4 style="margin-top: 50px">{{ players.length }} players joined</h4>
    <div
      class="d-flex flex-row flex-wrap justify-content-center align-items-start player-container"
    >
      <span
        class="d-flex flex-1 player-name"
        v-for="player in players"
        :key="player.ip"
        >{{ player.name }}</span
      >
    </div>
  </div>
</template>

<style>
.player-name {
  border: coral solid 4px;
  padding: 5px 20px;
  border-radius: 10px;
  background: white;
  margin: 10px 40px;
}
.player-container {
  max-width: 90%;
  width: 100%;
  min-height: 300px;
  margin: 20px;
  padding: 30px;
  background: #b3e3f3;
  color: #222;
  border-radius: 5px;
}
</style>
