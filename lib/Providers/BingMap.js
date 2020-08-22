var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BingMap {
    constructor(options) {
        var _a;
        this.key = options === null || options === void 0 ? void 0 : options.providerKey;
        //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
        // We convert them into a string of 'x1,y1,x2,y2'
        let boundsUrlComponent = "";
        if ((_a = options === null || options === void 0 ? void 0 : options.searchBounds) === null || _a === void 0 ? void 0 : _a.length) {
            const bounds = options.searchBounds.reduce((acc, b) => [...acc, b.lat, b.lng], []);
            boundsUrlComponent = `&umv=${bounds.join(",")}`;
        }
        this.url = `https://dev.virtualearth.net/REST/v1/Locations?output=json${boundsUrlComponent}&key=${this.key}&q=`;
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.key === "undefined") {
                return { error: "BingMap requires an api key" };
            }
            // console.log(this.url + query)
            const response = yield fetch(this.url + query).then((res) => res.json());
            return this.formatResponse(response);
        });
    }
    formatResponse(response) {
        const resources = response.resourceSets[0].resources;
        const count = response.resourceSets[0].estimatedTotal;
        const info = count > 0
            ? resources.map((e) => ({
                bounds: e.bbox.map((bound) => Number(bound)),
                latitude: Number(e.point.coordinates[0]),
                longitude: Number(e.point.coordinates[1]),
                name: e.name
            }))
            : "Not Found";
        return {
            info: info,
            raw: response
        };
    }
}
export { BingMap };
