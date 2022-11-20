import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ bg }) => bg || "white"};
  border-radius: ${({ br }) => br || "0"};
  height: ${({ h }) => h || "auto"};
  width: ${({ w }) => w || "400px"};
  margin: ${({ margin }) => margin || "0"};
  padding: ${({ pad }) => pad || "0"};
  position: ${({ position }) => position || "relative"};
  text-align: ${({ talign }) => talign || "left"};
  overflow-y: auto;

  div p {
    margin-bottom: 32px;
  }
`;
