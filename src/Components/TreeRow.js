import React from 'react';
import './TreeRow.css'
const TreeRow = (props) => {
    const { title, Key, withArrow: hasChildren, childrenCount, expanded, selected, onChecked, onExpandCollapse } = props;
    return (
        <div id={Key} className="tree-row" style={{}}>
            <span id={'symbol-' + Key} className='symbol' style={{ visibility: hasChildren ? 'inherit' : 'hidden' }} onClick={() => onExpandCollapse(Key)}> <span className={expanded ? 'arrow-down' : 'arrow-right'} /> </span>
            <input type="checkbox" id={'check-box-' + Key} checked={!!selected} onClick={() => onChecked({title, key:Key})} />
            <span className='label' style={{ fontWeight: hasChildren ? 'bold' : 'normal' }} onClick={() => hasChildren ? onExpandCollapse(Key) : onChecked({title, key:Key})}>
                <label>{title}</label>
                {!!childrenCount && <label className='count'>{childrenCount}</label>}
            </span>
        </div>
    );
}

export default TreeRow;