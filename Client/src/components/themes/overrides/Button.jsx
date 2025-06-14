// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
    const disabledStyle = {
        "&.Mui-disabled": {
            //backgroundColor: theme.palette.grey[200]
            backgroundColor: " #75afe5",
            color: "#fff",
        },
    };

    return {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    fontWeight: 400,
                },
                contained: {
                    ...disabledStyle,
                },
                outlined: {
                    ...disabledStyle,
                },
            },
        },
    };
}
