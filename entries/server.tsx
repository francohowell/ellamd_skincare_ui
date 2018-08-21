/* tslint:disable no-console no-string-literal */
import * as chalk from "chalk";
import * as compression from "compression";
import * as express from "express";
import * as sslRedirect from "heroku-ssl-redirect";
import * as minimist from "minimist";
import {useStaticRendering} from "mobx-react";
import * as morgan from "morgan";
import * as path from "path";
import * as React from "react";
import {renderToString} from "react-dom/server";
import Helmet from "react-helmet";
import {StaticRouter} from "react-router-dom";

import {Entry} from "entries";
import {updateCurrentUrl, WithInsertCSSContext} from "utilities";

// tslint:disable-next-line no-var-requires
const htmlTemplate = require("!!file-loader?name=html.ejs!entries/html.ejs");
const argv = minimist(process.argv.slice(2));

// TODO: Keep this better in sync with the production Webpack configuration:
const BUILD_PATH = "build";

const ENABLE_SERVER_SIDE_RENDERING = false;

export interface Context {
  statusCode?: number;
  url?: string;
}

// Stop leaking memory waiting for lifecycle methods that will never come:
useStaticRendering(true);

const app = express();
app.use(compression());
app.use(sslRedirect());
app.use(morgan("dev"));
app.use(`/${BUILD_PATH}`, express.static(`./${BUILD_PATH}`));
app.set("views", path.resolve("."));

app.get("*", (request, response) => {
  const url = `${request.protocol}://${request.get("host")}${request.originalUrl}`;
  updateCurrentUrl(url);

  const context: Context = {};

  let html = "";
  let helmet = "";
  let css = "";

  if (ENABLE_SERVER_SIDE_RENDERING) {
    const cssSet = new Set();
    const insertCss = (...styles: any[]) => styles.forEach(style => cssSet.add(style._getCss()));

    const root = (
      <WithInsertCSSContext insertCss={insertCss}>
        <StaticRouter location={request.url} context={context}>
          <Entry onServer={true} />
        </StaticRouter>
      </WithInsertCSSContext>
    );

    html = renderToString(root);
    helmet = Helmet.renderStatic();
    css = Array.from(cssSet).join("");
  }

  if (context.url) {
    // react-router is redirecting us:
    response.redirect(context.statusCode || 302, context.url);
  } else {
    // All's good:
    response.status(context.statusCode || 200).render(`./${htmlTemplate}`, {
      css,
      faviconPath: require("assets/images/favicon.png"),
      helmet,
      html,
      shouldInjectBundle: true,
    });
  }
});

// Get the intended host and port number; use localhost:8080 if not provided:
const host = argv["host"] || process.env.HOST || undefined;
const port = argv["port"] || process.env.PORT || 8080;

// Start listening:
app.listen(port, host, (error: Error) => {
  if (error) {
    console.log(`Error! ${chalk.red("✗")}`);
    return;
  }

  console.log(`Server started! ${chalk.green("✓")}`);
  console.log(`→ ${chalk.magenta(`http://${host || "localhost"}:${port}`)}`);
  console.log(chalk.blue(`Press ${chalk.bold("CTRL-C")} to stop`));
});
