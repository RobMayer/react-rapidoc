import React, { Component } from 'react'

import Endpoint from './parts_endpoint';
import Contents from './parts_contents';
import Request from './parts_request';
import Response from './parts_response';
import Note from './parts_note';

import PrmString from './type_prmstring';
import PrmInteger from './type_prminteger';
import PrmFloat from './type_prmfloat';
import PrmBoolean from './type_prmboolean';
import CpxLiteral from './type_cpxliteral';
import CpxEnum from './type_cpxenum';
import CpxMixed from './type_cpxmixed';
import CpxStruct from './type_cpxstruct';
import CpxMap from './type_cpxmap';
import CpxOneOf from './type_cpxoneof';
import SpcUuid from './type_spcuuid';
import SpcDate from './type_spcdate';
import SpcTimestamp from './type_spctimestamp';

import AryString from './type_arystring';
import AryInteger from './type_aryinteger';
import AryFloat from './type_aryfloat';
import AryBoolean from './type_aryboolean';
import AryEnum from './type_aryenum';
import AryStruct from './type_arystruct';
import AryMixed from './type_arymixed';

import LstString from './type_lststring';
import LstInteger from './type_lstinteger';
import LstFloat from './type_lstfloat';
import LstBoolean from './type_lstboolean';
import LstEnum from './type_lstenum';

const OutputTypes = {

	String : PrmString,
	Integer : PrmInteger,
	Float : PrmFloat,
	Boolean : PrmBoolean,

	Literal : CpxLiteral,
	Enum : CpxEnum,
	Mixed : CpxMixed,
	Struct : CpxStruct,
	Map : CpxMap,
	OneOf : CpxOneOf,

	Uuid : SpcUuid,
	Date : SpcDate,
	Timestamp : SpcTimestamp,

	Array : {
		String : AryString,
		Integer : AryInteger,
		Float : AryFloat,
		Boolean : AryBoolean,
		Enum : AryEnum,
		Mixed : AryMixed,
		Struct : AryStruct,
	},

	List : {
		String : LstString,
		Integer : LstInteger,
		Float : LstFloat,
		Boolean : LstBoolean,
		Enum : LstEnum,
	},

};

const ApiDoc = {
	Types: OutputTypes,
	Contents: Contents,
	Endpoint: Endpoint,
	Request: Request,
	Response: Response,
	Note: Note
}


export {
	ApiDoc as default,
	OutputTypes as Types,
	Contents,
	Endpoint,
	Request,
	Response,
	Note
}
