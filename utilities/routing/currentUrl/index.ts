let nodeUrl = "";

/** The server (node) uses this function before the page renders to keep the variable in sync. */
export function updateCurrentUrl(currentUrl: string) {
  nodeUrl = currentUrl;
}

function getCurrentUrl() {
  if (typeof window !== "undefined") {
    // We're on the client (browser):
    return window.location.href;
  } else {
    // We're on the server (Node):
    return nodeUrl;
  }
}

export {getCurrentUrl};
