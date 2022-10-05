<template>
  <div class="container mt-4 mb-2 p-4 d-flex flex-column align-items-center">
    <!-- <div class="d-flex flex-column align-items-start" style="margin: 0px auto">  -->
    <!-- quote -->
    <div class="d-flex flex-row align-self-center">
      <img
        width="30"
        height="30"
        class="mb-1 align-self-start"
        src="../assets/icons/quote1.png"
      />
      <div class="question-text mx-3 my-2">
        {{ questionTextParts[0] }}
        <span :class="color" v-if="answer">{{ answer }}</span>
        <u v-else
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u
        >
        {{ questionTextParts[1] }}
      </div>
      <img
        width="30"
        height="30"
        class="mb-1 align-self-end"
        src="../assets/icons/quote2.png"
      />
    </div>
  </div>
  <!-- </div> -->
  <div class="small-text">- {{ masterPlayerName }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type {
  Answer,
  GameRound,
  GameRoundResult,
  Question,
  QuestionResult,
} from "@/service/dtos";

export default defineComponent({
  props: {
    question: { type: Object as PropType<Question>, required: true },
    answer: String,
    color: String,
    masterPlayerName: String
  },
  computed: {
    questionTextParts(): string[] {
      return this.question.text.split("_");
    },
  },
});
</script>

<style scoped>
.container {
  border-top: 1px;
  border-bottom: 1px;
  border-left: 0px;
  border-right: 0px;
  border-color: white;
  border-style: solid;
}
.question-text {
  font-size: 25pt;
}
.red {
  color: #dc3545;
}
.orange {
  color: #ffb007;
}
.blue {
  color: #007bff;
}
.green {
  color: #28a745;
}
</style>
