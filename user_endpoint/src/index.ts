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
import { handleOptions } from '../../shared/cors_handler';
import { generate_token } from '../../shared/auth';
import jwt from '@tsndr/cloudflare-worker-jwt'

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



export default {
	async fetch(
		request: Request,
		env: any,
		ctx: ExecutionContext
	): Promise<Response> {
		let secret = env.jwt;

		let headers = handleOptions(request);
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: headers,
			})
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
				return new Response(JSON.stringify(error), { headers: headers });
			}
			if (action[1] == 'login') {
				console.log(userid);
				const [user] = await sql`select * from usertable where userid = ${userid}`
				if (user == null) {
					const [response] = await sql(create_user, [userid, userid, userimg, username, ipaddress]);
					headers['Authorization'] = generate_token(jwt, userid, secret)
				} else {
					const [response] = await sql(append_ip), [userid, ipaddress]);
					headers['Authorization'] = generate_token(jwt, userid, secret)

				}


			}
			if (action[1] == 'create') {

			}
			if (action[1] == 'delete') {

			}
			console.log(headers)
			return new Response(JSON.stringify("Hello"), { headers: headers });

		}
	},
};
