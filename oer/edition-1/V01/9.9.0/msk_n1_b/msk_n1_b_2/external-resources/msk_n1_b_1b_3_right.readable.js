/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./img/cursor_add.svg":
/*!****************************!*\
  !*** ./img/cursor_add.svg ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "cursor_add.svg");

/***/ }),

/***/ "./img/cursor_del.svg":
/*!****************************!*\
  !*** ./img/cursor_del.svg ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "cursor_del.svg");

/***/ }),

/***/ "./libs/baseInits.js":
/*!***************************!*\
  !*** ./libs/baseInits.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "baseInits": () => (/* binding */ baseInits)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common */ "./libs/common.js");
/* harmony import */ var _fsm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fsm */ "./libs/fsm.js");



// Konva should bei imported, but doens't seem to support tree shaking, so leave it out
// import Konva from 'konva/lib/Core'

class baseInits {

	constructor ( opts = {} ) {

		// Options and defaults
		const defaults = {
			container: null,
			addSendChangeState: null,
		}
		Object.assign( this, defaults, opts );

		// create fsm object, if not provided
		if ( !this.fsm ) {
			this.fsm = new _fsm__WEBPACK_IMPORTED_MODULE_0__.fsmSend();
			this.fsm.startListeningToVariableDeclarationRequests( this.declareVariables.bind(this) );
		}

		// init stage & layer
		if ( opts.container ) {
			if ( !this.width ) {
				this.width = window.innerWidth;
			}
			if ( !this.height ) {
				this.height = window.innerHeight;
			}

			this.stage = new Konva.Stage({
				container: this.container,
				width: this.width,
				height: this.height,
			});


			const stageVN = "BW_IB_EXTRES_STAGES";
			if ( !( stageVN in window ) ) {
				window[stageVN] = [];
			}
			window[stageVN].push( this.stage );


			// this.layer = new Konva.Layer();
			// this.stage.add( this.layer );
		}

		// disable mouse right click
		document.addEventListener( 'contextmenu', (ev) => ev.preventDefault() );

		this.FSMVarsSent = {};
	}

	///////////////////////////////////

	// method wrapper for posting to FSM

// 	postEvent (event) {
// 		// this.post( `sending FSM event ${event}`, event );
// 	}

// 	postMessage ( event, msg ) {
// console.debug( `Posting event '${event}', message ${msg}` );
// 		// this.post( msg );
// 	}

	postLog ( event, data={} ) {
		if ( !this.stage || !this.stage.isDemoAni ) {
			this.fsm.postLogEvent( Object.assign( {}, data, { event: event } ) );
		}
	}

	postVariable ( name, val ) {
		this.FSMVarsSent[name] = val;
		this.fsm.setFSMVariable( name, val );
	}

	triggerInputValidationEvent () {
		if ( this.fsm.triggerEvent ) {
			this.fsm.triggerEvent( 'ev_InputValidation_' + 'msk_n1_b_1b_3_right'.replace("msk_","") );
			this.fsm.triggerEvent( 'ev_InputValidation_ExtRes' );
		}
	}

	///////////////////////////////////

	// get state-vars of obj
	getChangeState ( obj ) {

		// statusVarDef defined in obj?
		if ( obj.statusVarDef ) {

			return obj.statusVarDef.call(obj);

		} else {

			// call defaultChangeState()
			return +obj.getDefaultChangeState();

		}
	}

	sendChangeState ( obj, newState=null ) {

		// Dont send states or score in demoAni
		if ( obj.stage && obj.stage.isDemoAni ) {
			return;
		}
// console.log(this,obj);

		// state Variable (changeState) changed?
		const changeState = ( newState===null ? this.getChangeState(obj) : newState );

		// is state changed? -> send msgs
		if ( typeof obj.oldChangeState === 'undefined' || !(0,_common__WEBPACK_IMPORTED_MODULE_1__.object_equals)( changeState, obj.oldChangeState ) ) {

			if ( typeof changeState === 'object' ) {
				// changeState = { FSMStateVar1: state1, FSMStateVar2: state2, ... }
				for ( let k in changeState ) {
					if ( typeof obj.oldChangeState !== 'object' || changeState[k] !== obj.oldChangeState[k] ) {
						this.postVariable( k, changeState[k] );
					}
				}

			} else if ( obj.FSMVariableName ) {
				// Simple 1-value state
// console.log( `V_Status_${obj.FSMVariableName}: ${+changeState}` );
				this.postVariable( `V_Status_${obj.FSMVariableName}`, +changeState );
			}

			obj.oldChangeState = changeState;
		}

		// score changed?
		if ( obj.scoreDef ) {

			const score = obj.scoreDef.call(obj);

			if ( typeof obj.oldScore === 'undefined' || !(0,_common__WEBPACK_IMPORTED_MODULE_1__.object_equals)( score, obj.oldScore ) ) {
// console.log(`V_Score_${obj.FSMVariableName}: ${score}`)
				if ( typeof score === 'object' ) {
					// score = { FSMStateVar1: state1, FSMStateVar2: state2, ... }
					for ( let k in score ) {
						if ( typeof obj.oldScore !== 'object' || score[k] !== obj.oldScore[k] ) {
							this.postVariable( k, score[k] );
						}
					}

				} else if ( obj.FSMVariableName || obj.scoreVariableName ) {
					// Simple 1-value score
					if ( typeof score !== 'undefined' ) {
						this.postVariable( obj.scoreVariableName || `V_Score_${obj.FSMVariableName}`, score );
					}
				}
			}

			obj.oldScore = score;
		}

		if ( typeof this.addSendChangeState === 'function' ) {
			(this.addSendChangeState)();
		}
	}

	// send information about variables sent
	declareVariables () {

		const varDefs = [];
		const typetrans = {
			'string': 'String',
			'number': 'Integer',
		}

		for ( const vname in this.FSMVarsSent ) {

			const vdef = {
				name: vname,
				type: typetrans[ typeof this.FSMVarsSent[vname] ],
				defaultValue: this.FSMVarsSent[vname],
				namedValues: [],
			}
			varDefs.push( vdef );
		}

		return varDefs;
	}
}


/***/ }),

/***/ "./libs/common.js":
/*!************************!*\
  !*** ./libs/common.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBetween": () => (/* binding */ isBetween),
/* harmony export */   "delDefaults": () => (/* binding */ delDefaults),
/* harmony export */   "mergeDeep": () => (/* binding */ mergeDeep),
/* harmony export */   "object_equals": () => (/* binding */ object_equals),
/* harmony export */   "getXofEvent": () => (/* binding */ getXofEvent),
/* harmony export */   "getYofEvent": () => (/* binding */ getYofEvent),
/* harmony export */   "getPosOfEvent": () => (/* binding */ getPosOfEvent),
/* harmony export */   "ignoreEvent": () => (/* binding */ ignoreEvent),
/* harmony export */   "setStatePostProc": () => (/* binding */ setStatePostProc),
/* harmony export */   "getAbsPosition": () => (/* binding */ getAbsPosition)
/* harmony export */ });

// import { isBetween, delDefaults, mergeDeep, object_equals, getXofEvent, getYofEvent, getPosOfEvent } from './common'

function isBetween ( v, w1, w2 ) {
	return v >= Math.min( w1, w2 ) && v <= Math.max( w1, w2 );
};

// Deletes delKeys & unchanged defaults from obj
// object deep clone, omitting some data defined by defaults and delKeys
// adopted from https://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript
function delDefaults ( obj = {}, defaults = {}, delKeys = [] ) {

	// if obj is array of objects: apply delDefaults to every member of array
	if ( Array.isArray(obj) ) {
		let a = [];
		obj.forEach( e => {
			if ( typeof e==='object' ) {
				a.push( delDefaults( e, defaults, delKeys ) );
			} else {
				a.push(e);
			}
		})
		return a;
	}

	if ( !obj ) {
		return obj;
	}

	let v;
	let bObject = {};
	for ( const k in obj ) {
		if ( !delKeys.includes(k) ) {
			v = obj[k];
			if ( !defaults || defaults[k]!==v ) {
				bObject[k] = (typeof v === "object") ? delDefaults( v, defaults ? defaults[k] : [] ) : v;
			}
		}
	}

	return bObject;
}

/**
 * From: https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 *
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
function mergeDeep (target, source) {
	const isObject = (obj) => obj && typeof obj === 'object';

	if (!isObject(target) || !isObject(source)) {
		return source;
	}

	Object.keys(source).forEach(key => {
		const targetValue = target[key];
		const sourceValue = source[key];

		if ( /*Array.isArray(targetValue) &&*/ Array.isArray(sourceValue)) {
			// NO CONCATENATION OF ARRAYS!
			// target[key] = targetValue.concat(sourceValue);
			target[key] = sourceValue;
		} else if (isObject(targetValue) && isObject(sourceValue)) {
			target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
		} else {
			target[key] = sourceValue;
		}
	});

	return target;
}

//////////////////////////////////////

// adopted from https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
function object_equals ( x, y ) {
	if ( x === y ) return true;
	// if both x and y are null or undefined and exactly the same

	if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
	// if they are not strictly equal, they both need to be Objects

	if ( x.constructor !== y.constructor ) return false;
	// they must have the exact same prototype chain, the closest we can do is
	// test there constructor.

	// if both are arrays: unordered compare (check if all elements are contained)
	if ( Array.isArray(y) && Array.isArray(x) ) {
		if ( x.length != y.length ) return false;
		const y2 = Array.from( y );
		if ( !x.every( xe =>
			y2.some( ( ye, i ) => {
				if ( object_equals( xe, ye ) ) {
					y2.splice( i, 1 );
					return true;
				}
				return false;
			})
		)) return false;
		return y2.length===0;
	}

	for ( var p in x ) {
		if ( ! x.hasOwnProperty( p ) ) continue;
			// other properties were tested using x.constructor === y.constructor

		if ( ! y.hasOwnProperty( p ) ) return false;
			// allows to compare x[ p ] and y[ p ] when set to undefined

		if ( x[ p ] === y[ p ] ) continue;
			// if they have the same strict value or identity then they are equal

		if ( typeof( x[ p ] ) !== "object" ) return false;
			// Numbers, Strings, Functions, Booleans must be strictly equal

		if ( ! object_equals( x[ p ],  y[ p ] ) ) return false;
			// Objects and Arrays must be tested recursively
	}

	for ( p in y )
	if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
		return false;
		// allows x[ p ] to be set to undefined

	return true;
}

//////////////////////////////////////

function getXofEvent ( stage, event ) {
	if ( event ) {
		if ( event.simX ) {
			return event.simX;
		}
		// if ( event.evt && event.evt.clientX ) {
		// 	return event.evt.clientX;
		// }
	}
	return stage.getPointerPosition().x;
}


function getYofEvent ( stage, event ) {
	if ( event ) {
		if ( event.simY ) {
			return event.simY;
		}
		// if ( event.evt && event.evt.clientY ) {
		// 	return event.evt.clientY;
		// }
	}
	return stage.getPointerPosition().y;
}


function getPosOfEvent ( stage, ev ) {
	return {
		x: getXofEvent( stage, ev ),
		y: getYofEvent( stage, ev ),
	}
}


// is in DemoAni: ignore native Events (prevent e.g. stage.on(mouseleave))
function ignoreEvent ( stage, ev ) {
	return ( stage && stage.isDemoAni && !( "simX" in ev ) );
}


//////////////////////////////////////

const setStatePostProc = function (obj) {

	if ( obj.stage && obj.stage.isDemoAni && obj.stage.isDemoAni.endAni ) {
		obj.stage.isDemoAni.endAni( false );
	}

	if ( obj.base ) {
		obj.base.sendChangeState( obj );	// init & send changeState & score
	}
	// obj.oldChangeState = obj.base.getChangeState(obj);
	// if ( obj.scoreDef ) {
	// 	obj.oldScore = obj.scoreDef();
	// }
}

//////////////////////////////////////

const getAbsPosition = function (element) {
	const box = element.getBoundingClientRect();
	const scrollX = window.scrollX || window.pageXOffset;
	const scrollY = window.scrollY || window.pageYOffset;
	return {
		left: box.left + scrollX,
		top: box.top + scrollY
	}
}

/***/ }),

/***/ "./libs/fsm.js":
/*!*********************!*\
  !*** ./libs/fsm.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fsmSend": () => (/* binding */ fsmSend)
/* harmony export */ });
// Set FSM variable

class fsmSend {

	constructor () {
		this.indexPath = this.getQueryVariable('indexPath');
		this.userDefIdPath = this.getQueryVariable('userDefIdPath');

		// Trace Counter
		this.traceCount = 0;

		if ( true ) {
			window.bw__debugOut = this.debugOut.bind(this);
		}
	}

	setFSMVariable ( variableName, newValue ) {

		if ( true ) {
			this.debugOut( `Set FSM variable: ${variableName} to value >${newValue}< (${typeof newValue})` );
		}

		this.postMessageWithPathsAndTraceCount({
			setVariable: {
				variableName,
				newValue,
			},
		})
	}

	// Send a trace message
	postLogEvent ( traceMessage ) {

		if ( true ) {
			this.debugOut( `Posting event '${traceMessage.event}', message ${JSON.stringify( traceMessage, (k,v) => k==='event' ? undefined : v )}` );
		}

		this.postMessageWithPathsAndTraceCount({
			traceMessage,
		})

	}

	triggerEvent ( event ) {

		if ( true ) {
			this.debugOut("triggerEvent: " + event);
		}

		this.postMessageWithPathsAndTraceCount({
			microfinEvent: event,
		})
	}

	postMessageWithPathsAndTraceCount( payload ) {

		try
		{
			payload.indexPath = this.indexPath;
			payload.userDefIdPath = this.userDefIdPath;
			payload.traceCount = this.traceCount++;

			window.parent.postMessage( JSON.stringify( payload ), '*' );

		} catch (e) {
			console.error(e);
		}

	}

	// Helper
	getQueryVariable (variable) {
		const parsedUrl = new URL( window.location.href );
		return parsedUrl.searchParams.get(variable);
	}

	startListeningToVariableDeclarationRequests (declareVariableCallback) {

		// listener for providing initial variable data signal.
		window.addEventListener(
			"message",
			(event) => {

				try {
					const { callId } = JSON.parse(event.data);
					if ( callId !== undefined && callId.includes("importVariables") ) {
						const variables = declareVariableCallback();
						const pass_data = {
							initialVariables: variables,
							callId
						}

						window.parent.postMessage( JSON.stringify( pass_data ), '*' );
					}
				} catch (error) {
					if ( true ) {
						console.log("error on external listener - ", error);
					}
				}
			},
			false );
	 }

	 debugOut (s) {
		if ( true ) {

			// if ( !this.debugOutput ) {
			// 	const heigth=200, width=500;
			// 	// document.body.innerHTML += `<div id="bw_DebugOutput" style="width:${width}px;height:${heigth}px;position:absolute;bottom:0px;left:0px;z-index:100000;white-space:pre;border:1px solid black;background:lightyellow"></div>`;
			// 	const div = document.createElement("DIV");
			// 	const st = {
			// 		width:`${width}px`,
			// 		height:`${heigth}px`,
			// 		overflow:"scroll",
			// 		position:"absolute",
			// 		bottom:"0px",
			// 		left:"0px",
			// 		"z-index":100000,
			// 		"white-space":"pre",
			// 		border:"1px solid black",
			// 		background:"lightyellow",
			// 	}
			// 	Object.assign( div.style, st );
			// 	document.body.appendChild(div);
			// 	this.debugOutput = div;
			// }
			// this.debugOutput.innerHTML += "\n"+s;
			// this.debugOutput.scrollTop = this.debugOutput.scrollHeight;

			console.log(s);
			// console.trace();

		}
	 }
}


/***/ }),

/***/ "./libs/iconBar.js":
/*!*************************!*\
  !*** ./libs/iconBar.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "iconBar": () => (/* binding */ iconBar)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common */ "./libs/common.js");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tooltip */ "./libs/tooltip.js");
/* harmony import */ var konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! konva/lib/Core */ "../node_modules/konva/lib/Core.js");
/* harmony import */ var konva_lib_shapes_Rect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! konva/lib/shapes/Rect */ "../node_modules/konva/lib/shapes/Rect.js");
/* harmony import */ var konva_lib_shapes_Text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! konva/lib/shapes/Text */ "../node_modules/konva/lib/shapes/Text.js");
/* harmony import */ var konva_lib_shapes_Image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! konva/lib/shapes/Image */ "../node_modules/konva/lib/shapes/Image.js");









class iconBar {

	constructor ( stage, opts = {} ) {

		// Options and defaults
		['icons','x','y','width','height'].forEach( o => {
			if ( !( o in opts ) ) {
				throw( `iconBar: parameter '${o}' not specified!` );
			}
		})
		const defaults = {
			// x, y
			// width, height	// w&h of icon, total dimension += 2*(frameWidth+framePadding)
			spacing: 5,

			frameColor: 'gray',
			framePadding: 2,
			frameWidth: 1,
			frameFill: null,

			highlightColor: '#FFA99A',
			highlightFrame: '#8c3627',

			default: null, // index of icon
			active: null,

			// icons: [{
			// }]
			sticky: true,	// icon remains active after mouseup/touchend?
			//disabled: true,	// disable whole bar

			toolTipFontSize: 10,
			toolTipFill: 'yellow',

			direction: 'v',	// v | h (vertical | horizontal )

			shareModesWith: null,		// [] or function returning [] of iconBars that should be deactivated when icon of this iconBar is activated

			useExistingIconBarLayer: true,	// are all iconBars placed in one layer?
			moveLayerToTop: true,

			// initDone: <Promise>,		// will be Promise that fullfilles when init is completed
		}
		const defaultIcon = {
			// extraSpace: 	// no icon, leave extra Space

			// kCreateFunc: function (x,y,iconBarObj)	// function returns KONVA Object|[KONVA Objects]|Promise|[Promises] on coords x, y OR
			// src: set image.src OR
			// text: text to display (object with options for Konva.Text({}))
			toolTip: null,
			cursor: null,		// cursor, when activated
			cursorOver: null,	// cursor, when "mouseover", e.g. "url(icon.png) 16 16, auto"
			tooltipImage: null,
			on: () => 1,
			off: () => 1,
		}
		const defaultTextOptions = {
			align: 'center',
			verticalAlign: 'middle',
			fontSize: 20,
		}
		Object.assign( this, defaults, opts );
		this.stage = stage;
		// search iconBar Layer ore create new
		if ( this.useExistingIconBarLayer ) {
			const layer = stage.getAttr('bw__IconBarLayer');
			if ( layer ) {
				this.layer = layer
			} else {
				this.layer = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Layer();
				stage.add( this.layer );
				stage.setAttr( 'bw__IconBarLayer', this.layer );
			}
		} else {
			this.layer = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Layer();
			stage.add( this.layer );
		}
		if ( this.moveLayerToTop ) {
			this.layer.moveToTop();
		}
		this.kGroup = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Group();
		this.layer.add( this.kGroup );

		// Icons
		const wp = this.frameWidth + this.framePadding;
		let x = this.x, y = this.y;
		const loadPrs = [];
		this.icons.forEach( (i,nr) => {

			if ( i.extraSpace ) {

				if ( this.direction=='v' ) {
					y += i.extraSpace===true ? this.height + 2*wp : i.extraSpace;
				} else {
					x += i.extraSpace===true ? this.width + 2*wp: i.extraSpace;
				}

			} else {
				// i is altered!

				i = Object.assign( {}, defaultIcon, i );
				// image-tooltip?
				if ( i.tooltipImage && !this.tooltip ) {
					this.tooltip = new _tooltip__WEBPACK_IMPORTED_MODULE_4__.tooltip(this.stage);
					this.stage.on( 'mouseleave', (ev) => {
						if ( (0,_common__WEBPACK_IMPORTED_MODULE_5__.ignoreEvent)( this.stage, ev ) ) {
							return;
						}
						this.tooltip.hide()
				 	})
				}

				// frame
				if ( this.frameWidth || this.frameFill || this.highlightColor ) {
					i.kFrame = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Rect({
						x, y,
						width: this.width + 2*wp,
						height: this.height + 2*wp,
						stroke: this.frameColor,
						strokeWidth: this.frameWidth,
						fill: this.frameFill,
						dontGrayOut: true,
					});
					this.kGroup.add( i.kFrame );
				}

				// draw KONVA object?
				if ( i.kCreateFunc ) {
					const kGroup = this.kGroup;
					const res = i.kCreateFunc( x + wp, y + wp, this );
					loadPrs.push(
						Promise
							.all( Array.isArray(res) ? res : [res] )
							.then( kObjs => kObjs.forEach( kObj => {
								if ( kObj ) {
									kGroup.add( kObj );
								}
								if ( i.kIcon ) {
									i.kIcon.moveToTop();
								}
						}))
					)
				}

				// icon
				const rectAttr = {
					width: this.width,
					height: this.height,
					x: x + wp,
					y: y + wp,
				};


				// interactivity
				const setInteract = (kObj) => {
					kObj.on( 'mousedown touchstart', (ev) => {
						if ( !this.disabled ) {
							ev.cancelBubble = true;
							if ( ev.evt ) {		// ev.evt might not be present (e.g. during demoAnimation)
								ev.evt.preventDefault();	// e.g. no blur in input fields
								ev.evt.stopPropagation();
							}
							this.clickOn( nr, ev );
						}
					});
					kObj.on( 'click tap', (ev) => {
						if ( !this.disabled ) {
							ev.cancelBubble = true;
							if ( ev.evt ) {		// ev.evt might not be present (e.g. during demoAnimation)
								ev.evt.preventDefault();	// e.g. no blur in input fields
								ev.evt.stopPropagation();
							}
						}
					});
					if ( !this.sticky ) {
						kObj.on( 'mouseup touchend mouseleave', (ev) => {
							if ( (0,_common__WEBPACK_IMPORTED_MODULE_5__.ignoreEvent)( this.stage, ev ) ) {
								return;
							}
							this.deactivate( ev );
					 	});
					}
					if ( i.cursorOver ) {
						kObj.on( 'mouseenter', () => {
							if ( !this.disabled ) {
								this.cursorSaved = document.body.style.cursor;
								document.body.style.cursor = i.cursorOver;
								this.cursorSet = document.body.style.cursor;
							}
						});
						kObj.on( 'mouseleave', (ev) => {
							if ( !this.disabled ) {
								if ( (0,_common__WEBPACK_IMPORTED_MODULE_5__.ignoreEvent)( this.stage, ev ) ) {
									return;
								}
								if ( document.body.style.cursor == this.cursorSet ) {
									document.body.style.cursor = this.cursorSaved
									this.cursorSet = null;
								}
							}
						});
					}
					if ( i.tooltipImage ) {
						kObj.on( 'mouseenter', () => this.tooltip.showImage( i.tooltipImage ) );
						kObj.on( 'mouseleave', (ev) => {
							if ( (0,_common__WEBPACK_IMPORTED_MODULE_5__.ignoreEvent)( this.stage, ev ) ) {
								return;
							}
							this.tooltip.hide();
						});
					}
				}

				if ( i.src ) {
					// create image
					const me = this;
					const image = new Image();
					const pr = new Promise( res => {
						image.onload = res;
						image.src = i.src;
					});
					loadPrs.push(
						pr.then( () => {
							i.kIcon = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Image( Object.assign( { image }, rectAttr ) );
							me.icons[nr].kIcon = i.kIcon;

							setInteract( i.kIcon );
							me.kGroup.add( i.kIcon );
						})
					);

				} else if ( i.text ) {
					// text as icon given?
					i.kIcon = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Text( Object.assign( {}, defaultTextOptions, i.text, rectAttr ));

					setInteract( i.kIcon );
					this.kGroup.add( i.kIcon );

				} else {
					// no image.src -> draw invisible rectangle
					// (hit area e.g. for icon created by kCreateFunc())
					i.kIcon = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Rect( Object.assign( {}, rectAttr, {
						fill: 'white',
						opacity: 0,
						dontGrayOut: true,
					} ));

					setInteract( i.kIcon );
					this.kGroup.add( i.kIcon );
				}

				// get position for next icon
				// const offs = nr*( this.spacing + this.height+2*wp );
				if ( this.direction=='v' ) {
					y += this.spacing + this.height + 2*wp;
				} else {
					x += this.spacing + this.width + 2*wp;
				}

				this.icons[nr] = i;
			}
		})

		const me = this;
		this.initDone = Promise.all( loadPrs )
			.then( () => {
				me.setDefault();
				me.layer.draw();
			});
	}

	///////////////////////////////////

	getOverallHeight () {
		return this.direction=='v' ?
			this.icons.length * ( this.spacing + this.height + 2*( this.frameWidth + this.framePadding ) ) - this.spacing :
			this.height + 2*( this.frameWidth + this.framePadding );
	}

	getOverallWidth () {
		return this.direction=='v' ?
			this.width + 2*( this.frameWidth + this.framePadding ) :
			this.icons.length * ( this.spacing + this.width + 2*( this.frameWidth + this.framePadding ) ) - this.spacing;
	}

	///////////////////////////////////

	setDefault () {
		if ( !this.disabled && this.default!==null && this.sticky ) {
			this.clickOn( this.default );
		}
	}

	clickOn ( index, ev ) {
		const saved_active = this.active;
		this.deactivate();
		if ( this.shareModesWith ) {
			const ar = typeof this.shareModesWith === 'function' ? this.shareModesWith() : this.shareModesWith;
			ar.forEach( iconBar => {
				if ( iconBar && iconBar!=this ) {
					iconBar.deactivate();
				}
			})
		}
		if ( saved_active===null || saved_active!=index ) {
			this.activate( index, ev );
		}
	}

	deactivate () {
		if ( this.active!==null ) {
			const icon = this.icons[ this.active ];
			if ( icon.kFrame ) {
				icon.kFrame.fill( this.frameFill );
				icon.kFrame.stroke( this.frameColor );
			}
			this.layer.batchDraw();

			if ( icon.off ) {
				icon.off();
			}

			if ( icon.cursor ) {
				document.body.style.cursor = "default";
			}
			this.active = null;
		}
	}

	activate ( index, ev ) {
		const icon = this.icons[index];
		if ( icon.kFrame ) {
			icon.kFrame.fill( this.highlightColor );
			icon.kFrame.stroke( this.highlightFrame );
		}
		this.layer.batchDraw();

		this.active = index;
		if ( icon.on ) {
			icon.on(ev);
		}

		if ( icon.cursor ) {
			document.body.style.cursor = icon.cursor;
		}
	}

	isActive ( index ) {
		return this.active === index;
	}

	///////////////////////////////////

	disableBar ( disabled=true ) {
		this.disabled = disabled;
		if ( disabled ) {
			this.deactivate();
		}
	}

	hideBar ( hidden=true ) {
		this.disableBar( hidden );
		this.kGroup.visible( !hidden );
		this.layer.batchDraw();
	}

	destroy () {
		this.kGroup.destroy();
		if ( !this.useExistingIconBarLayer ) {
			this.layer.destroy();
		}
	}
}


/***/ }),

/***/ "./libs/numbersByPictures.js":
/*!***********************************!*\
  !*** ./libs/numbersByPictures.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "numbersByPictures": () => (/* binding */ numbersByPictures)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common */ "./libs/common.js");
