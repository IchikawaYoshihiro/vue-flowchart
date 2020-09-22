<template>
  <g
    class="node"
    :class="{selected:is_selected}"
    :transform="transform"
    :stroke-width="strokeWidth"
    :stroke="options.node.line_color"
    :fill="options.node.bgcolor"
  >
    <rect class="node-box" rx="8" :height="height" :width="width" x="0" y="0" />
    <line class="node-border" x1="0" :y1="borderY" :x2="width" :y2="borderY" />
    <g class="node-text" text-anchor="start" stroke-width="0">
      <text
        class="node-text-title"
        :x="titleX"
        :y="titleY"
        :font-size="options.node.font_size.title"
        :fill="options.node.text_color.title"
        font-weight="bold"
        ref="title"
      >{{ getDisplayText(node.title) }}</text>
      <text
        class="node-text-body"
        v-for="(body, index) in node.bodies"
        :key="index"
        :x="titleX"
        :y="getBodyY(index)"
        :fill="options.node.text_color.body"
        :font-size="options.node.font_size.body"
        ref="bodies"
      >{{ getDisplayText(body) }}</text>
    </g>
  </g>
</template>
<script>
export default {
  name: "VueFlowchartNode",
  props: {
    is_selected: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
    },
    options: {
      type: Object,
    },
  },
  data() {
    return {
      tap: false,
      long_tap: false,
      select_new_item: false,
      tap_position: [0, 0],
      prev_position: [0, 0],
      dragging: false,
    };
  },
  mounted() {
    this.ellipsisText();
  },
  methods: {
    getDisplayText(str) {
      return str || "名称未設定";
    },
    getBodyY(index) {
      return (
        this.borderY + this.options.node.font_size.body * (1.5 + 2 * index)
      );
    },
    ellipsisText() {
      const bodies = this.$refs.bodies || [];
      [this.$refs.title, ...bodies].map((n) => {
        let length = n.getComputedTextLength();
        let text = n.innerHTML;
        const padding = 5;
        while (length > this.width - 2 * padding && [...text].length > 0) {
          text = text.slice(0, -1);
          n.innerHTML = text + "...";
          length = n.getComputedTextLength();
        }
      });
    },
  },
  computed: {
    x() {
      return this.node.position && this.node.position[0]
        ? this.node.position[0]
        : 0;
    },
    y() {
      return this.node.position && this.node.position[1]
        ? this.node.position[1]
        : 0;
    },
    width() {
      return this.node.size && this.node.size[0] ? this.node.size[0] : 200;
    },
    height() {
      return this.node.size && this.node.size[1] ? this.node.size[1] : 100;
    },
    transform() {
      return `translate(${this.x}, ${this.y})`;
    },
    borderY() {
      return this.options.node.font_size.title * 2;
    },
    titleX() {
      return this.options.node.font_size.title / 2;
    },
    titleY() {
      return this.options.node.font_size.title * 1.5;
    },
    strokeWidth() {
      const width = this.options.node.border_width
        ? this.options.node.border_width
        : 1.5;
      return this.is_selected ? width * 2 : width;
    },
  },
};
</script>
<style lang="scss" scoped>
.node {
  user-select: none;
  cursor: pointer;

  &.selected {
    cursor: move;
  }
}
</style>