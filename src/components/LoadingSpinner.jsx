import React from "react";
import Spinner from "./Spinner";
import { Container } from "./styled/utility/Container.styled";

function LoadingSpinner() {
  return (
    <Container w="max-content" margin="100px auto 0" talign="center">
      <h1>Please wait</h1>
      <Spinner />
    </Container>
  );
}

export default LoadingSpinner;
