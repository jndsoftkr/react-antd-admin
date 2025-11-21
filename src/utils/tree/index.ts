/**
 * @description 트리 구조 데이터 생성
 * @param data 데이터 소스
 * @param id id 필드, 기본값 id
 * @param parentId 부모 노드 필드, 기본값 parentId
 * @param children 자식 노드 필드, 기본값 children
 * @returns 필드가 추가된 트리
 */
export function handleTree(data: any[], id?: string, parentId?: string, children?: string): any {
	if (!Array.isArray(data)) {
		console.warn("data must be an array");
		return [];
	}
	const config = {
		id: id || "id",
		parentId: parentId || "parentId",
		childrenList: children || "children",
	};

	const childrenListMap: any = {};
	const nodeIds: any = {};
	const tree = [];

	for (const d of data) {
		const parentId = d[config.parentId];
		if (childrenListMap[parentId] == null) {
			childrenListMap[parentId] = [];
		}
		nodeIds[d[config.id]] = d;
		childrenListMap[parentId].push(d);
	}

	for (const d of data) {
		const parentId = d[config.parentId];
		if (nodeIds[parentId] == null) {
			tree.push(d);
		}
	}

	for (const t of tree) {
		adaptToChildrenList(t);
	}

	function adaptToChildrenList(o: Record<string, any>) {
		if (childrenListMap[o[config.id]] !== null) {
			o[config.childrenList] = childrenListMap[o[config.id]];
		}
		if (o[config.childrenList]) {
			for (const c of o[config.childrenList]) {
				adaptToChildrenList(c);
			}
		}
	}
	return tree;
}

export interface TreeConfigOptions {
	// 자식 속성의 이름, 기본값 'children'
	childProps: string
}

/**
 * @zh_CN 트리 구조를 순회하고 모든 노드에서 지정된 값을 반환합니다.
 * @param tree 트리 구조 배열
 * @param getValue 노드 값을 가져오는 함수
 * @param options 자식 노드 배열의 선택적 속성 이름입니다.
 * @returns 모든 노드에서 지정된 값의 배열
 */
export function traverseTreeValues<T, V>(
	tree: T[],
	getValue: (node: T) => V,
	options?: TreeConfigOptions,
): V[] {
	const result: V[] = [];
	const { childProps } = options || {
		childProps: "children",
	};

	const dfs = (treeNode: T) => {
		const value = getValue(treeNode);
		result.push(value);
		const children = (treeNode as Record<string, any>)?.[childProps];
		if (!children) {
			return;
		}
		if (children.length > 0) {
			for (const child of children) {
				dfs(child);
			}
		}
	};

	for (const treeNode of tree) {
		dfs(treeNode);
	}
	return result.filter(Boolean);
}

/**
 * 조건에 따라 주어진 트리 구조의 노드를 필터링하고 원래 순서로 모든 일치하는 노드의 배열을 반환합니다.
 * @param tree 필터링할 트리 구조의 루트 노드 배열입니다.
 * @param filter 각 노드를 일치시키는 데 사용되는 조건입니다.
 * @param options 자식 노드 배열의 선택적 속성 이름입니다.
 * @returns 모든 일치하는 노드를 포함하는 배열입니다.
 */
export function filterTree<T extends Record<string, any>>(
	tree: T[],
	filter: (node: T) => boolean,
	options?: TreeConfigOptions,
): T[] {
	const { childProps } = options || {
		childProps: "children",
	};

	const _filterTree = (nodes: T[]): T[] => {
		return nodes.filter((node: Record<string, any>) => {
			if (filter(node as T)) {
				if (node[childProps]) {
					node[childProps] = _filterTree(node[childProps]);
				}
				return true;
			}
			return false;
		});
	};

	return _filterTree(tree);
}

/**
 * 조건에 따라 주어진 트리 구조의 노드를 다시 매핑합니다
 * @param tree 필터링할 트리 구조의 루트 노드 배열입니다.
 * @param mapper 각 노드를 map하는 데 사용되는 조건입니다.
 * @param options 자식 노드 배열의 선택적 속성 이름입니다.
 */
export function mapTree<T, V extends Record<string, any>>(
	tree: T[],
	mapper: (node: T) => V,
	options?: TreeConfigOptions,
): V[] {
	const { childProps } = options || {
		childProps: "children",
	};
	return tree.map((node) => {
		const mapperNode: Record<string, any> = mapper(node);
		if (mapperNode[childProps]) {
			mapperNode[childProps] = mapTree(mapperNode[childProps], mapper, options);
		}
		return mapperNode as V;
	});
}
