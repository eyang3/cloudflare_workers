
export function generate_token(jwt: any, userid: string, secret: string) {
    return jwt.sign({ userid: userid, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, secret);
}