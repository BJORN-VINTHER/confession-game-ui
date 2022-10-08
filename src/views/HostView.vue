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
    let roundEnded: boolean = true;
    
    return {
      round,
      gameState,
      questionDelay,
      showTimer,
      showchoices,
      fade,
      roundEnded
    };
  },

  async mounted() {
    await sleep(500);

    this.gameState = await service.getGameState(this.gameId);

    this.showchoices = true;
    this.round = {
      index: -1,
      master: this.gameState.players.find(x => x.ip === this.gameState!.hostIp)!,
      answers: undefined,
      question: {
        text: "My goal of todays session is _",
        options: [
          "for us to learn something about each other and have a good time",
          "to serve as a basis for your performance evaluation",
          "for me to learn English",
          "to make you help me debug my code"
        ]
      }
    };

    service.io.onRoundStarted(async (round: GameRound) => {
      console.log("Started round: ", round);
      this.round = round;
      this.roundEnded = false;

      await sleep(this.questionDelay);
      this.showTimer = true;
      this.showchoices = true;
    });

    service.io.onRoundEnded(async (round: GameRound) => {
      console.log("Completed round: ", round);
      // const masterIp = round.master.ip;
      // const correctOption = round.answers.find(x => x.player.ip === masterIp)?.option;
      this.round = round;
      this.roundEnded = true;
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
      if (!this.round || !this.round.answers || this.round.answers.length === 0) return undefined;

      const masterIp = this.round.master.ip;
      return this.round.answers.find(x => x.player.ip === masterIp)?.option;
    },
    correctAnswer(): string | undefined {
      if (!this.correctAnswerIndex) return undefined;

      return this.round!.question.options[this.correctAnswerIndex];
    },
    confessionText(): string {
      if (this.round && this.round.index >= 0) {
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
        v-if="correctAnswerIndex"
        :correctAnswerIndex="correctAnswerIndex"
        :answers="round.answers!"
      />

      <OptionButtonGrid
        v-if="showchoices"
        style="margin-top: 50px; height: 450px"
        :options="round.question.options"
        :disabled="true"
        :correctAnswerIndex="correctAnswerIndex"
      />
    </template>

    <button v-if="roundEnded" @click="startNextRound()">
      {{ round && round.index >= 0 ? "Next" : "Start" }}
    </button>
  </div>
</template>

<style scoped></style>
