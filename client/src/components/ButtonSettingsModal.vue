<template>
  <Moveable v-if="showModal" class="moveable" v-bind="moveable" @drag="handleDrag">
    <div class="modal_container">
      <div style="position: relative;">
        <p>Settings</p>
        <img
          class="drag_handle"
          @mousedown="toggleDraggable"
          @mouseup="toggleDraggable"
          src="@/assets/move.svg"
        />
        <div>
          <span>Name:</span>
          <input v-model="data.buttonName" />
        </div>
        <div>
          <span>Color:</span>
          <input v-model="buttonData.style.background" />
        </div>
        <span>Bound to key: {{ data.key }}</span>
      </div>
      <div>
        <button @click="$emit('set-binding', buttonData)">change</button>
        <button @click="$emit('save', buttonData)">save</button>
      </div>
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
      // buttonData: this.data,
      isDraggable: false
    };
  },
  mounted() {
    console.log("MOUNT", this.data);
  },
  computed: {
    buttonData() {
      return this.data;
    }
  },
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
  /* width: 250px; */
  /* height: 150px; */
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
  cursor: pointer;
}
</style>
