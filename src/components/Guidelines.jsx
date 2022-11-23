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
// guidelines.js stores all the text & links data
import { guidelines } from "../data/guidelines";

// styled components are passed props to help fine tune different css properties
function Guidelines() {
  const { title, text, points, links } = guidelines;
  return (
    <PageTitle title="Event Guidelines">
      <NavBar />
      <Flex direction="column" align="none" justify="space-between" minh="85vh">
        <Margin>
          <CardLg bg={theme.colors.cardTwo}>
            <Margin>
              <h1>{title}</h1>
              <div>
                <p>
                  <Span fw="600" margin="0 0 16px 0">
                    {text[0]}
                  </Span>
                </p>
                <Margin margin="0 4%">
                  <ul>
                    {/* points text is mapped over and displayed as a list */}
                    {points.map((item) => {
                      return <li>{item}</li>;
                    })}
                  </ul>
                </Margin>
                <p>
                  <Span fw="600" margin="28px 0 16px 0">
                    {text[1]}
                  </Span>
                </p>
                <Margin margin="0 4%">
                  <ul>
                    {/* links are mapped over and dispalyed as a list */}
                    {links.map((link) => {
                      return (
                        <li>
                          <a
                            href={link}
                            target="__blank"
                            rel="noopener noreferrer"
                          >
                            <Span
                              margin="0 0 4px 0"
                              color={theme.colors.signLink}
                            >
                              {link}
                            </Span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </Margin>
              </div>
            </Margin>
          </CardLg>
        </Margin>
      </Flex>
      <Footer />
    </PageTitle>
  );
}

export default Guidelines;
