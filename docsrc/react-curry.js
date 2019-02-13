import React from "react";

function getDisplayName(reactType) {
    if (typeof reactType === "string") {
        return reactType;
    }
    return reactType.displayName;
}

function allowOverwrite(curriedProps, props) {
    return { ...curriedProps, ...props };
}

function forceCurry(curriedProps, props) {
    return { ...props, ...curriedProps };
}

export default function curry(reactElement, displayName, propsReducer = allowOverwrite) {
    const { props: curriedProps, type: CurriedType } = reactElement;
    const curriedComponent = function Curried(props) {
        const combinedProps = propsReducer(curriedProps, props);
        return <CurriedType { ...combinedProps } />;
    };
    curriedComponent.displayName = displayName || `Curried(${ getDisplayName(CurriedType) })`;
    return curriedComponent;
}

export function curryHard(reactElement, displayName) {
    return curry(reactElement, displayName, forceCurry);
}
