<template>
  <div class="text_input_container" :style="borderStyles">
    <span>{{ label }}</span>
    <input :value="inputValue" @input="setInputValue" />
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: false,
      default: ""
    },
    value: {
      type: String,
      required: false,
      default: ""
    }
  },
  computed: {
    inputValue() {
      return this.value;
    },
    borderStyles() {
      return {
        border: `2px solid var(--primary-${this.$settings.color})`
      };
    }
  },
  methods: {
    setInputValue(event) {
      console.log("VAL", event.target.value);
      this.$emit("change", event.target.value);
    }
  }
};
</script>
<style>
.text_input_container {
  display: flex;
  align-items: center;
  border-radius: 8px;
}
.text_input_container > input {
  font-family: "Orbitron", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1.2rem;
  border: none;
  background-color: transparent;
  color: var(--primary-white);
  padding: 4px;
}
</style>
