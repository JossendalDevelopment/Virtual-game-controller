<template>
  <Moveable class="moveable" v-bind="moveable" @drag="handleDrag">
    <div class="modal_container" v-if="showModal">
      <div style="position: relative;">
        <p
          class="drag_handle"
          @mousedown="toggleDraggable"
          @mouseup="toggleDraggable"
        >
          drag
        </p>
        <p>Settings</p>
        <input v-model="buttonData.buttonName" />
        <p>Bound to key: {{ buttonData.key }}</p>
      </div>
      <Cog />
      <button @click="$emit('save', buttonData)">save</button>
    </div>
  </Moveable>
</template>
<script>
import Cog from "../../public/gear-option.svg";
import Moveable from "@/components/Moveable.vue";

export default {
  components: {
    Cog,
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
    handleDrag({ target, transform, left, top }) {
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
  z-index: 101;
}
.drag_handle {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
