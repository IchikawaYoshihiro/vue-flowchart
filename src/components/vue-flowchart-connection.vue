<template>
  <line
    class="vue-flowchart-svg-nodes-connections-connection"
    :x1="connection.fromX"
    :y1="connection.fromY"
    :x2="connection.toX"
    :y2="connection.toY"
    :stroke-width="options.link.border_width"
    :stroke="options.link.line_color"
  />
</template>
<script>
export default {
  name: "VueFlowchartConnection",
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
    options: {
      type: Object,
    },
  },
};
</script>