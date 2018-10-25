import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BaseAry from './base_ary';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class AryStruct extends BaseAry {
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
		emptiable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.arrayOf(PropTypes.string),
		sample: PropTypes.arrayOf(PropTypes.string),

		minCount: PropTypes.number,
		maxCount: PropTypes.number,

		pattern: PropTypes.instanceOf(RegExp),
		minLength: PropTypes.number,
		maxLength: PropTypes.number,
	}

	getTypeName() { return "Array (Struct)" }
	getTypeInfo(props) { return "An array of JSON objects. When used in Request/Response bodies, these will be JSON arrays. In URL parameters, empty brackets [] or indexed brackets [1] in the key will be used to denote array members. See the section example."; }
	getTypeExample(props) { return '[{"Foo":"Bar","Baz":"Quoz"}]'; }

	getSampleValue(props, override) {
		const data = {};
		let theChildren = props.children;
		if (props.children != undefined && props.children.hasOwnProperty("type") && props.children.type == Fragment) {
			theChildren = props.children.props.children;
		}
		React.Children.map(theChildren, (child, index) => {
			if (child.hasOwnProperty("type") && child.type.hasOwnProperty("prototype") && "generateSample" in child.type.prototype) {
				data[child.props.name] = child.type.prototype.generateSample(child.props);
			}
		});
		return [data];
	}

	getGenValue(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let theVal = _.get(generator.state, ["values", ...fnlPath], []);
		let ret = [];

		for (let i in theVal) {
			let each = {};
			React.Children.map(props.children, (child, idx) => {
				if ("generateValue" in child.type.prototype) {
					let chVal = child.type.prototype.generateValue(child.props, generator, [...fnlPath, i]);
					if (chVal !== undefined) {
						each[child.props.name] = chVal;
					}
				}
			});
			ret.push(each);
		}
		return ret;
	}

	getAppendValue(props,generator,path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let each = {};
		React.Children.map(props.children, (child, index) => {
			if ("generateSample" in child.type.prototype) {
				let chVal = child.type.prototype.generateSample(child.props, false);
				if (chVal !== undefined) {
					each[child.props.name] = chVal;
				}
			}
		});
		return each;
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
							<div className={[styles['sample'], 'selectable'].join(" ")}>{Helper.parseArySample(this.getSampleValue(this.props, false))}</div>
						</RUI.ModalSimple>,document.getElementById('modal-root'))
				)}
			</Fragment>
		);
	}

	getGenChildren(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) { return null; }

		let theAry = _.get(generator.state, ["values", ...fnlPath], []);
		let theInput = [];

		theAry.forEach((el,idx) => {

			let theObjUi = [];
			React.Children.map(props.children, (child, index) => {
				if ('generateUI' in child.type.prototype) {
					theObjUi.push(<div className={styles['samplemaker_input_nested']} key={index}>{child.type.prototype.generateUI(child.props, generator, [...fnlPath, idx])}</div>);
				}
			});

			if (theObjUi.length > 0) {
				theInput.push(
					<div className={styles['samplemaker_input_nester']} key={idx}>{theObjUi}</div>
				);
			}
		});

		return theInput.length > 0 ? theInput : null;
	}

}