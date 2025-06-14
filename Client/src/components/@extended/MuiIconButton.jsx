import PropTypes from "prop-types";

import { forwardRef } from "react";

// material-ui
import { IconButton } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";

// project imports
import getColors from "../../common/getColors";
import getShadow from "../../common/getShadow";

// ==============================|| ICON BUTTON - COLOR STYLE ||============================== //

function getColorStyle({ variant, theme, color }) {
    const colors = getColors(theme, color);
    const { lighter, light, dark, main, contrastText } = colors;

    const buttonShadow = `${color}Button`;
    const shadows = getShadow(theme, buttonShadow);

    const commonShadow = {
        "&::after": {
            boxShadow: `0 0 6px 6px ${alpha(main, 0.9)}`,
        },
        "&:active::after": {
            boxShadow: `0 0 0 0 ${alpha(main, 0.9)}`,
        },
        "&:focus-visible": {
            outline: `2px solid ${dark}`,
            outlineOffset: 2,
        },
    };

    switch (variant) {
        case "contained":
            return {
                color: contrastText,
                backgroundColor: main,
                "&:hover": {
                    backgroundColor: dark,
                },
                ...commonShadow,
            };
        case "light":
            return {
                color: main,
                backgroundColor: lighter,
                "&:hover": {
                    backgroundColor: light,
                },
                ...commonShadow,
            };
        case "shadow":
            return {
                boxShadow: shadows,
                color: contrastText,
                backgroundColor: main,
                "&:hover": {
                    boxShadow: "none",
                    backgroundColor: dark,
                },
                ...commonShadow,
            };
        case "outlined":
            return {
                "&:hover": {
                    backgroundColor: "transparent",
                    color: dark,
                    borderColor: dark,
                },
                ...commonShadow,
            };
        case "dashed":
            return {
                backgroundColor: lighter,
                "&:hover": {
                    color: dark,
                    borderColor: dark,
                },
                ...commonShadow,
            };
        case "text":
        default:
            return {
                "&:hover": {
                    color: dark,
                    backgroundColor: lighter,
                },
                ...commonShadow,
            };
    }
}

// ==============================|| STYLED - ICON BUTTON ||============================== //

const IconButtonStyle = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== "variant" && prop !== "shape",
})(({ theme, variant, shape, color }) => ({
    position: "relative",
    "::after": {
        content: '""',
        display: "block",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        borderRadius: shape === "rounded" ? "50%" : 4,
        opacity: 0,
        transition: "all 0.5s",
    },

    ":active::after": {
        position: "absolute",
        borderRadius: shape === "rounded" ? "50%" : 4,
        left: 0,
        top: 0,
        opacity: 1,
        transition: "0s",
    },
    ...(shape === "rounded" && {
        borderRadius: "50%",
    }),
    ...(variant === "outlined" && {
        border: "1px solid",
        borderColor: "inherit",
    }),
    ...(variant === "dashed" && {
        border: "1px dashed",
        borderColor: "inherit",
    }),
    ...(variant !== "text" && {
        "&.Mui-disabled": {
            backgroundColor: theme.palette.grey[200],
        },
    }),
    ...getColorStyle({ variant, theme, color }),
}));

// ==============================|| EXTENDED - ICON BUTTON ||============================== //

const MuiIconButton = forwardRef(
    (
        {
            variant = "text",
            shape = "square",
            children,
            color = "primary",
            ...others
        },
        ref
    ) => {
        const theme = useTheme();

        return (
            <IconButtonStyle
                ref={ref}
                disableRipple
                variant={variant}
                shape={shape}
                theme={theme}
                color={color}
                {...others}
            >
                {children}
            </IconButtonStyle>
        );
    }
);

MuiIconButton.propTypes = {
    variant: PropTypes.string,
    shape: PropTypes.string,
    children: PropTypes.node,
    color: PropTypes.string,
};

MuiIconButton.displayName = "IconButton";

export default MuiIconButton;
