import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ListFormContainer,
  ListTitleInput,
  ListFormButton,
  ShowListForm,
  ListFormButtonContainer,
  StyledFontAwesomeIcon,
} from "./ListForm.styles";
import { socket } from "../../socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addList, updateNewListId } from "../../redux/slices/listsSlice";
import { IList } from "../List/List";
import useClickOutside from "../../hooks/useClickOutside";
import ListsService from "../../services/lists";

interface IListFormProps {
  boardId: string;
}

const ListForm = ({ boardId }: IListFormProps) => {
  const queryClient = useQueryClient();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState("");

  const lists = useAppSelector((state) => state.lists.lists);
  const dispatch = useAppDispatch();

  const wrapperRef = useClickOutside(() => {
    setIsFormVisible(false);
    setTitle("");
  });

  const mutation = useMutation({
    mutationFn: ListsService.createList,
    onSuccess: (data) => {
      setTitle("");

      dispatch(updateNewListId(data));

      queryClient.refetchQueries({ queryKey: ["listsAndBoard", boardId] });

      socket.emit("refreshLists", boardId);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      return;
    }

    const newList: IList = {
      _id: "0", // need this so droppable wont throw an error
      title,
      cards: [],
      index: lists.length,
      boardId: boardId,
    };

    dispatch(addList(newList));

    mutation.mutate({ title, boardId });

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
    <div ref={wrapperRef}>
      <ListFormContainer onSubmit={handleSubmit}>
        <ListTitleInput
          autoFocus
          placeholder="Enter list title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ListFormButtonContainer>
          <ListFormButton>Add List</ListFormButton>
          <StyledFontAwesomeIcon
            icon={faX}
            onClick={() => {
              setTitle("");
              setIsFormVisible(false);
            }}
          />
        </ListFormButtonContainer>
      </ListFormContainer>
    </div>
  );
};

export default ListForm;
