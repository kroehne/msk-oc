(()=>{"use strict";var t={};function e(t,s){const i=t=>t&&"object"==typeof t;return i(t)&&i(s)?(Object.keys(s).forEach((n=>{const o=t[n],a=s[n];Array.isArray(a)?t[n]=a:i(o)&&i(a)?t[n]=e(Object.assign({},o),a):t[n]=a})),t):s}function s(t,e){if(t===e)return!0;if(!(t instanceof Object&&e instanceof Object))return!1;if(t.constructor!==e.constructor)return!1;if(Array.isArray(e)&&Array.isArray(t)){if(t.length!=e.length)return!1;const i=Array.from(e);return!!t.every((t=>i.some(((e,n)=>!!s(t,e)&&(i.splice(n,1),!0)))))&&0===i.length}for(var i in t)if(t.hasOwnProperty(i)){if(!e.hasOwnProperty(i))return!1;if(t[i]!==e[i]){if("object"!=typeof t[i])return!1;if(!s(t[i],e[i]))return!1}}for(i in e)if(e.hasOwnProperty(i)&&!t.hasOwnProperty(i))return!1;return!0}t.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),(()=>{var e;t.g.importScripts&&(e=t.g.location+"");var s=t.g.document;if(!e&&s&&(s.currentScript&&(e=s.currentScript.src),!e)){var i=s.getElementsByTagName("script");i.length&&(e=i[i.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),t.p=e})();class i{constructor(){this.indexPath=this.getQueryVariable("indexPath"),this.userDefIdPath=this.getQueryVariable("userDefIdPath"),this.traceCount=0}setFSMVariable(t,e){this.postMessageWithPathsAndTraceCount({setVariable:{variableName:t,newValue:e}})}postLogEvent(t){this.postMessageWithPathsAndTraceCount({traceMessage:t})}triggerEvent(t){this.postMessageWithPathsAndTraceCount({microfinEvent:t})}postMessageWithPathsAndTraceCount(t){try{t.indexPath=this.indexPath,t.userDefIdPath=this.userDefIdPath,t.traceCount=this.traceCount++,window.parent.postMessage(JSON.stringify(t),"*")}catch(t){console.error(t)}}getQueryVariable(t){return new URL(window.location.href).searchParams.get(t)}startListeningToVariableDeclarationRequests(t){window.addEventListener("message",(e=>{try{const{callId:s}=JSON.parse(e.data);if(void 0!==s&&s.includes("importVariables")){const e={initialVariables:t(),callId:s};window.parent.postMessage(JSON.stringify(e),"*")}}catch(t){}}),!1)}debugOut(t){}}const n=[{display:"&plus;",logName:"plus"},{display:"&minus;",logName:"minus"},{display:"&sdot;",logName:"dot"},{display:"&ratio;",logName:"ratio"},{display:"&equals;",logName:"equals"}],o=[{display:`<div class="frac"><img src="${t.p+"fract.svg"}"></div>`,insert:'<div contenteditable="false" class="frac"><span contenteditable="true" class="frac top startCursorPos inputField"></span><span contenteditable="true" class="frac bottom inputField"></span></div>',dontInsertRecursive:!0,logName:"fraction",extractReplace:{from:/<div[^>]*class="frac[^>]*>\s*<span[^>]*class="frac top[^>]*>(.*?)<\/span>\s*<span[^>]*class="frac bottom[^>]*>(.*?)<\/span>\s*<\/div>/g,to:"($1)/($2)"}}],a=n.concat(o),r=([{display:"&lt;",logName:"less"},{display:"&gt;",logName:"greater"}].concat(a),a.concat([{display:"%",logName:"percent"}]),new class{constructor(t={}){if(Object.assign(this,{container:null,addSendChangeState:null},t),this.fsm||(this.fsm=new i,this.fsm.startListeningToVariableDeclarationRequests(this.declareVariables.bind(this))),t.container){this.width||(this.width=window.innerWidth),this.height||(this.height=window.innerHeight),this.stage=new Konva.Stage({container:this.container,width:this.width,height:this.height});const t="BW_IB_EXTRES_STAGES";t in window||(window[t]=[]),window[t].push(this.stage)}document.addEventListener("contextmenu",(t=>t.preventDefault())),this.FSMVarsSent={}}postLog(t,e={}){this.stage&&this.stage.isDemoAni||this.fsm.postLogEvent(Object.assign({},e,{event:t}))}postVariable(t,e){this.FSMVarsSent[t]=e,this.fsm.setFSMVariable(t,e)}triggerInputValidationEvent(){this.fsm.triggerEvent&&(this.fsm.triggerEvent("ev_InputValidation_"+"msk_d4_b_2b_1".replace("msk_","")),this.fsm.triggerEvent("ev_InputValidation_ExtRes"))}getChangeState(t){return t.statusVarDef?t.statusVarDef.call(t):+t.getDefaultChangeState()}sendChangeState(t,e=null){if(t.stage&&t.stage.isDemoAni)return;const i=null===e?this.getChangeState(t):e;if(void 0===t.oldChangeState||!s(i,t.oldChangeState)){if("object"==typeof i)for(let e in i)"object"==typeof t.oldChangeState&&i[e]===t.oldChangeState[e]||this.postVariable(e,i[e]);else t.FSMVariableName&&this.postVariable(`V_Status_${t.FSMVariableName}`,+i);t.oldChangeState=i}if(t.scoreDef){const e=t.scoreDef.call(t);if(void 0===t.oldScore||!s(e,t.oldScore))if("object"==typeof e)for(let s in e)"object"==typeof t.oldScore&&e[s]===t.oldScore[s]||this.postVariable(s,e[s]);else(t.FSMVariableName||t.scoreVariableName)&&void 0!==e&&this.postVariable(t.scoreVariableName||`V_Score_${t.FSMVariableName}`,e);t.oldScore=e}"function"==typeof this.addSendChangeState&&this.addSendChangeState()}declareVariables(){const t=[],e={string:"String",number:"Integer"};for(const s in this.FSMVarsSent){const i={name:s,type:e[typeof this.FSMVarsSent[s]],defaultValue:this.FSMVarsSent[s],namedValues:[]};t.push(i)}return t}}),l=new class{constructor(t,s={},i=null){e(Object.assign(this,{outerDivStyles:{},divStyles:{},toolbar:[],toolbarDirection:"column",toolbarContainerStyles:{},toolbarCellStyles:{},toolbarCellSpanStyles:{},multiLine:!0,stripTags:!1,inputRegexp:null,maxlength:null,extractReplaces:[{from:/([^*])\*([^*])/g,to:"$1⋅$2"},{from:/\u2022|\u25cf/g,to:"⋅"}]}),s),this.base=i;const n=(t,e)=>{for(const s in e)t.style[s]=e[s]};this.outerDiv=document.createElement("DIV"),this.outerDiv.classList.add("textareaInserts"),n(this.outerDiv,this.outerDivStyles),this.div=document.querySelector(t),this.div.parentNode.replaceChild(this.outerDiv,this.div),n(this.div,this.divStyles),this.div.setAttribute("contenteditable","true"),this.div.addEventListener("keydown",this.ev_keydown.bind(this)),this.div.addEventListener("input",this.ev_input.bind(this)),!this.div.textContent.length&&this.multiLine&&(this.div.textContent="\n"),this.outerDiv.appendChild(this.div),this.toolbarContainer=document.createElement("DIV"),this.toolbarContainer.classList.add("toolbar",this.toolbarDirection,"disabled"),this.toolbarContainerStyles.left||(this.toolbarContainerStyles.left=this.divStyles.width),this.toolbarContainerStyles.top||(this.toolbarContainerStyles.top="0px"),n(this.toolbarContainer,this.toolbarContainerStyles),this.toolbar.forEach(((t,e)=>{const s=document.createElement("DIV");n(s,this.toolbarCellStyles),["mousedown","touchstart"].forEach((t=>s.addEventListener(t,function(t){document.activeElement&&!this.toolbarContainer.classList.contains("disabled")&&this.div.contains(document.activeElement)&&this.insert(e,t)}.bind(this))));const i=document.createElement("SPAN");n(i,this.toolbarCellSpanStyles),s.appendChild(i),i.innerHTML=t.display,this.toolbarContainer.appendChild(s),t.extractReplace&&t.extractReplace.from&&t.extractReplace.to&&this.extractReplaces.push(t.extractReplace)})),this.outerDiv.appendChild(this.toolbarContainer),this.div.addEventListener("focus",(()=>this.toolbarContainer.classList.remove("disabled")),{capture:!0}),this.div.addEventListener("blur",(()=>this.toolbarContainer.classList.add("disabled")),{capture:!0}),this.div.addEventListener("paste",(t=>t.preventDefault())),this.inputRegexp&&(this.inputRE=new RegExp(this.inputRegexp),this.saveValue()),this.oldValue="",this.oldFocusElemIndex=null,this.initData=this.div.innerHTML.trim(),this.base.sendChangeState(this)}insert(t,e){if(this.toolbar[t].dontInsertRecursive){const t=window.getSelection();if(t&&t.focusNode){let e=t.focusNode;for(;e&&(!e.classList||!e.classList.contains("textareaInserts")&&!e.classList.contains("inserted"));)e=e.parentNode;if(e.classList&&e.classList.contains("inserted"))return}}this.pasteHtmlAtCaret(this.toolbar[t].insert||this.toolbar[t].display,!this.toolbar[t].noExtraSpaces,this.toolbar[t].logName)&&(this.ev_input(),e.preventDefault(),e.stopPropagation()),this.base&&this.base.sendChangeState(this)}ev_keydown(t){let e=0;if(this.base){const e={which:t.which||t.keyCode};["key","code","shiftKey","altKey","ctrlKey","metaKey","isComposing","repeat"].forEach((s=>{t[s]&&(e[s]=t[s])})),this.base.postLog("keyDown",Object.assign(e,this.getTextPos()))}"Enter"===t.key||13==t.which||13==t.keyCode?(this.tabToNextInputField(t)||this.multiLine&&!this.pasteHtmlAtCaret("\n")||(t.preventDefault(),t.stopPropagation()),e=1):"Tab"===t.key||9==t.which||9==t.keyCode?(this.tabToNextInputField(t)||this.pasteHtmlAtCaret("&#09;")&&(t.preventDefault(),t.stopPropagation()),e=1):"Backspace"===t.key||8==t.which||8==t.keyCode?(this.delIfDiv(-1,t),e=1):"Delete"!==t.key&&46!=(t.which||t.keyCode)||(this.delIfDiv(1,t),e=1),this.base&&e>0&&this.base.sendChangeState(this)}ev_input(t){let e=!1;const s=window.getSelection();if(t&&"deleteContentBackward"==t.inputType&&this.delPosElement){let t=null,i=s.focusNode;if(this.delPosText)for(;!t&&i&&(!i.classList||!i.classList.contains("textareaInserts"));)i.classList&&i.classList.contains("inserted")&&(t=i),i=i.parentNode;if(t){if(s.getRangeAt&&s.rangeCount){const e=s.getRangeAt(0).cloneRange();e.setStartBefore(t),e.collapse(!0),s.removeAllRanges(),s.addRange(e)}this.div.replaceChild(this.delPosText,this.delPosElement),this.div.normalize()}else this.delPosElement.remove();this.delPosElement=null,this.delPosText=null,e=this.inputRE||!this.multiLine}else{if(s&&s.isCollapsed&&s.focusNode.parentNode==this.div&&0===s.focusOffset&&s.focusNode.previousSibling&&s.focusNode.previousSibling.classList&&s.focusNode.previousSibling.classList.contains("inserted")?(this.delPosText=s.focusNode.cloneNode(!0),this.delPosElement=s.focusNode.previousSibling):(this.delPosElement=null,this.delPosText=null),this.multiLine){const t=this.div.childNodes.length>0?this.div.childNodes[this.div.childNodes.length-1]:null;if(t&&t.nodeType==Node.TEXT_NODE&&!t.textContent.endsWith("\n")){const e=s&&s.focusNode==t?s.focusOffset:null;t.textContent=t.textContent+"\n",null!==e&&this.setCurPos(t,e)}}else this.div.textContent.match(/[\n\r]/)?this.restoreValue():e=!0;if(this.stripTags)this.div.innerHTML.match(/<[^>]*>/)&&(this.div.innerHTML=this.div.innerHTML.replace(/<[^>]*>/g,""));else{let t=this.div.childNodes[0];for(;t;){const e=t;if(t=t.nextSibling,"DIV"==e.tagName&&e.classList&&!e.classList.contains("inserted")){const t=e.textContent;if(t.length){const s=document.createTextNode("");s.textContent=t,this.div.replaceChild(s,e),this.div.normalize()}else e.remove()}}"<br>"===this.div.innerHTML.trim()&&(this.div.innerHTML="",this.div.textContent="\n")}(this.inputRE||this.maxlength)&&(this.inputRE&&!this.div.innerHTML.match(this.inputRE)||this.maxlength&&this.div.innerHTML.length>this.maxlength?(this.restoreValue(),this.base&&(this.base.postLog("inputRevert",{toText:this.div.innerHTML,extract:this.extract()}),this.base.triggerInputValidationEvent())):e=!0)}e&&this.saveValue(),(e||!this.inputRE||this.multiLine)&&this.base.postLog("newValue",{extract:this.extract()}),this.base&&this.base.sendChangeState(this)}pasteHtmlAtCaret(t,e,s){const i=window.getSelection();if(!i||!i.focusNode||!this.div.contains(i.focusNode))return!1;if(i.getRangeAt&&i.rangeCount){let r,l=i.getRangeAt(0);l.deleteContents(),r=e?`${i.focusOffset&&" "==i.focusNode.textContent[i.focusOffset-1]?"":" "}${t} `:t;const d=document.createElement("div");d.innerHTML=r;for(var n,o,a=document.createDocumentFragment();n=d.firstChild;)n.classList&&n.classList.add("inserted"),o=a.appendChild(n);const c=a.querySelector(".startCursorPos");if(l.insertNode(a),o&&(l=l.cloneRange(),c?l.setStart(c,0):l.setStartAfter(o),l.collapse(!0),i.removeAllRanges(),i.addRange(l)),this.normalize(),s&&this.base){const t={text:r,name:s,extract:this.extract()};this.base.postLog("insertButtonPressed",Object.assign(t,this.getTextPos()))}}return!0}delIfDiv(t,e){const s=window.getSelection();if(s&&s.isCollapsed){const i=s.focusNode;if(i&&(t>0&&s.focusOffset==i.textContent.length||t<0&&(!s.focusOffset||i==this.div&&s.focusOffset<=this.div.childNodes.length))){const n=i==this.div?this.div.childNodes[s.focusOffset-1]:t<0?i.previousSibling:i.nextSibling;if(n&&"DIV"==n.tagName&&n.classList.contains("inserted")){const t=s.getRangeAt(0);return t&&(n.previousSibling?t.setStartAfter(n.previousSibling):n.nextSibling&&t.setStart(n.nextSibling,0),t.collapse(!0),s.removeAllRanges(),s.addRange(t)),n.remove(),this.div.normalize(),e.preventDefault(),e.stopPropagation(),!0}}}return!1}tabToNextInputField(t){const e=window.getSelection();if(e&&e.isCollapsed&&e.focusNode&&e.getRangeAt&&e.rangeCount){let s;for(s=e.focusNode;s&&!s.classList;)s=s.parentNode;if(s&&s.classList.contains("inputField")){for(;s&&!s.nextSibling&&s!=this.div;)s=s.parentNode;if(s&&s!=this.div)return s=s.nextSibling,this.setCurPos(s,s.nodeType==Node.TEXT_NODE&&s.textContent.startsWith(" ")?1:0),t.preventDefault(),t.stopPropagation(),!0}}return!1}saveValue(){this.oldValue=this.div.innerHTML;const t=window.getSelection();if(t&&t.focusNode){const e=Array.from(this.div.childNodes);this.oldFocusElemIndex=e.findIndex((e=>e===t.focusNode)),this.oldFocusOffset=t.focusOffset}else this.oldFocusElemIndex=null}restoreValue(){if(null!==this.oldValue){this.div.innerHTML=this.oldValue;const t=window.getSelection();t&&(t.removeAllRanges(),null!==this.oldFocusElemIndex&&this.oldFocusElemIndex>-1&&this.setCurPos(this.div.childNodes[this.oldFocusElemIndex],this.oldFocusOffset))}}setCurPos(t,e){const s=window.getSelection();if(s){const i=document.createRange();i.setStart(t,e),i.collapse(!0),s.removeAllRanges(),s.addRange(i)}}normalize(){let t,e,s=null;const i=window.getSelection();if(i&&i.getRangeAt&&i.rangeCount){let n=i.focusNode;if(n&&n.nodeType==Node.TEXT_NODE&&(n.previousSibling&&n.previousSibling.nodeType==Node.TEXT_NODE||n.nextSibling&&n.nextSibling.nodeType==Node.TEXT_NODE)){for(s=i.focusOffset,e=n.parentElement;n.previousSibling&&n.previousSibling.nodeType==Node.TEXT_NODE;)n=n.previousSibling,s+=n.textContent.length;t=n.previousSibling}}if(this.div.normalize(),null!==s){const n=t?t.nextSibling:e.firstChild,o=document.createRange();o.setStart(n,s),o.collapse(!0),i.removeAllRanges(),i.addRange(o)}}getTextPos(t=null){if(null===t&&(t=window.getSelection()),t&&t.focusNode){let e=t.focusOffset,s=t.focusNode;for(;(s=s.previousSibling||s.parentNode)&&s!=this.div&&s;)s.textContent&&(e+=s.textContent.length);const i={textPos:e};for(s=t.focusNode;s&&s!=this.div&&!s.classList;)s=s.parentNode;return s.classList&&s.classList.contains("frac")&&(s.classList.contains("top")&&(i.class="frac top"),s.classList.contains("bottom")&&(i.class="frac bottom")),i}return{}}extract(){let t=this.div.innerHTML;return this.extractReplaces.forEach((e=>{t=t.replace(e.from,e.to)})),t.trim()}getState(){return JSON.stringify(this.div.innerHTML)}setState(t){try{this.div.innerHTML=JSON.parse(t)}catch(t){console.error(t)}var e;(e=this).stage&&e.stage.isDemoAni&&e.stage.isDemoAni.endAni&&e.stage.isDemoAni.endAni(!1),e.base&&e.base.sendChangeState(e)}getDefaultChangeState(){return this.div.innerHTML.trim()!==this.initData}scoreDef(){return this.scoreVariableName||this.FSMVariableName?{[this.scoreVariableName||`V_Input_${this.FSMVariableName}`]:this.extract()}:{}}}("#container",{toolbarDirection:"row",divStyles:{width:window.innerWidth-60-4+"px",height:`${window.innerHeight}px`},toolbarContainerStyles:{width:"60px",height:"60px","flex-wrap":"wrap"},toolbarCellStyles:{width:"30px",height:"30px"},toolbar:n,FSMVariableName:"2b_1_2"},r);window.getState=l.getState.bind(l),window.setState=l.setState.bind(l)})();