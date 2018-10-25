import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class PrmBoolean extends BasePrm {
	constructor(props, ...params) {
		super(props, ...params);
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.bool,
		sample: PropTypes.bool,
	}

	getTypeName() { return "Boolean" }
	getTypeInfo(props) { return "It's a freakin' boolean..."; }
	getTypeExample(props) { return "false"; }

	getSampleValue(props, override) { return false; }

	parseGenValue(theValue, props, generator, path) {
		return theValue ? "true" : "false";
	}

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let theValue = _.get(generator.state, ["values", ...fnlPath], this.generateSample(props, false));
		return (
				<RUI.ToggleButton
					value={theValue}
					onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath], val));}}
				>{theValue ? "True" : "False"}</RUI.ToggleButton>
		);
	}
}