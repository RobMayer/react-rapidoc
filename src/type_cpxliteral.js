import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class CpxLiteral extends BasePrm {
	constructor(props, ...params) {
		super(props, ...params);
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		value: PropTypes.string.isRequired,
	}

	getTypeName() { return "Literal" }
	getTypeInfo(props) { return 'Literally "'+props.value+'". Literal values such as these are usually used as an option to indicate a system-defined constant.'; }
	getTypeExample(props) { return '"'+props.value+'"'; }
	getSampleValue(props, override) { return props.value }
	getGenValue(props, generator, path) { return props.value; }


}