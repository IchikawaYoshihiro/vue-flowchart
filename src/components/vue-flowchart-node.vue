<template>
  <g :transform="transform">
    <g
      class="vue-flowchart-svg-nodes-node"
      :class="{ selected: is_selected }"
      :stroke-width="strokeWidth"
      :stroke="option_node_border_color"
      :fill="option_node_bgcolor"
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
          :font-size="option_node_font_size_title"
          :fill="option_node_text_color_title"
          font-weight="bold"
          ref="title"
          >{{ node.title || option_node_default_text_title }}</text
        >
        <text
          class="vue-flowchart-svg-nodes-node-texts-body"
          v-for="(body, index) in node.bodies"
          :key="index"
          :x="titleX"
          :y="getBodyY(index)"
          :fill="option_node_text_color_body"
          :font-size="option_node_font_size_body"
          ref="bodies"
          >{{ body || option_node_default_text_body }}</text
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
import options from "../options";
export default {
  name: "VueFlowchartNode",
  components: { Connection },
  mixins: [options],
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
  },
  data() {
    return {
      width: 0,
      height: 0,
      hash: null,
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
    "options.node.max_width"(b) {
      this.$nextTick(() => this.updateNodeSize());
    },
  },
  mounted() {
    this.updateNodeSize();
  },
  methods: {
    toHash() {
      return [
        this.option_node_max_width,
        this.node.title,
        ...this.node.bodies,
      ].join("");
    },
    hashEquals(hash) {
      return this.hash && hash && this.hash === hash;
    },
    getBodyY(index) {
      return this.borderY + this.option_node_font_size_body * (1.5 + 2 * index);
    },
    updateNodeSize() {
      if (this.hashEquals(this.toHash())) {
        return;
      }
      this.hash = this.toHash();
      const padding = this.option_node_font_size_title;

      const title = this.$refs.title;
      title.innerHTML = this.node.title || this.option_node_default_text_title;

      const bodies = this.$refs.bodies || [];
      bodies.map(
        (b, i) =>
          (b.innerHTML =
            this.node.bodies[i] || this.option_node_default_text_body)
      );

      const max_text_width = Math.max(
        ...[title, ...bodies].map((n) => n.getComputedTextLength() + padding)
      );
      this.width = Math.min(max_text_width, this.option_node_max_width);

      if (this.width >= this.option_node_max_width) {
        this.ellipsisText();
      }
    },
    ellipsisText() {
      const padding = this.option_node_font_size_title;
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
      return this.option_node_font_size_title * 2;
    },
    titleX() {
      return this.option_node_font_size_title / 2;
    },
    titleY() {
      return this.option_node_font_size_title * 1.5;
    },
    strokeWidth() {
      const width = this.option_node_border_width
        ? this.option_node_border_width
        : 1.5;
      return this.is_selected ? width * 2 : width;
    },
    computedConnections() {
      return this.connections.map((l) => {
        const fromX = this.width;
        const fromY =
          this.node.bodies.length === 1
            ? this.height / 2
            : (this.option_node_font_size_title +
                (l.index + 0.5) * this.option_node_font_size_body) *
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