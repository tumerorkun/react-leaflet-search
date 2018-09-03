import React, { Component } from 'react'
import {Map, TileLayer, Popup} from 'react-leaflet'
import { ReactLeafletSearch } from '../../src'

export default class SimpleExample extends Component {

  constructor(props) {
    super(props)
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
