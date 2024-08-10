import { useState } from "react";
import {
  BoardFormContainer,
  BoardTitleInput,
  BoardAddButton,
} from "./BoardForm.styles";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import BoardsService from "../../services/boards";

const BoardForm = () => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: BoardsService.createBoard,
    onSuccess: () => {
      setName("");
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate(name);
  };

  return (
    <>
      <BoardFormContainer onSubmit={handleSubmit}>
        <BoardTitleInput
          placeholder="Enter board title..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <BoardAddButton>Create</BoardAddButton>
      </BoardFormContainer>
    </>
  );
};

export default BoardForm;
