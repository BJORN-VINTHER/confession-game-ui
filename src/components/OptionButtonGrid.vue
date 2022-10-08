<template>
  <div class="container" style="max-width: 900px">
    <div class="row">
      <OptionButton
        class="col-sm"
        color="red"
        :disabled="disabled"
        :faded="correctAnswerIndex !== undefined && correctAnswerIndex !== 0"
        :text="options[0]"
        @click="onClick(0)"
      ></OptionButton>
      <OptionButton
        class="col-sm"
        color="orange"
        :disabled="disabled"
        :faded="correctAnswerIndex !== undefined && correctAnswerIndex !== 1"
        :text="options[1]"
        @click="onClick(1)"
      ></OptionButton>
    </div>
    <div class="row">
      <OptionButton
        class="col-sm"
        color="blue"
        :disabled="disabled"
        :faded="correctAnswerIndex !== undefined && correctAnswerIndex !== 2"
        :text="options[2]"
        @click="onClick(2)"
      ></OptionButton>
      <OptionButton
        class="col-sm"
        color="green"
        :disabled="disabled"
        :faded="correctAnswerIndex !== undefined && correctAnswerIndex !== 3"
        :text="options[3]"
        @click="onClick(3)"
      ></OptionButton>
    </div>
  </div>
</template>

<script lang="ts">
import OptionButton from "./OptionButton.vue";
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  props: {
    correctAnswerIndex: Number,
    disabled: Boolean,
    options: {type: Array as PropType<string[]>, required: true }
  },
  components: {
    OptionButton,
  },
  methods: {
    onClick(i: number) {
      this.$emit("clickTest", i);
    },
  },
})
</script>

<style scoped></style>
