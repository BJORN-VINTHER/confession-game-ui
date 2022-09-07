<template>
  <div class="progress" style="width: 80%">
    <div
      class="progress-bar progress-bar-striped progress-bar-animated"
      role="progressbar"
      aria-valuenow="75"
      aria-valuemin="0"
      aria-valuemax="100"
      :style="{ width: percentWidth }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    durationMillis: { type: Number, required: true }
  },
  data() {
    const elapsedMillis: number = 0;
    return {
      elapsedMillis,
    };
  },
  computed: {
    percentWidth() {
      const percent = 100 * (this.elapsedMillis / this.durationMillis);
      return Math.floor(percent) + "%";
    },
  },
  mounted() {
    const interval = setInterval(() => {
        this.elapsedMillis += 20;

        if (this.elapsedMillis >= this.durationMillis) {
          clearInterval(interval);
        }
      }, 20);
  }
})
</script>
