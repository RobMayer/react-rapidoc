import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class CpxEnum extends BasePrm {
	constructor(props, ...params) {
		super(props, ...params);
		this.state = {
			guideOpen:false,
			memberOpen:false,
		};
	}

	static propTypes = {
		name: PropTypes.string,
		desc: PropTypes.string,
		condition: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
		nullable: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),

		default: PropTypes.string,
		sample: PropTypes.string,
	}

	getTypeName() { return "Enum" }
	getTypeInfo(props) { return "Actually a string, but the value must be one of the permitted members."; }
	getTypeExample(props) { return '"FOOBAR"'; }

	getSampleValue(props, override) {
		if (props.hasOwnProperty("sample") && !override) { return props.sample; }
		if (props.hasOwnProperty("children")) {
			let theChildren = props.children;
			if (props.children.hasOwnProperty("type") && props.children.type == Fragment) {
				theChildren = props.children.props.children;
			}
			if (Array.isArray(theChildren)) {
				let child = theChildren[0];
				if (child.props.hasOwnProperty("value")) {
					return child.props.value;
				}
			} else if (theChildren != undefined) {
				let child = theChildren;
				if (child.props.hasOwnProperty("value")) {
					return child.props.value;
				}
			}
		}
		return "FOOBAR";
	}

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];

		let options = [];
		//let theValue = _.get(generator.state, ["values", ...fnlPath], this.getSampleValue(props, false));
		let theValue = _.get(generator.state, ["values", ...fnlPath], this.generateSample(props, false));

		React.Children.map(props.children, (child, index) => {
			if (child.props.hasOwnProperty("value")) {
				options.push(<RUI.DropdownButton.Option key={index} value={child.props.value}>{child.props.value}</RUI.DropdownButton.Option>)
			}
		});

		return (
			<div className={styles['samplemaker_input_optioneach']}>
				<RUI.DropdownButton
					value={theValue}
					onChange={(val) => {generator.setState(fp.set(generator.state,["values", ...fnlPath], val));}}
				>
				{options}
				</RUI.DropdownButton>
			</div>
		);

	}

	getAdditionalParams(props) {
		return (
			<Fragment>
				{this.props.children && (
					<div className={styles['param']}><span className={styles['label']}></span> <span className={styles['popup']} onClick={(e) => {this.setState({memberOpen:true});}}>View Members</span></div>
				)}
				{this.state.memberOpen && (
					ReactDOM.createPortal(<RUI.ModalSimple title={this.props.name ? this.props.name + " members" : "members"}  onClose={(e) => {this.setState({memberOpen:false});}}>{this.props.children}</RUI.ModalSimple>,document.getElementById('modal-root'))
				)}
			</Fragment>
		);
	}

	static Member = class extends Component {

		constructor(props) {
			super(props);
			this.generateSample = this.generateSample.bind(this);
		}

		static propTypes = {
			value: PropTypes.string,
			desc: PropTypes.string,
		}

		generateSample(props, override) {
			return (props.hasOwnProperty('value') ? props.value : "MEMBER");
		}

		render() {
			return (
				<Fragment>
					<div className={styles['entry']}>
						<div className={styles['overview']}>
							{this.props.value && (<div className={styles['name']}>{this.props.value}</div>)}
							<div className={styles['info']}>
								{this.props.desc && (<div className={styles['desc']}>{this.props.desc}</div>)}
							</div>
						</div>
					</div>
				</Fragment>
			);
		}
	}

}
