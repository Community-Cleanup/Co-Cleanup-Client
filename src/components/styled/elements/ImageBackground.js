import styled from "styled-components";

export const ImageBackground = styled.div`
  background-image: url(${({ url }) => url});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 300px;
  width: 100%;
  /* flex: 1; */

  /* @media (max-width: 900px) {
    height: 200px;
    width: 100%;
    margin: 10px auto;
  } */
`;
