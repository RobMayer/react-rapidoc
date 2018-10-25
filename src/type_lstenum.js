import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BaseLst from './base_lst';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class LstEnum extends BaseLst {

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

		seperator: PropTypes.string,
		minCount: PropTypes.number,
		maxCount: PropTypes.number,
	}

	static defaultProps = {
		seperator: ","
	}

	getTypeName() { return "List (Enum)" }
	getTypeInfo(props) { return "A series of enums joined into a string, typically comma-seperated. Members of the list must be members of the enum, detailed in the field entry. Usually treated like an array server-side."; }
	getTypeExample(props) { return '"FOO,BAR"'; }

	getAppendValue(props,generator,path) {
		if (props.hasOwnProperty("children")) {
			let theChildren = props.children;
			if (props.children.hasOwnProperty("type") && props.children.type == Fragment) {
				theChildren = props.children.props.children;
			}
			if (_.isArray(theChildren)) {
				if (theChildren.length == 0) {
					return "";
				} else {
					let child = theChildren[0];
					if (child.props.hasOwnProperty("value")) {
						return child.props.value;
					}
				}
			} else if (theChildren != undefined) {
				let child = theChildren;
				if (child.props.hasOwnProperty("value")) {
					return child.props.value;
				}
			}
		}
		return "";
	}

	getSampleValue(props, override) {
		if (props.hasOwnProperty("sample") && !override) { return props.sample; }
		if (props.hasOwnProperty("children")) {
			let theChildren = props.children;
			if (props.children.hasOwnProperty("type") && props.children.type == Fragment) {
				theChildren = props.children.props.children;
			}
			if (_.isArray(theChildren)) {
				if (theChildren.length == 0) {
					return "FOO"+props.seperator+"BAR";
				}
				if (theChildren.length == 1) {
					let child = theChildren[0];
					if (child.props.hasOwnProperty("value")) {
						return child.props.value;
					}
				} else {
					let res = [];
					let c = 0;
					for (var i = 0; i < theChildren.length; i++) {
						let child = theChildren[i];
						if (child.props.hasOwnProperty("value")) {
							res.push(child.props.value);
							c++;
						}
						if (c >= 3) { break; }
					}
					return res.join(props.seperator);
				}
			} else if (theChildren != undefined) {
				let child = theChildren;
				if (child.props.hasOwnProperty("value")) {
					return child.props.value;
				}
			}
		}
		return "FOO"+props.seperator+"BAR";
	}

	getAdditionalParams(props) {
		return (
			<Fragment>
				{this.props.children && (
					<div className={styles['param']}><span className={styles['label']}></span> <span className={styles['popup']} onClick={(e) => {this.setState({memberOpen:true});}}>View Element Members</span></div>
				)}
				{this.state.memberOpen && (
					ReactDOM.createPortal(<RUI.ModalSimple title={this.props.name ? this.props.name + " members" : "members"}  onClose={(e) => {this.setState({memberOpen:false});}}>{this.props.children}</RUI.ModalSimple>,document.getElementById('modal-root'))
				)}
			</Fragment>
		);
	}

	getGenChildren(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) { return null; }

		let theAry = _.get(generator.state, ["values", ...fnlPath], []);
		let theInput = [];

		let theOptions = [];

		React.Children.map(props.children, (child, index) => {
			if (child.props.hasOwnProperty("value")) {
				theOptions.push(<RUI.DropdownButton.Option key={index} value={child.props.value}>{child.props.value}</RUI.DropdownButton.Option>)
			}
		});

		theAry.forEach((theValue,idx) => {
			theInput.push(
				<div className={styles['samplemaker_input_optioneach']} key={idx}>
					<RUI.DropdownButton
						value={theValue}
						onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath, idx], val));}}
					>{theOptions}
					</RUI.DropdownButton>
				</div>
			);
		});

		return theInput.length > 0 ? theInput : null;
	}


}
