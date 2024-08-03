import { useEffect, useRef } from "react";


export function useSwipeRight({
  onGesture,
  onEnd,
  onCancel
}: {
  onGesture: (num: number) => void
  onEnd: () => void
  onCancel: () => void
  }) {
  
  const onGestureRef = useRef<(num: number) => void>()
  const onEndRef = useRef<() => void>()
  const onCancelRef = useRef<() => void>()

  useEffect(() => {
    onGestureRef.current = onGesture
    onEndRef.current = onEnd
    onCancelRef.current = onCancel
  },[ onGesture, onEnd, onCancel ])
  
  useEffect(() => {

    let touchstartX = 0;
    let touchendX = 0;
    const zone = document.body;

    function onTouchStart(event: TouchEvent) {
      touchstartX = event.touches[0].screenX;
    }

    function onTouchMove(event: TouchEvent) {
      touchendX = event.touches[0].screenX;
      onGestureRef.current && onGestureRef.current(
        touchendX - touchstartX
      )
    }
    
    function onTouchEnd(event: TouchEvent) {
      touchendX = event.touches[0].screenX;
      if (touchendX > touchstartX) onEndRef.current && onEndRef.current()
      else onCancelRef.current && onCancelRef.current()
    }

    function onTouchCancel(event: TouchEvent) {
      onCancelRef.current && onCancelRef.current()
    }

    zone.addEventListener('touchstart', onTouchStart, false);
    zone.addEventListener('touchmove', onTouchMove, false); 
    zone.addEventListener('touchend', onTouchEnd, false); 
    zone.addEventListener('touchcancel', onTouchCancel, false)

    return () => {
      zone.removeEventListener('touchstart', onTouchStart, false);
      zone.removeEventListener('touchmove', onTouchMove, false); 
      zone.removeEventListener('touchend', onTouchEnd, false); 
      zone.removeEventListener('touchcancel', onTouchCancel, false)
    }

  }, [])
  
  return null

}