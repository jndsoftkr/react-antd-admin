import type {
	MIXED_NAVIGATION,
	SIDE_NAVIGATION,
	TOP_NAVIGATION,
	TWO_COLUMN_NAVIGATION,
} from "#src/layout/widgets/preferences/blocks/layout/constants";

import type { LanguageType } from "#src/locales";
import type { MenuProps } from "antd";

/**
 * @zh 로그인 페이지 레이아웃
 * @en Login page layout
 */
export type PageLayoutType = "layout-left" | "layout-center" | "layout-right";
/**
 * @zh 탭바 스타일
 * @en Tabbar style
 */
export type TabsStyleType = "brisk" | "card" | "chrome" | "plain";

/**
 * @zh 테마 유형
 * @en Theme type
 */
export type ThemeType = "dark" | "light" | "auto";

/**
 * @zh 애니메이션 유형
 * @en Animation type
 */
interface AnimationState {
	/**
	 * @zh 전환 애니메이션 활성화 여부
	 * @en Whether to enable transition animation
	 * @default true
	 */
	transitionProgress: boolean
	/**
	 * @zh 로딩 애니메이션 활성화 여부
	 * @en Whether to enable loading animation
	 * @default true
	 */
	transitionLoading: boolean
	/**
	 * @zh 애니메이션 활성화 여부
	 * @en Whether to enable animation
	 * @default true
	 */
	transitionEnable: boolean
	/**
	 * @zh 전환 애니메이션 이름
	 * @en Transition animation name
	 * @default "fade-slide"
	 */
	transitionName: string
}

export type NavigationType = typeof SIDE_NAVIGATION | typeof TOP_NAVIGATION | typeof TWO_COLUMN_NAVIGATION | typeof MIXED_NAVIGATION;
export type BuiltinThemeType = "red" | "volcano" | "orange" | "gold" | "yellow" | "lime" | "green" | "cyan" | "blue" | "geekblue" | "purple" | "magenta" | "gray" | "custom";

interface LayoutState {
	navigationStyle: NavigationType
}

export interface GeneralState {
	/**
	 * @zh 워터마크 활성화 여부
	 * @en Whether to enable watermark
	 * @default false
	 */
	watermark: boolean
	/**
	 * @zh 워터마크 내용
	 * @en Watermark content
	 * @default ""
	 */
	watermarkContent: string
	/**
	 * @zh 페이지 상단으로 돌아가기 버튼
	 * @en BackTop makes it easy to go back to the top of the page.
	 * @default true
	 */
	enableBackTopButton: boolean
	/**
	 * @zh 로그인 페이지 레이아웃 설정
	 * @en Login page layout configuration
	 * @default "layout-right"
	 */
	pageLayout: PageLayoutType
	/**
	 * @zh 프론트엔드 라우트 권한 활성화
	 * @en Enable frontend route permissions
	 * @default false
	 */
	enableFrontendAceess: boolean
	/**
	 * @zh 백엔드 라우트 권한 활성화
	 * @en Enable backend route permissions
	 * @default true
	 */
	enableBackendAccess: boolean

	/**
	 * @zh 현재 언어
	 * @en Current language
	 * @default "zh-KO"
	 */
	language: LanguageType
	/**
	 * @zh 동적 제목 활성화 여부
	 * @en Whether to enable dynamic title
	 * @default true
	 */
	enableDynamicTitle: boolean
	/**
	 * @zh 업데이트 확인 활성화 여부
	 * @en Whether to enable update check
	 * @default true
	 */
	enableCheckUpdates: boolean
	/**
	 * @zh 폴링 시간, 단위: 분, 기본값 1분
	 * @en Polling time, unit: minute, default 1 minute
	 * @default 1
	 */
	checkUpdatesInterval: number
}

export interface SidebarState {
	/**
	 * 사이드바 표시 여부
	 * @default true
	 */
	sidebarEnable?: boolean
	/**
	 * 사이드 메뉴 너비
	 * @default 210
	 */
	sidebarWidth: number
	/**
	 * 사이드 메뉴 접힌 너비
	 * @default 56
	 */
	sideCollapsedWidth: number
	/**
	 * 사이드 메뉴 접힌 상태
	 * @default false
	 */
	sidebarCollapsed: boolean
	/**
	 * 사이드 메뉴가 접혔을 때 title 표시 여부
	 * @default true
	 */
	sidebarCollapseShowTitle: boolean
	/**
	 * 사이드 메뉴 접힌 추가 너비
	 * @default 48
	 */
	sidebarExtraCollapsedWidth: number
	/**
	 * 2열 레이아웃일 때 왼쪽 메뉴 너비
	 * @default 80
	 */
	firstColumnWidthInTwoColumnNavigation: number
	/**
	 * 사이드바 테마
	 * @default dark
	 */
	sidebarTheme: MenuProps["theme"]
	/**
	 * @zh 네비게이션 메뉴 아코디언 모드
	 * @en Accordion mode of navigation menu
	 */
	accordion: boolean
}

export interface FooterState {
	enableFooter: boolean
	fixedFooter: boolean
	companyName: string
	companyWebsite: string
	copyrightDate: string
	ICPNumber: string
	ICPLink: string
}

export interface PreferencesState
	extends AnimationState,
	LayoutState,
	GeneralState,
	SidebarState,
	FooterState {
	/* ================== Theme ================== */
	/**
	 * @zh 현재 테마
	 * @en Current theme
	 * @default "auto"
	 */
	theme: ThemeType
	/**
	 * @zh 색맹 모드 활성화 여부
	 * @en Whether to enable color-blind mode
	 * @default false
	 */
	colorBlindMode: boolean
	/**
	 * @zh 회색 모드 활성화 여부
	 * @en Whether to enable gray mode
	 * @default false
	 */
	colorGrayMode: boolean
	/**
	 * @zh 테마 모서리 둥글기 값
	 * @en Theme radius value
	 * @default 6
	 */
	themeRadius: number
	/**
	 * @zh 테마 색상
	 * @en Theme color
	 * @default "#1677ff" - blue
	 */
	themeColorPrimary: string
	/**
	 * @zh 내장 테마
	 * @en Builtin theme
	 * @default "blue"
	 */
	builtinTheme: BuiltinThemeType
	/* ================== Theme ================== */

	/* ================== Tabbar ================== */
	/**
	 * @zh 탭바 스타일
	 * @en Tabbar style
	 * @default "chrome"
	 */
	tabbarStyleType: TabsStyleType
	/**
	 * @zh 탭바 활성화 여부
	 * @en Whether to enable tabbar
	 * @default true
	 */
	tabbarEnable: boolean
	/**
	 * @zh 탭바 아이콘 표시 여부
	 * @en Whether to show tabbar icon
	 * @default true
	 * @todo 구현 예정
	 */
	tabbarShowIcon: boolean
	/**
	 * @zh 탭바 지속성 여부
	 * @en Whether to persist tabbar
	 * @default true
	 */
	tabbarPersist: boolean
	/**
	 * @zh 탭바 드래그 가능 여부
	 * @en Whether to drag tabbar
	 * @default true
	 * @todo 구현 예정
	 */
	tabbarDraggable: boolean
	/**
	 * @zh 더보기 표시 여부
	 * @en Whether to show more
	 * @default true
	 */
	tabbarShowMore: boolean
	/**
	 * @zh 최대화 표시 여부
	 * @en Whether to show maximize
	 * @default true
	 */
	tabbarShowMaximize: boolean
	/* ================== Tabbar ================== */
}
