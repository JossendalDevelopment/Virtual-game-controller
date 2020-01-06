<template>
  <div class="btn_outline_container" :style="borderStyles" @click="() => {}">
    <slot name="icon" />
    <span>
      <slot name="text" />
    </span>
  </div>
</template>
<script>
export default {
  computed: {
    borderStyles() {
      return {
        // backgroundImage: `linear-gradient(
        //     var(--primary-${this.$theme.color}-lighten),
        //     var(--off-black),
        //     var(--off-black)
        //   )`,
        border: `2px solid var(--primary-${this.$theme.color})`
      };
    }
  }
};
</script>
<style>
.btn_outline_container {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  width: 100%;
  z-index: 901;
  margin: 1em 0;
}
.btn_outline_container:active {
  opacity: 0.6;
}
</style>
