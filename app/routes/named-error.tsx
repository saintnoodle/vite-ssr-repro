import { data } from "react-router"

export function loader() {
	/**
	 * This function throws so our data is never returned. However, because it has a name, 
	 * ssrRewriteStacktrace successeds as the first match in the regexp is "namedError".
	 */
	const namedError = () => {
		throw new Error("Named Error")
	}

	const willThrow = namedError()

	return data({
		willThrow
	})
}

export default function NamedErrorPage() {
	return "Unreachable"
}
