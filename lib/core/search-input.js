import React from "react";
import { asyncInputEvent } from "./handler-wrapper";
const SearchInputCore = ({ placeholder = "PlaceHolder", type = "text", initialValue = "", className = "", debounceTime = 400, getInputValueSetter = () => { }, onClick = () => { }, onDoubleClick = () => { }, onMouseDown = () => { }, onMouseEnter = () => { }, onMouseLeave = () => { }, onChange = () => { }, onChangeAsync = () => { }, onFocus = () => { }, onBlur = () => { }, onKeyUp = () => { }, onKeyDown = () => { }, onKeyPress = () => { }, onSubmit = () => { }, tabIndex = 0 }, ref) => {
    const [value, setValue] = React.useState(initialValue);
    const handlerDefaults = React.useCallback((e, cb) => {
        // e.preventDefault();
        // e.stopPropagation();
        cb(e);
    }, []);
    const inputHandlers = React.useCallback(asyncInputEvent((e) => {
        e.preventDefault();
        e.stopPropagation();
        onChangeAsync(e);
    }, (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValue(e.target.value);
        onChange(e);
    }, debounceTime), [setValue]);
    React.useLayoutEffect(() => {
        getInputValueSetter(setValue);
    }, [setValue, getInputValueSetter]);
    return (React.createElement("input", { tabIndex: tabIndex, ref: ref, type: type, name: "SearchInput", value: value, placeholder: placeholder, className: `search-input${className ? ` ${className}` : ""}`, onClick: (e) => handlerDefaults(e, onClick), onDoubleClick: (e) => handlerDefaults(e, onDoubleClick), onMouseEnter: (e) => handlerDefaults(e, onMouseEnter), onMouseLeave: (e) => handlerDefaults(e, onMouseLeave), onMouseDown: (e) => handlerDefaults(e, onMouseDown), onChange: inputHandlers, onFocus: (e) => handlerDefaults(e, onFocus), onBlur: (e) => handlerDefaults(e, onBlur), onKeyUp: (e) => handlerDefaults(e, onKeyUp), onKeyDown: (e) => handlerDefaults(e, onKeyDown), onKeyPress: (e) => handlerDefaults(e, onKeyPress), onSubmit: (e) => handlerDefaults(e, onSubmit) }));
};
const SearchInput = React.forwardRef(SearchInputCore);
function SearchInputWrapper() {
    const [state /*setState*/] = React.useState("hebele");
    const inputValueSetter = React.useRef(() => { });
    setTimeout(() => {
        // setState('deneme');
        inputValueSetter.current("deneme");
    }, 5000);
    return (React.createElement(SearchInput, { initialValue: state, getInputValueSetter: (fn) => (inputValueSetter.current = fn), onClick: (e) => {
            // console.log("[CLICK]", "input clicked");
        }, onDoubleClick: (e) => {
            // console.log("[DOUBLECLICK]", "input double clicked");
        } }));
}
export { SearchInputWrapper, SearchInput };
