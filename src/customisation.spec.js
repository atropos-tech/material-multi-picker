/* eslint-env jest */
/* eslint-disable no-magic-numbers */

import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { resetIdCounter } from "downshift";
import MultiPicker from "./index";
import { Chip, Paper, Avatar, Popover, TextField, InputLabel } from "@material-ui/core";
import JssProvider from "react-jss/lib/JssProvider";
import PickerSuggestions from "./PickerDropdown/PickerSuggestions";

const { stringContaining } = expect;

// workaround for non-stable classnames generated in JSS
// https://github.com/mui-org/material-ui/issues/9492#issuecomment-368205258
//
// forces deterministic classnames that may clash in a wider app (but are safe in unit tests)
//
// Should be addressed in future material-ui release, see
//   https://github.com/mui-org/material-ui/issues/14357
function mountStable(reactElement, ...other) {
    const generateClassName = (rule, styleSheet) => `${styleSheet.options.classNamePrefix}-${rule.key}`;
    const elementWithStableClassNames = (
        <JssProvider generateClassName={ generateClassName }>
            { reactElement }
        </JssProvider>
    );
    return mount(elementWithStableClassNames, ...other);
}

const NOOP = () => { /* do nothing */ };
const SHORT_DELAY_MILLISECONDS = 30;

function delay(delayInMilliseconds = SHORT_DELAY_MILLISECONDS) {
    return new Promise(resolve => {
        setTimeout(resolve, delayInMilliseconds);
    });
}

async function changeInputValueAndUpdate(wrapper, newInputValue) {
    wrapper.find("input").simulate("change", { target: { value: newInputValue}});
    await delay(100);
    wrapper.update();
}

describe("MultiPicker component", () => {

    // avoid non-deterministic id creation for downshift subcomponents
    // breaking snapshot testing
    beforeEach(resetIdCounter);

    it("renders custom chip labels", () => {
        expect.assertions(3);

        const props = {
            itemToString: item => item,
            itemToLabel: jest.fn(() => "some label"),
            value: ["some-item"],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        expect(wrapper.find(Chip).getDOMNode()).toMatchSnapshot();

        expect(props.itemToLabel).toHaveBeenCalledWith("some-item");
    });

    it("renders custom chip avatars", () => {
        expect.assertions(3);

        const props = {
            itemToString: item => item,
            itemToAvatar: jest.fn(() => <Avatar src='./missing-image' />),
            value: ["some-item"],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Avatar);
        expect(wrapper.find(Avatar).getDOMNode()).toMatchSnapshot();

        expect(props.itemToAvatar).toHaveBeenCalledWith("some-item");
    });

    it("renders custom chip colors", () => {
        expect.assertions(1);

        const props = {
            itemToString: item => item,
            chipColor: "secondary",
            value: ["some-item"],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);
        expect(wrapper.find(Chip)).toHaveProp("color", "secondary");
    });

    it("renders custom suggestion components", async () => {
        expect.assertions(3);

        function CustomSuggestion() {
            return <span>Some Custom Suggestion</span>;
        }

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => ["some suggestion"],
            SuggestionComponent: jest.fn(CustomSuggestion)
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(props.SuggestionComponent).toHaveBeenCalledWith({
            itemId: "some suggestion",
            item: "some suggestion",
            isHighlighted: false,
            inputValue: "some text"
        }, {});

        expect(wrapper.find(PickerSuggestions).getDOMNode()).toMatchSnapshot();
    });

    it("shows an custom error message if the user provides the ErrorComponent prop", async () => {
        expect.assertions(2);

        const ErrorComponent = jest.fn(function TestError() {
            return <span>Oh dear</span>;
        });

        const suggestionError = new Error("fail");

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => {
                throw suggestionError;
            },
            ErrorComponent
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(ErrorComponent).toHaveBeenCalledWith({ error: suggestionError, inputValue: "some text" }, {});
        expect(wrapper.find(PickerSuggestions).getDOMNode()).toMatchSnapshot();
    });

    it("shows popover if 'itemToPopover' prop is supplied and returns content", () => {
        expect.assertions(4);

        const props = {
            itemToString: item => item,
            itemToPopover: jest.fn(() => <span>some popover</span>),
            value: ["some-item"],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        const chipBeforePopover = wrapper.find(Chip);

        // open popover
        act(() => {
            chipBeforePopover.props().onMouseEnter({ currentTarget: chipBeforePopover.getDOMNode() });
        });
        wrapper.update();
        expect(props.itemToPopover).toHaveBeenCalledWith("some-item");
        expect(wrapper.find(Popover)).toHaveProp("open", true);

        // close popover
        act(() => {
            chipBeforePopover.props().onMouseLeave();
        });
        wrapper.update();
        expect(wrapper.find(Popover)).toHaveProp("open", false);
    });

    it("does not open popover if 'itemToPopover' prop returns nothing", () => {
        expect.assertions(4);

        const props = {
            itemToString: item => item,
            itemToPopover: jest.fn(() => false),
            value: ["some-item"],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        const chipBeforePopover = wrapper.find(Chip);
        act(() => {
            chipBeforePopover.props().onMouseEnter({ currentTarget: chipBeforePopover.getDOMNode() });
        });
        wrapper.update();

        expect(props.itemToPopover).toHaveBeenCalledWith("some-item");
        expect(wrapper).toContainExactlyOneMatchingElement(Popover);
        expect(wrapper.find(Popover)).toHaveProp("open", false);

    });

    it("propagates 'required', 'helperText', 'name', 'autoFocus' and 'variant' fields to the TextField component", () => {
        expect.assertions(1);

        const baseProps = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const propsToPropagate = {
            variant: "outlined",
            required: true,
            name: "some-picker",
            helperText: "Some Helper Text",
            autoFocus: true
        };
        const wrapper = mountStable(<MultiPicker { ...baseProps } { ...propsToPropagate } />);

        expect(wrapper.find(TextField)).toHaveProp(propsToPropagate);
    });

    it("uses 'outlined' style for the chips when the 'filled' variant is used", () => {
        expect.assertions(1);

        const props = {
            itemToString: item => item,
            value: ["some item"],
            onChange: NOOP,
            getSuggestedItems: () => [],
            variant: "filled"
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);

        expect(wrapper.find(Chip)).toHaveProp("variant", "outlined");
    });


    it("applies the 'maxDropdownHeight' prop to the dropdown", async () => {
        expect.assertions(1);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => [],
            maxDropdownHeight: 100
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper.find(Paper)).toHaveStyle("maxHeight", 100);
    });

    it("shows the focus styling on the picker when it has the focus", async () => {
        expect.assertions(1);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker { ...props } label="some label" />);
        wrapper.find("input").simulate("focus", { target: wrapper.find("input") });
        await delay(100);
        wrapper.update();
        expect(wrapper.find(InputLabel).find("label")).toHaveProp("className", stringContaining("MuiFormLabel-focused"));
    });

    it("shows the dropdown when the picker is focused (if the `showDropdownOnFocus` prop is set)", async () => {
        expect.assertions(1);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => ["some item"],
            showDropdownOnFocus: true
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);
        wrapper.find("input").simulate("focus");
        await delay(100);
        wrapper.update();
        expect(wrapper).toContainExactlyOneMatchingElement(PickerSuggestions);
    });

});
