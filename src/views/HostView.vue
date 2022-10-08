<script lang="ts">
import { sleep } from "../utilities/utilities";
import Timer from "../components/Timer.vue";
import Quote from "../components/Quote.vue";
import Scores from "../components/Scores.vue";
import OptionButtonGrid from "../components/OptionButtonGrid.vue";
import { service } from "../service/service";
import { defineComponent } from "vue";
import type { GameRound, GameState } from "@/service/dtos";

export default defineComponent({
  components: {
    OptionButtonGrid,
    Timer,
    Quote,
    Scores,
  },
  data() {
    let round: GameRound | undefined;
    let gameState: GameState | undefined;
    let questionDelay: number = 2000;
    let showTimer: boolean = false;
    let fade: number[] = [];
    let showchoices: boolean = false;
    
    return {
      round,
      gameState,
      questionDelay,
      showTimer,
      showchoices,
      fade,
    };
  },

  async mounted() {
    await sleep(1000);

    this.gameState = await service.getGameState(this.gameId);
    service.io.onRoundStarted(async (round: GameRound) => {
      console.log("Started round: ", round);
      this.round = round;

      await sleep(this.questionDelay);
      this.showTimer = true;
      this.showchoices = true;
    });

    service.io.onRoundEnded(async (round: GameRound) => {
      console.log("Completed question: ", round.question);
      const masterIp = round.master.ip;
      const correctOption = round.answers.find(x => x.player.ip === masterIp)?.option;
      this.round = round;

      this.showTimer = false;
    });

    // this.startNextRound();
  },
  methods: {
    async startNextRound() {
      service.io.nextRound(this.gameId);
    }
  },
  computed: {
    gameId(): string {
      return this.$route.params.gameId as string;
    },
    answerColor(): string | undefined {
      switch (this.correctAnswerIndex) {
        case 0:
          return "red";
        case 1:
          return "orange";
        case 2:
          return "blue";
        case 3:
          return "green";
        default:
          return undefined;
      }
    },
    correctAnswerIndex(): number | undefined {
      if (!this.round || !this.round.answers) return undefined;

      const masterIp = this.round.master.ip;
      return this.round.answers.find(x => x.player.ip === masterIp)?.option;
    },
    correctAnswer(): string | undefined {
      if (!this.correctAnswerIndex) return undefined;

      return this.round!.question.options[this.correctAnswerIndex];
    },
    confessionText(): string {
      if (this.round && this.round.index > 0) {
        return `Confession ${this.round.index} / ${this.gameState!.totalRounds}`;
      } else {
        return "Introduction";
      }
    },
  },
})
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <template v-if="round">
      <div>{{ confessionText }}</div>
      <Timer
        v-if="showTimer"
        ref="timerComponent"
        class="mt-3"
        :durationMillis="gameState!.timePerRound * 1000 - questionDelay"
      />
      <div v-else style="height: 32px; width: 10px"></div>
      <Quote
        :question="round.question"
        :answer="correctAnswer"
        :color="answerColor"
        :masterPlayerName="round.master.name"
      />

      <Scores
        v-if="true || fade.length > 0"
        :correctAnswer="correctAnswer"
      />

      <OptionButtonGrid
        v-if="showchoices"
        style="margin-top: 50px; height: 450px"
        :choices="round.question.options"
        :disabled="true"
        :fade="fade"
      />
    </template>

    <button v-if="correctAnswer" @click="startNextRound()">
      Next
    </button>
  </div>
</template>

<style scoped></style>
