import { data } from "react-router"
import type { Route } from "./+types/anonymous-error"

export function loader() {

	/** 
	 * An anonymous function which throws an error 
	 * 
	 * In Bun, when the stacktrace is handed to `ssrRewriteStacktrace` to be process,
	 * this line causes the first optional match group to be undefined.
	 * In Node, this group will probably find "eval".
	 * 
	 * The case where the stacktrace starts with `"    at C:/..."` and the match group is undefined is not handled,
	 * and `ssrRewriteStacktrace` fails.
	*/
	(function () {
		throw new Error("Anonymous Error")
	})()

	return data({
		data: "Hello world!"
	})
}

export default function ErrorPage({ loaderData }: Route.ComponentProps) {
	/** 
	 * This data doesn't exist because the error in the loader
	 * During development, it's hard to debug this error because the function that writes the
	 * stacktrace to be shown to the client fails meaning we don't actually see the error in the loader.
	 * 
	 * This makes debugging an app when running vite in a Bun envrionment frustrating.
	 */
	return loaderData.data
}

