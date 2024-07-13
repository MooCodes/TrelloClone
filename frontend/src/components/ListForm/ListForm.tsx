import { useRef, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ListFormContainer,
  ListTitleInput,
  ListFormButton,
  ShowListForm,
  ListFormButtonContainer,
  StyledFontAwesomeIcon,
} from "./ListForm.styles";
import axios from "axios";
import { socket } from "../../socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addList, updateNewListId } from "../../redux/slices/listsSlice";
import { IList } from "../List/List";
import { IBoard } from "../Board/Board";

interface IListFormProps {
  boardId: string;
}

interface IListsAndBoard {
  board: IBoard;
  lists: IList[];
}

const ListForm = ({ boardId }: IListFormProps) => {
  const queryClient = useQueryClient();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState("");

  const lists = useAppSelector((state) => state.lists.lists);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFormVisible(false);
        setTitle("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post(
        `http://localhost:5000/api/lists/${boardId}`,
        { title },
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
      console.log("success");
      // queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });

      const oldListsAndBoard = queryClient.getQueryData([
        "listsAndBoard",
        boardId,
      ]) as IListsAndBoard;

      const newListsAndBoard = {
        ...oldListsAndBoard,
        lists: [...oldListsAndBoard.lists, data],
      };

      queryClient.setQueryData(["listsAndBoard", boardId], newListsAndBoard);

      setTitle("");

      console.log("data", data);

      dispatch(updateNewListId(data));

      console.log("lists", lists);

      socket.emit("refreshLists", boardId);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newList: IList = {
      _id: "0", // need this so droppable wont throw an error
      title,
      cards: [],
      index: lists.length,
      boardId: boardId,
    };

    dispatch(addList(newList));

    mutation.mutate();

    setIsFormVisible(false);

    console.log("sending");
  };

  if (!isFormVisible) {
    return (
      <ShowListForm onClick={() => setIsFormVisible(true)}>
        <FontAwesomeIcon icon={faPlus} />
        <span>Add another list</span>
      </ShowListForm>
    );
  }

  return (
    <div style={{ height: "100%" }} ref={wrapperRef}>
      <ListFormContainer onSubmit={handleSubmit}>
        <ListTitleInput
          placeholder="Enter list title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ListFormButtonContainer>
          <ListFormButton>Add List</ListFormButton>
          <StyledFontAwesomeIcon
            icon={faX}
            onClick={() => setIsFormVisible(false)}
          />
        </ListFormButtonContainer>
      </ListFormContainer>
    </div>
  );
};

export default ListForm;
