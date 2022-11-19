import styled from "styled-components";

export const CenteredContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  width: ${({ w }) => w || "400px"};
  margin: 150px auto;
  padding: 36px;
  display: flex;
  flex-direction: column;

  div {
    text-align: center;
  }
  div p {
    margin-bottom: 32px;
  }
`;
