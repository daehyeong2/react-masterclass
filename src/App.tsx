import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { boardState, toDoState } from "./atoms";
import Board from "./Components/Board";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Wrapper = styled.div`
  margin-top: 50px;
  margin-left: 80px;
`;

const Boards = styled.div`
  display: flex;
  width: 100%;
`;

interface ITrashCanProps {
  $isDraggingOver: boolean;
}

const TrashCan = styled.div<ITrashCanProps>`
  position: fixed;
  font-size: 33px;
  right: 20px;
  bottom: 20px;
  background-color: ${(props) => (props.$isDraggingOver ? "white" : "red")};
  padding: 10px;
  border-radius: 10px;
  color: ${(props) => (props.$isDraggingOver ? "red" : "white")};
  scale: ${(props) => (props.$isDraggingOver ? "1.5" : "1")};
  transition: all 0.1s ease-in-out;
`;

const CreateBoard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 200px;
  background-color: #ececec;
  border-radius: 5px;
  font-size: 30px;
  #addButton {
    height: 100%;
    width: 100%;
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
  }
`;

const Form = styled.form`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  input {
    display: flex;
    background: none;
    border: none;
    border-bottom: 1px solid black;
    width: 130px;
    font-size: 18px;
    text-align: center;
    outline: none;
  }
  div {
    position: absolute;
    display: flex;
    justify-content: space-around;
    width: 100px;
    right: 10px;
    bottom: 10px;
    button {
      color: white;
      border: none;
      cursor: pointer;
    }
    button:first-child {
      background-color: red;
    }
    button:last-child {
      background-color: green;
    }
  }
  span {
    margin-top: 5px;
    font-size: 16px;
  }
`;

interface IForm {
  boardName: string;
}

const Title = styled.h1`
  font-size: 30px;
  margin-top: 50px;
  margin-left: 40px;
  font-weight: 600;
  color: white;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [boards, setBoards] = useRecoilState(boardState);
  const {
    register,
    setValue,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors },
  } = useForm<IForm>();
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    localStorage.setItem("toDos", JSON.stringify(toDos));
  }, [toDos]);
  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination.droppableId === "Boards") {
      setBoards((allBoards) => {
        const allBoardsCopy = [...allBoards];
        const board = allBoardsCopy[source.index];
        allBoardsCopy.splice(source.index, 1);
        allBoardsCopy.splice(destination.index, 0, board);
        return allBoardsCopy;
      });
      return;
    }
    if (destination?.droppableId === "trashCan") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
      return;
    }
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoardCopy = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];
        const taskObj = sourceBoardCopy[source.index];
        sourceBoardCopy.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoardCopy,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  const onValid = ({ boardName }: IForm) => {
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardName]: [],
      };
    });
    setBoards((allBoards) => {
      return [...allBoards, boardName];
    });
    setValue("boardName", "");
    setFlip(false);
  };
  const onClick = () => {
    setFlip((current) => !current);
    setTimeout(() => {
      setFocus("boardName");
    }, 10);
  };
  const Cancel = () => {
    setFlip(false);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Title>할 일</Title>
      <Wrapper>
        <Droppable direction="horizontal" droppableId="Boards" type="Boards">
          {(magic) => (
            <Boards ref={magic.innerRef} {...magic.droppableProps}>
              {boards.map((boardId, index) => (
                <Draggable key={boardId} index={index} draggableId={boardId}>
                  {(magic) => (
                    <Board
                      parentMagic={magic}
                      toDos={toDos[boardId]}
                      boardId={boardId}
                    />
                  )}
                </Draggable>
              ))}
              {magic.placeholder}
              <CreateBoard>
                {flip ? (
                  <Form onSubmit={handleSubmit(onValid)}>
                    <input
                      {...register("boardName", {
                        required: true,
                        validate: (value) =>
                          boards.includes(value)
                            ? "이미 사용 중인 이름 입니다."
                            : true,
                      })}
                      placeholder="Board Name"
                      autoComplete="off"
                    />
                    <span>{errors.boardName?.message}</span>
                    <div>
                      <button type="button" onClick={Cancel}>
                        Cancel
                      </button>
                      <button type="submit">Add</button>
                    </div>
                  </Form>
                ) : (
                  <button id="addButton" onClick={onClick}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                )}
              </CreateBoard>
            </Boards>
          )}
        </Droppable>
      </Wrapper>
      <Droppable droppableId="trashCan" type="Board">
        {(magic, info) => (
          <TrashCan
            $isDraggingOver={info.isDraggingOver}
            {...magic.droppableProps}
            ref={magic.innerRef}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </TrashCan>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
