import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BaseAry from './base_ary';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class AryString extends BaseAry {

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

		minCount: PropTypes.number,
		maxCount: PropTypes.number,

		pattern: PropTypes.instanceOf(RegExp),
		minLength: PropTypes.number,
		maxLength: PropTypes.number,
	}

	getTypeName() { return "Array (String)" }
	getTypeInfo(props) { return "An array of strings. When used in Request/Response bodies, these will be JSON arrays. In URL parameters, empty brackets [] or indexed brackets [1] in the key will be used to denote array members. See the section example."; }
	getTypeExample(props) { return '["Foo","Bar"]'; }

	getSampleValue(props, override) { return ["Foo", "Bar"]; }

	getGenChildren(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) { return null; }

		let theAry = _.get(generator.state, ["values", ...fnlPath], []);
		let theInput = [];

		theAry.forEach((el,idx) => {
			theInput.push(
				<div className={styles['samplemaker_input_optioneach']} key={idx}>
					<RUI.TextInput
						value={el}
						onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath, idx], val));}}
						valid={
							(props.hasOwnProperty("pattern") ? (el.match(props.pattern) ? true : false) : true) &&
							(props.hasOwnProperty("minLength") ? (el.length >= props.minLength ? true : false) : true) &&
							(props.hasOwnProperty("maxLength") ? (el.length <= props.maxLength ? true : false) : true)
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
				{props.hasOwnProperty("pattern") && (<div className={styles['param']}><span className={styles['label']}>Element Pattern:</span> <span className={styles['value']}>{props.pattern.toString()}</span></div>)}
				{props.hasOwnProperty("minLength") && (<div className={styles['param']}><span className={styles['label']}>Minimum Element Length:</span> <span className={styles['value']}>{props.minLength}</span></div>)}
				{props.hasOwnProperty("maxLength") && (<div className={styles['param']}><span className={styles['label']}>Maximum Element Length:</span> <span className={styles['value']}>{props.maxLength}</span></div>)}
			</Fragment>
		);
	}

}