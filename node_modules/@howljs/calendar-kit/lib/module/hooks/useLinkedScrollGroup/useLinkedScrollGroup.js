import { useCallback, useEffect, useRef } from 'react';
import { runOnJS, scrollTo, useAnimatedReaction, useEvent, useSharedValue } from 'react-native-reanimated';
const scrollNativeEventNames = ['onScroll'];
export const useLinkedScrollGroup = providedOffset => {
  const allControllers = useRef([]);
  const scrollListeners = useRef(new Map());
  const internalOffset = useSharedValue(0);
  const offset = useRef(providedOffset ?? internalOffset).current;
  const activeId = useRef(null);
  const activeTag = useSharedValue(null);
  const listenersInitialized = useRef(false);
  const peers = useSharedValue([]);
  const peersRef = useRef([]);
  const eventHandler = useEvent(event => {
    'worklet';

    offset.value = event.contentOffset.x === 0 ? event.contentOffset.y : event.contentOffset.x;
    peers.value.forEach(peer => {
      scrollTo(peer, event.contentOffset.x, event.contentOffset.y, false);
    });
  }, scrollNativeEventNames);
  const subscribeToScroll = useCallback((currentTag, previousActiveTag) => {
    if (previousActiveTag) {
      eventHandler.workletEventHandler.unregisterFromEvents(previousActiveTag);
    }
    if (currentTag) {
      eventHandler.workletEventHandler.registerForEvents(currentTag);
    }
  }, [eventHandler.workletEventHandler]);
  const unsubscribeAll = useCallback(() => {
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
  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, [unsubscribeAll]);
  useAnimatedReaction(() => activeTag.value, (currentTag, previousActiveTag) => {
    if (currentTag) {
      runOnJS(subscribeToScroll)(currentTag, previousActiveTag);
    } else {
      runOnJS(unsubscribeAll)();
    }
  }, [eventHandler.workletEventHandler, unsubscribeAll]);
  const onTouchStartHandler = useCallback(triggerId => {
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
  const initializeListeners = useCallback(() => {
    if (listenersInitialized.current) {
      return;
    }
    scrollListeners.current.set('onTouchStart', onTouchStartHandler);
    listenersInitialized.current = true;
  }, [onTouchStartHandler]);
  const addAndGet = useCallback((id, scrollRef) => {
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
  const remove = useCallback(id => {
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
  const setOffset = useCallback(initialOffset => {
    offset.value = initialOffset;
  }, [offset]);
  const getActiveId = useCallback(() => activeId.current, []);
  const setActiveId = useCallback(id => activeId.current = id, []);
  return {
    offset,
    addAndGet,
    remove,
    setOffset,
    getActiveId,
    setActiveId
  };
};
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
export default useLinkedScrollGroup;
//# sourceMappingURL=useLinkedScrollGroup.js.map