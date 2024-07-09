import { useEffect } from "react";
import axios from "axios";
import { BoardsContainer } from "./Boards.styles";
import Board, { IBoard } from "../Board/Board";
import BoardForm from "../BoardForm/BoardForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { setBoards, setBoardsIndex } from "../../redux/slices/boardsSlice";

const Boards = () => {
  const token = localStorage.getItem("trello-clone-token");
  const queryClient = useQueryClient();
  const boards = useAppSelector((state) => state.boards.boards);
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (query.data) {
      dispatch(setBoards(query.data));
    }
  }, [query.data, dispatch]);

  const mutation = useMutation({
    mutationFn: ({
      sourceBoard,
      destinationBoard,
    }: {
      sourceBoard: IBoard;
      destinationBoard: IBoard;
    }) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

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

    dispatch(setBoards(reorderedBoards));

    // update the boards indices values in redux state
    dispatch(setBoardsIndex());

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
