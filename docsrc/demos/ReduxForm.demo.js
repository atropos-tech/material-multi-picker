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
        onBlur={() => input.onBlur(undefined)} //required to avoid value reset - see https://github.com/erikras/redux-form/issues/2768
    />;
}

const maximumLength3 = value => value && (value.length > 3 || undefined) && "No more than 3 fruit allowed";

function FruitForm(props) {
    return (
        <form onSubmit={ props.handleSubmit }>
            <Field
                name="fruits"
                component={ FruitPicker }
                validate={ maximumLength3 }
            />
            <Button type="submit" variant="contained" color="primary">submit</Button>
        </form>
    );
}

const ConnectedReduxForm = reduxForm({ form: "fruit", initialValues: { "fruits": [] } })(FruitForm);

const store = createStore(combineReducers({
    form: formReducer
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default function ReduxFormsDemo() {
    return (
        <Provider store={ store }>
            <ConnectedReduxForm
                onSubmit={ values => window.alert(JSON.stringify(values, null, 4)) }
            />
        </Provider>
    );
}
