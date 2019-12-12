<template>
    <div id="app" style="position: relative;">
        <div 
            style="border-radius: 50%; width: 50px; height: 50px; background-color: red; position: absolute; top: 30px; right: 30px;" 
            @click="editing = !editing">
            <p>Edit</p>
        </div>
        <div 
            style="border-radius: 50%; width: 50px; height: 50px; background-color: red; position: absolute; top: 85px; right: 30px;" 
            @click="keyMappings = [...keyMappings, {
                'buttonName': `Button ${keyMappings.length + 1}`,
                'key': 'Control',
                'keyCode': 17,
                'transform': 'matrix(1,0,0,1,243,-11) translate(10px, 10px)'
            }]"
        >
            <p>Add</p>
        </div>
        <div 
            v-for="(item, index) of keyMappings" 
            :key="index"
            style="display: flex; flex-direction: row;"
        >
            <VirtualButton :data="item" :editing="editing" />
            <!-- <Button :key="index" @click="(item) => handleClick(item)">
            {{ item.buttonName }}
            </Button> -->
            <!-- <p>Bound to {{ item.key }} - {{ item.keyCode }}</p> -->
        </div>
        <!-- <div 
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
        </div> -->
    </div>
</template>

<script>
import io from 'socket.io-client';
import KeyMappings from './keyMappings.json';
import KeyboardLayout from './keyboardLayout.json';

import KeyboardButton from './components/button.vue';
import VirtualButton from './components/virtual-button.vue';

export default {
  name: 'app',
  components: { 
    KeyboardButton,
    VirtualButton
  },
  data: () => ({
    socket: null,
    keyListeners: null,
    keysPressed: [],
    keyMappings: KeyMappings.keyMappings,
    keyboardLayout: KeyboardLayout,
    editing: false,
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
body {
    background: url('~@/assets/stars-backgrounds.jpg');
    /* background: url(https://images.unsplash.com/photo-1544306094-e2dcf9479da3) no-repeat; */
    background-size: cover;
    margin: 0;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh;
    background-color: rgba(225, 225, 225, .15);
    backdrop-filter: blur(3px);
}
</style>
