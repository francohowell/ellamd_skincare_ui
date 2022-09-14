import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import * as Autosuggest from "react-autosuggest";
import {connectAutoComplete, connectInfiniteHits} from "react-instantsearch/connectors";
import {mapProps} from "recompose";

import * as styles from "./index.css";

export type Hit = any;
export type Suggestion = any;

const remapRefineHoc = mapProps((props: Props): Props => {
  return {
    ...props,
    refineMore: props.refine,
  };
});

interface Props {
  hasMore?: boolean;
  hits?: any;
  currentRefinement?: any;
  refine?: any;
  refineMore?: any;
  hitsToSuggestions: (hit: Hit[]) => Suggestion[];
  renderSuggestion: (suggestion: Suggestion) => JSX.Element | string;
  getSuggestionValue: (suggestion: Suggestion) => string;
  onQueryUpdate: (query: string) => void;
  onSuggestionSelect: (hit: Hit) => void;
}

class Store {
  @observable public hits: Hit[];

  constructor() {
    this.hits = [];
  }

  @action
  public addHits(freshHits: Hit[]) {
    if (freshHits.length === 0) {
      return;
    }

    freshHits = freshHits.filter(hit => {
      return !this.hits.some(oldHit => hit.id === oldHit.id);
    });

    this.hits = this.hits.concat(freshHits);
  }

  @action
  public clearHits() {
    this.hits = [];
  }
}

@connectAutoComplete
@observer
class AlgoliaAutocompleteFinite extends React.Component<Props> {
  private store: Store;
  private suggestionsContainerElement: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.store = new Store();
  }

  public componentWillReceiveProps(nextProps: Props) {
    const {hits} = nextProps;
    this.store.addHits(hits);
  }

  public render() {
    const {currentRefinement, refine} = this.props;
    const {
      getSuggestionValue,
      hitsToSuggestions,
      renderSuggestion,
      onQueryUpdate,
      onSuggestionSelect,
    } = this.props;

    return (
      <div className={styles.suggestionBox}>
        <Autosuggest
          suggestions={hitsToSuggestions(this.store.hits.slice())}
          onSuggestionsFetchRequested={({value}) => {
            refine(value);
            onQueryUpdate(value);
            this.store.clearHits();
          }}
          onSuggestionsClearRequested={() => {
            refine("");
            onQueryUpdate("");
            this.store.clearHits();
          }}
          onSuggestionSelected={(_event, eventData) => onSuggestionSelect(eventData.suggestion)}
          getSuggestionValue={suggestion => getSuggestionValue(suggestion)}
          renderSuggestion={suggestion => renderSuggestion(suggestion)}
          inputProps={{
            placeholder: "Add new product...",
            value: currentRefinement,
            // tslint:disable-next-line no-empty
            onChange: () => {},
          }}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          theme={AUTOSUGGEST_THEME}
        />
      </div>
    );
  }

  private renderSuggestionsContainer = ({containerProps, children, _query}: any) => {
    return (
      <div
        {...containerProps}
        onScroll={event => this.scrollReachedBottomHandler(event)}
        ref={el => {
          this.suggestionsContainerElement = el!;
          if (containerProps.ref) {
            containerProps.ref(el);
          }
        }}
      >
        {children}
      </div>
    );
  };

  private scrollReachedBottomHandler = (_event: React.UIEvent<HTMLDivElement>): void => {
    const el = this.suggestionsContainerElement;

    if (!el || el.scrollTop + el.clientHeight < el.scrollHeight) {
      return;
    }

    if (!this.props.hasMore) {
      return;
    }

    this.props.refineMore();
  };
}

// tslint:disable-next-line variable-name
export const AlgoliaAutocomplete = connectInfiniteHits(remapRefineHoc(AlgoliaAutocompleteFinite));

const AUTOSUGGEST_THEME: Autosuggest.Theme = {
  container: {},
  input: {
    border: "1px solid #aaa",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    fontFamily: "Helvetica, sans-serif",
    fontSize: 16,
    fontWeight: 300,
    padding: 8,
    width: "100%",
  },
  inputFocused: {
    outline: "none",
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  suggestionsContainer: {},
  suggestionsContainerOpen: {
    backgroundColor: "#fff",
    border: "1px solid #aaa",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    fontFamily: "Helvetica, sans-serif",
    fontSize: 16,
    fontWeight: 300,
    "max-height": "300px",
    overflow: "auto",
    position: "absolute",
    zIndex: 9000,
  },
  suggestionsList: {
    listStyleType: "none",
    margin: 0,
    padding: 0,
  },
  suggestion: {
    cursor: "pointer",
    padding: "10px 20px",
  },
  suggestionHighlighted: {
    backgroundColor: "#ddd",
  },
};
