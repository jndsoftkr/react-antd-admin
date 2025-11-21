/**
 * 범용 언어 모듈 매핑 타입, 중첩 가능한 객체 구조를 나타냅니다
 */
interface LanguageModule<T> {
	[key: string]: T | any
}

/**
 * 언어 파일의 매개변수 타입, 가져온 언어 파일 집합을 설명하는 데 사용됩니다
 */
type LanguageFileMap = Record<string, LanguageModule<LanguageFileMap>>;

export function getZhKoLang() {
	const langFiles = import.meta.glob<LanguageFileMap>("./zh-KO/**/*.json", {
		import: "default",
		eager: true,
	});
	const result = organizeLanguageFiles(langFiles);
	return result;
}

export function getEnUsLang() {
	const langFiles = import.meta.glob<LanguageFileMap>("./en-US/**/*.json", {
		import: "default",
		eager: true,
	});
	const result = organizeLanguageFiles(langFiles);
	return result;
}

export function organizeLanguageFiles(files: LanguageFileMap) {
	const result: LanguageModule<LanguageFileMap> = {};

	for (const key in files) {
		const data = files[key];
		const fileArr = key?.split("/");
		const fileName = fileArr[fileArr?.length - 1];
		if (!fileName)
			continue;
		const name = fileName.split(".json")[0];
		if (name)
			result[name] = data;
	}

	return result;
}
