export default {
  data() {
    return {
      tap: false,
      long_tap: false,
      select_new_item: false,
      tap_position: [0, 0],
      prev_position: [0, 0],
      dragging: false,
    };
  },
  methods: {
    allow(manager_name, args) {
      if (
        this.computedManagers[manager_name] &&
        typeof this.computedManagers[manager_name] === "function"
      ) {
        return this.computedManagers[manager_name](args);
      }
      return true;
    },
    // mouse event for PC
    handleMouseDown(e, node) {
      this.processStart(e, node);
      this.$el.addEventListener("mousemove", this.handleMouseMove);
    },
    handleMouseUp(e, node) {
      this.processEnd(e, node);
      this.$el.removeEventListener("mousemove", this.handleMouseMove);
    },
    handleMouseMove(e) {
      if (this.long_tap) {
        return this.$el.removeEventListener("mousemove", this.handleMouseMove);
      }
      this.processMove(e, () =>
        this.$el.removeEventListener("mousemove", this.handleMouseMove)
      );
    },
    // touch event for tablet
    handleTouchStart(e, node) {
      const t = e.touches[0];
      this.processStart(t, node);
      this.$el.addEventListener("touchmove", this.handleTouchMove);
    },
    handleTouchEnd(e, node) {
      const t = e.changedTouches[0];
      this.processEnd(t, node);
      this.$el.removeEventListener("touchmove", this.handleTouchMove);
    },
    handleTouchMove(e) {
      if (this.long_tap) {
        return this.$el.removeEventListener("touchmove", this.handleTouchMove);
      }
      const t = e.touches[0];
      this.processMove(t, () =>
        this.$el.removeEventListener("touchmove", this.handleTouchMove)
      );
    },
    handleBackgroundClick() {
      const args = { node_id: null, node_ids: this.selected_node_ids };
      if (!this.allow("onTap", args)) {
        return;
      }

      args.node_ids = [];
      this.$emit("onTap", args);
    },
    // common process
    processStart(e, node) {
      this.tap = true;
      this.long_tap = false;
      this.select_new_item = false;
      this.tap_position = [e.clientX, e.clientY];
      this.prev_position = [e.clientX, e.clientY];

      const args = { node_id: node.id, node_ids: this.selected_node_ids };
      if (!this.allow("onTap", args)) {
        return;
      }

      if (!this.isSelected(node)) {
        this.select_new_item = true;
        const args = {
          node_id: node.id,
          node_ids: [node.id, ...this.selected_node_ids],
        };
        this.$emit("onTap", args);
      }

      // ロングタップ時の動作
      setTimeout(() => {
        if (this.tap && !this.isMoving(e)) {
          this.tap = false;
          this.long_tap = true;
          const args = { node_id: node.id, node_ids: this.selected_node_ids };
          if (!this.allow("onLongTap", args)) {
            return;
          }
          this.$emit("onLongTap", args);
        }
      }, 500);
    },
    processEnd(e, node) {
      // ロングタップでのモーダル表示時にモーダルが選択されるのを防ぐ
      if (e.cancelable) {
        e.preventDefault();
      }

      // タップ前から選択済みでドラッグ状態でない
      const should_emit = !this.select_new_item && !this.long_tap;
      if (should_emit) {
        const args = this.isSelected(node)
          ? {
            node_id: null,
            node_ids: this.selected_node_ids.filter((n) => n !== node.id),
          }
          : {
            node_id: node.id,
            node_ids: [node.id, ...this.selected_node_ids],
          };
        if (!this.allow("onTap", args)) {
          return;
        }
        this.$emit("onTap", args);
      }

      if (this.isMoved(e)) {
        const args = { node_ids: this.selected_node_ids };
        this.$emit("onMoveEnd", args);
      }

      this.tap = false;
      this.long_tap = false;
      this.select_new_item = false;
      this.tap_position = [e.clientX, e.clientY];
      this.prev_position = [e.clientX, e.clientY];
    },
    processMove(e, on_denied) {
      if (this.isMoving(e)) {
        const dx = e.clientX - this.prev_position[0];
        const dy = e.clientY - this.prev_position[1];
        this.prev_position = [e.clientX, e.clientY];

        const args = { dx, dy: -dy, node_ids: this.selected_node_ids };
        if (!this.allow("onMove", args)) {
          return on_denied();
        }
        this.$emit("onMove", args);
      }
    },

    /**
     * タッチ開始イベントの座標と比較する
     */
    isMoved({ clientX, clientY }) {
      return (
        this.tap_position[0] !== clientX || this.tap_position[1] !== clientY
      );
    },
    /**
     * 前回タッチイベントの座標と比較する
     */
    isMoving({ clientX, clientY }) {
      return (
        this.prev_position[0] !== clientX || this.prev_position[1] !== clientY
      );
    },
  }
}