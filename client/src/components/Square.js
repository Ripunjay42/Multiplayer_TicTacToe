import React from "react";

function Square({ chooseSquare, val }) 
{

    let elementStyle = {
      color: 'red', // Set the color to whatever you need
    };
    if(val==="O")
    {
      elementStyle = {
        color: 'rgb(29, 236, 22)', // Set the color to whatever you need
      };
    }

  return (
    <div style={elementStyle} className="square" onClick={chooseSquare}>
      {val}
    </div>
  );
}

export default Square;
