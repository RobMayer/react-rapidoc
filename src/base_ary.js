import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import BasePrm from './base_prm';
import styles from './apidoc.css';

/** ABSTRACTS */

export default class BaseAry extends BasePrm {

	constructor(props, ...params) {
		super(props, ...params);
		this.parseEachGenElement = this.parseEachGenElement.bind(this);
		this.getAppendValue = this.getAppendValue.bind(this);
	}

	getTypeCss(props) { return "typeFlagCol"; }

	getGenValue(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];

		let theVal = _.get(generator.state, ["values", ...fnlPath], []);
		let ret = [];
		for (let i in theVal) {
			let element = theVal[i];
			let elValue = this.parseEachGenElement(element, i, props, generator, path);
			if (elValue !== undefined) {
				ret.push(elValue);
			}
		}
		return ret;
	}

	parseEachGenElement(element, index, props, generator, path) {
		return element;
	}

	getAppendValue(props,generator,path) {
		return "";
	}

	getGenOptions(props, generator, path) {
		let fnlPath = props.name ? [...path, props.name] : [...path];

		let theAry = _.get(generator.state, ["values", ...fnlPath], []);
		let hidden = _.get(generator.state, ["options", fnlPath.join("_"), "visible"], false);

		return (
			<Fragment>

					<RUI.Button
						type='normal_simple'
						onAction={(val) => {
							console.log(fnlPath);
							theAry.push(this.getAppendValue(props,generator,path));
							generator.setState(fp.set(generator.state, ["values", ...fnlPath], _.cloneDeep(theAry)));
						}}
						tooltip="Add Element"
						disabled={
							(props.hasOwnProperty("maxCount") ? theAry.length >= props.maxCount : false) || hidden
						}
					><RUI.Symbol code={RUI.Symbol.PLUS_CIRCLE}/></RUI.Button>
					<RUI.Button
						type='normal_simple'
						onAction={(val) => {
							console.log(fnlPath);
							theAry.pop();
							generator.setState(fp.set(generator.state, ["values", ...fnlPath], _.cloneDeep(theAry)));
						}}
						tooltip="Remove Last Element"
						disabled={
							(theAry.length == 0) ||
							(props.hasOwnProperty("minCount") ? theAry.length <= props.minCount : false) ||
							hidden
						}
					><RUI.Symbol code={RUI.Symbol.MINUS_CIRCLE}/></RUI.Button>
					<RUI.Button
						type='danger_simple'
						onAction={(val) => {
							console.log(fnlPath);
							generator.setState(fp.set(generator.state, ["values", ...fnlPath], []));
						}}
						tooltip="Clear List"
						disabled={theAry.length == 0 || hidden}
					><RUI.Symbol code={RUI.Symbol.TIMES_CIRCLE}/></RUI.Button>

			</Fragment>
		);
	}

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
							{this.props.hasOwnProperty('condition') && (<div className={styles['conditionFlag']} title={this.props.condition && this.props.condition.length ? this.props.condition : ""}>Conditional</div>) }
							{this.props.hasOwnProperty('nullable') && (<div className={styles['nullableFlag']} title={this.props.nullable && this.props.nullable.length ? this.props.nullable : ""}>Nullable</div>) }
							{this.props.hasOwnProperty('emptiable') && (<div className={styles['emptiableFlag']} title={this.props.emptiable && this.props.emptiable.length ? this.props.emptiable : ""}>Emptiable</div>) }
						</div>
						<div className={styles['info']}>
							{this.props.desc && (<div className={styles['desc']}>{this.props.desc}</div>) }
							{this.props.condition && this.props.condition.length && (<div className={styles['param']}><span className={styles['label']}>Condition:</span> <span className={styles['value']}>{this.props.condition}</span></div>)}
							{this.props.nullable && this.props.nullable.length && (<div className={styles['param']}><span className={styles['label']}>Null Behaviour:</span> <span className={styles['value']}>{this.props.nullable}</span></div>)}
							{this.props.hasOwnProperty("default") && (<div className={styles['param']}><span className={styles['label']}>Default:</span> <span className={styles['value']}>"{this.props.default}"</span></div>)}

							{this.props.hasOwnProperty("minCount") && (<div className={styles['param']}><span className={styles['label']}>Minimum Count:</span> <span className={styles['value']}>{this.props.minCount}</span></div>)}
							{this.props.hasOwnProperty("maxCount") && (<div className={styles['param']}><span className={styles['label']}>Maximum Count:</span> <span className={styles['value']}>{this.props.maxCount}</span></div>)}

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
