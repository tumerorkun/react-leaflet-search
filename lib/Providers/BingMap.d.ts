import { Provider, ProviderOptions } from "./Provider";
export interface BingMapResponse {
    resourceSets: Array<{
        resources: Array<{
            bbox: string[];
            point: {
                coordinates: string[];
            };
            name: string;
        }>;
        estimatedTotal: number;
    }>;
}
declare class BingMap implements Provider<BingMapResponse> {
    key?: string | null;
    url: string;
    constructor(options?: ProviderOptions);
    search(query: string): Promise<{
        info: string;
        raw: BingMapResponse;
    } | {
        error: string;
    }>;
    formatResponse(response: BingMapResponse): {
        info: string;
        raw: BingMapResponse;
    } | {
        error: string;
    };
}
export { BingMap };
