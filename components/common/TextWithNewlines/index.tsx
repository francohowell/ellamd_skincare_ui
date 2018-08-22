import * as React from "react";

interface Props {
  text?: string;
}

/**
 * Render the passed-in text with newlines replaced with HTML line breaks.
 */
export class TextWithNewlines extends React.Component<Props> {
  public render() {
    const text = String(this.props.text);

    return (
      <span>
        {text.split("\n").map((line, key) => (
          <span key={key}>
            {line}
            <br />
          </span>
        ))}
      </span>
    );
  }
}
