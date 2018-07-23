import React from 'react';
import './TreeRow.css'
const TreeRow = (props) => {
    const { title, Key, withArrow: hasChildren, expanded, onChecked, onExpandCollapse } = props;
    return (<div className="tree-row" style={{ marginLeft: hasChildren ? '0px' : '13px' }}>
        {hasChildren && <span className='symbol' onClick={() => onExpandCollapse(Key)}> <span className={expanded ? 'arrow-down' : 'arrow-right'} /> </span>}
        <input type="checkbox" id="myCheck" onClick={() => onChecked(Key)} />
        <span> {title} </span>
    </div>);
}

export default TreeRow;