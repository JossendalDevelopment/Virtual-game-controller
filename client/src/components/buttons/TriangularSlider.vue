<template>
  <!-- <div class="triangle_container"> -->
  <div style draggable="false" class="triangle" ref="triangle">
    <svg
      style="position: relative; left: -119px; top: -6px;"
      width="238"
      height="238"
      @mousedown="dragStart"
      @mouseup="dragEnd"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="363.759"
        y1="295.438"
        x2="199.759"
        y2="205.438"
        :stroke="`var(--primary-${$settings.color})`"
      />
      <line
        x1="34.7606"
        y1="295.561"
        x2="199.761"
        y2="205.561"
        :stroke="`var(--primary-${$settings.color})`"
      />
      <line x1="200" y1="11" x2="200" y2="206" :stroke="`var(--primary-${$settings.color})`" />
      <g filter="url(#filter0_d)">
        <path
          d="M199.567 5.75001C199.759 5.41667 200.241 5.41667 200.433 5.75001L368.442 296.75C368.634 297.083 368.394 297.5 368.009 297.5H31.9911C31.6062 297.5 31.3656 297.083 31.5581 296.75L199.567 5.75001Z"
          :stroke="`var(--primary-${$settings.color})`"
          stroke-width="5"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="24.9866"
          y="1"
          width="350.027"
          height="305"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>

    <div class="triangle_drag_handle" ref="drag_handle"></div>
    <!-- </div> -->
  </div>
</template>
<script>
export default {
  mounted() {
    this.centerNode();
  },
  methods: {
    centerNode() {
      const triangle = document.querySelector(".triangle");
      let node = document.querySelector(".triangle_drag_handle");
      const coord = this.getTriangleCoordinates(triangle);
      const center = this.centroid(coord);

      // centers pip
      node.style.left = Math.round(center.left) - 10 + "px";
      node.style.top = Math.round(center.top) - 10 + "px";
    },
    dragStart() {
      const triangle = document.querySelector(".triangle");
      triangle.addEventListener("mousemove", this.onDrag, false);
    },
    dragEnd() {
      const triangle = document.querySelector(".triangle");
      triangle.removeEventListener("mousemove", this.onDrag, false);
    },
    onDrag(event) {
      const triangle = document.querySelector(".triangle");
      const node = document.querySelector(".triangle_drag_handle");
      const coord = this.getTriangleCoordinates(triangle);
      //   const offset = node.getBoundingClientRect();
      const offset = {
        left: event.clientX,
        top: event.clientY
      };
      // TODO use same vertices in bounded() to control key inputs
      if (this.bounded(offset, coord)) {
        node.style.left = event.clientX - 10 + "px";
        node.style.top = event.clientY - 10 + "px";
      }
    },
    getTopPoint(t) {
      const pos = t.getBoundingClientRect();
      const res = {};
      //we must add the borders to the offset
      let leftBorder = +getComputedStyle(t).borderLeftWidth.slice(0, -2);
      let topBorder = +getComputedStyle(t).borderTopWidth.slice(0, -2);

      res.left = pos.left + leftBorder;
      res.top = pos.top + topBorder;
      return res;
    },
    bottomLeftPoint(t) {
      //get the triangle bottom left point
      const top = this.getTopPoint(t);
      //   top.top += parseInt(t.getAttribute("border-bottom-width"), 10);
      //   top.left -= parseInt(t.getAttribute("border-left-width"), 10);
      top.top += +getComputedStyle(t).borderBottomWidth.slice(0, -2);
      top.left -= +getComputedStyle(t).borderLeftWidth.slice(0, -2);
      return top;
    },
    bottomRightPoint(t) {
      //get the triangle bottom right point
      const top = this.getTopPoint(t);
      //   top.top += parseInt(t.css("border-bottom-width"), 10);
      //   top.left -= parseInt(t.css("border-right-width"), 10);
      //   top.top += 10;
      //   top.left -= 10;
      top.top += +getComputedStyle(t).borderBottomWidth.slice(0, -2);
      top.left += +getComputedStyle(t).borderRightWidth.slice(0, -2);
      return top;
    },
    getTriangleCoordinates(t) {
      return {
        top: this.getTopPoint(t),
        bottomLeft: this.bottomLeftPoint(t),
        bottomRight: this.bottomRightPoint(t)
      };
    },
    bounded(P, triangle) {
      //http://www.blackpawn.com/texts/pointinpoly/
      const A = triangle.bottomLeft;
      const B = triangle.top;
      const C = triangle.bottomRight;
      // Compute vectors
      const v0 = {
        x: C.left - A.left,
        y: C.top - A.top
      };
      const v1 = {
        x: B.left - A.left,
        y: B.top - A.top
      };

      const v2 = {
        x: P.left - A.left,
        y: P.top - A.top
      };

      // Compute dot products
      let dot00 = this.dot(v0, v0);
      let dot01 = this.dot(v0, v1);
      let dot02 = this.dot(v0, v2);
      let dot11 = this.dot(v1, v1);
      let dot12 = this.dot(v1, v2);

      // Compute barycentric coordinates
      let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
      let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

      // Check if point is in triangle
      console.log("VECTORS", u, v);
      // u = 0; v = 1 is top
      // u = 1; v = 0 is right
      // u = 0; v = 0 is left
      return u >= 0 && v >= 0 && u + v < 1;
    },
    dot(vector1, vector2) {
      //compute dot product
      return vector1.x * vector2.x + vector1.y * vector2.y;
    },
    centroid(triangle) {
      //FIND CENTROID
      //http://easycalculation.com/analytical/learn-centroid.php
      var left =
        triangle.top.left +
        triangle.bottomLeft.left +
        triangle.bottomRight.left;
      left = left / 3;

      var top =
        triangle.top.top + triangle.bottomLeft.top + triangle.bottomRight.top;
      top = top / 3;

      return {
        top: top,
        left: left
      };
    }
  }
};
</script>
<style>
.triangle_container {
  z-index: 602;
}
.triangle {
  /* position: relative; */
  /* margin-left: 150px; */
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 172px solid #ffffff33;
  z-index: 602;
}
.triangle_drag_handle {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  z-index: 603;
}
</style>
