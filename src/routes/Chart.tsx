import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexCharts from "react-apexcharts";

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
  const { isLoading, data } = useQuery<IHistorical[]>(["chart", coinId], () =>
    fetchCoinHistory(coinId)
  );
  if (!isLoading && !(data && data[0]?.close)) {
    return <span>404 Not Found.</span>;
  }
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexCharts
          type="line"
          series={[
            {
              name: "Price",
              data: data?.map((price) => Number(price.close)) as number[],
            },
          ]}
          options={{
            theme: {
              mode: "dark",
            },
            grid: {
              show: false,
            },
            xaxis: {
              labels: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
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
              height: 300,
              width: 500,
            },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#55efc4"], stops: [0, 100] },
            },
            colors: ["#0984e3"],
            tooltip: {
              y: {
                formatter: (value) => `$${value}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
