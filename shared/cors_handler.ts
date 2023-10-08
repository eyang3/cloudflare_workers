const corsHeaders = {
    "Access-Control-Allow-Origin": "https://test-cloudflare-pages-bf7.pages.dev",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
}

export function handleOptions(request: Request) {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    let headers = request.headers

    let respHeaders = {
        ...corsHeaders,
        // Allow all future content Request headers to go back to browser
        // such as Authorization (Bearer) or X-Client-Name-Version
        "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
    }
    return respHeaders;
}