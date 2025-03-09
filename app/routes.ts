import { index, route, type RouteConfig, } from "@react-router/dev/routes"

export default [
	index("routes/index.tsx"),
	route("anonymous-error", "routes/anonymous-error.tsx"),
	route("named-error", "routes/named-error.tsx")
] satisfies RouteConfig
