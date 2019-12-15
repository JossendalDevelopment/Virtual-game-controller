<template>
  <!-- <Moveable
    class="moveable"
    v-bind="moveable"
    @drag="handleDrag"
    @resize="handleResize"
    @scale="handleScale"
    @rotate="handleRotate"
    @warp="handleWarp"
    @pinch="handlePinch"
    v-on:dragEnd="event => setNewPosition(event)"
    v-on:scaleEnd="event => setNewScale(event)"
    ref="moveable"
  >-->
  <!-- <span>BBBBBBBBIIIIIIIIIIIIFFFFFFFFFFFFFF</span> -->
  <div ref="button"
draggable="true" class="button"
@click="handleClick">
    {{ data.buttonName }}
    <img
      v-if="editing"
      style="position: absolute; z-index: 301; top: 0; right: 0; height: 10px; width: 10px;"
      src="@/assets/gear-option.svg"
      @click="showButtonSettings"
    />
  </div>
  <!-- </Moveable> -->

  <!-- <ButtonSettingsModal
      v-on:save="event => save(event)"
      :showModal="showModal"
      :data="data"
  />-->
</template>
<script>
// import Moveable from 'vue-moveable';
import Moveable from "@/components/Moveable.vue";
import ButtonSettingsModal from "@/components/ButtonSettingsModal.vue";

export default {
  name: "App",
  components: {
    // Moveable
    // ButtonSettingsModal
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    editing: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    moveable() {
      return {
        draggable: true,
        throttleDrag: 1,
        resizable: false,
        throttleResize: 1,
        keepRatio: false,
        scalable: true,
        throttleScale: 0.01,
        rotatable: false,
        throttleRotate: 0.2,
        pinchable: true, // ["draggable", "resizable", "scalable", "rotatable"]
        origin: false,
        edge: true
      };
    },
    setStyles() {
      return {
        left: this.data.position.x,
        top: this.data.position.y,
        height: this.data.height,
        width: this.data.width
      };
    }
  },
  watch: {
    editing: function(newVal, oldVal) {
      this.$nextTick(() => {
        // if (newVal)
        // this.$refs.moveable.$el.style.transform = this.data.transform;
        // if (!newVal) this.$refs.button.style.transform = this.data.transform;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log("REFS", this.$refs);
      // this.$refs.moveable.$el.style.transform = this.data.transform;
      // this.$refs.moveable.$el.style.top = this.data.style.top + "px";
      // this.$refs.moveable.$el.style.height = this.data.style.height + "px";
      // this.$refs.moveable.$el.style.width = this.data.style.width + "px";
      this.$refs.button.style.top = this.data.style.top + "px";
      this.$refs.button.style.left = this.data.style.left + "px";
      this.$refs.button.style.height = this.data.style.height + "px";
      this.$refs.button.style.width = this.data.style.width + "px";
    });
  },
  methods: {
    save(data) {
      this.showModal = false;
    },
    showButtonSettings() {
      this.showModal = true;
    },
    handleClick() {
      this.$emit("pressed", this._props.data);
    },
    setNewPosition(event) {
      const x = ((event.clientX / window.innerWidth) * 100).toFixed(4);
      const y = ((event.clientY / window.innerHeight) * 100).toFixed(4);
      const newData = {
        ...this._props.data,
        transform: event.target.style.transform,
        style: {
          left: x,
          top: y
        }
      };
      console.log("NEW POSITION", newData);
      this.$emit("drag-end", newData);
    },
    setNewScale(event) {
      const boundingBox = event.target.getBoundingClientRect();
      const newData = {
        ...this._props.data,
        transform: event.target.style.transform,
        style: {
          height: boundingBox.height.toFixed(4),
          width: boundingBox.width.toFixed(4)
        }
      };
      this.$emit("scale-end", newData);
    },
    handleDrag({ target, transform, left, top, clientX, clientY }) {
      target.style.transform = transform;
    },
    handleResize({ target, width, height, delta }) {
      console.log("onResize", width, height);
      delta[0] && (target.style.width = `${width}px`);
      delta[1] && (target.style.height = `${height}px`);
    },
    handleScale({ target, transform, scale }) {
      console.log("onScale scale", scale);
      target.style.transform = transform;
    },
    handleRotate({ target, dist, transform }) {
      console.log("onRotate", dist);
      target.style.transform = transform;
    },
    handleWarp({ target, transform }) {
      console.log("onWarp", transform);
      target.style.transform = transform;
    },
    handlePinch({ target }) {
      console.log("onPinch", target);
    }
  }
};
</script>
<style>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.moveable {
  /* display: inline-block; */
}
.button {
  display: inline-block;
  border: 1px solid white;
  background-color: lightgrey;
  color: darkslategrey;
}
.button:active {
  background-color: rgb(145, 145, 145);
}
</style>
