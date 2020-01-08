<template>
  <div class="mfd_container">
    <div class="power_button_group_left">
      <OutlineButton>
        <img
          slot="icon"
          alt="power-button"
          style="height: 30px; width: 30px;"
          src="@/assets/power-button.svg"
          class="power_button"
        />
        <p slot="text" :style="outlineButtonStyles">Weapons</p>
      </OutlineButton>
      <OutlineButton>
        <img
          slot="icon"
          alt="power-button"
          style="height: 30px; width: 30px;"
          src="@/assets/power-button.svg"
          class="power_button"
        />
        <p slot="text" :style="outlineButtonStyles">Shields</p>
      </OutlineButton>
      <OutlineButton>
        <img
          slot="icon"
          alt="power-button"
          style="height: 30px; width: 30px;"
          src="@/assets/power-button.svg"
          class="power_button"
        />
        <p slot="text" :style="outlineButtonStyles">Engines</p>
      </OutlineButton>
    </div>
    <div class="power_button_group_right">
      <div class="flight-ready" :style="flightReadyBtnStyles">
        <h2
          :style="
            `color: var(--primary-${$settings.color}); 
            z-index: 602; 
            text-align: center; 
            letter-spacing: 0.4rem;
            font-size: 2rem;`
          "
        >FLIGHT READY</h2>
      </div>
    </div>
    <div
      style="display: flex; flex-direction: column; width: 50%; justify-content: center; align-items: center;"
    >
      <h2 :style="`color: var(--primary-${$settings.color}); z-index: 602;`">DISTRIBUTOR</h2>
      <TriangularSlider />
      <h2 :style="`color: var(--primary-${$settings.color}); z-index: 602;`">RECENTER</h2>
    </div>
  </div>
</template>
<script>
import OutlineButton from "../components/buttons/Outlined.vue";
import TriangularSlider from "../components/buttons/TriangularSlider.vue";
export default {
  components: {
    OutlineButton,
    TriangularSlider
  },
  computed: {
    outlineButtonStyles() {
      return {
        color: `var(--primary-${this.$settings.color})`
      };
    },
    flightReadyBtnStyles() {
      return {
        border: `2px solid var(--primary-${this.$settings.color})`
      };
    }
  }
};
</script>
<style>
.mfd_container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 24px;
}
.power_button_group_left,
.power_button_group_right {
  width: 50%;
  z-index: 501;
}
.power_button_group_right {
  display: flex;
  align-items: center;
  justify-content: center;
}
.power_button {
  /* just make this power button green */
  filter: invert(0.5) sepia(1) saturate(5) hue-rotate(100deg);
  margin: 0 1em;
}
.flight-ready {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
</style>
