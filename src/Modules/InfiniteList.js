import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ListRow from "../Components/ListRow";
import './InfiniteList.css'
class InfiniteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleRows: [],
            data: [],
        }
        this.rowLimit = 100;
        this.manualScrollCapture = 0;
        this.onScroll = this.onScroll.bind(this); 
    }
    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(json => {
                let data = json.map((item, i) => {return {value: item.title.substr(0, 35), index: i+1}})
                let visibleRows = data.slice(0, (window.innerHeight/68)+10);
                data.length = 300;
                this.setState({ data, visibleRows })
            })
            // let elem = document.getElementById('wrapper');
            let elem = window;
        this.container.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        this.container.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll(event){
        let scrollTop = this.container.scrollTop
        let height = this.container.offsetHeight
        let scrollHeight = this.container.scrollHeight
        let r = Math.round;
        var startSplice = r(scrollTop/68);
        startSplice -= 5;
        startSplice = startSplice < 0 ? 0 : startSplice;
        var noOfRowsInView = r(height/68);
        console.log('noOfRowsInView: ', noOfRowsInView);

        this.setState(prevState => {
            //   console.log('--------------------------');
            //   console.log('Adding ' + this.rowLimit + ' more rows...');
            //   console.log('No of Rows: ', prevState.visibleRows.length+this.rowLimit);
            //   let length = prevState.visibleRows.length;
            let visibleRows = prevState.data.slice(startSplice, startSplice + noOfRowsInView + 5);
            console.log('visibleRows: ', visibleRows);
            return { visibleRows }
        });
    }

    render() {
        let rows = this.state.visibleRows.map((item, i) => <ListRow data={item.value} key={item.index} index={item.index} style={{position: 'absolute', top: 68*(item.index-1), width: '100%'}} />)
        return (<div className='infinite-list'>
            {/* <div className="fab">
                <span onClick={this.scrollToTop} className="up-arrow"></span>
            </div> */}
            <div className="header">
                Infinite List
            </div>
            <div className="container" ref={input=>{this.container = input}}>
                <div className="wrapper" 
                    id = 'wrapper'
                     onWheel={this.onWheel} 
                     style={{height: 68*this.state.data.length}} 
                     >
                    {rows}
                </div>
            </div>
        </div>);
    }
}

export default InfiniteList;