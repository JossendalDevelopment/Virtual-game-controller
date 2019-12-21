<template>
  <ColorPicker v-model="selectedColor" />
</template>
<script>
import { Chrome } from "vue-color";

export default {
  components: {
    ColorPicker: Chrome
  },
  props: {
    color: {
      type: String,
      required: true
    }
  },
  computed: {
    selectedColor: {
      get: function() {
        return this.color;
      },
      set: function(newVal) {
        this.$emit("change", newVal);
      }
    }
  }
};
</script>