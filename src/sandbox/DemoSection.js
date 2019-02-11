import React, { useState } from "react";
import { Typography, Collapse, FormControlLabel, Switch } from "@material-ui/core";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark as codeStyle } from "react-syntax-highlighter/dist/styles/prism";
import { any, string, node } from "prop-types";

export default function DemoSection({ DemoComponent, title, demoSource, children }) {
    const [ isCodeOpen, setCodeOpen ] = useState(false);
    const codeSwitch = <Switch checked={ isCodeOpen } onChange={ (event, newState) => setCodeOpen(newState) } />;
    return (
        <section style={{ margin: "48px 0"}}>
            <div style={ { display: "flex", alignItems: "center" } }>
                <Typography variant="h5" style={ { flex: "1 1 0"}}>{ title }</Typography>
                <FormControlLabel control={ codeSwitch } label="Show/hide source code" />
            </div>
            { children }
            <div style={ { width: "100%" } }>
                <DemoComponent />
                <Collapse in={ isCodeOpen }>
                    <SyntaxHighlighter language="jsx" style={ codeStyle }>{ demoSource }</SyntaxHighlighter>
                </Collapse>
            </div>
        </section>
    );
}

DemoSection.propTypes = {
    DemoComponent: any.isRequired,
    title: string.isRequired,
    demoSource: string.isRequired,
    children: node
};
