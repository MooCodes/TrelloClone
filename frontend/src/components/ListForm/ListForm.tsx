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

interface IListFormProps {
  boardId: string;
}

const ListForm = ({ boardId }: IListFormProps) => {
  const queryClient = useQueryClient();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState("");

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
    onSuccess: () => {
      console.log("success");
      setIsFormVisible(false);
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });

      socket.emit("refreshLists", boardId);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    mutation.mutate();
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
            size="lg"
            icon={faX}
            onClick={() => setIsFormVisible(false)}
          />
        </ListFormButtonContainer>
      </ListFormContainer>
    </div>
  );
};

export default ListForm;
