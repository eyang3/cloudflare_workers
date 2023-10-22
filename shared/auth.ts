import { markAsUntransferable } from "worker_threads";
import { AuthObject } from "./types";
export function generate_token(jwt: any, userid: string, secret: string) {
    return jwt.sign({ userid: userid, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, secret);
}

export function read_token(jwt: any, token: string | null, secret: string): AuthObject {
    // TODO: eventually add in a check for expiration date
    let ao: AuthObject = {
        newToken: null,
        userid: null,
        error: false
    };
    try {
        var decoded = jwt.verify(token, secret);
        ao.userid = decoded['userid'];
        ao.error = false;
        ao.expiration = decoded['exp'];
        ao.newToken = null;
    } catch (e) {
        ao.error = true
    }
    return ao;
}