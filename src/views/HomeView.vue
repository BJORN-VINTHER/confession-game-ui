<template>
  <div class="d-flex flex-column align-items-center">
    <button @click="onCreateGame">Host new game</button>
    <button @click="onTestConnection">Test socket connection</button>
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
      const gameId = await service.createGame();
      // await service.joinGame(gameId);
      this.$router.push({ path: `/games/${gameId}/lobby` });
    },
    async onTestConnection() {
      await service.joinGame("1000", "Test user");
      await service.connect("1000");
      service.io.onTestResponse(message => {
        console.log("Recieved server response: " + message)
      })
      service.io.testEmit("Client test message");
      console.log("Sent message: " + "Client test message")
    },
    joinTestGame() {
      // const inviteCode = await service.joinTestGame();
      // await sleep(1000);
      // this.$router.push({ path: `/games/${inviteCode}` });
    }
  }
})
</script>
