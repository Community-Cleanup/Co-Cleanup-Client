import styled from "styled-components";

//Image is used to style any img elements
export const Image = styled.img`
  margin: ${({ margin }) => margin || "0 0 0 12px"};
  border-radius: ${({ br }) => br || "0"};
  height: ${({ h }) => h || "auto"};
  margin: ${({ margin }) => margin || "0"};
  /* width: 100%; */
  max-width: 600px;

  @media (max-width: 900px) {
    margin: "100px auto 0";
    width: 100%;
  }
`;
