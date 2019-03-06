import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { reducer as formReducer, reduxForm, Field } from "redux-form";
import MultiPicker from "../../src/index";
import { getSuggestedFruitSync } from "./common";
import { Button } from "@material-ui/core";

function FruitPicker({ input, meta }) {
    const { invalid, error } = meta;
    const helperText = invalid ? error : "You can take some fruit with you when you go!";
    return <MultiPicker
        itemToString={ fruit => fruit.name }
        getSuggestedItems={ getSuggestedFruitSync }
        label="Your favourite fruit"
        fullWidth
        helperText={ helperText }
        error={ invalid }
        { ...input }
    />;
}

const maximumLength3 = value => value && (value.length > 3 || undefined) && "No more than 3 fruit allowed";
const noBananas = value => value && value.find && value.find(fruit => fruit.name === "banana" ) && "Don't select the banana";

function FruitForm({ handleSubmit, invalid }) {
    return (
        <form onSubmit={ handleSubmit }>
            <Field
                name="fruits"
                component={ FruitPicker }
                validate={ maximumLength3 }
                warn={ noBananas }
            />
            <Button disabled={ invalid } type="submit" variant="contained" color="primary">submit</Button>

        </form>
    );
}

const ConnectedReduxForm = reduxForm({ form: "fruit", initialValues: { "fruits": [] } })(FruitForm);

const store = createStore(combineReducers({
    form: formReducer
}));

export default function ReduxFormsDemo() {
    return (
        <Provider store={ store }>
            <ConnectedReduxForm
                onSubmit={ values => window.alert(JSON.stringify(values, null, 4)) }
            />
        </Provider>
    );
}
