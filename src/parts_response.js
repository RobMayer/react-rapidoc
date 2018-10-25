import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import fp from 'lodash/fp';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import Helper from './helper';

import styles from './apidoc.css';

export default class Response extends Component {
	constructor(props) {
			super(props);
			this.state = {
				isOpen: (props.hasOwnProperty("expand") ? props.expand : (props.code == "200" ? true : false)) ,
			}
		}

		static propTypes = {
			code: PropTypes.string.isRequired,
			desc: PropTypes.string,
		}

		static defaultProps = {
			code: '200'
		}

		render() {
			return (
			<Fragment>
				<div className={styles['response_title']}>
					<div className={styles['response_path']} onClick={(e)=>{this.setState({isOpen:(!this.state.isOpen)});}}>
						<RUI.Symbol className={styles['arrow']} code={this.state.isOpen ? RUI.Symbol.ARROW_D_SOLID : RUI.Symbol.ARROW_R_SOLID}/> Response
						<div styleName={'response_code '+(this.props.code.startsWith("2") ? "response_code_success" : "response_code_failure")}>{this.props.code}</div>
						{this.props.hasOwnProperty("desc") && (<div className={styles['response_desc']}> - {this.props.desc}</div>)}
					</div>
				</div>
				{this.state.isOpen &&(<div className={styles['response_body']}>{this.props.children}</div>)}
			</Fragment>
		)}

		static Body = class extends Component {
			constructor(props) {
				super(props);
				this.state = {
					isOpen: (props.hasOwnProperty("expand") ? props.expand : true),
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
										</div>
									)
								}
								{this.state.viewMode == "sample" && (<div className={[styles['sample_body'], 'selectable'].join(" ")}>{Helper.parseObjSample(samples)}</div>)}
								{this.state.viewMode == "options" && (<div className={styles['body_body']}>{this.props.children}</div>)}
							</Fragment>
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
					return child;
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

			static TYPICAL = (<Headers/>)
		}
}