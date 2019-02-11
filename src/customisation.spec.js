/* eslint-env jest */
/* eslint-disable no-magic-numbers */

import React from "react";
import { mount } from "enzyme";
import { resetIdCounter } from "downshift";
import MultiPicker from "./index";
import { Chip, Paper, Avatar, Popover } from "@material-ui/core";
import JssProvider from "react-jss/lib/JssProvider";

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
    await delay();
    wrapper.update();
}

describe("MultiPicker component", () => {

    // avoid non-deterministic id creation for downshift subcomponents
    // breaking snapshot testing
    beforeEach(resetIdCounter);

    it("renders custom chip labels", () => {
        expect.assertions(4);

        const props = {
            itemToString: item => item,
            itemToLabel: jest.fn(() => "some label"),
            value: ["some-item"],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        expect(wrapper.find(Chip)).toHaveText("some label");
        expect(wrapper).toMatchSnapshot();

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
        expect(wrapper).toMatchSnapshot();

        expect(props.itemToAvatar).toHaveBeenCalledWith("some-item");
    });

    it("renders custom chip colors", () => {
        expect.assertions(2);

        const props = {
            itemToString: item => item,
            chipColor: "secondary",
            value: ["some-item"],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker { ...props } />);
        expect(wrapper.find(Chip)).toHaveProp("color", "secondary");
        expect(wrapper).toMatchSnapshot();
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

        expect(wrapper).toMatchSnapshot();
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
        expect(wrapper).toMatchSnapshot();
    });

    it("shows popover if 'itemToPopover' prop is supplied and returns content", () => {
        expect.assertions(2);

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

        chipBeforePopover.props().onMouseEnter({ currentTarget: chipBeforePopover.getDOMNode() });

        expect(props.itemToPopover).toHaveBeenCalledWith("some-item");

        // TODO this test doesn't work correctly because when we do wrapper.update() to refresh
        // the component state, the test enters an infinite loop of updating
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
        chipBeforePopover.props().onMouseEnter({ currentTarget: chipBeforePopover.getDOMNode() });

        expect(props.itemToPopover).toHaveBeenCalledWith("some-item");
        expect(wrapper).toContainExactlyOneMatchingElement(Popover);
        expect(wrapper.find(Popover)).toHaveProp("open", false);

    });

});
