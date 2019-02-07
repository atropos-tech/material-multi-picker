/* eslint-env jest */

import React from "react";
import { mount } from "enzyme";
import MultiPicker from "./index";
import { Chip, Paper } from "@material-ui/core";
import keycode from "keycode";


const NOOP = () => { /* do nothing */ };
const SHORT_DELAY_MILLISECONDS = 30;

function wait() {
    return new Promise(resolve => {
        setTimeout(resolve, SHORT_DELAY_MILLISECONDS);
    });
}

describe("Preview Picker", () => {
    it("renders no chips for empty array", () => {
        const wrapper = mount(<MultiPicker itemToString={ item => item } value={ [] } onChange={ NOOP } />);
        expect(wrapper).not.toBeEmptyRender();
        expect(wrapper).not.toContainMatchingElement(Chip);
    });

    it("renders single chip", () => {
        const wrapper = mount(<MultiPicker itemToString={ item => item } value={ ["some item"] } onChange={ NOOP } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        expect(wrapper.find(Chip)).toHaveText("some item");
    });

    it("renders custom chip labels", () => {
        const props = {
            itemToString: item => item,
            itemToLabel: () => "some label",
            value: ["some-item"],
            onChange: NOOP
        };
        const wrapper = mount(<MultiPicker { ...props } />);
        expect(wrapper).toContainExactlyOneMatchingElement(Chip);
        expect(wrapper.find(Chip)).toHaveText("some label");
    });

    it("renders dropdown when typing", () => {
        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => ["some suggestion"]
        };
        const wrapper = mount(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        wrapper.find("input").simulate("change", { target: { value: "some text"}});

        return wait().then(() => {
            wrapper.update();
            expect(wrapper).toContainExactlyOneMatchingElement(Paper);
            expect(wrapper.find(Paper)).toHaveText("some suggestion");
        });
    });

    it("renders custom suggestion components", () => {
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

        wrapper.find("input").simulate("change", { target: { value: "some text"}});

        return wait().then(() => {
            wrapper.update();

            expect(props.SuggestionComponent).toHaveBeenCalledWith({
                itemId: "some suggestion",
                item: "some suggestion",
                isHighlighted: false,
                inputValue: "some text",
                isSelected: true
            }, {});
        });
    });

    it("adds the correct item when it is clicked", () => {
        const props = {
            itemToString: item => item,
            value: ["some item"],
            onChange: jest.fn(NOOP),
            getSuggestedItems: () => ["some suggestion", "some other suggestion"]
        };
        const wrapper = mount(<MultiPicker {...props }/>);

        wrapper.find("input").simulate("change", { target: { value: "some text"}});

        return wait().then(() => {
            wrapper.update();
            expect(wrapper).toContainMatchingElements(2, "MenuItem.suggestion");

            wrapper.find("MenuItem.suggestion").at(1).simulate("click");
            expect(props.onChange).toHaveBeenCalledWith(["some item", "some other suggestion"]);
        });
    });

    it("removes items when the chip remove icon is clicked", () => {
        const props = {
            itemToString: item => item,
            value: ["some item", "some-other-item"],
            onChange: jest.fn(NOOP),
            getSuggestedItems: () => ["some suggestion", "some other suggestion"]
        };
        const wrapper = mount(<MultiPicker {...props }/>);

        expect(wrapper).toContainMatchingElements(2, Chip);
        wrapper.find(Chip).at(0).props().onDelete();

        expect(props.onChange).toHaveBeenCalledWith(["some-other-item"]);
    });

    it("removes last item on backspace", () => {
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
        const props = {
            itemToString: item => item,
            value: [],
            onChange: jest.fn(NOOP)
        };
        const wrapper = mount(<MultiPicker {...props }/>);

        wrapper.find("input").simulate("keydown", { keyCode: 8 });

        expect(props.onChange).not.toHaveBeenCalled();
    });

    it("shows a loading message if the suggestions are being loaded", () => {
        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => new Promise(NOOP)
        };
        const wrapper = mount(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        wrapper.find("input").simulate("change", { target: { value: "some text"}});

        return wait().then(() => {
            wrapper.update();
            expect(wrapper).toContainExactlyOneMatchingElement(Paper);
            expect(wrapper.find(Paper)).toHaveText("Loading suggestions…");
        });
    });

    it("shows an error message if the getSuggestions function throws an error", () => {
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

        wrapper.find("input").simulate("change", { target: { value: "some text"}});

        return wait().then(() => {
            wrapper.update();
            expect(wrapper).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        });
    });

    it("shows an error message if the getSuggestions function returns a failed promise", () => {
        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => Promise.reject(new Error("fail"))
        };
        const wrapper = mount(<MultiPicker {...props }/>);
        expect(wrapper).not.toContainMatchingElement(Paper);

        wrapper.find("input").simulate("change", { target: { value: "some text"}});

        return wait().then(() => {
            wrapper.update();
            expect(wrapper).toContainExactlyOneMatchingElement("Typography.suggestion-error-message");
        });
    });
});
