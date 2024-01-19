import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import {
  IGetGenresResult,
  IGetSearchMoviesResult,
  IMovie,
  ITvShow,
  getGenres,
  getSearchMovies,
} from "../api";
import styled from "styled-components";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { makeImagePath } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  margin-top: 190px;
  margin-bottom: 100px;
  position: relative;
`;

const Items = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  row-gap: 20px;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-image: url(${(props) => props.$bgPhoto});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  &:nth-child(8n) {
    transform-origin: right center;
  }
  &:nth-child(9n),
  &:nth-child(1) {
    transform-origin: left center;
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1));
  opacity: 0;
  position: absolute;
  width: 206px;
  height: 80px;
  bottom: 0;
  p {
    text-align: center;
    margin-top: 5px;
    font-size: 12px;
    color: ${(props) => props.theme.white.darker};
  }
  span {
    margin-left: 125px;
    font-size: 10px;
  }
  h4 {
    margin-top: 10px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
  }
  div {
    display: flex;
    position: absolute;
    left: 10px;
    bottom: 10px;
    h3 {
      font-size: 10px;
      margin-right: 5px;
      background-color: #4d4d4d;
      padding: 1px;
      text-align: center;
    }
  }
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

const SwitchType = styled.div`
  display: flex;
  align-items: center;
  height: 200px;
  position: absolute;
  top: -190px;
  left: 40px;
`;

const TypeItem = styled(motion.div)`
  padding: 10px;
  margin-right: 20px;
  border-radius: 20px;
  cursor: pointer;
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.darker};
`;

const SearchText = styled.h2`
  font-size: 25px;
  font-weight: 600;
  position: absolute;
  top: -50px;
  left: 30px;
`;

const BoxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    zIndex: 2,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const typeItemVariants: Variants = {
  hover: {
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "rgba(0,0,0,0.9)",
    transition: {
      duration: 0.3,
      type: "linear",
    },
  },
  active: {
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "rgba(0,0,0,0.9)",
  },
};

function Search() {
  const History = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const type = new URLSearchParams(location.search).get("type");
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(`/search/:movieId`);
  const { data, isLoading } = useQuery<IGetSearchMoviesResult>(
    [`search_${type}`, keyword],
    () => getSearchMovies(keyword ?? "", type ?? "")
  );
  const { data: genresData } = useQuery<IGetGenresResult>(
    [type === "movie" ? "movies" : "tvShows", "genres"],
    () => getGenres("movie")
  );
  const onBoxClicked = (movieId: number) => {
    History.push(`/search/${movieId}?keyword=${keyword}&type=${type}`);
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (data?.results as Array<IMovie | ITvShow>).find(
      (movie: IMovie | ITvShow) => movie.id === +bigMovieMatch.params.movieId
    );
  const closeBigMovie = () => {
    History.push(`/search?keyword=${keyword}&type=${type}`);
  };
  return (
    <Wrapper>
      <SwitchType>
        <TypeItem
          onClick={() => History.push(`/search?keyword=${keyword}&type=movie`)}
          variants={typeItemVariants}
          whileHover="hover"
          animate={type === "movie" ? "active" : ""}
        >
          Movies
        </TypeItem>
        <TypeItem
          onClick={() => History.push(`/search?keyword=${keyword}&type=tv`)}
          variants={typeItemVariants}
          whileHover="hover"
          animate={type === "tv" ? "active" : ""}
        >
          Tv Shows
        </TypeItem>
      </SwitchType>
      <SearchText>"{keyword}" 검색 결과 :</SearchText>
      <Items>
        {!isLoading && data?.results
          ? data?.results.map((movie) => {
              return (
                <Box
                  layoutId={movie.id + ""}
                  onClick={() => onBoxClicked(movie.id)}
                  variants={BoxVariants}
                  key={movie.id}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  $bgPhoto={makeImagePath(movie.poster_path, "w500")}
                >
                  <Info variants={infoVariants}>
                    <h4>
                      {"title" in movie
                        ? movie.title.length > 20
                          ? movie.title.slice(0, 20) + ".."
                          : movie.title
                        : movie.name.length > 20
                        ? movie.name.slice(0, 20) + ".."
                        : movie.name}
                    </h4>
                    <p>
                      평점 : {movie.vote_average.toFixed(1)}/10 (
                      {movie.vote_count})
                    </p>
                    {"release_date" in movie ? (
                      <span>{movie.release_date}</span>
                    ) : null}
                    <div>
                      {genresData?.genres
                        .filter((genres) => movie.genre_ids.includes(genres.id))
                        .slice(0, 3)
                        .map((genres) => (
                          <h3 key={genres.id}>#{genres.name}</h3>
                        ))}
                    </div>
                  </Info>
                </Box>
              );
            })
          : null}
      </Items>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
              }}
              onClick={closeBigMovie}
            />
            <BigMovie layoutId={bigMovieMatch.params.movieId}>
              {clickedMovie && (
                <>
                  <BigCloseButton onClick={closeBigMovie}>
                    <FontAwesomeIcon icon={faXmark} />
                  </BigCloseButton>
                  <BigCover
                    $bgPhoto={makeImagePath(clickedMovie.backdrop_path, "w500")}
                  >
                    <BigPoster
                      $bgPhoto={makeImagePath(clickedMovie.poster_path, "w500")}
                    />
                    <BigTitle>
                      {"title" in clickedMovie
                        ? clickedMovie.title
                        : clickedMovie.name}
                    </BigTitle>
                  </BigCover>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Search;
