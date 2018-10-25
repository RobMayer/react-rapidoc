import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BaseAry from './base_ary';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class AryBoolean extends BaseAry {

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

		minCount: PropTypes.number,
		maxCount: PropTypes.number,
	}

	getTypeName() { return "Array (Boolean)" }
	getTypeInfo(props) { return "An array of booleans. When used in Request/Response bodies, these will be JSON arrays. In URL parameters, empty brackets [] or indexed brackets [1] in the key will be used to denote array members. See the section example."; }
	getTypeExample(props) { return '[false,true]'; }

	getSampleValue(props, override) { return [true, false]; }

	parseEachGenElement(element, index, props, generator, path) { return element ? true : false; }

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