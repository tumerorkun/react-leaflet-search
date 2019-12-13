import React from "react";
function SearchCloseButton({ className = "", onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
} }) {
    return (React.createElement("button", { className: `search-control-close-button${className ? ` ${className}` : ""}`, onClick: onClick },
        React.createElement("svg", { viewBox: "0 0 50 50" },
            React.createElement("path", { d: "M5 5 L45 45 M45 5 L5 45" }),
            "Sorry, your browser does not support inline SVG.")));
}
export { SearchCloseButton };
