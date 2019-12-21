<template>
  <div id="app" v-if="loaded">
    <div class="border">
      <div class="border_tabs">
        <span
          v-for="tab in tabs"
          :key="tab.name"
          @click="tab.action"
          class="border_tab"
        >{{ tab.name }}</span>
      </div>
    </div>
    <AddWidgetModal :editing="editing" />
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
      <Rocker v-if="button.type=='rocker'" :data="button" slot="content" />
      <VirtualButton v-else :data="button" slot="content" />
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
        @close="showModal = false; currentButton = {};"
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

import Rocker from "./components/buttons/Rocker.vue";
import Resizeable from "./components/Resizeable.vue";
import VirtualButton from "./components/VirtualButton.vue";
import ButtonSettingsModal from "./components/ButtonSettingsModal.vue";
import AddWidgetModal from "./components/AddWidgetModal.vue";

export default {
  name: "App",
  components: {
    Rocker,
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
      editing: false,
      showModal: false,
      loaded: false,
      currentButton: {},
      tabs: [
        { name: "Screen 1", action: () => {} },
        {
          name: "Settings",
          action: () => {
            this.editing = !this.editing;
            this.currentButton = {};
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
      }
    });

    this.keyListeners = e => {
      this.currentButton = {
        ...this.currentButton,
        key: e.key,
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
body {
  position: relative;
  box-sizing: border-box;
  background: rgb(31, 31, 31);
  /* background: rgb(240, 240, 240); */
  background-size: cover;
  margin: 0;
  width: 100vw;
  height: 100vh;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
  top: 35px;
  bottom: 15px;
  right: 15px;
  border: 2px solid rgba(62, 168, 255, 0.733);
  border-radius: 10px;
}
.border_tabs {
  position: absolute;
  left: 35px;
  top: -24px;
}
.border_tab {
  border-top: 2px solid rgba(62, 168, 255, 0.733);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
  color: #e2e2e2;
  padding: 4px 25px;
}
.border_tab:hover {
  border-top: 2px solid rgba(255, 238, 5, 0.76);
}
.border_tab:active {
  background-color: rgba(24, 95, 153, 0.76);
}
.red_button {
  text-align: center;
  border: 0.5px solid darkgray;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-image: linear-gradient(red, rgb(172, 0, 0));
  position: absolute;
  top: 40px;
  right: 30px;
  z-index: 10;
}
.red_button:active {
  opacity: 0.8;
}
</style>
