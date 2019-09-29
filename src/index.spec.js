import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { resetIdCounter } from "downshift";
import MultiPicker from "./index";
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
    getSuggestedItems: () => [],
    disablePortals: true
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
        expect(wrapper.getDOMNode()).toMatchSnapshot();
    });

    it("renders single chip", () => {
        expect.assertions(3);

        const wrapper = mountStable(<MultiPicker { ...BASE_PROPS } value={ ["some item"] } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        expect(wrapper.find(Chip)).toHaveText("some item");
        expect(wrapper.find(TextField).getDOMNode()).toMatchSnapshot();
    });

    it("can be disabled", () => {
        expect.assertions(2);
        const wrapper = mountStable(<MultiPicker { ...BASE_PROPS } disabled value={["some item"]} />);
        expect(wrapper.find("input")).toBeDisabled();
        expect(wrapper.find(Chip)).not.toContainMatchingElement(SvgIcon);
    });

    it("can show in error state", async () => {
        expect.assertions(2);
        const wrapper = mountStable(<MultiPicker { ...BASE_PROPS } error value={["some item"]} />);
        await delay(50);
        expect(wrapper.find(TextField).getDOMNode()).toMatchSnapshot();
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
        expect(wrapper.find(PickerSuggestions).getDOMNode()).toMatchSnapshot();
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
