import type { LanguageType } from "#src/locales";
import type { PreferencesState, ThemeType } from "./types";

import { SIDE_NAVIGATION } from "#src/layout/widgets/preferences/blocks/layout/constants";
import { getAppNamespace } from "#src/utils/get-app-namespace";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 기본 환경 설정
 */
export const DEFAULT_PREFERENCES = {
	/* ================== General ================== */
	watermark: false,
	watermarkContent: "react-antd-admin",
	enableBackTopButton: true,
	pageLayout: "layout-right",
	enableBackendAccess: true,
	enableFrontendAceess: false,
	language: "zh-KO",
	enableDynamicTitle: true,
	enableCheckUpdates: true,
	checkUpdatesInterval: 1,

	/* ================== Theme ================== */
	theme: "auto",
	colorBlindMode: false,
	colorGrayMode: false,
	themeRadius: 6,
	builtinTheme: "blue",
	themeColorPrimary: "#1677ff",

	/* ================== Animation ================== */
	transitionProgress: true,
	transitionLoading: true,
	transitionEnable: true,
	transitionName: "fade-slide",

	/* ================== Layout ================== */
	navigationStyle: SIDE_NAVIGATION,

	/* ================== Tabbar ================== */
	tabbarEnable: true,
	tabbarShowIcon: true,
	tabbarPersist: true,
	tabbarDraggable: true,
	tabbarStyleType: "chrome",
	tabbarShowMore: true,
	tabbarShowMaximize: true,

	/* ================== Sidebar ================== */
	sidebarEnable: true,
	sidebarWidth: 210,
	sideCollapsedWidth: 56,
	sidebarCollapsed: false,
	sidebarCollapseShowTitle: true,
	sidebarExtraCollapsedWidth: 48,
	firstColumnWidthInTwoColumnNavigation: 80,
	sidebarTheme: "light",
	accordion: true,

	/* ================== Footer ================== */
	enableFooter: true,
	fixedFooter: true,
	companyName: "Condor Hero",
	companyWebsite: "http://github.com/condorheroblog/",
	copyrightDate: "2023",
	ICPNumber: "",
	ICPLink: "",
} satisfies PreferencesState;

/**
 * 환경 설정 작업 인터페이스
 */
interface PreferencesAction {
	reset: () => void
	changeSiteTheme: (theme: ThemeType) => void
	changeLanguage: (language: LanguageType) => void
	setPreferences: {
		// 단일 key-value 업데이트
		<T>(key: string, value: T): void
		// 객체 형식 일괄 업데이트
		<T extends Partial<PreferencesState>>(preferences: T): void
	}
}

/**
 * 환경 설정 상태 관리
 */
export const usePreferencesStore = create<
	PreferencesState & PreferencesAction
>()(
	persist(
		set => ({
			...DEFAULT_PREFERENCES,

			/**
			 * 환경 설정 업데이트
			 */
			setPreferences: (...args: any[]) => {
				if (args.length === 1) {
					const preferences = args[0];
					set(() => {
						return { ...preferences };
					});
				}
				else if (args.length === 2) {
					const [key, value] = args;
					set(() => {
						return { [key]: value };
					});
				}
			},

			/**
			 * 테마 업데이트
			 */
			changeSiteTheme: (theme) => {
				set(() => {
					return { theme };
				});
			},

			/**
			 * 언어 업데이트
			 */
			changeLanguage: (language) => {
				set(() => {
					return { language };
				});
			},

			/**
			 * 상태 재설정
			 */
			reset: () => {
				set(() => {
					return { ...DEFAULT_PREFERENCES };
				});
			},
		}),
		{
			name: getAppNamespace("preferences"),
			// 기존 zh-CN 설정을 zh-KO로 마이그레이션
			onRehydrateStorage: () => (state) => {
				if (state && state.language === "zh-KO") {
					state.language = "zh-KO";
				}
			},
		},
	),
);
