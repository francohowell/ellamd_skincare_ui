interface SvgrComponent extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module "*.svg" {
  const path: string;
  const ReactComponent: SvgrComponent; // tslint:disable-line

  export default path;
  export {ReactComponent};
}
