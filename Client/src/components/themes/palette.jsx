// material-ui
import { alpha, createTheme } from "@mui/material/styles";

// third-party
import { presetDarkPalettes, presetPalettes } from "@ant-design/colors";

// project import
import ThemeOption from "./theme";

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode, presetColor) => {
    const colors = mode === "dark" ? presetDarkPalettes : presetPalettes;

    let greyPrimary = [
        "#ffffff",
        "#fafafa",
        "#f5f5f5",
        "#f0f0f0",
        "#d9d9d9",
        "#bfbfbf",
        "#8c8c8c",
        "#595959",
        "#262626",
        "#141414",
        "#000000",
    ];
    let greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
    let greyConstant = ["#fafafb", "#e6ebf1"];

    if (mode === "dark") {
        greyPrimary = [
            "#000000",
            "#141414",
            "#1e1e1e",
            "#595959",
            "#8c8c8c",
            "#bfbfbf",
            "#d9d9d9",
            "#f0f0f0",
            "#f5f5f5",
            "#fafafa",
            "#ffffff",
        ];
        // greyPrimary.reverse();#d9d9d9
        greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
        greyConstant = ["#121212", "#d3d8db"];
    }
    colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

    const paletteColor = ThemeOption(colors, presetColor, mode);

    return createTheme({
        palette: {
            mode,
            common: {
                black: "#000",
                white: "#fff",
            },
            ...paletteColor,
            text: {
                primary:
                    mode === "dark"
                        ? alpha(paletteColor.grey[900], 0.87)
                        : paletteColor.grey[700],
                secondary:
                    mode === "dark"
                        ? alpha(paletteColor.grey[900], 0.45)
                        : paletteColor.grey[500],
                disabled:
                    mode === "dark"
                        ? alpha(paletteColor.grey[900], 0.1)
                        : "#75afe5", //paletteColor.grey[500],
            },
            action: {
                disabled: paletteColor.grey[300],
            },
            divider:
                mode === "dark"
                    ? alpha(paletteColor.grey[900], 0.05)
                    : paletteColor.grey[200],
            background: {
                paper:
                    mode === "dark"
                        ? paletteColor.grey[100]
                        : paletteColor.grey[0],
                default: paletteColor.grey.A50,
                //default: "#75afe5",
            },
        },
    });
};

export default Palette;
