<template>
  <g :transform="transform">
    <g
      class="vue-flowchart-svg-nodes-node"
      :class="{ selected: is_selected }"
      :stroke-width="strokeWidth"
      :stroke="options.node.line_color"
      :fill="options.node.bgcolor"
    >
      <rect
        class="vue-flowchart-svg-nodes-node-box"
        rx="8"
        :height="height"
        :width="width"
        x="0"
        y="0"
        ref="node"
      />
      <line
        class="vue-flowchart-svg-nodes-node-border"
        x1="0"
        :y1="borderY"
        :x2="width"
        :y2="borderY"
      />
      <g
        class="vue-flowchart-svg-nodes-node-texts"
        text-anchor="start"
        stroke-width="0"
      >
        <text
          class="vue-flowchart-svg-nodes-node-texts-title"
          :x="titleX"
          :y="titleY"
          :font-size="options.node.font_size.title"
          :fill="options.node.text_color.title"
          font-weight="bold"
          ref="title"
          >{{ node.title || options.node.default_text.title }}</text
        >
        <text
          class="vue-flowchart-svg-nodes-node-texts-body"
          v-for="(body, index) in node.bodies"
          :key="index"
          :x="titleX"
          :y="getBodyY(index)"
          :fill="options.node.text_color.body"
          :font-size="options.node.font_size.body"
          ref="bodies"
          >{{ body || options.node.default_text.body }}</text
        >
      </g>
    </g>
    <g
      v-for="(connection, index) in computedConnections"
      :key="index"
      class="vue-flowchart-svg-nodes-connections"
    >
      <Connection :connection="connection" :options="options" />
    </g>
  </g>
</template>
<script>
import Connection from "./vue-flowchart-connection.vue";
export default {
  name: "VueFlowchartNode",
  components: { Connection },
  props: {
    is_selected: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
    },
    connections: {
      type: Array,
      default: () => {
        return [];
      },
    },
    options: {
      type: Object,
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
    };
  },
  created() {
    this.width = this.node.w;
    this.height = this.node.h;
  },
  watch: {
    "node.h"(h) {
      this.height = h;
      this.$nextTick(() => this.updateNodeSize());
    },
    "node.bodies"(b) {
      this.$nextTick(() => this.updateNodeSize());
    },
  },
  mounted() {
    this.updateNodeSize();
  },
  methods: {
    getBodyY(index) {
      return (
        this.borderY + this.options.node.font_size.body * (1.5 + 2 * index)
      );
    },
    updateNodeSize() {
      const padding = this.options.node.font_size.title;
      const title = this.$refs.title;
      const bodies = this.$refs.bodies || [];
      const max_text_width = Math.max(
        ...[title, ...bodies].map((n) => n.getComputedTextLength() + padding)
      );
      this.width = Math.min(max_text_width, this.options.node.max_width);

      this.ellipsisText();
    },
    ellipsisText() {
      const padding = this.options.node.font_size.title;
      const title = this.$refs.title;
      const bodies = this.$refs.bodies || [];
      [title, ...bodies].map((n) => {
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
    transform() {
      return `translate(${this.node.x}, ${this.node.y})`;
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
    computedConnections() {
      return this.connections.map((l) => {
        const fromX = this.width;
        const fromY =
          this.node.bodies.length === 1
            ? this.height / 2
            : (this.options.node.font_size.title +
                (l.index + 0.5) * this.options.node.font_size.body) *
              2;

        const toX = l.to.x - this.node.x;
        const toY = l.to.y + l.to.h / 2 - this.node.y;

        return { fromX, fromY, toX, toY };
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.vue-flowchart-svg-nodes-node {
  user-select: none;
  cursor: pointer;

  &.selected {
    cursor: move;
  }
}
</style>