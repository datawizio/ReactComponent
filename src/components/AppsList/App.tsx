import React, { useState, useContext } from "react";

import { Badge, Card, Col } from "antd";
import Select from "../Select";
import Button from "../Button";

import ConfigContext from "../ConfigProvider/context";
import { CardAppProps } from "./types";

import "./index.less";

export const App: React.FC<CardAppProps> = ({
  app_id,
  name,
  logo,
  dark_logo,
  description,
  clients,
  host,
  path,
  allowed,
  showButton = true,
  onButtonClick
}) => {
  const { translate } = useContext(ConfigContext);
  const [client, setClient] = useState<number>();

  const showClientSelect = path ? path.match(":client_id") !== null : false;

  const handleChangeClient = (value: number) => {
    setClient(value);
  };

  const getClient = (client: number) => {
    if (client) return client;
    if (clients && clients.length > 0) return clients[0].client_id;
    return null;
  };

  const handleButtonClick = () => {
    const url = `${host ? host : ""}${path ? path : ""}`;
    onButtonClick(getClient(client), { appId: app_id, url, allowed });
  };

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
      <Card className="card-app">
        <div className="card-app-logo">
          {logo ? (
            <img src={window.theme === "dark" ? dark_logo : logo} alt={name} />
          ) : (
            <div className="card-app-name">{name}</div>
          )}
        </div>
        <div className="card-app-description">{translate(description)}</div>
        {showClientSelect && clients && clients.length > 1 && (
          <div className="card-app-clients">
            <Select
              placeholder={translate("SELECT_CLIENT")}
              showSearch
              optionFilterProp="label"
              onChange={handleChangeClient}
              value={client}
              notFoundContent={translate("NO_DATA")}
            >
              {clients.map(client => (
                <Select.Option
                  key={client.client_id}
                  value={client.client_id}
                  label={client.name}
                >
                  <Badge
                    status="default"
                    color={client.is_active ? "purple" : null}
                  />
                  {client.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}

        {showButton && (
          <div className="card-app-actions">
            <Button type={"primary"} block onClick={handleButtonClick}>
              {translate(allowed ? "GO_OVER" : "LEARN_MORE")}
            </Button>
          </div>
        )}
      </Card>
    </Col>
  );
};
