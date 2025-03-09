import { Outlet, Scripts, isRouteErrorResponse } from "react-router"
import { getReasonPhrase } from "http-status-codes"

import type { Route } from "./+types/root"

export default function App() {
	return <Outlet />
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta content="width=device-width, initial-scale=1" name="viewport" />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!"
	let details = "An unexpected error occurred."
	let stack

	if (isRouteErrorResponse(error)) {
		message = String(error.status)
		details = getReasonPhrase(error.status)
	} else if (process.env.NODE_ENV === "development" && error instanceof Error) {
		message = error.name
		details = error.message
		stack = error.stack
	}

	return (
		<div>
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre>
					<code>{stack}</code>
				</pre>
			)}
		</div>
	)
}
