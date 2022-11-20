import styled from "styled-components";

export const Banner = styled.div`
  background-color: ${({ bg }) => bg || "white"};
  width: 100%;
  padding: 100px 5%;

  @media (max-width: 900px) {
    padding: 50px 5%;
  }
`;