/* harmony import */ var _iconBar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./iconBar */ "./libs/iconBar.js");
/* harmony import */ var konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! konva/lib/Core */ "../node_modules/konva/lib/Core.js");
/* harmony import */ var konva_lib_shapes_Rect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! konva/lib/shapes/Rect */ "../node_modules/konva/lib/shapes/Rect.js");
/* harmony import */ var konva_lib_shapes_Circle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! konva/lib/shapes/Circle */ "../node_modules/konva/lib/shapes/Circle.js");
/* harmony import */ var _img_cursor_del_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../img/cursor_del.svg */ "./img/cursor_del.svg");
/* harmony import */ var _img_cursor_add_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../img/cursor_add.svg */ "./img/cursor_add.svg");



// import { tooltip } from './tooltip'








class numbersByPictures {

	constructor ( base, opts = {} ) {

		const defaults = {

			// x, y
			// width

			iconBar: {
				//x, y,
				// width, height
				spacing: 2,
				framePadding: 0,
				frameWidth: 0,
				frameFill: 'lightgray',
				cursorOver: `url(${_img_cursor_add_svg__WEBPACK_IMPORTED_MODULE_3__["default"]}) 2 2, auto`,
			},
			// iconBarTooltip: {
			// 	src: `${base.scriptDir}/add_icon.png`,
			// 	width: 16,
			// 	height: 16,
			// 	offsetX: 10, offsetY: 10,
			// },

			pics: {
				width: 50, // width of bars, rectangles, cuboids
				//cuboidDepth: 18, // '3d' cube: movement to right and to top

				spacing: 12,

				//barSpacing:	5,	// vertical spacing between bars
				//barSeparator: 5,	// extra vertical space below 5 bars

				radius: 1.4,	// radius if dots
				//dotSpacing:	5,	// vertical spacing between dots
				//dotSeparator: 2,	// extra vertical space besides 5 dots
				dotFill: 'black',

				stroke: 'black',
				strokeWidth: 2,
				lineCap: 'square',

				cursorOver: `url(${_img_cursor_del_svg__WEBPACK_IMPORTED_MODULE_4__["default"]}) 2 2, auto`,
			},
			// picsTooltip: {		// Cursor mouseover
			// 	src: `${base.scriptDir}/delete_icon.png`,
			// 	width: 20,
			// 	height: 20,
			// },


			// contains all cols as arays
			// entries: { 'c':<number of cuboids>, 'r':<number of rectangles>, 'b':<number of bars in col>, 'd':<number of dots in col> }
			data: [],

			readonly: 0,
			logObjectId: 1,
		}
		;(0,_common__WEBPACK_IMPORTED_MODULE_5__.mergeDeep)( Object.assign( this, defaults ), opts );
		const sepExtraMult = 0.6;
		if ( !this.pics.cuboid ) 		this.pics.cuboidDepth = this.pics.width*18/50;
		if ( !this.pics.barSpacing )	this.pics.barSpacing = this.pics.width/(9+sepExtraMult);
		if ( !this.pics.barSeparator )	this.pics.barSeparator = this.pics.barSpacing*sepExtraMult;
		if ( !this.pics.dotSpacing )	this.pics.dotSpacing = (this.pics.width-2*this.pics.radius)/(9+sepExtraMult);
		if ( !this.pics.dotSeparator )	this.pics.dotSeparator = this.pics.dotSpacing*sepExtraMult;

		this.base = base;
		const stage = base.stage;
		this.stage = stage;
		this.usedWidth = 0;

		// this.tooltip = new tooltip( stage );
		// stage.on( 'mouseleave', () => this.tooltip.hide() );

		// Render iconBar
		if ( this.iconBar.x && this.iconBar.y ) {
			const iconDepth = this.iconBar.width*this.pics.cuboidDepth/(this.pics.width+this.pics.cuboidDepth);
			const iconRadius = this.pics.radius*1.5;

			const iconBarOpts = (0,_common__WEBPACK_IMPORTED_MODULE_5__.mergeDeep)( this.iconBar, {
				sticky: false,

				icons: [
					{ kCreateFunc: function (x,y) {
						return this.cuboid({
							x: x, y: y+iconDepth,
							cuboidDepth: iconDepth,
							width: this.iconBar.width - iconDepth,
							strokeWidth: 1,
						})}.bind(this),
						// tooltipImage: this.iconBarTooltip,
						cursorOver: this.iconBar.cursorOver,
						on: () => this.addShape('c'),
					},
					{ kCreateFunc: function (x,y) {
						return this.rectangle({
							x: x+iconDepth/2, y: y+iconDepth/2,
							width: this.iconBar.width - iconDepth,
							strokeWidth: 1,
						})}.bind(this),
						// tooltipImage: this.iconBarTooltip,
						cursorOver: this.iconBar.cursorOver,
						on: () => this.addShape('r'),
					},
					{ kCreateFunc: function (x,y) {
						return this.bar({
							x: x+iconDepth/2, y: y+this.iconBar.width/2,
							width: this.iconBar.width - iconDepth,
							strokeWidth: 2,
						})}.bind(this),
						// tooltipImage: this.iconBarTooltip,
						cursorOver: this.iconBar.cursorOver,
						on: () => this.addShape('b'),
					},
					{ kCreateFunc: function (x,y) {
						return this.dot({
							x: x+this.iconBar.width/2-iconRadius, y: y+this.iconBar.width/2-iconRadius,
							width: this.iconBar.width - iconDepth,
							radius: iconRadius,
						})}.bind(this),
						// tooltipImage: this.iconBarTooltip,
						cursorOver: this.iconBar.cursorOver,
						on: () => this.addShape('d'),
					},
				],
			})

			new _iconBar__WEBPACK_IMPORTED_MODULE_6__.iconBar( stage, iconBarOpts );
		}

		if ( this.data.length ) {
			this.drawShapes();
		}

		this.initData = (0,_common__WEBPACK_IMPORTED_MODULE_5__.delDefaults)( this.data );
		this.base.sendChangeState( this );	// init & send changeState & score
	}

	///////////////////////////////////

	newColSpace ( shape ) {
		return this.usedWidth + this.pics.spacing + this.pics.width + ( shape=='c' ? this.pics.cuboidDepth : 0 ) <= this.width;
	}

	changeAndRearrangeBarsDots ( changeFnc, logEvent, shape ) {

		// copy cudoids and rects
		const cub_rec = this.data.filter( e => e.c || e.r );
		// count bars and dots
		let cnt = { b:0, d:0 };
		this.data.forEach( e => {
			cnt.b += e.b || 0;
			cnt.d += e.d || 0;
		})
		// add new element / del existing
		changeFnc( cnt );

		// is space for changed
		if ( cnt.b*10 + cnt.d <= ( this.data.length - cub_rec.length )*100 || this.newColSpace() ) {
			this.base.postLog( logEvent, {
				id: this.logObjectId,
				shape
			});
			this.data = cub_rec;
			// add new bars and dots
			while ( cnt.b || cnt.d ) {
				let new_elem = {};
				if ( cnt.b>0 ) {
					const e = Math.min( cnt.b, 10 );
					new_elem.b = e;
					cnt.b -= e;
				}
				if ( cnt.d>0 ) {
					const e = Math.min( cnt.d, 100-(new_elem.b || 0)*10 );
					if ( e>0 ) {
						new_elem.d = e;
						cnt.d -= e;
					}
				}
				this.data.push( new_elem );
			}
		}
	}

	addShape ( shape ) {

		if ( !this.readonly ) {

			// cuboid or rectangle
			if ( shape=='c' || shape=='r' ) {

				// enough space for new col?
				if ( this.newColSpace(shape) ) {
					this.base.postLog( 'shapeAdded', {
						id: this.logObjectId,
						shape,
					});

					// Insert new element
					if ( shape=='c' ) {
						this.data.unshift( { c : 1 } );
					} else {
						const i = this.data.findIndex( e => !( 'c' in e ) || e.c==0 );
						this.data.splice( i<0 ? this.data.length : i, 0, { r : 1 } );
					}
				}

			} else {

				this.changeAndRearrangeBarsDots( cnt => cnt[shape]++, 'shapeAdded', shape );

			}

			this.drawShapes();
			this.base.sendChangeState( this );
		}
	}

	delShape ( nr, shape = null ) {

		if ( !this.readonly ) {
			this.restoreCursor();
			// if ( this.tooltip ) {
			// 	this.tooltip.hide();
			// }

			if ( shape=='b' || shape=='d' ) {

				this.changeAndRearrangeBarsDots( cnt => {
					if ( cnt[shape]>0 ) {
						cnt[shape]--
					}
				}, "shapeDeleted", shape )

			} else {

				this.base.postLog('shapeDeleted', {
					id: this.logObjectId,
					shape: this.data[nr].c>0 ? 'c' : 'r',
				});
				this.data.splice( nr, 1 );
			}

			this.drawShapes();
			this.base.sendChangeState( this );
		}
	}

	drawShapes () {

		const new_layer = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Layer();
		let x = this.x;
		let y = this.y;

		this.data.forEach( ( dat, nr ) => {

			const setInteract = ( kObj, event, callback ) => {
				if ( !this.readonly ) {
					kObj.on( event, (ev) => {
						callback();
						ev.cancelBubble = true;
					});
					if ( this.pics.cursorOver ) {
						kObj.on( 'mouseenter', () => this.setCursor() );
						kObj.on( 'mouseleave', (ev) => {
							if ( (0,_common__WEBPACK_IMPORTED_MODULE_5__.ignoreEvent)( this.stage, ev ) ) {
								return;
							}
							this.restoreCursor();
						});
					}
					// if ( this.picsTooltip ) {
					// 	kObj.on( 'mouseenter', () => this.tooltip.showImage( this.picsTooltip ) );
					// 	kObj.on( 'mouseleave', () => this.tooltip.hide() );
					// }
				}
			}

			// Cuboid
			if ( dat.c ) {
				const kObj = this.cuboid( { x: x, y: y } );
				new_layer.add( kObj );
				setInteract( kObj, 'mousedown touchstart', () => this.delShape( nr ) );
				x += this.pics.width + this.pics.cuboidDepth;

			// Rectangle
			} else if ( dat.r ) {
				const kObj = this.rectangle( { x: x, y: y } );
				setInteract( kObj, 'mousedown touchstart', () => this.delShape( nr ) );
				new_layer.add( kObj );

				x += this.pics.width;

			// Bars and dots
			} else {

				let yt = y;
				// bars
				if ( dat.b ) {
					for ( let h=1; h<=dat.b; h++ ) {
						const kObj = this.bar( { x: x, y: yt } );
						new_layer.add( kObj );
						setInteract( kObj, 'mousedown touchstart', () => this.delShape( nr, 'b' ) );
						yt += this.pics.barSpacing;
						if ( !( h % 5 ) && ( h<dat.b || dat.d ) ) {
							yt += this.pics.barSeparator;
						}
					}
				}

				// dots
				let xt = x;
				if ( dat.d ) {
					for ( let h=1; h<=dat.d; h++ ) {
						const kObj = this.dot( { x: xt+this.pics.radius, y: yt } );
						new_layer.add( kObj );
						setInteract( kObj, 'mousedown touchstart', () => this.delShape( nr, 'd' ) );
						xt += this.pics.dotSpacing;
						if ( !( h % 5 ) && h<dat.d ) {
							xt += this.pics.dotSeparator;
						}
						if ( !( h % 10 ) && !( ( ( dat.b || 0 ) + h/10 ) % 5 ) ) {
							yt += this.pics.barSeparator;
						}
						if ( !( h % 10 ) ) {
							xt = x;
							yt += this.pics.barSpacing;
						}
					}
				}

				x += ( dat.b || dat.d>9 ) ? this.pics.width : xt-x;
			}

			x += this.pics.spacing;
		})
		this.usedWidth = x - this.x;

		if ( this.layer ) {
			this.layer.destroy();
		}
		this.layer = new_layer;
		this.stage.add( this.layer );
		this.layer.moveToBottom();
	}

	setCursor () {
		this.cursorSaved = document.body.style.cursor;
		document.body.style.cursor = this.pics.cursorOver;
		this.cursorSet = document.body.style.cursor;
	}

	restoreCursor () {
		if ( document.body.style.cursor == this.cursorSet ) {
			document.body.style.cursor = this.cursorSaved
			this.cursorSet = null;
		}
	}

	///////////////////////////////////

	cuboid ( opts = {} ) {
		const o = Object.assign( {}, this.pics, opts );

		o.sceneFunc = function ( context, shape ) {
			context.beginPath();
			context.rect( 0, 0, o.width, o.width );

			context.moveTo( 0, 0, );
			context.lineTo( o.cuboidDepth, -o.cuboidDepth );
			context.lineTo( o.cuboidDepth+o.width, -o.cuboidDepth );
			context.lineTo( o.cuboidDepth+o.width, -o.cuboidDepth+o.width );
			context.lineTo( o.width, o.width);
			context.moveTo( o.width, 0, );
			context.lineTo( o.width+o.cuboidDepth, -o.cuboidDepth );
			context.closePath();

			context.fillStrokeShape(shape);
		}

		return new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Shape( o );
	}

	rectangle ( opts = {} ) {
		const o = Object.assign( {}, this.pics, opts );
		o.height = o.width;
		o.hitStrokeWidth = o.strokeWidth+o.barSpacing;

		return new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Rect( o );
	}

	bar ( opts = {} ) {
		const o = Object.assign( {}, this.pics, opts );
		o.hitStrokeWidth = o.strokeWidth+o.dotSpacing;
		o.points = [ o.x, o.y, o.x+o.width, o.y ];

		return new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Rect( o );
	}

	dot ( opts = {} ) {
		const o = Object.assign( {}, this.pics, opts );
		o.fill = this.pics.dotFill;
		o.hitStrokeWidth = o.strokeWidth*2;

		return new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Circle( o );
	}

	///////////////////////////////////

	getState () {

		const state = {
			data: this.data,
		};
		return JSON.stringify( state );
	}

	setState( state ) {

		try {

			const load = JSON.parse(state);
			this.data = load.data;
			this.drawShapes();

		} catch (e) {
			console.error(e);
		}

		(0,_common__WEBPACK_IMPORTED_MODULE_5__.setStatePostProc)(this);
	}

	// Check if User made changes
	getDefaultChangeState () {
		return !(0,_common__WEBPACK_IMPORTED_MODULE_5__.object_equals)( this.data, this.initData );
	}

}


/***/ }),

/***/ "./libs/tooltip.js":
/*!*************************!*\
  !*** ./libs/tooltip.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tooltip": () => (/* binding */ tooltip)
/* harmony export */ });
/* harmony import */ var konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! konva/lib/Core */ "../node_modules/konva/lib/Core.js");
/* harmony import */ var konva_lib_shapes_Image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! konva/lib/shapes/Image */ "../node_modules/konva/lib/shapes/Image.js");



class tooltip {

	constructor ( stage ) {
		this.stage = stage;
		this.layer = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Layer();
		stage.add( this.layer );

		this.image = null;
		this.kImages = {};	// { [src]: KONVA.Image }
	}

	///////////////////////////////////

	showImage ( defs={} ) {

		['width','height','src'].forEach( o => {
			if ( !( o in defs ) ) {
				throw( `tooltip: parameter '${o}' not specified!` );
			}
		});
		const defaults = {
			// width, height, src	// properties of image
			offsetX: 10, 	// offset to mousepointer position
			offsetY: 10,
			konvaOpts: {},
			kImages: [],
		};
		defs = Object.assign( {}, defaults, defs );

		// image loaded?
		if ( defs.src in this.kImages ) {

			this.image = this.kImages[ defs.src ];
			this.image.x( this.stage.getPointerPosition().x + defs.offsetX );
			this.image.y( this.stage.getPointerPosition().y + defs.offsetY );
			this.image.visible( true );
			this.layer.batchDraw();

		} else {

			// load image
			const image = new Image();
			image.onload = () => {
				if ( this.loading ) {
					this.image = new konva_lib_Core__WEBPACK_IMPORTED_MODULE_0__["default"].Image( Object.assign( {
						x: this.stage.getPointerPosition().x + defs.offsetX,
						y: this.stage.getPointerPosition().y + defs.offsetY,
						width: defs.width,
						height: defs.height,
						image,
					}, defs.konvaOpts ) );
					this.kImages[defs.src] = this.image;
					this.layer.add( this.image );
					this.layer.draw();
				}
			}
			this.loading = 1;
			image.src = defs.src;
		}

		this.stage.on( "mousemove.tooltip", function () {
			if ( this.image) {
// console.log( this.stage.getPointerPosition().x + defs.offsetX, this.stage.getPointerPosition().y + defs.offsetY )
				this.image.x( this.stage.getPointerPosition().x + defs.offsetX );
				this.image.y( this.stage.getPointerPosition().y + defs.offsetY );
				this.layer.batchDraw();
			}
		}.bind(this) );

		this.layer.moveToTop();
	}

	hide () {
		this.loading = 0;
		this.stage.off( "mousemove.tooltip" );
		if ( this.image) {
			this.image.visible(false);
			this.image = null;
			this.layer.batchDraw();
		}
	}

}


/***/ }),

/***/ "./main.css":
/*!******************!*\
  !*** ./main.css ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "../node_modules/konva/lib/Animation.js":
/*!**********************************************!*\
  !*** ../node_modules/konva/lib/Animation.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Animation": () => (/* binding */ Animation)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");


var now = (function () {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.glob.performance && _Global_js__WEBPACK_IMPORTED_MODULE_0__.glob.performance.now) {
        return function () {
            return _Global_js__WEBPACK_IMPORTED_MODULE_0__.glob.performance.now();
        };
    }
    return function () {
        return new Date().getTime();
    };
})();
class Animation {
    constructor(func, layers) {
        this.id = Animation.animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: now(),
            frameRate: 0,
        };
        this.func = func;
        this.setLayers(layers);
    }
    setLayers(layers) {
        var lays = [];
        if (!layers) {
            lays = [];
        }
        else if (layers.length > 0) {
            lays = layers;
        }
        else {
            lays = [layers];
        }
        this.layers = lays;
        return this;
    }
    getLayers() {
        return this.layers;
    }
    addLayer(layer) {
        var layers = this.layers, len = layers.length, n;
        for (n = 0; n < len; n++) {
            if (layers[n]._id === layer._id) {
                return false;
            }
        }
        this.layers.push(layer);
        return true;
    }
    isRunning() {
        var a = Animation, animations = a.animations, len = animations.length, n;
        for (n = 0; n < len; n++) {
            if (animations[n].id === this.id) {
                return true;
            }
        }
        return false;
    }
    start() {
        this.stop();
        this.frame.timeDiff = 0;
        this.frame.lastTime = now();
        Animation._addAnimation(this);
        return this;
    }
    stop() {
        Animation._removeAnimation(this);
        return this;
    }
    _updateFrameObject(time) {
        this.frame.timeDiff = time - this.frame.lastTime;
        this.frame.lastTime = time;
        this.frame.time += this.frame.timeDiff;
        this.frame.frameRate = 1000 / this.frame.timeDiff;
    }
    static _addAnimation(anim) {
        this.animations.push(anim);
        this._handleAnimation();
    }
    static _removeAnimation(anim) {
        var id = anim.id, animations = this.animations, len = animations.length, n;
        for (n = 0; n < len; n++) {
            if (animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    }
    static _runFrames() {
        var layerHash = {}, animations = this.animations, anim, layers, func, n, i, layersLen, layer, key, needRedraw;
        for (n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;
            anim._updateFrameObject(now());
            layersLen = layers.length;
            if (func) {
                needRedraw = func.call(anim, anim.frame) !== false;
            }
            else {
                needRedraw = true;
            }
            if (!needRedraw) {
                continue;
            }
            for (i = 0; i < layersLen; i++) {
                layer = layers[i];
                if (layer._id !== undefined) {
                    layerHash[layer._id] = layer;
                }
            }
        }
        for (key in layerHash) {
            if (!layerHash.hasOwnProperty(key)) {
                continue;
            }
            layerHash[key].batchDraw();
        }
    }
    static _animationLoop() {
        var Anim = Animation;
        if (Anim.animations.length) {
            Anim._runFrames();
            _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.requestAnimFrame(Anim._animationLoop);
        }
        else {
            Anim.animRunning = false;
        }
    }
    static _handleAnimation() {
        if (!this.animRunning) {
            this.animRunning = true;
            _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.requestAnimFrame(this._animationLoop);
        }
    }
}
Animation.animations = [];
Animation.animIdCounter = 0;
Animation.animRunning = false;


/***/ }),

/***/ "../node_modules/konva/lib/Canvas.js":
/*!*******************************************!*\
  !*** ../node_modules/konva/lib/Canvas.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Canvas": () => (/* binding */ Canvas),
/* harmony export */   "SceneCanvas": () => (/* binding */ SceneCanvas),
/* harmony export */   "HitCanvas": () => (/* binding */ HitCanvas)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Context.js */ "../node_modules/konva/lib/Context.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Validators.js */ "../node_modules/konva/lib/Validators.js");





var _pixelRatio;
function getDevicePixelRatio() {
    if (_pixelRatio) {
        return _pixelRatio;
    }
    var canvas = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.createCanvasElement();
    var context = canvas.getContext('2d');
    _pixelRatio = (function () {
        var devicePixelRatio = _Global_js__WEBPACK_IMPORTED_MODULE_2__.Konva._global.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1;
        return devicePixelRatio / backingStoreRatio;
    })();
    return _pixelRatio;
}
class Canvas {
    constructor(config) {
        this.pixelRatio = 1;
        this.width = 0;
        this.height = 0;
        this.isCache = false;
        var conf = config || {};
        var pixelRatio = conf.pixelRatio || _Global_js__WEBPACK_IMPORTED_MODULE_2__.Konva.pixelRatio || getDevicePixelRatio();
        this.pixelRatio = pixelRatio;
        this._canvas = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.createCanvasElement();
        this._canvas.style.padding = '0';
        this._canvas.style.margin = '0';
        this._canvas.style.border = '0';
        this._canvas.style.background = 'transparent';
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0';
        this._canvas.style.left = '0';
    }
    getContext() {
        return this.context;
    }
    getPixelRatio() {
        return this.pixelRatio;
    }
    setPixelRatio(pixelRatio) {
        var previousRatio = this.pixelRatio;
        this.pixelRatio = pixelRatio;
        this.setSize(this.getWidth() / previousRatio, this.getHeight() / previousRatio);
    }
    setWidth(width) {
        this.width = this._canvas.width = width * this.pixelRatio;
        this._canvas.style.width = width + 'px';
        var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    }
    setHeight(height) {
        this.height = this._canvas.height = height * this.pixelRatio;
        this._canvas.style.height = height + 'px';
        var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    setSize(width, height) {
        this.setWidth(width || 0);
        this.setHeight(height || 0);
    }
    toDataURL(mimeType, quality) {
        try {
            return this._canvas.toDataURL(mimeType, quality);
        }
        catch (e) {
            try {
                return this._canvas.toDataURL();
            }
            catch (err) {
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Unable to get data URL. ' +
                    err.message +
                    ' For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                return '';
            }
        }
    }
}
_Factory_js__WEBPACK_IMPORTED_MODULE_3__.Factory.addGetterSetter(Canvas, 'pixelRatio', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
class SceneCanvas extends Canvas {
    constructor(config = { width: 0, height: 0 }) {
        super(config);
        this.context = new _Context_js__WEBPACK_IMPORTED_MODULE_1__.SceneContext(this);
        this.setSize(config.width, config.height);
    }
}
class HitCanvas extends Canvas {
    constructor(config = { width: 0, height: 0 }) {
        super(config);
        this.hitCanvas = true;
        this.context = new _Context_js__WEBPACK_IMPORTED_MODULE_1__.HitContext(this);
        this.setSize(config.width, config.height);
    }
}


/***/ }),

/***/ "../node_modules/konva/lib/Container.js":
/*!**********************************************!*\
  !*** ../node_modules/konva/lib/Container.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Container": () => (/* binding */ Container)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Node.js */ "../node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Validators.js */ "../node_modules/konva/lib/Validators.js");



class Container extends _Node_js__WEBPACK_IMPORTED_MODULE_1__.Node {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    getChildren(filterFunc) {
        if (!filterFunc) {
            return this.children || [];
        }
        const children = this.children || [];
        var results = [];
        children.forEach(function (child) {
            if (filterFunc(child)) {
                results.push(child);
            }
        });
        return results;
    }
    hasChildren() {
        return this.getChildren().length > 0;
    }
    removeChildren() {
        this.getChildren().forEach((child) => {
            child.parent = null;
            child.index = 0;
            child.remove();
        });
        this.children = [];
        this._requestDraw();
        return this;
    }
    destroyChildren() {
        this.getChildren().forEach((child) => {
            child.parent = null;
            child.index = 0;
            child.destroy();
        });
        this.children = [];
        this._requestDraw();
        return this;
    }
    add(...children) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        var child = children[0];
        if (child.getParent()) {
            child.moveTo(this);
            return this;
        }
        this._validateAdd(child);
        child.index = this.getChildren().length;
        child.parent = this;
        child._clearCaches();
        this.getChildren().push(child);
        this._fire('add', {
            child: child,
        });
        this._requestDraw();
        return this;
    }
    destroy() {
        if (this.hasChildren()) {
            this.destroyChildren();
        }
        super.destroy();
        return this;
    }
    find(selector) {
        return this._generalFind(selector, false);
    }
    findOne(selector) {
        var result = this._generalFind(selector, true);
        return result.length > 0 ? result[0] : undefined;
    }
    _generalFind(selector, findOne) {
        var retArr = [];
        this._descendants((node) => {
            const valid = node._isMatch(selector);
            if (valid) {
                retArr.push(node);
            }
            if (valid && findOne) {
                return true;
            }
            return false;
        });
        return retArr;
    }
    _descendants(fn) {
        let shouldStop = false;
        const children = this.getChildren();
        for (const child of children) {
            shouldStop = fn(child);
            if (shouldStop) {
                return true;
            }
            if (!child.hasChildren()) {
                continue;
            }
            shouldStop = child._descendants(fn);
            if (shouldStop) {
                return true;
            }
        }
        return false;
    }
    toObject() {
        var obj = _Node_js__WEBPACK_IMPORTED_MODULE_1__.Node.prototype.toObject.call(this);
        obj.children = [];
        this.getChildren().forEach((child) => {
            obj.children.push(child.toObject());
        });
        return obj;
    }
    isAncestorOf(node) {
        var parent = node.getParent();
        while (parent) {
            if (parent._id === this._id) {
                return true;
            }
            parent = parent.getParent();
        }
        return false;
    }
    clone(obj) {
        var node = _Node_js__WEBPACK_IMPORTED_MODULE_1__.Node.prototype.clone.call(this, obj);
        this.getChildren().forEach(function (no) {
            node.add(no.clone());
        });
        return node;
    }
    getAllIntersections(pos) {
        var arr = [];
        this.find('Shape').forEach(function (shape) {
            if (shape.isVisible() && shape.intersects(pos)) {
                arr.push(shape);
            }
        });
        return arr;
    }
    _clearSelfAndDescendantCache(attr) {
        var _a;
        super._clearSelfAndDescendantCache(attr);
        if (this.isCached()) {
            return;
        }
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (node) {
            node._clearSelfAndDescendantCache(attr);
        });
    }
    _setChildrenIndices() {
        var _a;
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child, n) {
            child.index = n;
        });
        this._requestDraw();
    }
    drawScene(can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas()), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;
        var caching = canvas && canvas.isCache;
        if (!this.isVisible() && !caching) {
            return this;
        }
        if (cachedSceneCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedSceneCanvas(context);
            context.restore();
        }
        else {
            this._drawChildren('drawScene', canvas, top);
        }
        return this;
    }
    drawHit(can, top) {
        if (!this.shouldDrawHit(top)) {
            return this;
        }
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
        if (cachedHitCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedHitCanvas(context);
            context.restore();
        }
        else {
            this._drawChildren('drawHit', canvas, top);
        }
        return this;
    }
    _drawChildren(drawMethod, canvas, top) {
        var _a;
        var context = canvas && canvas.getContext(), clipWidth = this.clipWidth(), clipHeight = this.clipHeight(), clipFunc = this.clipFunc(), hasClip = (clipWidth && clipHeight) || clipFunc;
        const selfCache = top === this;
        if (hasClip) {
            context.save();
            var transform = this.getAbsoluteTransform(top);
            var m = transform.getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            context.beginPath();
            if (clipFunc) {
                clipFunc.call(this, context, this);
            }
            else {
                var clipX = this.clipX();
                var clipY = this.clipY();
                context.rect(clipX, clipY, clipWidth, clipHeight);
            }
            context.clip();
            m = transform.copy().invert().getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        var hasComposition = !selfCache &&
            this.globalCompositeOperation() !== 'source-over' &&
            drawMethod === 'drawScene';
        if (hasComposition) {
            context.save();
            context._applyGlobalCompositeOperation(this);
        }
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            child[drawMethod](canvas, top);
        });
        if (hasComposition) {
            context.restore();
        }
        if (hasClip) {
            context.restore();
        }
    }
    getClientRect(config) {
        var _a;
        config = config || {};
        var skipTransform = config.skipTransform;
        var relativeTo = config.relativeTo;
        var minX, minY, maxX, maxY;
        var selfRect = {
            x: Infinity,
            y: Infinity,
            width: 0,
            height: 0,
        };
        var that = this;
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            if (!child.visible()) {
                return;
            }
            var rect = child.getClientRect({
                relativeTo: that,
                skipShadow: config.skipShadow,
                skipStroke: config.skipStroke,
            });
            if (rect.width === 0 && rect.height === 0) {
                return;
            }
            if (minX === undefined) {
                minX = rect.x;
                minY = rect.y;
                maxX = rect.x + rect.width;
                maxY = rect.y + rect.height;
            }
            else {
                minX = Math.min(minX, rect.x);
                minY = Math.min(minY, rect.y);
                maxX = Math.max(maxX, rect.x + rect.width);
                maxY = Math.max(maxY, rect.y + rect.height);
            }
        });
        var shapes = this.find('Shape');
        var hasVisible = false;
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (shape._isVisible(this)) {
                hasVisible = true;
                break;
            }
        }
        if (hasVisible && minX !== undefined) {
            selfRect = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
            };
        }
        else {
            selfRect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            };
        }
        if (!skipTransform) {
            return this._transformedRect(selfRect, relativeTo);
        }
        return selfRect;
    }
}
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addComponentsGetterSetter(Container, 'clip', [
    'x',
    'y',
    'width',
    'height',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipX', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipY', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipWidth', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipHeight', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipFunc');


/***/ }),

