"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLinkedScrollGroup = exports.default = void 0;
var _react = require("react");
var _reactNativeReanimated = require("react-native-reanimated");
const scrollNativeEventNames = ['onScroll'];
const useLinkedScrollGroup = providedOffset => {
  const allControllers = (0, _react.useRef)([]);
  const scrollListeners = (0, _react.useRef)(new Map());
  const internalOffset = (0, _reactNativeReanimated.useSharedValue)(0);
  const offset = (0, _react.useRef)(providedOffset ?? internalOffset).current;
  const activeId = (0, _react.useRef)(null);
  const activeTag = (0, _reactNativeReanimated.useSharedValue)(null);
  const listenersInitialized = (0, _react.useRef)(false);
  const peers = (0, _reactNativeReanimated.useSharedValue)([]);
  const peersRef = (0, _react.useRef)([]);
  const eventHandler = (0, _reactNativeReanimated.useEvent)(event => {
    'worklet';

    offset.value = event.contentOffset.x === 0 ? event.contentOffset.y : event.contentOffset.x;
    peers.value.forEach(peer => {
      (0, _reactNativeReanimated.scrollTo)(peer, event.contentOffset.x, event.contentOffset.y, false);
    });
  }, scrollNativeEventNames);
  const subscribeToScroll = (0, _react.useCallback)((currentTag, previousActiveTag) => {
    if (previousActiveTag) {
      eventHandler.workletEventHandler.unregisterFromEvents(previousActiveTag);
    }
    if (currentTag) {
      eventHandler.workletEventHandler.registerForEvents(currentTag);
    }
  }, [eventHandler.workletEventHandler]);
  const unsubscribeAll = (0, _react.useCallback)(() => {
    allControllers.current.forEach(controller => {
      var _controller$ref;
      if ((_controller$ref = controller.ref) !== null && _controller$ref !== void 0 && _controller$ref.getTag) {
        const tag = controller.ref.getTag();
        if (tag) {
          eventHandler.workletEventHandler.unregisterFromEvents(tag);
        }
      }
    });
  }, [eventHandler.workletEventHandler]);
  (0, _react.useEffect)(() => {
    return () => {
      unsubscribeAll();
    };
  }, [unsubscribeAll]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => activeTag.value, (currentTag, previousActiveTag) => {
    if (currentTag) {
      (0, _reactNativeReanimated.runOnJS)(subscribeToScroll)(currentTag, previousActiveTag);
    } else {
      (0, _reactNativeReanimated.runOnJS)(unsubscribeAll)();
    }
  }, [eventHandler.workletEventHandler, unsubscribeAll]);
  const onTouchStartHandler = (0, _react.useCallback)(triggerId => {
    var _selectedController$r, _selectedController$r2;
    const selectedController = allControllers.current.find(controller => controller.id === triggerId);
    const elementTag = (selectedController === null || selectedController === void 0 || (_selectedController$r = selectedController.ref) === null || _selectedController$r === void 0 || (_selectedController$r2 = _selectedController$r.getTag) === null || _selectedController$r2 === void 0 ? void 0 : _selectedController$r2.call(_selectedController$r)) ?? null;
    if (elementTag) {
      activeId.current = triggerId;
      activeTag.value = elementTag;
      const peerRefs = allControllers.current.filter(controller => controller.id !== triggerId).map(controller => controller.ref);
      peersRef.current = peerRefs;
      peers.value = peerRefs;
    }
  }, [activeTag, peers]);
  const initializeListeners = (0, _react.useCallback)(() => {
    if (listenersInitialized.current) {
      return;
    }
    scrollListeners.current.set('onTouchStart', onTouchStartHandler);
    listenersInitialized.current = true;
  }, [onTouchStartHandler]);
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
    var _controllerToRemove$r;
    const controllerToRemove = allControllers.current.find(controller => controller.id === id);
    if (controllerToRemove !== null && controllerToRemove !== void 0 && (_controllerToRemove$r = controllerToRemove.ref) !== null && _controllerToRemove$r !== void 0 && _controllerToRemove$r.getTag) {
      const tag = controllerToRemove.ref.getTag();
      if (activeTag.value === tag) {
        activeId.current = null;
        activeTag.value = null;
      }
      if (tag) {
        eventHandler.workletEventHandler.unregisterFromEvents(tag);
      }
    }
    allControllers.current = allControllers.current.filter(controller => controller.id !== id);
  }, [activeTag, eventHandler.workletEventHandler]);
  const setOffset = (0, _react.useCallback)(initialOffset => {
    offset.value = initialOffset;
  }, [offset]);
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
    var _scrollListeners$curr;
    (_scrollListeners$curr = scrollListeners.current) === null || _scrollListeners$curr === void 0 || _scrollListeners$curr.forEach((listener, key) => {
      if (key === 'onTouchStart') {
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
      onTouchStart
    })
  };
  return instance;
};
var _default = exports.default = useLinkedScrollGroup;
//# sourceMappingURL=useLinkedScrollGroup.js.map