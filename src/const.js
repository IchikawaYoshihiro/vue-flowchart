const DEFAULT_NODE = {
  id: null,
  title: "",
  bodies: [],
  x: 0,
  y: 0,
};
const DEFAULT_LINK = {
  from: null,
  index: null,
  to: null,
};
const DEFAULT_OPTIONS = {
  draggable: true,
  pinchable: true,
  enable_grid: true,
  enable_filter: true,
  canvas: {
    scale: 1,
    grid: 10,
    grid_color: "#bbb",
  },
  node: {
    draggable: true,
    fit_grid: true,
    bgcolor: "#fff",
    border_color: "#007bff",
    border_width: 2,
    max_width: 300,
    font_size: {
      title: 16,
      body: 12,
    },
    default_text: {
      title: "No title",
      body: "No message",
    },
    text_color: {
      title: "#343a40",
      body: "#6c757d",
    },
  },
  link: {
    border_color: "#007bff",
    border_width: 1.5,
    type: 'line'
  },
  control: {
    detect_double_touch_msec: 500,
    detect_long_touch_msec: 500,
    detect_move_px: 10,
    drag_fps: 60,
  }
};
const LINK_TYPES = {
  line: 'line',
  key_line: 'key_line',
  curve: 'curve',
};

export {
  DEFAULT_NODE,
  DEFAULT_LINK,
  DEFAULT_OPTIONS,
  LINK_TYPES,
};