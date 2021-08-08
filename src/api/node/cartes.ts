import { NodeApi } from "api";
import { callApi, CallApiResult } from "api/node/call";
import { CarteSet } from "api/node/api-types";

export function* getCartes(nodeName: string | null, auth: true | string = true): CallApiResult<CarteSet> {
    return yield* callApi({
        nodeName, location: "/cartes", auth, schema: NodeApi.CarteSet, errorFilter: ["node-name-not-set"]
    });
}
