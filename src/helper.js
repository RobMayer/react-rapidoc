import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';

export default class Helper {

	static parseParamSample(obj) {
		//
			// Helper function that flattens an object, retaining key structer as a path array:
			//
			// Input: { prop1: 'x', prop2: { y: 1, z: 2 } }
			// Example output: [
			//     { path: [ 'prop1' ],      val: 'x' },
			//     { path: [ 'prop2', 'y' ], val: '1' },
			//     { path: [ 'prop2', 'z' ], val: '2' }
			// ]
			//
			function createSpan(contents, tC) {
				tC = tC || "";
				var theSpan = document.createElement('span');
				theSpan.className = tC;
				theSpan.innerHTML = contents;
			}

			function flattenObj(x, path) {
				var result = [];

				path = path || [];
				Object.keys(x).forEach(function (key) {
					if (!x.hasOwnProperty(key)) return;

					var newPath = path.slice();
					newPath.push(key);

					var vals = [];
					if (typeof x[key] == 'object') {
						vals = flattenObj(x[key], newPath);
					} else {
						vals.push({ path: newPath, val: x[key] });
					}
					vals.forEach(function (obj) {
						return result.push(obj);
					});
				});

				return result;
			} // flattenObj

			// start with  flattening `obj`
			var parts = flattenObj(obj); // [ { path: [ ...parts ], val: ... }, ... ]

			// convert to array notation:
			parts = parts.map(function (varInfo) {
				if (varInfo.path.length == 1) varInfo.path = varInfo.path[0];else {
					var first = varInfo.path[0];
					var rest = varInfo.path.slice(1);
					varInfo.path = first + '[' + rest.join('][') + ']';
				}
				return varInfo;
			}); // parts.map

			// join the parts to a query-string url-component
			var queryString = parts.map(function (varInfo, idx) {
				return <span key={idx}><span styleName='sample_paramname'>{varInfo.path}</span><span styleName='sample_paramsymbol'>=</span><span styleName='sample_paramvalue'>{varInfo.val}</span>{(idx != parts.length-1) ? <span styleName='sample_paramsymbol'>&amp;<wbr/></span> : null}</span>;
			});
			return <span>{queryString}</span>;
	}

	static parseHeaderSample(data) {
		let theKeys = Object.keys(data);
		let res = theKeys.map(function(key, idx) {
			return (<Fragment key={key}>
				<span styleName='sample_paramname'>{key}</span>
				<span styleName='sample_paramsymbol'>: </span>
				<span styleName='sample_paramvalue'>{data[key]}</span>
				{idx != theKeys.length - 1 ? "\n" : null}
			</Fragment>);
		});
		return res;
	}

	static parseMixedValue(theValue, theType) {
		switch(theType) {
			case "Integer":
				return parseInt(theValue) || 0;
			case "Float":
				return parseFloat(theValue) || 0;
			case "Boolean":
				if (_.isString(theValue)) {
					return theValue.toLowerCase() == "true" || theValue == "1";
				} else {
					return theValue == 1;
				}
			default:
				return theValue;
		}
	}

	static validateMixedValue(theValue, theType) {
		switch(theType) {
			case "Integer":
				return parseInt(theValue) == theValue;
			case "Float":
				return parseFloat(theValue) == theValue;
			case "Boolean":
				if (_.isString(theValue)) {
					return theValue.toLowerCase() == "false" || theValue.toLowerCase() == "true" || theValue == "1" || theValue == "0";
				} else {
					return theValue == 0 || theValue == 1;
				}
			case "String":
				return true;
			default:
				return false;
		}
	}

	static parseArySample(ary, prefix, needsComma) {
		needsComma = needsComma || false;
		prefix = prefix || "";
		let content = ary.map(function (el, idx) {

			if (_.isArray(el)) {
				return (<Fragment key={idx}>
					{prefix+"   "}
					{Helper.parseArySample(el, prefix+"   ", idx != ary.length - 1)}
				</Fragment>);
			}
			if (_.isObject(el)) {
				return (<Fragment key={idx}>
					{prefix+"   "}
					{Helper.parseObjSample(el, prefix+"   ", idx != ary.length - 1)}
				</Fragment>);
			}

			let theValue = el;
			if (_.isBoolean(el)) { theValue = el ? "true" : "false" }
			if (_.isString(el)) { theValue = '"'+el+'"'; }
			return (
				<Fragment key={idx}>
					{prefix+"   "}<span styleName='sample_paramvalue'>{theValue}</span>
					{idx != ary.length - 1 ? <span styleName='sample_paramsymbol'>{","}</span> : null}
					{"\n"}
				</Fragment>
			);
		});
		let ret = (<Fragment>
		<span styleName='sample_paramsymbol'>{"["}</span>{"\n"}
		{content}
		{prefix}<span styleName='sample_paramsymbol'>{"]" + (needsComma ? "," : "")}</span>{"\n"}
		</Fragment>);
		return ret;
	}

	static parseObjSample(obj, prefix, needsComma) {
		needsComma = needsComma || false;
		prefix = prefix || "";
		let theKeys = Object.keys(obj);
		let content = theKeys.map(function(key, idx) {
			let el = obj[key];
			if (_.isArray(el)) {
				return (<Fragment key={idx}>
					{prefix+"   "}<span styleName='sample_paramname'>{key}</span><span styleName='sample_paramsymbol'>: </span>
					{Helper.parseArySample(el, prefix+"   ", idx != theKeys.length - 1)}
				</Fragment>);
			}
			if (_.isObject(el)) {
				return (<Fragment key={idx}>
					{prefix+"   "}<span styleName='sample_paramname'>{key}</span><span styleName='sample_paramsymbol'>: </span>
					{Helper.parseObjSample(el, prefix+"   ", idx != theKeys.length - 1)}
				</Fragment>);
			}
			let theValue = el;
			if (_.isBoolean(el)) { theValue = el ? "true" : "false" }
			if (_.isString(el)) { theValue = '"'+el+'"'; }
			return (
				<Fragment key={idx}>
					{prefix+"   "}<span styleName='sample_paramname'>{key}</span><span styleName='sample_paramsymbol'>: </span><span styleName='sample_paramvalue'>{theValue}</span>
					{idx != theKeys.length - 1 ? <span styleName='sample_paramsymbol'>{","}</span> : null}
					{"\n"}
				</Fragment>
			);
		});
		let ret = (<Fragment>
		<span styleName='sample_paramsymbol'>{"{"}</span>{"\n"}
		{content}
		{prefix}<span styleName='sample_paramsymbol'>{"}" + (needsComma ? "," : "")}</span>{"\n"}
		</Fragment>);
		return ret;
	}

}