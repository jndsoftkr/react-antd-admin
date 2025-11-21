import type { InitOptions } from "i18next";

import enUS from "antd/locale/en_US";
import koKR from "antd/locale/ko_KR";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { getEnUsLang, getZhKoLang } from "./helper";

export * from "./t";

export type LanguageType = "zh-KO" | "en-US";

export const ANT_DESIGN_LOCALE = {
	"zh-KO": koKR,
	"en-US": enUS,
};

export const i18nResources = {
	"zh-KO": {
		translation: getZhKoLang(),
	},
	"en-US": {
		translation: getEnUsLang(),
	},
};

export const i18nInitOptions: InitOptions = {
	lng: "zh-KO",
	resources: i18nResources,
	saveMissing: import.meta.env.DEV,
	missingKeyHandler: async (languages, namespace, translationKey) => {
		if (import.meta.env.PROD) {
			return;
		}
		const currentLanguage = i18next.language;
		if (!["404"].includes(translationKey) && import.meta.env.DEV) {
			/**
			 * @see https://www.i18next.com/overview/api#missingkeyhandler
			 * 메시지 형식 참조: https://github.com/intlify/vue-i18n/blob/v11.1.2/packages/shared/src/warn.ts
			 */
			console.warn(`[i18n] Not found '${translationKey}' key in '${currentLanguage}' locale messages.`);
		}
	},
};

export const i18n = i18next.use(initReactI18next);

export function setupI18n() {
	i18n.init(i18nInitOptions);
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
	 */
	i18next.on("languageChanged", (lng) => {
		document.documentElement.lang = lng;
	});
}
