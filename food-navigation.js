const nativeArrowControl =
  'input, textarea, select, details, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="spinbutton"], [role="combobox"], [role="listbox"], [role="menu"], [role="tablist"], dialog';

export function bindFoodNavigation({
  root = document,
  explorer,
  surface,
  step,
}) {
  let gesture = null;
  const interactive = (target) =>
    target?.closest?.("a, button, input, select, textarea, details, [contenteditable]");

  function onKeyDown(event) {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.target?.closest?.(nativeArrowControl) ||
      !["ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    const bounds = explorer.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= root.defaultView.innerHeight)
      return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  }

  function onPointerDown(event) {
    if (event.pointerType !== "touch") return;
    if (!event.isPrimary || gesture) {
      gesture = null;
      return;
    }
    if (interactive(event.target)) return;
    gesture = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
      width: surface.getBoundingClientRect().width,
    };
    surface.setPointerCapture(event.pointerId);
  }

  function onPointerUp(event) {
    if (!gesture || gesture.id !== event.pointerId) return;
    const start = gesture;
    gesture = null;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const distance = Math.abs(dx);
    const duration = Math.max(1, event.timeStamp - start.time);
    const threshold = Math.max(42, Math.min(80, start.width * 0.14));
    const intentional =
      distance >= threshold || (distance >= 28 && distance / duration > 0.35);
    if (duration <= 1200 && intentional && distance > Math.abs(dy) * 1.4) {
      step(dx < 0 ? 1 : -1);
    }
  }

  function cancelGesture() {
    gesture = null;
  }

  root.addEventListener("keydown", onKeyDown);
  surface.addEventListener("pointerdown", onPointerDown);
  surface.addEventListener("pointerup", onPointerUp);
  surface.addEventListener("pointercancel", cancelGesture);
  surface.addEventListener("lostpointercapture", cancelGesture);
  return () => {
    root.removeEventListener("keydown", onKeyDown);
    surface.removeEventListener("pointerdown", onPointerDown);
    surface.removeEventListener("pointerup", onPointerUp);
    surface.removeEventListener("pointercancel", cancelGesture);
    surface.removeEventListener("lostpointercapture", cancelGesture);
  };
}
