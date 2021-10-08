/**
 * global event config
 */
 let _target = {
  element: null,
  options: {},
};

// 监听事件
const addEventListener = () => {
  document.addEventListener("mousemove", mousemoveHandler);
  document.addEventListener("mouseup", mouseupHandler);
};

// 消除监听
const removeEventListener = () => {
  document.removeEventListener("mousemove", mousemoveHandler);
  document.removeEventListener("mouseup", mouseupHandler);
};

const mousemoveHandler = function (e) {
  const { element, options } = _target;
  if (!element) {
    return;
  }

  // console.log(element.drag, element.pos);
  if (element.drag) {
    if (options && typeof options.onDragMove === "function") {
      options.onDragMove(e);
    }

    if (options && options.disableFollow) {
      return;
    }
    // console.log(e);
    const { x, y, left, top } = element.pos;
    let nLeft = left + (e.pageX - x);
    let nTop = top + (e.pageY - y);
    if (options.lock) {
      if (options.lock.x) {
        nLeft = left;
      } else if (options.lock.y) {
        nTop = top;
      }
    }
    element.style.top = `${nTop}px`;
    element.style.left = `${nLeft}px`;
  }
};

const mouseupHandler = function (e) {
  const { element, options } = _target;
  if (!element) {
    return;
  }

  if (options && typeof options.onDragEnd === "function") {
    options.onDragEnd(e);
  }

  const { x, y } = element.pos || {};
  const diffX = e.pageX - x;
  const diffY = e.pageY - y;
  const diff = Math.sqrt(diffX * diffX + diffY * diffY);

  if (diff < 7) {
    // click event
    element.drag = false;
    _target = {};
    return false;
  }

  setTimeout(() => {
    element.drag = false;
    element.pos = null;
    _target = {};
  }, 0);

  removeEventListener();
};

/**
 * set element dragable
 * @param {Element} element SVG Element
 * @param {Object} options drag config
 * @returns {Element} svg element
 */
export const setDraggable = (element, options = {}) => {
  const styles = window.getComputedStyle(element);
  const pos = element.getBoundingClientRect();
  if (styles.position !== "fixed") {
    // use event loop to delay layout change when getting all the elements bounding
    setTimeout(() => {
      element.style.position = !options.relative ? "fixed" : "absolute";
      !options.keepCursor && (element.style.cursor = "move");
      element.style.left = `${pos.left}px`;
      element.style.top = `${pos.top}px`;
    }, 0);
  }

  element.addEventListener("mousedown", function (e) {
    // set event target to current target
    _target = { element, options };

    if (typeof options.onDragStart === "function") {
      options.onDragStart(e);
    }

    const boundingRect = element.getBoundingClientRect();
    this.pos = {
      x: e.pageX,
      y: e.pageY,
      top: boundingRect.top,
      left: boundingRect.left,
    };
    // console.log(this.pos, e, boundingRect);
    this.drag = true;

    addEventListener();
  });

  return element;
};
