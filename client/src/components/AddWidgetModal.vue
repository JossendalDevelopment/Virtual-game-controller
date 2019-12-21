<template>
  <span>
    <div v-if="editing" class="red_button" style="top: 50px;" @click="showMenu = true">
      <p>Add</p>
    </div>
    <div v-if="showMenu" class="menu_container">
      <span @click="showMenu = false">close</span>
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
  props: {
    editing: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      red: "",
      blue: "",
      green: "",
      showMenu: false
    };
  },
  async created() {
    this.red = await this.fetchUrl("glass_button_red.png");
    this.green = await this.fetchUrl("glass_button_green.png");
    this.blue = await this.fetchUrl("glass_button_blue.png");
  },
  methods: {
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
  position: absolute;
  top: 0;
  right: 0;
  z-index: 501;
  background-color: #a2a2a2;
  border: 1px solid black;
}
.add_button_img {
  height: 30px;
  width: 30px;
  cursor: pointer;
}
</style>