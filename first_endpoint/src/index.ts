/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { connect } from "@planetscale/database";
import { privateEncrypt } from "crypto";
import { env } from "process";

export interface Env {
	host: string;
	ps_username: string;
	ps_password: string;

}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log(env);
		const config = {
			host: env.host,
			username: env.ps_username,
			password: env.ps_password
		};
		const conn = await connect(config);
		const results = await conn.execute('SELECT * FROM test');
		return new Response(JSON.stringify(results['rows']));
	},
};
