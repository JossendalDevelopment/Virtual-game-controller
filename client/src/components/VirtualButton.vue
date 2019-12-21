<template>
  <div :style="setStyles">
    <p style="text-align: center;">{{ data.buttonName }}</p>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    setStyles() {
      let styles = {
        display: "flex",
        alignItems: "center",
        backgroundColor: this.data.style.backgroundColor,
        opacity: this.data.style.opacity,
        color: this.data.style.textColor,
        fontSize: this.data.style.fontSize + "px",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: this.data.style.borderRadius + "%",
        borderColor: this.data.style.borderColor,
        justifyContent: "center",
        height: "100%",
        width: "100%",
        left: this.data.position.left + "px",
        top: this.data.position.top + "px"
      };
      if (this.data.image) {
        styles = {
          ...styles,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          borderWidth: 0,
          backgroundImage: `url(${this.data.imageUrl})`
        };
      }
      return styles;
    }
  }
};
</script>
