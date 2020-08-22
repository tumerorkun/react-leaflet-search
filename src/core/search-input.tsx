import React, { BaseSyntheticEvent } from "react";
import { asyncInputEvent } from "./handler-wrapper";

interface SearchInputProps {
    placeholder?: string;
    initialValue?: string;
    type?: string;
    className?: string;
    debounceTime?: number;
    tabIndex?: number;
    getInputValueSetter?: (fn: (v: string) => any) => any;
    onClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => any;
    onDoubleClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => any;
    onMouseDown?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => any;
    onMouseEnter?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => any;
    onMouseLeave?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => any;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => any;
    onChangeAsync?: (e: React.FormEvent<HTMLInputElement>) => any;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => any;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => any;
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => any;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => any;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => any;
    onSubmit?: (e: React.FormEvent<HTMLInputElement>) => any;
}

const SearchInputCore = (
    {
        placeholder = "PlaceHolder",
        type = "text",
        initialValue = "",
        className = "",
        debounceTime = 400,
        getInputValueSetter = () => {},
        onClick = () => {},
        onDoubleClick = () => {},
        onMouseDown = () => {},
        onMouseEnter = () => {},
        onMouseLeave = () => {},
        onChange = () => {},
        onChangeAsync = () => {},
        onFocus = () => {},
        onBlur = () => {},
        onKeyUp = () => {},
        onKeyDown = () => {},
        onKeyPress = () => {},
        onSubmit = () => {},
        tabIndex = 0
    }: SearchInputProps,
    ref: React.Ref<HTMLInputElement>
) => {
    const [value, setValue] = React.useState(initialValue);
    const handlerDefaults = React.useCallback((e, cb) => {
        // e.preventDefault();
        // e.stopPropagation();
        cb(e);
    }, []);
    const inputHandlers = React.useCallback(
        asyncInputEvent<BaseSyntheticEvent<Event, HTMLInputElement, HTMLInputElement>>(
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                onChangeAsync(e);
            },
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                setValue(e.target.value);
                onChange(e);
            },
            debounceTime
        ),
        [setValue]
    );
    React.useLayoutEffect(() => {
        getInputValueSetter(setValue);
    }, [setValue, getInputValueSetter]);
    return (
        <input
            tabIndex={tabIndex}
            ref={ref}
            type={type}
            name="SearchInput"
            value={value}
            placeholder={placeholder}
            className={`search-input${className ? ` ${className}` : ""}`}
            onClick={(e) => handlerDefaults(e, onClick)}
            onDoubleClick={(e) => handlerDefaults(e, onDoubleClick)}
            onMouseEnter={(e) => handlerDefaults(e, onMouseEnter)}
            onMouseLeave={(e) => handlerDefaults(e, onMouseLeave)}
            onMouseDown={(e) => handlerDefaults(e, onMouseDown)}
            onChange={inputHandlers} // works exactly as onInput because of reacts implementation
            onFocus={(e) => handlerDefaults(e, onFocus)}
            onBlur={(e) => handlerDefaults(e, onBlur)}
            onKeyUp={(e) => handlerDefaults(e, onKeyUp)}
            onKeyDown={(e) => handlerDefaults(e, onKeyDown)}
            onKeyPress={(e) => handlerDefaults(e, onKeyPress)}
            onSubmit={(e) => handlerDefaults(e, onSubmit)}
        />
    );
};

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(SearchInputCore);

function SearchInputWrapper() {
    const [state /*setState*/] = React.useState("hebele");
    const inputValueSetter = React.useRef<(v: string) => any>(() => {});
    setTimeout(() => {
        // setState('deneme');
        inputValueSetter.current("deneme");
    }, 5000);
    return (
        <SearchInput
            initialValue={state}
            getInputValueSetter={(fn) => (inputValueSetter.current = fn)}
            onClick={(e) => {
                // console.log("[CLICK]", "input clicked");
            }}
            onDoubleClick={(e) => {
                // console.log("[DOUBLECLICK]", "input double clicked");
            }}
        />
    );
}

export { SearchInputWrapper, SearchInput };
