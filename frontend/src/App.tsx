import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import LoginForm from "./components/LoginForm/LoginForm";
import Boards from "./components/Boards/Boards";
import Lists from "./components/Lists/Lists";
import "@fontsource/roboto";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { socket } from "./socket";
import { useEffect } from "react";
import SignupForm from "./components/SignupForm/SignupForm";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'Roboto';
  }
  body, html {
    margin: 0;
    padding: 0;
    background-color: #7B3123;
  }

*.unselectable {
   -moz-user-select: none;
   -khtml-user-select: none;
   -webkit-user-select: none;

   /*
     Introduced in Internet Explorer 10.
     See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
   */
   -ms-user-select: none;
   user-select: none;
  }

`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/boards/:boardId" element={<Lists />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
