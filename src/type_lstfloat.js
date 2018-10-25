import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BaseLst from './base_lst';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class LstFloat extends BaseLst {

	constructor(props, ...params) {
		super(props, ...params);
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		emptiable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.arrayOf(PropTypes.number),
		sample: PropTypes.arrayOf(PropTypes.number),

		seperator: PropTypes.string,
		minCount: PropTypes.number,
		maxCount: PropTypes.number,

		valueStep: PropTypes.number,
		minValue: PropTypes.number,
		maxValue: PropTypes.number,
	}

	static defaultProps = {
		seperator: ","
	}

	getTypeName() { return "List (Float)" }
	getTypeInfo(props) { return "A concatenation of float (decimal) values, typically seperated by commas, that usually is treated like an array server-side."; }
	getTypeExample(props) { return ('54.31'+props.seperator+'37.384'); }

	getSampleValue(props, override) { return "68.318"+props.seperator+"684.843" }

	getAppendValue(props,generator,path) {
		return 0;
	}

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
							(theValue == parseInt(theValue)) &&
							(props.hasOwnProperty("minValue") ? (theValue >= props.minValue) : true) &&
							(props.hasOwnProperty("maxValue") ? (theValue <= props.maxValue) : true) &&
							(props.hasOwnProperty("valueStep") ? ((theValue % props.valueStep) == 0) : true)
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
				{props.hasOwnProperty("minValue") && (<div className={styles['param']}><span className={styles['label']}>Element Minimum Value:</span> <span className={styles['value']}>{props.minValue}</span></div>)}
				{props.hasOwnProperty("maxValue") && (<div className={styles['param']}><span className={styles['label']}>Element Maximum Value:</span> <span className={styles['value']}>{props.maxValue}</span></div>)}
				{props.hasOwnProperty("valueStep") && (<div className={styles['param']}><span className={styles['label']}>Element Step:</span> <span className={styles['value']}>{props.valueStep}</span></div>)}
			</Fragment>
		);
	}

}
