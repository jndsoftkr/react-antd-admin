// import type { TFunction } from "i18next";

export const getLanguageItems: () => any = (
	// t: TFunction<"translation", undefined>,
) => {
	return [
		{
			label: "한국어",
			// Menu
			key: "zh-KO",
			// Select
			value: "zh-KO",
		},
		{
			label: "English",
			// Menu
			key: "en-US",
			// Select
			value: "en-US",
		},
	];
};
