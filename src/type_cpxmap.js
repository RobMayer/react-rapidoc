import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import PrmString from './type_prmstring';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class CpxMap extends BasePrm {
	constructor(props, ...params) {
		super(props, ...params);
		this.getAppendKey = this.getAppendKey.bind(this);
		this.getAppendValue = this.getAppendValue.bind(this);
		this.getEmbeddedNodeSample = this.getEmbeddedNodeSample.bind(this);
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.object,
		sample: PropTypes.object,
		keyType: PropTypes.element.isRequired,
		valueType: PropTypes.element.isRequired
	}
	static defaultProps = {
		keyType: <PrmString />,
		valueType: <PrmString />,
	}

	getEmbeddedNodeSample(theNode, theValue) {
		let theChildren = theNode;
		if (theNode.hasOwnProperty("type") && theNode.type == Fragment) {
			theChildren = theNode.props.children;
		}
		if (Array.isArray(theChildren)) {
			let child = theChildren[0];
			if (child.hasOwnProperty("type") && "generateSample" in child.type.prototype) {
				return child.type.prototype.generateSample(child.props, false);
			}
		} else if (theChildren != undefined) {
			let child = theChildren;
			if (child.hasOwnProperty("type") && "generateSample" in child.type.prototype) {
				return child.type.prototype.generateSample(child.props, false);
			}
		}
		return theValue || "Foo";
	}

	getEmbeddedNodeUI(theNode) {
		theValue = null;
		let theChildren = theNode;
		if (theNode.hasOwnProperty("type") && theNode.type == Fragment) {
			theChildren = theNode.props.children;
		}
		if (Array.isArray(theChildren)) {
			let child = theChildren[0];
			if (child.hasOwnProperty("type") && "generateUI" in child.type.prototype) {
				theValue = child.type.prototype.generateUI(child.props, generator, path);
			}
		} else if (theChildren != undefined) {
			let child = theChildren;
			if (child.hasOwnProperty("type") && "generateUI" in child.type.prototype) {
				theValue = child.type.prototype.generateUI(child.props, generator, path);
			}
		}
		return theValue;
	}

	getTypeName() { return "Map" }
	getTypeInfo(props) { return "A collection of key-value pairs where the keys are user-defined."; }
	getTypeExample(props) { return '{"Foo":"Bar"}'; }
	getTypeCss(props) { return "typeFlagCol"; }

	getSampleValue(props, override) {
		if (props.hasOwnProperty("sample") && !override) { return props.sample; }

		let key = "Foo";
		let val = "Bar";

		if (props.hasOwnProperty("keyType")) {
			key = this.getEmbeddedNodeSample(props.keyType, key);
		}

		if (props.hasOwnProperty("valueType")) {
			val = this.getEmbeddedNodeSample(props.valueType, val);
		}

		let data = {};
		data[key] = val;
		return data;
	}

	getGenValue(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let theMap = _.get(generator.state, ["values", ...fnlPath], []);
		let data = {};

		let kNode = props.keyType;
		let vNode = props.valueType;

		theMap.map(function(el, idx) {
			let theK = kNode.type.prototype.generateValue(kNode.props, generator, [...fnlPath, ""+idx, "k"]);
			let theV = vNode.type.prototype.generateValue(vNode.props, generator, [...fnlPath, ""+idx, "v"]);
			data[theK] = theV;
		});
		return data;
	}

	getAppendKey(props, generator, path, len) {
		return "key_" + len;
	}

	getAppendValue(props, generator, path) {
		if (props.hasOwnProperty("valueType")) {
			return this.getEmbeddedNodeSample(props.valueType);
		}
		return "value";
	}

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];

		let theMap = _.get(generator.state, ["values", ...fnlPath], []);
		let hidden = _.get(generator.state, ["options", fnlPath.join("_"), "visible"], false);

		return (
			<Fragment>

					<RUI.Button
						type='normal_simple'
						onAction={(val) => {
							let newEntry = {k: this.getAppendKey(props, generator, path, theMap.length), v:this.getAppendValue(props, generator, path, theMap.length)}
							theMap.push(newEntry);
							generator.setState(fp.set(generator.state, ["values", fnlPath], theMap));
						}}
						tooltip="Add Element"
						disabled={
							(props.hasOwnProperty("maxCount") ? theMap.length >= props.maxCount : false) || hidden
						}
					><RUI.Symbol code={RUI.Symbol.PLUS_CIRCLE}/></RUI.Button>
					<RUI.Button
						type='normal_simple'
						onAction={(val) => {
							theMap.pop();
							generator.setState(fp.set(generator.state, ["values", fnlPath], theMap));
						}}
						tooltip="Remove Last Element"
						disabled={
							(theMap.length == 0) ||
							(props.hasOwnProperty("minCount") ? theMap.length <= props.minCount : false) ||
							hidden
						}
					><RUI.Symbol code={RUI.Symbol.MINUS_CIRCLE}/></RUI.Button>
					<RUI.Button
						type='danger_simple'
						onAction={(val) => {
							generator.setState(fp.set(generator.state, ["values", fnlPath], []));
						}}
						tooltip="Clear List"
						disabled={theMap.length == 0 || hidden}
					><RUI.Symbol code={RUI.Symbol.TIMES_CIRCLE}/></RUI.Button>

			</Fragment>
		);
	}

	getGenChildren(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];

		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) { return null; }

		let theMap = _.get(generator.state, ["values", ...fnlPath], []);
		let desc = [];
		let keyNode = props.keyType;
		let valNode = props.valueType;

		theMap.map(function(el, index) {
			let kChild = keyNode.type.prototype.getGenChildren(keyNode.props, generator, [...fnlPath, ""+index, "k"]);
			let vChild = valNode.type.prototype.getGenChildren(valNode.props, generator, [...fnlPath, ""+index, "v"]);
			let n = (<Fragment key={index}>
				<div className={styles['samplemaker_input_keyvalue']}>
					<div className={styles['samplemaker_input_key']}>
						<div className={styles['samplemaker_input_kvopt']}>
						{keyNode.type.prototype.getGenOptions(keyNode.props, generator, [...fnlPath, ""+index, "k"])}
						</div>
						{kChild && (<div className={styles['samplemaker_input_kvchild']}>{kChild}</div>)}
					</div>
					<div className={styles['samplemaker_input_value']}>
						<div className={styles['samplemaker_input_kvopt']}>
						{valNode.type.prototype.getGenOptions(valNode.props, generator, [...fnlPath, ""+index, "v"])}
						</div>
						{vChild && (<div className={styles['samplemaker_input_kvchild']}>{vChild}</div>)}
					</div>
				</div>
			</Fragment>
			);
			desc.push(n);
		});

		return desc.length == 0 ? null : desc;
	}

	getAdditionalParams(props) {
		return (
			<Fragment>
				{props.hasOwnProperty("keyType") && (<div className={styles['mapOptions']}><span className={styles['label']}>Keys</span> <span className={styles['value']}>{props.keyType}</span></div>)}
				{props.hasOwnProperty("valueType") && (<div className={styles['mapOptions']}><span className={styles['label']}>Values</span> <span className={styles['value']}>{props.valueType}</span></div>)}
			</Fragment>
		);
	}
}