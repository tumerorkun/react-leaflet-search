# react-leaflet-search

A React component for searching places or global coordinates on leaflet

Both react-leaflet v1 and v2 are supported.

With v1 you should import this component from "react-leaflet-search/lib/Search-v1";

```javascript
import Search from "react-leaflet-search/lib/Search-v1";
```

default import is v2 supported (it uses withLeaflet wrapper internally)

```javascript
import Search from "react-leaflet-search";
```

## Install

```npm
npm install react-leaflet-search
```

css files can be found in "react-leaflet-search/css", there is no need to import when using this package as a module.

## Usage

```javascript
import Search from "react-leaflet-search";
```

or

```javascript
import ReactLeafletSearch from "react-leaflet-search";
```

(default import so you can name it what ever you want.)

This component should be a child to react-leaflet's map component:

```javascript
const searchComponent = (props) => <ReactLeafletSearch position="topleft" />;
```

### Search providers

There are 2 search providers, but with scope for adding more. The default provider is OpenStreetMap. If you want to use BingMap as a provider, it can
be done as follows:

```javascript
const searchComponent = (props) => <ReactLeafletSearch position="topleft" provider="BingMap" providerOptions={{ providerKey: "{BINGMAP_KEY}" }} />;
```

You can pass in provider-specific options using the providerOptions prop:

```javascript
const searchComponent = (props) => <ReactLeafletSearch position="topleft" provider="OpenStreetMap" providerOptions={{ region: "gb" }} />;
```

to create a custom provider just create an Object

```typescript
const customProvider = {
  search: async (inputValue: string) => {
    // do fetch or anything
    return {
      info: Array<{
                      bounds: boundingBox,
                      latitude: number,
                      longitude: number,
                      name: displayName
                  }> | string,
      raw: rawResponse
    }
  }
}
```

```javascript
const component = <ReactLeafletSearch customProvider={customProvider} />;
```

### Search Result Marker

You can use own marker and Popup:

if you use this pattern showMarker and showPopup property of ReactLeafletSearch is not used

```javascript
<ReactLeafletSearch {...options}>
    {(info: { latLng: LatLng, info: string | Array<string>, raw: Record<string, unknown> }) => (
        <Marker>
            <Popup></Popup>
        </Marker>
    )}
</ReactLeafletSearch>
```

To change the marker icon, use the markerIcon prop:

```javascript
const myIcon = L.icon({
    iconUrl: "marker-icon.png",
    iconRetinaUrl: "marker-icon-2x.png",
    shadowUrl: "marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

<ReactLeafletSearch position="topleft" markerIcon={myIcon} />;
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
        <p>{JSON.stringify(SearchInfo.raw)}</p>
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
    onChange={(info: { latLng: LatLng, info: string | Array<string>, raw: Record<string, unknown> }) => {
        // this method triggers when user clicks one of the searched items or presses enter to search with global coordinates
    }}
    position="topleft"
    inputPlaceholder="The default text in the search bar"
    search={new LatLng(30, 30)} // Setting this to LatLng instance gives initial search input to the component and map flies to that coordinates, its like search from props not from user
    zoom={7} // Default value is 10
    showMarker={true}
    showPopup={false}
    openSearchOnLoad={false} // By default there's a search icon which opens the input when clicked. Setting this to true opens the search by default.
    closeResultsOnClick={false} // By default, the search results remain when you click on one, and the map flies to the location of the result. But you might want to save space on your map by closing the results when one is clicked. The results are shown again (without another search) when focus is returned to the search input.
    providerOptions={{ searchBounds: [new LatLng(10, 10), new LatLng(30, 30)] }} // The BingMap and OpenStreetMap providers both accept bounding coordinates in [sw,ne] format. Note that in the case of OpenStreetMap, this only weights the results and doesn't exclude things out of bounds.
    customProvider={undefined | { search: (searchString) => {} }} // see examples to usage details until docs are ready
/>
```

### Styling Component

you can add custom style

```javascript
<ReactLeafletSearch className="custom-style">
```

```css
.custom-style {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
    --icon-width: 26px;
    --icon-height: 26px;
    --active-height: 40px;
    --close-button-max-size: 12px;
    --icon-button-max-size: 18px;
    --primary-color: #000000;
    --secondary-color: rgba(141, 141, 141, 0.639);
    --border-color: rgba(0, 0, 0, 0.2);
    --border-size: 0px;
    --main-background-color: #ffffff;
    --background-color-candidate: #5a6673;
    --background-color-hover: #5a6673b3;
    --background-color-active: #50c3bd;
    --svg-stroke-width: 5px;
}
```

## Info about search input

It has two modes:

-   Search for latitude,longitude as numbers
-   Search for a place with its name, city, country, street etc.

To search with global coordinates, the search input should start with the ':' character and should respect the following format:
`:{LATITUDE},{LONGITUDE}`

### You can play with the demo

[DEMO](https://codesandbox.io/s/react-leaflet-search-uj4d3)
