/* eslint-env jest */

import React from "react";
import { mount } from "enzyme";
import MultiPicker from "./index";

describe("Preview Picker", () => {
    it("renders", () => {
        const wrapper = mount(<MultiPicker itemToString={ item => item } value={ [] } />);
        expect(wrapper).not.toBeEmptyRender();
    });
});
