import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BaseLst from './base_lst';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class LstString extends BaseLst {

	constructor(props, ...params) {
		super(props, ...params);
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		emptiable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.arrayOf(PropTypes.string),
		sample: PropTypes.arrayOf(PropTypes.string),

		seperator: PropTypes.string,
		minCount: PropTypes.number,
		maxCount: PropTypes.number,

		pattern: PropTypes.instanceOf(RegExp),
		minLength: PropTypes.number,
		maxLength: PropTypes.number,
	}

	static defaultProps = {
		seperator: ","
	}

	getTypeName() { return "List (String)" }
	getTypeInfo(props) { return "A concatenation of strings, typically seperated by commas, that usually is treated like an array server-side."; }
	getTypeExample(props) { return ('"Foo'+props.seperator+'Bar"'); }

	getSampleValue(props, override) { return "Foo"+props.seperator+"Bar" }

	getGenChildren(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) { return null; }

		let theAry = _.get(generator.state, ["values", ...fnlPath], []);
		let theInput = [];

		theAry.forEach((theValue,idx) => {
			theInput.push(
				<div className={styles['samplemaker_input_optioneach']} key={idx}>
					<RUI.TextInput
						value={theValue}
						onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath, idx], val));}}
						valid={
							(props.hasOwnProperty("pattern") ? (theValue.match(props.pattern) ? true : false) : true) &&
							(props.hasOwnProperty("minLength") ? (theValue.length >= props.minLength ? true : false) : true) &&
							(props.hasOwnProperty("maxLength") ? (theValue.length <= props.maxLength ? true : false) : true)
						}
					/>
				</div>
			);
		});

		return theInput.length > 0 ? theInput : null;
	}

	getAdditionalParams(props) {
		return (
			<Fragment>
				{props.hasOwnProperty("pattern") && (<div className={styles['param']}><span className={styles['label']}>Pattern:</span> <span className={styles['value']}>{props.pattern.toString()}</span></div>)}
				{props.hasOwnProperty("minLength") && (<div className={styles['param']}><span className={styles['label']}>Minimum Length:</span> <span className={styles['value']}>{props.minLength}</span></div>)}
				{props.hasOwnProperty("maxLength") && (<div className={styles['param']}><span className={styles['label']}>Maximum Length:</span> <span className={styles['value']}>{props.maxLength}</span></div>)}
			</Fragment>
		);
	}

}
