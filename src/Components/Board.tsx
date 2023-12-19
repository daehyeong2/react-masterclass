import { DraggableProvided, Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import styled from "styled-components";
import {
  faEraser,
  faGripLines,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { IToDo, boardState, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

interface IWrapperProps {
  $isDraggingOver: boolean;
  $draggingFromThisWith: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  position: relative;
  padding: 20px 10px;
  padding-top: 10px;
  background-color: ${(props) =>
    props.$draggingFromThisWith
      ? "#74b9ff"
      : props.$isDraggingOver
      ? "#81ecec"
      : props.theme.boardColor};
  &:hover #buttons {
    opacity: 1;
  }
  border-radius: 5px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  transition: 0.2s background-color ease-in-out;
  overflow-y: auto;
  width: 200px;
  height: 200px;
`;
const Title = styled.h2`
  margin-left: 7px;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 15px;
`;
const Area = styled.div`
  flex-grow: 1;
`;
const Form = styled.form`
  position: relative;
  width: 100%;
  button {
    background: none;
    border: none;
    position: absolute;
    right: 6px;
    top: 11px;
    cursor: pointer;
  }
  input {
    width: 100%;
    background-color: #ececec;
    border: 1px rgba(0, 0, 0, 0.3) solid;
    font-weight: 600;
    font-size: 13px;
    outline: none;
    border-radius: 5px;
    padding: 10px 10px;
    margin-bottom: 5px;
  }
`;

const Buttons = styled.div`
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  position: absolute;
  right: 10px;
  top: 10px;
  button {
    padding: 3px 5px;
    background: none;
    border: none;
    transition: background-color 0.1s ease-in-out;
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const RemoveBoard = styled.button`
  cursor: pointer;
`;

const ResetToDos = styled.button`
  cursor: pointer;
`;

const Grab = styled.button`
  cursor: pointer;
`;

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
  parentMagic: DraggableProvided;
}
interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, parentMagic }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const setBoards = useSetRecoilState(boardState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };
  const resetToDos = () => {
    if (!window.confirm(`"${boardId}"의 모든 Task를 삭제 하시겠습니까?`)) {
      return;
    }
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [],
      };
    });
  };
  const removeBoard = () => {
    if (!window.confirm(`"${boardId}"를 삭제 하시겠습니까?`)) {
      return;
    }
    setToDos((allBoards) => {
      const allBoardsCopy = { ...allBoards };
      delete allBoardsCopy[boardId];
      return allBoardsCopy;
    });
    setBoards((allBoards) => {
      return allBoards.filter((v) => v !== boardId);
    });
  };
  return (
    <Droppable droppableId={boardId} type="Board">
      {(magic, info) => (
        <Wrapper
          ref={parentMagic.innerRef}
          {...parentMagic.draggableProps}
          $isDraggingOver={info.isDraggingOver}
          $draggingFromThisWith={Boolean(info.draggingFromThisWith)}
        >
          <Title>{boardId}</Title>
          <Buttons id="buttons">
            <ResetToDos onClick={resetToDos}>
              <FontAwesomeIcon icon={faEraser} />
            </ResetToDos>
            <RemoveBoard onClick={removeBoard}>
              <FontAwesomeIcon icon={faTrashCan} />
            </RemoveBoard>
            <Grab {...parentMagic.dragHandleProps}>
              <FontAwesomeIcon icon={faGripLines} />
            </Grab>
          </Buttons>
          <Area ref={magic.innerRef} {...magic.droppableProps}>
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                toDoId={toDo.id}
                toDoText={toDo.text}
                index={index}
              />
            ))}
            {magic.placeholder}
            <Form onSubmit={handleSubmit(onValid)}>
              <input
                {...register("toDo", { required: true })}
                type="text"
                placeholder={`Add task on ${boardId}`}
                autoComplete="off"
              />
              <button type="submit">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </Form>
          </Area>
        </Wrapper>
      )}
    </Droppable>
  );
}

export default Board;
