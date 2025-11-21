import type { KyResponse, Options } from "ky";
import { fetchRefreshToken } from "#src/api/user";

import { useAuthStore } from "#src/store/auth";
import ky from "ky";
import { AUTH_HEADER } from "./constants";
import { goLogin } from "./go-login";

let isRefreshing = false;

/**
 * token을 갱신하고 요청을 다시 시작합니다
 *
 * @param request 요청 객체
 * @param options 요청 옵션
 * @param refreshToken 갱신 token
 * @returns 응답 객체
 * @throws token 갱신 실패 시 예외를 throw합니다
 */
export async function refreshTokenAndRetry(request: Request, options: Options, refreshToken: string) {
	if (!isRefreshing) {
		isRefreshing = true;
		try {
			// fetchRefreshToken 함수를 호출하여 전달된 refreshToken을 사용하여 새로운 token과 refreshToken을 가져옵니다
			const freshResponse = await fetchRefreshToken({ refreshToken });
			// 응답에서 새로운 token 추출
			const newToken = freshResponse.result.token;
			// 응답에서 새로운 refreshToken 추출
			const newRefreshToken = freshResponse.result.refreshToken;
			// 새로운 token과 refreshToken을 userStore에 저장
			useAuthStore.setState({ token: newToken, refreshToken: newRefreshToken });
			// onRefreshed 함수를 호출하여 새로운 token 전달
			onRefreshed(newToken);

			// 요청의 Authorization 헤더를 새로운 token으로 설정
			// 현재 요청 재시도
			request.headers.set(AUTH_HEADER, `Bearer ${newToken}`);
			// 새로운 token을 사용하여 요청을 다시 시작
			return ky(request, options);
		}
		catch (error) {
			// onRefreshFailed 함수를 호출하여 오류 객체 전달
			// refreshToken 인증이 통과하지 못했으므로 대기 중인 모든 요청 거부
			onRefreshFailed(error);
			// 로그인 페이지로 이동
			goLogin();
			// 오류 throw
			throw error;
		}
		finally {
			// 오류 발생 여부와 관계없이 isRefreshing을 false로 설정
			isRefreshing = false;
		}
	}
	else {
		// token 갱신 완료 대기
		return new Promise<KyResponse>((resolve, reject) => {
			// 갱신 구독자 추가
			addRefreshSubscriber({
				// token 갱신이 성공하면 새로운 token을 요청의 Authorization 헤더에 설정하고 요청을 다시 시작합니다
				resolve: async (newToken) => {
					request.headers.set(AUTH_HEADER, `Bearer ${newToken}`);
					resolve(ky(request, options));
				},
				// token 갱신이 실패하면 현재 Promise를 거부합니다
				reject,
			});
		});
	}
}

// token 갱신을 기다리는 모든 구독자를 저장하는 배열 정의
// 각 구독자 객체는 resolve와 reject 메서드를 포함하며, token 갱신 성공 또는 실패 시 각각 호출됩니다
let refreshSubscribers: Array<{
	resolve: (token: string) => void // token 갱신 성공 시 호출되는 함수, 새로운 token을 전달받음
	reject: (error: any) => void // token 갱신 실패 시 호출되는 함수, 오류 정보를 전달받음
}> = [];

/**
 * token 갱신이 성공하면 대기 중인 모든 구독자에게 알립니다.
 * 모든 구독자를 순회하며 resolve 메서드를 호출하고 새로운 token을 전달합니다.
 * 그런 다음 구독자 목록을 비워 다음 token 갱신을 준비합니다.
 *
 * @param token 갱신된 토큰 문자열
 */
function onRefreshed(token: string) {
	refreshSubscribers.forEach(subscriber => subscriber.resolve(token));
	refreshSubscribers = []; // 구독자 목록 비우기
}

/**
 * token 갱신이 실패하면 대기 중인 모든 구독자에게 알립니다.
 * 모든 구독자를 순회하며 reject 메서드를 호출하고 오류 정보를 전달합니다.
 * 그런 다음 구독자 목록을 비웁니다.
 *
 * @param error 갱신 실패 시 생성된 오류 정보
 */
function onRefreshFailed(error: any) {
	refreshSubscribers.forEach(subscriber => subscriber.reject(error));
	refreshSubscribers = []; // 구독자 목록 비우기
}

/**
 * 목록에 새로운 구독자를 추가합니다.
 * 구독자 객체는 resolve와 reject 메서드를 포함해야 합니다.
 *
 * @param subscriber resolve와 reject 메서드를 포함하는 구독자 객체
 * @param subscriber.resolve token 갱신 성공 시 호출되는 함수, 새로운 token을 전달받음
 * @param subscriber.reject token 갱신 실패 시 호출되는 함수, 오류 정보를 전달받음
 */
function addRefreshSubscriber(subscriber: {
	resolve: (token: string) => void // token 갱신 성공 시 호출되는 함수
	reject: (error: any) => void // token 갱신 실패 시 호출되는 함수
}) {
	refreshSubscribers.push(subscriber); // 새로운 구독자를 목록에 추가
}
