/* eslint-env jest */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-statements */

import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { resetIdCounter } from "downshift";
import MultiPicker, { NOT_ENOUGH_CHARACTERS } from "./index";
import { Chip, MenuItem, SvgIcon, TextField } from "@material-ui/core";
import JssProvider from "react-jss/lib/JssProvider";
import { BACKSPACE_KEYCODE } from "./utils";
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

describe("MultiPicker component", () => {

    // avoid non-deterministic id creation for downshift subcomponents
    // breaking snapshot testing
    beforeEach(resetIdCounter);

    it("renders empty content", () => {
        expect.assertions(1);

        const wrapper = mountStable(<MultiPicker { ...BASE_PROPS } />);
        expect(wrapper).toMatchSnapshot();
    });

    it("renders single chip", () => {
        expect.assertions(3);

        const wrapper = mountStable(<MultiPicker { ...BASE_PROPS } value={ ["some item"] } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        expect(wrapper.find(Chip)).toHaveText("some item");
        expect(wrapper).toMatchSnapshot();
    });

    it("can be disabled", () => {
        expect.assertions(2);
        const wrapper = mountStable(<MultiPicker { ...BASE_PROPS } disabled value={["some item"]} />);
        expect(wrapper.find("input")).toBeDisabled();
        expect(wrapper.find(Chip)).not.toContainMatchingElement(SvgIcon);
    });

    it("can show in error state", () => {
        expect.assertions(2);
        const wrapper = mountStable(<MultiPicker { ...BASE_PROPS } error value={["some item"]} />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(TextField)).toHaveProp("error", true);
    });

    it("clears the input on blur if the clearInputOnBlur prop is set", async () => {
        expect.assertions(1);
        const wrapper = mountStable(<MultiPicker { ...BASE_PROPS } clearInputOnBlur />);

        await changeInputValueAndUpdate(wrapper, "some text");
        wrapper.find("input").simulate("blur");
        wrapper.update();

        expect(wrapper.find("input")).toHaveProp("value", "");
    });

    it("does not clear the input on blur if the clearInputOnBlur prop is set", async () => {
        expect.assertions(1);
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS }/>);

        await changeInputValueAndUpdate(wrapper, "some text");
        wrapper.find("input").simulate("blur");
        wrapper.update();

        expect(wrapper.find("input")).toHaveProp("value", "some text");
    });

    it("renders dropdown when typing", async () => {
        expect.assertions(4);

        const wrapper = mountStable(<MultiPicker { ...BASE_PROPS } getSuggestedItems={ () => ["some suggestion"] } />);
        expect(wrapper).not.toContainMatchingElement(PickerSuggestions);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement(PickerSuggestions);
        expect(wrapper.find(PickerSuggestions)).toHaveText("some suggestion");
        expect(wrapper).toMatchSnapshot();
    });

    it("does not show suggestion items that have already been picked", async () => {
        expect.assertions(4);

        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } value={["some picked suggestion"]} getSuggestedItems={ () => ["some suggestion", "some picked suggestion"] } />);
        expect(wrapper).not.toContainMatchingElement(PickerSuggestions);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement(PickerSuggestions);
        expect(wrapper.find(PickerSuggestions)).toHaveText("some suggestion");
        expect(wrapper).toMatchSnapshot();
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


    it("adds the correct item when it is clicked", async () => {
        expect.assertions(2);

        const onChange = jest.fn();
        const getSuggestedItems = () => ["some suggestion", "some other suggestion"];
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } onChange={ onChange } value={ ["some item"] } getSuggestedItems={ getSuggestedItems } />);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainMatchingElements(2, MenuItem);

        wrapper.find(MenuItem).at(1).simulate("click");
        expect(onChange).toHaveBeenCalledWith(["some item", "some other suggestion"]);
    });

    it("removes items when the chip remove icon is clicked", () => {
        expect.assertions(2);

        const onChange = jest.fn();
        const getSuggestedItems = () => ["some suggestion", "some other suggestion"];
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } onChange={ onChange } value={ ["some item", "some-other-item"] } getSuggestedItems={ getSuggestedItems } />);

        expect(wrapper).toContainMatchingElements(2, Chip);

        // simulating click doesn't work because Chip uses SvgIcon and you
        // can't simulate clicks on <svg> elements!
        act(() => {
            wrapper.find(Chip).at(0).props().onDelete();
        });

        expect(onChange).toHaveBeenCalledWith(["some-other-item"]);
    });

    it("removes last item on backspace", () => {
        expect.assertions(1);

        const onChange = jest.fn();
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } onChange={ onChange } value={ ["some item", "some-other-item"] } />);
        wrapper.find("input").simulate("keydown", { keyCode: BACKSPACE_KEYCODE });

        expect(onChange).toHaveBeenCalledWith(["some item"]);
    });

    it("does nothing on backspace if there are no items", () => {
        expect.assertions(1);

        const props = {
            ...BASE_PROPS,
            onChange: jest.fn(NOOP),
            getSuggestedItems: () => []
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);
        wrapper.find("input").simulate("keydown", { keyCode: BACKSPACE_KEYCODE });

        expect(props.onChange).not.toHaveBeenCalled();
    });

    it("shows a loading message if the suggestions are being loaded", async () => {
        expect.assertions(3);

        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ () => new Promise(NOOP) }/>);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement(PickerSuggestions);
        expect(wrapper.find(PickerSuggestions)).toHaveText("Loading suggestions for some text…");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows an error message if the getSuggestions function throws an error", async () => {
        expect.assertions(2);

        const getSuggestedItems = () => {
            throw new Error("fail");
        };
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ getSuggestedItems } />);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows an error message if the getSuggestions function returns a failed promise", async () => {
        expect.assertions(2);

        const getSuggestedItems = () => Promise.reject(new Error("fail"));
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ getSuggestedItems } />);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows a 'type more characters' message if the getSuggestedItems() function returns the special symbol", async () => {
        expect.assertions(2);

        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } getSuggestedItems={ () => NOT_ENOUGH_CHARACTERS } />);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.more-characters-message");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows a 'no suggestions found' message if the getSuggestions function returns an empty array", async () => {
        expect.assertions(2);

        const wrapper = mountStable(<MultiPicker {...BASE_PROPS }/>);
        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.no-suggestions-message");
        expect(wrapper).toMatchSnapshot();
    });

    it("triggers the 'onFocus' callback when the event occurs", () => {
        expect.assertions(1);

        const onFocus = jest.fn();
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } onFocus={ onFocus } />);
        wrapper.find("input").simulate("focus");

        expect(onFocus).toHaveBeenCalled();
    });

    it("triggers the 'onBlur' callback when the event occurs", () => {
        expect.assertions(1);

        const onBlur = jest.fn();
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } onBlur={ onBlur } />);
        wrapper.find("input").simulate("blur");

        expect(onBlur).toHaveBeenCalled();
    });

    it("triggers the 'onDragStart' callback when the event occurs", () => {
        expect.assertions(1);

        const onDragStart = jest.fn();
        const wrapper = mountStable(<MultiPicker {...BASE_PROPS } onDragStart={ onDragStart } />);
        wrapper.find("input").simulate("dragstart");

        expect(onDragStart).toHaveBeenCalled();
    });
});
