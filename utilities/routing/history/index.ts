import createBrowserHistory from "history/createBrowserHistory";
import createMemoryHistory from "history/createMemoryHistory";

// Use browser history on the client and memory history on the server:
const history = typeof window !== "undefined" ? createBrowserHistory() : createMemoryHistory();
export {history};
