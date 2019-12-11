<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
      <div 
        v-for="(item, index) of keyMappings" 
        :key="index"
        style="display: flex; flex-direction: row;"
      >
        <Button :key="index" @click="(item) => handleClick(item)">
          {{ item.buttonName }}
        </Button>
        <p>Bound to {{ item.key }} - {{ item.keyCode }}</p>
      </div>
    <!-- <pre>{{ keyboardLayout }}</pre> -->
    <div 
      style="display: flex; flex-direction: row; justify-content: center;"
      v-for="(row, index) in keyboardLayout" :key="index + '00'">
      <template v-for="(key, index) in row">
        <KeyboardButton 
          v-if="typeof key !== 'object'" 
          :key="index + '55'" 
          :data="key"
          v-on:pressed="(event) => handleClick(event)" 
        >
          {{ key }}
        </KeyboardButton>
      </template>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import KeyMappings from './keyMappings.json';
import KeyboardLayout from './keyboardLayout.json';

import KeyboardButton from './components/button.vue';

export default {
  name: 'app',
  components: { KeyboardButton },
  data: () => ({
    socket: null,
    keyListeners: null,
    keysPressed: [],
    keyMappings: KeyMappings.keyMappings,
    keyboardLayout: KeyboardLayout
  }),
  created() {
    this.socket = io(`http://${document.domain}:${8765}`);

    this.socket.on('connection', () => {
      console.log("Connection established");
      this.socket.on('disconnect', () => {
        console.log("Connection terminated");
      });
    });

    this.socket.on('error', (error) => console.log("Connection error:", error));

    this.socket.on('keypress-response', (msg) => {
      console.log("keypress repsonse received", msg);
      this.keysPressed = [...this.keysPressed, msg];
    });

    this.keyListeners = e => {
      console.log("Listener", e)
      const data = {
        key: e.key,
        keyCode: e.keyCode,
      }
      this.socket.emit('keypress', e)
    };

    this.addListeners();
  },
  destroy() {
    this.removeListeners();
  },
  methods: {
    addListeners() {
      window.addEventListener("keyup", this.keyListeners);
    },
    removeListeners() {
      window.removeEventListener("keyup", this.keyListeners);
    },
    handleClick(e) {
      console.log("click", e)
      // const data = {
      //   key: e.key,
      //   keyCode: e.keyCode,
      //   buttonName: e.buttonName,
      // }
      this.socket.emit('keypress', e)

    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
