import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BaseAry from './base_ary';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class AryFloat extends BaseAry {

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

		minCount: PropTypes.number,
		maxCount: PropTypes.number,

		valueStep: PropTypes.number,
		minValue: PropTypes.number,
		maxValue: PropTypes.number,
	}

	getTypeName() { return "Array (Float)" }
	getTypeInfo(props) { return "An array of floats. When used in Request/Response bodies, these will be JSON arrays. In URL parameters, empty brackets [] or indexed brackets [1] in the key will be used to denote array members. See the section example."; }
	getTypeExample(props) { return '[1.125,3.875]'; }

	getSampleValue(props, override) { return [1.843, 3.6843]; }

	parseEachGenElement(element, index, props, generator, path) { return parseFloat(element) || 0; }

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
							(theValue == parseFloat(theValue)) &&
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