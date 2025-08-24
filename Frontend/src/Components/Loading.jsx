import React from "react";

const Loading = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <img
        src="https://media.tenor.com/Ug6cbVA1ZsMAAAAC/loading.gif"
        alt="Loadingggg..."
        width="120"
      />
      <p style={{ fontSize: "18px", marginTop: "10px" }}>Loading...</p>
    </div>
  );
};

export default Loading;
