<template>
  <div id="app" v-if="loaded">
    <div class="border" :style="borderStyles">
      <div class="settings_menu" ref="settingsMenu" :style="borderStyles">
        <AddWidgetModal :editing="editing" />
        <p>Set Your IP</p>
        <p>Enable Editing</p>
        <div>
          <p>Change Color</p>
          <div
            style="display: inline-flex; height: 20px; width: 20px; backgroundColor: var(--primary-red)"
            @click="themeColor = 'red'"
          ></div>
          <div
            style="display: inline-flex; height: 20px; width: 20px; backgroundColor: var(--primary-blue)"
            @click="themeColor = 'blue'"
          ></div>
          <div
            style="display: inline-flex; height: 20px; width: 20px; backgroundColor: var(--primary-white)"
            @click="themeColor = 'white'"
          ></div>
        </div>
        <p>Remove AddWidgetModal</p>
      </div>
    </div>
    <div class="border_tabs">
      <span
        v-for="tab in tabs"
        :key="tab.name"
        @click="tab.action"
        class="border_tab"
        :style="borderTabStyles"
      >{{ tab.name }}</span>
    </div>
    <Resizeable
      v-for="(button, index) of $bindings.userBindings"
      :key="index"
      :editing="editing"
      :buttonData="button"
      :buttonIndex="index"
      :selected="currentButton.id === button.id"
      @drag-end="event => setButtonDimensions(event)"
      @pressed="event => handleClick(event)"
    >
      <!-- <Rocker v-if="button.type=='rocker'" :data="button" slot="content" /> -->
      <VirtualButton :data="button" slot="content" />
      <img
        v-if="editing"
        slot="top-right-icon"
        style="position: absolute; cursor: pointer; z-index: 301; top: 5px; right: 5px; height: 18%; width: 18%;"
        src="@/assets/gear-option.svg"
        @click="showButtonSettings(button)"
      />
    </Resizeable>
    <Resizeable
      v-if="showModal"
      :buttonIndex="this.$bindings.userBindings.length"
      :editing="editing"
    >
      <ButtonSettingsModal
        slot="content"
        :showModal="showModal"
        :data="currentButton"
        @set-binding="button => setBindingForButton(button)"
        @close="
          showModal = false;
          currentButton = {};
        "
        @delete="button => deleteButton(button)"
        @change="button => setButtonDimensions(button)"
      />
    </Resizeable>

    <!-- <div
      v-if="editing"
      style="display: flex; flex-direction: row; flex-wrap: wrap; position: absolute; bottom: 10px; left: 0; right: 0; justify-content: center;"
    >
      <div
        style="display: flex; flex-direction: row; justify-content: center; width: 100%;"
        v-for="(row, index) in keyboardLayout"
        :key="index + '00'"
      >
        <template v-for="(key, index) in row">
          <KeyboardButton
            v-if="typeof key !== 'object'"
            :key="index + '55'"
            :data="key"
            v-on:pressed="event => handleClick(event)"
            >{{ key }}</KeyboardButton
          >
        </template>
      </div>
    </div>-->
  </div>
</template>

<script>
import io from "socket.io-client";

import KeyboardLayout from "./keyboardLayout.json";
import ToHex from "./toHex.json";

// import Rocker from "./components/buttons/Rocker.vue";
import Resizeable from "./components/Resizeable.vue";
import VirtualButton from "./components/VirtualButton.vue";
import ButtonSettingsModal from "./components/ButtonSettingsModal.vue";
import AddWidgetModal from "./components/AddWidgetModal.vue";

