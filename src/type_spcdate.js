import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class SpcDate extends BasePrm {
	constructor(props, ...params) {
		super(props, ...params);
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.number,
		sample: PropTypes.number,
	}

	getTypeName() { return "Date" }
	getTypeInfo(props) { return "Date reference as an integer in 'YYYYMMDD' format."; }
	getTypeExample(props) { return '20180524'; }
	getTypeCss(props) { return "typeFlagExt"; }

	getSampleValue(props, override) { return 20180524; }

	parseGenValue(theValue, props, generator, path) {
		return parseInt(theValue) || 0;
	}

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		//let theValue = _.get(generator.state, ["values", ...fnlPath], this.getSampleValue(props, false));
		let theValue = _.get(generator.state, ["values", ...fnlPath], this.generateSample(props, false));
		return (
				<RUI.TextInput
					value={theValue}
					onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath], val));}}
					valid={ /^[0-9]{8}$/.test(theValue)}
				/>
		);
	}
}
