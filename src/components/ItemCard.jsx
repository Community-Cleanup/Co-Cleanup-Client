import React from "react";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { theme } from "./styled/theme/Theme";
import { CardSm } from "./styled/utility/CardSm.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Span } from "./styled/utility/Span.styled";
import { Button } from "./styled/elements/Button.styled";
// utils functions
import { formatDate } from "../utils/formatDate";

// this component is used to display events on the user account page
// Using the && operator, there is opportunity to display three buttons if needed
// button text and onClick() function can be passed in props
// styled components are passed props to help fine tune different css properties
function ItemCard(props) {
  return (
    <CardSm w="100%">
      <FlexRow align="flex-start" justify="space-between">
        <div>
          <h4>{props.title}</h4>
          <p>
            <Span
              fs="12px"
              fw="600"
              tf="uppercase"
              color={theme.colors.dateText}
            >
              {formatDate(props.date)}
            </Span>
          </p>
          <p>
            <Span fs="12px" margin="6px 0 0">
              {props.address}
            </Span>
          </p>
        </div>

        {/* Buttons sections - each button is displayed if props are passed */}
        <Flex direction="column" align="flex-end">
          {props.button1Text && (
            <Button
              w="70px"
              margin="0 0 4px"
              pad="6px 0px"
              bg={props.button1Color}
              onClick={props.button1Function}
            >
              {props.button1Text}
            </Button>
          )}
          {props.button2Text && (
            <Button
              w="70px"
              margin="0 0 4px"
              pad="6px 0px"
              bg={props.button2Color}
              onClick={props.button2Function}
            >
              {props.button2Text}
            </Button>
          )}
          {props.button3Text && (
            <Button
              w="70px"
              margin="0 0 4px"
              pad="6px 0px"
              bg={props.button3Color}
              onClick={props.button3Function}
            >
              {props.button3Text}
            </Button>
          )}
        </Flex>
      </FlexRow>
    </CardSm>
  );
}

export default ItemCard;
