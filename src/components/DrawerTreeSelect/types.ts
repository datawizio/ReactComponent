import React from "react";
import { SelectValue } from "antd/lib/tree-select";
import { TreeSelectProps as AntTreeSelectProps } from "./antd/AntTreeSelect";
import { AntTreeNode } from "antd/lib/tree";

export interface IDrawerTreeSelectFilters {
  shop_markers?: string[] | number[];
  search?: string;
  level?: string | number;
  value?: SelectValue;
  first?: boolean;
}

export type LevelsType = { value: string; label: string }[];

export interface MarkersRenderProps {
  onChange?: (selected: string[]) => void;
}

export interface DrawerTreeSelectProps<VT>
  extends Omit<AntTreeSelectProps<VT>, "onChange" | "loadData"> {
  additionalFilters?: any;
  asyncData?: boolean;

  headerHeight?: number;

  /**
   * Title Drawer-а
   */
  drawerTitle?: string;

  /**
   * Drawer width in px
   */
  drawerWidth?: number;

  /**
   * Показать выбор уровней
   */
  showLevels?: boolean;

  noticeRender?: React.ReactElement | null;

  /**
   * Показать выбор маркеров
   */
  showMarkers?: boolean;

  markersRender?: ((props: MarkersRenderProps) => React.ReactElement) | null;

  levels?: LevelsType;

  markersTree?: any;

  level?: string | number;

  /**
   * tree data is flat list or not
   */
  isFlatList?: boolean;

  remoteSearch?: boolean;

  showSelectAll?: boolean;

  selectAllUponLevelChange?: boolean;

  selectAllText?: string;

  onCheckedDependentValue?: (
    fieldName: string,
    selectedItems: Array<string>
  ) => void;

  dependentItems?: Array<any>;

  treeDataCount?: number;

  strictlyModeCheckbox?: boolean;

  emptyIsAll?: boolean;

  selectedMarkers?: string[] | number[];

  loadData?: (filters: IDrawerTreeSelectFilters) => Promise<any>;

  loadChildren?: (nodeId: string, filters?: any) => Promise<any>;

  loadMarkersChildren?: (id: string, filters?: any) => Promise<any>;
  /**
   * Event when user click Submit
   */
  onChange?: (values: SelectValue, selected?: AntTreeNode, extra?: any) => void;
  onChangeReturnObject?: (obj: {
    value: SelectValue;
    level: string | number;
    markers: string[] | number[];
    selected?: AntTreeNode;
    drawerVisible?: boolean;
  }) => void;

  onLevelChange?: (level: string) => void;
  onMarkerChange?: (markers: any) => void;

  maxSelected?: number;

  maxTagLength?: number;

  onDrawerCloseCallback?: (payload?: any) => void;
  onDrawerCancelCallback?: (payload?: any) => void;
  onDrawerOpenCallback?: (payload?: any) => void;
  onDrawerSubmitCallback?: (payload?: any) => void;
}

export interface FCDrawerTreeSelect<VT>
  extends React.FC<DrawerTreeSelectProps<VT>> {
  SHOW_PARENT: "SHOW_PARENT";
  SHOW_ALL: "SHOW_ALL";
  SHOW_CHILD: "SHOW_CHILD";
}
