import React from "react";
import { BingMap, OpenStreetMap } from "./Providers";
import PropTypes from "prop-types";
import { Map as LeafletMap, LatLng } from "leaflet";
import "../css/index.css";
export interface SearchControlProps {
    provider?: string;
    customProvider?: {
        search: (value: string) => Promise<any>;
    };
    providerOptions?: {
        providerKey?: string | null;
        searchBounds?: [LatLng, LatLng];
        region?: string;
    };
    search?: LatLng;
    openSearchOnLoad?: boolean;
    handler?: (obj: {
        event: "add";
        payload?: {
            latlng: LatLng;
            info: string;
            raw: any;
        };
    }) => any;
    removeMarker?: (obj: {
        event: "remove";
    }) => any;
    closeResultsOnClick?: boolean;
    inputPlaceholder?: string;
    map?: LeafletMap;
    className?: string;
    tabIndex?: number;
}
interface SearchControlState {
    open: boolean | undefined;
    closeButton: boolean;
    showInfo: boolean;
}
declare type ItemData = {
    latitude: number;
    longitude: number;
    name: string;
};
declare class SearchControl extends React.Component<SearchControlProps, SearchControlState> {
    input: React.RefObject<HTMLInputElement>;
    div: React.RefObject<HTMLDivElement>;
    provider: OpenStreetMap | BingMap | {
        search: (value: string) => Promise<any>;
    };
    responseCache: {
        [key: string]: any;
    };
    SearchResponseInfo: JSX.Element | string | null;
    lastInfo: JSX.Element | string | null;
    lock: boolean;
    inputEventHandler: Function;
    inputValueSetter: Function;
    selectbox: React.RefObject<HTMLUListElement>;
    constructor(props: SearchControlProps);
    static propTypes: {
        provider: PropTypes.Requireable<string>;
        providerKey: PropTypes.Requireable<string>;
        inputPlaceholder: PropTypes.Requireable<string>;
        coords: PropTypes.Requireable<(number | null | undefined)[]>;
        closeResultsOnClick: PropTypes.Requireable<boolean>;
        openSearchOnLoad: PropTypes.Requireable<boolean>;
        searchBounds: PropTypes.Requireable<any[]>;
        providerOptions: PropTypes.Requireable<object>;
    };
    static defaultProps: SearchControlProps;
    setLock: (value: boolean) => void;
    openSearch: () => void;
    closeSearch: () => void;
    aClick: (e: React.SyntheticEvent<Element, Event>) => void;
    inputBlur: (e: React.SyntheticEvent<Element, Event>) => void;
    inputClick: (e: React.SyntheticEvent<Element, Event>) => void;
    inputKeyUp: (e: React.KeyboardEvent<Element>) => void;
    closeClick: (e: React.SyntheticEvent<Element, Event>) => void;
    sendToAction: (e: React.SyntheticEvent<Element, Event>) => Promise<any>;
    syncInput: () => void;
    beautifyValue(value: string): void;
    hideInfo(): void;
    showInfo(info: string | Array<ItemData>, activeIndex?: number): void;
    listItemClick: (itemData: ItemData, totalInfo: ItemData[], activeIndex: number) => void;
    setMaxHeight: () => void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
export { SearchControl };
