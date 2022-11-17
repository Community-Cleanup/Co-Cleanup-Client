import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ bg }) => bg || "white"};
  width: 100%;
  padding: 100px 5%;
`;
