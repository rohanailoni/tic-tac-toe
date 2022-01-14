import React from "react";
import "../App.css"
function Square({val,choosesquare,touch}){
    
    return(
        <div onClick={choosesquare} className="square" style={{pointerEvents: `${touch}`}}>
            {val}
        </div>
    )
}

export default Square;