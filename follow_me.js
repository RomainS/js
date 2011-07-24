/**
 * Gives an element the same behavior than the new Gmail toolbar : fix it to the top of the page when
 * the user scroll down, and gives it its original position when back to top.
 * 
 * Usage is simple : 
 * new FollowMe('id') ;
 * 
 * Notes : 
 * - Require Prototype.js (jQuery as it's own tools)
 * - IE6 don't support the css "fixed" position, so you should avoid using this class with it.
 * - I wrote that code in a few minutes and I didn't test it a lot, so it's certainly a little buggy.
 * 
 * @author		Sébastien Charrier <scharrier@gmail.com>
 * @copyright	Copyright 2011, Sébastien Charrier (http://sebastien-charrier.com)
 * @license		http://opensource.org/licenses/bsd-license.php The BSD License
 */
FollowMe = Class.create({
	/**
	 * The element we want to follow us
	 * 
	 * @var Element
	 */
	_main : null,
	
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
	initialize : function(id) {
		this._main = $(id) ;
		
		if (!this._main) {
			throw 'Element #' + id + ' doesn\'t exist' ;
		}
		
		// Save the initial offset
		this._initialTop = this._main.cumulativeOffset().top ;
		
		// If the element is not already absolutized, let's Prototype.js do it
		if (this._main.style.position !== 'absolute') {
			this._ghost = this._main.clone() ;
			this._ghost.style.height = this._main.getHeight() + 'px' ;
			this._ghost.style.width = this._main.getWidth() + 'px' ;
			this._main.insert({after:this._ghost}) ;
			this._main.absolutize() ;
		}
		
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
			this._main.addClassName('follow_me_fixed') ;
			this._main.removeClassName('follow_me_absolutized') ;
		} else {
			// Back to initial : absolutize it
			this._main.style.position = 'absolute' ;
			this._main.style.top = this._initialTop + 'px' ;
			this._main.addClassName('follow_me_absolutized') ;
			this._main.removeClassName('follow_me_fixed') ;
		}
	}
}) ;