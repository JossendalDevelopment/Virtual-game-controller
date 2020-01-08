<template>
  <div id="app" v-if="loaded">
    <div class="border" :style="borderStyles">
      <div class="settings_menu" ref="settingsMenu" :style="borderStyles">
        <AddWidgetModal :editing="$settings.editingState" />
        <div style="display: flex; align-items: center;">
          <span style="padding-right: 4px;">Local IP</span>
          <TextInput :value="$settings.clientIP" @change="event => setIP(event)" />
        </div>
        <p>Toggle Widget Editing</p>
        <div>
          <p>Change Color</p>
          <div
            style="display: inline-flex; height: 20px; width: 20px; backgroundColor: var(--primary-red)"
            @click="setTheme('red')"
          ></div>
          <div
            style="display: inline-flex; height: 20px; width: 20px; backgroundColor: var(--primary-blue)"
            @click="setTheme('blue')"
          ></div>
          <div
            style="display: inline-flex; height: 20px; width: 20px; backgroundColor: var(--primary-white)"
            @click="setTheme('white')"
          ></div>
          <div
            style="display: inline-flex; height: 20px; width: 20px; backgroundColor: var(--primary-green)"
            @click="setTheme('green')"
          ></div>
        </div>
        <p>Remove AddWidgetModal</p>
      </div>
    </div>
    <div class="border_tabs">
      <span class="border_tabs_left">
        <span
          v-for="tab in tabs"
          :key="tab.name"
          @click="tab.action"
          class="border_tab"
          :style="borderTabStyles"
        >{{ tab.name }}</span>
      </span>
      <span
        class="border_tab settings_menu_button"
        :style="borderTabStyles"
        @click="openSettingsMenu"
      >Settings</span>
    </div>
    <component :is="currentTab.component" :data="currentTab.props" />
    <!-- <Resizeable
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
    </Resizeable>-->

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
import KeyboardLayout from "./keyboardLayout.json";
import ToHex from "./toHex.json";

// import Rocker from "./components/buttons/Rocker.vue";
// import Resizeable from "./components/Resizeable.vue";
// import VirtualButton from "./components/VirtualButton.vue";
// import ButtonSettingsModal from "./components/ButtonSettingsModal.vue";
import AddWidgetModal from "./components/AddWidgetModal.vue";
import TextInput from "./components/inputs/TextInput.vue";

import CustomView from "./views/Custom.vue";
import MFDView from "./views/Mfd.vue";

export default {
  name: "App",
  components: {
    // Rocker,
    // Resizeable,
    // VirtualButton,
    AddWidgetModal,
    TextInput
    // ButtonSettingsModal
  },
  data() {
    return {
      keyboardLayout: KeyboardLayout,
      toHex: ToHex,
      showModal: false,
      loaded: false,
      currentButton: {},
      currentTab: {
        name: "Mfd 1",
        action: () => {
          this.currentTab = this.tabs[1];
        },
        props: {},
        component: MFDView
      },
      tabs: [
        {
          name: "Custom",
          action: () => {
            this.currentTab = this.tabs[0];
          },
          props: {},
          component: CustomView
        },
        {
          name: "Mfd 1",
          action: () => {
            this.currentTab = this.tabs[1];
          },
          props: {},
          component: MFDView
        }
      ]
    };
  },
  async created() {
    await this.$bindings.getUserKeybindings();
    await this.$settings.getClientIP();
    this.loaded = true;
  },
  computed: {
    borderStyles() {
      return {
        backgroundImage: `linear-gradient(
    var(--primary-${this.$settings.color}-lighten),
    var(--off-black),
    var(--off-black)
  )`,
        border: `2px solid var(--primary-${this.$settings.color})`
      };
    },
    borderTabStyles() {
      return {
        borderTop: `2px solid var(--primary-${this.$settings.color})`,
        borderBottom: `2px solid var(--primary-${this.$settings.color})`
      };
    },
    settingsMenu() {
      return {};
    }
  },
  methods: {
    setTheme(color) {
      this.$settings.setTheme(color);
    },
    setIP(event) {
      this.$settings.setClientIP(event);
    },
    openSettingsMenu() {
      this.$settings.setEditingState(true);
      this.currentButton = {};
      this.$refs.settingsMenu.classList.toggle("is_active");
    },
    showButtonSettings(button) {
      this.currentButton = button;
      this.showModal = true;
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
  --primary-green: #63ff4fbb !important;
  --primary-green-lighten: #63ff4f33 !important;
  --success-color: #80b855 !important;
  --warning-color: #eaca44 !important;
  --error-color: #ef4d4d !important;
}
body {
  position: relative;
  box-sizing: border-box;
  background: var(--off-black);
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
  padding: 5px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.border_tabs_left {
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
.settings_menu_button {
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
  z-index: 601;
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
