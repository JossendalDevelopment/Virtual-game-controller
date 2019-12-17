<template>
  <div id="app" v-if="loaded">
    <div class="red_button" @click="editing = !editing">
      <p>Edit</p>
    </div>
    <div v-if="editing" class="red_button" style="top: 85px;" @click="addBinding()">
      <p>Add</p>
    </div>
    <Resizeable
      v-for="(button, index) of keyMappings"
      :key="index"
      :editing="editing"
      :buttonData="button"
      :buttonIndex="index"
      @drag-end="event => setButtonDimensions(event, index)"
      @pressed="event => handleClick(event)"
    >
      <VirtualButton
        slot="content"
        :data="button"
        :editing="editing"
        @show-settings="button => showButtonSettings(button)"
      />
    </Resizeable>
    <Resizeable v-if="showModal" :buttonIndex="this.keyMappings.length" :editing="editing">
      <ButtonSettingsModal
        slot="content"
        :showModal="showModal"
        :data="currentButton"
        @set-binding="button => setBindingForButton(button)"
        @close="() => this.showModal = false"
        @delete="button => deleteButton(button)"
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

import Resizeable from "./components/Resizeable.vue";
import VirtualButton from "./components/VirtualButton.vue";
import ButtonSettingsModal from "./components/ButtonSettingsModal.vue";

export default {
  name: "App",
  components: {
    VirtualButton,
    ButtonSettingsModal,
    Resizeable
  },
  data: () => ({
    socket: null,
    keyListeners: null,
    keyboardLayout: KeyboardLayout,
    editing: false,
    showModal: false,
    loaded: false,
    currentButton: {}
  }),
  mounted() {
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
        keyCode: e.keyCode
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
    keyMappings() {
      return this.$bindings.userBindings;
    }
  },
  methods: {
    addBinding() {
      this.$bindings.addBinding();
      this.editing = true;
    },
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
      const index = this.keyMappings.findIndex(item => item.id == button.id);
      this.keyMappings = this.keyMappings.splice(index, 1);

      this.$bindings.setUserKeybindings(this.keyMappings);
      this.showModal = false;
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
