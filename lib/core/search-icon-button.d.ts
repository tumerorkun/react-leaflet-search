import React from "react";
interface SearchIconButtonProps {
    className?: string;
    onClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => any;
    onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}
declare function SearchIconButton({ className, onClick, onMouseEnter, onMouseLeave }: SearchIconButtonProps): JSX.Element;
export { SearchIconButton };
