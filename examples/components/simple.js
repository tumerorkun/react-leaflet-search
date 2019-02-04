import React, { Component } from 'react'
import {Map, TileLayer, Popup} from 'react-leaflet'
import { ReactLeafletSearch } from '../../src'

class CustomOpenStreetMap {
  constructor(options = { providerKey: null, searchBounds: [] } ) {
    let { providerKey, searchBounds} = options;
    //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
    // We convert them into a string of 'x1,y1,x2,y2' which is the opposite way around from lat/lng - it's lng/lat
    let boundsUrlComponent = "";
    let regionUrlComponent = "";
    if (searchBounds.length) {
      const reversed = searchBounds.map((el) => {return el.reverse()});
      this.bounds = [].concat([],...reversed).join(",");
      boundsUrlComponent = `&bounded=1&viewbox=${this.bounds}`;
    }
    if ('region' in options) {
      regionUrlComponent = `&countrycodes=${options.region}`;
    }
    this.url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1${boundsUrlComponent}${regionUrlComponent}&q=`;
  }

  async search(query) {
    // console.log(this.url + query)
    const response = await fetch(this.url + query)
      .then(res => res.json());
    return this.formatResponse(response)
  }

  formatResponse(response) {
    const resources = response;
    const count = response.length;
    const info = (count > 0) ? resources.map(e => ({
      bounds: e.boundingbox.map(bound => Number(bound)),
      latitude: 0,
      longitude: 0,
      name: 'deneme 1',
    })) : 'Not Found';
    return {
      info: info,
      raw: response
    }
  }

}



export default class SimpleExample extends Component {

  constructor(props) {
    super(props)
    this.provider = new CustomOpenStreetMap();
    this.state = {
      count:0,
      maxZoom:13,
      maxBounds:[[-90, -180], [90, 180]],
      bounds: [
        {
          lat: 33.100745405144245,
          lng: 24.510498046875,
        },
        {
          lat: 33.100745405144245,
          lng: 46.48315429687501,
        },
        {
          lat: 44.55916341529184,
          lng: 46.48315429687501,
        },
        {
          lat: 44.55916341529184,
          lng: 24.510498046875,
        },
      ],
    }
  }

  customPopup(SearchInfo) {
    return(
      <Popup>
        <div>
          <p>I am a custom popUp</p>
          <p>latitude and longitude from search component: {SearchInfo.latLng.toString().replace(',',' , ')}</p>
          <p>Info from search component: {SearchInfo.info}</p>
          <p>{SearchInfo.raw && SearchInfo.raw.place_id && JSON.stringify(SearchInfo.raw.place_id)}</p>
        </div>
      </Popup>
    );
  }

  render() {
    return (
      <Map
          className="simpleMap"
          scrollWheelZoom={true}
          bounds={this.state.bounds}
          maxZoom={this.state.maxZoom}
          maxBounds={this.state.maxBounds}>
        <TileLayer noWrap={true} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ReactLeafletSearch
          customProvider={this.provider}
          position="topleft"
          inputPlaceholder="Custom placeholder"
          search = {
            [33.100745405144245, 46.48315429687501]
          }
          showMarker={true}
          zoom={5}
          showPopup={true}
          popUp={this.customPopup}
          closeResultsOnClick={true}
          openSearchOnLoad={true}
          // // these searchbounds would limit results to only Turkey.
          searchBounds = {
            [
              [33.100745405144245, 46.48315429687501],
              [44.55916341529184, 24.510498046875]
            ]
          }
          // providerOptions={{region: 'tr'}}

          // default provider OpenStreetMap
          // provider="BingMap"
          // providerKey="AhkdlcKxeOnNCJ1wRIPmrOXLxtEHDvuWUZhiT4GYfWgfxLthOYXs5lUMqWjQmc27"
        />
      </Map>
    )
  }
}
