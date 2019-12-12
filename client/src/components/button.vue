<template>
  <button label="Button" @click="handleClick">{{ data }}</button>
</template>
<script>
export default {
  props: {
    data: {
      type: String,
      default: "Un-assigned"
    }
  },
  methods: {
    handleClick() {
      this.$emit("pressed", this.data);
    }
  }
};
</script>
