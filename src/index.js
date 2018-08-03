import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import InfiniteList from './Modules/InfiniteList';
import Draggable from './Modules/DraggableTree';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<InfiniteList />, document.getElementById('root'));
registerServiceWorker();
