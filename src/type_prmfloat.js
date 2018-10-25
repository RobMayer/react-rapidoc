import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class PrmFloat extends BasePrm {

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

		valueStep: PropTypes.number,
		minValue: PropTypes.number,
		maxValue: PropTypes.number,
	}

	getTypeName() { return "Float" }
	getTypeInfo(props) { return "A number that can have decimals. Might have a minimum or maximum value. May also be required to be a multiple of a so-called 'step'."; }
	getTypeExample(props) { return 1.25; }

	getSampleValue(props, override) { return 1.5; }

	parseGenValue(theValue, props, generator, path) {
		return parseFloat(theValue) || 0;
	}

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let theValue = _.get(generator.state, ["values", ...fnlPath], this.generateSample(props, false));
		return (
				<RUI.TextInput
					value={theValue}
					onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath], val));}}
					valid={
						(theValue == parseFloat(theValue)) &&
						(props.hasOwnProperty("minValue") ? (theValue >= props.minValue) : true) &&
						(props.hasOwnProperty("maxValue") ? (theValue <= props.maxValue) : true) &&
						(props.hasOwnProperty("valueStep") ? ((theValue % props.valueStep) == 0.0) : true)
					}
				/>
		);
	}

	getAdditionalParams(props) {
		return (
			<Fragment>
				{props.hasOwnProperty("minValue") && (<div className={styles['param']}><span className={styles['label']}>Minimum Value:</span> <span className={styles['value']}>{props.minValue}</span></div>)}
				{props.hasOwnProperty("maxValue") && (<div className={styles['param']}><span className={styles['label']}>Maximum Value:</span> <span className={styles['value']}>{props.maxValue}</span></div>)}
				{props.hasOwnProperty("valueStep") && (<div className={styles['param']}><span className={styles['label']}>Value Step:</span> <span className={styles['value']}>{props.valueStep}</span></div>)}
			</Fragment>
		);
	}
}