/***/ "../node_modules/konva/lib/Context.js":
/*!********************************************!*\
  !*** ../node_modules/konva/lib/Context.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Context": () => (/* binding */ Context),
/* harmony export */   "SceneContext": () => (/* binding */ SceneContext),
/* harmony export */   "HitContext": () => (/* binding */ HitContext)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");


function simplifyArray(arr) {
    var retArr = [], len = arr.length, util = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util, n, val;
    for (n = 0; n < len; n++) {
        val = arr[n];
        if (util._isNumber(val)) {
            val = Math.round(val * 1000) / 1000;
        }
        else if (!util._isString(val)) {
            val = val + '';
        }
        retArr.push(val);
    }
    return retArr;
}
var COMMA = ',', OPEN_PAREN = '(', CLOSE_PAREN = ')', OPEN_PAREN_BRACKET = '([', CLOSE_BRACKET_PAREN = '])', SEMICOLON = ';', DOUBLE_PAREN = '()', EQUALS = '=', CONTEXT_METHODS = [
    'arc',
    'arcTo',
    'beginPath',
    'bezierCurveTo',
    'clearRect',
    'clip',
    'closePath',
    'createLinearGradient',
    'createPattern',
    'createRadialGradient',
    'drawImage',
    'ellipse',
    'fill',
    'fillText',
    'getImageData',
    'createImageData',
    'lineTo',
    'moveTo',
    'putImageData',
    'quadraticCurveTo',
    'rect',
    'restore',
    'rotate',
    'save',
    'scale',
    'setLineDash',
    'setTransform',
    'stroke',
    'strokeText',
    'transform',
    'translate',
];
var CONTEXT_PROPERTIES = [
    'fillStyle',
    'strokeStyle',
    'shadowColor',
    'shadowBlur',
    'shadowOffsetX',
    'shadowOffsetY',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'font',
    'textAlign',
    'textBaseline',
    'globalAlpha',
    'globalCompositeOperation',
    'imageSmoothingEnabled',
];
const traceArrMax = 100;
class Context {
    constructor(canvas) {
        this.canvas = canvas;
        this._context = canvas._canvas.getContext('2d');
        if (_Global_js__WEBPACK_IMPORTED_MODULE_1__.Konva.enableTrace) {
            this.traceArr = [];
            this._enableTrace();
        }
    }
    fillShape(shape) {
        if (shape.fillEnabled()) {
            this._fill(shape);
        }
    }
    _fill(shape) {
    }
    strokeShape(shape) {
        if (shape.hasStroke()) {
            this._stroke(shape);
        }
    }
    _stroke(shape) {
    }
    fillStrokeShape(shape) {
        if (shape.attrs.fillAfterStrokeEnabled) {
            this.strokeShape(shape);
            this.fillShape(shape);
        }
        else {
            this.fillShape(shape);
            this.strokeShape(shape);
        }
    }
    getTrace(relaxed, rounded) {
        var traceArr = this.traceArr, len = traceArr.length, str = '', n, trace, method, args;
        for (n = 0; n < len; n++) {
            trace = traceArr[n];
            method = trace.method;
            if (method) {
                args = trace.args;
                str += method;
                if (relaxed) {
                    str += DOUBLE_PAREN;
                }
                else {
                    if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isArray(args[0])) {
                        str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
                    }
                    else {
                        if (rounded) {
                            args = args.map((a) => typeof a === 'number' ? Math.floor(a) : a);
                        }
                        str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
                    }
                }
            }
            else {
                str += trace.property;
                if (!relaxed) {
                    str += EQUALS + trace.val;
                }
            }
            str += SEMICOLON;
        }
        return str;
    }
    clearTrace() {
        this.traceArr = [];
    }
    _trace(str) {
        var traceArr = this.traceArr, len;
        traceArr.push(str);
        len = traceArr.length;
        if (len >= traceArrMax) {
            traceArr.shift();
        }
    }
    reset() {
        var pixelRatio = this.getCanvas().getPixelRatio();
        this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
    }
    getCanvas() {
        return this.canvas;
    }
    clear(bounds) {
        var canvas = this.getCanvas();
        if (bounds) {
            this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
        }
        else {
            this.clearRect(0, 0, canvas.getWidth() / canvas.pixelRatio, canvas.getHeight() / canvas.pixelRatio);
        }
    }
    _applyLineCap(shape) {
        var lineCap = shape.getLineCap();
        if (lineCap) {
            this.setAttr('lineCap', lineCap);
        }
    }
    _applyOpacity(shape) {
        var absOpacity = shape.getAbsoluteOpacity();
        if (absOpacity !== 1) {
            this.setAttr('globalAlpha', absOpacity);
        }
    }
    _applyLineJoin(shape) {
        var lineJoin = shape.attrs.lineJoin;
        if (lineJoin) {
            this.setAttr('lineJoin', lineJoin);
        }
    }
    setAttr(attr, val) {
        this._context[attr] = val;
    }
    arc(a0, a1, a2, a3, a4, a5) {
        this._context.arc(a0, a1, a2, a3, a4, a5);
    }
    arcTo(a0, a1, a2, a3, a4) {
        this._context.arcTo(a0, a1, a2, a3, a4);
    }
    beginPath() {
        this._context.beginPath();
    }
    bezierCurveTo(a0, a1, a2, a3, a4, a5) {
        this._context.bezierCurveTo(a0, a1, a2, a3, a4, a5);
    }
    clearRect(a0, a1, a2, a3) {
        this._context.clearRect(a0, a1, a2, a3);
    }
    clip() {
        this._context.clip();
    }
    closePath() {
        this._context.closePath();
    }
    createImageData(a0, a1) {
        var a = arguments;
        if (a.length === 2) {
            return this._context.createImageData(a0, a1);
        }
        else if (a.length === 1) {
            return this._context.createImageData(a0);
        }
    }
    createLinearGradient(a0, a1, a2, a3) {
        return this._context.createLinearGradient(a0, a1, a2, a3);
    }
    createPattern(a0, a1) {
        return this._context.createPattern(a0, a1);
    }
    createRadialGradient(a0, a1, a2, a3, a4, a5) {
        return this._context.createRadialGradient(a0, a1, a2, a3, a4, a5);
    }
    drawImage(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        var a = arguments, _context = this._context;
        if (a.length === 3) {
            _context.drawImage(a0, a1, a2);
        }
        else if (a.length === 5) {
            _context.drawImage(a0, a1, a2, a3, a4);
        }
        else if (a.length === 9) {
            _context.drawImage(a0, a1, a2, a3, a4, a5, a6, a7, a8);
        }
    }
    ellipse(a0, a1, a2, a3, a4, a5, a6, a7) {
        this._context.ellipse(a0, a1, a2, a3, a4, a5, a6, a7);
    }
    isPointInPath(x, y) {
        return this._context.isPointInPath(x, y);
    }
    fill(path2d) {
        if (path2d) {
            this._context.fill(path2d);
        }
        else {
            this._context.fill();
        }
    }
    fillRect(x, y, width, height) {
        this._context.fillRect(x, y, width, height);
    }
    strokeRect(x, y, width, height) {
        this._context.strokeRect(x, y, width, height);
    }
    fillText(text, x, y, maxWidth) {
        if (maxWidth) {
            this._context.fillText(text, x, y, maxWidth);
        }
        else {
            this._context.fillText(text, x, y);
        }
    }
    measureText(text) {
        return this._context.measureText(text);
    }
    getImageData(a0, a1, a2, a3) {
        return this._context.getImageData(a0, a1, a2, a3);
    }
    lineTo(a0, a1) {
        this._context.lineTo(a0, a1);
    }
    moveTo(a0, a1) {
        this._context.moveTo(a0, a1);
    }
    rect(a0, a1, a2, a3) {
        this._context.rect(a0, a1, a2, a3);
    }
    putImageData(a0, a1, a2) {
        this._context.putImageData(a0, a1, a2);
    }
    quadraticCurveTo(a0, a1, a2, a3) {
        this._context.quadraticCurveTo(a0, a1, a2, a3);
    }
    restore() {
        this._context.restore();
    }
    rotate(a0) {
        this._context.rotate(a0);
    }
    save() {
        this._context.save();
    }
    scale(a0, a1) {
        this._context.scale(a0, a1);
    }
    setLineDash(a0) {
        if (this._context.setLineDash) {
            this._context.setLineDash(a0);
        }
        else if ('mozDash' in this._context) {
            this._context['mozDash'] = a0;
        }
        else if ('webkitLineDash' in this._context) {
            this._context['webkitLineDash'] = a0;
        }
    }
    getLineDash() {
        return this._context.getLineDash();
    }
    setTransform(a0, a1, a2, a3, a4, a5) {
        this._context.setTransform(a0, a1, a2, a3, a4, a5);
    }
    stroke(path2d) {
        if (path2d) {
            this._context.stroke(path2d);
        }
        else {
            this._context.stroke();
        }
    }
    strokeText(a0, a1, a2, a3) {
        this._context.strokeText(a0, a1, a2, a3);
    }
    transform(a0, a1, a2, a3, a4, a5) {
        this._context.transform(a0, a1, a2, a3, a4, a5);
    }
    translate(a0, a1) {
        this._context.translate(a0, a1);
    }
    _enableTrace() {
        var that = this, len = CONTEXT_METHODS.length, origSetter = this.setAttr, n, args;
        var func = function (methodName) {
            var origMethod = that[methodName], ret;
            that[methodName] = function () {
                args = simplifyArray(Array.prototype.slice.call(arguments, 0));
                ret = origMethod.apply(that, arguments);
                that._trace({
                    method: methodName,
                    args: args,
                });
                return ret;
            };
        };
        for (n = 0; n < len; n++) {
            func(CONTEXT_METHODS[n]);
        }
        that.setAttr = function () {
            origSetter.apply(that, arguments);
            var prop = arguments[0];
            var val = arguments[1];
            if (prop === 'shadowOffsetX' ||
                prop === 'shadowOffsetY' ||
                prop === 'shadowBlur') {
                val = val / this.canvas.getPixelRatio();
            }
            that._trace({
                property: prop,
                val: val,
            });
        };
    }
    _applyGlobalCompositeOperation(node) {
        const op = node.attrs.globalCompositeOperation;
        var def = !op || op === 'source-over';
        if (!def) {
            this.setAttr('globalCompositeOperation', op);
        }
    }
}
CONTEXT_PROPERTIES.forEach(function (prop) {
    Object.defineProperty(Context.prototype, prop, {
        get() {
            return this._context[prop];
        },
        set(val) {
            this._context[prop] = val;
        },
    });
});
class SceneContext extends Context {
    _fillColor(shape) {
        var fill = shape.fill();
        this.setAttr('fillStyle', fill);
        shape._fillFunc(this);
    }
    _fillPattern(shape) {
        this.setAttr('fillStyle', shape._getFillPattern());
        shape._fillFunc(this);
    }
    _fillLinearGradient(shape) {
        var grd = shape._getLinearGradient();
        if (grd) {
            this.setAttr('fillStyle', grd);
            shape._fillFunc(this);
        }
    }
    _fillRadialGradient(shape) {
        var grd = shape._getRadialGradient();
        if (grd) {
            this.setAttr('fillStyle', grd);
            shape._fillFunc(this);
        }
    }
    _fill(shape) {
        var hasColor = shape.fill(), fillPriority = shape.getFillPriority();
        if (hasColor && fillPriority === 'color') {
            this._fillColor(shape);
            return;
        }
        var hasPattern = shape.getFillPatternImage();
        if (hasPattern && fillPriority === 'pattern') {
            this._fillPattern(shape);
            return;
        }
        var hasLinearGradient = shape.getFillLinearGradientColorStops();
        if (hasLinearGradient && fillPriority === 'linear-gradient') {
            this._fillLinearGradient(shape);
            return;
        }
        var hasRadialGradient = shape.getFillRadialGradientColorStops();
        if (hasRadialGradient && fillPriority === 'radial-gradient') {
            this._fillRadialGradient(shape);
            return;
        }
        if (hasColor) {
            this._fillColor(shape);
        }
        else if (hasPattern) {
            this._fillPattern(shape);
        }
        else if (hasLinearGradient) {
            this._fillLinearGradient(shape);
        }
        else if (hasRadialGradient) {
            this._fillRadialGradient(shape);
        }
    }
    _strokeLinearGradient(shape) {
        var start = shape.getStrokeLinearGradientStartPoint(), end = shape.getStrokeLinearGradientEndPoint(), colorStops = shape.getStrokeLinearGradientColorStops(), grd = this.createLinearGradient(start.x, start.y, end.x, end.y);
        if (colorStops) {
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            this.setAttr('strokeStyle', grd);
        }
    }
    _stroke(shape) {
        var dash = shape.dash(), strokeScaleEnabled = shape.getStrokeScaleEnabled();
        if (shape.hasStroke()) {
            if (!strokeScaleEnabled) {
                this.save();
                var pixelRatio = this.getCanvas().getPixelRatio();
                this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            }
            this._applyLineCap(shape);
            if (dash && shape.dashEnabled()) {
                this.setLineDash(dash);
                this.setAttr('lineDashOffset', shape.dashOffset());
            }
            this.setAttr('lineWidth', shape.strokeWidth());
            if (!shape.getShadowForStrokeEnabled()) {
                this.setAttr('shadowColor', 'rgba(0,0,0,0)');
            }
            var hasLinearGradient = shape.getStrokeLinearGradientColorStops();
            if (hasLinearGradient) {
                this._strokeLinearGradient(shape);
            }
            else {
                this.setAttr('strokeStyle', shape.stroke());
            }
            shape._strokeFunc(this);
            if (!strokeScaleEnabled) {
                this.restore();
            }
        }
    }
    _applyShadow(shape) {
        var _a, _b, _c;
        var color = (_a = shape.getShadowRGBA()) !== null && _a !== void 0 ? _a : 'black', blur = (_b = shape.getShadowBlur()) !== null && _b !== void 0 ? _b : 5, offset = (_c = shape.getShadowOffset()) !== null && _c !== void 0 ? _c : {
            x: 0,
            y: 0,
        }, scale = shape.getAbsoluteScale(), ratio = this.canvas.getPixelRatio(), scaleX = scale.x * ratio, scaleY = scale.y * ratio;
        this.setAttr('shadowColor', color);
        this.setAttr('shadowBlur', blur * Math.min(Math.abs(scaleX), Math.abs(scaleY)));
        this.setAttr('shadowOffsetX', offset.x * scaleX);
        this.setAttr('shadowOffsetY', offset.y * scaleY);
    }
}
class HitContext extends Context {
    _fill(shape) {
        this.save();
        this.setAttr('fillStyle', shape.colorKey);
        shape._fillFuncHit(this);
        this.restore();
    }
    strokeShape(shape) {
        if (shape.hasHitStroke()) {
            this._stroke(shape);
        }
    }
    _stroke(shape) {
        if (shape.hasHitStroke()) {
            var strokeScaleEnabled = shape.getStrokeScaleEnabled();
            if (!strokeScaleEnabled) {
                this.save();
                var pixelRatio = this.getCanvas().getPixelRatio();
                this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            }
            this._applyLineCap(shape);
            var hitStrokeWidth = shape.hitStrokeWidth();
            var strokeWidth = hitStrokeWidth === 'auto' ? shape.strokeWidth() : hitStrokeWidth;
            this.setAttr('lineWidth', strokeWidth);
            this.setAttr('strokeStyle', shape.colorKey);
            shape._strokeFuncHit(this);
            if (!strokeScaleEnabled) {
                this.restore();
            }
        }
    }
}


/***/ }),

/***/ "../node_modules/konva/lib/Core.js":
/*!*****************************************!*\
  !*** ../node_modules/konva/lib/Core.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Konva": () => (/* reexport safe */ _CoreInternals_js__WEBPACK_IMPORTED_MODULE_0__.Konva),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CoreInternals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_CoreInternals.js */ "../node_modules/konva/lib/_CoreInternals.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_CoreInternals_js__WEBPACK_IMPORTED_MODULE_0__.Konva);


/***/ }),

/***/ "../node_modules/konva/lib/DragAndDrop.js":
/*!************************************************!*\
  !*** ../node_modules/konva/lib/DragAndDrop.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DD": () => (/* binding */ DD)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");


const DD = {
    get isDragging() {
        var flag = false;
        DD._dragElements.forEach((elem) => {
            if (elem.dragStatus === 'dragging') {
                flag = true;
            }
        });
        return flag;
    },
    justDragged: false,
    get node() {
        var node;
        DD._dragElements.forEach((elem) => {
            node = elem.node;
        });
        return node;
    },
    _dragElements: new Map(),
    _drag(evt) {
        const nodesToFireEvents = [];
        DD._dragElements.forEach((elem, key) => {
            const { node } = elem;
            const stage = node.getStage();
            stage.setPointersPositions(evt);
            if (elem.pointerId === undefined) {
                elem.pointerId = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._getFirstPointerId(evt);
            }
            const pos = stage._changedPointerPositions.find((pos) => pos.id === elem.pointerId);
            if (!pos) {
                return;
            }
            if (elem.dragStatus !== 'dragging') {
                var dragDistance = node.dragDistance();
                var distance = Math.max(Math.abs(pos.x - elem.startPointerPos.x), Math.abs(pos.y - elem.startPointerPos.y));
                if (distance < dragDistance) {
                    return;
                }
                node.startDrag({ evt });
                if (!node.isDragging()) {
                    return;
                }
            }
            node._setDragPosition(evt, elem);
            nodesToFireEvents.push(node);
        });
        nodesToFireEvents.forEach((node) => {
            node.fire('dragmove', {
                type: 'dragmove',
                target: node,
                evt: evt,
            }, true);
        });
    },
    _endDragBefore(evt) {
        DD._dragElements.forEach((elem) => {
            const { node } = elem;
            const stage = node.getStage();
            if (evt) {
                stage.setPointersPositions(evt);
            }
            const pos = stage._changedPointerPositions.find((pos) => pos.id === elem.pointerId);
            if (!pos) {
                return;
            }
            if (elem.dragStatus === 'dragging' || elem.dragStatus === 'stopped') {
                DD.justDragged = true;
                _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva._mouseListenClick = false;
                _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva._touchListenClick = false;
                _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva._pointerListenClick = false;
                elem.dragStatus = 'stopped';
            }
            const drawNode = elem.node.getLayer() ||
                (elem.node instanceof _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.Stage && elem.node);
            if (drawNode) {
                drawNode.batchDraw();
            }
        });
    },
    _endDragAfter(evt) {
        DD._dragElements.forEach((elem, key) => {
            if (elem.dragStatus === 'stopped') {
                elem.node.fire('dragend', {
                    type: 'dragend',
                    target: elem.node,
                    evt: evt,
                }, true);
            }
            if (elem.dragStatus !== 'dragging') {
                DD._dragElements.delete(key);
            }
        });
    },
};
if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isBrowser) {
    window.addEventListener('mouseup', DD._endDragBefore, true);
    window.addEventListener('touchend', DD._endDragBefore, true);
    window.addEventListener('mousemove', DD._drag);
    window.addEventListener('touchmove', DD._drag);
    window.addEventListener('mouseup', DD._endDragAfter, false);
    window.addEventListener('touchend', DD._endDragAfter, false);
}


/***/ }),

/***/ "../node_modules/konva/lib/Factory.js":
/*!********************************************!*\
  !*** ../node_modules/konva/lib/Factory.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Factory": () => (/* binding */ Factory)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Validators.js */ "../node_modules/konva/lib/Validators.js");


var GET = 'get', SET = 'set';
const Factory = {
    addGetterSetter(constructor, attr, def, validator, after) {
        Factory.addGetter(constructor, attr, def);
        Factory.addSetter(constructor, attr, validator, after);
        Factory.addOverloadedGetterSetter(constructor, attr);
    },
    addGetter(constructor, attr, def) {
        var method = GET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        constructor.prototype[method] =
            constructor.prototype[method] ||
                function () {
                    var val = this.attrs[attr];
                    return val === undefined ? def : val;
                };
    },
    addSetter(constructor, attr, validator, after) {
        var method = SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        if (!constructor.prototype[method]) {
            Factory.overWriteSetter(constructor, attr, validator, after);
        }
    },
    overWriteSetter(constructor, attr, validator, after) {
        var method = SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        constructor.prototype[method] = function (val) {
            if (validator && val !== undefined && val !== null) {
                val = validator.call(this, val, attr);
            }
            this._setAttr(attr, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
    },
    addComponentsGetterSetter(constructor, attr, components, validator, after) {
        var len = components.length, capitalize = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize, getter = GET + capitalize(attr), setter = SET + capitalize(attr), n, component;
        constructor.prototype[getter] = function () {
            var ret = {};
            for (n = 0; n < len; n++) {
                component = components[n];
                ret[component] = this.getAttr(attr + capitalize(component));
            }
            return ret;
        };
        var basicValidator = (0,_Validators_js__WEBPACK_IMPORTED_MODULE_1__.getComponentValidator)(components);
        constructor.prototype[setter] = function (val) {
            var oldVal = this.attrs[attr], key;
            if (validator) {
                val = validator.call(this, val);
            }
            if (basicValidator) {
                basicValidator.call(this, val, attr);
            }
            for (key in val) {
                if (!val.hasOwnProperty(key)) {
                    continue;
                }
                this._setAttr(attr + capitalize(key), val[key]);
            }
            this._fireChangeEvent(attr, oldVal, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
        Factory.addOverloadedGetterSetter(constructor, attr);
    },
    addOverloadedGetterSetter(constructor, attr) {
        var capitalizedAttr = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr), setter = SET + capitalizedAttr, getter = GET + capitalizedAttr;
        constructor.prototype[attr] = function () {
            if (arguments.length) {
                this[setter](arguments[0]);
                return this;
            }
            return this[getter]();
        };
    },
    addDeprecatedGetterSetter(constructor, attr, def, validator) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Adding deprecated ' + attr);
        var method = GET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        var message = attr +
            ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
        constructor.prototype[method] = function () {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error(message);
            var val = this.attrs[attr];
            return val === undefined ? def : val;
        };
        Factory.addSetter(constructor, attr, validator, function () {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error(message);
        });
        Factory.addOverloadedGetterSetter(constructor, attr);
    },
    backCompat(constructor, methods) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.each(methods, function (oldMethodName, newMethodName) {
            var method = constructor.prototype[newMethodName];
            var oldGetter = GET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(oldMethodName);
            var oldSetter = SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(oldMethodName);
            function deprecated() {
                method.apply(this, arguments);
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('"' +
                    oldMethodName +
                    '" method is deprecated and will be removed soon. Use ""' +
                    newMethodName +
                    '" instead.');
            }
            constructor.prototype[oldMethodName] = deprecated;
            constructor.prototype[oldGetter] = deprecated;
            constructor.prototype[oldSetter] = deprecated;
        });
    },
    afterSetFilter() {
        this._filterUpToDate = false;
    },
};


/***/ }),

/***/ "../node_modules/konva/lib/FastLayer.js":
/*!**********************************************!*\
  !*** ../node_modules/konva/lib/FastLayer.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FastLayer": () => (/* binding */ FastLayer)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Layer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Layer.js */ "../node_modules/konva/lib/Layer.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");



class FastLayer extends _Layer_js__WEBPACK_IMPORTED_MODULE_1__.Layer {
    constructor(attrs) {
        super(attrs);
        this.listening(false);
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
    }
}
FastLayer.prototype.nodeType = 'FastLayer';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_2__._registerNode)(FastLayer);


/***/ }),

/***/ "../node_modules/konva/lib/Global.js":
/*!*******************************************!*\
  !*** ../node_modules/konva/lib/Global.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "glob": () => (/* binding */ glob),
/* harmony export */   "Konva": () => (/* binding */ Konva),
/* harmony export */   "_registerNode": () => (/* binding */ _registerNode)
/* harmony export */ });
var PI_OVER_180 = Math.PI / 180;
function detectBrowser() {
    return (typeof window !== 'undefined' &&
        ({}.toString.call(window) === '[object Window]' ||
            {}.toString.call(window) === '[object global]'));
}
const glob = typeof global !== 'undefined'
    ? global
    : typeof window !== 'undefined'
        ? window
        : typeof WorkerGlobalScope !== 'undefined'
            ? self
            : {};
