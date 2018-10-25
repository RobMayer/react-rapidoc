import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class CpxOneOf extends BasePrm {

	constructor(props, ...params) {
		super(props, ...params);
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
	}

	getTypeName() { return "Option" }
	getTypeInfo(props) { return "Flexibility is key. You get to choose one of multiple options for this parameter. See the details for what your options actually are."; }
	getTypeExample(props) { return '"Foo"'; }
	getTypeCss(props) { return "typeFlagMta"; }

	getSampleValue(props, override) {
		if (props.hasOwnProperty("children")) {
			let theChildren = props.children;
			if (props.children.hasOwnProperty("type") && props.children.type == Fragment) {
				theChildren = props.children.props.children;
			}
			if (Array.isArray(theChildren)) {
				for (var i = 0; i < theChildren.length; i++) {
					let child = theChildren[i];

					if (child.hasOwnProperty("type") && child.type.hasOwnProperty("prototype") && "generateSample" in child.type.prototype) {
						return child.type.prototype.generateSample(child.props);
					}
				}
			} else {
				let child = theChildren;
				if (child.hasOwnProperty("type") && child.type.hasOwnProperty("prototype") && "generateSample" in child.type.prototype) {
					return child.type.prototype.generateSample(child.props);
				}
			}
		}
		return "Value";
	}

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let options = [];
		let optionInterface = null;
		let current = _.get(generator.state, ["options", fnlPath.join("_"), "current"], 0);

		React.Children.map(props.children, (child, index) => {
			if ("getSampleValue" in child.type.prototype) {
				options.push(<RUI.DropdownButton.Option key={index} value={index}>{child.props.label || child.props.name || child.props.desc}</RUI.DropdownButton.Option>)
			}
			if (("getGenOptions" in child.type.prototype) && (index == current)) {
				optionInterface = child.type.prototype.getGenOptions(child.props, generator, [...fnlPath, current]);
			}
		});

		return (
			<Fragment>
				<RUI.DropdownButton value={current} onChange={(val) => {generator.setState(fp.set(generator.state, ["options", fnlPath.join("_"), "current"], val));}}>
				{options}
				</RUI.DropdownButton>
				{optionInterface}
			</Fragment>
		);
	}

	getGenChildren(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) { return null; }

		let optionInterface = null;
		let current = _.get(generator.state, ["options", fnlPath.join("_"), "current"], 0);

		React.Children.map(props.children, (child, index) => {

			if (("getGenChildren" in child.type.prototype) && (index == current)) {
				optionInterface = child.type.prototype.getGenChildren(child.props, generator, [...fnlPath, current]);
			}

		});
		return optionInterface;

	}

	getGenValue(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let current = _.get(generator.state, ["options", fnlPath.join("_"), "current"], 0);
		let val = _.get(generator.state, ["values", ...fnlPath, current], "");

		if (props.hasOwnProperty("children")) {
			let theChildren = props.children;
			if (props.children.hasOwnProperty("type") && props.children.type == Fragment) {
				theChildren = props.children.props.children;
			}
			if (Array.isArray(theChildren) && typeof theChildren[current] !== 'undefined') {
				let child = theChildren[current];
				if (child.hasOwnProperty("type") && child.type.hasOwnProperty("prototype") && ("generateValue" in child.type.prototype)) {
					return child.type.prototype.generateValue(child.props, generator, [...fnlPath, current]);
				}
			}
		}

		return val;
	}

	getAdditionalParams(props) {
		return (<div className={styles['orOptions']}>
			<div className={styles['label']}>OR</div>
			<div className={styles['value']}>{this.props.children}</div>
		</div>);
	}


}