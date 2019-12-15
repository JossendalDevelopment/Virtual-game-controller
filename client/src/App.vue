<template>
  <div id="app" v-if="loaded">
    <div class="red_button" @click="editing = !editing">
      <p>Edit</p>
    </div>
    <div
      class="red_button"
      style="top: 80px;"
      @click="
        keyMappings = [
          ...keyMappings,
          {
            id: math.random(),
            buttonName: `Unassigned`,
            key: 'Control',
            keyCode: 17,
            style: {
              top: 50,
              left: 50,
              height: 100.0,
              width: 200.0
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
      <p slot="text" style="text-align: center;">{{ button.buttonName }}</p>
      <img
        v-if="editing"
        slot="top-right-icon"
        style="position: absolute; cursor: pointer; z-index: 301; top: 15px; right: 15px; height: 25px; width: 25px;"
        src="@/assets/gear-option.svg"
        @click="showButtonSettings(button)"
      />
    </Resizeable>
      <ButtonSettingsModal
        :showModal="showModal"
        :data="currentButton"
        @save="showModal = false"
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
// import KeyboardButton from "./components/button.vue";
// import VirtualButton from "./components/VirtualButton.vue";
// import EditableButton from "./components/EditableButton.vue";
import ButtonSettingsModal from "./components/ButtonSettingsModal.vue";

export default {
  name: "App",
  components: {
    // KeyboardButton,
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

    this.keyListeners = (e) => {
      // TODO use to set new bindings
      console.log("Listener", e);
      console.log("BUTTON", this.currentbutton)
      this.currentButton = {
        ...this.currentButton,
        key: e.key,
        keyCode: e.keyCode
      }
      const replaceAt = this.keyMappings.findIndex(item => item.id === this.currentButton.id)
      this.keyMappings[replaceAt] = this.currentButton;
      this.$bindings.setUserKeybindings(this.keyMappings);
      this.removeListeners();
      // const data = {
      //   key: e.key,
      //   keyCode: e.keyCode
      // };
      // this.socket.emit("keypress", e);
    };

    // this.addListeners();
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
      console.log("SHOW ", button)
      this.currentButton = button;
      this.showModal = true;
    },
    setBindingForButton() {
     this.addListeners() 
    },
    addListeners() {
      console.log("ADD CALLED", )
      window.addEventListener("keyup", this.keyListeners);
    },
    removeListeners() {
      window.removeEventListener("keyup", this.keyListeners);
    },
    handleClick(e) {
      console.log("EMITTING");
      this.socket.emit("keypress", e);
    },
    setButtonDimensions(event, index) {
      this.keyMappings[index] = event;

      this.$bindings.setUserKeybindings(this.keyMappings);
    }
  }
};
</script>

<style>
body {
  box-sizing: border-box;
  background: rgb(31, 31, 31);
  /* background: url("~@/assets/stars-backgrounds.jpg"); */
  /* background: url(https://images.unsplash.com/photo-1544306094-e2dcf9479da3) no-repeat; */
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
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color: red;
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 10;
}
.red_button:active {
  background-color: rgb(156, 0, 0);
}
</style>
