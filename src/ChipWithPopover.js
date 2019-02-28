import React, { PureComponent } from "react";
import { Popover, Chip } from "@material-ui/core";
import { func } from "prop-types";

const TOP_MIDDLE = { vertical: "top", horizontal: "center" };
const BOTTOM_MIDDLE = { vertical: "bottom", horizontal: "center" };

class ChipWithPopover extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { targetElement: undefined };
    }
    handleMouseOver(mouseOverEvent) {
        this.setState({ targetElement: mouseOverEvent.currentTarget });
    }
    closePopover() {
        this.setState({ targetElement: undefined });
    }
    render() {
        const { targetElement } = this.state;
        const { getPopoverContent, ...chipProps } = this.props;
        if ( getPopoverContent ) {

            const popoverContent = Boolean(targetElement) && getPopoverContent();
            const isOpen = Boolean(popoverContent);

            return (
                <>
                    <Chip
                        onMouseEnter={ mouseOverEvent => this.handleMouseOver(mouseOverEvent) }
                        onMouseLeave={ () => this.closePopover() }
                        { ...chipProps }
                        aria-owns={ isOpen ? "material-multi-picker-mouse-popover" : undefined }
                        aria-haspopup="true"
                    />
                    <Popover
                        id="material-multi-picker-mouse-popover"
                        style={ { pointerEvents: "none" }}
                        onClose={ () => this.closePopover() }
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
}

ChipWithPopover.propTypes = {
    getPopoverContent: func
};

export default ChipWithPopover;

