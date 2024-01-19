import { useQuery } from "react-query";
import {
  IGetGenresResult,
  IGetTvShowsResult,
  ITvShow,
  getGenres,
  getTvShows,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import SliderComponents from "../Components/Slider";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 250px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: 600;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 70%;
  line-height: 130%;
`;

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 10vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
`;

const BigCover = styled.div<{ $bgPhoto: string }>`
  border-radius: 10px 10px 0 0;
  background-size: cover;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.15),
      ${(props) => props.theme.black.darker}
    ),
    url(${(props) => props.$bgPhoto});
  background-position: center center;
  position: relative;
  padding: 40px 20px;
  width: 100%;
  height: 40vh;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: absolute;
  left: 225px;
  bottom: 35px;
  font-size: 28px;
  font-weight: 600;
`;

const BigCloseButton = styled.button`
  position: absolute;
  z-index: 99;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.black.darker};
  color: ${(props) => props.theme.white.lighter};
`;

const BigOverview = styled.p`
  padding: 10px;
  font-size: 16px;
  line-height: 160%;
`;
const BigPoster = styled.div<{ $bgPhoto: string }>`
  width: 200px;
  height: 300px;
  background-size: cover;
  background-image: url(${(props) => props.$bgPhoto});
  background-position: center center;
`;
const Play = styled.div`
  height: 45px;
  background-color: white;
  color: black;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  margin-top: 30px;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  svg {
    font-size: 26px;
    margin-right: 13px;
  }
`;
const MoreInfo = styled(motion.div)`
  background-color: #4d4d4d;
  color: white;
  width: 200px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  margin-top: 30px;
  cursor: pointer;
  border-radius: 5px;
  svg {
    border: 2px solid white;
    border-radius: 50%;
    padding: 5px;
    width: 17px;
    font-size: 16px;
    margin-right: 13px;
  }
`;
const Buttons = styled.div`
  display: flex;
`;

function Home() {
  const History = useHistory();
  const bigTvShowMatch = useRouteMatch<{ tvShowId: string }>("/tv/:tvShowId");
  const [tvShowData, setTvShowData] = useState<ITvShow[]>([]);
  const [dayTvShows, setDayTvShows] = useState<ITvShow[]>([]);
  const [weekTvShows, setWeekTvShows] = useState<ITvShow[]>([]);

  const { data: dayData, isLoading: dayLoading } = useQuery<IGetTvShowsResult>(
    ["tvShows", "day"],
    () => getTvShows("day")
  );

  const { data: weekData, isLoading: weekLoading } =
    useQuery<IGetTvShowsResult>(["tvShows", "week"], () => getTvShows("week"));

  const { data: genresData, isLoading: genresLoading } =
    useQuery<IGetGenresResult>(["tvShows", "genres"], () => getGenres("tv"));

  const loading = dayLoading && weekLoading && genresLoading;

  useEffect(() => {
    if (!loading && dayData && weekData) {
      const tempMovieData: ITvShow[] = [];
      tempMovieData.push(...dayData.results);
      setDayTvShows(dayData.results.slice(1));
      const filteredWeekData = weekData.results.filter(
        (tvShow) => !tempMovieData.some((item) => item.id === tvShow.id)
      );
      if (filteredWeekData) {
        tempMovieData.push(...filteredWeekData);
        setWeekTvShows(filteredWeekData);
      }
      setTvShowData(tempMovieData);
    }
  }, [loading, dayData, weekData]);

  const clickedMovie =
    bigTvShowMatch?.params.tvShowId &&
    tvShowData.find((tv) => tv.id === +bigTvShowMatch.params.tvShowId);
  const closeBigMovie = () => {
    History.push("/tv");
  };
  const onClickMoreInfo = () => {
    History.push(`/tv/${dayData?.results[0].id}`);
  };
  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {dayData?.results && dayData?.results.length > 0 ? (
            <Banner
              $bgPhoto={makeImagePath(dayData?.results[0].backdrop_path || "")}
            >
              <Title>
                {dayData?.results &&
                  dayData?.results.length > 0 &&
                  dayData?.results[0].name}
              </Title>
              <Overview>
                {dayData?.results &&
                  dayData?.results.length > 0 &&
                  dayData?.results[0].overview}
              </Overview>
              <Buttons>
                <Play>
                  <FontAwesomeIcon icon={faPlay} />
                  재생
                </Play>
                <MoreInfo
                  layoutId={dayData?.results[0].id + ""}
                  onClick={onClickMoreInfo}
                >
                  <FontAwesomeIcon icon={faInfo} />
                  상세 정보
                </MoreInfo>
              </Buttons>
            </Banner>
          ) : (
            <Banner $bgPhoto="null" />
          )}

          <SliderComponents
            genresData={genresData?.genres ?? []}
            type="tv"
            data={dayTvShows ?? []}
            title="오늘 인기 있는 TV 프로그램"
          />

          <SliderComponents
            genresData={genresData?.genres ?? []}
            type="tv"
            data={weekTvShows ?? []}
            title="이번 주에 인기 있는 TV 프로그램"
          />

          <AnimatePresence>
            {bigTvShowMatch ? (
              <>
                <Overlay
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "fixed",
                  }}
                  onClick={closeBigMovie}
                />
                <BigMovie layoutId={bigTvShowMatch.params.tvShowId}>
                  {clickedMovie && (
                    <>
                      <BigCloseButton onClick={closeBigMovie}>
                        <FontAwesomeIcon icon={faXmark} />
                      </BigCloseButton>
                      <BigCover
                        $bgPhoto={makeImagePath(
                          clickedMovie.backdrop_path,
                          "w500"
                        )}
                      >
                        <BigPoster
                          $bgPhoto={makeImagePath(
                            clickedMovie.poster_path,
                            "w500"
                          )}
                        />
                        <BigTitle>{clickedMovie.name}</BigTitle>
                      </BigCover>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
