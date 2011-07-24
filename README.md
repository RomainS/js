My personnal scripts
====================

You'll find here all the code I wrote in order to reuse it in multiple projects. Everything here is being used
in real projects, but some contributions can still be buggy.

I hope you will find something usefull there !

Sébastien

ScrollFollower
--------------

ScrollFollower is a Prototype.js class, wich gives the ability to create elements with the new Gmail toolbar behavior : 
element becomes fixed when the user scrolls down, and gets back its initial position when he scrolls to top.

Usage :
	Event.observe(document,'dom:loaded', function() {
		var follower = new ScrollFollower('id',{
			autoGhost : true,
			fixedClass : 'my_custom_class'
		}) ;
	});
	