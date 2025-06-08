// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // white
    10: "#f6f6f6", // light grey
    50: "#f0f0f0", // light grey
    100: "#e0e0e0", // light grey
    200: "#c2c2c2", // grey
    300: "#a3a3a3", // grey
    400: "#858585", // grey
    500: "#666666", // grey
    600: "#525252", // dark grey
    700: "#3d3d3d", // dark grey
    800: "#292929", // dark grey
    900: "#141414", // almost black
    1000: "#000000", // black
  },
  primary: {
    // black
    100: "#cccccc",
    200: "#999999",
    300: "#666666",
    400: "#333333",
    500: "#000000", // black
    600: "#000000", // black
    700: "#000000", // black
    800: "#000000", // black
    900: "#000000", // black
  },
  secondary: {
    // yellow (#eab308)
    50: "#fef9e7", // light yellow
    100: "#fde8a4", // light yellow
    200: "#fcdc82", // light yellow
    300: "#fbd15f", // yellow
    400: "#fac63d", // yellow
    500: "#eab308", // main yellow shade
    600: "#c79807", // dark yellow
    700: "#a47d06", // darker yellow
    800: "#816205", // darker yellow
    900: "#5e4704", // darkest yellow
  },
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}

export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[500], // black
              light: tokensDark.primary[400], // dark grey
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[500], // yellow (#eab308)
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500], // grey
            },
            background: {
              default: tokensDark.primary[500], // black
              alt: tokensDark.primary[600], // black
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[0], // white
              light: tokensDark.grey[10], // light grey
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[500], // yellow (#eab308)
              light: tokensDark.secondary[400], // light yellow
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500], // grey
            },
            background: {
              default: tokensDark.grey[0], // white
              alt: tokensDark.grey[10], // light grey
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};