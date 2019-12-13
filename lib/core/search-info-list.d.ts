import React from "react";
declare type Item = {
    latitude: number;
    longitude: number;
    name: string;
    checked?: boolean;
};
declare const SearchInfoList: React.ForwardRefExoticComponent<{
    list: string | Item[];
    handler: (item: Item, list: Item[], index: number) => void;
    tabIndex?: number | undefined;
    activeIndex?: number | undefined;
} & React.RefAttributes<HTMLUListElement>>;
export { SearchInfoList };
