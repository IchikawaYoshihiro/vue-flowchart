# vue-flowchart
Drag and pinchable flowchart components in [Vue.js](https://vuejs.org/).

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
      :selected_node_ids="selectedNodeIds"
      :options="options"
      @onTouch="onTouch"
    />
</template>
<script>
export default {
  data() {
    return {
      flow: {
        nodes: [
          {id: 1, title: "title1", bodies: ["item1", "item2"], x: 10, y:500},
          {id: 1, title: "title2", bodies: ["item3"], x: 200, y:700},
        ],
        links: [
          { from: 1, index: 1, to: 2 },
        ],
      },
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
    onTouch({node_id}){
      // do something
    },
  }
};
</script>
```

# Parameter Description

|Parameter|Default|Type|Description|
|---|---|---|---|
|id|`vue-flowchart`|String| The ID of SVG element.|
|movable|`true`|boolean|Enables dragging. When the cursor is moved, the onDrag event will fire. |
|flow|see below|Object|Flowchart display data.|
|selected_node_ids|`[]`|Array|List of IDs of selected nodes.|
|options|see below|Object|Options.|

## flow
Define the default node and links.

https://github.com/IchikawaYoshihiro/vue-flowchart/blob/3afd188ba3967c2a6898acb68de570d52fd6e024/src/const.js#L1-L14

## options
Define the default options.

https://github.com/IchikawaYoshihiro/vue-flowchart/blob/3afd188ba3967c2a6898acb68de570d52fd6e024/src/const.js#L15-L49

# Event Description

|Event|Argments|Description|
|---|---|---|
|onTouch|`{ node_id }`|When touched.|
|onLongTouch|`{ node_id }`|When long-touched. (default: >=500ms)|
|onDoubleTouch|`{ node_id }`|When touched twice. (default: <500ms)|
|onTouchEnd|`{ node_id }`|When the touch is over.|
|onDrag|`{ dx, dy }`|When draggable is enabled and the cursor is moved.|
|onBackgroundDrag|`{ dx, dy }`|When draggable is enabled and the cursor is moved  in a blank space.|
|onPinch|`{ dr, dh, dv, dl, cx, cy }`|When pinching or mouse wheel is used.<br>`dr`: Rotation angle. <br>`dh`, `dv` : Difference between horizontal and vertical movement.<br>`dl`: Difference in touch distance or wheel travel distance.<br> `cx`,`cy`: Touch intermediate coordinates or wheeled coordinates.|
