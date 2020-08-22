import { BaseSyntheticEvent } from "react";

function asyncInputEvent<T extends BaseSyntheticEvent>(
    asyncHandler: (e: T) => any,
    syncHandler: (e: T) => any,
    debounceTime: number = 400
): (e: T) => any {
    let t: number;
    return (e: T) => {
        e.persist();
        syncHandler && syncHandler(e);
        clearTimeout(t);
        t = window.setTimeout(() => {
            asyncHandler(e);
        }, debounceTime);
    };
}

export { asyncInputEvent };
