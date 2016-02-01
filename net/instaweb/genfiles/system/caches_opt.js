(function(){var h,k=k||{},l=this;function aa(a,b){var c=a.split("."),d=l;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d[e]?d=d[e]:d=d[e]={}:d[e]=b}function ba(){}
function n(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function p(a){var b=n(a);return"array"==b||"object"==b&&"number"==typeof a.length}function q(a){return"string"==typeof a}function r(a){return"function"==n(a)}var ca="closure_uid_"+(1E9*Math.random()>>>0),da=0;function ea(a,b,c){return a.call.apply(a.bind,arguments)}
function fa(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function t(a,b,c){t=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ea:fa;return t.apply(null,arguments)}var ga=Date.now||function(){return+new Date};
function u(a,b){function c(){}c.prototype=b.prototype;a.ca=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.ea=function(a,c,f){for(var g=Array(arguments.length-2),m=2;m<arguments.length;m++)g[m-2]=arguments[m];return b.prototype[c].apply(a,g)}};function ha(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")}var ia=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};function v(a,b){return a<b?-1:a>b?1:0};function w(a){if(Error.captureStackTrace)Error.captureStackTrace(this,w);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}u(w,Error);w.prototype.name="CustomError";function x(a,b){b.unshift(a);w.call(this,ha.apply(null,b));b.shift()}u(x,w);x.prototype.name="AssertionError";function ja(a,b){throw new x("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var y=Array.prototype,ka=y.indexOf?function(a,b,c){return y.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(q(a))return q(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},la=y.forEach?function(a,b,c){y.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)};
function ma(a){var b;a:{b=na;for(var c=a.length,d=q(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:q(a)?a.charAt(b):a[b]};var z;a:{var oa=l.navigator;if(oa){var pa=oa.userAgent;if(pa){z=pa;break a}}z=""};function qa(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function ra(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}var sa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ta(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<sa.length;f++)c=sa[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var ua=-1!=z.indexOf("Opera")||-1!=z.indexOf("OPR"),A=-1!=z.indexOf("Trident")||-1!=z.indexOf("MSIE"),B=-1!=z.indexOf("Gecko")&&-1==z.toLowerCase().indexOf("webkit")&&!(-1!=z.indexOf("Trident")||-1!=z.indexOf("MSIE")),C=-1!=z.toLowerCase().indexOf("webkit");function va(){var a=l.document;return a?a.documentMode:void 0}
var wa=function(){var a="",b;if(ua&&l.opera)return a=l.opera.version,r(a)?a():a;B?b=/rv\:([^\);]+)(\)|;)/:A?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:C&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(z))?a[1]:"");return A&&(b=va(),b>parseFloat(a))?String(b):a}(),xa={};
function D(a){var b;if(!(b=xa[a])){b=0;for(var c=ia(String(wa)).split("."),d=ia(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",m=d[f]||"",M=RegExp("(\\d*)(\\D*)","g"),vb=RegExp("(\\d*)(\\D*)","g");do{var E=M.exec(g)||["","",""],F=vb.exec(m)||["","",""];if(0==E[0].length&&0==F[0].length)break;b=v(0==E[1].length?0:parseInt(E[1],10),0==F[1].length?0:parseInt(F[1],10))||v(0==E[2].length,0==F[2].length)||v(E[2],F[2])}while(0==b)}b=xa[a]=0<=b}return b}
var ya=l.document,za=ya&&A?va()||("CSS1Compat"==ya.compatMode?parseInt(wa,10):5):void 0;var G;(G=!A)||(G=A&&9<=za);var Aa=G,Ba=A&&!D("9");!C||D("528");B&&D("1.9b")||A&&D("8")||ua&&D("9.5")||C&&D("528");B&&!D("8")||A&&D("9");var H="closure_listenable_"+(1E6*Math.random()|0),Ca=0;function Da(a,b,c,d,e){this.listener=a;this.a=null;this.src=b;this.type=c;this.o=!!d;this.w=e;++Ca;this.i=this.m=!1}function Ea(a){a.i=!0;a.listener=null;a.a=null;a.src=null;a.w=null};function Fa(a){this.src=a;this.a={};this.b=0}function Ga(a,b,c,d,e){var f=b.toString();b=a.a[f];b||(b=a.a[f]=[],a.b++);var g=Ha(b,c,d,e);-1<g?(a=b[g],a.m=!1):(a=new Da(c,a.src,f,!!d,e),a.m=!1,b.push(a));return a}function Ia(a,b){var c=b.type;if(c in a.a){var d=a.a[c],e=ka(d,b),f;(f=0<=e)&&y.splice.call(d,e,1);f&&(Ea(b),0==a.a[c].length&&(delete a.a[c],a.b--))}}function Ha(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.i&&f.listener==b&&f.o==!!c&&f.w==d)return e}return-1};function Ja(){0!=Ka&&(this[ca]||(this[ca]=++da));this.F=this.F;this.T=this.T}var Ka=0;Ja.prototype.F=!1;function I(a,b){this.type=a;this.a=this.target=b}I.prototype.b=function(){};function La(a){La[" "](a);return a}La[" "]=ba;function J(a,b){I.call(this,a?a.type:"");this.f=this.a=this.target=null;if(a){this.type=a.type;this.target=a.target||a.srcElement;this.a=b;var c=a.relatedTarget;if(c&&B)try{La(c.nodeName)}catch(d){}this.f=a;a.defaultPrevented&&this.b()}}u(J,I);J.prototype.b=function(){J.ca.b.call(this);var a=this.f;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,Ba)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var Ma="closure_lm_"+(1E6*Math.random()|0),Na={},Oa=0;function K(a,b,c,d,e){if("array"==n(b))for(var f=0;f<b.length;f++)K(a,b[f],c,d,e);else if(c=Pa(c),a&&a[H])Ga(a.j,String(b),c,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,g=L(a);g||(a[Ma]=g=new Fa(a));c=Ga(g,b,c,d,e);c.a||(d=Qa(),c.a=d,d.src=a,d.listener=c,a.addEventListener?a.addEventListener(b.toString(),d,f):a.attachEvent(Ra(b.toString()),d),Oa++)}}
function Qa(){var a=Sa,b=Aa?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b}function Ta(a,b,c,d,e){if("array"==n(b))for(var f=0;f<b.length;f++)Ta(a,b[f],c,d,e);else(c=Pa(c),a&&a[H])?(a=a.j,b=String(b).toString(),b in a.a&&(f=a.a[b],c=Ha(f,c,d,e),-1<c&&(Ea(f[c]),y.splice.call(f,c,1),0==f.length&&(delete a.a[b],a.b--)))):a&&(a=L(a))&&(b=a.a[b.toString()],a=-1,b&&(a=Ha(b,c,!!d,e)),(c=-1<a?b[a]:null)&&Ua(c))}
function Ua(a){if("number"!=typeof a&&a&&!a.i){var b=a.src;if(b&&b[H])Ia(b.j,a);else{var c=a.type,d=a.a;b.removeEventListener?b.removeEventListener(c,d,a.o):b.detachEvent&&b.detachEvent(Ra(c),d);Oa--;(c=L(b))?(Ia(c,a),0==c.b&&(c.src=null,b[Ma]=null)):Ea(a)}}}function Ra(a){return a in Na?Na[a]:Na[a]="on"+a}function Va(a,b,c,d){var e=!0;if(a=L(a))if(b=a.a[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.o==c&&!f.i&&(f=Wa(f,d),e=e&&!1!==f)}return e}
function Wa(a,b){var c=a.listener,d=a.w||a.src;a.m&&Ua(a);return c.call(d,b)}
function Sa(a,b){if(a.i)return!0;if(!Aa){var c;if(!(c=b))a:{c=["window","event"];for(var d=l,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new J(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(M){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.a;f;f=f.parentNode)e.push(f);for(var f=a.type,g=e.length-1;0<=g;g--){c.a=e[g];var m=Va(e[g],f,!0,c),d=d&&m}for(g=0;g<e.length;g++)c.a=e[g],m=Va(e[g],f,!1,c),
d=d&&m}return d}return Wa(a,new J(b,this))}function L(a){a=a[Ma];return a instanceof Fa?a:null}var Xa="__closure_events_fn_"+(1E9*Math.random()>>>0);function Pa(a){if(r(a))return a;a[Xa]||(a[Xa]=function(b){return a.handleEvent(b)});return a[Xa]};function N(){Ja.call(this);this.j=new Fa(this);this.P=this}u(N,Ja);N.prototype[H]=!0;N.prototype.addEventListener=function(a,b,c,d){K(this,a,b,c,d)};N.prototype.removeEventListener=function(a,b,c,d){Ta(this,a,b,c,d)};function O(a,b){var c=a.P,d=b,e=d.type||d;if(q(d))d=new I(d,c);else if(d instanceof I)d.target=d.target||c;else{var f=d,d=new I(e,c);ta(d,f)}c=d.a=c;Ya(c,e,!0,d);Ya(c,e,!1,d)}
function Ya(a,b,c,d){if(b=a.j.a[String(b)]){b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.i&&g.o==c){var m=g.listener,M=g.w||g.src;g.m&&Ia(a.j,g);e=!1!==m.call(M,d)&&e}}}};function Za(a,b,c){if(r(a))c&&(a=t(a,c));else if(a&&"function"==typeof a.handleEvent)a=t(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<b?-1:l.setTimeout(a,b||0)};function $a(){}$a.prototype.a=null;function ab(a){var b;(b=a.a)||(b={},bb(a)&&(b[0]=!0,b[1]=!0),b=a.a=b);return b};var cb;function db(){}u(db,$a);function eb(a){return(a=bb(a))?new ActiveXObject(a):new XMLHttpRequest}function bb(a){if(!a.b&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.b=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.b}cb=new db;function P(a,b){this.b={};this.a=[];this.h=this.f=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)Q(this,arguments[d],arguments[d+1])}else if(a){a instanceof P?(c=a.l(),d=a.u()):(c=ra(a),d=qa(a));for(var e=0;e<c.length;e++)Q(this,c[e],d[e])}}h=P.prototype;h.u=function(){fb(this);for(var a=[],b=0;b<this.a.length;b++)a.push(this.b[this.a[b]]);return a};h.l=function(){fb(this);return this.a.concat()};
h.clear=function(){this.b={};this.h=this.f=this.a.length=0};function fb(a){if(a.f!=a.a.length){for(var b=0,c=0;b<a.a.length;){var d=a.a[b];Object.prototype.hasOwnProperty.call(a.b,d)&&(a.a[c++]=d);b++}a.a.length=c}if(a.f!=a.a.length){for(var e={},c=b=0;b<a.a.length;)d=a.a[b],Object.prototype.hasOwnProperty.call(e,d)||(a.a[c++]=d,e[d]=1),b++;a.a.length=c}}function Q(a,b,c){Object.prototype.hasOwnProperty.call(a.b,b)||(a.f++,a.a.push(b),a.h++);a.b[b]=c}
h.forEach=function(a,b){for(var c=this.l(),d=0;d<c.length;d++){var e=c[d];a.call(b,Object.prototype.hasOwnProperty.call(this.b,e)?this.b[e]:void 0,e,this)}};h.clone=function(){return new P(this)};function gb(a){if("function"==typeof a.u)return a.u();if(q(a))return a.split("");if(p(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return qa(a)}function hb(a,b){if("function"==typeof a.forEach)a.forEach(b,void 0);else if(p(a)||q(a))la(a,b,void 0);else{var c;if("function"==typeof a.l)c=a.l();else if("function"!=typeof a.u)if(p(a)||q(a)){c=[];for(var d=a.length,e=0;e<d;e++)c.push(e)}else c=ra(a);else c=void 0;for(var d=gb(a),e=d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)}};function ib(a,b,c,d,e){this.reset(a,b,c,d,e)}ib.prototype.a=null;var jb=0;ib.prototype.reset=function(a,b,c,d,e){"number"==typeof e||jb++;d||ga();this.b=b;delete this.a};function kb(a){this.h=a;this.b=this.f=this.a=null}function R(a,b){this.name=a;this.value=b}R.prototype.toString=function(){return this.name};var lb=new R("SEVERE",1E3),mb=new R("CONFIG",700),nb=new R("FINE",500);function ob(a){if(a.f)return a.f;if(a.a)return ob(a.a);ja("Root logger has no level set.");return null}
kb.prototype.log=function(a,b,c){if(a.value>=ob(this).value)for(r(b)&&(b=b()),a=new ib(a,String(b),this.h),c&&(a.a=c),c="log:"+a.b,l.console&&(l.console.timeStamp?l.console.timeStamp(c):l.console.markTimeline&&l.console.markTimeline(c)),l.msWriteProfilerMark&&l.msWriteProfilerMark(c),c=this;c;)c=c.a};var pb={},S=null;
function qb(a){S||(S=new kb(""),pb[""]=S,S.f=mb);var b;if(!(b=pb[a])){b=new kb(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=qb(a.substr(0,c));c.b||(c.b={});c.b[d]=b;b.a=c;pb[a]=b}return b};function T(a,b){a&&a.log(nb,b,void 0)};var rb=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;function sb(a){if(tb){tb=!1;var b=l.location;if(b){var c=b.href;if(c&&(c=(c=sb(c)[3]||null)?decodeURI(c):c)&&c!=b.hostname)throw tb=!0,Error();}}return a.match(rb)}var tb=C;function U(a){N.call(this);this.S=new P;this.D=a||null;this.b=!1;this.C=this.c=null;this.a=this.N=this.v="";this.f=this.J=this.s=this.H=!1;this.h=0;this.A=null;this.K=ub;this.B=this.V=!1}u(U,N);var ub="",wb=U.prototype,xb=qb("goog.net.XhrIo");wb.g=xb;var yb=/^https?$/i,zb=["POST","PUT"];
U.prototype.send=function(a,b,c,d){if(this.c)throw Error("[goog.net.XhrIo] Object is active with another request="+this.v+"; newUri="+a);b=b?b.toUpperCase():"GET";this.v=a;this.a="";this.N=b;this.H=!1;this.b=!0;this.c=this.D?eb(this.D):eb(cb);this.C=this.D?ab(this.D):ab(cb);this.c.onreadystatechange=t(this.O,this);try{T(this.g,V(this,"Opening Xhr")),this.J=!0,this.c.open(b,String(a),!0),this.J=!1}catch(f){T(this.g,V(this,"Error opening Xhr: "+f.message));Ab(this,f);return}a=c||"";var e=this.S.clone();
d&&hb(d,function(a,b){Q(e,b,a)});d=ma(e.l());c=l.FormData&&a instanceof l.FormData;!(0<=ka(zb,b))||d||c||Q(e,"Content-Type","application/x-www-form-urlencoded;charset=utf-8");e.forEach(function(a,b){this.c.setRequestHeader(b,a)},this);this.K&&(this.c.responseType=this.K);"withCredentials"in this.c&&(this.c.withCredentials=this.V);try{Bb(this),0<this.h&&(this.B=Cb(this.c),T(this.g,V(this,"Will abort after "+this.h+"ms if incomplete, xhr2 "+this.B)),this.B?(this.c.timeout=this.h,this.c.ontimeout=t(this.L,
this)):this.A=Za(this.L,this.h,this)),T(this.g,V(this,"Sending request")),this.s=!0,this.c.send(a),this.s=!1}catch(f){T(this.g,V(this,"Send error: "+f.message)),Ab(this,f)}};function Cb(a){return A&&D(9)&&"number"==typeof a.timeout&&void 0!==a.ontimeout}function na(a){return"content-type"==a.toLowerCase()}
U.prototype.L=function(){"undefined"!=typeof k&&this.c&&(this.a="Timed out after "+this.h+"ms, aborting",T(this.g,V(this,this.a)),O(this,"timeout"),this.c&&this.b&&(T(this.g,V(this,"Aborting")),this.b=!1,this.f=!0,this.c.abort(),this.f=!1,O(this,"complete"),O(this,"abort"),Db(this)))};function Ab(a,b){a.b=!1;a.c&&(a.f=!0,a.c.abort(),a.f=!1);a.a=b;Eb(a);Db(a)}function Eb(a){a.H||(a.H=!0,O(a,"complete"),O(a,"error"))}U.prototype.O=function(){this.F||(this.J||this.s||this.f?Fb(this):this.U())};
U.prototype.U=function(){Fb(this)};function Fb(a){if(a.b&&"undefined"!=typeof k)if(a.C[1]&&4==W(a)&&2==X(a))T(a.g,V(a,"Local request error detected and ignored"));else if(a.s&&4==W(a))Za(a.O,0,a);else if(O(a,"readystatechange"),4==W(a)){T(a.g,V(a,"Request complete"));a.b=!1;try{if(Gb(a))O(a,"complete"),O(a,"success");else{var b;try{b=2<W(a)?a.c.statusText:""}catch(c){T(a.g,"Can not get status: "+c.message),b=""}a.a=b+" ["+X(a)+"]";Eb(a)}}finally{Db(a)}}}
function Db(a){if(a.c){Bb(a);var b=a.c,c=a.C[0]?ba:null;a.c=null;a.C=null;O(a,"ready");try{b.onreadystatechange=c}catch(d){(a=a.g)&&a.log(lb,"Problem encountered resetting onreadystatechange: "+d.message,void 0)}}}function Bb(a){a.c&&a.B&&(a.c.ontimeout=null);"number"==typeof a.A&&(l.clearTimeout(a.A),a.A=null)}
function Gb(a){var b=X(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}if(!c){if(b=0===b)a=sb(String(a.v))[1]||null,!a&&self.location&&(a=self.location.protocol,a=a.substr(0,a.length-1)),b=!yb.test(a?a.toLowerCase():"");c=b}return c}function W(a){return a.c?a.c.readyState:0}function X(a){try{return 2<W(a)?a.c.status:-1}catch(b){return-1}}function V(a,b){return b+" ["+a.N+" "+a.v+" "+X(a)+"]"};function Hb(a){this.a=a||new U;this.b="";this.f=!1;a=document.createElement("table");a.id="nav-bar";a.className="pagespeed-sub-tabs";a.innerHTML='<tr><td><a id="'+Ib+'" href="javascript:void(0);">Show Metadata Cache</a> - </td><td><a id="'+Jb+'" href="javascript:void(0);">Show Cache Structure</a> - </td><td><a id="'+Kb+'" href="javascript:void(0);">Physical Caches</a> - </td><td><a id="'+Lb+'" href="javascript:void(0);">Purge Cache</a></td></tr>';document.body.insertBefore(a,document.getElementById(Y));
a=document.createElement("pre");a.id=Mb;a.className="pagespeed-caches-result";document.getElementById(Y).appendChild(a);a=document.createElement("div");a.id=Nb;a.className="pagespeed-caches-result";var b=document.getElementById(Ob);b.insertBefore(a,b.firstChild)}
aa("pagespeed.Caches.toggleDetail",function(a){var b=document.getElementById(a+"_summary"),c=document.getElementById(a+"_detail");document.getElementById(a+"_toggle").checked?(b.style.display="none",c.style.display="block"):(b.style.display="block",c.style.display="none")});
var Ib="show_metadata_mode",Jb="cache_struct_mode",Kb="physical_cache_mode",Lb="purge_cache_mode",Pb={W:Ib,R:Jb,X:Kb,Y:Lb},Y="show_metadata",Ob="purge_cache",Z={W:Y,R:"cache_struct",X:"physical_cache",Y:Ob},Mb="metadata_result",Nb="purge_result";h=Hb.prototype;h.M=function(){var a=location.hash.substr(1);if(""==a)this.G(Y);else{var b;a:{for(b in Z)if(Z[b]==a){b=!0;break a}b=!1}b&&this.G(a)}};
h.G=function(a){for(var b in Z){var c=Z[b];document.getElementById(c).className=c==a?"":"pagespeed-hidden-offscreen"}c=document.getElementById(a+"_mode");for(b in Pb){var d=document.getElementById(Pb[b]);d.className=d==c?"pagespeed-underline-link":""}location.href=location.href.split("#")[0]+"#"+a};h.aa=function(){if(!this.a.c){var a=encodeURIComponent(document.getElementById("purge_text").value.trim());this.b="*"==a?"purge_all":"purge_text";this.a.send("?purge="+a)}};
h.$=function(){this.a.c||(this.b="purge_all",this.a.send("?purge=*"))};h.I=function(){this.a.c||(this.b="purge_table",this.a.send("?new_set="))};h.Z=function(a){this.a.c||(a.preventDefault(),a="?url="+encodeURIComponent(document.getElementById("metadata_text").value.trim())+"&user_agent="+encodeURIComponent(document.getElementById("user_agent").value.trim())+"&json=1",this.b=Mb,this.a.send(a))};h.da=function(){this.f=!this.f;this.I()};
h.ba=function(){if(Gb(this.a)){var a;var b=this.a;try{a=b.c?b.c.responseText:""}catch(m){T(b.g,"Can not get responseText: "+m.message),a=""}if(this.b==Mb)a=JSON.parse(a.substring(4)).value,document.getElementById(this.b).textContent=a;else if("purge_table"==this.b){if(a=a.split("\n"),b=a.shift(),document.getElementById("purge_global").textContent="Everything before this time stamp is invalid: "+b.split("@")[1],b=document.getElementById("purge_table"),b.innerHTML="",0<a.length){b.appendChild(document.createElement("hr"));
var c=document.createElement("table");this.f&&a.reverse();for(var d=0;d<a.length;++d){var e=a[d].lastIndexOf("@"),f=a[d].substring(0,e),g=a[d].substring(e+1),e=c.insertRow(-1);e.insertCell(0).textContent=g;g=document.createElement("code");g.className="pagespeed-caches-purge-url";g.textContent=f;e.insertCell(1).appendChild(g)}d=c.createTHead().insertRow(0);f=d.insertCell(0);f.className="pagespeed-caches-date-column";1==a.length?f.textContent="Invalidation Time":(a=document.createElement("input"),a.setAttribute("type",
"checkbox"),a.id="sort",a.checked=this.f?!0:!1,a.title="Change sort order.",f.textContent=this.f?"Invalidation Time (Descending)":"Invalidation Time (Ascending)",f.appendChild(a),K(a,"change",t(this.da,this)));f=d.insertCell(1);f.textContent="URL";f.className="pagespeed-stats-url-column";b.appendChild(c)}}else window.setTimeout(t(this.I,this),0),b=document.getElementById(Nb),"Purge successful"==a&&"purge_text"==this.b?b.textContent="Added to Purge Set":-1!=a.indexOf("Purging not enabled")?b.innerHTML=
a:b.textContent=a}else a=this.a,console.log(q(a.a)?a.a:String(a.a))};
aa("pagespeed.Caches.Start",function(){K(window,"load",function(){var a=new Hb,b=document.createElement("table");b.innerHTML='URL: <input id="purge_text" type="text" name="purge" size="110"/><br><input id="purge_submit" type="button" value="Purge Individual URL"/><input id="purge_all" type="button" value="Purge Entire Cache"/>';var c=document.getElementById(Ob);c.insertBefore(b,c.firstChild);a.M();for(var d in Z)K(document.getElementById(Pb[d]),"click",t(a.G,a,Z[d]));K(window,"hashchange",t(a.M,a));
K(document.getElementById("purge_submit"),"click",t(a.aa,a));K(document.getElementById("purge_all"),"click",t(a.$,a));K(document.getElementById("metadata_submit"),"click",t(a.Z,a));K(a.a,"complete",t(a.ba,a));K(document.getElementById("metadata_clear"),"click",t(location.reload,location));a.I()})});})();