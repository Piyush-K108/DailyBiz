import React from "react";
import ClockLoader from "react-spinners/ClockLoader";
import PropTypes from "prop-types";

const Loader = (props) => {
    return (
        // <div className="sweet-loading" style={{ marginTop: "1px" }}>
        <ClockLoader
            color={props.color ? props.color : "#fff"}
            size={props.size ? props.size : 15}
            loading={props.isLoading}
            speedMultiplier={1}
        />
        // </div>
    );
};
Loader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
};
export default Loader;
