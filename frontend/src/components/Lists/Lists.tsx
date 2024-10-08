import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import List, { IList } from "../List/List";
import { IBoard } from "../Board/Board";
import { BoardName, ListsContainer, ListsHeader } from "./Lists.styles";
import ListForm from "../ListForm/ListForm";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ICard } from "../Card/Card";
import AddUser from "../AddUser/AddUser";
import { socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setLists,
  updateCardsIndex,
  updateListsIndex,
} from "../../redux/slices/listsSlice";
import BoardsService from "../../services/boards";
import ListsService from "../../services/lists";

export interface IListsAndBoard {
  board: IBoard;
  lists: IList[];
}

const Lists = () => {
  const { boardId } = useParams();
  const queryClient = useQueryClient();

  const lists = useAppSelector((state) => state.lists.lists);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("emitting joinRoom event");
    socket.emit("joinRoom", boardId);

    socket.on("refreshLists", () => {
      console.log("refreshing list");

      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });
    });
  }, [boardId, queryClient]);

  const query = useQuery({
    queryKey: ["listsAndBoard", boardId],
    queryFn: async () => {
      const [boardResponse, listsResponse] = await Promise.all([
        BoardsService.getBoard(boardId!),
        ListsService.getLists(boardId!),
      ]);

      return {
        board: boardResponse as IBoard,
        lists: listsResponse as IList[],
      };
    },
  });

  const listMoveMutation = useMutation({
    mutationFn: ListsService.moveList,
    onSuccess: () => {
      socket.emit("refreshLists", boardId);
    },
  });

  const cardMoveMutation = useMutation({
    mutationFn: ListsService.moveCard,
    onSuccess: () => {
      socket.emit("refreshLists", boardId);
    },
  });

  const cardMoveToListMutation = useMutation({
    mutationFn: ListsService.moveCardToList,
    onSuccess: () => {
      socket.emit("refreshLists", boardId);
    },
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setLists(query.data.lists));
    }
  }, [query.data, dispatch]);

  if (query.isLoading) {
    return null;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  if (!query.data) {
    return null;
  }

  const boardFromServer = query.data.board;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }

    console.log("result", result);

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (result.source.droppableId === "lists") {
      // if dragging lists

      // get the corresponding list
      const sourceList = lists[sourceIndex];

      if (!sourceList || sourceIndex === destinationIndex) {
        return;
      }

      // reorder the lists in our local state
      const reorderedLists = [...lists];

      console.log("reorderedLists", reorderedLists);

      const [reorderedItem] = reorderedLists.splice(sourceIndex, 1);
      reorderedLists.splice(destinationIndex, 0, reorderedItem);

      dispatch(setLists(reorderedLists));
      dispatch(updateListsIndex());

      listMoveMutation.mutate({
        listId: sourceList._id,
        index: destinationIndex,
      });
    } else if (result.source.droppableId === result.destination.droppableId) {
      // if dragging cards between the same list
      console.log("moving cards between the same list");

      // get the corresponding list
      const list = lists.find(
        (list) => list._id === result.destination.droppableId
      ) as IList;

      if (!list) {
        return;
      }

      const sourceCard = list.cards[sourceIndex];

      const reorderedLists = [...lists];
      const reorderedCards = [...list.cards];
      const [reorderedItem] = reorderedCards.splice(sourceIndex, 1);
      reorderedCards.splice(destinationIndex, 0, reorderedItem);

      const newLists = reorderedLists.map((list) => {
        const newList = { ...list };
        if (list._id === result.source.droppableId) {
          newList.cards = reorderedCards;
        }
        return newList;
      });

      dispatch(setLists(newLists));
      dispatch(updateCardsIndex());

      cardMoveMutation.mutate({
        cardId: sourceCard._id,
        index: destinationIndex,
      });
    } else if (result.source.droppableId !== result.destination.droppableId) {
      // if changing cards between different lists
      console.log("moving cards between different lists");

      const sourceList = lists.find(
        (list) => list._id === result.source.droppableId
      ) as IList;
      const destinationList = lists.find(
        (list) => list._id === result.destination.droppableId
      ) as IList;

      if (!sourceList || !destinationList) {
        return;
      }

      const sourceCard = sourceList.cards[sourceIndex] as ICard;

      const reorderedLists = [...lists];
      const reorderedSourceCards = [...sourceList.cards];
      const reorderedDestinationCards = [...destinationList.cards];

      const [reorderedItem] = reorderedSourceCards.splice(sourceIndex, 1);
      reorderedDestinationCards.splice(destinationIndex, 0, reorderedItem);

      const newLists = reorderedLists.map((list) => {
        const newList = { ...list };
        if (list._id === result.source.droppableId) {
          newList.cards = reorderedSourceCards;
        }
        if (list._id === result.destination.droppableId) {
          newList.cards = reorderedDestinationCards;
        }
        return newList;
      });

      dispatch(setLists(newLists));
      dispatch(updateCardsIndex());

      cardMoveToListMutation.mutate({
        cardId: sourceCard._id,
        listId: destinationList._id,
        index: destinationIndex,
      });
    }
  };

  return (
    <div
      unselectable="on"
      className="unselectable"
      style={{ backgroundColor: "#7B3123", width: "100%" }}
    >
      <ListsHeader>
        <BoardName>{boardFromServer.name}</BoardName>
        <AddUser boardId={boardFromServer._id} />
      </ListsHeader>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="lists" direction="horizontal">
          {(provided) => (
            <ListsContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((list: IList) => (
                <List
                  key={list._id}
                  _id={list._id}
                  title={list.title}
                  cards={list.cards}
                  index={list.index}
                  boardId={boardFromServer._id}
                />
              ))}
              {provided.placeholder}
              <ListForm boardId={boardFromServer._id} />
            </ListsContainer>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Lists;
