<template>
  <div id="app" v-if="loaded">
    <div class="red_button" @click="editing = !editing">
      <p>Edit</p>
    </div>
    <div
      class="red_button"
      style="top: 85px;"
      @click="
        keyMappings = [
          ...keyMappings,
          {
            id: math.random(),
            buttonName: 'Control',
            key: 'Control',
            keyCode: 17,
            style: {
              top: 50,
              left: 50,
              height: 100.0,
              width: 200.0,
              background: '#bada55'
            }
          }
        ]
      "
    >
      <p>Add</p>
    </div>
    <Resizeable
      v-for="(button, index) of keyMappings"
      :key="index"
      :editing="editing"
      :button-data="button"
      @drag-end="event => setButtonDimensions(event, index)"
      @pressed="event => handleClick(event)"
    >
      <keyboardButton
        slot="text"
        :data="button"
        :editing="editing"
        @show-settings="button => showButtonSettings(button)"
      />
    </Resizeable>
    <ButtonSettingsModal
      :showModal="showModal"
      :data="currentButton"
      @save="event => saveSettings(event)"
      @set-binding="event => setBindingForButton(event)"
    />

    <!-- <div
      style="position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;"
    >-->
    <!-- <template v-if="editing"> -->
    <!-- <EditableButton
      v-for="(item, index) of keyMappings"
      :key="index + 'vb'"
      v-on:drag-end="event => setButtonDimensions(event, index)"
      v-on:scale-end="event => setButtonDimensions(event, index)"
      v-on:pressed="event => handleClick(event)"
      :data="item"
      :editing="editing"
    />-->
    <!-- </template>
      <template v-else>
        <VirtualButton
          v-for="(item, index) of keyMappings"
          :key="index + 'vb'"
          v-on:pressed="event => handleClick(event)"
          :data="item"
          :editing="editing"
    />-->
    <!-- </template> -->
    <!-- </div> -->

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

import Resizeable from "./components/Resizeable.vue";
import KeyboardButton from "./components/button.vue";
// import VirtualButton from "./components/VirtualButton.vue";
// import EditableButton from "./components/EditableButton.vue";
import ButtonSettingsModal from "./components/ButtonSettingsModal.vue";

export default {
  name: "App",
  components: {
    KeyboardButton,
    ButtonSettingsModal,
    Resizeable
    // EditableButton
    // VirtualButton
  },
  data: () => ({
    socket: null,
    keyListeners: null,
    keysPressed: [],
    keyMappings: [],
    keyboardLayout: KeyboardLayout,
    editing: false,
    showModal: false,
    loaded: false,
    currentButton: {}
  }),
  mounted() {
    this.socket = io(`http://${document.domain}:${5000}`);

    this.socket.on("connection", () => {
      console.log("Connection established");
      this.socket.on("disconnect", () => {
        console.log("Connection terminated");
      });
    });

    this.socket.on("error", error => console.log("Connection error:", error));

    this.socket.on("keypress-response", msg => {
      console.log("keypress repsonse received", msg);
      this.keysPressed = [...this.keysPressed, msg];
    });

    this.keyListeners = e => {
      this.currentButton = {
        ...this.currentButton,
        key: e.key,
        keyCode: e.keyCode
      };
      const replaceAt = this.keyMappings.findIndex(
        item => item.id === this.currentButton.id
      );
      this.keyMappings[replaceAt] = this.currentButton;
      this.$bindings.setUserKeybindings(this.keyMappings);
      this.removeListeners();
      // this.socket.emit("keypress", e);
    };
  },
  async created() {
    this.keyMappings = await this.$bindings.getUserKeybindings();
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
      this.socket.emit("keypress", e);
    },
    setButtonDimensions(event, index) {
      console.log("SETTING", event);
      this.keyMappings[index] = event;

      this.$bindings.setUserKeybindings(this.keyMappings);
    },
    saveSettings(event) {
      console.log("SAVEING", event);
      const replaceAt = this.keyMappings.findIndex(
        item => item.id === event.id
      );
      this.keyMappings[replaceAt] = event;
      this.$bindings.setUserKeybindings(this.keyMappings);
      this.showModal = false;
    }
  }
};
</script>

<style>
body {
  box-sizing: border-box;
  background: rgb(31, 31, 31);
  background-size: cover;
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: rgba(225, 225, 225, 0.15);
  backdrop-filter: blur(3px);
  position: relative;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.red_button {
  text-align: center;
  border: 0.5px solid darkgray;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-image: linear-gradient(red, rgb(172, 0, 0));
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 10;
}
.red_button:active {
  opacity: 0.8;
}
</style>
