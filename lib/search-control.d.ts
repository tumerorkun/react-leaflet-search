import * as React from "react";
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
        event: "add" | "remove";
        payload?: {
            latLng: LatLng;
            info: string;
            raw: any;
        };
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
    searchIconButtonOnClick: (e: React.SyntheticEvent) => void;
    inputBlur: (e: React.SyntheticEvent) => void;
    inputClick: (e: React.SyntheticEvent) => void;
    inputKeyUp: (e: React.KeyboardEvent) => void;
    closeClick: (e: React.SyntheticEvent) => void;
    sendToAction: (e: React.SyntheticEvent) => Promise<any>;
    syncInput: () => void;
    beautifyValue(value: string): void;
    hideInfo(): void;
    showInfo(info: string | Array<ItemData>, activeIndex?: number): void;
    listItemClick: (itemData: ItemData, totalInfo: Array<ItemData>, activeIndex: number) => void;
    setMaxHeight: () => void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
export { SearchControl };
