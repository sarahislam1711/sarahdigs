// Lightweight global "unsaved changes" guard.
// The post editor sets `blockNavigation` while it has unsaved work; shared
// navigation (admin sidebar links) checks `confirmLeave()` before navigating.

let blocked = false;

export function setBlockNavigation(value: boolean) {
  blocked = value;
}

export function isNavigationBlocked() {
  return blocked;
}

// Returns true if it's safe to navigate (either not blocked, or the user
// confirmed they want to discard changes). Clears the block on confirm.
export function confirmLeave(): boolean {
  if (!blocked) return true;
  const ok = window.confirm(
    "you have unsaved changes. are you sure you want to leave? your progress will be lost."
  );
  if (ok) blocked = false;
  return ok;
}
