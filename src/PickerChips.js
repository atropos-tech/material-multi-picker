import React from "react";
import ChipWithPopover from "./ChipWithPopover";
import { array, func, object, bool, string } from "prop-types";
import { materialColorPropType } from "./utils";

const DEFAULT_AVATAR = () => undefined;

function PickerChips({ selectedItems, disabled, color, onDelete, itemToString, itemToLabel, itemToPopover, itemToAvatar = DEFAULT_AVATAR, variant, classes }) {
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
                            onDelete={ disabled ? undefined : () => onDelete(item) }
                            avatar={ itemToAvatar(item) }
                            color={ color }
                            variant={ variant === "filled" ? "outlined" : "default" }
                        />
                    )
                )
            }
        </>
    );
}

PickerChips.propTypes = {
    disabled: bool,
    selectedItems: array,
    color: materialColorPropType,
    onDelete: func,
    itemToString: func.isRequired,
    itemToLabel: func,
    itemToAvatar: func,
    itemToPopover: func,
    classes: object,
    variant: string
};


export default PickerChips;
