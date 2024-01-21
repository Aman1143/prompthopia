import Nav from '@components/Nav';
import Provider from '@components/Provider';
import '@styles/globals.css';

export const metadata = {
	tile: "Promptopia",
	description: "Discover & Share AI Prompts"
}

const RootLayout = ({ children }) => {
	return (
		<html lang='en'>
			<body>
				<Provider>
					<div className="main">
						<div className="gradient" />
					</div>
					<main className="app">
						<Nav />
						{children}
					</main>
				</Provider>
				<script src="https://kit.fontawesome.com/c538c9717e.js" crossOrigin="anonymous"></script>
			</body>
		</html>

	)
}

export default RootLayout;