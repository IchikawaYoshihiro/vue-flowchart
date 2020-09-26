<template>
  <div class="vue-flowchart">
    <svg
      class="vue-flowchart-svg"
      xmlns="http://www.w3.org/2000/svg"
      ref="svg"
      :height="bgHeight"
      :width="bgWidth"
      :viewBox="bgViewBox"
      @touchstart.stop.prevent="(e) => handleTouchStart(e, null)"
      @mousedown.stop="(e) => handleMouseDown(e, null)"
      @touchend.stop.prevent="(e) => handleTouchEnd(e, null)"
      @mouseup.stop="(e) => handleMouseUp(e, null)"
    >
      <slot name="grid">
        <defs>
          <pattern
            id="grid"
            x="0"
            y="0"
            :width="gridScaleX"
            :height="gridScaleY"
          >
            <polyline
              :points="gridPoints"
              :stroke="computedOptions.canvas.grid_color"
              stroke-width="1"
              fill="none"
            />
          </pattern>
        </defs>
        <g class="grid" :transform="gridTransform">
          <rect
            class="vue-flowchart-svg-grid"
            fill="url(#grid)"
            x="0"
            y="0"
            :width="gridWidth"
            :height="gridHeight"
          />
        </g>
      </slot>
      <g
        class="vue-flowchart-svg-node-and-links"
        filter="url(#shadow)"
        :transform="bgTransform"
      >
        <g class="vue-flowchart-svg-links">
          <g v-for="(link, index) in computedLinks" :key="index">
            <Link :link="link" :options="computedOptions" />
          </g>
        </g>
        <g class="vue-flowchart-svg-links">
          <g
            v-for="node in computedNodes"
            :key="node.id"
            @touchstart.stop.prevent="(e) => handleTouchStart(e, node)"
            @mousedown.stop="(e) => handleMouseDown(e, node)"
            @touchend.stop.prevent="(e) => handleTouchEnd(e, node)"
            @mouseup.stop="(e) => handleMouseUp(e, node)"
          >
            <Node
              :node="node"
              :options="computedOptions"
              :is_selected="isSelected(node)"
            />
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
  </div>
</template>

<script>
import Node from "./components/vue-flowchart-node.vue";
import Link from "./components/vue-flowchart-link.vue";
import NodeHandling from "./mixin";
import { DEFAULT_FLOW, DEFAULT_NODE, DEFAULT_OPTIONS } from "./const";
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
    movable: {
      type: Boolean,
      default: false,
    },
    scale: {
      type: Number,
      default: 0.75,
    },
    options: {
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
    calculateY(node) {
      return node.position[1];
    },
    isSelected(node) {
      return this.selected_node_ids.includes(node.id);
    },
  },
  computed: {
    computedFlow() {
      return Object.assign({}, DEFAULT_FLOW, this.flow);
    },
    computedOptions() {
      return Object.assign({}, DEFAULT_OPTIONS, this.options);
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
<style lang="scss" scoped>
.vue-flowchart {
  overflow: hidden;
  border: solid 1px #000;
}
</style>