/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./img/fract.svg":
/*!***********************!*\
  !*** ./img/fract.svg ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "fract.svg");

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
			this.fsm.triggerEvent( 'ev_InputValidation_' + 'msk_s5_b_2a_1'.replace("msk_","") );
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

/***/ "./libs/textareaInserts.js":
/*!*********************************!*\
  !*** ./libs/textareaInserts.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "textareaInserts": () => (/* binding */ textareaInserts),
/* harmony export */   "toolbarMathOperators": () => (/* binding */ toolbarMathOperators),
/* harmony export */   "toolbarFraction": () => (/* binding */ toolbarFraction),
/* harmony export */   "toolbarMathOperatorsFraction": () => (/* binding */ toolbarMathOperatorsFraction),
/* harmony export */   "toolbarMathOperatorsFractionComparison": () => (/* binding */ toolbarMathOperatorsFractionComparison),
/* harmony export */   "toolbarMathOperatorsFractionPercent": () => (/* binding */ toolbarMathOperatorsFractionPercent)
/* harmony export */ });
/* harmony import */ var _textareaInserts_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./textareaInserts.css */ "./libs/textareaInserts.css");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common */ "./libs/common.js");
/* harmony import */ var _img_fract_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../img/fract.svg */ "./img/fract.svg");




class textareaInserts {

