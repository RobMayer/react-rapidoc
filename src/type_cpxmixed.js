import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class CpxMixed extends BasePrm {
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

		types: PropTypes.arrayOf(PropTypes.oneOf(["String", "Float", "Integer", "Boolean"])).isRequired,
	}
	static defaultProps = {
		types: ["String", "Float", "Integer", "Boolean"],
	}

	getTypeName() { return "Mixed" }
	getTypeInfo(props) { return "This can represent a mixed value, so long as it is appropriate for the request/response type (JSON for body, URL-capable string for a query parameter)."; }
	getTypeExample(props) { return null; }

	getSampleValue(props, override) { return "FooBar"; }

	parseGenValue(theValue, props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let theType = _.get(generator.state, ["options", fnlPath].join("_"), props.types[0]);
		return Helper.parseMixedValue(theValue, theType);
	}

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let typeOptions = [];
		props.types.forEach(function(each, idx) {
			typeOptions.push(
				<RUI.DropdownButton.Option value={each} key={idx}>{each}</RUI.DropdownButton.Option>
			);
		});

		return (
			<Fragment>
				<RUI.DropdownButton
					value={_.get(generator.state, ["options", fnlPath].join("_"), props.types[0])}
					onChange={(val) => {generator.setState(fp.set(generator.state,["options", fnlPath].join("_"), val));}}
				>
				{typeOptions}
				</RUI.DropdownButton>
				<RUI.TextInput
					value={_.get(generator.state, ["values", ...fnlPath], this.generateSample(props, false))}
					onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath], val));}}
					valid={
						Helper.validateMixedValue(
							_.get(generator.state, ["values", ...fnlPath], this.generateSample(props, false)),
							_.get(generator.state, ["options", fnlPath].join("_"), props.types[0])
						)
					}
				/>
			</Fragment>
		);
	}

	getAdditionalParams(props) {
		return (
			<Fragment>
				{this.props.hasOwnProperty("types") && (<div className={styles['param']}><span className={styles['label']}>Valid Types:</span> <span className={styles['value']}>{_.isArray(this.props.types) ? this.props.types.join(", ") : this.props.types}</span></div>)}
			</Fragment>
		);
	}

}