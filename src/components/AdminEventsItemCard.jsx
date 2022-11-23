import React from "react";
import { theme } from "./styled/theme/Theme";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Span } from "./styled/utility/Span.styled";

// AdminEventsItemCard is a self containing component that only takes in props and styles each one accordingly
// It is a wrapper for the CardLg styled component for tidier styling of all the contents (as props) of the events "cards"
// from the immediate parent component of this component
function AdminEventsItemCard(props) {
  return (
    <CardLg margin="10px" maxw="100%" bord="1px solid black">
      <Flex direction="column" align="flex-start" justify="space-between">
        <Flex direction="column" align="flex-end" margin="10px">
          {/* Display the event title from the "title" prop */}
          <Span fs="18px" fw="1000">
            {props.title}
          </Span>
          {/* Display the formatted event date from the "date" prop */}
          <p>
            <Span
              fs="14px"
              fw="800"
              tf="uppercase"
              color={theme.colors.dateText}
            >
              {props.date}
            </Span>
          </p>
          {/* Display the event address from the "address" prop */}
          <p>
            <Span fs="12px" margin="6px 0 0">
              {props.address}
            </Span>
          </p>
        </Flex>

        {/* To the right side of the card, display in a column... */}
        <Flex direction="column" align="center" margin="10px" w="200px">
          {/* Display the components from the "./AdminDeleteEventForm.jsx" component passed in here from the "adminDeleteEventForm" prop */}
          {props.adminDeleteEventForm}
          {/* Display the components from the "./AdminShowComments.jsx" component passed in here from the "adminShowComments" prop */}
          {props.adminShowComments}
        </Flex>
      </Flex>
    </CardLg>
  );
}

export default AdminEventsItemCard;
