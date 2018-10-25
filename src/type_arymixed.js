import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BaseAry from './base_ary';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class AryMixed extends BaseAry {

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

		types: PropTypes.arrayOf(PropTypes.oneOf(["String", "Float", "Integer", "Boolean"])).isRequired,
	}
	static defaultProps = {
		types: ["String", "Float", "Integer", "Boolean"],
	}

	getTypeName() { return "Array (Mixed)" }
	getTypeInfo(props) { return "This is an array of mix-typed values."; }


	getSampleValue(props, override) { return ["Foo", false, 4.5]; }

	parseEachGenElement(element, index, props, generator, path) {
		let theType = _.get(generator.state, ["options", [...fnlPath,index].join("_"), "type"], props.types[0]);
		return Helper.parseMixedValue(element, theType);
	}

	getGenChildren(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) { return null; }

		let theAry = _.get(generator.state, ["values", ...fnlPath], []);
		let theInput = [];

		let typeOptions = [];
		props.types.forEach(function(each, idx) {
		typeOptions.push(
				<RUI.DropdownButton.Option value={each} key={idx}>{each}</RUI.DropdownButton.Option>
			);
		});

		theAry.forEach((theValue,idx) => {

			let theType = _.get(generator.state, ["options", [...fnlPath,idx].join("_"), "type"], props.types[0]);

			theInput.push(
				<div className={styles['samplemaker_input_optioneach']}>
					<RUI.DropdownButton
						value={theType}
						onChange={(val) => {generator.setState(fp.set(generator.state,["options", [...fnlPath,idx].join("_"), "type"], val));}}
					>
					{typeOptions}
					</RUI.DropdownButton>
					<RUI.TextInput
						value={theValue}
						onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath,idx], val));}}
						valid={Helper.validateMixedValue(theValue, theType)}
					/>
				</div>
			);
		});

		return theInput.length > 0 ? theInput : null;
	}

	getAdditionalParams(props) {
		return (
			<Fragment>
				{this.props.hasOwnProperty("types") && (<div className={styles['param']}><span className={styles['label']}>Valid Types:</span> <span className={styles['value']}>{_.isArray(this.props.types) ? this.props.types.join(", ") : this.props.types}</span></div>)}
			</Fragment>
		);
	}

}