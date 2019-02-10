import React from "react";
import { Typography } from "@material-ui/core";
import { string } from "prop-types";

function DefaultSuggestion({ itemId }) {
    // This padding mimics the default padding that would normally be applied to the parent
    // MenuItem, but we remove that to give more flexibility for custom components
    return <Typography style={ { padding: "11px 16px" } }>{ itemId }</Typography>;
}

DefaultSuggestion.propTypes = {
    itemId: string.isRequired
};

export default DefaultSuggestion;
