import type { Options } from "ky";

import { loginPath } from "#src/router/extra-info";
import { useAuthStore } from "#src/store/auth";
import { usePreferencesStore } from "#src/store/preferences";
import ky from "ky";

import { AUTH_HEADER, LANG_HEADER, REFRESH_TOKEN_PATH } from "./constants";
import { handleErrorResponse } from "./error-response";
import { globalProgress } from "./global-progress";
import { goLogin } from "./go-login";
import { refreshTokenAndRetry } from "./refresh";

// 요청 화이트리스트, 화이트리스트 내의 인터페이스는 token을 포함할 필요가 없습니다
const requestWhiteList = [loginPath];

// 요청 타임아웃 시간
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

const defaultConfig: Options = {
	// The input argument cannot start with a slash / when using prefixUrl option.
	prefixUrl: import.meta.env.VITE_API_BASE_URL,
	timeout: API_TIMEOUT,
	retry: {
		// 요청 실패 시 최대 재시도 횟수
		limit: 3,
	},
	hooks: {
		beforeRequest: [
			(request, options) => {
				const ignoreLoading = options.ignoreLoading;
				if (!ignoreLoading) {
					globalProgress.start();
				}
				// token을 포함할 필요가 없는 요청
				const isWhiteRequest = requestWhiteList.some(url => request.url.endsWith(url));
				if (!isWhiteRequest) {
					const { token } = useAuthStore.getState();
					request.headers.set(AUTH_HEADER, `Bearer ${token}`);
				}
				// 언어 등 모든 인터페이스에 포함해야 함
				request.headers.set(LANG_HEADER, usePreferencesStore.getState().language);
			},
		],
		afterResponse: [
			async (request, options, response) => {
				const ignoreLoading = options.ignoreLoading;
				if (!ignoreLoading) {
					globalProgress.done();
				}
				// request error
				if (!response.ok) {
					if (response.status === 401) {
						// refresh-token 갱신 시 계속 401 오류를 받아 무한 루프가 발생하는 것을 방지
						if ([`/${REFRESH_TOKEN_PATH}`].some(url => request.url.endsWith(url))) {
							goLogin();
							return response;
						}
						// If the token is expired, refresh it and try again.
						const { refreshToken } = useAuthStore.getState();
						// If there is no refresh token, it means that the user has not logged in.
						if (!refreshToken) {
							// 페이지의 라우트가 이미 로그인 페이지로 리디렉션된 경우, 리디렉션하지 않고 결과를 직접 반환
							if (location.pathname === loginPath) {
								return response;
							}
							else {
								goLogin();
								return response;
							}
						}

						return refreshTokenAndRetry(request, options, refreshToken);
					}
					else {
						return handleErrorResponse(response);
					}
				}
				// request success
				return response;
			},
		],
	},
};

export const request = ky.create(defaultConfig);
