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

  const mutation = useMutation({
    mutationFn: ({ sourceList, destinationList }: { sourceList: IList; destinationList: IList }) => {
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

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // get the correspoinding list via indicies
    const sourceList = lists[sourceIndex];
    const destinationList = lists[destinationIndex];

    console.log("result", result);

    if (!sourceList || !destinationList || sourceList._id === destinationList._id) {
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

    mutation.mutate({
      sourceList,
      destinationList,
    });
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
