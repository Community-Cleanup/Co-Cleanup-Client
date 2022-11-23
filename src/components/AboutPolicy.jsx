import React from "react";
// React JSX Components
import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
// styled components saved in the utilities folder apply styling to containers
import { theme } from "./styled/theme/Theme";
import { Margin } from "./styled/utility/Margin.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Span } from "./styled/utility/Span.styled";

// styled components are passed props to help fine tune different css properties
function AboutPolicy(props) {
  return (
    <PageTitle title={props.heading}>
      <NavBar />
      <Flex direction="column" align="none" justify="space-between" minh="85vh">
        <Margin>
          <CardLg bg={theme.colors.cardTwo}>
            <Margin>
              <h1>{props.heading}</h1>
              {/* Page information data is passed through props*/}
              {/* The data file can be viewed at data/aboutPolicies.js */}
              {props.text.map((item) => {
                return (
                  <div>
                    <h2>{item[0]}</h2>
                    <p>
                      <Span margin="0 0 0 0">{item[1]}</Span>
                    </p>
                  </div>
                );
              })}
            </Margin>
          </CardLg>
        </Margin>
      </Flex>
      <Footer />
    </PageTitle>
  );
}

export default AboutPolicy;
