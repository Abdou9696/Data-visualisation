(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}(function($){// Initializes Foundation.
var Foundation=function(){function Foundation(context,settings){_classCallCheck(this,Foundation);this.context=context;this.settings=settings;this.initialize();}_createClass(Foundation,[{key:"initialize",value:function initialize(){$(document).foundation();}}]);return Foundation;}();module.exports=Foundation;})(jQuery);

},{}],2:[function(require,module,exports){
"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}(function($){// Handles Tables behaviors.
var Tables=function(){function Tables(context,settings){_classCallCheck(this,Tables);this.context=context;this.settings=settings;this.initialize();}_createClass(Tables,[{key:'initialize',value:function initialize(){// Initialize class object instance reference.
var objectReference=this;// Initial Table shadows.
$(document).on('ready',function(){objectReference.handleScrollShadows(objectReference);});// Initial Table shadows.
$(window).on('resize',function(){objectReference.handleScrollShadows(objectReference);});}},{key:'handleScrollShadows',value:function handleScrollShadows(objectReference){var $tables=$('.node-table .field-name-field-table-data-mapping.mapped .field-items');$tables.addScrollShadows();$tables.scroll(function(event){$(this).addScrollShadows();});}}]);return Tables;}();jQuery.fn.addScrollShadows=function(){return this.each(function(){var $child=$(this).find('.field-item > table');// Check if its child is larger than it
if($(this).width()<$child.width()){// Calculate the scroll position in percent (it's actually a value between 0 and 1)
var percent=($(this).scrollLeft()/($child.width()-$(this).width())).toFixed(2);// Check if we can scroll left
if(percent>0){$(this).parent().addClass('scroll-left');}else{$(this).parent().removeClass('scroll-left');}// Check if we can scroll right
if(percent<1){$(this).parent().addClass('scroll-right');}else{$(this).parent().removeClass('scroll-right');}}else{// Remove every shadow classes
$(this).parent().removeClass('scroll-left scroll-right');}});};module.exports=Tables;})(jQuery);

},{}],3:[function(require,module,exports){
"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}(function($){// Handles Themes behaviors.
var Themes=function(){function Themes(context,settings){_classCallCheck(this,Themes);this.context=context;this.settings=settings;this.defaultSpeed=500;this.offsetAdjustment=-45;this.initialize();}_createClass(Themes,[{key:'initialize',value:function initialize(){this.handleSubthemesVisibility();this.handleSubthemesFiltering();this.handleSubsubthemesFiltering();}},{key:'handleSubthemesVisibility',value:function handleSubthemesVisibility(){var $childThemesBlock=$('#block-views-themes-block-child-themes, #block-views-themes-block-theme-children');$childThemesBlock.find('.view-content > .item-list > ul > li').each(function(){$(this).find('.filter-button').hide();$(this).hide();});}},{key:'handleSubthemesFiltering',value:function handleSubthemesFiltering(){var speed=this.defaultSpeed;var offsetAdjustment=this.offsetAdjustment;var $parentThemesBlock=$('#block-views-themes-block-parent-themes, #block-views-themes-block-parent-theme');var $childThemesBlock=$('#block-views-themes-block-child-themes, #block-views-themes-block-theme-children');if($('body.admin-menu').length>0){offsetAdjustment-=parseInt($('body.admin-menu').css('margin-top'));}$parentThemesBlock.find('.views-row .filter-button').on('click',function(){// Retrieve parent theme term name and acronym.
var parentTermName=$(this).siblings('.views-field-name').find('.field-content a').html();var parentTermAcronym=$(this).siblings('.views-field-field-acronym').find('.field-content a').html();// Find its color and tid
var parentTid=$(this).siblings('.views-field-field-acronym').find('.subtheme').data('tid');var parentColor=$(this).siblings('.views-field-field-acronym').find('.subtheme').data('themecolor');var $wasClosed=!$(this).parent().hasClass('theme-active');if($wasClosed&&parentTid&&parentColor){// Consider the parent theme button has "active"
$parentThemesBlock.find('.views-row').removeClass('theme-active');$(this).parent().addClass('theme-active');// Sub Theme block animation
$childThemesBlock.slideUp(speed,function(){// Change the block's color
$childThemesBlock.find('.content').css('background-color',parentColor);$(this).find('.view-content .visible-item-list').remove();$(this).find('.view-content .item-list').hide(0);$(this).find('.view-content').append('<div class="item-list visible-item-list"><ul class="column large-4 medium-6 small-12"></ul><ul class="column large-4 medium-6 small-12"></ul><ul class="column large-4 medium-6 small-12"></ul></div>');var i=0;$childThemesBlock.find('.view-content > .item-list > ul > li').each(function(){// For the button.
if($(this).find('.item-list').length){$(this).find('.item-list').addClass('subsubtheme');$(this).find('.filter-button').show();}if(parentTid==$(this).find('.subtheme').data('parent')){var nbcol=3;$(this).show(0);//if less than 640
if(window.innerWidth<640){nbcol=1;}//else if less than 1024
else if(window.innerWidth<1024){nbcol=2;}var $column=$childThemesBlock.find('.visible-item-list .column').eq(i%nbcol);$(this).clone().appendTo($column);i++;}});// Adjust subthemes view header.
var $childThemesBlockHeader=$childThemesBlock.find('.view-header');$childThemesBlockHeader.html('<span class="parent-acronym">'+parentTermAcronym+'</span>'+parentTermName);$childThemesBlockHeader.find('.parent-acronym').css({'color':parentColor});// Open subthemes view.
$childThemesBlock.slideDown(speed);// Scroll down to subthemes view.
var $header=$('#header');var targetOffsetTop=$parentThemesBlock.offset().top+$parentThemesBlock.height()-$header.height()+offsetAdjustment;$('html, body').animate({scrollTop:targetOffsetTop},speed);});}else{// Parent theme manual closing of subtheme block.
$childThemesBlock.slideUp(speed);$(this).parent().removeClass('theme-active');// Scroll back to parent themes view.
var $header=$('#header');var targetOffsetTop=$parentThemesBlock.offset().top-$header.height()+offsetAdjustment;$('html, body').animate({scrollTop:targetOffsetTop},speed);}});// Close the child block section
$childThemesBlock.find('.content').on('click',function(event){if($(event.target).hasClass('content')){// Subtheme block toggle close.
$parentThemesBlock.find('.views-row').removeClass('theme-active');$childThemesBlock.slideUp(speed);// Scroll back to parent themes view.
var $header=$('#header');var targetOffsetTop=$parentThemesBlock.offset().top-$header.height()+offsetAdjustment;$('html, body').animate({scrollTop:targetOffsetTop},speed);}});}},{key:'handleSubsubthemesFiltering',value:function handleSubsubthemesFiltering(){var speed=this.defaultSpeed;var filterButtonsSelector='#block-views-themes-block-child-themes .view-content li .filter-button, #block-views-themes-block-theme-children .view-content li .filter-button, #block-views-themes-block-theme-current .view-content li .filter-button';// Bind event on body element, otherwise it won't fire because the filter
// buttons are not present in the DOM when registering this "on click" event.
$('body').on('click',filterButtonsSelector,function(){$(this).parent().toggleClass('opened').find('.item-list').slideToggle(speed);});}}]);return Themes;}();module.exports=Themes;})(jQuery);

},{}],4:[function(require,module,exports){
"use strict";(function($){// Foundation behaviors.
Drupal.behaviors.themeQcecoFoundation={attach:function attach(context,settings){var Foundation=require('./base/Foundation');var foundationBehavior=new Foundation(context,settings);}};// MMenu behaviors.
Drupal.behaviors.themeQcecoMMenu={attach:function attach(context,settings){var MMenu=require('./regions/MMenu');var mmenuBehavior=new MMenu(context,settings);}};// Header behaviors.
Drupal.behaviors.themeQcecoHeader={attach:function attach(context,settings){var Header=require('./regions/Header');var headerBehavior=new Header(context,settings);}};// Themes behaviors.
Drupal.behaviors.themeQcecoThemes={attach:function attach(context,settings){var Themes=require('./features/Themes');var themesBehavior=new Themes(context,settings);}};// Tables behaviors.
Drupal.behaviors.themeQcecoTables={attach:function attach(context,settings){var Tables=require('./features/Tables');var tablesBehavior=new Tables(context,settings);}};})(jQuery);

},{"./base/Foundation":1,"./features/Tables":2,"./features/Themes":3,"./regions/Header":5,"./regions/MMenu":6}],5:[function(require,module,exports){
"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}(function($){// Handles Header behaviors.
var Header=function(){function Header(context,settings){_classCallCheck(this,Header);// Class properties.
this.context=context;this.settings=settings;this.defaultSpeed=300;this.widthThreshold=1280;this.baseHeight=this.baseHeight=$('#header').height();this.positionFixedHeight;this.positionFixedMobileHeight;// Class initialization method call.
this.initialize();}/**
     * Handles all of the initialization behaviors for the Header object.
     */_createClass(Header,[{key:'initialize',value:function initialize(){// Initialize class object instance reference.
var objectReference=this;// Initial Header resizing.
objectReference.resizeHeader(objectReference);// Window events bindings.
$(window).on('load',function(){objectReference.positionHeader(objectReference);objectReference.resizeHeader(objectReference);objectReference.resizeSearch(objectReference);objectReference.offsetAnchors(objectReference);});$(window).on('scroll',function(){objectReference.positionHeader(objectReference);});$(window).on('resize',function(){objectReference.resizeHeader(objectReference);objectReference.resizeSearch(objectReference);});}/**
     * Handles the header position, primarily on window load and scroll events.
     * Toggles between fixed and relative depending on context.
     * @param  {object} objectReference Header object instance reference.
     */},{key:'positionHeader',value:function positionHeader(objectReference){// Initialize all needed variables.
var $body=$('body');var $header=$('#header');var $mainWrapper=$('#main-wrapper');var headerHeight=$header.height();var windowPosition=$(window).scrollTop();// Act when the window scroll position is greater than the header height.
// Basically, adjust the header's position when it is not visible anymore.
if(windowPosition>headerHeight){// Only adjust the header's position if it does not possess the
// 'fixed-header' class to prevent too many JS operations.
if(!$body.hasClass('fixed-header')){// Apply fixed header style and behavior.
$body.addClass('fixed-header');$mainWrapper.css({'margin-top':headerHeight});objectReference.resizeSearch(objectReference);// Assign the default height value only once for future use.
if(typeof objectReference.positionFixedHeight==='undefined'){objectReference.positionFixedHeight=$header.height();}// Assign the alternate, mobile height value only once for future use.
if($body.hasClass('mobile-header')&&typeof objectReference.positionFixedMobileHeight==='undefined'){objectReference.positionFixedMobileHeight=$('.header-first-wrapper').height();}// Initialize header's target height variable.
// Defaults to the desktop display height value.
var targetHeight=objectReference.positionFixedHeight;// If the current display is for mobile, use the set fixed mobile height value instead.
if($body.hasClass('mobile-header')&&typeof objectReference.positionFixedMobileHeight!=='undefined'){targetHeight=objectReference.positionFixedMobileHeight;}// Animate the header when switching to fixed position.
$header.height(0);$header.animate({height:targetHeight},objectReference.defaultSpeed,function(){$header.css({'overflow':'visible'});});}}else{// Only adjust the header's position if it possesses the
// 'fixed-header' class to prevent too many JS operations.
if($body.hasClass('fixed-header')){// Remove fixed header style and behavior.
$body.removeClass('fixed-header');$mainWrapper.css({'margin-top':'auto'});objectReference.resizeSearch(objectReference);$header.css({'height':objectReference.baseHeight,'overflow':'visible'});}}}/**
     * Handles the header resizing, primarily on window load and resize events.
     * It mainly 'resizes' the main wrapper top margin when switching between
     * desktop and mobile display.
     * @param  {object} objectReference Header object instance reference.
     */},{key:'resizeHeader',value:function resizeHeader(objectReference){// Initialize all needed variables.
var $body=$('body');var $header=$('#header');// Adjust header style and behavior depending on the current window width.
if($(window).width()<objectReference.widthThreshold){// Apply mobile style and behavior when window is in mobile width range.
$body.addClass('mobile-header');}else{// Remove mobile style and behavior when window is not in mobile width range.
$body.removeClass('mobile-header');$header.css({'height':'auto'});}}/**
     * Handles the search bar (located within the header) resizing via padding adjustments.
     * Resize the search bar to math the slogan container height, regardless of context.
     * @param  {object} objectReference Header object instance reference.
     */},{key:'resizeSearch',value:function resizeSearch(objectReference){// Initialize all needed variables.
var context=objectReference.context;var $sloganBlock=$('#block-qceco-blocks-slogan-block',context);var $searchBlock=$('#block-views-exp-recherche-page--2',context);var sloganBlockHeight=$sloganBlock.outerHeight();var searchBlockInputHeight=$searchBlock.height();var searchBlockPadding=(sloganBlockHeight-searchBlockInputHeight)/2;// Apply computed padding adjustments.
$searchBlock.css('paddingTop',searchBlockPadding+'px');$searchBlock.css('paddingBottom',searchBlockPadding+'px');}},{key:'offsetAnchors',value:function offsetAnchors(objectReference){if(window.location.hash){objectReference.gotoAnchor(objectReference,window.location.hash);}$('a').on('click',function(event){var href=$(this).attr('href');if(href.charAt(0)==='#'){event.preventDefault();objectReference.gotoAnchor(objectReference,href);}});}},{key:'gotoAnchor',value:function gotoAnchor(objectReference,anchor){if($(anchor).length){var headerHeight=$('#header').height();var headerPosition=0;// The window is on top
if($(window).scrollTop()<headerHeight){headerHeight=165;}// On small mobiles
if($(window).width()<objectReference.widthThreshold){headerHeight=50;}// User is logged in
if($('body').hasClass('admin-menu')){headerPosition=30;}var position=$(anchor).offset().top-(headerHeight+headerPosition);$(window).scrollTop(position);}}}]);return Header;}();// Make class accessible to other JS files.
module.exports=Header;})(jQuery);

},{}],6:[function(require,module,exports){
"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}(function($){// Initializes MMenu.
var MMenu=function(){function MMenu(context,settings){_classCallCheck(this,MMenu);this.context=context;this.settings=settings;this.initialize();}_createClass(MMenu,[{key:'initialize',value:function initialize(){$('#mobile-menu-wrapper').mmenu({offCanvas:{position:'right',zposition:'front'},navbars:[{position:'top',content:['prev','title','close']}],extensions:['fullscreen']});}}]);return MMenu;}();module.exports=MMenu;})(jQuery);

},{}]},{},[4])



//# sourceMappingURL=qceco.js.map
