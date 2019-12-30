<template>
  <span>
    <!-- <div v-if="editing" class="red_button" style="top: 50px;" @click="showMenu = true">
      <p>Add</p>
    </div>-->
    <p @click="show()">Add A Widget</p>
    <div v-show="showMenu" class="menu_container" ref="addWidgetModal" :style="borderStyles">
      <span
        @click="hide()"
        style="display: flex; justify-content: flex-end; cursor: pointer; font-size: 20px;"
      >X</span>
      <div>
        <span>Add custom button</span>
      </div>
      <div>
        <p>Add image button</p>
      </div>
      <div style="display: flex; flex-wrap: wrap; justify-content: space-evenly;">
        <img @click="addBinding('glass_button_red.png')" class="add_button_img" :src="red" />
        <img @click="addBinding('glass_button_green.png')" class="add_button_img" :src="green" />
        <img @click="addBinding('glass_button_blue.png')" class="add_button_img" :src="blue" />
      </div>
      <div>
        <span>something else</span>
      </div>
    </div>
  </span>
</template>
<script>
import { getWidgetImageUrl } from "../utils";

export default {
  data() {
    return {
      red: "",
      blue: "",
      green: "",
      showMenu: false,
      themeColor: "white" // set this in vuex
    };
  },
  async created() {
    this.red = await this.fetchUrl("glass_button_red.png");
    this.green = await this.fetchUrl("glass_button_green.png");
    this.blue = await this.fetchUrl("glass_button_blue.png");
  },
  computed: {
    borderStyles() {
      return {
        border: `2px solid var(--primary-${this.themeColor})`
      };
    }
  },
  methods: {
    show() {
      this.showMenu = true;
      this.$refs.addWidgetModal.classList.add("is_active");
    },
    hide() {
      this.showMenu = false;
      this.$refs.addWidgetModal.classList.remove("is_active");
    },
    addBinding(filename) {
      this.$bindings.addBinding(filename);
    },
    async fetchUrl(filename) {
      const url = await getWidgetImageUrl(filename);
      return url;
    }
  }
};
</script>
<style>
.menu_container {
  visibility: hidden;
  position: fixed;
  top: 40px;
  right: 17px;
  padding: 12px;
  width: 0px;
  height: 0px;
  transition: height 600ms;
  transition: width 600ms;
  font-size: 8px;
  transition: font-size 600ms;
  border-radius: 10px;
  z-index: 501;
  color: var(--primary-color);
  background: var(--off-black) !important;
}
.menu_container.is_active {
  visibility: visible;
  height: auto;
  width: auto;
  font-size: 18px;
}
.add_button_img {
  height: 30px;
  width: 30px;
  cursor: pointer;
}
</style>
