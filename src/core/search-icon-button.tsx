import React from "react";

interface SearchIconButtonProps {
    className?: string;
    onClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => any;
    onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}

function SearchIconButton({ className = "", onClick = () => {}, onMouseEnter = () => {}, onMouseLeave = () => {} }: SearchIconButtonProps) {
    return (
        <button
            className={`${className ? className : ""}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <svg viewBox="0 0 50 50">
                <line x1="35" y1="35" x2="46" y2="46" />
                <circle cx="23" cy="23" r="16" fill="none" />
                Sorry, your browser does not support inline SVG.
            </svg>
        </button>
    );
}

export { SearchIconButton };
