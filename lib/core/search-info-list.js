import React from "react";
const SearchInfoListItem = ({ value, className, candidate, onClick, onKeyDown, children, }) => {
    const r = React.useRef(null);
    React.useEffect(() => {
        if (value === candidate && r.current && r.current.offsetParent) {
            r.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [candidate, value]);
    return (React.createElement("li", { ref: r, value: value, className: className, onClick: onClick, onKeyDown: onKeyDown }, children));
};
const SearchInfoListCore = (props, ref) => {
    const { handler, list, tabIndex, activeIndex } = props;
    const [cand, setCand] = React.useState(0);
    const arrowKeyHandler = React.useCallback((e) => {
        if (Array.isArray(list)) {
            e.stopPropagation();
            e.keyCode !== 9 && e.preventDefault(); // don't prevent tab
            const length = list.length;
            // Enter 13, Spacebar 32
            if ((!(length <= cand || cand < 0) && e.keyCode === 13) || e.keyCode === 32) {
                handler(list[cand], list, cand);
            }
            else {
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
    }, [setCand, cand, list, handler]);
    React.useLayoutEffect(() => setCand(0), [list]);
    return Array.isArray(list) ? (React.createElement("ul", Object.assign({ ref: ref }, (tabIndex !== undefined ? { tabIndex: props.tabIndex } : {}), { className: "search-control-info-list", onKeyDown: arrowKeyHandler }), list.map((item, i) => (React.createElement(SearchInfoListItem, { value: i, candidate: cand, key: `${item.name}-${i}`, className: `search-control-info-list-item${i === activeIndex || item.checked ? " active" : ""}${cand === i ? " candidate" : ""}`, onClick: () => {
            setCand(i);
            handler(item, list, i);
        }, onKeyDown: arrowKeyHandler }, item.name))))) : (React.createElement("span", { className: "search-control-info-span" }, list));
};
SearchInfoListCore.displayName = "SearchInfoList";
const SearchInfoList = React.forwardRef(SearchInfoListCore);
export { SearchInfoList };
