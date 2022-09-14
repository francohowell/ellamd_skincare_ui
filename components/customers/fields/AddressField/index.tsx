import * as React from "react";

import {Customer} from "models";

import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
}

// We can't rely on mobx here and have to keep track of `address' in component state
//   because of ReactGoogleMapLoader wrapper
interface State {
  customer: Customer;
  address?: string;
  search: string;
}

export class AddressField extends React.Component<Props, State> {
  public state: State = {
    customer: this.props.customer,
    address: this.props.customer.addressLine1,
    search: "",
  };

  private handleSuggestSelect = (suggest: ReactGooglePlacesSuggest.GeocodedPrediction) => {
    const {address_components, formatted_address} = suggest;
    const {customer} = this.state;

    this.setState({address: formatted_address, search: ""});
    customer.setField("addressLine1", formatted_address);

    address_components.forEach(component => {
      const {long_name} = component;
      const types = component.types;

      if (types.includes("locality")) {
        customer.setField("city", long_name);
      } else if (types.includes("administrative_area_level_1")) {
        customer.setField("state", long_name);
      } else if (types.includes("postal_code")) {
        customer.setField("zipCode", long_name);
      }
    });
  };

  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {value},
    } = event;

    this.setState({address: value, search: value});
    this.state.customer.setField("addressLine1", value);
  };

  private renderPrediction = (prediction: ReactGooglePlacesSuggest.Prediction): JSX.Element => {
    return (
      <div className={styles.suggestContainerItem}>
        {prediction ? prediction.description : "No results..."}
      </div>
    );
  };

  private renderSuggestInput = (googleMaps: ReactGoogleMapLoader.GoogleMaps): JSX.Element => {
    if (!googleMaps) return <span />;

    return (
      <ReactGooglePlacesSuggest
        googleMaps={googleMaps}
        autocompletionRequest={{input: this.state.search}}
        onSelectSuggest={this.handleSuggestSelect}
        textNoResults=""
        customRender={this.renderPrediction}
      >
        <label className="pt-label">
          <div className={styles.label}>Address</div>

          <input
            type="text"
            className="pt-input pt-fill pt-large"
            value={this.state.address}
            onChange={this.handleInputChange}
          />
        </label>
      </ReactGooglePlacesSuggest>
    );
  };

  public render() {
    return (
      <ReactGoogleMapLoader
        params={{
          key: process.env.GOOGLE_MAPS_API_KEY,
          libraries: "places",
        }}
        render={this.renderSuggestInput}
      />
    );
  }
}
