import { Link } from "react-router-dom";
import styled from "styled-components";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { fetchCoins } from "../api";
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
`;

const CoinsList = styled.ul`
  margin-top: 30px;
`;

const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  margin-bottom: 10px;
  border-radius: 15px;
  position: relative;
  a {
    transition: color 0.15s ease-in-out;
    display: flex;
    padding: 20px;
    align-items: center;
    &:first-child:hover {
      color: ${(props) => props.theme.accentColor};
    }
    &:last-child:hover {
      color: ${(props) => props.theme.accentColor};
    }
  }
  svg {
    font-size: 20px;
  }
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const Loader = styled.h3`
  margin-top: 40px;
  text-align: center;
`;

const CoinImage = styled.img`
  margin-right: 10px;
  width: 30px;
  height: 30px;
`;

const ChartLink = styled.div`
  position: absolute;
  top: 21px;
  right: 20px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    padding: 0;
  }
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
  return (
    <Container>
      <Helmet>
        <title>Coins</title>
      </Helmet>
      <Header>
        <Title>Coins</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}/price`,
                  state: {
                    name: coin.name,
                  },
                }}
              >
                <CoinImage
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
              <ChartLink>
                <Link
                  to={{
                    pathname: `/${coin.id}/chart`,
                    state: {
                      name: coin.name,
                    },
                  }}
                >
                  <FontAwesomeIcon
                    icon={faChartSimple as IconProp}
                  ></FontAwesomeIcon>
                </Link>
              </ChartLink>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
