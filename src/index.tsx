import { TanstackQuery } from "#src/components/tanstack-query";
import { setupI18n } from "#src/locales";
import { setupLoading } from "#src/plugins/loading";

// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";
import "./styles/index.css";

async function setupApp() {
	/**
	 * @zh 国际化 초기화, 반드시 첫 번째에 위치해야 함, loading에서 국제화를 참조함
	 * @en Initialize internationalization, must be placed first. Loading refer to internationalization
	 */
	setupI18n();

	// App Loading
	setupLoading();

	const rootElement = document.getElementById("root");
	if (!rootElement)
		return;
	const root = createRoot(
		rootElement,
	);

	root.render(
		// <StrictMode>
		<TanstackQuery>
			<App />
		</TanstackQuery>,
		// </StrictMode>,
	);
}

setupApp();