const Konva = {
    _global: glob,
    version: '8.3.2',
    isBrowser: detectBrowser(),
    isUnminified: /param/.test(function (param) { }.toString()),
    dblClickWindow: 400,
    getAngle(angle) {
        return Konva.angleDeg ? angle * PI_OVER_180 : angle;
    },
    enableTrace: false,
    pointerEventsEnabled: true,
    autoDrawEnabled: true,
    hitOnDragEnabled: false,
    capturePointerEventsEnabled: false,
    _mouseListenClick: false,
    _touchListenClick: false,
    _pointerListenClick: false,
    _mouseInDblClickWindow: false,
    _touchInDblClickWindow: false,
    _pointerInDblClickWindow: false,
    _mouseDblClickPointerId: null,
    _touchDblClickPointerId: null,
    _pointerDblClickPointerId: null,
    pixelRatio: (typeof window !== 'undefined' && window.devicePixelRatio) || 1,
    dragDistance: 3,
    angleDeg: true,
    showWarnings: true,
    dragButtons: [0, 1],
    isDragging() {
        return Konva['DD'].isDragging;
    },
    isDragReady() {
        return !!Konva['DD'].node;
    },
    document: glob.document,
    _injectGlobal(Konva) {
        glob.Konva = Konva;
    },
};
const _registerNode = (NodeClass) => {
    Konva[NodeClass.prototype.getClassName()] = NodeClass;
};
Konva._injectGlobal(Konva);


/***/ }),

/***/ "../node_modules/konva/lib/Group.js":
/*!******************************************!*\
  !*** ../node_modules/konva/lib/Group.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Group": () => (/* binding */ Group)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Container_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Container.js */ "../node_modules/konva/lib/Container.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");



class Group extends _Container_js__WEBPACK_IMPORTED_MODULE_1__.Container {
    _validateAdd(child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util["throw"]('You may only add groups and shapes to groups.');
        }
    }
}
Group.prototype.nodeType = 'Group';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_2__._registerNode)(Group);


/***/ }),

/***/ "../node_modules/konva/lib/Layer.js":
/*!******************************************!*\
  !*** ../node_modules/konva/lib/Layer.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Layer": () => (/* binding */ Layer)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Container_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Container.js */ "../node_modules/konva/lib/Container.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Node.js */ "../node_modules/konva/lib/Node.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Canvas_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Canvas.js */ "../node_modules/konva/lib/Canvas.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Validators.js */ "../node_modules/konva/lib/Validators.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Shape.js */ "../node_modules/konva/lib/Shape.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");








var HASH = '#', BEFORE_DRAW = 'beforeDraw', DRAW = 'draw', INTERSECTION_OFFSETS = [
    { x: 0, y: 0 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
], INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;
class Layer extends _Container_js__WEBPACK_IMPORTED_MODULE_1__.Container {
    constructor(config) {
        super(config);
        this.canvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.SceneCanvas();
        this.hitCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.HitCanvas({
            pixelRatio: 1,
        });
        this._waitingForDraw = false;
        this.on('visibleChange.konva', this._checkVisibility);
        this._checkVisibility();
        this.on('imageSmoothingEnabledChange.konva', this._setSmoothEnabled);
        this._setSmoothEnabled();
    }
    createPNGStream() {
        const c = this.canvas._canvas;
        return c.createPNGStream();
    }
    getCanvas() {
        return this.canvas;
    }
    getNativeCanvasElement() {
        return this.canvas._canvas;
    }
    getHitCanvas() {
        return this.hitCanvas;
    }
    getContext() {
        return this.getCanvas().getContext();
    }
    clear(bounds) {
        this.getContext().clear(bounds);
        this.getHitCanvas().getContext().clear(bounds);
        return this;
    }
    setZIndex(index) {
        super.setZIndex(index);
        var stage = this.getStage();
        if (stage && stage.content) {
            stage.content.removeChild(this.getNativeCanvasElement());
            if (index < stage.children.length - 1) {
                stage.content.insertBefore(this.getNativeCanvasElement(), stage.children[index + 1].getCanvas()._canvas);
            }
            else {
                stage.content.appendChild(this.getNativeCanvasElement());
            }
        }
        return this;
    }
    moveToTop() {
        _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.moveToTop.call(this);
        var stage = this.getStage();
        if (stage && stage.content) {
            stage.content.removeChild(this.getNativeCanvasElement());
            stage.content.appendChild(this.getNativeCanvasElement());
        }
        return true;
    }
    moveUp() {
        var moved = _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.moveUp.call(this);
        if (!moved) {
            return false;
        }
        var stage = this.getStage();
        if (!stage || !stage.content) {
            return false;
        }
        stage.content.removeChild(this.getNativeCanvasElement());
        if (this.index < stage.children.length - 1) {
            stage.content.insertBefore(this.getNativeCanvasElement(), stage.children[this.index + 1].getCanvas()._canvas);
        }
        else {
            stage.content.appendChild(this.getNativeCanvasElement());
        }
        return true;
    }
    moveDown() {
        if (_Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.moveDown.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                if (stage.content) {
                    stage.content.removeChild(this.getNativeCanvasElement());
                    stage.content.insertBefore(this.getNativeCanvasElement(), children[this.index + 1].getCanvas()._canvas);
                }
            }
            return true;
        }
        return false;
    }
    moveToBottom() {
        if (_Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.moveToBottom.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                if (stage.content) {
                    stage.content.removeChild(this.getNativeCanvasElement());
                    stage.content.insertBefore(this.getNativeCanvasElement(), children[1].getCanvas()._canvas);
                }
            }
            return true;
        }
        return false;
    }
    getLayer() {
        return this;
    }
    remove() {
        var _canvas = this.getNativeCanvasElement();
        _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.remove.call(this);
        if (_canvas && _canvas.parentNode && _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isInDocument(_canvas)) {
            _canvas.parentNode.removeChild(_canvas);
        }
        return this;
    }
    getStage() {
        return this.parent;
    }
    setSize({ width, height }) {
        this.canvas.setSize(width, height);
        this.hitCanvas.setSize(width, height);
        this._setSmoothEnabled();
        return this;
    }
    _validateAdd(child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util["throw"]('You may only add groups and shapes to a layer.');
        }
    }
    _toKonvaCanvas(config) {
        config = config || {};
        config.width = config.width || this.getWidth();
        config.height = config.height || this.getHeight();
        config.x = config.x !== undefined ? config.x : this.x();
        config.y = config.y !== undefined ? config.y : this.y();
        return _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype._toKonvaCanvas.call(this, config);
    }
    _checkVisibility() {
        const visible = this.visible();
        if (visible) {
            this.canvas._canvas.style.display = 'block';
        }
        else {
            this.canvas._canvas.style.display = 'none';
        }
    }
    _setSmoothEnabled() {
        this.getContext()._context.imageSmoothingEnabled =
            this.imageSmoothingEnabled();
    }
    getWidth() {
        if (this.parent) {
            return this.parent.width();
        }
    }
    setWidth() {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
    }
    getHeight() {
        if (this.parent) {
            return this.parent.height();
        }
    }
    setHeight() {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
    }
    batchDraw() {
        if (!this._waitingForDraw) {
            this._waitingForDraw = true;
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.requestAnimFrame(() => {
                this.draw();
                this._waitingForDraw = false;
            });
        }
        return this;
    }
    getIntersection(pos) {
        if (!this.isListening() || !this.isVisible()) {
            return null;
        }
        var spiralSearchDistance = 1;
        var continueSearch = false;
        while (true) {
            for (let i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                const intersectionOffset = INTERSECTION_OFFSETS[i];
                const obj = this._getIntersection({
                    x: pos.x + intersectionOffset.x * spiralSearchDistance,
                    y: pos.y + intersectionOffset.y * spiralSearchDistance,
                });
                const shape = obj.shape;
                if (shape) {
                    return shape;
                }
                continueSearch = !!obj.antialiased;
                if (!obj.antialiased) {
                    break;
                }
            }
            if (continueSearch) {
                spiralSearchDistance += 1;
            }
            else {
                return null;
            }
        }
    }
    _getIntersection(pos) {
        const ratio = this.hitCanvas.pixelRatio;
        const p = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio), Math.round(pos.y * ratio), 1, 1).data;
        const p3 = p[3];
        if (p3 === 255) {
            const colorKey = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._rgbToHex(p[0], p[1], p[2]);
            const shape = _Shape_js__WEBPACK_IMPORTED_MODULE_6__.shapes[HASH + colorKey];
            if (shape) {
                return {
                    shape: shape,
                };
            }
            return {
                antialiased: true,
            };
        }
        else if (p3 > 0) {
            return {
                antialiased: true,
            };
        }
        return {};
    }
    drawScene(can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas());
        this._fire(BEFORE_DRAW, {
            node: this,
        });
        if (this.clearBeforeDraw()) {
            canvas.getContext().clear();
        }
        _Container_js__WEBPACK_IMPORTED_MODULE_1__.Container.prototype.drawScene.call(this, canvas, top);
        this._fire(DRAW, {
            node: this,
        });
        return this;
    }
    drawHit(can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas);
        if (layer && layer.clearBeforeDraw()) {
            layer.getHitCanvas().getContext().clear();
        }
        _Container_js__WEBPACK_IMPORTED_MODULE_1__.Container.prototype.drawHit.call(this, canvas, top);
        return this;
    }
    enableHitGraph() {
        this.hitGraphEnabled(true);
        return this;
    }
    disableHitGraph() {
        this.hitGraphEnabled(false);
        return this;
    }
    setHitGraphEnabled(val) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
        this.listening(val);
    }
    getHitGraphEnabled(val) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
        return this.listening();
    }
    toggleHitCanvas() {
        if (!this.parent || !this.parent['content']) {
            return;
        }
        var parent = this.parent;
        var added = !!this.hitCanvas._canvas.parentNode;
        if (added) {
            parent.content.removeChild(this.hitCanvas._canvas);
        }
        else {
            parent.content.appendChild(this.hitCanvas._canvas);
        }
    }
}
Layer.prototype.nodeType = 'Layer';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_7__._registerNode)(Layer);
_Factory_js__WEBPACK_IMPORTED_MODULE_3__.Factory.addGetterSetter(Layer, 'imageSmoothingEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_3__.Factory.addGetterSetter(Layer, 'clearBeforeDraw', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_3__.Factory.addGetterSetter(Layer, 'hitGraphEnabled', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());


/***/ }),

/***/ "../node_modules/konva/lib/Node.js":
/*!*****************************************!*\
  !*** ../node_modules/konva/lib/Node.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Node": () => (/* binding */ Node)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Canvas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Canvas.js */ "../node_modules/konva/lib/Canvas.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");
/* harmony import */ var _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DragAndDrop.js */ "../node_modules/konva/lib/DragAndDrop.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Validators.js */ "../node_modules/konva/lib/Validators.js");






