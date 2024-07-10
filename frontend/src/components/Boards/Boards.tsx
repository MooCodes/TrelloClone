import { useEffect, useState } from "react";
import { BoardsContainer } from "./Boards.styles";
import Board, { IBoard } from "../Board/Board";
import BoardForm from "../BoardForm/BoardForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { fetchBoards, moveBoard } from "../../services/boards";

const Boards = () => {
  const queryClient = useQueryClient();
  // store the boards as client state for re-rendering when the board is moved and looks good (no lags)
  const [boards, setBoards] = useState([] as IBoard[]);

  const query = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  const mutation = useMutation({
    mutationFn: moveBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  useEffect(() => {
    if (query.data) {
      setBoards(query.data);
    }
  }, [query.data]);

  if (query.isLoading) {
    return null;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    // swap the source index in the database with the destination index
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // get the corresponding board via indicies
    const sourceBoard = boards[sourceIndex];
    const destinationBoard = boards[destinationIndex];

    console.log("result", result);

    if (
      !sourceBoard ||
      !destinationBoard ||
      sourceBoard._id === destinationBoard._id
    ) {
      return;
    }

    // reorder the boards in our local state
    const reorderedBoards = [...boards];

    const [reorderedItem] = reorderedBoards.splice(sourceIndex, 1);
    reorderedBoards.splice(destinationIndex, 0, reorderedItem);

    // update the indicies in the client board state
    reorderedBoards.forEach((board, index) => {
      board.index = index;
    });

    setBoards(reorderedBoards);

    mutation.mutate({
      sourceBoard,
      destinationBoard,
    });
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="boards" direction="horizontal" type="board">
          {(provided) => (
            <BoardsContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {boards.map((board: IBoard) => (
                <Board key={board._id} {...board} />
              ))}
              {provided.placeholder}
              <BoardForm></BoardForm>
            </BoardsContainer>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Boards;
