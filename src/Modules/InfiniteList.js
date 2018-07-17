import React, { Component } from 'react';
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
         
    }
    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(json => {
                    let data = json.map((item, i) => ('-' + (i+1) + ' ' + item.title.substr(0,35)))
                    let visibleRows = data.slice(0,this.rowLimit);
                    this.setState({data, visibleRows})
            })
            window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => {
        console.log('---------------------')
        console.log('window.scrollY: ', window.scrollY);
        console.log('window.innerHeight: ', window.innerHeight);
        let rowHeight = 68;
        let scrollY = window.scrollY+(rowHeight*5);
        let viewHeight = window.innerHeight;
        let noOfRowsInDom = (viewHeight/rowHeight);
        console.log('noOfRowsInDom: ', noOfRowsInDom);
        console.log('scrollY/rowHeight: ', scrollY/rowHeight);
        let startSplice = scrollY/rowHeight;
        console.log('startSplice: ', startSplice);
        startSplice = startSplice < 0 ? 0 : startSplice;

        // if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {

            this.setState(prevState => {
            //   console.log('--------------------------');
            //   console.log('Adding ' + this.rowLimit + ' more rows...');
            //   console.log('No of Rows: ', prevState.visibleRows.length+this.rowLimit);
            //   let length = prevState.visibleRows.length;
              let visibleRows = prevState.data.slice(startSplice, startSplice+noOfRowsInDom);
              console.log('visibleRows: ', visibleRows);
              return { visibleRows }
            });

        // }
    }

    scrollToTop(){
        window.scrollTo(0,0);
    }

    render() {
        let rows = this.state.visibleRows.map((item, i) => <ListRow data={item} key={i} index={i}/>)
        return ( <div className='infinite-list'>
        <div className="fab">
            <span onClick={this.scrollToTop} className="up-arrow"></span>
        </div>
            <div className="header">
                Infinite List
            </div>
            {rows}
        </div> );
    }
}
 
export default InfiniteList;