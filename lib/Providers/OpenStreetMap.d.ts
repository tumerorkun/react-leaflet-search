import { Provider, ProviderOptions } from "./Provider";
export declare type OpenStreetMapResponse = Array<{
    boundingbox: string[];
    lat: number;
    lon: number;
    display_name: string;
}>;
declare class OpenStreetMap implements Provider<OpenStreetMapResponse> {
    url: string;
    constructor(options?: ProviderOptions);
    search(query: string): Promise<{
        info: string;
        raw: OpenStreetMapResponse;
    } | {
        error: string;
    }>;
    formatResponse(response: OpenStreetMapResponse): {
        info: string;
        raw: OpenStreetMapResponse;
    } | {
        error: string;
    };
}
export { OpenStreetMap };
