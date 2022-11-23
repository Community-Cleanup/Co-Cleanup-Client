import React from "react";
import { theme } from "./styled/theme/Theme";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Span } from "./styled/utility/Span.styled";

// AdminEventsItemCard is a self containing component that only takes in props and styles each one accordingly
// It is a wrapper for the CardLg styled component for tidier styling of all the contents (as props) of the found users "cards"
// from the immediate parent component of this component
function AdminUsersItemCard(props) {
  return (
    <CardLg margin="10px" maxw="100%" bord="1px solid black">
      <FlexRow align="flex-start" justify="space-between">
        <Flex direction="column" align="flex-end" margin="10px">
          {/* Display the selected user's username from the "username" prop */}
          <Span fs="18px" fw="1000">
            {props.username}
          </Span>
          {/* Display the selected user's email from the "email" prop */}
          <p>
            <Span
              fs="14px"
              fw="800"
              tf="uppercase"
              color={theme.colors.dateText}
            >
              {props.email}
            </Span>
          </p>
          {/* Display the selected user's address from the "address" prop */}
          <p>
            <Span fs="12px" margin="6px 0 0">
              {props.address}
            </Span>
          </p>
        </Flex>

        {/* To the right side of the card, display in a column... */}
        <Flex direction="column" align="flex-end" margin="10px" w="200px">
          {/* Display the components from the "./AdminDisableUserForm.jsx" component passed in here from the "adminDisableUserForm" prop */}
          {props.adminDisableUserForm}
          {/* Display the components from the "./AdminAssignAdminForm.jsx" component passed in here from the "adminAssignAdminForm" prop */}
          {props.adminAssignAdminForm}
        </Flex>
      </FlexRow>
    </CardLg>
  );
}

export default AdminUsersItemCard;
