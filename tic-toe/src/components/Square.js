import React from "react";
import "../App.css"
function Square({val,choosesquare}){
    return(
        <div onClick={choosesquare} className="square" style={{pointerEvents: 'auto'}}>
            {val}
        </div>
    )
}

export default Square;