var ABSOLUTE_OPACITY = 'absoluteOpacity', ALL_LISTENERS = 'allEventListeners', ABSOLUTE_TRANSFORM = 'absoluteTransform', ABSOLUTE_SCALE = 'absoluteScale', CANVAS = 'canvas', CHANGE = 'Change', CHILDREN = 'children', KONVA = 'konva', LISTENING = 'listening', MOUSEENTER = 'mouseenter', MOUSELEAVE = 'mouseleave', NAME = 'name', SET = 'set', SHAPE = 'Shape', SPACE = ' ', STAGE = 'stage', TRANSFORM = 'transform', UPPER_STAGE = 'Stage', VISIBLE = 'visible', TRANSFORM_CHANGE_STR = [
    'xChange.konva',
    'yChange.konva',
    'scaleXChange.konva',
    'scaleYChange.konva',
    'skewXChange.konva',
    'skewYChange.konva',
    'rotationChange.konva',
    'offsetXChange.konva',
    'offsetYChange.konva',
    'transformsEnabledChange.konva',
].join(SPACE);
let idCounter = 1;
class Node {
    constructor(config) {
        this._id = idCounter++;
        this.eventListeners = {};
        this.attrs = {};
        this.index = 0;
        this._allEventListeners = null;
        this.parent = null;
        this._cache = new Map();
        this._attachedDepsListeners = new Map();
        this._lastPos = null;
        this._batchingTransformChange = false;
        this._needClearTransformCache = false;
        this._filterUpToDate = false;
        this._isUnderCache = false;
        this._dragEventId = null;
        this._shouldFireChangeEvents = false;
        this.setAttrs(config);
        this._shouldFireChangeEvents = true;
    }
    hasChildren() {
        return false;
    }
    _clearCache(attr) {
        if ((attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM) &&
            this._cache.get(attr)) {
            this._cache.get(attr).dirty = true;
        }
        else if (attr) {
            this._cache.delete(attr);
        }
        else {
            this._cache.clear();
        }
    }
    _getCache(attr, privateGetter) {
        var cache = this._cache.get(attr);
        var isTransform = attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM;
        var invalid = cache === undefined || (isTransform && cache.dirty === true);
        if (invalid) {
            cache = privateGetter.call(this);
            this._cache.set(attr, cache);
        }
        return cache;
    }
    _calculate(name, deps, getter) {
        if (!this._attachedDepsListeners.get(name)) {
            const depsString = deps.map((dep) => dep + 'Change.konva').join(SPACE);
            this.on(depsString, () => {
                this._clearCache(name);
            });
            this._attachedDepsListeners.set(name, true);
        }
        return this._getCache(name, getter);
    }
    _getCanvasCache() {
        return this._cache.get(CANVAS);
    }
    _clearSelfAndDescendantCache(attr) {
        this._clearCache(attr);
        if (attr === ABSOLUTE_TRANSFORM) {
            this.fire('absoluteTransformChange');
        }
    }
    clearCache() {
        this._cache.delete(CANVAS);
        this._clearSelfAndDescendantCache();
        this._requestDraw();
        return this;
    }
    cache(config) {
        var conf = config || {};
        var rect = {};
        if (conf.x === undefined ||
            conf.y === undefined ||
            conf.width === undefined ||
            conf.height === undefined) {
            rect = this.getClientRect({
                skipTransform: true,
                relativeTo: this.getParent(),
            });
        }
        var width = Math.ceil(conf.width || rect.width), height = Math.ceil(conf.height || rect.height), pixelRatio = conf.pixelRatio, x = conf.x === undefined ? rect.x : conf.x, y = conf.y === undefined ? rect.y : conf.y, offset = conf.offset || 0, drawBorder = conf.drawBorder || false, hitCanvasPixelRatio = conf.hitCanvasPixelRatio || 1;
        if (!width || !height) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Can not cache the node. Width or height of the node equals 0. Caching is skipped.');
            return;
        }
        width += offset * 2;
        height += offset * 2;
        x -= offset;
        y -= offset;
        var cachedSceneCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_2__.SceneCanvas({
            pixelRatio: pixelRatio,
            width: width,
            height: height,
        }), cachedFilterCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_2__.SceneCanvas({
            pixelRatio: pixelRatio,
            width: 0,
            height: 0,
        }), cachedHitCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_2__.HitCanvas({
            pixelRatio: hitCanvasPixelRatio,
            width: width,
            height: height,
        }), sceneContext = cachedSceneCanvas.getContext(), hitContext = cachedHitCanvas.getContext();
        cachedHitCanvas.isCache = true;
        cachedSceneCanvas.isCache = true;
        this._cache.delete(CANVAS);
        this._filterUpToDate = false;
        if (conf.imageSmoothingEnabled === false) {
            cachedSceneCanvas.getContext()._context.imageSmoothingEnabled = false;
            cachedFilterCanvas.getContext()._context.imageSmoothingEnabled = false;
        }
        sceneContext.save();
        hitContext.save();
        sceneContext.translate(-x, -y);
        hitContext.translate(-x, -y);
        this._isUnderCache = true;
        this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
        this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
        this.drawScene(cachedSceneCanvas, this);
        this.drawHit(cachedHitCanvas, this);
        this._isUnderCache = false;
        sceneContext.restore();
        hitContext.restore();
        if (drawBorder) {
            sceneContext.save();
            sceneContext.beginPath();
            sceneContext.rect(0, 0, width, height);
            sceneContext.closePath();
            sceneContext.setAttr('strokeStyle', 'red');
            sceneContext.setAttr('lineWidth', 5);
            sceneContext.stroke();
            sceneContext.restore();
        }
        this._cache.set(CANVAS, {
            scene: cachedSceneCanvas,
            filter: cachedFilterCanvas,
            hit: cachedHitCanvas,
            x: x,
            y: y,
        });
        this._requestDraw();
        return this;
    }
    isCached() {
        return this._cache.has(CANVAS);
    }
    getClientRect(config) {
        throw new Error('abstract "getClientRect" method call');
    }
    _transformedRect(rect, top) {
        var points = [
            { x: rect.x, y: rect.y },
            { x: rect.x + rect.width, y: rect.y },
            { x: rect.x + rect.width, y: rect.y + rect.height },
            { x: rect.x, y: rect.y + rect.height },
        ];
        var minX, minY, maxX, maxY;
        var trans = this.getAbsoluteTransform(top);
        points.forEach(function (point) {
            var transformed = trans.point(point);
            if (minX === undefined) {
                minX = maxX = transformed.x;
                minY = maxY = transformed.y;
            }
            minX = Math.min(minX, transformed.x);
            minY = Math.min(minY, transformed.y);
            maxX = Math.max(maxX, transformed.x);
            maxY = Math.max(maxY, transformed.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
    _drawCachedSceneCanvas(context) {
        context.save();
        context._applyOpacity(this);
        context._applyGlobalCompositeOperation(this);
        const canvasCache = this._getCanvasCache();
        context.translate(canvasCache.x, canvasCache.y);
        var cacheCanvas = this._getCachedSceneCanvas();
        var ratio = cacheCanvas.pixelRatio;
        context.drawImage(cacheCanvas._canvas, 0, 0, cacheCanvas.width / ratio, cacheCanvas.height / ratio);
        context.restore();
    }
    _drawCachedHitCanvas(context) {
        var canvasCache = this._getCanvasCache(), hitCanvas = canvasCache.hit;
        context.save();
        context.translate(canvasCache.x, canvasCache.y);
        context.drawImage(hitCanvas._canvas, 0, 0, hitCanvas.width / hitCanvas.pixelRatio, hitCanvas.height / hitCanvas.pixelRatio);
        context.restore();
    }
    _getCachedSceneCanvas() {
        var filters = this.filters(), cachedCanvas = this._getCanvasCache(), sceneCanvas = cachedCanvas.scene, filterCanvas = cachedCanvas.filter, filterContext = filterCanvas.getContext(), len, imageData, n, filter;
        if (filters) {
            if (!this._filterUpToDate) {
                var ratio = sceneCanvas.pixelRatio;
                filterCanvas.setSize(sceneCanvas.width / sceneCanvas.pixelRatio, sceneCanvas.height / sceneCanvas.pixelRatio);
                try {
                    len = filters.length;
                    filterContext.clear();
                    filterContext.drawImage(sceneCanvas._canvas, 0, 0, sceneCanvas.getWidth() / ratio, sceneCanvas.getHeight() / ratio);
                    imageData = filterContext.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
                    for (n = 0; n < len; n++) {
                        filter = filters[n];
                        if (typeof filter !== 'function') {
                            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Filter should be type of function, but got ' +
                                typeof filter +
                                ' instead. Please check correct filters');
                            continue;
                        }
                        filter.call(this, imageData);
                        filterContext.putImageData(imageData, 0, 0);
                    }
                }
                catch (e) {
                    _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Unable to apply filter. ' +
                        e.message +
                        ' This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                }
                this._filterUpToDate = true;
            }
            return filterCanvas;
        }
        return sceneCanvas;
    }
    on(evtStr, handler) {
        this._cache && this._cache.delete(ALL_LISTENERS);
        if (arguments.length === 3) {
            return this._delegate.apply(this, arguments);
        }
        var events = evtStr.split(SPACE), len = events.length, n, event, parts, baseEvent, name;
        for (n = 0; n < len; n++) {
            event = events[n];
            parts = event.split('.');
            baseEvent = parts[0];
            name = parts[1] || '';
            if (!this.eventListeners[baseEvent]) {
                this.eventListeners[baseEvent] = [];
            }
            this.eventListeners[baseEvent].push({
                name: name,
                handler: handler,
            });
        }
        return this;
    }
    off(evtStr, callback) {
        var events = (evtStr || '').split(SPACE), len = events.length, n, t, event, parts, baseEvent, name;
        this._cache && this._cache.delete(ALL_LISTENERS);
        if (!evtStr) {
            for (t in this.eventListeners) {
                this._off(t);
            }
        }
        for (n = 0; n < len; n++) {
            event = events[n];
            parts = event.split('.');
            baseEvent = parts[0];
            name = parts[1];
            if (baseEvent) {
                if (this.eventListeners[baseEvent]) {
                    this._off(baseEvent, name, callback);
                }
            }
            else {
                for (t in this.eventListeners) {
                    this._off(t, name, callback);
                }
            }
        }
        return this;
    }
    dispatchEvent(evt) {
        var e = {
            target: this,
            type: evt.type,
            evt: evt,
        };
        this.fire(evt.type, e);
        return this;
    }
    addEventListener(type, handler) {
        this.on(type, function (evt) {
            handler.call(this, evt.evt);
        });
        return this;
    }
    removeEventListener(type) {
        this.off(type);
        return this;
    }
    _delegate(event, selector, handler) {
        var stopNode = this;
        this.on(event, function (evt) {
            var targets = evt.target.findAncestors(selector, true, stopNode);
            for (var i = 0; i < targets.length; i++) {
                evt = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.cloneObject(evt);
                evt.currentTarget = targets[i];
                handler.call(targets[i], evt);
            }
        });
    }
    remove() {
        if (this.isDragging()) {
            this.stopDrag();
        }
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements["delete"](this._id);
        this._remove();
        return this;
    }
    _clearCaches() {
        this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
        this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
        this._clearSelfAndDescendantCache(STAGE);
        this._clearSelfAndDescendantCache(VISIBLE);
        this._clearSelfAndDescendantCache(LISTENING);
    }
    _remove() {
        this._clearCaches();
        var parent = this.getParent();
        if (parent && parent.children) {
            parent.children.splice(this.index, 1);
            parent._setChildrenIndices();
            this.parent = null;
        }
    }
    destroy() {
        this.remove();
        return this;
    }
    getAttr(attr) {
        var method = 'get' + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isFunction(this[method])) {
            return this[method]();
        }
        return this.attrs[attr];
    }
    getAncestors() {
        var parent = this.getParent(), ancestors = [];
        while (parent) {
            ancestors.push(parent);
            parent = parent.getParent();
        }
        return ancestors;
    }
    getAttrs() {
        return this.attrs || {};
    }
    setAttrs(config) {
        this._batchTransformChanges(() => {
            var key, method;
            if (!config) {
                return this;
            }
            for (key in config) {
                if (key === CHILDREN) {
                    continue;
                }
                method = SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(key);
                if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isFunction(this[method])) {
                    this[method](config[key]);
                }
                else {
                    this._setAttr(key, config[key]);
                }
            }
        });
        return this;
    }
    isListening() {
        return this._getCache(LISTENING, this._isListening);
    }
    _isListening(relativeTo) {
        const listening = this.listening();
        if (!listening) {
            return false;
        }
        const parent = this.getParent();
        if (parent && parent !== relativeTo && this !== relativeTo) {
            return parent._isListening(relativeTo);
        }
        else {
            return true;
        }
    }
    isVisible() {
        return this._getCache(VISIBLE, this._isVisible);
    }
    _isVisible(relativeTo) {
        const visible = this.visible();
        if (!visible) {
            return false;
        }
        const parent = this.getParent();
        if (parent && parent !== relativeTo && this !== relativeTo) {
            return parent._isVisible(relativeTo);
        }
        else {
            return true;
        }
    }
    shouldDrawHit(top, skipDragCheck = false) {
        if (top) {
            return this._isVisible(top) && this._isListening(top);
        }
        var layer = this.getLayer();
        var layerUnderDrag = false;
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.forEach((elem) => {
            if (elem.dragStatus !== 'dragging') {
                return;
            }
            else if (elem.node.nodeType === 'Stage') {
                layerUnderDrag = true;
            }
            else if (elem.node.getLayer() === layer) {
                layerUnderDrag = true;
            }
        });
        var dragSkip = !skipDragCheck && !_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.hitOnDragEnabled && layerUnderDrag;
        return this.isListening() && this.isVisible() && !dragSkip;
    }
    show() {
        this.visible(true);
        return this;
    }
    hide() {
        this.visible(false);
        return this;
    }
    getZIndex() {
        return this.index || 0;
    }
    getAbsoluteZIndex() {
        var depth = this.getDepth(), that = this, index = 0, nodes, len, n, child;
        function addChildren(children) {
            nodes = [];
            len = children.length;
            for (n = 0; n < len; n++) {
                child = children[n];
                index++;
                if (child.nodeType !== SHAPE) {
                    nodes = nodes.concat(child.getChildren().slice());
                }
                if (child._id === that._id) {
                    n = len;
                }
            }
            if (nodes.length > 0 && nodes[0].getDepth() <= depth) {
                addChildren(nodes);
            }
        }
        if (that.nodeType !== UPPER_STAGE) {
            addChildren(that.getStage().getChildren());
        }
        return index;
    }
    getDepth() {
        var depth = 0, parent = this.parent;
        while (parent) {
            depth++;
            parent = parent.parent;
        }
        return depth;
    }
    _batchTransformChanges(func) {
        this._batchingTransformChange = true;
        func();
        this._batchingTransformChange = false;
        if (this._needClearTransformCache) {
            this._clearCache(TRANSFORM);
            this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        }
        this._needClearTransformCache = false;
    }
    setPosition(pos) {
        this._batchTransformChanges(() => {
            this.x(pos.x);
            this.y(pos.y);
        });
        return this;
    }
    getPosition() {
        return {
            x: this.x(),
            y: this.y(),
        };
    }
    getRelativePointerPosition() {
        if (!this.getStage()) {
            return null;
        }
        var pos = this.getStage().getPointerPosition();
        if (!pos) {
            return null;
        }
        var transform = this.getAbsoluteTransform().copy();
        transform.invert();
        return transform.point(pos);
    }
    getAbsolutePosition(top) {
        let haveCachedParent = false;
        let parent = this.parent;
        while (parent) {
            if (parent.isCached()) {
                haveCachedParent = true;
                break;
            }
            parent = parent.parent;
        }
        if (haveCachedParent && !top) {
            top = true;
        }
        var absoluteMatrix = this.getAbsoluteTransform(top).getMatrix(), absoluteTransform = new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform(), offset = this.offset();
        absoluteTransform.m = absoluteMatrix.slice();
        absoluteTransform.translate(offset.x, offset.y);
        return absoluteTransform.getTranslation();
    }
    setAbsolutePosition(pos) {
        var origTrans = this._clearTransform();
        this.attrs.x = origTrans.x;
        this.attrs.y = origTrans.y;
        delete origTrans.x;
        delete origTrans.y;
        this._clearCache(TRANSFORM);
        var it = this._getAbsoluteTransform().copy();
        it.invert();
        it.translate(pos.x, pos.y);
        pos = {
            x: this.attrs.x + it.getTranslation().x,
            y: this.attrs.y + it.getTranslation().y,
        };
        this._setTransform(origTrans);
        this.setPosition({ x: pos.x, y: pos.y });
        this._clearCache(TRANSFORM);
        this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        return this;
    }
    _setTransform(trans) {
        var key;
        for (key in trans) {
            this.attrs[key] = trans[key];
        }
    }
    _clearTransform() {
        var trans = {
            x: this.x(),
            y: this.y(),
            rotation: this.rotation(),
            scaleX: this.scaleX(),
            scaleY: this.scaleY(),
            offsetX: this.offsetX(),
            offsetY: this.offsetY(),
            skewX: this.skewX(),
            skewY: this.skewY(),
        };
        this.attrs.x = 0;
        this.attrs.y = 0;
        this.attrs.rotation = 0;
        this.attrs.scaleX = 1;
        this.attrs.scaleY = 1;
        this.attrs.offsetX = 0;
        this.attrs.offsetY = 0;
        this.attrs.skewX = 0;
        this.attrs.skewY = 0;
        return trans;
    }
    move(change) {
        var changeX = change.x, changeY = change.y, x = this.x(), y = this.y();
        if (changeX !== undefined) {
            x += changeX;
        }
        if (changeY !== undefined) {
            y += changeY;
        }
        this.setPosition({ x: x, y: y });
        return this;
    }
    _eachAncestorReverse(func, top) {
        var family = [], parent = this.getParent(), len, n;
        if (top && top._id === this._id) {
            return;
        }
        family.unshift(this);
        while (parent && (!top || parent._id !== top._id)) {
            family.unshift(parent);
            parent = parent.parent;
        }
        len = family.length;
        for (n = 0; n < len; n++) {
            func(family[n]);
        }
    }
    rotate(theta) {
        this.rotation(this.rotation() + theta);
        return this;
    }
    moveToTop() {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. moveToTop function is ignored.');
            return false;
        }
        var index = this.index, len = this.parent.getChildren().length;
        if (index < len - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    moveUp() {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. moveUp function is ignored.');
            return false;
        }
        var index = this.index, len = this.parent.getChildren().length;
        if (index < len - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index + 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    moveDown() {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. moveDown function is ignored.');
            return false;
        }
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index - 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    moveToBottom() {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. moveToBottom function is ignored.');
            return false;
        }
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.unshift(this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    setZIndex(zIndex) {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. zIndex parameter is ignored.');
            return this;
        }
        if (zIndex < 0 || zIndex >= this.parent.children.length) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Unexpected value ' +
                zIndex +
                ' for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to ' +
                (this.parent.children.length - 1) +
                '.');
        }
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(zIndex, 0, this);
        this.parent._setChildrenIndices();
        return this;
    }
    getAbsoluteOpacity() {
        return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
    }
    _getAbsoluteOpacity() {
        var absOpacity = this.opacity();
        var parent = this.getParent();
        if (parent && !parent._isUnderCache) {
            absOpacity *= parent.getAbsoluteOpacity();
        }
        return absOpacity;
    }
    moveTo(newContainer) {
        if (this.getParent() !== newContainer) {
            this._remove();
            newContainer.add(this);
        }
        return this;
    }
    toObject() {
        var obj = {}, attrs = this.getAttrs(), key, val, getter, defaultValue, nonPlainObject;
        obj.attrs = {};
        for (key in attrs) {
            val = attrs[key];
            nonPlainObject =
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.isObject(val) && !_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isPlainObject(val) && !_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isArray(val);
            if (nonPlainObject) {
                continue;
            }
            getter = typeof this[key] === 'function' && this[key];
            delete attrs[key];
            defaultValue = getter ? getter.call(this) : null;
            attrs[key] = val;
            if (defaultValue !== val) {
                obj.attrs[key] = val;
            }
        }
        obj.className = this.getClassName();
        return _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._prepareToStringify(obj);
    }
    toJSON() {
        return JSON.stringify(this.toObject());
    }
    getParent() {
        return this.parent;
    }
    findAncestors(selector, includeSelf, stopNode) {
        var res = [];
        if (includeSelf && this._isMatch(selector)) {
            res.push(this);
        }
        var ancestor = this.parent;
        while (ancestor) {
            if (ancestor === stopNode) {
                return res;
            }
            if (ancestor._isMatch(selector)) {
                res.push(ancestor);
            }
            ancestor = ancestor.parent;
        }
        return res;
    }
    isAncestorOf(node) {
        return false;
    }
    findAncestor(selector, includeSelf, stopNode) {
        return this.findAncestors(selector, includeSelf, stopNode)[0];
    }
    _isMatch(selector) {
        if (!selector) {
            return false;
        }
        if (typeof selector === 'function') {
            return selector(this);
        }
        var selectorArr = selector.replace(/ /g, '').split(','), len = selectorArr.length, n, sel;
        for (n = 0; n < len; n++) {
            sel = selectorArr[n];
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.isValidSelector(sel)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Selector "' +
                    sel +
                    '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".');
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".');
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Konva is awesome, right?');
            }
            if (sel.charAt(0) === '#') {
                if (this.id() === sel.slice(1)) {
                    return true;
                }
            }
            else if (sel.charAt(0) === '.') {
                if (this.hasName(sel.slice(1))) {
                    return true;
                }
            }
            else if (this.className === sel || this.nodeType === sel) {
                return true;
            }
        }
        return false;
    }
    getLayer() {
        var parent = this.getParent();
        return parent ? parent.getLayer() : null;
    }
    getStage() {
        return this._getCache(STAGE, this._getStage);
    }
    _getStage() {
        var parent = this.getParent();
        if (parent) {
            return parent.getStage();
        }
        else {
            return undefined;
        }
    }
    fire(eventType, evt = {}, bubble) {
        evt.target = evt.target || this;
        if (bubble) {
            this._fireAndBubble(eventType, evt);
        }
        else {
            this._fire(eventType, evt);
        }
        return this;
    }
    getAbsoluteTransform(top) {
        if (top) {
            return this._getAbsoluteTransform(top);
        }
        else {
            return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
        }
    }
    _getAbsoluteTransform(top) {
        var at;
        if (top) {
            at = new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
            this._eachAncestorReverse(function (node) {
                var transformsEnabled = node.transformsEnabled();
                if (transformsEnabled === 'all') {
                    at.multiply(node.getTransform());
                }
                else if (transformsEnabled === 'position') {
                    at.translate(node.x() - node.offsetX(), node.y() - node.offsetY());
                }
            }, top);
            return at;
        }
        else {
            at = this._cache.get(ABSOLUTE_TRANSFORM) || new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
            if (this.parent) {
                this.parent.getAbsoluteTransform().copyInto(at);
            }
            else {
                at.reset();
            }
            var transformsEnabled = this.transformsEnabled();
            if (transformsEnabled === 'all') {
                at.multiply(this.getTransform());
            }
            else if (transformsEnabled === 'position') {
                const x = this.attrs.x || 0;
                const y = this.attrs.y || 0;
                const offsetX = this.attrs.offsetX || 0;
                const offsetY = this.attrs.offsetY || 0;
                at.translate(x - offsetX, y - offsetY);
            }
            at.dirty = false;
            return at;
        }
    }
    getAbsoluteScale(top) {
        var parent = this;
        while (parent) {
            if (parent._isUnderCache) {
                top = parent;
            }
            parent = parent.getParent();
        }
        const transform = this.getAbsoluteTransform(top);
        const attrs = transform.decompose();
        return {
            x: attrs.scaleX,
            y: attrs.scaleY,
        };
    }
    getAbsoluteRotation() {
        return this.getAbsoluteTransform().decompose().rotation;
    }
    getTransform() {
        return this._getCache(TRANSFORM, this._getTransform);
    }
    _getTransform() {
        var _a, _b;
        var m = this._cache.get(TRANSFORM) || new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
        m.reset();
        var x = this.x(), y = this.y(), rotation = _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.getAngle(this.rotation()), scaleX = (_a = this.attrs.scaleX) !== null && _a !== void 0 ? _a : 1, scaleY = (_b = this.attrs.scaleY) !== null && _b !== void 0 ? _b : 1, skewX = this.attrs.skewX || 0, skewY = this.attrs.skewY || 0, offsetX = this.attrs.offsetX || 0, offsetY = this.attrs.offsetY || 0;
        if (x !== 0 || y !== 0) {
            m.translate(x, y);
        }
        if (rotation !== 0) {
            m.rotate(rotation);
        }
        if (skewX !== 0 || skewY !== 0) {
            m.skew(skewX, skewY);
        }
        if (scaleX !== 1 || scaleY !== 1) {
            m.scale(scaleX, scaleY);
        }
        if (offsetX !== 0 || offsetY !== 0) {
            m.translate(-1 * offsetX, -1 * offsetY);
        }
        m.dirty = false;
        return m;
    }
    clone(obj) {
        var attrs = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.cloneObject(this.attrs), key, allListeners, len, n, listener;
        for (key in obj) {
            attrs[key] = obj[key];
        }
        var node = new this.constructor(attrs);
        for (key in this.eventListeners) {
            allListeners = this.eventListeners[key];
            len = allListeners.length;
            for (n = 0; n < len; n++) {
                listener = allListeners[n];
                if (listener.name.indexOf(KONVA) < 0) {
                    if (!node.eventListeners[key]) {
                        node.eventListeners[key] = [];
                    }
                    node.eventListeners[key].push(listener);
                }
            }
        }
        return node;
    }
    _toKonvaCanvas(config) {
        config = config || {};
        var box = this.getClientRect();
        var stage = this.getStage(), x = config.x !== undefined ? config.x : box.x, y = config.y !== undefined ? config.y : box.y, pixelRatio = config.pixelRatio || 1, canvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_2__.SceneCanvas({
            width: config.width || box.width || (stage ? stage.width() : 0),
            height: config.height || box.height || (stage ? stage.height() : 0),
            pixelRatio: pixelRatio,
        }), context = canvas.getContext();
        context.save();
        if (x || y) {
            context.translate(-1 * x, -1 * y);
        }
        this.drawScene(canvas);
        context.restore();
        return canvas;
    }
    toCanvas(config) {
        return this._toKonvaCanvas(config)._canvas;
    }
    toDataURL(config) {
        config = config || {};
        var mimeType = config.mimeType || null, quality = config.quality || null;
        var url = this._toKonvaCanvas(config).toDataURL(mimeType, quality);
        if (config.callback) {
            config.callback(url);
        }
        return url;
    }
    toImage(config) {
        if (!config || !config.callback) {
            throw 'callback required for toImage method config argument';
        }
        var callback = config.callback;
        delete config.callback;
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._urlToImage(this.toDataURL(config), function (img) {
            callback(img);
        });
    }
    setSize(size) {
        this.width(size.width);
        this.height(size.height);
        return this;
    }
    getSize() {
        return {
            width: this.width(),
            height: this.height(),
        };
    }
    getClassName() {
        return this.className || this.nodeType;
    }
    getType() {
        return this.nodeType;
    }
    getDragDistance() {
        if (this.attrs.dragDistance !== undefined) {
            return this.attrs.dragDistance;
        }
        else if (this.parent) {
            return this.parent.getDragDistance();
        }
        else {
            return _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.dragDistance;
        }
    }
    _off(type, name, callback) {
        var evtListeners = this.eventListeners[type], i, evtName, handler;
        for (i = 0; i < evtListeners.length; i++) {
            evtName = evtListeners[i].name;
            handler = evtListeners[i].handler;
            if ((evtName !== 'konva' || name === 'konva') &&
                (!name || evtName === name) &&
                (!callback || callback === handler)) {
                evtListeners.splice(i, 1);
                if (evtListeners.length === 0) {
                    delete this.eventListeners[type];
                    break;
                }
                i--;
            }
        }
    }
    _fireChangeEvent(attr, oldVal, newVal) {
        this._fire(attr + CHANGE, {
            oldVal: oldVal,
            newVal: newVal,
        });
    }
    addName(name) {
        if (!this.hasName(name)) {
            var oldName = this.name();
            var newName = oldName ? oldName + ' ' + name : name;
            this.name(newName);
        }
        return this;
    }
    hasName(name) {
        if (!name) {
            return false;
        }
        const fullName = this.name();
        if (!fullName) {
            return false;
        }
        var names = (fullName || '').split(/\s/g);
        return names.indexOf(name) !== -1;
    }
    removeName(name) {
        var names = (this.name() || '').split(/\s/g);
        var index = names.indexOf(name);
        if (index !== -1) {
            names.splice(index, 1);
            this.name(names.join(' '));
        }
        return this;
    }
    setAttr(attr, val) {
        var func = this[SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr)];
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isFunction(func)) {
            func.call(this, val);
        }
        else {
            this._setAttr(attr, val);
        }
        return this;
    }
    _requestDraw() {
        if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.autoDrawEnabled) {
            const drawNode = this.getLayer() || this.getStage();
            drawNode === null || drawNode === void 0 ? void 0 : drawNode.batchDraw();
        }
    }
    _setAttr(key, val) {
        var oldVal = this.attrs[key];
        if (oldVal === val && !_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.isObject(val)) {
            return;
        }
        if (val === undefined || val === null) {
            delete this.attrs[key];
        }
        else {
            this.attrs[key] = val;
        }
        if (this._shouldFireChangeEvents) {
            this._fireChangeEvent(key, oldVal, val);
        }
        this._requestDraw();
    }
    _setComponentAttr(key, component, val) {
        var oldVal;
        if (val !== undefined) {
            oldVal = this.attrs[key];
            if (!oldVal) {
                this.attrs[key] = this.getAttr(key);
            }
            this.attrs[key][component] = val;
            this._fireChangeEvent(key, oldVal, val);
        }
    }
    _fireAndBubble(eventType, evt, compareShape) {
        if (evt && this.nodeType === SHAPE) {
            evt.target = this;
        }
        var shouldStop = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
            ((compareShape &&
                (this === compareShape ||
                    (this.isAncestorOf && this.isAncestorOf(compareShape)))) ||
                (this.nodeType === 'Stage' && !compareShape));
        if (!shouldStop) {
            this._fire(eventType, evt);
            var stopBubble = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
                compareShape &&
                compareShape.isAncestorOf &&
                compareShape.isAncestorOf(this) &&
                !compareShape.isAncestorOf(this.parent);
            if (((evt && !evt.cancelBubble) || !evt) &&
                this.parent &&
                this.parent.isListening() &&
                !stopBubble) {
                if (compareShape && compareShape.parent) {
                    this._fireAndBubble.call(this.parent, eventType, evt, compareShape);
                }
                else {
                    this._fireAndBubble.call(this.parent, eventType, evt);
                }
            }
        }
    }
    _getProtoListeners(eventType) {
        let listeners = this._cache.get(ALL_LISTENERS);
        if (!listeners) {
            listeners = {};
            let obj = Object.getPrototypeOf(this);
            while (obj) {
                if (!obj.eventListeners) {
                    obj = Object.getPrototypeOf(obj);
                    continue;
                }
                for (var event in obj.eventListeners) {
                    const newEvents = obj.eventListeners[event];
                    const oldEvents = listeners[event] || [];
                    listeners[event] = newEvents.concat(oldEvents);
                }
                obj = Object.getPrototypeOf(obj);
            }
            this._cache.set(ALL_LISTENERS, listeners);
        }
        return listeners[eventType];
    }
    _fire(eventType, evt) {
        evt = evt || {};
        evt.currentTarget = this;
        evt.type = eventType;
        const topListeners = this._getProtoListeners(eventType);
        if (topListeners) {
            for (var i = 0; i < topListeners.length; i++) {
                topListeners[i].handler.call(this, evt);
            }
        }
        const selfListeners = this.eventListeners[eventType];
        if (selfListeners) {
            for (var i = 0; i < selfListeners.length; i++) {
                selfListeners[i].handler.call(this, evt);
            }
        }
    }
    draw() {
        this.drawScene();
        this.drawHit();
        return this;
    }
    _createDragElement(evt) {
        var pointerId = evt ? evt.pointerId : undefined;
        var stage = this.getStage();
        var ap = this.getAbsolutePosition();
        var pos = stage._getPointerById(pointerId) ||
            stage._changedPointerPositions[0] ||
            ap;
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.set(this._id, {
            node: this,
            startPointerPos: pos,
            offset: {
                x: pos.x - ap.x,
                y: pos.y - ap.y,
            },
            dragStatus: 'ready',
            pointerId,
        });
    }
    startDrag(evt, bubbleEvent = true) {
        if (!_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.has(this._id)) {
            this._createDragElement(evt);
        }
        const elem = _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.get(this._id);
        elem.dragStatus = 'dragging';
        this.fire('dragstart', {
            type: 'dragstart',
            target: this,
            evt: evt && evt.evt,
        }, bubbleEvent);
    }
    _setDragPosition(evt, elem) {
        const pos = this.getStage()._getPointerById(elem.pointerId);
        if (!pos) {
            return;
        }
        var newNodePos = {
            x: pos.x - elem.offset.x,
            y: pos.y - elem.offset.y,
        };
        var dbf = this.dragBoundFunc();
        if (dbf !== undefined) {
            const bounded = dbf.call(this, newNodePos, evt);
            if (!bounded) {
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.');
            }
            else {
                newNodePos = bounded;
            }
        }
        if (!this._lastPos ||
            this._lastPos.x !== newNodePos.x ||
            this._lastPos.y !== newNodePos.y) {
            this.setAbsolutePosition(newNodePos);
            this._requestDraw();
        }
        this._lastPos = newNodePos;
    }
    stopDrag(evt) {
        const elem = _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.get(this._id);
        if (elem) {
            elem.dragStatus = 'stopped';
        }
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._endDragBefore(evt);
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._endDragAfter(evt);
    }
    setDraggable(draggable) {
        this._setAttr('draggable', draggable);
        this._dragChange();
    }
    isDragging() {
        const elem = _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.get(this._id);
        return elem ? elem.dragStatus === 'dragging' : false;
    }
    _listenDrag() {
        this._dragCleanup();
        this.on('mousedown.konva touchstart.konva', function (evt) {
            var shouldCheckButton = evt.evt['button'] !== undefined;
            var canDrag = !shouldCheckButton || _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.dragButtons.indexOf(evt.evt['button']) >= 0;
            if (!canDrag) {
                return;
            }
            if (this.isDragging()) {
                return;
            }
            var hasDraggingChild = false;
            _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.forEach((elem) => {
                if (this.isAncestorOf(elem.node)) {
                    hasDraggingChild = true;
                }
            });
            if (!hasDraggingChild) {
                this._createDragElement(evt);
            }
        });
    }
    _dragChange() {
        if (this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            this._dragCleanup();
            var stage = this.getStage();
            if (!stage) {
                return;
            }
            const dragElement = _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.get(this._id);
            const isDragging = dragElement && dragElement.dragStatus === 'dragging';
            const isReady = dragElement && dragElement.dragStatus === 'ready';
            if (isDragging) {
                this.stopDrag();
            }
            else if (isReady) {
                _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements["delete"](this._id);
            }
        }
    }
    _dragCleanup() {
        this.off('mousedown.konva');
        this.off('touchstart.konva');
    }
    isClientRectOnScreen(margin = { x: 0, y: 0 }) {
        const stage = this.getStage();
        if (!stage) {
            return false;
        }
        const screenRect = {
            x: -margin.x,
            y: -margin.y,
            width: stage.width() + margin.x,
            height: stage.height() + margin.y,
        };
        return _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.haveIntersection(screenRect, this.getClientRect());
    }
    static create(data, container) {
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isString(data)) {
            data = JSON.parse(data);
        }
        return this._createNode(data, container);
    }
    static _createNode(obj, container) {
        var className = Node.prototype.getClassName.call(obj), children = obj.children, no, len, n;
        if (container) {
            obj.attrs.container = container;
        }
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva[className]) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Can not find a node with class name "' +
                className +
                '". Fallback to "Shape".');
            className = 'Shape';
        }
        const Class = _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva[className];
        no = new Class(obj.attrs);
        if (children) {
            len = children.length;
            for (n = 0; n < len; n++) {
                no.add(Node._createNode(children[n]));
            }
        }
        return no;
    }
}
Node.prototype.nodeType = 'Node';
Node.prototype._attrsAffectingSize = [];
Node.prototype.eventListeners = {};
Node.prototype.on.call(Node.prototype, TRANSFORM_CHANGE_STR, function () {
    if (this._batchingTransformChange) {
        this._needClearTransformCache = true;
        return;
    }
    this._clearCache(TRANSFORM);
    this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
});
Node.prototype.on.call(Node.prototype, 'visibleChange.konva', function () {
    this._clearSelfAndDescendantCache(VISIBLE);
});
Node.prototype.on.call(Node.prototype, 'listeningChange.konva', function () {
    this._clearSelfAndDescendantCache(LISTENING);
});
Node.prototype.on.call(Node.prototype, 'opacityChange.konva', function () {
    this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
});
const addGetterSetter = _Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter;
addGetterSetter(Node, 'zIndex');
addGetterSetter(Node, 'absolutePosition');
addGetterSetter(Node, 'position');
addGetterSetter(Node, 'x', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'y', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'globalCompositeOperation', 'source-over', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getStringValidator)());
addGetterSetter(Node, 'opacity', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'name', '', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getStringValidator)());
addGetterSetter(Node, 'id', '', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getStringValidator)());
addGetterSetter(Node, 'rotation', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addComponentsGetterSetter(Node, 'scale', ['x', 'y']);
addGetterSetter(Node, 'scaleX', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'scaleY', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addComponentsGetterSetter(Node, 'skew', ['x', 'y']);
addGetterSetter(Node, 'skewX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'skewY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addComponentsGetterSetter(Node, 'offset', ['x', 'y']);
addGetterSetter(Node, 'offsetX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'offsetY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'dragDistance', null, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'width', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'height', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'listening', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());
addGetterSetter(Node, 'preventDefault', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());
addGetterSetter(Node, 'filters', null, function (val) {
    this._filterUpToDate = false;
    return val;
});
addGetterSetter(Node, 'visible', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());
addGetterSetter(Node, 'transformsEnabled', 'all', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getStringValidator)());
addGetterSetter(Node, 'size');
addGetterSetter(Node, 'dragBoundFunc');
addGetterSetter(Node, 'draggable', false, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.backCompat(Node, {
    rotateDeg: 'rotate',
    setRotationDeg: 'setRotation',
    getRotationDeg: 'getRotation',
});


/***/ }),

/***/ "../node_modules/konva/lib/PointerEvents.js":
/*!**************************************************!*\
  !*** ../node_modules/konva/lib/PointerEvents.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCapturedShape": () => (/* binding */ getCapturedShape),
/* harmony export */   "createEvent": () => (/* binding */ createEvent),
/* harmony export */   "hasPointerCapture": () => (/* binding */ hasPointerCapture),
/* harmony export */   "setPointerCapture": () => (/* binding */ setPointerCapture),
/* harmony export */   "releaseCapture": () => (/* binding */ releaseCapture)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");

const Captures = new Map();
const SUPPORT_POINTER_EVENTS = _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva._global.PointerEvent !== undefined;
function getCapturedShape(pointerId) {
    return Captures.get(pointerId);
}
function createEvent(evt) {
    return {
        evt,
        pointerId: evt.pointerId,
    };
}
function hasPointerCapture(pointerId, shape) {
    return Captures.get(pointerId) === shape;
}
function setPointerCapture(pointerId, shape) {
    releaseCapture(pointerId);
    const stage = shape.getStage();
    if (!stage)
        return;
    Captures.set(pointerId, shape);
    if (SUPPORT_POINTER_EVENTS) {
        shape._fire('gotpointercapture', createEvent(new PointerEvent('gotpointercapture')));
    }
}
function releaseCapture(pointerId, target) {
    const shape = Captures.get(pointerId);
    if (!shape)
        return;
    const stage = shape.getStage();
    if (stage && stage.content) {
    }
    Captures.delete(pointerId);
    if (SUPPORT_POINTER_EVENTS) {
        shape._fire('lostpointercapture', createEvent(new PointerEvent('lostpointercapture')));
    }
}


/***/ }),

/***/ "../node_modules/konva/lib/Shape.js":
/*!******************************************!*\
  !*** ../node_modules/konva/lib/Shape.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shapes": () => (/* binding */ shapes),
/* harmony export */   "Shape": () => (/* binding */ Shape)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Node.js */ "../node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Validators.js */ "../node_modules/konva/lib/Validators.js");
/* harmony import */ var _PointerEvents_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PointerEvents.js */ "../node_modules/konva/lib/PointerEvents.js");







