import React, { Component, Fragment } from 'react';

import styles from './apidoc.css';

import Endpoint from './parts_endpoint';

export default class Contents extends Component {
	render() {
			const contents = [];
			const children = React.Children.map(this.props.children, (child, index) => {
				if (child.type === Endpoint) {
					contents.push(<a key={index} href={"#"+(child.props.method)+"_"+(child.props.path).replace(/\//g, "_")} className={styles['toc_entry']}> - {child.props.action ? child.props.action : (child.props.method + " " + child.props.path)}</a>);
				}
			});
			return (<Fragment>
					<div className={styles['toc']}>
						<div className={styles['toc_wrapper']}>
							<div className={styles['toc_title']}>Contents</div>
							<div className={styles['toc_body']}>{contents}</div>
						</div>
					</div>
				{this.props.children}
			</Fragment>);
		}
}