import { TableState, Action, SortParams, TableProps, IRow } from "./types";
import { basicDTypesConfig } from "./utils/typesConfigs";
import { swapColumns, filterByColumns } from "./utils/utils";

function genColumnsMap(columns) {
  const columnsMap = {};

  (function rec(columns) {
    columns.forEach(column => {
      columnsMap[column.dataIndex] = column;
      column.children && column.children.length && rec(column.children);
    });
  })(columns);

  return columnsMap;
}

function findExpandedRecord(path: string[], children: IRow[]) {
  const next = path.pop();
  const record = children.find(child => child.key === next);
  if (!record) return { children: [] };
  if (path.length) return findExpandedRecord(path, record.children);

  return record;
}

function getRecordPath(rowKey: any, parentsMap: any) {
  const path = [];

  const buildPath = (key: string) => {
    path.push(key);
    if (!parentsMap[key]) return;
    buildPath(parentsMap[key]);
  };

  buildPath(rowKey);

  return path;
}

export function initializer(props: TableProps): TableState {
  const {
    columns,
    loading,
    dataSource,
    pagination,
    searchValue,
    dTypesConfig,
    showSizeChanger,
    pageSizeOptions,
    visibleColumnsKeys
  } = props;

  return {
    columns,
    loading,
    dataSource,
    searchValue,

    pagination: {
      showSizeChanger,
      pageSizeOptions,
      pageSize: +pageSizeOptions[0],
      ...(pagination || {})
    },

    sortParams: {},
    filterParams: {},
    expandedRowKeys: [],
    columnsMap: genColumnsMap(columns),
    parentsMap: {},
    visibleColumnsKeys: visibleColumnsKeys || [],
    dTypesConfig: { ...basicDTypesConfig, ...dTypesConfig },
    loadingRows: {}
  };
}

