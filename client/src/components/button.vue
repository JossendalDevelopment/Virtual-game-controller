<template>
  <div slot="text" :style="setStyles"> 
    <p style="text-align: center;">{{ data.buttonName }}</p>
    <img
      v-if="editing"
      slot="top-right-icon"
      style="position: absolute; cursor: pointer; z-index: 301; top: 5%; right: 5%; height: 18%; width: 18%;"
      src="@/assets/gear-option.svg"
      @click="$emit('show-settings', data)"
    />
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    editing: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    setStyles() {
      return {
        display: 'flex', 
        alignItems: 'center', 
        background: this.data.style.background, 
        border: '2px solid white', 
        justifyContent: 'center', 
        height: '100%', 
        width: '100%'
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit("pressed", this.data);
    }
  }
};
</script>
