import React from "react";
import { Chip, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { func, object, string, node } from "prop-types";

const styles = {
    root: {
        marginRight: "4px"
    }
};

function PickerChip({ onDelete, classes, label, avatar }) {
    return (
        <Tooltip title="Click to show preview">
            <Chip
                avatar={ avatar }
                className={ classes.root }
                tabIndex={ -1 }
                label={ label }
                onDelete={ onDelete }
            />
        </Tooltip>
    );
}

PickerChip.propTypes = {
    onDelete: func.isRequired,
    classes: object.isRequired,
    label: string.isRequired,
    avatar: node
};

export default withStyles(styles)(PickerChip);
