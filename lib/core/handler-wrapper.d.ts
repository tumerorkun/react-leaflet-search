import { BaseSyntheticEvent } from "react";
declare function asyncInputEvent<T extends BaseSyntheticEvent>(asyncHandler: (e: T) => any, syncHandler: (e: T) => any, debounceTime?: number): (e: T) => any;
export { asyncInputEvent };
