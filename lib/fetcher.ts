import Axios from "axios";
import superjson from "superjson";

export const fetcher =
  <T>(url: string) =>
  () =>
    Axios.get<T>(url, {
      transformResponse: (data) => {
        try {
          const dataObject = JSON.parse(data);

          return superjson.deserialize({
            json: dataObject.json ?? dataObject,
            meta: dataObject.meta ?? {},
          });
        } catch {
          return data;
        }
      },
    }).then((res) => res.data);
