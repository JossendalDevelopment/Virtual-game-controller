<template>
  <div class="rocker_container" :style="setStyles">
    <span class="rocker_label">{{ data.buttonName }}</span>
    <label class="rocker rocker-small">
      <input type="checkbox" checked />
      <span class="switch-left">On</span>
      <span class="switch-right">Off</span>
    </label>
  </div>
</template>
<script>
// import { Binding } from "../../types/binding";
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
        justifyContent: "center",
        backgroundColor: this.data.style.backgroundColor,
        opacity: this.data.style.opacity,
        color: this.data.style.textColor,
        fontSize: this.data.style.fontSize + "px",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: this.data.style.borderRadius + "%",
        borderColor: this.data.style.borderColor,
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
<style>
.rocker_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* padding-top: 1em; */
  /* height: 100%;
  width: 100%; */
}

.rocker_label {
  color: white;
}

/* Switch starts here */
.rocker {
  display: inline-block;
  position: relative;
  /* padding-top: 1em; */
  /* height: 100%;
  width: 100%; */
  /*
  SIZE OF SWITCH
  ==============
  All sizes are in em - therefore
  changing the font-size here
  will change the size of the switch.
  See .rocker-small below as example.
  */
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  color: #888;
  width: 7em;
  height: 4em;
  overflow: hidden;
  border-bottom: 0.5em solid rgb(80, 80, 80);
  /* transform: rotate(90deg); */
}

.rocker-small {
  font-size: 0.75em; /* Sizes the switch */
  margin: 1em;
}

.rocker::before {
  content: "";
  position: absolute;
  top: 1em;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #999;
  border: 0.5em solid rgb(80, 80, 80);
  border-bottom: 0;
}

.rocker input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-left,
.switch-right {
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5em;
  width: 3em;
  transition: 0.2s;
}

.switch-left {
  height: 2.4em;
  width: 2.75em;
  left: 0.85em;
  bottom: 0.4em;
  background-color: #ddd;
  transform: rotate(15deg) skewX(15deg);
}

.switch-right {
  right: 0.5em;
  bottom: 0;
  background-color: #bd5757;
  color: #fff;
}

.switch-left::before,
.switch-right::before {
  content: "";
  position: absolute;
  width: 0.4em;
  height: 2.45em;
  /* height: 100%; */
  bottom: -0.45em;
  background-color: #ccc;
  transform: skewY(-65deg);
}

.switch-left::before {
  left: -0.4em;
}

.switch-right::before {
  right: -0.375em;
  background-color: transparent;
  transform: skewY(65deg);
}

input:checked + .switch-left {
  background-color: #31d000;
  color: #fff;
  bottom: 0px;
  left: 0.5em;
  height: 2.5em;
  width: 3em;
  transform: rotate(0deg) skewX(0deg);
}

input:checked + .switch-left::before {
  background-color: transparent;
  width: 3.0833em;
}

input:checked + .switch-left + .switch-right {
  background-color: #ddd;
  color: #888;
  bottom: 0.4em;
  right: 0.8em;
  height: 2.4em;
  width: 2.75em;
  /* height: 60.3%;
  width: 39.2%; */
  transform: rotate(-15deg) skewX(-15deg);
}

input:checked + .switch-left + .switch-right::before {
  background-color: #ccc;
}

/* Keyboard Users */
input:focus + .switch-left {
  color: #333;
}

input:checked:focus + .switch-left {
  color: #fff;
}

input:focus + .switch-left + .switch-right {
  color: #fff;
}

input:checked:focus + .switch-left + .switch-right {
  color: #333;
}
</style>