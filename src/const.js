const DEFAULT_FLOW = { nodes: [], links: [] };
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
const DEFAULT_BODY = '';
const DEFAULT_OPTIONS = {
  canvas: {
    scale: 0.75,
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
    default_text: {
      title: "No title",
      body: "No message",
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
    type: 'line'
  },
};
const DOUBLE_TAP_THRESHOLD_MSEC = 500;
const LONG_TAP_THRESHOLD_MSEC = 500;
const MOVE_THRESHOLD_PX = 10;
export {
  DEFAULT_FLOW,
  DEFAULT_NODE,
  DEFAULT_LINK,
  DEFAULT_BODY,
  DEFAULT_OPTIONS,
  DOUBLE_TAP_THRESHOLD_MSEC,
  LONG_TAP_THRESHOLD_MSEC,
  MOVE_THRESHOLD_PX
};