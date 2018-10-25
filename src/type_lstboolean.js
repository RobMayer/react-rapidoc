import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BaseLst from './base_lst';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class LstBoolean extends BaseLst {

	constructor(props, ...params) {
		super(props, ...params);
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		emptiable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.arrayOf(PropTypes.bool),
		sample: PropTypes.arrayOf(PropTypes.bool),

		seperator: PropTypes.string,
		minCount: PropTypes.number,
		maxCount: PropTypes.number,
	}

	static defaultProps = {
		seperator: ","
	}

	getTypeName() { return "List (Boolean)" }
	getTypeInfo(props) { return "Actually a string, but represents a concatenation of booleans, typically seperated by commas, that usually is treated like an array server-side."; }
	getTypeExample(props) { return ('"true'+props.seperator+'false"'); }

	getSampleValue(props, override) { return "true"+props.seperator+"true"+props.seperator+"false" }

	getAppendValue(props,generator,path) {
		return false;
	}

	getGenChildren(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) { return null; }

		let theAry = _.get(generator.state, ["values", ...fnlPath], []);
		let theInput = [];

		theAry.forEach((theValue,idx) => {
			theInput.push(
				<div className={styles['samplemaker_input_optioneach']}>
					<RUI.ToggleButton
						value={theValue}
						onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath, idx], val));}}
					>{theValue ? "True" : "False"}</RUI.ToggleButton>
				</div>
			);
		});
		return theInput.length > 0 ? theInput : null;
	}

}
