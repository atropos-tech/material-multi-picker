import React from "react";
import { Typography, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";
import Markdown from "react-markdown";

import { curryHard } from "react-curry-component";

const markdownRenderers = {
    table: Table,
    tableHead: TableHead,
    tableBody: TableBody,
    tableRow: TableRow,
    tableCell: curryHard(<TableCell align="inherit" />),
    paragraph: curryHard(<Typography variant="body1" component="p" />)
};

const MaterialMarkdown = curryHard(<Markdown renderers={ markdownRenderers } />);

export default MaterialMarkdown;
