import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class CpxStruct extends BasePrm {
	constructor(props, ...params) {
		super(props, ...params);
		this.state = {
			memberOpen:false,
			guideOpen:false
		}
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.object,
		sample: PropTypes.object,
	}

	getTypeName() { return "Struct" }
	getTypeInfo(props) { return "A key-value collection with a pre-determined structure. When used in request or response bodies, JSON object rules apply. In the case of URL parameters, named parameter arrays are used. See the example in the relevant section."; }
	getTypeCss(props) { return "typeFlagCol"; }

	getGenValue(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let desc = {};

		React.Children.map(props.children, (child, index) => {
			if ("generateValue" in child.type.prototype) {
				let chVal = child.type.prototype.generateValue(child.props, generator, fnlPath);
				if (chVal !== undefined) {
					desc[child.props.name] = chVal;
				}
			}
		});

		return desc;
	}

	getSampleValue(props, override) {
		if (props.hasOwnProperty("sample") && !override) { return props.sample; }
		const data = {};
		let theChildren = props.children;
		if (props.children != undefined && props.children.hasOwnProperty("type") && props.children.type == Fragment) {
			theChildren = props.children.props.children;
		}
		React.Children.map(theChildren, (child, index) => {
			if (child.hasOwnProperty("type") && child.type.hasOwnProperty("prototype") && "generateSample" in child.type.prototype) {
				let ret = child.type.prototype.generateSample(child.props, override);
				data[child.props.name] = ret;
			}
		});
		return data;
	}

	getGenChildren(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) { return null; }

		let desc = [];

		React.Children.map(props.children, (child, index) => {
			if ('generateUI' in child.type.prototype) {
				desc.push(<Fragment key={index}>{child.type.prototype.generateUI(child.props, generator, fnlPath)}</Fragment>);
			}
		});

		return (
			desc
		);
	}

	getAdditionalParams(props) {
		return (
			<Fragment>
				{this.props.children && (
					<div className={styles['param']}><span className={styles['label']}></span> <span className={styles['popup']} onClick={(e) => {this.setState({memberOpen:true});}}>View Structure</span></div>
				)}
				{this.state.memberOpen && (
					ReactDOM.createPortal(
						<RUI.ModalSimple title={this.props.name ? this.props.name + " structure" : "structure"}  onClose={(e) => {this.setState({memberOpen:false});}}>
							{this.props.children}
							<div className={[styles['sample'], 'selectable'].join(" ")}>{Helper.parseObjSample(this.getSampleValue(this.props, false))}</div>
						</RUI.ModalSimple>,document.getElementById('modal-root'))
				)}
			</Fragment>
		);
	}

}