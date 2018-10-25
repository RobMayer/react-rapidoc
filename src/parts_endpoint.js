import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import RUI from 'react-rui';

import styles from './apidoc.css';

export default class Endpoint extends Component {

	static propTypes = {
		method: PropTypes.oneOf([
			'GET', 'POST', 'PUT', 'DELETE'
		]).isRequired,
		path: PropTypes.string.isRequired,
		desc: PropTypes.string,
		action: PropTypes.string,
	}

	render() { return (
		<Fragment>
			<div className={[styles['endpoint_title'], this.props.className].join(" ")} id={this.props.method+"_"+(this.props.path).replace(/\//g, "_")}>
				{this.props.action && (<div className={styles['endpoint_action']}>{this.props.action}</div>)}
				<div className={styles['endpoint_meta']}>[
					<div className={[
						styles['endpoint_method'],
						styles['endpoint_method_'+this.props.method.toLowerCase()]
					].join(" ")}>{this.props.method}</div>
					<div className={styles['endpoint_path']}>{this.props.path}</div>]
				</div>
				<a className={styles['endpoint_top']} href='#main-root'><RUI.Symbol code={RUI.Symbol.ARROW_U_SOLID}/> Top</a>
			</div>
			<div className={styles['endpoint_body']}>
				{this.props.children}
			</div>
		</Fragment>
	)}

}