import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface ICardProps {
  $isDragging: boolean;
}

const Card = styled.div<ICardProps>`
  position: relative;
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.$isDragging ? "#fd79a8" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.$isDragging ? "2px 3px 3px rgba(0,0,0,0.3)" : "none"};
  transition: background-color 0.3s ease-in-out;
`;

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DragabbleCard({ toDoId, toDoText, index }: IDragabbleCardProps) {
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, info) => (
        <Card
          $isDragging={info.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