	constructor ( divSelector, opts = {}, base = null ) {

		const defaults = {
			outerDivStyles: {	// styles of created outer div (containing textarea and toolbar)
			},
			divStyles: {	// styles of "textarea"-div
				// width: '300px',
				// height: '200px',
			},

			// toolbarX, toolbarY   // position relative to div (top,left)
			toolbar: [
				// { display: (html), (insert: (html),)
				// 		(tooltip: '',) ,	// showed tooltip
				// 		(dontInsertRecursive: true|false),	// can element be inserted inside other elements?
				//		(noExtraSpaces: true|false),	// dont insert spaces before and after element
				//		(extractReplace: { from: /regexp/, to: "text" } ),	// Replace done by extract()
				// }
			],
			toolbarDirection: 'column',
			// toolbarHide: true,	// toolbar hidden when no focus

			toolbarContainerStyles: {
				// left: '300px', 	// position relative to outerDiv, defaults to width of divStyle
				// top: '200px',
			},
			toolbarCellStyles: {
			},
			toolbarCellSpanStyles: {	// spans within toolbar-cells (for vertical centering)
			},

			multiLine: true,
			stripTags: false,	// true: only allow text-node, delete all HTML-tags (fireofx inserts <br> sometimes)
			inputRegexp: null,	// regexp evaluated against div.innerHTML
			maxlength: null,	// max numbers characters

			// Replaces done by this.extract()
			// (e.g. toolbar.extractReplace are inserted here)
			extractReplaces: [
				// { from: /regexp/, to: "replace" },
				{ from: /([^*])\*([^*])/g, to: "$1\u22c5$2" },	// replace '*' to \u22c5
				{ from: /\u2022|\u25cf/g, to: "\u22c5" },	// replace • and ● to \u22c5
			]
		}
		;(0,_common__WEBPACK_IMPORTED_MODULE_1__.mergeDeep)( Object.assign( this, defaults ), opts );
		// base is only used for sendChangeState() and postLog()
		this.base = base;

		const setStyles = ( el, styles ) => {
			for ( const st in styles ) {
				el.style[st] = styles[st];
			}
		}

		// move div in a div.textareaInserts (->this.outerDiv)
		this.outerDiv = document.createElement('DIV');
		this.outerDiv.classList.add( 'textareaInserts' );
		setStyles( this.outerDiv, this.outerDivStyles );

		this.div = document.querySelector( divSelector );
		this.div.parentNode.replaceChild( this.outerDiv, this.div );
		setStyles( this.div, this.divStyles );
		this.div.setAttribute( 'contenteditable', 'true' );

		this.div.addEventListener( 'keydown', this.ev_keydown.bind(this) );
		this.div.addEventListener( 'input', this.ev_input.bind(this) );
		// this.div.addEventListener( 'touchend', this.ev_touchend.bind(this) );
		// ['click','touchstart','change','input','keypress','keyup'].forEach( e => {
		//	this.div.addEventListener( e, this.checkNodes.bind(this) );
		// })

		if ( !this.div.textContent.length && this.multiLine ) {
			this.div.textContent = "\n";
			// this.div.appendChild( document.createElement('div') );
		}
		this.outerDiv.appendChild( this.div );

		// create toolbar container
		this.toolbarContainer = document.createElement('DIV');
		this.toolbarContainer.classList.add( 'toolbar', this.toolbarDirection, 'disabled' );
		if ( !this.toolbarContainerStyles.left ) {
			this.toolbarContainerStyles.left = this.divStyles.width
		}
		if ( !this.toolbarContainerStyles.top ) {
			this.toolbarContainerStyles.top = "0px";
		}
		setStyles( this.toolbarContainer, this.toolbarContainerStyles );
		// this.toolbarContainer.setAttribute( 'contenteditable', 'false' );

		// create toolbarCells
		this.toolbar.forEach( ( tb, nr ) => {
			// FLOWing div
			const toolbarCell = document.createElement('DIV');
			setStyles( toolbarCell, this.toolbarCellStyles );
			[ 'mousedown', 'touchstart' ].forEach( ev =>
				toolbarCell.addEventListener( ev, function (event) {
					if ( document.activeElement && !this.toolbarContainer.classList.contains('disabled') && this.div.contains( document.activeElement ) ) {
						this.insert( nr, event );
					}
				}.bind(this) ) );
			//  toolbarCell.setAttribute( 'contenteditable', 'false' );

			// span in div for vertical aligning
			const innerSpan = document.createElement('SPAN');
			setStyles( innerSpan, this.toolbarCellSpanStyles );
			toolbarCell.appendChild( innerSpan );

			innerSpan.innerHTML = tb.display;
			this.toolbarContainer.appendChild( toolbarCell );

			// copy extractReplace
			if ( tb.extractReplace && tb.extractReplace.from && tb.extractReplace.to ) {
				this.extractReplaces.push( tb.extractReplace );
			}
		});

		// Handle toolbarContainer visibility
		// if ( this.toolbarHide ) {
		// 	this.toolbarContainer.style.visibility = this.div.activeElement ? 'visible' : 'hidden';

		// 	this.div.addEventListener( 'focus', () => this.toolbarContainer.style.visibility = 'visible' );
		// 	this.div.addEventListener( 'blur', (ev) => console.log(ev) );
		// }
		this.outerDiv.appendChild( this.toolbarContainer );
		this.div.addEventListener( 'focus',
				() => this.toolbarContainer.classList.remove('disabled'),
				{ capture: true } );
		this.div.addEventListener( 'blur',
				() => this.toolbarContainer.classList.add('disabled'),
				{ capture: true } );
		this.div.addEventListener( 'paste', (ev) => ev.preventDefault() );

		if ( this.inputRegexp ) {
			this.inputRE = new RegExp( this.inputRegexp );
			this.saveValue();
		}

		this.oldValue = "";
		this.oldFocusElemIndex = null;

		// Save initData & init StateVars
		this.initData = this.div.innerHTML.trim();
		this.base.sendChangeState( this );	// init & send changeState & score
	}

	///////////////////////////////////

	insert ( nr, event ) {

		if ( this.toolbar[nr].dontInsertRecursive ) {
			// search parent ".inserted" (-> inside another inserted element)
			const sel = window.getSelection();
			if ( sel && sel.focusNode ) {
				let pnode = sel.focusNode;
				while ( pnode && ( !pnode.classList || !pnode.classList.contains('textareaInserts') && !pnode.classList.contains('inserted') ) ) {
					pnode = pnode.parentNode;
				}
				if ( pnode.classList && pnode.classList.contains('inserted') ) {
					return;
				}
			}
		}

		if ( this.pasteHtmlAtCaret( this.toolbar[nr].insert || this.toolbar[nr].display, !this.toolbar[nr].noExtraSpaces, this.toolbar[nr].logName ) ) {
			this.ev_input();	// check regexp etc.
			event.preventDefault();
			event.stopPropagation();
		}

		if ( this.base ) {
			this.base.sendChangeState( this );
		}
	}

