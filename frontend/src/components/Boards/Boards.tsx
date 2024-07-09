import { useEffect, useState } from "react";
import axios from "axios";
import { BoardsContainer } from "./Boards.styles";
import Board, { IBoard } from "../Board/Board";
import BoardForm from "../BoardForm/BoardForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Boards = () => {
  const token = localStorage.getItem("trello-clone-token");
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/boards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  const [boards, setBoards] = useState<IBoard[]>(query.data || []);

  useEffect(() => {
    setBoards(query.data || []);
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: ({
      sourceBoard,
      destinationBoard,
    }: {
      sourceBoard: IBoard;
      destinationBoard: IBoard;
    }) => {
      console.log("sourceBoard", sourceBoard);
      console.log("destinationBoard", destinationBoard);
      return axios.put(
        `http://localhost:5000/api/boards/${sourceBoard._id}/${destinationBoard._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "trello-clone-token"
            )}`,
          },
        }
      );
    },
    onSuccess: ({ data }) => {
      console.log(data);
      const boards = queryClient.getQueryData(["boards"]) as IBoard[];
      queryClient.setQueryData(
        ["boards"],
        boards.map((b) => (b._id === data._id ? data : b))
      );
    },
  });

  if (query.isLoading) {
    return null;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  console.log("boards", boards);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    console.log(result);

    // swap the source index in the database with the destination index
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // get the corresponding board via indicies
    const sourceBoard = boards[sourceIndex];
    const destinationBoard = boards[destinationIndex];

    console.log("result", result);

    if (!sourceBoard || !destinationBoard) {
      return;
    }

    if (sourceIndex === destinationIndex) {
      return;
    }

    const reorderedBoards = [...boards];

    const [reorderedItem] = reorderedBoards.splice(sourceIndex, 1);
    reorderedBoards.splice(destinationIndex, 0, reorderedItem);

    // set the index for each board to the new index
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
