# EllaMD: UI
This repository houses the web-based EllaMD application UI. This UI interacts with the API housed in the `ellamd-api` repository.

> **Note:** This README isn't fully fleshed out and documentation (i.e. JSDoc comments) is currently behind. Reach out to @kamkha with questions about the repository.

## Quickstart
| Command        | Description |
| -------------- | ----------- |
| `yarn run dev`  | Start a development environment and server at [http://localhost:8080](http://localhost:8080). |
| `yarn run prod` | Compile the app and serve it from [http://localhost:3000](http://localhost:3000). This is useful for testing server-side rendering, etc. |

## Technologies
The EllaMD web UI is written in TypeScript. It uses [React](https://facebook.github.io/react/) for its view layer, [MobX](https://github.com/mobxjs/mobx) to manage state, [yarn](https://www.yarnpkg.com/) for dependency management, and [webpack](https://webpack.github.io/) to run a development server and to compile the app for production.

CSS is managed following the best practices of [CSS Modules](https://github.com/css-modules/css-modules). Palantir's [Blueprint](http://blueprintjs.com/) UI toolkit is also included and serves as the basis for a handful of the app's components. Locally scoped class names are used everywhere *except* for Blueprint classes, which are prefixed with `pt-` and are global.

## Environments
There are two environments in which you can run `ellamd-ui`: **development** and **production**. For each of those there is a unique server structure.
- *Development* uses Webpack's `webpack-dev-server` to serve an HTML document compiled by `HtmlWebpackPlugin` which automatically injects the client JS and CSS bundles. The development server is configured to deliver source maps, enable hot reloading, provide readable class names, and more.
- *Production* uses Express to pre-render requested pages and serve them. The pages are rendered with “critical CSS” (only the CSS needed by the pre-rendered components) inlined, and the client JS and CSS bundles are loaded asynchronously. The production server is itself built by Webpack; the production environment defines two entry points — `client` and `server` — the latter of which is compiled into `server.js` and meant to be run as a server.

## Notes
### File structure
Following a common modern web-development practice, components and other modules of the front-end application are grouped into *directories* named after their contents. The source files themselves are named `index.ext`, e.g. `index.tsx` or `index.css`.

Once a development environment is properly set up (to display the directory names, for example), this naming scheme makes things easier: there is no redundant repetition of names across directories and files (e.g. `Icon/Icon.tsx`), but components are still grouped into a reasonable domain-driven directory hierarchy. When a component relies on sub-components that are rarely (or never) needed outside of that parent component, the sub-components reside in a subdirectory of the parent component.

Every directory with a TypeScript module should have an `index.ts` or `index.tsx` that exports that directory's modules. Webpack has been configured to allow for imports of these modules with minimal syntax (e.g. `import {Icon} from "components/common"`).

### Refactoring
Some of the application's components are in need of refactoring (e.g. the `SignUpForm` component). Once iteration on these components' design and functionality has finished and their implementations have stabilized, they should be broken up, refactored, and DRYed up as much as possible.

### API formatting
Within the TypeScript app, attribute names are *camel cased*, like `preferredFragrance`. Our JSON API, however, uses *dashed* attribute names, like `preferred-fragrance`. There is middleware in place in the application to handle the conversion between camel-cased and dashed attributes transparently, so all code, including data submitted to external API endpoints via the `request` module included, should just use the standard camel-cased attribute names.

### Linting, testing, etc.
In the repository, `.ts` and `.tsx` files are linted with [tslint](https://github.com/palantir/tslint) (configured via [`tslint.json`](tslint.json)), formatted with [Prettier](https://github.com/prettier/prettier) and compiled with [TypeScript](https://www.typescriptlang.org/). `.css` files are linted with [stylelint](https://github.com/stylelint/stylelint) (configured via [`stylelint.config.js`](stylelint.config.js)) and compiled with [PostCSS](https://github.com/postcss/postcss). However, there are currently no pre- or post-commit hooks to enforce that linting and formatting. There is also, unfortunately, little explicit testing in the repository right now. As the product stabilizes though, testing can — and should — be introduced.

### Browser support
The web-based EllaMD UI officially supports Chrome, Safari, Firefox, Edge, and Internet Explorer. Browser support is primarily limited by our use of flexbox, and there might be subtle differences in behavior across browsers. We should aim to provide a consistent, usable experience across the following browser versions:

| Browser           | Versions supported |
| ----------------- | ------------------ |
| Chrome            | 30+                |
| Safari            | 7+                 |
| Firefox           | 43+                |
| Edge              | 12+                |
| Internet Explorer | 11                 |
