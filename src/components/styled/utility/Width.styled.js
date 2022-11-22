import styled from "styled-components";

export const Width = styled.div`
  width: ${({ w }) => w || "50%"};
  text-align: ${({ talign }) => talign || "left"};

  @media (max-width: 900px) {
    width: 100%;
  }
`;
