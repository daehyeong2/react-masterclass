import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexCharts from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(["chart", coinId], () =>
    fetchCoinHistory(coinId)
  );
  if (!isLoading && !(data && data[0]?.close)) {
    return <span>404 Not Found.</span>;
  }
  const mappedOhlcvData = data?.map((v: IHistorical) => ({
    x: new Date(v.time_close * 1000).toISOString(),
    y: [v.open, v.high, v.low, v.close],
  }));
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexCharts
          type="candlestick"
          series={[
            {
              data: mappedOhlcvData as unknown as number[],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            grid: {
              show: false,
            },
            xaxis: {
              axisTicks: {
                show: false,
              },
              type: "datetime",
              categories: data?.map((price) =>
                new Date(price.time_open * 1000).toUTCString()
              ),
            },
            yaxis: {
              show: false,
            },
            chart: {
              background: "transparent",
              toolbar: {
                show: false,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
