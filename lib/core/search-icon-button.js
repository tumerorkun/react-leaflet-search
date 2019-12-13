import React from "react";
function SearchIconButton({ className = "", onClick = () => { }, onMouseEnter = () => { }, onMouseLeave = () => { } }) {
    return (React.createElement("button", { className: `${className ? className : ""}`, onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
        React.createElement("svg", { viewBox: "0 0 50 50" },
            React.createElement("line", { x1: "35", y1: "35", x2: "46", y2: "46" }),
            React.createElement("circle", { cx: "23", cy: "23", r: "16", fill: "none" }),
            "Sorry, your browser does not support inline SVG.")));
}
export { SearchIconButton };
