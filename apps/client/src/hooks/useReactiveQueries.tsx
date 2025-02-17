import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useReactiveQueries = (keySegment: QueryKey) => {
  const queryClient = useQueryClient();
  const [data, setData] = useState<Array<[QueryKey, unknown]>>([]);

  useEffect(() => {
    const initialQueries = queryClient.getQueriesData({
      predicate: (query) => query.queryKey[0] === keySegment[0],
    });
    setData(initialQueries);

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === keySegment[0]) {
        if (event.type === "updated" || event.type === "added") {
          const updatedData = queryClient.getQueriesData({
            predicate: (query) =>
              query.queryKey[0] === keySegment[0] &&
              query.state.data !== undefined,
          });

          setData(updatedData);
        }

        if (event.type === "removed") {
          setData((prevData) =>
            prevData.filter(
              ([queryKey]) => queryKey[1] !== event.query.queryKey[1],
            ),
          );
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return data;
};
