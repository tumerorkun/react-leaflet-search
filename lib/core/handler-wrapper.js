function asyncInputEvent(asyncHandler, syncHandler, debounceTime = 400) {
    let t;
    return (e) => {
        e.persist();
        syncHandler && syncHandler(e);
        clearTimeout(t);
        t = window.setTimeout(() => {
            asyncHandler(e);
        }, debounceTime);
    };
}
export { asyncInputEvent };
