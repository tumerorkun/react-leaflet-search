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
          <p>Info from search component: {SearchInfo}</p>
        </div>
      </Popup>
    );
  }

  render() {
    return (
      <Map
          className="simpleMap"
          scrollWheelZoom={false}
          bounds={this.state.bounds}
          maxZoom={this.state.maxZoom}
          maxBounds={this.state.maxBounds}>
        <TileLayer noWrap={true} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ReactLeafletSearch
          position="topright"
          inputPlaceholder="Custom placeholder"
          showMarker={true}
          showPopup={true}
          popUp={this.customPopup}
          closeResultsOnClick={true}
          openSearchOnLoad={true}
          // these searchbounds would limit results to only London.
          searchBounds={[[51.24988,-0.55343],[51.72617,0.33233]]}
          // providerOptions={{region: 'gb'}}


          // default provider OpenStreetMap
          // provider="BingMap"
          // providerKey="AhkdlcKxeOnNCJ1wRIPmrOXLxtEHDvuWUZhiT4GYfWgfxLthOYXs5lUMqWjQmc27"
        />
      </Map>
    )
  }
}
