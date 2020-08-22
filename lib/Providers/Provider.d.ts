import { LatLng } from "leaflet";
interface ProviderOptions {
    providerKey?: string | null;
    searchBounds?: [LatLng, LatLng];
    region?: string;
}
interface Provider<ResponseType> {
    url: string;
    search(query: string): Promise<{
        info: string;
        raw: ResponseType;
    } | {
        error: string;
    }>;
    formatResponse(response: ResponseType): {
        info: string;
        raw: ResponseType;
    } | {
        error: string;
    };
}
export type { Provider, ProviderOptions };
