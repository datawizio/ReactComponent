import * as React from "react";

import { Breadcrumb as AntBreadcrumb } from "antd";
import { BreadcrumbProps as AntBreadcrumbProps } from "antd/lib/breadcrumb";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import ConfigContext from "../ConfigProvider/context";

import "./index.less";

export interface BreadcrumbProps extends AntBreadcrumbProps {}

export type FCBreadcrumbProps = React.FC<BreadcrumbProps>;

export interface FCBreadcrumb extends FCBreadcrumbProps {
  Item: typeof AntBreadcrumb.Item;
  Separator: typeof AntBreadcrumb.Separator;
}

const Breadcrumb: FCBreadcrumb = ({ separator, ...props }) => {
  const { direction } = React.useContext(ConfigContext);

  if (!separator) {
    separator = direction === "rtl" ? <LeftOutlined /> : <RightOutlined />;
  }

  return (
    <AntBreadcrumb className="dw-breadcrumb" separator={separator} {...props} />
  );
};

Breadcrumb.Item = AntBreadcrumb.Item;
Breadcrumb.Separator = AntBreadcrumb.Separator;

export default Breadcrumb;
