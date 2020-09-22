<template>
  <line
    class="link"
    :x1="link.from[0]"
    :y1="link.from[1]"
    :x2="link.to[0]"
    :y2="link.to[1]"
    :stroke-width="options.link.border_width"
    :stroke="options.link.line_color"
  />
</template>
<script>
export default {
  name: "VueFlowchartLink",
  props: {
    link: {
      type: Object,
      default() {
        return {
          from: [0, 0],
          to: [0, 0],
          via: [],
        };
      },
    },
    options: {
      type: Object,
    },
  },
};
</script>