var HAS_SHADOW = 'hasShadow';
var SHADOW_RGBA = 'shadowRGBA';
var patternImage = 'patternImage';
var linearGradient = 'linearGradient';
var radialGradient = 'radialGradient';
let dummyContext;
function getDummyContext() {
    if (dummyContext) {
        return dummyContext;
    }
    dummyContext = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.createCanvasElement().getContext('2d');
    return dummyContext;
}
const shapes = {};
function _fillFunc(context) {
    context.fill();
}
function _strokeFunc(context) {
    context.stroke();
}
function _fillFuncHit(context) {
    context.fill();
}
function _strokeFuncHit(context) {
    context.stroke();
}
function _clearHasShadowCache() {
    this._clearCache(HAS_SHADOW);
}
function _clearGetShadowRGBACache() {
    this._clearCache(SHADOW_RGBA);
}
function _clearFillPatternCache() {
    this._clearCache(patternImage);
}
function _clearLinearGradientCache() {
    this._clearCache(linearGradient);
}
function _clearRadialGradientCache() {
    this._clearCache(radialGradient);
}
class Shape extends _Node_js__WEBPACK_IMPORTED_MODULE_3__.Node {
    constructor(config) {
        super(config);
        let key;
        while (true) {
            key = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.getRandomColor();
            if (key && !(key in shapes)) {
                break;
            }
        }
        this.colorKey = key;
        shapes[key] = this;
    }
    getContext() {
        _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('shape.getContext() method is deprecated. Please do not use it.');
        return this.getLayer().getContext();
    }
    getCanvas() {
        _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('shape.getCanvas() method is deprecated. Please do not use it.');
        return this.getLayer().getCanvas();
    }
    getSceneFunc() {
        return this.attrs.sceneFunc || this['_sceneFunc'];
    }
    getHitFunc() {
        return this.attrs.hitFunc || this['_hitFunc'];
    }
    hasShadow() {
        return this._getCache(HAS_SHADOW, this._hasShadow);
    }
    _hasShadow() {
        return (this.shadowEnabled() &&
            this.shadowOpacity() !== 0 &&
            !!(this.shadowColor() ||
                this.shadowBlur() ||
                this.shadowOffsetX() ||
                this.shadowOffsetY()));
    }
    _getFillPattern() {
        return this._getCache(patternImage, this.__getFillPattern);
    }
    __getFillPattern() {
        if (this.fillPatternImage()) {
            var ctx = getDummyContext();
            const pattern = ctx.createPattern(this.fillPatternImage(), this.fillPatternRepeat() || 'repeat');
            if (pattern && pattern.setTransform) {
                const tr = new _Util_js__WEBPACK_IMPORTED_MODULE_1__.Transform();
                tr.translate(this.fillPatternX(), this.fillPatternY());
                tr.rotate(_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.getAngle(this.fillPatternRotation()));
                tr.scale(this.fillPatternScaleX(), this.fillPatternScaleY());
                tr.translate(-1 * this.fillPatternOffsetX(), -1 * this.fillPatternOffsetY());
                const m = tr.getMatrix();
                pattern.setTransform({
                    a: m[0],
                    b: m[1],
                    c: m[2],
                    d: m[3],
                    e: m[4],
                    f: m[5],
                });
            }
            return pattern;
        }
    }
    _getLinearGradient() {
        return this._getCache(linearGradient, this.__getLinearGradient);
    }
    __getLinearGradient() {
        var colorStops = this.fillLinearGradientColorStops();
        if (colorStops) {
            var ctx = getDummyContext();
            var start = this.fillLinearGradientStartPoint();
            var end = this.fillLinearGradientEndPoint();
            var grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            return grd;
        }
    }
    _getRadialGradient() {
        return this._getCache(radialGradient, this.__getRadialGradient);
    }
    __getRadialGradient() {
        var colorStops = this.fillRadialGradientColorStops();
        if (colorStops) {
            var ctx = getDummyContext();
            var start = this.fillRadialGradientStartPoint();
            var end = this.fillRadialGradientEndPoint();
            var grd = ctx.createRadialGradient(start.x, start.y, this.fillRadialGradientStartRadius(), end.x, end.y, this.fillRadialGradientEndRadius());
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            return grd;
        }
    }
    getShadowRGBA() {
        return this._getCache(SHADOW_RGBA, this._getShadowRGBA);
    }
    _getShadowRGBA() {
        if (this.hasShadow()) {
            var rgba = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.colorToRGBA(this.shadowColor());
            return ('rgba(' +
                rgba.r +
                ',' +
                rgba.g +
                ',' +
                rgba.b +
                ',' +
                rgba.a * (this.shadowOpacity() || 1) +
                ')');
        }
    }
    hasFill() {
        return this._calculate('hasFill', [
            'fillEnabled',
            'fill',
            'fillPatternImage',
            'fillLinearGradientColorStops',
            'fillRadialGradientColorStops',
        ], () => {
            return (this.fillEnabled() &&
                !!(this.fill() ||
                    this.fillPatternImage() ||
                    this.fillLinearGradientColorStops() ||
                    this.fillRadialGradientColorStops()));
        });
    }
    hasStroke() {
        return this._calculate('hasStroke', [
            'strokeEnabled',
            'strokeWidth',
            'stroke',
            'strokeLinearGradientColorStops',
        ], () => {
            return (this.strokeEnabled() &&
                this.strokeWidth() &&
                !!(this.stroke() || this.strokeLinearGradientColorStops()));
        });
    }
    hasHitStroke() {
        const width = this.hitStrokeWidth();
        if (width === 'auto') {
            return this.hasStroke();
        }
        return this.strokeEnabled() && !!width;
    }
    intersects(point) {
        var stage = this.getStage(), bufferHitCanvas = stage.bufferHitCanvas, p;
        bufferHitCanvas.getContext().clear();
        this.drawHit(bufferHitCanvas, null, true);
        p = bufferHitCanvas.context.getImageData(Math.round(point.x), Math.round(point.y), 1, 1).data;
        return p[3] > 0;
    }
    destroy() {
        _Node_js__WEBPACK_IMPORTED_MODULE_3__.Node.prototype.destroy.call(this);
        delete shapes[this.colorKey];
        delete this.colorKey;
        return this;
    }
    _useBufferCanvas(forceFill) {
        var _a;
        if (!this.getStage()) {
            return false;
        }
        const perfectDrawEnabled = (_a = this.attrs.perfectDrawEnabled) !== null && _a !== void 0 ? _a : true;
        if (!perfectDrawEnabled) {
            return false;
        }
        const hasFill = forceFill || this.hasFill();
        const hasStroke = this.hasStroke();
        const isTransparent = this.getAbsoluteOpacity() !== 1;
        if (hasFill && hasStroke && isTransparent) {
            return true;
        }
        const hasShadow = this.hasShadow();
        const strokeForShadow = this.shadowForStrokeEnabled();
        if (hasFill && hasStroke && hasShadow && strokeForShadow) {
            return true;
        }
        return false;
    }
    setStrokeHitEnabled(val) {
        _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead.');
        if (val) {
            this.hitStrokeWidth('auto');
        }
        else {
            this.hitStrokeWidth(0);
        }
    }
    getStrokeHitEnabled() {
        if (this.hitStrokeWidth() === 0) {
            return false;
        }
        else {
            return true;
        }
    }
    getSelfRect() {
        var size = this.size();
        return {
            x: this._centroid ? -size.width / 2 : 0,
            y: this._centroid ? -size.height / 2 : 0,
            width: size.width,
            height: size.height,
        };
    }
    getClientRect(config = {}) {
        const skipTransform = config.skipTransform;
        const relativeTo = config.relativeTo;
        const fillRect = this.getSelfRect();
        const applyStroke = !config.skipStroke && this.hasStroke();
        const strokeWidth = (applyStroke && this.strokeWidth()) || 0;
        const fillAndStrokeWidth = fillRect.width + strokeWidth;
        const fillAndStrokeHeight = fillRect.height + strokeWidth;
        const applyShadow = !config.skipShadow && this.hasShadow();
        const shadowOffsetX = applyShadow ? this.shadowOffsetX() : 0;
        const shadowOffsetY = applyShadow ? this.shadowOffsetY() : 0;
        const preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
        const preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);
        const blurRadius = (applyShadow && this.shadowBlur()) || 0;
        const width = preWidth + blurRadius * 2;
        const height = preHeight + blurRadius * 2;
        let roundingOffset = 0;
        if (Math.round(strokeWidth / 2) !== strokeWidth / 2) {
            roundingOffset = 1;
        }
        const rect = {
            width: width + roundingOffset,
            height: height + roundingOffset,
            x: -Math.round(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetX, 0) +
                fillRect.x,
            y: -Math.round(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetY, 0) +
                fillRect.y,
        };
        if (!skipTransform) {
            return this._transformedRect(rect, relativeTo);
        }
        return rect;
    }
    drawScene(can, top) {
        var layer = this.getLayer(), canvas = can || layer.getCanvas(), context = canvas.getContext(), cachedCanvas = this._getCanvasCache(), drawFunc = this.getSceneFunc(), hasShadow = this.hasShadow(), stage, bufferCanvas, bufferContext;
        var skipBuffer = canvas.isCache;
        var cachingSelf = top === this;
        if (!this.isVisible() && !cachingSelf) {
            return this;
        }
        if (cachedCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedSceneCanvas(context);
            context.restore();
            return this;
        }
        if (!drawFunc) {
            return this;
        }
        context.save();
        if (this._useBufferCanvas() && !skipBuffer) {
            stage = this.getStage();
            bufferCanvas = stage.bufferCanvas;
            bufferContext = bufferCanvas.getContext();
            bufferContext.clear();
            bufferContext.save();
            bufferContext._applyLineJoin(this);
            var o = this.getAbsoluteTransform(top).getMatrix();
            bufferContext.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
            drawFunc.call(this, bufferContext, this);
            bufferContext.restore();
            var ratio = bufferCanvas.pixelRatio;
            if (hasShadow) {
                context._applyShadow(this);
            }
            context._applyOpacity(this);
            context._applyGlobalCompositeOperation(this);
            context.drawImage(bufferCanvas._canvas, 0, 0, bufferCanvas.width / ratio, bufferCanvas.height / ratio);
        }
        else {
            context._applyLineJoin(this);
            if (!cachingSelf) {
                var o = this.getAbsoluteTransform(top).getMatrix();
                context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
                context._applyOpacity(this);
                context._applyGlobalCompositeOperation(this);
            }
            if (hasShadow) {
                context._applyShadow(this);
            }
            drawFunc.call(this, context, this);
        }
        context.restore();
        return this;
    }
    drawHit(can, top, skipDragCheck = false) {
        if (!this.shouldDrawHit(top, skipDragCheck)) {
            return this;
        }
        var layer = this.getLayer(), canvas = can || layer.hitCanvas, context = canvas && canvas.getContext(), drawFunc = this.hitFunc() || this.sceneFunc(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
        if (!this.colorKey) {
            _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. If you want to reuse shape you should call remove() instead of destroy()');
        }
        if (cachedHitCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedHitCanvas(context);
            context.restore();
            return this;
        }
        if (!drawFunc) {
            return this;
        }
        context.save();
        context._applyLineJoin(this);
        const selfCache = this === top;
        if (!selfCache) {
            var o = this.getAbsoluteTransform(top).getMatrix();
            context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
        }
        drawFunc.call(this, context, this);
        context.restore();
        return this;
    }
    drawHitFromCache(alphaThreshold = 0) {
        var cachedCanvas = this._getCanvasCache(), sceneCanvas = this._getCachedSceneCanvas(), hitCanvas = cachedCanvas.hit, hitContext = hitCanvas.getContext(), hitWidth = hitCanvas.getWidth(), hitHeight = hitCanvas.getHeight(), hitImageData, hitData, len, rgbColorKey, i, alpha;
        hitContext.clear();
        hitContext.drawImage(sceneCanvas._canvas, 0, 0, hitWidth, hitHeight);
        try {
            hitImageData = hitContext.getImageData(0, 0, hitWidth, hitHeight);
            hitData = hitImageData.data;
            len = hitData.length;
            rgbColorKey = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._hexToRgb(this.colorKey);
            for (i = 0; i < len; i += 4) {
                alpha = hitData[i + 3];
                if (alpha > alphaThreshold) {
                    hitData[i] = rgbColorKey.r;
                    hitData[i + 1] = rgbColorKey.g;
                    hitData[i + 2] = rgbColorKey.b;
                    hitData[i + 3] = 255;
                }
                else {
                    hitData[i + 3] = 0;
                }
            }
            hitContext.putImageData(hitImageData, 0, 0);
        }
        catch (e) {
            _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.error('Unable to draw hit graph from cached scene canvas. ' + e.message);
        }
        return this;
    }
    hasPointerCapture(pointerId) {
        return _PointerEvents_js__WEBPACK_IMPORTED_MODULE_5__.hasPointerCapture(pointerId, this);
    }
    setPointerCapture(pointerId) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_5__.setPointerCapture(pointerId, this);
    }
    releaseCapture(pointerId) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_5__.releaseCapture(pointerId, this);
    }
}
Shape.prototype._fillFunc = _fillFunc;
Shape.prototype._strokeFunc = _strokeFunc;
Shape.prototype._fillFuncHit = _fillFuncHit;
Shape.prototype._strokeFuncHit = _strokeFuncHit;
Shape.prototype._centroid = false;
Shape.prototype.nodeType = 'Shape';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_0__._registerNode)(Shape);
Shape.prototype.eventListeners = {};
Shape.prototype.on.call(Shape.prototype, 'shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearHasShadowCache);
Shape.prototype.on.call(Shape.prototype, 'shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearGetShadowRGBACache);
Shape.prototype.on.call(Shape.prototype, 'fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva fillPatternOffsetXChange.konva fillPatternOffsetYChange.konva fillPatternXChange.konva fillPatternYChange.konva fillPatternRotationChange.konva', _clearFillPatternCache);
Shape.prototype.on.call(Shape.prototype, 'fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva', _clearLinearGradientCache);
Shape.prototype.on.call(Shape.prototype, 'fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva', _clearRadialGradientCache);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'stroke', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getStringOrGradientValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeWidth', 2, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillAfterStrokeEnabled', false);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'hitStrokeWidth', 'auto', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberOrAutoValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeHitEnabled', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'perfectDrawEnabled', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowForStrokeEnabled', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'lineJoin');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'lineCap');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'sceneFunc');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'hitFunc');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'dash');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'dashOffset', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowColor', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getStringValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowBlur', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowOpacity', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'shadowOffset', ['x', 'y']);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowOffsetX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowOffsetY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternImage');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fill', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getStringOrGradientValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientColorStops');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientColorStops');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientStartRadius', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientEndRadius', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientColorStops');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternRepeat', 'repeat');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'dashEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeScaleEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPriority', 'color');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillPatternOffset', ['x', 'y']);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternOffsetX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternOffsetY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillPatternScale', ['x', 'y']);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternScaleX', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternScaleY', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientStartPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientStartPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientEndPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientEndPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientStartPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientEndPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternRotation', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.backCompat(Shape, {
    dashArray: 'dash',
    getDashArray: 'getDash',
    setDashArray: 'getDash',
    drawFunc: 'sceneFunc',
    getDrawFunc: 'getSceneFunc',
    setDrawFunc: 'setSceneFunc',
    drawHitFunc: 'hitFunc',
    getDrawHitFunc: 'getHitFunc',
    setDrawHitFunc: 'setHitFunc',
});


/***/ }),

/***/ "../node_modules/konva/lib/Stage.js":
/*!******************************************!*\
  !*** ../node_modules/konva/lib/Stage.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "stages": () => (/* binding */ stages),
/* harmony export */   "Stage": () => (/* binding */ Stage)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Container_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Container.js */ "../node_modules/konva/lib/Container.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");
/* harmony import */ var _Canvas_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Canvas.js */ "../node_modules/konva/lib/Canvas.js");
/* harmony import */ var _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DragAndDrop.js */ "../node_modules/konva/lib/DragAndDrop.js");
/* harmony import */ var _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PointerEvents.js */ "../node_modules/konva/lib/PointerEvents.js");








var STAGE = 'Stage', STRING = 'string', PX = 'px', MOUSEOUT = 'mouseout', MOUSELEAVE = 'mouseleave', MOUSEOVER = 'mouseover', MOUSEENTER = 'mouseenter', MOUSEMOVE = 'mousemove', MOUSEDOWN = 'mousedown', MOUSEUP = 'mouseup', POINTERMOVE = 'pointermove', POINTERDOWN = 'pointerdown', POINTERUP = 'pointerup', POINTERCANCEL = 'pointercancel', LOSTPOINTERCAPTURE = 'lostpointercapture', POINTEROUT = 'pointerout', POINTERLEAVE = 'pointerleave', POINTEROVER = 'pointerover', POINTERENTER = 'pointerenter', CONTEXTMENU = 'contextmenu', TOUCHSTART = 'touchstart', TOUCHEND = 'touchend', TOUCHMOVE = 'touchmove', TOUCHCANCEL = 'touchcancel', WHEEL = 'wheel', MAX_LAYERS_NUMBER = 5, EVENTS = [
    [MOUSEENTER, '_pointerenter'],
    [MOUSEDOWN, '_pointerdown'],
    [MOUSEMOVE, '_pointermove'],
    [MOUSEUP, '_pointerup'],
    [MOUSELEAVE, '_pointerleave'],
    [TOUCHSTART, '_pointerdown'],
    [TOUCHMOVE, '_pointermove'],
    [TOUCHEND, '_pointerup'],
    [TOUCHCANCEL, '_pointercancel'],
    [MOUSEOVER, '_pointerover'],
    [WHEEL, '_wheel'],
    [CONTEXTMENU, '_contextmenu'],
    [POINTERDOWN, '_pointerdown'],
    [POINTERMOVE, '_pointermove'],
    [POINTERUP, '_pointerup'],
    [POINTERCANCEL, '_pointercancel'],
    [LOSTPOINTERCAPTURE, '_lostpointercapture'],
];
const EVENTS_MAP = {
    mouse: {
        [POINTEROUT]: MOUSEOUT,
        [POINTERLEAVE]: MOUSELEAVE,
        [POINTEROVER]: MOUSEOVER,
        [POINTERENTER]: MOUSEENTER,
        [POINTERMOVE]: MOUSEMOVE,
        [POINTERDOWN]: MOUSEDOWN,
        [POINTERUP]: MOUSEUP,
        [POINTERCANCEL]: 'mousecancel',
        pointerclick: 'click',
        pointerdblclick: 'dblclick',
    },
    touch: {
        [POINTEROUT]: 'touchout',
        [POINTERLEAVE]: 'touchleave',
        [POINTEROVER]: 'touchover',
        [POINTERENTER]: 'touchenter',
        [POINTERMOVE]: TOUCHMOVE,
        [POINTERDOWN]: TOUCHSTART,
        [POINTERUP]: TOUCHEND,
        [POINTERCANCEL]: TOUCHCANCEL,
        pointerclick: 'tap',
        pointerdblclick: 'dbltap',
    },
    pointer: {
        [POINTEROUT]: POINTEROUT,
        [POINTERLEAVE]: POINTERLEAVE,
        [POINTEROVER]: POINTEROVER,
        [POINTERENTER]: POINTERENTER,
        [POINTERMOVE]: POINTERMOVE,
        [POINTERDOWN]: POINTERDOWN,
        [POINTERUP]: POINTERUP,
        [POINTERCANCEL]: POINTERCANCEL,
        pointerclick: 'pointerclick',
        pointerdblclick: 'pointerdblclick',
    },
};
const getEventType = (type) => {
    if (type.indexOf('pointer') >= 0) {
        return 'pointer';
    }
    if (type.indexOf('touch') >= 0) {
        return 'touch';
    }
    return 'mouse';
};
const getEventsMap = (eventType) => {
    const type = getEventType(eventType);
    if (type === 'pointer') {
        return _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.pointerEventsEnabled && EVENTS_MAP.pointer;
    }
    if (type === 'touch') {
        return EVENTS_MAP.touch;
    }
    if (type === 'mouse') {
        return EVENTS_MAP.mouse;
    }
};
function checkNoClip(attrs = {}) {
    if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Stage does not support clipping. Please use clip for Layers or Groups.');
    }
    return attrs;
}
const NO_POINTERS_MESSAGE = `Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);`;
const stages = [];
class Stage extends _Container_js__WEBPACK_IMPORTED_MODULE_2__.Container {
    constructor(config) {
        super(checkNoClip(config));
        this._pointerPositions = [];
        this._changedPointerPositions = [];
        this._buildDOM();
        this._bindContentEvents();
        stages.push(this);
        this.on('widthChange.konva heightChange.konva', this._resizeDOM);
        this.on('visibleChange.konva', this._checkVisibility);
        this.on('clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva', () => {
            checkNoClip(this.attrs);
        });
        this._checkVisibility();
    }
    _validateAdd(child) {
        const isLayer = child.getType() === 'Layer';
        const isFastLayer = child.getType() === 'FastLayer';
        const valid = isLayer || isFastLayer;
        if (!valid) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util["throw"]('You may only add layers to the stage.');
        }
    }
    _checkVisibility() {
        if (!this.content) {
            return;
        }
        const style = this.visible() ? '' : 'none';
        this.content.style.display = style;
    }
    setContainer(container) {
        if (typeof container === STRING) {
            if (container.charAt(0) === '.') {
                var className = container.slice(1);
                container = document.getElementsByClassName(className)[0];
            }
            else {
                var id;
                if (container.charAt(0) !== '#') {
                    id = container;
                }
                else {
                    id = container.slice(1);
                }
                container = document.getElementById(id);
            }
            if (!container) {
                throw 'Can not find container in document with id ' + id;
            }
        }
        this._setAttr('container', container);
        if (this.content) {
            if (this.content.parentElement) {
                this.content.parentElement.removeChild(this.content);
            }
            container.appendChild(this.content);
        }
        return this;
    }
    shouldDrawHit() {
        return true;
    }
    clear() {
        var layers = this.children, len = layers.length, n;
        for (n = 0; n < len; n++) {
            layers[n].clear();
        }
        return this;
    }
    clone(obj) {
        if (!obj) {
            obj = {};
        }
        obj.container =
            typeof document !== 'undefined' && document.createElement('div');
        return _Container_js__WEBPACK_IMPORTED_MODULE_2__.Container.prototype.clone.call(this, obj);
    }
    destroy() {
        super.destroy();
        var content = this.content;
        if (content && _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isInDocument(content)) {
            this.container().removeChild(content);
        }
        var index = stages.indexOf(this);
        if (index > -1) {
            stages.splice(index, 1);
        }
        return this;
    }
    getPointerPosition() {
        const pos = this._pointerPositions[0] || this._changedPointerPositions[0];
        if (!pos) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn(NO_POINTERS_MESSAGE);
            return null;
        }
        return {
            x: pos.x,
            y: pos.y,
        };
    }
    _getPointerById(id) {
        return this._pointerPositions.find((p) => p.id === id);
    }
    getPointersPositions() {
        return this._pointerPositions;
    }
    getStage() {
        return this;
    }
    getContent() {
        return this.content;
    }
    _toKonvaCanvas(config) {
        config = config || {};
        config.x = config.x || 0;
        config.y = config.y || 0;
        config.width = config.width || this.width();
        config.height = config.height || this.height();
        var canvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.SceneCanvas({
            width: config.width,
            height: config.height,
            pixelRatio: config.pixelRatio || 1,
        });
        var _context = canvas.getContext()._context;
        var layers = this.children;
        if (config.x || config.y) {
            _context.translate(-1 * config.x, -1 * config.y);
        }
        layers.forEach(function (layer) {
            if (!layer.isVisible()) {
                return;
            }
            var layerCanvas = layer._toKonvaCanvas(config);
            _context.drawImage(layerCanvas._canvas, config.x, config.y, layerCanvas.getWidth() / layerCanvas.getPixelRatio(), layerCanvas.getHeight() / layerCanvas.getPixelRatio());
        });
        return canvas;
    }
    getIntersection(pos) {
        if (!pos) {
            return null;
        }
        var layers = this.children, len = layers.length, end = len - 1, n;
        for (n = end; n >= 0; n--) {
            const shape = layers[n].getIntersection(pos);
            if (shape) {
                return shape;
            }
        }
        return null;
    }
    _resizeDOM() {
        var width = this.width();
        var height = this.height();
        if (this.content) {
            this.content.style.width = width + PX;
            this.content.style.height = height + PX;
        }
        this.bufferCanvas.setSize(width, height);
        this.bufferHitCanvas.setSize(width, height);
        this.children.forEach((layer) => {
            layer.setSize({ width, height });
            layer.draw();
        });
    }
    add(layer, ...rest) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        super.add(layer);
        var length = this.children.length;
        if (length > MAX_LAYERS_NUMBER) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('The stage has ' +
                length +
                ' layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group.');
        }
        layer.setSize({ width: this.width(), height: this.height() });
        layer.draw();
        if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.isBrowser) {
            this.content.appendChild(layer.canvas._canvas);
        }
        return this;
    }
    getParent() {
        return null;
    }
    getLayer() {
        return null;
    }
    hasPointerCapture(pointerId) {
        return _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.hasPointerCapture(pointerId, this);
    }
    setPointerCapture(pointerId) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.setPointerCapture(pointerId, this);
    }
    releaseCapture(pointerId) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.releaseCapture(pointerId, this);
    }
    getLayers() {
        return this.children;
    }
    _bindContentEvents() {
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.isBrowser) {
            return;
        }
        EVENTS.forEach(([event, methodName]) => {
            this.content.addEventListener(event, (evt) => {
                this[methodName](evt);
            });
        });
    }
    _pointerenter(evt) {
        this.setPointersPositions(evt);
        const events = getEventsMap(evt.type);
        this._fire(events.pointerenter, {
            evt: evt,
            target: this,
            currentTarget: this,
        });
    }
    _pointerover(evt) {
        this.setPointersPositions(evt);
        const events = getEventsMap(evt.type);
        this._fire(events.pointerover, {
            evt: evt,
            target: this,
            currentTarget: this,
        });
    }
    _getTargetShape(evenType) {
        let shape = this[evenType + 'targetShape'];
        if (shape && !shape.getStage()) {
            shape = null;
        }
        return shape;
    }
    _pointerleave(evt) {
        const events = getEventsMap(evt.type);
        const eventType = getEventType(evt.type);
        if (!events) {
            return;
        }
        this.setPointersPositions(evt);
        var targetShape = this._getTargetShape(eventType);
        var eventsEnabled = !_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.isDragging || _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.hitOnDragEnabled;
        if (targetShape && eventsEnabled) {
            targetShape._fireAndBubble(events.pointerout, { evt: evt });
            targetShape._fireAndBubble(events.pointerleave, { evt: evt });
            this._fire(events.pointerleave, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
            this[eventType + 'targetShape'] = null;
        }
        else if (eventsEnabled) {
            this._fire(events.pointerleave, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
            this._fire(events.pointerout, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
        }
        this.pointerPos = undefined;
        this._pointerPositions = [];
    }
    _pointerdown(evt) {
        const events = getEventsMap(evt.type);
        const eventType = getEventType(evt.type);
        if (!events) {
            return;
        }
        this.setPointersPositions(evt);
        var triggeredOnShape = false;
        this._changedPointerPositions.forEach((pos) => {
            var shape = this.getIntersection(pos);
            _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.justDragged = false;
            _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'ListenClick'] = true;
            const hasShape = shape && shape.isListening();
            if (!hasShape) {
                return;
            }
            if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.capturePointerEventsEnabled) {
                shape.setPointerCapture(pos.id);
            }
            this[eventType + 'ClickStartShape'] = shape;
            shape._fireAndBubble(events.pointerdown, {
                evt: evt,
                pointerId: pos.id,
            });
            triggeredOnShape = true;
            const isTouch = evt.type.indexOf('touch') >= 0;
            if (shape.preventDefault() && evt.cancelable && isTouch) {
                evt.preventDefault();
            }
        });
        if (!triggeredOnShape) {
            this._fire(events.pointerdown, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._pointerPositions[0].id,
            });
        }
    }
    _pointermove(evt) {
        const events = getEventsMap(evt.type);
        const eventType = getEventType(evt.type);
        if (!events) {
            return;
        }
        if (_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.isDragging && _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.node.preventDefault() && evt.cancelable) {
            evt.preventDefault();
        }
        this.setPointersPositions(evt);
        var eventsEnabled = !_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.isDragging || _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.hitOnDragEnabled;
        if (!eventsEnabled) {
            return;
        }
        var processedShapesIds = {};
        let triggeredOnShape = false;
        var targetShape = this._getTargetShape(eventType);
        this._changedPointerPositions.forEach((pos) => {
            const shape = (_PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.getCapturedShape(pos.id) ||
                this.getIntersection(pos));
            const pointerId = pos.id;
            const event = { evt: evt, pointerId };
            var differentTarget = targetShape !== shape;
            if (differentTarget && targetShape) {
                targetShape._fireAndBubble(events.pointerout, Object.assign({}, event), shape);
                targetShape._fireAndBubble(events.pointerleave, Object.assign({}, event), shape);
            }
            if (shape) {
                if (processedShapesIds[shape._id]) {
                    return;
                }
                processedShapesIds[shape._id] = true;
            }
            if (shape && shape.isListening()) {
                triggeredOnShape = true;
                if (differentTarget) {
                    shape._fireAndBubble(events.pointerover, Object.assign({}, event), targetShape);
                    shape._fireAndBubble(events.pointerenter, Object.assign({}, event), targetShape);
                    this[eventType + 'targetShape'] = shape;
                }
                shape._fireAndBubble(events.pointermove, Object.assign({}, event));
            }
            else {
                if (targetShape) {
                    this._fire(events.pointerover, {
                        evt: evt,
                        target: this,
                        currentTarget: this,
                        pointerId,
                    });
                    this[eventType + 'targetShape'] = null;
                }
            }
        });
        if (!triggeredOnShape) {
            this._fire(events.pointermove, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id,
            });
        }
    }
    _pointerup(evt) {
        const events = getEventsMap(evt.type);
        const eventType = getEventType(evt.type);
        if (!events) {
            return;
        }
        this.setPointersPositions(evt);
        const clickStartShape = this[eventType + 'ClickStartShape'];
        const clickEndShape = this[eventType + 'ClickEndShape'];
        var processedShapesIds = {};
        let triggeredOnShape = false;
        this._changedPointerPositions.forEach((pos) => {
            const shape = (_PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.getCapturedShape(pos.id) ||
                this.getIntersection(pos));
            if (shape) {
                shape.releaseCapture(pos.id);
                if (processedShapesIds[shape._id]) {
                    return;
                }
                processedShapesIds[shape._id] = true;
            }
            const pointerId = pos.id;
            const event = { evt: evt, pointerId };
            let fireDblClick = false;
            if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'InDblClickWindow']) {
                fireDblClick = true;
                clearTimeout(this[eventType + 'DblTimeout']);
            }
            else if (!_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.justDragged) {
                _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'InDblClickWindow'] = true;
                clearTimeout(this[eventType + 'DblTimeout']);
            }
            this[eventType + 'DblTimeout'] = setTimeout(function () {
                _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'InDblClickWindow'] = false;
            }, _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.dblClickWindow);
            if (shape && shape.isListening()) {
                triggeredOnShape = true;
                this[eventType + 'ClickEndShape'] = shape;
                shape._fireAndBubble(events.pointerup, Object.assign({}, event));
                if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'ListenClick'] &&
                    clickStartShape &&
                    clickStartShape === shape) {
                    shape._fireAndBubble(events.pointerclick, Object.assign({}, event));
                    if (fireDblClick && clickEndShape && clickEndShape === shape) {
                        shape._fireAndBubble(events.pointerdblclick, Object.assign({}, event));
                    }
                }
            }
            else {
                this[eventType + 'ClickEndShape'] = null;
                if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'ListenClick']) {
                    this._fire(events.pointerclick, {
                        evt: evt,
                        target: this,
                        currentTarget: this,
                        pointerId,
                    });
                }
                if (fireDblClick) {
                    this._fire(events.pointerdblclick, {
                        evt: evt,
                        target: this,
                        currentTarget: this,
                        pointerId,
                    });
                }
            }
        });
        if (!triggeredOnShape) {
            this._fire(events.pointerup, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id,
            });
        }
        _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'ListenClick'] = false;
        if (evt.cancelable) {
            evt.preventDefault();
        }
    }
    _contextmenu(evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(CONTEXTMENU, { evt: evt });
        }
        else {
            this._fire(CONTEXTMENU, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
        }
    }
    _wheel(evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(WHEEL, { evt: evt });
        }
        else {
            this._fire(WHEEL, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
        }
    }
    _pointercancel(evt) {
        this.setPointersPositions(evt);
        const shape = _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERUP, _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.createEvent(evt));
        }
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.releaseCapture(evt.pointerId);
    }
    _lostpointercapture(evt) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.releaseCapture(evt.pointerId);
    }
    setPointersPositions(evt) {
        var contentPosition = this._getContentPosition(), x = null, y = null;
        evt = evt ? evt : window.event;
        if (evt.touches !== undefined) {
            this._pointerPositions = [];
            this._changedPointerPositions = [];
            Array.prototype.forEach.call(evt.touches, (touch) => {
                this._pointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                });
            });
            Array.prototype.forEach.call(evt.changedTouches || evt.touches, (touch) => {
                this._changedPointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                });
            });
        }
        else {
            x = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
            y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
            this.pointerPos = {
                x: x,
                y: y,
            };
            this._pointerPositions = [{ x, y, id: _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._getFirstPointerId(evt) }];
            this._changedPointerPositions = [
                { x, y, id: _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._getFirstPointerId(evt) },
            ];
        }
    }
    _setPointerPosition(evt) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.');
        this.setPointersPositions(evt);
    }
    _getContentPosition() {
        if (!this.content || !this.content.getBoundingClientRect) {
            return {
                top: 0,
                left: 0,
                scaleX: 1,
                scaleY: 1,
            };
        }
        var rect = this.content.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            scaleX: rect.width / this.content.clientWidth || 1,
            scaleY: rect.height / this.content.clientHeight || 1,
        };
    }
    _buildDOM() {
        this.bufferCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.SceneCanvas({
            width: this.width(),
            height: this.height(),
        });
        this.bufferHitCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.HitCanvas({
            pixelRatio: 1,
            width: this.width(),
            height: this.height(),
        });
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.isBrowser) {
            return;
        }
        var container = this.container();
        if (!container) {
            throw 'Stage has no container. A container is required.';
        }
        container.innerHTML = '';
        this.content = document.createElement('div');
        this.content.style.position = 'relative';
        this.content.style.userSelect = 'none';
        this.content.className = 'konvajs-content';
        this.content.setAttribute('role', 'presentation');
        container.appendChild(this.content);
        this._resizeDOM();
    }
    cache() {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.');
        return this;
    }
    clearCache() {
        return this;
    }
    batchDraw() {
        this.getChildren().forEach(function (layer) {
            layer.batchDraw();
        });
        return this;
    }
}
Stage.prototype.nodeType = STAGE;
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(Stage);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Stage, 'container');


