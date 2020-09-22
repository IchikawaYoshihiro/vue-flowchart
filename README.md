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
      :draggable="draggable"
      :selected_node_ids="selectedNodeIds"
      :options="options"
      @onTap="handleOnTap"
      @onLongTap="handleOnLongTap"
      @onDoubleTap="handleOnDoubleTap"
      @onMove="handleOnMove"
    />
</template>
<script>
export default {
  data() {
    return {
      flow: {
        nodes: [
          {id: 1, title: "title1", bodies: ["item1", "item2"], position: [10, 500], size: [100, 50]},
          {id: 1, title: "title2", bodies: ["item3"], position: [200, 700], size: [100, 50]},
        ],
        links: [
          { from: 1, index: 1, to: 2 },
        ],
      },
      draggable: false,
      selected_nodes: [],
      options:{},
    };
  },
  computed: {
    selectedNodeIds() {
      return this.selected_nodes.map((n) => n.id);
    },
  },
  methods: {
    handleOnTap({node}){},
    handleOnLongTap({node}){},
    handleOnDoubleTap({node}){},
    handleOnMove({dx,dy}){},
  }
};
</script>
```

# Parameter Description

|Parameter|Required|Type|Description|
|---|---|---|---|
|flow|Yes|Object|Flow chart display data.|
|selected_node_ids|Yes|Array|List of IDs of selected nodes.|
|draggable|No|boolean|Enables dragging. When the cursor is moved, the onMove event will fire. |
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
|onTap|`{ node }`|When tapped.|
|onLongTap|`{ node }`|When long-tapped. (>=500ms)|
|onDoubleTap|`{ node }`|When tapped twice. (<500ms)|
|onMove|`{ dx, dy }`|When draggable is enabled and the cursor is moved.|
