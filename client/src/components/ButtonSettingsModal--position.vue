<template>
  <div class="modal_position_container">
    <div style="position: relative;">
      <div class="input_wrapper">
        <span>Left value:</span>
        <input
          @input="event => changePosition(event, 'left')"
          style="width: 75px;"
          type="number"
          step="1"
          v-model="buttonData.position.left"
        />
      </div>
      <div class="input_wrapper">
        <span>Top value:</span>
        <input
          @input="event => changePosition(event, 'top')"
          :value="buttonData.position.top"
          style="width: 75px;"
          type="number"
          step="1"
        />
      </div>
      <div style="display: flex;">
        <div style="flex-direction: column; flex-grow: 1;">
          <div class="input_wrapper">
            <span>Height:</span>
            <input
              @input="event => changeDimensions(event, 'height')"
              :value="buttonData.position.height"
              style="width: 75px;"
              type="number"
              step="1"
              min="20"
            />
          </div>
          <div class="input_wrapper">
            <span>Width:</span>
            <input
              @input="event => changeDimensions(event, 'width')"
              :value="buttonData.position.width"
              style="width: 75px;"
              type="number"
              step="1"
              min="20"
            />
          </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: center;">
          <img
            @click="toggleDimensionalLink"
            :src="require(`@/assets/${isLinked ? 'link' : 'link-broken'}.svg`)"
            style="width: 20px; style: 20px;"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
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
      isLinked: false
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
    }
  },
  methods: {
    changePosition(event, prop) {
      this.buttonData.position[prop] = +event.target.value;
      this.$emit("change", this.buttonData);
      // this.$bindings.update(newPosition);
    },
    changeDimensions(event, prop) {
      if (this.isLinked) {
        this.buttonData.position.height = +event.target.value;
        this.buttonData.position.width = +event.target.value;
      } else {
        this.buttonData.position[prop] = +event.target.value;
      }
      this.$emit("change", this.buttonData);
    },
    toggleDimensionalLink() {
      this.isLinked = !this.isLinked;
      if (this.isLinked)
        this.buttonData.position.width = this.buttonData.position.height;
    }
  }
};
</script>
<style>
.modal_position_container {
  /* position: relative;
  display: flex; */
}
.picker_button {
  height: 20px;
  width: 80px;
}
.input_wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
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