import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Attributes extends Component {
  static propTypes = {
    chart: PropTypes.object,
    droppedItems: PropTypes.array,
    onDropColumn: PropTypes.func,
    onDragOver: PropTypes.func,
    columnRemove: PropTypes.func,
  }
  constructor(props) {
      super(props);
      this.state = {}
  }
  render() {
      const {chartTypes, selectedChart} = this.props.chart;
      const {onDropColumn, onDragOver, droppedItems, columnRemove} = this.props;
      console.log('droppedItems: kbt ', droppedItems);

      let rowData = droppedItems.filter(item => item.type === 'Rows')
      let columnData = droppedItems.filter(item => item.type === 'Columns')
      let legendData = droppedItems.filter(item => item.type === 'Legends')
      let chartTypesUI = chartTypes.map(item => <span className='chart-thumbnail'></span>)
      console.log('chartTypes: ', chartTypes.length);
      return (
          <div className='attribute-container'>
              <div className="chart-types">
                  <div> Chart Types </div>
                  <div className='chart-thumbnail-body'>{chartTypesUI}</div>
              </div>
              <div className="settings">
                  <div> Settings </div>
                  <div className='settings-body'>
                      <SettingComponent title='Rows' data={rowData} {...{onDropColumn, onDragOver, columnRemove}}/>
                      <SettingComponent title='Columns' data={columnData} {...{onDropColumn, onDragOver, columnRemove}}/>
                      <SettingComponent title='Legends' data={legendData} {...{onDropColumn, onDragOver, columnRemove}}/>
                  </div>
              </div>
          </div>
      );
  }
}

const SettingComponent = (props) => {
  const {title, data, onDropColumn, onDragOver, columnRemove} = props;
  let droppedColumns = data.map(item => <div key={item.Key} className='dropped-column'>
      {item.title}
      <span className='close' onClick={()=>columnRemove(item, 'onCheck')}>x</span>
  </div>)
  return (
      <div key={data.Key} className='setting-component' onDragOver={onDragOver} onDrop={(e)=>onDropColumn(e, title)}>
          <div className="setting-title">{title}</div>
          <div className="dropped-columns-body">
              {droppedColumns}
          </div>
      </div>
  )
}

export default Attributes;