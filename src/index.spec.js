/* eslint-env jest */
/* eslint-disable no-magic-numbers */

import React from "react";
import { mount } from "enzyme";
import { resetIdCounter } from "downshift";
import MultiPicker, { NOT_ENOUGH_CHARACTERS } from "./index";
import { Chip, Paper } from "@material-ui/core";
import JssProvider from "react-jss/lib/JssProvider";
import { BACKSPACE_KEYCODE } from "./utils";

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

    it("renders empty content", () => {
        expect.assertions(1);

        const wrapper = mountStable(<MultiPicker itemToString={ item => item } value={ [] } onChange={ NOOP } />);
        expect(wrapper).toMatchSnapshot();
    });

    it("renders single chip", () => {
        expect.assertions(3);

        const wrapper = mountStable(<MultiPicker itemToString={ item => item } value={ ["some item"] } onChange={ NOOP } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        expect(wrapper.find(Chip)).toHaveText("some item");
        expect(wrapper).toMatchSnapshot();
    });

    it("renders dropdown when typing", async () => {
        expect.assertions(4);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => ["some suggestion"]
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement(Paper);
        expect(wrapper.find(Paper)).toHaveText("some suggestion");
        expect(wrapper).toMatchSnapshot();
    });

    it("does not show suggestion item that have already been picked", async () => {
        expect.assertions(4);

        const props = {
            itemToString: item => item,
            value: ["some picked suggestion"],
            onChange: NOOP,
            getSuggestedItems: () => ["some suggestion", "some picked suggestion"]
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement(Paper);
        expect(wrapper.find(Paper)).toHaveText("some suggestion");
        expect(wrapper).toMatchSnapshot();
    });

    it("delays fetching suggestions if throttle value is set", async () => {
        expect.assertions(3);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: jest.fn(() => ["some suggestion"]),
            fetchDelay: 20
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        wrapper.find("input").simulate("change", { target: { value: "s"}});
        await delay(10);
        expect(props.getSuggestedItems).not.toHaveBeenCalled();

        wrapper.find("input").simulate("change", { target: { value: "so"}});
        await delay(10);
        expect(props.getSuggestedItems).not.toHaveBeenCalled();

        wrapper.find("input").simulate("change", { target: { value: "som"}});
        await delay(30);
        expect(props.getSuggestedItems).toHaveBeenCalledWith("som", []);
    });


    it("adds the correct item when it is clicked", async () => {
        expect.assertions(2);

        const props = {
            itemToString: item => item,
            value: ["some item"],
            onChange: jest.fn(NOOP),
            getSuggestedItems: () => ["some suggestion", "some other suggestion"]
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainMatchingElements(2, "MenuItem.suggestion");

        wrapper.find("MenuItem.suggestion").at(1).simulate("click");
        expect(props.onChange).toHaveBeenCalledWith(["some item", "some other suggestion"]);
    });

    it("removes items when the chip remove icon is clicked", () => {
        expect.assertions(2);

        const props = {
            itemToString: item => item,
            value: ["some item", "some-other-item"],
            onChange: jest.fn(NOOP),
            getSuggestedItems: () => ["some suggestion", "some other suggestion"]
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        expect(wrapper).toContainMatchingElements(2, Chip);

        // simulating click doesn't work because Chip uses SvgIcon and you
        // can't simulate clicks on <svg> elements!
        wrapper.find(Chip).at(0).props().onDelete();

        expect(props.onChange).toHaveBeenCalledWith(["some-other-item"]);
    });

    it("removes last item on backspace", () => {
        expect.assertions(1);

        const props = {
            itemToString: item => item,
            value: ["some item", "some other item"],
            onChange: jest.fn(NOOP)
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        wrapper.find("input").simulate("keydown", { keyCode: BACKSPACE_KEYCODE });

        expect(props.onChange).toHaveBeenCalledWith(["some item"]);
    });

    it("does nothing on backspace if there are no items", () => {
        expect.assertions(1);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: jest.fn(NOOP)
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        wrapper.find("input").simulate("keydown", { keyCode: BACKSPACE_KEYCODE });

        expect(props.onChange).not.toHaveBeenCalled();
    });

    it("shows a loading message if the suggestions are being loaded", async () => {
        expect.assertions(3);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => new Promise(NOOP)
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement(Paper);
        expect(wrapper.find(Paper)).toHaveText("Loading suggestions for some text…");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows an error message if the getSuggestions function throws an error", async () => {
        expect.assertions(2);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => {
                throw new Error("fail");
            }
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows an error message if the getSuggestions function returns a failed promise", async () => {
        expect.assertions(2);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => Promise.reject(new Error("fail"))
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows a 'type more characters' message if the getSuggestedItems() function returns the special symbol", async () => {
        expect.assertions(2);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => NOT_ENOUGH_CHARACTERS
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.more-characters-message");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows a 'no suggestions found' message if the getSuggestions function returns an empty array", async () => {
        expect.assertions(2);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.no-suggestions-message");
        expect(wrapper).toMatchSnapshot();
    });
});
