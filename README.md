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

### Search providers

There are 2 search providers, but with scope for adding more.  The default provider is OpenStreetMap. If you want to use BingMap as a provider, it can be done as follows:
```javascript
const searchComponent = props => (
  <ReactLeafletSearch
            position="topleft"
            provider="BingMap"
            providerKey="{BINGMAP_KEY}" />
)
```

You can pass in provider-specific options using the providerOptions prop:
```javascript
const searchComponent = props => (
  <ReactLeafletSearch
            position="topleft"
            provider="OpenStreetMap"
            providerOptions={{region: 'gb'}} />
)
```

### Search Result Marker

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
myPopup(SearchInfo) {
  return(
    <Popup>
      <div>
        <p>I am a custom popUp</p>
        <p>latitude and longitude from search component: lat:{SearchInfo.latLng[0]} lng:{SearchInfo.latLng[1]}</p>
        <p>Info from search component: {SearchInfo.info}</p>
      </div>
    </Popup>
  );
}

<ReactLeafletSearch position="topleft" popUp={ myPopup }/>
```
### Other props which can be set on the `ReactLeafletSearch` component
Other aspects can be customized as well:

```javascript
<ReactLeafletSearch
  position="topleft"
  inputPlaceholder="The default text in the search bar"
  search={[]} // Setting this to [lat, lng] gives initial search input to the component and map flies to that coordinates, its like search from props not from user
  zoom={7} // Default value is 10
  showMarker={true}
  showPopup={false}
  openSearchOnLoad={false} // By default there's a search icon which opens the input when clicked. Setting this to true opens the search by default.
  closeResultsOnClick={false} // By default, the search results remain when you click on one, and the map flies to the location of the result. But you might want to save space on your map by closing the results when one is clicked. The results are shown again (without another search) when focus is returned to the search input.
  searchBounds={[]} // The BingMap and OpenStreetMap providers both accept bounding coordinates in [se,nw] format. Note that in the case of OpenStreetMap, this only weights the results and doesn't exclude things out of bounds.
/>
```


## Info about search input
It has two modes:
- Search for latitude,longitude as numbers
- Search for a place with its name, city, country, street etc.

To search with global coordinates, the search input should start with the ':' character and should respect the following format: `:{LATITUDE},{LONGITUDE}`


### You can play with the demo

[DEMO](https://tumerorkun.github.io/react-leaflet-components-examples/)

[React-Leaflet v2 Demo](https://tumerorkun.github.io/react-leaflet-v2-tests/)
