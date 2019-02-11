import React from "react";
import { Chip } from "@material-ui/core";
import { array, func } from "prop-types";
import { materialColorPropType } from "./utils";

const DEFAULT_AVATAR = () => undefined;

function PickerChips({ selectedItems, color, onDelete, itemToString, itemToLabel, itemToAvatar = DEFAULT_AVATAR }) {
    return (
        <>
            {
                selectedItems.map(item =>
                    (
                        <Chip
                            key={ itemToString(item) }
                            tabIndex={ -1 }
                            style={ { marginRight: "4px", marginTop: "2px" } }
                            label={ itemToLabel ? itemToLabel(item) : itemToString(item) }
                            onDelete={ () => onDelete(item) }
                            avatar={ itemToAvatar(item) }
                            color={ color }
                        />
                    )
                )
            }
        </>
    );
}

PickerChips.propTypes = {
    selectedItems: array,
    color: materialColorPropType,
    onDelete: func,
    itemToString: func.isRequired,
    itemToLabel: func,
    itemToAvatar: func
};


export default PickerChips;
