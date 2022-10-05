<script lang="ts">
import { sleep } from "../utilities/utilities";
import Timer from "../components/Timer.vue";
import Quote from "../components/Quote.vue";
import Scores from "../components/Scores.vue";
import OptionButtonGrid from "../components/OptionButtonGrid.vue";
import { service } from "../service/service";
import { defineComponent } from "vue";
import type { Answer, GameRound, GameRoundResult, GameState, Question, QuestionResult } from "@/service/dtos";

export default defineComponent({
  components: {
    OptionButtonGrid,
    Timer,
    Quote,
    Scores,
  },
  data() {
    let round: GameRound | undefined;
    let roundResult: GameRoundResult | undefined;
    let gameState: GameState | undefined;
    let questionDelay: number = 4000;
    let questionTime: number = 20000;
    // let questionDelay: number = 500;
    // let questionTime: number = 6000;


    let totalQuestions: number = 0;
    let question: Question | undefined;
    let correctAnswer: string | undefined;
    let answers: Answer[] | undefined;
    let showTimer: boolean = false;
    let fade: number[] = [];
    let showchoices: boolean = false;
    let roundIndex: number = 0;
    
    return {
      round,
      roundResult,
      gameState,
      questionDelay,
      questionTime,


      // totalQuestions,
      // question,
      // correctAnswer,
      // answers,
      showTimer,
      showchoices,
      fade,
    };
  },

  async mounted() {
    await sleep(1000);

    this.gameState = await service.getGameState(this.gameId);
    
    // this.totalQuestions = gameState.totalRounds;
    service.io.onRoundStarted(async (round: GameRound) => {
      console.log("Started round: ", round);
      this.round = round;
      // this.question = round.question;
      // this.correctAnswer = undefined;
      // this.fade = [];
      // this.answers = undefined;
      // this.showTimer = false;
      // this.showchoices = false;
      // this.roundIndex = round.index;

      await sleep(this.questionDelay);
      this.showTimer = true;
      this.showchoices = true;
    });

    service.io.onRoundEnded(async (roundResult: GameRoundResult) => {
      console.log("Completed question: ", roundResult.round.question);
      const masterIp = roundResult.round.master.ip;
      const correctOption = roundResult.answers.find(x => x.player.ip === masterIp)?.option;
      this.roundResult = roundResult;

      // this.answers = roundResult.answers;
      // this.showTimer = false;
      // this.correctAnswer = roundResult.round.question.options[correctOption as number];
      // this.fade = [0, 1, 2, 3].filter((x) => x !== correctOption);
    });

    this.startNextRound();
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
      if (!this.roundResult) return undefined;

      const masterIp = this.roundResult.round.master.ip;
      return this.roundResult.answers.find(x => x.player.ip === masterIp)?.option;
    },
    correctAnswer(): string | undefined {
      if (!this.correctAnswerIndex) return undefined;

      return this.roundResult!.round.question.options[this.correctAnswerIndex];
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
        :durationMillis="questionTime - questionDelay"
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
