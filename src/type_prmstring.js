import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class PrmString extends BasePrm {

	constructor(props, ...params) {
		super(props, ...params);
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.string,
		sample: PropTypes.string,

		pattern: PropTypes.instanceOf(RegExp),
		minLength: PropTypes.number,
		maxLength: PropTypes.number,
	}

	getTypeName() { return "String" }
	getTypeInfo(props) { return "A sequence of characters, typically representing a word, sentence, or phrase."; }
	getTypeExample(props) { return '"Foo"'; }

	getSampleValue(props, override) { return "Foo" }

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let theValue = _.get(generator.state, ["values", ...fnlPath], this.generateSample(props, false));
		return (
				<RUI.TextInput
					value={theValue}
					onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath], val));}}
					valid={
						(props.hasOwnProperty("pattern") ? (theValue.match(props.pattern) ? true : false) : true) &&
						(props.hasOwnProperty("minLength") ? (theValue.length >= props.minLength ? true : false) : true) &&
						(props.hasOwnProperty("maxLength") ? (theValue.length <= props.maxLength ? true : false) : true)
					}
				/>
		);
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
