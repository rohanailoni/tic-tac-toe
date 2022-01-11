import React from "react";
import "../App.css"
function Square({val,choosesquare}){
    return(
        <div onClick={choosesquare} className="square">
            {val}
        </div>
    )
}

export default Square;