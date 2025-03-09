import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import type { RenderToPipeableStreamOptions } from "react-dom/server";

export const streamTimeout = 5_000;

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
	_loadContext: AppLoadContext
	// If you have middleware enabled:
	// loadContext: unstable_RouterContextProvider
) {
	return new Promise(async (resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");

		if ("renderToReadableStream" in await import("react-dom/server")) {
			const { renderToReadableStream } = await import("react-dom/server")

			const stream = await renderToReadableStream(
				<ServerRouter context={routerContext} url={request.url} />,
				{
					onError(error) {
						responseStatusCode = 500

						if (shellRendered) {
							console.error(error)
						}
					},
				},

			)

			shellRendered = true

			responseHeaders.set("Content-Type", "text/html")

			return new Response(stream, {
				headers: responseHeaders,
				status: responseStatusCode,
			})
		}

		const { PassThrough } = await import("node:stream")
		const { renderToPipeableStream } = await import("react-dom/server")
		const { createReadableStreamFromReadable } = await import("@react-router/node")

		// Ensure requests from bots and SPA Mode renders wait for all content to load before responding
		// https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
		let readyOption: keyof RenderToPipeableStreamOptions =
			(userAgent && isbot(userAgent)) || routerContext.isSpaMode
				? "onAllReady"
				: "onShellReady";

		const { pipe, abort } = renderToPipeableStream(
			<ServerRouter context={routerContext} url={request.url} />,
			{
				[readyOption]() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						})
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			}
		);

		// Abort the rendering stream after the `streamTimeout` so it has time to
		// flush down the rejected boundaries
		setTimeout(abort, streamTimeout + 1000);
	});
}
