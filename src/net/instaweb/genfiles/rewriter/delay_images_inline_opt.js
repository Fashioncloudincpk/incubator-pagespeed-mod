(function(){window.pagespeed=window.pagespeed||{};var a=window.pagespeed;function d(){this.b={}}d.prototype.c=function(c,b){this.b[c]=b};d.prototype.addLowResImages=d.prototype.c;d.prototype.a=function(c){for(var b=0;b<c.length;++b){var e=c[b].getAttribute("pagespeed_high_res_src"),f=c[b].getAttribute("src");e&&!f&&(e=this.b[e])&&c[b].setAttribute("src",e)}};d.prototype.replaceElementSrc=d.prototype.a;d.prototype.d=function(){this.a(document.getElementsByTagName("img"));this.a(document.getElementsByTagName("input"))};
d.prototype.replaceWithLowRes=d.prototype.d;a.e=function(){a.delayImagesInline=new d};a.delayImagesInlineInit=a.e;})();
