"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLinkedScrollGroup = exports.default = void 0;
var _react = require("react");
var _reactNativeReanimated = require("react-native-reanimated");
const useLinkedScrollGroup = providedOffset => {
  const allControllers = (0, _react.useRef)([]);
  const scrollListeners = (0, _react.useRef)(new Map());
  const internalOffset = (0, _reactNativeReanimated.useSharedValue)(0);
  const offset = (0, _react.useRef)(providedOffset ?? internalOffset).current;
  const activeController = (0, _react.useRef)(null);
  const listenersInitialized = (0, _react.useRef)(false);
  const peers = (0, _react.useRef)([]);
  const abortController = (0, _react.useRef)(null);
  const activeId = (0, _react.useRef)(null);
  const eventHandler = (0, _react.useCallback)(() => {
    var _activeController$cur;
    if (!((_activeController$cur = activeController.current) !== null && _activeController$cur !== void 0 && _activeController$cur.current)) {
      return;
    }
    try {
      const element = getWebScrollableElement(activeController.current.current);
      if (!element) {
        return;
      }
      const newOffset = element.scrollLeft === 0 ? element.scrollTop : element.scrollLeft;
      offset.value = newOffset;
      peers.current.forEach(peer => {
        if (!(peer !== null && peer !== void 0 && peer.current)) {
          return;
        }
        const peerElement = getWebScrollableElement(peer.current);
        if (peerElement && peerElement !== element) {
          peerElement.scrollLeft = newOffset;
        }
      });
    } catch (error) {
      console.warn('Error in scroll event handler:', error);
    }
  }, [offset]);
  const cleanupEventListeners = (0, _react.useCallback)(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);
  const onTouchStartHandler = (0, _react.useCallback)(triggerId => {
    var _controller$ref;
    cleanupEventListeners();
    const peerRefs = allControllers.current.filter(controller => controller.id !== triggerId).map(controller => controller.ref);
    peers.current = peerRefs;
    const controller = allControllers.current.find(c => c.id === triggerId);
    if (controller !== null && controller !== void 0 && (_controller$ref = controller.ref) !== null && _controller$ref !== void 0 && _controller$ref.current) {
      activeId.current = triggerId;
      activeController.current = controller.ref;
      const element = getWebScrollableElement(controller.ref.current);
      if (element) {
        abortController.current = new AbortController();
        element.addEventListener('scroll', eventHandler, {
          signal: abortController.current.signal,
          passive: true
        });
      }
    }
  }, [eventHandler, cleanupEventListeners]);
  const onWheelHandler = (0, _react.useCallback)(triggerId => {
    var _controller$ref2;
    cleanupEventListeners();
    const peerRefs = allControllers.current.filter(controller => controller.id !== triggerId).map(controller => controller.ref);
    peers.current = peerRefs;
    const controller = allControllers.current.find(c => c.id === triggerId);
    if (controller !== null && controller !== void 0 && (_controller$ref2 = controller.ref) !== null && _controller$ref2 !== void 0 && _controller$ref2.current) {
      activeId.current = triggerId;
      activeController.current = controller.ref;
      const element = getWebScrollableElement(controller.ref.current);
      if (element) {
        eventHandler();
      }
    }
  }, [eventHandler, cleanupEventListeners]);
  const initializeListeners = (0, _react.useCallback)(() => {
    if (listenersInitialized.current) {
      return;
    }
    scrollListeners.current.set('onTouchStart', onTouchStartHandler);
    scrollListeners.current.set('onWheel', onWheelHandler);
    listenersInitialized.current = true;
  }, [onTouchStartHandler, onWheelHandler]);
  const addAndGet = (0, _react.useCallback)((id, scrollRef) => {
    initializeListeners();
    const existingController = allControllers.current.find(c => c.id === id);
    if (existingController) {
      return existingController.getScrollController();
    }
    const controller = createLinkedScrollController({
      id,
      scrollRef,
      scrollListeners
    });
    allControllers.current.push(controller);
    return controller.getScrollController();
  }, [initializeListeners]);
  const remove = (0, _react.useCallback)(id => {
    const controllerToRemove = allControllers.current.find(controller => controller.id === id);
    if (controllerToRemove && activeController.current === controllerToRemove.ref) {
      cleanupEventListeners();
      activeController.current = null;
    }
    allControllers.current = allControllers.current.filter(controller => controller.id !== id);
  }, [cleanupEventListeners]);
  const setOffset = (0, _react.useCallback)(initialOffset => {
    offset.value = initialOffset;
  }, [offset]);
  (0, _react.useEffect)(() => {
    return () => {
      cleanupEventListeners();
    };
  }, [cleanupEventListeners]);
  const getActiveId = (0, _react.useCallback)(() => activeId.current, []);
  const setActiveId = (0, _react.useCallback)(id => activeId.current = id, []);
  return {
    offset,
    addAndGet,
    remove,
    setOffset,
    getActiveId,
    setActiveId
  };
};
exports.useLinkedScrollGroup = useLinkedScrollGroup;
const createLinkedScrollController = ({
  id,
  scrollRef,
  scrollListeners
}) => {
  const onTouchStart = _event => {
    scrollListeners.current.forEach((listener, key) => {
      if (key === 'onTouchStart') {
        listener(id, {
          x: 0,
          y: 0
        });
      }
    });
  };
  const onWheel = _event => {
    var _scrollListeners$curr;
    (_scrollListeners$curr = scrollListeners.current) === null || _scrollListeners$curr === void 0 || _scrollListeners$curr.forEach((listener, key) => {
      if (key === 'onWheel') {
        listener(id, {
          x: 0,
          y: 0
        });
      }
    });
  };
  const instance = {
    id,
    ref: scrollRef,
    getScrollController: () => ({
      onTouchStart,
      onWheel
    })
  };
  return instance;
};
var _default = exports.default = useLinkedScrollGroup;
function getWebScrollableElement(scrollComponent) {
  if (!scrollComponent) {
    return null;
  }
  try {
    var _scrollComponent$getS;
    const scrollableNode = (_scrollComponent$getS = scrollComponent.getScrollableNode) === null || _scrollComponent$getS === void 0 ? void 0 : _scrollComponent$getS.call(scrollComponent);
    return scrollableNode || null;
  } catch (error) {
    console.warn('Failed to get scrollable element:', error);
    return null;
  }
}
//# sourceMappingURL=useLinkedScrollGroup.web.js.map