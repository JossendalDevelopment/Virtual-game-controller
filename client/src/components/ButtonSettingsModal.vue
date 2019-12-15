<template>
  <Moveable v-if="showModal" class="moveable" v-bind="moveable" @drag="handleDrag">
  <div class="modal_container">
    <div style="position: relative;">
      <p class="drag_handle" @mousedown="toggleDraggable" @mouseup="toggleDraggable">drag</p>
      <p>Settings</p>
      <input v-model="buttonData.buttonName" />
      <p>Bound to key: {{ data.key }}</p>
      <button @click="$emit('set-binding', buttonData)">change</button>
    </div>
    <button @click="$emit('save', buttonData)">save</button>
  </div>
  </Moveable>
</template>
<script>
import Moveable from "@/components/Moveable.vue";

export default {
  components: {
    Moveable
  },
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      moveable: {
        draggable: false,
        throttleDrag: 1,
        resizable: false,
        throttleResize: 1,
        keepRatio: true,
        scalable: false,
        throttleScale: 0.01,
        rotatable: false,
        throttleRotate: 0.2,
        pinchable: false, // ["draggable", "resizable", "scalable", "rotatable"]
        origin: false
      },
      buttonData: this.data,
      isDraggable: false
    };
  },
  computed: {},
  methods: {
    handleDrag({ target, transform }) {
      console.log("onDrag left, top", transform);
      target.style.transform = transform;
    },
    toggleDraggable() {
      this.isDraggable = !this.isDraggable;
      this.moveable = {
        ...this.moveable,
        draggable: this.isDraggable
      };
    }
  }
};
</script>
<style>
.modal_container {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 250px;
  height: 150px;
  background-color: lightgrey;
  z-index: 401;
}
.drag_handle {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
