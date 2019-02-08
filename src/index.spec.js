/* eslint-env jest */
/* eslint-disable no-magic-numbers */

import React from "react";
import { mount } from "enzyme";
import MultiPicker from "./index";
import { Chip, Paper, Avatar } from "@material-ui/core";
import keycode from "keycode";


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

describe("Preview Picker", () => {
    it("renders empty content", () => {
        expect.assertions(1);

        const wrapper = mount(<MultiPicker itemToString={ item => item } value={ [] } onChange={ NOOP } />);
        expect(wrapper).toMatchSnapshot();
    });

    it("renders single chip", () => {
        expect.assertions(3);

        const wrapper = mount(<MultiPicker itemToString={ item => item } value={ ["some item"] } onChange={ NOOP } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        expect(wrapper.find(Chip)).toHaveText("some item");
        expect(wrapper).toMatchSnapshot();
    });

    it("renders custom chip labels", () => {
        expect.assertions(4);

        const props = {
            itemToString: item => item,
            itemToLabel: jest.fn(() => "some label"),
            value: ["some-item"],
            onChange: NOOP
        };
        const wrapper = mount(<MultiPicker { ...props } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        expect(wrapper.find(Chip)).toHaveText("some label");
        expect(wrapper).toMatchSnapshot();

        expect(props.itemToLabel).toHaveBeenCalledWith("some-item");
    });

    it("renders custom chip avatars", () => {
        expect.assertions(3);

        const props = {
            itemToString: item => item,
            itemToLabel: jest.fn(() => <Avatar src='./missing-image' />),
            value: ["some-item"],
            onChange: NOOP
        };
        const wrapper = mount(<MultiPicker { ...props } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Avatar);
        expect(wrapper).toMatchSnapshot();

        expect(props.itemToLabel).toHaveBeenCalledWith("some-item");
    });

    it("renders dropdown when typing", async () => {
        expect.assertions(4);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => ["some suggestion"]
        };
        const wrapper = mount(<MultiPicker {...props }/>);
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
        const wrapper = mount(<MultiPicker {...props }/>);

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

    it("renders custom suggestion components", async () => {
        expect.assertions(3);

        function CustomSuggestion() {
            return <span>Some Custom Suggestion</span>;
        }
        const props = {
            itemToString: item => item,
            value: ["some suggestion"],
            onChange: NOOP,
            getSuggestedItems: () => ["some suggestion"],
            SuggestionComponent: jest.fn(CustomSuggestion)
        };
        const wrapper = mount(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(props.SuggestionComponent).toHaveBeenCalledWith({
            itemId: "some suggestion",
            item: "some suggestion",
            isHighlighted: false,
            inputValue: "some text",
            isSelected: true
        }, {});

        expect(wrapper).toMatchSnapshot();
    });

    it("adds the correct item when it is clicked", async () => {
        expect.assertions(2);

        const props = {
            itemToString: item => item,
            value: ["some item"],
            onChange: jest.fn(NOOP),
            getSuggestedItems: () => ["some suggestion", "some other suggestion"]
        };
        const wrapper = mount(<MultiPicker {...props }/>);

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
        const wrapper = mount(<MultiPicker {...props }/>);

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
        const wrapper = mount(<MultiPicker {...props }/>);

        wrapper.find("input").simulate("keydown", { keyCode: keycode("backspace") });

        expect(props.onChange).toHaveBeenCalledWith(["some item"]);
    });

    it("does nothing on backspace if there are no items", () => {
        expect.assertions(1);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: jest.fn(NOOP)
        };
        const wrapper = mount(<MultiPicker {...props }/>);

        wrapper.find("input").simulate("keydown", { keyCode: 8 });

        expect(props.onChange).not.toHaveBeenCalled();
    });

    it("shows a loading message if the suggestions are being loaded", async () => {
        expect.assertions(4);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => new Promise(NOOP)
        };
        const wrapper = mount(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement(Paper);
        expect(wrapper.find(Paper)).toHaveText("Loading suggestions…");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows an error message if the getSuggestions function throws an error", async () => {
        expect.assertions(3);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => {
                throw new Error("fail");
            }
        };
        const wrapper = mount(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        expect(wrapper).toMatchSnapshot();
    });

    it("shows an error message if the getSuggestions function returns a failed promise", async () => {
        expect.assertions(3);

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => Promise.reject(new Error("fail"))
        };
        const wrapper = mount(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(wrapper).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        expect(wrapper).toMatchSnapshot();
    });
});
