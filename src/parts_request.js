import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import Helper from './helper';

import styles from './apidoc.css';

class SampleMaker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			options: {},
			values: {},
		}
		this.getUIContents = this.getUIContents.bind(this);
		this.getUISample = this.getUISample.bind(this);
	}

	getUIContents(props) {
		let contents = [];
		let theChildren = props.children;
		if (props.children != undefined && props.children.hasOwnProperty("type") && props.children.type == Fragment) {
			theChildren = props.children.props.children;
		}
		React.Children.map(theChildren, (child, index) => {
			if (child.hasOwnProperty("type") && child.type.hasOwnProperty("prototype") && "generateUI" in child.type.prototype) {
				contents.push(<Fragment key={index}>{child.type.prototype.generateUI(child.props, this, [])}</Fragment>);
			}
		});
		return contents;
	}

	getUISample(props) {
		let samples = {};
		let theChildren = props.children;
		if (props.children != undefined && props.children.hasOwnProperty("type") && props.children.type == Fragment) {
			theChildren = props.children.props.children;
		}
		React.Children.map(theChildren, (child, index) => {
			if (child.hasOwnProperty("type") && child.type.hasOwnProperty("prototype") && "generateValue" in child.type.prototype) {
				let tv = child.type.prototype.generateValue(child.props, this, []);
				if (tv != undefined) {
					samples[child.props.name] = tv;
				}
			}
		});
		return samples;
	}





	render() {
		let contents = this.getUIContents(this.props);
		let samples = this.getUISample(this.props);

		return (
			<div className={styles['samplemaker_root']}>
				<div className={styles['samplemaker_inputs']}>
					{contents}
				</div>
				<div className={styles['samplemaker_sample']}>
					<div className={[styles['sample'], 'selectable'].join(" ")} >{Helper.parseObjSample(samples)}</div>
				</div>
			</div>
		);
	}

}

