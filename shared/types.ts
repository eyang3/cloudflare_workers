export type JsonResponse = {
    response: string;
    message: string | null;
    payload?: any;
}

export type AuthObject = {
    newToken: string | null;
    userid: string | null;
    expiration?: any;
    error: boolean;
}