export function reducer(state: TableState, action: Action): TableState {
  switch (action.type) {
    case "updateDataSource": {
      return {
        ...state,
        expandedRowKeys: [],
        dataSource: action.payload
      };
    }
    case "updateColumns": {
      const nextColumnsMap = genColumnsMap(action.payload);
      const nextSortParams = filterByColumns(nextColumnsMap, state.sortParams);
      const nextFilterParams = filterByColumns(
        nextColumnsMap,
        state.filterParams
      );

      const nextVisibleColumnsKeys =
        state.visibleColumnsKeys &&
        state.visibleColumnsKeys.length &&
        state.visibleColumnsKeys.filter(key => nextColumnsMap[key]);

      const nextColumns = (function rec(newColumns, oldColumns) {
        const sameDataIndex = newColumn => oldColumn =>
          newColumn.dataIndex === oldColumn.dataIndex;

        newColumns.sort(
          (a, b) =>
            oldColumns.findIndex(sameDataIndex(a)) -
            oldColumns.findIndex(sameDataIndex(b))
        );

        newColumns.forEach(column => {
          if (column.children && column.children.length) {
            const oldColumn = oldColumns.find(
              oldColumn => oldColumn.dataIndex === column.dataIndex
            );

            oldColumn &&
              oldColumn.children &&
              oldColumn.children.length &&
              rec(column.children, oldColumn.children);
          }
        });

        return newColumns;
      })(action.payload, state.columns);

      return {
        ...state,

        columns: nextColumns,
        columnsMap: nextColumnsMap,

        sortParams: nextSortParams,
        filterParams: nextFilterParams,

        visibleColumnsKeys: nextVisibleColumnsKeys || []
      };
    }
    case "visibleColumnsKeys": {
      return {
        ...state,
        visibleColumnsKeys: action.payload
      };
    }
    case "paginate": {
      return {
        ...state,
        pagination: action.payload
      };
    }
    case "resetPagination": {
      return {
        ...state,
        pagination: state.pagination && {
          ...state.pagination,
          current: 1
        }
      };
    }
    case "search": {
      return {
        ...state,
        searchValue: action.payload,
        pagination: state.pagination && {
          ...state.pagination,
          current: 1
        }
      };
    }
    case "sort": {
      const sorters = action.payload;
      const sortParams = sorters
        .filter(({ column }) => column)
        .reduce(
          (acc, { column, order }) => ({
            ...acc,
            [column.dataIndex as string]: order
          }),
          {}
        ) as SortParams;

      return {
        ...state,
        sortParams
      };
    }
    case "filter": {
      const filterParams = Object.entries(action.payload).reduce(
        (acc, [key, value]) => {
          if (value) {
            const column = state.columns.find(column => column.key === key);
            if (column && column.dataIndex) acc[column.dataIndex] = value;
          }
          return acc;
        },
        {}
      );

      return {
        ...state,
        filterParams
      };
    }
    case "setNestedTable": {
      const { loadingRows } = state;
      const [expandedRow, result] = action.payload;

      delete loadingRows[expandedRow.key];

      const newState: any = {
        loadingRows
      };

      if (result) {
        const nextDataSource = state.dataSource.concat();
        const expandedRowIdx = state.dataSource.findIndex(
          row => row.key === expandedRow.key
        );

        nextDataSource[expandedRowIdx] = {
          ...expandedRow,
          nested: result
        } as any;
        newState.dataSource = nextDataSource;
      }
      return {
        ...state,
        ...newState
      };
    }
    case "addLoadingRow": {
      return {
        ...state,
        loadingRows: { ...state.loadingRows, [action.payload]: true }
      };
    }
    case "setRowChildren": {
      const { parentsMap, loadingRows } = state;
      const [expandedRow, children] = action.payload;
      const nextDataSource = state.dataSource.concat();
      delete loadingRows[expandedRow.key];
      children &&
        children.forEach(child => {
          parentsMap[child.key] = expandedRow.key;
        });

      const path = getRecordPath(expandedRow.key, parentsMap);

      const expandedRecord = findExpandedRecord(path, state.dataSource);
      expandedRecord.children = children;
      return {
        ...state,
        parentsMap,
        dataSource: nextDataSource,
        loadingRows
      };
    }
    case "swapColumns": {
      const [keyFrom, keyTo] = action.payload;
      const nextColumns = state.columns.concat();

      swapColumns(nextColumns, keyFrom, keyTo);

      return {
        ...state,
        columns: nextColumns
      };
    }
    case "expandRow": {
      return {
        ...state,
        expandedRowKeys: state.expandedRowKeys.concat(action.payload.key)
      };
    }
    case "collapseRow": {
      return {
        ...state,
        expandedRowKeys: state.expandedRowKeys.filter(
          key => key !== action.payload.key
        )
      };
    }
    case "loading": {
      return {
        ...state,
        loading: action.payload
      };
    }
    case "recoveryState": {
      const { columnsPositions, pagination, ...restPayload } = action.payload;
      let nextState = { ...state, ...restPayload, stateIsRecovered: true };

      if (nextState.pagination && pagination && pagination.pageSize) {
        nextState.pagination.pageSize = pagination.pageSize;
      }

      if (columnsPositions) {
        nextState.columns = (function rec(columns) {
          return columns.map(
            column =>
              ({
                ...column,
                ...state.columnsMap[column.dataIndex],
                children: column.children && rec(column.children as any)
              } as any)
          );
        })(columnsPositions);
      }

      return nextState;
    }
    case "updateRow": {
      const [key, data] = action.payload;
      const { parentsMap, loadingRows, expandedRowKeys } = state;
      delete loadingRows[key];
      const newState: any = {
        loadingRows
      };

      if (data) {
        const nextDataSource = state.dataSource.concat();
        const path = getRecordPath(key, parentsMap);

        let expandedRecord = findExpandedRecord(path, state.dataSource);

        //@ts-ignore
        if (data.expanded === false) {
          newState.expandedRowKeys = expandedRowKeys.filter(
            rowKey => rowKey != key
          );
        }
        if (!Array.isArray(expandedRecord.children)) {
          delete data.children;
        }
        expandedRecord = Object.assign(expandedRecord, data);
        newState.dataSource = nextDataSource;
      }

      return {
        ...state,
        ...newState
      };
    }
    case "update": {
      let nextState = { ...state, ...action.payload };

      if (action.payload.columns)
        nextState = reducer(
          { ...nextState, columns: state.columns },
          {
            type: "updateColumns",
            payload: nextState.columns
          }
        );

      if (action.payload.dataSource)
        nextState = reducer(nextState, {
          type: "updateDataSource",
          payload: nextState.dataSource
        });

      return nextState;
    }

    default:
      return state;
  }
}