	ev_keydown (event) {
// console.log(event);

		let rescore = 0;

		// log?
		if ( this.base ) {
			const data = {
				which: event.which || event.keyCode,
				// extract: this.extract(),	// old, unchanged value
			};
			[ 'key', 'code', 'shiftKey', 'altKey', 'ctrlKey', 'metaKey', 'isComposing', 'repeat' ].forEach( k => {
				if ( event[k] ) {
					data[k] = event[k];
				}
			})

// !!!!! DONT LOG ON CHROME/ANDROID !!!!!
// !!!!! DONT LOG ON CHROME/ANDROID !!!!!
// !!!!! DONT LOG ON CHROME/ANDROID !!!!!
			this.base.postLog( 'keyDown', Object.assign( data, this.getTextPos() ) );
		}

		// On ENTER insert <br>, prevent inserting <divs>
		if ( event.key==="Enter" || event.which==13 || event.keyCode==13 ) {
			if ( !this.tabToNextInputField(event) ) {
			// 	if ( !this.multiLine ) {
			// 		event.preventDefault();
			// 		event.stopPropagation();
			// 	}
			// }
				if ( !this.multiLine || this.pasteHtmlAtCaret("\n") ) {

					// // Chrome: If Enter was hit behind last character,
					// // an <div><br><div> is inserted
					// // HotFix: delete last <div>
					// const sel = window.getSelection();
					// if ( sel && sel.isCollapsed && sel.focusNode &&
					// 		sel.focusNode==this.div && sel.focusOffset==this.div.childNodes.length ) {

					// 	let lastNode = this.div.childNodes[ this.div.childNodes.length-1 ];
					// 	if ( lastNode.tagName=='DIV' && !lastNode.classList.contains('inserted') ) {
					// 		lastNode.remove();
					// 	}
					// }

					event.preventDefault();
					event.stopPropagation();
				}
			}
			rescore = 1;

		// On TAB insert tab
		} else if ( event.key==="Tab" || event.which==9 || event.keyCode==9 ) {
			if ( !this.tabToNextInputField(event) ) {
				if ( this.pasteHtmlAtCaret('&#09;') ) {
					event.preventDefault();
					event.stopPropagation();
				}
			}
			rescore = 1;

		// Backspace: Delete div before cursor?
		} else if ( event.key==="Backspace" || event.which==8 || event.keyCode==8 ) {
			// should div be deleted
			if ( !this.delIfDiv( -1, event ) ) {
				// // Is cursor in/after last text node ' ' (don't delete, just repos cursor)
				// const sel = window.getSelection();
				// if ( sel && sel.isCollapsed && sel.focusNode ) {
				// 	const nodes = this.div.childNodes;
				// 	if ( nodes[nodes.length-1].textContent==' ' &&
				// 			( sel.focusNode==this.div && sel.focusOffset>=this.div.childNodes.length ||	// Cursor behind last node
				// 			sel.focusNode==nodes[nodes.length-1] && sel.focusOffset==1 ) ) {	// cursor after space in last textnode

				// 		// move cursor before space in last text node
				// 		const range = sel.getRangeAt(0).cloneRange();
				// 		range.setStart( nodes[nodes.length-1], 0 );
				// 		range.collapse(true);
				// 		sel.removeAllRanges();
				// 		sel.addRange(range);

				// 		event.preventDefault();
				// 		event.stopPropagation();
				// 	}
				// }
			}
			rescore = 1;

		// Delete: Delete div after cursor?
		} else if ( event.key==="Delete" || ( event.which || event.keyCode )==46 ) {
			this.delIfDiv( 1, event );
			rescore = 1;
		}

		if ( this.base && rescore>0 ) {
			this.base.sendChangeState( this );
		}
	}

