import React from "react";

interface SearchCloseButtonProps {
    className?: string;
    onClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => any;
}

function SearchCloseButton({
    className = "",
    onClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }
}: SearchCloseButtonProps) {
    return (
        <button className={`search-control-close-button${className ? ` ${className}` : ""}`} onClick={onClick}>
            <svg viewBox="0 0 50 50">
                <path d="M5 5 L45 45 M45 5 L5 45" />
                Sorry, your browser does not support inline SVG.
            </svg>
        </button>
    );
}

export { SearchCloseButton };
