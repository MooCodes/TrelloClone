import {
  BoardContainer,
  BoardDeleteButton,
  BoardGoButton,
  BoardHeader,
  BoardTitle,
} from "./Board.styles";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import BoardsService from "../../services/boards";

export interface IBoard {
  _id: string;
  name: string;
}

const Board = ({ _id, name }: IBoard) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: BoardsService.deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });

  const onDelete = () => {
    // delete board
    console.log("clicked delete button");
    mutation.mutate(_id);
  };

  return (
    <BoardContainer>
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
  );
};

export default Board;
