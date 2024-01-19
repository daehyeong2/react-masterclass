import { AnimatePresence, Variants, motion } from "framer-motion";
import styled from "styled-components";
import useWindowDimensions from "../useWindowDimensions";
import { useState } from "react";
import { IGenres, IGetGenresResult, IMovie, ITvShow } from "../api";
import { useHistory } from "react-router-dom";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  width: 100vw;
  height: 300px;
  margin-bottom: 90px;
`;

const Slider = styled.div`
  position: relative;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-image: url(${(props) => props.$bgPhoto});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  justify-content: center;
  height: 300px;
  cursor: pointer;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(8, 1fr);
  width: 100vw;
  padding-right: 15px;
  position: absolute;
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
    align-items: center;
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

const SliderTitle = styled.h2`
  position: absolute;
  top: -45px;
  left: 5px;
  z-index: 0;
  font-size: 30px;
  color: white;
`;

const PagingButton = styled(motion.div)`
  position: absolute;
  width: 50px;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 20px;
    fill: ${(props) => props.theme.white.lighter};
  }
`;

const RowVariants: Variants = {
  initial: ({ isBack, width }) => ({
    x: isBack ? -width - 5 : width + 5,
  }),
  animate: {
    x: 0,
  },
  exit: ({ isBack, width }) => ({
    x: isBack ? width + 5 : -width - 5,
  }),
};

const BoxVariants: Variants = {
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

interface ISliderProps {
  data: IMovie[] | ITvShow[];
  type: string;
  title: string;
  genresData?: IGenres[];
}

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

const pagingButtonVariants: Variants = {
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const offset = 8;

function SliderComponents({ data, title, genresData, type }: ISliderProps) {
  const History = useHistory();
  const width = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isBack, setIsBack] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data.length - 1;
      const maxIndex = Math.floor(totalMovies / offset);
      setTimeout(() => {
        setIsBack(false);
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }, 10);
    }
  };

  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data.length;
      const maxIndex = Math.floor(totalMovies / offset);
      setTimeout(() => {
        setIsBack(true);
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }, 10);
    }
  };

  const onBoxClicked = (movieId: number) => {
    setIsHover(false);
    if (type === "movie") {
      History.push(`/movies/${movieId}`);
    } else {
      History.push(`/tv/${movieId}`);
    }
  };
  return (
    <Wrapper>
      <Slider>
        <SliderTitle>{title}</SliderTitle>
        <AnimatePresence
          initial={false}
          onExitComplete={() => setLeaving(false)}
          custom={{ isBack, width }}
        >
          {
            <Row
              custom={{ isBack, width }}
              variants={RowVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onHoverStart={() => setIsHover(true)}
              onHoverEnd={() => setIsHover(false)}
              transition={{ type: "tween", duration: 0.7 }}
              key={index}
            >
              <AnimatePresence>
                {isHover && !leaving ? (
                  <>
                    <PagingButton
                      variants={pagingButtonVariants}
                      initial={{
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px",
                        left: 0,
                        opacity: 0,
                      }}
                      animate="animate"
                      exit="exit"
                      onClick={decreaseIndex}
                    >
                      <svg viewBox="0 0 320 512">
                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                      </svg>
                    </PagingButton>
                    <PagingButton
                      variants={pagingButtonVariants}
                      initial={{
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px",
                        right: "19px",
                        opacity: 0,
                      }}
                      animate="animate"
                      exit="exit"
                      onClick={increaseIndex}
                    >
                      <svg viewBox="0 0 320 512">
                        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                      </svg>
                    </PagingButton>
                  </>
                ) : null}
              </AnimatePresence>
              {data
                ?.slice(offset * index, offset * index + offset)
                .map((movie, index) => (
                  <Box
                    initial={{
                      transformOrigin:
                        index === 0
                          ? "left center"
                          : index === 7
                          ? "right center"
                          : "",
                      scale: 1,
                    }}
                    layoutId={movie.id + ""}
                    onClick={() => onBoxClicked(movie.id)}
                    variants={BoxVariants}
                    key={movie.id}
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    $bgPhoto={makeImagePath(movie.poster_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>
                        {"title" in movie
                          ? movie.title.length
                            ? movie.title.slice(0, 20) + "..."
                            : movie.title
                          : movie.name.length
                          ? movie.name.slice(0, 20) + "..."
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
                        {genresData
                          ?.filter((genres) =>
                            movie.genre_ids.includes(genres.id)
                          )
                          .slice(0, 3)
                          .map((genres) => (
                            <h3 key={genres.id}>#{genres.name}</h3>
                          ))}
                      </div>
                    </Info>
                  </Box>
                ))}
            </Row>
          }
        </AnimatePresence>
      </Slider>
    </Wrapper>
  );
}

export default SliderComponents;
