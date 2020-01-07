<template>
  <div class="triangle" ref="triangle" @mousedown="dragStart" @mouseup="dragEnd">
    <div class="triangle_drag_handle" ref="drag_handle"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    const triangle = document.querySelector(".triangle");
    let node = document.querySelector(".triangle_drag_handle");
    const coord = this.getTriangleCoordinates(triangle);
    const center = this.centroid(coord);

    // //   node.setAttribute("draggable", true);
    // node.addEventListener("dragstart", () => {
    //   var offset = triangle.getBoundingClientRect();
    //   console.log("DRAG START", this.bounded(offset, coord));
    //   // if (!bounded(offset, coord)) return false;
    // });
    // node.addEventListener("drop", event => {
    //   console.log("DROP", event);
    // });
    // node.addEventListener("dragend", event => {
    //   console.log("END", event.clientX);
    // });
    // node.addEventListener("dragover", event => event.preventDefault());
    //   node.draggable({
    //     drag: function(event, ui) {
    //       var offset = ui.offset;
    //       if (!bounded(offset, coord)) return false;
    //     }
    //   });

    // centers pip
    node.style.left = Math.round(center.left) - 10 + "px";
    node.style.top = Math.round(center.top) - 10 + "px";
  },
  methods: {
    dragStart() {
      //   const node = document.querySelector(".triangle_drag_handle");
      const triangle = document.querySelector(".triangle");
      triangle.addEventListener("mousemove", this.onDrag, false);
    },
    dragEnd() {
      //   const node = document.querySelector(".triangle_drag_handle");
      const triangle = document.querySelector(".triangle");
      triangle.removeEventListener("mousemove", this.onDrag, false);
    },
    onDrag(event) {
      const triangle = document.querySelector(".triangle");
      const node = document.querySelector(".triangle_drag_handle");
      const coord = this.getTriangleCoordinates(triangle);
      const offset = node.getBoundingClientRect();
      console.log("BOUNDED", this.bounded(offset, coord));
      if (this.bounded(offset, coord)) {
        node.style.left = event.clientX + "px";
        node.style.top = event.clientY + "px";
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
      console.log("VECTORS", u, v, u + v);
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
.triangle {
  /* position: relative; */
  /* margin-left: 150px; */
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 172px solid white;
  z-index: 601;
}
/* .triangle:after,
.triangle:before {
  position: absolute;
  content: "";
  display: block;
  width: 0;
  height: 0;
  border-left: 10px solid green;
  border-right: 10px solid green;
  border-bottom: 10px solid green;
  border: 2px solid green;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 602;
} */
.triangle_drag_handle {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  z-index: 603;
}
</style>
