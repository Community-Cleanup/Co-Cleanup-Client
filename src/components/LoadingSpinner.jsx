import React from "react";
import Spinner from "./Spinner";
import { Container } from "./styled/utility/Container.styled";

// LoadingSpinner is displayed when the app is waiting for async functions to complete
// styled components are passed props to help fine tune different css properties
function LoadingSpinner() {
  return (
    <Container w="max-content" margin="100px auto 0" talign="center">
      <h1>Please wait</h1>
      <Spinner />
    </Container>
  );
}

export default LoadingSpinner;
