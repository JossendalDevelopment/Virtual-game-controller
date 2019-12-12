<template>
  <div v-if="editing">
    <Moveable
      class="moveable"
      v-bind="moveable"
      @drag="handleDrag"
      @resize="handleResize"
      @scale="handleScale"
      @rotate="handleRotate"
      @warp="handleWarp"
      @pinch="handlePinch"
      v-on:render="event => onRender(event)"
      v-on:dragEnd="event => onEnd(event)"
      ref="moveable"
    >
      <Button>{{ data.buttonName }}</Button>
    </Moveable>
  </div>
  <div v-else>
    <Button ref="button">{{ data.buttonName }}</Button>
  </div>
</template>
<script>
// import Moveable from 'vue-moveable';
import Moveable from "@/components/Moveable.vue";

export default {
  name: "app",
  components: {
    Moveable
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
  data: () => ({
    moveable: {
      draggable: true,
      throttleDrag: 1,
      resizable: false,
      throttleResize: 1,
      keepRatio: false,
      scalable: true,
      throttleScale: 0.01,
      rotatable: true,
      throttleRotate: 0.2,
      pinchable: true, // ["draggable", "resizable", "scalable", "rotatable"]
      origin: false
    }
  }),
  mounted() {
    this.$nextTick(() => {
      console.log("REFS", this.data.transform);
      if (this.editing)
        this.$refs.moveable.$el.style.transform = this.data.transform;
      if (!this.editing)
        this.$refs.button.style.transform = this.data.transform;
    });
  },
  watch: {
    editing: function(newVal, oldVal) {
      this.$nextTick(() => {
        if (newVal)
          this.$refs.moveable.$el.style.transform = this.data.transform;
        if (!newVal) this.$refs.button.style.transform = this.data.transform;
      });
    }
  },
  methods: {
    onRender(event) {
      // console.log("TARG", event.style.transform = `matrix(1,0,0,1,243,-11) translate(-6px, 251px)`)
      // event.style.transform = `matrix(1,0,0,1,243,-11) translate(-6px, 251px)`
    },
    onEnd(event) {
      const newData = {
        ...this._props.data,
        transform: event.target.style.transform
      };
      this.$emit("move-end", newData);
    },
    handleDrag({ target, transform, left, top }) {
      console.log("onDrag left, top", transform);
      target.style.transform = transform;
      // save left and top with a seconds delay to vuex?
      // then import those values when component loads
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
