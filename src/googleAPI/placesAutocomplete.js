import React from 'react';
import { keys } from "../config/keys";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = ({ setUbAddress }) => {
  return (
    <GooglePlacesAutocomplete
      fetchDetails={true}
      placeholder='Search'
      minLength={2}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
        setUbAddress(details);
      }}
      query={{
        key: keys.googleAPIKey.APIKey,
        language: 'en',
      }}
      onFail={error => alert(error)}
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        fields: 'formatted_address,geometry,url'
      }}
      enablePoweredByContainer={false}
    />
  );
};

export default GooglePlacesInput;