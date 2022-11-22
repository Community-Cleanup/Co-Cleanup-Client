import styled from "styled-components";

// CardLg is used for large cards with curved corners, used for the EventForm and UserAccount component 
export const CardLg = styled.div`
  background-color: ${({ bg }) => bg || "white"};
  margin: ${({ margin }) => margin || "0"};
  border-radius: 6px;
  width: ${({ w }) => w || "auto"};
  height: ${({ h }) => h || "auto"};
  padding: ${({ pad }) => pad || "16px"};
`;
