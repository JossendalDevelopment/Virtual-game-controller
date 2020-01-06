<template>
  <div class="triangle" ref="triangle">
    <div class="triangle_drag_handle" ref="drag_handle" :draggable="true"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    function getTopPoint(t) {
      const pos = t.getBoundingClientRect();
      const res = {};
      //we must add the borders to the offset
      let leftBorder = +getComputedStyle(t).borderLeftWidth.slice(0, -2);
      let topBorder = +getComputedStyle(t).borderTopWidth.slice(0, -2);

      res.left = pos.left + leftBorder;
      res.top = pos.top + topBorder;
      return res;
    }

    //get the triangle bottom left point
    function bottomLeftPoint(t) {
      const top = getTopPoint(t);
      //   top.top += parseInt(t.getAttribute("border-bottom-width"), 10);
      //   top.left -= parseInt(t.getAttribute("border-left-width"), 10);
      top.top += +getComputedStyle(t).borderBottomWidth.slice(0, -2);
      top.left -= +getComputedStyle(t).borderLeftWidth.slice(0, -2);
      return top;
    }

    //get the triangle bottom right point
    function bottomRightPoint(t) {
      const top = getTopPoint(t);
      //   top.top += parseInt(t.css("border-bottom-width"), 10);
      //   top.left -= parseInt(t.css("border-right-width"), 10);
      //   top.top += 10;
      //   top.left -= 10;
      top.top += +getComputedStyle(t).borderBottomWidth.slice(0, -2);
      top.left += +getComputedStyle(t).borderRightWidth.slice(0, -2);
      return top;
    }

    function getTriangleCoordinates(t) {
      return {
        top: getTopPoint(t),
        bottomLeft: bottomLeftPoint(t),
        bottomRight: bottomRightPoint(t)
      };
    }

    //FIND CENTROID
    //http://easycalculation.com/analytical/learn-centroid.php
    function centroid(triangle) {
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
    //compute dot product
    function dot(vector1, vector2) {
      return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    //http://www.blackpawn.com/texts/pointinpoly/
    function bounded(P, triangle) {
      console.log("P", P, "TRI", triangle);
      var A = triangle.bottomLeft;
      var B = triangle.top;
      var C = triangle.bottomRight;
      // Compute vectors
      var v0 = {
        x: C.left - A.left,
        y: C.top - A.top
      };
      var v1 = {
        x: B.left - A.left,
        y: B.top - A.top
      };

      var v2 = {
        x: P.left - A.left,
        y: P.top - A.top
      };

      // Compute dot products
      var dot00 = dot(v0, v0);
      var dot01 = dot(v0, v1);
      var dot02 = dot(v0, v2);
      var dot11 = dot(v1, v1);
      var dot12 = dot(v1, v2);

      // Compute barycentric coordinates
      let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
      let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

      // Check if point is in triangle
      console.log("VECTORS", u, v);
      return u >= 0 && v >= 0 && u + v < 1;
    }

    (() => {
      var triangle = document.querySelector(".triangle");
      var node = document.querySelector(".triangle_drag_handle");
      var coord = getTriangleCoordinates(triangle);
      var center = centroid(coord);

      //   node.setAttribute("draggable", true);
      node.addEventListener("dragstart", () => {
        var offset = triangle.getBoundingClientRect();
        console.log("DRAGGING", bounded(offset, coord));
        // if (!bounded(offset, coord)) return false;
      });
      node.addEventListener("drop", event => {
        console.log("DROP", event);
      });
      node.addEventListener("dragend", event => {
        console.log("END", event.clientX);
      });
      node.addEventListener("dragover", event => event.preventDefault());
      //   node.draggable({
      //     drag: function(event, ui) {
      //       var offset = ui.offset;
      //       if (!bounded(offset, coord)) return false;
      //     }
      //   });

      node.style.left = Math.round(center.left) - 5 + "px";
      node.style.top = Math.round(center.top) - 5 + "px";
      //   node.css("top", Math.round(center.top) - 5 + "px");

      console.log(coord);
    })();
  }
};
</script>
<style>
.triangle {
  margin-left: 150px;
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;

  border-bottom: 172px solid white;
  z-index: 601;
}
.triangle_drag_handle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  z-index: 602;
}
</style>
