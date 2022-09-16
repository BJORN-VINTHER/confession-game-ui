<template>
  <div class="d-flex flex-column align-items-center">
    <button @click="onCreateGame">Host new game</button>
    <!-- <button @click="onTestConnection">Test socket connection</button> -->
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
      const gameId = await service.createGame();
      // await service.joinGame(gameId);
      this.$router.push({ path: `/games/${gameId}/join` });
    },
    async onTestConnection() {
      // await service.joinGame("1000", "Test user");
      // await service.connect();
      // service.io.onTestResponse(message => {
      //   console.log("Recieved server response: " + message)
      // })
      // service.io.testEmit("Client test message");
      // console.log("Sent message: " + "Client test message")
    },
  }
})
</script>
