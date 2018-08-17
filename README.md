# react-leaflet-search
A React component for searching places or global coordinates on leaflet

Both react-leaflet v1 and v2 are supported.

With v2 you should wrap this component in the withLeaflet method
```javascript
const wrappedZoomIndicator = withLeaflet(ReactLeafletZoomIndicator)
```
and then use a wrappedZoomIndicator component as child of the Map component.


## Install

```npm
npm install react-leaflet-search
```

Don't forget to add the stylesheet to your project. It can be found in both the src/ and lib/ folders


## Usage
```javascript
import { ReactLeafletSearch } from 'react-leaflet-search'
```

This component should be a child to react-leaflet's map component:
```javascript
const searchComponent = props => (
  <ReactLeafletSearch position="topleft" />
)
```

The default provider is OpenStreetMap. If you want to use BingMap as a provider, it can be done as follows:
```javascript
const searchComponent = props => (
  <ReactLeafletSearch
            position="topleft"
            provider="BingMap"
            providerKey="{BINGMAP_KEY}" />
)
```
For now, react-leaflet-search only has two providers, but more will be added in the future.

To change the marker icon, use the markerIcon prop:
```javascript
const myIcon = L.icon({
    iconUrl: 'marker-icon.png',
    iconRetinaUrl: 'marker-icon-2x.png',
    shadowUrl: 'marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

<ReactLeafletSearch position="topleft" markerIcon={ myIcon }/>
```

To change the Popup displayed by the marker, use the popUp prop:

```javascript
myPopup() {
  return(
    <Popup>
      <span>I am a custom popup</span>
    </Popup>
  );
}

<ReactLeafletSearch position="topleft" popUp={ myPopup }/>
```

Other aspects can be customized as well:

```javascript
<ReactLeafletSearch
  position="topright"
  inputPlaceholder="The default text in the search bar"
  showMarker={true}
  showPopup={false}
/>
```


## Info about search input
It has two modes:
- Search for latitude,longitude as numbers
- Search for a place with its name, city, country, street etc.

To search with global coordinates, the search input should start with the ':' character and should respect the following format: `:{LATITUDE},{LONGITUDE}`


### You can play with the demo

[DEMO](https://tumerorkun.github.io/react-leaflet-search)
