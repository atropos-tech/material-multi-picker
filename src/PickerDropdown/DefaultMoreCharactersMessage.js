import React from "react";
import { Typography } from "@material-ui/core";

function DefaultEmptyMessage() {
    return (
        <Typography variant='subtitle1' align="center" className='more-characters-message'>
            Type more characters to see suggestions
        </Typography>
    );
}

export default DefaultEmptyMessage;
