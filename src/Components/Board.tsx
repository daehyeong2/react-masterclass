import { Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import styled from "styled-components";

interface IWrapperProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  padding: 20px 10px;
  padding-top: 10px;
  background-color: ${(props) =>
    props.draggingFromThisWith
      ? "#74b9ff"
      : props.isDraggingOver
      ? "#81ecec"
      : props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  transition: 0.2s background-color ease-in-out;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 15px;
`;
const Area = styled.div`
  flex-grow: 1;
`;

interface IBoardProps {
  toDos: string[];
  boardId: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  return (
    <Droppable droppableId={boardId}>
      {(magic, info) => (
        <Wrapper
          isDraggingOver={info.isDraggingOver}
          draggingFromThisWith={Boolean(info.draggingFromThisWith)}
        >
          <Title>{boardId}</Title>
          <Area ref={magic.innerRef} {...magic.droppableProps}>
            {toDos.map((toDo, index) => (
              <DragabbleCard key={toDo} toDo={toDo} index={index} />
            ))}
            {magic.placeholder}
          </Area>
        </Wrapper>
      )}
    </Droppable>
  );
}

export default Board;
