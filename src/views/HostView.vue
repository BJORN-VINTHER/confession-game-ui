<script lang="ts">
import { sleep } from "../utilities/utilities";
import Timer from "../components/Timer.vue";
import Quote from "../components/Quote.vue";
import Scores from "../components/Scores.vue";
import OptionButtonGrid from "../components/OptionButtonGrid.vue";
import { service } from "../service/service";
import { defineComponent } from "vue";
import type { Answer, GameRound, GameRoundResult, Question, QuestionResult } from "@/service/dtos";

export default defineComponent({
  components: {
    OptionButtonGrid,
    Timer,
    Quote,
    Scores,
  },
  data() {
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
    
    return {
      questionDelay,
      questionTime,
      totalQuestions,
      question,
      correctAnswer,
      answers,
      showTimer,
      fade,
      showchoices,
    };
  },

  async mounted() {
    const gameState = await service.getGameState(this.gameId);
    this.totalQuestions = gameState.totalRounds;

    service.io.onRoundStarted(async (round: GameRound) => {
      console.log("Started question: ", round.question);
      this.question = round.question;
      this.correctAnswer = undefined;
      this.fade = [];
      this.answers = undefined;
      this.showTimer = false;
      this.showchoices = false;

      await sleep(this.questionDelay);
      this.showTimer = true;
      this.showchoices = true;
    });

    service.io.onRoundEnded(async (roundResult: GameRoundResult) => {
      console.log("Completed question: ", roundResult.round.question);
      const masterIp = roundResult.round.master.ip;
      const correctOption = roundResult.answers.find(x => x.player.ip === masterIp)?.option;
      

      this.answers = roundResult.answers;
      this.showTimer = false;
      this.correctAnswer = roundResult.round.question.choices[correctOption as number];
      this.fade = [0, 1, 2, 3].filter((x) => x !== correctOption);
    });

    this.startNextRound();
  },
  methods: {
    async startNextRound() {
      service.io.nextRound(this.questionTime);
    }
  },
  computed: {
    gameId():string {
      return this.$route.params.gameId as string;
    },
    answerColor(): string | null {
      if (!this.question) {
        return null;
      }
      if (this.correctAnswer == this.question.choices[0]) {
        return "red";
      }
      if (this.correctAnswer == this.question.choices[1]) {
        return "orange";
      }
      if (this.correctAnswer == this.question.choices[2]) {
        return "blue";
      }
      if (this.correctAnswer == this.question.choices[3]) {
        return "green";
      }
      return null;
    },
    confessionText():string {
      if (this.question && this.question.index > 0) {
        const index = this.question.index as number;
        const totalQuestions = this.totalQuestions as number;
        return `Confession ${index} / ${totalQuestions}`;
      } else {
        return "Introduction";
      }
    },
  },
})
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <template v-if="question">
      <div>{{ confessionText }}</div>
      <Timer
        v-if="showTimer"
        ref="timerComponent"
        class="mt-3"
        :durationMillis="questionTime - questionDelay"
      />
      <div v-else style="height: 32px; width: 10px"></div>
      <Quote
        :question="question"
        :answer="correctAnswer"
        :color="answerColor"
      />

      <Scores
        v-if="true || fade.length > 0"
        :correctAnswer="questionResult?.correctAnswerIndex"
      />

      <OptionButtonGrid
        v-if="showchoices"
        style="margin-top: 50px; height: 450px"
        :choices="question.choices"
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
