<template>
  <svg
    id="svg-box"
    :viewBox="viewBox"
    xmlns="http://www.w3.org/2000/svg"
    @touchstart.stop.prevent="handleBackgroundClick"
    @mousedown.stop="handleBackgroundClick"
    :transform="transform"
  >
    <slot name="grid">
      <defs>
        <pattern id="grid" x="0" y="0" :width="gridScaleX" :height="gridScaleY">
          <line
            x1="0"
            y1="0"
            :x2="computedOptions.canvas.grid"
            y2="0"
            :stroke="computedOptions.canvas.grid_color"
            stroke-width="1"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            :y2="computedOptions.canvas.grid"
            :stroke="computedOptions.canvas.grid_color"
            stroke-width="1"
          />
        </pattern>
      </defs>
      <g class="grid">
        <rect
          fill="url(#grid)"
          x="0"
          y="0"
          :width="computedOptions.canvas.width"
          :height="computedOptions.canvas.height"
        />
        <line
          :x1="computedOptions.canvas.width"
          :y1="computedOptions.canvas.height"
          x2="0"
          :y2="computedOptions.canvas.height"
          :stroke="computedOptions.canvas.grid_color"
          stroke-width="1"
        />
        <line
          :x1="computedOptions.canvas.width"
          y1="0"
          :x2="computedOptions.canvas.width"
          :y2="computedOptions.canvas.height"
          :stroke="computedOptions.canvas.grid_color"
          stroke-width="1"
        />
      </g>
    </slot>
    <g class="flowchart" filter="url(#shadow)">
      <g class="links">
        <Link
          v-for="(link, index) in computedLinks"
          :key="index"
          :link="link"
          :options="computedOptions"
        />
      </g>
      <g class="nodes">
        <g
          v-for="node in computedNodes"
          :key="node.id"
          @touchstart.stop.prevent="e => handleTouchStart(e, node)"
          @mousedown.stop="e => handleMouseDown(e, node)"
          @touchend.stop.prevent="e => handleTouchEnd(e, node)"
          @mouseup="e => handleMouseUp(e, node)"
        >
          <Node :node="node" :options="computedOptions" :is_selected="isSelected(node)" />
        </g>
      </g>
    </g>
    <slot name="filter">
      <defs>
        <filter id="shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feComponentTransfer in="blur" result="blur_opacity">
            <feFuncA type="linear" slope="0.25" />
          </feComponentTransfer>
          <feOffset in="linear" dx="1" dy="1" result="offset" />
          <feMerge>
            <feMergeNode in="offset" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </slot>
  </svg>
</template>

<script>
import Node from "./components/vue-flowchart-node.vue";
import Link from "./components/vue-flowchart-link.vue";
import NodeHandling from "./mixin";
import {
  DEFAULT_FLOW,
  DEFAULT_NODE,
  DEFAULT_OPTIONS,
  DEFAULT_MANAGERS,
} from "./const";
export default {
  name: "VueFlowchart",
  components: { Node, Link },
  mixins: [NodeHandling],
  props: {
    flow: {
      type: Object,
      default() {
        return {
          nodes: [],
          links: [],
        };
      },
    },
    selected_node_ids: {
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    managers: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  methods: {
    /**
     * 内容に対して高さが足りなければ内容から算出した高さにする
     */
    calculateHeight(node) {
      return Math.max(
        node.size[1],
        node.bodies.length * this.computedOptions.node.font_size.body * 2 +
          this.computedOptions.node.font_size.title * 2
      );
    },
    /**
     * 内容に対して高さが足りなければ内容から算出した幅にする。
     * ただしオプションの最大幅よりは広げない
     */
    calculateWidth(node) {
      const buffer = 2;
      return Math.min(
        Math.max(
          node.size[0],
          ([...node.title].length + buffer) *
            this.computedOptions.node.font_size.title,
          ...node.bodies.map(
            (b) =>
              ([...b].length + buffer) *
              this.computedOptions.node.font_size.body
          )
        ),
        this.computedOptions.node.max_width
      );
    },
    /**
     * 座標系を上下反転する
     */
    calculateY(node) {
      return this.computedOptions.canvas.height - node.position[1];
    },
    isSelected(node) {
      return this.selected_node_ids.includes(node.id);
    },
  },
  computed: {
    transform() {
      return "";
    },
    viewBox() {
      return `0 0 ${this.computedOptions.canvas.width} ${this.computedOptions.canvas.height}`;
    },
    gridScaleX() {
      return (
        this.computedOptions.canvas.grid / this.computedOptions.canvas.width
      );
    },
    gridScaleY() {
      return (
        this.computedOptions.canvas.grid / this.computedOptions.canvas.height
      );
    },
    computedFlow() {
      return Object.assign({}, DEFAULT_FLOW, this.flow);
    },
    computedOptions() {
      return Object.assign({}, DEFAULT_OPTIONS, this.options);
    },
    computedManagers() {
      return Object.assign({}, DEFAULT_MANAGERS, this.managers);
    },
    computedNodes() {
      return this.computedFlow.nodes
        .map((n) => Object.assign({}, DEFAULT_NODE, n))
        .map((n) =>
          Object.assign(n, {
            position: [n.position[0], this.calculateY(n)],
            size: [this.calculateWidth(n), this.calculateHeight(n)],
          })
        );
    },
    computedLinks() {
      return this.computedFlow.links.map((l) => {
        const f = this.computedNodes.find((n) => n.id == l.from);
        const t = this.computedNodes.find((n) => n.id == l.to);

        const fromX = f.position[0] + f.size[0];
        const fromY =
          f.bodies.length < 2
            ? f.position[1] + f.size[1] / 2
            : f.position[1] +
              this.computedOptions.node.font_size.title * 2 +
              this.computedOptions.node.font_size.body * 2 * l.index;
        const toX = t.position[0];
        const toY = t.position[1] + t.size[1] / 2;

        return {
          from: [fromX, fromY],
          to: [toX, toY],
        };
      });
    },
  },
};
</script>

<style scoped>
#svg-box {
  width: 100%;
  height: 100%;
}
</style>
