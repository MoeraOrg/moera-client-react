// This file is generated

"use strict";
export const ObjectResult = validate11;
const schema12 = {"type":"object","properties":{"jsonrpc":{"type":"string"},"result":{"type":"object","nullable":true},"id":{"type":"integer"}},"additionalProperties":false,"required":["jsonrpc","id"]};

function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.jsonrpc === undefined) && (missing0 = "jsonrpc")) || ((data.id === undefined) && (missing0 = "id"))){
validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "jsonrpc") || (key0 === "result")) || (key0 === "id"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.jsonrpc !== undefined){
let data0 = data.jsonrpc;
const _errs2 = errors;
if(typeof data0 !== "string"){
let dataType0 = typeof data0;
let coerced0 = undefined;
if(dataType0 == 'object' && Array.isArray(data0) && data0.length == 1){
data0 = data0[0];
dataType0 = typeof data0;
if(typeof data0 === "string"){
coerced0 = data0;
}
}
if(!(coerced0 !== undefined)){
if(dataType0 == "number" || dataType0 == "boolean"){
coerced0 = "" + data0;
}
else if(data0 === null){
coerced0 = "";
}
else {
validate11.errors = [{instancePath:instancePath+"/jsonrpc",schemaPath:"#/properties/jsonrpc/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["jsonrpc"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.result !== undefined){
let data1 = data.result;
const _errs4 = errors;
if((!(data1 && typeof data1 == "object" && !Array.isArray(data1))) && (data1 !== null)){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if((data1 && typeof data1 == "object" && !Array.isArray(data1)) && (data1 === null)){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(data1 === "" || data1 === 0 || data1 === false){
coerced1 = null;
}
else {
validate11.errors = [{instancePath:instancePath+"/result",schemaPath:"#/properties/result/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["result"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data2 = data.id;
const _errs7 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2))){
coerced2 = data2;
}
}
if(!(coerced2 !== undefined)){
if(dataType2 === "boolean" || data2 === null
              || (dataType2 === "string" && data2 && data2 == +data2 && !(data2 % 1))){
coerced2 = +data2;
}
else {
validate11.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["id"] = coerced2;
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate11.errors = vErrors;
return errors === 0;
}

export const BooleanResult = validate12;
const schema13 = {"type":"object","properties":{"jsonrpc":{"type":"string"},"result":{"type":"boolean","nullable":true},"id":{"type":"integer"}},"additionalProperties":false,"required":["jsonrpc","id"]};

function validate12(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.jsonrpc === undefined) && (missing0 = "jsonrpc")) || ((data.id === undefined) && (missing0 = "id"))){
validate12.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "jsonrpc") || (key0 === "result")) || (key0 === "id"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.jsonrpc !== undefined){
let data0 = data.jsonrpc;
const _errs2 = errors;
if(typeof data0 !== "string"){
let dataType0 = typeof data0;
let coerced0 = undefined;
if(dataType0 == 'object' && Array.isArray(data0) && data0.length == 1){
data0 = data0[0];
dataType0 = typeof data0;
if(typeof data0 === "string"){
coerced0 = data0;
}
}
if(!(coerced0 !== undefined)){
if(dataType0 == "number" || dataType0 == "boolean"){
coerced0 = "" + data0;
}
else if(data0 === null){
coerced0 = "";
}
else {
validate12.errors = [{instancePath:instancePath+"/jsonrpc",schemaPath:"#/properties/jsonrpc/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["jsonrpc"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.result !== undefined){
let data1 = data.result;
const _errs4 = errors;
if((typeof data1 !== "boolean") && (data1 !== null)){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if((typeof data1 === "boolean") && (data1 === null)){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(data1 === "false" || data1 === 0 || data1 === null){
coerced1 = false;
}
else if(data1 === "true" || data1 === 1){
coerced1 = true;
}
else if(data1 === "" || data1 === 0 || data1 === false){
coerced1 = null;
}
else {
validate12.errors = [{instancePath:instancePath+"/result",schemaPath:"#/properties/result/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["result"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data2 = data.id;
const _errs7 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2))){
coerced2 = data2;
}
}
if(!(coerced2 !== undefined)){
if(dataType2 === "boolean" || data2 === null
              || (dataType2 === "string" && data2 && data2 == +data2 && !(data2 % 1))){
coerced2 = +data2;
}
else {
validate12.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["id"] = coerced2;
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate12.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate12.errors = vErrors;
return errors === 0;
}

export const ErrorResult = validate13;
const schema14 = {"type":"object","properties":{"jsonrpc":{"type":"string"},"error":{"type":"object","properties":{"code":{"type":"integer"},"message":{"type":"string"}},"additionalProperties":false,"required":["code","message"]},"id":{"type":"integer"}},"additionalProperties":false,"required":["jsonrpc","error","id"]};

function validate13(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.jsonrpc === undefined) && (missing0 = "jsonrpc")) || ((data.error === undefined) && (missing0 = "error"))) || ((data.id === undefined) && (missing0 = "id"))){
validate13.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "jsonrpc") || (key0 === "error")) || (key0 === "id"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.jsonrpc !== undefined){
let data0 = data.jsonrpc;
const _errs2 = errors;
if(typeof data0 !== "string"){
let dataType0 = typeof data0;
let coerced0 = undefined;
if(dataType0 == 'object' && Array.isArray(data0) && data0.length == 1){
data0 = data0[0];
dataType0 = typeof data0;
if(typeof data0 === "string"){
coerced0 = data0;
}
}
if(!(coerced0 !== undefined)){
if(dataType0 == "number" || dataType0 == "boolean"){
coerced0 = "" + data0;
}
else if(data0 === null){
coerced0 = "";
}
else {
validate13.errors = [{instancePath:instancePath+"/jsonrpc",schemaPath:"#/properties/jsonrpc/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["jsonrpc"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.error !== undefined){
let data1 = data.error;
const _errs4 = errors;
if(errors === _errs4){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing1;
if(((data1.code === undefined) && (missing1 = "code")) || ((data1.message === undefined) && (missing1 = "message"))){
validate13.errors = [{instancePath:instancePath+"/error",schemaPath:"#/properties/error/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs6 = errors;
for(const key1 in data1){
if(!((key1 === "code") || (key1 === "message"))){
delete data1[key1];
}
}
if(_errs6 === errors){
if(data1.code !== undefined){
let data2 = data1.code;
const _errs7 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
let dataType1 = typeof data2;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType1 = typeof data2;
if(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2))){
coerced1 = data2;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 === "boolean" || data2 === null
              || (dataType1 === "string" && data2 && data2 == +data2 && !(data2 % 1))){
coerced1 = +data2;
}
else {
validate13.errors = [{instancePath:instancePath+"/error/code",schemaPath:"#/properties/error/properties/code/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced1 !== undefined){
data2 = coerced1;
if(data1 !== undefined){
data1["code"] = coerced1;
}
}
}
var valid1 = _errs7 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.message !== undefined){
let data3 = data1.message;
const _errs9 = errors;
if(typeof data3 !== "string"){
let dataType2 = typeof data3;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType2 = typeof data3;
if(typeof data3 === "string"){
coerced2 = data3;
}
}
if(!(coerced2 !== undefined)){
if(dataType2 == "number" || dataType2 == "boolean"){
coerced2 = "" + data3;
}
else if(data3 === null){
coerced2 = "";
}
else {
validate13.errors = [{instancePath:instancePath+"/error/message",schemaPath:"#/properties/error/properties/message/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data3 = coerced2;
if(data1 !== undefined){
data1["message"] = coerced2;
}
}
}
var valid1 = _errs9 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
else {
validate13.errors = [{instancePath:instancePath+"/error",schemaPath:"#/properties/error/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data4 = data.id;
const _errs11 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
let dataType3 = typeof data4;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType3 = typeof data4;
if(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4))){
coerced3 = data4;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 === "boolean" || data4 === null
              || (dataType3 === "string" && data4 && data4 == +data4 && !(data4 % 1))){
coerced3 = +data4;
}
else {
validate13.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced3 !== undefined){
data4 = coerced3;
if(data !== undefined){
data["id"] = coerced3;
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate13.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate13.errors = vErrors;
return errors === 0;
}

export const RegisteredNameInfo = validate14;
const schema15 = {"type":"object","properties":{"name":{"type":"string"},"generation":{"type":"integer","minimum":0},"updatingKey":{"type":"string"},"nodeUri":{"type":"string","nullable":true},"signingKey":{"type":"string","nullable":true},"validFrom":{"type":"integer","nullable":true}},"additionalProperties":false,"required":["name","generation","updatingKey"]};

function validate14(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.name === undefined) && (missing0 = "name")) || ((data.generation === undefined) && (missing0 = "generation"))) || ((data.updatingKey === undefined) && (missing0 = "updatingKey"))){
validate14.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "name") || (key0 === "generation")) || (key0 === "updatingKey")) || (key0 === "nodeUri")) || (key0 === "signingKey")) || (key0 === "validFrom"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.name !== undefined){
let data0 = data.name;
const _errs2 = errors;
if(typeof data0 !== "string"){
let dataType0 = typeof data0;
let coerced0 = undefined;
if(dataType0 == 'object' && Array.isArray(data0) && data0.length == 1){
data0 = data0[0];
dataType0 = typeof data0;
if(typeof data0 === "string"){
coerced0 = data0;
}
}
if(!(coerced0 !== undefined)){
if(dataType0 == "number" || dataType0 == "boolean"){
coerced0 = "" + data0;
}
else if(data0 === null){
coerced0 = "";
}
else {
validate14.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["name"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.generation !== undefined){
let data1 = data.generation;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1))){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 === "boolean" || data1 === null
              || (dataType1 === "string" && data1 && data1 == +data1 && !(data1 % 1))){
coerced1 = +data1;
}
else {
validate14.errors = [{instancePath:instancePath+"/generation",schemaPath:"#/properties/generation/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["generation"] = coerced1;
}
}
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 < 0 || isNaN(data1)){
validate14.errors = [{instancePath:instancePath+"/generation",schemaPath:"#/properties/generation/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.updatingKey !== undefined){
let data2 = data.updatingKey;
const _errs6 = errors;
if(typeof data2 !== "string"){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if(typeof data2 === "string"){
coerced2 = data2;
}
}
if(!(coerced2 !== undefined)){
if(dataType2 == "number" || dataType2 == "boolean"){
coerced2 = "" + data2;
}
else if(data2 === null){
coerced2 = "";
}
else {
validate14.errors = [{instancePath:instancePath+"/updatingKey",schemaPath:"#/properties/updatingKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["updatingKey"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeUri !== undefined){
let data3 = data.nodeUri;
const _errs8 = errors;
if((typeof data3 !== "string") && (data3 !== null)){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if((typeof data3 === "string") && (data3 === null)){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 == "number" || dataType3 == "boolean"){
coerced3 = "" + data3;
}
else if(data3 === null){
coerced3 = "";
}
else if(data3 === "" || data3 === 0 || data3 === false){
coerced3 = null;
}
else {
validate14.errors = [{instancePath:instancePath+"/nodeUri",schemaPath:"#/properties/nodeUri/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["nodeUri"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.signingKey !== undefined){
let data4 = data.signingKey;
const _errs11 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if((typeof data4 === "string") && (data4 === null)){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 == "number" || dataType4 == "boolean"){
coerced4 = "" + data4;
}
else if(data4 === null){
coerced4 = "";
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced4 = null;
}
else {
validate14.errors = [{instancePath:instancePath+"/signingKey",schemaPath:"#/properties/signingKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["signingKey"] = coerced4;
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.validFrom !== undefined){
let data5 = data.validFrom;
const _errs14 = errors;
if((!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))) && (data5 !== null)){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if((((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5))) && (data5 === null)){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 === "boolean" || data5 === null
              || (dataType5 === "string" && data5 && data5 == +data5 && !(data5 % 1))){
coerced5 = +data5;
}
else if(data5 === "" || data5 === 0 || data5 === false){
coerced5 = null;
}
else {
validate14.errors = [{instancePath:instancePath+"/validFrom",schemaPath:"#/properties/validFrom/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["validFrom"] = coerced5;
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate14.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate14.errors = vErrors;
return errors === 0;
}
