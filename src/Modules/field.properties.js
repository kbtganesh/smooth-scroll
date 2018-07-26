import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TreeRow from '../Components/TreeRow'

class FieldProperties extends Component {
  static propTypes = {
    treeData: PropTypes.object,
    onChecked: PropTypes.func,
    onExpandCollapse: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragOver: PropTypes.func,
    onDrop: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = { 

     }
  }
  render() { 
    const {treeData, onChecked, onExpandCollapse, onDragStart, onDragOver, onDrop} = this.props;
    let tree = folderTree(treeData, onChecked, onExpandCollapse, onDragStart, onDragOver, onDrop)
    return tree;
  }
}

function folderTree(treeData, onChecked, onExpandCollapse, onDragStart, onDragOver, onDrop) {
  if (!treeData)
      return;

  return (
      <ul style={{ paddingRight: '16px' }} >
          {treeData.map((item, i) => {
              const { hasChildren, children, expanded, selected, title, key } = item
              let childrenCount = 0;
              // Check count only for 1st layer Parent Nodes.
              if (key.split('-').length === 3)
                  childrenCount = countSelected(children);
              return (
                  <li data-id={i} data-key={key} data-title={title} key={'parent-list' + i} {...{ onDragStart, onDragOver, onDrop }} draggable>
                      <ul key={'Tree-' + title + '-' + i}>
                          <li style={{ paddingLeft: hasChildren ? '20px' : '0px' }} >
                              <TreeRow withArrow={hasChildren} {...{ title, Key: key, childrenCount, selected, expanded, onChecked, onExpandCollapse }} />
                          </li>
                          {expanded && folderTree(children, onChecked, onExpandCollapse, onDragStart, onDragOver, onDrop)}
                      </ul>
                  </li>
              )
          })}
      </ul>
  )
}

function countSelected(arr) {
  let count = 0;
  if (Array.isArray(arr))
      arr.forEach(item => {
          // console.log('kbt- title: ', item.title);
          if (item.hasChildren && item.children) {
              count = count + countSelected(item.children, 0);
          } else {
              if (item.selected) {
                  count = count + 1;
              }
          }
      })
  return count;
}
 
export default FieldProperties;