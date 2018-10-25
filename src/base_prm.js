import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import styles from './apidoc.css';

/** ABSTRACTS */

export default class BasePrm extends Component {

	constructor(props, ...params) {
		super(props, ...params);
		this.state = {
			guideOpen:false
		}
		/* Type Parameters */
		this.getTypeName = this.getTypeName.bind(this);
		this.getTypeInfo = this.getTypeInfo.bind(this);
		this.getTypeExample = this.getTypeExample.bind(this);
		this.getTypeCss = this.getTypeCss.bind(this);
		this.getAdditionalParams = this.getAdditionalParams.bind(this);

		/* preview generation */
		this.generateSample = this.generateSample.bind(this);

		/* preview generation to extend */
		this.getSampleValue = this.getSampleValue.bind(this);

		/* sample maker */
		this.generateValue = this.generateValue.bind(this);
		this.generateUI = this.generateUI.bind(this);

		/* sample maker to extend */
		this.getGenValue = this.getGenValue.bind(this);
		this.getGenOptions = this.getGenOptions.bind(this);
		this.getGenChildren = this.getGenChildren.bind(this);
		this.parseGenValue = this.parseGenValue.bind(this);


	}


	generateUI(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];

		let getOptions = this.getGenOptions(props, generator, path);
		let genChildren = this.getGenChildren(props, generator, path);

		return (
			<Fragment>
				<div className={styles['samplemaker_input_wrapper']}>
					<RUI.ToggleSwitch tooltip="Toggle parameter visibility"
						value={!(_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false))}
						onCheck={(e)=>{
							generator.setState(fp.set(generator.state, ["options", fnlPath.join("_"), "visible"], false));
						}}
						onUncheck={(e)=>{
							generator.setState(fp.set(generator.state, ["options", fnlPath.join("_"), "visible"], true));
						}}
						disabled={props.hasOwnProperty("required")}
					>&nbsp;</RUI.ToggleSwitch>
					<div className={styles['samplemaker_input_label']}>{props.name}</div>
					<RUI.ToggleSwitch type="danger" tooltip={!props.hasOwnProperty("nullable") ? "Cannot be null" : "Set to null: "+props.nullable}
						value={(_.get(generator.state, ["options", fnlPath.join("_"), "isNull"], false))}
						onCheck={(e)=>{
							generator.setState(fp.set(generator.state, ["options", fnlPath.join("_"), "isNull"], true));
						}}
						onUncheck={(e)=>{
							generator.setState(fp.set(generator.state, ["options", fnlPath.join("_"), "isNull"], false));
						}}
						disabled={!props.hasOwnProperty("nullable")}
					>&nbsp;</RUI.ToggleSwitch>
					{getOptions ? <div className={styles['samplemaker_input_options']}>{getOptions}</div> : <div className={styles['samplemaker_input_options']}><RUI.Spacer /></div>}
				</div>
				{genChildren ? <div className={styles['samplemaker_input_children']}>{genChildren}</div> : null}
			</Fragment>
		);

	}

	generateValue(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		if (_.get(generator.state, ["options", fnlPath.join("_"), "visible"], false)) {
			return undefined;
		}
		if (props.hasOwnProperty("nullable") && _.get(generator.state, ["options", fnlPath.join("_"), "isNull"], false)) {
			return null;
		}
		return this.parseGenValue(this.getGenValue(props, generator, path), props, generator, path);
	}

	generateSample(props, override) { return props.hasOwnProperty("sample") ? props.sample : this.getSampleValue(props, override); }

	getTypeInfo(props) { return null; }
	getTypeName() { return null; }
	getTypeExample(props) { return null; }
	getTypeCss(props) { return "typeFlagPrm"; }
	getAdditionalParams(props) { return null; }
	getSampleValue(props, override) { return "Unknown"; }

	getGenValue(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];
		let fallback = this.generateSample(props, false);
		return _.get(generator.state, ["values", ...fnlPath], fallback);
	}

	parseGenValue(theValue, props, generator, path) {
		return theValue;
	}

	getGenOptions(props, generator, path) { return null; }
	getGenChildren(props, generator, path) { return null; }

	render() {
		let adlParams = this.getAdditionalParams(this.props);
		let info = this.getTypeInfo(this.props);
		let example = this.getTypeExample(this.props);
		return (
			<Fragment>
				<div className={styles['entry']}>
					<div className={styles['overview']}>
						{this.props.name && (<div className={styles['name']}>{this.props.name}</div>)}
						<div className={styles['type']}>
							{
								info ?
								<div styleName={"typeFlag " + this.getTypeCss(this.props)} onClick={(e) => {this.setState({guideOpen:true});}}>{this.getTypeName()}</div> :
								<div styleName={"typeFlag " + this.getTypeCss(this.props)}>{this.getTypeName()}</div>
							}
							{this.props.hasOwnProperty('required') && (<div className={styles['requiredFlag']}>Required</div>) }
							{(this.props.hasOwnProperty('optional') && !this.props.hasOwnProperty('required')) && (<div className={styles['optionalFlag']}>Optional</div>) }
							{this.props.hasOwnProperty('readonly') && (<div className={styles['readonlyFlag']} title={this.props.condition || "value will not be altered, often used as an identifier of the record being updated"}>Read-only</div>) }

							{this.props.hasOwnProperty('condition') && (<div className={styles['conditionFlag']} title={this.props.condition && this.props.condition.length ? this.props.condition : ""}>Conditional</div>) }
							{this.props.hasOwnProperty('nullable') && (<div className={styles['nullableFlag']} title={this.props.nullable && this.props.nullable.length ? this.props.nullable : ""}>Nullable</div>) }
						</div>
						<div className={styles['info']}>
							{this.props.desc && (<div className={styles['desc']}>{this.props.desc}</div>) }
							{this.props.condition && this.props.condition.length && (<div className={styles['param']}><span className={styles['label']}>Condition:</span> <span className={styles['value']}>{this.props.condition}</span></div>)}
							{this.props.nullable && this.props.nullable.length && (<div className={styles['param']}><span className={styles['label']}>Null Behaviour:</span> <span className={styles['value']}>{this.props.nullable}</span></div>)}
							{this.props.hasOwnProperty("default") && (<div className={styles['param']}><span className={styles['label']}>Default:</span> <span className={styles['value']}>{JSON.stringify(this.props.default)}</span></div>)}
							{adlParams}
						</div>
					</div>
				</div>
				{this.state.guideOpen && (
					ReactDOM.createPortal(<RUI.ModalSimple title={this.getTypeName()} onClose={(e) => {this.setState({guideOpen:false});}}><div className={styles['typeguide']}>
						{info}
						{example && (<div className={styles['example']}>Example: {example}</div>)}
					</div></RUI.ModalSimple>,document.getElementById('modal-root'))
				)}
			</Fragment>
		);
	}
}