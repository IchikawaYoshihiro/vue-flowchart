const DEFAULT_FLOW = { nodes: [], links: [] };
const DEFAULT_NODE = {
  id: null,
  title: "",
  bodies: [],
  position: [0, 0],
  size: [100, 80],
};
const DEFAULT_BODY = '';
const DEFAULT_OPTIONS = {
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
};
const DEFAULT_MANAGERS = {
  onTap({ node_id, node_ids }) { return true },
  onLongTap({ node_id, node_ids }) { return true },
  onMove({ dx, dy, node_ids }) { return true },
};

export { DEFAULT_FLOW, DEFAULT_NODE, DEFAULT_BODY, DEFAULT_OPTIONS, DEFAULT_MANAGERS };