	// chrome @ android does not send keyCodes on keydown events
	// therefore input event must be evaluated for 'deleteContentBackward' behind inserted elements
	ev_input (event) {

		let saveNewValue = false;

// console.log( window.getSelection() );
		const sel = window.getSelection();

		// was "inserted" node saved for deletion and was backspace processed?
		if ( event && event.inputType=='deleteContentBackward' && this.delPosElement ) {

// console.log(this.delPosText);
			// is cursor IN inserted element?
			let inserted = null, search = sel.focusNode;
			if ( this.delPosText ) {
				while ( !inserted && search && ( !search.classList || !search.classList.contains('textareaInserts') ) ) {
// console.log(search);
					if ( search.classList && search.classList.contains('inserted') ) {
						inserted = search;
					}
					search = search.parentNode;
				}
			}
			if ( inserted )  {
// console.log(this.delPosText,this.delPosElement)
				// pos cursor
				if ( sel.getRangeAt && sel.rangeCount ) {
					const range = sel.getRangeAt(0).cloneRange();
					range.setStartBefore(inserted);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				}
				// replace inserted with text
				this.div.replaceChild( this.delPosText, this.delPosElement );
				this.div.normalize();
			} else {
				this.delPosElement.remove();
			}
			this.delPosElement = null;
			this.delPosText = null;

			saveNewValue = ( this.inputRE || !this.multiLine );

		} else {

			// cursor after deleteable, inserted element?
// console.log(sel,sel.focusNode.parentNode,this.div)
			if ( sel && sel.isCollapsed &&
					sel.focusNode.parentNode==this.div && sel.focusOffset===0 &&
					sel.focusNode.previousSibling && sel.focusNode.previousSibling.classList &&
					sel.focusNode.previousSibling.classList.contains('inserted' ) ) {
				this.delPosText = sel.focusNode.cloneNode(true);
				this.delPosElement = sel.focusNode.previousSibling;
			} else {
				this.delPosElement = null;
				this.delPosText = null;
			}
			// // If the last element is "inserted" and there is no text behind it, the element is not deletable
			// // because there is no "input" event on backspace
			// // possible fix: always have a "space" as last element
			// else if ( sel.focusNode==this.div && sel.focusOffset<=this.div.childNodes.length ) {
			// 	this.delPosText = null;
			// 	this.delPosElement = this.div.childNodes[ sel.focusOffset-1 ];
			// }

			// handle multiLine e.g. in android (no key-events, just input events!)
			if ( !this.multiLine ) {
				if ( this.div.textContent.match( /[\n\r]/ ) ) {
// console.log(this.div.textContent)
// console.log(this.div.textContent.match( /[\n\r]/ ))
					this.restoreValue();
				} else {
					saveNewValue = true;
				}
			} else {
				// HotFix for Chrome (Enter behind last character not always processed)
				// Always have a '\n' as last character
				const lastNode = this.div.childNodes.length>0 ? this.div.childNodes[ this.div.childNodes.length-1 ] : null;
				if ( lastNode && lastNode.nodeType==Node.TEXT_NODE && !lastNode.textContent.endsWith("\n") ) {
					const pos = ( sel && sel.focusNode==lastNode ? sel.focusOffset : null );
					lastNode.textContent = lastNode.textContent+"\n";
					if ( pos!==null ) {
						this.setCurPos( lastNode, pos );
					}
				}
			}

			// handel stripTags
			if ( this.stripTags ) {
				if ( this.div.innerHTML.match( /<[^>]*>/ ) ) {
					this.div.innerHTML = this.div.innerHTML.replace( /<[^>]*>/g, '' );
				}
			} else {
				// delete all div:not(.inserted)
				// THIS SHOULD NEVER HAPPEN, but it should be corrected
				let node = this.div.childNodes[0];
				while ( node ) {
					const el = node;
					node = node.nextSibling;
					if ( el.tagName=='DIV' && el.classList && !el.classList.contains('inserted') ) {
						// convert textcontent to textnode
						const text = el.textContent;
						if ( text.length ) {
							const tnode = document.createTextNode('');
							tnode.textContent = text;
							this.div.replaceChild( tnode, el );
							this.div.normalize();
						} else {
							el.remove();
						}
					}
				}
				// delete solely <br>
				if ( this.div.innerHTML.trim() === '<br>' ) {
					this.div.innerHTML = '';
					this.div.textContent = "\n";
				}
			}

			// handle inputRegexp
			if ( this.inputRE || this.maxlength ) {
// console.log(this.div.innerHTML);
// console.log(this.div.innerHTML.match( this.inputRE ));
				if ( 	( this.inputRE && !this.div.innerHTML.match( this.inputRE ) ) ||
						( this.maxlength && this.div.innerHTML.length>this.maxlength ) ) {
					this.restoreValue();
					if ( this.base ) {
						this.base.postLog( 'inputRevert', {
							toText: this.div.innerHTML,
							extract: this.extract(),
						} );
						this.base.triggerInputValidationEvent();
					}
				} else {
					saveNewValue = true;
				}
			}
		}

		if ( saveNewValue ) {
			this.saveValue();
		}
		if ( saveNewValue || !this.inputRE || this.multiLine ) {
			this.base.postLog( 'newValue', {
				extract: this.extract(),
			});
		}
		if ( this.base ) {
			this.base.sendChangeState( this );
		}
	}

