<template>
  <div class="vue-flowchart">
    <svg
      class="vue-flowchart-svg"
      xmlns="http://www.w3.org/2000/svg"
      ref="svg"
      :height="render_area.h"
      :width="render_area.w"
      :viewBox="viewbox"
      @touchstart.stop.prevent="(e) => handleTouchStart(e, null)"
      @mousedown.stop.prevent="(e) => handleMouseDown(e, null)"
      @touchend.stop.prevent="(e) => handleTouchEnd(e, null)"
      @mouseup.stop.prevent="(e) => handleMouseUp(e, null)"
    >
      <slot name="grid">
        <defs>
          <pattern
            id="grid"
            x="0"
            y="0"
            :width="gridScale.x"
            :height="gridScale.y"
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
            :width="gridArea.w"
            :height="gridArea.h"
          />
        </g>
      </slot>
      <g
        class="vue-flowchart-svg-nodes"
        filter="url(#shadow)"
        :transform="transform"
      >
        <g
          v-for="node in computedNodes"
          :key="node.id"
          @touchstart.stop.prevent="(e) => handleTouchStart(e, node)"
          @mousedown.stop.prevent="(e) => handleMouseDown(e, node)"
          @touchend.stop.prevent="(e) => handleTouchEnd(e, node)"
          @mouseup.stop.prevent="(e) => handleMouseUp(e, node)"
        >
          <Node
            :node="node"
            :connections="getConnections(node)"
            :options="computedOptions"
            :is_selected="isSelected(node)"
          />
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
import NodeHandling from "./mixin";
import {
  DEFAULT_FLOW,
  DEFAULT_NODE,
  DEFAULT_LINK,
  DEFAULT_OPTIONS,
} from "./const";
export default {
  name: "VueFlowchart",
  components: { Node },
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
      const bodies = node.bodies.length ? node.bodies.length : 1;

      return (
        this.computedOptions.node.font_size.body * bodies * 2 +
        this.computedOptions.node.font_size.title * 2
      );
    },
    isSelected(node) {
      return this.selected_node_ids.includes(node.id);
    },
    getConnections(node) {
      return this.computedLinks
        .filter((l) => l.from === node.id)
        .map((l) => {
          return {
            index: l.index,
            to: this.computedNodes.find((n) => n.id === l.to),
          };
        });
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
            w: this.computedOptions.node.max_width,
            h: this.calculateHeight(n),
          })
        );
    },
    computedLinks() {
      return this.computedFlow.links.map((l) =>
        Object.assign({}, DEFAULT_LINK, l)
      );
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