import React, { Component } from 'react';
import ListRow from "../Components/ListRow";
import TreeRow from "../Components/TreeRow";
import TreeData from "./ReportsColumn.json";
import Tree, { TreeNode } from 'rc-tree';
import './InfiniteList.css'
import 'rc-tree/assets/index.css';
class InfiniteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleRows: [],
            data: [],
            treeData: restructure(TreeData, 0),
            droppedItems: [],
        }
        this.rowLimit = 100;
        this.manualScrollCapture = 0;
        this.onScroll = this.onScroll.bind(this);
        this.onChecked = this.onChecked.bind(this);
        this.onExpandCollapse = this.onExpandCollapse.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDropWorkArea = this.onDropWorkArea.bind(this);
    }
    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(json => {
                let data = json.map((item, i) => { return { value: item.title.substr(0, 35), index: i + 1 } })
                let visibleRows = data.slice(0, (window.innerHeight / 68) + 10);
                data.length = 300;
                this.setState({ data, visibleRows })
            })
        // this.container.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        // this.container.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll(event) {
        let scrollTop = this.container.scrollTop
        let height = this.container.offsetHeight
        let scrollHeight = this.container.scrollHeight
        let r = Math.round;
        var startSplice = r(scrollTop / 68);
        startSplice -= 5;
        startSplice = startSplice < 0 ? 0 : startSplice;
        var noOfRowsInView = r(height / 68);

        this.setState(prevState => {
            //   console.log('--------------------------');
            //   console.log('Adding ' + this.rowLimit + ' more rows...');
            //   console.log('No of Rows: ', prevState.visibleRows.length+this.rowLimit);
            //   let length = prevState.visibleRows.length;
            let visibleRows = prevState.data.slice(startSplice, startSplice + noOfRowsInView + 5);
            return { visibleRows }
        });
    }

    onChecked(key) {
        console.log('key: ', key);
        let Key = key.split('-');
        Key.length = Key.length - 1;
        let treeData = this.state.treeData;
        let target = Key.reduce((dummy, value, count, Key) => {
            let length = Key.length - 1;
            let lastLoop = count === length;
            if (count === 1) {
                return lastLoop ? treeData[value] : treeData[value].children
            } else {
                return lastLoop ? dummy[value] : dummy[value].children
            }
        })

        target.selected = !target.selected;
        console.log('target.checked: ', target.selected);
        this.setState({ treeData });

    }

    onExpandCollapse(key) {
        let Key = key.split('-');
        Key.length = Key.length - 1;
        let treeData = this.state.treeData;
        let target = Key.reduce((dummy, value, count, Key) => {
            let length = Key.length - 1;
            let lastLoop = count === length;
            if (count === 1) {
                return lastLoop ? treeData[value] : treeData[value].children
            } else {
                return lastLoop ? dummy[value] : dummy[value].children
            }
        })
        target.expanded = !target.expanded;
        this.setState({ treeData })
    }

    onDragStart(e) {
        let id = e.currentTarget.dataset.id;
        let key = e.currentTarget.dataset.key;
        let title = e.currentTarget.dataset.title;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('from', JSON.stringify({ id, key, title }));
        e.stopPropagation()
    }

    onDragEnd(e) {

    }

    onDragOver(e) {
        e.preventDefault();
    }

    onDrop(e) {
        let to = { id: e.currentTarget.dataset.id, key: e.currentTarget.dataset.key };
        let from = JSON.parse(e.dataTransfer.getData('from'));
        console.log('from: ', from);
        console.log('to: ', to);

        // If Drag n Drop doesn't occur in-between siblings, return nothing.
        if (to.key.split('-').slice(0, -2).join('-') !== from.key.split('-').slice(0, -2).join('-'))
            return;

        let Key = from.key.split('-');
        Key.length = Key.length - 2;
        let treeData = this.state.treeData;

        // If - Child Elements Swap, Else - Parent Elements Swap
        if (Key.length > 1) {
            let target = Key.reduce((dummy, value, count, Key) => {
                let length = Key.length - 1;
                let lastLoop = count === length;
                console.log('lastLoop: ', lastLoop);
                if (count === 1) {
                    return lastLoop ? treeData[value] : treeData[value].children
                } else {
                    return lastLoop ? dummy[value] : dummy[value].children
                }
            })
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

    onDropWorkArea(e) {
        const {title} = JSON.parse(e.dataTransfer.getData('from'));
        this.setState(prevState => ({
            droppedItems: [...prevState.droppedItems, title]
          }))
    }

    render() {

        /****************** Tree - Start ****************/
        // JSON Tree with Expand Collapse, Drag n Drop
        let tree = folderTree(this.state.treeData, this.onChecked, this.onExpandCollapse, this.onDragStart, this.onDragEnd, this.onDragOver, this.onDrop);

        // Simple JSON Tree - No Expand Collapse, Drag n Drop
        let jsonTree = Object.keys(TreeData).map(item => <TreeRow title={item} withArrow={TreeData[item]} />)
        /****************** Tree - End ****************/

        let droppedItems = this.state.droppedItems.map(item => <span className='card'> {item} </span>)

        /****************** Infinite List - Start ****************/
        // FAB
        let fab = <div className="fab">
            <span onClick={this.scrollToTop} className="up-arrow"></span>
        </div>

        // Rows
        let rows = this.state.visibleRows.map((item, i) => <ListRow data={item.value} key={item.index} index={item.index} style={{ position: 'absolute', top: 68 * (item.index - 1), width: '100%' }} />)

        // List
        let list = <div className="container" ref={input => { this.container = input }}>
            <div className="wrapper"
                id='wrapper'
                onWheel={this.onWheel}
                style={{ height: 68 * this.state.data.length }}>
                {rows}
            </div>
        </div>
        /****************** Infinite List - End ****************/


        return (
            <div className='infinite-list' style={{ height: window.innerHeight - 64 }}>
                <div className="header"> Tree POC </div>
                    <div className="left-panel">
                        {tree}
                    </div>
                    <div className="work-area"  onDragOver={(e)=>{console.log('ondrag');e.preventDefault()}} onDrop={this.onDropWorkArea}>
                        {droppedItems}
                    </div>
            </div>
        );
    }
}

function folderTree(treeData, onChecked, onExpandCollapse, onDragStart, onDragEnd, onDragOver, onDrop) {
    if (!treeData)
        return;

    return (
        <ul style={{ paddingRight: '16px' }} >
            {treeData.map((item, i) => {
                const { hasChildren, children, childrenCount, expanded, selected, title, key } = item
                return (
                    <li data-id={i} data-key={key} data-title={title} key={'parent-list' + i} {...{ onDragStart, onDragEnd, onDragOver, onDrop }} draggable>
                        <ul key={'Tree-' + title + '-' + i}>
                            <li style={{ paddingLeft: hasChildren ? '20px' : '0px' }} >
                                <TreeRow withArrow={hasChildren} {...{ title, Key: key, childrenCount, selected, expanded, onChecked, onExpandCollapse }} />
                            </li>
                            {/* Show Children only if it's expanded */}
                            {expanded && folderTree(children, onChecked, onExpandCollapse, onDragStart, onDragEnd, onDragOver, onDrop)}
                        </ul>
                    </li>
                )
            })}
        </ul>
    )
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
                return { children, title: item, key: index + '-' + i + '-key', selected: false, hasChildren: !!children, childrenCount: !!children ? children.length : 0, expanded: false }
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

// Not Used
const jsonTree = (treeData) => {

    if (Array.isArray(treeData)) {
        return <ul> {treeData.map(item => <li> <TreeRow title={item} withArrow={true} /> </li>)} </ul>;
    } else {
        if (!treeData)
            return;
        return Object.keys(treeData).map(item => {
            if (Array.isArray(treeData[item])) {
                return (
                    <ul>
                        <li>
                            <TreeRow title={item} withArrow={true} />
                        </li>
                        {jsonTree(treeData[item])}
                    </ul>)
            } else {
                return (
                    <ul>
                        <li>
                            <TreeRow title={item} withArrow={true} />
                        </li>
                        <li>
                            {jsonTree(treeData[item])}
                        </li>
                    </ul>
                )
            }
        });
    }

}

export default InfiniteList;