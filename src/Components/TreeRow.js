import React from 'react';
import './TreeRow.css'
const TreeRow = (props) => {
    const { title, Key, withArrow: hasChildren, childrenCount, expanded, selected, onChecked, onExpandCollapse } = props;
    return (
        <div className="tree-row" style={{}}>
            <span id={'symbol-' + Key} className='symbol' style={{ visibility: hasChildren ? 'inherit' : 'hidden' }} onClick={() => onExpandCollapse(Key)}> <span className={expanded ? 'arrow-down' : 'arrow-right'} /> </span>
            <input type="checkbox" id={'check-box-' + Key} checked={!!selected} onClick={() => onChecked(Key)} />
            <span className='label' style={{ fontWeight: hasChildren ? 'bold' : 'normal' }} onClick={() => hasChildren ? onExpandCollapse(Key) : onChecked(Key)}>
                <label>{title}</label>
                {false && <label>{childrenCount}</label>}
            </span>
        </div>
    );
}

export default TreeRow;