	// // on touchables: last element should not be '.inserted' (append textnode with ' ')
	// ev_touchend () {

	// 	const sel = window.getSelection();
	// 	// Cursor at "end" of text
	// 	if ( sel && sel.isCollapsed && sel.focusNode==this.div ) {
	// 		const childn = this.div.childNodes;
	// 		// and last node == '.inserted'
	// 		if ( sel.focusOffset==childn.length && childn[childn.length-1].classList &&
	// 				childn[childn.length-1].classList.contains('inserted') ) {

	// 			const text = document.createTextNode(' ')
	// 			this.div.appendChild( text );
	// 			// set cursor to start of text ' '	!!!!! TODO !!!!!
	// 			// if ( sel.getRangeAt && sel.rangeCount ) {
	// 			// 	const range = sel.getRangeAt(0).cloneRange();
	// 			// const range = document.createRange();
	// 			// range.setStart( text, 0 );
	// 			// range.collapse(true);
	// 			// sel.removeAllRanges();
	// 			// sel.addRange(range);
	// 			// }
	// 		}
	// 	}
	// }

	// checkNodes () {

	// 	this.div.normalize();

	// 	// ensure last element is textnode (hotfix for positioning cursor after last .frac)
	// 	// const nodes = this.div.childNodes;
	// 	// if ( !nodes.length || nodes[nodes.length-1].nodeType!=Node.TEXT_NODE ) {
	// 	// 	this.div.appendChild( document.createTextNode(' ') );
	// 	// }
	// }

	///////////////////////////////////

