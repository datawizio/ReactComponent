import { useWSSubscription } from "../../utils/ws/useWSSubscription";
import { Dispatch, useCallback, useEffect } from "react";
import { Action, IListItem, ListProps, ListState } from "./types";

function useWebSocket(
  state: ListState<IListItem>,
  dispatch: Dispatch<Action<IListItem>>,
  props: ListProps<IListItem>
) {
  const { dataProvider, dataProviderDeps, messageId: id } = props;

  const fetchData = useCallback(
    async () => {
      if (dataProvider) {
        try {
          dispatch({ type: "loading", payload: true });
          await dataProvider(state);
        } catch (e) {
          if (e.name === "CancelRequestError") {
            throw e;
          }
          console.warn("Table loading failed: " + e.message);
        }
      }
    },
    // eslint-disable-next-line
    [dataProvider, state.pageSize, state.currentPage, state.force].concat(
      dataProviderDeps && dataProviderDeps(state)
    )
  );

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line
  }, [dispatch, fetchData]);

  useWSSubscription({
    id: id ?? "",
    callback: message => {
      const data = props.parseMessage ? props.parseMessage(message) : {};
      if (data) dispatch({ type: "update", payload: data });
    }
  });

  useWSSubscription({
    id: `${id}-update`,
    message: props.updateSubscription?.message,

    callback: message => {
      props.updateSubscription?.callback(message, dispatch);
    }
  });

  return fetchData;
}

useWebSocket.displayName = "useWebSocket";

export default useWebSocket;
