import { DEFAULT_OPTIONS } from "./const";
export default {
  props: {
    options: {
      type: Object,
      default() {
        return DEFAULT_OPTIONS;
      },
    },
  },
  methods: {
    hasOption(name) {
      const names = name.split('.');
      const last = names.pop();

      return names.reduce((o, name) =>
        o.hasOwnProperty(name)
          ? o[name]
          : false
        , this.options || {}).hasOwnProperty(last);
    }
  },
  computed: {
    option_canvas_scale: {
      get() {
        return this.hasOption('canvas.scale')
          ? this.options.canvas.scale
          : DEFAULT_OPTIONS.canvas.scale;
      },
      set(scale) {
        if (this.hasOption('canvas.scale')) {
          return this.options.canvas.scale = scale;
        }
        if (this.hasOption('canvas')) {
          return this.options.canvas = Object.assign(this.options.canvas, { scale });
        }
        return this.options = Object.assign(this.options, { canvas: { scale } });
      }
    },
    option_draggable() {
      return this.hasOption('draggable')
        ? this.options.draggable
        : DEFAULT_OPTIONS.draggable
    },
    option_pinchable() {
      return this.hasOption('pinchable')
        ? this.options.pinchable
        : DEFAULT_OPTIONS.pinchable
    },
    option_enable_grid() {
      return this.hasOption('enable_grid')
        ? this.options.enable_grid
        : DEFAULT_OPTIONS.enable_grid
    },
    option_enable_filter() {
      return this.hasOption('enable_filter')
        ? this.options.enable_filter
        : DEFAULT_OPTIONS.enable_filter
    },
    option_canvas_grid() {
      return this.hasOption('canvas.grid')
        ? this.options.canvas.grid
        : DEFAULT_OPTIONS.canvas.grid
    },
    option_canvas_grid_color() {
      return this.hasOption('canvas.grid_color')
        ? this.options.canvas.grid_color
        : DEFAULT_OPTIONS.canvas.grid_color
    },
    option_node_draggable() {
      return this.hasOption('node.draggable')
        ? this.options.node.draggable
        : DEFAULT_OPTIONS.node.draggable
    },
    option_node_fit_grid() {
      return this.hasOption('node.fit_grid')
        ? this.options.node.fit_grid
        : DEFAULT_OPTIONS.node.fit_grid
    },
    option_node_bgcolor() {
      return this.hasOption('node.bgcolor')
        ? this.options.node.bgcolor
        : DEFAULT_OPTIONS.node.bgcolor
    },
    option_node_border_color() {
      return this.hasOption('node.border_color')
        ? this.options.node.border_color
        : DEFAULT_OPTIONS.node.border_color
    },
    option_node_border_width() {
      return this.hasOption('node.border_width')
        ? this.options.node.border_width
        : DEFAULT_OPTIONS.node.border_width
    },
    option_node_max_width() {
      return this.hasOption('node.max_width')
        ? this.options.node.max_width
        : DEFAULT_OPTIONS.node.max_width
    },
    option_node_font_size_title() {
      return this.hasOption('node.font_size.title')
        ? this.options.node.font_size.title
        : DEFAULT_OPTIONS.node.font_size.title
    },
    option_node_font_size_body() {
      return this.hasOption('node.font_size.body')
        ? this.options.node.font_size.body
        : DEFAULT_OPTIONS.node.font_size.body
    },
    option_node_default_text_title() {
      return this.hasOption('node.default_text.title')
        ? this.options.node.default_text.title
        : DEFAULT_OPTIONS.node.default_text.title
    },
    option_node_default_text_body() {
      return this.hasOption('node.default_text.body')
        ? this.options.node.default_text.body
        : DEFAULT_OPTIONS.node.default_text.body
    },
    option_node_text_color_title() {
      return this.hasOption('node.text_color.title')
        ? this.options.node.text_color.title
        : DEFAULT_OPTIONS.node.text_color.title
    },
    option_node_text_color_body() {
      return this.hasOption('node.text_color.body')
        ? this.options.node.text_color.body
        : DEFAULT_OPTIONS.node.text_color.body
    },
    option_link_border_color() {
      return this.hasOption('link.border_color')
        ? this.options.link.border_color
        : DEFAULT_OPTIONS.link.border_color
    },
    option_link_border_width() {
      return this.hasOption('link.border_width')
        ? this.options.link.border_width
        : DEFAULT_OPTIONS.link.border_width
    },
    option_link_type() {
      return this.hasOption('link.type')
        ? this.options.link.type
        : DEFAULT_OPTIONS.link.type
    },
    option_control_detect_double_tap_msec() {
      return this.hasOption('control.detect_double_tap_msec')
        ? this.options.control.detect_double_tap_msec
        : DEFAULT_OPTIONS.control.detect_double_tap_msec
    },
    option_control_detect_long_tap_msec() {
      return this.hasOption('control.detect_long_tap_msec')
        ? this.options.control.detect_long_tap_msec
        : DEFAULT_OPTIONS.control.detect_long_tap_msec
    },
    option_control_detect_move_px() {
      return this.hasOption('control.detect_move_px')
        ? this.options.control.detect_move_px
        : DEFAULT_OPTIONS.control.detect_move_px
    },
    option_control_drag_fps() {
      return this.hasOption('control.drag_fps')
        ? this.options.control.drag_fps
        : DEFAULT_OPTIONS.control.drag_fps
    },
  }
}