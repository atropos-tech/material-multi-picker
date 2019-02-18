import React from "react";
import ChipWithPopover from "./ChipWithPopover";
import { array, func, object } from "prop-types";
import { materialColorPropType } from "./utils";

const DEFAULT_AVATAR = () => undefined;

function PickerChips({ selectedItems, color, onDelete, itemToString, itemToLabel, itemToPopover, itemToAvatar = DEFAULT_AVATAR, classes }) {
    return (
        <>
            {
                selectedItems.map(item =>
                    (
                        <ChipWithPopover
                            getPopoverContent={ itemToPopover ? () => itemToPopover(item) : undefined }
                            key={ itemToString(item) }
                            tabIndex={ -1 }
                            className={ classes.pickerChip }
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
    itemToAvatar: func,
    itemToPopover: func,
    classes: object
};


export default PickerChips;
