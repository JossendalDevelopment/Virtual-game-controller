<template>
  <div class="modal_container" v-if="showModal">
    <div style="position: relative;">
      <p>Settings</p>
      <img draggable="false" class="drag_handle" src="@/assets/move.svg" />
      <div class="input_wrapper">
        <span>Name:</span>
        <input v-model="buttonData.buttonName" />
      </div>
      <div class="input_wrapper">
        <span>Background:</span>
        <input type="color" v-model="buttonData.style.background" />
      </div>
      <div class="input_wrapper">
        <span>Opacity:</span>
        <input
          style="width: 75px;"
          type="number"
          step="0.1"
          max="1"
          min="0"
          v-model="buttonData.style.opacity"
        />
      </div>
      <div class="input_wrapper">
        <span>Text:</span>
        <input type="color" v-model="buttonData.style.color" />
      </div>
      <div class="input_wrapper">
        <span>Size:</span>
        <input
          style="width: 75px;"
          type="number"
          step="1"
          max="48"
          v-model="buttonData.style.fontSize"
        />
      </div>
      <span>Bound to key: {{ buttonData.key }}</span>
    </div>
    <div style="padding: 4px 0;">
      <button @click="$emit('set-binding', buttonData)">bind</button>
      <button @click="save()">save</button>
      <button @click="$emit('close')">close</button>
      <button @click="$emit('delete', buttonData)">delete</button>
    </div>
  </div>
</template>
<script>
export default {
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
            background: "#e2e2e2"
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
  computed: {
    buttonData: {
      get: function() {
        return this.data;
      },
      set: function(newValue) {
        console.log("SETTER", newValue);
      }
    }
  },
  methods: {
    save() {
      this.$bindings.setUserKeybindings(this.$bindings.userBindings);
      this.$emit("close");
    }
  }
};
</script>
<style>
.modal_container {
  position: relative;
  background-color: lightgrey;
  z-index: 401;
  padding: 8px;
}
.drag_handle {
  position: absolute;
  top: 0;
  right: 10px;
  height: 20px;
  width: 20px;
  /* cursor: pointer; */
}
.input_wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}
</style>
