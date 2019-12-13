import { Control, Icon, LatLng, Map, ZoomPanOptions, IconOptions } from "leaflet";
import React from "react";
import { MapControl, Marker, LeafletContext, MapControlProps } from "react-leaflet";
import { SearchControlProps } from "./search-control";
declare type ReactLeafletSearchProps = MapControlProps & SearchControlProps & {
    showMarker?: boolean;
    showPopup?: boolean;
    zoom: number;
    mapStateModifier?: "flyTo" | "setView" | ((l: LatLng) => void);
    zoomPanOptions?: ZoomPanOptions;
    customProvider?: {
        search: (value: string) => Promise<any>;
    };
    markerIcon?: Icon;
    popUp?: (i: {
        latLng: LatLng;
        info: string | Array<string>;
        raw: Object;
    }) => JSX.Element;
};
interface ReactLeafletSearchState {
    search: LatLng | false;
    info: any;
}
export default class ReactLeafletSearch extends MapControl<ReactLeafletSearchProps> {
    div: HTMLDivElement;
    markerIcon: Icon<IconOptions>;
    map?: Map;
    SearchInfo: {
        latLng: LatLng;
        info: string | Array<string>;
        raw: Object;
    } | null;
    state: ReactLeafletSearchState;
    markerRef: React.RefObject<Marker>;
    constructor(props: ReactLeafletSearchProps, context: LeafletContext);
    createLeafletElement(props: ReactLeafletSearchProps): {
        onAdd: (map: Map) => HTMLDivElement;
        onRemove: (map: Map) => void;
    } & Control;
    handler: ({ event, payload }: {
        event: "add" | "remove";
        payload?: {
            latlng: LatLng;
            info: string;
            raw: any;
        } | undefined;
    }) => void;
    latLngHandler(latLng: LatLng, info: string | Array<string>, raw: Object): void;
    removeMarkerHandler(): void;
    goToLatLng(latLng: LatLng, info: JSX.Element): void;
    flyTo(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    defaultPopUp(): JSX.Element;
    render(): JSX.Element | null;
    static defaultProps: ReactLeafletSearchProps;
}
export { ReactLeafletSearchProps };
