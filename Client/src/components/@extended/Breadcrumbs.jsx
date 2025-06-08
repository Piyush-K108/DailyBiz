import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// material-ui
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Typography } from "@mui/material";

// project imports
import MainCard from "../MainCard";

// assets
import { ApartmentOutlined } from "@ant-design/icons";

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({
    card,
    divider = true,
    icon,
    icons,
    maxItems,
    navigation,
    rightAlign,
    separator,
    title,
    titleBottom,
    sx,
    ...others
}) => {
    const theme = useTheme();
    const location = useLocation();
    //const matchRoute = useMatch();
    // const { t } = useTranslation();
    const [main, setMain] = useState();
    const [item, setItem] = useState();


    const iconSX = {
        marginRight: theme.spacing(0.75),
        marginTop: `-${theme.spacing(0.25)}`,
        width: "1rem",
        height: "1rem",
        color: theme.palette.secondary.main,
    };

    // set active item state
    const getCollapse = (menu) => {
        if (menu.children) {
            menu.children.filter((collapse) => {
                if (collapse.type && collapse.type === "collapse") {
                    getCollapse(collapse);
                } else if (collapse.type && collapse.type === "item") {
                    if (location.pathname === collapse.url) {
                        setMain(menu);
                        setItem(collapse);
                    } else if (matchPath(collapse.url, location.pathname)) {
                        setMain(menu);
                        setItem(collapse);
                    }
                }
                return false;
            });
        }
    };

    useEffect(() => {
        navigation?.map((menu) => {
            
            let match = matchPath(menu.url, location.pathname);
            
            let childMatch = false;
            if (match === null && menu.children.length > 0) {
                menu.children.forEach((element) => {
                    childMatch = matchPath(element.url, location.pathname);
                    if (!match) {
                        return false;
                    }
                    return true;
                });
            }
            if (menu.type && menu.type === "group") {
                getCollapse(menu);
            } else if(menu.type && menu.type === "collapse"){
                getCollapse(menu);
            }else if (menu.type && menu.type === "item") {
                //if (location.pathname === menu.url) {
                if (match) {
                    setMain(menu);
                    setItem(menu);
                } else if (childMatch) {
                    setMain(menu);
                    setItem(menu);
                }
            }
            return false;
        });
    });

    // only used for component demo breadcrumbs
    // if (location.pathname === "/components-overview/breadcrumbs") {
    //     location.pathname = "/dashboard/analytics";
    // }

    // item separator
    const SeparatorIcon = separator;
    const separatorIcon = separator ? (
        <SeparatorIcon style={{ fontSize: "0.75rem", marginTop: 2 }} />
    ) : (
        "/"
    );

    let mainContent;
    let itemContent;
    let breadcrumbContent = <Typography />;
    let itemTitle = "";
    let CollapseIcon;
    let ItemIcon;

    // collapse item
    if (main && main.type === "collapse") {
        CollapseIcon = main.icon ? main.icon : ApartmentOutlined;
        mainContent = (
            <Typography
                component={Link}
                to={document.location.pathname}
                variant="h6"
                sx={{ textDecoration: "none" }}
                color="textSecondary"
            >
                {icons && <CollapseIcon style={iconSX} />}
                {main.title}
            </Typography>
        );
    }

    // items
    if (item && item.type === "item") {
        itemTitle = item.title;
        ItemIcon = item.icon ? item.icon : ApartmentOutlined;
        let arr = [];
        if (matchPath(item.url, location.pathname)) {
            arr = [
                <Typography variant="subtitle1" color="textPrimary">
                    {icons && <ItemIcon style={iconSX} />}
                    {itemTitle}
                </Typography>,
            ];
            itemContent = arr;
        } else if (item.children.length > 0) {
            item.children.forEach((element,i) => {
                let match = matchPath(element.url, location.pathname);
                if (match) {
                    arr = [
                        <Typography
                            component={Link}
                            to={item.url}
                            color="textSecondary"
                            variant="h6"
                            sx={{ textDecoration: "none" }}
                        >
                            {item.title}
                        </Typography>,
                        <Typography variant="subtitle1" color="textPrimary">
                            {icons && <ItemIcon style={iconSX} />}
                            {element.title}
                        </Typography>,
                    ];
                } else {
                    return (
                        <Typography key={i} variant="subtitle1" color="textPrimary">
                            {icons && <ItemIcon style={iconSX} />}
                            {itemTitle}
                        </Typography>
                    );
                }
            });
            itemContent = arr;
        } else {
            itemContent = (
                <Typography variant="subtitle1" color="textPrimary">
                    {icons && <ItemIcon style={iconSX} />}
                    {itemTitle}
                </Typography>
            );
        }

        // main
        if (item.breadcrumbs !== false) {
            breadcrumbContent = (
                <MainCard
                    border={card}
                    sx={
                        card === false
                            ? { mb: 3, bgcolor: "transparent", ...sx }
                            : { mb: 3, ...sx }
                    }
                    {...others}
                    content={card}
                    shadow="none"
                >
                    <Grid
                        container
                        direction={rightAlign ? "row" : "column"}
                        justifyContent={
                            rightAlign ? "space-between" : "flex-start"
                        }
                        alignItems={rightAlign ? "center" : "flex-start"}
                        spacing={1}
                    >
                        <Grid item>
                            <MuiBreadcrumbs
                                aria-label="breadcrumb"
                                maxItems={maxItems || 8}
                                separator={separatorIcon}
                            >
                                <Typography
                                    component={Link}
                                    to="/"
                                    color="textSecondary"
                                    variant="h6"
                                    sx={{ textDecoration: "none" }}
                                >
                                    {"Home"}
                                </Typography>
                                {/* {mainContent} */}
                                {itemContent}
                            </MuiBreadcrumbs>
                        </Grid>
                        {title && titleBottom && (
                            <Grid item sx={{ mt: card === false ? 0.25 : 1 }}>
                                <Typography variant="h2">
                                    {/* {t(item.title)} */}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                    {card === false && divider !== false && (
                        <Divider sx={{ mt: 2 }} />
                    )}
                </MainCard>
            );
        }
    }
    return breadcrumbContent;
};

Breadcrumbs.propTypes = {
    card: PropTypes.bool,
    divider: PropTypes.bool,
    icon: PropTypes.bool,
    icons: PropTypes.bool,
    maxItems: PropTypes.number,
    navigation: PropTypes.array,
    rightAlign: PropTypes.bool,
    separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    title: PropTypes.bool,
    titleBottom: PropTypes.bool,
    sx: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default Breadcrumbs;
