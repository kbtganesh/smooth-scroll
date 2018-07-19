import React from 'react';
import './ListRow.css'
const TreeRow = (props) => {
    return ( <div className="tree-row" style={props.style}>
        <input type="checkbox" id="myCheck" onclick="myFunction()" />
        {props.title}
    </div> );
}
 
export default TreeRow;