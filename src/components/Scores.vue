<template>
  <div class="d-flex flex-row align-items-end">
    <ScoreBar color="red" :height="getHeight(0)" :isCorrect="true" :votes="countAnswers(0)" />
    <ScoreBar color="orange" :height="getHeight(1)" :isCorrect="true" :votes="countAnswers(1)" />
    <ScoreBar color="blue" :height="getHeight(2)" :isCorrect="false" :votes="countAnswers(2)" />
    <ScoreBar color="green" :height="getHeight(3)" :isCorrect="true" :votes="countAnswers(3)" />
  </div>
  <div class="d-flex flex-row justify-content-between">
    <img
      v-show="correctAnswerIndex == 0"
      width="30"
      height="30"
      src="../assets/icons/star2.png"
    />
    <img
      v-show="correctAnswerIndex == 1"
      width="30"
      height="30"
      src="../assets/icons/star2.png"
    />
    <img
      v-show="correctAnswerIndex == 2"
      width="30"
      height="30"
      src="../assets/icons/star2.png"
    />
    <img
      v-show="correctAnswerIndex == 3"
      width="30"
      height="30"
      src="../assets/icons/star2.png"
    />
  </div>
</template>

<script lang="ts">
import type { Answer } from "@/service/dtos";
import { defineComponent, type PropType } from "vue";
import ScoreBar from "./ScoreBar.vue";

export default defineComponent({
  props: {
    correctAnswerIndex: Number,
    answers: { type: Array as PropType<Answer[]>, required: true },
  },
  components: {
    ScoreBar,
  },
  methods: {
    countAnswers(index: number) {
      return this.answers.filter(x => x.option === index).length;
    },
    getHeight(index: number) {
      const percent = this.countAnswers(index) / this.answers.length;
      return 20 + 200 * percent;
    }
  }
});
</script>

<style scoped></style>
