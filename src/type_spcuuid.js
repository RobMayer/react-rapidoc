import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class SpcUuid extends BasePrm {

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
	}

	getTypeName() { return "UUID" }
	getTypeInfo(props) { return "Actually a string, but represents a Universally unique identifier, aka: GUID or globally unique identifier. A 128-bit number used to identify information."; }
	getTypeExample(props) { return '"123e4567-e89b-12d3-a456-426655440000"'; }
	getTypeCss(props) { return "typeFlagExt"; }

	getSampleValue(props, override) { return "123e4567-e89b-12d3-a456-426655440000" }

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		//let theValue = _.get(generator.state, ["values", ...fnlPath], this.getSampleValue(props, false));
		let theValue = _.get(generator.state, ["values", ...fnlPath], this.generateSample(props, false));
		return (
				<RUI.TextInput
					value={theValue}
					onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath], val));}}
					valid={ /^[0-9A-Fa-f]{8}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{12}$/.test(theValue)}
				/>
		);
	}

}
