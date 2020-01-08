<template>
  <div class="modal_container">
    <div style="margin-right: 10px;">
      <div style="position: relative;">
        <div class="input_wrapper">
          <span>Name:</span>
          <input v-model="data.buttonName" />
        </div>
        <div class="input_wrapper">
          <span>Background:</span>
          <button
            @click="openPicker(`backgroundColor`)"
            class="picker_button"
            :style="{ background: buttonData.style.backgroundColor }"
          />
        </div>
        <div class="input_wrapper">
          <span>Border:</span>
          <button
            @click="openPicker(`borderColor`)"
            class="picker_button"
            :style="{ background: buttonData.style.borderColor }"
          />
        </div>
        <div class="input_wrapper">
          <span>Text:</span>
          <button
            @click="openPicker(`textColor`)"
            class="picker_button"
            :style="{ background: buttonData.style.textColor }"
          />
        </div>
        <div class="input_wrapper">
          <span>Opacity:</span>
          <input
            style="width: 75px;"
            type="number"
            step="0.1"
            max="1"
            min="0"
            v-model="buttonData.style.opacity"
          />
        </div>
        <div class="input_wrapper">
          <span>Text Size:</span>
          <input
            style="width: 75px;"
            type="number"
            step="1"
            max="48"
            min="0"
            v-model="buttonData.style.fontSize"
          />
        </div>
        <div class="input_wrapper">
          <span>Radius:</span>
          <input
            style="width: 75px;"
            type="number"
            step="1"
            max="50"
            min="0"
            v-model="buttonData.style.borderRadius"
          />
        </div>
        <span>Bound to key: {{ buttonData.code }}</span>
      </div>
    </div>

    <ColorPicker @change="newVal => setNewVal(newVal)" v-if="showPicker" :color="selectedColor" />
  </div>
</template>
<script>
import ColorPicker from "./ColorPicker.vue";

export default {
  components: {
    ColorPicker
  },
  props: {
    data: {
      type: Object,
      required: false,
      default() {
        return {
          style: {
            backgroundColor: "#e2e2e2"
          },
          position: {
            bottom: 381.4000015258789,
            height: "auto",
            left: 272,
            right: 359.375,
            top: 330,
            width: "auto"
          }
        };
      }
    }
  },
  data() {
    return {
      selectedStyleProp: null,
      showPicker: false
    };
  },
  computed: {
    buttonData: {
      get: function() {
        return this.data;
      },
      set: function(newValue) {
        console.log("SETTER", newValue);
        this.data = newValue;
        this.$emit("change", newValue);
      }
    },
    selectedColor() {
      return this.buttonData.style[this.selectedStyleProp];
    }
  },
  methods: {
    openPicker(prop) {
      this.selectedStyleProp = prop;
      this.showPicker = true;
    },
    setNewVal(newVal) {
      // newVal has all types of css color standards available
      this.buttonData.style[this.selectedStyleProp] = newVal.hex8;
    }
  }
};
</script>
<style>
.modal_style_container {
  /* position: relative;
  display: flex;
  background-color: lightgrey; */
}
.picker_button {
  height: 20px;
  width: 80px;
}
.input_wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}
.tabs_container {
  display: flex;
  border-bottom: 1px solid black;
}
.tab_header {
  width: 50%;
  text-align: center;
  cursor: pointer;
}
.tab_header:first-child {
  border-right: 1px solid black;
}
.tab_header:hover {
  background-color: #a2a2a2;
}
</style>