	// https://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
	pasteHtmlAtCaret ( html, insertSpaces, logName ) {

		const sel = window.getSelection();
		// only insert if selection is within this.div
		if ( !sel || !sel.focusNode || !this.div.contains( sel.focusNode ) ) {
			return false;
		}

		if (sel.getRangeAt && sel.rangeCount) {
			let range = sel.getRangeAt(0);
			range.deleteContents();

			// Range.createContextualFragment() would be useful here but is
			// only relatively recently standardized and is not supported in
			// some browsers (IE9, for one)
			let ins;
			if ( insertSpaces ) {
				const preSpace = ( !sel.focusOffset || sel.focusNode.textContent[ sel.focusOffset-1 ]!=' ' ) ? ' ' : '';
				ins = `${preSpace}${html} `;
			} else {
				ins = html;
			}
			const el = document.createElement("div");
			el.innerHTML = ins;

			var frag = document.createDocumentFragment(), node, lastNode;
			while ( (node = el.firstChild) ) {
				if ( node.classList ) {
					node.classList.add('inserted');
				}
				lastNode = frag.appendChild(node);
			}
			const startCurPos = frag.querySelector('.startCursorPos');
			range.insertNode(frag);

			// Preserve the selection
			if (lastNode) {
				range = range.cloneRange();
				startCurPos ? range.setStart( startCurPos, 0 ) : range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}

			this.normalize();

			// log button
			if ( logName && this.base ) {
				const data = {
					text: ins,
					name: logName,
					extract: this.extract(),
				};
				this.base.postLog( 'insertButtonPressed', Object.assign( data, this.getTextPos() ) );
			}
		}

		return true;
	}

	delIfDiv ( offs, event ) {

		const sel = window.getSelection();
		if ( sel && sel.isCollapsed ) {
			const focus = sel.focusNode;
// console.log(sel,offs,focus==this.div,this.div.childNodes.length,this.div.childNodes);
			// delete previous/next node?
			if ( focus &&
					( offs>0 && sel.focusOffset==focus.textContent.length ||
					offs<0 && ( !sel.focusOffset ||	// Beginning of a Text or
								focus==this.div && sel.focusOffset<=this.div.childNodes.length ) ) ) { // node-level, focusOffset is node-index

				const toDelete = ( focus==this.div ?
									this.div.childNodes[ sel.focusOffset-1 ] :
									( offs<0 ? focus.previousSibling : focus.nextSibling ) );
// console.log(toDelete)
				// check if node is div.inserted
				if ( toDelete && toDelete.tagName=='DIV' && toDelete.classList.contains('inserted') ) {
					// set cursor before element (fix for safari)
					const range = sel.getRangeAt(0);
					if ( range ) {
						if ( toDelete.previousSibling ) {
							range.setStartAfter( toDelete.previousSibling );
						} else if ( toDelete.nextSibling ) {
							range.setStart( toDelete.nextSibling, 0 );
						}
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
					}
					// delete node
					toDelete.remove();
					this.div.normalize();

					event.preventDefault();
					event.stopPropagation();
					return true;
				}
			}
		}

		return false;
	}

	// is cursor within .inputfield? tab to nextSibling
	tabToNextInputField (event) {

		const sel = window.getSelection();
		if ( sel && sel.isCollapsed && sel.focusNode && sel.getRangeAt && sel.rangeCount ) {

			// in .inputfield?
			let node;
			for ( node=sel.focusNode; node && !node.classList; ) {
				node = node.parentNode;
			}
			if ( node && node.classList.contains('inputField') ) {

				// search next available sibling
				while ( node && !node.nextSibling && node!=this.div ) {
					node = node.parentNode;
				}
				if ( node && node!=this.div ) {
					node = node.nextSibling;

					// set cursor
					this.setCurPos( node, node.nodeType==Node.TEXT_NODE && node.textContent.startsWith(' ') ? 1 : 0 );

					event.preventDefault();
					event.stopPropagation();
					return true;
				}
			}
		}

		return false;
	}

	///////////////////////////////////

	saveValue () {
		this.oldValue = this.div.innerHTML;
		// save cursor position
		const sel = window.getSelection();
		if ( sel && sel.focusNode ) {
			const nodes = Array.from( this.div.childNodes );
			this.oldFocusElemIndex = nodes.findIndex( i => i===sel.focusNode );
			this.oldFocusOffset = sel.focusOffset;
		} else {
			this.oldFocusElemIndex = null;
		}
	}

	restoreValue () {
		if ( this.oldValue!==null ) {
			this.div.innerHTML = this.oldValue;
			// restore old cursor position
			const sel = window.getSelection();
			if ( sel ) {
				sel.removeAllRanges();
				if ( this.oldFocusElemIndex!==null && this.oldFocusElemIndex>-1 ) {
					this.setCurPos( this.div.childNodes[ this.oldFocusElemIndex ], this.oldFocusOffset );
				}
			}
		}
	}

