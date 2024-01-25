// This file is generated

"use strict";
export const EventPacket = validate11;
const schema12 = {"type":"object","properties":{"queueStartedAt":{"type":"integer"},"ordinal":{"type":"integer"},"sentAt":{"type":"integer","nullable":true},"cid":{"type":"string","nullable":true},"event":{"type":"object","properties":{"type":{"type":"string"}},"required":["type"]}},"additionalProperties":false,"required":["queueStartedAt","ordinal","event"]};

function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.queueStartedAt === undefined) && (missing0 = "queueStartedAt")) || ((data.ordinal === undefined) && (missing0 = "ordinal"))) || ((data.event === undefined) && (missing0 = "event"))){
validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "queueStartedAt") || (key0 === "ordinal")) || (key0 === "sentAt")) || (key0 === "cid")) || (key0 === "event"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.queueStartedAt !== undefined){
let data0 = data.queueStartedAt;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
let dataType0 = typeof data0;
let coerced0 = undefined;
if(dataType0 == 'object' && Array.isArray(data0) && data0.length == 1){
data0 = data0[0];
dataType0 = typeof data0;
if(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0))){
coerced0 = data0;
}
}
if(!(coerced0 !== undefined)){
if(dataType0 === "boolean" || data0 === null
              || (dataType0 === "string" && data0 && data0 == +data0 && !(data0 % 1))){
coerced0 = +data0;
}
else {
validate11.errors = [{instancePath:instancePath+"/queueStartedAt",schemaPath:"#/properties/queueStartedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["queueStartedAt"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ordinal !== undefined){
let data1 = data.ordinal;
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
validate11.errors = [{instancePath:instancePath+"/ordinal",schemaPath:"#/properties/ordinal/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["ordinal"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sentAt !== undefined){
let data2 = data.sentAt;
const _errs6 = errors;
if((!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))) && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2))) && (data2 === null)){
coerced2 = data2;
}
}
if(!(coerced2 !== undefined)){
if(dataType2 === "boolean" || data2 === null
              || (dataType2 === "string" && data2 && data2 == +data2 && !(data2 % 1))){
coerced2 = +data2;
}
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate11.errors = [{instancePath:instancePath+"/sentAt",schemaPath:"#/properties/sentAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["sentAt"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.cid !== undefined){
let data3 = data.cid;
const _errs9 = errors;
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
validate11.errors = [{instancePath:instancePath+"/cid",schemaPath:"#/properties/cid/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["cid"] = coerced3;
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.event !== undefined){
let data4 = data.event;
const _errs12 = errors;
if(errors === _errs12){
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
let missing1;
if((data4.type === undefined) && (missing1 = "type")){
validate11.errors = [{instancePath:instancePath+"/event",schemaPath:"#/properties/event/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
if(data4.type !== undefined){
let data5 = data4.type;
if(typeof data5 !== "string"){
let dataType4 = typeof data5;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType4 = typeof data5;
if(typeof data5 === "string"){
coerced4 = data5;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 == "number" || dataType4 == "boolean"){
coerced4 = "" + data5;
}
else if(data5 === null){
coerced4 = "";
}
else {
validate11.errors = [{instancePath:instancePath+"/event/type",schemaPath:"#/properties/event/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data5 = coerced4;
if(data4 !== undefined){
data4["type"] = coerced4;
}
}
}
}
}
}
else {
validate11.errors = [{instancePath:instancePath+"/event",schemaPath:"#/properties/event/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs12 === errors;
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
else {
validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate11.errors = vErrors;
return errors === 0;
}

export const PingEvent = validate12;
const schema13 = {"type":"object","properties":{"type":{"type":"string"}},"additionalProperties":false,"required":["type"]};

function validate12(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
validate12.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "type")){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate12.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
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

export const ProfileUpdatedEvent = validate13;
const schema14 = {"type":"object","properties":{"type":{"type":"string"}},"additionalProperties":false,"required":["type"]};

function validate13(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
validate13.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "type")){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate13.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
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

export const NodeSettingsMetaChangedEvent = validate14;
const schema15 = {"type":"object","properties":{"type":{"type":"string"}},"additionalProperties":false,"required":["type"]};

function validate14(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
validate14.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "type")){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate14.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
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

export const NodeSettingsChangedEvent = validate15;
const schema16 = {"type":"object","properties":{"type":{"type":"string"}},"additionalProperties":false,"required":["type"]};

function validate15(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
validate15.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "type")){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate15.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
}
}
}
}
else {
validate15.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate15.errors = vErrors;
return errors === 0;
}

export const ClientSettingsChangedEvent = validate16;
const schema17 = {"type":"object","properties":{"type":{"type":"string"}},"additionalProperties":false,"required":["type"]};

function validate16(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
validate16.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "type")){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate16.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
}
}
}
}
else {
validate16.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate16.errors = vErrors;
return errors === 0;
}

export const PostingAddedEvent = validate17;
const schema18 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"}},"additionalProperties":false,"required":["type","id"]};

function validate17(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))){
validate17.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "id"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate17.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate17.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate17.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate17.errors = vErrors;
return errors === 0;
}

export const PostingUpdatedEvent = validate18;
const schema19 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"}},"additionalProperties":false,"required":["type","id"]};

function validate18(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))){
validate18.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "id"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate18.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate18.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate18.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate18.errors = vErrors;
return errors === 0;
}

export const PostingDeletedEvent = validate19;
const schema20 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"}},"additionalProperties":false,"required":["type","id"]};

function validate19(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))){
validate19.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "id"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate19.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate19.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate19.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate19.errors = vErrors;
return errors === 0;
}

export const PostingRestoredEvent = validate20;
const schema21 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"}},"additionalProperties":false,"required":["type","id"]};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "id"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate20.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate20.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}

export const PostingReactionsChangedEvent = validate21;
const schema22 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"}},"additionalProperties":false,"required":["type","id"]};

function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))){
validate21.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "id"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate21.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate21.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate21.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate21.errors = vErrors;
return errors === 0;
}

export const PostingCommentsChangedEvent = validate22;
const schema23 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"total":{"type":"integer"}},"additionalProperties":false,"required":["type","id","total"]};

function validate22(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.total === undefined) && (missing0 = "total"))){
validate22.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "id")) || (key0 === "total"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate22.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate22.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.total !== undefined){
let data2 = data.total;
const _errs6 = errors;
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
validate22.errors = [{instancePath:instancePath+"/total",schemaPath:"#/properties/total/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["total"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
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
validate22.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate22.errors = vErrors;
return errors === 0;
}

export const RegisteredNameOperationStatusEvent = validate23;
const schema24 = {"type":"object","properties":{"type":{"type":"string"}},"additionalProperties":false,"required":["type"]};

function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
validate23.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "type")){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate23.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
}
}
}
}
else {
validate23.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate23.errors = vErrors;
return errors === 0;
}

export const NodeNameChangedEvent = validate24;
const schema25 = {"type":"object","properties":{"type":{"type":"string"},"name":{"type":"string"},"fullName":{"type":"string","nullable":true},"gender":{"type":"string","nullable":true},"title":{"type":"string","nullable":true},"avatar":{"anyOf":[{"$ref":"node#/definitions/AvatarImage","type":"object","nullable":true},{"type":"null"}]}},"additionalProperties":false,"required":["type","name"]};
const schema27 = {"type":"object","properties":{"mediaId":{"type":"string"},"path":{"type":"string"},"width":{"type":"integer","nullable":true},"height":{"type":"integer","nullable":true},"shape":{"type":"string","nullable":true}},"required":["mediaId","path"],"additionalProperties":false};

function validate24(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.name === undefined) && (missing0 = "name"))){
validate24.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "name")) || (key0 === "fullName")) || (key0 === "gender")) || (key0 === "title")) || (key0 === "avatar"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate24.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.name !== undefined){
let data1 = data.name;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate24.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["name"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.fullName !== undefined){
let data2 = data.fullName;
const _errs6 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((typeof data2 === "string") && (data2 === null)){
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
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate24.errors = [{instancePath:instancePath+"/fullName",schemaPath:"#/properties/fullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["fullName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.gender !== undefined){
let data3 = data.gender;
const _errs9 = errors;
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
validate24.errors = [{instancePath:instancePath+"/gender",schemaPath:"#/properties/gender/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["gender"] = coerced3;
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
let data4 = data.title;
const _errs12 = errors;
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
validate24.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["title"] = coerced4;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.avatar !== undefined){
let data5 = data.avatar;
const _errs15 = errors;
const _errs16 = errors;
let valid1 = false;
const _errs17 = errors;
if((!(data5 && typeof data5 == "object" && !Array.isArray(data5))) && (data5 !== null)){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if((data5 && typeof data5 == "object" && !Array.isArray(data5)) && (data5 === null)){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(data5 === "" || data5 === 0 || data5 === false){
coerced5 = null;
}
else {
const err0 = {instancePath:instancePath+"/avatar",schemaPath:"#/properties/avatar/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["avatar"] = coerced5;
}
}
}
const _errs18 = errors;
if(errors === _errs18){
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
let missing1;
if(((data5.mediaId === undefined) && (missing1 = "mediaId")) || ((data5.path === undefined) && (missing1 = "path"))){
const err1 = {instancePath:instancePath+"/avatar",schemaPath:"node#/definitions/AvatarImage/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
const _errs20 = errors;
for(const key1 in data5){
if(!(((((key1 === "mediaId") || (key1 === "path")) || (key1 === "width")) || (key1 === "height")) || (key1 === "shape"))){
delete data5[key1];
}
}
if(_errs20 === errors){
if(data5.mediaId !== undefined){
let data6 = data5.mediaId;
const _errs21 = errors;
if(typeof data6 !== "string"){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if(typeof data6 === "string"){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data6;
}
else if(data6 === null){
coerced6 = "";
}
else {
const err2 = {instancePath:instancePath+"/avatar/mediaId",schemaPath:"node#/definitions/AvatarImage/properties/mediaId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data5 !== undefined){
data5["mediaId"] = coerced6;
}
}
}
var valid3 = _errs21 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data5.path !== undefined){
let data7 = data5.path;
const _errs23 = errors;
if(typeof data7 !== "string"){
let dataType7 = typeof data7;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType7 = typeof data7;
if(typeof data7 === "string"){
coerced7 = data7;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data7;
}
else if(data7 === null){
coerced7 = "";
}
else {
const err3 = {instancePath:instancePath+"/avatar/path",schemaPath:"node#/definitions/AvatarImage/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced7 !== undefined){
data7 = coerced7;
if(data5 !== undefined){
data5["path"] = coerced7;
}
}
}
var valid3 = _errs23 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data5.width !== undefined){
let data8 = data5.width;
const _errs25 = errors;
if((!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))) && (data8 !== null)){
let dataType8 = typeof data8;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType8 = typeof data8;
if((((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8))) && (data8 === null)){
coerced8 = data8;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 === "boolean" || data8 === null
              || (dataType8 === "string" && data8 && data8 == +data8 && !(data8 % 1))){
coerced8 = +data8;
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced8 = null;
}
else {
const err4 = {instancePath:instancePath+"/avatar/width",schemaPath:"node#/definitions/AvatarImage/properties/width/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(coerced8 !== undefined){
data8 = coerced8;
if(data5 !== undefined){
data5["width"] = coerced8;
}
}
}
var valid3 = _errs25 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data5.height !== undefined){
let data9 = data5.height;
const _errs28 = errors;
if((!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))) && (data9 !== null)){
let dataType9 = typeof data9;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType9 = typeof data9;
if((((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9))) && (data9 === null)){
coerced9 = data9;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 === "boolean" || data9 === null
              || (dataType9 === "string" && data9 && data9 == +data9 && !(data9 % 1))){
coerced9 = +data9;
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced9 = null;
}
else {
const err5 = {instancePath:instancePath+"/avatar/height",schemaPath:"node#/definitions/AvatarImage/properties/height/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced9 !== undefined){
data9 = coerced9;
if(data5 !== undefined){
data5["height"] = coerced9;
}
}
}
var valid3 = _errs28 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data5.shape !== undefined){
let data10 = data5.shape;
const _errs31 = errors;
if((typeof data10 !== "string") && (data10 !== null)){
let dataType10 = typeof data10;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType10 = typeof data10;
if((typeof data10 === "string") && (data10 === null)){
coerced10 = data10;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 == "number" || dataType10 == "boolean"){
coerced10 = "" + data10;
}
else if(data10 === null){
coerced10 = "";
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced10 = null;
}
else {
const err6 = {instancePath:instancePath+"/avatar/shape",schemaPath:"node#/definitions/AvatarImage/properties/shape/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(coerced10 !== undefined){
data10 = coerced10;
if(data5 !== undefined){
data5["shape"] = coerced10;
}
}
}
var valid3 = _errs31 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
}
}
else {
const err7 = {instancePath:instancePath+"/avatar",schemaPath:"node#/definitions/AvatarImage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var _valid0 = _errs17 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs36 = errors;
if(data5 !== null){
let dataType11 = typeof data5;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType11 = typeof data5;
if(data5 === null){
coerced11 = data5;
}
}
if(!(coerced11 !== undefined)){
if(data5 === "" || data5 === 0 || data5 === false){
coerced11 = null;
}
else {
const err8 = {instancePath:instancePath+"/avatar",schemaPath:"#/properties/avatar/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(coerced11 !== undefined){
data5 = coerced11;
if(data !== undefined){
data["avatar"] = coerced11;
}
}
}
var _valid0 = _errs36 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err9 = {instancePath:instancePath+"/avatar",schemaPath:"#/properties/avatar/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
validate24.errors = vErrors;
return false;
}
else {
errors = _errs16;
if(vErrors !== null){
if(_errs16){
vErrors.length = _errs16;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs15 === errors;
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
validate24.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate24.errors = vErrors;
return errors === 0;
}

export const RemotePostingVerifiedEvent = validate26;
const schema28 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"nodeName":{"type":"string"},"receiverName":{"type":"string"},"postingId":{"type":"string"},"revisionId":{"type":"string"},"correct":{"type":"boolean"}},"additionalProperties":false,"required":["type","id","nodeName","receiverName","postingId","revisionId","correct"]};

function validate26(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.nodeName === undefined) && (missing0 = "nodeName"))) || ((data.receiverName === undefined) && (missing0 = "receiverName"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.revisionId === undefined) && (missing0 = "revisionId"))) || ((data.correct === undefined) && (missing0 = "correct"))){
validate26.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "type") || (key0 === "id")) || (key0 === "nodeName")) || (key0 === "receiverName")) || (key0 === "postingId")) || (key0 === "revisionId")) || (key0 === "correct"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate26.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate26.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeName !== undefined){
let data2 = data.nodeName;
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
validate26.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["nodeName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverName !== undefined){
let data3 = data.receiverName;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate26.errors = [{instancePath:instancePath+"/receiverName",schemaPath:"#/properties/receiverName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["receiverName"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data4 = data.postingId;
const _errs10 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate26.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["postingId"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.revisionId !== undefined){
let data5 = data.revisionId;
const _errs12 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
validate26.errors = [{instancePath:instancePath+"/revisionId",schemaPath:"#/properties/revisionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["revisionId"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.correct !== undefined){
let data6 = data.correct;
const _errs14 = errors;
if(typeof data6 !== "boolean"){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if(typeof data6 === "boolean"){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(data6 === "false" || data6 === 0 || data6 === null){
coerced6 = false;
}
else if(data6 === "true" || data6 === 1){
coerced6 = true;
}
else {
validate26.errors = [{instancePath:instancePath+"/correct",schemaPath:"#/properties/correct/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data !== undefined){
data["correct"] = coerced6;
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
}
else {
validate26.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate26.errors = vErrors;
return errors === 0;
}

export const RemotePostingVerificationFailedEvent = validate27;
const schema29 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"nodeName":{"type":"string"},"receiverName":{"type":"string"},"postingId":{"type":"string"},"revisionId":{"type":"string"},"errorCode":{"type":"string"},"errorMessage":{"type":"string"}},"additionalProperties":false,"required":["type","id","nodeName","receiverName","postingId","revisionId","errorCode","errorMessage"]};

function validate27(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.nodeName === undefined) && (missing0 = "nodeName"))) || ((data.receiverName === undefined) && (missing0 = "receiverName"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.revisionId === undefined) && (missing0 = "revisionId"))) || ((data.errorCode === undefined) && (missing0 = "errorCode"))) || ((data.errorMessage === undefined) && (missing0 = "errorMessage"))){
validate27.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "type") || (key0 === "id")) || (key0 === "nodeName")) || (key0 === "receiverName")) || (key0 === "postingId")) || (key0 === "revisionId")) || (key0 === "errorCode")) || (key0 === "errorMessage"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate27.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate27.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeName !== undefined){
let data2 = data.nodeName;
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
validate27.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["nodeName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverName !== undefined){
let data3 = data.receiverName;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate27.errors = [{instancePath:instancePath+"/receiverName",schemaPath:"#/properties/receiverName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["receiverName"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data4 = data.postingId;
const _errs10 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate27.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["postingId"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.revisionId !== undefined){
let data5 = data.revisionId;
const _errs12 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
validate27.errors = [{instancePath:instancePath+"/revisionId",schemaPath:"#/properties/revisionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["revisionId"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorCode !== undefined){
let data6 = data.errorCode;
const _errs14 = errors;
if(typeof data6 !== "string"){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if(typeof data6 === "string"){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data6;
}
else if(data6 === null){
coerced6 = "";
}
else {
validate27.errors = [{instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data !== undefined){
data["errorCode"] = coerced6;
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorMessage !== undefined){
let data7 = data.errorMessage;
const _errs16 = errors;
if(typeof data7 !== "string"){
let dataType7 = typeof data7;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType7 = typeof data7;
if(typeof data7 === "string"){
coerced7 = data7;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data7;
}
else if(data7 === null){
coerced7 = "";
}
else {
validate27.errors = [{instancePath:instancePath+"/errorMessage",schemaPath:"#/properties/errorMessage/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced7 !== undefined){
data7 = coerced7;
if(data !== undefined){
data["errorMessage"] = coerced7;
}
}
}
var valid0 = _errs16 === errors;
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
}
}
else {
validate27.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate27.errors = vErrors;
return errors === 0;
}

export const RemoteReactionAddedEvent = validate28;
const schema30 = {"type":"object","properties":{"type":{"type":"string"},"remoteNodeName":{"type":"string"},"remotePostingId":{"type":"string"},"negative":{"type":"boolean"},"emoji":{"type":"integer"},"createdAt":{"type":"integer"}},"additionalProperties":false,"required":["type","remoteNodeName","remotePostingId","negative","emoji","createdAt"]};

function validate28(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName"))) || ((data.remotePostingId === undefined) && (missing0 = "remotePostingId"))) || ((data.negative === undefined) && (missing0 = "negative"))) || ((data.emoji === undefined) && (missing0 = "emoji"))) || ((data.createdAt === undefined) && (missing0 = "createdAt"))){
validate28.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "remoteNodeName")) || (key0 === "remotePostingId")) || (key0 === "negative")) || (key0 === "emoji")) || (key0 === "createdAt"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate28.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data1 = data.remoteNodeName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate28.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["remoteNodeName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data2 = data.remotePostingId;
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
validate28.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["remotePostingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.negative !== undefined){
let data3 = data.negative;
const _errs8 = errors;
if(typeof data3 !== "boolean"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "boolean"){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(data3 === "false" || data3 === 0 || data3 === null){
coerced3 = false;
}
else if(data3 === "true" || data3 === 1){
coerced3 = true;
}
else {
validate28.errors = [{instancePath:instancePath+"/negative",schemaPath:"#/properties/negative/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["negative"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.emoji !== undefined){
let data4 = data.emoji;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4))){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "boolean" || data4 === null
              || (dataType4 === "string" && data4 && data4 == +data4 && !(data4 % 1))){
coerced4 = +data4;
}
else {
validate28.errors = [{instancePath:instancePath+"/emoji",schemaPath:"#/properties/emoji/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["emoji"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.createdAt !== undefined){
let data5 = data.createdAt;
const _errs12 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5))){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 === "boolean" || data5 === null
              || (dataType5 === "string" && data5 && data5 == +data5 && !(data5 % 1))){
coerced5 = +data5;
}
else {
validate28.errors = [{instancePath:instancePath+"/createdAt",schemaPath:"#/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["createdAt"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
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
validate28.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate28.errors = vErrors;
return errors === 0;
}

export const RemoteReactionDeletedEvent = validate29;
const schema31 = {"type":"object","properties":{"type":{"type":"string"},"remoteNodeName":{"type":"string"},"remotePostingId":{"type":"string"}},"additionalProperties":false,"required":["type","remoteNodeName","remotePostingId"]};

function validate29(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName"))) || ((data.remotePostingId === undefined) && (missing0 = "remotePostingId"))){
validate29.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "remoteNodeName")) || (key0 === "remotePostingId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate29.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data1 = data.remoteNodeName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate29.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["remoteNodeName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data2 = data.remotePostingId;
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
validate29.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["remotePostingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
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
validate29.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate29.errors = vErrors;
return errors === 0;
}

export const RemoteReactionVerifiedEvent = validate30;
const schema32 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"nodeName":{"type":"string"},"postingId":{"type":"string"},"reactionOwnerName":{"type":"string"},"correct":{"type":"boolean"}},"additionalProperties":false,"required":["type","id","nodeName","postingId","reactionOwnerName","correct"]};

function validate30(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.nodeName === undefined) && (missing0 = "nodeName"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.reactionOwnerName === undefined) && (missing0 = "reactionOwnerName"))) || ((data.correct === undefined) && (missing0 = "correct"))){
validate30.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "id")) || (key0 === "nodeName")) || (key0 === "postingId")) || (key0 === "reactionOwnerName")) || (key0 === "correct"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate30.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate30.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeName !== undefined){
let data2 = data.nodeName;
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
validate30.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["nodeName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data3 = data.postingId;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate30.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["postingId"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reactionOwnerName !== undefined){
let data4 = data.reactionOwnerName;
const _errs10 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate30.errors = [{instancePath:instancePath+"/reactionOwnerName",schemaPath:"#/properties/reactionOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["reactionOwnerName"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.correct !== undefined){
let data5 = data.correct;
const _errs12 = errors;
if(typeof data5 !== "boolean"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "boolean"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(data5 === "false" || data5 === 0 || data5 === null){
coerced5 = false;
}
else if(data5 === "true" || data5 === 1){
coerced5 = true;
}
else {
validate30.errors = [{instancePath:instancePath+"/correct",schemaPath:"#/properties/correct/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["correct"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
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
validate30.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate30.errors = vErrors;
return errors === 0;
}

export const RemoteReactionVerificationFailedEvent = validate31;
const schema33 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"nodeName":{"type":"string"},"postingId":{"type":"string"},"reactionOwnerName":{"type":"string"},"errorCode":{"type":"string"},"errorMessage":{"type":"string"}},"additionalProperties":false,"required":["type","id","nodeName","postingId","reactionOwnerName","errorCode","errorMessage"]};

function validate31(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.nodeName === undefined) && (missing0 = "nodeName"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.reactionOwnerName === undefined) && (missing0 = "reactionOwnerName"))) || ((data.errorCode === undefined) && (missing0 = "errorCode"))) || ((data.errorMessage === undefined) && (missing0 = "errorMessage"))){
validate31.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "type") || (key0 === "id")) || (key0 === "nodeName")) || (key0 === "postingId")) || (key0 === "reactionOwnerName")) || (key0 === "errorCode")) || (key0 === "errorMessage"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate31.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate31.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeName !== undefined){
let data2 = data.nodeName;
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
validate31.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["nodeName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data3 = data.postingId;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate31.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["postingId"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reactionOwnerName !== undefined){
let data4 = data.reactionOwnerName;
const _errs10 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate31.errors = [{instancePath:instancePath+"/reactionOwnerName",schemaPath:"#/properties/reactionOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["reactionOwnerName"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorCode !== undefined){
let data5 = data.errorCode;
const _errs12 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
validate31.errors = [{instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["errorCode"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorMessage !== undefined){
let data6 = data.errorMessage;
const _errs14 = errors;
if(typeof data6 !== "string"){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if(typeof data6 === "string"){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data6;
}
else if(data6 === null){
coerced6 = "";
}
else {
validate31.errors = [{instancePath:instancePath+"/errorMessage",schemaPath:"#/properties/errorMessage/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data !== undefined){
data["errorMessage"] = coerced6;
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
}
else {
validate31.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate31.errors = vErrors;
return errors === 0;
}

export const DraftAddedEvent = validate32;
const schema34 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"draftType":{"type":"string"},"receiverName":{"type":"string"},"receiverPostingId":{"type":"string"},"receiverCommentId":{"type":"string"}},"additionalProperties":false,"required":["type","id","draftType","receiverName","receiverPostingId","receiverCommentId"]};

function validate32(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.draftType === undefined) && (missing0 = "draftType"))) || ((data.receiverName === undefined) && (missing0 = "receiverName"))) || ((data.receiverPostingId === undefined) && (missing0 = "receiverPostingId"))) || ((data.receiverCommentId === undefined) && (missing0 = "receiverCommentId"))){
validate32.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "id")) || (key0 === "draftType")) || (key0 === "receiverName")) || (key0 === "receiverPostingId")) || (key0 === "receiverCommentId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate32.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate32.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.draftType !== undefined){
let data2 = data.draftType;
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
validate32.errors = [{instancePath:instancePath+"/draftType",schemaPath:"#/properties/draftType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["draftType"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverName !== undefined){
let data3 = data.receiverName;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate32.errors = [{instancePath:instancePath+"/receiverName",schemaPath:"#/properties/receiverName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["receiverName"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverPostingId !== undefined){
let data4 = data.receiverPostingId;
const _errs10 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate32.errors = [{instancePath:instancePath+"/receiverPostingId",schemaPath:"#/properties/receiverPostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["receiverPostingId"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverCommentId !== undefined){
let data5 = data.receiverCommentId;
const _errs12 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
validate32.errors = [{instancePath:instancePath+"/receiverCommentId",schemaPath:"#/properties/receiverCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["receiverCommentId"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
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
validate32.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate32.errors = vErrors;
return errors === 0;
}

export const DraftUpdatedEvent = validate33;
const schema35 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"draftType":{"type":"string"},"receiverName":{"type":"string"},"receiverPostingId":{"type":"string"},"receiverCommentId":{"type":"string"}},"additionalProperties":false,"required":["type","id","draftType","receiverName","receiverPostingId","receiverCommentId"]};

function validate33(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.draftType === undefined) && (missing0 = "draftType"))) || ((data.receiverName === undefined) && (missing0 = "receiverName"))) || ((data.receiverPostingId === undefined) && (missing0 = "receiverPostingId"))) || ((data.receiverCommentId === undefined) && (missing0 = "receiverCommentId"))){
validate33.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "id")) || (key0 === "draftType")) || (key0 === "receiverName")) || (key0 === "receiverPostingId")) || (key0 === "receiverCommentId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate33.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate33.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.draftType !== undefined){
let data2 = data.draftType;
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
validate33.errors = [{instancePath:instancePath+"/draftType",schemaPath:"#/properties/draftType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["draftType"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverName !== undefined){
let data3 = data.receiverName;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate33.errors = [{instancePath:instancePath+"/receiverName",schemaPath:"#/properties/receiverName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["receiverName"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverPostingId !== undefined){
let data4 = data.receiverPostingId;
const _errs10 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate33.errors = [{instancePath:instancePath+"/receiverPostingId",schemaPath:"#/properties/receiverPostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["receiverPostingId"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverCommentId !== undefined){
let data5 = data.receiverCommentId;
const _errs12 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
validate33.errors = [{instancePath:instancePath+"/receiverCommentId",schemaPath:"#/properties/receiverCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["receiverCommentId"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
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
validate33.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate33.errors = vErrors;
return errors === 0;
}

export const DraftDeletedEvent = validate34;
const schema36 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"draftType":{"type":"string"},"receiverName":{"type":"string"},"receiverPostingId":{"type":"string"},"receiverCommentId":{"type":"string"}},"additionalProperties":false,"required":["type","id","draftType","receiverName","receiverPostingId","receiverCommentId"]};

function validate34(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.draftType === undefined) && (missing0 = "draftType"))) || ((data.receiverName === undefined) && (missing0 = "receiverName"))) || ((data.receiverPostingId === undefined) && (missing0 = "receiverPostingId"))) || ((data.receiverCommentId === undefined) && (missing0 = "receiverCommentId"))){
validate34.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "id")) || (key0 === "draftType")) || (key0 === "receiverName")) || (key0 === "receiverPostingId")) || (key0 === "receiverCommentId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate34.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate34.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.draftType !== undefined){
let data2 = data.draftType;
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
validate34.errors = [{instancePath:instancePath+"/draftType",schemaPath:"#/properties/draftType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["draftType"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverName !== undefined){
let data3 = data.receiverName;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate34.errors = [{instancePath:instancePath+"/receiverName",schemaPath:"#/properties/receiverName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["receiverName"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverPostingId !== undefined){
let data4 = data.receiverPostingId;
const _errs10 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate34.errors = [{instancePath:instancePath+"/receiverPostingId",schemaPath:"#/properties/receiverPostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["receiverPostingId"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.receiverCommentId !== undefined){
let data5 = data.receiverCommentId;
const _errs12 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
validate34.errors = [{instancePath:instancePath+"/receiverCommentId",schemaPath:"#/properties/receiverCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["receiverCommentId"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
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
validate34.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate34.errors = vErrors;
return errors === 0;
}

export const StoryAddedEvent = validate35;
const schema37 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"storyType":{"type":"string"},"feedName":{"type":"string"},"publishedAt":{"type":"integer"},"pinned":{"type":"boolean"},"moment":{"type":"integer"},"postingId":{"type":"string","nullable":true},"viewed":{"type":"boolean","nullable":true},"read":{"type":"boolean","nullable":true},"satisfied":{"type":"boolean","nullable":true},"summaryNodeName":{"type":"string","nullable":true},"summaryFullName":{"type":"string","nullable":true},"summaryAvatar":{"anyOf":[{"$ref":"node#/definitions/AvatarImage","type":"object","nullable":true},{"type":"null"}]},"summary":{"type":"string","nullable":true},"summaryData":{"anyOf":[{"$ref":"node#/definitions/StorySummaryData","type":"object","nullable":true},{"type":"null"}]},"remoteNodeName":{"type":"string","nullable":true},"remoteFullName":{"type":"string","nullable":true},"remotePostingId":{"type":"string","nullable":true},"remoteCommentId":{"type":"string","nullable":true},"operations":{"type":"object","properties":{"edit":{"type":"string","nullable":true},"delete":{"type":"string","nullable":true}},"nullable":true,"additionalProperties":false}},"additionalProperties":false,"required":["type","id","storyType","feedName","publishedAt","pinned","moment"]};
const func2 = Object.prototype.hasOwnProperty;
const schema39 = {"type":"object","properties":{"node":{"anyOf":[{"$ref":"node#/definitions/StorySummaryNode","type":"object","nullable":true},{"type":"null"}]},"posting":{"anyOf":[{"$ref":"node#/definitions/StorySummaryEntry","type":"object","nullable":true},{"type":"null"}]},"comment":{"anyOf":[{"$ref":"node#/definitions/StorySummaryEntry","type":"object","nullable":true},{"type":"null"}]},"comments":{"type":"array","items":{"$ref":"node#/definitions/StorySummaryEntry"},"nullable":true},"totalComments":{"type":"integer","nullable":true},"repliedTo":{"anyOf":[{"$ref":"node#/definitions/StorySummaryEntry","type":"object","nullable":true},{"type":"null"}]},"parentPosting":{"anyOf":[{"$ref":"node#/definitions/StorySummaryEntry","type":"object","nullable":true},{"type":"null"}]},"reaction":{"anyOf":[{"$ref":"node#/definitions/StorySummaryReaction","type":"object","nullable":true},{"type":"null"}]},"reactions":{"type":"array","items":{"$ref":"node#/definitions/StorySummaryReaction"},"nullable":true},"totalReactions":{"type":"integer","nullable":true},"feedName":{"type":"string","nullable":true},"subscriptionReason":{"type":"string","nullable":true},"friendGroup":{"anyOf":[{"$ref":"node#/definitions/StorySummaryFriendGroup","type":"object","nullable":true},{"type":"null"}]},"blocked":{"anyOf":[{"$ref":"node#/definitions/StorySummaryBlocked","type":"object","nullable":true},{"type":"null"}]},"sheriff":{"anyOf":[{"$ref":"node#/definitions/StorySummarySheriff","type":"object","nullable":true},{"type":"null"}]},"description":{"type":"string","nullable":true}},"additionalProperties":false};
const schema40 = {"type":"object","properties":{"ownerName":{"type":"string","nullable":true},"ownerFullName":{"type":"string","nullable":true},"ownerGender":{"type":"string","nullable":true}},"additionalProperties":false};
const schema43 = {"type":"object","properties":{"ownerName":{"type":"string","nullable":true},"ownerFullName":{"type":"string","nullable":true},"ownerGender":{"type":"string","nullable":true},"emoji":{"type":"integer","nullable":true}},"additionalProperties":false};
const schema45 = {"type":"object","properties":{"id":{"type":"string","nullable":true},"title":{"type":"string","nullable":true}},"additionalProperties":false};
const schema46 = {"type":"object","properties":{"operations":{"type":"array","items":{"type":"string"}},"period":{"type":"integer","nullable":true}},"required":["operations"],"additionalProperties":false};
const schema47 = {"type":"object","properties":{"sheriffName":{"type":"string"},"orderId":{"type":"string","nullable":true},"complainId":{"type":"string","nullable":true}},"required":["sheriffName"],"additionalProperties":false};
const schema41 = {"type":"object","properties":{"ownerName":{"type":"string","nullable":true},"ownerFullName":{"type":"string","nullable":true},"ownerGender":{"type":"string","nullable":true},"heading":{"type":"string","nullable":true},"sheriffs":{"type":"array","items":{"type":"string"},"nullable":true},"sheriffMarks":{"type":"array","items":{"$ref":"node#/definitions/SheriffMark"},"nullable":true}},"additionalProperties":false};
const schema42 = {"type":"object","properties":{"sheriffName":{"type":"string"}},"required":["sheriffName"],"additionalProperties":false};

function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "ownerName") || (key0 === "ownerFullName")) || (key0 === "ownerGender")) || (key0 === "heading")) || (key0 === "sheriffs")) || (key0 === "sheriffMarks"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.ownerName !== undefined){
let data0 = data.ownerName;
const _errs2 = errors;
if((typeof data0 !== "string") && (data0 !== null)){
let dataType0 = typeof data0;
let coerced0 = undefined;
if(dataType0 == 'object' && Array.isArray(data0) && data0.length == 1){
data0 = data0[0];
dataType0 = typeof data0;
if((typeof data0 === "string") && (data0 === null)){
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
else if(data0 === "" || data0 === 0 || data0 === false){
coerced0 = null;
}
else {
validate37.errors = [{instancePath:instancePath+"/ownerName",schemaPath:"#/properties/ownerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["ownerName"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ownerFullName !== undefined){
let data1 = data.ownerFullName;
const _errs5 = errors;
if((typeof data1 !== "string") && (data1 !== null)){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if((typeof data1 === "string") && (data1 === null)){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else if(data1 === "" || data1 === 0 || data1 === false){
coerced1 = null;
}
else {
validate37.errors = [{instancePath:instancePath+"/ownerFullName",schemaPath:"#/properties/ownerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["ownerFullName"] = coerced1;
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ownerGender !== undefined){
let data2 = data.ownerGender;
const _errs8 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((typeof data2 === "string") && (data2 === null)){
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
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate37.errors = [{instancePath:instancePath+"/ownerGender",schemaPath:"#/properties/ownerGender/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["ownerGender"] = coerced2;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.heading !== undefined){
let data3 = data.heading;
const _errs11 = errors;
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
validate37.errors = [{instancePath:instancePath+"/heading",schemaPath:"#/properties/heading/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["heading"] = coerced3;
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sheriffs !== undefined){
let data4 = data.sheriffs;
const _errs14 = errors;
if((!(Array.isArray(data4))) && (data4 !== null)){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if((Array.isArray(data4)) && (data4 === null)){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "string" || dataType4 === "number"
              || dataType4 === "boolean" || data4 === null){
coerced4 = [data4];
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced4 = null;
}
else {
validate37.errors = [{instancePath:instancePath+"/sheriffs",schemaPath:"#/properties/sheriffs/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["sheriffs"] = coerced4;
}
}
}
if(errors === _errs14){
if(Array.isArray(data4)){
var valid1 = true;
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
const _errs17 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
validate37.errors = [{instancePath:instancePath+"/sheriffs/" + i0,schemaPath:"#/properties/sheriffs/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data4 !== undefined){
data4[i0] = coerced5;
}
}
}
var valid1 = _errs17 === errors;
if(!valid1){
break;
}
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sheriffMarks !== undefined){
let data6 = data.sheriffMarks;
const _errs19 = errors;
if((!(Array.isArray(data6))) && (data6 !== null)){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if((Array.isArray(data6)) && (data6 === null)){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 === "string" || dataType6 === "number"
              || dataType6 === "boolean" || data6 === null){
coerced6 = [data6];
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced6 = null;
}
else {
validate37.errors = [{instancePath:instancePath+"/sheriffMarks",schemaPath:"#/properties/sheriffMarks/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data !== undefined){
data["sheriffMarks"] = coerced6;
}
}
}
if(errors === _errs19){
if(Array.isArray(data6)){
var valid2 = true;
const len1 = data6.length;
for(let i1=0; i1<len1; i1++){
let data7 = data6[i1];
const _errs22 = errors;
const _errs23 = errors;
if(errors === _errs23){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
let missing0;
if((data7.sheriffName === undefined) && (missing0 = "sheriffName")){
validate37.errors = [{instancePath:instancePath+"/sheriffMarks/" + i1,schemaPath:"node#/definitions/SheriffMark/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs25 = errors;
for(const key1 in data7){
if(!(key1 === "sheriffName")){
delete data7[key1];
}
}
if(_errs25 === errors){
if(data7.sheriffName !== undefined){
let data8 = data7.sheriffName;
if(typeof data8 !== "string"){
let dataType7 = typeof data8;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType7 = typeof data8;
if(typeof data8 === "string"){
coerced7 = data8;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data8;
}
else if(data8 === null){
coerced7 = "";
}
else {
validate37.errors = [{instancePath:instancePath+"/sheriffMarks/" + i1+"/sheriffName",schemaPath:"node#/definitions/SheriffMark/properties/sheriffName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced7 !== undefined){
data8 = coerced7;
if(data7 !== undefined){
data7["sheriffName"] = coerced7;
}
}
}
}
}
}
}
else {
validate37.errors = [{instancePath:instancePath+"/sheriffMarks/" + i1,schemaPath:"node#/definitions/SheriffMark/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid2 = _errs22 === errors;
if(!valid2){
break;
}
}
}
}
var valid0 = _errs19 === errors;
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
else {
validate37.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate37.errors = vErrors;
return errors === 0;
}


function validate36(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
const _errs1 = errors;
for(const key0 in data){
if(!(func2.call(schema39.properties, key0))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.node !== undefined){
let data0 = data.node;
const _errs2 = errors;
const _errs3 = errors;
let valid1 = false;
const _errs4 = errors;
if((!(data0 && typeof data0 == "object" && !Array.isArray(data0))) && (data0 !== null)){
let dataType0 = typeof data0;
let coerced0 = undefined;
if(dataType0 == 'object' && Array.isArray(data0) && data0.length == 1){
data0 = data0[0];
dataType0 = typeof data0;
if((data0 && typeof data0 == "object" && !Array.isArray(data0)) && (data0 === null)){
coerced0 = data0;
}
}
if(!(coerced0 !== undefined)){
if(data0 === "" || data0 === 0 || data0 === false){
coerced0 = null;
}
else {
const err0 = {instancePath:instancePath+"/node",schemaPath:"#/properties/node/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["node"] = coerced0;
}
}
}
const _errs5 = errors;
if(errors === _errs5){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
const _errs7 = errors;
for(const key1 in data0){
if(!(((key1 === "ownerName") || (key1 === "ownerFullName")) || (key1 === "ownerGender"))){
delete data0[key1];
}
}
if(_errs7 === errors){
if(data0.ownerName !== undefined){
let data1 = data0.ownerName;
const _errs8 = errors;
if((typeof data1 !== "string") && (data1 !== null)){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if((typeof data1 === "string") && (data1 === null)){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else if(data1 === "" || data1 === 0 || data1 === false){
coerced1 = null;
}
else {
const err1 = {instancePath:instancePath+"/node/ownerName",schemaPath:"node#/definitions/StorySummaryNode/properties/ownerName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data0 !== undefined){
data0["ownerName"] = coerced1;
}
}
}
var valid3 = _errs8 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.ownerFullName !== undefined){
let data2 = data0.ownerFullName;
const _errs11 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((typeof data2 === "string") && (data2 === null)){
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
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
const err2 = {instancePath:instancePath+"/node/ownerFullName",schemaPath:"node#/definitions/StorySummaryNode/properties/ownerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data0 !== undefined){
data0["ownerFullName"] = coerced2;
}
}
}
var valid3 = _errs11 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.ownerGender !== undefined){
let data3 = data0.ownerGender;
const _errs14 = errors;
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
const err3 = {instancePath:instancePath+"/node/ownerGender",schemaPath:"node#/definitions/StorySummaryNode/properties/ownerGender/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data0 !== undefined){
data0["ownerGender"] = coerced3;
}
}
}
var valid3 = _errs14 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
else {
const err4 = {instancePath:instancePath+"/node",schemaPath:"node#/definitions/StorySummaryNode/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var _valid0 = _errs4 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs19 = errors;
if(data0 !== null){
let dataType4 = typeof data0;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data0) && data0.length == 1){
data0 = data0[0];
dataType4 = typeof data0;
if(data0 === null){
coerced4 = data0;
}
}
if(!(coerced4 !== undefined)){
if(data0 === "" || data0 === 0 || data0 === false){
coerced4 = null;
}
else {
const err5 = {instancePath:instancePath+"/node",schemaPath:"#/properties/node/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced4 !== undefined){
data0 = coerced4;
if(data !== undefined){
data["node"] = coerced4;
}
}
}
var _valid0 = _errs19 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err6 = {instancePath:instancePath+"/node",schemaPath:"#/properties/node/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.posting !== undefined){
let data4 = data.posting;
const _errs21 = errors;
const _errs22 = errors;
let valid4 = false;
const _errs23 = errors;
if((!(data4 && typeof data4 == "object" && !Array.isArray(data4))) && (data4 !== null)){
let dataType5 = typeof data4;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType5 = typeof data4;
if((data4 && typeof data4 == "object" && !Array.isArray(data4)) && (data4 === null)){
coerced5 = data4;
}
}
if(!(coerced5 !== undefined)){
if(data4 === "" || data4 === 0 || data4 === false){
coerced5 = null;
}
else {
const err7 = {instancePath:instancePath+"/posting",schemaPath:"#/properties/posting/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(coerced5 !== undefined){
data4 = coerced5;
if(data !== undefined){
data["posting"] = coerced5;
}
}
}
if(!(validate37(data4, {instancePath:instancePath+"/posting",parentData:data,parentDataProperty:"posting",rootData}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
var _valid1 = _errs23 === errors;
valid4 = valid4 || _valid1;
if(!valid4){
const _errs26 = errors;
if(data4 !== null){
let dataType6 = typeof data4;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType6 = typeof data4;
if(data4 === null){
coerced6 = data4;
}
}
if(!(coerced6 !== undefined)){
if(data4 === "" || data4 === 0 || data4 === false){
coerced6 = null;
}
else {
const err8 = {instancePath:instancePath+"/posting",schemaPath:"#/properties/posting/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(coerced6 !== undefined){
data4 = coerced6;
if(data !== undefined){
data["posting"] = coerced6;
}
}
}
var _valid1 = _errs26 === errors;
valid4 = valid4 || _valid1;
}
if(!valid4){
const err9 = {instancePath:instancePath+"/posting",schemaPath:"#/properties/posting/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs22;
if(vErrors !== null){
if(_errs22){
vErrors.length = _errs22;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.comment !== undefined){
let data5 = data.comment;
const _errs28 = errors;
const _errs29 = errors;
let valid5 = false;
const _errs30 = errors;
if((!(data5 && typeof data5 == "object" && !Array.isArray(data5))) && (data5 !== null)){
let dataType7 = typeof data5;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType7 = typeof data5;
if((data5 && typeof data5 == "object" && !Array.isArray(data5)) && (data5 === null)){
coerced7 = data5;
}
}
if(!(coerced7 !== undefined)){
if(data5 === "" || data5 === 0 || data5 === false){
coerced7 = null;
}
else {
const err10 = {instancePath:instancePath+"/comment",schemaPath:"#/properties/comment/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(coerced7 !== undefined){
data5 = coerced7;
if(data !== undefined){
data["comment"] = coerced7;
}
}
}
if(!(validate37(data5, {instancePath:instancePath+"/comment",parentData:data,parentDataProperty:"comment",rootData}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
var _valid2 = _errs30 === errors;
valid5 = valid5 || _valid2;
if(!valid5){
const _errs33 = errors;
if(data5 !== null){
let dataType8 = typeof data5;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType8 = typeof data5;
if(data5 === null){
coerced8 = data5;
}
}
if(!(coerced8 !== undefined)){
if(data5 === "" || data5 === 0 || data5 === false){
coerced8 = null;
}
else {
const err11 = {instancePath:instancePath+"/comment",schemaPath:"#/properties/comment/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(coerced8 !== undefined){
data5 = coerced8;
if(data !== undefined){
data["comment"] = coerced8;
}
}
}
var _valid2 = _errs33 === errors;
valid5 = valid5 || _valid2;
}
if(!valid5){
const err12 = {instancePath:instancePath+"/comment",schemaPath:"#/properties/comment/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs29;
if(vErrors !== null){
if(_errs29){
vErrors.length = _errs29;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs28 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.comments !== undefined){
let data6 = data.comments;
const _errs35 = errors;
if((!(Array.isArray(data6))) && (data6 !== null)){
let dataType9 = typeof data6;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType9 = typeof data6;
if((Array.isArray(data6)) && (data6 === null)){
coerced9 = data6;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 === "string" || dataType9 === "number"
              || dataType9 === "boolean" || data6 === null){
coerced9 = [data6];
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced9 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/comments",schemaPath:"#/properties/comments/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced9 !== undefined){
data6 = coerced9;
if(data !== undefined){
data["comments"] = coerced9;
}
}
}
if(errors === _errs35){
if(Array.isArray(data6)){
var valid6 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
const _errs38 = errors;
if(!(validate37(data6[i0], {instancePath:instancePath+"/comments/" + i0,parentData:data6,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
var valid6 = _errs38 === errors;
if(!valid6){
break;
}
}
}
}
var valid0 = _errs35 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.totalComments !== undefined){
let data8 = data.totalComments;
const _errs39 = errors;
if((!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))) && (data8 !== null)){
let dataType10 = typeof data8;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType10 = typeof data8;
if((((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8))) && (data8 === null)){
coerced10 = data8;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 === "boolean" || data8 === null
              || (dataType10 === "string" && data8 && data8 == +data8 && !(data8 % 1))){
coerced10 = +data8;
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced10 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/totalComments",schemaPath:"#/properties/totalComments/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced10 !== undefined){
data8 = coerced10;
if(data !== undefined){
data["totalComments"] = coerced10;
}
}
}
var valid0 = _errs39 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.repliedTo !== undefined){
let data9 = data.repliedTo;
const _errs42 = errors;
const _errs43 = errors;
let valid7 = false;
const _errs44 = errors;
if((!(data9 && typeof data9 == "object" && !Array.isArray(data9))) && (data9 !== null)){
let dataType11 = typeof data9;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType11 = typeof data9;
if((data9 && typeof data9 == "object" && !Array.isArray(data9)) && (data9 === null)){
coerced11 = data9;
}
}
if(!(coerced11 !== undefined)){
if(data9 === "" || data9 === 0 || data9 === false){
coerced11 = null;
}
else {
const err13 = {instancePath:instancePath+"/repliedTo",schemaPath:"#/properties/repliedTo/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(coerced11 !== undefined){
data9 = coerced11;
if(data !== undefined){
data["repliedTo"] = coerced11;
}
}
}
if(!(validate37(data9, {instancePath:instancePath+"/repliedTo",parentData:data,parentDataProperty:"repliedTo",rootData}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
var _valid3 = _errs44 === errors;
valid7 = valid7 || _valid3;
if(!valid7){
const _errs47 = errors;
if(data9 !== null){
let dataType12 = typeof data9;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType12 = typeof data9;
if(data9 === null){
coerced12 = data9;
}
}
if(!(coerced12 !== undefined)){
if(data9 === "" || data9 === 0 || data9 === false){
coerced12 = null;
}
else {
const err14 = {instancePath:instancePath+"/repliedTo",schemaPath:"#/properties/repliedTo/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(coerced12 !== undefined){
data9 = coerced12;
if(data !== undefined){
data["repliedTo"] = coerced12;
}
}
}
var _valid3 = _errs47 === errors;
valid7 = valid7 || _valid3;
}
if(!valid7){
const err15 = {instancePath:instancePath+"/repliedTo",schemaPath:"#/properties/repliedTo/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs43;
if(vErrors !== null){
if(_errs43){
vErrors.length = _errs43;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs42 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.parentPosting !== undefined){
let data10 = data.parentPosting;
const _errs49 = errors;
const _errs50 = errors;
let valid8 = false;
const _errs51 = errors;
if((!(data10 && typeof data10 == "object" && !Array.isArray(data10))) && (data10 !== null)){
let dataType13 = typeof data10;
let coerced13 = undefined;
if(dataType13 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType13 = typeof data10;
if((data10 && typeof data10 == "object" && !Array.isArray(data10)) && (data10 === null)){
coerced13 = data10;
}
}
if(!(coerced13 !== undefined)){
if(data10 === "" || data10 === 0 || data10 === false){
coerced13 = null;
}
else {
const err16 = {instancePath:instancePath+"/parentPosting",schemaPath:"#/properties/parentPosting/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(coerced13 !== undefined){
data10 = coerced13;
if(data !== undefined){
data["parentPosting"] = coerced13;
}
}
}
if(!(validate37(data10, {instancePath:instancePath+"/parentPosting",parentData:data,parentDataProperty:"parentPosting",rootData}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
var _valid4 = _errs51 === errors;
valid8 = valid8 || _valid4;
if(!valid8){
const _errs54 = errors;
if(data10 !== null){
let dataType14 = typeof data10;
let coerced14 = undefined;
if(dataType14 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType14 = typeof data10;
if(data10 === null){
coerced14 = data10;
}
}
if(!(coerced14 !== undefined)){
if(data10 === "" || data10 === 0 || data10 === false){
coerced14 = null;
}
else {
const err17 = {instancePath:instancePath+"/parentPosting",schemaPath:"#/properties/parentPosting/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(coerced14 !== undefined){
data10 = coerced14;
if(data !== undefined){
data["parentPosting"] = coerced14;
}
}
}
var _valid4 = _errs54 === errors;
valid8 = valid8 || _valid4;
}
if(!valid8){
const err18 = {instancePath:instancePath+"/parentPosting",schemaPath:"#/properties/parentPosting/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs50;
if(vErrors !== null){
if(_errs50){
vErrors.length = _errs50;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs49 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reaction !== undefined){
let data11 = data.reaction;
const _errs56 = errors;
const _errs57 = errors;
let valid9 = false;
const _errs58 = errors;
if((!(data11 && typeof data11 == "object" && !Array.isArray(data11))) && (data11 !== null)){
let dataType15 = typeof data11;
let coerced15 = undefined;
if(dataType15 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType15 = typeof data11;
if((data11 && typeof data11 == "object" && !Array.isArray(data11)) && (data11 === null)){
coerced15 = data11;
}
}
if(!(coerced15 !== undefined)){
if(data11 === "" || data11 === 0 || data11 === false){
coerced15 = null;
}
else {
const err19 = {instancePath:instancePath+"/reaction",schemaPath:"#/properties/reaction/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(coerced15 !== undefined){
data11 = coerced15;
if(data !== undefined){
data["reaction"] = coerced15;
}
}
}
const _errs59 = errors;
if(errors === _errs59){
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
const _errs61 = errors;
for(const key2 in data11){
if(!((((key2 === "ownerName") || (key2 === "ownerFullName")) || (key2 === "ownerGender")) || (key2 === "emoji"))){
delete data11[key2];
}
}
if(_errs61 === errors){
if(data11.ownerName !== undefined){
let data12 = data11.ownerName;
const _errs62 = errors;
if((typeof data12 !== "string") && (data12 !== null)){
let dataType16 = typeof data12;
let coerced16 = undefined;
if(dataType16 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType16 = typeof data12;
if((typeof data12 === "string") && (data12 === null)){
coerced16 = data12;
}
}
if(!(coerced16 !== undefined)){
if(dataType16 == "number" || dataType16 == "boolean"){
coerced16 = "" + data12;
}
else if(data12 === null){
coerced16 = "";
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced16 = null;
}
else {
const err20 = {instancePath:instancePath+"/reaction/ownerName",schemaPath:"node#/definitions/StorySummaryReaction/properties/ownerName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(coerced16 !== undefined){
data12 = coerced16;
if(data11 !== undefined){
data11["ownerName"] = coerced16;
}
}
}
var valid11 = _errs62 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data11.ownerFullName !== undefined){
let data13 = data11.ownerFullName;
const _errs65 = errors;
if((typeof data13 !== "string") && (data13 !== null)){
let dataType17 = typeof data13;
let coerced17 = undefined;
if(dataType17 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType17 = typeof data13;
if((typeof data13 === "string") && (data13 === null)){
coerced17 = data13;
}
}
if(!(coerced17 !== undefined)){
if(dataType17 == "number" || dataType17 == "boolean"){
coerced17 = "" + data13;
}
else if(data13 === null){
coerced17 = "";
}
else if(data13 === "" || data13 === 0 || data13 === false){
coerced17 = null;
}
else {
const err21 = {instancePath:instancePath+"/reaction/ownerFullName",schemaPath:"node#/definitions/StorySummaryReaction/properties/ownerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(coerced17 !== undefined){
data13 = coerced17;
if(data11 !== undefined){
data11["ownerFullName"] = coerced17;
}
}
}
var valid11 = _errs65 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data11.ownerGender !== undefined){
let data14 = data11.ownerGender;
const _errs68 = errors;
if((typeof data14 !== "string") && (data14 !== null)){
let dataType18 = typeof data14;
let coerced18 = undefined;
if(dataType18 == 'object' && Array.isArray(data14) && data14.length == 1){
data14 = data14[0];
dataType18 = typeof data14;
if((typeof data14 === "string") && (data14 === null)){
coerced18 = data14;
}
}
if(!(coerced18 !== undefined)){
if(dataType18 == "number" || dataType18 == "boolean"){
coerced18 = "" + data14;
}
else if(data14 === null){
coerced18 = "";
}
else if(data14 === "" || data14 === 0 || data14 === false){
coerced18 = null;
}
else {
const err22 = {instancePath:instancePath+"/reaction/ownerGender",schemaPath:"node#/definitions/StorySummaryReaction/properties/ownerGender/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(coerced18 !== undefined){
data14 = coerced18;
if(data11 !== undefined){
data11["ownerGender"] = coerced18;
}
}
}
var valid11 = _errs68 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data11.emoji !== undefined){
let data15 = data11.emoji;
const _errs71 = errors;
if((!(((typeof data15 == "number") && (!(data15 % 1) && !isNaN(data15))) && (isFinite(data15)))) && (data15 !== null)){
let dataType19 = typeof data15;
let coerced19 = undefined;
if(dataType19 == 'object' && Array.isArray(data15) && data15.length == 1){
data15 = data15[0];
dataType19 = typeof data15;
if((((typeof data15 == "number") && (!(data15 % 1) && !isNaN(data15))) && (isFinite(data15))) && (data15 === null)){
coerced19 = data15;
}
}
if(!(coerced19 !== undefined)){
if(dataType19 === "boolean" || data15 === null
              || (dataType19 === "string" && data15 && data15 == +data15 && !(data15 % 1))){
coerced19 = +data15;
}
else if(data15 === "" || data15 === 0 || data15 === false){
coerced19 = null;
}
else {
const err23 = {instancePath:instancePath+"/reaction/emoji",schemaPath:"node#/definitions/StorySummaryReaction/properties/emoji/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(coerced19 !== undefined){
data15 = coerced19;
if(data11 !== undefined){
data11["emoji"] = coerced19;
}
}
}
var valid11 = _errs71 === errors;
}
else {
var valid11 = true;
}
}
}
}
}
}
else {
const err24 = {instancePath:instancePath+"/reaction",schemaPath:"node#/definitions/StorySummaryReaction/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
var _valid5 = _errs58 === errors;
valid9 = valid9 || _valid5;
if(!valid9){
const _errs76 = errors;
if(data11 !== null){
let dataType20 = typeof data11;
let coerced20 = undefined;
if(dataType20 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType20 = typeof data11;
if(data11 === null){
coerced20 = data11;
}
}
if(!(coerced20 !== undefined)){
if(data11 === "" || data11 === 0 || data11 === false){
coerced20 = null;
}
else {
const err25 = {instancePath:instancePath+"/reaction",schemaPath:"#/properties/reaction/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(coerced20 !== undefined){
data11 = coerced20;
if(data !== undefined){
data["reaction"] = coerced20;
}
}
}
var _valid5 = _errs76 === errors;
valid9 = valid9 || _valid5;
}
if(!valid9){
const err26 = {instancePath:instancePath+"/reaction",schemaPath:"#/properties/reaction/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs57;
if(vErrors !== null){
if(_errs57){
vErrors.length = _errs57;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs56 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reactions !== undefined){
let data16 = data.reactions;
const _errs78 = errors;
if((!(Array.isArray(data16))) && (data16 !== null)){
let dataType21 = typeof data16;
let coerced21 = undefined;
if(dataType21 == 'object' && Array.isArray(data16) && data16.length == 1){
data16 = data16[0];
dataType21 = typeof data16;
if((Array.isArray(data16)) && (data16 === null)){
coerced21 = data16;
}
}
if(!(coerced21 !== undefined)){
if(dataType21 === "string" || dataType21 === "number"
              || dataType21 === "boolean" || data16 === null){
coerced21 = [data16];
}
else if(data16 === "" || data16 === 0 || data16 === false){
coerced21 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/reactions",schemaPath:"#/properties/reactions/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced21 !== undefined){
data16 = coerced21;
if(data !== undefined){
data["reactions"] = coerced21;
}
}
}
if(errors === _errs78){
if(Array.isArray(data16)){
var valid12 = true;
const len1 = data16.length;
for(let i1=0; i1<len1; i1++){
let data17 = data16[i1];
const _errs81 = errors;
const _errs82 = errors;
if(errors === _errs82){
if(data17 && typeof data17 == "object" && !Array.isArray(data17)){
const _errs84 = errors;
for(const key3 in data17){
if(!((((key3 === "ownerName") || (key3 === "ownerFullName")) || (key3 === "ownerGender")) || (key3 === "emoji"))){
delete data17[key3];
}
}
if(_errs84 === errors){
if(data17.ownerName !== undefined){
let data18 = data17.ownerName;
const _errs85 = errors;
if((typeof data18 !== "string") && (data18 !== null)){
let dataType22 = typeof data18;
let coerced22 = undefined;
if(dataType22 == 'object' && Array.isArray(data18) && data18.length == 1){
data18 = data18[0];
dataType22 = typeof data18;
if((typeof data18 === "string") && (data18 === null)){
coerced22 = data18;
}
}
if(!(coerced22 !== undefined)){
if(dataType22 == "number" || dataType22 == "boolean"){
coerced22 = "" + data18;
}
else if(data18 === null){
coerced22 = "";
}
else if(data18 === "" || data18 === 0 || data18 === false){
coerced22 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/reactions/" + i1+"/ownerName",schemaPath:"node#/definitions/StorySummaryReaction/properties/ownerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced22 !== undefined){
data18 = coerced22;
if(data17 !== undefined){
data17["ownerName"] = coerced22;
}
}
}
var valid14 = _errs85 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data17.ownerFullName !== undefined){
let data19 = data17.ownerFullName;
const _errs88 = errors;
if((typeof data19 !== "string") && (data19 !== null)){
let dataType23 = typeof data19;
let coerced23 = undefined;
if(dataType23 == 'object' && Array.isArray(data19) && data19.length == 1){
data19 = data19[0];
dataType23 = typeof data19;
if((typeof data19 === "string") && (data19 === null)){
coerced23 = data19;
}
}
if(!(coerced23 !== undefined)){
if(dataType23 == "number" || dataType23 == "boolean"){
coerced23 = "" + data19;
}
else if(data19 === null){
coerced23 = "";
}
else if(data19 === "" || data19 === 0 || data19 === false){
coerced23 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/reactions/" + i1+"/ownerFullName",schemaPath:"node#/definitions/StorySummaryReaction/properties/ownerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced23 !== undefined){
data19 = coerced23;
if(data17 !== undefined){
data17["ownerFullName"] = coerced23;
}
}
}
var valid14 = _errs88 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data17.ownerGender !== undefined){
let data20 = data17.ownerGender;
const _errs91 = errors;
if((typeof data20 !== "string") && (data20 !== null)){
let dataType24 = typeof data20;
let coerced24 = undefined;
if(dataType24 == 'object' && Array.isArray(data20) && data20.length == 1){
data20 = data20[0];
dataType24 = typeof data20;
if((typeof data20 === "string") && (data20 === null)){
coerced24 = data20;
}
}
if(!(coerced24 !== undefined)){
if(dataType24 == "number" || dataType24 == "boolean"){
coerced24 = "" + data20;
}
else if(data20 === null){
coerced24 = "";
}
else if(data20 === "" || data20 === 0 || data20 === false){
coerced24 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/reactions/" + i1+"/ownerGender",schemaPath:"node#/definitions/StorySummaryReaction/properties/ownerGender/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced24 !== undefined){
data20 = coerced24;
if(data17 !== undefined){
data17["ownerGender"] = coerced24;
}
}
}
var valid14 = _errs91 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data17.emoji !== undefined){
let data21 = data17.emoji;
const _errs94 = errors;
if((!(((typeof data21 == "number") && (!(data21 % 1) && !isNaN(data21))) && (isFinite(data21)))) && (data21 !== null)){
let dataType25 = typeof data21;
let coerced25 = undefined;
if(dataType25 == 'object' && Array.isArray(data21) && data21.length == 1){
data21 = data21[0];
dataType25 = typeof data21;
if((((typeof data21 == "number") && (!(data21 % 1) && !isNaN(data21))) && (isFinite(data21))) && (data21 === null)){
coerced25 = data21;
}
}
if(!(coerced25 !== undefined)){
if(dataType25 === "boolean" || data21 === null
              || (dataType25 === "string" && data21 && data21 == +data21 && !(data21 % 1))){
coerced25 = +data21;
}
else if(data21 === "" || data21 === 0 || data21 === false){
coerced25 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/reactions/" + i1+"/emoji",schemaPath:"node#/definitions/StorySummaryReaction/properties/emoji/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced25 !== undefined){
data21 = coerced25;
if(data17 !== undefined){
data17["emoji"] = coerced25;
}
}
}
var valid14 = _errs94 === errors;
}
else {
var valid14 = true;
}
}
}
}
}
}
else {
validate36.errors = [{instancePath:instancePath+"/reactions/" + i1,schemaPath:"node#/definitions/StorySummaryReaction/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid12 = _errs81 === errors;
if(!valid12){
break;
}
}
}
}
var valid0 = _errs78 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.totalReactions !== undefined){
let data22 = data.totalReactions;
const _errs97 = errors;
if((!(((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22))) && (isFinite(data22)))) && (data22 !== null)){
let dataType26 = typeof data22;
let coerced26 = undefined;
if(dataType26 == 'object' && Array.isArray(data22) && data22.length == 1){
data22 = data22[0];
dataType26 = typeof data22;
if((((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22))) && (isFinite(data22))) && (data22 === null)){
coerced26 = data22;
}
}
if(!(coerced26 !== undefined)){
if(dataType26 === "boolean" || data22 === null
              || (dataType26 === "string" && data22 && data22 == +data22 && !(data22 % 1))){
coerced26 = +data22;
}
else if(data22 === "" || data22 === 0 || data22 === false){
coerced26 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/totalReactions",schemaPath:"#/properties/totalReactions/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced26 !== undefined){
data22 = coerced26;
if(data !== undefined){
data["totalReactions"] = coerced26;
}
}
}
var valid0 = _errs97 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedName !== undefined){
let data23 = data.feedName;
const _errs100 = errors;
if((typeof data23 !== "string") && (data23 !== null)){
let dataType27 = typeof data23;
let coerced27 = undefined;
if(dataType27 == 'object' && Array.isArray(data23) && data23.length == 1){
data23 = data23[0];
dataType27 = typeof data23;
if((typeof data23 === "string") && (data23 === null)){
coerced27 = data23;
}
}
if(!(coerced27 !== undefined)){
if(dataType27 == "number" || dataType27 == "boolean"){
coerced27 = "" + data23;
}
else if(data23 === null){
coerced27 = "";
}
else if(data23 === "" || data23 === 0 || data23 === false){
coerced27 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/feedName",schemaPath:"#/properties/feedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced27 !== undefined){
data23 = coerced27;
if(data !== undefined){
data["feedName"] = coerced27;
}
}
}
var valid0 = _errs100 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.subscriptionReason !== undefined){
let data24 = data.subscriptionReason;
const _errs103 = errors;
if((typeof data24 !== "string") && (data24 !== null)){
let dataType28 = typeof data24;
let coerced28 = undefined;
if(dataType28 == 'object' && Array.isArray(data24) && data24.length == 1){
data24 = data24[0];
dataType28 = typeof data24;
if((typeof data24 === "string") && (data24 === null)){
coerced28 = data24;
}
}
if(!(coerced28 !== undefined)){
if(dataType28 == "number" || dataType28 == "boolean"){
coerced28 = "" + data24;
}
else if(data24 === null){
coerced28 = "";
}
else if(data24 === "" || data24 === 0 || data24 === false){
coerced28 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/subscriptionReason",schemaPath:"#/properties/subscriptionReason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced28 !== undefined){
data24 = coerced28;
if(data !== undefined){
data["subscriptionReason"] = coerced28;
}
}
}
var valid0 = _errs103 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.friendGroup !== undefined){
let data25 = data.friendGroup;
const _errs106 = errors;
const _errs107 = errors;
let valid15 = false;
const _errs108 = errors;
if((!(data25 && typeof data25 == "object" && !Array.isArray(data25))) && (data25 !== null)){
let dataType29 = typeof data25;
let coerced29 = undefined;
if(dataType29 == 'object' && Array.isArray(data25) && data25.length == 1){
data25 = data25[0];
dataType29 = typeof data25;
if((data25 && typeof data25 == "object" && !Array.isArray(data25)) && (data25 === null)){
coerced29 = data25;
}
}
if(!(coerced29 !== undefined)){
if(data25 === "" || data25 === 0 || data25 === false){
coerced29 = null;
}
else {
const err27 = {instancePath:instancePath+"/friendGroup",schemaPath:"#/properties/friendGroup/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(coerced29 !== undefined){
data25 = coerced29;
if(data !== undefined){
data["friendGroup"] = coerced29;
}
}
}
const _errs109 = errors;
if(errors === _errs109){
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
const _errs111 = errors;
for(const key4 in data25){
if(!((key4 === "id") || (key4 === "title"))){
delete data25[key4];
}
}
if(_errs111 === errors){
if(data25.id !== undefined){
let data26 = data25.id;
const _errs112 = errors;
if((typeof data26 !== "string") && (data26 !== null)){
let dataType30 = typeof data26;
let coerced30 = undefined;
if(dataType30 == 'object' && Array.isArray(data26) && data26.length == 1){
data26 = data26[0];
dataType30 = typeof data26;
if((typeof data26 === "string") && (data26 === null)){
coerced30 = data26;
}
}
if(!(coerced30 !== undefined)){
if(dataType30 == "number" || dataType30 == "boolean"){
coerced30 = "" + data26;
}
else if(data26 === null){
coerced30 = "";
}
else if(data26 === "" || data26 === 0 || data26 === false){
coerced30 = null;
}
else {
const err28 = {instancePath:instancePath+"/friendGroup/id",schemaPath:"node#/definitions/StorySummaryFriendGroup/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(coerced30 !== undefined){
data26 = coerced30;
if(data25 !== undefined){
data25["id"] = coerced30;
}
}
}
var valid17 = _errs112 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data25.title !== undefined){
let data27 = data25.title;
const _errs115 = errors;
if((typeof data27 !== "string") && (data27 !== null)){
let dataType31 = typeof data27;
let coerced31 = undefined;
if(dataType31 == 'object' && Array.isArray(data27) && data27.length == 1){
data27 = data27[0];
dataType31 = typeof data27;
if((typeof data27 === "string") && (data27 === null)){
coerced31 = data27;
}
}
if(!(coerced31 !== undefined)){
if(dataType31 == "number" || dataType31 == "boolean"){
coerced31 = "" + data27;
}
else if(data27 === null){
coerced31 = "";
}
else if(data27 === "" || data27 === 0 || data27 === false){
coerced31 = null;
}
else {
const err29 = {instancePath:instancePath+"/friendGroup/title",schemaPath:"node#/definitions/StorySummaryFriendGroup/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(coerced31 !== undefined){
data27 = coerced31;
if(data25 !== undefined){
data25["title"] = coerced31;
}
}
}
var valid17 = _errs115 === errors;
}
else {
var valid17 = true;
}
}
}
}
else {
const err30 = {instancePath:instancePath+"/friendGroup",schemaPath:"node#/definitions/StorySummaryFriendGroup/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
var _valid6 = _errs108 === errors;
valid15 = valid15 || _valid6;
if(!valid15){
const _errs120 = errors;
if(data25 !== null){
let dataType32 = typeof data25;
let coerced32 = undefined;
if(dataType32 == 'object' && Array.isArray(data25) && data25.length == 1){
data25 = data25[0];
dataType32 = typeof data25;
if(data25 === null){
coerced32 = data25;
}
}
if(!(coerced32 !== undefined)){
if(data25 === "" || data25 === 0 || data25 === false){
coerced32 = null;
}
else {
const err31 = {instancePath:instancePath+"/friendGroup",schemaPath:"#/properties/friendGroup/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(coerced32 !== undefined){
data25 = coerced32;
if(data !== undefined){
data["friendGroup"] = coerced32;
}
}
}
var _valid6 = _errs120 === errors;
valid15 = valid15 || _valid6;
}
if(!valid15){
const err32 = {instancePath:instancePath+"/friendGroup",schemaPath:"#/properties/friendGroup/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs107;
if(vErrors !== null){
if(_errs107){
vErrors.length = _errs107;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs106 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.blocked !== undefined){
let data28 = data.blocked;
const _errs122 = errors;
const _errs123 = errors;
let valid18 = false;
const _errs124 = errors;
if((!(data28 && typeof data28 == "object" && !Array.isArray(data28))) && (data28 !== null)){
let dataType33 = typeof data28;
let coerced33 = undefined;
if(dataType33 == 'object' && Array.isArray(data28) && data28.length == 1){
data28 = data28[0];
dataType33 = typeof data28;
if((data28 && typeof data28 == "object" && !Array.isArray(data28)) && (data28 === null)){
coerced33 = data28;
}
}
if(!(coerced33 !== undefined)){
if(data28 === "" || data28 === 0 || data28 === false){
coerced33 = null;
}
else {
const err33 = {instancePath:instancePath+"/blocked",schemaPath:"#/properties/blocked/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(coerced33 !== undefined){
data28 = coerced33;
if(data !== undefined){
data["blocked"] = coerced33;
}
}
}
const _errs125 = errors;
if(errors === _errs125){
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
let missing0;
if((data28.operations === undefined) && (missing0 = "operations")){
const err34 = {instancePath:instancePath+"/blocked",schemaPath:"node#/definitions/StorySummaryBlocked/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
else {
const _errs127 = errors;
for(const key5 in data28){
if(!((key5 === "operations") || (key5 === "period"))){
delete data28[key5];
}
}
if(_errs127 === errors){
if(data28.operations !== undefined){
let data29 = data28.operations;
const _errs128 = errors;
if(!(Array.isArray(data29))){
let dataType34 = typeof data29;
let coerced34 = undefined;
if(dataType34 == 'object' && Array.isArray(data29) && data29.length == 1){
data29 = data29[0];
dataType34 = typeof data29;
if(Array.isArray(data29)){
coerced34 = data29;
}
}
if(!(coerced34 !== undefined)){
if(dataType34 === "string" || dataType34 === "number"
              || dataType34 === "boolean" || data29 === null){
coerced34 = [data29];
}
else {
const err35 = {instancePath:instancePath+"/blocked/operations",schemaPath:"node#/definitions/StorySummaryBlocked/properties/operations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(coerced34 !== undefined){
data29 = coerced34;
if(data28 !== undefined){
data28["operations"] = coerced34;
}
}
}
if(errors === _errs128){
if(Array.isArray(data29)){
var valid21 = true;
const len2 = data29.length;
for(let i2=0; i2<len2; i2++){
let data30 = data29[i2];
const _errs130 = errors;
if(typeof data30 !== "string"){
let dataType35 = typeof data30;
let coerced35 = undefined;
if(dataType35 == 'object' && Array.isArray(data30) && data30.length == 1){
data30 = data30[0];
dataType35 = typeof data30;
if(typeof data30 === "string"){
coerced35 = data30;
}
}
if(!(coerced35 !== undefined)){
if(dataType35 == "number" || dataType35 == "boolean"){
coerced35 = "" + data30;
}
else if(data30 === null){
coerced35 = "";
}
else {
const err36 = {instancePath:instancePath+"/blocked/operations/" + i2,schemaPath:"node#/definitions/StorySummaryBlocked/properties/operations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(coerced35 !== undefined){
data30 = coerced35;
if(data29 !== undefined){
data29[i2] = coerced35;
}
}
}
var valid21 = _errs130 === errors;
if(!valid21){
break;
}
}
}
}
var valid20 = _errs128 === errors;
}
else {
var valid20 = true;
}
if(valid20){
if(data28.period !== undefined){
let data31 = data28.period;
const _errs132 = errors;
if((!(((typeof data31 == "number") && (!(data31 % 1) && !isNaN(data31))) && (isFinite(data31)))) && (data31 !== null)){
let dataType36 = typeof data31;
let coerced36 = undefined;
if(dataType36 == 'object' && Array.isArray(data31) && data31.length == 1){
data31 = data31[0];
dataType36 = typeof data31;
if((((typeof data31 == "number") && (!(data31 % 1) && !isNaN(data31))) && (isFinite(data31))) && (data31 === null)){
coerced36 = data31;
}
}
if(!(coerced36 !== undefined)){
if(dataType36 === "boolean" || data31 === null
              || (dataType36 === "string" && data31 && data31 == +data31 && !(data31 % 1))){
coerced36 = +data31;
}
else if(data31 === "" || data31 === 0 || data31 === false){
coerced36 = null;
}
else {
const err37 = {instancePath:instancePath+"/blocked/period",schemaPath:"node#/definitions/StorySummaryBlocked/properties/period/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(coerced36 !== undefined){
data31 = coerced36;
if(data28 !== undefined){
data28["period"] = coerced36;
}
}
}
var valid20 = _errs132 === errors;
}
else {
var valid20 = true;
}
}
}
}
}
else {
const err38 = {instancePath:instancePath+"/blocked",schemaPath:"node#/definitions/StorySummaryBlocked/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
var _valid7 = _errs124 === errors;
valid18 = valid18 || _valid7;
if(!valid18){
const _errs137 = errors;
if(data28 !== null){
let dataType37 = typeof data28;
let coerced37 = undefined;
if(dataType37 == 'object' && Array.isArray(data28) && data28.length == 1){
data28 = data28[0];
dataType37 = typeof data28;
if(data28 === null){
coerced37 = data28;
}
}
if(!(coerced37 !== undefined)){
if(data28 === "" || data28 === 0 || data28 === false){
coerced37 = null;
}
else {
const err39 = {instancePath:instancePath+"/blocked",schemaPath:"#/properties/blocked/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(coerced37 !== undefined){
data28 = coerced37;
if(data !== undefined){
data["blocked"] = coerced37;
}
}
}
var _valid7 = _errs137 === errors;
valid18 = valid18 || _valid7;
}
if(!valid18){
const err40 = {instancePath:instancePath+"/blocked",schemaPath:"#/properties/blocked/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs123;
if(vErrors !== null){
if(_errs123){
vErrors.length = _errs123;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs122 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sheriff !== undefined){
let data32 = data.sheriff;
const _errs139 = errors;
const _errs140 = errors;
let valid22 = false;
const _errs141 = errors;
if((!(data32 && typeof data32 == "object" && !Array.isArray(data32))) && (data32 !== null)){
let dataType38 = typeof data32;
let coerced38 = undefined;
if(dataType38 == 'object' && Array.isArray(data32) && data32.length == 1){
data32 = data32[0];
dataType38 = typeof data32;
if((data32 && typeof data32 == "object" && !Array.isArray(data32)) && (data32 === null)){
coerced38 = data32;
}
}
if(!(coerced38 !== undefined)){
if(data32 === "" || data32 === 0 || data32 === false){
coerced38 = null;
}
else {
const err41 = {instancePath:instancePath+"/sheriff",schemaPath:"#/properties/sheriff/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(coerced38 !== undefined){
data32 = coerced38;
if(data !== undefined){
data["sheriff"] = coerced38;
}
}
}
const _errs142 = errors;
if(errors === _errs142){
if(data32 && typeof data32 == "object" && !Array.isArray(data32)){
let missing1;
if((data32.sheriffName === undefined) && (missing1 = "sheriffName")){
const err42 = {instancePath:instancePath+"/sheriff",schemaPath:"node#/definitions/StorySummarySheriff/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
else {
const _errs144 = errors;
for(const key6 in data32){
if(!(((key6 === "sheriffName") || (key6 === "orderId")) || (key6 === "complainId"))){
delete data32[key6];
}
}
if(_errs144 === errors){
if(data32.sheriffName !== undefined){
let data33 = data32.sheriffName;
const _errs145 = errors;
if(typeof data33 !== "string"){
let dataType39 = typeof data33;
let coerced39 = undefined;
if(dataType39 == 'object' && Array.isArray(data33) && data33.length == 1){
data33 = data33[0];
dataType39 = typeof data33;
if(typeof data33 === "string"){
coerced39 = data33;
}
}
if(!(coerced39 !== undefined)){
if(dataType39 == "number" || dataType39 == "boolean"){
coerced39 = "" + data33;
}
else if(data33 === null){
coerced39 = "";
}
else {
const err43 = {instancePath:instancePath+"/sheriff/sheriffName",schemaPath:"node#/definitions/StorySummarySheriff/properties/sheriffName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(coerced39 !== undefined){
data33 = coerced39;
if(data32 !== undefined){
data32["sheriffName"] = coerced39;
}
}
}
var valid24 = _errs145 === errors;
}
else {
var valid24 = true;
}
if(valid24){
if(data32.orderId !== undefined){
let data34 = data32.orderId;
const _errs147 = errors;
if((typeof data34 !== "string") && (data34 !== null)){
let dataType40 = typeof data34;
let coerced40 = undefined;
if(dataType40 == 'object' && Array.isArray(data34) && data34.length == 1){
data34 = data34[0];
dataType40 = typeof data34;
if((typeof data34 === "string") && (data34 === null)){
coerced40 = data34;
}
}
if(!(coerced40 !== undefined)){
if(dataType40 == "number" || dataType40 == "boolean"){
coerced40 = "" + data34;
}
else if(data34 === null){
coerced40 = "";
}
else if(data34 === "" || data34 === 0 || data34 === false){
coerced40 = null;
}
else {
const err44 = {instancePath:instancePath+"/sheriff/orderId",schemaPath:"node#/definitions/StorySummarySheriff/properties/orderId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(coerced40 !== undefined){
data34 = coerced40;
if(data32 !== undefined){
data32["orderId"] = coerced40;
}
}
}
var valid24 = _errs147 === errors;
}
else {
var valid24 = true;
}
if(valid24){
if(data32.complainId !== undefined){
let data35 = data32.complainId;
const _errs150 = errors;
if((typeof data35 !== "string") && (data35 !== null)){
let dataType41 = typeof data35;
let coerced41 = undefined;
if(dataType41 == 'object' && Array.isArray(data35) && data35.length == 1){
data35 = data35[0];
dataType41 = typeof data35;
if((typeof data35 === "string") && (data35 === null)){
coerced41 = data35;
}
}
if(!(coerced41 !== undefined)){
if(dataType41 == "number" || dataType41 == "boolean"){
coerced41 = "" + data35;
}
else if(data35 === null){
coerced41 = "";
}
else if(data35 === "" || data35 === 0 || data35 === false){
coerced41 = null;
}
else {
const err45 = {instancePath:instancePath+"/sheriff/complainId",schemaPath:"node#/definitions/StorySummarySheriff/properties/complainId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(coerced41 !== undefined){
data35 = coerced41;
if(data32 !== undefined){
data32["complainId"] = coerced41;
}
}
}
var valid24 = _errs150 === errors;
}
else {
var valid24 = true;
}
}
}
}
}
}
else {
const err46 = {instancePath:instancePath+"/sheriff",schemaPath:"node#/definitions/StorySummarySheriff/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
var _valid8 = _errs141 === errors;
valid22 = valid22 || _valid8;
if(!valid22){
const _errs155 = errors;
if(data32 !== null){
let dataType42 = typeof data32;
let coerced42 = undefined;
if(dataType42 == 'object' && Array.isArray(data32) && data32.length == 1){
data32 = data32[0];
dataType42 = typeof data32;
if(data32 === null){
coerced42 = data32;
}
}
if(!(coerced42 !== undefined)){
if(data32 === "" || data32 === 0 || data32 === false){
coerced42 = null;
}
else {
const err47 = {instancePath:instancePath+"/sheriff",schemaPath:"#/properties/sheriff/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(coerced42 !== undefined){
data32 = coerced42;
if(data !== undefined){
data["sheriff"] = coerced42;
}
}
}
var _valid8 = _errs155 === errors;
valid22 = valid22 || _valid8;
}
if(!valid22){
const err48 = {instancePath:instancePath+"/sheriff",schemaPath:"#/properties/sheriff/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs140;
if(vErrors !== null){
if(_errs140){
vErrors.length = _errs140;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs139 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.description !== undefined){
let data36 = data.description;
const _errs157 = errors;
if((typeof data36 !== "string") && (data36 !== null)){
let dataType43 = typeof data36;
let coerced43 = undefined;
if(dataType43 == 'object' && Array.isArray(data36) && data36.length == 1){
data36 = data36[0];
dataType43 = typeof data36;
if((typeof data36 === "string") && (data36 === null)){
coerced43 = data36;
}
}
if(!(coerced43 !== undefined)){
if(dataType43 == "number" || dataType43 == "boolean"){
coerced43 = "" + data36;
}
else if(data36 === null){
coerced43 = "";
}
else if(data36 === "" || data36 === 0 || data36 === false){
coerced43 = null;
}
else {
validate36.errors = [{instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced43 !== undefined){
data36 = coerced43;
if(data !== undefined){
data["description"] = coerced43;
}
}
}
var valid0 = _errs157 === errors;
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
validate36.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate36.errors = vErrors;
return errors === 0;
}


function validate35(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.storyType === undefined) && (missing0 = "storyType"))) || ((data.feedName === undefined) && (missing0 = "feedName"))) || ((data.publishedAt === undefined) && (missing0 = "publishedAt"))) || ((data.pinned === undefined) && (missing0 = "pinned"))) || ((data.moment === undefined) && (missing0 = "moment"))){
validate35.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func2.call(schema37.properties, key0))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate35.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate35.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.storyType !== undefined){
let data2 = data.storyType;
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
validate35.errors = [{instancePath:instancePath+"/storyType",schemaPath:"#/properties/storyType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["storyType"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedName !== undefined){
let data3 = data.feedName;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate35.errors = [{instancePath:instancePath+"/feedName",schemaPath:"#/properties/feedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["feedName"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.publishedAt !== undefined){
let data4 = data.publishedAt;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4))){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "boolean" || data4 === null
              || (dataType4 === "string" && data4 && data4 == +data4 && !(data4 % 1))){
coerced4 = +data4;
}
else {
validate35.errors = [{instancePath:instancePath+"/publishedAt",schemaPath:"#/properties/publishedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["publishedAt"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pinned !== undefined){
let data5 = data.pinned;
const _errs12 = errors;
if(typeof data5 !== "boolean"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "boolean"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(data5 === "false" || data5 === 0 || data5 === null){
coerced5 = false;
}
else if(data5 === "true" || data5 === 1){
coerced5 = true;
}
else {
validate35.errors = [{instancePath:instancePath+"/pinned",schemaPath:"#/properties/pinned/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["pinned"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.moment !== undefined){
let data6 = data.moment;
const _errs14 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6))){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 === "boolean" || data6 === null
              || (dataType6 === "string" && data6 && data6 == +data6 && !(data6 % 1))){
coerced6 = +data6;
}
else {
validate35.errors = [{instancePath:instancePath+"/moment",schemaPath:"#/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data !== undefined){
data["moment"] = coerced6;
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data7 = data.postingId;
const _errs16 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType7 = typeof data7;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType7 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced7 = data7;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data7;
}
else if(data7 === null){
coerced7 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced7 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced7 !== undefined){
data7 = coerced7;
if(data !== undefined){
data["postingId"] = coerced7;
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.viewed !== undefined){
let data8 = data.viewed;
const _errs19 = errors;
if((typeof data8 !== "boolean") && (data8 !== null)){
let dataType8 = typeof data8;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType8 = typeof data8;
if((typeof data8 === "boolean") && (data8 === null)){
coerced8 = data8;
}
}
if(!(coerced8 !== undefined)){
if(data8 === "false" || data8 === 0 || data8 === null){
coerced8 = false;
}
else if(data8 === "true" || data8 === 1){
coerced8 = true;
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced8 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/viewed",schemaPath:"#/properties/viewed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced8 !== undefined){
data8 = coerced8;
if(data !== undefined){
data["viewed"] = coerced8;
}
}
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.read !== undefined){
let data9 = data.read;
const _errs22 = errors;
if((typeof data9 !== "boolean") && (data9 !== null)){
let dataType9 = typeof data9;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType9 = typeof data9;
if((typeof data9 === "boolean") && (data9 === null)){
coerced9 = data9;
}
}
if(!(coerced9 !== undefined)){
if(data9 === "false" || data9 === 0 || data9 === null){
coerced9 = false;
}
else if(data9 === "true" || data9 === 1){
coerced9 = true;
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced9 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/read",schemaPath:"#/properties/read/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced9 !== undefined){
data9 = coerced9;
if(data !== undefined){
data["read"] = coerced9;
}
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.satisfied !== undefined){
let data10 = data.satisfied;
const _errs25 = errors;
if((typeof data10 !== "boolean") && (data10 !== null)){
let dataType10 = typeof data10;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType10 = typeof data10;
if((typeof data10 === "boolean") && (data10 === null)){
coerced10 = data10;
}
}
if(!(coerced10 !== undefined)){
if(data10 === "false" || data10 === 0 || data10 === null){
coerced10 = false;
}
else if(data10 === "true" || data10 === 1){
coerced10 = true;
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced10 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/satisfied",schemaPath:"#/properties/satisfied/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced10 !== undefined){
data10 = coerced10;
if(data !== undefined){
data["satisfied"] = coerced10;
}
}
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summaryNodeName !== undefined){
let data11 = data.summaryNodeName;
const _errs28 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType11 = typeof data11;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType11 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced11 = data11;
}
}
if(!(coerced11 !== undefined)){
if(dataType11 == "number" || dataType11 == "boolean"){
coerced11 = "" + data11;
}
else if(data11 === null){
coerced11 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced11 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/summaryNodeName",schemaPath:"#/properties/summaryNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced11 !== undefined){
data11 = coerced11;
if(data !== undefined){
data["summaryNodeName"] = coerced11;
}
}
}
var valid0 = _errs28 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summaryFullName !== undefined){
let data12 = data.summaryFullName;
const _errs31 = errors;
if((typeof data12 !== "string") && (data12 !== null)){
let dataType12 = typeof data12;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType12 = typeof data12;
if((typeof data12 === "string") && (data12 === null)){
coerced12 = data12;
}
}
if(!(coerced12 !== undefined)){
if(dataType12 == "number" || dataType12 == "boolean"){
coerced12 = "" + data12;
}
else if(data12 === null){
coerced12 = "";
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced12 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/summaryFullName",schemaPath:"#/properties/summaryFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced12 !== undefined){
data12 = coerced12;
if(data !== undefined){
data["summaryFullName"] = coerced12;
}
}
}
var valid0 = _errs31 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summaryAvatar !== undefined){
let data13 = data.summaryAvatar;
const _errs34 = errors;
const _errs35 = errors;
let valid1 = false;
const _errs36 = errors;
if((!(data13 && typeof data13 == "object" && !Array.isArray(data13))) && (data13 !== null)){
let dataType13 = typeof data13;
let coerced13 = undefined;
if(dataType13 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType13 = typeof data13;
if((data13 && typeof data13 == "object" && !Array.isArray(data13)) && (data13 === null)){
coerced13 = data13;
}
}
if(!(coerced13 !== undefined)){
if(data13 === "" || data13 === 0 || data13 === false){
coerced13 = null;
}
else {
const err0 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"#/properties/summaryAvatar/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced13 !== undefined){
data13 = coerced13;
if(data !== undefined){
data["summaryAvatar"] = coerced13;
}
}
}
const _errs37 = errors;
if(errors === _errs37){
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
let missing1;
if(((data13.mediaId === undefined) && (missing1 = "mediaId")) || ((data13.path === undefined) && (missing1 = "path"))){
const err1 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"node#/definitions/AvatarImage/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
const _errs39 = errors;
for(const key1 in data13){
if(!(((((key1 === "mediaId") || (key1 === "path")) || (key1 === "width")) || (key1 === "height")) || (key1 === "shape"))){
delete data13[key1];
}
}
if(_errs39 === errors){
if(data13.mediaId !== undefined){
let data14 = data13.mediaId;
const _errs40 = errors;
if(typeof data14 !== "string"){
let dataType14 = typeof data14;
let coerced14 = undefined;
if(dataType14 == 'object' && Array.isArray(data14) && data14.length == 1){
data14 = data14[0];
dataType14 = typeof data14;
if(typeof data14 === "string"){
coerced14 = data14;
}
}
if(!(coerced14 !== undefined)){
if(dataType14 == "number" || dataType14 == "boolean"){
coerced14 = "" + data14;
}
else if(data14 === null){
coerced14 = "";
}
else {
const err2 = {instancePath:instancePath+"/summaryAvatar/mediaId",schemaPath:"node#/definitions/AvatarImage/properties/mediaId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(coerced14 !== undefined){
data14 = coerced14;
if(data13 !== undefined){
data13["mediaId"] = coerced14;
}
}
}
var valid3 = _errs40 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data13.path !== undefined){
let data15 = data13.path;
const _errs42 = errors;
if(typeof data15 !== "string"){
let dataType15 = typeof data15;
let coerced15 = undefined;
if(dataType15 == 'object' && Array.isArray(data15) && data15.length == 1){
data15 = data15[0];
dataType15 = typeof data15;
if(typeof data15 === "string"){
coerced15 = data15;
}
}
if(!(coerced15 !== undefined)){
if(dataType15 == "number" || dataType15 == "boolean"){
coerced15 = "" + data15;
}
else if(data15 === null){
coerced15 = "";
}
else {
const err3 = {instancePath:instancePath+"/summaryAvatar/path",schemaPath:"node#/definitions/AvatarImage/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced15 !== undefined){
data15 = coerced15;
if(data13 !== undefined){
data13["path"] = coerced15;
}
}
}
var valid3 = _errs42 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data13.width !== undefined){
let data16 = data13.width;
const _errs44 = errors;
if((!(((typeof data16 == "number") && (!(data16 % 1) && !isNaN(data16))) && (isFinite(data16)))) && (data16 !== null)){
let dataType16 = typeof data16;
let coerced16 = undefined;
if(dataType16 == 'object' && Array.isArray(data16) && data16.length == 1){
data16 = data16[0];
dataType16 = typeof data16;
if((((typeof data16 == "number") && (!(data16 % 1) && !isNaN(data16))) && (isFinite(data16))) && (data16 === null)){
coerced16 = data16;
}
}
if(!(coerced16 !== undefined)){
if(dataType16 === "boolean" || data16 === null
              || (dataType16 === "string" && data16 && data16 == +data16 && !(data16 % 1))){
coerced16 = +data16;
}
else if(data16 === "" || data16 === 0 || data16 === false){
coerced16 = null;
}
else {
const err4 = {instancePath:instancePath+"/summaryAvatar/width",schemaPath:"node#/definitions/AvatarImage/properties/width/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(coerced16 !== undefined){
data16 = coerced16;
if(data13 !== undefined){
data13["width"] = coerced16;
}
}
}
var valid3 = _errs44 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data13.height !== undefined){
let data17 = data13.height;
const _errs47 = errors;
if((!(((typeof data17 == "number") && (!(data17 % 1) && !isNaN(data17))) && (isFinite(data17)))) && (data17 !== null)){
let dataType17 = typeof data17;
let coerced17 = undefined;
if(dataType17 == 'object' && Array.isArray(data17) && data17.length == 1){
data17 = data17[0];
dataType17 = typeof data17;
if((((typeof data17 == "number") && (!(data17 % 1) && !isNaN(data17))) && (isFinite(data17))) && (data17 === null)){
coerced17 = data17;
}
}
if(!(coerced17 !== undefined)){
if(dataType17 === "boolean" || data17 === null
              || (dataType17 === "string" && data17 && data17 == +data17 && !(data17 % 1))){
coerced17 = +data17;
}
else if(data17 === "" || data17 === 0 || data17 === false){
coerced17 = null;
}
else {
const err5 = {instancePath:instancePath+"/summaryAvatar/height",schemaPath:"node#/definitions/AvatarImage/properties/height/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced17 !== undefined){
data17 = coerced17;
if(data13 !== undefined){
data13["height"] = coerced17;
}
}
}
var valid3 = _errs47 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data13.shape !== undefined){
let data18 = data13.shape;
const _errs50 = errors;
if((typeof data18 !== "string") && (data18 !== null)){
let dataType18 = typeof data18;
let coerced18 = undefined;
if(dataType18 == 'object' && Array.isArray(data18) && data18.length == 1){
data18 = data18[0];
dataType18 = typeof data18;
if((typeof data18 === "string") && (data18 === null)){
coerced18 = data18;
}
}
if(!(coerced18 !== undefined)){
if(dataType18 == "number" || dataType18 == "boolean"){
coerced18 = "" + data18;
}
else if(data18 === null){
coerced18 = "";
}
else if(data18 === "" || data18 === 0 || data18 === false){
coerced18 = null;
}
else {
const err6 = {instancePath:instancePath+"/summaryAvatar/shape",schemaPath:"node#/definitions/AvatarImage/properties/shape/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(coerced18 !== undefined){
data18 = coerced18;
if(data13 !== undefined){
data13["shape"] = coerced18;
}
}
}
var valid3 = _errs50 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
}
}
else {
const err7 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"node#/definitions/AvatarImage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var _valid0 = _errs36 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs55 = errors;
if(data13 !== null){
let dataType19 = typeof data13;
let coerced19 = undefined;
if(dataType19 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType19 = typeof data13;
if(data13 === null){
coerced19 = data13;
}
}
if(!(coerced19 !== undefined)){
if(data13 === "" || data13 === 0 || data13 === false){
coerced19 = null;
}
else {
const err8 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"#/properties/summaryAvatar/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(coerced19 !== undefined){
data13 = coerced19;
if(data !== undefined){
data["summaryAvatar"] = coerced19;
}
}
}
var _valid0 = _errs55 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err9 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"#/properties/summaryAvatar/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
validate35.errors = vErrors;
return false;
}
else {
errors = _errs35;
if(vErrors !== null){
if(_errs35){
vErrors.length = _errs35;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs34 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summary !== undefined){
let data19 = data.summary;
const _errs57 = errors;
if((typeof data19 !== "string") && (data19 !== null)){
let dataType20 = typeof data19;
let coerced20 = undefined;
if(dataType20 == 'object' && Array.isArray(data19) && data19.length == 1){
data19 = data19[0];
dataType20 = typeof data19;
if((typeof data19 === "string") && (data19 === null)){
coerced20 = data19;
}
}
if(!(coerced20 !== undefined)){
if(dataType20 == "number" || dataType20 == "boolean"){
coerced20 = "" + data19;
}
else if(data19 === null){
coerced20 = "";
}
else if(data19 === "" || data19 === 0 || data19 === false){
coerced20 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/summary",schemaPath:"#/properties/summary/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced20 !== undefined){
data19 = coerced20;
if(data !== undefined){
data["summary"] = coerced20;
}
}
}
var valid0 = _errs57 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summaryData !== undefined){
let data20 = data.summaryData;
const _errs60 = errors;
const _errs61 = errors;
let valid4 = false;
const _errs62 = errors;
if((!(data20 && typeof data20 == "object" && !Array.isArray(data20))) && (data20 !== null)){
let dataType21 = typeof data20;
let coerced21 = undefined;
if(dataType21 == 'object' && Array.isArray(data20) && data20.length == 1){
data20 = data20[0];
dataType21 = typeof data20;
if((data20 && typeof data20 == "object" && !Array.isArray(data20)) && (data20 === null)){
coerced21 = data20;
}
}
if(!(coerced21 !== undefined)){
if(data20 === "" || data20 === 0 || data20 === false){
coerced21 = null;
}
else {
const err10 = {instancePath:instancePath+"/summaryData",schemaPath:"#/properties/summaryData/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(coerced21 !== undefined){
data20 = coerced21;
if(data !== undefined){
data["summaryData"] = coerced21;
}
}
}
if(!(validate36(data20, {instancePath:instancePath+"/summaryData",parentData:data,parentDataProperty:"summaryData",rootData}))){
vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
errors = vErrors.length;
}
var _valid1 = _errs62 === errors;
valid4 = valid4 || _valid1;
if(!valid4){
const _errs65 = errors;
if(data20 !== null){
let dataType22 = typeof data20;
let coerced22 = undefined;
if(dataType22 == 'object' && Array.isArray(data20) && data20.length == 1){
data20 = data20[0];
dataType22 = typeof data20;
if(data20 === null){
coerced22 = data20;
}
}
if(!(coerced22 !== undefined)){
if(data20 === "" || data20 === 0 || data20 === false){
coerced22 = null;
}
else {
const err11 = {instancePath:instancePath+"/summaryData",schemaPath:"#/properties/summaryData/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(coerced22 !== undefined){
data20 = coerced22;
if(data !== undefined){
data["summaryData"] = coerced22;
}
}
}
var _valid1 = _errs65 === errors;
valid4 = valid4 || _valid1;
}
if(!valid4){
const err12 = {instancePath:instancePath+"/summaryData",schemaPath:"#/properties/summaryData/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
validate35.errors = vErrors;
return false;
}
else {
errors = _errs61;
if(vErrors !== null){
if(_errs61){
vErrors.length = _errs61;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs60 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data21 = data.remoteNodeName;
const _errs67 = errors;
if((typeof data21 !== "string") && (data21 !== null)){
let dataType23 = typeof data21;
let coerced23 = undefined;
if(dataType23 == 'object' && Array.isArray(data21) && data21.length == 1){
data21 = data21[0];
dataType23 = typeof data21;
if((typeof data21 === "string") && (data21 === null)){
coerced23 = data21;
}
}
if(!(coerced23 !== undefined)){
if(dataType23 == "number" || dataType23 == "boolean"){
coerced23 = "" + data21;
}
else if(data21 === null){
coerced23 = "";
}
else if(data21 === "" || data21 === 0 || data21 === false){
coerced23 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced23 !== undefined){
data21 = coerced23;
if(data !== undefined){
data["remoteNodeName"] = coerced23;
}
}
}
var valid0 = _errs67 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteFullName !== undefined){
let data22 = data.remoteFullName;
const _errs70 = errors;
if((typeof data22 !== "string") && (data22 !== null)){
let dataType24 = typeof data22;
let coerced24 = undefined;
if(dataType24 == 'object' && Array.isArray(data22) && data22.length == 1){
data22 = data22[0];
dataType24 = typeof data22;
if((typeof data22 === "string") && (data22 === null)){
coerced24 = data22;
}
}
if(!(coerced24 !== undefined)){
if(dataType24 == "number" || dataType24 == "boolean"){
coerced24 = "" + data22;
}
else if(data22 === null){
coerced24 = "";
}
else if(data22 === "" || data22 === 0 || data22 === false){
coerced24 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/remoteFullName",schemaPath:"#/properties/remoteFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced24 !== undefined){
data22 = coerced24;
if(data !== undefined){
data["remoteFullName"] = coerced24;
}
}
}
var valid0 = _errs70 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data23 = data.remotePostingId;
const _errs73 = errors;
if((typeof data23 !== "string") && (data23 !== null)){
let dataType25 = typeof data23;
let coerced25 = undefined;
if(dataType25 == 'object' && Array.isArray(data23) && data23.length == 1){
data23 = data23[0];
dataType25 = typeof data23;
if((typeof data23 === "string") && (data23 === null)){
coerced25 = data23;
}
}
if(!(coerced25 !== undefined)){
if(dataType25 == "number" || dataType25 == "boolean"){
coerced25 = "" + data23;
}
else if(data23 === null){
coerced25 = "";
}
else if(data23 === "" || data23 === 0 || data23 === false){
coerced25 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced25 !== undefined){
data23 = coerced25;
if(data !== undefined){
data["remotePostingId"] = coerced25;
}
}
}
var valid0 = _errs73 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteCommentId !== undefined){
let data24 = data.remoteCommentId;
const _errs76 = errors;
if((typeof data24 !== "string") && (data24 !== null)){
let dataType26 = typeof data24;
let coerced26 = undefined;
if(dataType26 == 'object' && Array.isArray(data24) && data24.length == 1){
data24 = data24[0];
dataType26 = typeof data24;
if((typeof data24 === "string") && (data24 === null)){
coerced26 = data24;
}
}
if(!(coerced26 !== undefined)){
if(dataType26 == "number" || dataType26 == "boolean"){
coerced26 = "" + data24;
}
else if(data24 === null){
coerced26 = "";
}
else if(data24 === "" || data24 === 0 || data24 === false){
coerced26 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/remoteCommentId",schemaPath:"#/properties/remoteCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced26 !== undefined){
data24 = coerced26;
if(data !== undefined){
data["remoteCommentId"] = coerced26;
}
}
}
var valid0 = _errs76 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.operations !== undefined){
let data25 = data.operations;
const _errs79 = errors;
if((!(data25 && typeof data25 == "object" && !Array.isArray(data25))) && (data25 !== null)){
let dataType27 = typeof data25;
let coerced27 = undefined;
if(dataType27 == 'object' && Array.isArray(data25) && data25.length == 1){
data25 = data25[0];
dataType27 = typeof data25;
if((data25 && typeof data25 == "object" && !Array.isArray(data25)) && (data25 === null)){
coerced27 = data25;
}
}
if(!(coerced27 !== undefined)){
if(data25 === "" || data25 === 0 || data25 === false){
coerced27 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
if(coerced27 !== undefined){
data25 = coerced27;
if(data !== undefined){
data["operations"] = coerced27;
}
}
}
if(errors === _errs79){
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
const _errs82 = errors;
for(const key2 in data25){
if(!((key2 === "edit") || (key2 === "delete"))){
delete data25[key2];
}
}
if(_errs82 === errors){
if(data25.edit !== undefined){
let data26 = data25.edit;
const _errs83 = errors;
if((typeof data26 !== "string") && (data26 !== null)){
let dataType28 = typeof data26;
let coerced28 = undefined;
if(dataType28 == 'object' && Array.isArray(data26) && data26.length == 1){
data26 = data26[0];
dataType28 = typeof data26;
if((typeof data26 === "string") && (data26 === null)){
coerced28 = data26;
}
}
if(!(coerced28 !== undefined)){
if(dataType28 == "number" || dataType28 == "boolean"){
coerced28 = "" + data26;
}
else if(data26 === null){
coerced28 = "";
}
else if(data26 === "" || data26 === 0 || data26 === false){
coerced28 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/operations/edit",schemaPath:"#/properties/operations/properties/edit/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced28 !== undefined){
data26 = coerced28;
if(data25 !== undefined){
data25["edit"] = coerced28;
}
}
}
var valid5 = _errs83 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data25.delete !== undefined){
let data27 = data25.delete;
const _errs86 = errors;
if((typeof data27 !== "string") && (data27 !== null)){
let dataType29 = typeof data27;
let coerced29 = undefined;
if(dataType29 == 'object' && Array.isArray(data27) && data27.length == 1){
data27 = data27[0];
dataType29 = typeof data27;
if((typeof data27 === "string") && (data27 === null)){
coerced29 = data27;
}
}
if(!(coerced29 !== undefined)){
if(dataType29 == "number" || dataType29 == "boolean"){
coerced29 = "" + data27;
}
else if(data27 === null){
coerced29 = "";
}
else if(data27 === "" || data27 === 0 || data27 === false){
coerced29 = null;
}
else {
validate35.errors = [{instancePath:instancePath+"/operations/delete",schemaPath:"#/properties/operations/properties/delete/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced29 !== undefined){
data27 = coerced29;
if(data25 !== undefined){
data25["delete"] = coerced29;
}
}
}
var valid5 = _errs86 === errors;
}
else {
var valid5 = true;
}
}
}
}
}
var valid0 = _errs79 === errors;
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
}
}
}
}
}
}
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
validate35.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate35.errors = vErrors;
return errors === 0;
}

export const StoryDeletedEvent = validate44;
const schema48 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"storyType":{"type":"string"},"feedName":{"type":"string"},"moment":{"type":"integer"},"postingId":{"type":"string","nullable":true}},"additionalProperties":false,"required":["type","id","storyType","feedName","moment"]};

function validate44(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.storyType === undefined) && (missing0 = "storyType"))) || ((data.feedName === undefined) && (missing0 = "feedName"))) || ((data.moment === undefined) && (missing0 = "moment"))){
validate44.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "id")) || (key0 === "storyType")) || (key0 === "feedName")) || (key0 === "moment")) || (key0 === "postingId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate44.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate44.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.storyType !== undefined){
let data2 = data.storyType;
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
validate44.errors = [{instancePath:instancePath+"/storyType",schemaPath:"#/properties/storyType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["storyType"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedName !== undefined){
let data3 = data.feedName;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate44.errors = [{instancePath:instancePath+"/feedName",schemaPath:"#/properties/feedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["feedName"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.moment !== undefined){
let data4 = data.moment;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4))){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "boolean" || data4 === null
              || (dataType4 === "string" && data4 && data4 == +data4 && !(data4 % 1))){
coerced4 = +data4;
}
else {
validate44.errors = [{instancePath:instancePath+"/moment",schemaPath:"#/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["moment"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data5 = data.postingId;
const _errs12 = errors;
if((typeof data5 !== "string") && (data5 !== null)){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if((typeof data5 === "string") && (data5 === null)){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else if(data5 === "" || data5 === 0 || data5 === false){
coerced5 = null;
}
else {
validate44.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["postingId"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
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
validate44.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate44.errors = vErrors;
return errors === 0;
}

export const StoryUpdatedEvent = validate45;
const schema49 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"storyType":{"type":"string"},"feedName":{"type":"string"},"publishedAt":{"type":"integer"},"pinned":{"type":"boolean"},"moment":{"type":"integer"},"postingId":{"type":"string","nullable":true},"viewed":{"type":"boolean","nullable":true},"read":{"type":"boolean","nullable":true},"satisfied":{"type":"boolean","nullable":true},"summaryNodeName":{"type":"string","nullable":true},"summaryFullName":{"type":"string","nullable":true},"summaryAvatar":{"anyOf":[{"$ref":"node#/definitions/AvatarImage","type":"object","nullable":true},{"type":"null"}]},"summary":{"type":"string","nullable":true},"summaryData":{"anyOf":[{"$ref":"node#/definitions/StorySummaryData","type":"object","nullable":true},{"type":"null"}]},"remoteNodeName":{"type":"string","nullable":true},"remoteFullName":{"type":"string","nullable":true},"remotePostingId":{"type":"string","nullable":true},"remoteCommentId":{"type":"string","nullable":true},"operations":{"type":"object","properties":{"edit":{"type":"string","nullable":true},"delete":{"type":"string","nullable":true}},"nullable":true,"additionalProperties":false}},"additionalProperties":false,"required":["type","id","storyType","feedName","publishedAt","pinned","moment"]};

function validate45(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.storyType === undefined) && (missing0 = "storyType"))) || ((data.feedName === undefined) && (missing0 = "feedName"))) || ((data.publishedAt === undefined) && (missing0 = "publishedAt"))) || ((data.pinned === undefined) && (missing0 = "pinned"))) || ((data.moment === undefined) && (missing0 = "moment"))){
validate45.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func2.call(schema49.properties, key0))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate45.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate45.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.storyType !== undefined){
let data2 = data.storyType;
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
validate45.errors = [{instancePath:instancePath+"/storyType",schemaPath:"#/properties/storyType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["storyType"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedName !== undefined){
let data3 = data.feedName;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate45.errors = [{instancePath:instancePath+"/feedName",schemaPath:"#/properties/feedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["feedName"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.publishedAt !== undefined){
let data4 = data.publishedAt;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4))){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "boolean" || data4 === null
              || (dataType4 === "string" && data4 && data4 == +data4 && !(data4 % 1))){
coerced4 = +data4;
}
else {
validate45.errors = [{instancePath:instancePath+"/publishedAt",schemaPath:"#/properties/publishedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["publishedAt"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pinned !== undefined){
let data5 = data.pinned;
const _errs12 = errors;
if(typeof data5 !== "boolean"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "boolean"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(data5 === "false" || data5 === 0 || data5 === null){
coerced5 = false;
}
else if(data5 === "true" || data5 === 1){
coerced5 = true;
}
else {
validate45.errors = [{instancePath:instancePath+"/pinned",schemaPath:"#/properties/pinned/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["pinned"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.moment !== undefined){
let data6 = data.moment;
const _errs14 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6))){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 === "boolean" || data6 === null
              || (dataType6 === "string" && data6 && data6 == +data6 && !(data6 % 1))){
coerced6 = +data6;
}
else {
validate45.errors = [{instancePath:instancePath+"/moment",schemaPath:"#/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data !== undefined){
data["moment"] = coerced6;
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data7 = data.postingId;
const _errs16 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType7 = typeof data7;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType7 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced7 = data7;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data7;
}
else if(data7 === null){
coerced7 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced7 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced7 !== undefined){
data7 = coerced7;
if(data !== undefined){
data["postingId"] = coerced7;
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.viewed !== undefined){
let data8 = data.viewed;
const _errs19 = errors;
if((typeof data8 !== "boolean") && (data8 !== null)){
let dataType8 = typeof data8;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType8 = typeof data8;
if((typeof data8 === "boolean") && (data8 === null)){
coerced8 = data8;
}
}
if(!(coerced8 !== undefined)){
if(data8 === "false" || data8 === 0 || data8 === null){
coerced8 = false;
}
else if(data8 === "true" || data8 === 1){
coerced8 = true;
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced8 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/viewed",schemaPath:"#/properties/viewed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced8 !== undefined){
data8 = coerced8;
if(data !== undefined){
data["viewed"] = coerced8;
}
}
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.read !== undefined){
let data9 = data.read;
const _errs22 = errors;
if((typeof data9 !== "boolean") && (data9 !== null)){
let dataType9 = typeof data9;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType9 = typeof data9;
if((typeof data9 === "boolean") && (data9 === null)){
coerced9 = data9;
}
}
if(!(coerced9 !== undefined)){
if(data9 === "false" || data9 === 0 || data9 === null){
coerced9 = false;
}
else if(data9 === "true" || data9 === 1){
coerced9 = true;
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced9 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/read",schemaPath:"#/properties/read/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced9 !== undefined){
data9 = coerced9;
if(data !== undefined){
data["read"] = coerced9;
}
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.satisfied !== undefined){
let data10 = data.satisfied;
const _errs25 = errors;
if((typeof data10 !== "boolean") && (data10 !== null)){
let dataType10 = typeof data10;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType10 = typeof data10;
if((typeof data10 === "boolean") && (data10 === null)){
coerced10 = data10;
}
}
if(!(coerced10 !== undefined)){
if(data10 === "false" || data10 === 0 || data10 === null){
coerced10 = false;
}
else if(data10 === "true" || data10 === 1){
coerced10 = true;
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced10 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/satisfied",schemaPath:"#/properties/satisfied/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced10 !== undefined){
data10 = coerced10;
if(data !== undefined){
data["satisfied"] = coerced10;
}
}
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summaryNodeName !== undefined){
let data11 = data.summaryNodeName;
const _errs28 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType11 = typeof data11;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType11 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced11 = data11;
}
}
if(!(coerced11 !== undefined)){
if(dataType11 == "number" || dataType11 == "boolean"){
coerced11 = "" + data11;
}
else if(data11 === null){
coerced11 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced11 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/summaryNodeName",schemaPath:"#/properties/summaryNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced11 !== undefined){
data11 = coerced11;
if(data !== undefined){
data["summaryNodeName"] = coerced11;
}
}
}
var valid0 = _errs28 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summaryFullName !== undefined){
let data12 = data.summaryFullName;
const _errs31 = errors;
if((typeof data12 !== "string") && (data12 !== null)){
let dataType12 = typeof data12;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType12 = typeof data12;
if((typeof data12 === "string") && (data12 === null)){
coerced12 = data12;
}
}
if(!(coerced12 !== undefined)){
if(dataType12 == "number" || dataType12 == "boolean"){
coerced12 = "" + data12;
}
else if(data12 === null){
coerced12 = "";
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced12 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/summaryFullName",schemaPath:"#/properties/summaryFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced12 !== undefined){
data12 = coerced12;
if(data !== undefined){
data["summaryFullName"] = coerced12;
}
}
}
var valid0 = _errs31 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summaryAvatar !== undefined){
let data13 = data.summaryAvatar;
const _errs34 = errors;
const _errs35 = errors;
let valid1 = false;
const _errs36 = errors;
if((!(data13 && typeof data13 == "object" && !Array.isArray(data13))) && (data13 !== null)){
let dataType13 = typeof data13;
let coerced13 = undefined;
if(dataType13 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType13 = typeof data13;
if((data13 && typeof data13 == "object" && !Array.isArray(data13)) && (data13 === null)){
coerced13 = data13;
}
}
if(!(coerced13 !== undefined)){
if(data13 === "" || data13 === 0 || data13 === false){
coerced13 = null;
}
else {
const err0 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"#/properties/summaryAvatar/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced13 !== undefined){
data13 = coerced13;
if(data !== undefined){
data["summaryAvatar"] = coerced13;
}
}
}
const _errs37 = errors;
if(errors === _errs37){
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
let missing1;
if(((data13.mediaId === undefined) && (missing1 = "mediaId")) || ((data13.path === undefined) && (missing1 = "path"))){
const err1 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"node#/definitions/AvatarImage/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
const _errs39 = errors;
for(const key1 in data13){
if(!(((((key1 === "mediaId") || (key1 === "path")) || (key1 === "width")) || (key1 === "height")) || (key1 === "shape"))){
delete data13[key1];
}
}
if(_errs39 === errors){
if(data13.mediaId !== undefined){
let data14 = data13.mediaId;
const _errs40 = errors;
if(typeof data14 !== "string"){
let dataType14 = typeof data14;
let coerced14 = undefined;
if(dataType14 == 'object' && Array.isArray(data14) && data14.length == 1){
data14 = data14[0];
dataType14 = typeof data14;
if(typeof data14 === "string"){
coerced14 = data14;
}
}
if(!(coerced14 !== undefined)){
if(dataType14 == "number" || dataType14 == "boolean"){
coerced14 = "" + data14;
}
else if(data14 === null){
coerced14 = "";
}
else {
const err2 = {instancePath:instancePath+"/summaryAvatar/mediaId",schemaPath:"node#/definitions/AvatarImage/properties/mediaId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(coerced14 !== undefined){
data14 = coerced14;
if(data13 !== undefined){
data13["mediaId"] = coerced14;
}
}
}
var valid3 = _errs40 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data13.path !== undefined){
let data15 = data13.path;
const _errs42 = errors;
if(typeof data15 !== "string"){
let dataType15 = typeof data15;
let coerced15 = undefined;
if(dataType15 == 'object' && Array.isArray(data15) && data15.length == 1){
data15 = data15[0];
dataType15 = typeof data15;
if(typeof data15 === "string"){
coerced15 = data15;
}
}
if(!(coerced15 !== undefined)){
if(dataType15 == "number" || dataType15 == "boolean"){
coerced15 = "" + data15;
}
else if(data15 === null){
coerced15 = "";
}
else {
const err3 = {instancePath:instancePath+"/summaryAvatar/path",schemaPath:"node#/definitions/AvatarImage/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced15 !== undefined){
data15 = coerced15;
if(data13 !== undefined){
data13["path"] = coerced15;
}
}
}
var valid3 = _errs42 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data13.width !== undefined){
let data16 = data13.width;
const _errs44 = errors;
if((!(((typeof data16 == "number") && (!(data16 % 1) && !isNaN(data16))) && (isFinite(data16)))) && (data16 !== null)){
let dataType16 = typeof data16;
let coerced16 = undefined;
if(dataType16 == 'object' && Array.isArray(data16) && data16.length == 1){
data16 = data16[0];
dataType16 = typeof data16;
if((((typeof data16 == "number") && (!(data16 % 1) && !isNaN(data16))) && (isFinite(data16))) && (data16 === null)){
coerced16 = data16;
}
}
if(!(coerced16 !== undefined)){
if(dataType16 === "boolean" || data16 === null
              || (dataType16 === "string" && data16 && data16 == +data16 && !(data16 % 1))){
coerced16 = +data16;
}
else if(data16 === "" || data16 === 0 || data16 === false){
coerced16 = null;
}
else {
const err4 = {instancePath:instancePath+"/summaryAvatar/width",schemaPath:"node#/definitions/AvatarImage/properties/width/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(coerced16 !== undefined){
data16 = coerced16;
if(data13 !== undefined){
data13["width"] = coerced16;
}
}
}
var valid3 = _errs44 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data13.height !== undefined){
let data17 = data13.height;
const _errs47 = errors;
if((!(((typeof data17 == "number") && (!(data17 % 1) && !isNaN(data17))) && (isFinite(data17)))) && (data17 !== null)){
let dataType17 = typeof data17;
let coerced17 = undefined;
if(dataType17 == 'object' && Array.isArray(data17) && data17.length == 1){
data17 = data17[0];
dataType17 = typeof data17;
if((((typeof data17 == "number") && (!(data17 % 1) && !isNaN(data17))) && (isFinite(data17))) && (data17 === null)){
coerced17 = data17;
}
}
if(!(coerced17 !== undefined)){
if(dataType17 === "boolean" || data17 === null
              || (dataType17 === "string" && data17 && data17 == +data17 && !(data17 % 1))){
coerced17 = +data17;
}
else if(data17 === "" || data17 === 0 || data17 === false){
coerced17 = null;
}
else {
const err5 = {instancePath:instancePath+"/summaryAvatar/height",schemaPath:"node#/definitions/AvatarImage/properties/height/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced17 !== undefined){
data17 = coerced17;
if(data13 !== undefined){
data13["height"] = coerced17;
}
}
}
var valid3 = _errs47 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data13.shape !== undefined){
let data18 = data13.shape;
const _errs50 = errors;
if((typeof data18 !== "string") && (data18 !== null)){
let dataType18 = typeof data18;
let coerced18 = undefined;
if(dataType18 == 'object' && Array.isArray(data18) && data18.length == 1){
data18 = data18[0];
dataType18 = typeof data18;
if((typeof data18 === "string") && (data18 === null)){
coerced18 = data18;
}
}
if(!(coerced18 !== undefined)){
if(dataType18 == "number" || dataType18 == "boolean"){
coerced18 = "" + data18;
}
else if(data18 === null){
coerced18 = "";
}
else if(data18 === "" || data18 === 0 || data18 === false){
coerced18 = null;
}
else {
const err6 = {instancePath:instancePath+"/summaryAvatar/shape",schemaPath:"node#/definitions/AvatarImage/properties/shape/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(coerced18 !== undefined){
data18 = coerced18;
if(data13 !== undefined){
data13["shape"] = coerced18;
}
}
}
var valid3 = _errs50 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
}
}
else {
const err7 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"node#/definitions/AvatarImage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var _valid0 = _errs36 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs55 = errors;
if(data13 !== null){
let dataType19 = typeof data13;
let coerced19 = undefined;
if(dataType19 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType19 = typeof data13;
if(data13 === null){
coerced19 = data13;
}
}
if(!(coerced19 !== undefined)){
if(data13 === "" || data13 === 0 || data13 === false){
coerced19 = null;
}
else {
const err8 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"#/properties/summaryAvatar/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(coerced19 !== undefined){
data13 = coerced19;
if(data !== undefined){
data["summaryAvatar"] = coerced19;
}
}
}
var _valid0 = _errs55 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err9 = {instancePath:instancePath+"/summaryAvatar",schemaPath:"#/properties/summaryAvatar/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
validate45.errors = vErrors;
return false;
}
else {
errors = _errs35;
if(vErrors !== null){
if(_errs35){
vErrors.length = _errs35;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs34 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summary !== undefined){
let data19 = data.summary;
const _errs57 = errors;
if((typeof data19 !== "string") && (data19 !== null)){
let dataType20 = typeof data19;
let coerced20 = undefined;
if(dataType20 == 'object' && Array.isArray(data19) && data19.length == 1){
data19 = data19[0];
dataType20 = typeof data19;
if((typeof data19 === "string") && (data19 === null)){
coerced20 = data19;
}
}
if(!(coerced20 !== undefined)){
if(dataType20 == "number" || dataType20 == "boolean"){
coerced20 = "" + data19;
}
else if(data19 === null){
coerced20 = "";
}
else if(data19 === "" || data19 === 0 || data19 === false){
coerced20 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/summary",schemaPath:"#/properties/summary/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced20 !== undefined){
data19 = coerced20;
if(data !== undefined){
data["summary"] = coerced20;
}
}
}
var valid0 = _errs57 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.summaryData !== undefined){
let data20 = data.summaryData;
const _errs60 = errors;
const _errs61 = errors;
let valid4 = false;
const _errs62 = errors;
if((!(data20 && typeof data20 == "object" && !Array.isArray(data20))) && (data20 !== null)){
let dataType21 = typeof data20;
let coerced21 = undefined;
if(dataType21 == 'object' && Array.isArray(data20) && data20.length == 1){
data20 = data20[0];
dataType21 = typeof data20;
if((data20 && typeof data20 == "object" && !Array.isArray(data20)) && (data20 === null)){
coerced21 = data20;
}
}
if(!(coerced21 !== undefined)){
if(data20 === "" || data20 === 0 || data20 === false){
coerced21 = null;
}
else {
const err10 = {instancePath:instancePath+"/summaryData",schemaPath:"#/properties/summaryData/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(coerced21 !== undefined){
data20 = coerced21;
if(data !== undefined){
data["summaryData"] = coerced21;
}
}
}
if(!(validate36(data20, {instancePath:instancePath+"/summaryData",parentData:data,parentDataProperty:"summaryData",rootData}))){
vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
errors = vErrors.length;
}
var _valid1 = _errs62 === errors;
valid4 = valid4 || _valid1;
if(!valid4){
const _errs65 = errors;
if(data20 !== null){
let dataType22 = typeof data20;
let coerced22 = undefined;
if(dataType22 == 'object' && Array.isArray(data20) && data20.length == 1){
data20 = data20[0];
dataType22 = typeof data20;
if(data20 === null){
coerced22 = data20;
}
}
if(!(coerced22 !== undefined)){
if(data20 === "" || data20 === 0 || data20 === false){
coerced22 = null;
}
else {
const err11 = {instancePath:instancePath+"/summaryData",schemaPath:"#/properties/summaryData/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(coerced22 !== undefined){
data20 = coerced22;
if(data !== undefined){
data["summaryData"] = coerced22;
}
}
}
var _valid1 = _errs65 === errors;
valid4 = valid4 || _valid1;
}
if(!valid4){
const err12 = {instancePath:instancePath+"/summaryData",schemaPath:"#/properties/summaryData/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
validate45.errors = vErrors;
return false;
}
else {
errors = _errs61;
if(vErrors !== null){
if(_errs61){
vErrors.length = _errs61;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs60 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data21 = data.remoteNodeName;
const _errs67 = errors;
if((typeof data21 !== "string") && (data21 !== null)){
let dataType23 = typeof data21;
let coerced23 = undefined;
if(dataType23 == 'object' && Array.isArray(data21) && data21.length == 1){
data21 = data21[0];
dataType23 = typeof data21;
if((typeof data21 === "string") && (data21 === null)){
coerced23 = data21;
}
}
if(!(coerced23 !== undefined)){
if(dataType23 == "number" || dataType23 == "boolean"){
coerced23 = "" + data21;
}
else if(data21 === null){
coerced23 = "";
}
else if(data21 === "" || data21 === 0 || data21 === false){
coerced23 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced23 !== undefined){
data21 = coerced23;
if(data !== undefined){
data["remoteNodeName"] = coerced23;
}
}
}
var valid0 = _errs67 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteFullName !== undefined){
let data22 = data.remoteFullName;
const _errs70 = errors;
if((typeof data22 !== "string") && (data22 !== null)){
let dataType24 = typeof data22;
let coerced24 = undefined;
if(dataType24 == 'object' && Array.isArray(data22) && data22.length == 1){
data22 = data22[0];
dataType24 = typeof data22;
if((typeof data22 === "string") && (data22 === null)){
coerced24 = data22;
}
}
if(!(coerced24 !== undefined)){
if(dataType24 == "number" || dataType24 == "boolean"){
coerced24 = "" + data22;
}
else if(data22 === null){
coerced24 = "";
}
else if(data22 === "" || data22 === 0 || data22 === false){
coerced24 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/remoteFullName",schemaPath:"#/properties/remoteFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced24 !== undefined){
data22 = coerced24;
if(data !== undefined){
data["remoteFullName"] = coerced24;
}
}
}
var valid0 = _errs70 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data23 = data.remotePostingId;
const _errs73 = errors;
if((typeof data23 !== "string") && (data23 !== null)){
let dataType25 = typeof data23;
let coerced25 = undefined;
if(dataType25 == 'object' && Array.isArray(data23) && data23.length == 1){
data23 = data23[0];
dataType25 = typeof data23;
if((typeof data23 === "string") && (data23 === null)){
coerced25 = data23;
}
}
if(!(coerced25 !== undefined)){
if(dataType25 == "number" || dataType25 == "boolean"){
coerced25 = "" + data23;
}
else if(data23 === null){
coerced25 = "";
}
else if(data23 === "" || data23 === 0 || data23 === false){
coerced25 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced25 !== undefined){
data23 = coerced25;
if(data !== undefined){
data["remotePostingId"] = coerced25;
}
}
}
var valid0 = _errs73 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteCommentId !== undefined){
let data24 = data.remoteCommentId;
const _errs76 = errors;
if((typeof data24 !== "string") && (data24 !== null)){
let dataType26 = typeof data24;
let coerced26 = undefined;
if(dataType26 == 'object' && Array.isArray(data24) && data24.length == 1){
data24 = data24[0];
dataType26 = typeof data24;
if((typeof data24 === "string") && (data24 === null)){
coerced26 = data24;
}
}
if(!(coerced26 !== undefined)){
if(dataType26 == "number" || dataType26 == "boolean"){
coerced26 = "" + data24;
}
else if(data24 === null){
coerced26 = "";
}
else if(data24 === "" || data24 === 0 || data24 === false){
coerced26 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/remoteCommentId",schemaPath:"#/properties/remoteCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced26 !== undefined){
data24 = coerced26;
if(data !== undefined){
data["remoteCommentId"] = coerced26;
}
}
}
var valid0 = _errs76 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.operations !== undefined){
let data25 = data.operations;
const _errs79 = errors;
if((!(data25 && typeof data25 == "object" && !Array.isArray(data25))) && (data25 !== null)){
let dataType27 = typeof data25;
let coerced27 = undefined;
if(dataType27 == 'object' && Array.isArray(data25) && data25.length == 1){
data25 = data25[0];
dataType27 = typeof data25;
if((data25 && typeof data25 == "object" && !Array.isArray(data25)) && (data25 === null)){
coerced27 = data25;
}
}
if(!(coerced27 !== undefined)){
if(data25 === "" || data25 === 0 || data25 === false){
coerced27 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
if(coerced27 !== undefined){
data25 = coerced27;
if(data !== undefined){
data["operations"] = coerced27;
}
}
}
if(errors === _errs79){
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
const _errs82 = errors;
for(const key2 in data25){
if(!((key2 === "edit") || (key2 === "delete"))){
delete data25[key2];
}
}
if(_errs82 === errors){
if(data25.edit !== undefined){
let data26 = data25.edit;
const _errs83 = errors;
if((typeof data26 !== "string") && (data26 !== null)){
let dataType28 = typeof data26;
let coerced28 = undefined;
if(dataType28 == 'object' && Array.isArray(data26) && data26.length == 1){
data26 = data26[0];
dataType28 = typeof data26;
if((typeof data26 === "string") && (data26 === null)){
coerced28 = data26;
}
}
if(!(coerced28 !== undefined)){
if(dataType28 == "number" || dataType28 == "boolean"){
coerced28 = "" + data26;
}
else if(data26 === null){
coerced28 = "";
}
else if(data26 === "" || data26 === 0 || data26 === false){
coerced28 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/operations/edit",schemaPath:"#/properties/operations/properties/edit/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced28 !== undefined){
data26 = coerced28;
if(data25 !== undefined){
data25["edit"] = coerced28;
}
}
}
var valid5 = _errs83 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data25.delete !== undefined){
let data27 = data25.delete;
const _errs86 = errors;
if((typeof data27 !== "string") && (data27 !== null)){
let dataType29 = typeof data27;
let coerced29 = undefined;
if(dataType29 == 'object' && Array.isArray(data27) && data27.length == 1){
data27 = data27[0];
dataType29 = typeof data27;
if((typeof data27 === "string") && (data27 === null)){
coerced29 = data27;
}
}
if(!(coerced29 !== undefined)){
if(dataType29 == "number" || dataType29 == "boolean"){
coerced29 = "" + data27;
}
else if(data27 === null){
coerced29 = "";
}
else if(data27 === "" || data27 === 0 || data27 === false){
coerced29 = null;
}
else {
validate45.errors = [{instancePath:instancePath+"/operations/delete",schemaPath:"#/properties/operations/properties/delete/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced29 !== undefined){
data27 = coerced29;
if(data25 !== undefined){
data25["delete"] = coerced29;
}
}
}
var valid5 = _errs86 === errors;
}
else {
var valid5 = true;
}
}
}
}
}
var valid0 = _errs79 === errors;
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
}
}
}
}
}
}
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
validate45.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate45.errors = vErrors;
return errors === 0;
}

export const FeedStatusUpdatedEvent = validate47;
const schema51 = {"type":"object","properties":{"type":{"type":"string"},"feedName":{"type":"string"},"status":{"$ref":"node#/definitions/FeedStatus"}},"additionalProperties":false,"required":["type","feedName","status"]};
const schema52 = {"type":"object","properties":{"total":{"type":"integer"},"totalPinned":{"type":"integer"},"lastMoment":{"type":"integer","nullable":true},"notViewed":{"type":"integer","nullable":true},"notRead":{"type":"integer","nullable":true},"notViewedMoment":{"type":"integer","nullable":true},"notReadMoment":{"type":"integer","nullable":true}},"required":["total","totalPinned"],"additionalProperties":false};

function validate47(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.feedName === undefined) && (missing0 = "feedName"))) || ((data.status === undefined) && (missing0 = "status"))){
validate47.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "feedName")) || (key0 === "status"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate47.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedName !== undefined){
let data1 = data.feedName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate47.errors = [{instancePath:instancePath+"/feedName",schemaPath:"#/properties/feedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["feedName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data2 = data.status;
const _errs6 = errors;
const _errs7 = errors;
if(errors === _errs7){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
let missing1;
if(((data2.total === undefined) && (missing1 = "total")) || ((data2.totalPinned === undefined) && (missing1 = "totalPinned"))){
validate47.errors = [{instancePath:instancePath+"/status",schemaPath:"node#/definitions/FeedStatus/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs9 = errors;
for(const key1 in data2){
if(!(((((((key1 === "total") || (key1 === "totalPinned")) || (key1 === "lastMoment")) || (key1 === "notViewed")) || (key1 === "notRead")) || (key1 === "notViewedMoment")) || (key1 === "notReadMoment"))){
delete data2[key1];
}
}
if(_errs9 === errors){
if(data2.total !== undefined){
let data3 = data2.total;
const _errs10 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
let dataType2 = typeof data3;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType2 = typeof data3;
if(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3))){
coerced2 = data3;
}
}
if(!(coerced2 !== undefined)){
if(dataType2 === "boolean" || data3 === null
              || (dataType2 === "string" && data3 && data3 == +data3 && !(data3 % 1))){
coerced2 = +data3;
}
else {
validate47.errors = [{instancePath:instancePath+"/status/total",schemaPath:"node#/definitions/FeedStatus/properties/total/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced2 !== undefined){
data3 = coerced2;
if(data2 !== undefined){
data2["total"] = coerced2;
}
}
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.totalPinned !== undefined){
let data4 = data2.totalPinned;
const _errs12 = errors;
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
validate47.errors = [{instancePath:instancePath+"/status/totalPinned",schemaPath:"node#/definitions/FeedStatus/properties/totalPinned/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced3 !== undefined){
data4 = coerced3;
if(data2 !== undefined){
data2["totalPinned"] = coerced3;
}
}
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.lastMoment !== undefined){
let data5 = data2.lastMoment;
const _errs14 = errors;
if((!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))) && (data5 !== null)){
let dataType4 = typeof data5;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType4 = typeof data5;
if((((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5))) && (data5 === null)){
coerced4 = data5;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "boolean" || data5 === null
              || (dataType4 === "string" && data5 && data5 == +data5 && !(data5 % 1))){
coerced4 = +data5;
}
else if(data5 === "" || data5 === 0 || data5 === false){
coerced4 = null;
}
else {
validate47.errors = [{instancePath:instancePath+"/status/lastMoment",schemaPath:"node#/definitions/FeedStatus/properties/lastMoment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced4 !== undefined){
data5 = coerced4;
if(data2 !== undefined){
data2["lastMoment"] = coerced4;
}
}
}
var valid2 = _errs14 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.notViewed !== undefined){
let data6 = data2.notViewed;
const _errs17 = errors;
if((!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))) && (data6 !== null)){
let dataType5 = typeof data6;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType5 = typeof data6;
if((((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6))) && (data6 === null)){
coerced5 = data6;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 === "boolean" || data6 === null
              || (dataType5 === "string" && data6 && data6 == +data6 && !(data6 % 1))){
coerced5 = +data6;
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced5 = null;
}
else {
validate47.errors = [{instancePath:instancePath+"/status/notViewed",schemaPath:"node#/definitions/FeedStatus/properties/notViewed/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced5 !== undefined){
data6 = coerced5;
if(data2 !== undefined){
data2["notViewed"] = coerced5;
}
}
}
var valid2 = _errs17 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.notRead !== undefined){
let data7 = data2.notRead;
const _errs20 = errors;
if((!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))) && (data7 !== null)){
let dataType6 = typeof data7;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType6 = typeof data7;
if((((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7))) && (data7 === null)){
coerced6 = data7;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 === "boolean" || data7 === null
              || (dataType6 === "string" && data7 && data7 == +data7 && !(data7 % 1))){
coerced6 = +data7;
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced6 = null;
}
else {
validate47.errors = [{instancePath:instancePath+"/status/notRead",schemaPath:"node#/definitions/FeedStatus/properties/notRead/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced6 !== undefined){
data7 = coerced6;
if(data2 !== undefined){
data2["notRead"] = coerced6;
}
}
}
var valid2 = _errs20 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.notViewedMoment !== undefined){
let data8 = data2.notViewedMoment;
const _errs23 = errors;
if((!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))) && (data8 !== null)){
let dataType7 = typeof data8;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType7 = typeof data8;
if((((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8))) && (data8 === null)){
coerced7 = data8;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 === "boolean" || data8 === null
              || (dataType7 === "string" && data8 && data8 == +data8 && !(data8 % 1))){
coerced7 = +data8;
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced7 = null;
}
else {
validate47.errors = [{instancePath:instancePath+"/status/notViewedMoment",schemaPath:"node#/definitions/FeedStatus/properties/notViewedMoment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced7 !== undefined){
data8 = coerced7;
if(data2 !== undefined){
data2["notViewedMoment"] = coerced7;
}
}
}
var valid2 = _errs23 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.notReadMoment !== undefined){
let data9 = data2.notReadMoment;
const _errs26 = errors;
if((!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))) && (data9 !== null)){
let dataType8 = typeof data9;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType8 = typeof data9;
if((((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9))) && (data9 === null)){
coerced8 = data9;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 === "boolean" || data9 === null
              || (dataType8 === "string" && data9 && data9 == +data9 && !(data9 % 1))){
coerced8 = +data9;
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced8 = null;
}
else {
validate47.errors = [{instancePath:instancePath+"/status/notReadMoment",schemaPath:"node#/definitions/FeedStatus/properties/notReadMoment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced8 !== undefined){
data9 = coerced8;
if(data2 !== undefined){
data2["notReadMoment"] = coerced8;
}
}
}
var valid2 = _errs26 === errors;
}
else {
var valid2 = true;
}
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
validate47.errors = [{instancePath:instancePath+"/status",schemaPath:"node#/definitions/FeedStatus/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs6 === errors;
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
validate47.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate47.errors = vErrors;
return errors === 0;
}

export const StoriesStatusUpdatedEvent = validate48;
const schema53 = {"type":"object","properties":{"type":{"type":"string"},"feedName":{"type":"string"},"viewed":{"type":"boolean","nullable":true},"read":{"type":"boolean","nullable":true},"before":{"type":"integer"}},"additionalProperties":false,"required":["type","feedName","before"]};

function validate48(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.feedName === undefined) && (missing0 = "feedName"))) || ((data.before === undefined) && (missing0 = "before"))){
validate48.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "type") || (key0 === "feedName")) || (key0 === "viewed")) || (key0 === "read")) || (key0 === "before"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate48.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedName !== undefined){
let data1 = data.feedName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate48.errors = [{instancePath:instancePath+"/feedName",schemaPath:"#/properties/feedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["feedName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.viewed !== undefined){
let data2 = data.viewed;
const _errs6 = errors;
if((typeof data2 !== "boolean") && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((typeof data2 === "boolean") && (data2 === null)){
coerced2 = data2;
}
}
if(!(coerced2 !== undefined)){
if(data2 === "false" || data2 === 0 || data2 === null){
coerced2 = false;
}
else if(data2 === "true" || data2 === 1){
coerced2 = true;
}
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate48.errors = [{instancePath:instancePath+"/viewed",schemaPath:"#/properties/viewed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["viewed"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.read !== undefined){
let data3 = data.read;
const _errs9 = errors;
if((typeof data3 !== "boolean") && (data3 !== null)){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if((typeof data3 === "boolean") && (data3 === null)){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(data3 === "false" || data3 === 0 || data3 === null){
coerced3 = false;
}
else if(data3 === "true" || data3 === 1){
coerced3 = true;
}
else if(data3 === "" || data3 === 0 || data3 === false){
coerced3 = null;
}
else {
validate48.errors = [{instancePath:instancePath+"/read",schemaPath:"#/properties/read/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["read"] = coerced3;
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.before !== undefined){
let data4 = data.before;
const _errs12 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4))){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "boolean" || data4 === null
              || (dataType4 === "string" && data4 && data4 == +data4 && !(data4 % 1))){
coerced4 = +data4;
}
else {
validate48.errors = [{instancePath:instancePath+"/before",schemaPath:"#/properties/before/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["before"] = coerced4;
}
}
}
var valid0 = _errs12 === errors;
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
else {
validate48.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate48.errors = vErrors;
return errors === 0;
}

export const SubscriberAddedEvent = validate49;
const schema54 = {"type":"object","properties":{"type":{"type":"string"},"subscriber":{"$ref":"node#/definitions/SubscriberInfo"}},"additionalProperties":false,"required":["subscriber"]};
const schema55 = {"type":"object","properties":{"id":{"type":"string"},"type":{"type":"string"},"feedName":{"type":"string","nullable":true},"postingId":{"type":"string","nullable":true},"nodeName":{"type":"string"},"contact":{"anyOf":[{"$ref":"node#/definitions/ContactInfo","type":"object","nullable":true},{"type":"null"}]},"createdAt":{"type":"integer"},"operations":{"anyOf":[{"$ref":"node#/definitions/SubscriberOperations","type":"object","nullable":true},{"type":"null"}]},"ownerOperations":{"anyOf":[{"$ref":"node#/definitions/SubscriberOperations","type":"object","nullable":true},{"type":"null"}]},"adminOperations":{"anyOf":[{"$ref":"node#/definitions/SubscriberOperations","type":"object","nullable":true},{"type":"null"}]}},"required":["id","type","nodeName","createdAt"],"additionalProperties":false};
const schema61 = {"type":"object","properties":{"view":{"type":"string","nullable":true},"delete":{"type":"string","nullable":true}},"additionalProperties":false};
const schema56 = {"type":"object","properties":{"nodeName":{"type":"string"},"fullName":{"type":"string","nullable":true},"gender":{"type":"string","nullable":true},"avatar":{"anyOf":[{"$ref":"node#/definitions/AvatarImage","type":"object","nullable":true},{"type":"null"}]},"closeness":{"type":"number"},"hasFeedSubscriber":{"type":"boolean","nullable":true},"hasFeedSubscription":{"type":"boolean","nullable":true},"hasFriend":{"type":"boolean","nullable":true},"hasFriendOf":{"type":"boolean","nullable":true},"hasBlock":{"type":"boolean","nullable":true},"hasBlockBy":{"type":"boolean","nullable":true},"operations":{"anyOf":[{"$ref":"node#/definitions/ContactOperations","type":"object","nullable":true},{"type":"null"}]},"ownerOperations":{"anyOf":[{"$ref":"node#/definitions/ContactOperations","type":"object","nullable":true},{"type":"null"}]},"adminOperations":{"anyOf":[{"$ref":"node#/definitions/ContactOperations","type":"object","nullable":true},{"type":"null"}]}},"required":["nodeName","closeness"],"additionalProperties":false};
const schema58 = {"type":"object","properties":{"viewFeedSubscriber":{"type":"string","nullable":true},"viewFeedSubscription":{"type":"string","nullable":true},"viewFriend":{"type":"string","nullable":true},"viewFriendOf":{"type":"string","nullable":true},"viewBlock":{"type":"string","nullable":true},"viewBlockBy":{"type":"string","nullable":true}},"additionalProperties":false};

function validate51(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.nodeName === undefined) && (missing0 = "nodeName")) || ((data.closeness === undefined) && (missing0 = "closeness"))){
validate51.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func2.call(schema56.properties, key0))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.nodeName !== undefined){
let data0 = data.nodeName;
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
validate51.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["nodeName"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.fullName !== undefined){
let data1 = data.fullName;
const _errs4 = errors;
if((typeof data1 !== "string") && (data1 !== null)){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if((typeof data1 === "string") && (data1 === null)){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else if(data1 === "" || data1 === 0 || data1 === false){
coerced1 = null;
}
else {
validate51.errors = [{instancePath:instancePath+"/fullName",schemaPath:"#/properties/fullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["fullName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.gender !== undefined){
let data2 = data.gender;
const _errs7 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((typeof data2 === "string") && (data2 === null)){
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
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate51.errors = [{instancePath:instancePath+"/gender",schemaPath:"#/properties/gender/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["gender"] = coerced2;
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.avatar !== undefined){
let data3 = data.avatar;
const _errs10 = errors;
const _errs11 = errors;
let valid1 = false;
const _errs12 = errors;
if((!(data3 && typeof data3 == "object" && !Array.isArray(data3))) && (data3 !== null)){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if((data3 && typeof data3 == "object" && !Array.isArray(data3)) && (data3 === null)){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(data3 === "" || data3 === 0 || data3 === false){
coerced3 = null;
}
else {
const err0 = {instancePath:instancePath+"/avatar",schemaPath:"#/properties/avatar/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["avatar"] = coerced3;
}
}
}
const _errs13 = errors;
if(errors === _errs13){
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
let missing1;
if(((data3.mediaId === undefined) && (missing1 = "mediaId")) || ((data3.path === undefined) && (missing1 = "path"))){
const err1 = {instancePath:instancePath+"/avatar",schemaPath:"node#/definitions/AvatarImage/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
const _errs15 = errors;
for(const key1 in data3){
if(!(((((key1 === "mediaId") || (key1 === "path")) || (key1 === "width")) || (key1 === "height")) || (key1 === "shape"))){
delete data3[key1];
}
}
if(_errs15 === errors){
if(data3.mediaId !== undefined){
let data4 = data3.mediaId;
const _errs16 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
const err2 = {instancePath:instancePath+"/avatar/mediaId",schemaPath:"node#/definitions/AvatarImage/properties/mediaId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data3 !== undefined){
data3["mediaId"] = coerced4;
}
}
}
var valid3 = _errs16 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data3.path !== undefined){
let data5 = data3.path;
const _errs18 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
const err3 = {instancePath:instancePath+"/avatar/path",schemaPath:"node#/definitions/AvatarImage/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data3 !== undefined){
data3["path"] = coerced5;
}
}
}
var valid3 = _errs18 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data3.width !== undefined){
let data6 = data3.width;
const _errs20 = errors;
if((!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))) && (data6 !== null)){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if((((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6))) && (data6 === null)){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 === "boolean" || data6 === null
              || (dataType6 === "string" && data6 && data6 == +data6 && !(data6 % 1))){
coerced6 = +data6;
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced6 = null;
}
else {
const err4 = {instancePath:instancePath+"/avatar/width",schemaPath:"node#/definitions/AvatarImage/properties/width/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data3 !== undefined){
data3["width"] = coerced6;
}
}
}
var valid3 = _errs20 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data3.height !== undefined){
let data7 = data3.height;
const _errs23 = errors;
if((!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))) && (data7 !== null)){
let dataType7 = typeof data7;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType7 = typeof data7;
if((((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7))) && (data7 === null)){
coerced7 = data7;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 === "boolean" || data7 === null
              || (dataType7 === "string" && data7 && data7 == +data7 && !(data7 % 1))){
coerced7 = +data7;
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced7 = null;
}
else {
const err5 = {instancePath:instancePath+"/avatar/height",schemaPath:"node#/definitions/AvatarImage/properties/height/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced7 !== undefined){
data7 = coerced7;
if(data3 !== undefined){
data3["height"] = coerced7;
}
}
}
var valid3 = _errs23 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data3.shape !== undefined){
let data8 = data3.shape;
const _errs26 = errors;
if((typeof data8 !== "string") && (data8 !== null)){
let dataType8 = typeof data8;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType8 = typeof data8;
if((typeof data8 === "string") && (data8 === null)){
coerced8 = data8;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 == "number" || dataType8 == "boolean"){
coerced8 = "" + data8;
}
else if(data8 === null){
coerced8 = "";
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced8 = null;
}
else {
const err6 = {instancePath:instancePath+"/avatar/shape",schemaPath:"node#/definitions/AvatarImage/properties/shape/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(coerced8 !== undefined){
data8 = coerced8;
if(data3 !== undefined){
data3["shape"] = coerced8;
}
}
}
var valid3 = _errs26 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
}
}
else {
const err7 = {instancePath:instancePath+"/avatar",schemaPath:"node#/definitions/AvatarImage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var _valid0 = _errs12 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs31 = errors;
if(data3 !== null){
let dataType9 = typeof data3;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType9 = typeof data3;
if(data3 === null){
coerced9 = data3;
}
}
if(!(coerced9 !== undefined)){
if(data3 === "" || data3 === 0 || data3 === false){
coerced9 = null;
}
else {
const err8 = {instancePath:instancePath+"/avatar",schemaPath:"#/properties/avatar/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(coerced9 !== undefined){
data3 = coerced9;
if(data !== undefined){
data["avatar"] = coerced9;
}
}
}
var _valid0 = _errs31 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err9 = {instancePath:instancePath+"/avatar",schemaPath:"#/properties/avatar/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
validate51.errors = vErrors;
return false;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.closeness !== undefined){
let data9 = data.closeness;
const _errs33 = errors;
if(!((typeof data9 == "number") && (isFinite(data9)))){
let dataType10 = typeof data9;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType10 = typeof data9;
if((typeof data9 == "number") && (isFinite(data9))){
coerced10 = data9;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 == "boolean" || data9 === null
              || (dataType10 == "string" && data9 && data9 == +data9)){
coerced10 = +data9;
}
else {
validate51.errors = [{instancePath:instancePath+"/closeness",schemaPath:"#/properties/closeness/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
if(coerced10 !== undefined){
data9 = coerced10;
if(data !== undefined){
data["closeness"] = coerced10;
}
}
}
var valid0 = _errs33 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.hasFeedSubscriber !== undefined){
let data10 = data.hasFeedSubscriber;
const _errs35 = errors;
if((typeof data10 !== "boolean") && (data10 !== null)){
let dataType11 = typeof data10;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType11 = typeof data10;
if((typeof data10 === "boolean") && (data10 === null)){
coerced11 = data10;
}
}
if(!(coerced11 !== undefined)){
if(data10 === "false" || data10 === 0 || data10 === null){
coerced11 = false;
}
else if(data10 === "true" || data10 === 1){
coerced11 = true;
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced11 = null;
}
else {
validate51.errors = [{instancePath:instancePath+"/hasFeedSubscriber",schemaPath:"#/properties/hasFeedSubscriber/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced11 !== undefined){
data10 = coerced11;
if(data !== undefined){
data["hasFeedSubscriber"] = coerced11;
}
}
}
var valid0 = _errs35 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.hasFeedSubscription !== undefined){
let data11 = data.hasFeedSubscription;
const _errs38 = errors;
if((typeof data11 !== "boolean") && (data11 !== null)){
let dataType12 = typeof data11;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType12 = typeof data11;
if((typeof data11 === "boolean") && (data11 === null)){
coerced12 = data11;
}
}
if(!(coerced12 !== undefined)){
if(data11 === "false" || data11 === 0 || data11 === null){
coerced12 = false;
}
else if(data11 === "true" || data11 === 1){
coerced12 = true;
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced12 = null;
}
else {
validate51.errors = [{instancePath:instancePath+"/hasFeedSubscription",schemaPath:"#/properties/hasFeedSubscription/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced12 !== undefined){
data11 = coerced12;
if(data !== undefined){
data["hasFeedSubscription"] = coerced12;
}
}
}
var valid0 = _errs38 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.hasFriend !== undefined){
let data12 = data.hasFriend;
const _errs41 = errors;
if((typeof data12 !== "boolean") && (data12 !== null)){
let dataType13 = typeof data12;
let coerced13 = undefined;
if(dataType13 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType13 = typeof data12;
if((typeof data12 === "boolean") && (data12 === null)){
coerced13 = data12;
}
}
if(!(coerced13 !== undefined)){
if(data12 === "false" || data12 === 0 || data12 === null){
coerced13 = false;
}
else if(data12 === "true" || data12 === 1){
coerced13 = true;
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced13 = null;
}
else {
validate51.errors = [{instancePath:instancePath+"/hasFriend",schemaPath:"#/properties/hasFriend/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced13 !== undefined){
data12 = coerced13;
if(data !== undefined){
data["hasFriend"] = coerced13;
}
}
}
var valid0 = _errs41 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.hasFriendOf !== undefined){
let data13 = data.hasFriendOf;
const _errs44 = errors;
if((typeof data13 !== "boolean") && (data13 !== null)){
let dataType14 = typeof data13;
let coerced14 = undefined;
if(dataType14 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType14 = typeof data13;
if((typeof data13 === "boolean") && (data13 === null)){
coerced14 = data13;
}
}
if(!(coerced14 !== undefined)){
if(data13 === "false" || data13 === 0 || data13 === null){
coerced14 = false;
}
else if(data13 === "true" || data13 === 1){
coerced14 = true;
}
else if(data13 === "" || data13 === 0 || data13 === false){
coerced14 = null;
}
else {
validate51.errors = [{instancePath:instancePath+"/hasFriendOf",schemaPath:"#/properties/hasFriendOf/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced14 !== undefined){
data13 = coerced14;
if(data !== undefined){
data["hasFriendOf"] = coerced14;
}
}
}
var valid0 = _errs44 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.hasBlock !== undefined){
let data14 = data.hasBlock;
const _errs47 = errors;
if((typeof data14 !== "boolean") && (data14 !== null)){
let dataType15 = typeof data14;
let coerced15 = undefined;
if(dataType15 == 'object' && Array.isArray(data14) && data14.length == 1){
data14 = data14[0];
dataType15 = typeof data14;
if((typeof data14 === "boolean") && (data14 === null)){
coerced15 = data14;
}
}
if(!(coerced15 !== undefined)){
if(data14 === "false" || data14 === 0 || data14 === null){
coerced15 = false;
}
else if(data14 === "true" || data14 === 1){
coerced15 = true;
}
else if(data14 === "" || data14 === 0 || data14 === false){
coerced15 = null;
}
else {
validate51.errors = [{instancePath:instancePath+"/hasBlock",schemaPath:"#/properties/hasBlock/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced15 !== undefined){
data14 = coerced15;
if(data !== undefined){
data["hasBlock"] = coerced15;
}
}
}
var valid0 = _errs47 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.hasBlockBy !== undefined){
let data15 = data.hasBlockBy;
const _errs50 = errors;
if((typeof data15 !== "boolean") && (data15 !== null)){
let dataType16 = typeof data15;
let coerced16 = undefined;
if(dataType16 == 'object' && Array.isArray(data15) && data15.length == 1){
data15 = data15[0];
dataType16 = typeof data15;
if((typeof data15 === "boolean") && (data15 === null)){
coerced16 = data15;
}
}
if(!(coerced16 !== undefined)){
if(data15 === "false" || data15 === 0 || data15 === null){
coerced16 = false;
}
else if(data15 === "true" || data15 === 1){
coerced16 = true;
}
else if(data15 === "" || data15 === 0 || data15 === false){
coerced16 = null;
}
else {
validate51.errors = [{instancePath:instancePath+"/hasBlockBy",schemaPath:"#/properties/hasBlockBy/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced16 !== undefined){
data15 = coerced16;
if(data !== undefined){
data["hasBlockBy"] = coerced16;
}
}
}
var valid0 = _errs50 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.operations !== undefined){
let data16 = data.operations;
const _errs53 = errors;
const _errs54 = errors;
let valid4 = false;
const _errs55 = errors;
if((!(data16 && typeof data16 == "object" && !Array.isArray(data16))) && (data16 !== null)){
let dataType17 = typeof data16;
let coerced17 = undefined;
if(dataType17 == 'object' && Array.isArray(data16) && data16.length == 1){
data16 = data16[0];
dataType17 = typeof data16;
if((data16 && typeof data16 == "object" && !Array.isArray(data16)) && (data16 === null)){
coerced17 = data16;
}
}
if(!(coerced17 !== undefined)){
if(data16 === "" || data16 === 0 || data16 === false){
coerced17 = null;
}
else {
const err10 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(coerced17 !== undefined){
data16 = coerced17;
if(data !== undefined){
data["operations"] = coerced17;
}
}
}
const _errs56 = errors;
if(errors === _errs56){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
const _errs58 = errors;
for(const key2 in data16){
if(!((((((key2 === "viewFeedSubscriber") || (key2 === "viewFeedSubscription")) || (key2 === "viewFriend")) || (key2 === "viewFriendOf")) || (key2 === "viewBlock")) || (key2 === "viewBlockBy"))){
delete data16[key2];
}
}
if(_errs58 === errors){
if(data16.viewFeedSubscriber !== undefined){
let data17 = data16.viewFeedSubscriber;
const _errs59 = errors;
if((typeof data17 !== "string") && (data17 !== null)){
let dataType18 = typeof data17;
let coerced18 = undefined;
if(dataType18 == 'object' && Array.isArray(data17) && data17.length == 1){
data17 = data17[0];
dataType18 = typeof data17;
if((typeof data17 === "string") && (data17 === null)){
coerced18 = data17;
}
}
if(!(coerced18 !== undefined)){
if(dataType18 == "number" || dataType18 == "boolean"){
coerced18 = "" + data17;
}
else if(data17 === null){
coerced18 = "";
}
else if(data17 === "" || data17 === 0 || data17 === false){
coerced18 = null;
}
else {
const err11 = {instancePath:instancePath+"/operations/viewFeedSubscriber",schemaPath:"node#/definitions/ContactOperations/properties/viewFeedSubscriber/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(coerced18 !== undefined){
data17 = coerced18;
if(data16 !== undefined){
data16["viewFeedSubscriber"] = coerced18;
}
}
}
var valid6 = _errs59 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data16.viewFeedSubscription !== undefined){
let data18 = data16.viewFeedSubscription;
const _errs62 = errors;
if((typeof data18 !== "string") && (data18 !== null)){
let dataType19 = typeof data18;
let coerced19 = undefined;
if(dataType19 == 'object' && Array.isArray(data18) && data18.length == 1){
data18 = data18[0];
dataType19 = typeof data18;
if((typeof data18 === "string") && (data18 === null)){
coerced19 = data18;
}
}
if(!(coerced19 !== undefined)){
if(dataType19 == "number" || dataType19 == "boolean"){
coerced19 = "" + data18;
}
else if(data18 === null){
coerced19 = "";
}
else if(data18 === "" || data18 === 0 || data18 === false){
coerced19 = null;
}
else {
const err12 = {instancePath:instancePath+"/operations/viewFeedSubscription",schemaPath:"node#/definitions/ContactOperations/properties/viewFeedSubscription/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(coerced19 !== undefined){
data18 = coerced19;
if(data16 !== undefined){
data16["viewFeedSubscription"] = coerced19;
}
}
}
var valid6 = _errs62 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data16.viewFriend !== undefined){
let data19 = data16.viewFriend;
const _errs65 = errors;
if((typeof data19 !== "string") && (data19 !== null)){
let dataType20 = typeof data19;
let coerced20 = undefined;
if(dataType20 == 'object' && Array.isArray(data19) && data19.length == 1){
data19 = data19[0];
dataType20 = typeof data19;
if((typeof data19 === "string") && (data19 === null)){
coerced20 = data19;
}
}
if(!(coerced20 !== undefined)){
if(dataType20 == "number" || dataType20 == "boolean"){
coerced20 = "" + data19;
}
else if(data19 === null){
coerced20 = "";
}
else if(data19 === "" || data19 === 0 || data19 === false){
coerced20 = null;
}
else {
const err13 = {instancePath:instancePath+"/operations/viewFriend",schemaPath:"node#/definitions/ContactOperations/properties/viewFriend/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(coerced20 !== undefined){
data19 = coerced20;
if(data16 !== undefined){
data16["viewFriend"] = coerced20;
}
}
}
var valid6 = _errs65 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data16.viewFriendOf !== undefined){
let data20 = data16.viewFriendOf;
const _errs68 = errors;
if((typeof data20 !== "string") && (data20 !== null)){
let dataType21 = typeof data20;
let coerced21 = undefined;
if(dataType21 == 'object' && Array.isArray(data20) && data20.length == 1){
data20 = data20[0];
dataType21 = typeof data20;
if((typeof data20 === "string") && (data20 === null)){
coerced21 = data20;
}
}
if(!(coerced21 !== undefined)){
if(dataType21 == "number" || dataType21 == "boolean"){
coerced21 = "" + data20;
}
else if(data20 === null){
coerced21 = "";
}
else if(data20 === "" || data20 === 0 || data20 === false){
coerced21 = null;
}
else {
const err14 = {instancePath:instancePath+"/operations/viewFriendOf",schemaPath:"node#/definitions/ContactOperations/properties/viewFriendOf/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(coerced21 !== undefined){
data20 = coerced21;
if(data16 !== undefined){
data16["viewFriendOf"] = coerced21;
}
}
}
var valid6 = _errs68 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data16.viewBlock !== undefined){
let data21 = data16.viewBlock;
const _errs71 = errors;
if((typeof data21 !== "string") && (data21 !== null)){
let dataType22 = typeof data21;
let coerced22 = undefined;
if(dataType22 == 'object' && Array.isArray(data21) && data21.length == 1){
data21 = data21[0];
dataType22 = typeof data21;
if((typeof data21 === "string") && (data21 === null)){
coerced22 = data21;
}
}
if(!(coerced22 !== undefined)){
if(dataType22 == "number" || dataType22 == "boolean"){
coerced22 = "" + data21;
}
else if(data21 === null){
coerced22 = "";
}
else if(data21 === "" || data21 === 0 || data21 === false){
coerced22 = null;
}
else {
const err15 = {instancePath:instancePath+"/operations/viewBlock",schemaPath:"node#/definitions/ContactOperations/properties/viewBlock/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(coerced22 !== undefined){
data21 = coerced22;
if(data16 !== undefined){
data16["viewBlock"] = coerced22;
}
}
}
var valid6 = _errs71 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data16.viewBlockBy !== undefined){
let data22 = data16.viewBlockBy;
const _errs74 = errors;
if((typeof data22 !== "string") && (data22 !== null)){
let dataType23 = typeof data22;
let coerced23 = undefined;
if(dataType23 == 'object' && Array.isArray(data22) && data22.length == 1){
data22 = data22[0];
dataType23 = typeof data22;
if((typeof data22 === "string") && (data22 === null)){
coerced23 = data22;
}
}
if(!(coerced23 !== undefined)){
if(dataType23 == "number" || dataType23 == "boolean"){
coerced23 = "" + data22;
}
else if(data22 === null){
coerced23 = "";
}
else if(data22 === "" || data22 === 0 || data22 === false){
coerced23 = null;
}
else {
const err16 = {instancePath:instancePath+"/operations/viewBlockBy",schemaPath:"node#/definitions/ContactOperations/properties/viewBlockBy/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(coerced23 !== undefined){
data22 = coerced23;
if(data16 !== undefined){
data16["viewBlockBy"] = coerced23;
}
}
}
var valid6 = _errs74 === errors;
}
else {
var valid6 = true;
}
}
}
}
}
}
}
}
else {
const err17 = {instancePath:instancePath+"/operations",schemaPath:"node#/definitions/ContactOperations/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
var _valid1 = _errs55 === errors;
valid4 = valid4 || _valid1;
if(!valid4){
const _errs79 = errors;
if(data16 !== null){
let dataType24 = typeof data16;
let coerced24 = undefined;
if(dataType24 == 'object' && Array.isArray(data16) && data16.length == 1){
data16 = data16[0];
dataType24 = typeof data16;
if(data16 === null){
coerced24 = data16;
}
}
if(!(coerced24 !== undefined)){
if(data16 === "" || data16 === 0 || data16 === false){
coerced24 = null;
}
else {
const err18 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(coerced24 !== undefined){
data16 = coerced24;
if(data !== undefined){
data["operations"] = coerced24;
}
}
}
var _valid1 = _errs79 === errors;
valid4 = valid4 || _valid1;
}
if(!valid4){
const err19 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
validate51.errors = vErrors;
return false;
}
else {
errors = _errs54;
if(vErrors !== null){
if(_errs54){
vErrors.length = _errs54;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs53 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ownerOperations !== undefined){
let data23 = data.ownerOperations;
const _errs81 = errors;
const _errs82 = errors;
let valid7 = false;
const _errs83 = errors;
if((!(data23 && typeof data23 == "object" && !Array.isArray(data23))) && (data23 !== null)){
let dataType25 = typeof data23;
let coerced25 = undefined;
if(dataType25 == 'object' && Array.isArray(data23) && data23.length == 1){
data23 = data23[0];
dataType25 = typeof data23;
if((data23 && typeof data23 == "object" && !Array.isArray(data23)) && (data23 === null)){
coerced25 = data23;
}
}
if(!(coerced25 !== undefined)){
if(data23 === "" || data23 === 0 || data23 === false){
coerced25 = null;
}
else {
const err20 = {instancePath:instancePath+"/ownerOperations",schemaPath:"#/properties/ownerOperations/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(coerced25 !== undefined){
data23 = coerced25;
if(data !== undefined){
data["ownerOperations"] = coerced25;
}
}
}
const _errs84 = errors;
if(errors === _errs84){
if(data23 && typeof data23 == "object" && !Array.isArray(data23)){
const _errs86 = errors;
for(const key3 in data23){
if(!((((((key3 === "viewFeedSubscriber") || (key3 === "viewFeedSubscription")) || (key3 === "viewFriend")) || (key3 === "viewFriendOf")) || (key3 === "viewBlock")) || (key3 === "viewBlockBy"))){
delete data23[key3];
}
}
if(_errs86 === errors){
if(data23.viewFeedSubscriber !== undefined){
let data24 = data23.viewFeedSubscriber;
const _errs87 = errors;
if((typeof data24 !== "string") && (data24 !== null)){
let dataType26 = typeof data24;
let coerced26 = undefined;
if(dataType26 == 'object' && Array.isArray(data24) && data24.length == 1){
data24 = data24[0];
dataType26 = typeof data24;
if((typeof data24 === "string") && (data24 === null)){
coerced26 = data24;
}
}
if(!(coerced26 !== undefined)){
if(dataType26 == "number" || dataType26 == "boolean"){
coerced26 = "" + data24;
}
else if(data24 === null){
coerced26 = "";
}
else if(data24 === "" || data24 === 0 || data24 === false){
coerced26 = null;
}
else {
const err21 = {instancePath:instancePath+"/ownerOperations/viewFeedSubscriber",schemaPath:"node#/definitions/ContactOperations/properties/viewFeedSubscriber/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(coerced26 !== undefined){
data24 = coerced26;
if(data23 !== undefined){
data23["viewFeedSubscriber"] = coerced26;
}
}
}
var valid9 = _errs87 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data23.viewFeedSubscription !== undefined){
let data25 = data23.viewFeedSubscription;
const _errs90 = errors;
if((typeof data25 !== "string") && (data25 !== null)){
let dataType27 = typeof data25;
let coerced27 = undefined;
if(dataType27 == 'object' && Array.isArray(data25) && data25.length == 1){
data25 = data25[0];
dataType27 = typeof data25;
if((typeof data25 === "string") && (data25 === null)){
coerced27 = data25;
}
}
if(!(coerced27 !== undefined)){
if(dataType27 == "number" || dataType27 == "boolean"){
coerced27 = "" + data25;
}
else if(data25 === null){
coerced27 = "";
}
else if(data25 === "" || data25 === 0 || data25 === false){
coerced27 = null;
}
else {
const err22 = {instancePath:instancePath+"/ownerOperations/viewFeedSubscription",schemaPath:"node#/definitions/ContactOperations/properties/viewFeedSubscription/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(coerced27 !== undefined){
data25 = coerced27;
if(data23 !== undefined){
data23["viewFeedSubscription"] = coerced27;
}
}
}
var valid9 = _errs90 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data23.viewFriend !== undefined){
let data26 = data23.viewFriend;
const _errs93 = errors;
if((typeof data26 !== "string") && (data26 !== null)){
let dataType28 = typeof data26;
let coerced28 = undefined;
if(dataType28 == 'object' && Array.isArray(data26) && data26.length == 1){
data26 = data26[0];
dataType28 = typeof data26;
if((typeof data26 === "string") && (data26 === null)){
coerced28 = data26;
}
}
if(!(coerced28 !== undefined)){
if(dataType28 == "number" || dataType28 == "boolean"){
coerced28 = "" + data26;
}
else if(data26 === null){
coerced28 = "";
}
else if(data26 === "" || data26 === 0 || data26 === false){
coerced28 = null;
}
else {
const err23 = {instancePath:instancePath+"/ownerOperations/viewFriend",schemaPath:"node#/definitions/ContactOperations/properties/viewFriend/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(coerced28 !== undefined){
data26 = coerced28;
if(data23 !== undefined){
data23["viewFriend"] = coerced28;
}
}
}
var valid9 = _errs93 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data23.viewFriendOf !== undefined){
let data27 = data23.viewFriendOf;
const _errs96 = errors;
if((typeof data27 !== "string") && (data27 !== null)){
let dataType29 = typeof data27;
let coerced29 = undefined;
if(dataType29 == 'object' && Array.isArray(data27) && data27.length == 1){
data27 = data27[0];
dataType29 = typeof data27;
if((typeof data27 === "string") && (data27 === null)){
coerced29 = data27;
}
}
if(!(coerced29 !== undefined)){
if(dataType29 == "number" || dataType29 == "boolean"){
coerced29 = "" + data27;
}
else if(data27 === null){
coerced29 = "";
}
else if(data27 === "" || data27 === 0 || data27 === false){
coerced29 = null;
}
else {
const err24 = {instancePath:instancePath+"/ownerOperations/viewFriendOf",schemaPath:"node#/definitions/ContactOperations/properties/viewFriendOf/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(coerced29 !== undefined){
data27 = coerced29;
if(data23 !== undefined){
data23["viewFriendOf"] = coerced29;
}
}
}
var valid9 = _errs96 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data23.viewBlock !== undefined){
let data28 = data23.viewBlock;
const _errs99 = errors;
if((typeof data28 !== "string") && (data28 !== null)){
let dataType30 = typeof data28;
let coerced30 = undefined;
if(dataType30 == 'object' && Array.isArray(data28) && data28.length == 1){
data28 = data28[0];
dataType30 = typeof data28;
if((typeof data28 === "string") && (data28 === null)){
coerced30 = data28;
}
}
if(!(coerced30 !== undefined)){
if(dataType30 == "number" || dataType30 == "boolean"){
coerced30 = "" + data28;
}
else if(data28 === null){
coerced30 = "";
}
else if(data28 === "" || data28 === 0 || data28 === false){
coerced30 = null;
}
else {
const err25 = {instancePath:instancePath+"/ownerOperations/viewBlock",schemaPath:"node#/definitions/ContactOperations/properties/viewBlock/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(coerced30 !== undefined){
data28 = coerced30;
if(data23 !== undefined){
data23["viewBlock"] = coerced30;
}
}
}
var valid9 = _errs99 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data23.viewBlockBy !== undefined){
let data29 = data23.viewBlockBy;
const _errs102 = errors;
if((typeof data29 !== "string") && (data29 !== null)){
let dataType31 = typeof data29;
let coerced31 = undefined;
if(dataType31 == 'object' && Array.isArray(data29) && data29.length == 1){
data29 = data29[0];
dataType31 = typeof data29;
if((typeof data29 === "string") && (data29 === null)){
coerced31 = data29;
}
}
if(!(coerced31 !== undefined)){
if(dataType31 == "number" || dataType31 == "boolean"){
coerced31 = "" + data29;
}
else if(data29 === null){
coerced31 = "";
}
else if(data29 === "" || data29 === 0 || data29 === false){
coerced31 = null;
}
else {
const err26 = {instancePath:instancePath+"/ownerOperations/viewBlockBy",schemaPath:"node#/definitions/ContactOperations/properties/viewBlockBy/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(coerced31 !== undefined){
data29 = coerced31;
if(data23 !== undefined){
data23["viewBlockBy"] = coerced31;
}
}
}
var valid9 = _errs102 === errors;
}
else {
var valid9 = true;
}
}
}
}
}
}
}
}
else {
const err27 = {instancePath:instancePath+"/ownerOperations",schemaPath:"node#/definitions/ContactOperations/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
var _valid2 = _errs83 === errors;
valid7 = valid7 || _valid2;
if(!valid7){
const _errs107 = errors;
if(data23 !== null){
let dataType32 = typeof data23;
let coerced32 = undefined;
if(dataType32 == 'object' && Array.isArray(data23) && data23.length == 1){
data23 = data23[0];
dataType32 = typeof data23;
if(data23 === null){
coerced32 = data23;
}
}
if(!(coerced32 !== undefined)){
if(data23 === "" || data23 === 0 || data23 === false){
coerced32 = null;
}
else {
const err28 = {instancePath:instancePath+"/ownerOperations",schemaPath:"#/properties/ownerOperations/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(coerced32 !== undefined){
data23 = coerced32;
if(data !== undefined){
data["ownerOperations"] = coerced32;
}
}
}
var _valid2 = _errs107 === errors;
valid7 = valid7 || _valid2;
}
if(!valid7){
const err29 = {instancePath:instancePath+"/ownerOperations",schemaPath:"#/properties/ownerOperations/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
validate51.errors = vErrors;
return false;
}
else {
errors = _errs82;
if(vErrors !== null){
if(_errs82){
vErrors.length = _errs82;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs81 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.adminOperations !== undefined){
let data30 = data.adminOperations;
const _errs109 = errors;
const _errs110 = errors;
let valid10 = false;
const _errs111 = errors;
if((!(data30 && typeof data30 == "object" && !Array.isArray(data30))) && (data30 !== null)){
let dataType33 = typeof data30;
let coerced33 = undefined;
if(dataType33 == 'object' && Array.isArray(data30) && data30.length == 1){
data30 = data30[0];
dataType33 = typeof data30;
if((data30 && typeof data30 == "object" && !Array.isArray(data30)) && (data30 === null)){
coerced33 = data30;
}
}
if(!(coerced33 !== undefined)){
if(data30 === "" || data30 === 0 || data30 === false){
coerced33 = null;
}
else {
const err30 = {instancePath:instancePath+"/adminOperations",schemaPath:"#/properties/adminOperations/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(coerced33 !== undefined){
data30 = coerced33;
if(data !== undefined){
data["adminOperations"] = coerced33;
}
}
}
const _errs112 = errors;
if(errors === _errs112){
if(data30 && typeof data30 == "object" && !Array.isArray(data30)){
const _errs114 = errors;
for(const key4 in data30){
if(!((((((key4 === "viewFeedSubscriber") || (key4 === "viewFeedSubscription")) || (key4 === "viewFriend")) || (key4 === "viewFriendOf")) || (key4 === "viewBlock")) || (key4 === "viewBlockBy"))){
delete data30[key4];
}
}
if(_errs114 === errors){
if(data30.viewFeedSubscriber !== undefined){
let data31 = data30.viewFeedSubscriber;
const _errs115 = errors;
if((typeof data31 !== "string") && (data31 !== null)){
let dataType34 = typeof data31;
let coerced34 = undefined;
if(dataType34 == 'object' && Array.isArray(data31) && data31.length == 1){
data31 = data31[0];
dataType34 = typeof data31;
if((typeof data31 === "string") && (data31 === null)){
coerced34 = data31;
}
}
if(!(coerced34 !== undefined)){
if(dataType34 == "number" || dataType34 == "boolean"){
coerced34 = "" + data31;
}
else if(data31 === null){
coerced34 = "";
}
else if(data31 === "" || data31 === 0 || data31 === false){
coerced34 = null;
}
else {
const err31 = {instancePath:instancePath+"/adminOperations/viewFeedSubscriber",schemaPath:"node#/definitions/ContactOperations/properties/viewFeedSubscriber/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(coerced34 !== undefined){
data31 = coerced34;
if(data30 !== undefined){
data30["viewFeedSubscriber"] = coerced34;
}
}
}
var valid12 = _errs115 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data30.viewFeedSubscription !== undefined){
let data32 = data30.viewFeedSubscription;
const _errs118 = errors;
if((typeof data32 !== "string") && (data32 !== null)){
let dataType35 = typeof data32;
let coerced35 = undefined;
if(dataType35 == 'object' && Array.isArray(data32) && data32.length == 1){
data32 = data32[0];
dataType35 = typeof data32;
if((typeof data32 === "string") && (data32 === null)){
coerced35 = data32;
}
}
if(!(coerced35 !== undefined)){
if(dataType35 == "number" || dataType35 == "boolean"){
coerced35 = "" + data32;
}
else if(data32 === null){
coerced35 = "";
}
else if(data32 === "" || data32 === 0 || data32 === false){
coerced35 = null;
}
else {
const err32 = {instancePath:instancePath+"/adminOperations/viewFeedSubscription",schemaPath:"node#/definitions/ContactOperations/properties/viewFeedSubscription/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(coerced35 !== undefined){
data32 = coerced35;
if(data30 !== undefined){
data30["viewFeedSubscription"] = coerced35;
}
}
}
var valid12 = _errs118 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data30.viewFriend !== undefined){
let data33 = data30.viewFriend;
const _errs121 = errors;
if((typeof data33 !== "string") && (data33 !== null)){
let dataType36 = typeof data33;
let coerced36 = undefined;
if(dataType36 == 'object' && Array.isArray(data33) && data33.length == 1){
data33 = data33[0];
dataType36 = typeof data33;
if((typeof data33 === "string") && (data33 === null)){
coerced36 = data33;
}
}
if(!(coerced36 !== undefined)){
if(dataType36 == "number" || dataType36 == "boolean"){
coerced36 = "" + data33;
}
else if(data33 === null){
coerced36 = "";
}
else if(data33 === "" || data33 === 0 || data33 === false){
coerced36 = null;
}
else {
const err33 = {instancePath:instancePath+"/adminOperations/viewFriend",schemaPath:"node#/definitions/ContactOperations/properties/viewFriend/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(coerced36 !== undefined){
data33 = coerced36;
if(data30 !== undefined){
data30["viewFriend"] = coerced36;
}
}
}
var valid12 = _errs121 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data30.viewFriendOf !== undefined){
let data34 = data30.viewFriendOf;
const _errs124 = errors;
if((typeof data34 !== "string") && (data34 !== null)){
let dataType37 = typeof data34;
let coerced37 = undefined;
if(dataType37 == 'object' && Array.isArray(data34) && data34.length == 1){
data34 = data34[0];
dataType37 = typeof data34;
if((typeof data34 === "string") && (data34 === null)){
coerced37 = data34;
}
}
if(!(coerced37 !== undefined)){
if(dataType37 == "number" || dataType37 == "boolean"){
coerced37 = "" + data34;
}
else if(data34 === null){
coerced37 = "";
}
else if(data34 === "" || data34 === 0 || data34 === false){
coerced37 = null;
}
else {
const err34 = {instancePath:instancePath+"/adminOperations/viewFriendOf",schemaPath:"node#/definitions/ContactOperations/properties/viewFriendOf/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(coerced37 !== undefined){
data34 = coerced37;
if(data30 !== undefined){
data30["viewFriendOf"] = coerced37;
}
}
}
var valid12 = _errs124 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data30.viewBlock !== undefined){
let data35 = data30.viewBlock;
const _errs127 = errors;
if((typeof data35 !== "string") && (data35 !== null)){
let dataType38 = typeof data35;
let coerced38 = undefined;
if(dataType38 == 'object' && Array.isArray(data35) && data35.length == 1){
data35 = data35[0];
dataType38 = typeof data35;
if((typeof data35 === "string") && (data35 === null)){
coerced38 = data35;
}
}
if(!(coerced38 !== undefined)){
if(dataType38 == "number" || dataType38 == "boolean"){
coerced38 = "" + data35;
}
else if(data35 === null){
coerced38 = "";
}
else if(data35 === "" || data35 === 0 || data35 === false){
coerced38 = null;
}
else {
const err35 = {instancePath:instancePath+"/adminOperations/viewBlock",schemaPath:"node#/definitions/ContactOperations/properties/viewBlock/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(coerced38 !== undefined){
data35 = coerced38;
if(data30 !== undefined){
data30["viewBlock"] = coerced38;
}
}
}
var valid12 = _errs127 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data30.viewBlockBy !== undefined){
let data36 = data30.viewBlockBy;
const _errs130 = errors;
if((typeof data36 !== "string") && (data36 !== null)){
let dataType39 = typeof data36;
let coerced39 = undefined;
if(dataType39 == 'object' && Array.isArray(data36) && data36.length == 1){
data36 = data36[0];
dataType39 = typeof data36;
if((typeof data36 === "string") && (data36 === null)){
coerced39 = data36;
}
}
if(!(coerced39 !== undefined)){
if(dataType39 == "number" || dataType39 == "boolean"){
coerced39 = "" + data36;
}
else if(data36 === null){
coerced39 = "";
}
else if(data36 === "" || data36 === 0 || data36 === false){
coerced39 = null;
}
else {
const err36 = {instancePath:instancePath+"/adminOperations/viewBlockBy",schemaPath:"node#/definitions/ContactOperations/properties/viewBlockBy/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(coerced39 !== undefined){
data36 = coerced39;
if(data30 !== undefined){
data30["viewBlockBy"] = coerced39;
}
}
}
var valid12 = _errs130 === errors;
}
else {
var valid12 = true;
}
}
}
}
}
}
}
}
else {
const err37 = {instancePath:instancePath+"/adminOperations",schemaPath:"node#/definitions/ContactOperations/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
var _valid3 = _errs111 === errors;
valid10 = valid10 || _valid3;
if(!valid10){
const _errs135 = errors;
if(data30 !== null){
let dataType40 = typeof data30;
let coerced40 = undefined;
if(dataType40 == 'object' && Array.isArray(data30) && data30.length == 1){
data30 = data30[0];
dataType40 = typeof data30;
if(data30 === null){
coerced40 = data30;
}
}
if(!(coerced40 !== undefined)){
if(data30 === "" || data30 === 0 || data30 === false){
coerced40 = null;
}
else {
const err38 = {instancePath:instancePath+"/adminOperations",schemaPath:"#/properties/adminOperations/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(coerced40 !== undefined){
data30 = coerced40;
if(data !== undefined){
data["adminOperations"] = coerced40;
}
}
}
var _valid3 = _errs135 === errors;
valid10 = valid10 || _valid3;
}
if(!valid10){
const err39 = {instancePath:instancePath+"/adminOperations",schemaPath:"#/properties/adminOperations/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
validate51.errors = vErrors;
return false;
}
else {
errors = _errs110;
if(vErrors !== null){
if(_errs110){
vErrors.length = _errs110;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs109 === errors;
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
}
}
}
}
}
}
}
}
else {
validate51.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate51.errors = vErrors;
return errors === 0;
}


function validate50(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.id === undefined) && (missing0 = "id")) || ((data.type === undefined) && (missing0 = "type"))) || ((data.nodeName === undefined) && (missing0 = "nodeName"))) || ((data.createdAt === undefined) && (missing0 = "createdAt"))){
validate50.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func2.call(schema55.properties, key0))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
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
validate50.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["id"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data1 = data.type;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate50.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["type"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedName !== undefined){
let data2 = data.feedName;
const _errs6 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((typeof data2 === "string") && (data2 === null)){
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
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate50.errors = [{instancePath:instancePath+"/feedName",schemaPath:"#/properties/feedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["feedName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data3 = data.postingId;
const _errs9 = errors;
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
validate50.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["postingId"] = coerced3;
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeName !== undefined){
let data4 = data.nodeName;
const _errs12 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate50.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["nodeName"] = coerced4;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contact !== undefined){
let data5 = data.contact;
const _errs14 = errors;
const _errs15 = errors;
let valid1 = false;
const _errs16 = errors;
if((!(data5 && typeof data5 == "object" && !Array.isArray(data5))) && (data5 !== null)){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if((data5 && typeof data5 == "object" && !Array.isArray(data5)) && (data5 === null)){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(data5 === "" || data5 === 0 || data5 === false){
coerced5 = null;
}
else {
const err0 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["contact"] = coerced5;
}
}
}
if(!(validate51(data5, {instancePath:instancePath+"/contact",parentData:data,parentDataProperty:"contact",rootData}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
var _valid0 = _errs16 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs19 = errors;
if(data5 !== null){
let dataType6 = typeof data5;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType6 = typeof data5;
if(data5 === null){
coerced6 = data5;
}
}
if(!(coerced6 !== undefined)){
if(data5 === "" || data5 === 0 || data5 === false){
coerced6 = null;
}
else {
const err1 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(coerced6 !== undefined){
data5 = coerced6;
if(data !== undefined){
data["contact"] = coerced6;
}
}
}
var _valid0 = _errs19 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err2 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate50.errors = vErrors;
return false;
}
else {
errors = _errs15;
if(vErrors !== null){
if(_errs15){
vErrors.length = _errs15;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.createdAt !== undefined){
let data6 = data.createdAt;
const _errs21 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
let dataType7 = typeof data6;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType7 = typeof data6;
if(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6))){
coerced7 = data6;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 === "boolean" || data6 === null
              || (dataType7 === "string" && data6 && data6 == +data6 && !(data6 % 1))){
coerced7 = +data6;
}
else {
validate50.errors = [{instancePath:instancePath+"/createdAt",schemaPath:"#/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced7 !== undefined){
data6 = coerced7;
if(data !== undefined){
data["createdAt"] = coerced7;
}
}
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.operations !== undefined){
let data7 = data.operations;
const _errs23 = errors;
const _errs24 = errors;
let valid2 = false;
const _errs25 = errors;
if((!(data7 && typeof data7 == "object" && !Array.isArray(data7))) && (data7 !== null)){
let dataType8 = typeof data7;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType8 = typeof data7;
if((data7 && typeof data7 == "object" && !Array.isArray(data7)) && (data7 === null)){
coerced8 = data7;
}
}
if(!(coerced8 !== undefined)){
if(data7 === "" || data7 === 0 || data7 === false){
coerced8 = null;
}
else {
const err3 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced8 !== undefined){
data7 = coerced8;
if(data !== undefined){
data["operations"] = coerced8;
}
}
}
const _errs26 = errors;
if(errors === _errs26){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
const _errs28 = errors;
for(const key1 in data7){
if(!((key1 === "view") || (key1 === "delete"))){
delete data7[key1];
}
}
if(_errs28 === errors){
if(data7.view !== undefined){
let data8 = data7.view;
const _errs29 = errors;
if((typeof data8 !== "string") && (data8 !== null)){
let dataType9 = typeof data8;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType9 = typeof data8;
if((typeof data8 === "string") && (data8 === null)){
coerced9 = data8;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 == "number" || dataType9 == "boolean"){
coerced9 = "" + data8;
}
else if(data8 === null){
coerced9 = "";
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced9 = null;
}
else {
const err4 = {instancePath:instancePath+"/operations/view",schemaPath:"node#/definitions/SubscriberOperations/properties/view/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(coerced9 !== undefined){
data8 = coerced9;
if(data7 !== undefined){
data7["view"] = coerced9;
}
}
}
var valid4 = _errs29 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data7.delete !== undefined){
let data9 = data7.delete;
const _errs32 = errors;
if((typeof data9 !== "string") && (data9 !== null)){
let dataType10 = typeof data9;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType10 = typeof data9;
if((typeof data9 === "string") && (data9 === null)){
coerced10 = data9;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 == "number" || dataType10 == "boolean"){
coerced10 = "" + data9;
}
else if(data9 === null){
coerced10 = "";
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced10 = null;
}
else {
const err5 = {instancePath:instancePath+"/operations/delete",schemaPath:"node#/definitions/SubscriberOperations/properties/delete/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced10 !== undefined){
data9 = coerced10;
if(data7 !== undefined){
data7["delete"] = coerced10;
}
}
}
var valid4 = _errs32 === errors;
}
else {
var valid4 = true;
}
}
}
}
else {
const err6 = {instancePath:instancePath+"/operations",schemaPath:"node#/definitions/SubscriberOperations/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
var _valid1 = _errs25 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const _errs37 = errors;
if(data7 !== null){
let dataType11 = typeof data7;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType11 = typeof data7;
if(data7 === null){
coerced11 = data7;
}
}
if(!(coerced11 !== undefined)){
if(data7 === "" || data7 === 0 || data7 === false){
coerced11 = null;
}
else {
const err7 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(coerced11 !== undefined){
data7 = coerced11;
if(data !== undefined){
data["operations"] = coerced11;
}
}
}
var _valid1 = _errs37 === errors;
valid2 = valid2 || _valid1;
}
if(!valid2){
const err8 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
validate50.errors = vErrors;
return false;
}
else {
errors = _errs24;
if(vErrors !== null){
if(_errs24){
vErrors.length = _errs24;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs23 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ownerOperations !== undefined){
let data10 = data.ownerOperations;
const _errs39 = errors;
const _errs40 = errors;
let valid5 = false;
const _errs41 = errors;
if((!(data10 && typeof data10 == "object" && !Array.isArray(data10))) && (data10 !== null)){
let dataType12 = typeof data10;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType12 = typeof data10;
if((data10 && typeof data10 == "object" && !Array.isArray(data10)) && (data10 === null)){
coerced12 = data10;
}
}
if(!(coerced12 !== undefined)){
if(data10 === "" || data10 === 0 || data10 === false){
coerced12 = null;
}
else {
const err9 = {instancePath:instancePath+"/ownerOperations",schemaPath:"#/properties/ownerOperations/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(coerced12 !== undefined){
data10 = coerced12;
if(data !== undefined){
data["ownerOperations"] = coerced12;
}
}
}
const _errs42 = errors;
if(errors === _errs42){
if(data10 && typeof data10 == "object" && !Array.isArray(data10)){
const _errs44 = errors;
for(const key2 in data10){
if(!((key2 === "view") || (key2 === "delete"))){
delete data10[key2];
}
}
if(_errs44 === errors){
if(data10.view !== undefined){
let data11 = data10.view;
const _errs45 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType13 = typeof data11;
let coerced13 = undefined;
if(dataType13 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType13 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced13 = data11;
}
}
if(!(coerced13 !== undefined)){
if(dataType13 == "number" || dataType13 == "boolean"){
coerced13 = "" + data11;
}
else if(data11 === null){
coerced13 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced13 = null;
}
else {
const err10 = {instancePath:instancePath+"/ownerOperations/view",schemaPath:"node#/definitions/SubscriberOperations/properties/view/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(coerced13 !== undefined){
data11 = coerced13;
if(data10 !== undefined){
data10["view"] = coerced13;
}
}
}
var valid7 = _errs45 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data10.delete !== undefined){
let data12 = data10.delete;
const _errs48 = errors;
if((typeof data12 !== "string") && (data12 !== null)){
let dataType14 = typeof data12;
let coerced14 = undefined;
if(dataType14 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType14 = typeof data12;
if((typeof data12 === "string") && (data12 === null)){
coerced14 = data12;
}
}
if(!(coerced14 !== undefined)){
if(dataType14 == "number" || dataType14 == "boolean"){
coerced14 = "" + data12;
}
else if(data12 === null){
coerced14 = "";
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced14 = null;
}
else {
const err11 = {instancePath:instancePath+"/ownerOperations/delete",schemaPath:"node#/definitions/SubscriberOperations/properties/delete/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(coerced14 !== undefined){
data12 = coerced14;
if(data10 !== undefined){
data10["delete"] = coerced14;
}
}
}
var valid7 = _errs48 === errors;
}
else {
var valid7 = true;
}
}
}
}
else {
const err12 = {instancePath:instancePath+"/ownerOperations",schemaPath:"node#/definitions/SubscriberOperations/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
var _valid2 = _errs41 === errors;
valid5 = valid5 || _valid2;
if(!valid5){
const _errs53 = errors;
if(data10 !== null){
let dataType15 = typeof data10;
let coerced15 = undefined;
if(dataType15 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType15 = typeof data10;
if(data10 === null){
coerced15 = data10;
}
}
if(!(coerced15 !== undefined)){
if(data10 === "" || data10 === 0 || data10 === false){
coerced15 = null;
}
else {
const err13 = {instancePath:instancePath+"/ownerOperations",schemaPath:"#/properties/ownerOperations/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(coerced15 !== undefined){
data10 = coerced15;
if(data !== undefined){
data["ownerOperations"] = coerced15;
}
}
}
var _valid2 = _errs53 === errors;
valid5 = valid5 || _valid2;
}
if(!valid5){
const err14 = {instancePath:instancePath+"/ownerOperations",schemaPath:"#/properties/ownerOperations/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
validate50.errors = vErrors;
return false;
}
else {
errors = _errs40;
if(vErrors !== null){
if(_errs40){
vErrors.length = _errs40;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs39 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.adminOperations !== undefined){
let data13 = data.adminOperations;
const _errs55 = errors;
const _errs56 = errors;
let valid8 = false;
const _errs57 = errors;
if((!(data13 && typeof data13 == "object" && !Array.isArray(data13))) && (data13 !== null)){
let dataType16 = typeof data13;
let coerced16 = undefined;
if(dataType16 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType16 = typeof data13;
if((data13 && typeof data13 == "object" && !Array.isArray(data13)) && (data13 === null)){
coerced16 = data13;
}
}
if(!(coerced16 !== undefined)){
if(data13 === "" || data13 === 0 || data13 === false){
coerced16 = null;
}
else {
const err15 = {instancePath:instancePath+"/adminOperations",schemaPath:"#/properties/adminOperations/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(coerced16 !== undefined){
data13 = coerced16;
if(data !== undefined){
data["adminOperations"] = coerced16;
}
}
}
const _errs58 = errors;
if(errors === _errs58){
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
const _errs60 = errors;
for(const key3 in data13){
if(!((key3 === "view") || (key3 === "delete"))){
delete data13[key3];
}
}
if(_errs60 === errors){
if(data13.view !== undefined){
let data14 = data13.view;
const _errs61 = errors;
if((typeof data14 !== "string") && (data14 !== null)){
let dataType17 = typeof data14;
let coerced17 = undefined;
if(dataType17 == 'object' && Array.isArray(data14) && data14.length == 1){
data14 = data14[0];
dataType17 = typeof data14;
if((typeof data14 === "string") && (data14 === null)){
coerced17 = data14;
}
}
if(!(coerced17 !== undefined)){
if(dataType17 == "number" || dataType17 == "boolean"){
coerced17 = "" + data14;
}
else if(data14 === null){
coerced17 = "";
}
else if(data14 === "" || data14 === 0 || data14 === false){
coerced17 = null;
}
else {
const err16 = {instancePath:instancePath+"/adminOperations/view",schemaPath:"node#/definitions/SubscriberOperations/properties/view/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(coerced17 !== undefined){
data14 = coerced17;
if(data13 !== undefined){
data13["view"] = coerced17;
}
}
}
var valid10 = _errs61 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data13.delete !== undefined){
let data15 = data13.delete;
const _errs64 = errors;
if((typeof data15 !== "string") && (data15 !== null)){
let dataType18 = typeof data15;
let coerced18 = undefined;
if(dataType18 == 'object' && Array.isArray(data15) && data15.length == 1){
data15 = data15[0];
dataType18 = typeof data15;
if((typeof data15 === "string") && (data15 === null)){
coerced18 = data15;
}
}
if(!(coerced18 !== undefined)){
if(dataType18 == "number" || dataType18 == "boolean"){
coerced18 = "" + data15;
}
else if(data15 === null){
coerced18 = "";
}
else if(data15 === "" || data15 === 0 || data15 === false){
coerced18 = null;
}
else {
const err17 = {instancePath:instancePath+"/adminOperations/delete",schemaPath:"node#/definitions/SubscriberOperations/properties/delete/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(coerced18 !== undefined){
data15 = coerced18;
if(data13 !== undefined){
data13["delete"] = coerced18;
}
}
}
var valid10 = _errs64 === errors;
}
else {
var valid10 = true;
}
}
}
}
else {
const err18 = {instancePath:instancePath+"/adminOperations",schemaPath:"node#/definitions/SubscriberOperations/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
var _valid3 = _errs57 === errors;
valid8 = valid8 || _valid3;
if(!valid8){
const _errs69 = errors;
if(data13 !== null){
let dataType19 = typeof data13;
let coerced19 = undefined;
if(dataType19 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType19 = typeof data13;
if(data13 === null){
coerced19 = data13;
}
}
if(!(coerced19 !== undefined)){
if(data13 === "" || data13 === 0 || data13 === false){
coerced19 = null;
}
else {
const err19 = {instancePath:instancePath+"/adminOperations",schemaPath:"#/properties/adminOperations/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(coerced19 !== undefined){
data13 = coerced19;
if(data !== undefined){
data["adminOperations"] = coerced19;
}
}
}
var _valid3 = _errs69 === errors;
valid8 = valid8 || _valid3;
}
if(!valid8){
const err20 = {instancePath:instancePath+"/adminOperations",schemaPath:"#/properties/adminOperations/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
validate50.errors = vErrors;
return false;
}
else {
errors = _errs56;
if(vErrors !== null){
if(_errs56){
vErrors.length = _errs56;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs55 === errors;
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
}
}
}
}
else {
validate50.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate50.errors = vErrors;
return errors === 0;
}


function validate49(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.subscriber === undefined) && (missing0 = "subscriber")){
validate49.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "subscriber"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate49.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.subscriber !== undefined){
const _errs4 = errors;
if(!(validate50(data.subscriber, {instancePath:instancePath+"/subscriber",parentData:data,parentDataProperty:"subscriber",rootData}))){
vErrors = vErrors === null ? validate50.errors : vErrors.concat(validate50.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate49.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate49.errors = vErrors;
return errors === 0;
}

export const SubscriberUpdatedEvent = validate54;
const schema64 = {"type":"object","properties":{"type":{"type":"string"},"subscriber":{"$ref":"node#/definitions/SubscriberInfo"}},"additionalProperties":false,"required":["subscriber"]};

function validate54(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.subscriber === undefined) && (missing0 = "subscriber")){
validate54.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "subscriber"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate54.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.subscriber !== undefined){
const _errs4 = errors;
if(!(validate50(data.subscriber, {instancePath:instancePath+"/subscriber",parentData:data,parentDataProperty:"subscriber",rootData}))){
vErrors = vErrors === null ? validate50.errors : vErrors.concat(validate50.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate54.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate54.errors = vErrors;
return errors === 0;
}

export const SubscriberDeletedEvent = validate56;
const schema65 = {"type":"object","properties":{"type":{"type":"string"},"subscriber":{"$ref":"node#/definitions/SubscriberInfo"}},"additionalProperties":false,"required":["subscriber"]};

function validate56(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.subscriber === undefined) && (missing0 = "subscriber")){
validate56.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "subscriber"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate56.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.subscriber !== undefined){
const _errs4 = errors;
if(!(validate50(data.subscriber, {instancePath:instancePath+"/subscriber",parentData:data,parentDataProperty:"subscriber",rootData}))){
vErrors = vErrors === null ? validate50.errors : vErrors.concat(validate50.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate56.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate56.errors = vErrors;
return errors === 0;
}

export const SubscriptionAddedEvent = validate58;
const schema66 = {"type":"object","properties":{"type":{"type":"string"},"subscription":{"$ref":"node#/definitions/SubscriptionInfo"}},"additionalProperties":false,"required":["subscription"]};
const schema67 = {"type":"object","properties":{"id":{"type":"string"},"type":{"type":"string"},"feedName":{"type":"string","nullable":true},"remoteNodeName":{"type":"string"},"contact":{"anyOf":[{"$ref":"node#/definitions/ContactInfo","type":"object","nullable":true},{"type":"null"}]},"remoteFeedName":{"type":"string","nullable":true},"remotePostingId":{"type":"string","nullable":true},"createdAt":{"type":"integer"},"reason":{"type":"string"},"operations":{"anyOf":[{"$ref":"node#/definitions/SubscriptionOperations","type":"object","nullable":true},{"type":"null"}]}},"required":["id","type","remoteNodeName","createdAt","reason"],"additionalProperties":false};
const schema68 = {"type":"object","properties":{"view":{"type":"string","nullable":true},"delete":{"type":"string","nullable":true}},"additionalProperties":false};

function validate59(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.id === undefined) && (missing0 = "id")) || ((data.type === undefined) && (missing0 = "type"))) || ((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName"))) || ((data.createdAt === undefined) && (missing0 = "createdAt"))) || ((data.reason === undefined) && (missing0 = "reason"))){
validate59.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func2.call(schema67.properties, key0))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
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
validate59.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["id"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data1 = data.type;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate59.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["type"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedName !== undefined){
let data2 = data.feedName;
const _errs6 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((typeof data2 === "string") && (data2 === null)){
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
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate59.errors = [{instancePath:instancePath+"/feedName",schemaPath:"#/properties/feedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["feedName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data3 = data.remoteNodeName;
const _errs9 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate59.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["remoteNodeName"] = coerced3;
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contact !== undefined){
let data4 = data.contact;
const _errs11 = errors;
const _errs12 = errors;
let valid1 = false;
const _errs13 = errors;
if((!(data4 && typeof data4 == "object" && !Array.isArray(data4))) && (data4 !== null)){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if((data4 && typeof data4 == "object" && !Array.isArray(data4)) && (data4 === null)){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(data4 === "" || data4 === 0 || data4 === false){
coerced4 = null;
}
else {
const err0 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["contact"] = coerced4;
}
}
}
if(!(validate51(data4, {instancePath:instancePath+"/contact",parentData:data,parentDataProperty:"contact",rootData}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
var _valid0 = _errs13 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs16 = errors;
if(data4 !== null){
let dataType5 = typeof data4;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType5 = typeof data4;
if(data4 === null){
coerced5 = data4;
}
}
if(!(coerced5 !== undefined)){
if(data4 === "" || data4 === 0 || data4 === false){
coerced5 = null;
}
else {
const err1 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(coerced5 !== undefined){
data4 = coerced5;
if(data !== undefined){
data["contact"] = coerced5;
}
}
}
var _valid0 = _errs16 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err2 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate59.errors = vErrors;
return false;
}
else {
errors = _errs12;
if(vErrors !== null){
if(_errs12){
vErrors.length = _errs12;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteFeedName !== undefined){
let data5 = data.remoteFeedName;
const _errs18 = errors;
if((typeof data5 !== "string") && (data5 !== null)){
let dataType6 = typeof data5;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType6 = typeof data5;
if((typeof data5 === "string") && (data5 === null)){
coerced6 = data5;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data5;
}
else if(data5 === null){
coerced6 = "";
}
else if(data5 === "" || data5 === 0 || data5 === false){
coerced6 = null;
}
else {
validate59.errors = [{instancePath:instancePath+"/remoteFeedName",schemaPath:"#/properties/remoteFeedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data5 = coerced6;
if(data !== undefined){
data["remoteFeedName"] = coerced6;
}
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data6 = data.remotePostingId;
const _errs21 = errors;
if((typeof data6 !== "string") && (data6 !== null)){
let dataType7 = typeof data6;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType7 = typeof data6;
if((typeof data6 === "string") && (data6 === null)){
coerced7 = data6;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data6;
}
else if(data6 === null){
coerced7 = "";
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced7 = null;
}
else {
validate59.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced7 !== undefined){
data6 = coerced7;
if(data !== undefined){
data["remotePostingId"] = coerced7;
}
}
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.createdAt !== undefined){
let data7 = data.createdAt;
const _errs24 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
let dataType8 = typeof data7;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType8 = typeof data7;
if(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7))){
coerced8 = data7;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 === "boolean" || data7 === null
              || (dataType8 === "string" && data7 && data7 == +data7 && !(data7 % 1))){
coerced8 = +data7;
}
else {
validate59.errors = [{instancePath:instancePath+"/createdAt",schemaPath:"#/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced8 !== undefined){
data7 = coerced8;
if(data !== undefined){
data["createdAt"] = coerced8;
}
}
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reason !== undefined){
let data8 = data.reason;
const _errs26 = errors;
if(typeof data8 !== "string"){
let dataType9 = typeof data8;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType9 = typeof data8;
if(typeof data8 === "string"){
coerced9 = data8;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 == "number" || dataType9 == "boolean"){
coerced9 = "" + data8;
}
else if(data8 === null){
coerced9 = "";
}
else {
validate59.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced9 !== undefined){
data8 = coerced9;
if(data !== undefined){
data["reason"] = coerced9;
}
}
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.operations !== undefined){
let data9 = data.operations;
const _errs28 = errors;
const _errs29 = errors;
let valid2 = false;
const _errs30 = errors;
if((!(data9 && typeof data9 == "object" && !Array.isArray(data9))) && (data9 !== null)){
let dataType10 = typeof data9;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType10 = typeof data9;
if((data9 && typeof data9 == "object" && !Array.isArray(data9)) && (data9 === null)){
coerced10 = data9;
}
}
if(!(coerced10 !== undefined)){
if(data9 === "" || data9 === 0 || data9 === false){
coerced10 = null;
}
else {
const err3 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced10 !== undefined){
data9 = coerced10;
if(data !== undefined){
data["operations"] = coerced10;
}
}
}
const _errs31 = errors;
if(errors === _errs31){
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
const _errs33 = errors;
for(const key1 in data9){
if(!((key1 === "view") || (key1 === "delete"))){
delete data9[key1];
}
}
if(_errs33 === errors){
if(data9.view !== undefined){
let data10 = data9.view;
const _errs34 = errors;
if((typeof data10 !== "string") && (data10 !== null)){
let dataType11 = typeof data10;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType11 = typeof data10;
if((typeof data10 === "string") && (data10 === null)){
coerced11 = data10;
}
}
if(!(coerced11 !== undefined)){
if(dataType11 == "number" || dataType11 == "boolean"){
coerced11 = "" + data10;
}
else if(data10 === null){
coerced11 = "";
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced11 = null;
}
else {
const err4 = {instancePath:instancePath+"/operations/view",schemaPath:"node#/definitions/SubscriptionOperations/properties/view/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(coerced11 !== undefined){
data10 = coerced11;
if(data9 !== undefined){
data9["view"] = coerced11;
}
}
}
var valid4 = _errs34 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data9.delete !== undefined){
let data11 = data9.delete;
const _errs37 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType12 = typeof data11;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType12 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced12 = data11;
}
}
if(!(coerced12 !== undefined)){
if(dataType12 == "number" || dataType12 == "boolean"){
coerced12 = "" + data11;
}
else if(data11 === null){
coerced12 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced12 = null;
}
else {
const err5 = {instancePath:instancePath+"/operations/delete",schemaPath:"node#/definitions/SubscriptionOperations/properties/delete/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced12 !== undefined){
data11 = coerced12;
if(data9 !== undefined){
data9["delete"] = coerced12;
}
}
}
var valid4 = _errs37 === errors;
}
else {
var valid4 = true;
}
}
}
}
else {
const err6 = {instancePath:instancePath+"/operations",schemaPath:"node#/definitions/SubscriptionOperations/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
var _valid1 = _errs30 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const _errs42 = errors;
if(data9 !== null){
let dataType13 = typeof data9;
let coerced13 = undefined;
if(dataType13 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType13 = typeof data9;
if(data9 === null){
coerced13 = data9;
}
}
if(!(coerced13 !== undefined)){
if(data9 === "" || data9 === 0 || data9 === false){
coerced13 = null;
}
else {
const err7 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(coerced13 !== undefined){
data9 = coerced13;
if(data !== undefined){
data["operations"] = coerced13;
}
}
}
var _valid1 = _errs42 === errors;
valid2 = valid2 || _valid1;
}
if(!valid2){
const err8 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
validate59.errors = vErrors;
return false;
}
else {
errors = _errs29;
if(vErrors !== null){
if(_errs29){
vErrors.length = _errs29;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs28 === errors;
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
}
}
}
}
else {
validate59.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate59.errors = vErrors;
return errors === 0;
}


function validate58(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.subscription === undefined) && (missing0 = "subscription")){
validate58.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "subscription"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate58.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.subscription !== undefined){
const _errs4 = errors;
if(!(validate59(data.subscription, {instancePath:instancePath+"/subscription",parentData:data,parentDataProperty:"subscription",rootData}))){
vErrors = vErrors === null ? validate59.errors : vErrors.concat(validate59.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate58.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate58.errors = vErrors;
return errors === 0;
}

export const SubscriptionUpdatedEvent = validate62;
const schema69 = {"type":"object","properties":{"type":{"type":"string"},"subscription":{"$ref":"node#/definitions/SubscriptionInfo"}},"additionalProperties":false,"required":["subscription"]};

function validate62(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.subscription === undefined) && (missing0 = "subscription")){
validate62.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "subscription"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate62.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.subscription !== undefined){
const _errs4 = errors;
if(!(validate59(data.subscription, {instancePath:instancePath+"/subscription",parentData:data,parentDataProperty:"subscription",rootData}))){
vErrors = vErrors === null ? validate59.errors : vErrors.concat(validate59.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate62.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate62.errors = vErrors;
return errors === 0;
}

export const SubscriptionDeletedEvent = validate64;
const schema70 = {"type":"object","properties":{"type":{"type":"string"},"subscription":{"$ref":"node#/definitions/SubscriptionInfo"}},"additionalProperties":false,"required":["subscription"]};

function validate64(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.subscription === undefined) && (missing0 = "subscription")){
validate64.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "subscription"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate64.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.subscription !== undefined){
const _errs4 = errors;
if(!(validate59(data.subscription, {instancePath:instancePath+"/subscription",parentData:data,parentDataProperty:"subscription",rootData}))){
vErrors = vErrors === null ? validate59.errors : vErrors.concat(validate59.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate64.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate64.errors = vErrors;
return errors === 0;
}

export const CommentAddedEvent = validate66;
const schema71 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"postingId":{"type":"string"},"moment":{"type":"integer"}},"additionalProperties":false,"required":["type","id","postingId","moment"]};

function validate66(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.moment === undefined) && (missing0 = "moment"))){
validate66.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "id")) || (key0 === "postingId")) || (key0 === "moment"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate66.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate66.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data2 = data.postingId;
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
validate66.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["postingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.moment !== undefined){
let data3 = data.moment;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3))){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 === "boolean" || data3 === null
              || (dataType3 === "string" && data3 && data3 == +data3 && !(data3 % 1))){
coerced3 = +data3;
}
else {
validate66.errors = [{instancePath:instancePath+"/moment",schemaPath:"#/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["moment"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
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
else {
validate66.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate66.errors = vErrors;
return errors === 0;
}

export const CommentUpdatedEvent = validate67;
const schema72 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"postingId":{"type":"string"},"moment":{"type":"integer"}},"additionalProperties":false,"required":["type","id","postingId","moment"]};

function validate67(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.moment === undefined) && (missing0 = "moment"))){
validate67.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "id")) || (key0 === "postingId")) || (key0 === "moment"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate67.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate67.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data2 = data.postingId;
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
validate67.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["postingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.moment !== undefined){
let data3 = data.moment;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3))){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 === "boolean" || data3 === null
              || (dataType3 === "string" && data3 && data3 == +data3 && !(data3 % 1))){
coerced3 = +data3;
}
else {
validate67.errors = [{instancePath:instancePath+"/moment",schemaPath:"#/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["moment"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
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
else {
validate67.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate67.errors = vErrors;
return errors === 0;
}

export const CommentDeletedEvent = validate68;
const schema73 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"postingId":{"type":"string"},"moment":{"type":"integer"}},"additionalProperties":false,"required":["type","id","postingId","moment"]};

function validate68(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.moment === undefined) && (missing0 = "moment"))){
validate68.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "id")) || (key0 === "postingId")) || (key0 === "moment"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate68.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate68.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data2 = data.postingId;
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
validate68.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["postingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.moment !== undefined){
let data3 = data.moment;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3))){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 === "boolean" || data3 === null
              || (dataType3 === "string" && data3 && data3 == +data3 && !(data3 % 1))){
coerced3 = +data3;
}
else {
validate68.errors = [{instancePath:instancePath+"/moment",schemaPath:"#/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["moment"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
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
else {
validate68.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate68.errors = vErrors;
return errors === 0;
}

export const CommentReactionsChangedEvent = validate69;
const schema74 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"postingId":{"type":"string"},"moment":{"type":"integer"}},"additionalProperties":false,"required":["type","id","postingId","moment"]};

function validate69(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.moment === undefined) && (missing0 = "moment"))){
validate69.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "id")) || (key0 === "postingId")) || (key0 === "moment"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate69.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate69.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data2 = data.postingId;
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
validate69.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["postingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.moment !== undefined){
let data3 = data.moment;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3))){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 === "boolean" || data3 === null
              || (dataType3 === "string" && data3 && data3 == +data3 && !(data3 % 1))){
coerced3 = +data3;
}
else {
validate69.errors = [{instancePath:instancePath+"/moment",schemaPath:"#/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["moment"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
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
else {
validate69.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate69.errors = vErrors;
return errors === 0;
}

export const RemoteCommentAddedEvent = validate70;
const schema75 = {"type":"object","properties":{"type":{"type":"string"},"remoteNodeName":{"type":"string"},"remotePostingId":{"type":"string"},"remoteCommentId":{"type":"string"}},"additionalProperties":false,"required":["type","remoteNodeName","remotePostingId","remoteCommentId"]};

function validate70(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName"))) || ((data.remotePostingId === undefined) && (missing0 = "remotePostingId"))) || ((data.remoteCommentId === undefined) && (missing0 = "remoteCommentId"))){
validate70.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "remoteNodeName")) || (key0 === "remotePostingId")) || (key0 === "remoteCommentId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate70.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data1 = data.remoteNodeName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate70.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["remoteNodeName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data2 = data.remotePostingId;
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
validate70.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["remotePostingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteCommentId !== undefined){
let data3 = data.remoteCommentId;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate70.errors = [{instancePath:instancePath+"/remoteCommentId",schemaPath:"#/properties/remoteCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["remoteCommentId"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
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
else {
validate70.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate70.errors = vErrors;
return errors === 0;
}

export const RemoteCommentUpdatedEvent = validate71;
const schema76 = {"type":"object","properties":{"type":{"type":"string"},"remoteNodeName":{"type":"string"},"remotePostingId":{"type":"string"},"remoteCommentId":{"type":"string"}},"additionalProperties":false,"required":["type","remoteNodeName","remotePostingId","remoteCommentId"]};

function validate71(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName"))) || ((data.remotePostingId === undefined) && (missing0 = "remotePostingId"))) || ((data.remoteCommentId === undefined) && (missing0 = "remoteCommentId"))){
validate71.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "remoteNodeName")) || (key0 === "remotePostingId")) || (key0 === "remoteCommentId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate71.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data1 = data.remoteNodeName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate71.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["remoteNodeName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data2 = data.remotePostingId;
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
validate71.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["remotePostingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteCommentId !== undefined){
let data3 = data.remoteCommentId;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate71.errors = [{instancePath:instancePath+"/remoteCommentId",schemaPath:"#/properties/remoteCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["remoteCommentId"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
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
else {
validate71.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate71.errors = vErrors;
return errors === 0;
}

export const RemoteCommentDeletedEvent = validate72;
const schema77 = {"type":"object","properties":{"type":{"type":"string"},"remoteNodeName":{"type":"string"},"remotePostingId":{"type":"string"},"remoteCommentId":{"type":"string"}},"additionalProperties":false,"required":["type","remoteNodeName","remotePostingId","remoteCommentId"]};

function validate72(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName"))) || ((data.remotePostingId === undefined) && (missing0 = "remotePostingId"))) || ((data.remoteCommentId === undefined) && (missing0 = "remoteCommentId"))){
validate72.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "remoteNodeName")) || (key0 === "remotePostingId")) || (key0 === "remoteCommentId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate72.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data1 = data.remoteNodeName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate72.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["remoteNodeName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data2 = data.remotePostingId;
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
validate72.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["remotePostingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteCommentId !== undefined){
let data3 = data.remoteCommentId;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate72.errors = [{instancePath:instancePath+"/remoteCommentId",schemaPath:"#/properties/remoteCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["remoteCommentId"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
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
else {
validate72.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate72.errors = vErrors;
return errors === 0;
}

export const RemoteCommentVerifiedEvent = validate73;
const schema78 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"nodeName":{"type":"string"},"postingId":{"type":"string"},"commentId":{"type":"string"},"correct":{"type":"boolean"}},"additionalProperties":false,"required":["type","id","nodeName","postingId","commentId","correct"]};

function validate73(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.nodeName === undefined) && (missing0 = "nodeName"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.commentId === undefined) && (missing0 = "commentId"))) || ((data.correct === undefined) && (missing0 = "correct"))){
validate73.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "id")) || (key0 === "nodeName")) || (key0 === "postingId")) || (key0 === "commentId")) || (key0 === "correct"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate73.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate73.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeName !== undefined){
let data2 = data.nodeName;
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
validate73.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["nodeName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data3 = data.postingId;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate73.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["postingId"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.commentId !== undefined){
let data4 = data.commentId;
const _errs10 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate73.errors = [{instancePath:instancePath+"/commentId",schemaPath:"#/properties/commentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["commentId"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.correct !== undefined){
let data5 = data.correct;
const _errs12 = errors;
if(typeof data5 !== "boolean"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "boolean"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(data5 === "false" || data5 === 0 || data5 === null){
coerced5 = false;
}
else if(data5 === "true" || data5 === 1){
coerced5 = true;
}
else {
validate73.errors = [{instancePath:instancePath+"/correct",schemaPath:"#/properties/correct/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["correct"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
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
validate73.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate73.errors = vErrors;
return errors === 0;
}

export const RemoteCommentVerificationFailedEvent = validate74;
const schema79 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"nodeName":{"type":"string"},"postingId":{"type":"string"},"commentId":{"type":"string"},"errorCode":{"type":"string"},"errorMessage":{"type":"string"}},"additionalProperties":false,"required":["type","id","nodeName","postingId","commentId","errorCode","errorMessage"]};

function validate74(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.nodeName === undefined) && (missing0 = "nodeName"))) || ((data.postingId === undefined) && (missing0 = "postingId"))) || ((data.commentId === undefined) && (missing0 = "commentId"))) || ((data.errorCode === undefined) && (missing0 = "errorCode"))) || ((data.errorMessage === undefined) && (missing0 = "errorMessage"))){
validate74.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "type") || (key0 === "id")) || (key0 === "nodeName")) || (key0 === "postingId")) || (key0 === "commentId")) || (key0 === "errorCode")) || (key0 === "errorMessage"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate74.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate74.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeName !== undefined){
let data2 = data.nodeName;
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
validate74.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["nodeName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data3 = data.postingId;
const _errs8 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate74.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["postingId"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.commentId !== undefined){
let data4 = data.commentId;
const _errs10 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
validate74.errors = [{instancePath:instancePath+"/commentId",schemaPath:"#/properties/commentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["commentId"] = coerced4;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorCode !== undefined){
let data5 = data.errorCode;
const _errs12 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
validate74.errors = [{instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data !== undefined){
data["errorCode"] = coerced5;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorMessage !== undefined){
let data6 = data.errorMessage;
const _errs14 = errors;
if(typeof data6 !== "string"){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if(typeof data6 === "string"){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data6;
}
else if(data6 === null){
coerced6 = "";
}
else {
validate74.errors = [{instancePath:instancePath+"/errorMessage",schemaPath:"#/properties/errorMessage/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data !== undefined){
data["errorMessage"] = coerced6;
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
}
else {
validate74.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate74.errors = vErrors;
return errors === 0;
}

export const RemoteNodeFullNameChangedEvent = validate75;
const schema80 = {"type":"object","properties":{"type":{"type":"string"},"name":{"type":"string"},"fullName":{"type":"string","nullable":true}},"additionalProperties":false,"required":["type","name"]};

function validate75(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.name === undefined) && (missing0 = "name"))){
validate75.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "name")) || (key0 === "fullName"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate75.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.name !== undefined){
let data1 = data.name;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate75.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["name"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.fullName !== undefined){
let data2 = data.fullName;
const _errs6 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((typeof data2 === "string") && (data2 === null)){
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
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate75.errors = [{instancePath:instancePath+"/fullName",schemaPath:"#/properties/fullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["fullName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
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
validate75.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate75.errors = vErrors;
return errors === 0;
}

export const SubscribersTotalChangedEvent = validate76;
const schema81 = {"type":"object","properties":{"type":{"type":"string"},"feedSubscribersTotal":{"type":"integer"}},"additionalProperties":false,"required":["type","feedSubscribersTotal"]};

function validate76(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.feedSubscribersTotal === undefined) && (missing0 = "feedSubscribersTotal"))){
validate76.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "feedSubscribersTotal"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate76.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedSubscribersTotal !== undefined){
let data1 = data.feedSubscribersTotal;
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
validate76.errors = [{instancePath:instancePath+"/feedSubscribersTotal",schemaPath:"#/properties/feedSubscribersTotal/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["feedSubscribersTotal"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate76.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate76.errors = vErrors;
return errors === 0;
}

export const SubscriptionsTotalChangedEvent = validate77;
const schema82 = {"type":"object","properties":{"type":{"type":"string"},"feedSubscriptionsTotal":{"type":"integer"}},"additionalProperties":false,"required":["type","feedSubscriptionsTotal"]};

function validate77(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.feedSubscriptionsTotal === undefined) && (missing0 = "feedSubscriptionsTotal"))){
validate77.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "feedSubscriptionsTotal"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate77.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedSubscriptionsTotal !== undefined){
let data1 = data.feedSubscriptionsTotal;
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
validate77.errors = [{instancePath:instancePath+"/feedSubscriptionsTotal",schemaPath:"#/properties/feedSubscriptionsTotal/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["feedSubscriptionsTotal"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate77.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate77.errors = vErrors;
return errors === 0;
}

export const RemoteNodeAvatarChangedEvent = validate78;
const schema83 = {"type":"object","properties":{"type":{"type":"string"},"name":{"type":"string"},"avatar":{"anyOf":[{"$ref":"node#/definitions/AvatarImage","type":"object","nullable":true},{"type":"null"}]}},"additionalProperties":false,"required":["type","name"]};

function validate78(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.name === undefined) && (missing0 = "name"))){
validate78.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "name")) || (key0 === "avatar"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate78.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.name !== undefined){
let data1 = data.name;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate78.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["name"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.avatar !== undefined){
let data2 = data.avatar;
const _errs6 = errors;
const _errs7 = errors;
let valid1 = false;
const _errs8 = errors;
if((!(data2 && typeof data2 == "object" && !Array.isArray(data2))) && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((data2 && typeof data2 == "object" && !Array.isArray(data2)) && (data2 === null)){
coerced2 = data2;
}
}
if(!(coerced2 !== undefined)){
if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
const err0 = {instancePath:instancePath+"/avatar",schemaPath:"#/properties/avatar/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["avatar"] = coerced2;
}
}
}
const _errs9 = errors;
if(errors === _errs9){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
let missing1;
if(((data2.mediaId === undefined) && (missing1 = "mediaId")) || ((data2.path === undefined) && (missing1 = "path"))){
const err1 = {instancePath:instancePath+"/avatar",schemaPath:"node#/definitions/AvatarImage/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
const _errs11 = errors;
for(const key1 in data2){
if(!(((((key1 === "mediaId") || (key1 === "path")) || (key1 === "width")) || (key1 === "height")) || (key1 === "shape"))){
delete data2[key1];
}
}
if(_errs11 === errors){
if(data2.mediaId !== undefined){
let data3 = data2.mediaId;
const _errs12 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
const err2 = {instancePath:instancePath+"/avatar/mediaId",schemaPath:"node#/definitions/AvatarImage/properties/mediaId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data2 !== undefined){
data2["mediaId"] = coerced3;
}
}
}
var valid3 = _errs12 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data2.path !== undefined){
let data4 = data2.path;
const _errs14 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if(typeof data4 === "string"){
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
else {
const err3 = {instancePath:instancePath+"/avatar/path",schemaPath:"node#/definitions/AvatarImage/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data2 !== undefined){
data2["path"] = coerced4;
}
}
}
var valid3 = _errs14 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data2.width !== undefined){
let data5 = data2.width;
const _errs16 = errors;
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
const err4 = {instancePath:instancePath+"/avatar/width",schemaPath:"node#/definitions/AvatarImage/properties/width/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data2 !== undefined){
data2["width"] = coerced5;
}
}
}
var valid3 = _errs16 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data2.height !== undefined){
let data6 = data2.height;
const _errs19 = errors;
if((!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))) && (data6 !== null)){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if((((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6))) && (data6 === null)){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 === "boolean" || data6 === null
              || (dataType6 === "string" && data6 && data6 == +data6 && !(data6 % 1))){
coerced6 = +data6;
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced6 = null;
}
else {
const err5 = {instancePath:instancePath+"/avatar/height",schemaPath:"node#/definitions/AvatarImage/properties/height/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data2 !== undefined){
data2["height"] = coerced6;
}
}
}
var valid3 = _errs19 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data2.shape !== undefined){
let data7 = data2.shape;
const _errs22 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType7 = typeof data7;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType7 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced7 = data7;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data7;
}
else if(data7 === null){
coerced7 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced7 = null;
}
else {
const err6 = {instancePath:instancePath+"/avatar/shape",schemaPath:"node#/definitions/AvatarImage/properties/shape/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(coerced7 !== undefined){
data7 = coerced7;
if(data2 !== undefined){
data2["shape"] = coerced7;
}
}
}
var valid3 = _errs22 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
}
}
else {
const err7 = {instancePath:instancePath+"/avatar",schemaPath:"node#/definitions/AvatarImage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var _valid0 = _errs8 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs27 = errors;
if(data2 !== null){
let dataType8 = typeof data2;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType8 = typeof data2;
if(data2 === null){
coerced8 = data2;
}
}
if(!(coerced8 !== undefined)){
if(data2 === "" || data2 === 0 || data2 === false){
coerced8 = null;
}
else {
const err8 = {instancePath:instancePath+"/avatar",schemaPath:"#/properties/avatar/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(coerced8 !== undefined){
data2 = coerced8;
if(data !== undefined){
data["avatar"] = coerced8;
}
}
}
var _valid0 = _errs27 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err9 = {instancePath:instancePath+"/avatar",schemaPath:"#/properties/avatar/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
validate78.errors = vErrors;
return false;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs6 === errors;
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
validate78.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate78.errors = vErrors;
return errors === 0;
}

export const AvatarAddedEvent = validate79;
const schema85 = {"type":"object","properties":{"type":{"type":"string"},"avatar":{"$ref":"node#/definitions/AvatarInfo"}},"additionalProperties":false,"required":["type","avatar"]};
const schema86 = {"type":"object","properties":{"id":{"type":"string"},"mediaId":{"type":"string"},"path":{"type":"string"},"width":{"type":"integer","nullable":true},"height":{"type":"integer","nullable":true},"shape":{"type":"string","nullable":true},"ordinal":{"type":"integer"}},"required":["id","mediaId","path","ordinal"],"additionalProperties":false};

function validate79(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.avatar === undefined) && (missing0 = "avatar"))){
validate79.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "avatar"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate79.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.avatar !== undefined){
let data1 = data.avatar;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing1;
if(((((data1.id === undefined) && (missing1 = "id")) || ((data1.mediaId === undefined) && (missing1 = "mediaId"))) || ((data1.path === undefined) && (missing1 = "path"))) || ((data1.ordinal === undefined) && (missing1 = "ordinal"))){
validate79.errors = [{instancePath:instancePath+"/avatar",schemaPath:"node#/definitions/AvatarInfo/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data1){
if(!(((((((key1 === "id") || (key1 === "mediaId")) || (key1 === "path")) || (key1 === "width")) || (key1 === "height")) || (key1 === "shape")) || (key1 === "ordinal"))){
delete data1[key1];
}
}
if(_errs7 === errors){
if(data1.id !== undefined){
let data2 = data1.id;
const _errs8 = errors;
if(typeof data2 !== "string"){
let dataType1 = typeof data2;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType1 = typeof data2;
if(typeof data2 === "string"){
coerced1 = data2;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data2;
}
else if(data2 === null){
coerced1 = "";
}
else {
validate79.errors = [{instancePath:instancePath+"/avatar/id",schemaPath:"node#/definitions/AvatarInfo/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data2 = coerced1;
if(data1 !== undefined){
data1["id"] = coerced1;
}
}
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.mediaId !== undefined){
let data3 = data1.mediaId;
const _errs10 = errors;
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
validate79.errors = [{instancePath:instancePath+"/avatar/mediaId",schemaPath:"node#/definitions/AvatarInfo/properties/mediaId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data3 = coerced2;
if(data1 !== undefined){
data1["mediaId"] = coerced2;
}
}
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.path !== undefined){
let data4 = data1.path;
const _errs12 = errors;
if(typeof data4 !== "string"){
let dataType3 = typeof data4;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType3 = typeof data4;
if(typeof data4 === "string"){
coerced3 = data4;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 == "number" || dataType3 == "boolean"){
coerced3 = "" + data4;
}
else if(data4 === null){
coerced3 = "";
}
else {
validate79.errors = [{instancePath:instancePath+"/avatar/path",schemaPath:"node#/definitions/AvatarInfo/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data4 = coerced3;
if(data1 !== undefined){
data1["path"] = coerced3;
}
}
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.width !== undefined){
let data5 = data1.width;
const _errs14 = errors;
if((!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))) && (data5 !== null)){
let dataType4 = typeof data5;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType4 = typeof data5;
if((((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5))) && (data5 === null)){
coerced4 = data5;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "boolean" || data5 === null
              || (dataType4 === "string" && data5 && data5 == +data5 && !(data5 % 1))){
coerced4 = +data5;
}
else if(data5 === "" || data5 === 0 || data5 === false){
coerced4 = null;
}
else {
validate79.errors = [{instancePath:instancePath+"/avatar/width",schemaPath:"node#/definitions/AvatarInfo/properties/width/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced4 !== undefined){
data5 = coerced4;
if(data1 !== undefined){
data1["width"] = coerced4;
}
}
}
var valid2 = _errs14 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.height !== undefined){
let data6 = data1.height;
const _errs17 = errors;
if((!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))) && (data6 !== null)){
let dataType5 = typeof data6;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType5 = typeof data6;
if((((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6))) && (data6 === null)){
coerced5 = data6;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 === "boolean" || data6 === null
              || (dataType5 === "string" && data6 && data6 == +data6 && !(data6 % 1))){
coerced5 = +data6;
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced5 = null;
}
else {
validate79.errors = [{instancePath:instancePath+"/avatar/height",schemaPath:"node#/definitions/AvatarInfo/properties/height/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced5 !== undefined){
data6 = coerced5;
if(data1 !== undefined){
data1["height"] = coerced5;
}
}
}
var valid2 = _errs17 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.shape !== undefined){
let data7 = data1.shape;
const _errs20 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType6 = typeof data7;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType6 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced6 = data7;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data7;
}
else if(data7 === null){
coerced6 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced6 = null;
}
else {
validate79.errors = [{instancePath:instancePath+"/avatar/shape",schemaPath:"node#/definitions/AvatarInfo/properties/shape/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data7 = coerced6;
if(data1 !== undefined){
data1["shape"] = coerced6;
}
}
}
var valid2 = _errs20 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.ordinal !== undefined){
let data8 = data1.ordinal;
const _errs23 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
let dataType7 = typeof data8;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType7 = typeof data8;
if(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8))){
coerced7 = data8;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 === "boolean" || data8 === null
              || (dataType7 === "string" && data8 && data8 == +data8 && !(data8 % 1))){
coerced7 = +data8;
}
else {
validate79.errors = [{instancePath:instancePath+"/avatar/ordinal",schemaPath:"node#/definitions/AvatarInfo/properties/ordinal/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced7 !== undefined){
data8 = coerced7;
if(data1 !== undefined){
data1["ordinal"] = coerced7;
}
}
}
var valid2 = _errs23 === errors;
}
else {
var valid2 = true;
}
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
validate79.errors = [{instancePath:instancePath+"/avatar",schemaPath:"node#/definitions/AvatarInfo/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate79.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate79.errors = vErrors;
return errors === 0;
}

export const AvatarDeletedEvent = validate80;
const schema87 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"mediaId":{"type":"string"}},"additionalProperties":false,"required":["type","id","mediaId"]};

function validate80(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.mediaId === undefined) && (missing0 = "mediaId"))){
validate80.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "id")) || (key0 === "mediaId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate80.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate80.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaId !== undefined){
let data2 = data.mediaId;
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
validate80.errors = [{instancePath:instancePath+"/mediaId",schemaPath:"#/properties/mediaId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["mediaId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
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
validate80.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate80.errors = vErrors;
return errors === 0;
}

export const AvatarOrderedEvent = validate81;
const schema88 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"},"mediaId":{"type":"string"},"ordinal":{"type":"integer"}},"additionalProperties":false,"required":["type","id","mediaId","ordinal"]};

function validate81(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.mediaId === undefined) && (missing0 = "mediaId"))) || ((data.ordinal === undefined) && (missing0 = "ordinal"))){
validate81.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "id")) || (key0 === "mediaId")) || (key0 === "ordinal"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate81.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate81.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaId !== undefined){
let data2 = data.mediaId;
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
validate81.errors = [{instancePath:instancePath+"/mediaId",schemaPath:"#/properties/mediaId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["mediaId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ordinal !== undefined){
let data3 = data.ordinal;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3))){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 === "boolean" || data3 === null
              || (dataType3 === "string" && data3 && data3 == +data3 && !(data3 % 1))){
coerced3 = +data3;
}
else {
validate81.errors = [{instancePath:instancePath+"/ordinal",schemaPath:"#/properties/ordinal/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["ordinal"] = coerced3;
}
}
}
var valid0 = _errs8 === errors;
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
else {
validate81.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate81.errors = vErrors;
return errors === 0;
}

export const RemotePostingAddedEvent = validate82;
const schema89 = {"type":"object","properties":{"type":{"type":"string"},"remoteNodeName":{"type":"string"},"remotePostingId":{"type":"string"}},"additionalProperties":false,"required":["type","remoteNodeName","remotePostingId"]};

function validate82(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName"))) || ((data.remotePostingId === undefined) && (missing0 = "remotePostingId"))){
validate82.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "remoteNodeName")) || (key0 === "remotePostingId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate82.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data1 = data.remoteNodeName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate82.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["remoteNodeName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data2 = data.remotePostingId;
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
validate82.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["remotePostingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
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
validate82.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate82.errors = vErrors;
return errors === 0;
}

export const RemotePostingUpdatedEvent = validate83;
const schema90 = {"type":"object","properties":{"type":{"type":"string"},"remoteNodeName":{"type":"string"},"remotePostingId":{"type":"string"}},"additionalProperties":false,"required":["type","remoteNodeName","remotePostingId"]};

function validate83(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName"))) || ((data.remotePostingId === undefined) && (missing0 = "remotePostingId"))){
validate83.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "remoteNodeName")) || (key0 === "remotePostingId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate83.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data1 = data.remoteNodeName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate83.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["remoteNodeName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data2 = data.remotePostingId;
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
validate83.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["remotePostingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
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
validate83.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate83.errors = vErrors;
return errors === 0;
}

export const RemotePostingDeletedEvent = validate84;
const schema91 = {"type":"object","properties":{"type":{"type":"string"},"remoteNodeName":{"type":"string"},"remotePostingId":{"type":"string"}},"additionalProperties":false,"required":["type","remoteNodeName","remotePostingId"]};

function validate84(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName"))) || ((data.remotePostingId === undefined) && (missing0 = "remotePostingId"))){
validate84.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "remoteNodeName")) || (key0 === "remotePostingId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate84.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remoteNodeName !== undefined){
let data1 = data.remoteNodeName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate84.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["remoteNodeName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.remotePostingId !== undefined){
let data2 = data.remotePostingId;
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
validate84.errors = [{instancePath:instancePath+"/remotePostingId",schemaPath:"#/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["remotePostingId"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
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
validate84.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate84.errors = vErrors;
return errors === 0;
}

export const TokenAddedEvent = validate85;
const schema92 = {"type":"object","properties":{"type":{"type":"string"},"token":{"$ref":"node#/definitions/TokenInfo"}},"additionalProperties":false,"required":["type","token"]};
const schema93 = {"type":"object","properties":{"id":{"type":"string"},"token":{"type":"string"},"name":{"type":"string","nullable":true},"permissions":{"type":"array","items":{"type":"string"},"default":[]},"pluginName":{"type":"string","nullable":true},"createdAt":{"type":"integer"},"deadline":{"type":"integer","nullable":true},"lastUsedAt":{"type":"integer","nullable":true},"lastUsedBrowser":{"type":"string","nullable":true},"lastUsedIp":{"type":"string","nullable":true}},"required":["id","token","permissions","createdAt"],"additionalProperties":false};

function validate85(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.token === undefined) && (missing0 = "token"))){
validate85.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "token"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate85.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.token !== undefined){
let data1 = data.token;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.permissions === undefined){
data1.permissions = [];
}
let missing1;
if(((((data1.id === undefined) && (missing1 = "id")) || ((data1.token === undefined) && (missing1 = "token"))) || ((data1.permissions === undefined) && (missing1 = "permissions"))) || ((data1.createdAt === undefined) && (missing1 = "createdAt"))){
validate85.errors = [{instancePath:instancePath+"/token",schemaPath:"node#/definitions/TokenInfo/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data1){
if(!(func2.call(schema93.properties, key1))){
delete data1[key1];
}
}
if(_errs7 === errors){
if(data1.id !== undefined){
let data2 = data1.id;
const _errs8 = errors;
if(typeof data2 !== "string"){
let dataType1 = typeof data2;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType1 = typeof data2;
if(typeof data2 === "string"){
coerced1 = data2;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data2;
}
else if(data2 === null){
coerced1 = "";
}
else {
validate85.errors = [{instancePath:instancePath+"/token/id",schemaPath:"node#/definitions/TokenInfo/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data2 = coerced1;
if(data1 !== undefined){
data1["id"] = coerced1;
}
}
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.token !== undefined){
let data3 = data1.token;
const _errs10 = errors;
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
validate85.errors = [{instancePath:instancePath+"/token/token",schemaPath:"node#/definitions/TokenInfo/properties/token/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data3 = coerced2;
if(data1 !== undefined){
data1["token"] = coerced2;
}
}
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.name !== undefined){
let data4 = data1.name;
const _errs12 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
let dataType3 = typeof data4;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType3 = typeof data4;
if((typeof data4 === "string") && (data4 === null)){
coerced3 = data4;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 == "number" || dataType3 == "boolean"){
coerced3 = "" + data4;
}
else if(data4 === null){
coerced3 = "";
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced3 = null;
}
else {
validate85.errors = [{instancePath:instancePath+"/token/name",schemaPath:"node#/definitions/TokenInfo/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data4 = coerced3;
if(data1 !== undefined){
data1["name"] = coerced3;
}
}
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
let data5 = data1.permissions;
const _errs15 = errors;
if(!(Array.isArray(data5))){
let dataType4 = typeof data5;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType4 = typeof data5;
if(Array.isArray(data5)){
coerced4 = data5;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "string" || dataType4 === "number"
              || dataType4 === "boolean" || data5 === null){
coerced4 = [data5];
}
else {
validate85.errors = [{instancePath:instancePath+"/token/permissions",schemaPath:"node#/definitions/TokenInfo/properties/permissions/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced4 !== undefined){
data5 = coerced4;
if(data1 !== undefined){
data1["permissions"] = coerced4;
}
}
}
if(errors === _errs15){
if(Array.isArray(data5)){
var valid3 = true;
const len0 = data5.length;
for(let i0=0; i0<len0; i0++){
let data6 = data5[i0];
const _errs17 = errors;
if(typeof data6 !== "string"){
let dataType5 = typeof data6;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType5 = typeof data6;
if(typeof data6 === "string"){
coerced5 = data6;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data6;
}
else if(data6 === null){
coerced5 = "";
}
else {
validate85.errors = [{instancePath:instancePath+"/token/permissions/" + i0,schemaPath:"node#/definitions/TokenInfo/properties/permissions/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data6 = coerced5;
if(data5 !== undefined){
data5[i0] = coerced5;
}
}
}
var valid3 = _errs17 === errors;
if(!valid3){
break;
}
}
}
}
var valid2 = _errs15 === errors;
if(valid2){
if(data1.pluginName !== undefined){
let data7 = data1.pluginName;
const _errs19 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType6 = typeof data7;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType6 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced6 = data7;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data7;
}
else if(data7 === null){
coerced6 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced6 = null;
}
else {
validate85.errors = [{instancePath:instancePath+"/token/pluginName",schemaPath:"node#/definitions/TokenInfo/properties/pluginName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data7 = coerced6;
if(data1 !== undefined){
data1["pluginName"] = coerced6;
}
}
}
var valid2 = _errs19 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.createdAt !== undefined){
let data8 = data1.createdAt;
const _errs22 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
let dataType7 = typeof data8;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType7 = typeof data8;
if(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8))){
coerced7 = data8;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 === "boolean" || data8 === null
              || (dataType7 === "string" && data8 && data8 == +data8 && !(data8 % 1))){
coerced7 = +data8;
}
else {
validate85.errors = [{instancePath:instancePath+"/token/createdAt",schemaPath:"node#/definitions/TokenInfo/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced7 !== undefined){
data8 = coerced7;
if(data1 !== undefined){
data1["createdAt"] = coerced7;
}
}
}
var valid2 = _errs22 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.deadline !== undefined){
let data9 = data1.deadline;
const _errs24 = errors;
if((!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))) && (data9 !== null)){
let dataType8 = typeof data9;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType8 = typeof data9;
if((((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9))) && (data9 === null)){
coerced8 = data9;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 === "boolean" || data9 === null
              || (dataType8 === "string" && data9 && data9 == +data9 && !(data9 % 1))){
coerced8 = +data9;
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced8 = null;
}
else {
validate85.errors = [{instancePath:instancePath+"/token/deadline",schemaPath:"node#/definitions/TokenInfo/properties/deadline/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced8 !== undefined){
data9 = coerced8;
if(data1 !== undefined){
data1["deadline"] = coerced8;
}
}
}
var valid2 = _errs24 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.lastUsedAt !== undefined){
let data10 = data1.lastUsedAt;
const _errs27 = errors;
if((!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))) && (data10 !== null)){
let dataType9 = typeof data10;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType9 = typeof data10;
if((((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10))) && (data10 === null)){
coerced9 = data10;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 === "boolean" || data10 === null
              || (dataType9 === "string" && data10 && data10 == +data10 && !(data10 % 1))){
coerced9 = +data10;
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced9 = null;
}
else {
validate85.errors = [{instancePath:instancePath+"/token/lastUsedAt",schemaPath:"node#/definitions/TokenInfo/properties/lastUsedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced9 !== undefined){
data10 = coerced9;
if(data1 !== undefined){
data1["lastUsedAt"] = coerced9;
}
}
}
var valid2 = _errs27 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.lastUsedBrowser !== undefined){
let data11 = data1.lastUsedBrowser;
const _errs30 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType10 = typeof data11;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType10 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced10 = data11;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 == "number" || dataType10 == "boolean"){
coerced10 = "" + data11;
}
else if(data11 === null){
coerced10 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced10 = null;
}
else {
validate85.errors = [{instancePath:instancePath+"/token/lastUsedBrowser",schemaPath:"node#/definitions/TokenInfo/properties/lastUsedBrowser/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced10 !== undefined){
data11 = coerced10;
if(data1 !== undefined){
data1["lastUsedBrowser"] = coerced10;
}
}
}
var valid2 = _errs30 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.lastUsedIp !== undefined){
let data12 = data1.lastUsedIp;
const _errs33 = errors;
if((typeof data12 !== "string") && (data12 !== null)){
let dataType11 = typeof data12;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType11 = typeof data12;
if((typeof data12 === "string") && (data12 === null)){
coerced11 = data12;
}
}
if(!(coerced11 !== undefined)){
if(dataType11 == "number" || dataType11 == "boolean"){
coerced11 = "" + data12;
}
else if(data12 === null){
coerced11 = "";
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced11 = null;
}
else {
validate85.errors = [{instancePath:instancePath+"/token/lastUsedIp",schemaPath:"node#/definitions/TokenInfo/properties/lastUsedIp/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced11 !== undefined){
data12 = coerced11;
if(data1 !== undefined){
data1["lastUsedIp"] = coerced11;
}
}
}
var valid2 = _errs33 === errors;
}
else {
var valid2 = true;
}
}
}
}
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
validate85.errors = [{instancePath:instancePath+"/token",schemaPath:"node#/definitions/TokenInfo/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate85.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate85.errors = vErrors;
return errors === 0;
}

export const TokenUpdatedEvent = validate86;
const schema94 = {"type":"object","properties":{"type":{"type":"string"},"token":{"$ref":"node#/definitions/TokenInfo"}},"additionalProperties":false,"required":["type","token"]};

function validate86(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.token === undefined) && (missing0 = "token"))){
validate86.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "token"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate86.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.token !== undefined){
let data1 = data.token;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.permissions === undefined){
data1.permissions = [];
}
let missing1;
if(((((data1.id === undefined) && (missing1 = "id")) || ((data1.token === undefined) && (missing1 = "token"))) || ((data1.permissions === undefined) && (missing1 = "permissions"))) || ((data1.createdAt === undefined) && (missing1 = "createdAt"))){
validate86.errors = [{instancePath:instancePath+"/token",schemaPath:"node#/definitions/TokenInfo/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data1){
if(!(func2.call(schema93.properties, key1))){
delete data1[key1];
}
}
if(_errs7 === errors){
if(data1.id !== undefined){
let data2 = data1.id;
const _errs8 = errors;
if(typeof data2 !== "string"){
let dataType1 = typeof data2;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType1 = typeof data2;
if(typeof data2 === "string"){
coerced1 = data2;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data2;
}
else if(data2 === null){
coerced1 = "";
}
else {
validate86.errors = [{instancePath:instancePath+"/token/id",schemaPath:"node#/definitions/TokenInfo/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data2 = coerced1;
if(data1 !== undefined){
data1["id"] = coerced1;
}
}
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.token !== undefined){
let data3 = data1.token;
const _errs10 = errors;
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
validate86.errors = [{instancePath:instancePath+"/token/token",schemaPath:"node#/definitions/TokenInfo/properties/token/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data3 = coerced2;
if(data1 !== undefined){
data1["token"] = coerced2;
}
}
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.name !== undefined){
let data4 = data1.name;
const _errs12 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
let dataType3 = typeof data4;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType3 = typeof data4;
if((typeof data4 === "string") && (data4 === null)){
coerced3 = data4;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 == "number" || dataType3 == "boolean"){
coerced3 = "" + data4;
}
else if(data4 === null){
coerced3 = "";
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced3 = null;
}
else {
validate86.errors = [{instancePath:instancePath+"/token/name",schemaPath:"node#/definitions/TokenInfo/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data4 = coerced3;
if(data1 !== undefined){
data1["name"] = coerced3;
}
}
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
let data5 = data1.permissions;
const _errs15 = errors;
if(!(Array.isArray(data5))){
let dataType4 = typeof data5;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType4 = typeof data5;
if(Array.isArray(data5)){
coerced4 = data5;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "string" || dataType4 === "number"
              || dataType4 === "boolean" || data5 === null){
coerced4 = [data5];
}
else {
validate86.errors = [{instancePath:instancePath+"/token/permissions",schemaPath:"node#/definitions/TokenInfo/properties/permissions/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced4 !== undefined){
data5 = coerced4;
if(data1 !== undefined){
data1["permissions"] = coerced4;
}
}
}
if(errors === _errs15){
if(Array.isArray(data5)){
var valid3 = true;
const len0 = data5.length;
for(let i0=0; i0<len0; i0++){
let data6 = data5[i0];
const _errs17 = errors;
if(typeof data6 !== "string"){
let dataType5 = typeof data6;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType5 = typeof data6;
if(typeof data6 === "string"){
coerced5 = data6;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data6;
}
else if(data6 === null){
coerced5 = "";
}
else {
validate86.errors = [{instancePath:instancePath+"/token/permissions/" + i0,schemaPath:"node#/definitions/TokenInfo/properties/permissions/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data6 = coerced5;
if(data5 !== undefined){
data5[i0] = coerced5;
}
}
}
var valid3 = _errs17 === errors;
if(!valid3){
break;
}
}
}
}
var valid2 = _errs15 === errors;
if(valid2){
if(data1.pluginName !== undefined){
let data7 = data1.pluginName;
const _errs19 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType6 = typeof data7;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType6 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced6 = data7;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data7;
}
else if(data7 === null){
coerced6 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced6 = null;
}
else {
validate86.errors = [{instancePath:instancePath+"/token/pluginName",schemaPath:"node#/definitions/TokenInfo/properties/pluginName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data7 = coerced6;
if(data1 !== undefined){
data1["pluginName"] = coerced6;
}
}
}
var valid2 = _errs19 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.createdAt !== undefined){
let data8 = data1.createdAt;
const _errs22 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
let dataType7 = typeof data8;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType7 = typeof data8;
if(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8))){
coerced7 = data8;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 === "boolean" || data8 === null
              || (dataType7 === "string" && data8 && data8 == +data8 && !(data8 % 1))){
coerced7 = +data8;
}
else {
validate86.errors = [{instancePath:instancePath+"/token/createdAt",schemaPath:"node#/definitions/TokenInfo/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced7 !== undefined){
data8 = coerced7;
if(data1 !== undefined){
data1["createdAt"] = coerced7;
}
}
}
var valid2 = _errs22 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.deadline !== undefined){
let data9 = data1.deadline;
const _errs24 = errors;
if((!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))) && (data9 !== null)){
let dataType8 = typeof data9;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType8 = typeof data9;
if((((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9))) && (data9 === null)){
coerced8 = data9;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 === "boolean" || data9 === null
              || (dataType8 === "string" && data9 && data9 == +data9 && !(data9 % 1))){
coerced8 = +data9;
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced8 = null;
}
else {
validate86.errors = [{instancePath:instancePath+"/token/deadline",schemaPath:"node#/definitions/TokenInfo/properties/deadline/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced8 !== undefined){
data9 = coerced8;
if(data1 !== undefined){
data1["deadline"] = coerced8;
}
}
}
var valid2 = _errs24 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.lastUsedAt !== undefined){
let data10 = data1.lastUsedAt;
const _errs27 = errors;
if((!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))) && (data10 !== null)){
let dataType9 = typeof data10;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType9 = typeof data10;
if((((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10))) && (data10 === null)){
coerced9 = data10;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 === "boolean" || data10 === null
              || (dataType9 === "string" && data10 && data10 == +data10 && !(data10 % 1))){
coerced9 = +data10;
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced9 = null;
}
else {
validate86.errors = [{instancePath:instancePath+"/token/lastUsedAt",schemaPath:"node#/definitions/TokenInfo/properties/lastUsedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced9 !== undefined){
data10 = coerced9;
if(data1 !== undefined){
data1["lastUsedAt"] = coerced9;
}
}
}
var valid2 = _errs27 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.lastUsedBrowser !== undefined){
let data11 = data1.lastUsedBrowser;
const _errs30 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType10 = typeof data11;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType10 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced10 = data11;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 == "number" || dataType10 == "boolean"){
coerced10 = "" + data11;
}
else if(data11 === null){
coerced10 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced10 = null;
}
else {
validate86.errors = [{instancePath:instancePath+"/token/lastUsedBrowser",schemaPath:"node#/definitions/TokenInfo/properties/lastUsedBrowser/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced10 !== undefined){
data11 = coerced10;
if(data1 !== undefined){
data1["lastUsedBrowser"] = coerced10;
}
}
}
var valid2 = _errs30 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.lastUsedIp !== undefined){
let data12 = data1.lastUsedIp;
const _errs33 = errors;
if((typeof data12 !== "string") && (data12 !== null)){
let dataType11 = typeof data12;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType11 = typeof data12;
if((typeof data12 === "string") && (data12 === null)){
coerced11 = data12;
}
}
if(!(coerced11 !== undefined)){
if(dataType11 == "number" || dataType11 == "boolean"){
coerced11 = "" + data12;
}
else if(data12 === null){
coerced11 = "";
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced11 = null;
}
else {
validate86.errors = [{instancePath:instancePath+"/token/lastUsedIp",schemaPath:"node#/definitions/TokenInfo/properties/lastUsedIp/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced11 !== undefined){
data12 = coerced11;
if(data1 !== undefined){
data1["lastUsedIp"] = coerced11;
}
}
}
var valid2 = _errs33 === errors;
}
else {
var valid2 = true;
}
}
}
}
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
validate86.errors = [{instancePath:instancePath+"/token",schemaPath:"node#/definitions/TokenInfo/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate86.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate86.errors = vErrors;
return errors === 0;
}

export const TokenDeletedEvent = validate87;
const schema96 = {"type":"object","properties":{"type":{"type":"string"},"id":{"type":"string"}},"additionalProperties":false,"required":["type","id"]};

function validate87(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))){
validate87.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "id"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate87.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate87.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["id"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate87.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate87.errors = vErrors;
return errors === 0;
}

export const PluginsUpdatedEvent = validate88;
const schema97 = {"type":"object","properties":{"type":{"type":"string"}},"additionalProperties":false,"required":["type"]};

function validate88(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
validate88.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "type")){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate88.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
}
}
}
}
else {
validate88.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate88.errors = vErrors;
return errors === 0;
}

export const FriendGroupAddedEvent = validate89;
const schema98 = {"type":"object","properties":{"type":{"type":"string"},"friendGroup":{"$ref":"node#/definitions/FriendGroupInfo"}},"additionalProperties":false,"required":["type","friendGroup"]};
const schema99 = {"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string","nullable":true},"createdAt":{"type":"integer"},"operations":{"anyOf":[{"$ref":"node#/definitions/FriendGroupOperations","type":"object","nullable":true},{"type":"null"}]}},"required":["id","createdAt"],"additionalProperties":false};
const schema100 = {"type":"object","properties":{"view":{"type":"string","nullable":true}},"additionalProperties":false};

function validate90(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.id === undefined) && (missing0 = "id")) || ((data.createdAt === undefined) && (missing0 = "createdAt"))){
validate90.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "id") || (key0 === "title")) || (key0 === "createdAt")) || (key0 === "operations"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
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
validate90.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["id"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
let data1 = data.title;
const _errs4 = errors;
if((typeof data1 !== "string") && (data1 !== null)){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if((typeof data1 === "string") && (data1 === null)){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else if(data1 === "" || data1 === 0 || data1 === false){
coerced1 = null;
}
else {
validate90.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["title"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.createdAt !== undefined){
let data2 = data.createdAt;
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
validate90.errors = [{instancePath:instancePath+"/createdAt",schemaPath:"#/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["createdAt"] = coerced2;
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.operations !== undefined){
let data3 = data.operations;
const _errs9 = errors;
const _errs10 = errors;
let valid1 = false;
const _errs11 = errors;
if((!(data3 && typeof data3 == "object" && !Array.isArray(data3))) && (data3 !== null)){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if((data3 && typeof data3 == "object" && !Array.isArray(data3)) && (data3 === null)){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(data3 === "" || data3 === 0 || data3 === false){
coerced3 = null;
}
else {
const err0 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["operations"] = coerced3;
}
}
}
const _errs12 = errors;
if(errors === _errs12){
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
const _errs14 = errors;
for(const key1 in data3){
if(!(key1 === "view")){
delete data3[key1];
}
}
if(_errs14 === errors){
if(data3.view !== undefined){
let data4 = data3.view;
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
const err1 = {instancePath:instancePath+"/operations/view",schemaPath:"node#/definitions/FriendGroupOperations/properties/view/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data3 !== undefined){
data3["view"] = coerced4;
}
}
}
}
}
}
else {
const err2 = {instancePath:instancePath+"/operations",schemaPath:"node#/definitions/FriendGroupOperations/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
var _valid0 = _errs11 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs20 = errors;
if(data3 !== null){
let dataType5 = typeof data3;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType5 = typeof data3;
if(data3 === null){
coerced5 = data3;
}
}
if(!(coerced5 !== undefined)){
if(data3 === "" || data3 === 0 || data3 === false){
coerced5 = null;
}
else {
const err3 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced5 !== undefined){
data3 = coerced5;
if(data !== undefined){
data["operations"] = coerced5;
}
}
}
var _valid0 = _errs20 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err4 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
validate90.errors = vErrors;
return false;
}
else {
errors = _errs10;
if(vErrors !== null){
if(_errs10){
vErrors.length = _errs10;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs9 === errors;
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
else {
validate90.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate90.errors = vErrors;
return errors === 0;
}


function validate89(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.friendGroup === undefined) && (missing0 = "friendGroup"))){
validate89.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "friendGroup"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate89.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.friendGroup !== undefined){
const _errs4 = errors;
if(!(validate90(data.friendGroup, {instancePath:instancePath+"/friendGroup",parentData:data,parentDataProperty:"friendGroup",rootData}))){
vErrors = vErrors === null ? validate90.errors : vErrors.concat(validate90.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate89.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate89.errors = vErrors;
return errors === 0;
}

export const FriendGroupUpdatedEvent = validate92;
const schema101 = {"type":"object","properties":{"type":{"type":"string"},"friendGroup":{"$ref":"node#/definitions/FriendGroupInfo"}},"additionalProperties":false,"required":["type","friendGroup"]};

function validate92(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.friendGroup === undefined) && (missing0 = "friendGroup"))){
validate92.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "friendGroup"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate92.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.friendGroup !== undefined){
const _errs4 = errors;
if(!(validate90(data.friendGroup, {instancePath:instancePath+"/friendGroup",parentData:data,parentDataProperty:"friendGroup",rootData}))){
vErrors = vErrors === null ? validate90.errors : vErrors.concat(validate90.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate92.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate92.errors = vErrors;
return errors === 0;
}

export const FriendGroupDeletedEvent = validate94;
const schema102 = {"type":"object","properties":{"type":{"type":"string"},"friendGroupId":{"type":"string"}},"additionalProperties":false,"required":["type","friendGroupId"]};

function validate94(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.friendGroupId === undefined) && (missing0 = "friendGroupId"))){
validate94.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "friendGroupId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate94.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.friendGroupId !== undefined){
let data1 = data.friendGroupId;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate94.errors = [{instancePath:instancePath+"/friendGroupId",schemaPath:"#/properties/friendGroupId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["friendGroupId"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate94.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate94.errors = vErrors;
return errors === 0;
}

export const FriendshipUpdatedEvent = validate95;
const schema103 = {"type":"object","properties":{"type":{"type":"string"},"friend":{"$ref":"node#/definitions/FriendInfo"}},"additionalProperties":false,"required":["type","friend"]};
const schema104 = {"type":"object","properties":{"nodeName":{"type":"string"},"contact":{"anyOf":[{"$ref":"node#/definitions/ContactInfo","type":"object","nullable":true},{"type":"null"}]},"groups":{"type":"array","items":{"$ref":"node#/definitions/FriendGroupDetails"},"nullable":true}},"required":["nodeName"],"additionalProperties":false};
const schema105 = {"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string","nullable":true},"addedAt":{"type":"integer"},"operations":{"anyOf":[{"$ref":"node#/definitions/FriendOperations","type":"object","nullable":true},{"type":"null"}]}},"required":["id","addedAt"],"additionalProperties":false};
const schema106 = {"type":"object","properties":{"view":{"type":"string","nullable":true}},"additionalProperties":false};

function validate98(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.id === undefined) && (missing0 = "id")) || ((data.addedAt === undefined) && (missing0 = "addedAt"))){
validate98.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "id") || (key0 === "title")) || (key0 === "addedAt")) || (key0 === "operations"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
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
validate98.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["id"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
let data1 = data.title;
const _errs4 = errors;
if((typeof data1 !== "string") && (data1 !== null)){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if((typeof data1 === "string") && (data1 === null)){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else if(data1 === "" || data1 === 0 || data1 === false){
coerced1 = null;
}
else {
validate98.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["title"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.addedAt !== undefined){
let data2 = data.addedAt;
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
validate98.errors = [{instancePath:instancePath+"/addedAt",schemaPath:"#/properties/addedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["addedAt"] = coerced2;
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.operations !== undefined){
let data3 = data.operations;
const _errs9 = errors;
const _errs10 = errors;
let valid1 = false;
const _errs11 = errors;
if((!(data3 && typeof data3 == "object" && !Array.isArray(data3))) && (data3 !== null)){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if((data3 && typeof data3 == "object" && !Array.isArray(data3)) && (data3 === null)){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(data3 === "" || data3 === 0 || data3 === false){
coerced3 = null;
}
else {
const err0 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["operations"] = coerced3;
}
}
}
const _errs12 = errors;
if(errors === _errs12){
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
const _errs14 = errors;
for(const key1 in data3){
if(!(key1 === "view")){
delete data3[key1];
}
}
if(_errs14 === errors){
if(data3.view !== undefined){
let data4 = data3.view;
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
const err1 = {instancePath:instancePath+"/operations/view",schemaPath:"node#/definitions/FriendOperations/properties/view/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data3 !== undefined){
data3["view"] = coerced4;
}
}
}
}
}
}
else {
const err2 = {instancePath:instancePath+"/operations",schemaPath:"node#/definitions/FriendOperations/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
var _valid0 = _errs11 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs20 = errors;
if(data3 !== null){
let dataType5 = typeof data3;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType5 = typeof data3;
if(data3 === null){
coerced5 = data3;
}
}
if(!(coerced5 !== undefined)){
if(data3 === "" || data3 === 0 || data3 === false){
coerced5 = null;
}
else {
const err3 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced5 !== undefined){
data3 = coerced5;
if(data !== undefined){
data["operations"] = coerced5;
}
}
}
var _valid0 = _errs20 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err4 = {instancePath:instancePath+"/operations",schemaPath:"#/properties/operations/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
validate98.errors = vErrors;
return false;
}
else {
errors = _errs10;
if(vErrors !== null){
if(_errs10){
vErrors.length = _errs10;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs9 === errors;
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
else {
validate98.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate98.errors = vErrors;
return errors === 0;
}


function validate96(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.nodeName === undefined) && (missing0 = "nodeName")){
validate96.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "nodeName") || (key0 === "contact")) || (key0 === "groups"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.nodeName !== undefined){
let data0 = data.nodeName;
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
validate96.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["nodeName"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contact !== undefined){
let data1 = data.contact;
const _errs4 = errors;
const _errs5 = errors;
let valid1 = false;
const _errs6 = errors;
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
const err0 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["contact"] = coerced1;
}
}
}
if(!(validate51(data1, {instancePath:instancePath+"/contact",parentData:data,parentDataProperty:"contact",rootData}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs9 = errors;
if(data1 !== null){
let dataType2 = typeof data1;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType2 = typeof data1;
if(data1 === null){
coerced2 = data1;
}
}
if(!(coerced2 !== undefined)){
if(data1 === "" || data1 === 0 || data1 === false){
coerced2 = null;
}
else {
const err1 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(coerced2 !== undefined){
data1 = coerced2;
if(data !== undefined){
data["contact"] = coerced2;
}
}
}
var _valid0 = _errs9 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err2 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate96.errors = vErrors;
return false;
}
else {
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.groups !== undefined){
let data2 = data.groups;
const _errs11 = errors;
if((!(Array.isArray(data2))) && (data2 !== null)){
let dataType3 = typeof data2;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType3 = typeof data2;
if((Array.isArray(data2)) && (data2 === null)){
coerced3 = data2;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 === "string" || dataType3 === "number"
              || dataType3 === "boolean" || data2 === null){
coerced3 = [data2];
}
else if(data2 === "" || data2 === 0 || data2 === false){
coerced3 = null;
}
else {
validate96.errors = [{instancePath:instancePath+"/groups",schemaPath:"#/properties/groups/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced3 !== undefined){
data2 = coerced3;
if(data !== undefined){
data["groups"] = coerced3;
}
}
}
if(errors === _errs11){
if(Array.isArray(data2)){
var valid2 = true;
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
const _errs14 = errors;
if(!(validate98(data2[i0], {instancePath:instancePath+"/groups/" + i0,parentData:data2,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? validate98.errors : vErrors.concat(validate98.errors);
errors = vErrors.length;
}
var valid2 = _errs14 === errors;
if(!valid2){
break;
}
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
validate96.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate96.errors = vErrors;
return errors === 0;
}


function validate95(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.friend === undefined) && (missing0 = "friend"))){
validate95.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "friend"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate95.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.friend !== undefined){
const _errs4 = errors;
if(!(validate96(data.friend, {instancePath:instancePath+"/friend",parentData:data,parentDataProperty:"friend",rootData}))){
vErrors = vErrors === null ? validate96.errors : vErrors.concat(validate96.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate95.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate95.errors = vErrors;
return errors === 0;
}

export const AskSubjectsChangedEvent = validate101;
const schema107 = {"type":"object","properties":{"type":{"type":"string"}},"additionalProperties":false,"required":["type"]};

function validate101(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
validate101.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "type")){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate101.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
}
}
}
}
else {
validate101.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate101.errors = vErrors;
return errors === 0;
}

export const RemoteFriendshipUpdatedEvent = validate102;
const schema108 = {"type":"object","properties":{"type":{"type":"string"},"friendOf":{"$ref":"node#/definitions/FriendOfInfo"}},"additionalProperties":false,"required":["type","friendOf"]};
const schema109 = {"type":"object","properties":{"remoteNodeName":{"type":"string"},"contact":{"anyOf":[{"$ref":"node#/definitions/ContactInfo","type":"object","nullable":true},{"type":"null"}]},"groups":{"type":"array","items":{"$ref":"node#/definitions/FriendGroupDetails"},"nullable":true}},"required":["remoteNodeName"],"additionalProperties":false};

function validate103(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.remoteNodeName === undefined) && (missing0 = "remoteNodeName")){
validate103.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "remoteNodeName") || (key0 === "contact")) || (key0 === "groups"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.remoteNodeName !== undefined){
let data0 = data.remoteNodeName;
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
validate103.errors = [{instancePath:instancePath+"/remoteNodeName",schemaPath:"#/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["remoteNodeName"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contact !== undefined){
let data1 = data.contact;
const _errs4 = errors;
const _errs5 = errors;
let valid1 = false;
const _errs6 = errors;
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
const err0 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["contact"] = coerced1;
}
}
}
if(!(validate51(data1, {instancePath:instancePath+"/contact",parentData:data,parentDataProperty:"contact",rootData}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs9 = errors;
if(data1 !== null){
let dataType2 = typeof data1;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType2 = typeof data1;
if(data1 === null){
coerced2 = data1;
}
}
if(!(coerced2 !== undefined)){
if(data1 === "" || data1 === 0 || data1 === false){
coerced2 = null;
}
else {
const err1 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(coerced2 !== undefined){
data1 = coerced2;
if(data !== undefined){
data["contact"] = coerced2;
}
}
}
var _valid0 = _errs9 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err2 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate103.errors = vErrors;
return false;
}
else {
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.groups !== undefined){
let data2 = data.groups;
const _errs11 = errors;
if((!(Array.isArray(data2))) && (data2 !== null)){
let dataType3 = typeof data2;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType3 = typeof data2;
if((Array.isArray(data2)) && (data2 === null)){
coerced3 = data2;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 === "string" || dataType3 === "number"
              || dataType3 === "boolean" || data2 === null){
coerced3 = [data2];
}
else if(data2 === "" || data2 === 0 || data2 === false){
coerced3 = null;
}
else {
validate103.errors = [{instancePath:instancePath+"/groups",schemaPath:"#/properties/groups/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced3 !== undefined){
data2 = coerced3;
if(data !== undefined){
data["groups"] = coerced3;
}
}
}
if(errors === _errs11){
if(Array.isArray(data2)){
var valid2 = true;
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
const _errs14 = errors;
if(!(validate98(data2[i0], {instancePath:instancePath+"/groups/" + i0,parentData:data2,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? validate98.errors : vErrors.concat(validate98.errors);
errors = vErrors.length;
}
var valid2 = _errs14 === errors;
if(!valid2){
break;
}
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
validate103.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate103.errors = vErrors;
return errors === 0;
}


function validate102(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.friendOf === undefined) && (missing0 = "friendOf"))){
validate102.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "friendOf"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate102.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.friendOf !== undefined){
const _errs4 = errors;
if(!(validate103(data.friendOf, {instancePath:instancePath+"/friendOf",parentData:data,parentDataProperty:"friendOf",rootData}))){
vErrors = vErrors === null ? validate103.errors : vErrors.concat(validate103.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate102.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate102.errors = vErrors;
return errors === 0;
}

export const BlockedInstantAddedEvent = validate107;
const schema110 = {"type":"object","properties":{"type":{"type":"string"},"blockedInstant":{"$ref":"node#/definitions/BlockedInstantInfo"}},"additionalProperties":false,"required":["type","blockedInstant"]};
const schema111 = {"type":"object","properties":{"id":{"type":"string"},"storyType":{"type":"string"},"entryId":{"type":"string","nullable":true},"remoteNodeName":{"type":"string","nullable":true},"remotePostingId":{"type":"string","nullable":true},"remoteOwnerName":{"type":"string","nullable":true},"createdAt":{"type":"integer"},"deadline":{"type":"integer","nullable":true}},"required":["id","storyType","createdAt"],"additionalProperties":false};

function validate107(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.blockedInstant === undefined) && (missing0 = "blockedInstant"))){
validate107.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "blockedInstant"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate107.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.blockedInstant !== undefined){
let data1 = data.blockedInstant;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing1;
if((((data1.id === undefined) && (missing1 = "id")) || ((data1.storyType === undefined) && (missing1 = "storyType"))) || ((data1.createdAt === undefined) && (missing1 = "createdAt"))){
validate107.errors = [{instancePath:instancePath+"/blockedInstant",schemaPath:"node#/definitions/BlockedInstantInfo/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data1){
if(!((((((((key1 === "id") || (key1 === "storyType")) || (key1 === "entryId")) || (key1 === "remoteNodeName")) || (key1 === "remotePostingId")) || (key1 === "remoteOwnerName")) || (key1 === "createdAt")) || (key1 === "deadline"))){
delete data1[key1];
}
}
if(_errs7 === errors){
if(data1.id !== undefined){
let data2 = data1.id;
const _errs8 = errors;
if(typeof data2 !== "string"){
let dataType1 = typeof data2;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType1 = typeof data2;
if(typeof data2 === "string"){
coerced1 = data2;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data2;
}
else if(data2 === null){
coerced1 = "";
}
else {
validate107.errors = [{instancePath:instancePath+"/blockedInstant/id",schemaPath:"node#/definitions/BlockedInstantInfo/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data2 = coerced1;
if(data1 !== undefined){
data1["id"] = coerced1;
}
}
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.storyType !== undefined){
let data3 = data1.storyType;
const _errs10 = errors;
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
validate107.errors = [{instancePath:instancePath+"/blockedInstant/storyType",schemaPath:"node#/definitions/BlockedInstantInfo/properties/storyType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data3 = coerced2;
if(data1 !== undefined){
data1["storyType"] = coerced2;
}
}
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.entryId !== undefined){
let data4 = data1.entryId;
const _errs12 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
let dataType3 = typeof data4;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType3 = typeof data4;
if((typeof data4 === "string") && (data4 === null)){
coerced3 = data4;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 == "number" || dataType3 == "boolean"){
coerced3 = "" + data4;
}
else if(data4 === null){
coerced3 = "";
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced3 = null;
}
else {
validate107.errors = [{instancePath:instancePath+"/blockedInstant/entryId",schemaPath:"node#/definitions/BlockedInstantInfo/properties/entryId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data4 = coerced3;
if(data1 !== undefined){
data1["entryId"] = coerced3;
}
}
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteNodeName !== undefined){
let data5 = data1.remoteNodeName;
const _errs15 = errors;
if((typeof data5 !== "string") && (data5 !== null)){
let dataType4 = typeof data5;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType4 = typeof data5;
if((typeof data5 === "string") && (data5 === null)){
coerced4 = data5;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 == "number" || dataType4 == "boolean"){
coerced4 = "" + data5;
}
else if(data5 === null){
coerced4 = "";
}
else if(data5 === "" || data5 === 0 || data5 === false){
coerced4 = null;
}
else {
validate107.errors = [{instancePath:instancePath+"/blockedInstant/remoteNodeName",schemaPath:"node#/definitions/BlockedInstantInfo/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data5 = coerced4;
if(data1 !== undefined){
data1["remoteNodeName"] = coerced4;
}
}
}
var valid2 = _errs15 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingId !== undefined){
let data6 = data1.remotePostingId;
const _errs18 = errors;
if((typeof data6 !== "string") && (data6 !== null)){
let dataType5 = typeof data6;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType5 = typeof data6;
if((typeof data6 === "string") && (data6 === null)){
coerced5 = data6;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data6;
}
else if(data6 === null){
coerced5 = "";
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced5 = null;
}
else {
validate107.errors = [{instancePath:instancePath+"/blockedInstant/remotePostingId",schemaPath:"node#/definitions/BlockedInstantInfo/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data6 = coerced5;
if(data1 !== undefined){
data1["remotePostingId"] = coerced5;
}
}
}
var valid2 = _errs18 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteOwnerName !== undefined){
let data7 = data1.remoteOwnerName;
const _errs21 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType6 = typeof data7;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType6 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced6 = data7;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data7;
}
else if(data7 === null){
coerced6 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced6 = null;
}
else {
validate107.errors = [{instancePath:instancePath+"/blockedInstant/remoteOwnerName",schemaPath:"node#/definitions/BlockedInstantInfo/properties/remoteOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data7 = coerced6;
if(data1 !== undefined){
data1["remoteOwnerName"] = coerced6;
}
}
}
var valid2 = _errs21 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.createdAt !== undefined){
let data8 = data1.createdAt;
const _errs24 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
let dataType7 = typeof data8;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType7 = typeof data8;
if(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8))){
coerced7 = data8;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 === "boolean" || data8 === null
              || (dataType7 === "string" && data8 && data8 == +data8 && !(data8 % 1))){
coerced7 = +data8;
}
else {
validate107.errors = [{instancePath:instancePath+"/blockedInstant/createdAt",schemaPath:"node#/definitions/BlockedInstantInfo/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced7 !== undefined){
data8 = coerced7;
if(data1 !== undefined){
data1["createdAt"] = coerced7;
}
}
}
var valid2 = _errs24 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.deadline !== undefined){
let data9 = data1.deadline;
const _errs26 = errors;
if((!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))) && (data9 !== null)){
let dataType8 = typeof data9;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType8 = typeof data9;
if((((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9))) && (data9 === null)){
coerced8 = data9;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 === "boolean" || data9 === null
              || (dataType8 === "string" && data9 && data9 == +data9 && !(data9 % 1))){
coerced8 = +data9;
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced8 = null;
}
else {
validate107.errors = [{instancePath:instancePath+"/blockedInstant/deadline",schemaPath:"node#/definitions/BlockedInstantInfo/properties/deadline/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced8 !== undefined){
data9 = coerced8;
if(data1 !== undefined){
data1["deadline"] = coerced8;
}
}
}
var valid2 = _errs26 === errors;
}
else {
var valid2 = true;
}
}
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
validate107.errors = [{instancePath:instancePath+"/blockedInstant",schemaPath:"node#/definitions/BlockedInstantInfo/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate107.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate107.errors = vErrors;
return errors === 0;
}

export const BlockedInstantDeletedEvent = validate108;
const schema112 = {"type":"object","properties":{"type":{"type":"string"},"blockedInstant":{"$ref":"node#/definitions/BlockedInstantInfo"}},"additionalProperties":false,"required":["type","blockedInstant"]};

function validate108(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.blockedInstant === undefined) && (missing0 = "blockedInstant"))){
validate108.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "blockedInstant"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate108.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.blockedInstant !== undefined){
let data1 = data.blockedInstant;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing1;
if((((data1.id === undefined) && (missing1 = "id")) || ((data1.storyType === undefined) && (missing1 = "storyType"))) || ((data1.createdAt === undefined) && (missing1 = "createdAt"))){
validate108.errors = [{instancePath:instancePath+"/blockedInstant",schemaPath:"node#/definitions/BlockedInstantInfo/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data1){
if(!((((((((key1 === "id") || (key1 === "storyType")) || (key1 === "entryId")) || (key1 === "remoteNodeName")) || (key1 === "remotePostingId")) || (key1 === "remoteOwnerName")) || (key1 === "createdAt")) || (key1 === "deadline"))){
delete data1[key1];
}
}
if(_errs7 === errors){
if(data1.id !== undefined){
let data2 = data1.id;
const _errs8 = errors;
if(typeof data2 !== "string"){
let dataType1 = typeof data2;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType1 = typeof data2;
if(typeof data2 === "string"){
coerced1 = data2;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data2;
}
else if(data2 === null){
coerced1 = "";
}
else {
validate108.errors = [{instancePath:instancePath+"/blockedInstant/id",schemaPath:"node#/definitions/BlockedInstantInfo/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data2 = coerced1;
if(data1 !== undefined){
data1["id"] = coerced1;
}
}
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.storyType !== undefined){
let data3 = data1.storyType;
const _errs10 = errors;
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
validate108.errors = [{instancePath:instancePath+"/blockedInstant/storyType",schemaPath:"node#/definitions/BlockedInstantInfo/properties/storyType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data3 = coerced2;
if(data1 !== undefined){
data1["storyType"] = coerced2;
}
}
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.entryId !== undefined){
let data4 = data1.entryId;
const _errs12 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
let dataType3 = typeof data4;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType3 = typeof data4;
if((typeof data4 === "string") && (data4 === null)){
coerced3 = data4;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 == "number" || dataType3 == "boolean"){
coerced3 = "" + data4;
}
else if(data4 === null){
coerced3 = "";
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced3 = null;
}
else {
validate108.errors = [{instancePath:instancePath+"/blockedInstant/entryId",schemaPath:"node#/definitions/BlockedInstantInfo/properties/entryId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data4 = coerced3;
if(data1 !== undefined){
data1["entryId"] = coerced3;
}
}
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteNodeName !== undefined){
let data5 = data1.remoteNodeName;
const _errs15 = errors;
if((typeof data5 !== "string") && (data5 !== null)){
let dataType4 = typeof data5;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType4 = typeof data5;
if((typeof data5 === "string") && (data5 === null)){
coerced4 = data5;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 == "number" || dataType4 == "boolean"){
coerced4 = "" + data5;
}
else if(data5 === null){
coerced4 = "";
}
else if(data5 === "" || data5 === 0 || data5 === false){
coerced4 = null;
}
else {
validate108.errors = [{instancePath:instancePath+"/blockedInstant/remoteNodeName",schemaPath:"node#/definitions/BlockedInstantInfo/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data5 = coerced4;
if(data1 !== undefined){
data1["remoteNodeName"] = coerced4;
}
}
}
var valid2 = _errs15 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingId !== undefined){
let data6 = data1.remotePostingId;
const _errs18 = errors;
if((typeof data6 !== "string") && (data6 !== null)){
let dataType5 = typeof data6;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType5 = typeof data6;
if((typeof data6 === "string") && (data6 === null)){
coerced5 = data6;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data6;
}
else if(data6 === null){
coerced5 = "";
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced5 = null;
}
else {
validate108.errors = [{instancePath:instancePath+"/blockedInstant/remotePostingId",schemaPath:"node#/definitions/BlockedInstantInfo/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data6 = coerced5;
if(data1 !== undefined){
data1["remotePostingId"] = coerced5;
}
}
}
var valid2 = _errs18 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteOwnerName !== undefined){
let data7 = data1.remoteOwnerName;
const _errs21 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType6 = typeof data7;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType6 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced6 = data7;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data7;
}
else if(data7 === null){
coerced6 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced6 = null;
}
else {
validate108.errors = [{instancePath:instancePath+"/blockedInstant/remoteOwnerName",schemaPath:"node#/definitions/BlockedInstantInfo/properties/remoteOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data7 = coerced6;
if(data1 !== undefined){
data1["remoteOwnerName"] = coerced6;
}
}
}
var valid2 = _errs21 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.createdAt !== undefined){
let data8 = data1.createdAt;
const _errs24 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
let dataType7 = typeof data8;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType7 = typeof data8;
if(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8))){
coerced7 = data8;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 === "boolean" || data8 === null
              || (dataType7 === "string" && data8 && data8 == +data8 && !(data8 % 1))){
coerced7 = +data8;
}
else {
validate108.errors = [{instancePath:instancePath+"/blockedInstant/createdAt",schemaPath:"node#/definitions/BlockedInstantInfo/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced7 !== undefined){
data8 = coerced7;
if(data1 !== undefined){
data1["createdAt"] = coerced7;
}
}
}
var valid2 = _errs24 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.deadline !== undefined){
let data9 = data1.deadline;
const _errs26 = errors;
if((!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))) && (data9 !== null)){
let dataType8 = typeof data9;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType8 = typeof data9;
if((((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9))) && (data9 === null)){
coerced8 = data9;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 === "boolean" || data9 === null
              || (dataType8 === "string" && data9 && data9 == +data9 && !(data9 % 1))){
coerced8 = +data9;
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced8 = null;
}
else {
validate108.errors = [{instancePath:instancePath+"/blockedInstant/deadline",schemaPath:"node#/definitions/BlockedInstantInfo/properties/deadline/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced8 !== undefined){
data9 = coerced8;
if(data1 !== undefined){
data1["deadline"] = coerced8;
}
}
}
var valid2 = _errs26 === errors;
}
else {
var valid2 = true;
}
}
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
validate108.errors = [{instancePath:instancePath+"/blockedInstant",schemaPath:"node#/definitions/BlockedInstantInfo/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate108.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate108.errors = vErrors;
return errors === 0;
}

export const BlockedUserAddedEvent = validate109;
const schema114 = {"type":"object","properties":{"type":{"type":"string"},"blockedUser":{"$ref":"node#/definitions/BlockedUserInfo"}},"additionalProperties":false,"required":["type","blockedUser"]};
const schema115 = {"type":"object","properties":{"id":{"type":"string"},"blockedOperation":{"type":"string"},"nodeName":{"type":"string"},"contact":{"anyOf":[{"$ref":"node#/definitions/ContactInfo","type":"object","nullable":true},{"type":"null"}]},"entryId":{"type":"string","nullable":true},"entryNodeName":{"type":"string","nullable":true},"entryPostingId":{"type":"string","nullable":true},"createdAt":{"type":"integer"},"deadline":{"type":"integer","nullable":true},"reasonSrc":{"type":"string","nullable":true},"reasonSrcFormat":{"type":"string","nullable":true},"reason":{"type":"string","nullable":true}},"required":["id","blockedOperation","nodeName","createdAt"],"additionalProperties":false};

function validate110(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.id === undefined) && (missing0 = "id")) || ((data.blockedOperation === undefined) && (missing0 = "blockedOperation"))) || ((data.nodeName === undefined) && (missing0 = "nodeName"))) || ((data.createdAt === undefined) && (missing0 = "createdAt"))){
validate110.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func2.call(schema115.properties, key0))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
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
validate110.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["id"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.blockedOperation !== undefined){
let data1 = data.blockedOperation;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate110.errors = [{instancePath:instancePath+"/blockedOperation",schemaPath:"#/properties/blockedOperation/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["blockedOperation"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeName !== undefined){
let data2 = data.nodeName;
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
validate110.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["nodeName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contact !== undefined){
let data3 = data.contact;
const _errs8 = errors;
const _errs9 = errors;
let valid1 = false;
const _errs10 = errors;
if((!(data3 && typeof data3 == "object" && !Array.isArray(data3))) && (data3 !== null)){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if((data3 && typeof data3 == "object" && !Array.isArray(data3)) && (data3 === null)){
coerced3 = data3;
}
}
if(!(coerced3 !== undefined)){
if(data3 === "" || data3 === 0 || data3 === false){
coerced3 = null;
}
else {
const err0 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["contact"] = coerced3;
}
}
}
if(!(validate51(data3, {instancePath:instancePath+"/contact",parentData:data,parentDataProperty:"contact",rootData}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
var _valid0 = _errs10 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs13 = errors;
if(data3 !== null){
let dataType4 = typeof data3;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType4 = typeof data3;
if(data3 === null){
coerced4 = data3;
}
}
if(!(coerced4 !== undefined)){
if(data3 === "" || data3 === 0 || data3 === false){
coerced4 = null;
}
else {
const err1 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(coerced4 !== undefined){
data3 = coerced4;
if(data !== undefined){
data["contact"] = coerced4;
}
}
}
var _valid0 = _errs13 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err2 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate110.errors = vErrors;
return false;
}
else {
errors = _errs9;
if(vErrors !== null){
if(_errs9){
vErrors.length = _errs9;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.entryId !== undefined){
let data4 = data.entryId;
const _errs15 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
let dataType5 = typeof data4;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType5 = typeof data4;
if((typeof data4 === "string") && (data4 === null)){
coerced5 = data4;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data4;
}
else if(data4 === null){
coerced5 = "";
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced5 = null;
}
else {
validate110.errors = [{instancePath:instancePath+"/entryId",schemaPath:"#/properties/entryId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data4 = coerced5;
if(data !== undefined){
data["entryId"] = coerced5;
}
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.entryNodeName !== undefined){
let data5 = data.entryNodeName;
const _errs18 = errors;
if((typeof data5 !== "string") && (data5 !== null)){
let dataType6 = typeof data5;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType6 = typeof data5;
if((typeof data5 === "string") && (data5 === null)){
coerced6 = data5;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data5;
}
else if(data5 === null){
coerced6 = "";
}
else if(data5 === "" || data5 === 0 || data5 === false){
coerced6 = null;
}
else {
validate110.errors = [{instancePath:instancePath+"/entryNodeName",schemaPath:"#/properties/entryNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data5 = coerced6;
if(data !== undefined){
data["entryNodeName"] = coerced6;
}
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.entryPostingId !== undefined){
let data6 = data.entryPostingId;
const _errs21 = errors;
if((typeof data6 !== "string") && (data6 !== null)){
let dataType7 = typeof data6;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType7 = typeof data6;
if((typeof data6 === "string") && (data6 === null)){
coerced7 = data6;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data6;
}
else if(data6 === null){
coerced7 = "";
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced7 = null;
}
else {
validate110.errors = [{instancePath:instancePath+"/entryPostingId",schemaPath:"#/properties/entryPostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced7 !== undefined){
data6 = coerced7;
if(data !== undefined){
data["entryPostingId"] = coerced7;
}
}
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.createdAt !== undefined){
let data7 = data.createdAt;
const _errs24 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
let dataType8 = typeof data7;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType8 = typeof data7;
if(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7))){
coerced8 = data7;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 === "boolean" || data7 === null
              || (dataType8 === "string" && data7 && data7 == +data7 && !(data7 % 1))){
coerced8 = +data7;
}
else {
validate110.errors = [{instancePath:instancePath+"/createdAt",schemaPath:"#/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced8 !== undefined){
data7 = coerced8;
if(data !== undefined){
data["createdAt"] = coerced8;
}
}
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.deadline !== undefined){
let data8 = data.deadline;
const _errs26 = errors;
if((!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))) && (data8 !== null)){
let dataType9 = typeof data8;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType9 = typeof data8;
if((((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8))) && (data8 === null)){
coerced9 = data8;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 === "boolean" || data8 === null
              || (dataType9 === "string" && data8 && data8 == +data8 && !(data8 % 1))){
coerced9 = +data8;
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced9 = null;
}
else {
validate110.errors = [{instancePath:instancePath+"/deadline",schemaPath:"#/properties/deadline/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced9 !== undefined){
data8 = coerced9;
if(data !== undefined){
data["deadline"] = coerced9;
}
}
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reasonSrc !== undefined){
let data9 = data.reasonSrc;
const _errs29 = errors;
if((typeof data9 !== "string") && (data9 !== null)){
let dataType10 = typeof data9;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType10 = typeof data9;
if((typeof data9 === "string") && (data9 === null)){
coerced10 = data9;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 == "number" || dataType10 == "boolean"){
coerced10 = "" + data9;
}
else if(data9 === null){
coerced10 = "";
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced10 = null;
}
else {
validate110.errors = [{instancePath:instancePath+"/reasonSrc",schemaPath:"#/properties/reasonSrc/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced10 !== undefined){
data9 = coerced10;
if(data !== undefined){
data["reasonSrc"] = coerced10;
}
}
}
var valid0 = _errs29 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reasonSrcFormat !== undefined){
let data10 = data.reasonSrcFormat;
const _errs32 = errors;
if((typeof data10 !== "string") && (data10 !== null)){
let dataType11 = typeof data10;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType11 = typeof data10;
if((typeof data10 === "string") && (data10 === null)){
coerced11 = data10;
}
}
if(!(coerced11 !== undefined)){
if(dataType11 == "number" || dataType11 == "boolean"){
coerced11 = "" + data10;
}
else if(data10 === null){
coerced11 = "";
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced11 = null;
}
else {
validate110.errors = [{instancePath:instancePath+"/reasonSrcFormat",schemaPath:"#/properties/reasonSrcFormat/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced11 !== undefined){
data10 = coerced11;
if(data !== undefined){
data["reasonSrcFormat"] = coerced11;
}
}
}
var valid0 = _errs32 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reason !== undefined){
let data11 = data.reason;
const _errs35 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType12 = typeof data11;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType12 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced12 = data11;
}
}
if(!(coerced12 !== undefined)){
if(dataType12 == "number" || dataType12 == "boolean"){
coerced12 = "" + data11;
}
else if(data11 === null){
coerced12 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced12 = null;
}
else {
validate110.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced12 !== undefined){
data11 = coerced12;
if(data !== undefined){
data["reason"] = coerced12;
}
}
}
var valid0 = _errs35 === errors;
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
}
}
}
}
}
}
else {
validate110.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate110.errors = vErrors;
return errors === 0;
}


function validate109(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.blockedUser === undefined) && (missing0 = "blockedUser"))){
validate109.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "blockedUser"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate109.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.blockedUser !== undefined){
const _errs4 = errors;
if(!(validate110(data.blockedUser, {instancePath:instancePath+"/blockedUser",parentData:data,parentDataProperty:"blockedUser",rootData}))){
vErrors = vErrors === null ? validate110.errors : vErrors.concat(validate110.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate109.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate109.errors = vErrors;
return errors === 0;
}

export const BlockedUserDeletedEvent = validate113;
const schema116 = {"type":"object","properties":{"type":{"type":"string"},"blockedUser":{"$ref":"node#/definitions/BlockedUserInfo"}},"additionalProperties":false,"required":["type","blockedUser"]};

function validate113(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.blockedUser === undefined) && (missing0 = "blockedUser"))){
validate113.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "blockedUser"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate113.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.blockedUser !== undefined){
const _errs4 = errors;
if(!(validate110(data.blockedUser, {instancePath:instancePath+"/blockedUser",parentData:data,parentDataProperty:"blockedUser",rootData}))){
vErrors = vErrors === null ? validate110.errors : vErrors.concat(validate110.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate113.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate113.errors = vErrors;
return errors === 0;
}

export const BlockedByUserAddedEvent = validate115;
const schema117 = {"type":"object","properties":{"type":{"type":"string"},"blockedByUser":{"$ref":"node#/definitions/BlockedByUserInfo"}},"additionalProperties":false,"required":["type","blockedByUser"]};
const schema118 = {"type":"object","properties":{"id":{"type":"string"},"blockedOperation":{"type":"string"},"contact":{"anyOf":[{"$ref":"node#/definitions/ContactInfo","type":"object","nullable":true},{"type":"null"}]},"nodeName":{"type":"string"},"postingId":{"type":"string","nullable":true},"createdAt":{"type":"integer"},"deadline":{"type":"integer","nullable":true},"reason":{"type":"string","nullable":true}},"required":["id","blockedOperation","nodeName","createdAt"],"additionalProperties":false};

function validate116(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.id === undefined) && (missing0 = "id")) || ((data.blockedOperation === undefined) && (missing0 = "blockedOperation"))) || ((data.nodeName === undefined) && (missing0 = "nodeName"))) || ((data.createdAt === undefined) && (missing0 = "createdAt"))){
validate116.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "id") || (key0 === "blockedOperation")) || (key0 === "contact")) || (key0 === "nodeName")) || (key0 === "postingId")) || (key0 === "createdAt")) || (key0 === "deadline")) || (key0 === "reason"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
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
validate116.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["id"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.blockedOperation !== undefined){
let data1 = data.blockedOperation;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate116.errors = [{instancePath:instancePath+"/blockedOperation",schemaPath:"#/properties/blockedOperation/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["blockedOperation"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contact !== undefined){
let data2 = data.contact;
const _errs6 = errors;
const _errs7 = errors;
let valid1 = false;
const _errs8 = errors;
if((!(data2 && typeof data2 == "object" && !Array.isArray(data2))) && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((data2 && typeof data2 == "object" && !Array.isArray(data2)) && (data2 === null)){
coerced2 = data2;
}
}
if(!(coerced2 !== undefined)){
if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
const err0 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["contact"] = coerced2;
}
}
}
if(!(validate51(data2, {instancePath:instancePath+"/contact",parentData:data,parentDataProperty:"contact",rootData}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
var _valid0 = _errs8 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs11 = errors;
if(data2 !== null){
let dataType3 = typeof data2;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType3 = typeof data2;
if(data2 === null){
coerced3 = data2;
}
}
if(!(coerced3 !== undefined)){
if(data2 === "" || data2 === 0 || data2 === false){
coerced3 = null;
}
else {
const err1 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(coerced3 !== undefined){
data2 = coerced3;
if(data !== undefined){
data["contact"] = coerced3;
}
}
}
var _valid0 = _errs11 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err2 = {instancePath:instancePath+"/contact",schemaPath:"#/properties/contact/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate116.errors = vErrors;
return false;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeName !== undefined){
let data3 = data.nodeName;
const _errs13 = errors;
if(typeof data3 !== "string"){
let dataType4 = typeof data3;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType4 = typeof data3;
if(typeof data3 === "string"){
coerced4 = data3;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 == "number" || dataType4 == "boolean"){
coerced4 = "" + data3;
}
else if(data3 === null){
coerced4 = "";
}
else {
validate116.errors = [{instancePath:instancePath+"/nodeName",schemaPath:"#/properties/nodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data3 = coerced4;
if(data !== undefined){
data["nodeName"] = coerced4;
}
}
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postingId !== undefined){
let data4 = data.postingId;
const _errs15 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
let dataType5 = typeof data4;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType5 = typeof data4;
if((typeof data4 === "string") && (data4 === null)){
coerced5 = data4;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data4;
}
else if(data4 === null){
coerced5 = "";
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced5 = null;
}
else {
validate116.errors = [{instancePath:instancePath+"/postingId",schemaPath:"#/properties/postingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data4 = coerced5;
if(data !== undefined){
data["postingId"] = coerced5;
}
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.createdAt !== undefined){
let data5 = data.createdAt;
const _errs18 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
let dataType6 = typeof data5;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType6 = typeof data5;
if(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5))){
coerced6 = data5;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 === "boolean" || data5 === null
              || (dataType6 === "string" && data5 && data5 == +data5 && !(data5 % 1))){
coerced6 = +data5;
}
else {
validate116.errors = [{instancePath:instancePath+"/createdAt",schemaPath:"#/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced6 !== undefined){
data5 = coerced6;
if(data !== undefined){
data["createdAt"] = coerced6;
}
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.deadline !== undefined){
let data6 = data.deadline;
const _errs20 = errors;
if((!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))) && (data6 !== null)){
let dataType7 = typeof data6;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType7 = typeof data6;
if((((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6))) && (data6 === null)){
coerced7 = data6;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 === "boolean" || data6 === null
              || (dataType7 === "string" && data6 && data6 == +data6 && !(data6 % 1))){
coerced7 = +data6;
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced7 = null;
}
else {
validate116.errors = [{instancePath:instancePath+"/deadline",schemaPath:"#/properties/deadline/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced7 !== undefined){
data6 = coerced7;
if(data !== undefined){
data["deadline"] = coerced7;
}
}
}
var valid0 = _errs20 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reason !== undefined){
let data7 = data.reason;
const _errs23 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType8 = typeof data7;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType8 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced8 = data7;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 == "number" || dataType8 == "boolean"){
coerced8 = "" + data7;
}
else if(data7 === null){
coerced8 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced8 = null;
}
else {
validate116.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced8 !== undefined){
data7 = coerced8;
if(data !== undefined){
data["reason"] = coerced8;
}
}
}
var valid0 = _errs23 === errors;
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
}
}
else {
validate116.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate116.errors = vErrors;
return errors === 0;
}


function validate115(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.blockedByUser === undefined) && (missing0 = "blockedByUser"))){
validate115.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "blockedByUser"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate115.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.blockedByUser !== undefined){
const _errs4 = errors;
if(!(validate116(data.blockedByUser, {instancePath:instancePath+"/blockedByUser",parentData:data,parentDataProperty:"blockedByUser",rootData}))){
vErrors = vErrors === null ? validate116.errors : vErrors.concat(validate116.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate115.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate115.errors = vErrors;
return errors === 0;
}

export const BlockedByUserDeletedEvent = validate119;
const schema119 = {"type":"object","properties":{"type":{"type":"string"},"blockedByUser":{"$ref":"node#/definitions/BlockedByUserInfo"}},"additionalProperties":false,"required":["type","blockedByUser"]};

function validate119(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.blockedByUser === undefined) && (missing0 = "blockedByUser"))){
validate119.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "blockedByUser"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate119.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.blockedByUser !== undefined){
const _errs4 = errors;
if(!(validate116(data.blockedByUser, {instancePath:instancePath+"/blockedByUser",parentData:data,parentDataProperty:"blockedByUser",rootData}))){
vErrors = vErrors === null ? validate116.errors : vErrors.concat(validate116.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate119.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate119.errors = vErrors;
return errors === 0;
}

export const FeedSheriffDataUpdatedEvent = validate121;
const schema120 = {"type":"object","properties":{"type":{"type":"string"},"feedName":{"type":"string"},"sheriffs":{"type":"array","items":{"type":"string"},"nullable":true},"sheriffMarks":{"type":"array","items":{"$ref":"node#/definitions/SheriffMark"},"nullable":true}},"additionalProperties":false,"required":["type","feedName"]};

function validate121(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.feedName === undefined) && (missing0 = "feedName"))){
validate121.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "feedName")) || (key0 === "sheriffs")) || (key0 === "sheriffMarks"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate121.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.feedName !== undefined){
let data1 = data.feedName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate121.errors = [{instancePath:instancePath+"/feedName",schemaPath:"#/properties/feedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["feedName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sheriffs !== undefined){
let data2 = data.sheriffs;
const _errs6 = errors;
if((!(Array.isArray(data2))) && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((Array.isArray(data2)) && (data2 === null)){
coerced2 = data2;
}
}
if(!(coerced2 !== undefined)){
if(dataType2 === "string" || dataType2 === "number"
              || dataType2 === "boolean" || data2 === null){
coerced2 = [data2];
}
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate121.errors = [{instancePath:instancePath+"/sheriffs",schemaPath:"#/properties/sheriffs/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["sheriffs"] = coerced2;
}
}
}
if(errors === _errs6){
if(Array.isArray(data2)){
var valid1 = true;
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
const _errs9 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data3) && data3.length == 1){
data3 = data3[0];
dataType3 = typeof data3;
if(typeof data3 === "string"){
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
else {
validate121.errors = [{instancePath:instancePath+"/sheriffs/" + i0,schemaPath:"#/properties/sheriffs/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data2 !== undefined){
data2[i0] = coerced3;
}
}
}
var valid1 = _errs9 === errors;
if(!valid1){
break;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sheriffMarks !== undefined){
let data4 = data.sheriffMarks;
const _errs11 = errors;
if((!(Array.isArray(data4))) && (data4 !== null)){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if((Array.isArray(data4)) && (data4 === null)){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 === "string" || dataType4 === "number"
              || dataType4 === "boolean" || data4 === null){
coerced4 = [data4];
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced4 = null;
}
else {
validate121.errors = [{instancePath:instancePath+"/sheriffMarks",schemaPath:"#/properties/sheriffMarks/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["sheriffMarks"] = coerced4;
}
}
}
if(errors === _errs11){
if(Array.isArray(data4)){
var valid2 = true;
const len1 = data4.length;
for(let i1=0; i1<len1; i1++){
let data5 = data4[i1];
const _errs14 = errors;
const _errs15 = errors;
if(errors === _errs15){
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
let missing1;
if((data5.sheriffName === undefined) && (missing1 = "sheriffName")){
validate121.errors = [{instancePath:instancePath+"/sheriffMarks/" + i1,schemaPath:"node#/definitions/SheriffMark/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs17 = errors;
for(const key1 in data5){
if(!(key1 === "sheriffName")){
delete data5[key1];
}
}
if(_errs17 === errors){
if(data5.sheriffName !== undefined){
let data6 = data5.sheriffName;
if(typeof data6 !== "string"){
let dataType5 = typeof data6;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType5 = typeof data6;
if(typeof data6 === "string"){
coerced5 = data6;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data6;
}
else if(data6 === null){
coerced5 = "";
}
else {
validate121.errors = [{instancePath:instancePath+"/sheriffMarks/" + i1+"/sheriffName",schemaPath:"node#/definitions/SheriffMark/properties/sheriffName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data6 = coerced5;
if(data5 !== undefined){
data5["sheriffName"] = coerced5;
}
}
}
}
}
}
}
else {
validate121.errors = [{instancePath:instancePath+"/sheriffMarks/" + i1,schemaPath:"node#/definitions/SheriffMark/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid2 = _errs14 === errors;
if(!valid2){
break;
}
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
}
else {
validate121.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate121.errors = vErrors;
return errors === 0;
}

export const SheriffComplainGroupAddedEvent = validate122;
const schema122 = {"type":"object","properties":{"type":{"type":"string"},"group":{"$ref":"node#/definitions/SheriffComplainGroupInfo"}},"additionalProperties":false,"required":["type","group"]};
const schema123 = {"type":"object","properties":{"id":{"type":"string"},"remoteNodeName":{"type":"string"},"remoteNodeFullName":{"type":"string","nullable":true},"remoteFeedName":{"type":"string"},"remotePostingId":{"type":"string","nullable":true},"remotePostingRevisionId":{"type":"string","nullable":true},"remotePostingOwnerName":{"type":"string","nullable":true},"remotePostingOwnerFullName":{"type":"string","nullable":true},"remotePostingOwnerGender":{"type":"string","nullable":true},"remotePostingHeading":{"type":"string","nullable":true},"remoteCommentId":{"type":"string","nullable":true},"remoteCommentRevisionId":{"type":"string","nullable":true},"remoteCommentOwnerName":{"type":"string","nullable":true},"remoteCommentOwnerFullName":{"type":"string","nullable":true},"remoteCommentOwnerGender":{"type":"string","nullable":true},"remoteCommentHeading":{"type":"string","nullable":true},"createdAt":{"type":"integer"},"moment":{"type":"integer"},"status":{"type":"string"},"decisionCode":{"type":"string","nullable":true},"decisionDetails":{"type":"string","nullable":true},"decidedAt":{"type":"integer","nullable":true},"anonymous":{"type":"boolean","nullable":true}},"required":["id","remoteNodeName","remoteFeedName","createdAt","moment","status"],"additionalProperties":false};

function validate122(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.group === undefined) && (missing0 = "group"))){
validate122.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "group"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate122.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.group !== undefined){
let data1 = data.group;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing1;
if(((((((data1.id === undefined) && (missing1 = "id")) || ((data1.remoteNodeName === undefined) && (missing1 = "remoteNodeName"))) || ((data1.remoteFeedName === undefined) && (missing1 = "remoteFeedName"))) || ((data1.createdAt === undefined) && (missing1 = "createdAt"))) || ((data1.moment === undefined) && (missing1 = "moment"))) || ((data1.status === undefined) && (missing1 = "status"))){
validate122.errors = [{instancePath:instancePath+"/group",schemaPath:"node#/definitions/SheriffComplainGroupInfo/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data1){
if(!(func2.call(schema123.properties, key1))){
delete data1[key1];
}
}
if(_errs7 === errors){
if(data1.id !== undefined){
let data2 = data1.id;
const _errs8 = errors;
if(typeof data2 !== "string"){
let dataType1 = typeof data2;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType1 = typeof data2;
if(typeof data2 === "string"){
coerced1 = data2;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data2;
}
else if(data2 === null){
coerced1 = "";
}
else {
validate122.errors = [{instancePath:instancePath+"/group/id",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data2 = coerced1;
if(data1 !== undefined){
data1["id"] = coerced1;
}
}
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteNodeName !== undefined){
let data3 = data1.remoteNodeName;
const _errs10 = errors;
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
validate122.errors = [{instancePath:instancePath+"/group/remoteNodeName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data3 = coerced2;
if(data1 !== undefined){
data1["remoteNodeName"] = coerced2;
}
}
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteNodeFullName !== undefined){
let data4 = data1.remoteNodeFullName;
const _errs12 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
let dataType3 = typeof data4;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType3 = typeof data4;
if((typeof data4 === "string") && (data4 === null)){
coerced3 = data4;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 == "number" || dataType3 == "boolean"){
coerced3 = "" + data4;
}
else if(data4 === null){
coerced3 = "";
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced3 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remoteNodeFullName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteNodeFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data4 = coerced3;
if(data1 !== undefined){
data1["remoteNodeFullName"] = coerced3;
}
}
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteFeedName !== undefined){
let data5 = data1.remoteFeedName;
const _errs15 = errors;
if(typeof data5 !== "string"){
let dataType4 = typeof data5;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType4 = typeof data5;
if(typeof data5 === "string"){
coerced4 = data5;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 == "number" || dataType4 == "boolean"){
coerced4 = "" + data5;
}
else if(data5 === null){
coerced4 = "";
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remoteFeedName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteFeedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data5 = coerced4;
if(data1 !== undefined){
data1["remoteFeedName"] = coerced4;
}
}
}
var valid2 = _errs15 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingId !== undefined){
let data6 = data1.remotePostingId;
const _errs17 = errors;
if((typeof data6 !== "string") && (data6 !== null)){
let dataType5 = typeof data6;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType5 = typeof data6;
if((typeof data6 === "string") && (data6 === null)){
coerced5 = data6;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data6;
}
else if(data6 === null){
coerced5 = "";
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced5 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remotePostingId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data6 = coerced5;
if(data1 !== undefined){
data1["remotePostingId"] = coerced5;
}
}
}
var valid2 = _errs17 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingRevisionId !== undefined){
let data7 = data1.remotePostingRevisionId;
const _errs20 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType6 = typeof data7;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType6 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced6 = data7;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data7;
}
else if(data7 === null){
coerced6 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced6 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remotePostingRevisionId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingRevisionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data7 = coerced6;
if(data1 !== undefined){
data1["remotePostingRevisionId"] = coerced6;
}
}
}
var valid2 = _errs20 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingOwnerName !== undefined){
let data8 = data1.remotePostingOwnerName;
const _errs23 = errors;
if((typeof data8 !== "string") && (data8 !== null)){
let dataType7 = typeof data8;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType7 = typeof data8;
if((typeof data8 === "string") && (data8 === null)){
coerced7 = data8;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data8;
}
else if(data8 === null){
coerced7 = "";
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced7 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remotePostingOwnerName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced7 !== undefined){
data8 = coerced7;
if(data1 !== undefined){
data1["remotePostingOwnerName"] = coerced7;
}
}
}
var valid2 = _errs23 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingOwnerFullName !== undefined){
let data9 = data1.remotePostingOwnerFullName;
const _errs26 = errors;
if((typeof data9 !== "string") && (data9 !== null)){
let dataType8 = typeof data9;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType8 = typeof data9;
if((typeof data9 === "string") && (data9 === null)){
coerced8 = data9;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 == "number" || dataType8 == "boolean"){
coerced8 = "" + data9;
}
else if(data9 === null){
coerced8 = "";
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced8 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remotePostingOwnerFullName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingOwnerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced8 !== undefined){
data9 = coerced8;
if(data1 !== undefined){
data1["remotePostingOwnerFullName"] = coerced8;
}
}
}
var valid2 = _errs26 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingOwnerGender !== undefined){
let data10 = data1.remotePostingOwnerGender;
const _errs29 = errors;
if((typeof data10 !== "string") && (data10 !== null)){
let dataType9 = typeof data10;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType9 = typeof data10;
if((typeof data10 === "string") && (data10 === null)){
coerced9 = data10;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 == "number" || dataType9 == "boolean"){
coerced9 = "" + data10;
}
else if(data10 === null){
coerced9 = "";
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced9 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remotePostingOwnerGender",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingOwnerGender/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced9 !== undefined){
data10 = coerced9;
if(data1 !== undefined){
data1["remotePostingOwnerGender"] = coerced9;
}
}
}
var valid2 = _errs29 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingHeading !== undefined){
let data11 = data1.remotePostingHeading;
const _errs32 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType10 = typeof data11;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType10 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced10 = data11;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 == "number" || dataType10 == "boolean"){
coerced10 = "" + data11;
}
else if(data11 === null){
coerced10 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced10 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remotePostingHeading",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingHeading/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced10 !== undefined){
data11 = coerced10;
if(data1 !== undefined){
data1["remotePostingHeading"] = coerced10;
}
}
}
var valid2 = _errs32 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentId !== undefined){
let data12 = data1.remoteCommentId;
const _errs35 = errors;
if((typeof data12 !== "string") && (data12 !== null)){
let dataType11 = typeof data12;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType11 = typeof data12;
if((typeof data12 === "string") && (data12 === null)){
coerced11 = data12;
}
}
if(!(coerced11 !== undefined)){
if(dataType11 == "number" || dataType11 == "boolean"){
coerced11 = "" + data12;
}
else if(data12 === null){
coerced11 = "";
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced11 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remoteCommentId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced11 !== undefined){
data12 = coerced11;
if(data1 !== undefined){
data1["remoteCommentId"] = coerced11;
}
}
}
var valid2 = _errs35 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentRevisionId !== undefined){
let data13 = data1.remoteCommentRevisionId;
const _errs38 = errors;
if((typeof data13 !== "string") && (data13 !== null)){
let dataType12 = typeof data13;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType12 = typeof data13;
if((typeof data13 === "string") && (data13 === null)){
coerced12 = data13;
}
}
if(!(coerced12 !== undefined)){
if(dataType12 == "number" || dataType12 == "boolean"){
coerced12 = "" + data13;
}
else if(data13 === null){
coerced12 = "";
}
else if(data13 === "" || data13 === 0 || data13 === false){
coerced12 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remoteCommentRevisionId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentRevisionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced12 !== undefined){
data13 = coerced12;
if(data1 !== undefined){
data1["remoteCommentRevisionId"] = coerced12;
}
}
}
var valid2 = _errs38 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentOwnerName !== undefined){
let data14 = data1.remoteCommentOwnerName;
const _errs41 = errors;
if((typeof data14 !== "string") && (data14 !== null)){
let dataType13 = typeof data14;
let coerced13 = undefined;
if(dataType13 == 'object' && Array.isArray(data14) && data14.length == 1){
data14 = data14[0];
dataType13 = typeof data14;
if((typeof data14 === "string") && (data14 === null)){
coerced13 = data14;
}
}
if(!(coerced13 !== undefined)){
if(dataType13 == "number" || dataType13 == "boolean"){
coerced13 = "" + data14;
}
else if(data14 === null){
coerced13 = "";
}
else if(data14 === "" || data14 === 0 || data14 === false){
coerced13 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remoteCommentOwnerName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced13 !== undefined){
data14 = coerced13;
if(data1 !== undefined){
data1["remoteCommentOwnerName"] = coerced13;
}
}
}
var valid2 = _errs41 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentOwnerFullName !== undefined){
let data15 = data1.remoteCommentOwnerFullName;
const _errs44 = errors;
if((typeof data15 !== "string") && (data15 !== null)){
let dataType14 = typeof data15;
let coerced14 = undefined;
if(dataType14 == 'object' && Array.isArray(data15) && data15.length == 1){
data15 = data15[0];
dataType14 = typeof data15;
if((typeof data15 === "string") && (data15 === null)){
coerced14 = data15;
}
}
if(!(coerced14 !== undefined)){
if(dataType14 == "number" || dataType14 == "boolean"){
coerced14 = "" + data15;
}
else if(data15 === null){
coerced14 = "";
}
else if(data15 === "" || data15 === 0 || data15 === false){
coerced14 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remoteCommentOwnerFullName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentOwnerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced14 !== undefined){
data15 = coerced14;
if(data1 !== undefined){
data1["remoteCommentOwnerFullName"] = coerced14;
}
}
}
var valid2 = _errs44 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentOwnerGender !== undefined){
let data16 = data1.remoteCommentOwnerGender;
const _errs47 = errors;
if((typeof data16 !== "string") && (data16 !== null)){
let dataType15 = typeof data16;
let coerced15 = undefined;
if(dataType15 == 'object' && Array.isArray(data16) && data16.length == 1){
data16 = data16[0];
dataType15 = typeof data16;
if((typeof data16 === "string") && (data16 === null)){
coerced15 = data16;
}
}
if(!(coerced15 !== undefined)){
if(dataType15 == "number" || dataType15 == "boolean"){
coerced15 = "" + data16;
}
else if(data16 === null){
coerced15 = "";
}
else if(data16 === "" || data16 === 0 || data16 === false){
coerced15 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remoteCommentOwnerGender",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentOwnerGender/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced15 !== undefined){
data16 = coerced15;
if(data1 !== undefined){
data1["remoteCommentOwnerGender"] = coerced15;
}
}
}
var valid2 = _errs47 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentHeading !== undefined){
let data17 = data1.remoteCommentHeading;
const _errs50 = errors;
if((typeof data17 !== "string") && (data17 !== null)){
let dataType16 = typeof data17;
let coerced16 = undefined;
if(dataType16 == 'object' && Array.isArray(data17) && data17.length == 1){
data17 = data17[0];
dataType16 = typeof data17;
if((typeof data17 === "string") && (data17 === null)){
coerced16 = data17;
}
}
if(!(coerced16 !== undefined)){
if(dataType16 == "number" || dataType16 == "boolean"){
coerced16 = "" + data17;
}
else if(data17 === null){
coerced16 = "";
}
else if(data17 === "" || data17 === 0 || data17 === false){
coerced16 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/remoteCommentHeading",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentHeading/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced16 !== undefined){
data17 = coerced16;
if(data1 !== undefined){
data1["remoteCommentHeading"] = coerced16;
}
}
}
var valid2 = _errs50 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.createdAt !== undefined){
let data18 = data1.createdAt;
const _errs53 = errors;
if(!(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18)))){
let dataType17 = typeof data18;
let coerced17 = undefined;
if(dataType17 == 'object' && Array.isArray(data18) && data18.length == 1){
data18 = data18[0];
dataType17 = typeof data18;
if(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18))){
coerced17 = data18;
}
}
if(!(coerced17 !== undefined)){
if(dataType17 === "boolean" || data18 === null
              || (dataType17 === "string" && data18 && data18 == +data18 && !(data18 % 1))){
coerced17 = +data18;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/createdAt",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced17 !== undefined){
data18 = coerced17;
if(data1 !== undefined){
data1["createdAt"] = coerced17;
}
}
}
var valid2 = _errs53 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.moment !== undefined){
let data19 = data1.moment;
const _errs55 = errors;
if(!(((typeof data19 == "number") && (!(data19 % 1) && !isNaN(data19))) && (isFinite(data19)))){
let dataType18 = typeof data19;
let coerced18 = undefined;
if(dataType18 == 'object' && Array.isArray(data19) && data19.length == 1){
data19 = data19[0];
dataType18 = typeof data19;
if(((typeof data19 == "number") && (!(data19 % 1) && !isNaN(data19))) && (isFinite(data19))){
coerced18 = data19;
}
}
if(!(coerced18 !== undefined)){
if(dataType18 === "boolean" || data19 === null
              || (dataType18 === "string" && data19 && data19 == +data19 && !(data19 % 1))){
coerced18 = +data19;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/moment",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced18 !== undefined){
data19 = coerced18;
if(data1 !== undefined){
data1["moment"] = coerced18;
}
}
}
var valid2 = _errs55 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.status !== undefined){
let data20 = data1.status;
const _errs57 = errors;
if(typeof data20 !== "string"){
let dataType19 = typeof data20;
let coerced19 = undefined;
if(dataType19 == 'object' && Array.isArray(data20) && data20.length == 1){
data20 = data20[0];
dataType19 = typeof data20;
if(typeof data20 === "string"){
coerced19 = data20;
}
}
if(!(coerced19 !== undefined)){
if(dataType19 == "number" || dataType19 == "boolean"){
coerced19 = "" + data20;
}
else if(data20 === null){
coerced19 = "";
}
else {
validate122.errors = [{instancePath:instancePath+"/group/status",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced19 !== undefined){
data20 = coerced19;
if(data1 !== undefined){
data1["status"] = coerced19;
}
}
}
var valid2 = _errs57 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.decisionCode !== undefined){
let data21 = data1.decisionCode;
const _errs59 = errors;
if((typeof data21 !== "string") && (data21 !== null)){
let dataType20 = typeof data21;
let coerced20 = undefined;
if(dataType20 == 'object' && Array.isArray(data21) && data21.length == 1){
data21 = data21[0];
dataType20 = typeof data21;
if((typeof data21 === "string") && (data21 === null)){
coerced20 = data21;
}
}
if(!(coerced20 !== undefined)){
if(dataType20 == "number" || dataType20 == "boolean"){
coerced20 = "" + data21;
}
else if(data21 === null){
coerced20 = "";
}
else if(data21 === "" || data21 === 0 || data21 === false){
coerced20 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/decisionCode",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/decisionCode/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced20 !== undefined){
data21 = coerced20;
if(data1 !== undefined){
data1["decisionCode"] = coerced20;
}
}
}
var valid2 = _errs59 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.decisionDetails !== undefined){
let data22 = data1.decisionDetails;
const _errs62 = errors;
if((typeof data22 !== "string") && (data22 !== null)){
let dataType21 = typeof data22;
let coerced21 = undefined;
if(dataType21 == 'object' && Array.isArray(data22) && data22.length == 1){
data22 = data22[0];
dataType21 = typeof data22;
if((typeof data22 === "string") && (data22 === null)){
coerced21 = data22;
}
}
if(!(coerced21 !== undefined)){
if(dataType21 == "number" || dataType21 == "boolean"){
coerced21 = "" + data22;
}
else if(data22 === null){
coerced21 = "";
}
else if(data22 === "" || data22 === 0 || data22 === false){
coerced21 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/decisionDetails",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/decisionDetails/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced21 !== undefined){
data22 = coerced21;
if(data1 !== undefined){
data1["decisionDetails"] = coerced21;
}
}
}
var valid2 = _errs62 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.decidedAt !== undefined){
let data23 = data1.decidedAt;
const _errs65 = errors;
if((!(((typeof data23 == "number") && (!(data23 % 1) && !isNaN(data23))) && (isFinite(data23)))) && (data23 !== null)){
let dataType22 = typeof data23;
let coerced22 = undefined;
if(dataType22 == 'object' && Array.isArray(data23) && data23.length == 1){
data23 = data23[0];
dataType22 = typeof data23;
if((((typeof data23 == "number") && (!(data23 % 1) && !isNaN(data23))) && (isFinite(data23))) && (data23 === null)){
coerced22 = data23;
}
}
if(!(coerced22 !== undefined)){
if(dataType22 === "boolean" || data23 === null
              || (dataType22 === "string" && data23 && data23 == +data23 && !(data23 % 1))){
coerced22 = +data23;
}
else if(data23 === "" || data23 === 0 || data23 === false){
coerced22 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/decidedAt",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/decidedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced22 !== undefined){
data23 = coerced22;
if(data1 !== undefined){
data1["decidedAt"] = coerced22;
}
}
}
var valid2 = _errs65 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.anonymous !== undefined){
let data24 = data1.anonymous;
const _errs68 = errors;
if((typeof data24 !== "boolean") && (data24 !== null)){
let dataType23 = typeof data24;
let coerced23 = undefined;
if(dataType23 == 'object' && Array.isArray(data24) && data24.length == 1){
data24 = data24[0];
dataType23 = typeof data24;
if((typeof data24 === "boolean") && (data24 === null)){
coerced23 = data24;
}
}
if(!(coerced23 !== undefined)){
if(data24 === "false" || data24 === 0 || data24 === null){
coerced23 = false;
}
else if(data24 === "true" || data24 === 1){
coerced23 = true;
}
else if(data24 === "" || data24 === 0 || data24 === false){
coerced23 = null;
}
else {
validate122.errors = [{instancePath:instancePath+"/group/anonymous",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/anonymous/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced23 !== undefined){
data24 = coerced23;
if(data1 !== undefined){
data1["anonymous"] = coerced23;
}
}
}
var valid2 = _errs68 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
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
validate122.errors = [{instancePath:instancePath+"/group",schemaPath:"node#/definitions/SheriffComplainGroupInfo/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate122.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate122.errors = vErrors;
return errors === 0;
}

export const SheriffComplainGroupUpdatedEvent = validate123;
const schema124 = {"type":"object","properties":{"type":{"type":"string"},"group":{"$ref":"node#/definitions/SheriffComplainGroupInfo"}},"additionalProperties":false,"required":["type","group"]};

function validate123(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.group === undefined) && (missing0 = "group"))){
validate123.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "group"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate123.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.group !== undefined){
let data1 = data.group;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing1;
if(((((((data1.id === undefined) && (missing1 = "id")) || ((data1.remoteNodeName === undefined) && (missing1 = "remoteNodeName"))) || ((data1.remoteFeedName === undefined) && (missing1 = "remoteFeedName"))) || ((data1.createdAt === undefined) && (missing1 = "createdAt"))) || ((data1.moment === undefined) && (missing1 = "moment"))) || ((data1.status === undefined) && (missing1 = "status"))){
validate123.errors = [{instancePath:instancePath+"/group",schemaPath:"node#/definitions/SheriffComplainGroupInfo/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data1){
if(!(func2.call(schema123.properties, key1))){
delete data1[key1];
}
}
if(_errs7 === errors){
if(data1.id !== undefined){
let data2 = data1.id;
const _errs8 = errors;
if(typeof data2 !== "string"){
let dataType1 = typeof data2;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType1 = typeof data2;
if(typeof data2 === "string"){
coerced1 = data2;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data2;
}
else if(data2 === null){
coerced1 = "";
}
else {
validate123.errors = [{instancePath:instancePath+"/group/id",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data2 = coerced1;
if(data1 !== undefined){
data1["id"] = coerced1;
}
}
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteNodeName !== undefined){
let data3 = data1.remoteNodeName;
const _errs10 = errors;
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
validate123.errors = [{instancePath:instancePath+"/group/remoteNodeName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data3 = coerced2;
if(data1 !== undefined){
data1["remoteNodeName"] = coerced2;
}
}
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteNodeFullName !== undefined){
let data4 = data1.remoteNodeFullName;
const _errs12 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
let dataType3 = typeof data4;
let coerced3 = undefined;
if(dataType3 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType3 = typeof data4;
if((typeof data4 === "string") && (data4 === null)){
coerced3 = data4;
}
}
if(!(coerced3 !== undefined)){
if(dataType3 == "number" || dataType3 == "boolean"){
coerced3 = "" + data4;
}
else if(data4 === null){
coerced3 = "";
}
else if(data4 === "" || data4 === 0 || data4 === false){
coerced3 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remoteNodeFullName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteNodeFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data4 = coerced3;
if(data1 !== undefined){
data1["remoteNodeFullName"] = coerced3;
}
}
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteFeedName !== undefined){
let data5 = data1.remoteFeedName;
const _errs15 = errors;
if(typeof data5 !== "string"){
let dataType4 = typeof data5;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType4 = typeof data5;
if(typeof data5 === "string"){
coerced4 = data5;
}
}
if(!(coerced4 !== undefined)){
if(dataType4 == "number" || dataType4 == "boolean"){
coerced4 = "" + data5;
}
else if(data5 === null){
coerced4 = "";
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remoteFeedName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteFeedName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced4 !== undefined){
data5 = coerced4;
if(data1 !== undefined){
data1["remoteFeedName"] = coerced4;
}
}
}
var valid2 = _errs15 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingId !== undefined){
let data6 = data1.remotePostingId;
const _errs17 = errors;
if((typeof data6 !== "string") && (data6 !== null)){
let dataType5 = typeof data6;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType5 = typeof data6;
if((typeof data6 === "string") && (data6 === null)){
coerced5 = data6;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data6;
}
else if(data6 === null){
coerced5 = "";
}
else if(data6 === "" || data6 === 0 || data6 === false){
coerced5 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remotePostingId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced5 !== undefined){
data6 = coerced5;
if(data1 !== undefined){
data1["remotePostingId"] = coerced5;
}
}
}
var valid2 = _errs17 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingRevisionId !== undefined){
let data7 = data1.remotePostingRevisionId;
const _errs20 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType6 = typeof data7;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType6 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced6 = data7;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data7;
}
else if(data7 === null){
coerced6 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced6 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remotePostingRevisionId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingRevisionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced6 !== undefined){
data7 = coerced6;
if(data1 !== undefined){
data1["remotePostingRevisionId"] = coerced6;
}
}
}
var valid2 = _errs20 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingOwnerName !== undefined){
let data8 = data1.remotePostingOwnerName;
const _errs23 = errors;
if((typeof data8 !== "string") && (data8 !== null)){
let dataType7 = typeof data8;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType7 = typeof data8;
if((typeof data8 === "string") && (data8 === null)){
coerced7 = data8;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data8;
}
else if(data8 === null){
coerced7 = "";
}
else if(data8 === "" || data8 === 0 || data8 === false){
coerced7 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remotePostingOwnerName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced7 !== undefined){
data8 = coerced7;
if(data1 !== undefined){
data1["remotePostingOwnerName"] = coerced7;
}
}
}
var valid2 = _errs23 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingOwnerFullName !== undefined){
let data9 = data1.remotePostingOwnerFullName;
const _errs26 = errors;
if((typeof data9 !== "string") && (data9 !== null)){
let dataType8 = typeof data9;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType8 = typeof data9;
if((typeof data9 === "string") && (data9 === null)){
coerced8 = data9;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 == "number" || dataType8 == "boolean"){
coerced8 = "" + data9;
}
else if(data9 === null){
coerced8 = "";
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced8 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remotePostingOwnerFullName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingOwnerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced8 !== undefined){
data9 = coerced8;
if(data1 !== undefined){
data1["remotePostingOwnerFullName"] = coerced8;
}
}
}
var valid2 = _errs26 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingOwnerGender !== undefined){
let data10 = data1.remotePostingOwnerGender;
const _errs29 = errors;
if((typeof data10 !== "string") && (data10 !== null)){
let dataType9 = typeof data10;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType9 = typeof data10;
if((typeof data10 === "string") && (data10 === null)){
coerced9 = data10;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 == "number" || dataType9 == "boolean"){
coerced9 = "" + data10;
}
else if(data10 === null){
coerced9 = "";
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced9 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remotePostingOwnerGender",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingOwnerGender/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced9 !== undefined){
data10 = coerced9;
if(data1 !== undefined){
data1["remotePostingOwnerGender"] = coerced9;
}
}
}
var valid2 = _errs29 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remotePostingHeading !== undefined){
let data11 = data1.remotePostingHeading;
const _errs32 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType10 = typeof data11;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType10 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced10 = data11;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 == "number" || dataType10 == "boolean"){
coerced10 = "" + data11;
}
else if(data11 === null){
coerced10 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced10 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remotePostingHeading",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingHeading/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced10 !== undefined){
data11 = coerced10;
if(data1 !== undefined){
data1["remotePostingHeading"] = coerced10;
}
}
}
var valid2 = _errs32 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentId !== undefined){
let data12 = data1.remoteCommentId;
const _errs35 = errors;
if((typeof data12 !== "string") && (data12 !== null)){
let dataType11 = typeof data12;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType11 = typeof data12;
if((typeof data12 === "string") && (data12 === null)){
coerced11 = data12;
}
}
if(!(coerced11 !== undefined)){
if(dataType11 == "number" || dataType11 == "boolean"){
coerced11 = "" + data12;
}
else if(data12 === null){
coerced11 = "";
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced11 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remoteCommentId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced11 !== undefined){
data12 = coerced11;
if(data1 !== undefined){
data1["remoteCommentId"] = coerced11;
}
}
}
var valid2 = _errs35 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentRevisionId !== undefined){
let data13 = data1.remoteCommentRevisionId;
const _errs38 = errors;
if((typeof data13 !== "string") && (data13 !== null)){
let dataType12 = typeof data13;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType12 = typeof data13;
if((typeof data13 === "string") && (data13 === null)){
coerced12 = data13;
}
}
if(!(coerced12 !== undefined)){
if(dataType12 == "number" || dataType12 == "boolean"){
coerced12 = "" + data13;
}
else if(data13 === null){
coerced12 = "";
}
else if(data13 === "" || data13 === 0 || data13 === false){
coerced12 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remoteCommentRevisionId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentRevisionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced12 !== undefined){
data13 = coerced12;
if(data1 !== undefined){
data1["remoteCommentRevisionId"] = coerced12;
}
}
}
var valid2 = _errs38 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentOwnerName !== undefined){
let data14 = data1.remoteCommentOwnerName;
const _errs41 = errors;
if((typeof data14 !== "string") && (data14 !== null)){
let dataType13 = typeof data14;
let coerced13 = undefined;
if(dataType13 == 'object' && Array.isArray(data14) && data14.length == 1){
data14 = data14[0];
dataType13 = typeof data14;
if((typeof data14 === "string") && (data14 === null)){
coerced13 = data14;
}
}
if(!(coerced13 !== undefined)){
if(dataType13 == "number" || dataType13 == "boolean"){
coerced13 = "" + data14;
}
else if(data14 === null){
coerced13 = "";
}
else if(data14 === "" || data14 === 0 || data14 === false){
coerced13 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remoteCommentOwnerName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced13 !== undefined){
data14 = coerced13;
if(data1 !== undefined){
data1["remoteCommentOwnerName"] = coerced13;
}
}
}
var valid2 = _errs41 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentOwnerFullName !== undefined){
let data15 = data1.remoteCommentOwnerFullName;
const _errs44 = errors;
if((typeof data15 !== "string") && (data15 !== null)){
let dataType14 = typeof data15;
let coerced14 = undefined;
if(dataType14 == 'object' && Array.isArray(data15) && data15.length == 1){
data15 = data15[0];
dataType14 = typeof data15;
if((typeof data15 === "string") && (data15 === null)){
coerced14 = data15;
}
}
if(!(coerced14 !== undefined)){
if(dataType14 == "number" || dataType14 == "boolean"){
coerced14 = "" + data15;
}
else if(data15 === null){
coerced14 = "";
}
else if(data15 === "" || data15 === 0 || data15 === false){
coerced14 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remoteCommentOwnerFullName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentOwnerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced14 !== undefined){
data15 = coerced14;
if(data1 !== undefined){
data1["remoteCommentOwnerFullName"] = coerced14;
}
}
}
var valid2 = _errs44 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentOwnerGender !== undefined){
let data16 = data1.remoteCommentOwnerGender;
const _errs47 = errors;
if((typeof data16 !== "string") && (data16 !== null)){
let dataType15 = typeof data16;
let coerced15 = undefined;
if(dataType15 == 'object' && Array.isArray(data16) && data16.length == 1){
data16 = data16[0];
dataType15 = typeof data16;
if((typeof data16 === "string") && (data16 === null)){
coerced15 = data16;
}
}
if(!(coerced15 !== undefined)){
if(dataType15 == "number" || dataType15 == "boolean"){
coerced15 = "" + data16;
}
else if(data16 === null){
coerced15 = "";
}
else if(data16 === "" || data16 === 0 || data16 === false){
coerced15 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remoteCommentOwnerGender",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentOwnerGender/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced15 !== undefined){
data16 = coerced15;
if(data1 !== undefined){
data1["remoteCommentOwnerGender"] = coerced15;
}
}
}
var valid2 = _errs47 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.remoteCommentHeading !== undefined){
let data17 = data1.remoteCommentHeading;
const _errs50 = errors;
if((typeof data17 !== "string") && (data17 !== null)){
let dataType16 = typeof data17;
let coerced16 = undefined;
if(dataType16 == 'object' && Array.isArray(data17) && data17.length == 1){
data17 = data17[0];
dataType16 = typeof data17;
if((typeof data17 === "string") && (data17 === null)){
coerced16 = data17;
}
}
if(!(coerced16 !== undefined)){
if(dataType16 == "number" || dataType16 == "boolean"){
coerced16 = "" + data17;
}
else if(data17 === null){
coerced16 = "";
}
else if(data17 === "" || data17 === 0 || data17 === false){
coerced16 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/remoteCommentHeading",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentHeading/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced16 !== undefined){
data17 = coerced16;
if(data1 !== undefined){
data1["remoteCommentHeading"] = coerced16;
}
}
}
var valid2 = _errs50 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.createdAt !== undefined){
let data18 = data1.createdAt;
const _errs53 = errors;
if(!(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18)))){
let dataType17 = typeof data18;
let coerced17 = undefined;
if(dataType17 == 'object' && Array.isArray(data18) && data18.length == 1){
data18 = data18[0];
dataType17 = typeof data18;
if(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18))){
coerced17 = data18;
}
}
if(!(coerced17 !== undefined)){
if(dataType17 === "boolean" || data18 === null
              || (dataType17 === "string" && data18 && data18 == +data18 && !(data18 % 1))){
coerced17 = +data18;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/createdAt",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced17 !== undefined){
data18 = coerced17;
if(data1 !== undefined){
data1["createdAt"] = coerced17;
}
}
}
var valid2 = _errs53 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.moment !== undefined){
let data19 = data1.moment;
const _errs55 = errors;
if(!(((typeof data19 == "number") && (!(data19 % 1) && !isNaN(data19))) && (isFinite(data19)))){
let dataType18 = typeof data19;
let coerced18 = undefined;
if(dataType18 == 'object' && Array.isArray(data19) && data19.length == 1){
data19 = data19[0];
dataType18 = typeof data19;
if(((typeof data19 == "number") && (!(data19 % 1) && !isNaN(data19))) && (isFinite(data19))){
coerced18 = data19;
}
}
if(!(coerced18 !== undefined)){
if(dataType18 === "boolean" || data19 === null
              || (dataType18 === "string" && data19 && data19 == +data19 && !(data19 % 1))){
coerced18 = +data19;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/moment",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced18 !== undefined){
data19 = coerced18;
if(data1 !== undefined){
data1["moment"] = coerced18;
}
}
}
var valid2 = _errs55 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.status !== undefined){
let data20 = data1.status;
const _errs57 = errors;
if(typeof data20 !== "string"){
let dataType19 = typeof data20;
let coerced19 = undefined;
if(dataType19 == 'object' && Array.isArray(data20) && data20.length == 1){
data20 = data20[0];
dataType19 = typeof data20;
if(typeof data20 === "string"){
coerced19 = data20;
}
}
if(!(coerced19 !== undefined)){
if(dataType19 == "number" || dataType19 == "boolean"){
coerced19 = "" + data20;
}
else if(data20 === null){
coerced19 = "";
}
else {
validate123.errors = [{instancePath:instancePath+"/group/status",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced19 !== undefined){
data20 = coerced19;
if(data1 !== undefined){
data1["status"] = coerced19;
}
}
}
var valid2 = _errs57 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.decisionCode !== undefined){
let data21 = data1.decisionCode;
const _errs59 = errors;
if((typeof data21 !== "string") && (data21 !== null)){
let dataType20 = typeof data21;
let coerced20 = undefined;
if(dataType20 == 'object' && Array.isArray(data21) && data21.length == 1){
data21 = data21[0];
dataType20 = typeof data21;
if((typeof data21 === "string") && (data21 === null)){
coerced20 = data21;
}
}
if(!(coerced20 !== undefined)){
if(dataType20 == "number" || dataType20 == "boolean"){
coerced20 = "" + data21;
}
else if(data21 === null){
coerced20 = "";
}
else if(data21 === "" || data21 === 0 || data21 === false){
coerced20 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/decisionCode",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/decisionCode/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced20 !== undefined){
data21 = coerced20;
if(data1 !== undefined){
data1["decisionCode"] = coerced20;
}
}
}
var valid2 = _errs59 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.decisionDetails !== undefined){
let data22 = data1.decisionDetails;
const _errs62 = errors;
if((typeof data22 !== "string") && (data22 !== null)){
let dataType21 = typeof data22;
let coerced21 = undefined;
if(dataType21 == 'object' && Array.isArray(data22) && data22.length == 1){
data22 = data22[0];
dataType21 = typeof data22;
if((typeof data22 === "string") && (data22 === null)){
coerced21 = data22;
}
}
if(!(coerced21 !== undefined)){
if(dataType21 == "number" || dataType21 == "boolean"){
coerced21 = "" + data22;
}
else if(data22 === null){
coerced21 = "";
}
else if(data22 === "" || data22 === 0 || data22 === false){
coerced21 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/decisionDetails",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/decisionDetails/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced21 !== undefined){
data22 = coerced21;
if(data1 !== undefined){
data1["decisionDetails"] = coerced21;
}
}
}
var valid2 = _errs62 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.decidedAt !== undefined){
let data23 = data1.decidedAt;
const _errs65 = errors;
if((!(((typeof data23 == "number") && (!(data23 % 1) && !isNaN(data23))) && (isFinite(data23)))) && (data23 !== null)){
let dataType22 = typeof data23;
let coerced22 = undefined;
if(dataType22 == 'object' && Array.isArray(data23) && data23.length == 1){
data23 = data23[0];
dataType22 = typeof data23;
if((((typeof data23 == "number") && (!(data23 % 1) && !isNaN(data23))) && (isFinite(data23))) && (data23 === null)){
coerced22 = data23;
}
}
if(!(coerced22 !== undefined)){
if(dataType22 === "boolean" || data23 === null
              || (dataType22 === "string" && data23 && data23 == +data23 && !(data23 % 1))){
coerced22 = +data23;
}
else if(data23 === "" || data23 === 0 || data23 === false){
coerced22 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/decidedAt",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/decidedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced22 !== undefined){
data23 = coerced22;
if(data1 !== undefined){
data1["decidedAt"] = coerced22;
}
}
}
var valid2 = _errs65 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.anonymous !== undefined){
let data24 = data1.anonymous;
const _errs68 = errors;
if((typeof data24 !== "boolean") && (data24 !== null)){
let dataType23 = typeof data24;
let coerced23 = undefined;
if(dataType23 == 'object' && Array.isArray(data24) && data24.length == 1){
data24 = data24[0];
dataType23 = typeof data24;
if((typeof data24 === "boolean") && (data24 === null)){
coerced23 = data24;
}
}
if(!(coerced23 !== undefined)){
if(data24 === "false" || data24 === 0 || data24 === null){
coerced23 = false;
}
else if(data24 === "true" || data24 === 1){
coerced23 = true;
}
else if(data24 === "" || data24 === 0 || data24 === false){
coerced23 = null;
}
else {
validate123.errors = [{instancePath:instancePath+"/group/anonymous",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/anonymous/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced23 !== undefined){
data24 = coerced23;
if(data1 !== undefined){
data1["anonymous"] = coerced23;
}
}
}
var valid2 = _errs68 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
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
validate123.errors = [{instancePath:instancePath+"/group",schemaPath:"node#/definitions/SheriffComplainGroupInfo/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate123.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate123.errors = vErrors;
return errors === 0;
}

export const SheriffComplainAddedEvent = validate124;
const schema126 = {"type":"object","properties":{"type":{"type":"string"},"complain":{"$ref":"node#/definitions/SheriffComplainInfo"},"groupId":{"type":"string"}},"additionalProperties":false,"required":["type","complain","groupId"]};
const schema127 = {"type":"object","properties":{"id":{"type":"string"},"ownerName":{"type":"string"},"ownerFullName":{"type":"string","nullable":true},"ownerGender":{"type":"string","nullable":true},"group":{"anyOf":[{"$ref":"node#/definitions/SheriffComplainGroupInfo","type":"object","nullable":true},{"type":"null"}]},"reasonCode":{"type":"string"},"reasonDetails":{"type":"string","nullable":true},"anonymousRequested":{"type":"boolean","nullable":true},"createdAt":{"type":"integer"}},"required":["id","ownerName","reasonCode","createdAt"],"additionalProperties":false};

function validate125(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.id === undefined) && (missing0 = "id")) || ((data.ownerName === undefined) && (missing0 = "ownerName"))) || ((data.reasonCode === undefined) && (missing0 = "reasonCode"))) || ((data.createdAt === undefined) && (missing0 = "createdAt"))){
validate125.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func2.call(schema127.properties, key0))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
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
validate125.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["id"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ownerName !== undefined){
let data1 = data.ownerName;
const _errs4 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data1) && data1.length == 1){
data1 = data1[0];
dataType1 = typeof data1;
if(typeof data1 === "string"){
coerced1 = data1;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
validate125.errors = [{instancePath:instancePath+"/ownerName",schemaPath:"#/properties/ownerName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["ownerName"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ownerFullName !== undefined){
let data2 = data.ownerFullName;
const _errs6 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(dataType2 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType2 = typeof data2;
if((typeof data2 === "string") && (data2 === null)){
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
else if(data2 === "" || data2 === 0 || data2 === false){
coerced2 = null;
}
else {
validate125.errors = [{instancePath:instancePath+"/ownerFullName",schemaPath:"#/properties/ownerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["ownerFullName"] = coerced2;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ownerGender !== undefined){
let data3 = data.ownerGender;
const _errs9 = errors;
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
validate125.errors = [{instancePath:instancePath+"/ownerGender",schemaPath:"#/properties/ownerGender/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data !== undefined){
data["ownerGender"] = coerced3;
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.group !== undefined){
let data4 = data.group;
const _errs12 = errors;
const _errs13 = errors;
let valid1 = false;
const _errs14 = errors;
if((!(data4 && typeof data4 == "object" && !Array.isArray(data4))) && (data4 !== null)){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(dataType4 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType4 = typeof data4;
if((data4 && typeof data4 == "object" && !Array.isArray(data4)) && (data4 === null)){
coerced4 = data4;
}
}
if(!(coerced4 !== undefined)){
if(data4 === "" || data4 === 0 || data4 === false){
coerced4 = null;
}
else {
const err0 = {instancePath:instancePath+"/group",schemaPath:"#/properties/group/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["group"] = coerced4;
}
}
}
const _errs15 = errors;
if(errors === _errs15){
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
let missing1;
if(((((((data4.id === undefined) && (missing1 = "id")) || ((data4.remoteNodeName === undefined) && (missing1 = "remoteNodeName"))) || ((data4.remoteFeedName === undefined) && (missing1 = "remoteFeedName"))) || ((data4.createdAt === undefined) && (missing1 = "createdAt"))) || ((data4.moment === undefined) && (missing1 = "moment"))) || ((data4.status === undefined) && (missing1 = "status"))){
const err1 = {instancePath:instancePath+"/group",schemaPath:"node#/definitions/SheriffComplainGroupInfo/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
const _errs17 = errors;
for(const key1 in data4){
if(!(func2.call(schema123.properties, key1))){
delete data4[key1];
}
}
if(_errs17 === errors){
if(data4.id !== undefined){
let data5 = data4.id;
const _errs18 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(dataType5 == 'object' && Array.isArray(data5) && data5.length == 1){
data5 = data5[0];
dataType5 = typeof data5;
if(typeof data5 === "string"){
coerced5 = data5;
}
}
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
const err2 = {instancePath:instancePath+"/group/id",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data4 !== undefined){
data4["id"] = coerced5;
}
}
}
var valid3 = _errs18 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remoteNodeName !== undefined){
let data6 = data4.remoteNodeName;
const _errs20 = errors;
if(typeof data6 !== "string"){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(dataType6 == 'object' && Array.isArray(data6) && data6.length == 1){
data6 = data6[0];
dataType6 = typeof data6;
if(typeof data6 === "string"){
coerced6 = data6;
}
}
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data6;
}
else if(data6 === null){
coerced6 = "";
}
else {
const err3 = {instancePath:instancePath+"/group/remoteNodeName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteNodeName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data4 !== undefined){
data4["remoteNodeName"] = coerced6;
}
}
}
var valid3 = _errs20 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remoteNodeFullName !== undefined){
let data7 = data4.remoteNodeFullName;
const _errs22 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
let dataType7 = typeof data7;
let coerced7 = undefined;
if(dataType7 == 'object' && Array.isArray(data7) && data7.length == 1){
data7 = data7[0];
dataType7 = typeof data7;
if((typeof data7 === "string") && (data7 === null)){
coerced7 = data7;
}
}
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data7;
}
else if(data7 === null){
coerced7 = "";
}
else if(data7 === "" || data7 === 0 || data7 === false){
coerced7 = null;
}
else {
const err4 = {instancePath:instancePath+"/group/remoteNodeFullName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteNodeFullName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(coerced7 !== undefined){
data7 = coerced7;
if(data4 !== undefined){
data4["remoteNodeFullName"] = coerced7;
}
}
}
var valid3 = _errs22 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remoteFeedName !== undefined){
let data8 = data4.remoteFeedName;
const _errs25 = errors;
if(typeof data8 !== "string"){
let dataType8 = typeof data8;
let coerced8 = undefined;
if(dataType8 == 'object' && Array.isArray(data8) && data8.length == 1){
data8 = data8[0];
dataType8 = typeof data8;
if(typeof data8 === "string"){
coerced8 = data8;
}
}
if(!(coerced8 !== undefined)){
if(dataType8 == "number" || dataType8 == "boolean"){
coerced8 = "" + data8;
}
else if(data8 === null){
coerced8 = "";
}
else {
const err5 = {instancePath:instancePath+"/group/remoteFeedName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteFeedName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced8 !== undefined){
data8 = coerced8;
if(data4 !== undefined){
data4["remoteFeedName"] = coerced8;
}
}
}
var valid3 = _errs25 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remotePostingId !== undefined){
let data9 = data4.remotePostingId;
const _errs27 = errors;
if((typeof data9 !== "string") && (data9 !== null)){
let dataType9 = typeof data9;
let coerced9 = undefined;
if(dataType9 == 'object' && Array.isArray(data9) && data9.length == 1){
data9 = data9[0];
dataType9 = typeof data9;
if((typeof data9 === "string") && (data9 === null)){
coerced9 = data9;
}
}
if(!(coerced9 !== undefined)){
if(dataType9 == "number" || dataType9 == "boolean"){
coerced9 = "" + data9;
}
else if(data9 === null){
coerced9 = "";
}
else if(data9 === "" || data9 === 0 || data9 === false){
coerced9 = null;
}
else {
const err6 = {instancePath:instancePath+"/group/remotePostingId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(coerced9 !== undefined){
data9 = coerced9;
if(data4 !== undefined){
data4["remotePostingId"] = coerced9;
}
}
}
var valid3 = _errs27 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remotePostingRevisionId !== undefined){
let data10 = data4.remotePostingRevisionId;
const _errs30 = errors;
if((typeof data10 !== "string") && (data10 !== null)){
let dataType10 = typeof data10;
let coerced10 = undefined;
if(dataType10 == 'object' && Array.isArray(data10) && data10.length == 1){
data10 = data10[0];
dataType10 = typeof data10;
if((typeof data10 === "string") && (data10 === null)){
coerced10 = data10;
}
}
if(!(coerced10 !== undefined)){
if(dataType10 == "number" || dataType10 == "boolean"){
coerced10 = "" + data10;
}
else if(data10 === null){
coerced10 = "";
}
else if(data10 === "" || data10 === 0 || data10 === false){
coerced10 = null;
}
else {
const err7 = {instancePath:instancePath+"/group/remotePostingRevisionId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingRevisionId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(coerced10 !== undefined){
data10 = coerced10;
if(data4 !== undefined){
data4["remotePostingRevisionId"] = coerced10;
}
}
}
var valid3 = _errs30 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remotePostingOwnerName !== undefined){
let data11 = data4.remotePostingOwnerName;
const _errs33 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
let dataType11 = typeof data11;
let coerced11 = undefined;
if(dataType11 == 'object' && Array.isArray(data11) && data11.length == 1){
data11 = data11[0];
dataType11 = typeof data11;
if((typeof data11 === "string") && (data11 === null)){
coerced11 = data11;
}
}
if(!(coerced11 !== undefined)){
if(dataType11 == "number" || dataType11 == "boolean"){
coerced11 = "" + data11;
}
else if(data11 === null){
coerced11 = "";
}
else if(data11 === "" || data11 === 0 || data11 === false){
coerced11 = null;
}
else {
const err8 = {instancePath:instancePath+"/group/remotePostingOwnerName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(coerced11 !== undefined){
data11 = coerced11;
if(data4 !== undefined){
data4["remotePostingOwnerName"] = coerced11;
}
}
}
var valid3 = _errs33 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remotePostingOwnerFullName !== undefined){
let data12 = data4.remotePostingOwnerFullName;
const _errs36 = errors;
if((typeof data12 !== "string") && (data12 !== null)){
let dataType12 = typeof data12;
let coerced12 = undefined;
if(dataType12 == 'object' && Array.isArray(data12) && data12.length == 1){
data12 = data12[0];
dataType12 = typeof data12;
if((typeof data12 === "string") && (data12 === null)){
coerced12 = data12;
}
}
if(!(coerced12 !== undefined)){
if(dataType12 == "number" || dataType12 == "boolean"){
coerced12 = "" + data12;
}
else if(data12 === null){
coerced12 = "";
}
else if(data12 === "" || data12 === 0 || data12 === false){
coerced12 = null;
}
else {
const err9 = {instancePath:instancePath+"/group/remotePostingOwnerFullName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingOwnerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(coerced12 !== undefined){
data12 = coerced12;
if(data4 !== undefined){
data4["remotePostingOwnerFullName"] = coerced12;
}
}
}
var valid3 = _errs36 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remotePostingOwnerGender !== undefined){
let data13 = data4.remotePostingOwnerGender;
const _errs39 = errors;
if((typeof data13 !== "string") && (data13 !== null)){
let dataType13 = typeof data13;
let coerced13 = undefined;
if(dataType13 == 'object' && Array.isArray(data13) && data13.length == 1){
data13 = data13[0];
dataType13 = typeof data13;
if((typeof data13 === "string") && (data13 === null)){
coerced13 = data13;
}
}
if(!(coerced13 !== undefined)){
if(dataType13 == "number" || dataType13 == "boolean"){
coerced13 = "" + data13;
}
else if(data13 === null){
coerced13 = "";
}
else if(data13 === "" || data13 === 0 || data13 === false){
coerced13 = null;
}
else {
const err10 = {instancePath:instancePath+"/group/remotePostingOwnerGender",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingOwnerGender/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(coerced13 !== undefined){
data13 = coerced13;
if(data4 !== undefined){
data4["remotePostingOwnerGender"] = coerced13;
}
}
}
var valid3 = _errs39 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remotePostingHeading !== undefined){
let data14 = data4.remotePostingHeading;
const _errs42 = errors;
if((typeof data14 !== "string") && (data14 !== null)){
let dataType14 = typeof data14;
let coerced14 = undefined;
if(dataType14 == 'object' && Array.isArray(data14) && data14.length == 1){
data14 = data14[0];
dataType14 = typeof data14;
if((typeof data14 === "string") && (data14 === null)){
coerced14 = data14;
}
}
if(!(coerced14 !== undefined)){
if(dataType14 == "number" || dataType14 == "boolean"){
coerced14 = "" + data14;
}
else if(data14 === null){
coerced14 = "";
}
else if(data14 === "" || data14 === 0 || data14 === false){
coerced14 = null;
}
else {
const err11 = {instancePath:instancePath+"/group/remotePostingHeading",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remotePostingHeading/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(coerced14 !== undefined){
data14 = coerced14;
if(data4 !== undefined){
data4["remotePostingHeading"] = coerced14;
}
}
}
var valid3 = _errs42 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remoteCommentId !== undefined){
let data15 = data4.remoteCommentId;
const _errs45 = errors;
if((typeof data15 !== "string") && (data15 !== null)){
let dataType15 = typeof data15;
let coerced15 = undefined;
if(dataType15 == 'object' && Array.isArray(data15) && data15.length == 1){
data15 = data15[0];
dataType15 = typeof data15;
if((typeof data15 === "string") && (data15 === null)){
coerced15 = data15;
}
}
if(!(coerced15 !== undefined)){
if(dataType15 == "number" || dataType15 == "boolean"){
coerced15 = "" + data15;
}
else if(data15 === null){
coerced15 = "";
}
else if(data15 === "" || data15 === 0 || data15 === false){
coerced15 = null;
}
else {
const err12 = {instancePath:instancePath+"/group/remoteCommentId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(coerced15 !== undefined){
data15 = coerced15;
if(data4 !== undefined){
data4["remoteCommentId"] = coerced15;
}
}
}
var valid3 = _errs45 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remoteCommentRevisionId !== undefined){
let data16 = data4.remoteCommentRevisionId;
const _errs48 = errors;
if((typeof data16 !== "string") && (data16 !== null)){
let dataType16 = typeof data16;
let coerced16 = undefined;
if(dataType16 == 'object' && Array.isArray(data16) && data16.length == 1){
data16 = data16[0];
dataType16 = typeof data16;
if((typeof data16 === "string") && (data16 === null)){
coerced16 = data16;
}
}
if(!(coerced16 !== undefined)){
if(dataType16 == "number" || dataType16 == "boolean"){
coerced16 = "" + data16;
}
else if(data16 === null){
coerced16 = "";
}
else if(data16 === "" || data16 === 0 || data16 === false){
coerced16 = null;
}
else {
const err13 = {instancePath:instancePath+"/group/remoteCommentRevisionId",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentRevisionId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(coerced16 !== undefined){
data16 = coerced16;
if(data4 !== undefined){
data4["remoteCommentRevisionId"] = coerced16;
}
}
}
var valid3 = _errs48 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remoteCommentOwnerName !== undefined){
let data17 = data4.remoteCommentOwnerName;
const _errs51 = errors;
if((typeof data17 !== "string") && (data17 !== null)){
let dataType17 = typeof data17;
let coerced17 = undefined;
if(dataType17 == 'object' && Array.isArray(data17) && data17.length == 1){
data17 = data17[0];
dataType17 = typeof data17;
if((typeof data17 === "string") && (data17 === null)){
coerced17 = data17;
}
}
if(!(coerced17 !== undefined)){
if(dataType17 == "number" || dataType17 == "boolean"){
coerced17 = "" + data17;
}
else if(data17 === null){
coerced17 = "";
}
else if(data17 === "" || data17 === 0 || data17 === false){
coerced17 = null;
}
else {
const err14 = {instancePath:instancePath+"/group/remoteCommentOwnerName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentOwnerName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(coerced17 !== undefined){
data17 = coerced17;
if(data4 !== undefined){
data4["remoteCommentOwnerName"] = coerced17;
}
}
}
var valid3 = _errs51 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remoteCommentOwnerFullName !== undefined){
let data18 = data4.remoteCommentOwnerFullName;
const _errs54 = errors;
if((typeof data18 !== "string") && (data18 !== null)){
let dataType18 = typeof data18;
let coerced18 = undefined;
if(dataType18 == 'object' && Array.isArray(data18) && data18.length == 1){
data18 = data18[0];
dataType18 = typeof data18;
if((typeof data18 === "string") && (data18 === null)){
coerced18 = data18;
}
}
if(!(coerced18 !== undefined)){
if(dataType18 == "number" || dataType18 == "boolean"){
coerced18 = "" + data18;
}
else if(data18 === null){
coerced18 = "";
}
else if(data18 === "" || data18 === 0 || data18 === false){
coerced18 = null;
}
else {
const err15 = {instancePath:instancePath+"/group/remoteCommentOwnerFullName",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentOwnerFullName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(coerced18 !== undefined){
data18 = coerced18;
if(data4 !== undefined){
data4["remoteCommentOwnerFullName"] = coerced18;
}
}
}
var valid3 = _errs54 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remoteCommentOwnerGender !== undefined){
let data19 = data4.remoteCommentOwnerGender;
const _errs57 = errors;
if((typeof data19 !== "string") && (data19 !== null)){
let dataType19 = typeof data19;
let coerced19 = undefined;
if(dataType19 == 'object' && Array.isArray(data19) && data19.length == 1){
data19 = data19[0];
dataType19 = typeof data19;
if((typeof data19 === "string") && (data19 === null)){
coerced19 = data19;
}
}
if(!(coerced19 !== undefined)){
if(dataType19 == "number" || dataType19 == "boolean"){
coerced19 = "" + data19;
}
else if(data19 === null){
coerced19 = "";
}
else if(data19 === "" || data19 === 0 || data19 === false){
coerced19 = null;
}
else {
const err16 = {instancePath:instancePath+"/group/remoteCommentOwnerGender",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentOwnerGender/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(coerced19 !== undefined){
data19 = coerced19;
if(data4 !== undefined){
data4["remoteCommentOwnerGender"] = coerced19;
}
}
}
var valid3 = _errs57 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.remoteCommentHeading !== undefined){
let data20 = data4.remoteCommentHeading;
const _errs60 = errors;
if((typeof data20 !== "string") && (data20 !== null)){
let dataType20 = typeof data20;
let coerced20 = undefined;
if(dataType20 == 'object' && Array.isArray(data20) && data20.length == 1){
data20 = data20[0];
dataType20 = typeof data20;
if((typeof data20 === "string") && (data20 === null)){
coerced20 = data20;
}
}
if(!(coerced20 !== undefined)){
if(dataType20 == "number" || dataType20 == "boolean"){
coerced20 = "" + data20;
}
else if(data20 === null){
coerced20 = "";
}
else if(data20 === "" || data20 === 0 || data20 === false){
coerced20 = null;
}
else {
const err17 = {instancePath:instancePath+"/group/remoteCommentHeading",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/remoteCommentHeading/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(coerced20 !== undefined){
data20 = coerced20;
if(data4 !== undefined){
data4["remoteCommentHeading"] = coerced20;
}
}
}
var valid3 = _errs60 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.createdAt !== undefined){
let data21 = data4.createdAt;
const _errs63 = errors;
if(!(((typeof data21 == "number") && (!(data21 % 1) && !isNaN(data21))) && (isFinite(data21)))){
let dataType21 = typeof data21;
let coerced21 = undefined;
if(dataType21 == 'object' && Array.isArray(data21) && data21.length == 1){
data21 = data21[0];
dataType21 = typeof data21;
if(((typeof data21 == "number") && (!(data21 % 1) && !isNaN(data21))) && (isFinite(data21))){
coerced21 = data21;
}
}
if(!(coerced21 !== undefined)){
if(dataType21 === "boolean" || data21 === null
              || (dataType21 === "string" && data21 && data21 == +data21 && !(data21 % 1))){
coerced21 = +data21;
}
else {
const err18 = {instancePath:instancePath+"/group/createdAt",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(coerced21 !== undefined){
data21 = coerced21;
if(data4 !== undefined){
data4["createdAt"] = coerced21;
}
}
}
var valid3 = _errs63 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.moment !== undefined){
let data22 = data4.moment;
const _errs65 = errors;
if(!(((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22))) && (isFinite(data22)))){
let dataType22 = typeof data22;
let coerced22 = undefined;
if(dataType22 == 'object' && Array.isArray(data22) && data22.length == 1){
data22 = data22[0];
dataType22 = typeof data22;
if(((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22))) && (isFinite(data22))){
coerced22 = data22;
}
}
if(!(coerced22 !== undefined)){
if(dataType22 === "boolean" || data22 === null
              || (dataType22 === "string" && data22 && data22 == +data22 && !(data22 % 1))){
coerced22 = +data22;
}
else {
const err19 = {instancePath:instancePath+"/group/moment",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/moment/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(coerced22 !== undefined){
data22 = coerced22;
if(data4 !== undefined){
data4["moment"] = coerced22;
}
}
}
var valid3 = _errs65 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.status !== undefined){
let data23 = data4.status;
const _errs67 = errors;
if(typeof data23 !== "string"){
let dataType23 = typeof data23;
let coerced23 = undefined;
if(dataType23 == 'object' && Array.isArray(data23) && data23.length == 1){
data23 = data23[0];
dataType23 = typeof data23;
if(typeof data23 === "string"){
coerced23 = data23;
}
}
if(!(coerced23 !== undefined)){
if(dataType23 == "number" || dataType23 == "boolean"){
coerced23 = "" + data23;
}
else if(data23 === null){
coerced23 = "";
}
else {
const err20 = {instancePath:instancePath+"/group/status",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(coerced23 !== undefined){
data23 = coerced23;
if(data4 !== undefined){
data4["status"] = coerced23;
}
}
}
var valid3 = _errs67 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.decisionCode !== undefined){
let data24 = data4.decisionCode;
const _errs69 = errors;
if((typeof data24 !== "string") && (data24 !== null)){
let dataType24 = typeof data24;
let coerced24 = undefined;
if(dataType24 == 'object' && Array.isArray(data24) && data24.length == 1){
data24 = data24[0];
dataType24 = typeof data24;
if((typeof data24 === "string") && (data24 === null)){
coerced24 = data24;
}
}
if(!(coerced24 !== undefined)){
if(dataType24 == "number" || dataType24 == "boolean"){
coerced24 = "" + data24;
}
else if(data24 === null){
coerced24 = "";
}
else if(data24 === "" || data24 === 0 || data24 === false){
coerced24 = null;
}
else {
const err21 = {instancePath:instancePath+"/group/decisionCode",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/decisionCode/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(coerced24 !== undefined){
data24 = coerced24;
if(data4 !== undefined){
data4["decisionCode"] = coerced24;
}
}
}
var valid3 = _errs69 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.decisionDetails !== undefined){
let data25 = data4.decisionDetails;
const _errs72 = errors;
if((typeof data25 !== "string") && (data25 !== null)){
let dataType25 = typeof data25;
let coerced25 = undefined;
if(dataType25 == 'object' && Array.isArray(data25) && data25.length == 1){
data25 = data25[0];
dataType25 = typeof data25;
if((typeof data25 === "string") && (data25 === null)){
coerced25 = data25;
}
}
if(!(coerced25 !== undefined)){
if(dataType25 == "number" || dataType25 == "boolean"){
coerced25 = "" + data25;
}
else if(data25 === null){
coerced25 = "";
}
else if(data25 === "" || data25 === 0 || data25 === false){
coerced25 = null;
}
else {
const err22 = {instancePath:instancePath+"/group/decisionDetails",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/decisionDetails/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(coerced25 !== undefined){
data25 = coerced25;
if(data4 !== undefined){
data4["decisionDetails"] = coerced25;
}
}
}
var valid3 = _errs72 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.decidedAt !== undefined){
let data26 = data4.decidedAt;
const _errs75 = errors;
if((!(((typeof data26 == "number") && (!(data26 % 1) && !isNaN(data26))) && (isFinite(data26)))) && (data26 !== null)){
let dataType26 = typeof data26;
let coerced26 = undefined;
if(dataType26 == 'object' && Array.isArray(data26) && data26.length == 1){
data26 = data26[0];
dataType26 = typeof data26;
if((((typeof data26 == "number") && (!(data26 % 1) && !isNaN(data26))) && (isFinite(data26))) && (data26 === null)){
coerced26 = data26;
}
}
if(!(coerced26 !== undefined)){
if(dataType26 === "boolean" || data26 === null
              || (dataType26 === "string" && data26 && data26 == +data26 && !(data26 % 1))){
coerced26 = +data26;
}
else if(data26 === "" || data26 === 0 || data26 === false){
coerced26 = null;
}
else {
const err23 = {instancePath:instancePath+"/group/decidedAt",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/decidedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(coerced26 !== undefined){
data26 = coerced26;
if(data4 !== undefined){
data4["decidedAt"] = coerced26;
}
}
}
var valid3 = _errs75 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.anonymous !== undefined){
let data27 = data4.anonymous;
const _errs78 = errors;
if((typeof data27 !== "boolean") && (data27 !== null)){
let dataType27 = typeof data27;
let coerced27 = undefined;
if(dataType27 == 'object' && Array.isArray(data27) && data27.length == 1){
data27 = data27[0];
dataType27 = typeof data27;
if((typeof data27 === "boolean") && (data27 === null)){
coerced27 = data27;
}
}
if(!(coerced27 !== undefined)){
if(data27 === "false" || data27 === 0 || data27 === null){
coerced27 = false;
}
else if(data27 === "true" || data27 === 1){
coerced27 = true;
}
else if(data27 === "" || data27 === 0 || data27 === false){
coerced27 = null;
}
else {
const err24 = {instancePath:instancePath+"/group/anonymous",schemaPath:"node#/definitions/SheriffComplainGroupInfo/properties/anonymous/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(coerced27 !== undefined){
data27 = coerced27;
if(data4 !== undefined){
data4["anonymous"] = coerced27;
}
}
}
var valid3 = _errs78 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
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
const err25 = {instancePath:instancePath+"/group",schemaPath:"node#/definitions/SheriffComplainGroupInfo/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
var _valid0 = _errs14 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs83 = errors;
if(data4 !== null){
let dataType28 = typeof data4;
let coerced28 = undefined;
if(dataType28 == 'object' && Array.isArray(data4) && data4.length == 1){
data4 = data4[0];
dataType28 = typeof data4;
if(data4 === null){
coerced28 = data4;
}
}
if(!(coerced28 !== undefined)){
if(data4 === "" || data4 === 0 || data4 === false){
coerced28 = null;
}
else {
const err26 = {instancePath:instancePath+"/group",schemaPath:"#/properties/group/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(coerced28 !== undefined){
data4 = coerced28;
if(data !== undefined){
data["group"] = coerced28;
}
}
}
var _valid0 = _errs83 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err27 = {instancePath:instancePath+"/group",schemaPath:"#/properties/group/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
validate125.errors = vErrors;
return false;
}
else {
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reasonCode !== undefined){
let data28 = data.reasonCode;
const _errs85 = errors;
if(typeof data28 !== "string"){
let dataType29 = typeof data28;
let coerced29 = undefined;
if(dataType29 == 'object' && Array.isArray(data28) && data28.length == 1){
data28 = data28[0];
dataType29 = typeof data28;
if(typeof data28 === "string"){
coerced29 = data28;
}
}
if(!(coerced29 !== undefined)){
if(dataType29 == "number" || dataType29 == "boolean"){
coerced29 = "" + data28;
}
else if(data28 === null){
coerced29 = "";
}
else {
validate125.errors = [{instancePath:instancePath+"/reasonCode",schemaPath:"#/properties/reasonCode/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced29 !== undefined){
data28 = coerced29;
if(data !== undefined){
data["reasonCode"] = coerced29;
}
}
}
var valid0 = _errs85 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reasonDetails !== undefined){
let data29 = data.reasonDetails;
const _errs87 = errors;
if((typeof data29 !== "string") && (data29 !== null)){
let dataType30 = typeof data29;
let coerced30 = undefined;
if(dataType30 == 'object' && Array.isArray(data29) && data29.length == 1){
data29 = data29[0];
dataType30 = typeof data29;
if((typeof data29 === "string") && (data29 === null)){
coerced30 = data29;
}
}
if(!(coerced30 !== undefined)){
if(dataType30 == "number" || dataType30 == "boolean"){
coerced30 = "" + data29;
}
else if(data29 === null){
coerced30 = "";
}
else if(data29 === "" || data29 === 0 || data29 === false){
coerced30 = null;
}
else {
validate125.errors = [{instancePath:instancePath+"/reasonDetails",schemaPath:"#/properties/reasonDetails/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced30 !== undefined){
data29 = coerced30;
if(data !== undefined){
data["reasonDetails"] = coerced30;
}
}
}
var valid0 = _errs87 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.anonymousRequested !== undefined){
let data30 = data.anonymousRequested;
const _errs90 = errors;
if((typeof data30 !== "boolean") && (data30 !== null)){
let dataType31 = typeof data30;
let coerced31 = undefined;
if(dataType31 == 'object' && Array.isArray(data30) && data30.length == 1){
data30 = data30[0];
dataType31 = typeof data30;
if((typeof data30 === "boolean") && (data30 === null)){
coerced31 = data30;
}
}
if(!(coerced31 !== undefined)){
if(data30 === "false" || data30 === 0 || data30 === null){
coerced31 = false;
}
else if(data30 === "true" || data30 === 1){
coerced31 = true;
}
else if(data30 === "" || data30 === 0 || data30 === false){
coerced31 = null;
}
else {
validate125.errors = [{instancePath:instancePath+"/anonymousRequested",schemaPath:"#/properties/anonymousRequested/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced31 !== undefined){
data30 = coerced31;
if(data !== undefined){
data["anonymousRequested"] = coerced31;
}
}
}
var valid0 = _errs90 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.createdAt !== undefined){
let data31 = data.createdAt;
const _errs93 = errors;
if(!(((typeof data31 == "number") && (!(data31 % 1) && !isNaN(data31))) && (isFinite(data31)))){
let dataType32 = typeof data31;
let coerced32 = undefined;
if(dataType32 == 'object' && Array.isArray(data31) && data31.length == 1){
data31 = data31[0];
dataType32 = typeof data31;
if(((typeof data31 == "number") && (!(data31 % 1) && !isNaN(data31))) && (isFinite(data31))){
coerced32 = data31;
}
}
if(!(coerced32 !== undefined)){
if(dataType32 === "boolean" || data31 === null
              || (dataType32 === "string" && data31 && data31 == +data31 && !(data31 % 1))){
coerced32 = +data31;
}
else {
validate125.errors = [{instancePath:instancePath+"/createdAt",schemaPath:"#/properties/createdAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced32 !== undefined){
data31 = coerced32;
if(data !== undefined){
data["createdAt"] = coerced32;
}
}
}
var valid0 = _errs93 === errors;
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
}
}
}
else {
validate125.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate125.errors = vErrors;
return errors === 0;
}


function validate124(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.complain === undefined) && (missing0 = "complain"))) || ((data.groupId === undefined) && (missing0 = "groupId"))){
validate124.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "complain")) || (key0 === "groupId"))){
delete data[key0];
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
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
validate124.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["type"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.complain !== undefined){
const _errs4 = errors;
if(!(validate125(data.complain, {instancePath:instancePath+"/complain",parentData:data,parentDataProperty:"complain",rootData}))){
vErrors = vErrors === null ? validate125.errors : vErrors.concat(validate125.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.groupId !== undefined){
let data2 = data.groupId;
const _errs5 = errors;
if(typeof data2 !== "string"){
let dataType1 = typeof data2;
let coerced1 = undefined;
if(dataType1 == 'object' && Array.isArray(data2) && data2.length == 1){
data2 = data2[0];
dataType1 = typeof data2;
if(typeof data2 === "string"){
coerced1 = data2;
}
}
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data2;
}
else if(data2 === null){
coerced1 = "";
}
else {
validate124.errors = [{instancePath:instancePath+"/groupId",schemaPath:"#/properties/groupId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced1 !== undefined){
data2 = coerced1;
if(data !== undefined){
data["groupId"] = coerced1;
}
}
}
var valid0 = _errs5 === errors;
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
validate124.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate124.errors = vErrors;
return errors === 0;
}

export const EVENT_VALIDATORS = {
    "EVENT_PACKET": EventPacket,
    "PING": PingEvent,
    "PROFILE_UPDATED": ProfileUpdatedEvent,
    "NODE_SETTINGS_META_CHANGED": NodeSettingsMetaChangedEvent,
    "NODE_SETTINGS_CHANGED": NodeSettingsChangedEvent,
    "CLIENT_SETTINGS_CHANGED": ClientSettingsChangedEvent,
    "POSTING_ADDED": PostingAddedEvent,
    "POSTING_UPDATED": PostingUpdatedEvent,
    "POSTING_DELETED": PostingDeletedEvent,
    "POSTING_RESTORED": PostingRestoredEvent,
    "POSTING_REACTIONS_CHANGED": PostingReactionsChangedEvent,
    "POSTING_COMMENTS_CHANGED": PostingCommentsChangedEvent,
    "REGISTERED_NAME_OPERATION_STATUS": RegisteredNameOperationStatusEvent,
    "NODE_NAME_CHANGED": NodeNameChangedEvent,
    "REMOTE_POSTING_VERIFIED": RemotePostingVerifiedEvent,
    "REMOTE_POSTING_VERIFICATION_FAILED": RemotePostingVerificationFailedEvent,
    "REMOTE_REACTION_ADDED": RemoteReactionAddedEvent,
    "REMOTE_REACTION_DELETED": RemoteReactionDeletedEvent,
    "REMOTE_REACTION_VERIFIED": RemoteReactionVerifiedEvent,
    "REMOTE_REACTION_VERIFICATION_FAILED": RemoteReactionVerificationFailedEvent,
    "DRAFT_ADDED": DraftAddedEvent,
    "DRAFT_UPDATED": DraftUpdatedEvent,
    "DRAFT_DELETED": DraftDeletedEvent,
    "STORY_ADDED": StoryAddedEvent,
    "STORY_DELETED": StoryDeletedEvent,
    "STORY_UPDATED": StoryUpdatedEvent,
    "FEED_STATUS_UPDATED": FeedStatusUpdatedEvent,
    "STORIES_STATUS_UPDATED": StoriesStatusUpdatedEvent,
    "SUBSCRIBER_ADDED": SubscriberAddedEvent,
    "SUBSCRIBER_UPDATED": SubscriberUpdatedEvent,
    "SUBSCRIBER_DELETED": SubscriberDeletedEvent,
    "SUBSCRIPTION_ADDED": SubscriptionAddedEvent,
    "SUBSCRIPTION_UPDATED": SubscriptionUpdatedEvent,
    "SUBSCRIPTION_DELETED": SubscriptionDeletedEvent,
    "COMMENT_ADDED": CommentAddedEvent,
    "COMMENT_UPDATED": CommentUpdatedEvent,
    "COMMENT_DELETED": CommentDeletedEvent,
    "COMMENT_REACTIONS_CHANGED": CommentReactionsChangedEvent,
    "REMOTE_COMMENT_ADDED": RemoteCommentAddedEvent,
    "REMOTE_COMMENT_UPDATED": RemoteCommentUpdatedEvent,
    "REMOTE_COMMENT_DELETED": RemoteCommentDeletedEvent,
    "REMOTE_COMMENT_VERIFIED": RemoteCommentVerifiedEvent,
    "REMOTE_COMMENT_VERIFICATION_FAILED": RemoteCommentVerificationFailedEvent,
    "REMOTE_NODE_FULL_NAME_CHANGED": RemoteNodeFullNameChangedEvent,
    "SUBSCRIBERS_TOTAL_CHANGED": SubscribersTotalChangedEvent,
    "SUBSCRIPTIONS_TOTAL_CHANGED": SubscriptionsTotalChangedEvent,
    "REMOTE_NODE_AVATAR_CHANGED": RemoteNodeAvatarChangedEvent,
    "AVATAR_ADDED": AvatarAddedEvent,
    "AVATAR_DELETED": AvatarDeletedEvent,
    "AVATAR_ORDERED": AvatarOrderedEvent,
    "REMOTE_POSTING_ADDED": RemotePostingAddedEvent,
    "REMOTE_POSTING_UPDATED": RemotePostingUpdatedEvent,
    "REMOTE_POSTING_DELETED": RemotePostingDeletedEvent,
    "TOKEN_ADDED": TokenAddedEvent,
    "TOKEN_UPDATED": TokenUpdatedEvent,
    "TOKEN_DELETED": TokenDeletedEvent,
    "PLUGINS_UPDATED": PluginsUpdatedEvent,
    "FRIEND_GROUP_ADDED": FriendGroupAddedEvent,
    "FRIEND_GROUP_UPDATED": FriendGroupUpdatedEvent,
    "FRIEND_GROUP_DELETED": FriendGroupDeletedEvent,
    "FRIENDSHIP_UPDATED": FriendshipUpdatedEvent,
    "ASK_SUBJECTS_CHANGED": AskSubjectsChangedEvent,
    "REMOTE_FRIENDSHIP_UPDATED": RemoteFriendshipUpdatedEvent,
    "BLOCKED_INSTANT_ADDED": BlockedInstantAddedEvent,
    "BLOCKED_INSTANT_DELETED": BlockedInstantDeletedEvent,
    "BLOCKED_USER_ADDED": BlockedUserAddedEvent,
    "BLOCKED_USER_DELETED": BlockedUserDeletedEvent,
    "BLOCKED_BY_USER_ADDED": BlockedByUserAddedEvent,
    "BLOCKED_BY_USER_DELETED": BlockedByUserDeletedEvent,
    "FEED_SHERIFF_DATA_UPDATED": FeedSheriffDataUpdatedEvent,
    "SHERIFF_COMPLAIN_GROUP_ADDED": SheriffComplainGroupAddedEvent,
    "SHERIFF_COMPLAIN_GROUP_UPDATED": SheriffComplainGroupUpdatedEvent,
    "SHERIFF_COMPLAIN_ADDED": SheriffComplainAddedEvent,
};
