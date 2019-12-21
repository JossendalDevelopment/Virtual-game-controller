<template>
  <div class="modal_container" v-if="showModal">
    <div>
      <div class="tabs_container">
        <span @click="setTab(tab)" class="tab_header" v-for="tab in tabs" :key="tab">{{ tab }}</span>
      </div>
      <p>Settings</p>
      <img draggable="false" class="drag_handle" src="@/assets/move.svg" />
      <component :is="currentTab" :data="buttonData" />
      <div style="padding: 4px 0;">
        <button @click="$emit('set-binding', buttonData)">bind</button>
        <button @click="save()">save</button>
        <button @click="$emit('close')">close</button>
        <button @click="$emit('delete', buttonData)">delete</button>
        <button @click="$bindings.duplicate(buttonData)">duplicate</button>
      </div>
    </div>
  </div>
</template>
<script>
import Style from "./ButtonSettingsModal--style.vue";
import Position from "./ButtonSettingsModal--position.vue";

export default {
  components: {
    Position,
    Style
  },
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: false,
      default() {
        return {
          style: {
            backgroundColor: "#e2e2e2"
          },
          position: {
            bottom: 381.4000015258789,
            height: "auto",
            left: 272,
            right: 359.375,
            top: 330,
            width: "auto"
          }
        };
      }
    }
  },
  data() {
    return {
      tabs: ["Style", "Position"],
      currentTab: "Style"
    };
  },
  computed: {
    buttonData: {
      get: function() {
        return this.data;
      },
      set: function(newValue) {
        console.log("SETTER", newValue);
        this.data = newValue;
        this.$emit("change", newValue);
      }
    },
    selectedColor() {
      return this.buttonData.style[this.selectedStyleProp];
    }
  },
  methods: {
    setTab(tab) {
      this.currentTab = tab;
    },
    save() {
      this.$bindings.update(this.buttonData);
      this.$bindings.setUserKeybindings(this.$bindings.userBindings);
      this.$emit("close");
    }
  }
};
</script>
<style>
.modal_container {
  position: relative;
  display: flex;
  background-color: lightgrey;
  z-index: 401;
  padding: 8px;
}
.drag_handle {
  position: absolute;
  top: 40px;
  right: 10px;
  height: 20px;
  width: 20px;
}
.tabs_container {
  display: flex;
  border-bottom: 1px solid black;
}
.tab_header {
  width: 50%;
  text-align: center;
  cursor: pointer;
}
.tab_header:first-child {
  border-right: 1px solid black;
}
.tab_header:hover {
  background-color: #a2a2a2;
}
</style>