	setCurPos ( node, offset ) {
		const sel = window.getSelection();
		if ( sel ) {
			const range = document.createRange();
			range.setStart( node, offset );
			range.collapse( true );

			sel.removeAllRanges();
			sel.addRange(range);
		}
	}

	// call this.div.normalize() and try to save/restore cursor position (safari puts cursor to end of text sometimes)
	normalize () {

		// try to save cursor position in textnode(s)
		let curPos = null, prevElmnt, parentElmnt;
		const sel = window.getSelection();
		if ( sel && sel.getRangeAt && sel.rangeCount ) {
			let focus = sel.focusNode;
			if ( focus && focus.nodeType==Node.TEXT_NODE &&
					( ( focus.previousSibling && focus.previousSibling.nodeType==Node.TEXT_NODE ) ||
						( focus.nextSibling && focus.nextSibling.nodeType==Node.TEXT_NODE ) ) ) {

				curPos = sel.focusOffset;
				parentElmnt = focus.parentElement;
				// Add length of all previous text elements to position
				while ( focus.previousSibling && focus.previousSibling.nodeType==Node.TEXT_NODE ) {
					focus = focus.previousSibling;
					curPos += focus.textContent.length;
				}
				prevElmnt = focus.previousSibling;
			}
		}

		this.div.normalize();

		// restore position in (concatenated) text
		if ( curPos!==null ) {
			const newElem = prevElmnt ? prevElmnt.nextSibling : parentElmnt.firstChild;
			const newRange = document.createRange();
			newRange.setStart( newElem, curPos );
			newRange.collapse( true );
			sel.removeAllRanges();
			sel.addRange(newRange);
		}
	}

	// Get Position (in this.div.textContent) and special classes set in focusnode
	getTextPos (sel=null) {
		if ( sel===null ) {
			sel = window.getSelection();
		}
		if ( sel && sel.focusNode ) {
			let pos = sel.focusOffset;
			let node = sel.focusNode;
			// add lengths of textContents of all pevious Elements
			while ( ( node = node.previousSibling || node.parentNode ) && node != this.div && node ) {
				if ( node.textContent ) {
					pos += node.textContent.length;
				}
			}
			const data = { textPos: pos, };
			// check for frac classes
			node = sel.focusNode;
			while ( node && node != this.div && !node.classList ) {
				node = node.parentNode;
			}
			if ( node.classList && node.classList.contains('frac') ) {
				if ( node.classList.contains('top') ) data.class="frac top";
				if ( node.classList.contains('bottom') ) data.class="frac bottom";
			};
			return data;
		}

		return {};
	}

	extract () {
		let s = this.div.innerHTML;

		this.extractReplaces.forEach( r => {
			s = s.replace( r.from, r.to );
		})

		return s.trim();
	}

	///////////////////////////////////

	getState () {
		return JSON.stringify( this.div.innerHTML );
	}

	setState (state) {

		try {

			this.div.innerHTML = JSON.parse( state );

		} catch (e) {
			console.error(e);
		}

		(0,_common__WEBPACK_IMPORTED_MODULE_1__.setStatePostProc)(this);
	}

	getDefaultChangeState () {
		return this.div.innerHTML.trim() !== this.initData;
	}

	scoreDef () {
		return this.scoreVariableName || this.FSMVariableName ?
			{
				[ this.scoreVariableName || `V_Input_${this.FSMVariableName}` ]: this.extract(),
			} :
			{};
	}
}

//////////////////////////////////////////////////////////////////////////////

// export some default toolbars

const toolbarMathOperators = [
	{ display: "&plus;", logName: "plus", },		// + \u002b
	{ display: "&minus;", logName: "minus", },		// - \u2212
	// { display: "&centerdot;", },	// *
	{ display: "&sdot;", logName: "dot", },			// * \u22c5
	{ display: "&ratio;", logName: "ratio", },		// / \u2236
	{ display: "&equals;", logName: "equals", },	// = \u003d

];

