<template>
  <div
    :ref="`resizable${buttonIndex}`"
    class="resizable"
    :draggable="editing"
    :data-item="buttonIndex"
    @click="onPress"
  >
    <slot name="top-right-icon" />
    <div class="resizers">
      <slot name="content" />
      <template v-if="editing">
        <div
          :style="selected ? { border: '3px solid #ff2de3' } : undefined"
          class="resizer top-left"
          :class="'resizer' + data.id"
        />
        <div
          :style="selected ? { border: '3px solid #ff2de3' } : undefined"
          class="resizer top-right"
          :class="'resizer' + data.id"
        />
        <div
          :style="selected ? { border: '3px solid #ff2de3' } : undefined"
          class="resizer bottom-left"
          :class="'resizer' + data.id"
        />
        <div
          :style="selected ? { border: '3px solid #ff2de3' } : undefined"
          class="resizer bottom-right"
          :class="'resizer' + data.id"
        />
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    buttonData: {
      type: Object,
      required: false,
      default() {
        return {
          buttonName: "Settings",
          position: {
            width: "auto",
            height: "auto",
            top: 100,
            left: 100
          },
          style: {
            background: "#e2e2e2"
          }
        };
      }
    },
    buttonIndex: {
      type: Number,
      required: true
    },
    editing: {
      type: Boolean,
      required: true
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      data: this.buttonData
    };
  },
  computed: {
    buttonStyles() {
      return this.buttonData.styles;
    }
  },
  watch: {
    editing: function() {
      this.$nextTick(() => {
        const element = this.$refs[`resizable${this.buttonIndex}`];
        this.makeEditable(element);
      });
    },
    "buttonData.position": {
      handler: function(newVal, oldVal) {
        console.log("POSITION CHANGED", newVal, oldVal);
        const element = this.$refs[`resizable${this.buttonIndex}`];
        this.setElementPosition(element, newVal);
      },
      deep: true
    }
  },
  mounted() {
    const element = this.$refs[`resizable${this.buttonIndex}`];
    if (this.buttonData.position) {
      this.setElementPosition(element, this.buttonData.position);
      if (this.editing) {
        this.makeEditable(element);
      }
    }
  },
  methods: {
    setElementPosition(element, position) {
      element.style.width = position.width + "px";
      element.style.height = position.height + "px";
      element.style.top = position.top + "px";
      element.style.left = position.left + "px";
    },
    positionToPercent(num) {
      const n = (num / window.innerWidth) * 100;
      return n;
    },
    onPress() {
      if (!this.editing) this.$emit("pressed", this.buttonData);
    },
    handleDragStart(event, element) {
      element.style.opacity = "0.8";
      const style = window.getComputedStyle(event.target, null);
      event.dataTransfer.setData(
        "text/plain",
        parseInt(style.getPropertyValue("left"), 10) -
          event.clientX +
          "," +
          (parseInt(style.getPropertyValue("top"), 10) -
            event.clientY +
            "," +
            event.target.getAttribute("data-item"))
      );
    },
    handleDragOver(event) {
      if (event.preventDefault) {
        event.preventDefault(); // Necessary. Allows us to drop.
      }
      // event.dataTransfer.dropEffect = "move"; // See the section on the DataTransfer object.
      return false;
    },
    handleDrop(event, element) {
      const elements = document.querySelectorAll(".resizable");
      const offset = event.dataTransfer.getData("text/plain").split(",");
      elements[parseInt(offset[2])].style.left =
        event.clientX + parseInt(offset[0], 10) + "px";
      elements[parseInt(offset[2])].style.top =
        event.clientY + parseInt(offset[1], 10) + "px";
      // element.style.left = event.clientX + parseInt(offset[0], 10) + "px";
      // element.style.top = event.clientY + parseInt(offset[1], 10) + "px";
      if (event.stopPropagation) {
        event.stopPropagation();
      }

      // TODO do not emit this event for drop event of settings modal
      const rect = element.getBoundingClientRect();

      this.data = {
        ...this.data,
        position: rect
      };
      // this.data = {
      //   ...this.data,
      //   position: {
      //     left: this.positionToPercent(rect.left),
      //     right: this.positionToPercent(rect.right),
      //     top: this.positionToPercent(rect.top),
      //     bottom: this.positionToPercent(rect.bottom),
      //     height: this.positionToPercent(rect.height),
      //     width: this.positionToPercent(rect.width)
      //   }
      // };
      this.$emit("drag-end", this.data);

      return false;
    },

    handleDragEnd(event, element) {
      element.style.opacity = "1";
      element.classList.remove("over");
    },
    makeEditable(element) {
      const resizers = document.querySelectorAll(`.resizer${this.data.id}`);
      let minimum_size = 40;
      let original_width = 0;
      let original_height = 0;
      let original_x = 0;
      let original_y = 0;
      let original_mouse_x = 0;
      let original_mouse_y = 0;

      element.addEventListener(
        "dragstart",
        event => this.handleDragStart(event, element),
        false
      );
      document.body.addEventListener(
        "drop",
        event => this.handleDrop(event, element),
        false
      );
      element.addEventListener(
        "dragend",
        event => this.handleDragEnd(event, element),
        false
      );
      document.body.addEventListener(
        "dragover",
        event => this.handleDragOver(event, element),
        false
      );

      for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener("mousedown", e => {
          e.preventDefault();
          original_width = parseFloat(
            getComputedStyle(element, null)
              .getPropertyValue("width")
              .replace("px", "")
          );
          original_height = parseFloat(
            getComputedStyle(element, null)
              .getPropertyValue("height")
              .replace("px", "")
          );
          original_x = element.getBoundingClientRect().left;
          original_y = element.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener("mousemove", resize);
          window.addEventListener("mouseup", stopResize);
        });

        const resize = e => {
          if (currentResizer.classList.contains("bottom-right")) {
            const width = original_width + (e.pageX - original_mouse_x);
            const height = original_height + (e.pageY - original_mouse_y);
            if (width > minimum_size) {
              element.style.width = width + "px";
            }
            if (height > minimum_size) {
              element.style.height = height + "px";
            }
          } else if (currentResizer.classList.contains("bottom-left")) {
            const height = original_height + (e.pageY - original_mouse_y);
            const width = original_width - (e.pageX - original_mouse_x);
            if (height > minimum_size) {
              element.style.height = height + "px";
            }
            if (width > minimum_size) {
              element.style.width = width + "px";
              element.style.left =
                original_x + (e.pageX - original_mouse_x) + "px";
            }
          } else if (currentResizer.classList.contains("top-right")) {
            const width = original_width + (e.pageX - original_mouse_x);
            const height = original_height - (e.pageY - original_mouse_y);
            if (width > minimum_size) {
              element.style.width = width + "px";
            }
            if (height > minimum_size) {
              element.style.height = height + "px";
              element.style.top =
                original_y + (e.pageY - original_mouse_y) + "px";
            }
          } else {
            const width = original_width - (e.pageX - original_mouse_x);
            const height = original_height - (e.pageY - original_mouse_y);
            if (width > minimum_size) {
              element.style.width = width + "px";
              element.style.left =
                original_x + (e.pageX - original_mouse_x) + "px";
            }
            if (height > minimum_size) {
              element.style.height = height + "px";
              element.style.top =
                original_y + (e.pageY - original_mouse_y) + "px";
            }
          }
        };

        const stopResize = () => {
          const rect = element.getBoundingClientRect();

          // this.data = {
          //   ...this.data,
          //   position: {
          //     left: this.positionToPercent(rect.left),
          //     right: this.positionToPercent(rect.right),
          //     top: this.positionToPercent(rect.top),
          //     bottom: this.positionToPercent(rect.bottom),
          //     height: this.positionToPercent(rect.height),
          //     width: this.positionToPercent(rect.width)
          //   }
          // };
          this.data = {
            ...this.data,
            position: rect
          };
          this.$emit("drag-end", this.data);
          window.removeEventListener("mousemove", resize);
        };
      }
    }
  }
};
</script>
<style>
.resizable {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
}

.resizable:active {
  opacity: 0.8;
}

.resizable .resizers {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.resizable .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  color: #ff2de3;
  border: 3px solid #4286f4;
  position: absolute;
  z-index: 201;
}

.resizable .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize; /*resizer cursor*/
}
.resizable .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.resizable .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.resizable .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
