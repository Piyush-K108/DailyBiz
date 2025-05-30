import React from "react";

function LoadingAnimation(props) {
  const { title } = props;
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="w-16 h-16 border-t-4 border-black rounded-full animate-spin"></div>
      <p className="text-black mt-10">{title}</p>
    </div>
  );
}

export default LoadingAnimation;