const frac_html = '<div contenteditable="false" class="frac">'+
	'<span contenteditable="true" class="frac top startCursorPos inputField"></span>'+
	'<span contenteditable="true" class="frac bottom inputField"></span>'+
'</div>';


const frac_html_toolbar = `<div class="frac"><img src="${_img_fract_svg__WEBPACK_IMPORTED_MODULE_2__["default"]}"></div>`;


const toolbarFraction = [{
	display: frac_html_toolbar,
	insert: frac_html,
	dontInsertRecursive: true,
	logName: "fraction",
	extractReplace: {
		from: /<div[^>]*class="frac[^>]*>\s*<span[^>]*class="frac top[^>]*>(.*?)<\/span>\s*<span[^>]*class="frac bottom[^>]*>(.*?)<\/span>\s*<\/div>/g,
		to: "($1)/($2)"
	},
},
]

const toolbarMathOperatorsFraction = toolbarMathOperators.concat( toolbarFraction );

const toolbarMathOperatorsFractionComparison = [
	{ display: "&lt;", logName: "less", },
	{ display: "&gt;", logName: "greater", },
].concat( toolbarMathOperatorsFraction );

const toolbarMathOperatorsFractionPercent = toolbarMathOperatorsFraction.concat([
	{ display: "%", logName: "percent", },
]);


/***/ }),

/***/ "./libs/textareaInserts.css":
/*!**********************************!*\
  !*** ./libs/textareaInserts.css ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./main.css":
/*!******************!*\
  !*** ./main.css ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./textareaInserts_2cols.css":
/*!***********************************!*\
  !*** ./textareaInserts_2cols.css ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/*!********************************!*\
  !*** ./tmplTextareaInserts.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.css */ "./main.css");
/* harmony import */ var _textareaInserts_2cols_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./textareaInserts_2cols.css */ "./textareaInserts_2cols.css");
/* harmony import */ var _libs_baseInits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./libs/baseInits */ "./libs/baseInits.js");
/* harmony import */ var _libs_textareaInserts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./libs/textareaInserts */ "./libs/textareaInserts.js");






const toolbarCellWidth = 30;

const base = new _libs_baseInits__WEBPACK_IMPORTED_MODULE_2__.baseInits();
const ti = new _libs_textareaInserts__WEBPACK_IMPORTED_MODULE_3__.textareaInserts( '#container', {

	toolbarDirection: 'row',
	divStyles: {
		width: `${window.innerWidth-2*toolbarCellWidth-4}px`,
		height: `${window.innerHeight}px`,
	},

	toolbarContainerStyles: {
		// left: `${window.innerWidth-6*toolbarCellWidth-17}px`,
		// top: `${window.innerHeight-toolbarCellWidth-17}px`,
		width: `${2*toolbarCellWidth}px`,
		height: `${2*toolbarCellWidth}px`,
		'flex-wrap': 'wrap',
	},

	toolbarCellStyles: {
		width: `${toolbarCellWidth}px`,
		height: `${toolbarCellWidth}px`,
	},


/////////////////////////////////////
//////////////////////////
////////////////////////////////////////////
	toolbar: _libs_textareaInserts__WEBPACK_IMPORTED_MODULE_3__.toolbarMathOperators,
////////////////////////////////////////////////////
///////////////////////////////////////
//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//////////////////////////////////////////////
/////////
///////////////////////////////////////
//////////


////////////////////////////
	FSMVariableName: '2a_1_2',
//////////
//////////////////////////////
////////////////////////////////////////
//////////

///////////////////////////////
/////////////////////
//////////
}, base );

window.getState = ti.getState.bind(ti);
window.setState = ti.setState.bind(ti);

})();

/******/ })()
;
//# sourceMappingURL=msk_s5_b_2a_1.readable.js.map