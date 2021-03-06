import React, { Component } from 'react';
import ListRow from "../Components/ListRow";
import TreeRow from "../Components/TreeRow";
import TreeData from "./ReportsColumn.json";
import Tree, { TreeNode } from 'rc-tree';
import ReactDOM from 'react-dom';
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
            vaada: false,
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
        this.getNodeUsingKey = this.getNodeUsingKey.bind(this);
        this.columnAddOrRemove = this.columnAddOrRemove.bind(this);
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
        this.container.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        this.container.removeEventListener('scroll', this.onScroll, false);
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
              console.log('No of Rows: ', prevState.visibleRows.length+this.rowLimit);
            //   let length = prevState.visibleRows.length;
            let visibleRows = prevState.data.slice(startSplice, startSplice + noOfRowsInView + 5);
            return { visibleRows }
        });
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
        let duplicate = this.state.droppedItems.find(item => item.key === columnNode.key)
        if (target.selected) {
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

    onDropWorkArea(e) {
        const columnDropped = JSON.parse(e.dataTransfer.getData('from'));
        this.columnAddOrRemove(columnDropped, 'onDrop');
    }

    vaada(){
        this.setState((pS) => {return {vaada: !pS.vaada}});
    }

    render() {

        /****************** Tree - Start ****************/
        // JSON Tree with Expand Collapse, Drag n Drop
        let tree = folderTree(this.state.treeData, this.onChecked, this.onExpandCollapse, this.onDragStart, this.onDragEnd, this.onDragOver, this.onDrop);

        // Simple JSON Tree - No Expand Collapse, Drag n Drop
        let jsonTree = Object.keys(TreeData).map(item => <TreeRow title={item} withArrow={TreeData[item]} />)
        /****************** Tree - End ****************/

        let droppedItems = this.state.droppedItems.map(item => <span className='card'> {item.title} </span>)

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
                // onScroll={this.onScroll}
                style={{ height: 68 * this.state.data.length }}>
                {rows}
            </div>
        </div>
        /****************** Infinite List - End ****************/


        return (
            <div className={'infinite-list ' + (this.state.vaada?'three-column':'two-column')} style={{ height: window.innerHeight - 64 }}>
                <div className="header"> Tree POC </div>
                {list}
                {/* <div style={{position: 'absolute', visibility: 'hidden'}} id="drag-img"></div>
                <div className="left-panel">
                    {tree}
                    <button type='button' onClick={this.vaada.bind(this)}> Vaada </button>
                </div>
                {this.state.vaada && <div className="creation">

                </div>}
                <div className="work-area" onDragOver={(e) => { e.preventDefault() }} onDrop={this.onDropWorkArea}>
                    {droppedItems}
                </div> */}
            </div>
        );
    }
}

function countSelected(arr){
    let count = 0;
    if(Array.isArray(arr))
	arr.forEach(item => {
        // console.log('kbt- title: ', item.title);
		if(item.hasChildren && item.children){
            console.log('kbt- recursive: ', count, item.children);
			count = count + countSelected(item.children, 0);
		}else{
			if(item.selected){
                console.log('kbt- item selected', count, item.title);
                count = count+1;
            }
		}
	})
	return count;
}

function folderTree(treeData, onChecked, onExpandCollapse, onDragStart, onDragEnd, onDragOver, onDrop) {
    if (!treeData)
        return;

    return (
        <ul style={{ paddingRight: '16px' }} >
            {treeData.map((item, i) => {
                const { hasChildren, children, expanded, selected, title, key } = item
                let childrenCount = 0;
                // Check count only for 1st layer Parent Nodes.
                if(key.split('-').length === 3)
                childrenCount = countSelected(children);
                return (
                    <li data-id={i} data-key={key} data-title={title} key={'parent-list' + i} {...{ onDragStart, onDragEnd, onDragOver, onDrop }} draggable>
                        <ul key={'Tree-' + title + '-' + i}>
                            <li style={{ paddingLeft: hasChildren ? '20px' : '0px' }} >
                                <TreeRow withArrow={hasChildren} {...{ title, Key: key, childrenCount, selected, expanded, onChecked, onExpandCollapse }} />
                            </li>
                            {console.log('children', JSON.stringify(item))}
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