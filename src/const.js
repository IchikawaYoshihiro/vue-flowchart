const DEFAULT_NODE = {
  id: null,
  title: "",
  bodies: [],
  x: 0,
  y: 0,
  w: 100,
  h: 80,
};
const DEFAULT_LINK = {
  from: null,
  index: null,
  to: null,
};
const DEFAULT_OPTIONS = {
  canvas: {
    scale: 0.75,
    grid: 10,
    grid_color: "#bbb",
  },
  node: {
    bgcolor: "#fff",
    border_color: "#40b883",
    border_width: 1.5,
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
      title: "#111",
      body: "#000",
    },
  },
  link: {
    border_color: "#40b883",
    border_width: 1.5,
    type: 'line'
  },
  control: {
    detect_double_tap_msec: 500,
    detect_long_tap_msec: 500,
    detect_move_px: 10,
  }
};
export {
  DEFAULT_NODE,
  DEFAULT_LINK,
  DEFAULT_OPTIONS,
};