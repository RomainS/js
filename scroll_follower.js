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
	 * @var Integer
	 */
	_initialTop : null,
	
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
			'fixedClass' : 'scroll_follower_fixed',
			'absolutizedClass' : 'scroll_follower_absolutized'
		}).merge(options).toObject() ;
		
		// Save the initial offset
		this._initialTop = this._main.cumulativeOffset().top ;
		
		// If the element is not already absolutized, let's Prototype.js do it
		if (this._options.autoGhost, this._main.style.position !== 'absolute') {
			this._ghost = this._main.clone() ;
			this._ghost.style.height = this._main.getHeight() + 'px' ;
			this._ghost.style.width = this._main.getWidth() + 'px' ;
			this._main.insert({after:this._ghost}) ;
			this._main.absolutize() ;
		}
		
		this._main.addClassName(this._options.absolutizedClass) ;
		
		// On scroll : yea baby, keep my toolbar in place
		Event.observe(window, 'scroll', this._scroll.bind(this)) ;
	},
	
	/**
	 * Callback : when user scroll, we check if the main element should be fixed
	 * or absolutized.
	 */
	_scroll : function() {
		if (this._main.cumulativeScrollOffset().top > this._initialTop) {
			// Ok, fix it !
			this._main.style.position = 'fixed' ;
			this._main.style.top = 0 ;
			this._main.addClassName(this._options.fixedClass) ;
			this._main.removeClassName(this._options.absolutizedClass) ;
		} else {
			// Back to initial : absolutize it
			this._main.style.position = 'absolute' ;
			this._main.style.top = this._initialTop + 'px' ;
			this._main.addClassName(this._options.absolutizedClass) ;
			this._main.removeClassName(this._options.fixedClass) ;
		}
	}
}) ;