import React from "react";

type Item = { latitude: number; longitude: number; name: string; checked?: boolean };

const SearchInfoListItem = ({
    value,
    className,
    candidate,
    onClick,
    onKeyDown,
    children,
}: {
    value: number;
    className: string;
    candidate: number;
    onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => any;
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => any;
    children: React.ReactNode;
}) => {
    const r: React.RefObject<HTMLLIElement> = React.useRef(null);
    React.useEffect(() => {
        if (value === candidate && r.current && r.current.offsetParent) {
            r.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [candidate, value]);
    return (
        <li ref={r} value={value} className={className} onClick={onClick} onKeyDown={onKeyDown}>
            {children}
        </li>
    );
};

const SearchInfoListCore = (
    props: {
        list: string | Array<Item>;
        handler: (item: Item, list: Array<Item>, index: number) => void;
        tabIndex?: number;
        activeIndex?: number;
    },
    ref: React.Ref<HTMLUListElement>,
) => {
    const { handler, list, tabIndex, activeIndex } = props;
    const [cand, setCand] = React.useState(0);
    const arrowKeyHandler = React.useCallback<(e: React.KeyboardEvent<HTMLElement>) => void>(
        (e: React.KeyboardEvent<HTMLElement>) => {
            if (Array.isArray(list)) {
                e.stopPropagation();
                e.keyCode !== 9 && e.preventDefault(); // don't prevent tab
                const length = list.length;

                // Enter 13, Spacebar 32
                if ((!(length <= cand || cand < 0) && e.keyCode === 13) || e.keyCode === 32) {
                    handler(list[cand], list, cand);
                } else {
                    const c = length <= cand || cand < 0 ? 0 : cand;
                    // ArrowUp 38
                    if (e.keyCode === 38) {
                        setCand(c === 0 ? list.length - 1 : c - 1);
                    }
                    // ArrowDown 40
                    else if (e.keyCode === 40) {
                        setCand(c + 1 === list.length ? 0 : c + 1);
                    }
                }
            }
        },
        [setCand, cand, list, handler],
    );

    React.useLayoutEffect(() => setCand(0), [list]);

    return Array.isArray(list) ? (
        <ul
            ref={ref}
            {...(tabIndex !== undefined ? { tabIndex: props.tabIndex } : {})}
            className="search-control-info-list"
            onKeyDown={arrowKeyHandler}
        >
            {list.map((item, i) => (
                <SearchInfoListItem
                    value={i}
                    candidate={cand}
                    key={`${item.name}-${i}`}
                    className={`search-control-info-list-item${i === activeIndex || item.checked ? " active" : ""}${
                        cand === i ? " candidate" : ""
                    }`}
                    onClick={() => {
                        setCand(i);
                        handler(item, list, i);
                    }}
                    onKeyDown={arrowKeyHandler}
                >
                    {item.name}
                </SearchInfoListItem>
            ))}
        </ul>
    ) : (
        <span className="search-control-info-span">{list}</span>
    );
};

SearchInfoListCore.displayName = "SearchInfoList";

const SearchInfoList = React.forwardRef(SearchInfoListCore);

export { SearchInfoList };
