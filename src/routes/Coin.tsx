import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const Loader = styled.h3`
  margin-top: 40px;
  text-align: center;
`;
const Overview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 480px;
  border-radius: 15px;
  height: 65px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0 30px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 13px 0;
  span:first-child {
    font-size: 13px;
  }
`;
const Description = styled.p`
  margin: 15px 0;
`;
const Back = styled.div`
  margin-bottom: 10px;
  a {
    transition: color 0.1s ease-in-out;
    &:hover {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;
const Tabs = styled.div`
  margin-top: 20px;
  display: flex;
  height: 40px;
  justify-content: space-between;
  max-width: 480px;
  background-color: rgba(0, 0, 0, 0.5);
`;
const Tab = styled.button<{ active: string }>`
  width: 50%;
  height: 100%;
  border: 1px solid black;
  transition: background-color 0.2s ease-in-out;
  background-color: ${(props) =>
    props.active === "true" ? "#718093" : "#2f3640"};
  a {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.textColor};
  }
`;

interface RouteParams {
  coinId: string;
}
interface RouteState {
  name: string;
}
interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
  error?: string;
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

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<TickersData>(["tickers", coinId], () => fetchCoinTickers(coinId));

  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {infoData?.error
            ? "404 Not Found."
            : state?.name
            ? state.name
            : loading
            ? "Loading..."
            : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {infoData?.error
            ? "404 Not Found."
            : state?.name
            ? state.name
            : loading
            ? "Loading..."
            : infoData?.name}
        </Title>
      </Header>
      <Back>
        <Link to="/">&larr; Back</Link>
      </Back>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>RANK:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>SYMBOL:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>
                {tickersData?.error
                  ? ""
                  : tickersData?.quotes.USD.price.toFixed(2)}
              </span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <h3>TOTAL SUPLY:</h3>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <h3>MAX SUPPLY:</h3>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          {infoData?.error ? null : (
            <>
              <Tabs>
                <Tab active={priceMatch !== null ? "true" : "false"}>
                  <Link to={`/${coinId}/price`}>Price</Link>
                </Tab>
                <Tab active={priceMatch === null ? "true" : "false"}>
                  <Link to={`/${coinId}/chart`}>Chart</Link>
                </Tab>
              </Tabs>
              <Switch>
                <Route path="/:coinId/price">
                  <Price coinId={coinId} />
                </Route>
                <Route path="/:coinId/chart">
                  <Chart coinId={coinId} />
                </Route>
              </Switch>
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default Coin;
