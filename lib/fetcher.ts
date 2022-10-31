import Axios from "axios";
import superjson from "superjson";

export const fetcher =
  <T>(url: string) =>
  () =>
    Axios.get(url).then((res) => superjson.parse<T>(res.data));
