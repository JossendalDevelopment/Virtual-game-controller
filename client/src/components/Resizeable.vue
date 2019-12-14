<template>
  <div
    class="resizable"
    :ref="`resizable${this.data.id}`"
    :draggable="editing"
    @click="onPress"
    :data-item="data.id"
  >
    <div class="resizers">
      <p style="text-align: center;">{{ buttonData.buttonName }}</p>
      <template v-if="editing">
        <div class="resizer top-left" :class="'resizer' + data.id"></div>
        <div class="resizer top-right" :class="'resizer' + data.id"></div>
        <div class="resizer bottom-left" :class="'resizer' + data.id"></div>
        <div class="resizer bottom-right" :class="'resizer' + data.id"></div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    buttonData: {
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
      original_width: 0,
      original_height: 0,
      original_x: 0,
      original_y: 0,
      original_mouse_x: 0,
      original_mouse_y: 0,
      minimum_size: 20,
      data: this.buttonData
    };
  },
  computed: {
    buttonStyles() {
      return this.buttonData.styles;
    }
  },
  methods: {
    onPress() {
      !this.editing && this.$emit("pressed", this.data);
    },
    handleDragStart(event, element) {
      element.style.opacity = "0.8";
      var style = window.getComputedStyle(event.target, null);
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
    handleDragOver(event, element) {
      if (event.preventDefault) {
        event.preventDefault(); // Necessary. Allows us to drop.
      }
      event.dataTransfer.dropEffect = "move"; // See the section on the DataTransfer object.
      return false;
    },
    handleDragEnter(event, element) {
      // this / e.target is the current hover target.
      //   element.classList.add("over");
    },
    handleDragLeave(event, element) {
      //   element.classList.remove("over"); // this / e.target is previous target element.
    },
    handleDrop(event, element) {
      const elements = document.querySelectorAll(".resizable");
      const offset = event.dataTransfer.getData("text/plain").split(",");
      elements[parseInt(offset[2])].style.left =
        event.clientX + parseInt(offset[0], 10) + "px";
      elements[parseInt(offset[2])].style.top =
        event.clientY + parseInt(offset[1], 10) + "px";
      //   element.style.left = event.clientX + parseInt(offset[0], 10) + "px";
      //   element.style.top = event.clientY + parseInt(offset[1], 10) + "px";

      this.data = {
        ...this.data,
        style: element.getBoundingClientRect()
      };
      this.$emit("drag-end", this.data);

      if (event.stopPropagation) {
        event.stopPropagation(); // stops the browser from redirecting.
      }
      return false;
    },

    handleDragEnd(event, element) {
      element.style.opacity = "1";
      element.classList.remove("over");
    },
    makeEditable(element) {
      const resizers = document.querySelectorAll(`.resizer`);
      let minimum_size = 20;
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
      element.addEventListener(
        "dragenter",
        event => this.handleDragEnter(event, element),
        false
      );
      document.body.addEventListener(
        "dragover",
        event => this.handleDragOver(event, element),
        false
      );
      element.addEventListener(
        "dragleave",
        event => this.handleDragLeave(event, element),
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
          console.log("1", this.data);
          this.data = {
            ...this.data,
            style: element.getBoundingClientRect()
          };
          this.$emit("drag-end", this.data);
          window.removeEventListener("mousemove", resize);
        };
      }
    }
  },
  watch: {
    editing: function(newVal, oldVal) {
      this.$nextTick(() => {
        const element = this.$refs[`resizable${this.data.id}`];
        this.makeEditable(element);
      });
    }
  },
  mounted() {
    // const element = this.$refs.resizable;
    const element = this.$refs[`resizable${this.data.id}`];
    element.style.width = this.buttonData.style.width + "px";
    element.style.height = this.buttonData.style.height + "px";
    element.style.top = this.buttonData.style.top + "px";
    element.style.left = this.buttonData.style.left + "px";
    if (this.editing) {
      this.makeEditable(element);
    }
  }
};
</script>
<style>
.resizable {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  position: absolute;
}

.resizable:active {
  background: rgb(151, 151, 151);
}

.resizable .resizers {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 3px solid #bada55;
  box-sizing: border-box;
}

.resizable .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%; /*magic to turn square into circle*/
  background: white;
  border: 3px solid #4286f4;
  position: absolute;
  z-index: 401;
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
