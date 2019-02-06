import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "material-ui";

const styles = theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing.unit * 3,
        overflowX: "auto",
    },
    table: {
        minWidth: 600,
    },
});

function SimpleTable({ classes, rows }) {
    return (
        <Paper className={classes.root} style={ { maxHeight: "250px" }}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Weight</TableCell>
                        <TableCell>Time picker</TableCell>
                        <TableCell>Picker</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody style={ { overflowY: "auto" }}>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell numeric>{row.weight}</TableCell>
                            <TableCell numeric>{row.timePicked}</TableCell>
                            <TableCell numeric>{row.pickerName}</TableCell>
                            <TableCell>ACTIONS</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
