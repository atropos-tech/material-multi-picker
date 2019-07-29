/* eslint-env jest */
/* eslint-disable no-magic-numbers */

import React from "react";
import { mount } from "enzyme";
import { resetIdCounter } from "downshift";
import MultiPicker from "./index";
import { Paper } from "@material-ui/core";
import JssProvider from "react-jss/lib/JssProvider";
import { LOADING } from "./utils";
import { getGlobalCache, resetAllCaches } from "./PickerDropdown/globalCache";

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
    beforeEach(() => {
        resetIdCounter();
        resetAllCaches();
    });

    it("uses global cache if configured", async () => {
        expect.assertions(5);

        const cache = getGlobalCache("test");

        jest.spyOn(cache, "setValue");

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => ["some suggestion"],
            useGlobalCache: "test",
            disablePortals: true
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        await changeInputValueAndUpdate(wrapper, "some text");

        expect(cache.setValue).toHaveBeenCalledWith("some text", LOADING);
        expect(cache.setValue).toHaveBeenCalledWith("some text", ["some suggestion"]);

        expect(cache.getValue("some text")).toEqual(["some suggestion"]);
        expect(wrapper.find(Paper)).toHaveText("some suggestion");

        expect(wrapper.find(Paper).getDOMNode()).toMatchSnapshot();
    });

    it("subscribes and unsubscribes from global cache if configured", () => {
        expect.assertions(3);

        const cache = getGlobalCache("test");

        jest.spyOn(cache, "subscribeToUpdates");

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => ["some suggestion"],
            useGlobalCache: "test",
            disablePortals: true
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        expect(cache.subscribeToUpdates).toHaveBeenCalled();
        expect(cache.getListenerCount()).toEqual(1);

        wrapper.unmount();

        expect(cache.getListenerCount()).toEqual(0);
    });


    it("does not touch global cache if not configured", async () => {
        expect.assertions(1);

        const cache = getGlobalCache("test");

        jest.spyOn(cache, "subscribeToUpdates");

        const props = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: () => ["some suggestion"],
            disablePortals: true
        };
        const wrapper = mountStable(<MultiPicker {...props }/>);

        await changeInputValueAndUpdate(wrapper, "some text");
        expect(cache.subscribeToUpdates).not.toHaveBeenCalled();
    });

    it("shares global cache between instances", async () => {
        expect.assertions(4);

        const cache = getGlobalCache("test");

        jest.spyOn(cache, "subscribeToUpdates");

        const props1 = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: jest.fn(() => ["some suggestion"]),
            useGlobalCache: "test",
            disablePortals: true
        };
        const props2 = {
            itemToString: item => item,
            value: [],
            onChange: NOOP,
            getSuggestedItems: jest.fn(() => ["some suggestion"]),
            useGlobalCache: "test"
        };
        const wrapper1 = mountStable(<MultiPicker {...props1 }/>);
        const wrapper2 = mountStable(<MultiPicker {...props2 }/>);

        await changeInputValueAndUpdate(wrapper1, "some text");
        expect(props1.getSuggestedItems).toHaveBeenCalled();
        expect(cache.getValue("some text")).toEqual(["some suggestion"]);

        await changeInputValueAndUpdate(wrapper2, "some text");
        expect(props2.getSuggestedItems).not.toHaveBeenCalled();
        expect(wrapper2.find(Paper)).toHaveText("some suggestion");
    });

});
