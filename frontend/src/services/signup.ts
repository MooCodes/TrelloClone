import axios from "axios";

const setToken = (newToken: string) => {
  localStorage.setItem("trello-clone-token", newToken);
};

const signup = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(
    "http://localhost:5000/api/users/register",
    {
      email,
      password,
    }
  );

  return response.data;
};

export default { signup, setToken };
