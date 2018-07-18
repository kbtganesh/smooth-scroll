import React from 'react';
import './ListRow.css'
const ListRow = (props) => {
    return ( <div className="list-row" style={props.style}>
        {props.index + '. '+props.data}
    </div> );
}
 
export default ListRow;