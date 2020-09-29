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
|id|"vue-flowchart"|String| The ID of SVG element.|
|flow|see below|Object|Flowchart display data.|
|selected_node_ids|`[]`|Array|List of IDs of selected nodes.|
|options|see below|Object|Options.|

Define the default Parameters.
https://github.com/IchikawaYoshihiro/vue-flowchart/blob/master/src/const.js

## flow
|Param|Type|Default|Description|
|---|---|---|---|
|nodes|Array|`[]`||
|nodes.*.id|String, Number|null||
|nodes.*.title|String|""||
|nodes.*.bodies|Array|`[]`||
|nodes.*.bodies.\*|String|""|Message|
|nodes.*.x|Number|0||
|nodes.*.y|Number|0||
|liks|Array|`[]`||
|liks.*.from|String,Number|0|ID of the source node.|
|liks.*.index|Number|0|The index of the bodies of the linking source node.|
|liks.*.to|String,Number|0|ID of the linked node.|

## options
|Param|Type|Default|Description|
|---|---|---|---|
|draggable|Boolean|true||
|pinchable|Boolean|true||
|enable_grid|Boolean|true||
|enable_filter|Boolean|true||
|canvas.scale|Number|0.75||
|canvas.grid|Number|10||
|canvas.grid_color|String|"#bbb"||
|node.draggable|Boolean|true||
|node.fit_grid|Boolean|true||
|node.bgcolor|String|"#fff"||
|node.border_color|String|"#40b883"||
|node.border_width|Number|1.5||
|node.max_width|Number|300||
|node.font_size.title|Number|16||
|node.font_size.body|Number|12||
|node.default_text.title|String|"No title"||
|node.default_text.body|String|"No message"||
|node.text_color.title|String|"#111"||
|node.text_color.body|String|"#000"||
|link.border_color|String|"#40b883"||
|link.border_width|Number|1.5||
|link.type|line, key_line, curve|"line"||
|control.detect_double_tap_msec|Number|500||
|control.detect_long_tap_msec|Number|500||
|control.detect_move_px|Number|10||

# Event Description

|Event|Argments|Description|
|---|---|---|
|onTouch|`{ node_id }`|When touched.|
|onLongTouch|`{ node_id }`|When long-touched.|
|onDoubleTouch|`{ node_id }`|When touched twice.|
|onTouchEnd|`{ node_id }`|When the touch is over.|
|onDrag|`{ dx, dy }`|When draggable is enabled and the cursor is moved.|
|onBackgroundDrag|`{ dx, dy }`|When draggable is enabled and the cursor is moved  in a blank space.|
|onPinch|`{ dr, dh, dv, dl, cx, cy }`|When pinching or mouse wheel is used.<br>`dr`: Rotation angle. <br>`dh`, `dv` : Difference between horizontal and vertical movement.<br>`dl`: Difference in touch distance or wheel travel distance.<br> `cx`,`cy`: Touch intermediate coordinates or wheeled coordinates.|

# Change Log

[CHANGELOG.md](./CHANGELOG.md)