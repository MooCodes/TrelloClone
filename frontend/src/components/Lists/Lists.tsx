import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import List, { IList } from "../List/List";
import { IBoard } from "../Board/Board";
import {
  BoardName,
  ListsContainer,
  ListsHeader,
  ListsInviteButton,
} from "./Lists.styles";
import ListForm from "../ListForm/ListForm";
import { fetchBoards } from "../../services/boards";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ICard } from "../Card/Card";

const Lists = () => {
  const { boardId } = useParams();
  const token = localStorage.getItem("trello-clone-token");
  const [lists, setLists] = useState<IList[]>([]);
  const queryClient = useQueryClient();

  const { data: boards } = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  const query = useQuery({
    queryKey: ["listsAndBoard", boardId],
    queryFn: async () => {
      const [boardResponse, listsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`http://localhost:5000/api/lists/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      return {
        board: boardResponse.data as IBoard,
        lists: listsResponse.data as IList[],
      };
    },
  });

  const listMutation = useMutation({
    mutationFn: ({
      sourceList,
      destinationList,
    }: {
      sourceList: IList;
      destinationList: IList;
    }) => {
      return axios.put(
        `http://localhost:5000/api/lists/${sourceList._id}/${destinationList._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });
    },
  });

  const cardMutation = useMutation({
    mutationFn: ({
      sourceCard,
      destinationCard,
    }: {
      sourceCard: ICard;
      destinationCard: ICard;
    }) => {
      return axios.put(
        `http://localhost:5000/api/cards/${sourceCard._id}/${destinationCard._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: ({ data }) => {
      console.log("data", data.list);
      queryClient.invalidateQueries({ queryKey: ["cards", data.list] });
    },
  });

  const cardMutationToList = useMutation({
    mutationFn: ({ card, list, index }: { card: ICard; list: IList, index: number }) => {
      return axios.put(
        `http://localhost:5000/api/cards/${card._id}/${list._id}/${index}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["cards", data.list] });
    },
  });

  useEffect(() => {
    if (query.data) {
      setLists(query.data.lists);
    }
  }, [query.data]);

  if (query.isLoading) {
    return null;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  if (!query.data) {
    return null;
  }

  if (!boards) {
    return null;
  }

  const boardFromServer = query.data.board;
  const listsFromServer = query.data.lists;

  console.log("board", boardFromServer);
  console.log("lists", listsFromServer);
  console.log("boards", boards);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    console.log("result", result);

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (result.source.droppableId === "lists") {
      // get the correspoinding list via indicies
      const sourceList = lists[sourceIndex];
      const destinationList = lists[destinationIndex];

      if (
        !sourceList ||
        !destinationList ||
        sourceList._id === destinationList._id
      ) {
        return;
      }

      // reorder the lists in our local state
      const reorderedLists = [...lists];

      const [reorderedItem] = reorderedLists.splice(sourceIndex, 1);
      reorderedLists.splice(destinationIndex, 0, reorderedItem);

      reorderedLists.forEach((list, index) => {
        list.index = index;
      });

      setLists(reorderedLists);

      listMutation.mutate({
        sourceList,
        destinationList,
      });

      return;
    }

    // check for if changing cards between the same list
    if (result.source.droppableId === result.destination.droppableId) {
      console.log("moving cards between the same list");
      console.log("sourceIndex", sourceIndex);
      console.log("destinationIndex", destinationIndex);

      // get the corresponding list
      const list = lists.find(
        (list) => list._id === result.destination.droppableId
      ) as IList;
      console.log("list", list);

      if (!list) {
        return;
      }

      const sourceCard = list.cards[sourceIndex];
      const destinationCard = list.cards[destinationIndex];

      const reorderedLists = [...lists];
      console.log("reordedLists", reorderedLists);
      const reorderedCards = [...list.cards];
      console.log("reorderedCards", reorderedCards);
      const [reorderedItem] = reorderedCards.splice(sourceIndex, 1);
      reorderedCards.splice(destinationIndex, 0, reorderedItem);

      reorderedCards.forEach((card, index) => {
        card.index = index;
      });

      const newLists = reorderedLists.map((list) => {
        const newList = { ...list };
        if (list._id === result.source.droppableId) {
          newList.cards = reorderedCards;
        }
        return newList;
      });

      setLists(newLists);

      cardMutation.mutate({
        sourceCard,
        destinationCard,
      });
      return;
    }

    if (result.source.droppableId !== result.destination.droppableId) {
      console.log("moving cards between different lists");

      const sourceList = lists.find(
        (list) => list._id === result.source.droppableId
      ) as IList;
      const destinationList = lists.find(
        (list) => list._id === result.destination.droppableId
      ) as IList;

      console.log("sourceList", sourceList);
      console.log("destinationList", destinationList);

      if (!sourceList || !destinationList) {
        return;
      }

      const sourceCard = sourceList.cards[sourceIndex] as ICard;

      const reorderedLists = [...lists];
      const reorderedSourceCards = [...sourceList.cards];
      const reorderedDestinationCards = [...destinationList.cards];

      const [reorderedItem] = reorderedSourceCards.splice(sourceIndex, 1);
      reorderedDestinationCards.splice(destinationIndex, 0, reorderedItem);
      reorderedSourceCards.forEach((card, index) => {
        card.index = index;
      });
      reorderedDestinationCards.forEach((card, index) => {
        card.index = index;
      });

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

      setLists(newLists);
      console.log("sending different lists mutation");
      // this mutate might not work correctly
      console.log("sourceCard", sourceCard);
      console.log("destinationIndex", destinationIndex);

      cardMutationToList.mutate({
        card: sourceCard,
        list: destinationList,
        index: destinationIndex,
      });
      
      return;
    }

  };

  return (
    <div
      unselectable="on"
      className="unselectable"
      style={{ backgroundColor: "#7B3123" }}
    >
      <ListsHeader>
        <BoardName>{boardFromServer.name}</BoardName>
        <ListsInviteButton>Invite</ListsInviteButton>
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
