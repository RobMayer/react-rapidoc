# react-rapidoc

> a set of components for laying out documentation for an API doc

[![NPM](https://img.shields.io/npm/v/react-rapidoc.svg)](https://www.npmjs.com/package/react-rapidoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-rapidoc
```

## Usage

```jsx
import React, { Component } from 'react'

import ApiDoc, {Types} from 'react-rapidoc'

class Example extends Component {
  render () {
    return (
      <ApiDoc.Contents>
		<ApiDoc.Endpoint method='POST' path='test/endpoint' action='Create New Resource'>
		   <ApiDoc.Request>
		      <ApiDoc.Body>
			     <Types.String name='name' desc='name of the resource' />
			     <Types.Integer name='size' desc='size of the resource' />
			  </ApiDoc.Body>
		   </ApiDoc.Request>
		</ApiDoc.Endpoint>
	  </ApiDoc.Contents>
    )
  }
}
```

## License

MIT © [RobMayer](https://github.com/RobMayer)
