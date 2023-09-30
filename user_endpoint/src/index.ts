/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { ErrorWithDiff } from "vitest";
import { neon } from '@neondatabase/serverless';
import { JsonResponse } from '../../shared/types';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}
const corsHeaders = {
	"Access-Control-Allow-Origin": "*.test-cloudflare-pages-bf7.pages.dev",
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Max-Age": "86400",
}

let create_user = `
	INSERT INTO usertable(userid, userimg, username, ipaddresses)
	SELECT 
		$2, $3, $4, ARRAY[cast($5 as inet)]
	WHERE
		NOT EXISTS (
			SELECT userid from usertable where userid = $1
		);
`

let append_ip = `
			UPDATE usertable
			SET ipaddress = ipaddress | ARRAY[$2]
			WHERE userid = $1

`;

function handleOptions(request: Request) {
	// Make sure the necessary headers are present
	// for this to be a valid pre-flight request
	let headers = request.headers
	if (
		headers.get("Origin") !== null &&
		headers.get("Access-Control-Request-Method") !== null &&
		headers.get("Access-Control-Request-Headers") !== null
	) {
		// Handle CORS pre-flight request.
		// If you want to check or reject the requested method + headers
		// you can do that here.
		let respHeaders = {
			...corsHeaders,
			// Allow all future content Request headers to go back to browser
			// such as Authorization (Bearer) or X-Client-Name-Version
			"Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
		}
		return new Response(null, {
			headers: respHeaders,
		})
	}
	else {
		// Handle standard OPTIONS request.
		// If you want to allow other HTTP Methods, you can do that here.
		return new Response(null, {
			headers: {
				Allow: "GET, HEAD, POST, OPTIONS",
			},
		})
	}
}

export default {
	async fetch(
		request: Request,
		env: any,
		ctx: ExecutionContext
	): Promise<Response> {
		let response
		if (request.method === "OPTIONS") {
			response = handleOptions(request)
		} else {
			let error: JsonResponse = { response: "Error", message: null };
			let success: JsonResponse = { response: "Success", message: null };
			const sql = neon(env.db);

			let payload = await request.json()
			let ipaddress = request.headers.get("CF-Connecting-IP");
			let userid = payload["userid"];
			let username = payload["username"]
			let userimg = payload["userimg"]


			let action = request.url.split('?')[1].split('=')
			if (action[0] != 'action') {
				error["message"] = "Invalid Action";
				return new Response(JSON.stringify(error));
			}
			if (action[1] == 'login') {
				// const [post] = await sql`select * from usertable where userid = ${userid}`;
				console.log(userid);
				const [user] = await sql`select * from usertable where userid = ${userid}`
				if (user == null) {
					console.log(userid);
					console.log(userimg.length);
					console.log(username);
					const [response] = await sql(create_user, [userid, userid, userimg, username, ipaddress])
				}

			}
			if (action[1] == 'create') {

			}
			if (action[1] == 'delete') {

			}
			return new Response(JSON.stringify("Hello"));

		}
	},
};
