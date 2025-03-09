import { Link } from "react-router"

export default function Index() {
	return (
		<div>
			<p>Hello world!</p>
			<div>
				<Link to="/named-error">Cause a named error!</Link>
			</div>
			<div>
				<Link to="/anonymous-error">Cause an anonymous error!</Link>
			</div>
		</div>
	)
}
