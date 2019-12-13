import React from "react";
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
declare const SearchInput: React.ForwardRefExoticComponent<SearchInputProps & React.RefAttributes<HTMLInputElement>>;
declare function SearchInputWrapper(): JSX.Element;
export { SearchInputWrapper, SearchInput };
