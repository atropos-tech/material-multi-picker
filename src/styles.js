const ONE_QUARTER = 0.25;
const ONE_HALF = 0.5;

export default function themeToStyles(theme) {
    return {
        pickerChip: {
            marginRight: theme.spacing.unit * ONE_HALF,
            marginTop: theme.spacing.unit * ONE_QUARTER
        }
    };
}
