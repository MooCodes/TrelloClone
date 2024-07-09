import React from "react";
import {
  BoardContainer,
  BoardDeleteButton,
  BoardGoButton,
  BoardHeader,
  BoardTitle,
} from "./Board.styles";
import { useNavigate } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface IBoard {
  _id: string;
  name: string;
  index: number;
}

const Board = ({ _id, name, index }: IBoard) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return axios.delete(`http://localhost:5000/api/boards/${_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });

  const onDelete = () => {
    // delete board
    console.log("clicked delete button");
    mutation.mutate();
  };

  return (
    <Draggable key={_id} draggableId={_id} index={index}>
      {(provided) => (
        <BoardContainer
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <BoardHeader>
            <BoardTitle>{name}</BoardTitle>
          </BoardHeader>

          <div style={{ position: "absolute", bottom: "10px", right: "80px" }}>
            <BoardGoButton onClick={() => navigate(`/boards/${_id}`)}>
              Go To Board
            </BoardGoButton>
          </div>
          <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
            <BoardDeleteButton onClick={onDelete}>Delete</BoardDeleteButton>
          </div>
        </BoardContainer>
      )}
    </Draggable>
  );
};

export default Board;
