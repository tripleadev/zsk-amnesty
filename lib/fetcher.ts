import Axios from "axios";

export const fetcher = (url: string) => () => Axios.get(url).then((res) => res.data);
