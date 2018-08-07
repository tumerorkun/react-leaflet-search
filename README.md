# react-leaflet-search
React component for search lat lng on leaflet

reacet-leaflet v1 and v2 are supported

with v2 you should wrap this component with withLeaflet method
```javascript
const wrappedZoomIndicator = withLeaflet(ReactLeafletZoomIndicator)
```
and then use wrappedZoomIndicator component as child of Map component


## Install

don't forget to add stylesheet to your project you can find it in src or lib folder

```npm
npm install react-leaflet-search
```

## Usage
```javascript
import { ReactLeafletSearch } from 'react-leaflet-search'
```

this component should be a child to react-leaflet's map component:
```javascript
const searchComponent = props => (
  <ReactLeafletSearch position="topleft" />
)
```

default provider is OpenStreetMap if you wnat to use BingMap as a provider you should use like this:
```javascript
const searchComponent = props => (
  <ReactLeafletSearch
            position="topleft"
            provider="BingMap"
            providerKey="{BINGMAP_KEY}" />
)
```
for now react-leaflet-search has two provider but more will be added.

to change marker icon use markerIcon prop:
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

## Info about search input
it has two modes:
- search only latitude,longitude as numbers
- search place with its name, city, country, street etc...

to search with latitude, longitude search input should start with ':' character and should respect the following format: ":{LATITUDE},{LONGITUDE}"


### you can play with the demo

[DEMO](https://tumerorkun.github.io/react-leaflet-search)