export default {
  name: "App",
  components: {
    // Rocker,
    Resizeable,
    VirtualButton,
    AddWidgetModal,
    ButtonSettingsModal
  },
  data() {
    return {
      socket: null,
      keyListeners: null,
      keyboardLayout: KeyboardLayout,
      toHex: ToHex,
      editing: false,
      showModal: false,
      loaded: false,
      currentButton: {},
      themeColor: "white",
      tabs: [
        { name: "Screen 1", action: () => {} },
        {
          name: "Settings",
          action: () => {
            this.editing = !this.editing;
            this.currentButton = {};
            this.$refs.settingsMenu.classList.toggle("is_active");
          }
        }
      ]
    };
  },
  async mounted() {
    // TODO make this host ip configurable
    this.socket = io(`http://192.168.50.148:${5000}`);

    this.socket.on("connection", () => {
      console.log("Connection established");
      this.socket.on("disconnect", () => {
        console.log("Connection terminated");
      });
    });

    this.socket.on("error", error => console.log("Connection error:", error));

    this.socket.on("keypress-response", response => {
      console.log("keypress repsonse received", response);
      if (response.status === 500) {
        // TODO show an error popup
        console.error("Error in keypress response", response);
      }
    });

    this.keyListeners = e => {
      // console.log("KEY", e);
      this.currentButton = {
        ...this.currentButton,
        key: [this.toHex[e.key]],
        keyCode: e.keyCode,
        location: e.location // ex. 1 is left alt, 2 is right alt, 0 is non-positional
      };
      this.$bindings.update(this.currentButton);
      this.removeListeners();
      // this.socket.emit("keypress", e);
    };
  },
  async created() {
    await this.$bindings.getUserKeybindings();
    this.loaded = true;
  },
  destroy() {
    this.removeListeners();
  },
  computed: {
    borderStyles() {
      return {
        backgroundImage: `linear-gradient(
    var(--primary-${this.themeColor}-lighten),
    var(--off-black),
    var(--off-black)
  )`,
        border: `2px solid var(--primary-${this.themeColor})`
      };
    },
    borderTabStyles() {
      return {
        borderTop: `2px solid var(--primary-${this.themeColor})`,
        borderBottom: `2px solid var(--primary-${this.themeColor})`
      };
    },
    settingsMenu() {
      return {};
    }
  },
  methods: {
    showButtonSettings(button) {
      this.currentButton = button;
      this.showModal = true;
    },
    setBindingForButton() {
      this.addListeners();
    },
    addListeners() {
      window.addEventListener("keyup", this.keyListeners);
    },
    removeListeners() {
      window.removeEventListener("keyup", this.keyListeners);
    },
    handleClick(e) {
      // TODO design this to handle a down and up keypress
      this.socket.emit("keypress", e);
    },
    deleteButton(button) {
      const index = this.$bindings.userBindings.findIndex(
        item => item.id == button.id
      );
      const newKeyMappings = this.$bindings.userBindings.splice(index, 1);

      this.$bindings.setUserKeybindings(newKeyMappings);
      this.showModal = false;
    },
    setButtonDimensions(event) {
      this.$bindings.update(event);

      this.$bindings.setUserKeybindings(this.$bindings.userBindings);
    }
  }
};
</script>

<style>
:root {
  --primary-color: #c5c5c5 !important;
  --secondary-color: #6c7478 !important;
  --off-black: #1f1f1f !important;
  --primary-blue: #3ea8ffbb !important;
  --primary-blue-lighten: #3ea8ff33 !important;
  --primary-red: #ff2e1fbb !important;
  --primary-red-lighten: #ff2e1f33 !important;
  --primary-white: #ffffffbb !important;
  --primary-white-lighten: #ffffff33 !important;
  --success-color: #80b855 !important;
  --warning-color: #eaca44 !important;
  --error-color: #ef4d4d !important;
}
body {
  position: relative;
  box-sizing: border-box;
  background: var(--off-black);
  /* background: rgb(240, 240, 240); */
  background-size: cover;
  margin: 0;
  width: 100vw;
  height: 100vh;
}
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family: "Orbitron", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.border {
  position: absolute;
  left: 15px;
  top: 40px;
  bottom: 15px;
  right: 17px;
  border-radius: 10px;
}
.border_tabs {
  /* position: absolute;
  left: 35px;
  top: -24px; */
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
}
.border_tab {
  border-top: 2px solid var(--primary-red);
  border-bottom: 2px solid var(--primary-red);
  border-radius: 8px;
  text-align: center;
  color: #e2e2e2;
  padding: 4px 25px;
}
.border_tab:active {
  background-color: rgba(24, 95, 153, 0.76);
}
.settings_menu {
  visibility: hidden;
  position: fixed;
  top: 40px;
  right: 17px;
  padding: 12px;
  width: 0px;
  height: 0px;
  transition: height 400ms;
  transition: width 400ms;
  transition: font-size 400ms;
  font-size: 8px;
  border-radius: 10px;
  z-index: 501;
  color: var(--primary-color);
  background: var(--off-black) !important;
}
.settings_menu.is_active {
  visibility: visible;
  height: auto;
  width: auto;
  font-size: 18px;
}
</style>
