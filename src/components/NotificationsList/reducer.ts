import { Action, IListItem, ListProps, ListState } from "./types";

export function initializer(props: ListProps<IListItem>): ListState<IListItem> {
  const { dataProvider, dataProviderDeps } = props;

  return {
    dataProvider,
    dataProviderDeps,
    pageSize: 20,
    currentPage: 1,
    checkedKeys: new Set(),
    total: 0,
    checkedAllOnPage: null,
    checkedAll: false,
    force: 0
  };
}

export function reducer(
  state: ListState<IListItem>,
  action: Action<IListItem>
): ListState<IListItem> {
  switch (action.type) {
    case "reload": {
      return {
        ...state,
        force: state.force + 1
      };
    }
    case "update": {
      const dataSource = action.payload.dataSource;
      const checkedAllOnPage = getCheckAllOnPage(dataSource, state.checkedKeys);
      return {
        ...state,
        ...action.payload,
        checkedAll: false,
        checkedAllOnPage
      };
    }

    case "updateItems": {
      const updated: any = {};
      action.payload.forEach((item: any) => {
        updated[item.id] = item;
      });
      const dataSource = state.dataSource?.map(item =>
        updated[item.id] ? { ...item, ...updated[item.id] } : item
      );

      return {
        ...state,
        dataSource
      };
    }

    case "checkAllOnPage": {
      const checkedKeys = new Set(state.checkedKeys);
      let checkedAllOnPage: null | "all" = "all";

      const selectAll = () =>
        state.dataSource?.forEach(item => checkedKeys.add(item.id));

      const unselectAll = () => {
        checkedAllOnPage = null;
        state.dataSource?.forEach(item => checkedKeys.delete(item.id));
      };

      if (action.payload === true) {
        selectAll();
      } else if (action.payload === false) {
        unselectAll();
      } else if (state.checkedAllOnPage === "all") {
        unselectAll();
      } else {
        selectAll();
      }
      return {
        ...state,
        checkedAllOnPage,
        checkedAll: false,
        checkedKeys
      };
    }

    case "loading": {
      return {
        ...state,
        loading: action.payload
      };
    }

    case "paginate": {
      const checkedKeys = new Set(state.checkedKeys);
      if (state.checkedAll) {
        checkedKeys.clear();
      }

      return {
        ...state,
        currentPage: action.payload.page,
        checkedAll: false,
        checkedKeys,
        pageSize: action.payload.pageSize
      };
    }

    case "updatePaginate": {
      const itemKey = action.payload;
      const checkedKeys = new Set(state?.checkedKeys);

      if (itemKey) {
        checkedKeys.delete(itemKey);
      } else {
        checkedKeys.clear();
      }
      const currentPage = state.currentPage ?? 1;
      if (currentPage === 1)
        return { ...state, checkedKeys, checkedAll: false };

      const total = state.total ?? 0;
      const pageSize = state.pageSize ?? 1;

      const lastPage = currentPage === Math.ceil(total / pageSize);
      const noItemsAfterDelete =
        state.checkedAllOnPage === "all" || state.dataSource?.length === 1;

      if (lastPage && noItemsAfterDelete) {
        return {
          ...state,
          checkedKeys,
          currentPage: currentPage - 1,
          checkedAll: false
        };
      }

      return { ...state, checkedKeys };
    }

    case "check": {
      const key = action.payload;
      const checkedKeys = new Set(state.checkedKeys);
      if (checkedKeys.has(key)) {
        checkedKeys.delete(key);
      } else {
        checkedKeys.add(key);
      }
      const checkedAllOnPage = getCheckAllOnPage(state.dataSource, checkedKeys);
      return {
        ...state,
        checkedKeys,
        checkedAllOnPage,
        checkedAll: false
      };
    }

    case "setChecked": {
      const checkedKeys = new Set(action.payload);
      const checkedAllOnPage = getCheckAllOnPage(state.dataSource, checkedKeys);
      return {
        ...state,
        checkedKeys,
        checkedAllOnPage,
        checkedAll: false
      };
    }

    case "checkAll": {
      return {
        ...state,
        checkedAll: true
      };
    }

    default:
      return state;
  }
}

const getCheckAllOnPage = (
  dataSource: ListState<IListItem>["dataSource"],
  checkedKeys: Set<string>
) => {
  const checkedOnPage =
    dataSource?.reduce((acc, item) => {
      return checkedKeys.has(item.id) ? acc + 1 : acc;
    }, 0) || 0;

  return dataSource?.length === 0
    ? null
    : checkedOnPage === dataSource?.length
      ? "all"
      : checkedOnPage > 0
        ? "partial"
        : null;
};

export const getCheckedKeys = (state: ListState<IListItem> | null) =>
  Array.from(
    state && state?.checkedKeys && !state.checkedAll ? state?.checkedKeys : []
  );
