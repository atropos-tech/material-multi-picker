import React from "react";
import { Typography } from "@material-ui/core";

function DefaultError() {
    return (
        <Typography variant='h6' align="center" gutterBottom className='suggestion-error-message'>
            An error occurred!
        </Typography>
    );
}

export default DefaultError;
