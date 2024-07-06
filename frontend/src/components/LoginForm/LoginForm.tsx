import { useState } from "react";
import { FormContainer, Form, Input, Button } from "./LoginForm.styles";
import { useNavigate } from "react-router-dom";
import LoginService from "../../services/login";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await LoginService.login({
        email,
        password,
      })

      const { token } = response;

      LoginService.setToken(token);

      navigate(`/boards`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormContainer>
      <h2 style={{ color: "#fff", fontSize: "24px", marginBottom: "20px" }}>
        Login
      </h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Log In</Button>
      </Form>
    </FormContainer>
  );
};

export default LoginForm;
