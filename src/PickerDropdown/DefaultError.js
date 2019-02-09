import React from "react";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { object } from "prop-types";

const styles = theme => ({
    root: {
        color: theme.palette.error.main
    }
});

function DefaultError({ classes }) {
    const className = `${classes.root} suggestion-error-message`;
    return (
        <Typography variant='h6' align="center" className={ className }>
            An error occurred!
        </Typography>
    );
}

DefaultError.propTypes = {
    classes: object
};

export default withStyles(styles)(DefaultError);
