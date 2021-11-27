import useSWR from "swr";

type StatsResponse = Record<string, string>;

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

const Home = () => {
  const { data, error } = useSWR<StatsResponse>("/api/stats", fetcher, { refreshInterval: 5000 });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return <div>Total Letters: {data.totalLetters}</div>;
};

export default Home;
