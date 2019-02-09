import React from "react";
import { Typography } from "@material-ui/core";
import { string } from "prop-types";

function DefaultSuggestion({ itemId }) {
    return <Typography style={ { padding: "11px 16px" } }>{ itemId }</Typography>;
}

DefaultSuggestion.propTypes = {
    itemId: string.isRequired
};

export default DefaultSuggestion;
