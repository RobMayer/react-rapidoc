import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class SpcTimestamp extends BasePrm {
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

	getTypeName() { return "Timestamp" }
	getTypeInfo(props) { return "Number of seconds since the unix epoch (which is January 1st 1970 at 00:00:00 UTC)."; }
	getTypeExample(props) { return '1531773394'; }
	getTypeCss(props) { return "typeFlagExt"; }

	getSampleValue(props, override) { return 1531773394; }

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
					valid={ theValue == parseInt(theValue) }
				/>
		);
	}
}
