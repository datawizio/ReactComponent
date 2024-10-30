import i18n from "i18next";
import { IColumn, IRow, TableResponse } from "../../components/Table/types";

export const translateArray = (array: Array<string>) => {
  return array.map(item => i18n.t(item));
};

export const translateObjects = <T>(
  array: T | any,
  propertyName: string = "title"
): T => {
  return array.map((item: any) => ({
    ...item,
    value: item.value !== undefined ? item.value : item.id,
    [propertyName]: i18n.t(item[propertyName])
  }));
};

interface TranslateTableResponseOptions {
  onlyColumns?: boolean;
}

export function translateTableResponse(
  fetcher: (...args: any) => Promise<TableResponse>,
  options?: TranslateTableResponseOptions
) {
  return async (...args: any) => {
    let response = await fetcher(...args);

    if (response.results) {
      const {
        results: { columns, dataSource }
      } = response;

      response.results.columns = columns && translateColumns(columns);

      if (!options?.onlyColumns && dataSource) {
        response.results.dataSource = translateDataSource(dataSource);
      }
    }

    return response;
  };
}

export function translateColumns(columns: Array<IColumn>) {
  return [...columns].map(column => {
    const nextColumn = { ...column };
    nextColumn.title = i18n.t(column.title as string);

    if (column.children && column.children.length) {
      nextColumn.children = translateColumns(column.children);
    }

    if (column.filters) {
      //@ts-ignore
      const filterData = column.filters.data;
      if (Array.isArray(filterData) && filterData.length === 0) {
        delete nextColumn.filters;
      } else {
        //@ts-ignore
        nextColumn.filters = column.filters.need_translate
          ? translateObjects(filterData, "text")
          : filterData;

        //@ts-ignore
        nextColumn.filterMultiple = column.filters.multi_select;
      }
    }

    return nextColumn;
  });
}

export function translateDataSource(dataSource: Array<IRow>): any {
  return [...dataSource].map(row => {
    return Object.entries(row).reduce(
      (acc, [dataIndex, cell]: any) => {
        if (Array.isArray(cell)) {
          if (dataIndex === "children") {
            acc[dataIndex] = translateDataSource(cell);
            return acc;
          }
          //@ts-ignore
          acc[dataIndex] = cell;
          return acc;
        }
        if (typeof cell === "string") acc[dataIndex] = i18n.t(cell) as string;
        if (typeof cell === "object") {
          acc[dataIndex] = {
            ...cell,
            value: i18n.t(cell.value) as string
          };
        }

        return acc;
      },
      { ...row }
    );
  });
}
