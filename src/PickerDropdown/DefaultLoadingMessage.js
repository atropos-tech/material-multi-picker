import React from "react";
import { LinearProgress, Typography } from "@material-ui/core";
import { string } from "prop-types";

function DefaultLoadingMessage({ inputValue }) {
    return (
        <>
            <Typography variant='h6' align="center" gutterBottom>
                Loading suggestions for <strong>{ inputValue }</strong>&hellip;
            </Typography>
            <LinearProgress />
        </>
    );
}

DefaultLoadingMessage.propTypes = {
    inputValue: string
};

export default DefaultLoadingMessage;