/***/ }),

/***/ "../node_modules/konva/lib/Tween.js":
/*!******************************************!*\
  !*** ../node_modules/konva/lib/Tween.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tween": () => (/* binding */ Tween),
/* harmony export */   "Easings": () => (/* binding */ Easings)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Animation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Animation.js */ "../node_modules/konva/lib/Animation.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Node.js */ "../node_modules/konva/lib/Node.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");




var blacklist = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1,
}, PAUSED = 1, PLAYING = 2, REVERSING = 3, idCounter = 0, colorAttrs = ['fill', 'stroke', 'shadowColor'];
class TweenEngine {
    constructor(prop, propFunc, func, begin, finish, duration, yoyo) {
        this.prop = prop;
        this.propFunc = propFunc;
        this.begin = begin;
        this._pos = begin;
        this.duration = duration;
        this._change = 0;
        this.prevPos = 0;
        this.yoyo = yoyo;
        this._time = 0;
        this._position = 0;
        this._startTime = 0;
        this._finish = 0;
        this.func = func;
        this._change = finish - this.begin;
        this.pause();
    }
    fire(str) {
        var handler = this[str];
        if (handler) {
            handler();
        }
    }
    setTime(t) {
        if (t > this.duration) {
            if (this.yoyo) {
                this._time = this.duration;
                this.reverse();
            }
            else {
                this.finish();
            }
        }
        else if (t < 0) {
            if (this.yoyo) {
                this._time = 0;
                this.play();
            }
            else {
                this.reset();
            }
        }
        else {
            this._time = t;
            this.update();
        }
    }
    getTime() {
        return this._time;
    }
    setPosition(p) {
        this.prevPos = this._pos;
        this.propFunc(p);
        this._pos = p;
    }
    getPosition(t) {
        if (t === undefined) {
            t = this._time;
        }
        return this.func(t, this.begin, this._change, this.duration);
    }
    play() {
        this.state = PLAYING;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onPlay');
    }
    reverse() {
        this.state = REVERSING;
        this._time = this.duration - this._time;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onReverse');
    }
    seek(t) {
        this.pause();
        this._time = t;
        this.update();
        this.fire('onSeek');
    }
    reset() {
        this.pause();
        this._time = 0;
        this.update();
        this.fire('onReset');
    }
    finish() {
        this.pause();
        this._time = this.duration;
        this.update();
        this.fire('onFinish');
    }
    update() {
        this.setPosition(this.getPosition(this._time));
        this.fire('onUpdate');
    }
    onEnterFrame() {
        var t = this.getTimer() - this._startTime;
        if (this.state === PLAYING) {
            this.setTime(t);
        }
        else if (this.state === REVERSING) {
            this.setTime(this.duration - t);
        }
    }
    pause() {
        this.state = PAUSED;
        this.fire('onPause');
    }
    getTimer() {
        return new Date().getTime();
    }
}
class Tween {
    constructor(config) {
        var that = this, node = config.node, nodeId = node._id, duration, easing = config.easing || Easings.Linear, yoyo = !!config.yoyo, key;
        if (typeof config.duration === 'undefined') {
            duration = 0.3;
        }
        else if (config.duration === 0) {
            duration = 0.001;
        }
        else {
            duration = config.duration;
        }
        this.node = node;
        this._id = idCounter++;
        var layers = node.getLayer() ||
            (node instanceof _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.Stage ? node.getLayers() : null);
        if (!layers) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Tween constructor have `node` that is not in a layer. Please add node into layer first.');
        }
        this.anim = new _Animation_js__WEBPACK_IMPORTED_MODULE_1__.Animation(function () {
            that.tween.onEnterFrame();
        }, layers);
        this.tween = new TweenEngine(key, function (i) {
            that._tweenFunc(i);
        }, easing, 0, 1, duration * 1000, yoyo);
        this._addListeners();
        if (!Tween.attrs[nodeId]) {
            Tween.attrs[nodeId] = {};
        }
        if (!Tween.attrs[nodeId][this._id]) {
            Tween.attrs[nodeId][this._id] = {};
        }
        if (!Tween.tweens[nodeId]) {
            Tween.tweens[nodeId] = {};
        }
        for (key in config) {
            if (blacklist[key] === undefined) {
                this._addAttr(key, config[key]);
            }
        }
        this.reset();
        this.onFinish = config.onFinish;
        this.onReset = config.onReset;
        this.onUpdate = config.onUpdate;
    }
    _addAttr(key, end) {
        var node = this.node, nodeId = node._id, start, diff, tweenId, n, len, trueEnd, trueStart, endRGBA;
        tweenId = Tween.tweens[nodeId][key];
        if (tweenId) {
            delete Tween.attrs[nodeId][tweenId][key];
        }
        start = node.getAttr(key);
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isArray(end)) {
            diff = [];
            len = Math.max(end.length, start.length);
            if (key === 'points' && end.length !== start.length) {
                if (end.length > start.length) {
                    trueStart = start;
                    start = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._prepareArrayForTween(start, end, node.closed());
                }
                else {
                    trueEnd = end;
                    end = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._prepareArrayForTween(end, start, node.closed());
                }
            }
            if (key.indexOf('fill') === 0) {
                for (n = 0; n < len; n++) {
                    if (n % 2 === 0) {
                        diff.push(end[n] - start[n]);
                    }
                    else {
                        var startRGBA = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.colorToRGBA(start[n]);
                        endRGBA = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.colorToRGBA(end[n]);
                        start[n] = startRGBA;
                        diff.push({
                            r: endRGBA.r - startRGBA.r,
                            g: endRGBA.g - startRGBA.g,
                            b: endRGBA.b - startRGBA.b,
                            a: endRGBA.a - startRGBA.a,
                        });
                    }
                }
            }
            else {
                for (n = 0; n < len; n++) {
                    diff.push(end[n] - start[n]);
                }
            }
        }
        else if (colorAttrs.indexOf(key) !== -1) {
            start = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.colorToRGBA(start);
            endRGBA = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.colorToRGBA(end);
            diff = {
                r: endRGBA.r - start.r,
                g: endRGBA.g - start.g,
                b: endRGBA.b - start.b,
                a: endRGBA.a - start.a,
            };
        }
        else {
            diff = end - start;
        }
        Tween.attrs[nodeId][this._id][key] = {
            start: start,
            diff: diff,
            end: end,
            trueEnd: trueEnd,
            trueStart: trueStart,
        };
        Tween.tweens[nodeId][key] = this._id;
    }
    _tweenFunc(i) {
        var node = this.node, attrs = Tween.attrs[node._id][this._id], key, attr, start, diff, newVal, n, len, end;
        for (key in attrs) {
            attr = attrs[key];
            start = attr.start;
            diff = attr.diff;
            end = attr.end;
            if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isArray(start)) {
                newVal = [];
                len = Math.max(start.length, end.length);
                if (key.indexOf('fill') === 0) {
                    for (n = 0; n < len; n++) {
                        if (n % 2 === 0) {
                            newVal.push((start[n] || 0) + diff[n] * i);
                        }
                        else {
                            newVal.push('rgba(' +
                                Math.round(start[n].r + diff[n].r * i) +
                                ',' +
                                Math.round(start[n].g + diff[n].g * i) +
                                ',' +
                                Math.round(start[n].b + diff[n].b * i) +
                                ',' +
                                (start[n].a + diff[n].a * i) +
                                ')');
                        }
                    }
                }
                else {
                    for (n = 0; n < len; n++) {
                        newVal.push((start[n] || 0) + diff[n] * i);
                    }
                }
            }
            else if (colorAttrs.indexOf(key) !== -1) {
                newVal =
                    'rgba(' +
                        Math.round(start.r + diff.r * i) +
                        ',' +
                        Math.round(start.g + diff.g * i) +
                        ',' +
                        Math.round(start.b + diff.b * i) +
                        ',' +
                        (start.a + diff.a * i) +
                        ')';
            }
            else {
                newVal = start + diff * i;
            }
            node.setAttr(key, newVal);
        }
    }
    _addListeners() {
        this.tween.onPlay = () => {
            this.anim.start();
        };
        this.tween.onReverse = () => {
            this.anim.start();
        };
        this.tween.onPause = () => {
            this.anim.stop();
        };
        this.tween.onFinish = () => {
            var node = this.node;
            var attrs = Tween.attrs[node._id][this._id];
            if (attrs.points && attrs.points.trueEnd) {
                node.setAttr('points', attrs.points.trueEnd);
            }
            if (this.onFinish) {
                this.onFinish.call(this);
            }
        };
        this.tween.onReset = () => {
            var node = this.node;
            var attrs = Tween.attrs[node._id][this._id];
            if (attrs.points && attrs.points.trueStart) {
                node.points(attrs.points.trueStart);
            }
            if (this.onReset) {
                this.onReset();
            }
        };
        this.tween.onUpdate = () => {
            if (this.onUpdate) {
                this.onUpdate.call(this);
            }
        };
    }
    play() {
        this.tween.play();
        return this;
    }
    reverse() {
        this.tween.reverse();
        return this;
    }
    reset() {
        this.tween.reset();
        return this;
    }
    seek(t) {
        this.tween.seek(t * 1000);
        return this;
    }
    pause() {
        this.tween.pause();
        return this;
    }
    finish() {
        this.tween.finish();
        return this;
    }
    destroy() {
        var nodeId = this.node._id, thisId = this._id, attrs = Tween.tweens[nodeId], key;
        this.pause();
        for (key in attrs) {
            delete Tween.tweens[nodeId][key];
        }
        delete Tween.attrs[nodeId][thisId];
    }
}
Tween.attrs = {};
Tween.tweens = {};
_Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.to = function (params) {
    var onFinish = params.onFinish;
    params.node = this;
    params.onFinish = function () {
        this.destroy();
        if (onFinish) {
            onFinish();
        }
    };
    var tween = new Tween(params);
    tween.play();
};
const Easings = {
    BackEaseIn(t, b, c, d) {
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    BackEaseOut(t, b, c, d) {
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    BackEaseInOut(t, b, c, d) {
        var s = 1.70158;
        if ((t /= d / 2) < 1) {
            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    ElasticEaseIn(t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (-(a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b);
    },
    ElasticEaseOut(t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
            c +
            b);
    },
    ElasticEaseInOut(t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        if (t < 1) {
            return (-0.5 *
                (a *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                b);
        }
        return (a *
            Math.pow(2, -10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
            0.5 +
            c +
            b);
    },
    BounceEaseOut(t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        }
        else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    },
    BounceEaseIn(t, b, c, d) {
        return c - Easings.BounceEaseOut(d - t, 0, c, d) + b;
    },
    BounceEaseInOut(t, b, c, d) {
        if (t < d / 2) {
            return Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
        }
        else {
            return Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    },
    EaseIn(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    EaseOut(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    EaseInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t + b;
        }
        return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
    StrongEaseIn(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    StrongEaseOut(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    StrongEaseInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t * t * t * t + b;
        }
        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
    Linear(t, b, c, d) {
        return (c * t) / d + b;
    },
};


/***/ }),

/***/ "../node_modules/konva/lib/Util.js":
/*!*****************************************!*\
  !*** ../node_modules/konva/lib/Util.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Transform": () => (/* binding */ Transform),
/* harmony export */   "Util": () => (/* binding */ Util)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");

class Transform {
    constructor(m = [1, 0, 0, 1, 0, 0]) {
        this.dirty = false;
        this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    }
    reset() {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 1;
        this.m[4] = 0;
        this.m[5] = 0;
    }
    copy() {
        return new Transform(this.m);
    }
    copyInto(tr) {
        tr.m[0] = this.m[0];
        tr.m[1] = this.m[1];
        tr.m[2] = this.m[2];
        tr.m[3] = this.m[3];
        tr.m[4] = this.m[4];
        tr.m[5] = this.m[5];
    }
    point(point) {
        var m = this.m;
        return {
            x: m[0] * point.x + m[2] * point.y + m[4],
            y: m[1] * point.x + m[3] * point.y + m[5],
        };
    }
    translate(x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    }
    scale(sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    }
    rotate(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var m11 = this.m[0] * c + this.m[2] * s;
        var m12 = this.m[1] * c + this.m[3] * s;
        var m21 = this.m[0] * -s + this.m[2] * c;
        var m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    getTranslation() {
        return {
            x: this.m[4],
            y: this.m[5],
        };
    }
    skew(sx, sy) {
        var m11 = this.m[0] + this.m[2] * sy;
        var m12 = this.m[1] + this.m[3] * sy;
        var m21 = this.m[2] + this.m[0] * sx;
        var m22 = this.m[3] + this.m[1] * sx;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    multiply(matrix) {
        var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
        var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
        var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
        var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
        var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
        var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        this.m[4] = dx;
        this.m[5] = dy;
        return this;
    }
    invert() {
        var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
        var m0 = this.m[3] * d;
        var m1 = -this.m[1] * d;
        var m2 = -this.m[2] * d;
        var m3 = this.m[0] * d;
        var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
        var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        return this;
    }
    getMatrix() {
        return this.m;
    }
    setAbsolutePosition(x, y) {
        var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3], m4 = this.m[4], m5 = this.m[5], yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2), xt = (x - m4 - m2 * yt) / m0;
        return this.translate(xt, yt);
    }
    decompose() {
        var a = this.m[0];
        var b = this.m[1];
        var c = this.m[2];
        var d = this.m[3];
        var e = this.m[4];
        var f = this.m[5];
        var delta = a * d - b * c;
        let result = {
            x: e,
            y: f,
            rotation: 0,
            scaleX: 0,
            scaleY: 0,
            skewX: 0,
            skewY: 0,
        };
        if (a != 0 || b != 0) {
            var r = Math.sqrt(a * a + b * b);
            result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
            result.scaleX = r;
            result.scaleY = delta / r;
            result.skewX = (a * c + b * d) / delta;
            result.skewY = 0;
        }
        else if (c != 0 || d != 0) {
            var s = Math.sqrt(c * c + d * d);
            result.rotation =
                Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            result.scaleX = delta / s;
            result.scaleY = s;
            result.skewX = 0;
            result.skewY = (a * c + b * d) / delta;
        }
        else {
        }
        result.rotation = Util._getRotation(result.rotation);
        return result;
    }
}
var OBJECT_ARRAY = '[object Array]', OBJECT_NUMBER = '[object Number]', OBJECT_STRING = '[object String]', OBJECT_BOOLEAN = '[object Boolean]', PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = '#', EMPTY_STRING = '', ZERO = '0', KONVA_WARNING = 'Konva warning: ', KONVA_ERROR = 'Konva error: ', RGB_PAREN = 'rgb(', COLORS = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 132, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 255, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 203],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [119, 128, 144],
    slategrey: [119, 128, 144],
    snow: [255, 255, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    transparent: [255, 255, 255, 0],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 5],
}, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/, animQueue = [];
const req = (typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame) ||
    function (f) {
        setTimeout(f, 60);
    };
const Util = {
    _isElement(obj) {
        return !!(obj && obj.nodeType == 1);
    },
    _isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    _isPlainObject(obj) {
        return !!obj && obj.constructor === Object;
    },
    _isArray(obj) {
        return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
    },
    _isNumber(obj) {
        return (Object.prototype.toString.call(obj) === OBJECT_NUMBER &&
            !isNaN(obj) &&
            isFinite(obj));
    },
    _isString(obj) {
        return Object.prototype.toString.call(obj) === OBJECT_STRING;
    },
    _isBoolean(obj) {
        return Object.prototype.toString.call(obj) === OBJECT_BOOLEAN;
    },
    isObject(val) {
        return val instanceof Object;
    },
    isValidSelector(selector) {
        if (typeof selector !== 'string') {
            return false;
        }
        var firstChar = selector[0];
        return (firstChar === '#' ||
            firstChar === '.' ||
            firstChar === firstChar.toUpperCase());
    },
    _sign(number) {
        if (number === 0) {
            return 1;
        }
        if (number > 0) {
            return 1;
        }
        else {
            return -1;
        }
    },
    requestAnimFrame(callback) {
        animQueue.push(callback);
        if (animQueue.length === 1) {
            req(function () {
                const queue = animQueue;
                animQueue = [];
                queue.forEach(function (cb) {
                    cb();
                });
            });
        }
    },
    createCanvasElement() {
        var canvas = document.createElement('canvas');
        try {
            canvas.style = canvas.style || {};
        }
        catch (e) { }
        return canvas;
    },
    createImageElement() {
        return document.createElement('img');
    },
    _isInDocument(el) {
        while ((el = el.parentNode)) {
            if (el == document) {
                return true;
            }
        }
        return false;
    },
    _urlToImage(url, callback) {
        var imageObj = Util.createImageElement();
        imageObj.onload = function () {
            callback(imageObj);
        };
        imageObj.src = url;
    },
    _rgbToHex(r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    _hexToRgb(hex) {
        hex = hex.replace(HASH, EMPTY_STRING);
        var bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    },
    getRandomColor() {
        var randColor = ((Math.random() * 0xffffff) << 0).toString(16);
        while (randColor.length < 6) {
            randColor = ZERO + randColor;
        }
        return HASH + randColor;
    },
    getRGB(color) {
        var rgb;
        if (color in COLORS) {
            rgb = COLORS[color];
            return {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
            };
        }
        else if (color[0] === HASH) {
            return this._hexToRgb(color.substring(1));
        }
        else if (color.substr(0, 4) === RGB_PAREN) {
            rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
            return {
                r: parseInt(rgb[1], 10),
                g: parseInt(rgb[2], 10),
                b: parseInt(rgb[3], 10),
            };
        }
        else {
            return {
                r: 0,
                g: 0,
                b: 0,
            };
        }
    },
    colorToRGBA(str) {
        str = str || 'black';
        return (Util._namedColorToRBA(str) ||
            Util._hex3ColorToRGBA(str) ||
            Util._hex6ColorToRGBA(str) ||
            Util._rgbColorToRGBA(str) ||
            Util._rgbaColorToRGBA(str) ||
            Util._hslColorToRGBA(str));
    },
    _namedColorToRBA(str) {
        var c = COLORS[str.toLowerCase()];
        if (!c) {
            return null;
        }
        return {
            r: c[0],
            g: c[1],
            b: c[2],
            a: 1,
        };
    },
    _rgbColorToRGBA(str) {
        if (str.indexOf('rgb(') === 0) {
            str = str.match(/rgb\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: 1,
            };
        }
    },
    _rgbaColorToRGBA(str) {
        if (str.indexOf('rgba(') === 0) {
            str = str.match(/rgba\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map((n, index) => {
                if (n.slice(-1) === '%') {
                    return index === 3 ? parseInt(n) / 100 : (parseInt(n) / 100) * 255;
                }
                return Number(n);
            });
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: parts[3],
            };
        }
    },
    _hex6ColorToRGBA(str) {
        if (str[0] === '#' && str.length === 7) {
            return {
                r: parseInt(str.slice(1, 3), 16),
                g: parseInt(str.slice(3, 5), 16),
                b: parseInt(str.slice(5, 7), 16),
                a: 1,
            };
        }
    },
    _hex3ColorToRGBA(str) {
        if (str[0] === '#' && str.length === 4) {
            return {
                r: parseInt(str[1] + str[1], 16),
                g: parseInt(str[2] + str[2], 16),
                b: parseInt(str[3] + str[3], 16),
                a: 1,
            };
        }
    },
    _hslColorToRGBA(str) {
        if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
            const [_, ...hsl] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str);
            const h = Number(hsl[0]) / 360;
            const s = Number(hsl[1]) / 100;
            const l = Number(hsl[2]) / 100;
            let t2;
            let t3;
            let val;
            if (s === 0) {
                val = l * 255;
                return {
                    r: Math.round(val),
                    g: Math.round(val),
                    b: Math.round(val),
                    a: 1,
                };
            }
            if (l < 0.5) {
                t2 = l * (1 + s);
            }
            else {
                t2 = l + s - l * s;
            }
            const t1 = 2 * l - t2;
            const rgb = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                t3 = h + (1 / 3) * -(i - 1);
                if (t3 < 0) {
                    t3++;
                }
                if (t3 > 1) {
                    t3--;
                }
                if (6 * t3 < 1) {
                    val = t1 + (t2 - t1) * 6 * t3;
                }
                else if (2 * t3 < 1) {
                    val = t2;
                }
                else if (3 * t3 < 2) {
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                }
                else {
                    val = t1;
                }
                rgb[i] = val * 255;
            }
            return {
                r: Math.round(rgb[0]),
                g: Math.round(rgb[1]),
                b: Math.round(rgb[2]),
                a: 1,
            };
        }
    },
    haveIntersection(r1, r2) {
        return !(r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y);
    },
    cloneObject(obj) {
        var retObj = {};
        for (var key in obj) {
            if (this._isPlainObject(obj[key])) {
                retObj[key] = this.cloneObject(obj[key]);
            }
            else if (this._isArray(obj[key])) {
                retObj[key] = this.cloneArray(obj[key]);
            }
            else {
                retObj[key] = obj[key];
            }
        }
        return retObj;
    },
    cloneArray(arr) {
        return arr.slice(0);
    },
    degToRad(deg) {
        return deg * PI_OVER_DEG180;
    },
    radToDeg(rad) {
        return rad * DEG180_OVER_PI;
    },
    _degToRad(deg) {
        Util.warn('Util._degToRad is removed. Please use public Util.degToRad instead.');
        return Util.degToRad(deg);
    },
    _radToDeg(rad) {
        Util.warn('Util._radToDeg is removed. Please use public Util.radToDeg instead.');
        return Util.radToDeg(rad);
    },
    _getRotation(radians) {
        return _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.angleDeg ? Util.radToDeg(radians) : radians;
    },
    _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    throw(str) {
        throw new Error(KONVA_ERROR + str);
    },
    error(str) {
        console.error(KONVA_ERROR + str);
    },
    warn(str) {
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.showWarnings) {
            return;
        }
        console.warn(KONVA_WARNING + str);
    },
    each(obj, func) {
        for (var key in obj) {
            func(key, obj[key]);
        }
    },
    _inRange(val, left, right) {
        return left <= val && val < right;
    },
    _getProjectionToSegment(x1, y1, x2, y2, x3, y3) {
        var x, y, dist;
        var pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        if (pd2 == 0) {
            x = x1;
            y = y1;
            dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
        }
        else {
            var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
            if (u < 0) {
                x = x1;
                y = y1;
                dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
            }
            else if (u > 1.0) {
                x = x2;
                y = y2;
                dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
            }
            else {
                x = x1 + u * (x2 - x1);
                y = y1 + u * (y2 - y1);
                dist = (x - x3) * (x - x3) + (y - y3) * (y - y3);
            }
        }
        return [x, y, dist];
    },
    _getProjectionToLine(pt, line, isClosed) {
        var pc = Util.cloneObject(pt);
        var dist = Number.MAX_VALUE;
        line.forEach(function (p1, i) {
            if (!isClosed && i === line.length - 1) {
                return;
            }
            var p2 = line[(i + 1) % line.length];
            var proj = Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
            var px = proj[0], py = proj[1], pdist = proj[2];
            if (pdist < dist) {
                pc.x = px;
                pc.y = py;
                dist = pdist;
            }
        });
        return pc;
    },
    _prepareArrayForTween(startArray, endArray, isClosed) {
        var n, start = [], end = [];
        if (startArray.length > endArray.length) {
            var temp = endArray;
            endArray = startArray;
            startArray = temp;
        }
        for (n = 0; n < startArray.length; n += 2) {
            start.push({
                x: startArray[n],
                y: startArray[n + 1],
            });
        }
        for (n = 0; n < endArray.length; n += 2) {
            end.push({
                x: endArray[n],
                y: endArray[n + 1],
            });
        }
        var newStart = [];
        end.forEach(function (point) {
            var pr = Util._getProjectionToLine(point, start, isClosed);
            newStart.push(pr.x);
            newStart.push(pr.y);
        });
        return newStart;
    },
    _prepareToStringify(obj) {
        var desc;
        obj.visitedByCircularReferenceRemoval = true;
        for (var key in obj) {
            if (!(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == 'object')) {
                continue;
            }
            desc = Object.getOwnPropertyDescriptor(obj, key);
            if (obj[key].visitedByCircularReferenceRemoval ||
                Util._isElement(obj[key])) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
            else if (Util._prepareToStringify(obj[key]) === null) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
        }
        delete obj.visitedByCircularReferenceRemoval;
        return obj;
    },
    _assign(target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    },
    _getFirstPointerId(evt) {
        if (!evt.touches) {
            return evt.pointerId || 999;
        }
        else {
            return evt.changedTouches[0].identifier;
        }
    },
};


