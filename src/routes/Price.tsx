import { useQuery } from "react-query";
import { fetchCoinTickers } from "../api";
import styled from "styled-components";

interface IPrice {
  coinId: string;
}
interface TickersData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
  error?: string;
}

const PriceTable = styled.div`
  margin-top: 10px;
  width: 100%;
  max-height: 20vh;
  overflow: auto;
  padding: 15px 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
`;
const PriceRow = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

function Price(props: IPrice) {
  const { isLoading, data } = useQuery<TickersData>(
    ["tickers", props.coinId],
    () => fetchCoinTickers(props.coinId)
  );
  return (
    <>
      {isLoading ? (
        "Loading Price..."
      ) : (
        <PriceTable>
          <PriceRow>Price : ${data?.quotes.USD.price.toFixed(2)}</PriceRow>
          <PriceRow>
            All Time High : ${data?.quotes.USD.ath_price.toFixed(2)}
          </PriceRow>
          <PriceRow>
            Change 30 minutes : {data?.quotes.USD.percent_change_30m}%
          </PriceRow>
          <PriceRow>
            Change 1 hours : {data?.quotes.USD.percent_change_1h}%
          </PriceRow>
          <PriceRow>
            Change 24 hours : {data?.quotes.USD.percent_change_24h}%
          </PriceRow>
          <PriceRow>
            Change 1 week : {data?.quotes.USD.percent_change_7d}%
          </PriceRow>
        </PriceTable>
      )}
    </>
  );
}

export default Price;
