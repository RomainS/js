/**
 * Gives an element the same behavior than the new Gmail toolbar : fix it to the top of the page when
 * the user scroll down, and gives it its original position when back to top.
 * 
 * Usage is simple : 
 * new ScrollFollower('id') ;
 * new ScrollFollower('id',{option : value});
 * 
 * Options :
 * - autoGhost (bool) : generate or not a ghost for not absolutized element
 * - fixedClass (string) : css class to add when the element is fixed
 * - absolutizedClass (string) : css class to add when the element is absolutized
 * 
 * Notes : 
 * - Require Prototype.js (jQuery has its own tools)
 * - IE6 don't support the css "fixed" position, so you should avoid using this class with it.
 * - I wrote that code in a few minutes and I didn't test it a lot, so it's certainly a little buggy.
 * 
 * @author		Sébastien Charrier <scharrier@gmail.com>
 * @copyright	Copyright 2011, Sébastien Charrier (http://sebastien-charrier.com)
 * @license		http://opensource.org/licenses/bsd-license.php The BSD License
 */
ScrollFollower = Class.create({
	/**
	 * The element we want to follow us
	 * 
	 * @var Element
	 */
	_main : null,
	
	/**
	 * Options
	 * 
	 * @var Object
	 */
	_options : null,
	
	/**
	 * The ghost, for cases where the main element is not absolute : it's
	 * a hack in order to keep the layout good.
	 * 
	 * @var Element
	 */
	_ghost : null,
	
	/**
	 * Initial top offset of the main element.
	 * 
	 * @var Object
	 */
	_fixedOffset : null,
	
	/**
	 * Offset relative to first parent
	 * 
	 * @var Object
	 */ 
	_positionedOffset : null,
	
	/**
	 * Offset of the first relative parent
	 * 
	 * @var Object
	 */ 
	_parentOffset : null,
	
	/**
	 * Calculated top offset
	 * 
	 * @var Integer
	 */ 
	_top : null,
	
	/**
	 * Flag : actually fixed or not ?
	 *
	 * @var bool
	 */  
	_fixed : false, 
	
	/**
	 * Constructor
	 * 
	 * @param	Mixed	Id of the element, or the element (String or Element)
	 */
	initialize : function(id, options) {
		this._main = $(id) ;
		
		if (!this._main) {
			throw 'Element #' + id + ' doesn\'t exist' ;
		}
		
		this._options = $H({
			'autoGhost' : true,
			'fixedClass' : 'scroll_follower_fixed'
		}).merge(options).toObject() ;
		
		// Initialize style properties and offsets
		this._initialize() ;
		
		// On scroll : yea baby, keep my toolbar in place
		Event.observe(window, 'scroll', this._scroll.bind(this)) ;
	},
	
	/**
	 * Initialize style properties and offsets
	 */ 
	_initialize : function() {
		// Initial offset
		this._fixedOffset = this._main.cumulativeOffset() ;
		this._positionedOffset = this._main.positionedOffset() ;
		this._parentOffset = this._main.getOffsetParent().cumulativeOffset() ;
		this._top = this._positionedOffset.top - this._main.getHeight() ;
		
		// Save the initial style properties we'll have to overwrite
		var properties = $H({'position' : 'static'}) ;
		if (this._main.style.position) { properties.set('position', this._main.style.position) ; }
		if (this._main.style.top) { properties.set('top', this._main.style.top) ; }
		if (this._main.style.left) { properties.set('left', this._main.style.left) ; }
		 
		this._initialProperties = properties;
		
		// Fix the dimensions
		this._main.style.height = this._main.getHeight() + 'px' ;
		this._main.style.width = this._main.getWidth() + 'px' ;
	},
	
	/**
	 * Callback : when user scroll, we check if the main element should be fixed
	 * or absolutized.
	 */
	_scroll : function() {
		if (!this._fixed && this._scrollOffset().top > this._top) {
			// Ok, fix it !
			this._fix() ;
			
		} else if (this._fixed && this._scrollOffset().top <= this._top) {
			// Back to initial : absolutize it
			this._reset() ;
			
		}
	},
	
	/**
	 * Fix the element
	 */
	_fix : function() {
		this._main.style.position = 'fixed' ;
		this._main.style.top = 0 ;
		this._main.style.left = this._fixedOffset.left + 'px' ;
		this._main.style.width
		this._main.addClassName(this._options.fixedClass) ;
		this._fixed = true ;
	},
	
	/**
	 * Reset the element
	 */
	_reset : function() {
		this._main.removeClassName(this._options.fixedClass) ;
		if (this._initialProperties.keys().length) {
			this._initialProperties.each(function(property) {
				this._main.style[property[0]] = property[1] ;
			}, this) ;
		}
		this._fixed = false ;
	},
	
	/**
	 * Calulate current scroll offset of the element
	 */
	_scrollOffset : function() {
		var cumulative = this._main.cumulativeScrollOffset() ;
		cumulative.top = cumulative.top - this._parentOffset.top ;
		cumulative.left = cumulative.left - this._parentOffset.left ;
		return cumulative ;
	}
}) ;