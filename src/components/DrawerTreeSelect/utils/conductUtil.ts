import warning from "rc-util/lib/warning";
import { Key, DataEntity, DataNode } from "rc-tree/es/interface";
import { FilterFunc } from "rc-select/lib/interface/generator";
import { LegacyDataNode } from "rc-tree-select/es/interface";
import { fillLegacyProps } from "rc-tree-select/es/utils/legacyUtil";
import { getDefaultFilterOption } from "./valueUtil";

interface ConductReturnType {
  checkedKeys: Key[];
  halfCheckedKeys: Key[];
}

function removeFromCheckedKeys(
  halfCheckedKeys: Set<Key>,
  checkedKeys: Set<Key>
) {
  const filteredKeys = new Set<Key>();
  halfCheckedKeys.forEach(key => {
    if (!checkedKeys.has(key)) {
      filteredKeys.add(key);
    }
  });
  return filteredKeys;
}

export function isCheckDisabled(node: DataNode) {
  const { disabled, disableCheckbox, checkable } = (node || {}) as DataNode;
  return !!(disabled || disableCheckbox) || checkable === false;
}

export function isMatched(node: DataNode, searchValue: string) {
  let filterOptionFunc: FilterFunc<LegacyDataNode>;

  filterOptionFunc = getDefaultFilterOption("title");
  return filterOptionFunc(searchValue, fillLegacyProps(node));
}

// Fill miss keys
function fillConductCheck(
  keys: Set<Key>,
  levelEntities: Map<number, Set<DataEntity>>,
  maxLevel: number,
  searchValue: string
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys);
  const halfCheckedKeys = new Set<Key>();

  // Add checked keys top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach(entity => {
      const { key, node, children = [] } = entity;

      if (checkedKeys.has(key) && !isCheckDisabled(node)) {
        children
          .filter(
            childEntity =>
              !isCheckDisabled(childEntity.node) &&
              isMatched(childEntity.node, searchValue)
          )
          .forEach(childEntity => {
            checkedKeys.add(childEntity.key);
          });
      }
    });
  }

  // Add checked keys from bottom to top
  const visitedKeys = new Set<Key>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach(entity => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (
        isCheckDisabled(node) ||
        !entity.parent ||
        visitedKeys.has(entity.parent.key) ||
        !isMatched(node, searchValue)
      ) {
        return;
      }

      // Skip if parent is disabled
      if (isCheckDisabled(entity.parent.node)) {
        visitedKeys.add(parent.key);
        return;
      }

      let allChecked = true;
      let partialChecked = false;

      (parent.children || [])
        .filter(childEntity => !isCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (allChecked && !checked) {
            allChecked = false;
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true;
          }
        });
      if (allChecked) {
        checkedKeys.add(parent.key);
      } else {
        checkedKeys.delete(parent.key);
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent.key);
      }

      visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(
      removeFromCheckedKeys(halfCheckedKeys, checkedKeys)
    )
  };
}

// Remove useless key
function cleanConductCheck(
  keys: Set<Key>,
  halfKeys: Key[],
  levelEntities: Map<number, Set<DataEntity>>,
  maxLevel: number
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys);
  let halfCheckedKeys = new Set<Key>(halfKeys);

  // Remove checked keys from top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach(entity => {
      const { key, node, children = [] } = entity;

      if (
        !checkedKeys.has(key) &&
        !halfCheckedKeys.has(key) &&
        !isCheckDisabled(node)
      ) {
        children
          .filter(childEntity => !isCheckDisabled(childEntity.node))
          .forEach(childEntity => {
            checkedKeys.delete(childEntity.key);
          });
      }
    });
  }

  // Remove checked keys form bottom to top
  halfCheckedKeys = new Set<Key>();
  const visitedKeys = new Set<Key>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();

    entities.forEach(entity => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (
        isCheckDisabled(node) ||
        !entity.parent ||
        visitedKeys.has(entity.parent.key)
      ) {
        return;
      }

      // Skip if parent is disabled
      if (isCheckDisabled(entity.parent.node)) {
        visitedKeys.add(parent.key);
        return;
      }

      let allChecked = true;
      let partialChecked = false;

      (parent.children || [])
        .filter(childEntity => !isCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (allChecked && !checked) {
            allChecked = false;
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true;
          }
        });

      if (!allChecked) {
        checkedKeys.delete(parent.key);
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent.key);
      }

      visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(
      removeFromCheckedKeys(halfCheckedKeys, checkedKeys)
    )
  };
}

/**
 * Conduct with keys.
 * @param keyList current key list
 * @param keyEntities key - dataEntity map
 * @param mode `fill` to fill missing key, `clean` to remove useless key
 */
export function conductCheck(
  keyList: Key[],
  checked: true | { checked: false; halfCheckedKeys: Key[] },
  keyEntities: Record<Key, DataEntity>,
  searchValue: string
): ConductReturnType {
  const warningMissKeys: Key[] = [];

  // We only handle exist keys
  const keys = new Set<Key>(
    keyList.filter(key => {
      const hasEntity = !!keyEntities[key];
      if (!hasEntity) {
        warningMissKeys.push(key);
      }

      return hasEntity;
    })
  );
  const levelEntities = new Map<number, Set<DataEntity>>();
  let maxLevel = 0;

  // Convert entities by level for calculation
  Object.keys(keyEntities).forEach(key => {
    const entity = keyEntities[key];
    const { level } = entity;

    let levelSet: Set<DataEntity> = levelEntities.get(level);
    if (!levelSet) {
      levelSet = new Set();
      levelEntities.set(level, levelSet);
    }

    levelSet.add(entity);

    maxLevel = Math.max(maxLevel, level);
  });

  warning(
    !warningMissKeys.length,
    `Tree missing follow keys: ${warningMissKeys
      .slice(0, 100)
      .map(key => `'${key}'`)
      .join(", ")}`
  );

  let result: ConductReturnType;
  if (checked === true) {
    result = fillConductCheck(keys, levelEntities, maxLevel, searchValue);
  } else {
    result = cleanConductCheck(
      keys,
      checked.halfCheckedKeys,
      levelEntities,
      maxLevel
    );
  }

  return result;
}
