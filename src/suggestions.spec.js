/* eslint-env jest */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-statements */

import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { resetIdCounter } from "downshift";
import MultiPicker, { NOT_ENOUGH_CHARACTERS } from "./index";
import JssProvider from "react-jss/lib/JssProvider";
import PickerSuggestions from "./PickerDropdown/PickerSuggestions";


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
    return new Promise(resolve => setTimeout(resolve, delayInMilliseconds) );
}

const BASE_PROPS = {
    value: [],
    onChange: NOOP,
    itemToString: item => item,
    getSuggestedItems: () => []
};

async function changeInputValueAndUpdate(wrapper, newInputValue) {
    act(() => {
        wrapper.find("input").simulate("change", { target: { value: newInputValue}});
    });
    await delay(200);
    wrapper.update();
}

describe("suggestion dropdown", () => {

    // avoid non-deterministic id creation for downshift subcomponents
    // breaking snapshot testing
    beforeEach(resetIdCounter);

    it("does not show suggestion items that have already been picked", async () => {
        expect.assertions(4);

        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } value={["some picked suggestion"]} getSuggestedItems={ () => ["some suggestion", "some picked suggestion"] } />);
        expect(wrapper).not.toContainMatchingElement(PickerSuggestions);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement(PickerSuggestions);
        expect(wrapper.find(PickerSuggestions)).toHaveText("some suggestion");
        expect(wrapper.find(PickerSuggestions).getDOMNode()).toMatchSnapshot();
    });

    it("delays fetching suggestions if throttle value is set", async () => {
        expect.assertions(3);

        const getSuggestedItems = jest.fn(() => ["some suggestion"]);
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ getSuggestedItems } fetchDelay={ 20} />);

        wrapper.find("input").simulate("change", { target: { value: "s"}});
        await delay(10);
        expect(getSuggestedItems).not.toHaveBeenCalled();

        wrapper.find("input").simulate("change", { target: { value: "so"}});
        await delay(10);
        expect(getSuggestedItems).not.toHaveBeenCalled();

        wrapper.find("input").simulate("change", { target: { value: "som"}});
        await delay(50);
        expect(getSuggestedItems).toHaveBeenCalledWith("som", []);
    });

    it("shows a loading message if the suggestions are being loaded", async () => {
        expect.assertions(3);

        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ () => new Promise(NOOP) }/>);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement(PickerSuggestions);
        expect(wrapper.find(PickerSuggestions)).toHaveText("Loading suggestions for some text…");
        expect(wrapper.find(PickerSuggestions).getDOMNode()).toMatchSnapshot();
    });

    it("shows an error message if the getSuggestions function throws an error", async () => {
        expect.assertions(2);

        const getSuggestedItems = () => {
            throw new Error("fail");
        };
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ getSuggestedItems } />);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper.find(PickerSuggestions)).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        expect(wrapper.find(PickerSuggestions).getDOMNode()).toMatchSnapshot();
    });

    it("shows an error message if the getSuggestions function returns a failed promise", async () => {
        expect.assertions(2);

        const getSuggestedItems = () => Promise.reject(new Error("fail"));
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ getSuggestedItems } />);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        expect(wrapper.find(PickerSuggestions).getDOMNode()).toMatchSnapshot();
    });

    it("shows a 'type more characters' message if the getSuggestedItems() function returns the special symbol", async () => {
        expect.assertions(2);

        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ () => NOT_ENOUGH_CHARACTERS } />);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.more-characters-message");
        expect(wrapper.find(PickerSuggestions).getDOMNode()).toMatchSnapshot();
    });

    it("shows a 'no suggestions found' message if the getSuggestions function returns an empty array", async () => {
        expect.assertions(2);

        const wrapper = mountStable(<MultiPicker {...BASE_PROPS }/>);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.no-suggestions-message");
        expect(wrapper.find(PickerSuggestions).getDOMNode()).toMatchSnapshot();
    });

    it("does not make an initial call to 'getSuggestedItems' on mount", async () => {
        expect.assertions(1);

        const getSuggestedItems = jest.fn(() => []);
        mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ getSuggestedItems } />);

        await delay(50);

        expect(getSuggestedItems).not.toHaveBeenCalled();
    });
});