/***/ }),

/***/ "../node_modules/konva/lib/Validators.js":
/*!***********************************************!*\
  !*** ../node_modules/konva/lib/Validators.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RGBComponent": () => (/* binding */ RGBComponent),
/* harmony export */   "alphaComponent": () => (/* binding */ alphaComponent),
/* harmony export */   "getNumberValidator": () => (/* binding */ getNumberValidator),
/* harmony export */   "getNumberOrArrayOfNumbersValidator": () => (/* binding */ getNumberOrArrayOfNumbersValidator),
/* harmony export */   "getNumberOrAutoValidator": () => (/* binding */ getNumberOrAutoValidator),
/* harmony export */   "getStringValidator": () => (/* binding */ getStringValidator),
/* harmony export */   "getStringOrGradientValidator": () => (/* binding */ getStringOrGradientValidator),
/* harmony export */   "getFunctionValidator": () => (/* binding */ getFunctionValidator),
/* harmony export */   "getNumberArrayValidator": () => (/* binding */ getNumberArrayValidator),
/* harmony export */   "getBooleanValidator": () => (/* binding */ getBooleanValidator),
/* harmony export */   "getComponentValidator": () => (/* binding */ getComponentValidator)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");


function _formatValue(val) {
    if (_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isString(val)) {
        return '"' + val + '"';
    }
    if (Object.prototype.toString.call(val) === '[object Number]') {
        return val;
    }
    if (_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isBoolean(val)) {
        return val;
    }
    return Object.prototype.toString.call(val);
}
function RGBComponent(val) {
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    return Math.round(val);
}
function alphaComponent(val) {
    if (val > 1) {
        return 1;
    }
    else if (val < 0.0001) {
        return 0.0001;
    }
    return val;
}
function getNumberValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isNumber(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number.');
            }
            return val;
        };
    }
}
function getNumberOrArrayOfNumbersValidator(noOfElements) {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            let isNumber = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isNumber(val);
            let isValidArray = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isArray(val) && val.length == noOfElements;
            if (!isNumber && !isValidArray) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number or Array<number>(' +
                    noOfElements +
                    ')');
            }
            return val;
        };
    }
}
function getNumberOrAutoValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            var isNumber = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isNumber(val);
            var isAuto = val === 'auto';
            if (!(isNumber || isAuto)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number or "auto".');
            }
            return val;
        };
    }
}
function getStringValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isString(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a string.');
            }
            return val;
        };
    }
}
function getStringOrGradientValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            const isString = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isString(val);
            const isGradient = Object.prototype.toString.call(val) === '[object CanvasGradient]' ||
                (val && val.addColorStop);
            if (!(isString || isGradient)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a string or a native gradient.');
            }
            return val;
        };
    }
}
function getFunctionValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isFunction(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a function.');
            }
            return val;
        };
    }
}
function getNumberArrayValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isArray(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a array of numbers.');
            }
            else {
                val.forEach(function (item) {
                    if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isNumber(item)) {
                        _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('"' +
                            attr +
                            '" attribute has non numeric element ' +
                            item +
                            '. Make sure that all elements are numbers.');
                    }
                });
            }
            return val;
        };
    }
}
function getBooleanValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            var isBool = val === true || val === false;
            if (!isBool) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a boolean.');
            }
            return val;
        };
    }
}
function getComponentValidator(components) {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.isObject(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be an object with properties ' +
                    components);
            }
            return val;
        };
    }
}


/***/ }),

/***/ "../node_modules/konva/lib/_CoreInternals.js":
/*!***************************************************!*\
  !*** ../node_modules/konva/lib/_CoreInternals.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Konva": () => (/* binding */ Konva),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "../node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Node.js */ "../node_modules/konva/lib/Node.js");
/* harmony import */ var _Container_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Container.js */ "../node_modules/konva/lib/Container.js");
/* harmony import */ var _Stage_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Stage.js */ "../node_modules/konva/lib/Stage.js");
/* harmony import */ var _Layer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Layer.js */ "../node_modules/konva/lib/Layer.js");
/* harmony import */ var _FastLayer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./FastLayer.js */ "../node_modules/konva/lib/FastLayer.js");
/* harmony import */ var _Group_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Group.js */ "../node_modules/konva/lib/Group.js");
/* harmony import */ var _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DragAndDrop.js */ "../node_modules/konva/lib/DragAndDrop.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Shape.js */ "../node_modules/konva/lib/Shape.js");
/* harmony import */ var _Animation_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Animation.js */ "../node_modules/konva/lib/Animation.js");
/* harmony import */ var _Tween_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Tween.js */ "../node_modules/konva/lib/Tween.js");
/* harmony import */ var _Context_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Context.js */ "../node_modules/konva/lib/Context.js");
/* harmony import */ var _Canvas_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Canvas.js */ "../node_modules/konva/lib/Canvas.js");














const Konva = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._assign(_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva, {
    Util: _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util,
    Transform: _Util_js__WEBPACK_IMPORTED_MODULE_1__.Transform,
    Node: _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node,
    Container: _Container_js__WEBPACK_IMPORTED_MODULE_3__.Container,
    Stage: _Stage_js__WEBPACK_IMPORTED_MODULE_4__.Stage,
    stages: _Stage_js__WEBPACK_IMPORTED_MODULE_4__.stages,
    Layer: _Layer_js__WEBPACK_IMPORTED_MODULE_5__.Layer,
    FastLayer: _FastLayer_js__WEBPACK_IMPORTED_MODULE_6__.FastLayer,
    Group: _Group_js__WEBPACK_IMPORTED_MODULE_7__.Group,
    DD: _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_8__.DD,
    Shape: _Shape_js__WEBPACK_IMPORTED_MODULE_9__.Shape,
    shapes: _Shape_js__WEBPACK_IMPORTED_MODULE_9__.shapes,
    Animation: _Animation_js__WEBPACK_IMPORTED_MODULE_10__.Animation,
    Tween: _Tween_js__WEBPACK_IMPORTED_MODULE_11__.Tween,
    Easings: _Tween_js__WEBPACK_IMPORTED_MODULE_11__.Easings,
    Context: _Context_js__WEBPACK_IMPORTED_MODULE_12__.Context,
    Canvas: _Canvas_js__WEBPACK_IMPORTED_MODULE_13__.Canvas,
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Konva);


/***/ }),

/***/ "../node_modules/konva/lib/shapes/Circle.js":
/*!**************************************************!*\
  !*** ../node_modules/konva/lib/shapes/Circle.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Circle": () => (/* binding */ Circle)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "../node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "../node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "../node_modules/konva/lib/Global.js");




class Circle extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        context.beginPath();
        context.arc(0, 0, this.attrs.radius || 0, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStrokeShape(this);
    }
    getWidth() {
        return this.radius() * 2;
    }
    getHeight() {
        return this.radius() * 2;
    }
    setWidth(width) {
        if (this.radius() !== width / 2) {
            this.radius(width / 2);
        }
    }
    setHeight(height) {
        if (this.radius() !== height / 2) {
            this.radius(height / 2);
        }
    }
}
Circle.prototype._centroid = true;
Circle.prototype.className = 'Circle';
Circle.prototype._attrsAffectingSize = ['radius'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(Circle);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Circle, 'radius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());


/***/ }),

/***/ "../node_modules/konva/lib/shapes/Image.js":
/*!*************************************************!*\
  !*** ../node_modules/konva/lib/shapes/Image.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Image": () => (/* binding */ Image)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Shape.js */ "../node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "../node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Global.js */ "../node_modules/konva/lib/Global.js");





class Image extends _Shape_js__WEBPACK_IMPORTED_MODULE_2__.Shape {
    constructor(attrs) {
        super(attrs);
        this.on('imageChange.konva', () => {
            this._setImageLoad();
        });
        this._setImageLoad();
    }
    _setImageLoad() {
        const image = this.image();
        if (image && image.complete) {
            return;
        }
        if (image && image.readyState === 4) {
            return;
        }
        if (image && image['addEventListener']) {
            image['addEventListener']('load', () => {
                this._requestDraw();
            });
        }
    }
    _useBufferCanvas() {
        return super._useBufferCanvas(true);
    }
    _sceneFunc(context) {
        const width = this.getWidth();
        const height = this.getHeight();
        const image = this.attrs.image;
        let params;
        if (image) {
            const cropWidth = this.attrs.cropWidth;
            const cropHeight = this.attrs.cropHeight;
            if (cropWidth && cropHeight) {
                params = [
                    image,
                    this.cropX(),
                    this.cropY(),
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    width,
                    height,
                ];
            }
            else {
                params = [image, 0, 0, width, height];
            }
        }
        if (this.hasFill() || this.hasStroke()) {
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        }
        if (image) {
            context.drawImage.apply(context, params);
        }
    }
    _hitFunc(context) {
        var width = this.width(), height = this.height();
        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        context.fillStrokeShape(this);
    }
    getWidth() {
        var _a, _b;
        return (_a = this.attrs.width) !== null && _a !== void 0 ? _a : (_b = this.image()) === null || _b === void 0 ? void 0 : _b.width;
    }
    getHeight() {
        var _a, _b;
        return (_a = this.attrs.height) !== null && _a !== void 0 ? _a : (_b = this.image()) === null || _b === void 0 ? void 0 : _b.height;
    }
    static fromURL(url, callback, onError = null) {
        var img = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.createImageElement();
        img.onload = function () {
            var image = new Image({
                image: img,
            });
            callback(image);
        };
        img.onerror = onError;
        img.crossOrigin = 'Anonymous';
        img.src = url;
    }
}
Image.prototype.className = 'Image';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_4__._registerNode)(Image);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'image');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addComponentsGetterSetter(Image, 'crop', ['x', 'y', 'width', 'height']);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'cropX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'cropY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'cropWidth', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'cropHeight', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());


/***/ }),

/***/ "../node_modules/konva/lib/shapes/Rect.js":
/*!************************************************!*\
  !*** ../node_modules/konva/lib/shapes/Rect.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rect": () => (/* binding */ Rect)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "../node_modules/konva/lib/Shape.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "../node_modules/konva/lib/Global.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "../node_modules/konva/lib/Validators.js");




class Rect extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        var cornerRadius = this.cornerRadius(), width = this.width(), height = this.height();
        context.beginPath();
        if (!cornerRadius) {
            context.rect(0, 0, width, height);
        }
        else {
            let topLeft = 0;
            let topRight = 0;
            let bottomLeft = 0;
            let bottomRight = 0;
            if (typeof cornerRadius === 'number') {
                topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
            }
            else {
                topLeft = Math.min(cornerRadius[0] || 0, width / 2, height / 2);
                topRight = Math.min(cornerRadius[1] || 0, width / 2, height / 2);
                bottomRight = Math.min(cornerRadius[2] || 0, width / 2, height / 2);
                bottomLeft = Math.min(cornerRadius[3] || 0, width / 2, height / 2);
            }
            context.moveTo(topLeft, 0);
            context.lineTo(width - topRight, 0);
            context.arc(width - topRight, topRight, topRight, (Math.PI * 3) / 2, 0, false);
            context.lineTo(width, height - bottomRight);
            context.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2, false);
            context.lineTo(bottomLeft, height);
            context.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
            context.lineTo(0, topLeft);
            context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
        }
        context.closePath();
        context.fillStrokeShape(this);
    }
}
Rect.prototype.className = 'Rect';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_2__._registerNode)(Rect);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Rect, 'cornerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberOrArrayOfNumbersValidator)(4));


/***/ }),

/***/ "../node_modules/konva/lib/shapes/Text.js":
/*!************************************************!*\
  !*** ../node_modules/konva/lib/shapes/Text.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "stringToArray": () => (/* binding */ stringToArray),
/* harmony export */   "Text": () => (/* binding */ Text)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Util.js */ "../node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Factory.js */ "../node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Shape.js */ "../node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "../node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Global.js */ "../node_modules/konva/lib/Global.js");





function stringToArray(string) {
    return Array.from(string);
}
var AUTO = 'auto', CENTER = 'center', JUSTIFY = 'justify', CHANGE_KONVA = 'Change.konva', CONTEXT_2D = '2d', DASH = '-', LEFT = 'left', TEXT = 'text', TEXT_UPPER = 'Text', TOP = 'top', BOTTOM = 'bottom', MIDDLE = 'middle', NORMAL = 'normal', PX_SPACE = 'px ', SPACE = ' ', RIGHT = 'right', WORD = 'word', CHAR = 'char', NONE = 'none', ELLIPSIS = '…', ATTR_CHANGE_LIST = [
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontVariant',
    'padding',
    'align',
    'verticalAlign',
    'lineHeight',
    'text',
    'width',
    'height',
    'wrap',
    'ellipsis',
    'letterSpacing',
], attrChangeListLen = ATTR_CHANGE_LIST.length;
function normalizeFontFamily(fontFamily) {
    return fontFamily
        .split(',')
        .map((family) => {
        family = family.trim();
        const hasSpace = family.indexOf(' ') >= 0;
        const hasQuotes = family.indexOf('"') >= 0 || family.indexOf("'") >= 0;
        if (hasSpace && !hasQuotes) {
            family = `"${family}"`;
        }
        return family;
    })
        .join(', ');
}
var dummyContext;
function getDummyContext() {
    if (dummyContext) {
        return dummyContext;
    }
    dummyContext = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.createCanvasElement().getContext(CONTEXT_2D);
    return dummyContext;
}
function _fillFunc(context) {
    context.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function _strokeFunc(context) {
    context.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function checkDefaultFill(config) {
    config = config || {};
    if (!config.fillLinearGradientColorStops &&
        !config.fillRadialGradientColorStops &&
        !config.fillPatternImage) {
        config.fill = config.fill || 'black';
    }
    return config;
}
class Text extends _Shape_js__WEBPACK_IMPORTED_MODULE_2__.Shape {
    constructor(config) {
        super(checkDefaultFill(config));
        this._partialTextX = 0;
        this._partialTextY = 0;
        for (var n = 0; n < attrChangeListLen; n++) {
            this.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, this._setTextData);
        }
        this._setTextData();
    }
    _sceneFunc(context) {
        var textArr = this.textArr, textArrLen = textArr.length;
        if (!this.text()) {
            return;
        }
        var padding = this.padding(), fontSize = this.fontSize(), lineHeightPx = this.lineHeight() * fontSize, verticalAlign = this.verticalAlign(), alignY = 0, align = this.align(), totalWidth = this.getWidth(), letterSpacing = this.letterSpacing(), fill = this.fill(), textDecoration = this.textDecoration(), shouldUnderline = textDecoration.indexOf('underline') !== -1, shouldLineThrough = textDecoration.indexOf('line-through') !== -1, n;
        var translateY = 0;
        var translateY = lineHeightPx / 2;
        var lineTranslateX = 0;
        var lineTranslateY = 0;
        context.setAttr('font', this._getContextFont());
        context.setAttr('textBaseline', MIDDLE);
        context.setAttr('textAlign', LEFT);
        if (verticalAlign === MIDDLE) {
            alignY = (this.getHeight() - textArrLen * lineHeightPx - padding * 2) / 2;
        }
        else if (verticalAlign === BOTTOM) {
            alignY = this.getHeight() - textArrLen * lineHeightPx - padding * 2;
        }
        context.translate(padding, alignY + padding);
        for (n = 0; n < textArrLen; n++) {
            var lineTranslateX = 0;
            var lineTranslateY = 0;
            var obj = textArr[n], text = obj.text, width = obj.width, lastLine = n !== textArrLen - 1, spacesNumber, oneWord, lineWidth;
            context.save();
            if (align === RIGHT) {
                lineTranslateX += totalWidth - width - padding * 2;
            }
            else if (align === CENTER) {
                lineTranslateX += (totalWidth - width - padding * 2) / 2;
            }
            if (shouldUnderline) {
                context.save();
                context.beginPath();
                context.moveTo(lineTranslateX, translateY + lineTranslateY + Math.round(fontSize / 2));
                spacesNumber = text.split(' ').length - 1;
                oneWord = spacesNumber === 0;
                lineWidth =
                    align === JUSTIFY && lastLine && !oneWord
                        ? totalWidth - padding * 2
                        : width;
                context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY + Math.round(fontSize / 2));
                context.lineWidth = fontSize / 15;
                context.strokeStyle = fill;
                context.stroke();
                context.restore();
            }
            if (shouldLineThrough) {
                context.save();
                context.beginPath();
                context.moveTo(lineTranslateX, translateY + lineTranslateY);
                spacesNumber = text.split(' ').length - 1;
                oneWord = spacesNumber === 0;
                lineWidth =
                    align === JUSTIFY && lastLine && !oneWord
                        ? totalWidth - padding * 2
                        : width;
                context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY);
                context.lineWidth = fontSize / 15;
                context.strokeStyle = fill;
                context.stroke();
                context.restore();
            }
            if (letterSpacing !== 0 || align === JUSTIFY) {
                spacesNumber = text.split(' ').length - 1;
                var array = stringToArray(text);
                for (var li = 0; li < array.length; li++) {
                    var letter = array[li];
                    if (letter === ' ' && n !== textArrLen - 1 && align === JUSTIFY) {
                        lineTranslateX += (totalWidth - padding * 2 - width) / spacesNumber;
                    }
                    this._partialTextX = lineTranslateX;
                    this._partialTextY = translateY + lineTranslateY;
                    this._partialText = letter;
                    context.fillStrokeShape(this);
                    lineTranslateX += this.measureSize(letter).width + letterSpacing;
                }
            }
            else {
                this._partialTextX = lineTranslateX;
                this._partialTextY = translateY + lineTranslateY;
                this._partialText = text;
                context.fillStrokeShape(this);
            }
            context.restore();
            if (textArrLen > 1) {
                translateY += lineHeightPx;
            }
        }
    }
    _hitFunc(context) {
        var width = this.getWidth(), height = this.getHeight();
        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        context.fillStrokeShape(this);
    }
    setText(text) {
        var str = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isString(text)
            ? text
            : text === null || text === undefined
                ? ''
                : text + '';
        this._setAttr(TEXT, str);
        return this;
    }
    getWidth() {
        var isAuto = this.attrs.width === AUTO || this.attrs.width === undefined;
        return isAuto ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
    }
    getHeight() {
        var isAuto = this.attrs.height === AUTO || this.attrs.height === undefined;
        return isAuto
            ? this.fontSize() * this.textArr.length * this.lineHeight() +
                this.padding() * 2
            : this.attrs.height;
    }
    getTextWidth() {
        return this.textWidth;
    }
    getTextHeight() {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
        return this.textHeight;
    }
    measureSize(text) {
        var _context = getDummyContext(), fontSize = this.fontSize(), metrics;
        _context.save();
        _context.font = this._getContextFont();
        metrics = _context.measureText(text);
        _context.restore();
        return {
            width: metrics.width,
            height: fontSize,
        };
    }
    _getContextFont() {
        return (this.fontStyle() +
            SPACE +
            this.fontVariant() +
            SPACE +
            (this.fontSize() + PX_SPACE) +
            normalizeFontFamily(this.fontFamily()));
    }
    _addTextLine(line) {
        if (this.align() === JUSTIFY) {
            line = line.trim();
        }
        var width = this._getTextWidth(line);
        return this.textArr.push({ text: line, width: width });
    }
    _getTextWidth(text) {
        var letterSpacing = this.letterSpacing();
        var length = text.length;
        return (getDummyContext().measureText(text).width +
            (length ? letterSpacing * (length - 1) : 0));
    }
    _setTextData() {
        var lines = this.text().split('\n'), fontSize = +this.fontSize(), textWidth = 0, lineHeightPx = this.lineHeight() * fontSize, width = this.attrs.width, height = this.attrs.height, fixedWidth = width !== AUTO && width !== undefined, fixedHeight = height !== AUTO && height !== undefined, padding = this.padding(), maxWidth = width - padding * 2, maxHeightPx = height - padding * 2, currentHeightPx = 0, wrap = this.wrap(), shouldWrap = wrap !== NONE, wrapAtWord = wrap !== CHAR && shouldWrap, shouldAddEllipsis = this.ellipsis();
        this.textArr = [];
        getDummyContext().font = this._getContextFont();
        var additionalWidth = shouldAddEllipsis ? this._getTextWidth(ELLIPSIS) : 0;
        for (var i = 0, max = lines.length; i < max; ++i) {
            var line = lines[i];
            var lineWidth = this._getTextWidth(line);
            if (fixedWidth && lineWidth > maxWidth) {
                while (line.length > 0) {
                    var low = 0, high = line.length, match = '', matchWidth = 0;
                    while (low < high) {
                        var mid = (low + high) >>> 1, substr = line.slice(0, mid + 1), substrWidth = this._getTextWidth(substr) + additionalWidth;
                        if (substrWidth <= maxWidth) {
                            low = mid + 1;
                            match = substr;
                            matchWidth = substrWidth;
                        }
                        else {
                            high = mid;
                        }
                    }
                    if (match) {
                        if (wrapAtWord) {
                            var wrapIndex;
                            var nextChar = line[match.length];
                            var nextIsSpaceOrDash = nextChar === SPACE || nextChar === DASH;
                            if (nextIsSpaceOrDash && matchWidth <= maxWidth) {
                                wrapIndex = match.length;
                            }
                            else {
                                wrapIndex =
                                    Math.max(match.lastIndexOf(SPACE), match.lastIndexOf(DASH)) +
                                        1;
                            }
                            if (wrapIndex > 0) {
                                low = wrapIndex;
                                match = match.slice(0, low);
                                matchWidth = this._getTextWidth(match);
                            }
                        }
                        match = match.trimRight();
                        this._addTextLine(match);
                        textWidth = Math.max(textWidth, matchWidth);
                        currentHeightPx += lineHeightPx;
                        if (!shouldWrap ||
                            (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)) {
                            var lastLine = this.textArr[this.textArr.length - 1];
                            if (lastLine) {
                                if (shouldAddEllipsis) {
                                    var haveSpace = this._getTextWidth(lastLine.text + ELLIPSIS) < maxWidth;
                                    if (!haveSpace) {
                                        lastLine.text = lastLine.text.slice(0, lastLine.text.length - 3);
                                    }
                                    this.textArr.splice(this.textArr.length - 1, 1);
                                    this._addTextLine(lastLine.text + ELLIPSIS);
                                }
                            }
                            break;
                        }
                        line = line.slice(low);
                        line = line.trimLeft();
                        if (line.length > 0) {
                            lineWidth = this._getTextWidth(line);
                            if (lineWidth <= maxWidth) {
                                this._addTextLine(line);
                                currentHeightPx += lineHeightPx;
                                textWidth = Math.max(textWidth, lineWidth);
                                break;
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            else {
                this._addTextLine(line);
                currentHeightPx += lineHeightPx;
                textWidth = Math.max(textWidth, lineWidth);
            }
            if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                break;
            }
        }
        this.textHeight = fontSize;
        this.textWidth = textWidth;
    }
    getStrokeScaleEnabled() {
        return true;
    }
}
Text.prototype._fillFunc = _fillFunc;
Text.prototype._strokeFunc = _strokeFunc;
Text.prototype.className = TEXT_UPPER;
Text.prototype._attrsAffectingSize = [
    'text',
    'fontSize',
    'padding',
    'wrap',
    'lineHeight',
    'letterSpacing',
];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_4__._registerNode)(Text);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.overWriteSetter(Text, 'width', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberOrAutoValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.overWriteSetter(Text, 'height', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberOrAutoValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'fontFamily', 'Arial');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'fontSize', 12, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'fontStyle', NORMAL);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'fontVariant', NORMAL);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'padding', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'align', LEFT);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'verticalAlign', TOP);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'lineHeight', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'wrap', WORD);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'ellipsis', false, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'letterSpacing', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'text', '', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getStringValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'textDecoration', '');


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************!*\
  !*** ./tmplNumbersByPictures_fixed.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.css */ "./main.css");
/* harmony import */ var _libs_baseInits__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./libs/baseInits */ "./libs/baseInits.js");
/* harmony import */ var _libs_numbersByPictures__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./libs/numbersByPictures */ "./libs/numbersByPictures.js");





const base = new _libs_baseInits__WEBPACK_IMPORTED_MODULE_1__.baseInits( { container: 'container' } );

const x = 15;
const io = new _libs_numbersByPictures__WEBPACK_IMPORTED_MODULE_2__.numbersByPictures ( base, {
////////////////////////////
////////////////////////////////////////////////////////
/////////
	x: x, y: (base.height-60)/2, width: base.width-x,
//////////
	pics: {
		width: 60,
	},
	data: [

///////////////////////////////////////
/////////////////////////////////////// different data definitions
///////////////////////////////////////

///////////////////////////////////
////////////
/////////////////////////////////////
///////////
///////////
///////////
///////////
///////////
////////////
/////////////////////////////////////
///////////
///////////
///////////
//////////////////
//////////////////////////////////////////
///////////
///////////
///////////////////////////////////////////
///////////
///////////
///////////
///////////
//////////////////////////////////////////
///////////
///////////
/////////////////
///////////////////////////////////////////
///////////
///////////
///////////
/////////////////
//////////////////////////////////////////
///////////
///////////
///////////
/////////////////
///////////////////////////////////////////
		{ r: 1 },
		{ r: 1 },
		{ r: 1 },
		{ b: 6, d: 2 },
//////////////////////////////////////////
///////////
///////////
///////////
/////////////////
///////////////////////////////////////////
///////////
/////////////////
//////////

///////////////////////////////////////
/////////////////////////////////////// end of data definitions
///////////////////////////////////////

],
	readonly: 1,
})

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);


})();

/******/ })()
;
//# sourceMappingURL=msk_n1_b_1b_3_right.readable.js.map