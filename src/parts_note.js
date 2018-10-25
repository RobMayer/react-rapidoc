import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import styles from './apidoc.css';

export default class Note extends Component {

	render() {
		return (
			<div className={styles['note']}>{this.props.children}</div>
		);
	}

}