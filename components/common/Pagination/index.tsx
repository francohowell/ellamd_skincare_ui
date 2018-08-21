import {Button} from "@blueprintjs/core";
import {observer} from "mobx-react";
import * as React from "react";

import {SubmitEvent} from "utilities";
import * as styles from "./index.css";

interface Props {
  totalPages: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
}

const LEFT_SEPARATOR = -1;
const RIGHT_SEPARATOR = -2;

const pagesList = (currentPage: number, totalPages: number) => {
  const pages: number[] = [];

  if (totalPages === 0) return pages;

  if (totalPages > 1) {
    if (currentPage > 2) {
      pages.push(1);
    }
    if (currentPage > 3) {
      pages.push(2);
    }
    if (currentPage > 4) {
      pages.push(LEFT_SEPARATOR);
    }
    if (currentPage > 1) {
      pages.push(currentPage - 1);
    }
  }

  pages.push(currentPage);

  if (currentPage < totalPages) {
    pages.push(currentPage + 1);
  }
  if (currentPage < totalPages - 2) {
    pages.push(RIGHT_SEPARATOR);
  }
  if (currentPage < totalPages - 3) {
    pages.push(totalPages - 1);
  }
  if (currentPage < totalPages - 1) {
    pages.push(totalPages);
  }

  return pages;
};

@observer
export class Pagination extends React.Component<Props> {
  private goToPage(page: number) {
    this.props.onPageSelect(page);
  }

  public render() {
    const {totalPages, currentPage} = this.props;
    const pages = pagesList(currentPage, totalPages);

    return (
      <div className={styles.pagination}>
        <div className="pt-button-group">
          {currentPage === 1 ? (
            undefined
          ) : (
            <Button
              iconName="arrow-left"
              disabled={currentPage === 1}
              onClick={() => this.goToPage(currentPage - 1)}
            />
          )}
          {pages.map((page: number) => {
            if (page === LEFT_SEPARATOR || page === RIGHT_SEPARATOR) {
              return (
                <Button key={page} onClick={(e: SubmitEvent) => e.preventDefault()}>
                  ...
                </Button>
              );
            } else {
              return (
                <Button
                  key={page}
                  onClick={() => this.goToPage(page)}
                  disabled={page === currentPage}
                >
                  {page}
                </Button>
              );
            }
          })}
          {currentPage === totalPages || totalPages === 0 ? (
            undefined
          ) : (
            <Button iconName="arrow-right" onClick={() => this.goToPage(currentPage + 1)} />
          )}
        </div>
      </div>
    );
  }
}
