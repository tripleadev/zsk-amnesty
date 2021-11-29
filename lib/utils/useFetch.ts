import useSWR from "swr";
import Axios from "axios";

const fetcher = (url: string) => Axios.get(url).then((res) => res.data);

function useFetch(apiUrl: string) {
  const { data, error } = useSWR(apiUrl, fetcher);

  return { data, error };
}

export default useFetch;
