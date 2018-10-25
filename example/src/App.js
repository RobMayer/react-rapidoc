import React, { Component } from 'react'

import ApiDoc from 'react-rapidoc'

import styles from './index.css';

export default class App extends Component {
  render () {
	console.log(styles);
    return (
      <div className='wrapper'>
		  <div className='main'>
			<ApiDoc.Contents>
				<ApiDoc.Endpoint method='GET' path='/documents/orders/(documentId)' action='Get Order'>
					
				</ApiDoc.Endpoint>
			</ApiDoc.Contents>
		  </div>
      </div>
    )
  }
}
