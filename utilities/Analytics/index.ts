// tslint:disable-next-line variable-name
let Analytics: {
  identify: (id: any, traits?: object) => void;
  track: (eventName?: string, properties?: object) => void;
  page: (pageName?: string) => void;
};

if (typeof window !== "undefined" && (window as any).analytics) {
  // Pull in the analytics object from the Segment <head> JS (or whatever other package might
  // define this).
  Analytics = (window as any).analytics;
} else {
  // Use a no-op Analyics for server-side rendering.
  Analytics = {
    identify: () => {
      return;
    },
    track: () => {
      return;
    },
    page: () => {
      return;
    },
  };
}

export {Analytics};
