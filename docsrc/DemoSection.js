import React, { useState } from "react";
import { Typography, Collapse, FormControlLabel, Switch } from "@material-ui/core";
import Markdown from "./MaterialMarkdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark as codeStyle } from "react-syntax-highlighter/dist/styles/prism";
import { any, string } from "prop-types";

function withoutExports(sourceCode) {
    return sourceCode.replace(/export default\s*/g, "");
}

export default function DemoSection({ DemoComponent, title }) {
    const [ isCodeOpen, setCodeOpen ] = useState(false);
    const codeSwitch = <Switch checked={ isCodeOpen } onChange={ (event, newState) => setCodeOpen(newState) } />;
    return (
        <section style={{ margin: "48px 0"}}>
            <div style={ { display: "flex", alignItems: "center" } }>
                <Typography variant="h5" style={ { flex: "1 1 0"}}>{ title }</Typography>
                <FormControlLabel control={ codeSwitch } label="Show/hide source code" />
            </div>
            <Markdown source={ DemoComponent.__markdown__ } />
            <div style={ { width: "100%", marginTop: "8px" } }>
                <DemoComponent />
                <Collapse in={ isCodeOpen }>
                    <SyntaxHighlighter language="jsx" style={ codeStyle }>{ withoutExports(DemoComponent.__source__) }</SyntaxHighlighter>
                </Collapse>
            </div>
        </section>
    );
}

DemoSection.propTypes = {
    DemoComponent: any.isRequired,
    title: string.isRequired
};