export default class Request extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: true,
		}
	}

	render() {
		return (
		<Fragment>
			<div className={styles['request_title']}>
				<div className={styles['request_path']} onClick={(e)=>{this.setState({isOpen:(!this.state.isOpen)});}}>
					<RUI.Symbol className={styles['arrow']} code={this.state.isOpen ? RUI.Symbol.ARROW_D_SOLID : RUI.Symbol.ARROW_R_SOLID}/> Request
				</div>
			</div>
			{this.state.isOpen &&(<div className={styles['request_body']}>{this.props.children}</div>)}
		</Fragment>
	)}

	static Body = class extends Component {
		constructor(props) {
			super(props);
			this.state = {
				isOpen: (props.hasOwnProperty("expand") ? props.expand : true),
				viewMode: "options",
				isMakerOpen: false,
			}
			this.getSampleValue = this.getSampleValue.bind(this);
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
					data[child.props.name] = child.type.prototype.generateSample(child.props, override);
				}
			});
			return data;
		}

		render() {

			const samples = this.getSampleValue(this.props);

			return (
				<Fragment>
					<div className={styles['body_title']}>
						<div className={styles['body_path']} onClick={(e)=>{this.setState({isOpen:(!this.state.isOpen)});}}>
							<RUI.Symbol className={styles['arrow']} code={this.state.isOpen ? RUI.Symbol.ARROW_D_SOLID : RUI.Symbol.ARROW_R_SOLID}/> Body
						</div>
					</div>
					{this.state.isOpen && (
						<Fragment>
							{
								!_.isEmpty(samples) && (
									<div className={styles['body_options']}>
										<RUI.RadioButton value={this.state.viewMode} onChange={(e) => {this.setState({viewMode:e});}}>
											<RUI.RadioButton.Option value="options">Options</RUI.RadioButton.Option>
											<RUI.RadioButton.Option value="sample">Sample</RUI.RadioButton.Option>
										</RUI.RadioButton>
										<RUI.Button onAction={() => {this.setState({isMakerOpen:true});}}><RUI.Symbol code={RUI.Symbol.POPUP} /> Code Builder</RUI.Button>
									</div>
								)
							}
							{this.state.viewMode == "sample" && (<div className={[styles['sample_body'], 'selectable'].join(" ")}>{Helper.parseObjSample(samples)}</div>)}
							{this.state.viewMode == "options" && (<div className={styles['body_body']}>{this.props.children}</div>)}
						</Fragment>
					)}
					{this.state.isMakerOpen && (
						ReactDOM.createPortal(<RUI.ModalSimple type='full' title={"Request Body Sample"}  onClose={(e) => {this.setState({isMakerOpen:false});}}><SampleMaker>{this.props.children}</SampleMaker></RUI.ModalSimple>,document.getElementById('modal-root'))
					)}
				</Fragment>
			);
		}
	}

	static Headers = class extends Component {
		constructor(props) {
			super(props);
			this.state = {
				isOpen: (props.hasOwnProperty("expand") ? props.expand : false),
				viewMode: "options",
			}
		}

		render() {
			const samples = {};
			const children = React.Children.map(this.props.children, (child, index) => {
				if (child.hasOwnProperty("type") && child.type.hasOwnProperty("prototype") && "generateSample" in child.type.prototype) {
					samples[child.props.name] = child.type.prototype.generateSample(child.props);
				}
			});

			return (
			<Fragment>
				<div className={styles['headers_title']}>
					<div className={styles['headers_path']} onClick={(e)=>{this.setState({isOpen:(!this.state.isOpen)});}}>
						<RUI.Symbol className={styles['arrow']} code={this.state.isOpen ? RUI.Symbol.ARROW_D_SOLID : RUI.Symbol.ARROW_R_SOLID}/> Headers
					</div>
				</div>

				{this.state.isOpen && (
					<Fragment>
						{
							!_.isEmpty(samples) && (
								<div className={styles['body_options']}>
									<RUI.RadioButton value={this.state.viewMode} onChange={(e) => {this.setState({viewMode:e});}}>
										<RUI.RadioButton.Option value="options">Options</RUI.RadioButton.Option>
										<RUI.RadioButton.Option value="sample">Sample</RUI.RadioButton.Option>
									</RUI.RadioButton>
								</div>
							)
						}
						{this.state.viewMode == "sample" && (<div className={[styles['sample_body'], 'selectable'].join(" ")}>{Helper.parseHeaderSample(samples)}</div>)}
						{this.state.viewMode == "options" && (<div className={styles['headers_body']}>{this.props.children}</div>)}
					</Fragment>
				)}
			</Fragment>
		)}



	}

	static PathParams = class extends Component {
		constructor(props) {
			super(props);
			this.state = {
				isOpen: (props.hasOwnProperty("expand") ? props.expand : false),
			}
		}

		render() {
			return (
			<Fragment>
				<div className={styles['params_title']}>
					<div className={styles['params_path']} onClick={(e)=>{this.setState({isOpen:(!this.state.isOpen)});}}>
						<RUI.Symbol className={styles['arrow']} code={this.state.isOpen ? RUI.Symbol.ARROW_D_SOLID : RUI.Symbol.ARROW_R_SOLID}/> Path Parameters
					</div>
				</div>

				{this.state.isOpen && (
					<Fragment>
						<div className={styles['params_body']}>{this.props.children}</div>
					</Fragment>
				)}
			</Fragment>
		)}
	}

	static QueryParams = class extends Component {
		constructor(props) {
			super(props);
			this.state = {
				isOpen: (props.hasOwnProperty("expand") ? props.expand : false),
				viewMode: "options",
			}
			this.getSampleValue = this.getSampleValue.bind(this);
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
					data[child.props.name] = child.type.prototype.generateSample(child.props, override);
				}
			});
			return data;
		}

		render() {
			let samples = this.getSampleValue(this.props, false);
			return (
			<Fragment>
				<div className={styles['params_title']}>
					<div className={styles['params_path']} onClick={(e)=>{this.setState({isOpen:(!this.state.isOpen)});}}>
						<RUI.Symbol className={styles['arrow']} code={this.state.isOpen ? RUI.Symbol.ARROW_D_SOLID : RUI.Symbol.ARROW_R_SOLID}/> Query Parameters
					</div>
				</div>

				{this.state.isOpen && (

					<Fragment>

						{
							!_.isEmpty(samples) && (
								<div className={styles['body_options']}>
									<RUI.RadioButton value={this.state.viewMode} onChange={(e) => {this.setState({viewMode:e});}}>
										<RUI.RadioButton.Option value="options">Options</RUI.RadioButton.Option>
										<RUI.RadioButton.Option value="sample">Sample</RUI.RadioButton.Option>
									</RUI.RadioButton>
								</div>
							)
						}
						{this.state.viewMode == "sample" && (<div className={[styles['sample_body'], 'selectable'].join(" ")}>?{Helper.parseParamSample(samples)}</div>)}
						{this.state.viewMode == "options" && (<div className={styles['params_body']}>{this.props.children}</div>)}
					</Fragment>

				)}
			</Fragment>
		)}


	}

}