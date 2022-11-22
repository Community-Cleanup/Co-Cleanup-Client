import styled from "styled-components";

// Used to set the width of a container
export const Width = styled.div`
  width: ${({ w }) => w || "50%"};
  text-align: ${({ talign }) => talign || "left"};

  @media (max-width: 900px) {
    width: 100%;
  }
`;
