<template>
  <path
    class="vue-flowchart-svg-nodes-connections-connection"
    :d="path"
    :stroke-width="option_link_border_width"
    :stroke="option_link_border_color"
    fill="none"
  />
</template>
<script>
import options from "../options";
export default {
  name: "VueFlowchartConnection",
  mixins: [options],
  props: {
    connection: {
      type: Object,
      default() {
        return {
          fromX: 0,
          fromY: 0,
          toX: 0,
          toY: 0,
        };
      },
    },
  },
  computed: {
    path() {
      // https://developer.mozilla.org/ja/docs/Web/SVG/Attribute/d
      const [fx, fy] = [this.connection.fromX, this.connection.fromY];
      const [tx, ty] = [this.connection.toX, this.connection.toY];
      const l = 10;

      switch (this.option_link_type) {
        case "curve":
          return this.createCuve({ fx, fy, tx, ty, l });
        case "key_line":
          return this.createKeyLine({ fx, fy, tx, ty, l });
        default:
          return this.createLine({ fx, fy, tx, ty });
      }
    },
  },
  methods: {
    createLine({ fx, fy, tx, ty }) {
      return `M${fx},${fy} L${tx},${ty}`;
    },
    createKeyLine({ fx, fy, tx, ty, l }) {
      if (fx + l > tx) {
        return `M${fx},${fy} H${fx + l} V${(fy + ty) / 2} 
            H${tx - l} V${ty} H${tx}`;
      }
      return `M${fx},${fy} H${(fx + tx) / 2} V${ty} H${tx}`;
    },
    createCuve({ fx, fy, tx, ty, l }) {
      const [cx, cy] = [(fx + tx) / 2, (fy + ty) / 2];
      if (fx + l > tx) {
        return `M${fx},${fy} 
            Q${(fx + cx) / 2 + l * Math.sqrt(fx - cx)},${fy} ${cx},${cy}
            T${tx},${ty}`;
      }

      return `M${fx},${fy} 
          Q${(fx + cx) / 2},${fy} ${cx},${cy}
          T${tx},${ty}`;
    },
  },
};
</script>