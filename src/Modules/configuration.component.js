import React, { Component } from 'react';
import TreeRow from "../Components/TreeRow";
import TreeData from "./ReportsColumn.json";
import FieldProperties from "./field.properties";
import Attributes from "./settings"
import './InfiniteList.css'
class InfiniteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: restructure(TreeData, 0),
            droppedItems: [],
            vaada: true,
            chart: {
                chartTypes: ['pie', 'graph', 'bar', 'table', 'pie', 'graph', 'bar', 'table', 'bar', 'table', 'bar', 'table' ],
                selectedChart: ''
            },
            settings: { dimentionX: ['afsd', 'fdsa'], measureY: ['fd', 'gsdfe'], legend: [] },
            appearance: [],
        }
        this.rowLimit = 100;
        this.manualScrollCapture = 0;
        this.onChecked = this.onChecked.bind(this);
        this.onExpandCollapse = this.onExpandCollapse.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDropWorkArea = this.onDropWorkArea.bind(this);
        this.getNodeUsingKey = this.getNodeUsingKey.bind(this);
        this.columnAddOrRemove = this.columnAddOrRemove.bind(this);
    }
    
    onChecked(node) {
        this.columnAddOrRemove(node, 'onCheck');
    }

    onExpandCollapse(key) {
        let Key = key.split('-');
        Key.length = Key.length - 1;
        let treeData = this.state.treeData;
        let target = this.getNodeUsingKey(Key);
        target.expanded = !target.expanded;
        this.setState({ treeData })
    }

    onDragStart(e) {
        let id = e.currentTarget.dataset.id;
        let key = e.currentTarget.dataset.key;
        let title = e.currentTarget.dataset.title;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('from', JSON.stringify({ id, key, title }));
        // let img = ReactDOM.render(<span className='card'>{title}</span>, document.getElementById(key));
        // let img = document.getElementById(key);
        // e.dataTransfer.setDragImage(img, 100, 0);
        e.stopPropagation()
    }

    onDragOver(e) {
        e.preventDefault();
    }

    onDrop(e) {
        let to = { id: e.currentTarget.dataset.id, key: e.currentTarget.dataset.key };
        let from = JSON.parse(e.dataTransfer.getData('from'));

        // If Drag n Drop doesn't occur in-between siblings, return nothing.
        if (to.key.split('-').slice(0, -2).join('-') !== from.key.split('-').slice(0, -2).join('-'))
            return;

        let Key = from.key.split('-');
        Key.length = Key.length - 2;
        let treeData = this.state.treeData;

        // If - Child Elements Swap, Else - Parent Elements Swap
        if (Key.length > 1) {
            let target = this.getNodeUsingKey(Key);
            target.children = target.children.move(from.id, to.id);
            for (let i = 0; i < target.children.length; i++) {
                let splitArr = target.children[i].key.split('-');
                splitArr[splitArr.length - 2] = i;
                changeKey(target.children[i], splitArr.join('-'));
            }
        } else {
            let treeData = this.state.treeData.move(from.id, to.id);
            for (let i = 0; i < treeData.length; i++) {
                let splitArr = treeData[i].key.split('-');
                splitArr[splitArr.length - 2] = i;
                changeKey(treeData[i], splitArr.join('-'));
            }
        }
        this.setState({ treeData });
        e.stopPropagation()
    }

    columnAddOrRemove(columnNode, event) {
        let Key = columnNode.key.split('-');
        Key.length = Key.length - 1;
        let treeData = this.state.treeData;
        let target = this.getNodeUsingKey(Key);
        if (target.selected) {
            // If selected element dropped again, do nothing.
            if (event === 'onDrop')
                return;
            target.selected = false
            this.setState(prevState => {
                let droppedItems = prevState.droppedItems;
                droppedItems.splice(droppedItems.findIndex(item => item.key === columnNode.key), 1);
                return { droppedItems, treeData }
            })
        } else {
            target.selected = true;
            this.setState(prevState => ({
                droppedItems: [...prevState.droppedItems, columnNode], treeData
            }))
        }
    }

    getNodeUsingKey(Key) {
        let treeData = this.state.treeData;
        return Key.reduce((dummy, value, count, Key) => {
            let length = Key.length - 1;
            let lastLoop = count === length;
            if (count === 1) {
                return lastLoop ? treeData[value] : treeData[value].children
            } else {
                return lastLoop ? dummy[value] : dummy[value].children
            }
        })
    }

    onDropWorkArea(e, title) {
        const columnDropped = JSON.parse(e.dataTransfer.getData('from'));
        columnDropped.type = title;

        this.columnAddOrRemove(columnDropped, 'onDrop');
    }

    vaada() {
        this.setState((pS) => { return { vaada: !pS.vaada } });
    }

    render() {

        let droppedItems = this.state.droppedItems.map(item => <span className='card'> {item.title} </span>)

        return (
            <div className={'infinite-list ' + (this.state.vaada ? 'three-column' : 'two-column')} style={{ height: window.innerHeight - 64 }}>
                <div className="header"> Tree POC </div>
                <div style={{ position: 'absolute', visibility: 'hidden' }} id="drag-img"></div>
                <div className="left-panel">
                    <FieldProperties {...{treeData: this.state.treeData, onChecked: this.onChecked, onExpandCollapse: this.onExpandCollapse,onDragStart: this.onDragStart,onDragEnd: this.onDragEnd, onDragOver: this.onDragOver,onDrop: this.onDrop}} />
                    <button type='button' onClick={this.vaada.bind(this)}> Vaada </button>
                </div>
                {this.state.vaada && <div className="creation">
                    <Attributes {...{droppedItems: this.state.droppedItems, chart: this.state.chart}} columnRemove={this.columnAddOrRemove} onDragOver={this.onDragOver} onDropColumn={this.onDropWorkArea}/>
                </div>}
                <div className="work-area" onDragOver={(e) => { e.preventDefault() }} onDrop={this.onDropWorkArea}>
                    {droppedItems}
                </div>
            </div>
        );
    }
}

function restructure(json, index) {
    if (typeof json === 'object') {
        if (Array.isArray(json)) {
            return json.map((item, i) => { return { children: null, title: item, key: index + '-' + i + '-key', expanded: false, hasChildren: false, selected: false } });
        } else if (!json || typeof json === 'string') {
            return;
        } else {
            return Object.keys(json).map((item, i) => {
                let children = restructure(json[item], index + '-' + i);
                return { children, title: item, key: index + '-' + i + '-key', selected: false, hasChildren: !!children, childrenCount: 0, expanded: false }
            })
        }
    }
}

function changeKey(obj, key) {
    let actualKey = key.split('key')[0];
    let length = actualKey.length;
    obj.key = actualKey + obj.key.substr(length);
    if (obj.children)
        obj.children = obj.children.map(item => changeKey(item, key));
    return obj;
}

Array.prototype.swap = function (x, y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
}

Array.prototype.move = function (fromIndex, toIndex) {
    let element = this[fromIndex];
    this.splice(fromIndex, 1);
    this.splice(toIndex, 0, element);
    return this;
}

export default InfiniteList;