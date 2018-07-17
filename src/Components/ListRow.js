import React from 'react';
import './ListRow.css'
const ListRow = (props) => {
    return ( <div className="list-row">
        {(props.index+1) + '. '+props.data}
    </div> );
}
 
export default ListRow;