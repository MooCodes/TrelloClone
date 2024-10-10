import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormContainer,
  Form,
  Input,
  Button,
  ButtonContainer,
} from "./SignupForm.styles";
import SignupService from "../../services/signup";

const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await SignupService.signup({
        email,
        password,
      });

      const { token } = response;

      console.log(token);

      SignupService.setToken(token);

      navigate(`/boards`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormContainer>
      <h2 style={{ color: "#fff", fontSize: "24px", marginBottom: "20px" }}>
        Sign Up
      </h2>
      <Form onSubmit={handleSubmit}>
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
        <ButtonContainer>
          <Button type="submit">Sign Up</Button>
          <Button onClick={() => navigate("/login")}>
            Already have an account?
          </Button>
        </ButtonContainer>
      </Form>
    </FormContainer>
  );
};

export default SignupForm;
