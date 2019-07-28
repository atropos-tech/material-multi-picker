import React, { useState } from "react";
import { Popover, Chip } from "@material-ui/core";
import { func } from "prop-types";

const TOP_MIDDLE = { vertical: "top", horizontal: "center" };
const BOTTOM_MIDDLE = { vertical: "bottom", horizontal: "center" };

function ChipWithPopover({ getPopoverContent, ...chipProps }) {

    const [ targetElement, setTargetElement ] = useState(undefined);

    if ( getPopoverContent ) {

        const popoverContent = Boolean(targetElement) && getPopoverContent();
        const closePopover = () => setTargetElement(undefined);
        const isOpen = Boolean(popoverContent);

        return (
            <>
                <Chip
                    onMouseEnter={ mouseOverEvent => setTargetElement(mouseOverEvent.currentTarget)}
                    onMouseLeave={ closePopover }
                    { ...chipProps }
                    aria-owns={ isOpen ? "material-multi-picker-mouse-popover" : undefined }
                    aria-haspopup="true"
                />
                <Popover
                    id="material-multi-picker-mouse-popover"
                    style={ { pointerEvents: "none" }}
                    onClose={ closePopover }
                    anchorOrigin={ TOP_MIDDLE }
                    transformOrigin={ BOTTOM_MIDDLE }
                    anchorEl={ targetElement }
                    open={ isOpen }
                    disableRestoreFocus
                >
                    { popoverContent }
                </Popover>
            </>
        );
    }
    return <Chip {...chipProps} />;
}

ChipWithPopover.propTypes = {
    getPopoverContent: func
};

export default ChipWithPopover;

