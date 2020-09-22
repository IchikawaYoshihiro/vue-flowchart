# vue-flowchart

A mobile-friendly flowchart component of [Vue](https://vuejs.org/).

# demo
![demo](./docs/demo.png)

This is a demo application combined with [BootstrapVue](https://bootstrap-vue.org/).

https://upbeat-villani-060267.netlify.app/

# Usage 
## Install via npm
```
npm install @yosichikaw/vue-flowchart
```
## Add to your application
```
import Vue from 'vue';
import VueFlowchart from "@yosichikaw/vue-flowchart";

Vue.use(VueFlowchart);
```

# Example code

```
<template>
  <div id="app">
    <VueFlowchart
      :flow="flow"
      :managers="managers"
      :selected_node_ids="selectedNodeIds"
      @onMove="onMove"
      @onMoveEnd="onMoveEnd"
      @onTap="onTap"
      @onLongTap="onLongTap"
    />
</template>
<script>
export default {
  data() {
    return {
      selected_nodes: [],
      flow: {
        nodes: [
          {id: 1, title: "title1", bodies: ["item1", "item2"], position: [10, 500], size: [100, 50]},
          {id: 1, title: "title2", bodies: ["item3"], position: [200, 700], size: [100, 50]},
        ],
        links: [
          { from: 1, index: 1, to: 2 },
        ],
      },
    };
  },
  computed: {
    selectedNodeIds() {
      return this.selected_nodes.map((n) => n.id);
    },
    managers() {
      return {
        onTap: this.onTapManager,
        onLongTap: this.onLongTapManager,
        onMove: this.onMoveManager,
      };
    },
  },
  methods: {
    onTapManager({ node_id, node_ids }) { return true },
    onLongTapManager({ node_id, node_ids }) { return true },
    onMoveManager({ dx, dy, node_ids }) { return true },
    onTap({ node_id, node_ids }) {},
    onLongTap({ node_id, node_ids }) {},
    onMove({ dx, dy, node_ids }) {},
    onMoveEnd({ node_ids }) {},
  }
};
</script>
```

# Parameter Description

|Parameter|Required|Type|Description|
|---|---|---|---|
|flow|Yes|Object|Flow chart display data.|
|selected_node_ids|Yes|Array|List of IDs of selected nodes.|
|managers|No|Object|Functions to manage events in the flowchart.|
|options|No|Object|Options.|

## flow

```
{
  nodes:[
    {
      id: 1, // unique id for Node
      title: 'title',
      bodies: [
        'content 1',
        ...
      ],
      position: [100, 200], // Node position (x, y)
      size:[100, 50] // Node size (width, height)
    },
    ...
  ],
  links:[
    {
      from: 1,  // Source Node ID
      index: 0, // The index of the bodies of the Source Node
      to: 2,    // Destination node ID
    },
    ...
  ],
}
```

## managers
Returns `true` in the manager if you allow the event to fire. Return `false` if you don't want to allow it.

```
manages: {
    onTap({ node_id, node_ids }) {
      return true || false;
    },
    onLongTap({ node_id, node_ids }) {
      return true || false;
    },
    onMove({ dx, dy, node_ids }) {
      return true || false;
    },
}
```

## options

```
options: {
  canvas: {
    width: 960,
    height: 720,
    grid: 10,
    grid_color: "#bbb",
  },
  node: {
    border_width: 1.5,
    bgcolor: "#fff",
    font_size: {
      title: 16,
      body: 12,
    },
    text_color: {
      title: "#111",
      body: "#000",
    },
    line_color: "#40b883",
    max_width: 300,
  },
  link: {
    line_color: "#40b883",
    border_width: 1.5,
  },
}
```

# Listener Description
This component DOES NOT CHANGE THE FLOW DATA.

You must implement a listener to update the "original data of the flow" at the time of the event.

|Listener|Argments|Return|Description|
|---|---|---|
|onTap|`{ node_id, node_ids }`|When nodes is clicked or tapped.|
|onLongTap|`{ node_id, node_ids }`|When nodes is long tapped. (>=500ms)|
|onMove|`{ dx, dy, node_ids }`|When nodes is being dragged.|
|onMoveEnd|`{ node_ids }`|When the drag is finished.|