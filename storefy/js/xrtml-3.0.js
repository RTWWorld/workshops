// ie8, ie7 e ie9 quirks does not support delete object
try {
    delete window.xRTML;
}
catch (e) {
    window["xRTML"] = undefined;
}
(function (xRTML, undefined) {
    /**
    *   @module xRTML.Event Provides cross-browser support for events of HTML tags and supplies xRTML tags with event capabilities. 
    */
    (function (Event, undefined) {

        /*
        *   Contains methods encapsulating browser-specific event functionality.
        *   @var {private} Event.?
        */
        var Manager = {

            bind: function (element, events) {
                if (element.bind) {
                    element.bind(events);
                }
                else {
                    for (var type in events) {
                        if (element.addEventListener)
                            element.addEventListener(type, events[type], false);
                        else {

                            element.attachEvent ? element.attachEvent('on' + type, events[type]) : element[type] = events[type];
                        }
                    }
                }
            },

            unbind: function (element, events) {
                if (element.unbind) {
                    element.unbind(events);
                }
                else {
                    for (var type in events) {
                        if (element.removeEventListener) {
                            element.removeEventListener(type, events[type], false);
                        }
                        else
                            if (element.detachEvent) {
                                element.detachEvent("on" + type, events[type]);
                            }
                            else {
                                if (element[type])
                                    delete element[type];
                            }
                    }
                }
            }
        },

        /*
        *   Provides custom objects with event funcionality.
        *   @var {private} Event.?
        */
		Provider = {
		    /*
		    *   Registers an event handler function (event listener) for the specified event on a single target.    
		    *   @param {String} type A string representing the event type to listen for.
		    *   @param {Function} callback Event listener function which will handle the event when it occurs.
		    *   @function {public void} ?
		    */
		    bind: function (events) {
		        for (var type in events) {
		            if (typeof events[type] === 'function') {
		                if (!this.listeners[type])
		                    this.listeners[type] = [];
		                this.listeners[type].push(events[type]);
		            }
		        }
		    },

		    /*
		    *   Removes the specified event handler from the current target element.         
		    *   @param {String} type Specifies the name of the event that the event handler listens for
		    *   @param {Function} callback Reference to the event handler function to remove
		    *   @function {public void} ?
		    */
		    unbind: function (events) {
		        for (var type in events) {
		            if (this.listeners[type] instanceof Array) {
		                var listeners = this.listeners[type];
		                for (var i = 0, len = listeners.length; i < len; i++) {
		                    if (listeners[i] === events[type]) {
		                        listeners.splice(i, 1);
		                        break;
		                    }
		                }
		            }
		        }
		    },

		    /*
		    *   Dispatches the specified event to the current element.
		    *   @param {String} type Specifies the name of the event to be dispatched.
		    *   @param {Object} data Arguments to be passed in the event.
		    *   @function {public void} ?    
		    */
		    fire: function (events) {
		        var event;
		        for (var type in events) {
		            event = {
		                type: type,
		                target: this
		            };
		            for (var key in events[type]) {
		                var obj = events[type][key];
		                event[key] = obj;
		            }
		            if (this.listeners[event.type] instanceof Array) {
		                var listeners = new Array();

		                for (var i = 0; i < this.listeners[event.type].length; i++) {
		                    listeners.push(this.listeners[event.type][i]);
		                }

		                for (var i = 0; i < listeners.length; i++) {
		                    listeners[i].call(this, event);
		                }
		            }
		        }
		    }
		};

        /**
        *   Registers event handlers on the specified object's events.
        *   @param {Object} element The target whose events the handlers will be set .
        *   @param {Objec} events The event handlers to be added to the element. Each attribute is the name of an event and the handler is its corresponding value.
        *   @function {public void} xRTML.Event.?
        */
        Event.bind = Manager.bind;
        /**
        *   Unregisters an event handler from the specified object's events       
        *   @param {Object} element The target whose events the handlers will be set .
        *   @param {Objec} events The event handlers to be added to the element. Each attribute is the name of an event and the handler is its corresponding value.
        *   @function {public void} xRTML.Event.?
        */
        Event.unbind = Manager.unbind;
        /**
        *   @function {public void} xRTML.Event.? Provides objects with the event funcionality.
        *   @param {Object} target Object to be added the event capability.
        */
        Event.extend = function (target) {
            if (!target.listeners)
                target.listeners = {};

            for (var func in Provider) {
                target[func] = Provider[func];
            }
        };
    })(xRTML.Event = xRTML.Event || {})
    /**
    * @end
    */
})(window.xRTML = window.xRTML || {});
(function (window) {
    /**
    *   @project xRTML
    *   @version 3.0
    *   @author IBT - Internet Business Technologies
    */

    /**
    *   @namespace xRTML
    */
    /**
    *   @module xRTML
    */
    (function (xRTML, undefined) {

        xRTML.Event.extend(xRTML);

        /**
        *  @property {public Number} xRTML.version The current xRTML version. The xRTML Library versioning policy is roughly as follows:
        *  Major Version: When a major refactor to the framework occurs, or a major change in the philosophy of the Framework intents takes place.
        *  Minor Version: When minor features or significant fixes have been added.
        *  Revision: When minor bugs are fixed.
        *  The format is [Major Version number].[Minor Version number].[Revision number]
        */
        xRTML.version = '3.0.0';

        /**
        *  @property {public String} xRTML.lastestBuild The date and time that the latest release build occured. The format is yyyy.MM.dd.HH.mm.ss
        */
        xRTML.lastestBuild = '08-10-2012 10:06:38';

        /**
        *  @function {public Boolean} xRTML.domLoaded Checks if the page is ready for manipulation.
        *  @returns if the page is ready for manipulation
        */
        xRTML.domLoaded = function () {
            return (document.readyState == "loaded" || document.readyState == "complete");
        };

        /**
        *  @property {public Boolean} xRTML.isReady Indicates if the xRTML is fully loaded.
        */
        xRTML.isReady = false;

        /**
        *  @function {public void} xRTML.ready Event handler raised when the xRTML is fully loaded.
        *  @param {Function} fn Called when xRTML has been initiated.
        */
        xRTML.ready = function (fn) {
            !xRTML.isReady ? xRTML.bind({ ready: fn }) : fn();
        };

    })(window.xRTML = window.xRTML || {});
    /**
    * @end
    */
})(window);
(function (window, undefined) {
    /*!
    * Sizzle CSS Selector Engine
    *  Copyright 2012, The Dojo Foundation
    *  Released under the MIT, BSD, and GPL Licenses.
    *  More information: http://sizzlejs.com/
    */
    /**
    *  @struct xRTML.Sizzle Sizzle engine enclosed in the xRTML namespace to ensure its expected behaviour.
    */
	(function (xRTML, undefined) {

		var tokenize,
			cachedruns,
			dirruns,
			sortOrder,
			siblingCheck,

			document = window.document,
			docElem = document.documentElement,

			expando = ( "sizcache" + Math.random() ).replace( ".", "" ),
			done = 0,

			slice = [].slice,
			push = [].push,
			strundefined = "undefined",
			hasDuplicate = false,
			baseHasDuplicate = true,

			// Regex

			// http://www.w3.org/TR/css3-syntax/#characters
			characterEncoding = "(?:[-\\w]|[^\\x00-\\xa0]|\\\\.)",
			// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
			whitespace = "[\\x20\\t\\n\\r\\f]",
			// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
			operators = "([*^$|!~]?={1})",
			// Javascript identifier syntax (with added # for unquoted hash)
			identifier = "(?:-?[#_a-zA-Z]{1}[-\\w]*|[^\\x00-\\xa0]+|\\\\.+)",
			attributes = "\\[" + whitespace + "*(" + characterEncoding + "+)" + whitespace +
				"*(?:" + operators + whitespace + "*(?:(['\"])(.*?)\\3|(" + identifier + "+)|)|)" + whitespace + "*\\]",
			pseudos = ":(" + characterEncoding + "+)(?:\\(([\"']?)([^()]*|.*)\\2\\))?",
			pos = ":(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\))?(?=[^\\-]|$)",
			combinators = whitespace + "*([\\x20\\t\\n\\r\\f>+~])" + whitespace + "*",

			rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
			rcombinators = new RegExp( "^" + combinators ),
			rtokens = new RegExp( "(" +
				attributes.replace( "3", "4" ) + "|" +
				pseudos.replace( "2", "8" ) +
				"|\\\\[>+~]|[^\\x20\\t\\n\\r\\f>+~]|\\\\.)+|" +
				combinators, "g" ),
			rstartWithWhitespace = new RegExp( "^" + whitespace ),

			rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

			rsibling = /^[\x20\t\n\r\f]*[+~][\x20\t\n\r\f]*$/,
			rendsWithNot = /:not\($/,

			rnth = /(-?)(\d*)(?:n([+\-]?\d*))?/,
			rnonDigit = /\D/,
			rheader = /h\d/i,
			rinputs = /input|select|textarea|button/i,

			radjacent = /^\+|[\x20\t\n\r\f]*/g,
			rbackslash = /\\(?!\\)/g,

			// Split on commas not within brackets/parens/quotes
			// ignoring space: ( [^,\\\[\]]+ | \[[^\[]*\] | \([^\(]*\) | \\. )+
			rgroups = /([^,\\\[\]]+|\[[^\[]*\]|\([^\(]*\)|\\.)+/g,

			matchExpr = {
				ID: new RegExp( "^#(" + characterEncoding + "+)" ),
				CLASS: new RegExp( "^\\.(" + characterEncoding + "+)" ),
				NAME: new RegExp( "^\\[name=['\"]?(" + characterEncoding + "+)['\"]?\\]" ),
				TAG: new RegExp( "^(" + characterEncoding.replace( "[-", "[-\\*" ) + "+)" ),
				ATTR: new RegExp( "^" + attributes ),
				PSEUDO: new RegExp( "^" + pseudos ),
				CHILD: new RegExp( "^:(only|nth|last|first)-child(?:\\(" + whitespace + "*(even|odd|(?:[+\\-]?\\d+|(?:[+\\-]?\\d*)?n" +
					whitespace + "*(?:[+\\-]" + whitespace + "*\\d+)?))" + whitespace + "*\\))?", "i" ),
				POS: new RegExp( pos, "ig" ),
				// For use in libraries implementing .is(), an unaltered POS
				globalPOS: new RegExp( pos, "i" )
			},

			classCache = {},
			cachedClasses = [],
			compilerCache = {},
			cachedSelectors = [],

			// Mark a function for use in filtering
			markFunction = function( fn ) {
				fn.sizzleFilter = true;
				return fn;
			},

			// Returns a function to use in pseudos for input types
			createInputFunction = function( type ) {
				return function( elem ) {
					// Check the input's nodeName and type
					return elem.nodeName.toLowerCase() === "input" && elem.type === type;
				};
			},

			// Returns a function to use in pseudos for buttons
			createButtonFunction = function( type ) {
				return function( elem ) {
					var name = elem.nodeName.toLowerCase();
					return (name === "input" || name === "button") && elem.type === type;
				};
			},

			// Used for testing something on an element
			assert = function( fn ) {
				var pass = false,
					div = document.createElement("div");
				try {
					pass = fn( div );
				} catch (e) {}
				// release memory in IE
				div = null;
				return pass;
			},

			// Check if attributes should be retrieved by attribute nodes
			assertAttributes = assert(function( div ) {
				div.innerHTML = "<select></select>";
				var type = typeof div.lastChild.getAttribute("multiple");
				// IE8 returns a string for some attributes even when not present
				return type !== "boolean" && type !== "string";
			}),

			// Check if getElementById returns elements by name
			// Check if getElementsByName privileges form controls or returns elements by ID
			assertGetIdNotName,
			assertUsableName = assert(function( div ) {
				// Inject content
				div.id = expando + 0;
				div.innerHTML = "<a name='" + expando + "'/><div name='" + expando + "'/>";
				docElem.insertBefore( div, docElem.firstChild );

				// Test
				var pass = document.getElementsByName &&
					// buggy browsers will return fewer than the correct 2
					document.getElementsByName( expando ).length ===
					// buggy browsers will return more than the correct 0
					2 + document.getElementsByName( expando + 0 ).length;
				assertGetIdNotName = !document.getElementById( expando );

				// Cleanup
				docElem.removeChild( div );

				return pass;
			}),

			// Check if the browser returns only elements
			// when doing getElementsByTagName("*")
			assertTagNameNoComments = assert(function( div ) {
				div.appendChild( document.createComment("") );
				return div.getElementsByTagName("*").length === 0;
			}),

			// Check if getAttribute returns normalized href attributes
			assertHrefNotNormalized = assert(function( div ) {
				div.innerHTML = "<a href='#'></a>";
				return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
					div.firstChild.getAttribute("href") === "#";
			}),

			// Check if getElementsByClassName can be trusted
			assertUsableClassName = assert(function( div ) {
				// Opera can't find a second classname (in 9.6)
				div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
				if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
					return false;
				}

				// Safari caches class attributes, doesn't catch changes (in 3.2)
				div.lastChild.className = "e";
				return div.getElementsByClassName("e").length !== 1;
			});

		var Sizzle = function( selector, context, results, seed ) {
			results = results || [];
			context = context || document;
			var match, elem, xml, m,
				nodeType = context.nodeType;

			if ( nodeType !== 1 && nodeType !== 9 ) {
				return [];
			}

			if ( !selector || typeof selector !== "string" ) {
				return results;
			}

			xml = isXML( context );

			if ( !xml && !seed ) {
				if ( (match = rquickExpr.exec( selector )) ) {
					// Speed-up: Sizzle("#ID")
					if ( (m = match[1]) ) {
						if ( nodeType === 9 ) {
							elem = context.getElementById( m );
							// Check parentNode to catch when Blackberry 4.6 returns
							// nodes that are no longer in the document #6963
							if ( elem && elem.parentNode ) {
								// Handle the case where IE, Opera, and Webkit return items
								// by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}
						} else {
							// Context is not a document
							if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
								contains( context, elem ) && elem.id === m ) {
								results.push( elem );
								return results;
							}
						}
					// Speed-up: Sizzle("TAG")
					} else if ( match[2] ) {
						push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
						return results;

					// Speed-up: Sizzle(".CLASS")
					} else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
						push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
						return results;
					}
				}
			}

			// All others
			return select( selector, context, results, seed, xml );
		};

		var Expr = Sizzle.selectors = {

			// Can be adjusted by the user
			cacheLength: 50,

			match: matchExpr,

			order: [ "ID", "TAG" ],

			attrHandle: {},

			createPseudo: markFunction,

			find: {
				ID: assertGetIdNotName ?
					function( id, context, xml ) {
						if ( typeof context.getElementById !== strundefined && !xml ) {
							var m = context.getElementById( id );
							// Check parentNode to catch when Blackberry 4.6 returns
							// nodes that are no longer in the document #6963
							return m && m.parentNode ? [m] : [];
						}
					} :
					function( id, context, xml ) {
						if ( typeof context.getElementById !== strundefined && !xml ) {
							var m = context.getElementById( id );

							return m ?
								m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
									[m] :
									undefined :
								[];
						}
					},

				TAG: assertTagNameNoComments ?
					function( tag, context ) {
						if ( typeof context.getElementsByTagName !== strundefined ) {
							return context.getElementsByTagName( tag );
						}
					} :
					function( tag, context ) {
						var results = context.getElementsByTagName( tag );

						// Filter out possible comments
						if ( tag === "*" ) {
							var elem,
								tmp = [],
								i = 0;

							for ( ; (elem = results[i]); i++ ) {
								if ( elem.nodeType === 1 ) {
									tmp.push( elem );
								}
							}

							results = tmp;
						}
						return results;
					}
			},

			relative: {
				">": { dir: "parentNode", firstMatch: true },
				" ": { dir: "parentNode" },
				"+": { dir: "previousSibling", firstMatch: true },
				"~": { dir: "previousSibling" }
			},

			preFilter: {
				ATTR: function( match ) {
					match[1] = match[1].replace( rbackslash, "" );

					// Move the given value to match[3] whether quoted or unquoted
					match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

					if ( match[2] === "~=" ) {
						match[3] = " " + match[3] + " ";
					}

					return match.slice( 0, 4 );
				},

				CHILD: function( match ) {
					match[1] = match[1].toLowerCase();

					if ( match[1] === "nth" ) {
						if ( !match[2] ) {
							Sizzle.error( match[0] );
						}

						match[2] = match[2].replace( radjacent, "" );

						// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
						var test = rnth.exec(
							match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
							!rnonDigit.test( match[2] ) && "0n+" + match[2] || match[2] );

						// calculate the numbers (first)n+(last) including if they are negative
						match[2] = +(test[1] + (test[2] || 1));
						match[3] = +test[3];
					} else if ( match[2] ) {
						Sizzle.error( match[0] );
					}

					return match;
				},

				PSEUDO: function( match ) {
					return matchExpr.CHILD.test( match[0] ) ?
						null :
						match;
				}
			},

			filter: {
				ID: assertGetIdNotName ?
					function( id ) {
						id = id.replace( rbackslash, "" );
						return function( elem ) {
							return elem.getAttribute("id") === id;
						};
					} :
					function( id ) {
						id = id.replace( rbackslash, "" );
						return function( elem ) {
							var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
							return node && node.value === id;
						};
					},

				TAG: function( nodeName ) {
					if ( nodeName === "*" ) {
						return function() { return true; };
					}
					nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

					return function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
				},

				CLASS: function( className ) {
					var pattern = classCache[ className ];
					if ( !pattern ) {
						pattern = classCache[ className ] = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" );
						cachedClasses.push( className );
						// Avoid too large of a cache
						if ( cachedClasses.length > Expr.cacheLength ) {
							delete classCache[ cachedClasses.shift() ];
						}
					}
					return function( elem ) {
						return pattern.test( elem.className || elem.getAttribute("class") || "" );
					};
				},

				ATTR: function( name, operator, check ) {
					if ( !operator ) {
						return function( elem ) {
							return Sizzle.attr( elem, name ) != null;
						};
					}

					return function( elem ) {
						var result = Sizzle.attr( elem, name ),
							value = result + "";

						if ( result == null ) {
							return operator === "!=";
						}

						switch ( operator ) {
							case "=":
								return value === check;
							case "!=":
								return value !== check;
							case "^=":
								return check && value.indexOf( check ) === 0;
							case "*=":
								return check && value.indexOf( check ) > -1;
							case "$=":
								return check && value.substr( value.length - check.length ) === check;
							case "~=":
								return ( " " + value + " " ).indexOf( check ) > -1;
							case "|=":
								return value === check || value.substr( 0, check.length + 1 ) === check + "-";
						}
					};
				},

				CHILD: function( type, first, last ) {

					if ( type === "nth" ) {
						var doneName = done++;

						return function( elem ) {
							var parent, diff,
								count = 0,
								node = elem;

							if ( first === 1 && last === 0 ) {
								return true;
							}

							parent = elem.parentNode;

							if ( parent && (parent[ expando ] !== doneName || !elem.sizset) ) {
								for ( node = parent.firstChild; node; node = node.nextSibling ) {
									if ( node.nodeType === 1 ) {
										node.sizset = ++count;
										if ( node === elem ) {
											break;
										}
									}
								}

								parent[ expando ] = doneName;
							}

							diff = elem.sizset - last;

							if ( first === 0 ) {
								return diff === 0;

							} else {
								return ( diff % first === 0 && diff / first >= 0 );
							}
						};
					}

					return function( elem ) {
						var node = elem;

						switch ( type ) {
							case "only":
							case "first":
								while ( (node = node.previousSibling) ) {
									if ( node.nodeType === 1 ) {
										return false;
									}
								}

								if ( type === "first" ) {
									return true;
								}

								node = elem;

								/* falls through */
							case "last":
								while ( (node = node.nextSibling) ) {
									if ( node.nodeType === 1 ) {
										return false;
									}
								}

								return true;
						}
					};
				},

				PSEUDO: function( pseudo, possibleQuote, argument, context, xml ) {
					// pseudo-class names are case-insensitive
					// http://www.w3.org/TR/selectors/#pseudo-classes
					// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
					var fn = Expr.pseudos[ pseudo ] || Expr.pseudos[ pseudo.toLowerCase() ];

					if ( !fn ) {
						Sizzle.error( "unsupported pseudo: " + pseudo );
					}

					// The user may set fn.sizzleFilter to indicate
					// that arguments are needed to create the filter function
					// just as Sizzle does
					if ( !fn.sizzleFilter ) {
						return fn;
					}

					return fn( argument, context, xml );
				}
			},

			pseudos: {
				not: markFunction(function( selector, context, xml ) {
					var matcher = compile( selector, context, xml );
					return function( elem ) {
						return !matcher( elem );
					};
				}),

				enabled: function( elem ) {
					return elem.disabled === false;
				},

				disabled: function( elem ) {
					return elem.disabled === true;
				},

				checked: function( elem ) {
					// In CSS3, :checked should return both checked and selected elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					var nodeName = elem.nodeName.toLowerCase();
					return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
				},

				selected: function( elem ) {
					// Accessing this property makes selected-by-default
					// options in Safari work properly
					if ( elem.parentNode ) {
						elem.parentNode.selectedIndex;
					}

					return elem.selected === true;
				},

				parent: function( elem ) {
					return !!elem.firstChild;
				},

				empty: function( elem ) {
					return !elem.firstChild;
				},

				contains: markFunction(function( text ) {
					return function( elem ) {
						return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
					};
				}),

				has: markFunction(function( selector ) {
					return function( elem ) {
						return !!Sizzle( selector, elem ).length;
					};
				}),

				header: function( elem ) {
					return rheader.test( elem.nodeName );
				},

				text: function( elem ) {
					var attr = elem.getAttribute( "type" ), type = elem.type;
					// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
					// use getAttribute instead to test this case
					return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === null || attr.toLowerCase() === type );
				},

				// Input types
				radio: createInputFunction("radio"),
				checkbox: createInputFunction("checkbox"),
				file: createInputFunction("file"),
				password: createInputFunction("password"),
				image: createInputFunction("image"),

				submit: createButtonFunction("submit"),
				reset: createButtonFunction("reset"),

				button: function( elem ) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && "button" === elem.type || name === "button";
				},

				input: function( elem ) {
					return rinputs.test( elem.nodeName );
				},

				focus: function( elem ) {
					var doc = elem.ownerDocument;
					return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
				},

				active: function( elem ) {
					return elem === elem.ownerDocument.activeElement;
				}
			},

			setFilters: {
				first: function( elements, argument, not ) {
					return not ? elements.slice( 1 ) : [ elements[0] ];
				},

				last: function( elements, argument, not ) {
					var elem = elements.pop();
					return not ? elements : [ elem ];
				},

				even: function( elements, argument, not ) {
					var results = [],
						i = not ? 1 : 0,
						len = elements.length;
					for ( ; i < len; i = i + 2 ) {
						results.push( elements[i] );
					}
					return results;
				},

				odd: function( elements, argument, not ) {
					var results = [],
						i = not ? 0 : 1,
						len = elements.length;
					for ( ; i < len; i = i + 2 ) {
						results.push( elements[i] );
					}
					return results;
				},

				lt: function( elements, argument, not ) {
					return not ? elements.slice( +argument ) : elements.slice( 0, +argument );
				},

				gt: function( elements, argument, not ) {
					return not ? elements.slice( 0, +argument + 1 ) : elements.slice( +argument + 1 );
				},

				eq: function( elements, argument, not ) {
					var elem = elements.splice( +argument, 1 );
					return not ? elements : elem;
				}
			}
		};

		// Deprecated
		Expr.setFilters.nth = Expr.setFilters.eq;

		// Back-compat
		Expr.filters = Expr.pseudos;

		// IE6/7 return a modified href
		if ( !assertHrefNotNormalized ) {
			Expr.attrHandle = {
				href: function( elem ) {
					return elem.getAttribute( "href", 2 );
				},
				type: function( elem ) {
					return elem.getAttribute("type");
				}
			};
		}

		// Add getElementsByName if usable
		if ( assertUsableName ) {
			Expr.order.push("NAME");
			Expr.find.NAME = function( name, context ) {
				if ( typeof context.getElementsByName !== strundefined ) {
					return context.getElementsByName( name );
				}
			};
		}

		// Add getElementsByClassName if usable
		if ( assertUsableClassName ) {
			Expr.order.splice( 1, 0, "CLASS" );
			Expr.find.CLASS = function( className, context, xml ) {
				if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
					return context.getElementsByClassName( className );
				}
			};
		}

		// If slice is not available, provide a backup
		try {
			slice.call( docElem.childNodes, 0 )[0].nodeType;
		} catch ( e ) {
			slice = function( i ) {
				var elem, results = [];
				for ( ; (elem = this[i]); i++ ) {
					results.push( elem );
				}
				return results;
			};
		}

		var isXML = Sizzle.isXML = function( elem ) {
			// documentElement is verified for cases where it doesn't yet exist
			// (such as loading iframes in IE - #4833)
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};

		// Element contains another
		var contains = Sizzle.contains = docElem.compareDocumentPosition ?
			function( a, b ) {
				return !!( a.compareDocumentPosition( b ) & 16 );
			} :
			docElem.contains ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
			} :
			function( a, b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
				return false;
			};

		/**
		 * Utility function for retrieving the text value of an array of DOM nodes
		 * @param {Array|Element} elem
		 */
		var getText = Sizzle.getText = function( elem ) {
			var node,
				ret = "",
				i = 0,
				nodeType = elem.nodeType;

			if ( nodeType ) {
				if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
					// Use textContent for elements
					// innerText usage removed for consistency of new lines (see #11153)
					if ( typeof elem.textContent === "string" ) {
						return elem.textContent;
					} else {
						// Traverse its children
						for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
							ret += getText( elem );
						}
					}
				} else if ( nodeType === 3 || nodeType === 4 ) {
					return elem.nodeValue;
				}
				// Do not include comment or processing instruction nodes
			} else {

				// If no nodeType, this is expected to be an array
				for ( ; (node = elem[i]); i++ ) {
					// Do not traverse comment nodes
					ret += getText( node );
				}
			}
			return ret;
		};

		Sizzle.attr = function( elem, name ) {
			var xml = isXML( elem );
			if ( !xml ) {
				name = name.toLowerCase();
			}
			if ( Expr.attrHandle[ name ] ) {
				return Expr.attrHandle[ name ]( elem );
			}
			if ( assertAttributes || xml ) {
				return elem.getAttribute( name );
			}
			var attr = (elem.attributes || {})[ name ];
			return attr ?
				typeof elem[ name ] === "boolean" ?
					elem[ name ] ? name : null :
					attr.specified ? attr.value : null :
				null;
		};

		Sizzle.error = function( msg ) {
			throw new Error( "Syntax error, unrecognized expression: " + msg );
		};

		// Check if the JavaScript engine is using some sort of
		// optimization where it does not always call our comparision
		// function. If that is the case, discard the hasDuplicate value.
		//   Thus far that includes Google Chrome.
		[0, 0].sort(function() {
			return (baseHasDuplicate = 0);
		});


		if ( docElem.compareDocumentPosition ) {
			sortOrder = function( a, b ) {
				if ( a === b ) {
					hasDuplicate = true;
					return 0;
				}

				return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
					a.compareDocumentPosition :
					a.compareDocumentPosition(b) & 4
				) ? -1 : 1;
			};

		} else {
			sortOrder = function( a, b ) {
				// The nodes are identical, we can exit early
				if ( a === b ) {
					hasDuplicate = true;
					return 0;

				// Fallback to using sourceIndex (in IE) if it's available on both nodes
				} else if ( a.sourceIndex && b.sourceIndex ) {
					return a.sourceIndex - b.sourceIndex;
				}

				var al, bl,
					ap = [],
					bp = [],
					aup = a.parentNode,
					bup = b.parentNode,
					cur = aup;

				// If the nodes are siblings (or identical) we can do a quick check
				if ( aup === bup ) {
					return siblingCheck( a, b );

				// If no parents were found then the nodes are disconnected
				} else if ( !aup ) {
					return -1;

				} else if ( !bup ) {
					return 1;
				}

				// Otherwise they're somewhere else in the tree so we need
				// to build up a full list of the parentNodes for comparison
				while ( cur ) {
					ap.unshift( cur );
					cur = cur.parentNode;
				}

				cur = bup;

				while ( cur ) {
					bp.unshift( cur );
					cur = cur.parentNode;
				}

				al = ap.length;
				bl = bp.length;

				// Start walking down the tree looking for a discrepancy
				for ( var i = 0; i < al && i < bl; i++ ) {
					if ( ap[i] !== bp[i] ) {
						return siblingCheck( ap[i], bp[i] );
					}
				}

				// We ended someplace up the tree so do a sibling check
				return i === al ?
					siblingCheck( a, bp[i], -1 ) :
					siblingCheck( ap[i], b, 1 );
			};

			siblingCheck = function( a, b, ret ) {
				if ( a === b ) {
					return ret;
				}

				var cur = a.nextSibling;

				while ( cur ) {
					if ( cur === b ) {
						return -1;
					}

					cur = cur.nextSibling;
				}

				return 1;
			};
		}

		// Document sorting and removing duplicates
		Sizzle.uniqueSort = function( results ) {
			var elem,
				i = 1;

			if ( sortOrder ) {
				hasDuplicate = baseHasDuplicate;
				results.sort( sortOrder );

				if ( hasDuplicate ) {
					for ( ; (elem = results[i]); i++ ) {
						if ( elem === results[ i - 1 ] ) {
							results.splice( i--, 1 );
						}
					}
				}
			}

			return results;
		};

		function multipleContexts( selector, contexts, results, seed ) {
			for ( var i = 0, len = contexts.length; i < len; i++ ) {
				Sizzle( selector, contexts[i], results, seed );
			}
		}

		function handlePOSGroup( selector, posfilter, argument, contexts, seed, not ) {
			var results = [],
				fn = Expr.setFilters[ posfilter.toLowerCase() ];

			if ( !fn ) {
				Sizzle.error( posfilter );
			}

			if ( selector ) {
				multipleContexts( selector, contexts, results, seed );
			} else {
				results = seed;
			}
			return results.length ? fn( results, argument, not ) : [];
		}

		function handlePOS( selector, context, results, seed ) {
			var match, not, anchor, ret, elements,
				currentContexts, part, lastIndex,
				groups = selector.match( rgroups ),
				i = 0,
				len = groups.length,
				rpos = matchExpr.POS,
				// This is generated here in case matchExpr.POS is extended
				rposgroups = new RegExp( "^" + matchExpr.POS.source + "(?!" + whitespace + ")", "i" ),
				// This is for making sure non-participating
				// matching groups are represented cross-browser (IE6-8)
				setUndefined = function() {
					for ( var i = 1, len = arguments.length - 2; i < len; i++ ) {
						if ( arguments[i] === undefined ) {
							match[i] = undefined;
						}
					}
				};

			for ( ; i < len; i++ ) {
				// Reset regex index to 0
				rpos.exec("");
				selector = groups[i].replace( rstartWithWhitespace, "" );
				ret = [];
				anchor = 0;
				elements = seed || null;
				while ( (match = rpos.exec( selector )) ) {
					lastIndex = match.index + match[0].length;
					if ( lastIndex > anchor ) {
						part = selector.slice( anchor, match.index );
						if ( match.length > 1 ) {
							match[0].replace( rposgroups, setUndefined );
						}
						anchor = lastIndex;

						currentContexts = [ context ];
						if ( (not = rendsWithNot.test( part )) ) {
							part = part.replace( rendsWithNot, "" ).replace( rcombinators, "$&*" );
						}

						if ( rcombinators.test(part) ) {
							currentContexts = elements || [ context ];
							elements = seed;
						}

						elements = handlePOSGroup( part, match[1], match[2], currentContexts, elements, not );
					}

					if ( rpos.lastIndex === match.index ) {
						rpos.lastIndex++;
					}
				}

				if ( elements ) {
					ret = ret.concat( elements );

					if ( (part = selector.slice( anchor )) && part !== ")" ) {
						multipleContexts( part, ret, results, seed );
					} else {
						push.apply( results, ret );
					}
				} else {
					Sizzle( selector, context, results, seed );
				}
			}

			// Do not sort if this is a single filter
			return len === 1 ? results : Sizzle.uniqueSort( results );
		}

		(function () {
			var soFar, match, tokens,
				advance = function( pattern, type, xml ) {
					if ( (match = pattern.exec( soFar )) &&
							( !type || !Expr.preFilter[ type ] || (match = Expr.preFilter[ type ]( match, xml )) ) ) {
						soFar = soFar.slice( match[0].length );
					}
					return match;
				};

			tokenize = function( selector, context, xml ) {
				soFar = selector;
				tokens = [];

				var type, matched,
					checkContext = !xml && context !== document,
					groups = [ tokens ];

				// Need to make sure we're within a narrower context if necessary
				// Adding a descendent combinator will generate what is needed automatically
				if ( checkContext ) {
					soFar = " " + soFar;
				}

				while ( soFar ) {
					matched = false;
					if ( advance(rcomma) ) {
						groups.push(tokens = []);
						if ( checkContext ) {
							soFar = " " + soFar;
						}
					}
					if ( advance(rcombinators) ) {
						tokens.push({ part: match.pop(), captures: match });
						matched = true;
					}
					for ( type in Expr.filter ) {
						if ( advance(matchExpr[ type ], type, xml) ) {
							match.shift();
							tokens.push({ part: type, captures: match });
							matched = true;
						}
					}

					if ( !matched ) {
						Sizzle.error( selector );
					}
				}

				return groups;
			};
		})();

		function addCombinator( matcher, combinator, context ) {
			var dir = combinator.dir,
				firstMatch = combinator.firstMatch,
				doneName = done++;

			if ( !matcher ) {
				// If there is no matcher to check, check against the context
				matcher = function( elem ) {
					return elem === context;
				};
			}
			return firstMatch ?
				function( elem, context ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 ) {
							return matcher( elem, context ) ? elem : false;
						}
					}
				} :
				function( elem, context ) {
					var cache,
						dirkey = doneName + "." + dirruns,
						cachedkey = dirkey + "." + cachedruns;
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 ) {
							if ( (cache = elem[ expando ]) === cachedkey ) {
								return false;
							} else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
								if ( elem.sizset ) {
									return elem;
								}
							} else {
								elem[ expando ] = cachedkey;
								if ( matcher( elem, context ) ) {
									elem.sizset = true;
									return elem;
								}
								elem.sizset = false;
							}
						}
					}
				};
		}

		function addMatcher( higher, deeper ) {
			return higher ?
				function( elem, context ) {
					var result = deeper( elem, context );
					return result && higher( result === true ? elem : result, context );
				} :
				deeper;
		}

		// ["TAG", ">", "ID", " ", "CLASS"]
		function matcherFromTokens( tokens, context, xml ) {
			var token, matcher,
				i = 0;

			for ( ; (token = tokens[i]); i++ ) {
				if ( Expr.relative[ token.part ] ) {
					matcher = addCombinator( matcher, Expr.relative[ token.part ], context );
				} else {
					token.captures.push( context, xml );
					matcher = addMatcher( matcher, Expr.filter[ token.part ].apply( null, token.captures ) );
				}
			}

			return matcher;
		}

		function matcherFromGroupMatchers( matchers ) {
			return function( elem, context ) {
				var matcher,
					j = 0;
				for ( ; (matcher = matchers[j]); j++ ) {
					if ( matcher(elem, context) ) {
						return true;
					}
				}
				return false;
			};
		}

		var compile = Sizzle.compile = function( selector, context, xml ) {
			var tokens, group, i,
				cached = compilerCache[ selector ];

			// Return a cached group function if already generated (context dependent)
			if ( cached && cached.context === context ) {
				cached.dirruns++;
				return cached;
			}

			// Generate a function of recursive functions that can be used to check each element
			group = tokenize( selector, context, xml );
			for ( i = 0; (tokens = group[i]); i++ ) {
				group[i] = matcherFromTokens( tokens, context, xml );
			}

			// Cache the compiled function
			cached = compilerCache[ selector ] = matcherFromGroupMatchers( group );
			cached.context = context;
			cached.runs = cached.dirruns = 0;
			cachedSelectors.push( selector );
			// Ensure only the most recent are cached
			if ( cachedSelectors.length > Expr.cacheLength ) {
				delete compilerCache[ cachedSelectors.shift() ];
			}
			return cached;
		};

		Sizzle.matches = function( expr, elements ) {
			return Sizzle( expr, null, null, elements );
		};

		Sizzle.matchesSelector = function( elem, expr ) {
			return Sizzle( expr, null, null, [ elem ] ).length > 0;
		};

		var select = function( selector, context, results, seed, xml ) {
			var elements, matcher, i, len, elem, token, position,
				type, match, findContext, notTokens,
				isSingle = (match = selector.match( rgroups )) && match.length === 1,
				tokens = selector.match( rtokens ),
				contextNodeType = context.nodeType;

			// POS handling
			if ( matchExpr.POS.test(selector) ) {
				return handlePOS( selector, context, results, seed );
			}

			// Take a shortcut and set the context if the root selector is an ID
			if ( !seed && isSingle && tokens.length > 1 && contextNodeType === 9 && !xml &&
					(match = matchExpr.ID.exec( tokens[0] )) ) {

				context = Expr.find.ID( match[1], context, xml )[0];
				selector = selector.slice( tokens.shift().length );
			}

			if ( context ) {
				if ( seed ) {
					elements = slice.call( seed, 0 );

				} else {

					// Maintain document order by not limiting the set
					if ( isSingle ) {
						findContext = (tokens.length >= 1 && rsibling.test( tokens[0] ) && context.parentNode) || context;

						// Get the last token, excluding :not
						notTokens = tokens.pop().split(":not");
						token = notTokens[0];

						for ( i = 0, len = Expr.order.length; i < len; i++ ) {
							type = Expr.order[i];

							if ( (match = matchExpr[ type ].exec( token )) ) {
								elements = Expr.find[ type ]( (match[1] || "").replace( rbackslash, "" ), findContext, xml );

								if ( elements != null ) {
									break;
								}
							}
						}

						if ( elements && !notTokens[1] ) {
							position = selector.length - token.length;
							selector = selector.slice( 0, position ) +
								selector.slice( position ).replace( matchExpr[ type ], "" );

							if ( !selector ) {
								push.apply( results, slice.call(elements, 0) );
								return results;
							}
						}
					}

					if ( !elements ) {
						elements = Expr.find.TAG( "*", context );
					}
				}

				// Only loop over the given elements once
				// If selector is empty, we're already done
				if ( selector && (matcher = compile( selector, context, xml )) ) {
					dirruns = matcher.dirruns;
					for ( i = 0; (elem = elements[i]); i++ ) {
						cachedruns = matcher.runs++;
						if ( matcher(elem, context) ) {
							results.push( elem );
						}
					}
				}
			}

			return results;
		};

		if ( document.querySelectorAll ) {
			(function() {
				var disconnectedMatch,
					oldSelect = select,
					rdivision = /[^\\],/g,
					rrelativeHierarchy = /^[\x20\t\n\r\f]*[+~]/,
					rapostrophe = /'/g,
					rattributeQuotes = /\=[\x20\t\n\r\f]*([^'"\]]*)[\x20\t\n\r\f]*\]/g,
					rbuggyQSA = [],
					// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
					// A support test would require too much code (would include document ready)
					// just skip matchesSelector for :active
					rbuggyMatches = [":active"],
					matches = docElem.matchesSelector ||
						docElem.mozMatchesSelector ||
						docElem.webkitMatchesSelector ||
						docElem.oMatchesSelector ||
						docElem.msMatchesSelector;

				// Build QSA regex
				// Regex strategy adopted from Diego Perini
				assert(function( div ) {
					div.innerHTML = "<select><option selected></option></select>";

					// IE8 - Some boolean attributes are not treated correctly
					if ( !div.querySelectorAll("[selected]").length ) {
						rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
					}

					// Webkit/Opera - :checked should return selected option elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					// IE8 throws error here (do not put tests after this one)
					if ( !div.querySelectorAll(":checked").length ) {
						rbuggyQSA.push(":checked");
					}
				});

				assert(function( div ) {

					// Opera 10-12/IE9 - ^= $= *= and empty values
					// Should not select anything
					div.innerHTML = "<p test=''></p>";
					if ( div.querySelectorAll("[test^='']").length ) {
						rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
					}

					// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
					// IE8 throws error here (do not put tests after this one)
					div.innerHTML = "<input type='hidden'>";
					if ( !div.querySelectorAll(":enabled").length ) {
						rbuggyQSA.push(":enabled", ":disabled");
					}
				});

				rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );

				select = function( selector, context, results, seed, xml ) {
					// Only use querySelectorAll when not filtering,
					// when this is not xml,
					// and when no QSA bugs apply
					if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
						if ( context.nodeType === 9 ) {
							try {
								push.apply( results, slice.call(context.querySelectorAll( selector ), 0) );
								return results;
							} catch(qsaError) {}
						// qSA works strangely on Element-rooted queries
						// We can work around this by specifying an extra ID on the root
						// and working up from there (Thanks to Andrew Dupont for the technique)
						// IE 8 doesn't work on object elements
						} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
							var newSelector,
								oldContext = context,
								old = context.getAttribute( "id" ),
								nid = old || expando,
								parent = context.parentNode,
								relativeHierarchySelector = rrelativeHierarchy.test( selector );

							if ( old ) {
								nid = nid.replace( rapostrophe, "\\$&" );
							} else {
								context.setAttribute( "id", nid );
							}

							if ( relativeHierarchySelector && parent ) {
								context = parent;
							}

							try {
								if ( context ) {
									nid = "[id='" + nid + "'] ";
									newSelector = nid + selector.replace( rdivision, "$&" + nid );
									push.apply( results, slice.call(context.querySelectorAll( newSelector ), 0) );
									return results;
								}
							} catch(qsaError) {
							} finally {
								if ( !old ) {
									oldContext.removeAttribute( "id" );
								}
							}
						}
					}

					return oldSelect( selector, context, results, seed, xml );
				};

				if ( matches ) {
					assert(function( div ) {
						// Check to see if it's possible to do matchesSelector
						// on a disconnected node (IE 9)
						disconnectedMatch = matches.call( div, "div" );

						// This should fail with an exception
						// Gecko does not error, returns false instead
						try {
							matches.call( div, "[test!='']:sizzle" );
							rbuggyMatches.push( Expr.match.PSEUDO );
						} catch ( e ) {}
					});

					// rbuggyMatches always contains :active, so no need for a length check
					rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

					Sizzle.matchesSelector = function( elem, expr ) {
						// Make sure that attribute selectors are quoted
						expr = expr.replace( rattributeQuotes, "='$1']" );

						// rbuggyMatches always contains :active, so no need for an existence check
						if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
							try {
								var ret = matches.call( elem, expr );

								// IE 9's matchesSelector returns false on disconnected nodes
								if ( ret || disconnectedMatch ||
										// As well, disconnected nodes are said to be in a document
										// fragment in IE 9
										elem.document && elem.document.nodeType !== 11 ) {
									return ret;
								}
							} catch(e) {}
						}

						return Sizzle( expr, null, null, [ elem ] ).length > 0;
					};
				}
			})();
		}

		// EXPOSE
		xRTML.Sizzle = Sizzle;

    })(window.xRTML = window.xRTML || {})
})(window);
(function (xRTML, undefined) {
    /**
    *  @struct xRTML.JSON JavaScript Object Notation enclosed in the xRTML namespace to ensure its expected behaviour.
    */
    (function (JSON, undefined) {
        (function () {
            "use strict";

            function f(n) {
                // Format integers to have at least two digits.
                return n < 10 ? '0' + n : n;
            }

            if (typeof Date.prototype.toJSON !== 'function') {

                Date.prototype.toJSON = function (key) {

                    return isFinite(this.valueOf()) ?
                        this.getUTCFullYear() + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate()) + 'T' +
                        f(this.getUTCHours()) + ':' +
                        f(this.getUTCMinutes()) + ':' +
                        f(this.getUTCSeconds()) + 'Z' : null;
                };

                String.prototype.toJSON =
                    Number.prototype.toJSON =
                    Boolean.prototype.toJSON = function (key) {
                        return this.valueOf();
                    };
            }

            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap,
                indent,
                meta = {    // table of character substitutions
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '"': '\\"',
                    '\\': '\\\\'
                },
                rep;


            function quote(string) {

                // If the string contains no control characters, no quote characters, and no
                // backslash characters, then we can safely slap some quotes around it.
                // Otherwise we must also replace the offending characters with safe escape
                // sequences.

                escapable.lastIndex = 0;
                return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                    var c = meta[a];
                    return typeof c === 'string' ? c :
                        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' : '"' + string + '"';
            }


            function str(key, holder) {

                // Produce a string from holder[key].

                var i,          // The loop counter.
                    k,          // The member key.
                    v,          // The member value.
                    length,
                    mind = gap,
                    partial,
                    value = holder[key];

                // If the value has a toJSON method, call it to obtain a replacement value.

                if (value && typeof value === 'object' &&
                        typeof value.toJSON === 'function') {
                    value = value.toJSON(key);
                }

                // If we were called with a replacer function, then call the replacer to
                // obtain a replacement value.

                if (typeof rep === 'function') {
                    value = rep.call(holder, key, value);
                }

                // What happens next depends on the value's type.

                switch (typeof value) {
                    case 'string':
                        return quote(value);

                    case 'number':

                        // JSON numbers must be finite. Encode non-finite numbers as null.

                        return isFinite(value) ? String(value) : 'null';

                    case 'boolean':
                    case 'null':

                        // If the value is a boolean or null, convert it to a string. Note:
                        // typeof null does not produce 'null'. The case is included here in
                        // the remote chance that this gets fixed someday.

                        return String(value);

                        // If the type is 'object', we might be dealing with an object or an array or
                        // null.

                    case 'object':

                        // Due to a specification blunder in ECMAScript, typeof null is 'object',
                        // so watch out for that case.

                        if (!value) {
                            return 'null';
                        }

                        // Make an array to hold the partial results of stringifying this object value.

                        gap += indent;
                        partial = [];

                        // Is the value an array?

                        if (Object.prototype.toString.apply(value) === '[object Array]') {

                            // The value is an array. Stringify every element. Use null as a placeholder
                            // for non-JSON values.

                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || 'null';
                            }

                            // Join all of the elements together, separated with commas, and wrap them in
                            // brackets.

                            v = partial.length === 0 ? '[]' : gap ?
                            '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                            '[' + partial.join(',') + ']';
                            gap = mind;
                            return v;
                        }

                        // If the replacer is an array, use it to select the members to be stringified.

                        if (rep && typeof rep === 'object') {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                k = rep[i];
                                if (typeof k === 'string') {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        } else {

                            // Otherwise, iterate through all of the keys in the object.

                            for (k in value) {
                                if (Object.hasOwnProperty.call(value, k)) {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        }

                        // Join all of the member texts together, separated with commas,
                        // and wrap them in braces.

                        v = partial.length === 0 ? '{}' : gap ?
                        '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                        '{' + partial.join(',') + '}';
                        gap = mind;
                        return v;
                }
            }

            // If the JSON object does not yet have a stringify method, give it one.

            if (typeof JSON.stringify !== 'function') {
                JSON.stringify = function (value, replacer, space) {

                    // The stringify method takes a value and an optional replacer, and an optional
                    // space parameter, and returns a JSON text. The replacer can be a function
                    // that can replace values, or an array of strings that will select the keys.
                    // A default replacer method can be provided. Use of the space parameter can
                    // produce text that is more easily readable.

                    var i;
                    gap = '';
                    indent = '';

                    // If the space parameter is a number, make an indent string containing that
                    // many spaces.

                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }

                        // If the space parameter is a string, it will be used as the indent string.

                    } else if (typeof space === 'string') {
                        indent = space;
                    }

                    // If there is a replacer, it must be a function or an array.
                    // Otherwise, throw an error.

                    rep = replacer;
                    if (replacer && typeof replacer !== 'function' &&
                            (typeof replacer !== 'object' ||
                            typeof replacer.length !== 'number')) {
                        throw new Error('JSON.stringify');
                    }

                    // Make a fake root object containing our value under the key of ''.
                    // Return the result of stringifying the value.

                    return str('', { '': value });
                };
            }


            // If the JSON object does not yet have a parse method, give it one.

            if (typeof JSON.parse !== 'function') {
                JSON.parse = function (text, reviver) {

                    // The parse method takes a text and an optional reviver function, and returns
                    // a JavaScript value if the text is a valid JSON text.

                    var j;

                    function walk(holder, key) {

                        // The walk method is used to recursively walk the resulting structure so
                        // that modifications can be made.

                        var k, v, value = holder[key];
                        if (value && typeof value === 'object') {
                            for (k in value) {
                                if (Object.hasOwnProperty.call(value, k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value);
                    }


                    // Parsing happens in four stages. In the first stage, we replace certain
                    // Unicode characters with escape sequences. JavaScript handles many characters
                    // incorrectly, either silently deleting them, or treating them as line endings.

                    text = String(text);
                    cx.lastIndex = 0;
                    if (cx.test(text)) {
                        text = text.replace(cx, function (a) {
                            return '\\u' +
                                ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        });
                    }

                    // In the second stage, we run the text against regular expressions that look
                    // for non-JSON patterns. We are especially concerned with '()' and 'new'
                    // because they can cause invocation, and '=' because it can cause mutation.
                    // But just to be safe, we want to reject all unexpected forms.

                    // We split the second stage into 4 regexp operations in order to work around
                    // crippling inefficiencies in IE's and Safari's regexp engines. First we
                    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                    // replace all simple value tokens with ']' characters. Third, we delete all
                    // open brackets that follow a colon or comma or that begin the text. Finally,
                    // we look to see that the remaining characters are only whitespace or ']' or
                    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                    if (/^[\],:{}\s]*$/
                            .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                        // In the third stage we use the eval function to compile the text into a
                        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                        // in JavaScript: it can begin a block or an object literal. We wrap the text
                        // in parens to eliminate the ambiguity.

                        j = eval('(' + text + ')');

                        // In the optional fourth stage, we recursively walk the new structure, passing
                        // each name/value pair to a reviver function for possible transformation.

                        return typeof reviver === 'function' ?
                            walk({ '': j }, '') : j;
                    }

                    // If the text is not JSON parseable, then a SyntaxError is thrown.

                    throw new SyntaxError('JSON.parse');
                };
            }
        } ());
    })(xRTML.JSON = xRTML.JSON || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.DomParser Loads all the xRTML markup elements that are declared in the web pages' body into the xRTML framework.
    */
    (function (DomParser, undefined) {

        var ns = 'xrtml:',

        // Creates an object literal from the connections declared in the DOM.
        loadConnections = function (configElement) {
            // get HTML connection tags from DOM
            var connectionTags = configElement.getElementsByTagName(ns + 'connection'),
                connections = [];
            //iterate through all the child tags and place their values in the connections array.
            for (var j = 0; j < connectionTags.length; ++j) {
                // check version
                if (connectionTags[j].getAttribute("version") === xRTML.version) {
                    // convert to object literal and store
                    var connectionElem = connectionTags[j];
                    connections.push({
                        name: 'Connection',
                        id: connectionElem.getAttribute("id"),
                        active: connectionElem.getAttribute("active"),
                        sendretries: connectionElem.getAttribute("sendretries"),
                        sendinterval: connectionElem.getAttribute("sendinterval"),
                        url: connectionElem.getAttribute("url"),
                        iscluster: connectionElem.getAttribute("iscluster"),
                        servertype: connectionElem.getAttribute("servertype"),
                        timeout: connectionElem.getAttribute("timeout"),
                        connectattempts: connectionElem.getAttribute("connectattempts"),
                        metadata: connectionElem.getAttribute("metadata"),
                        appkey: connectionElem.getAttribute("appkey"),
                        authtoken: connectionElem.getAttribute("authtoken"),
                        announcementsubchannel: connectionElem.getAttribute("announcementsubchannel"),
                        channels: (function () {
                            var channelTags = !window.attachEvent ? document.getElementsByTagName(ns + 'channels')[0].children : document.getElementsByTagName(ns + 'channel'),
                                channels = [];
                            for (var i = 0; i < channelTags.length; ++i) {
                                var channelTag = channelTags[i];
                                channels.push({
                                    name: channelTag.getAttribute("name"),
                                    subscribeOnReconnect: channelTag.getAttribute("subscribeonreconnect") ? channelTag.getAttribute("subscribeonreconnect") : true,
                                    subscribe: channelTag.getAttribute("subscribe") ? channelTag.getAttribute("subscribe") : true,
                                    onMessage: channelTag.getAttribute("onmessage") ? new Function("event", "return " + channelTag.getAttribute("onmessage") + "(event);") : null,
                                    onSubscribe: channelTag.getAttribute("onsubscribe") ? new Function("event", "return " + channelTag.getAttribute("onsubscribe") + "(event);") : null,
                                    messageAdapter: channelTag.getAttribute("messageadapter") ? new Function("message", "return " + channelTag.getAttribute("messageadapter") + "(message);") : null
                                });
                            }
                            return channels;

                        })(),
                        oncreate: connectionElem.getAttribute("oncreate") ? new Function("event", "return " + connectionElem.getAttribute("oncreate") + "(event);") : null,
                        onconnect: connectionElem.getAttribute("onconnect") ? new Function("event", "return " + connectionElem.getAttribute("onconnect") + "(event);") : null,
                        ondisconnect: connectionElem.getAttribute("ondisconnect") ? new Function("event", "return " + connectionElem.getAttribute("ondisconnect") + "(event);") : null,
                        onsubscribe: connectionElem.getAttribute("onsubscribe") ? new Function("event", "channel", "return " + connectionElem.getAttribute("onsubscribe") + "(event);") : null,
                        onunsubscribe: connectionElem.getAttribute("onunsubscribe") ? new Function("event", "channel", "return " + connectionElem.getAttribute("onunsubscribe") + "(event);") : null,
                        onexception: connectionElem.getAttribute("onexception") ? new Function("event", "event", "return " + connectionElem.getAttribute("onexception") + "(event);") : null,
                        onreconnect: connectionElem.getAttribute("onreconnect") ? new Function("event", "return " + connectionElem.getAttribute("onreconnect") + "(event);") : null,
                        onreconnecting: connectionElem.getAttribute("onreconnecting") ? new Function("event", "return " + connectionElem.getAttribute("onreconnecting") + "(event);") : null,
                        onmessage: connectionElem.getAttribute("onmessage") ? new Function("event", "return " + connectionElem.getAttribute("onmessage") + "(event);") : null,
                        messageadapter: connectionElem.getAttribute("messageadapter") ? new Function("message", "return " + connectionElem.getAttribute("messageadapter") + "(message);") : null
                    });

                    // remove from DOM (adjust the index)
                    connectionTags[j].parentNode.removeChild(connectionTags[j--]);
                }
            }
            return connections;
        },

        // Creates an object literal from the storages declared in the DOM.
        loadStorage = function (configElement) {
            // get HTML connection tags from DOM
            var storageTags = configElement.getElementsByTagName(ns + 'storage'),
                storages = [];

            //iterate through all the child tags and place their values in the storages array.
            for (var i = 0, len = storageTags.length; i < len; i++) {
                if (storageTags[i].getAttribute("version") === xRTML.version) {
                    // convert to object literal and store
                    var storageElem = storageTags[i];
                    storages.push({
                        id: storageElem.getAttribute("id"),
                        baseurl: storageElem.getAttribute("baseurl"),
                        type: storageElem.getAttribute("type"),
                        connectionid: storageElem.getAttribute("connectionid"),
                        sessionid: storageElem.getAttribute("sessionid"),
                        onready: storageElem.getAttribute("onready") ? new Function("event", "return " + storageElem.getAttribute("onready") + "(event);") : null,
                        onsession: storageElem.getAttribute("onsession") ? new Function("event", "return " + storageElem.getAttribute("onsession") + "(event);") : null,
                        onexception: storageElem.getAttribute("onexception") ? new Function("event", "event", "return " + storageElem.getAttribute("onexception") + "(event);") : null
                    });
                    // remove from DOM (adjust the index)
                    document.getElementsByTagName(ns + 'storages')[0].removeChild(storageTags[i--]);
                }
            }
            return storages;
        },

        // Creates an object literal from the configuration declared in the DOM.
        loadConfig = function () {
            // set global scope
            var scope = document,
                configElement = document.getElementsByTagName(ns + 'config');

            if (configElement.length == 0) {
                return null;
            }

            if (configElement.length == 1) {
                configElement = configElement[0];
                scope = window.attachEvent ? document : configElement
            }
            else {
                throw 'xRTML requires a configuration tag per page.';
            }

            return {
                debug: xRTML.Common.Converter.toBoolean(configElement.getAttribute('debug')),
                logLevel: configElement.getAttribute('loglevel'),
                xrtmlActive: xRTML.Common.Converter.toBoolean(configElement.getAttribute('xrtmlactive')),
                throwErrors: xRTML.Common.Converter.toBoolean(configElement.getAttribute('throwerrors')),
                connectionAttempts: xRTML.Common.Converter.toNumber(configElement.getAttribute('connectionattempts')),
                connectionTimeout: xRTML.Common.Converter.toNumber(configElement.getAttribute('connectiontimeout')),
                remoteTrace: xRTML.Common.Converter.toBoolean(configElement.getAttribute('remotetrace')),
                ortcUrl: configElement.getAttribute('ortcurl'),
                ortcLibrary: configElement.getAttribute('ortclibrary'),
                connections: loadConnections(scope),
                storages: loadStorage(scope)
            };
        },

        xrtmlElement = function (node, parent) {
            var attribute, child;
            // attributes
            if (node.attributes) {
                for (var i = 0; i < node.attributes.length; ++i) {
                    attribute = node.attributes[i];
                    // condition needed only for Quirks and <IE9 (TODO: can improve this line)
                    if (attribute.specified) {
                        this[attribute.nodeName.toLowerCase()] = attribute.nodeValue;
                    }
                }
            }
            // nested tags
            if (node.children.length != 0) {
                for (var j = 0; j < node.children.length; ++j) {
                    child = node.children[j],
                    // split only for recent browsers (TODO: can improve this line)
			        childName = window.addEventListener ? child.nodeName.split(':')[1].toLowerCase() : child.nodeName.toLowerCase();
                    // special case: Comment (in some browsers it's not considered an HTMLElement)
                    if (childName === 'template') {
                        this[childName] = '';
                        if (window.addEventListener) {
                            for (var z = 0; z < child.childNodes.length; ++z) {
                                if (child.childNodes[z].nodeType == Node.COMMENT_NODE) {
                                    this[childName] += child.childNodes[z].nodeValue;
                                }
                            }
                        }
                        else { this[childName] = child.childNodes[0].nodeValue; }
                        // remove TEXT nodes
                        this[childName] = this[childName].trim();
                        continue;
                    }
                    // turn into an array
                    if (!parent) {
                        this[childName] = [];
                        // elements below this one will be added by reference
                        new xrtmlElement(child, this[childName]);
                    }
                    else {
                        parent.push(new xrtmlElement(child));
                        // this check is here because of tags closed like this: <tag />
                        if (child.children) {
                            // elements below this one will be added by reference
                            new xrtmlElement(child, parent);
                        }
                    }
                }
            }
        },

        // Creates an object literal from the tags declared in the DOM.
        loadTags = function () {
            var tagElements,
                tags = [],
                tagClasses = xRTML.TagManager.getClasses();

            for (var j = 0; j < tagClasses.length; ++j) {
                tagElements = document.getElementsByTagName(ns + tagClasses[j]);
                for (var i = 0; i < tagElements.length; ++i) {
                    // this check is here for older browsers that don't recognize xrtml as a namespace (TODO: improve this line)
                    // check if tag belongs to xrtml namespace (if not, ignore it)
                    if (!window.addEventListener && tagElements[i].scopeName.toLowerCase() != 'xrtml') {
                        continue;
                    }
                    // check version
                    if (tagElements[i].getAttribute("version") === xRTML.version) {
                        var xrtmlTag = new xrtmlElement(tagElements[i]);
                        xrtmlTag.name = tagClasses[j];
                        tags.push(xrtmlTag);

                        // remove from DOM (adjust the index)
                        document.body.removeChild(tagElements[i--]);
                    }
                }
            }

            return tags;
        };

        xRTML.Event.extend(DomParser);

        /**
        *  @function {public} xRTML.DomParser.? Converts all the xRTML markup elements into object literals and delivers them to the specific modules.
        */
        DomParser.read = function () {
            // read xrtml:config (includes xrtml:connections and xrtml:storages)
            var config;
            try {
                config = loadConfig();
            } catch (err) {
                
            }
            if (config) {
                this.fire({
                    /**
                    *  Fired when the 'config' HTML element is read and the corresponding configuration tag is created.
                    *  This includes the 'connections' and 'storage' HTML elements.
                    *  @event xRTML.DomParser.evt_configLoad
                    *  @param {Object} e struture with the definition of the event's parameters.
                    *  @... {Object} target module that raised this event.
                    *  @... {Object} config structure with the config definition.
                    */
                    configLoad: { config: config }
                });
            }

            // read xrtml:tags
            var tags = loadTags();
            if (tags.length != 0) {
                this.fire({
                    /**
                    *  Fired when the tags' HTML elements have been read and the corresponding objects have been created.
                    *  This includes the 'connections' and 'storage' HTML elements.
                    *  @event xRTML.DomParser.evt_tagsLoad
                    *  @param {Object} e struture with the definition of the event's parameters.
                    *  @... {Object} target module that raised this event.
                    *  @... {Object[]} tags Array with the tags' objects. Each object contains the tag's initialization attributes.
                    */
                    tagsLoad: { tags: tags }
                });
            }
        };
    })(xRTML.DomParser = xRTML.DomParser || {})
    /**
    * @end
    */
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    * @struct {public} xRTML.Class Base class for xRTML Objects.
    */
    (function (Class, undefined) {
        /* Simple JavaScript Inheritance
        * By John Resig http://ejohn.org/
        * MIT Licensed.
        */
        // Inspired by base2 and Prototype
        var initializing = false, fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;
        // The base Class implementation (does nothing)
        //Class = function(){};

        /**
        * @function {public} extend Creates a new Class that inherits from this class.
        * @param {Object} prop Object that will inherit from this class.
        */
        Class.extend = function (prop) {
            var _super = this.prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var prototype = new this();
            initializing = false;

            // Copy the properties over onto the new prototype
            for (var name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] == "function" &&
                    typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function (name, fn) {
                        return function () {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) :
                    prop[name];
            }

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the init method
                if (!initializing && this.init) {
                    this.init.apply(this, arguments);
                }
            }

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            Class.prototype.constructor = Class;

            // And make this class extendable
            Class.extend = arguments.callee;

            return Class;
        };

    })(xRTML.Class = xRTML.Class || function () { })
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @struct xRTML.Console Provides an abstraction layer between the xRTML framework and the web-browser's console.
    */
    (function (Console, undefined) {

        // reference to the web-browser/custom console
        // a custom console is used when the browser doesn't have its own console
        var debugConsole = (function () {

            if (typeof console !== "undefined") {
                return console;
            }

            var fallback = {
                id: null,
                // holds the statements while the console is not ready
                buffer: [],

                style: 'width: 100%; height: 40%; position: absolute; bottom:5px; left:5px; background: silver; padding: 5px; overflow: scroll;font-family:consolas,monospace;font-size:12px; ',

                printObject: function (obj) {
                    var output = '';
                    for (property in obj) {
                        output += property + ': ' + obj[property] + '; \n';
                    }
                    return output;
                },

                newLine: function (statement, color) {
                    var pStatement = document.createElement('p');
                    pStatement.style.color = color;
                    pStatement.innerHTML = statement;

                    // is the console loaded yet?
                    fallback.id ? document.getElementById(fallback.id).appendChild(pStatement) : fallback.buffer.push(pStatement);
                },

                log: function (statement) {
                    fallback.newLine(statement, 'black');
                },

                warn: function (statement) {
                    fallback.newLine(statement, 'orange');
                },

                error: function (statement) {
                    fallback.newLine(statement, 'red');
                },

                debug: function (statement) {
                    fallback.newLine(statement, 'green');
                },

                init: function () {

                    // set the console id
                    fallback.id = 'xRTML_Console_' + xRTML.Common.Util.idGenerator();
                    // DOM element holding the console
                    var consoleDiv = document.createElement('div');
                    consoleDiv.id = fallback.id;
                    consoleDiv.style.cssText = fallback.style;
                    // flush the buffer
                    for (var i = 0, len = fallback.buffer.length; i < len; i++) {
                        consoleDiv.appendChild(fallback.buffer[i]);
                    }
                    buffer = [];
                    // attach the fallback console
                    document.body.appendChild(consoleDiv);
                    // only display if debug is active
                    consoleDiv.style.display = xRTML.Config.debug ? 'block' : 'none';

                    if (xRTML.Config.debug) {
                        // display the fallback console
                        document.body.appendChild(consoleDiv);
                    }
                }
            };

            return fallback;

        })();

        // only display console for older browsers and when debug is enabled
        //if (!window.addEventListener && !console && xRTML.Config.debug) {
        if (!window.addEventListener && typeof console == 'undefined' && xRTML.Config.debug) {
            Console = debugConsole.init();
        }

        /**
        *  @function {public void} ? Logs a message in the console.
        *  @param {Object} info The message to be displayed on the console.
        */
        Console.log = function (info) {
            debugConsole.log(info);
        },
        /**
        *  @function {public void} ? Logs a warning message in the console.
        *  @param {Object} info The message to be displayed on the console.
        */
        Console.warn = function (info) {
            debugConsole.warn(info);
        },
        /**
        *  @function {public void} ? Logs an error message in the console.
        *  @param {Object} info The message to be displayed on the console.
        */
        Console.error = function (info) {
            debugConsole.error(info);
            if (xRTML.Config.remoteTrace === true) {

                this.fire({
                    /**
                    *  Fired when an error occurs.
                    *  @event evt_error
                    *  @param {Object} e struture with the definition of the event's parameters.
                    *  @... {Object} target module that raised this event.
                    *  @... {Object} info description of the error.
                    */
                    error: { error: info }
                });
            }
        },
        /**
        *  @function {public void} ? Logs a trace message in the console.
        *  @param {Object} info The message to be displayed on the console.
        */
        Console.debug = function (info) {
            if (xRTML.Config.debug === true) {
                debugConsole.log(info);
            }
        }

        xRTML.Event.extend(Console);

    })(xRTML.Console = xRTML.Console || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.Config Global configuration settings.
    */
    (function (Config, undefined) {

        var ortcLibrary = "";

        xRTML.Event.extend(Config);

        /**
        *  @property {public Object} xRTML.Config.logLevels Allowed set of log levels.
        */
        Config.logLevels = { error: 0, warn: 1, info: 2 };
        /**
        *  @property {public Boolean} xRTML.Config.debug Toggles debug specific messages to be displayed in the web-browsers console. Defaults to false. Should only be enabled for development or debugging purposes. {@default false}
        */
        Config.debug = false;
        /**
        *  @property {public Number} xRTML.Config.logLevel Sets which kind of logs are displayed. Possible values are:
        *  0: error. Only error messages are diplayed.
        *  1: warn. Displays warning and error messages.
        *  2: info. Displays all types of log.
        *  Defaults to 'info'. {@default info}
        */
        Config.logLevel = 2;
        /**
        *  @property {public Boolean} xRTML.Config.throwErrors When set, exceptions may stop code execution, otherwise they're processed and only displayed in the console. Defaults to false. {@default false}
        */
        Config.throwErrors = false;
        /**
        *  @property {public Number} xRTML.Config.connectionAttempts Number of times a connection tag tries to perform a connect. 
        *  This value is used by a connection if the 'connectAttempts' attribute is not set. Defaults to 5 attemps. {@default 5}
        */
        Config.connectionAttempts = 5;
        /**
        *  @property {public Number} xRTML.Config.connectionTimeout Maximum amount of time (miliseconds) a connection tag should take to perform a connect. 
        *  This value is used by a connection if the 'timeout' attribute is not set. Defaults to 10000 miliseconds. {@default 10000 ms}
        */
        Config.connectionTimeout = 10000;
        /**
        *  @property {public Boolean} xRTML.Config.remoteTrace Toggles remote tracing. Defaults to false. {@default false}
        */
        Config.remoteTrace = false;
        /**
        *  @function {public String} xRTML.Config.ortcLibrary Loads or displays the ORTC library.
        *  @param {optional String} url path of the ORTC library.
        *  @param {optional Function} callback Function executed when the ORTC script is loaded.
        *  @returns In case no parameters are supplied, gets the current ortc library being used.
        */
        Config.ortcLibrary = function (url, callback) {
            if (arguments.length != 0) {
                ortcLibrary = url;
                xRTML.Common.DOM.loadScript({ url: url, callback: callback });
            }
            return ortcLibrary;
        };

        xRTML.DomParser.bind({
            configLoad: function (e) {
                var config = e.config;
                // create connections
                for (var i = 0; i < config.connections.length; ++i) {
                    xRTML.ConnectionManager.create(config.connections[i]);
                }
                // create storages
                for (var i = 0; i < config.storages.length; ++i) {
                    xRTML.StorageManager.create(config.storages[i]);
                }
            }
        });

    })(xRTML.Config = xRTML.Config || {})
    /**
    * @end
    */
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *   @module xRTML.Effect Provides the ability for tags to run effects on HTML elements as configured by the tag and the effects collection of the tag configuration. 
    */
    (function (Effect, undefined) {

        /*
        *   Contains methods for handling effects.
        *   @var {private} Effect.?
        */
        var Manager = {

            /*
            *   The list of effects supported by JQuery UI Effects. This is used to decide either to call a plain JQuery function or a JQuery UI Effects function.
            *   @property {private Object} uiEffects
            */
            uiEffects: { 'blind': true, 'bounce': true, 'clip': true, 'drop': true, 'explode': true, 'fade': true, 'fold': true, 'highlight': true, 'puff': true, 'pulsate': true, 'scale': true, 'shake': true, 'size': true, 'slide': true, 'transfer': true },

            cssPropsMapping: {
                "padding-top": "paddingTop"
            },

            /*
            *   Check if a jQuery or jQuery UI effect function is available in the global scope.
            *   @param {String} effectName The name of the effect to check.
            *   @function {private void} ?
            *   @throws xRTMLError xRTML specific error containing name, cause and stack trace. 
            */
            checkIfEffectFunctionAvailable: function (effectName) {
                var effectAvailable = (jQuery && jQuery.fn && ((typeof jQuery.fn[effectName]).toLowerCase() == 'function')) || (jQuery && jQuery.effects && ((typeof jQuery.effects[effectName]).toLowerCase() == 'function'));
                if (!effectAvailable) {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.MISSING_LIBRARY, info: { library: 'jQuery', module: effectName, className: 'xRTML.Effect.Manager (internal class, no docs available)', methodName: 'checkIfEffectFunctionAvailable (internal method, no docs available)'} });
                }
            },
            /*
            *   Call the jQuery effect function specified by effectName.
            *   @param {Object} args The arguments for this function.
            *   @... {Object} element HTML Element: The target element.
            *   @... {String} effectName The name of the effect function to call.
            *   @... {Object} effectProperties The properties to send to jQuery.
            *   @... {Object} effectOptions The options to send to jQuery.
            *   @... {Number} effectSpeed Specifies the speed in miliseconds for the duration of a JQuery UI Effect.
            *   @... {Function} effectCallback A callback function to call after the effect has run.
            *   @... {boolean} revert A flag specifying if the effects of running the effect on the DOM element should be returned. Currently only supports CSS properties specified on effectProperties. 
            *   @function {private void} ?    
            */
            callJQueryEffect: function (argumentsObject) {

                xRTML.Console.debug('jQuery effect: Running ' + argumentsObject.effectName + ' on element ' + argumentsObject.element.id + ' with options ' + xRTML.JSON.stringify(argumentsObject.effectOptions) + ' and properties: ' + JSON.stringify(argumentsObject.effectProperties));

                this.checkIfEffectFunctionAvailable(argumentsObject.effectName);

                try {
                    if (this.uiEffects[argumentsObject.effectName]) {
                        jQuery.fn.effect.call(jQuery(argumentsObject.element), argumentsObject.effectName, argumentsObject.effectOptions, argumentsObject.effectSpeed, argumentsObject.effectCallback);
                    } else {
                        jQuery.fn[argumentsObject.effectName].call(jQuery(argumentsObject.element), argumentsObject.effectProperties, argumentsObject.effectOptions);
                    }
                } catch (err) {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.UNEXPECTED, info: { message: err.message, className: 'xRTML.Effect.Manager (internal class, no docs available)', methodName: 'callJQueryEffect (internal method, no docs available)'} });
                }
            },
            /*
            *   Build the css properties to revert the changes made by the initial effect.
            *   @param {Object} args The arguments for this function.
            *   @... {HTMLElement} element The elmement from which to extract the properties.
            *   @... {Object} properties The properties to reverse.
            *   @function {private Object} ?
            */
            buildReverseEffectProperties: function (args) {
                var elementCSSProperties = {};
                for (var prop in args.properties) {
                    var p = xRTML.Common.Object.insensitiveGetter(args.element.style, prop.replace('-', ''));
                    if (!p || p == '') p = xRTML.Common.DOM.getStyle({ element: args.element, rule: prop });
                    elementCSSProperties[prop] = p;
                }
                return elementCSSProperties;
            },
            //Fix to a jQuery bug to versions previous to 1.4.3. where if the options object is sent twice to animate() it will throw too much recursion errors.
            cloneJQueryOptions: function (options) {
                var newOptions = {};
                for (prop in options) {
                    newOptions[prop] = options[prop];
                }
                return newOptions;
            }
        },

        /*
        *   Provides custom objects with effects funcionality.
        *   @var {private} Event.?
        */
		Provider = {
		    /*
		    *   Runs all the effects configured by the effects property on the decorated object.
		    *   @param {Object} args The arguments for this function.
		    *   @... {HTMLElement} element The HTML element on wich to run the effects.
		    *   @... {Boolean} stopCurrent If there are effects currently running on the elements stop them. Defaults to true.
		    *   @function {public void} ?
		    */
		    runEffects: function (args) {
		        if (this.effects) {
		            if (typeof args.stopCurrent == 'undefined' || args.stopCurrent) {
		                //animate is the lowest level effects function. If animate is not present none of the effects will be.
		                Manager.checkIfEffectFunctionAvailable('animate');
		                jQuery(args.element).stop(false, true);
		            }
		            for (var i = 0; i < this.effects.length; i++) {
		                try {
		                    var options = Manager.cloneJQueryOptions(typeof this.effects[i].options == 'object' ? this.effects[i].options : xRTML.JSON.parse(this.effects[i].options)),
                            properties = typeof this.effects[i].properties == 'object' ? this.effects[i].properties : xRTML.JSON.parse(this.effects[i].properties),
                            reverseProperties = Manager.buildReverseEffectProperties({ properties: properties, element: args.element });
		                } catch (err) {
		                    xRTML.Error.raise({ code: xRTML.Error.Codes.JSON_PARSE, info: { message: err.message, className: 'xRTML.Effect.Provider (internal class, no docs available)', methodName: 'runEffects'} });
		                }
		                Manager.callJQueryEffect({
		                    element: args.element,
		                    effectName: this.effects[i].name,
		                    effectOptions: options,
		                    effectProperties: properties,
		                    effectSpeed: this.effects[i].speed,
		                    effectCallback: this.effects[i].callback ? (typeof this.effects[i].callback == 'function' ? this.effects[i].callback : new Function("", "return " + this.effects[i].callback + "();")) : null,
		                    revert: this.effects[i].revert
		                });
		                //call an effect to revert the changes if applicable.
		                if (this.effects[i].revert)
		                    Manager.callJQueryEffect({
		                        element: args.element,
		                        effectName: this.effects[i].name,
		                        effectOptions: options,
		                        effectProperties: reverseProperties,
		                        effectSpeed: this.effects[i].speed,
		                        effectCallback: null,
		                        revert: false
		                    });
		            }
		        }
		    }
		};

        /**
        *   @function {public void} xRTML.Effect.? Provides objects with the effect funcionality.
        *   @param {Object} target Object to be added the effect capability.
        */
        Effect.extend = function (target) {
            for (var func in Provider) {
                target[func] = Provider[func];
            }
        };

    })(xRTML.Effect = xRTML.Effect || {})
    /**
    * @end
    */
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.Error Provides error type objects, methods and properties.
    */
    (function (Error, undefined) {

        xRTML.Event.extend(Error);

        /**
        * @function {public} xRTML.Error.? Throws an error based on the given code.
        * @param {Object} error The arguments for the XRTMLError constructor. 
        */
        Error.raise = function (args) {
            args.arguments = xRTML.Common.Object.clone({ source: arguments.callee.caller.arguments, depth: 5 });
            var error = new Error.XRTMLError(args);
            if (new window.Error().stack) {
                xRTML.Console.error(error);
            } else {
                printOlderBrowserError(error);
            }
            return error;
        };

        /**
        * @class {private} xRTML.Error.? xRTML specific error class.   
        */
        Error.XRTMLError = function (args) {

            var code = !!args.code ? args.code : xRTML.Error.Codes.UNEXPECTED;

            /**
            *   @property {String} name The name of the error.
            */
            this.name = code.type;

            //Populate the class name and id if possible and not set yet.
            var info = !!args.info ? args.info : {};
            info.className = !!info.className ? info.className : (!!args.target ? (!!args.target.name ? args.target.name : Object.prototype.toString.call(args.target)) : 'Unknown');
            info.id = !!info.id ? info.id : (!!args.target ? args.target.id : 'Unknown');
            info.message = !!info.message ? info.message : args.message;
            info.arguments = args.arguments;

            /**
            *   @property {String} message The message for this error.
            */
            this.message = xRTML.Common.String.template(code.message, info);

            /**
            *   @property {String} type The error type.
            */
            this.type = code.type;

            /*
            *   @property {String} code The error code. A list of available codes, messages and error severity can be found at xRTML.Error.Codes.
            */
            //this.code = code;

            /**
            *   @property {Object} target The object that caused the error.
            */
            this.target = args.target;

            /**
            *   @property {Object} info The info properties associated with this error.
            */
            this.info = info;

            //TODO: attach specific to type (maybe requires refactor to several error objects).
            Error.fire({ 'exception': { error: this} });
        };
        Error.XRTMLError.prototype = window.Error.prototype;
        Error.XRTMLError.prototype.constructor = Error.XRTMLError;

        /**
        * @property {public Object} xRTML.Error.? Possible error codes.
        */
        Error.Codes = {
            MANDATORY_PROPERTY: {
                type: 'ValidationError',
                message: 'The property {property} is required for a {className} with the id {id}.'
            },
            INVALID_PROPERTY: {
                type: 'ValidationError',
                message: 'The property {property} of a {className} with the id {id} has the wrong type. The appropriate type would be {validType}.'
            },
            CONNECTION_INACTIVE: {
                type: 'ConnectionError',
                message: 'Tried to perform an operation on Connection {id} which is not active.'
            },
            CONNECTION_EXCEPTION: {
                type: 'ConnectionError',
                message: 'An unexpected problem occured on the Connection {id}. {message}'
            },
            CONNECTION_NOT_FOUND: {
                type: 'ConnectionError',
                message: 'Unable to find a Connection with the specified id: {id}.'
            },
            CONNECTION_PROCESS: {
                type: 'ConnectionError',
                message: 'An error ocurred while processing the message {xRTMLMessage} arrived at Connection {id}. {message}'
            },
            CONNECTION_ADAPT: {
                type: 'ConnectionError',
                message: 'An error ocurred while adapting the message {originalMessage} arrived at Connection {id}. {message}'
            },
            ORTC_NOT_FOUND: {
                type: 'ORTCError',
                message: 'Unable to obtain the ORTC library from the address specified.'
            },
            ORTC_UNAVAILABLE: {
                type: 'ORTCError',
                message: 'Connection {id}: ORTC client is not created yet.'
            },
            ORTC_DISCONNECTED: {
                type: 'ORTCError',
                message: 'Connection {id}: Disconnect not possible. ORTC client is not connected.'
            },
            ORTC_EXCEPTION: {
                type: 'ORTCError',
                message: 'An unexpected problem occured on the Connection {id}. {message}'
            },
            TAG_NOT_CREATED: {
                type: 'TagError',
                message: 'A problem occured while trying to create a {className} Tag with id {id}. {message}'
            },
            TAG_INACTIVE: {
                type: 'TagError',
                message: 'Tried to perform an action on a {className} with {id} which is not active.'
            },
            TAG_UNREGISTERED: {
                type: 'TagError',
                message: 'The specified Tag does not exist in the registered tags namespace.'
            },
            TAG_INVALID_CONFIG: {
                type: 'TagError',
                message: 'Unable to register a Tag with the specified configuration. {message}'
            },
            TAG_ABSTRACT: {
                type: 'TagError',
                message: 'The specified tag {tag} should not be instantiated.'
            },
            TAG_ACTION_UNDEFINED: {
                type: 'TagError',
                message: 'Tried to perform an action {action} which is not defined on a {className} with id {id}.'
            },
            TAG_NOT_FOUND: {
                type: 'TagError',
                message: 'Unable to find a Tag with the specified id: {id}.'
            },
            TAG_PROCESS: {
                type: 'TagError',
                message: 'An error ocurred while processing the arrived message on a {className} with id {id}. {message}'
            },
            INVALID_MESSAGE: {
                type: 'MessageError',
                message: 'Tried to create a message with invalid properties. {message}'
            },
            TRIGGER_UNREGISTERED: {
                type: 'MessageError',
                message: 'A message arrived containing a trigger which is not registered by any Tag.'
            },
            STORAGE_CONNECTION_UNAVAILABLE: {
                type: 'StorageError',
                message: 'The Remote Storage component for a {className} provider with id {id} could not find a connection with connectionId: {connectionId}'
            },
            STORAGE_UNAVAILABLE: {
                type: 'StorageError',
                message: 'The Remote Storage component for a {className} provider with id {id} is not available.'
            },
            STORAGE_SESSION: {
                type: 'StorageError',
                message: 'The Remote Storage component for a {className} provider with id {id} was not able to get a session. {message}'
            },
            STORAGE_ACTION_UNDEFINED: {
                type: 'StorageError',
                message: 'Tried to perform an action which is not defined on a {className} with id {id}.'
            },
            STORAGE_PERMISSIONS: {
                type: 'StorageError',
                message: 'Tried to perform an action for which the {className} with id {id} does not have the necessary permissions. Were the right channel permissions set on the server-side?'
            },
            STORAGE_OPERATION_TIMEOUT: {
                type: 'StorageError',
                message: 'The Storage operation with the id: {opId} was not completed whithin the expected timeout: {timeout}'
            },
            STORAGE_CALLBACK_FAILURE: {
                type: 'StorageError',
                message: 'The Storage operation with the id: {opId} callback has failed. {message}'
            },
            REQUEST_FAILURE: {
                type: 'RequestError',
                message: 'An error occured while calling the specified address. {message}'
            },
            REQUEST_UNAVAILABLE: {
                type: 'RequestError',
                message: 'Unable to obtain a response from the specified address.'
            },
            REQUEST_UNSUPPORTED: {
                type: 'RequestError',
                message: 'This browser does not support XMLHttpRequest neither XDomainRequest.'
            },
            JSON_PARSE: {
                type: 'ParseError',
                message: 'Unable to parse the specified String according to JSON specification rules. {message}'
            },
            DOM_PARSE: {
                type: 'ParseError',
                message: 'Unable to parse an XRTML DOM Node. '
            },
            MISSING_ARGUMENT: {
                type: 'MethodError',
                message: 'A method {methodName} was called but the required argument {argument} was undefined.'
            },
            INVALID_ARGUMENT: {
                type: 'MethodError',
                message: 'The method {methodName} was called but the argument {argument} was of an invalid type. The expected type was {expectedType}'
            },
            UNEXPECTED: {
                type: 'UnexpectedError',
                message: 'An unexpected error occured. Cause error message is: {message}'
            },
            FATAL: {
                type: 'FatalError',
                message: 'A critical error occured. The error message is: {message}'
            },
            INVALID_DOM_ATTRIBUTE: {
                type: 'InvalidDomAttribute',
                message: 'An error occured when trying to retrive an unexisting attribute: {attribute}'
            },
            TEMPLATING: {
                type: 'TemplateError',
                message: 'An error occured when trying to apply bindings to a template. The cause is: {message}'
            },
            TEMPLATING_EFFECTS: {
                type: 'TemplateError',
                message: 'An error occured when trying to run effects binded in a template. Are the effects configured in the tag? The error cause is: {message}'
            },
            UNEXPECTEDMEDIA: {
                type: 'UnexpectedMediaError',
                message: 'An error occurred when trying to operate on media. The cause is: {message}'
            },
            UNEXPECTEDEVENT: {
                type: 'UnexpectedEventError',
                message: 'An error occurred when trying to process the "{eventType}" event handler. The cause is: {message}'
            },
            MISSING_LIBRARY: {
                type: 'MissingLibrary',
                message: 'A required library {library} {module} is not available. Please import this library.'
            }
        };

        //Temporary way to show has much information as possible about errors in IE. Needs a better approach.
        var printOlderBrowserError = function (err) {
            var errorStringArray = [];
            errorStringArray.push(err.name + ': ' + err.message + '\n');
            function buildErrorString(error, errorA, identBy, level) {
                var identArr = [];
                for (var i = 0; i < identBy; i++) {
                    identArr.push(' ');
                }
                var identString = identArr.join('');
                if (level < 9) {
                    for (var key in error) {
                        if (error.hasOwnProperty(key) && key != 'name' && key != 'message') {
                            if (typeof error[key] === 'string' || typeof error[key] === 'number' || typeof error[key] === 'boolean') {
                                errorA.push((identString + key + ': ' + error[key]) + '\n');
                            } else if (xRTML.Common.Object.isObject(error[key])) {
                                errorA.push(identString + key + ': \n');
                                buildErrorString(error[key], errorA, identBy + 4, level + 1);
                            } else if (xRTML.Common.Array.isArray(error[key])) {
                                errorA.push(identString + key + ': \n');
                                for (var i = 0; i < error[key].length; i++)
                                    buildErrorString(error[key], errorA, identBy + 4, level + 1);
                            }

                        }
                    }
                } else {
                    errorA.push(identString + error.toString() + '\n');
                }
            }
            buildErrorString(err, errorStringArray, 0, 1);

            xRTML.Console.error(errorStringArray.join(''));
        }
        /**
        * @end
        */
    })(xRTML.Error = xRTML.Error || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.Common Provides a set of organized utility methods.
    */
    (function (Common, undefined) {
        /**
        *   @class {public} xRTML.Common.? Provides a set of methods to handle arrays.
        */
        (function (Array, undefined) {

            /**
            *  @function {public void} ? Iterates over each of the items of an array executing a function for each element.
            *  @param {Array} items The array to be iterated through.
            *  @param {Function} fn The function to be executed for each element contained in the array.
            */
            Array.forEach = function (items, fn) {                
                for (var i = 0, len = items.length; i < len; i++) {
                    fn(items[i], i);
                }
            };

            /**
            *  @function {public Number} ? Searches for the index of the first occurrence of a specified object in the array.
            *  @param {Object} args struture with arguments for the function.
            *  @... {Array} items The array to be searched in.
            *  @... {Object} obj The object to be matched with.
            *  @... {optional Number} start The index of the array from where the search should start.
            *  @returns The index of the object in the array. Return -1 if the object is not found.
            */
            Array.indexOf = function (args) {
                var items = args.items;
                for (var i = (args.start || 0), j = items.length; i < j; i++) {
                    if (xRTML.Common.Object.equals({ o1: items[i], o2: args.obj })) {
                        return i;
                    }
                }
                return -1;
            };

            /**
            *  @function {public Number} ? Searches for the index of the first occurrence of a specified object in the array. The evaluation if the object matches the search is specified by a Function.
            *  @param {Object} args struture with arguments for the function.
            *  @... {Array} items The array to be searched in.
            *  @... {Function} fn The function to apply for each item (the arguments that will be passed to this function are: currentItem, index, itemsArray).
            *  @... {optional Number} start The index of the array from where the search should start.
            *  @returns The index of the object in the array. Return -1 if the object is not found.
            */
            Array.someIndex = function (args) {
                var items = args.items;
                for (var i = (args.start || 0), j = items.length; i < j; i++) {
                    if (i in args.items && args.fn.call(args.items, args.items[i], i, args.items))
                        return i;
                }
                return -1;
            };

            // Array Remove - By John Resig (MIT Licensed)
            /**
            *  @function {public Array} ? Removes all the elements specified by the provided indexes.  
            *  @param {Object} args struture with arguments for the function.
            *  @... {Array} items The array from where the elements will be removed.
            *  @... {Number} from The index of the array from where the removal will begin.
            *  @... {Number} to The index of the array where the removal will end.
            *  @returns The array with the remaining elements.
            */
            Array.remove = function (args) {
                var items = args.items,
                    from = args.from,
                    to = args.to,
                    rest = items.slice((to || from) + 1 || items.length);

                items.length = from < 0 ? items.length + from : from;
                items.push.apply(items, rest);
                return items;
            };

            /**        
            *  @function {public Boolean} ? Check if an array contains the provided object.
            *  @param {Object} args struture with arguments for the function.
            *  @... {Array} items The array to searched in.
            *  @... {Object} obj The object to search for.
            *  @returns A boolean stating the result of the search.
            */
            Array.contains = function (args) {
                var items = args.items;
                for (var i = 0, len = items.length; i < len; i++) {
                    if (xRTML.Common.Object.equals({ o1: items[i], o2: args.obj })) {
                        return true;
                    }
                }
                return false;
            };

            /**        
            *  @function {public Boolean} ? This method will pass each element of the Array through the supplied function until true has been returned. 
            *  If the function returns true some will in turn return true. 
            *  If the entire array has been traversed and no true condition was found then some() will return false.
            *  @param {Object} args struture with arguments for the function.
            *  @... {Array} items The array to searched in.
            *  @... {Function} fn The function to apply for each item (the arguments that will be passed to this function are: currentItem, index, itemsArray).
            *  @returns A boolean stating the result of applying the function to all items.
            */
            Array.some = function (args) {
                var len = args.items.length;
                for (var i = 0; i < len; i++) {
                    if (i in args.items && args.fn.call(args.items, args.items[i], i, args.items))
                        return true;
                }
                return false;
            };

            /**
            *  @function {public Array} ? Removes the first occurrence of the specified object.
            *  @param {Object} args struture with arguments for the function.
            *  @... {Array} items The array from where the object will be removed.
            *  @... {Object} obj The object to be removed.
            *  @returns The array with the removed object.
            */
            Array.removeObj = function (args) {
                if (xRTML.Common.Array.contains(args)) {
                    var index = xRTML.Common.Array.indexOf(args);
                    args.items.splice(index, 1);
                }
                return args.items;
            };

            /**
            *  @function {public Boolean} ? Checks if the object is an array.      
            *  @param {Object} obj The Object to be tested.
            *  @returns A boolean stating the result of the type check.
            */
            Array.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            };
        })(xRTML.Common.Array = xRTML.Common.Array || {})
    })(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    (function (Common, undefined) {
        /**
        *  @class {public} xRTML.Common.? Provides access to Object related operations.
        */
        (function (Object, undefined) {
            /**
            *  @function {public Boolean} ? Compares if two objects are equivalent.
            *  @param {Object} items struture with the objects to be compared.
            *  @... {Object} o1 Object to be compared with.
            *  @... {Object} o2 Object to be compared with.
            *  @returns A boolean stating the result of the comparison.
            */
            Object.equals = function (items) {
                return xRTML.JSON.stringify(items.o1) === xRTML.JSON.stringify(items.o2);
            };
            /**
            *  @function {public Object} ? Clones an Object by providing a copy of the Object with the it's own properties.
            *  @param {public Object} args The arguments for this function.
            *  @... {Object} source The Object to be cloned.
            *  @... {Object} depth To which level should the copy be made (recommended to be kept in a low level to avoid stack overflow). Defaults to infity.
            *  @returns An Object clone.
            */
            //TODO: needs unit tests
            Object.clone = function (args) {
                var c = {};
                if (typeof (args.source) == "object" && (!args.depth || typeof (args.currentDepth) == 'undefined' || args.currentDepth < args.depth))
                    for (var p in args.source)
                        if ((typeof (args.source[p]) == "object"))
                            c[p] = Object.clone({source:args.source[p], depth: args.depth, currentDepth: args.currentDepth ? (args.currentDepth++) : 1 });
                        else
                            c[p] = args.source[p];
                return c;
            };
            /**
            *  @function {public Boolean} ? Checks if the object is of Object type.      
            *  @param {Object} obj The Object to be tested.
            *  @returns A boolean stating the result of the type check.
            */
            Object.isObject = function (obj) {
                return '' + obj == '[object Object]';
            };
            /**
            *  @function {public Object} ? Returns the value of a property in a case insensitive manner.      
            *  @param {Object} obj The target object.
            *  @param {String} prop The name of the property to ge the value from.
            *  @returns The value of the property in the object.
            */
            Object.insensitiveGetter = function (obj, prop) {
                for (var p in obj) {
                    if (obj.hasOwnProperty(p) && prop == (p + "").toLowerCase()) {
                        return obj[p];
                        break;
                    }
                }
            };
        })(xRTML.Common.Object = xRTML.Common.Object || {})
    })(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    (function (Common, undefined) {
        /**
        *  @class {public} xRTML.Common.? Provides a set of methods to handle functions.
        */
        (function (String, undefined) {
            /**
            *  @function {public Number} ? Removes all spaces from the string.
            *  @param {String} text The target String.
            *  @return The trimmed string.
            */
            String.trim = function (text) {
                if (typeof window.String.prototype.trim == 'function') {
                    return text.trim();
                }
                return text.replace(/^\s*/, "").replace(/\s*$/, "");
            };

            /**
            *  @function {public Number} ? Finds the index of the provided regular expression.
            *  @param {Object} args structure with the args definition.
            *  @... {String} text The target String.
            *  @... {RegExp} regex The target RegExp.
            *  @... {optional Number} startpos The position to start searching at.
            *  @return Position of the first match in the string or -1 if no match is found.
            */
            String.regexIndexOf = function (args) {
                var indexOf = args.text.substring(args.startpos || 0).search(args.regex);
                return (indexOf >= 0) ? (indexOf + (args.startpos || 0)) : indexOf;
            };

            /**
            *  @function {public String} ? Replaces all occurences of a token with the new token.
            *  @param {Object} args structure with the args definition.
            *  @... {String} text The target String.
            *  @... {String} token The value to be replaced.
            *  @... {String} newtoken The value to be replace instances of token.
            *  @return The string replaced.
            */
            String.replaceAll = function (args) {
                while ((typeof args.text == 'string') && (args.text.indexOf(args.token) != -1)) {
                    args.text = args.text.replace(args.token, args.newtoken);
                }
                return args.text;
            };

            /**
            *  @function {public String} ? Replaces all occurences of a given token with the new token.
            *  @param {Object} args structure with the args definition.
            *  @... {String} text The target String.
            *  @... {RegExp} regex The regex for the value to be replaced.
            *  @... {String} newtoken The value to be replace instances of regex.
            *  @return String replaced.
            */
            String.regexReplaceAll = function (args) {
                while ((typeof args.text == 'string') && (this.regexIndexOf(args) != -1)) {
                    args.text = args.text.replace(args.regex, args.newtoken);
                }
                return args.text;
            };

            /**
            * @function {public String} ? Populates placeholders in a string with given data with values passed in the values argument.
            * @param {String} text The target String.
            * @param {Object} data The values to replace the placeholders by the given properties' values.
            * @return The formatted string.
            */
            String.template = function (text, values) {
                for (var prop in values) {
                    var reg = new RegExp("\\{" + prop + "\\}", "gm");
                    text = text.replace(reg, values[prop]);
                }
                return text;
            };

            /**
            * @function {public String} ? Formats a string by replacing placeholders identified by curly brackets and the position '{position}'
            * with values passed in the values argument.
            * @param {String} text The target String.
            * @param {Array} values The list of values to replace the placeholders by the given positions in the array.
            * @return The formatted string.
            */
            String.format = function (text, values) {
                for (var i = 0, len = values.length; i < len; i++) {
                    var reg = new RegExp("\\{" + i + "\\}", "gm");
                    text = text.replace(reg, values[i]);
                }
                return text;
            };

        })(xRTML.Common.String = xRTML.Common.String || {})
    })(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    (function (Common, undefined) {
        /**
        *  Provides a set of methods to handle the Document Object Model.
        *  @class {public} xRTML.Common.?
        */
        (function (DOM, undefined) {

            /**
            *  @function {public String} ? Gets the name of the browser being used.
            *  @returns The browser type.
            */
            DOM.browser = function () {
                var userAgent = window.navigator.userAgent.toLowerCase();
                // list of known browser. NOTE: the order is important
                var browserNames = ['msie', 'firefox', 'chrome', 'safari', 'gecko'],
                browserTypes = ['ie', 'mozilla', 'mozilla', 'safari', 'mozilla'],
                browserType;
                for (var i = 0; i < browserNames.length; i++) {
                    if (userAgent.indexOf(browserNames[i]) >= 0) {
                        browserType = browserTypes[i];
                        break;
                    }
                }
                return browserType;
            };

            /**
            *  @function {public String} ? Gets the HTML contained within a DOM element.
            *  @param {Object} element DOM element to retrieve text from.
            *  @returns The content text value of the HTML element.
            */
            DOM.getText = function (element) {
                if (element) {
                    if (element.innerText) {
                        return element.innerText;
                    }
                    if (element.innerHTML) {
                        return element.innerHTML;
                    }
                    if (element.nextSibling) {
                        return element.nextSibling.data;
                    }
                }
                return '';
            };

            /**
            *  @function {public void} ? Sets the HTML contained within a DOM element.
            *  @param {Object} element DOM element to set text.
            *  @param {String} text The text to set as the content of element.
            */
            DOM.setText = function (element, text) {
                if (element) {
                    element.innerHTML = text;
                    element.innerText = text;
                }
            };

            /**
            *  @function {public void} ? Loads a script dynamically into the page.
            *  @param {Object} resource struture with arguments for the function. 
            *  @... {String} url The URL of the script to load.
            *  @... {Function} callback The function to be called after the script is loaded.
            */
            DOM.loadScript = function (resource) {
                var script = document.createElement("script");
                script.type = "text/javascript";

                if (script.readyState) {  //IE
                    script.onreadystatechange = function () {
                        if (script.readyState == "loaded" || script.readyState == "complete") {
                            script.onreadystatechange = null;
                            resource.callback.apply(this, arguments);
                        }
                    };
                } else {  //Others
                    script.onload = function () {
                        resource.callback.apply(this, arguments);
                    };
                    ///TODO: find a way to check if an error occured when Internet Explorer. Then use this also.
                    //script.onerror = function () {};
                }

                script.src = resource.url;
                document.getElementsByTagName("head")[0].appendChild(script);
            };

            /**
            *  @function {public void} ? Gets the current style property of an element.
            *  @param {Object} args Struture with arguments for the function.       
            *  @... {Object} element The element to retrieve the style property.
            *  @... {String} rule The rule to search.
            */
            DOM.getStyle = function (args) {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    return document.defaultView.getComputedStyle(args.element, "").getPropertyValue(args.rule);
                }

                if (args.element.currentStyle) {
                    var rule = args.rule.replace(/\-(\w)/g, function (strMatch, p1) {
                        return p1.toUpperCase();
                    });
                    return args.element.currentStyle[rule];
                }

                return "";
            };

        })(xRTML.Common.DOM = xRTML.Common.DOM || {})
    })(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    (function (Common, undefined) {
        /**
        *   Contains methods for performing HTTP and HTTPS requests.
        *   @class {public} xRTML.Common.Request
        */
        (function (Request, undefined) {

            /**
            *   Performs a POST request.
            *   @param {Object} args Contains the arguments for this function.
            *   @... {String} url The URL for the request.
            *   @... {Object} data The data to send through the request.
            *   @... {Function} success A function that will be called after the request returns a successful response.
            *   @... {Function} error A function that will be called after the request returns a erroneous response.
            *   @... {Function} complete A function that will always be called after the request returns any response. The params passed to this handler will be result, error, status (will only receive status when available in the request object)
            *   @... {optional Boolean} async Identifies if the request is asynchronous, defaults to Asynchronous
            *   @... {optional Boolean} crossDomain  Identifies if the request is to another domain. 
            *   If this setting is enabled then the server-side controller should contain these headers: Content-Type: text/plain, Access-Control-Allow-Origin: *, 
            *	Access-Control-Allow-Credentials: 'true', Access-Control-Allow-Methods: POST, OPTIONS, Access-Control-Max-Age: '60', Access-Control-Allow-Headers: X-Requested-With, Content-Type
            *   @function {public void} ?
            */
            Request.post = function (args) {
                args.method = 'POST';
                sendRequest(args);
            };

            /**
            *   Performs a GET request.
            *   @param {Object} args Contains the arguments for this function.
            *   @... {String} url The URL for the request.
            *   @... {Object} data The data to send through the request.
            *   @... {Function} success A function that will be called after the request returns a successful response.
            *   @... {Function} error A function that will be called after the request returns a erroneous response.
            *   @... {Function} complete A function that will always be called after the request returns any response. The params passed to this handler will be result, error, status (will only receive status when available in the request object)
            *   @... {optional Boolean} async Identifies if the request is asynchronous, defaults to Asynchronous
            *   @... {optional Boolean} crossDomain  Identifies if the request is to another domain. 
            *   If this setting is enabled then the server-side controller should contain these headers: Content-Type: text/plain, Access-Control-Allow-Origin: *, 
            *	Access-Control-Allow-Credentials: 'true', Access-Control-Allow-Methods: GET, OPTIONS, Access-Control-Max-Age: '60', Access-Control-Allow-Headers: X-Requested-With, Content-Type
            *   @function {public void} ?
            */
            Request.get = function (args) {
                args.method = 'GET';
                sendRequest(args);
            };

            var sendRequest = function (args) {

                var RequestType = getRequestType(args);

                var requestType = RequestType.create(args.method.toLowerCase(), args.url,
                    xRTML.Common.Function.proxy(function (result, error, status) {
                        if (typeof error != 'undefined' && error != null) {
                            if (!!args.error)
                                args.error(error);
                        } else {
                            if (!!args.success)
                                args.success(result);
                        }
                        if (!!args.complete)
                            args.complete(result, error, status);
                    }, this),
                args.async);

                requestType.send(!!args.data ? args.data : null);
            },

            getRequestType = function (args) {
                //Only way to check if the version of XHR support CORS is to instantiate it and check if the withCredentials property is there.
                //And we don't want to use XDR directly if possible because it supports less features than XHR v2.
                if (window.XMLHttpRequest && (!args.crossDomain || 'withCredentials' in XHR().getNativeObject())) {
                    return XHR();
                }
                else if (window.XDomainRequest) {
                    return XDR();
                } else {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.REQUEST_UNSUPPORTED, info: { className: 'xRTML.Common.Request', methodName: 'getRequestType (internal method, no docs available)'} });
                }
            },

            XHR = function () {

                return {

                    /*
                    *   Returns the platform dependent XHR Instance.
                    *   @function {public Object} ?
                    *   @throws xRTMLError xRTML specific error containing name, cause and stack trace. 
                    *   @return A platform dependent XHR Instance.
                    */
                    getNativeObject: function () {
                        if (window.XMLHttpRequest) {
                            // If IE7, Mozilla, Safari, and so on: Use native object.
                            return new XMLHttpRequest();
                        }
                        else
                            if (window.ActiveXObject) {
                                // ...otherwise, use the ActiveX control for IE5.x and IE6.
                                try {
                                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                                }
                                catch (e) { }
                                try {
                                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                                }
                                catch (e) { }
                                try {
                                    return ActiveXObject("Microsoft.XMLHTTP");
                                }
                                catch (e) { }
                            }

                        xRTML.Error.raise({ code: xRTML.Error.Codes.REQUEST_UNSUPPORTED, info: { className: 'xRTML.Common.Request.XHR (internal class, no docs available)', methodName: 'getNativeObject (internal method, no docs available)'} });
                    },


                    /*
                    *   Create XMLHttpRequest.
                    *   @param {String} method
                    *   @param {String} url
                    *   @param {Function} callback
                    *   @param {Boolean} async
                    *   @function {public Object} ?
                    *   @return A xhr Object.
                    */
                    create: function (method, url, callback, async) {
                        // closure
                        var self = this;
                        self.xhr = this.getNativeObject();
                        self.callback = callback;
                        method = method.toUpperCase();
                        // handles state changes
                        self.xhr.onreadystatechange = function () {
                            try {
                                if (this.readyState == 4) {
                                    if (this.status == 200) {
                                        self.callback(this.responseText, null, this.status);
                                    }
                                    else if (this.status == 0) {
                                        self.callback(null, 'The status code is 0 which likely means that the server is unavailable.', this.status);
                                    }
                                    else {
                                        self.callback(null, this.responseText, this.status);
                                    }
                                }
                            }
                            catch (e) {
                                xRTML.Console.error(e);
                            }
                        }

                        self.xhr.open(method, url, !!async ? async : true);

                        self.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
                        self.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                        if (method == "POST") {
                            self.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        }

                        return self;
                    },

                    /*
                    *   Send the XHR request
                    *   @param {Object} data Can be an Object to stringify or String Data.
                    *   @function {public void} ?
                    */
                    send: function (data) {
                        if (data && typeof (data) != 'string') {
                            data = xRTML.JSON.stringify(data);
                        }
                        xRTML.Console.log('Performing request with payload:' + data);
                        this.xhr.send(data);
                    }
                }
            },

            XDR = function () {

                return {

                    /*
                    *   Create XDomainRequest.
                    *   @param {String} method
                    *   @param {String} url
                    *   @param {Function} callback
                    *   @function {public Object} ?
                    *   @return A xdr Object.
                    */
                    create: function (method, url, callback, async) {
                        // closure
                        var self = this;
                        self.xdr = new XDomainRequest();
                        self.callback = callback;
                        method = method.toUpperCase();
                        // handles state changes
                        self.xdr.onload = function () {
                            try {
                                self.callback(self.xdr.responseText);
                            }
                            catch (err) {
                                xRTML.Error.raise({ code: xRTML.Error.Codes.UNEXPECTED, info: { message: err.message, className: 'xRTML.Common.Request.XDR (internal class, no docs available)', methodName: 'onload (internal method, no docs available)'} });
                            }
                        }
                        self.xdr.onerror = function () {
                            try {
                                self.callback(null, self.xdr.responseText);
                            }
                            catch (err) {
                                xRTML.Error.raise({ code: xRTML.Error.Codes.UNEXPECTED, info: { message: err.message, className: 'xRTML.Common.Request.XDR (internal class, no docs available)', methodName: 'onerror (internal method, no docs available)'} });
                            }
                        }

                        self.xdr.open(method, url, !!async ? async : true);

                        //XDR does not support custom headers.

                        //XDR only support text/plain content type (Earlier IEs don't allow setting any contentType!!).
                        try {
                            self.xdr.contentType = "text/plain";
                        } catch (err) { }


                        return self;
                    },

                    /*
                    *   Send the XHR request
                    *   @param {Object} data Can be an Object to stringify or String Data.
                    *   @function {public void} ?
                    */
                    send: function (data) {
                        var self = this;
                        function sendData(d) {
                            if (d && typeof (d) != 'string') {
                                d = xRTML.JSON.stringify(d);
                            }
                            xRTML.Console.log('Performing request with payload:' + d);
                            self.xdr.send(d);
                            if (self.xdrTimeout) {
                                clearTimeout(self.xdrTimeout);
                                self.xdrTimeout = undefined;
                            }
                        }
                        if (self.xdrReady) {
                            sendData(data);
                        } else {
                            self.xdrTimeout = setTimeout(function () {
                                sendData(data);
                            }, 500);
                        }
                    }
                }
            };

        })(xRTML.Common.Request = xRTML.Common.Request || {})
    })(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
 (function (xRTML, undefined) {
    (function (Common, undefined) {
        /**
        *   @class {public} xRTML.Common.? Provides a set of methods to manage browsers' cookies. 
        */
        (function (Cookie, undefined) {
            /**
            *  @function {public void} ? Adds or updates a cookie.
            *  @param {Object} cookie structure with the cookie definition.
            *  @... {String} name The name of the cookie.
            *  @... {String} value The value of the cookie.
            *  @... {optional Date} expires The expiration date of the cookie.
            *  @... {optional String} path Specifies a path within the site to which the cookie applies. Only documents in this path will be able to retrieve the cookie. Usually this is left blank, meaning that only the path that set the cookie can retrieve it.
            *  @... {optional String} domain Specifies a domain within which the cookie applies. Only websites in this domain will be able to retrieve the cookie. Usually this is left blank, meaning that only the domain that set the cookie can retrieve it.
            *  @... {optional String} secure Indicates that the browser should use SSL when sending the cookie to the server. This flag is rarely used.
            */
            Cookie.setCookie = function (cookie) {
                var cookieString = cookie.name + "=" + escape(cookie.value);

                if (cookie.expires) {
                    cookieString += "; expires=" + cookie.expires.toGMTString();
                }

                if (cookie.path) {
                    cookieString += "; path=" + escape(cookie.path);
                }
                else {
                    cookieString += "; path=/";
                }

                if (cookie.domain)
                    cookieString += "; domain=" + escape(cookie.domain);

                if (cookie.secure)
                    cookieString += "; secure";

                document.cookie = cookieString;
            };

            /**
            *  @function {public Object} ? Gets the value of a stored cookie.
            *  @param cookie structure with the cookie definition.
            *  @... {String} name The name of the stored cookie.
            *  @returns The cookie according to the name.
            */
            Cookie.getCookie = function (cookie) {
                var results = document.cookie.match('(^|;) ?' + cookie.name + '=([^;]*)(;|$)');

                if (results) {
                    return (unescape(results[2]));
                }

                return null;
            };

            /**
            *  @function {public void} ? Removes a stored cookie.
            *  @param cookie structure with the cookie definition.
            *  @... {String} name The name of the stored cookie.
            *  @... {optional String} path Specifies a path within the site to which the cookie applies. Only documents in this path will be able to retrieve the cookie. Usually this is left blank, meaning that only the path that set the cookie can retrieve it.
            *  @... {optional String} domain Specifies a domain within which the cookie applies. Only websites in this domain will be able to retrieve the cookie. Usually this is left blank, meaning that only the domain that set the cookie can retrieve it.
            *  @... {optional String} secure Indicates that the browser should use SSL when sending the cookie to the server. This flag is rarely used.
            */
            Cookie.deleteCookie = function (cookie) {
                cookie.value = "";
                cookie.expires = new Date("Thu, 01 Jan 1970 00:00:01 GMT");
                Cookie.setCookie(cookie);
            };

        })(xRTML.Common.Cookie = xRTML.Common.Cookie || {})
    })(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
 (function (xRTML, undefined) {
     (function (Common, undefined) {

         /**
         *   Validates that values fulfill specific conditions. Mainly that data types are valid.
         *   @class {public} xRTML.Common.?
         *   @author IBT
         *   @since 0.1
         *   @version 0.1
         */
         (function (Validator, undefined) {

             /**
             *   Checks if the given value is not considered empty (falsy, different than 0 or an empty Array).
             *   @param {Object} prop The name of the property to test.
             *   @param {Object} target The target object to validate against.
             *   @function {public} ?
             */
             Validator.validateRequired = function (args) {
                 if (!args.target[args.prop] && args.target[args.prop] != 0 && ( xRTML.Common.Array.isArray(args.target[args.prop]) && args.target[args.prop].length <= 0 ) )
                    xRTML.Error.raise({ code: xRTML.Error.Codes.MANDATORY_PROPERTY, target: args.target, info: { property:args.prop } });
             };

             /**
             *   Checks if the given value is not of the specified type.
             *   @param {Object} prop The name of the property to test.
             *   @param {Object} type The JavaScript type to test.
             *   @param {Object} target The target object to validate against.
             *   @function {public} ?
             */
             Validator.validateType = function (args) {
                 if ( typeof args.target[prop] != args.type )
                     xRTML.Error.raise({ code: xRTML.Error.Codes.INVALID_PROPERTY, target: args.target, info: { property: args.prop, validType: args.type } });
             };

         })(xRTML.Common.Validator = xRTML.Common.Validator || {})
     })(xRTML.Common = xRTML.Common || {})
 })(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    (function (Common, undefined) {
        /**
        *   Converts elements to the intended data types. 
        *   @class {public} xRTML.Common.?
        */
        (function (Converter, undefined) {

            /**
            *   Converts a String to a Boolean.
            *   @param {String} value The value to convert.
            *   @function {public Boolean} ?      
            *   @returns The value converted          
            */
            Converter.toBoolean = function (value) {
                return typeof value === 'undefined' ? value : (/^true|1|yes$/i).test(value);
            };

            /**
            *   Converts a String to a Number. Calls Validator.validateNumber() to check for it's validity before casting.
            *   @param {String} value The value to convert (mandatory).
            *   @function {public Number} ?      
            *   @returns The value converted
            */
            Converter.toNumber = function (value) {
                if (typeof value === 'undefined') return value;
                if (typeof value == 'number') return value;
                if (typeof value == 'string') return xRTML.Common.String.trim(value) == '' ? 0 : window.Number(value);
            };

        })(xRTML.Common.Converter = xRTML.Common.Converter || {})
    })(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    (function (Common, undefined) { 
        /**
        *  @class {public} xRTML.Common.? Provides miscellaneous methods for programming convenience.
        */
        (function (Util, undefined) {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };

            /**
            *  @function {public Object} ? Converts a string containing a structure similar to JSON to an object representing a JSON structure.
            *  @param {String} attributeValue The value to be converted.
            *  @returns Structure resulting from the conversion. 
            */
            Util.convertAttributeValueToJSON = function (attributeValue) {
                var parsedValue;
                if (attributeValue) {
                    attributeValue = xRTML.Common.String.replaceAll({text:attributeValue, token:"\'", newtoken:"\""});
                    if (typeof attributeValue == 'string') {
                        parsedValue = xRTML.JSON.parse(attributeValue);
                    } else {
                        parsedValue = attributeValue;
                    }
                } else {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.MISSING_ARGUMENT, info: { className: 'xRTML.Common.Util', methodName: 'convertAttributeValueToJSON', argument: 'attributeValue'} }); 
                }
                return parsedValue;
            };

            /**
            *  @function {public String} ? Generates a globally unique identifier.
            *  @returns A string representing a globally unique identifier. 
            */
            Util.guidGenerator = function () {
                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            };

            /**
            *  @function {public String} ? Generates a random identifier.
            *  @returns A string representing an identifier. 
            */
            Util.idGenerator = function () {
                return (S4() + S4());
            };
        })(xRTML.Common.Util = xRTML.Common.Util || {})
    })(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    (function (Common, undefined) {
        /**
        *  @class {public} xRTML.Common.? Provides a set of methods to handle functions.
        */
        (function (Function, undefined) {

            /**
            *  @function {public Function} ? Returns a function with the given context.
            *  @param {Function} fn The function whose context will be changed.
            *  @param {Object} context The object to which the context of the function should be set.
            *  @return A function with the new context.
            */
            Function.proxy = function (fn, context) {
                if (typeof fn === 'function' && typeof context === 'object') {
                    return function () {
                        return fn.apply(context, arguments);
                    };
                }
            };

            /**
            *  @function {public Function} ? Takes the name of a function and converts it into a function.
            *  @param {Function} fnName The name of the function.
            *  @return The generated function.
            */
            Function.parse = function (fnName) {

                if (typeof fnName == 'function') return fnName;

                if (typeof fnName != 'string') return null;

                var args = "",
                    body = "return " + fnName + "(";
                if (arguments.length != 1) {
                    for (var i = 1; i < arguments.length; ++i) {
                        args += arguments[i] + ',';
                    }
                    args = args.substring(0, args.length - 1);
                }

                body += args + ");";
                return new window.Function(args, body);
            };

        })(xRTML.Common.Function = xRTML.Common.Function || {})
    })(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.ConnectionManager Provides access to a data layer to manage the transmission and retrieval of information between the xRTML connections and the ORTC servers.
    */
    (function (ConnectionManager, undefined) {
        /*
        *  @property connections The object where all of the connections are stored.
        */
        var connections = {},
        /*
        *  @function xRTML.ConnectionManager.? Gets a connection by the user given id.
        *  @param {number} id The id of the intended connection.
        *  @returns The connection with the given id.
        */
        getById = function (id) {
            for (var key in connections) {
                if (connections[key].id === id) {
                    return connections[key];
                }
            }
            xRTML.Console.debug('Connection with id: ' + id + ' was not found.');
            return undefined;
        },

        messageBuffer = {
            add: function (args) {
                var id = args.connection.id;
                if (!this.bConnections[id]) {
                    this.bConnections[id] = [];
                    args.connection.bind({ connect: this.send });
                }
                this.bConnections[id].push(args.message);
            },
            bConnections: {},
            send: function (e) {
                var messages = messageBuffer.bConnections[e.target.id],
                c = e.target;
                for (var i = 0; i < messages.length; ++i)
                    c.send(messages[i]);
                // after all messages are sent:
                // a. remove this listener
                c.unbind({ connect: messageBuffer.send });
                // b. remove connection from buffer
                messageBuffer.bConnections[e.target.id] = undefined;
            }
        };

        /**
        *  @function {public Object} xRTML.ConnectionManager.? Creates a new connection based on a JSON object.
        *  @param {Object} connection structure with the connection attributes.
        *  @... {optional String} id Connection's identification.
        *  @... {optional String} appKey Identifies the application using the ORTC API. Optional only if attribute 'autoConnect' is set to false.
        *  @... {optional String} authToken Identifies a user belonging to the application using the ORTC API. Optional only if attribute 'autoConnect' is set to false.
        *  @... {optional Number} sendRetries Number of times a connection should try to send a message in case the first attempt fails. Defaults to 5.
        *  @... {optional Number} sendInterval Period of time in miliseconds between message send retries by the connection. Defaults to 1000 ms. 
        *  @... {optional Number} timeout Maximum amount of time (miliseconds) a connection tag should take to perform a connect. Defaults to the according Config.connectionTimeout value.
        *  @... {optional Number} connectAttempts Number of times a connection should try to issue a connect. Defaults to the according Config.connectionAttempts value. 
        *  @... {optional Boolean} autoConnect Indicates if a connection should be established implicitly after it's created. Defaults to true.
        *  @... {optional String} metadata Provides information about one or more aspects of the data associated with the connection.
        *  @... {optional String} serverType Tells which library to be used by the ORTC client. Defaults to 'IbtRealTimeSJ'.
        *  @... {optional String} url Path to the location of the real-time comunication server is located. Optional if attribute 'autoConnect' is set to false.
        *  @... {optional Boolean} isCluster Indicates if connection should be made to a cluster server. Default is true.
        *  @... {optional Channel[]} channels Array of channels to be added to the connection.
        *  @... {optional Function} oncreate Event handler raised when the connection is created.
        *  @... {optional Function} onconnect Event handler raised when a connection is successfully established.
        *  @... {optional Function} ondisconnect Event handler raised when the connection has lost comunication with the Online Realtime Communication (ORTC) server.
        *  @... {optional Function} onsubscribe Event handler raised when a channel is subscribed.
        *  @... {optional Function} onunsubscribe Event handler raised when a channel is unsubscribed.
        *  @... {optional Function} onexception Event handler raised when there's an error performing ORTC related operations.
        *  @... {optional Function} onreconnect Event handler raised when there's a reconnection to the ORTC servers.
        *  @... {optional Function} onreconnecting Event handler raised when a reconnection to the ORTC servers is under way.
        *  @... {optional Function} onmessage Event handler raised when a message arrives through any channel subscribed in this connection.
        *  @... {optional Function} messageAdapter Callback method that allow changes to be made to the message. Called when a message arrives through any channel subscribed in this connection.
        *  @returns The newly created xRTML Connection.
        */
        ConnectionManager.create = function (connection) {
            return this.add(new this.Connection(connection));
        };

        /**
        *  @function {public xRTML.ConnectionManager.Connection} xRTML.ConnectionManager.? Adds an xRTML connection to the xRTML platform.
        *  @param {xRTML.ConnectionManager.Connection} connection structure with the xRTML connection object.
        *  @returns The added xRTML Connection.
        */
        ConnectionManager.add = function (connection) {
            // add only if doesn't exist yet
            if (this.getById(connection.id)) return;

            this.Connections.push(connection.id);

            this.fire({
                /**
                *  Fired when a connection is created.
                *  @event xRTML.ConnectionManager.evt_connectioncreate
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target module that raised this event.
                *  @... {Object} connection the connection that was created.
                */
                connectioncreate: { connection: connection }
            });

            // add the new connection
            connections[connection.internalId] = connection;
            // add listener for incoming messages
            connection.bind({
                xrtmlmessage: function (e) {
                    ConnectionManager.fire({
                        /**
                        *  Fired when a connection receives an xRTML message.
                        *  @event xRTML.ConnectionManager.evt_xrtmlmessage
                        *  @param {Object} e struture with the definition of the event's parameters.
                        *  @... {Object} target module that raised this event.
                        *  @... {Object} connection name of the connection that received the xRTML message.
                        *  @... {String} channel name of the connections subscribed channel through where the xRTML message was received.
                        *  @... {xRTML.MessageManager.Message} message trigger that was registered.
                        */
                        xrtmlmessage: { connection: e.target, channel: e.channel, message: e.message }
                    });
                }
            });


            connection.bind({
                dispose: function (e) {

                    var connectionInternalId = e.target.internalId,
	                    disposedConnection = connections[connectionInternalId];

                    // remove this tag instance from the private connections array.
                    connections[connectionInternalId] = null;
                    delete connections[connectionInternalId];

                    // remove the id from the public connections array
                    for (var i = 0, cons = ConnectionManager.Connections, len = cons.length; i < len; i++)
                        if (cons[i] === e.target.id) { cons.splice(i, 1); break; }

                    ConnectionManager.fire({
                        /**
                        *  Fired when a connection is deleted.
                        *  @event xRTML.ConnectionManager.evt_connectiondispose
                        *  @param {Object} e struture with the definition of the event's parameters.
                        *  @... {Object} target module that raised this event.
                        *  @... {Object} connection the connection that was deleted.
                        */
                        connectiondispose: { connection: e.target }
                    });
                }
            });

            return connection;
        };

        /**
        *  @function {public Number} xRTML.ConnectionManager.? Gets a connection by its internal or user given id.
        *  @param {String} id The id of the intended connection.
        *  @returns The connection with the given id.
        */
        ConnectionManager.getById = function (id) {
            return connections[id] || getById(id);
        };

        /**
        *  @function {public void} xRTML.ConnectionManager.? Removes all references of the specified Connection.
        *  @param {String} id The id of the intended connection.
        */
        ConnectionManager.dispose = function (id) {
            var connection = this.getById(channel.connectionId);
            connection.dispose();
        };

        /**
        *  @function {public void} xRTML.ConnectionManager.? Adds a channel to a connection.
        *  @param {xRTML.ConnectionManager.Channel} channel structure with the channel definition.
        */
        ConnectionManager.addChannel = function (channel) {
            // first try to get the connection by internal id
            var connection = this.getById(channel.connectionId);
            if (typeof connection === 'undefined') {
                // try getting by id
                connection = this.getConnectionById(channel.connectionId);
                if (connection === null) {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.CONNECTION_NOT_FOUND, target: this, info: { className: 'xRTML.ConnectionManager', methodName: 'addChannel'} });
                }
            }
            connection.createChannel(channel);
        };

        /**
        *  @function {public void} xRTML.ConnectionManager.? Sends a message through the specified connections and channel.
        *  @param {Object} message struture with the definition of the message.
        *  @... {String[]} connections Ids of the connections.
        *  @... {String} channel Name of the channel.
        *  @... {Object} content Message to be sent.
        *  @... {optional Boolean} sendOnly Identifies if the message should be sent and discarded by the connection that sends it.
        */
        ConnectionManager.sendMessage = function (message) {
            var connection = null;
            for (var i = 0; i < message.connections.length; ++i) {
                connection = this.getById(message.connections[i]);
                if (connection) {
                    if (connection.isConnected()) {
                        connection.send(message);
                    }
                    else {
                        messageBuffer.add({
                            connection: connection,
                            message: {
                                channel: message.channel,
                                content: message.content,
                                sendOnly: message.sendOnly
                            }
                        });
                        xRTML.Console.debug('ConnectionManager: Connection with id ' + message.connections[i] + ' is not connected. Buffering message:');
                        xRTML.Console.debug(message);
                    }
                }
                else {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.CONNECTION_NOT_FOUND, target: this, info: { className: 'xRTML.ConnectionManager', methodName: 'sendMessage'} });
                }
            }
        };

        /*
        *  @property Connections The array where all of the connections ids are stored.
        */
        ConnectionManager.Connections = [];

        xRTML.Event.extend(ConnectionManager);

    })(xRTML.ConnectionManager = xRTML.ConnectionManager || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    (function (ConnectionManager, undefined) {

        /**
        *  @class xRTML.ConnectionManager.Channel
        */
        /**
        *  @property {Number} connectionId Id of the connection the channel is going to added to.
        */
        /**
        *  @property {String} name Name of the channel.
        */
        /**
        *  @property {Boolean} subscribeOnReconnect Indicates if the channels subscription is automatically made in case there's a reconnect. Defaults to true.
        */
        /**
        *  @property {Boolean} subscribe Indicates if the channel is to be subscribed as soon as its added to the connection. Defaults to true.
        */
        /**
        *  @property {Function} onMessage Event handler raised when a message arrives through the channel.
        */
        /**
        *  @property {Function} messageAdapter Callback handler that allow changes to be made to the message. Like converting a message from an unknown source into an xRTML message. Called when a message arrives through the channel.
        */
        /**
        * @constructor xRTML.ConnectionManager.Channel
        * @param args Structure with the channel definition.
        * @...{Number} connectionId Id of the connection the channel is going to added to.
        * @...{String} name Name of the channel.
        * @...{optional Boolean} subscribeOnReconnect Indicates if the channels subscription is automatically made in case there's a reconnect. Defaults to true.
        * @...{optional Boolean} subscribe Indicates if the channel is to be subscribed as soon as its added to the connection. Defaults to true.
        * @...{optional Function} onMessage Event handler raised when a message arrives through the channel.
        * @...{optional Function} messageAdapter Callback handler that allow changes to be made to the message. Like converting a message from an unknown source into an xRTML message. Called when a message arrives through the channel.
        */

        /**
        * @class {private} xRTML.ConnectionManager.Connection Represents a (ORTC) connection to a real-time comunication server.
        */
        /**
        * @constructor {public} xRTML.ConnectionManager.Connection Initializes a connection by setting it attributes.
        * @param args Structure with the connection definition.
        * @... {optional String} id Identification of the connection.
        * @... {optional String} appKey Identifies the application using the ORTC API.
        * @... {optional String} authToken Identifies a user belonging to the application using the ORTC API.
        * @... {optional Number} sendRetries Number of times a connection should try to send a message in case the first attempt fails. Defaults to 5. {@default 5}
        * @... {optional Number} sendInterval Period of time in miliseconds between message send retries by the connection. Defaults to 1000 ms. {@default 1000 ms}
        * @... {optional Number} timeout Period of time in miliseconds between connection attempts. Defaults to the according Configuration connectionTimeout value. {@default @link{ xRTML.Config.connectionTimeout } }
        * @... {optional Number} connectAttempts Number of times a connection should attempt to be established. Defaults to the according Configuration connectionTimeout value. {@default @link{ xRTML.Config.connectionAttempts } }
        * @... {optional Number} connectionAttemptsCounter Number of connection attempts that have been made. {@default 0}
        * @... {optional Boolean} autoConnect Indicates if a connection should be established implicitly after it's created. Defaults to true. {@default true}
        * @... {optional String} metadata Provides information about one or more aspects of the data associated with the connection.
        * @... {optional String} serverType Tells which library to be used by the ORTC client. Defaults to 'IbtRealTimeSJ'. {@default IbtRealTimeSJ}
        * @... {String} url Path to the location of the real-time comunication server is located.
        * @... {optional Boolean} isCluster Indicates if connection should be made to a cluster server. Defaults to true. {@default true}
        * @... {optional String} announcementSubChannel The name of the announcement subchannel.
        * @... {optional xRTML.ConnectionManager.Channel[]} channels Represents all the existing channels in the connection.
        * @... {optional Function} messageAdapter Callback method that allow changes to be made to the message. Called when a message arrives through any channel subscribed to this connection.
        * @... {optional Function} onCreate Event handler assigned to the create event.
        * @... {optional Function} onConnect Event handler assigned to the connect event. 
        * @... {optional Function} onDisconnect Event handler assigned to the disconnect event. 
        * @... {optional Function} onSubscribe Event handler assigned to the subscribe event. 
        * @... {optional Function} onUnsubscribe Event handler assigned to the unsubscribe event.
        * @... {optional Function} onException Event handler assigned to the exception event. 
        * @... {optional Function} onReconnect Event handler assigned to the reconnect event.
        * @... {optional Function} onReconnecting Event handler assigned to the reconnecting event.
        * @... {optional Function} onMessage Event handler assigned to the message event.
        * @... {optional Function} onDispose Event handler assigned to the dispose event.
        */
        ConnectionManager.Connection = function (args) {
            var ortcClient = null,
                active = true;

            xRTML.Event.extend(this);

            /**
            *  @property {read String} internalId Identification of the connection, automatically generated.
            */
            this.internalId = xRTML.Common.Util.guidGenerator();

            /**
            *  @property {String} id Identification of the connection, assigned by the user.
            */
            this.id = args.id || this.internalId;

            /**
            *  @property {String} appKey Identifies the application using the ORTC API.
            */
            this.appKey = args.appKey;

            /**
            *  @property {String} authToken Identifies a user belonging to the application using the ORTC API.
            */
            this.authToken = args.authToken;

            /**
            *  @property {Number} sendRetries Number of times a connection should try to send a message in case the first attempt fails. Defaults to 5. {@default 5}
            */
            this.sendRetries = parseInt(args.sendRetries) || 5;

            /**
            *  @property {Number} sendInterval Period of time in miliseconds between message send retries by the connection. Defaults to 1000 ms. {@default 1000 ms}
            */
            this.sendInterval = parseInt(args.sendInterval) || 1000;

            /**
            *  @property {Number} timeout Period of time in miliseconds between connection attempts. Defaults to the according Configuration connectionTimeout value. {@default @link{ xRTML.Config.connectionTimeout } }
            */
            this.timeout = args.timeout || xRTML.Config.connectionTimeout;

            /**
            *  @property {Number} connectAttempts Number of times a connection should attempt to be established. Defaults to the according Configuration connectionTimeout value. {@default @link{ xRTML.Config.connectionAttempts } }
            */
            this.connectAttempts = args.connectAttempts || xRTML.Config.connectionAttempts;

            /**
            *  @property {Number} connectionAttemptsCounter Number of connection attempts that have been made. {@default 0}
            */
            this.connectionAttemptsCounter = 0;

            /**
            *  @property {Boolean} autoConnect Indicates if a connection should be established implicitly after it's created. Defaults to true. {@default true}
            */
            this.autoConnect = !!args.autoConnect ? xRTML.Common.Converter.toBoolean(args.autoConnect) : true;

            /**
            *  @property {String} metadata Provides information about one or more aspects of the data associated with the connection.
            */
            this.metadata = args.metadata;

            /**
            *  @property {String} serverType Tells which library to be used by the ORTC client. Defaults to 'IbtRealTimeSJ'. {@default IbtRealTimeSJ}
            */
            this.serverType = args.serverType || 'IbtRealTimeSJ';

            /**
            *  @property {String} url Path to the location of the real-time comunication server is located.
            */
            this.url = args.url || xRTML.Console.error('Connection ' + (this.id || this.internalId) + ': ORTC Server URL must be set.');

            /**
            *  @property {Boolean} isCluster Indicates if connection should be made to a cluster server. Defaults to true. {@default true}
            */
            this.isCluster = !!args.isCluster ? xRTML.Common.Converter.toBoolean(args.isCluster) : true;

            /**
            *  @property {String} announcementSubChannel The name of the announcement subchannel.
            */
            this.announcementSubChannel = args.announcementSubChannel;

            /**
            *  @property {xRTML.ConnectionManager.Channel[]} channels Represents all the existing channels in the connection.
            */
            this.channels = {};

            /**
            *   @property {Function} messageAdapter Callback method that allow changes to be made to the message. Called when a message arrives through any channel subscribed to this connection.
            */
            this.messageAdapter = args.messageAdapter;

            var toFunction = xRTML.Common.Function.parse,
                proxy = xRTML.Common.Function.proxy;

            // Events
            this.bind({
                /**
                *  Fired when the connection obtains an ORTC client.
                *  @event evt_create
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target connection that raised this event.
                */
                create: toFunction(args.onCreate),
                /**
                *  Fired when the connection is established.
                *  @event evt_connect
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target connection that raised this event.
                */
                connect: toFunction(args.onConnect),
                /**
                *  Fired when there's a disconnection from the ORTC server.
                *  @event evt_disconnect
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target connection that raised this event.
                */
                disconnect: toFunction(args.onDisconnect),
                /**
                *  Fired when the connection has subscribed to a channel.
                *  @event evt_subscribe
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target connection that raised this event.
                *  @... {String} channel name of the subscribed channel.
                */
                subscribe: toFunction(args.onSubscribe),
                /**
                *  Fired when the connection has unsubscribed a channel.
                *  @event evt_unsubscribe
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target connection that raised this event.
                *  @... {String} channel name of the subscribed channel.
                */
                unsubscribe: toFunction(args.onUnsubscribe),
                /**
                *  Fired when an ORTC related exception has occurred.
                *  @event evt_exception
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target connection that raised this event.
                *  @... {String} channel description of the raised exception.
                */
                exception: toFunction(args.onException),
                /**
                *  Fired when a connection to an ORTC server is reestablished.
                *  @event evt_reconnect
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target connection that raised this event.
                */
                reconnect: toFunction(args.onReconnect),
                /**
                *  Fired when a connection to an ORTC server is in the process of being reestablished.
                *  @event evt_reconnecting
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target connection that raised this event.
                */
                reconnecting: toFunction(args.onReconnecting),
                /**
                *  Fired when a connection receives a message through a subscribed channel.
                *  @event evt_message
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target connection that raised this event.
                *  @... {String} channel name of the subscribed channel from where the message was received.
                *  @... {String} message message that was received.
                */
                message: toFunction(args.onMessage),
                /**
                *  Fired when a connection is disposed.
                *  @event evt_dispose
                */
                dispose: toFunction(args.onDispose)
            });

            var onMessage = proxy(function (client, channel, message) {
                this.process({ channel: channel, message: message });
            }, this),
            // Event Handlers
            onFactoryLoaded = function (e) {
                ortcClient = e.createClient();
                ortcClient.setId(this.internalId);
                ortcClient.setConnectionTimeout(this.timeout);
                ortcClient.setConnectionMetadata(this.metadata);
                ortcClient.setAnnouncementSubChannel(this.announcementSubChannel);
                !this.isCluster ? ortcClient.setUrl(this.url) : ortcClient.setClusterUrl(this.url);

                ortcClient.onConnected = proxy(function (ortcClient) {
                    // subscribe channels
                    for (var name in this.channels) {
                        var channel = this.channels[name];
                        if (channel.subscribe) {
                            ortcClient.subscribe(channel.name, channel.subscribeOnReconnect, onMessage);
                        }
                    }
                    this.fire({ connect: {} });
                }, this);

                ortcClient.onDisconnected = proxy(function (ortcClient) {
                    this.fire({ disconnect: {} });
                }, this);

                ortcClient.onSubscribed = proxy(function (ortcClient, channel) {
                    this.fire({ subscribe: { channel: channel} });
                }, this);

                ortcClient.onUnsubscribed = proxy(function (ortcClient, channel) {
                    this.fire({ unsubscribe: { channel: channel} });
                    // remove from array
                    if (this.channels[channel]) {
                        delete this.channels[channel];
                    }
                }, this);

                ortcClient.onException = proxy(function (ortcClient, evt) {
                    this.fire({ exception: { message: evt} });
                    xRTML.Error.raise({ code: xRTML.Error.Codes.ORTC_EXCEPTION, info: { className: 'ORTCClient', methodName: 'onException', message: evt} });
                }, this);

                ortcClient.onReconnected = proxy(function (ortcClient) {
                    //Connection established. Clean the counter.
                    this.connectionAttemptsCounter = 0;
                    this.fire({ reconnect: {} });
                }, this);

                ortcClient.onReconnecting = proxy(function (ortcClient) {
                    if (this.connectionAttemptsCounter >= this.connectAttempts) {
                        //Stop trying to reconnect.
                        ortcClient.disconnect();
                    } else {
                        this.connectionAttemptsCounter++;
                        this.fire({ reconnecting: {} });
                    }
                }, this);

                // notify of connection creation
                this.fire({ create: {} });

                // perform the connection
                if (this.autoConnect) {
                    ortcClient.connect(this.appKey, this.authToken);
                }
            };

            var retrySend = function (message, retries) {
                // ensure we're sending a message in a string format
                if (typeof message.content === "object") {
                    message.content = message.content.stringify();
                }
                if (this.isCreated() && this.isConnected()) {
                    ortcClient.send(message.channel, message.content);
                }
                else {
                    if (++retries <= this.sendRetries) {
                        setTimeout(proxy(function () {
                            proxy(retrySend, this)(message, retries);
                        }, this), this.sendInterval);
                        xRTML.Console.debug("Message " + message.content + " not sent to channel " + message.channel + ". Retry " + retries + "/" + this.sendRetries + " in " + this.sendInterval / 1000 + " seconds.");
                    }
                    else {
                        xRTML.Console.debug("Message " + message.content + " not sent to channel " + message.channel + ". Discarding message.");
                    }
                }
            };

            /**
            *  @function {public} ? Changes the active state of the connection.
            *  @param {Boolean} value The new active state.
            */
            this.active = function (value) {
                if (!value)
                    return active;

                active = xRTML.Common.Converter.toBoolean(value);

                return active;
            }

            /**
            *  Disconnects and removes references to this Connection.
            *  @function {void} ?
            */
            this.dispose = function () {
                if (this.isConnected())
                    this.disconnect();
                this.fire({ dispose: {} });
            };

            /**
            *  @function {xRTML.ConnectionManager.Channel} ? Adds, but doesn't subscribe, a channel to the connection.
            *  @param {xRTML.ConnectionManager.Channel} c The channel to be added.
            *  @returns The created channel.
            */
            this.createChannel = function (c) {
                c.subscribeOnReconnect = (typeof c.subscribeOnReconnect == 'undefined') ? true : c.subscribeOnReconnect;
                c.subscribe = (typeof c.subscribe == 'undefined') ? true : c.subscribe;
                xRTML.Event.extend(c);

                this.channels[c.name] = c;
                this.channels[c.name].bind({
                    /**
                    *  Fired when a subscribed channel receives a message.
                    *  @event xRTML.ConnectionManager.Channel.evt_message
                    *  @param {Object} e struture with the definition of the event's parameters.
                    *  @... {Object} target connection that raised this event.
                    *  @... {String} message message that was received.
                    */
                    message: c.onMessage
                });

                this.fire({
                    /**
                    *  Fired when a channel is added to the connection.
                    *  @event evt_channelcreate
                    *  @param {xRTML.ConnectionManager.Channel} channel struture with the channel's definition.
                    */
                    channelcreate: { channel: c }
                });

                return c;
            };

            /**
            *  Receives messages that arrive through the subscribed channels.
            *  If it's an xRTML message it  to all tags. Otherwise just notifies of a message arrival.
            *  @function {void} ?
            *  @param {Object} data structure with the message attributes.
            *  @... {String} channel Name of the channel from where the message arrived.
            *  @... {String} message The received message.
            */
            this.process = function (data) {
                var channel = data.channel,
                    message = data.message;

                //Check if the message should be discarded.
                if (message.substring(0, 15) == '_X_SEND_ONLY_X_') {
                    var mId = message.substring(15, 51);
                    if (this.internalId == mId) {
                        return;
                    } else {
                        message = message.substring(54);
                    }
                }

                if (this.active()) {
                    try {
                        // message transformation (at connection or channel level)
                        if (this.messageAdapter) {
                            message = this.messageAdapter(message);
                        }
                        // if an adapter is defined for the present channel it will override the connection message adapter
                        if (this.channels[channel] && this.channels[channel].messageAdapter) {
                            message = this.channels[channel].messageAdapter(message);
                        }
                    } catch (err) {
                        xRTML.Error.raise({ code: xRTML.Error.Codes.CONNECTION_ADAPT, target: this, info: { className: 'xRTML.ConnectionManager.Connection', methodName: 'process', originalMessage: message, message: err.message} });
                    }

                    var receivedMessage = message;

                    // check if its an xrtml message
                    if (xRTML.MessageManager.isValid(message)) {
                        receivedMessage = xRTML.MessageManager.toJson(message).xrtml;
                        this.fire({
                            /**
                            * Fired when a subscribed channel receives an xRTML message.
                            * @event evt_xrtmlmessage
                            * @param {Object} e struture with the definition of the event's parameters.
                            * @... {Object} target connection that raised this event.
                            * @... {String} channel name of the subscribed channel from where the xRTML message was received.
                            * @... {Object} message xRTML message that was received.
                            */
                            xrtmlmessage: { message: receivedMessage, channel: channel }
                        });
                    }

                    // notify a message arrived (global notification plus channel notification)
                    this.channels[channel].fire({
                        message: { message: receivedMessage }
                    });
                    this.fire({
                        message: { channel: channel, message: receivedMessage }
                    });
                }
                else {
                    xRTML.Console.debug("Connection " + (this.id || this.internalId) + " : Not active. Message received wasn't processed.");
                }
            };

            /**
            *  Transmits a message through a channel.
            *  @function {void} ?
            *  @param {Object} message structure with the message attributes.
            *  @... {String} channel Name of the channel through which we're sending the message.    
            *  @... {String} content The xRTML message to be sent through the channel.
            *  @... {Boolean} sendOnly Identifies if the message should be sent and discarded by the connection that sends it.
            */
            this.send = function (message) {
                var channel = message.channel,
                    content = message.content;
                // ensure we're sending a message in a string format
                if (typeof content === "object") {
                    content = content.stringify();
                }
                if (this.isCreated() && this.isConnected()) {
                    if (this.active()) {
                        //Add the internalId to the message. This will identify the message is to be discarded.
                        if (message.sendOnly) {
                            content = '_X_SEND_ONLY_X_' + this.internalId + '_X_' + content;
                        }
                        ortcClient.send(channel, content);
                        var debugMessage;
                        try {
                            debugMessage = xRTML.JSON.parse(content);
                        }
                        catch (err) {
                            debugMessage = content;
                        }
                        xRTML.Console.debug("Connection " + (this.id || this.internalId) + ": Message sent to channel " + channel);
                        xRTML.Console.debug(debugMessage);
                    }
                    else {
                        xRTML.Console.debug("Connection " + (this.id || this.internalId) + ": Not active. Message not sent to channel " + channel);
                        xRTML.Console.debug(message.content);
                    }
                }
                else {
                    setTimeout(proxy(function () {
                        proxy(retrySend, this)(message, 0);
                    }, this), this.sendInterval);
                    xRTML.Console.debug("Connection " + (this.id || this.internalId) + ": Not ready. Message not sent to channel " + channel + ". Retrying in " + this.sendInterval / 1000 + " seconds.");
                    xRTML.Console.debug(message.content);
                }
            };

            /**
            *  Establishes the connection to the ORTC server.
            *  @function {void} ?
            *  @param {Object} credentials structure with the credentials' attributes.
            *  @... {String} appKey ORTC's application key
            *  @... {String} authToken ORTC's authentication key. Identifies a user using the application.
            */
            this.connect = function (credentials) {
                this.isCreated() ?
                    ortcClient.connect(credentials.appKey || this.appKey, credentials.authToken || this.authToken) :
                    xRTML.Error.raise({ code: xRTML.Error.Codes.ORTC_UNAVAILABLE, target: this, info: { className: 'xRTML.ConnectionManager.Connection', methodName: 'connect'} });
            };

            /**
            *  Closes the connection to the ORTC server.
            *  @function {void} ?
            */
            this.disconnect = function () {
                this.isConnected() ? ortcClient.disconnect() : xRTML.Error.raise({ code: xRTML.Error.Codes.ORTC_DISCONNECTED, target: this, info: { className: 'xRTML.ConnectionManager.Connection', methodName: 'disconnect'} });
            };

            /**
            *  Adds and subscribes a channel to the connection.
            *  @function {void} ?
            *  @param {xRTML.ConnectionManager.Channel} channel Channel the connection is going to subscribe.
            */
            this.subscribe = function (channel) {
                channel = this.createChannel(channel);
                ortcClient.subscribe(channel.name, channel.subscribeOnReconnect, onMessage);
            };

            /**
            *  Unsubscribes a channel from the connection.
            *  @function {void} ?
            *  @param {String} name Name of the channel.
            */
            this.unsubscribe = function (name) {
                ortcClient.unsubscribe(name);
                // wait for the 'unsubscribed' event to remove from our array...
            };

            /**
            *  Checks if the connection is initialized.
            *  @function {Boolean} ?
            *  @returns A boolean stating if the connection is initialized.
            */
            this.isCreated = function () {
                return ortcClient != null;
            };

            /**
            *  Checks if the connection to the ORTC server is established.
            *  @function {Boolean} ?
            *  @returns A boolean stating if the connection is established.
            */
            this.isConnected = function () {
                return this.isCreated() ? ortcClient.getIsConnected() : false;
            };

            /**
            *  Checks if the connection has subscribed the channel.
            *  @function {Boolean} ?
            *  @param {String} channel Name of the channel.
            *  @returns A boolean stating if the channel is subscribed.
            */
            this.isSubscribed = function (channel) {
                return this.isConnected() ? ortcClient.isSubscribed(channel) : false;
            };

            /**
            *  Gets the information related to the connection.
            *  @function {String} ?
            *  @returns The information related to the connection
            */
            this.getMetadata = function () {
                return this.isCreated() ? ortcClient.getConnectionMetadata() : xRTML.Error.raise({ code: xRTML.Error.Codes.ORTC_UNAVAILABLE, target: this, info: { className: 'xRTML.ConnectionManager.Connection', methodName: 'getMetadata'} });
            };

            /**
            *  Associates information about the connection.
            *  @function {void} ?
            *  @param {String} metadata Information to store.
            */
            this.setMetadata = function (metadata) {
                return this.isCreated() ? ortcClient.setConnectionMetadata(metadata) : xRTML.Error.raise({ code: xRTML.Error.Codes.ORTC_UNAVAILABLE, target: this, info: { className: 'xRTML.ConnectionManager.Connection', methodName: 'setMetadata'} });
            };

            /**
            *  Gets the client announcement subchannel.
            *  @function {String} ?
            *  @returns The name of announcement subchannel
            */
            this.getAnnouncementSubChannel = function () {
                return this.isCreated() ? ortcClient.getAnnouncementSubChannel() : xRTML.Error.raise({ code: xRTML.Error.Codes.ORTC_UNAVAILABLE, target: this, info: { className: 'xRTML.ConnectionManager.Connection', methodName: 'getAnnouncementSubChannel'} });
            };

            if (typeof loadOrtcFactory != "undefined") {
                loadOrtcFactory(this.serverType, proxy(onFactoryLoaded, this));
            }
            else {
                xRTML.bind({
                    ready: proxy(function () {
                        proxy(loadOrtcFactory, this)(this.serverType, proxy(onFactoryLoaded, this));
                    }, this)
                });
            }

            if (args.channels) {
                for (var i = 0; i < args.channels.length; ++i) {
                    this.createChannel(args.channels[i]);
                }
            }
        };

    })(xRTML.ConnectionManager = xRTML.ConnectionManager || {});
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {

    /**
    *   Provides access to a data layer to allow the transmission and retrieval of information.
    *   @module xRTML.StorageManager
    */
    (function (StorageManager, undefined) {
        var storages = {},
        /*
        *  @function xRTML.StorageManager.? Gets a tag by internal or user given id.
        *  @param {Number} id The id of the intended tag.
        *  @returns The tag with the given id.
        */
        getById = function (id) {
            for (var key in storages) {
                if (storages[key].id === id) {
                    return storages[key];
                }
            }
            xRTML.Console.warn('Storage with id: ' + id + ' was not found.');
            return undefined;
        };

        /**
        *  Creates a new storage provider based on a JSON object.
        *  @param {Object} configObject Storage attributes
        *  @function {public void} xRTML.StorageManager.?
        */
        StorageManager.create = function (configObject) {
            try {
                //Prepare the class by instantiating it and extending it with the base Storage members.
                var storage = new StorageManager[configObject.type || 'KeyValuePairStorage'](),
                    s = StorageManager.Storage.extend(storage);

                //Now create the proper instance of Storage.
                s = new s(configObject);

                s.bind({ dispose: function (e) {
                    var sInternalId = e.target.internalId,
                            disposedStorage = storages[sInternalId];

                    // remove this tag instance
                    storages[sInternalId] = null;
                    delete storages[sInternalId];

                    // general notification of a disposed tag
                    StorageManager.fire({ storagedispose: { storage: e.target} });
                }
                });

                //add the new Storage.
                storages[s.internalId] = s;

                StorageManager.fire({ storagecreate: { storage: s} });

                //return the newly Storage. 
                return s;
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.UNEXPECTED, info: { message: err.message, className: 'xRTML.StorageManager', methodName: 'create' } });
            }
        };

        /**
        *  @function {public Object} xRTML.StorageManager.? Gets the storage by its id.
        *  @param {String} id Storage identifier provided by the user or the internally generated.
        *  @returns The Storage with the given id.
        */
        StorageManager.getById = function (id) {
            return storages[id] || getById(id);
        };

        xRTML.Event.extend(StorageManager);
    })(xRTML.StorageManager = xRTML.StorageManager || {})
    /*
    * @end
    */
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.StorageManager 
    */
	(function (StorageManager, undefined) {
			
		/**
		*   Abstract class containing common properties and methods for storage types.
		*   @class {public} xRTML.StorageManager.?
		*/
		var BaseStorage = function () {

		    /**
		    * @constructor {public} ? Initializes a KeyValuePairStorage.
		    * @param {Object} configObject Configuration of the storage.
		    * @... {optional String} id Identification of the storage, assigned by the user.
            * @... {optional String} type Tells which type of storage to be used. Defaults to KeyValuePairStorage.
            * @... {optional String} autoConnect Determines if the storage should be established implicitly after it's created. Defaults to true.
            * @... {optional Function} onReady Event handler for the ready event.
            * @... {optional Function} onException Event handler for the exception event.
		    */
			this.init = function (configObject) {

				xRTML.Event.extend(this);

				this.internalId = xRTML.Common.Util.guidGenerator();

				/**
				*   @property {public String} id Unique identifier for this storage.
				*/
				this.id = configObject.id || this.internalId;

				/**
				*   @property {public String} type Tells which type of storage to be used. Defaults to KeyValuePairStorage.
				*/
				this.type = configObject.type || 'KeyValuePairStorage';

				/**
				*   @property {public String} isReady Specifies if the storage is ready to be used.
				*/
				this.isReady = false;

				/**
				*   @property {public Boolean} autoConnect Determines if the storage should be established implicitly after it's created. Defaults to true.
				*/
				this.autoConnect = typeof configObject.autoConnect != 'undefined' ? xRTML.Common.Converter.toBoolean(configObject.autoConnect) : true;

                this.dispose = function () {
                    /* do some cleanup. However this still requires garbage collection. */
                    this.fire({ dispose: {} });
                };

				//Bind event handlers
				this.bind({
				    /**
				    *   @event evt_ready Event dispatched when the storage is ready to be used.
				    *   @param {Object} e An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.
				    *   @... {Object} target The target object that fired the event.
				    */                	
				    ready:xRTML.Common.Function.parse(configObject.onready),
				    /**
				    *   @event evt_exception Event dispatched when the storage raises an exception.
				    *   @param {Object} e An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.
				    *   @... {Object} target The target object that fired the event.
				    *   @... {String} exception The Exception raised.
				    */                   
				    exception: xRTML.Common.Function.parse(configObject.onexception)
				});
			};
		};
		
		StorageManager.Storage = xRTML.Class.extend(new BaseStorage());
		
        /*
        * @end
        */
    })(xRTML.StorageManager = xRTML.StorageManager || {})
    /**
    * @end
    */
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    (function (StorageManager, undefined) {
        /**
        * @scope xRTML.StorageManager
        */
        /**
        *   Class which allows performing data CRUD operations on simple key-value-pair data items. 
        *   @class  {public} xRTML.StorageManager.?
        *   @extends xRTML.StorageManager.BaseStorage
        */
        var KeyValuePairStorage = function () {

            /**
            * @constructor {public} ? Initializes a KeyValuePairStorage.
            * @param {Object} configObject Configuration of the storage.
		    * @... {optional String} id Identification of the storage, assigned by the user.
            * @... {optional String} type Tells which type of storage to be used. Defaults to KeyValuePairStorage.
            * @... {optional String} autoConnect Determines if the storage should be established implicitly after it's created. Defaults to true.
            * @... {optional Function} onReady Event handler for the ready event.
            * @... {optional Function} onException Event handler for the exception event.
            * @... {String} baseUrl The base URL to open connections to remote storage and to request sessions if necessary.
            * @... {optional String} connectionId The id of an existing Connection to be used by this storage (only necessary if a sessionId hasn't been obtained previously or if an existing Connection should be reused)
            * @... {optional String} sessionId A unique identifier that will be used to identify this storage session with the server-side component.
            * @... {optional Number} operationsTimeout A timeout in milliseconds for operations requested to the remote storage. Defaults to 2000.
            * @... {optional Function} onSession Event handler for the session event.
            */
            this.init = function (configObject) {

                this._super(configObject);

                /**
                *   @property {public String} baseUrl The base URL to open connections to remote storage and to request sessions if necessary.
                */
                this.baseUrl = !!configObject.baseUrl ? (configObject.baseUrl[configObject.baseUrl.length - 1] == '/' ? configObject.baseUrl.substring(0, (configObject.baseUrl.length - 1)) : configObject.baseUrl) : null;

                xRTML.Common.Validator.validateRequired({ target: this, prop: "baseUrl" });

                /**
                *   @property {public String} connectionId The id of an existing Connection to be used by this storage (only necessary if a sessionId hasn't been obtained previously or if an existing Connection should be reused)
                */
                this.connectionId = configObject.connectionId;

                /**
                *   @property {public String} sessionId The sessionId that will be used to identify this storage session with the server-side component.
                */
                this.sessionId = configObject.sessionId;

                /**
                *   @property {public Number} operationsTimeout A timeout in milliseconds for operations requested to the remote storage. Defaults to 2000.
                */
                this.operationsTimeout = !!configObject.operationsTimeout ? configObject.operationsTimeout : 2000;
                //Bind event handlers
                this.bind({
                    /**
                    *   @event evt_session Raised when a new session is obtained from the remote storage.
                    *   @param {Object} e An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.
                    *   @... {Object} target The target object that fired the event.
                    *   @... {Object} sessionId The id of the session obtained.
                    */
                    session: xRTML.Common.Function.parse(configObject.onsession)
                });

                if (this.autoConnect)
                    this.openConnection();
            }

            //Holds pairs of operationId:callback for requests that have been performed to the remote storage but haven't had a reply yet.
            var pendingOperations = {};

            //Holds a buffer of requests that have been made to this client-side component before it was ready. (e.g. if a get or set call is made before the component is ready it will be stored in this buffer to later be called when it becomes ready)
            var requestsBuffer = [];

            //Maps operations to the appropriate channels for requesting operations.
            var channelMappings = {
                get: 'readRequestChannel',
                set: 'writeRequestChannel',
                del: 'writeRequestChannel',
                incr: 'writeRequestChannel'
            }

            //The available channels for conveying and receiving remote storage operations.
            var channels = {
                readRequestChannel: undefined,
                readResponseChannel: undefined,
                writeRequestChannel: undefined,
                writeResponseChannel: undefined
            }

            /*
            *   @property {public Object} connection The Connection being used to communicate with the remote storage.
            */
            var connection;

            /**
            *   Creates or updates one or more items on the remote storage.
            *   @function {public void} ?
            *   @param {Object} data Contains the data to persist.
            *   @... {optional Object} namespace A specific name-space to allow better data separation.
            *   @... {optional Object} namespaceExpire Time in seconds for all the data stored in this namespace to expire (from the time this operation occurs). 
            *   If a namespace is not specified the expire will be assigned to the global namespace for the Storage afecting ALL THE DATA. 
            *   Defaults to 31556926 (1 year).
            *   @... {Object} pair A key-value pair of data to persist.
            *   @... {String} k A key for the data to persist.
            *   @... {Object} v The value to persist associated with the key.
            *   @... {Array} pairs An array of pairs of data to persist.
            *   @param {Function} callback A function to be called when the operation completes.
            *   @... {Boolean} success A Boolean that will be return as true if the operation is successful and false if an error occurred.
            *   @... {Object} data The data returned from the remote storage if the operation was successful.
            *   @... {Object} error The error returned from the remote storage if the operation was not successful.   
            */
            this.set = function (data, callback) {
                performRemoteDataOperation.call(this, {
                    data: data,
                    action: 'set',
                    callback: callback
                });
            };

            /**
            *   Deletes one or more items from the remote storage.
            *   @function {public void} ?
            *   @param {Object} query Contains the data to delete.
            *   @... {optional Object} namespace A specific name-space that might have been used when persisting the data.
            *   @... {optional Object} namespaceExpire Time in seconds for all the data stored in this namespace to expire (from the time this operation occurs). 
            *   If a namespace is not specified the expire will be assigned to the global namespace for the Storage afecting ALL THE DATA. 
            *   Defaults to 31556926 (1 year).		
            *   @... {Object} k A key to identify the key to delete.
            *   @... {Array} ks An array of keys to identify keys to delete.
            *   @param {Function} callback A function to be called when the operation completes.
            *   @... {Boolean} success A Boolean that will be return as true if the operation is successful and false if an error occurred.
            *   @... {Object} data The data returned from the remote storage if the operation was successful.
            *   @... {Object} error The error returned from the remote storage if the operation was not successful.  
            */
            this.del = function (query, callback) {
                performRemoteDataOperation.call(this, {
                    data: query,
                    action: 'del',
                    callback: callback
                });
            };

            /**
            *   Increments the value of one or more items in the remote storage (only applicable for numbers).
            *   @function {public void} ?
            *   @param {Object} data Contains the data to persist.
            *   @... {optional Object} namespace A specific name-space to allow better data separation.
            *   @... {optional Object} namespaceExpire Time in seconds for all the data stored in this namespace to expire (from the time this operation occurs). 
            *   If a namespace is not specified the expire will be assigned to the global namespace for the Storage afecting ALL THE DATA. 
            *   Defaults to 31556926 (1 year).
            *   @... {Object} pair A key-value pair of data to increment.
            *   @... {String} k A key for the data to increment.
            *   @... {Object} v The value to increment by associated with the key.
            *   @... {Array} pairs An array of pairs of data to increment.
            *   @param {Function} callback A function to be called when the operation completes.
            *   @... {Boolean} success A Boolean that will be return as true if the operation is successful and false if an error occurred.
            *   @... {Object} data The data returned from the remote storage if the operation was successful.
            *   @... {Object} error The error returned from the remote storage if the operation was not successful.   
            */
            this.incr = function (data, callback) {
                performRemoteDataOperation.call(this, {
                    data: data,
                    action: 'incr',
                    callback: callback
                });
            };

            /**
            *   Gets the value of one or more items from the remote storage.
            *   @function {public void} ?
            *   @param {Object} query Contains the data to consult.
            *   @... {optional Object} namespace A specific name-space that might have been used when persisting the data.
            *   @... {optional Object} namespaceExpire Time in seconds for all the data stored in this namespace to expire (from the time this operation occurs). 
            *   If a namespace is not specified the expire will be assigned to the global namespace for the Storage afecting ALL THE DATA. 
            *   Defaults to 31556926 (1 year).		
            *   @... {Object} k A key to identify the value to fetch.
            *   @... {Array} ks An array of keys to identify values to fetch.
            *   @param {Function} callback A function to be called when the operation completes.
            *   @... {Boolean} success A Boolean that will be return as true if the operation is successful and false if an error occurred.
            *   @... {Object} data The data returned from the remote storage if the operation was successful.
            *   @... {Object} error The error returned from the remote storage if the operation was not successful.  
            */
            this.get = function (query, callback) {
                performRemoteDataOperation.call(this, {
                    data: query,
                    action: 'get',
                    callback: callback
                });
            };

            /*
            *   Transmits a data operation message to the remote storage.
            *   @function {public void} ?
            *   @param {String} request The xRTML message to be sent through the channel.
            *   @... {Object} request.data The operation data or query. 
            *   @... {String} request.action The operation type of action to perform.   
            *   @... {Function} callback The callback to be called containing the data.
            *   @... {Boolean} request.callback.success A Boolean that will be return as true if the operation is successful and false if an error occurred.
            *   @... {Object} request.callback.data The data returned from the remote storage if the operation was successful.
            *   @... {Object} request.callback.error The error returned from the remote storage if the operation was not successful.   
            */
            var performRemoteDataOperation = function (request) {
                if (this.isReady) {

                    //Generate a new operation identifier.
                    var opId = xRTML.Common.Util.guidGenerator();

                    //Add this operation to the pending operations list and supply the callback for when the message arrives back.
                    pendingOperations[opId] = {
                        callback: request.callback,
                        timeout: setTimeout(xRTML.Common.Function.proxy(function () {
                            xRTML.Error.raise({ code: xRTML.Error.Codes.STORAGE_OPERATION_TIMEOUT, target: this, info: { opId: opId, timeout: this.operationsTimeout, className: 'xRTML.StorageManager.KeyValuePairStorage', methodName: 'performRemoteDataOperation (internal method, no docs available)'} });
                        }, this), this.operationsTimeout)
                    };

                    //Get the data from the request
                    var data = request.data;
                    //Set defaults
                    data.namespaceExpire = data.namespaceExpire || 31556926;
                    //Associate the operation identifier with the data so that the storage can send it back.
                    data.opId = opId;
                    //Create the message based on the input from the request. (the trigger mechanism is not used because it makes more sense to the remote component to handle operation ids associated with the data)
                    var message = xRTML.MessageManager.create({ action: request.action, data: data, senderId: this.internalId });
                    //Send the operation request message.
                    connection.send({ channel: channels[channelMappings[request.action]], content: message });

                } else {
                    //Place in the buffer for processing when the component is ready.
                    requestsBuffer.push(request);
                    xRTML.Console.warn('Storage operation placed in buffer. Will only be called when the Storage is ready.');
                }
            }

            /*
            *   Processes the result of a data operation on the remote storage.
            *   @function {public void} ?
            *   @param {Object} response The response of the data operation.
            *   @... {String} success Boolean indicating if the operation was successful or not.
            *   @... {Object} data That data returned from the operation.
            *   @... {Object} error The error if the operation was not successful.
            */
            var processRemoteDataOperation = function (response) {

                var data = response.data;

                //Extract operation id from the data.
                var opId = data.opId;

                //Delete the opId from the data as it is not necessary to the user.
                data.opId = null;
                delete data.opId;

                var callbackArgs = {
                    success: response.success,
                    data: response.success ? data : null,
                    error: !response.success ? response.data.error : null
                }

                //Give the response
                if (pendingOperations[opId] && pendingOperations[opId].callback) {
                    pendingOperations[opId].callback(callbackArgs);
                }
                //Remove the operation from the pending operations stack.
                clearTimeout(pendingOperations[opId].timeout);
                pendingOperations[opId] = null;
                delete pendingOperations[opId];
            }


            /**
            *  @class xRTML.StorageManager.KeyValuePairStorage.Permissions
            */
            /**
            *  @property {public String} readRequestChannel An enumerated of 'r' or 'w' identifying if the session  should be able to only read or read and write to this channel.
            */
            /**
            *  @property {public String} readResponseChannel An enumerated of 'r' or 'w' identifying if the session client should be able to only read or read and write from this channel.
            */
            /**
            *  @property {public String} writeRequestChannel An enumerated of 'r' or 'w' identifying if the session client should be able to only read or read and write to this channel.
            */
            /**
            *  @property {public String} writeResponseChannel An enumerated of 'r' or 'w' identifying if the session client should be able to only read or read and write from this channel.
            */

            /**
            *   Obtains a session on the remote storage.
            *   @function {public void} ?
            *   @param {Object} args Structure with the arguments for this function.
            *   @... {Boolean} autoConnect Indicates if this storage should open the connection after it has obtained a session.
            *   @... {String} appKey The license's application key.
            *   @... {String} serverUrl The server URL that this storage should use to communicate.
            *   @... {Boolean} isCluster  Indicates if the specified serverUrl is to a cluster server. Defaults to true.
            *   @... {String} serverType The server type. At the time the only supported type is IbtRealTimeSJ.
            *   @... {Number} timeToLive The session Time To Live in seconds. Defaults to 900 seconds (15 minutes).
            *   @... {Boolean} authenticate Identifies if this license requires authentication.
            *   @... {String} privateKey The private key associated with the license (only necessary if authenticate is true).
            *   @... {Permissions} permissions The permissions for the storage channels (only necessary if authenticate is true).
            */
            this.getSession = function (args) {

                xRTML.Common.Request.post({
                    url: this.baseUrl + '/getStorageSession',
                    data: args,
                    crossDomain: true,
                    success: xRTML.Common.Function.proxy(function (result) {
                        var parsedResult;
                        try {
                            parsedResult = xRTML.JSON.parse(result);
                        } catch (err) {
                            xRTML.Error.raise({ code: xRTML.Error.Codes.JSON_PARSE, target: this, info: { className: 'xRTML.StorageManager.KeyValuePairStorage', methodName: 'getSession', message: err.message } });
                        }
                        this.sessionId = parsedResult.sessionId;
                        this.fire({ 'session': { sessionId: this.sessionId} });
                        if (args.autoConnect)
                            this.openConnection();
                    }, this),
                    error: xRTML.Common.Function.proxy(function (error) {
                        xRTML.Error.raise({ code: xRTML.Error.Codes.STORAGE_SESSION, target: this, info: { className: 'xRTML.StorageManager.KeyValuePairStorage', methodName: 'getSession', message: error} });
                    }, this)
                });
            }


            /**
            *   Establishes a connection to the remote storage. 
            *   @function {public void} ?
            */
            this.openConnection = function () {

                //Only try to open the connection if a sessionId is already available. If not call getSession to go obtain it first.
                if (this.sessionId) {

                    xRTML.Common.Request.post({
                        url: this.baseUrl + '/openStorageConnection',
                        data: {
                            sessionId: this.sessionId
                        },
                        crossDomain: true,
                        success: xRTML.Common.Function.proxy(function (result) {
                            var parsedResult;
                            try {
                                parsedResult = xRTML.JSON.parse(result);
                            } catch (err) {
                                xRTML.Error.raise({ code: xRTML.Error.Codes.JSON_PARSE, target: this, info: { className: 'xRTML.StorageManager.KeyValuePairStorage', methodName: 'openConnection', message: err.message} });
                            }
                            //Store the channels
                            channels.readRequestChannel = parsedResult.channels.readRequestChannel;
                            channels.readResponseChannel = parsedResult.channels.readResponseChannel;
                            channels.writeRequestChannel = parsedResult.channels.writeRequestChannel;
                            channels.writeResponseChannel = parsedResult.channels.writeResponseChannel;

                            //Connect
                            if (!!this.connectionId) {
                                connection = xRTML.ConnectionManager.getById(this.connectionId);
                            } else {
                                var connectionConfig = {
                                    appKey: parsedResult.appKey,
                                    authToken: parsedResult.authToken,
                                    url: parsedResult.url,
                                    isCluster: parsedResult.isCluster,
                                    serverType: parsedResult.serverType
                                }
                                connection = xRTML.ConnectionManager.create(connectionConfig);
                            }

                            //Actions to take after connected.
                            function doWhenConnected(con) {
                                //Bind to the event for when a message arrives. This is where the responses will be provided to the data operations requests.
                                con.bind({
                                    xrtmlmessage: xRTML.Common.Function.proxy(function (e) {
                                        if (e.channel == channels.readResponseChannel || e.channel == channels.writeResponseChannel) {
                                            var message = e.message;
                                            processRemoteDataOperation.call(this, {
                                                success: message.action == 'exception' ? false : true,
                                                data: message.data
                                            });
                                        }
                                    }, this)
                                });

                                var readResponseSubscribed = false;
                                var writeResponseSubscribed = false;

                                con.bind({
                                    subscribe: xRTML.Common.Function.proxy(function (e) {

                                        if (e.channel == channels.readResponseChannel)
                                            readResponseSubscribed = true;
                                        if (e.channel == channels.writeResponseChannel)
                                            writeResponseSubscribed = true;

                                        if (readResponseSubscribed && writeResponseSubscribed) {
                                            this.isReady = true;
                                            //Process all requests in the buffer.
                                            for (var i = 0, len = requestsBuffer.length; i < len; i++) {
                                                performRemoteDataOperation.call(this, requestsBuffer[i]);
                                            }
                                            //Reinitialize buffer.
                                            requestsBuffer = [];

                                            //All good to go. Let the user know about that!
                                            this.fire({
                                                ready: {}
                                            });
                                        }
                                    }, this)
                                });

                                con.subscribe({ name: channels.readResponseChannel });
                                con.subscribe({ name: channels.writeResponseChannel });
                            }
                            //If we already have a connection opened then just use that.
                            if (connection.isConnected()) {
                                doWhenConnected.call(this, connection);
                            }
                            //If we don't have a connection opened then open one.
                            else if (connection.autoConnect) {
                                connection.bind({
                                    connect: xRTML.Common.Function.proxy(function (e) {
                                        doWhenConnected.call(this, e.target);
                                    }, this)
                                });
                            } else {
                                connection.bind({
                                    connect: xRTML.Common.Function.proxy(function (e) {
                                        doWhenConnected.call(this, e.target);
                                    }, this)
                                    
                                });
                                function doWhenCreated(con) {
                                    con.connect({
                                        appKey: !!parsedResult.appKey ? parsedResult.appKey : null,
                                        authToken: !!parsedResult.authToken ? parsedResult.authToken : null
                                    });
                                }
                                if (connection.isCreated()) {
                                    doWhenCreated.call(this, connection);
                                } else {
                                    connection.bind({
                                        create: xRTML.Common.Function.proxy(function (e) {
                                            doWhenCreated.call(this, e.target);
                                        }, this)
                                    });
                                }
                            }
                        }, this),
                        error: xRTML.Common.Function.proxy(function (error) {
                            xRTML.Error.raise({ code: xRTML.Error.Codes.REQUEST_FAILURE, target: this, info: { className: 'xRTML.StorageManager.KeyValuePairStorage', methodName: 'openConnection', message: error} });
                        }, this)
                    });
                }
                else {
                    connection = xRTML.ConnectionManager.getById(this.connectionId);
                    if (!!connection) {
                        var sessionData = {
                            appKey: connection.appKey,
                            serverUrl: connection.url,
                            isCluster: connection.isCluster,
                            serverType: connection.serverType,
                            timeToLive: 900,
                            authenticate: false,
                            autoConnect: true
                        }
                        this.getSession(sessionData);
                    } else {
                        xRTML.Error.raise({ code: xRTML.Error.Codes.STORAGE_CONNECTION_UNAVAILABLE, target: this, info: { connectionId: this.connectionId, className: 'xRTML.StorageManager.KeyValuePairStorage', methodName: 'openConnection'} });
                    }
                }
            }
        };
        /*
        * @end
        */
        StorageManager.KeyValuePairStorage = KeyValuePairStorage;

    })(xRTML.StorageManager = xRTML.StorageManager || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.TagManager Provides access to set of methods that allow the management of the xRTML tags.
    */
    (function (TagManager, undefined) {
        /*
        *  @property tagInstances The object where all xRTML Tag instances are stored.
        */
        var tagInstances = {},
        /*
        *  @property tags The object where all of the loaded xRTML tags classes are stored.
        */
        tags = {},
        /*
        *  @property tag Base class for all xRTML tags.
        */
        baseTag = null,
        /*
        *  @function xRTML.TagManager.? Gets a tag by internal or user given id.
        *  @param {number} id The id of the intended tag.
        *  @returns The tag with the given id.
        */
        getById = function (id) {
            for (var key in tagInstances) {
                if (tagInstances[key].id === id) {
                    return tagInstances[key];
                }
            }
            xRTML.Console.log('Tag with id: ' + id + ' was not found.');
            return undefined;
        },

        extendMultiple = function (tag) {
            if (tag.base != 'Tag') {
                var base = extendMultiple(new tags[tag.base]());
                tag = base.extend(tag);
            }
            else {
                tag = baseTag.extend(tag);
            }
            return tag;
        },

        attribute = function (name) {
            var value,
            expr = new RegExp(name, "ig");
            for (var attr in this) {
                if (attr.match(expr)) {
                    value = this[attr];
                    break;
                }
            }
            return value;
        },

        // stores tagObjects that depend on the HTML page being loaded first
        tagBuffer = [];

        if (!xRTML.domLoaded()) {
            function loadTagHandler() {
                for (var i = 0; i < tagBuffer.length; ++i) {
                    xRTML.TagManager.create(tagBuffer[i]);
                }
                tagBuffer = [];
                xRTML.Event.unbind(window, { load: loadTagHandler });
            }
            xRTML.Event.bind(window, { load: loadTagHandler });
        }

        /**
        *  @function {public} xRTML.TagManager.? Registers an tag class.
        *  @param {Function} tagClass structure with the tag class.
        *  @... {String} name Type of class that should be instantiated given this object's struture.
        *  @... {optional String} base Name of a tag's class from where this new class will extend. Defaults to Tag.
        *  @... {Function} struct The class referring to a xRTML tag.
        */
        TagManager.register = function (tagClass) {
            var className = tagClass.name;
            if (className) {
                if (className != 'Tag') {
                    if (!tags[className]) {
                        if (!tagClass.base) {
                            tagClass.base = 'Tag';
                        }
                        tags[className] = tagClass.struct;
                        tags[className].prototype.base = tagClass.base;
                        tags[className].prototype.name = tagClass.name;
                    }
                }
                else {
                    baseTag = tagClass.struct;
                }
            }
            else {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TAG_INVALID_CONFIG, target: this, info: { message: 'Please provide the tag name.', className: 'xRTML.TagManager', methodName: 'register' }
                });
            }
        };

        /**
        *  @function {public Object} xRTML.TagManager.? Creates an instance of a tag.
        *  @param {Object} tagObject structure containing the tag's definition that should be used for the tag's constructor (init function).
        *  @... {String} name Type of class that should be instantiated given this object's struture.
        *  @returns Tag instance
        */
        TagManager.create = function (tagObject) {
            try {
                // check for page load dependencies
                if ((tagObject.target || tagObject.template) && !xRTML.domLoaded()) {
                    tagBuffer.push(tagObject);
                    xRTML.Console.debug("TagManager: Creating a " + tagObject.name + " tag postponed until HTML page has been fully loaded.");
                    return;
                }

                // assign the method that allows fetching attributes in a case insensitive manner
                tagObject.attribute = attribute;

                // check if tag is registered
                if (!tags[tagObject.name]) {
                    throw xRTML.Error.raise({ code: xRTML.Error.Codes.TAG_UNREGISTERED, info: { tagName: tagObject.name, className: 'xRTML.TagManager', methodName: 'create'} });
                }

                // dummy instantiation
                var tag = new tags[tagObject.name]();
                // check if this class can be instantiated (not abstract) ("abstract" is a reserved word in YUI Compressor)
                if (!!tag["abstract"]) {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.TAG_ABSTRACT, target: this, info: { tag: tag, className: 'xRTML.TagManager', methodName: 'create'} });
                }
                // extend at this time
                var xrtmlTag = tag.base == 'Tag' ? baseTag.extend(tag) : extendMultiple(tag);
                xrtmlTag = new xrtmlTag(tagObject);
                xrtmlTag.fire({ postinit: {} });

                xrtmlTag.bind({
                    dispose: function (e) {
                        var tagInternalId = e.target.internalId,
	                    disposedTag = tagInstances[tagInternalId];

                        // remove this tag instance
                        tagInstances[tagInternalId] = null;
                        delete tagInstances[tagInternalId];

                        TagManager.fire({
                            /**
                            *  Fired when a tag is disposed.
                            *  @event xRTML.TagManager.evt_tagdispose
                            *  @param {Object} e struture with the definition of the event's parameters.
                            *  @... {Object} target module that raised this event.
                            *  @... {Object} tag the disposed tag.
                            */
                            tagdispose: { tag: e.target }
                        });
                    }
                });

                tagInstances[xrtmlTag.internalId] = xrtmlTag;

                TagManager.fire({
                    /**
                    *  Fired when a tag is created.
                    *  @event xRTML.TagManager.evt_tagcreate
                    *  @param {Object} e struture with the definition of the event's parameters.
                    *  @... {Object} target module that raised this event.
                    *  @... {Object} tag the created tag.
                    */
                    tagcreate: { tag: xrtmlTag }
                });

                //return the newly Tag. 
                return xrtmlTag;
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TAG_NOT_CREATED, target: this, info: { id: tagObject.id, className: 'xRTML.TagManager.' + tagObject.name, methodName: 'init', message: err.message, tagConfig: tagObject} });
            }
        };

        /**
        *   @function {public Object} xRTML.TagManager.? Gets a tag by its internal or user given id.
        *   @param {Number} id The id of the intended tag.
        *   @returns Tag instance
        */
        TagManager.getById = function (id) {
            return tagInstances[id] || getById(id);
        };

        /**
        *  @function {public Array} xRTML.TagManager.? Gets the names of all the registered tag classes.
        *  @returns An array with all registered tags
        */
        TagManager.getClasses = function () {
            var tagClasses = []
            for (var tagClass in tags) {
                tagClasses.push(tagClass);
            }
            return tagClasses;
        };

        xRTML.Event.extend(TagManager);

        xRTML.DomParser.bind({
            tagsLoad: function (e) {
                var tags = e.tags;
                // create tags
                for (var i = 0; i < tags.length; ++i) {
                    TagManager.create(tags[i]);
                }
            }
        });
    })(xRTML.TagManager = xRTML.TagManager || {})

    /**
    * @end
    */
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.MessageBroker Module in charge of routing incoming xRTML messages to their proper tags.
    */
    (function (MessageBroker, undefined) {
        var triggers = {},
        registerTrigger = function (trigger) {
            if (!triggers[trigger.name]) {
                triggers[trigger.name] = {};
            }
            triggers[trigger.name][trigger.tagInternalId] = { callback: trigger.callback, mappings: trigger.mappings };

            MessageBroker.fire({
                /**
                *  Fired when a tag registers a trigger.
                *  @event xRTML.MessageBroker.evt_triggerRegister
                *  @param {Object} e struture with the definition of the event's parameters.
                *  @... {Object} target module that raised this event.
                *  @... {xRTML.MessageBroker.Trigger} trigger trigger that was registered.
                */
                triggerregister: { trigger: trigger }
            });
        },
        unregisterTrigger = function (trigger) {
            var mbTrigger = triggers[trigger.name];
            if (mbTrigger && mbTrigger[trigger.tagInternalId]) {
                var mbTriggerEntry = mbTrigger[trigger.tagInternalId];
                trigger.callback = mbTriggerEntry.callback;
                trigger.mappings = mbTriggerEntry.mappings;
                delete triggers[trigger.name][trigger.tagInternalId];

                // if trigger no longer has tags interested, remove it
                var hasProperties = false;
                for (var prop in mbTrigger) {
                    if (mbTrigger.hasOwnProperty(prop)) {
                        hasProperties = true;
                    }
                }
                if (!hasProperties) {
                    delete triggers[trigger.name];
                }

                MessageBroker.fire({
                    /**
                    *  Fired when a tag unregisters a trigger.
                    *  @event xRTML.MessageBroker.evt_triggerUnregister
                    *  @param {Object} e struture with the definition of the event's parameters.
                    *  @... {Object} target module that raised this event.
                    *  @... {xRTML.MessageBroker.Trigger} trigger trigger that was unregistered.
                    */
                    triggerunregister: { trigger: trigger }
                });
            }
        },
        triggerCall = function (trigger) {
            if (triggers[trigger.name]) {
                // call tag message handlers
                for (var tagInternalId in triggers[trigger.name]) {

                    var tag = xRTML.TagManager.getById(tagInternalId);

                    if (tag.active || message.data.action == 'activate') {
                        var message = trigger.message;

                        if (tag.receiveOwnMessages || !message.senderId || tag.internalId !== message.senderId) {
                            var data = message.data;

                            tag.fire({ preProcess: data });

                            var action = message.action;
                            if (action) {
                                tag[action] ? tag[action].call(tag, data) : xRTML.Error.raise({ code: xRTML.Error.Codes.TAG_ACTION_UNDEFINED, target: tag, info: { action: action, className: 'xRTML.MessageBroker', methodName: 'triggerCall (internal method, no docs available)' } });
                            }
                            else {
                                tag.process(data);
                            }

                            tag.fire({ postProcess: data });
                        }

                    } else {
                        xRTML.Error.raise({ code: xRTML.Error.Codes.TAG_INACTIVE, target: tag, className: 'xRTML.MessageBroker', methodName: 'triggerCall (internal method, no docs available)' });
                    }
                }
            }
            else {
                xRTML.Console.debug("Trigger " + trigger.name + " is not registered with any xRTML Tag.");
            }
        },
        /* event handlers */
        registerTriggers = function (e) {
            var tag = e.tag, trigger;
            for (var i = 0; i < tag.triggers.length; ++i) {
                trigger = tag.triggers[i];
                registerTrigger({
                    tagId: tag.id,
                    tagInternalId: tag.internalId,
                    name: trigger.name,
                    callback: tag.preProcess,
                    mappings: trigger.mappings
                });
            }
        },
        unregisterTriggers = function (e) {
            var tag = e.tag, trigger;
            for (var i = 0; i < tag.triggers.length; ++i) {
                trigger = tag.triggers[i];
                unregisterTrigger({
                    tagInternalId: tag.internalId,
                    name: trigger.name
                });
            }
        },
        triggerTags = function (e) {
            // extract trigger(s) from the message
            var tNames = e.message.trigger;
            if (typeof tNames == 'string') {
                triggerCall({ name: tNames, message: e.message });
            }
            else if (tNames instanceof Array) {
                for (var i = 0; i < tNames.length; ++i) {
                    e.message.trigger = tNames[i].name;
                    triggerCall({ name: tNames[i].name, message: e.message });
                }
            }
        };

        /* add event capability */
        xRTML.Event.extend(MessageBroker);

        /* listen for events */
        xRTML.TagManager.bind({
            // when a tag is created get its triggers
            tagcreate: registerTriggers,
            // when a tag is disposed remove its triggers
            tagdispose: unregisterTriggers
        });

        // when a message arrives through a connection route it to the listening tags (with registered triggers)
        xRTML.ConnectionManager.bind({ xrtmlmessage: triggerTags });

        /**
        *  @class xRTML.MessageBroker.Trigger Keyword that identifies which messages are meant for the existing tags.
        */
        /**
        *  @property {public String} name name of the trigger.
        */

    })(xRTML.MessageBroker = xRTML.MessageBroker || {})
    /**
    * @end
    */
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.MessageManager Deals with incoming and outgoing xRTML messages within the framework.
    */
    (function (MessageManager, undefined) {
        /**
        *  @class xRTML.MessageManager.Message Object Representation of an xRTML message.
        */
        /**
        *  @property {String} senderId Id of the tag that sent the message.
        */
        /**
        *  @property {String} trigger name of the trigger.
        */
        /**
        *  @property {optional String} action name of the action refering to a method of a tag.
        */
        /**
        *  @property {optional Object} data Message content regarding the action of the tag.
        */

        /**
        *  @function {public Boolean} xRTML.MessageManager.? Checks if the message is a valid xRTML message.
        *  @param {String} message String to be tested.
        *  @returns a boolean indicating if the result of the check.
        */
        MessageManager.isValid = function (message) {
            try {
                // if message is a string (first occurence of 'xrtml' is 1st position according to the message format: { xrtml: {...}})
                if (typeof message === 'string') {

                    var firstProp = message.substring(message.indexOf('"'), message.indexOf('"', message.indexOf('"') + 1) + 1);
                    if ('"xrtml"' != xRTML.Common.String.trim(firstProp))
                        return false;

                    // validate its inner attributes
                    xRTML.JSON.parse(message);
                    return true;

                    //If later we want to change to regex (slower but probably more accurate)
                    //.match("^[\\s|\\r|\\n]*\{{1}[\\s|\\r|\\n]*\"xrtml\"\\s*:\\s*")
                }

                // if message is an object
                if ((typeof message === 'object') && message.xrtml) {
                    return true;
                }

                return false;
            }
            catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.INVALID_MESSAGE, target: this, message: err.message, info: { className: 'xRTML.MessageManager', methodName: 'isValid'} });
            }
        };

        /**
        *  @function {public xRTML.MessageManager.Message} xRTML.MessageManager.? Converts a xRTML message, that arrived from a connection, in the string format into an xRTML message object.
        *  @param {String} message String to be converted.
        *  @returns The xRTML message structure.
        */
        MessageManager.toJson = function (message) {
            if (typeof message === 'string' && MessageManager.isValid(message)) {
                var m = xRTML.JSON.parse(message).xrtml;
                var xrtmlMessage = {
                    xrtml: {
                        senderId: m.s,
                        trigger: m.t,
                        action: m.a,
                        data: m.d
                    }
                };
                return xrtmlMessage;
            }

            return message;
        };

        /**
        *  @function {public String} xRTML.MessageManager.? Converts a xRTML message object into an xRTML message in the string format, to be sent through a connection.
        *  @param {xRTML.MessageManager.Message} message xRTML message to be converted.
        *  @returns The xRTML message in the string format.
        */
        MessageManager.stringify = function (message) {
            var xrtmlMessage = {
                xrtml: {
                    s: message.senderId,
                    t: message.trigger,
                    a: message.action,
                    d: typeof message.data === 'object' ? message.data : xRTML.JSON.parse(message.data)
                }
            };
            return xRTML.JSON.stringify(xrtmlMessage);
        };

        /**
        *  @function {public xRTML.MessageManager.Message} xRTML.MessageManager.? Creates an xRTML message.
        *  @param {xRTML.MessageManager.Message} message xRTML message to be converted.
        *  @returns The new xRTML message.
        */
        MessageManager.create = function (message) {
            message.data = typeof message.data === 'object' ? message.data : xRTML.JSON.parse(message.data)
            message.stringify = function () {
                return MessageManager.stringify(this);
            };
            return message;
        };

    })(xRTML.MessageManager = xRTML.MessageManager || {})
    /**
    * @end
    */
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
    /**
    *  @module xRTML.TraceMonitor Monitors the flow of messages, DOM reading and tag and connection management, by logging messages to the web-browser console. 
    *  It can, also, be set to perform remote debugging. Should only be enabled for development or debugging purposes.
    */
    (function (TraceMonitor, undefined) {
        var sendTrace = function (message, obj) {
            if (xRTML.Config.remoteTrace) {
                // convert object to string
                var data = null;
                try {
                    data = xRTML.JSON.stringify(obj);
                }
                catch (e) {

                }
                var xrtmlMessage = xRTML.MessageManager.create({ data: { message: message, content: data} });
                xRTML.ConnectionManager.sendMessage("trace", xrtmlMessage);
            }
        };

        xRTML.Console.bind({ error: function (e) { sendTrace("Error", e.error) } });

        // connection manager events
        xRTML.ConnectionManager.bind({
            connectioncreate: function (evt) {
                var connection = evt.connection;
                sendTrace("Connection found: \n AppKey: " + connection.appKey + " \n AuthToken: " + connection.authToken + " \n Url: " + connection.url, connection);

                connection.bind({
                    create: function (e) {
                        var statement = "Connection " + (e.target.id || e.target.internalId) + " created. " + (e.target.autoConnect ? "Connecting..." : "Waiting for explicit connect...");
                        xRTML.Console.debug(statement);
                        sendTrace(statement, e.target);
                    },
                    connect: function (e) {
                        var statement = "Connection " + (e.target.id || e.target.internalId) + " established.";
                        xRTML.Console.debug(statement);
                        sendTrace(statement, e.target);
                    },
                    disconnect: function (e) {
                        var statement = "Connection " + (e.target.id || e.target.internalId) + " closed.";
                        xRTML.Console.debug(statement);
                        sendTrace(statement, e.target);
                    },
                    subscribe: function (e) {
                        var statement = "Connection " + (e.target.id || e.target.internalId) + ": Channel " + e.channel + " subscribed.";
                        xRTML.Console.debug(statement);
                        sendTrace(statement, e.target);
                    },
                    unsubscribe: function (e) {
                        var statement = "Connection " + (e.target.id || e.target.internalId) + ": Channel " + e.channel + " unsubscribed.";
                        xRTML.Console.debug(statement);
                        sendTrace(statement, e.target);
                    },
                    exception: function (e) {
                        var statement = "Connection " + (e.target.id || e.target.internalId) + " threw an exception: " + e.event;
                        xRTML.Console.debug(statement);
                        sendTrace(statement, e.target);
                    },
                    reconnect: function (e) {
                        var statement = "Connection " + (e.target.id || e.target.internalId) + " is restored.";
                        xRTML.Console.debug(statement);
                        sendTrace(statement, e.target);
                    },
                    reconnecting: function (e) {
                        var statement = "Connection " + (e.target.id || e.target.internalId) + " was lost. ";
                        if (e.target.connectionAttemptsCounter >= e.target.connectAttempts) {
                            statement += "Maximum number of attempts reached: " + e.target.connectAttempts + " Stop trying to reconnect.";
                        }
                        else {
                            statement += "Trying to reconnect. Attempt " + e.target.connectionAttemptsCounter + " out of " + e.target.connectAttempts;
                        }
                        xRTML.Console.debug(statement);
                        sendTrace(statement, e.target);
                    },
                    message: function (e) {
                        var info = "Connection " + (e.target.id || e.target.internalId) + ": Message received from channel " + e.channel,
                            message;
                        try {
                            message = xRTML.JSON.parse(e.message);
                        }
                        catch (err) {
                            message = e.message;
                        }

                        xRTML.Console.debug(info);
                        xRTML.Console.debug(message);
                        sendTrace(message, e.target);
                    },
                    xrtmlmessage: function (e) {
                        var info = "Connection " + (e.target.id || e.target.internalId) + ": xRTML Message received from channel " + e.channel;
                        xRTML.Console.debug(info);
                        xRTML.Console.debug(e.message);
                        sendTrace(e.message, e.target);
                    }
                });
            }
        });

        var debugMessage = function (e) {
            var info = "Tag " + (e.target.id || e.target.internalId) + ": " + e.type + " message";
            xRTML.Console.debug(info);
            xRTML.Console.debug(e.data);
            sendTrace(info, e.data);
        };

        // tag manager events
        xRTML.TagManager.bind({
            tagcreate: function (e) {
                var tag = e.tag;
                xRTML.Console.debug("Tag of type " + tag.name + " created with id " + (tag.id || tag.internalId));
                xRTML.Console.debug(tag);
                tag.bind({
                    init: function (e) {
                        xRTML.Console.debug("");
                    },
                    load: function (e) {
                        xRTML.Console.debug("");
                    },
                    active: function (e) {
                        xRTML.Console.debug("");
                    },
                    process: debugMessage,
                    preprocess: debugMessage,
                    postprocess: debugMessage
                });
            },
            tagdispose: function (e) {
                var tag = e.tag,
			        statement = "Tag of type " + e.name + " with id " + (tag.id || tag.internalId) + " disposed.";
                xRTML.Console.debug(statement);
                sendTrace(statement, e.tag);
            }
        });

        // trigger manager events
        xRTML.MessageBroker.bind({
            triggerregister: function (e) {
                var statement = "Tag " + (e.trigger.tagId || e.trigger.tagInternalId) + " registered trigger: " + e.trigger.name;
                xRTML.Console.debug(statement);
                sendTrace(statement, e.target);
            },
            triggerunregister: function (e) {
                var statement = "Tag " + (e.trigger.tagId || e.trigger.tagInternalId) + " unregistered trigger: " + e.trigger.name;
                xRTML.Console.debug(statement);
                sendTrace(statement, e.target);
            }
        });

        // dom parser events
        xRTML.DomParser.bind({
            configLoad: function (e) {
                xRTML.Console.debug("DOM Parser: the following connections were read from DOM: ");
                xRTML.Console.debug(e.config.connections);
                xRTML.Console.debug("DOM Parser: the following storages were read from DOM: ");
                xRTML.Console.debug(e.config.storages);
            },
            tagsLoad: function (e) {
                xRTML.Console.debug("DOM Parser: the following tags were read from DOM: ");
                xRTML.Console.debug(e.tags);
            }
        });

    })(xRTML.TraceMonitor = xRTML.TraceMonitor || {})
    /*
    * @end
    */
})(window.xRTML = window.xRTML || {});
// xRTML initialization:
// a. read the xRTML elements from the DOM when the page is fully loaded.
// b. load the ORTC library
(function () {

    var init = function () {
        // all good to go!
        xRTML.isReady = true;
        // tell the world!
        xRTML.fire({
            /**
            * @event xRTML.evt_ready Fired when xRTML finished its initialization routine.
            */
            ready: {}
        });
    };

    // load the ORTC library
    (typeof loadOrtcFactory == "undefined") ?
            xRTML.Config.ortcLibrary(((document.location.protocol == 'file:') ? 'http:' : document.location.protocol) + '//dfdbz2tdq3k01.cloudfront.net/js/2.1.0/ortc.js', init) :
            init();

    // read xRTML tags from DOM
    xRTML.domLoaded() ? xRTML.DomParser.read() : xRTML.Event.bind(window, { load: xRTML.DomParser.read });
})();
(function (window) {
    /*
    *  Container of different versions of potato.
    *  Each of this objects attribute name is the version number and the corresponding value, an xRTML object.
    *  @var {Object} xRTMLVersions
    */
    (function (xRTMLVersions, undefined) {
        xRTMLVersions[xRTML.version] ?
            xRTML = xRTMLVersions[xRTML.version] : xRTMLVersions[xRTML.version] = xRTML;

        /*
        *  @property {xRTML} current Current loaded version of xRTML.
        */
        xRTMLVersions.current = xRTMLVersions.current || xRTML.version;
        xRTML = xRTMLVersions[xRTMLVersions.current];

    })(window.xRTMLVersions = window.xRTMLVersions || {});
})(window);
(function(xRTML, undefined) {
    /**
    *  @module xRTML.Templating Provides access to a set of methods that allows the binding of UI attributes to a tag's model data.
    */
    (function(Templating, undefined) {
        var _privateKo = undefined;

        // Knockout JavaScript library v2.1.0
        // (c) Steven Sanderson - http://knockoutjs.com/
        // License: MIT (http://www.opensource.org/licenses/mit-license.php)
        (function(window, document, navigator, undefined) {
            var DEBUG = true;
            !
            function(factory) {
                // Support three module loading scenarios
                /*
                if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
                    // [1] CommonJS/Node.js
                    _privateKo = {};
                    module['exports'] ? module['exports'].privateKo = _privateKo : exports.privateKo =_privateKo;
                    var target = module['exports'] || exports; // module.exports is for Node.js
                    factory(target);
                } else if (typeof define === 'function' && define['amd']) {
                    // [2] AMD anonymous module
                    _privateKo = {};
                    define(['exports'], function(){factory(_privateKo)});
                } else {
                */
                    // [3] No module loader (plain <script> tag) - put directly in global namespace
                    factory(_privateKo = {});
                //}
            }(function(koExports) {
                // Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
                // In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
                var ko = typeof koExports !== 'undefined' ? koExports : {};
                // Google Closure Compiler helpers (used only to make the minified file smaller)
                ko.exportSymbol = function(koPath, object) {
                    var tokens = koPath.split(".");

                    // In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
                    // At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
                    var target = ko;

                    for (var i = 0; i < tokens.length - 1; i++)
                    target = target[tokens[i]];
                    target[tokens[tokens.length - 1]] = object;
                };
                ko.exportProperty = function(owner, publicName, object) {
                    owner[publicName] = object;
                };
                ko.version = "2.1.0";

                ko.exportSymbol('version', ko.version);
                ko.utils = new(function() {
                    var stringTrimRegex = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

                    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
                    var knownEvents = {},
                        knownEventTypesByEventName = {};
                    var keyEventTypeName = /Firefox\/2/i.test(navigator.userAgent) ? 'KeyboardEvent' : 'UIEvents';
                    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
                    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
                    for (var eventType in knownEvents) {
                        var knownEventsForType = knownEvents[eventType];
                        if (knownEventsForType.length) {
                            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                            knownEventTypesByEventName[knownEventsForType[i]] = eventType;
                        }
                    }
                    var eventsThatMustBeRegisteredUsingAttachEvent = {
                        'propertychange': true
                    }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406
                    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
                    var ieVersion = (function() {
                        var version = 3,
                            div = document.createElement('div'),
                            iElems = div.getElementsByTagName('i');

                        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
                        while (
                        div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->', iElems[0]);
                        return version > 4 ? version : undefined;
                    }());
                    var isIe6 = ieVersion === 6,
                        isIe7 = ieVersion === 7;

                    function isClickOnCheckableElement(element, eventType) {
                        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
                        if (eventType.toLowerCase() != "click") return false;
                        var inputType = element.type;
                        return (inputType == "checkbox") || (inputType == "radio");
                    }

                    return {
                        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

                        arrayForEach: function(array, action) {
                            for (var i = 0, j = array.length; i < j; i++)
                            action(array[i]);
                        },

                        arrayIndexOf: function(array, item) {
                            if (typeof Array.prototype.indexOf == "function") return Array.prototype.indexOf.call(array, item);
                            for (var i = 0, j = array.length; i < j; i++)
                            if (array[i] === item) return i;
                            return -1;
                        },

                        arrayFirst: function(array, predicate, predicateOwner) {
                            for (var i = 0, j = array.length; i < j; i++)
                            if (predicate.call(predicateOwner, array[i])) return array[i];
                            return null;
                        },

                        arrayRemoveItem: function(array, itemToRemove) {
                            var index = ko.utils.arrayIndexOf(array, itemToRemove);
                            if (index >= 0) array.splice(index, 1);
                        },

                        arrayGetDistinctValues: function(array) {
                            array = array || [];
                            var result = [];
                            for (var i = 0, j = array.length; i < j; i++) {
                                if (ko.utils.arrayIndexOf(result, array[i]) < 0) result.push(array[i]);
                            }
                            return result;
                        },

                        arrayMap: function(array, mapping) {
                            array = array || [];
                            var result = [];
                            for (var i = 0, j = array.length; i < j; i++)
                            result.push(mapping(array[i]));
                            return result;
                        },

                        arrayFilter: function(array, predicate) {
                            array = array || [];
                            var result = [];
                            for (var i = 0, j = array.length; i < j; i++)
                            if (predicate(array[i])) result.push(array[i]);
                            return result;
                        },

                        arrayPushAll: function(array, valuesToPush) {
                            if (valuesToPush instanceof Array) array.push.apply(array, valuesToPush);
                            else for (var i = 0, j = valuesToPush.length; i < j; i++)
                            array.push(valuesToPush[i]);
                            return array;
                        },

                        extend: function(target, source) {
                            if (source) {
                                for (var prop in source) {
                                    if (source.hasOwnProperty(prop)) {
                                        target[prop] = source[prop];
                                    }
                                }
                            }
                            return target;
                        },

                        emptyDomNode: function(domNode) {
                            while (domNode.firstChild) {
                                ko.removeNode(domNode.firstChild);
                            }
                        },

                        moveCleanedNodesToContainerElement: function(nodes) {
                            // Ensure it's a real array, as we're about to reparent the nodes and
                            // we don't want the underlying collection to change while we're doing that.
                            var nodesArray = ko.utils.makeArray(nodes);

                            var container = document.createElement('div');
                            for (var i = 0, j = nodesArray.length; i < j; i++) {
                                ko.cleanNode(nodesArray[i]);
                                container.appendChild(nodesArray[i]);
                            }
                            return container;
                        },

                        setDomNodeChildren: function(domNode, childNodes) {
                            ko.utils.emptyDomNode(domNode);
                            if (childNodes) {
                                for (var i = 0, j = childNodes.length; i < j; i++)
                                domNode.appendChild(childNodes[i]);
                            }
                        },

                        replaceDomNodes: function(nodeToReplaceOrNodeArray, newNodesArray) {
                            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
                            if (nodesToReplaceArray.length > 0) {
                                var insertionPoint = nodesToReplaceArray[0];
                                var parent = insertionPoint.parentNode;
                                for (var i = 0, j = newNodesArray.length; i < j; i++)
                                parent.insertBefore(newNodesArray[i], insertionPoint);
                                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                                    ko.removeNode(nodesToReplaceArray[i]);
                                }
                            }
                        },

                        setOptionNodeSelectionState: function(optionNode, isSelected) {
                            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
                            if (navigator.userAgent.indexOf("MSIE 6") >= 0) optionNode.setAttribute("selected", isSelected);
                            else optionNode.selected = isSelected;
                        },

                        stringTrim: function(string) {
                            return (string || "").replace(stringTrimRegex, "");
                        },

                        stringTokenize: function(string, delimiter) {
                            var result = [];
                            var tokens = (string || "").split(delimiter);
                            for (var i = 0, j = tokens.length; i < j; i++) {
                                var trimmed = ko.utils.stringTrim(tokens[i]);
                                if (trimmed !== "") result.push(trimmed);
                            }
                            return result;
                        },

                        stringStartsWith: function(string, startsWith) {
                            string = string || "";
                            if (startsWith.length > string.length) return false;
                            return string.substring(0, startsWith.length) === startsWith;
                        },

                        buildEvalWithinScopeFunction: function(expression, scopeLevels) {
                            // Build the source for a function that evaluates "expression"
                            // For each scope variable, add an extra level of "with" nesting
                            // Example result: with(sc[1]) { with(sc[0]) { return (expression) } }
                            var functionBody = "return (" + expression + ")";
                            for (var i = 0; i < scopeLevels; i++) {
                                functionBody = "with(sc[" + i + "]) { " + functionBody + " } ";
                            }
                            return new Function("sc", functionBody);
                        },

                        domNodeIsContainedBy: function(node, containedByNode) {
                            if (containedByNode.compareDocumentPosition) return (containedByNode.compareDocumentPosition(node) & 16) == 16;
                            while (node != null) {
                                if (node == containedByNode) return true;
                                node = node.parentNode;
                            }
                            return false;
                        },

                        domNodeIsAttachedToDocument: function(node) {
                            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument);
                        },

                        tagNameLower: function(element) {
                            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
                            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
                            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
                            return element && element.tagName && element.tagName.toLowerCase();
                        },

                        registerEventHandler: function(element, eventType, handler) {
                            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
                            if (!mustUseAttachEvent && typeof jQuery != "undefined") {
                                if (isClickOnCheckableElement(element, eventType)) {
                                    // For click events on checkboxes, jQuery interferes with the event handling in an awkward way:
                                    // it toggles the element checked state *after* the click event handlers run, whereas native
                                    // click events toggle the checked state *before* the event handler.
                                    // Fix this by intecepting the handler and applying the correct checkedness before it runs.
                                    var originalHandler = handler;
                                    handler = function(event, eventData) {
                                        var jQuerySuppliedCheckedState = this.checked;
                                        if (eventData) this.checked = eventData.checkedStateBeforeEvent !== true;
                                        originalHandler.call(this, event);
                                        this.checked = jQuerySuppliedCheckedState; // Restore the state jQuery applied
                                    };
                                }
                                jQuery(element)['bind'](eventType, handler);
                            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function") element.addEventListener(eventType, handler, false);
                            else if (typeof element.attachEvent != "undefined") element.attachEvent("on" + eventType, function(event) {
                                handler.call(element, event);
                            });
                            else throw new Error("Browser doesn't support addEventListener or attachEvent");
                        },

                        triggerEvent: function(element, eventType) {
                            if (!(element && element.nodeType)) throw new Error("element must be a DOM node when calling triggerEvent");

                            if (typeof jQuery != "undefined") {
                                var eventData = [];
                                if (isClickOnCheckableElement(element, eventType)) {
                                    // Work around the jQuery "click events on checkboxes" issue described above by storing the original checked state before triggering the handler
                                    eventData.push({
                                        checkedStateBeforeEvent: element.checked
                                    });
                                }
                                jQuery(element)['trigger'](eventType, eventData);
                            } else if (typeof document.createEvent == "function") {
                                if (typeof element.dispatchEvent == "function") {
                                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                                    var event = document.createEvent(eventCategory);
                                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                                    element.dispatchEvent(event);
                                } else throw new Error("The supplied element doesn't support dispatchEvent");
                            } else if (typeof element.fireEvent != "undefined") {
                                // Unlike other browsers, IE doesn't change the checked state of checkboxes/radiobuttons when you trigger their "click" event
                                // so to make it consistent, we'll do it manually here
                                if (isClickOnCheckableElement(element, eventType)) element.checked = element.checked !== true;
                                element.fireEvent("on" + eventType);
                            } else throw new Error("Browser doesn't support triggering events");
                        },

                        unwrapObservable: function(value) {
                            return ko.isObservable(value) ? value() : value;
                        },

                        toggleDomNodeCssClass: function(node, className, shouldHaveClass) {
                            var currentClassNames = (node.className || "").split(/\s+/);
                            var hasClass = ko.utils.arrayIndexOf(currentClassNames, className) >= 0;

                            if (shouldHaveClass && !hasClass) {
                                node.className += (currentClassNames[0] ? " " : "") + className;
                            } else if (hasClass && !shouldHaveClass) {
                                var newClassName = "";
                                for (var i = 0; i < currentClassNames.length; i++)
                                if (currentClassNames[i] != className) newClassName += currentClassNames[i] + " ";
                                node.className = ko.utils.stringTrim(newClassName);
                            }
                        },

                        setTextContent: function(element, textContent) {
                            var value = ko.utils.unwrapObservable(textContent);
                            if ((value === null) || (value === undefined)) value = "";

                            'innerText' in element ? element.innerText = value : element.textContent = value;

                            if (ieVersion >= 9) {
                                // Believe it or not, this actually fixes an IE9 rendering bug
                                // (See https://github.com/SteveSanderson/knockout/issues/209)
                                element.style.display = element.style.display;
                            }
                        },

                        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
                            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
                            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
                            if (ieVersion >= 9) {
                                var originalWidth = selectElement.style.width;
                                selectElement.style.width = 0;
                                selectElement.style.width = originalWidth;
                            }
                        },

                        range: function(min, max) {
                            min = ko.utils.unwrapObservable(min);
                            max = ko.utils.unwrapObservable(max);
                            var result = [];
                            for (var i = min; i <= max; i++)
                            result.push(i);
                            return result;
                        },

                        makeArray: function(arrayLikeObject) {
                            var result = [];
                            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                                result.push(arrayLikeObject[i]);
                            };
                            return result;
                        },

                        isIe6: isIe6,
                        isIe7: isIe7,
                        ieVersion: ieVersion,

                        getFormFields: function(form, fieldName) {
                            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
                            var isMatchingField = (typeof fieldName == 'string') ?
                            function(field) {
                                return field.name === fieldName
                            } : function(field) {
                                return fieldName.test(field.name)
                            }; // Treat fieldName as regex or object containing predicate
                            var matches = [];
                            for (var i = fields.length - 1; i >= 0; i--) {
                                if (isMatchingField(fields[i])) matches.push(fields[i]);
                            };
                            return matches;
                        },

                        parseJson: function(jsonString) {
                            if (typeof jsonString == "string") {
                                jsonString = ko.utils.stringTrim(jsonString);
                                if (jsonString) {
                                    if (window.JSON && window.JSON.parse) // Use native parsing where available
                                    return window.JSON.parse(jsonString);
                                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                                }
                            }
                            return null;
                        },

                        stringifyJson: function(data, replacer, space) { // replacer and space are optional
                            if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined")) throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
                            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
                        },

                        postJson: function(urlOrForm, data, options) {
                            options = options || {};
                            var params = options['params'] || {};
                            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
                            var url = urlOrForm;

                            // If we were given a form, use its 'action' URL and pick out any requested field values
                            if ((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                                var originalForm = urlOrForm;
                                url = originalForm.action;
                                for (var i = includeFields.length - 1; i >= 0; i--) {
                                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                                    for (var j = fields.length - 1; j >= 0; j--)
                                    params[fields[j].name] = fields[j].value;
                                }
                            }

                            data = ko.utils.unwrapObservable(data);
                            var form = document.createElement("form");
                            form.style.display = "none";
                            form.action = url;
                            form.method = "post";
                            for (var key in data) {
                                var input = document.createElement("input");
                                input.name = key;
                                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                                form.appendChild(input);
                            }
                            for (var key in params) {
                                var input = document.createElement("input");
                                input.name = key;
                                input.value = params[key];
                                form.appendChild(input);
                            }
                            document.body.appendChild(form);
                            options['submitter'] ? options['submitter'](form) : form.submit();
                            setTimeout(function() {
                                form.parentNode.removeChild(form);
                            }, 0);
                        }
                    }
                })();

                ko.exportSymbol('utils', ko.utils);
                ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
                ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
                ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
                ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
                ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
                ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
                ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
                ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
                ko.exportSymbol('utils.extend', ko.utils.extend);
                ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
                ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
                ko.exportSymbol('utils.postJson', ko.utils.postJson);
                ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
                ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
                ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
                ko.exportSymbol('utils.range', ko.utils.range);
                ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
                ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
                ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);

                if (!Function.prototype['bind']) {
                    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
                    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
                    Function.prototype['bind'] = function(object) {
                        var originalFunction = this,
                            args = Array.prototype.slice.call(arguments),
                            object = args.shift();
                        return function() {
                            return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
                        };
                    };
                }

                ko.utils.domData = new(function() {
                    var uniqueId = 0;
                    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
                    var dataStore = {};
                    return {
                        get: function(node, key) {
                            var allDataForNode = ko.utils.domData.getAll(node, false);
                            return allDataForNode === undefined ? undefined : allDataForNode[key];
                        },
                        set: function(node, key, value) {
                            if (value === undefined) {
                                // Make sure we don't actually create a new domData key if we are actually deleting a value
                                if (ko.utils.domData.getAll(node, false) === undefined) return;
                            }
                            var allDataForNode = ko.utils.domData.getAll(node, true);
                            allDataForNode[key] = value;
                        },
                        getAll: function(node, createIfNotFound) {
                            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
                            var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null");
                            if (!hasExistingDataStore) {
                                if (!createIfNotFound) return undefined;
                                dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
                                dataStore[dataStoreKey] = {};
                            }
                            return dataStore[dataStoreKey];
                        },
                        clear: function(node) {
                            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
                            if (dataStoreKey) {
                                delete dataStore[dataStoreKey];
                                node[dataStoreKeyExpandoPropertyName] = null;
                            }
                        }
                    }
                })();

                ko.exportSymbol('utils.domData', ko.utils.domData);
                ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully
                ko.utils.domNodeDisposal = new(function() {
                    var domDataKey = "__ko_domNodeDisposal__" + (new Date).getTime();
                    var cleanableNodeTypes = {
                        1: true,
                        8: true,
                        9: true
                    }; // Element, Comment, Document
                    var cleanableNodeTypesWithDescendants = {
                        1: true,
                        9: true
                    }; // Element, Document

                    function getDisposeCallbacksCollection(node, createIfNotFound) {
                        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
                        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
                            allDisposeCallbacks = [];
                            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
                        }
                        return allDisposeCallbacks;
                    }

                    function destroyCallbacksCollection(node) {
                        ko.utils.domData.set(node, domDataKey, undefined);
                    }

                    function cleanSingleNode(node) {
                        // Run all the dispose callbacks
                        var callbacks = getDisposeCallbacksCollection(node, false);
                        if (callbacks) {
                            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
                            for (var i = 0; i < callbacks.length; i++)
                            callbacks[i](node);
                        }

                        // Also erase the DOM data
                        ko.utils.domData.clear(node);

                        // Special support for jQuery here because it's so commonly used.
                        // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
                        // so notify it to tear down any resources associated with the node & descendants here.
                        if ((typeof jQuery == "function") && (typeof jQuery['cleanData'] == "function")) jQuery['cleanData']([node]);

                        // Also clear any immediate-child comment nodes, as these wouldn't have been found by
                        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
                        if (cleanableNodeTypesWithDescendants[node.nodeType]) cleanImmediateCommentTypeChildren(node);
                    }

                    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
                        var child, nextChild = nodeWithChildren.firstChild;
                        while (child = nextChild) {
                            nextChild = child.nextSibling;
                            if (child.nodeType === 8) cleanSingleNode(child);
                        }
                    }

                    return {
                        addDisposeCallback: function(node, callback) {
                            if (typeof callback != "function") throw new Error("Callback must be a function");
                            getDisposeCallbacksCollection(node, true).push(callback);
                        },

                        removeDisposeCallback: function(node, callback) {
                            var callbacksCollection = getDisposeCallbacksCollection(node, false);
                            if (callbacksCollection) {
                                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                                if (callbacksCollection.length == 0) destroyCallbacksCollection(node);
                            }
                        },

                        cleanNode: function(node) {
                            // First clean this node, where applicable
                            if (cleanableNodeTypes[node.nodeType]) {
                                cleanSingleNode(node);

                                // ... then its descendants, where applicable
                                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                                    // Clone the descendants list in case it changes during iteration
                                    var descendants = [];
                                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                                    for (var i = 0, j = descendants.length; i < j; i++)
                                    cleanSingleNode(descendants[i]);
                                }
                            }
                        },

                        removeNode: function(node) {
                            ko.cleanNode(node);
                            if (node.parentNode) node.parentNode.removeChild(node);
                        }
                    }
                })();
                ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
                ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
                ko.exportSymbol('cleanNode', ko.cleanNode);
                ko.exportSymbol('removeNode', ko.removeNode);
                ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
                ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
                ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
                (function() {
                    var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

                    function simpleHtmlParse(html) {
                        // Based on jQuery's "clean" function, but only accounting for table-related elements.
                        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly
                        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
                        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
                        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
                        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.
                        // Trim whitespace, otherwise indexOf won't work as expected
                        var tags = ko.utils.stringTrim(html).toLowerCase(),
                            div = document.createElement("div");

                        // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
                        var wrap = tags.match(/^<(thead|tbody|tfoot)/) && [1, "<table>", "</table>"] || !tags.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] || (!tags.indexOf("<td") || !tags.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] || /* anything else */
                        [0, "", ""];

                        // Go to html and back, then peel off extra wrappers
                        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
                        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
                        if (typeof window['innerShiv'] == "function") {
                            div.appendChild(window['innerShiv'](markup));
                        } else {
                            div.innerHTML = markup;
                        }

                        // Move to the right depth
                        while (wrap[0]--)
                        div = div.lastChild;

                        return ko.utils.makeArray(div.lastChild.childNodes);
                    }

                    function jQueryHtmlParse(html) {
                        var elems = jQuery['clean']([html]);

                        // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
                        // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
                        // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
                        if (elems && elems[0]) {
                            // Find the top-most parent element that's a direct child of a document fragment
                            var elem = elems[0];
                            while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */ )
                            elem = elem.parentNode;
                            // ... then detach it
                            if (elem.parentNode) elem.parentNode.removeChild(elem);
                        }

                        return elems;
                    }

                    ko.utils.parseHtmlFragment = function(html) {
                        return typeof jQuery != 'undefined' ? jQueryHtmlParse(html) // As below, benefit from jQuery's optimisations where possible
                        :
                        simpleHtmlParse(html); // ... otherwise, this simple logic will do in most common cases.
                    };

                    ko.utils.setHtml = function(node, html) {
                        ko.utils.emptyDomNode(node);

                        if ((html !== null) && (html !== undefined)) {
                            if (typeof html != 'string') html = html.toString();

                            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
                            // for example <tr> elements which are not normally allowed to exist on their own.
                            // If you've referenced jQuery we'll use that rather than duplicating its code.
                            if (typeof jQuery != 'undefined') {
                                jQuery(node)['html'](html);
                            } else {
                                // ... otherwise, use KO's own parsing logic.
                                var parsedNodes = ko.utils.parseHtmlFragment(html);
                                for (var i = 0; i < parsedNodes.length; i++)
                                node.appendChild(parsedNodes[i]);
                            }
                        }
                    };
                })();

                ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
                ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

                ko.memoization = (function() {
                    var memos = {};

                    function randomMax8HexChars() {
                        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
                    }

                    function generateRandomId() {
                        return randomMax8HexChars() + randomMax8HexChars();
                    }

                    function findMemoNodes(rootNode, appendToArray) {
                        if (!rootNode) return;
                        if (rootNode.nodeType == 8) {
                            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
                            if (memoId != null) appendToArray.push({
                                domNode: rootNode,
                                memoId: memoId
                            });
                        } else if (rootNode.nodeType == 1) {
                            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                            findMemoNodes(childNodes[i], appendToArray);
                        }
                    }

                    return {
                        memoize: function(callback) {
                            if (typeof callback != "function") throw new Error("You can only pass a function to ko.memoization.memoize()");
                            var memoId = generateRandomId();
                            memos[memoId] = callback;
                            return "<!--[ko_memo:" + memoId + "]-->";
                        },

                        unmemoize: function(memoId, callbackParams) {
                            var callback = memos[memoId];
                            if (callback === undefined) throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
                            try {
                                callback.apply(null, callbackParams || []);
                                return true;
                            } finally {
                                delete memos[memoId];
                            }
                        },

                        unmemoizeDomNodeAndDescendants: function(domNode, extraCallbackParamsArray) {
                            var memos = [];
                            findMemoNodes(domNode, memos);
                            for (var i = 0, j = memos.length; i < j; i++) {
                                var node = memos[i].domNode;
                                var combinedParams = [node];
                                if (extraCallbackParamsArray) ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                                if (node.parentNode) node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
                            }
                        },

                        parseMemoText: function(memoText) {
                            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
                            return match ? match[1] : null;
                        }
                    };
                })();

                ko.exportSymbol('memoization', ko.memoization);
                ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
                ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
                ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
                ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
                ko.extenders = {
                    'throttle': function(target, timeout) {
                        // Throttling means two things:
                        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
                        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
                        target['throttleEvaluation'] = timeout;

                        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
                        //     so the target cannot change value synchronously or faster than a certain rate
                        var writeTimeoutInstance = null;
                        return ko.dependentObservable({
                            'read': target,
                            'write': function(value) {
                                clearTimeout(writeTimeoutInstance);
                                writeTimeoutInstance = setTimeout(function() {
                                    target(value);
                                }, timeout);
                            }
                        });
                    },

                    'notify': function(target, notifyWhen) {
                        target["equalityComparer"] = notifyWhen == "always" ?
                        function() {
                            return false
                        } // Treat all values as not equal
                        :
                        ko.observable["fn"]["equalityComparer"];
                        return target;
                    }
                };

                function applyExtenders(requestedExtenders) {
                    var target = this;
                    if (requestedExtenders) {
                        for (var key in requestedExtenders) {
                            var extenderHandler = ko.extenders[key];
                            if (typeof extenderHandler == 'function') {
                                target = extenderHandler(target, requestedExtenders[key]);
                            }
                        }
                    }
                    return target;
                }

                ko.exportSymbol('extenders', ko.extenders);

                ko.subscription = function(target, callback, disposeCallback) {
                    this.target = target;
                    this.callback = callback;
                    this.disposeCallback = disposeCallback;
                    ko.exportProperty(this, 'dispose', this.dispose);
                };
                ko.subscription.prototype.dispose = function() {
                    this.isDisposed = true;
                    this.disposeCallback();
                };

                ko.subscribable = function() {
                    this._subscriptions = {};

                    ko.utils.extend(this, ko.subscribable['fn']);
                    ko.exportProperty(this, 'subscribe', this.subscribe);
                    ko.exportProperty(this, 'extend', this.extend);
                    ko.exportProperty(this, 'getSubscriptionsCount', this.getSubscriptionsCount);
                }

                var defaultEvent = "change";

                ko.subscribable['fn'] = {
                    subscribe: function(callback, callbackTarget, event) {
                        event = event || defaultEvent;
                        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

                        var subscription = new ko.subscription(this, boundCallback, function() {
                            ko.utils.arrayRemoveItem(this._subscriptions[event], subscription);
                        }.bind(this));

                        if (!this._subscriptions[event]) this._subscriptions[event] = [];
                        this._subscriptions[event].push(subscription);
                        return subscription;
                    },

                    "notifySubscribers": function(valueToNotify, event) {
                        event = event || defaultEvent;
                        if (this._subscriptions[event]) {
                            ko.utils.arrayForEach(this._subscriptions[event].slice(0), function(subscription) {
                                // In case a subscription was disposed during the arrayForEach cycle, check
                                // for isDisposed on each subscription before invoking its callback
                                if (subscription && (subscription.isDisposed !== true)) subscription.callback(valueToNotify);
                            });
                        }
                    },

                    getSubscriptionsCount: function() {
                        var total = 0;
                        for (var eventName in this._subscriptions) {
                            if (this._subscriptions.hasOwnProperty(eventName)) total += this._subscriptions[eventName].length;
                        }
                        return total;
                    },

                    extend: applyExtenders
                };


                ko.isSubscribable = function(instance) {
                    return typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
                };

                ko.exportSymbol('subscribable', ko.subscribable);
                ko.exportSymbol('isSubscribable', ko.isSubscribable);

                ko.dependencyDetection = (function() {
                    var _frames = [];

                    return {
                        begin: function(callback) {
                            _frames.push({
                                callback: callback,
                                distinctDependencies: []
                            });
                        },

                        end: function() {
                            _frames.pop();
                        },

                        registerDependency: function(subscribable) {
                            if (!ko.isSubscribable(subscribable)) throw new Error("Only subscribable things can act as dependencies");
                            if (_frames.length > 0) {
                                var topFrame = _frames[_frames.length - 1];
                                if (ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0) return;
                                topFrame.distinctDependencies.push(subscribable);
                                topFrame.callback(subscribable);
                            }
                        }
                    };
                })();
                var primitiveTypes = {
                    'undefined': true,
                    'boolean': true,
                    'number': true,
                    'string': true
                };

                ko.observable = function(initialValue) {
                    var _latestValue = initialValue;

                    function observable() {
                        if (arguments.length > 0) {
                            // Write
                            // Ignore writes if the value hasn't changed
                            if ((!observable['equalityComparer']) || !observable['equalityComparer'](_latestValue, arguments[0])) {
                                observable.valueWillMutate();
                                _latestValue = arguments[0];
                                if (DEBUG) observable._latestValue = _latestValue;
                                observable.valueHasMutated();
                            }
                            return this; // Permits chained assignments
                        } else {
                            // Read
                            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
                            return _latestValue;
                        }
                    }
                    if (DEBUG) observable._latestValue = _latestValue;
                    ko.subscribable.call(observable);
                    observable.valueHasMutated = function() {
                        observable["notifySubscribers"](_latestValue);
                    }
                    observable.valueWillMutate = function() {
                        observable["notifySubscribers"](_latestValue, "beforeChange");
                    }
                    ko.utils.extend(observable, ko.observable['fn']);

                    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
                    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

                    return observable;
                }

                ko.observable['fn'] = {
                    "equalityComparer": function valuesArePrimitiveAndEqual(a, b) {
                        var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
                        return oldValueIsPrimitive ? (a === b) : false;
                    }
                };

                var protoProperty = ko.observable.protoProperty = "__ko_proto__";
                ko.observable['fn'][protoProperty] = ko.observable;

                ko.hasPrototype = function(instance, prototype) {
                    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
                    if (instance[protoProperty] === prototype) return true;
                    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
                };

                ko.isObservable = function(instance) {
                    return ko.hasPrototype(instance, ko.observable);
                }
                ko.isWriteableObservable = function(instance) {
                    // Observable
                    if ((typeof instance == "function") && instance[protoProperty] === ko.observable) return true;
                    // Writeable dependent observable
                    if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction)) return true;
                    // Anything else
                    return false;
                }


                ko.exportSymbol('observable', ko.observable);
                ko.exportSymbol('isObservable', ko.isObservable);
                ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
                ko.observableArray = function(initialValues) {
                    if (arguments.length == 0) {
                        // Zero-parameter constructor initializes to empty array
                        initialValues = [];
                    }
                    if ((initialValues !== null) && (initialValues !== undefined) && !('length' in initialValues)) throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

                    var result = ko.observable(initialValues);
                    ko.utils.extend(result, ko.observableArray['fn']);
                    return result;
                }

                ko.observableArray['fn'] = {
                    'remove': function(valueOrPredicate) {
                        var underlyingArray = this();
                        var removedValues = [];
                        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function(value) {
                                return value === valueOrPredicate;
                            };
                        for (var i = 0; i < underlyingArray.length; i++) {
                            var value = underlyingArray[i];
                            if (predicate(value)) {
                                if (removedValues.length === 0) {
                                    this.valueWillMutate();
                                }
                                removedValues.push(value);
                                underlyingArray.splice(i, 1);
                                i--;
                            }
                        }
                        if (removedValues.length) {
                            this.valueHasMutated();
                        }
                        return removedValues;
                    },

                    'removeAll': function(arrayOfValues) {
                        // If you passed zero args, we remove everything
                        if (arrayOfValues === undefined) {
                            var underlyingArray = this();
                            var allValues = underlyingArray.slice(0);
                            this.valueWillMutate();
                            underlyingArray.splice(0, underlyingArray.length);
                            this.valueHasMutated();
                            return allValues;
                        }
                        // If you passed an arg, we interpret it as an array of entries to remove
                        if (!arrayOfValues) return [];
                        return this['remove'](function(value) {
                            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
                        });
                    },

                    'destroy': function(valueOrPredicate) {
                        var underlyingArray = this();
                        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function(value) {
                                return value === valueOrPredicate;
                            };
                        this.valueWillMutate();
                        for (var i = underlyingArray.length - 1; i >= 0; i--) {
                            var value = underlyingArray[i];
                            if (predicate(value)) underlyingArray[i]["_destroy"] = true;
                        }
                        this.valueHasMutated();
                    },

                    'destroyAll': function(arrayOfValues) {
                        // If you passed zero args, we destroy everything
                        if (arrayOfValues === undefined) return this['destroy'](function() {
                            return true
                        });

                        // If you passed an arg, we interpret it as an array of entries to destroy
                        if (!arrayOfValues) return [];
                        return this['destroy'](function(value) {
                            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
                        });
                    },

                    'indexOf': function(item) {
                        var underlyingArray = this();
                        return ko.utils.arrayIndexOf(underlyingArray, item);
                    },

                    'replace': function(oldItem, newItem) {
                        var index = this['indexOf'](oldItem);
                        if (index >= 0) {
                            this.valueWillMutate();
                            this()[index] = newItem;
                            this.valueHasMutated();
                        }
                    }
                }

                // Populate ko.observableArray.fn with read/write functions from native arrays
                ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(methodName) {
                    ko.observableArray['fn'][methodName] = function() {
                        var underlyingArray = this();
                        this.valueWillMutate();
                        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
                        this.valueHasMutated();
                        return methodCallResult;
                    };
                });

                // Populate ko.observableArray.fn with read-only functions from native arrays
                ko.utils.arrayForEach(["slice"], function(methodName) {
                    ko.observableArray['fn'][methodName] = function() {
                        var underlyingArray = this();
                        return underlyingArray[methodName].apply(underlyingArray, arguments);
                    };
                });

                ko.exportSymbol('observableArray', ko.observableArray);
                ko.dependentObservable = function(evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
                    var _latestValue, _hasBeenEvaluated = false,
                        _isBeingEvaluated = false,
                        readFunction = evaluatorFunctionOrOptions;

                    if (readFunction && typeof readFunction == "object") {
                        // Single-parameter syntax - everything is on this "options" param
                        options = readFunction;
                        readFunction = options["read"];
                    } else {
                        // Multi-parameter syntax - construct the options according to the params passed
                        options = options || {};
                        if (!readFunction) readFunction = options["read"];
                    }
                    // By here, "options" is always non-null
                    if (typeof readFunction != "function") throw new Error("Pass a function that returns the value of the ko.computed");

                    var writeFunction = options["write"];
                    if (!evaluatorFunctionTarget) evaluatorFunctionTarget = options["owner"];

                    var _subscriptionsToDependencies = [];

                    function disposeAllSubscriptionsToDependencies() {
                        ko.utils.arrayForEach(_subscriptionsToDependencies, function(subscription) {
                            subscription.dispose();
                        });
                        _subscriptionsToDependencies = [];
                    }
                    var dispose = disposeAllSubscriptionsToDependencies;

                    // Build "disposeWhenNodeIsRemoved" and "disposeWhenNodeIsRemovedCallback" option values
                    // (Note: "disposeWhenNodeIsRemoved" option both proactively disposes as soon as the node is removed using ko.removeNode(),
                    // plus adds a "disposeWhen" callback that, on each evaluation, disposes if the node was removed by some other means.)
                    var disposeWhenNodeIsRemoved = (typeof options["disposeWhenNodeIsRemoved"] == "object") ? options["disposeWhenNodeIsRemoved"] : null;
                    var disposeWhen = options["disposeWhen"] ||
                    function() {
                        return false;
                    };
                    if (disposeWhenNodeIsRemoved) {
                        dispose = function() {
                            ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, arguments.callee);
                            disposeAllSubscriptionsToDependencies();
                        };
                        ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
                        var existingDisposeWhenFunction = disposeWhen;
                        disposeWhen = function() {
                            return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || existingDisposeWhenFunction();
                        }
                    }

                    var evaluationTimeoutInstance = null;

                    function evaluatePossiblyAsync() {
                        var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
                        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
                            clearTimeout(evaluationTimeoutInstance);
                            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
                        } else evaluateImmediate();
                    }

                    function evaluateImmediate() {
                        if (_isBeingEvaluated) {
                            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
                            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
                            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
                            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
                            return;
                        }

                        // Don't dispose on first evaluation, because the "disposeWhen" callback might
                        // e.g., dispose when the associated DOM element isn't in the doc, and it's not
                        // going to be in the doc until *after* the first evaluation
                        if (_hasBeenEvaluated && disposeWhen()) {
                            dispose();
                            return;
                        }

                        _isBeingEvaluated = true;
                        try {
                            // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
                            // Then, during evaluation, we cross off any that are in fact still being used.
                            var disposalCandidates = ko.utils.arrayMap(_subscriptionsToDependencies, function(item) {
                                return item.target;
                            });

                            ko.dependencyDetection.begin(function(subscribable) {
                                var inOld;
                                if ((inOld = ko.utils.arrayIndexOf(disposalCandidates, subscribable)) >= 0) disposalCandidates[inOld] = undefined; // Don't want to dispose this subscription, as it's still being used
                                else _subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync)); // Brand new subscription - add it
                            });

                            var newValue = readFunction.call(evaluatorFunctionTarget);

                            // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
                            for (var i = disposalCandidates.length - 1; i >= 0; i--) {
                                if (disposalCandidates[i]) _subscriptionsToDependencies.splice(i, 1)[0].dispose();
                            }
                            _hasBeenEvaluated = true;

                            dependentObservable["notifySubscribers"](_latestValue, "beforeChange");
                            _latestValue = newValue;
                            if (DEBUG) dependentObservable._latestValue = _latestValue;
                        } finally {
                            ko.dependencyDetection.end();
                        }

                        dependentObservable["notifySubscribers"](_latestValue);
                        _isBeingEvaluated = false;

                    }

                    function dependentObservable() {
                        if (arguments.length > 0) {
                            set.apply(dependentObservable, arguments);
                        } else {
                            return get();
                        }
                    }

                    function set() {
                        if (typeof writeFunction === "function") {
                            // Writing a value
                            writeFunction.apply(evaluatorFunctionTarget, arguments);
                        } else {
                            throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
                        }
                    }

                    function get() {
                        // Reading the value
                        if (!_hasBeenEvaluated) evaluateImmediate();
                        ko.dependencyDetection.registerDependency(dependentObservable);
                        return _latestValue;
                    }

                    dependentObservable.getDependenciesCount = function() {
                        return _subscriptionsToDependencies.length;
                    };
                    dependentObservable.hasWriteFunction = typeof options["write"] === "function";
                    dependentObservable.dispose = function() {
                        dispose();
                    };

                    ko.subscribable.call(dependentObservable);
                    ko.utils.extend(dependentObservable, ko.dependentObservable['fn']);

                    if (options['deferEvaluation'] !== true) evaluateImmediate();

                    ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
                    ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

                    return dependentObservable;
                };

                ko.isComputed = function(instance) {
                    return ko.hasPrototype(instance, ko.dependentObservable);
                };

                var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
                ko.dependentObservable[protoProp] = ko.observable;

                ko.dependentObservable['fn'] = {};
                ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

                ko.exportSymbol('dependentObservable', ko.dependentObservable);
                ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
                ko.exportSymbol('isComputed', ko.isComputed);

                (function() {
                    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)
                    ko.toJS = function(rootObject) {
                        if (arguments.length == 0) throw new Error("When calling ko.toJS, pass the object you want to convert.");

                        // We just unwrap everything at every level in the object graph
                        return mapJsObjectGraph(rootObject, function(valueToMap) {
                            // Loop because an observable's value might in turn be another observable wrapper
                            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                            valueToMap = valueToMap();
                            return valueToMap;
                        });
                    };

                    ko.toJSON = function(rootObject, replacer, space) { // replacer and space are optional
                        var plainJavaScriptObject = ko.toJS(rootObject);
                        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
                    };

                    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
                        visitedObjects = visitedObjects || new objectLookup();

                        rootObject = mapInputCallback(rootObject);
                        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date));
                        if (!canHaveProperties) return rootObject;

                        var outputProperties = rootObject instanceof Array ? [] : {};
                        visitedObjects.save(rootObject, outputProperties);

                        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
                            var propertyValue = mapInputCallback(rootObject[indexer]);

                            switch (typeof propertyValue) {
                            case "boolean":
                            case "number":
                            case "string":
                            case "function":
                                outputProperties[indexer] = propertyValue;
                                break;
                            case "object":
                            case "undefined":
                                var previouslyMappedValue = visitedObjects.get(propertyValue);
                                outputProperties[indexer] = (previouslyMappedValue !== undefined) ? previouslyMappedValue : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                                break;
                            }
                        });

                        return outputProperties;
                    }

                    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
                        if (rootObject instanceof Array) {
                            for (var i = 0; i < rootObject.length; i++)
                            visitorCallback(i);

                            // For arrays, also respect toJSON property for custom mappings (fixes #278)
                            if (typeof rootObject['toJSON'] == 'function') visitorCallback('toJSON');
                        } else {
                            for (var propertyName in rootObject)
                            visitorCallback(propertyName);
                        }
                    };

                    function objectLookup() {
                        var keys = [];
                        var values = [];
                        this.save = function(key, value) {
                            var existingIndex = ko.utils.arrayIndexOf(keys, key);
                            if (existingIndex >= 0) values[existingIndex] = value;
                            else {
                                keys.push(key);
                                values.push(value);
                            }
                        };
                        this.get = function(key) {
                            var existingIndex = ko.utils.arrayIndexOf(keys, key);
                            return (existingIndex >= 0) ? values[existingIndex] : undefined;
                        };
                    };
                })();

                ko.exportSymbol('toJS', ko.toJS);
                ko.exportSymbol('toJSON', ko.toJSON);
                (function() {
                    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

                    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
                    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
                    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
                    ko.selectExtensions = {
                        readValue: function(element) {
                            switch (ko.utils.tagNameLower(element)) {
                            case 'option':
                                if (element[hasDomDataExpandoProperty] === true) return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                                return element.getAttribute("value");
                            case 'select':
                                return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                            default:
                                return element.value;
                            }
                        },

                        writeValue: function(element, value) {
                            switch (ko.utils.tagNameLower(element)) {
                            case 'option':
                                switch (typeof value) {
                                case "string":
                                    ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                                    if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                        delete element[hasDomDataExpandoProperty];
                                    }
                                    element.value = value;
                                    break;
                                default:
                                    // Store arbitrary object using DomData
                                    ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                                    element[hasDomDataExpandoProperty] = true;

                                    // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                                    element.value = typeof value === "number" ? value : "";
                                    break;
                                }
                                break;
                            case 'select':
                                for (var i = element.options.length - 1; i >= 0; i--) {
                                    if (ko.selectExtensions.readValue(element.options[i]) == value) {
                                        element.selectedIndex = i;
                                        break;
                                    }
                                }
                                break;
                            default:
                                if ((value === null) || (value === undefined)) value = "";
                                element.value = value;
                                break;
                            }
                        }
                    };
                })();

                ko.exportSymbol('selectExtensions', ko.selectExtensions);
                ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
                ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);

                ko.jsonExpressionRewriting = (function() {
                    var restoreCapturedTokensRegex = /\@ko_token_(\d+)\@/g;
                    var javaScriptAssignmentTarget = /^[\_$a-z][\_$a-z0-9]*(\[.*?\])*(\.[\_$a-z][\_$a-z0-9]*(\[.*?\])*)*$/i;
                    var javaScriptReservedWords = ["true", "false"];

                    function restoreTokens(string, tokens) {
                        var prevValue = null;
                        while (string != prevValue) { // Keep restoring tokens until it no longer makes a difference (they may be nested)
                            prevValue = string;
                            string = string.replace(restoreCapturedTokensRegex, function(match, tokenIndex) {
                                return tokens[tokenIndex];
                            });
                        }
                        return string;
                    }

                    function isWriteableValue(expression) {
                        if (ko.utils.arrayIndexOf(javaScriptReservedWords, ko.utils.stringTrim(expression).toLowerCase()) >= 0) return false;
                        return expression.match(javaScriptAssignmentTarget) !== null;
                    }

                    function ensureQuoted(key) {
                        var trimmedKey = ko.utils.stringTrim(key);
                        switch (trimmedKey.length && trimmedKey.charAt(0)) {
                        case "'":
                        case '"':
                            return key;
                        default:
                            return "'" + trimmedKey + "'";
                        }
                    }

                    return {
                        bindingRewriteValidators: [],

                        parseObjectLiteral: function(objectLiteralString) {
                            // A full tokeniser+lexer would add too much weight to this library, so here's a simple parser
                            // that is sufficient just to split an object literal string into a set of top-level key-value pairs
                            var str = ko.utils.stringTrim(objectLiteralString);
                            if (str.length < 3) return [];
                            if (str.charAt(0) === "{") // Ignore any braces surrounding the whole object literal
                            str = str.substring(1, str.length - 1);

                            // Pull out any string literals and regex literals
                            var tokens = [];
                            var tokenStart = null,
                                tokenEndChar;
                            for (var position = 0; position < str.length; position++) {
                                var c = str.charAt(position);
                                if (tokenStart === null) {
                                    switch (c) {
                                    case '"':
                                    case "'":
                                    case "/":
                                        tokenStart = position;
                                        tokenEndChar = c;
                                        break;
                                    }
                                } else if ((c == tokenEndChar) && (str.charAt(position - 1) !== "\\")) {
                                    var token = str.substring(tokenStart, position + 1);
                                    tokens.push(token);
                                    var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                                    str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                                    position -= (token.length - replacement.length);
                                    tokenStart = null;
                                }
                            }

                            // Next pull out balanced paren, brace, and bracket blocks
                            tokenStart = null;
                            tokenEndChar = null;
                            var tokenDepth = 0,
                                tokenStartChar = null;
                            for (var position = 0; position < str.length; position++) {
                                var c = str.charAt(position);
                                if (tokenStart === null) {
                                    switch (c) {
                                    case "{":
                                        tokenStart = position;
                                        tokenStartChar = c;
                                        tokenEndChar = "}";
                                        break;
                                    case "(":
                                        tokenStart = position;
                                        tokenStartChar = c;
                                        tokenEndChar = ")";
                                        break;
                                    case "[":
                                        tokenStart = position;
                                        tokenStartChar = c;
                                        tokenEndChar = "]";
                                        break;
                                    }
                                }

                                if (c === tokenStartChar) tokenDepth++;
                                else if (c === tokenEndChar) {
                                    tokenDepth--;
                                    if (tokenDepth === 0) {
                                        var token = str.substring(tokenStart, position + 1);
                                        tokens.push(token);
                                        var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                                        str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                                        position -= (token.length - replacement.length);
                                        tokenStart = null;
                                    }
                                }
                            }

                            // Now we can safely split on commas to get the key/value pairs
                            var result = [];
                            var keyValuePairs = str.split(",");
                            for (var i = 0, j = keyValuePairs.length; i < j; i++) {
                                var pair = keyValuePairs[i];
                                var colonPos = pair.indexOf(":");
                                if ((colonPos > 0) && (colonPos < pair.length - 1)) {
                                    var key = pair.substring(0, colonPos);
                                    var value = pair.substring(colonPos + 1);
                                    result.push({
                                        'key': restoreTokens(key, tokens),
                                        'value': restoreTokens(value, tokens)
                                    });
                                } else {
                                    result.push({
                                        'unknown': restoreTokens(pair, tokens)
                                    });
                                }
                            }
                            return result;
                        },

                        insertPropertyAccessorsIntoJson: function(objectLiteralStringOrKeyValueArray) {
                            var keyValueArray = typeof objectLiteralStringOrKeyValueArray === "string" ? ko.jsonExpressionRewriting.parseObjectLiteral(objectLiteralStringOrKeyValueArray) : objectLiteralStringOrKeyValueArray;
                            var resultStrings = [],
                                propertyAccessorResultStrings = [];

                            var keyValueEntry;
                            for (var i = 0; keyValueEntry = keyValueArray[i]; i++) {
                                if (resultStrings.length > 0) resultStrings.push(",");

                                if (keyValueEntry['key']) {
                                    var quotedKey = ensureQuoted(keyValueEntry['key']),
                                        val = keyValueEntry['value'];
                                    resultStrings.push(quotedKey);
                                    resultStrings.push(":");
                                    resultStrings.push(val);

                                    if (isWriteableValue(ko.utils.stringTrim(val))) {
                                        if (propertyAccessorResultStrings.length > 0) propertyAccessorResultStrings.push(", ");
                                        propertyAccessorResultStrings.push(quotedKey + " : function(__ko_value) { " + val + " = __ko_value; }");
                                    }
                                } else if (keyValueEntry['unknown']) {
                                    resultStrings.push(keyValueEntry['unknown']);
                                }
                            }

                            var combinedResult = resultStrings.join("");
                            if (propertyAccessorResultStrings.length > 0) {
                                var allPropertyAccessors = propertyAccessorResultStrings.join("");
                                combinedResult = combinedResult + ", '_ko_property_writers' : { " + allPropertyAccessors + " } ";
                            }

                            return combinedResult;
                        },

                        keyValueArrayContainsKey: function(keyValueArray, key) {
                            for (var i = 0; i < keyValueArray.length; i++)
                            if (ko.utils.stringTrim(keyValueArray[i]['key']) == key) return true;
                            return false;
                        },

                        // Internal, private KO utility for updating model properties from within bindings
                        // property:            If the property being updated is (or might be) an observable, pass it here
                        //                      If it turns out to be a writable observable, it will be written to directly
                        // allBindingsAccessor: All bindings in the current execution context.
                        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
                        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
                        // value:               The value to be written
                        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
                        //                      it is !== existing value on that writable observable
                        writeValueToProperty: function(property, allBindingsAccessor, key, value, checkIfDifferent) {
                            if (!property || !ko.isWriteableObservable(property)) {
                                var propWriters = allBindingsAccessor()['_ko_property_writers'];
                                if (propWriters && propWriters[key]) propWriters[key](value);
                            } else if (!checkIfDifferent || property() !== value) {
                                property(value);
                            }
                        }
                    };
                })();

                ko.exportSymbol('jsonExpressionRewriting', ko.jsonExpressionRewriting);
                ko.exportSymbol('jsonExpressionRewriting.bindingRewriteValidators', ko.jsonExpressionRewriting.bindingRewriteValidators);
                ko.exportSymbol('jsonExpressionRewriting.parseObjectLiteral', ko.jsonExpressionRewriting.parseObjectLiteral);
                ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson);
                (function() {
                    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
                    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
                    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
                    // of that virtual hierarchy
                    //
                    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
                    // without having to scatter special cases all over the binding and templating code.
                    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
                    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
                    // So, use node.text where available, and node.nodeValue elsewhere
                    var commentNodesHaveTextProperty = document.createComment("test").text === "<!--test-->";

                    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko\s+(.*\:.*)\s*-->$/ : /^\s*ko\s+(.*\:.*)\s*$/;
                    var endCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
                    var htmlTagsWithOptionallyClosingChildren = {
                        'ul': true,
                        'ol': true
                    };

                    function isStartComment(node) {
                        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
                    }

                    function isEndComment(node) {
                        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(endCommentRegex);
                    }

                    function getVirtualChildren(startComment, allowUnbalanced) {
                        var currentNode = startComment;
                        var depth = 1;
                        var children = [];
                        while (currentNode = currentNode.nextSibling) {
                            if (isEndComment(currentNode)) {
                                depth--;
                                if (depth === 0) return children;
                            }

                            children.push(currentNode);

                            if (isStartComment(currentNode)) depth++;
                        }
                        if (!allowUnbalanced) throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
                        return null;
                    }

                    function getMatchingEndComment(startComment, allowUnbalanced) {
                        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
                        if (allVirtualChildren) {
                            if (allVirtualChildren.length > 0) return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
                            return startComment.nextSibling;
                        } else return null; // Must have no matching end comment, and allowUnbalanced is true
                    }

                    function getUnbalancedChildTags(node) {
                        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
                        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
                        var childNode = node.firstChild,
                            captureRemaining = null;
                        if (childNode) {
                            do {
                                if (captureRemaining) // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                                captureRemaining.push(childNode);
                                else if (isStartComment(childNode)) {
                                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                                    if (matchingEndComment) // It's a balanced tag, so skip immediately to the end of this virtual set
                                    childNode = matchingEndComment;
                                    else captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                                } else if (isEndComment(childNode)) {
                                    captureRemaining = [childNode]; // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                                }
                            } while (childNode = childNode.nextSibling);
                        }
                        return captureRemaining;
                    }

                    ko.virtualElements = {
                        allowedBindings: {},

                        childNodes: function(node) {
                            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
                        },

                        emptyNode: function(node) {
                            if (!isStartComment(node)) ko.utils.emptyDomNode(node);
                            else {
                                var virtualChildren = ko.virtualElements.childNodes(node);
                                for (var i = 0, j = virtualChildren.length; i < j; i++)
                                ko.removeNode(virtualChildren[i]);
                            }
                        },

                        setDomNodeChildren: function(node, childNodes) {
                            if (!isStartComment(node)) ko.utils.setDomNodeChildren(node, childNodes);
                            else {
                                ko.virtualElements.emptyNode(node);
                                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                                for (var i = 0, j = childNodes.length; i < j; i++)
                                endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
                            }
                        },

                        prepend: function(containerNode, nodeToPrepend) {
                            if (!isStartComment(containerNode)) {
                                if (containerNode.firstChild) containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                                else containerNode.appendChild(nodeToPrepend);
                            } else {
                                // Start comments must always have a parent and at least one following sibling (the end comment)
                                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
                            }
                        },

                        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
                            if (!isStartComment(containerNode)) {
                                // Insert after insertion point
                                if (insertAfterNode.nextSibling) containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                                else containerNode.appendChild(nodeToInsert);
                            } else {
                                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                            }
                        },

                        firstChild: function(node) {
                            if (!isStartComment(node)) return node.firstChild;
                            if (!node.nextSibling || isEndComment(node.nextSibling)) return null;
                            return node.nextSibling;
                        },

                        nextSibling: function(node) {
                            if (isStartComment(node)) node = getMatchingEndComment(node);
                            if (node.nextSibling && isEndComment(node.nextSibling)) return null;
                            return node.nextSibling;
                        },

                        virtualNodeBindingValue: function(node) {
                            var regexMatch = isStartComment(node);
                            return regexMatch ? regexMatch[1] : null;
                        },

                        normaliseVirtualElementDomStructure: function(elementVerified) {
                            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
                            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
                            // that are direct descendants of <ul> into the preceding <li>)
                            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)]) return;

                            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
                            // must be intended to appear *after* that child, so move them there.
                            var childNode = elementVerified.firstChild;
                            if (childNode) {
                                do {
                                    if (childNode.nodeType === 1) {
                                        var unbalancedTags = getUnbalancedChildTags(childNode);
                                        if (unbalancedTags) {
                                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                                            var nodeToInsertBefore = childNode.nextSibling;
                                            for (var i = 0; i < unbalancedTags.length; i++) {
                                                if (nodeToInsertBefore) elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                                else elementVerified.appendChild(unbalancedTags[i]);
                                            }
                                        }
                                    }
                                } while (childNode = childNode.nextSibling);
                            }
                        }
                    };
                })();
                ko.exportSymbol('virtualElements', ko.virtualElements);
                ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
                ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
                //ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
                ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
                //ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
                ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
                ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
                (function() {
                    var defaultBindingAttributeName = "data-bind";

                    ko.bindingProvider = function() {
                        this.bindingCache = {};
                    };

                    ko.utils.extend(ko.bindingProvider.prototype, {
                        'nodeHasBindings': function(node) {
                            switch (node.nodeType) {
                            case 1:
                                return node.getAttribute(defaultBindingAttributeName) != null; // Element
                            case 8:
                                return ko.virtualElements.virtualNodeBindingValue(node) != null; // Comment node
                            default:
                                return false;
                            }
                        },

                        'getBindings': function(node, bindingContext) {
                            var bindingsString = this['getBindingsString'](node, bindingContext);
                            return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext) : null;
                        },

                        // The following function is only used internally by this default provider.
                        // It's not part of the interface definition for a general binding provider.
                        'getBindingsString': function(node, bindingContext) {
                            switch (node.nodeType) {
                            case 1:
                                return node.getAttribute(defaultBindingAttributeName); // Element
                            case 8:
                                return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                            default:
                                return null;
                            }
                        },

                        // The following function is only used internally by this default provider.
                        // It's not part of the interface definition for a general binding provider.
                        'parseBindingsString': function(bindingsString, bindingContext) {
                            try {
                                var viewModel = bindingContext['$data'],
                                    scopes = (typeof viewModel == 'object' && viewModel != null) ? [viewModel, bindingContext] : [bindingContext],
                                    bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, scopes.length, this.bindingCache);
                                return bindingFunction(scopes);
                            } catch (ex) {
                                throw new Error("Unable to parse bindings.\nMessage: " + ex + ";\nBindings value: " + bindingsString);
                            }
                        }
                    });

                    ko.bindingProvider['instance'] = new ko.bindingProvider();

                    function createBindingsStringEvaluatorViaCache(bindingsString, scopesCount, cache) {
                        var cacheKey = scopesCount + '_' + bindingsString;
                        return cache[cacheKey] || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, scopesCount));
                    }

                    function createBindingsStringEvaluator(bindingsString, scopesCount) {
                        var rewrittenBindings = " { " + ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(bindingsString) + " } ";
                        return ko.utils.buildEvalWithinScopeFunction(rewrittenBindings, scopesCount);
                    }
                })();

                ko.exportSymbol('bindingProvider', ko.bindingProvider);
                (function() {
                    ko.bindingHandlers = {};

                    ko.bindingContext = function(dataItem, parentBindingContext) {
                        if (parentBindingContext) {
                            ko.utils.extend(this, parentBindingContext); // Inherit $root and any custom properties
                            this['$parentContext'] = parentBindingContext;
                            this['$parent'] = parentBindingContext['$data'];
                            this['$parents'] = (parentBindingContext['$parents'] || []).slice(0);
                            this['$parents'].unshift(this['$parent']);
                        } else {
                            this['$parents'] = [];
                            this['$root'] = dataItem;
                        }
                        this['$data'] = dataItem;
                    }
                    ko.bindingContext.prototype['createChildContext'] = function(dataItem) {
                        return new ko.bindingContext(dataItem, this);
                    };
                    ko.bindingContext.prototype['extend'] = function(properties) {
                        var clone = ko.utils.extend(new ko.bindingContext(), this);
                        return ko.utils.extend(clone, properties);
                    };

                    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
                        var validator = ko.virtualElements.allowedBindings[bindingName];
                        if (!validator) throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
                    }

                    function applyBindingsToDescendantsInternal(viewModel, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
                        var currentChild, nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
                        while (currentChild = nextInQueue) {
                            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
                            nextInQueue = ko.virtualElements.nextSibling(currentChild);
                            applyBindingsToNodeAndDescendantsInternal(viewModel, currentChild, bindingContextsMayDifferFromDomParentElement);
                        }
                    }

                    function applyBindingsToNodeAndDescendantsInternal(viewModel, nodeVerified, bindingContextMayDifferFromDomParentElement) {
                        var shouldBindDescendants = true;

                        // Perf optimisation: Apply bindings only if...
                        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
                        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
                        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
                        var isElement = (nodeVerified.nodeType === 1);
                        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
                        ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

                        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement) // Case (1)
                        ||
                        ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified); // Case (2)
                        if (shouldApplyBindings) shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, viewModel, bindingContextMayDifferFromDomParentElement).shouldBindDescendants;

                        if (shouldBindDescendants) {
                            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
                            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
                            //    hence bindingContextsMayDifferFromDomParentElement is false
                            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
                            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
                            //    hence bindingContextsMayDifferFromDomParentElement is true
                            applyBindingsToDescendantsInternal(viewModel, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
                        }
                    }

                    function applyBindingsToNodeInternal(node, bindings, viewModelOrBindingContext, bindingContextMayDifferFromDomParentElement) {
                        // Need to be sure that inits are only run once, and updates never run until all the inits have been run
                        var initPhase = 0; // 0 = before all inits, 1 = during inits, 2 = after all inits
                        // Each time the dependentObservable is evaluated (after data changes),
                        // the binding attribute is reparsed so that it can pick out the correct
                        // model properties in the context of the changed data.
                        // DOM event callbacks need to be able to access this changed data,
                        // so we need a single parsedBindings variable (shared by all callbacks
                        // associated with this node's bindings) that all the closures can access.
                        var parsedBindings;

                        function makeValueAccessor(bindingKey) {
                            return function() {
                                return parsedBindings[bindingKey]
                            }
                        }

                        function parsedBindingsAccessor() {
                            return parsedBindings;
                        }

                        var bindingHandlerThatControlsDescendantBindings;
                        ko.dependentObservable(

                        function() {
                            // Ensure we have a nonnull binding context to work with
                            var bindingContextInstance = viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext) ? viewModelOrBindingContext : new ko.bindingContext(ko.utils.unwrapObservable(viewModelOrBindingContext));
                            var viewModel = bindingContextInstance['$data'];

                            // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
                            // we can easily recover it just by scanning up the node's ancestors in the DOM
                            // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
                            if (bindingContextMayDifferFromDomParentElement) ko.storedBindingContextForNode(node, bindingContextInstance);

                            // Use evaluatedBindings if given, otherwise fall back on asking the bindings provider to give us some bindings
                            var evaluatedBindings = (typeof bindings == "function") ? bindings() : bindings;
                            parsedBindings = evaluatedBindings || ko.bindingProvider['instance']['getBindings'](node, bindingContextInstance);

                            if (parsedBindings) {
                                // First run all the inits, so bindings can register for notification on changes
                                if (initPhase === 0) {
                                    initPhase = 1;
                                    for (var bindingKey in parsedBindings) {
                                        var binding = ko.bindingHandlers[bindingKey];
                                        if (binding && node.nodeType === 8) validateThatBindingIsAllowedForVirtualElements(bindingKey);

                                        if (binding && typeof binding["init"] == "function") {
                                            var handlerInitFn = binding["init"];
                                            var initResult = handlerInitFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);

                                            // If this binding handler claims to control descendant bindings, make a note of this
                                            if (initResult && initResult['controlsDescendantBindings']) {
                                                if (bindingHandlerThatControlsDescendantBindings !== undefined) throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                                bindingHandlerThatControlsDescendantBindings = bindingKey;
                                            }
                                        }
                                    }
                                    initPhase = 2;
                                }

                                // ... then run all the updates, which might trigger changes even on the first evaluation
                                if (initPhase === 2) {
                                    for (var bindingKey in parsedBindings) {
                                        var binding = ko.bindingHandlers[bindingKey];
                                        if (binding && typeof binding["update"] == "function") {
                                            var handlerUpdateFn = binding["update"];
                                            handlerUpdateFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);
                                        }
                                    }
                                }
                            }
                        }, null, {
                            'disposeWhenNodeIsRemoved': node
                        });

                        return {
                            shouldBindDescendants: bindingHandlerThatControlsDescendantBindings === undefined
                        };
                    };

                    var storedBindingContextDomDataKey = "__ko_bindingContext__";
                    ko.storedBindingContextForNode = function(node, bindingContext) {
                        if (arguments.length == 2) ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
                        else return ko.utils.domData.get(node, storedBindingContextDomDataKey);
                    }

                    ko.applyBindingsToNode = function(node, bindings, viewModel) {
                        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
                        ko.virtualElements.normaliseVirtualElementDomStructure(node);
                        return applyBindingsToNodeInternal(node, bindings, viewModel, true);
                    };

                    ko.applyBindingsToDescendants = function(viewModel, rootNode) {
                        if (rootNode.nodeType === 1 || rootNode.nodeType === 8) applyBindingsToDescendantsInternal(viewModel, rootNode, true);
                    };

                    ko.applyBindings = function(viewModel, rootNode) {
                        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8)) throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
                        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional
                        applyBindingsToNodeAndDescendantsInternal(viewModel, rootNode, true);
                    };

                    // Retrieving binding context from arbitrary nodes
                    ko.contextFor = function(node) {
                        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
                        switch (node.nodeType) {
                        case 1:
                        case 8:
                            var context = ko.storedBindingContextForNode(node);
                            if (context) return context;
                            if (node.parentNode) return ko.contextFor(node.parentNode);
                            break;
                        }
                        return undefined;
                    };
                    ko.dataFor = function(node) {
                        var context = ko.contextFor(node);
                        return context ? context['$data'] : undefined;
                    };

                    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
                    ko.exportSymbol('applyBindings', ko.applyBindings);
                    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
                    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
                    ko.exportSymbol('contextFor', ko.contextFor);
                    ko.exportSymbol('dataFor', ko.dataFor);
                })();
                // For certain common events (currently just 'click'), allow a simplified data-binding syntax
                // e.g. click:handler instead of the usual full-length event:{click:handler}
                var eventHandlersWithShortcuts = ['click'];
                ko.utils.arrayForEach(eventHandlersWithShortcuts, function(eventName) {
                    ko.bindingHandlers[eventName] = {
                        'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
                            var newValueAccessor = function() {
                                    var result = {};
                                    result[eventName] = valueAccessor();
                                    return result;
                                };
                            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindingsAccessor, viewModel);
                        }
                    }
                });


                ko.bindingHandlers['event'] = {
                    'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
                        var eventsToHandle = valueAccessor() || {};
                        for (var eventNameOutsideClosure in eventsToHandle) {
                            (function() {
                                var eventName = eventNameOutsideClosure; // Separate variable to be captured by event handler closure
                                if (typeof eventName == "string") {
                                    ko.utils.registerEventHandler(element, eventName, function(event) {
                                        var handlerReturnValue;
                                        var handlerFunction = valueAccessor()[eventName];
                                        if (!handlerFunction) return;
                                        var allBindings = allBindingsAccessor();

                                        try {
                                            // Take all the event args, and prefix with the viewmodel
                                            var argsForHandler = ko.utils.makeArray(arguments);
                                            argsForHandler.unshift(viewModel);
                                            handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                                        } finally {
                                            if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                                if (event.preventDefault) event.preventDefault();
                                                else event.returnValue = false;
                                            }
                                        }

                                        var bubble = allBindings[eventName + 'Bubble'] !== false;
                                        if (!bubble) {
                                            event.cancelBubble = true;
                                            if (event.stopPropagation) event.stopPropagation();
                                        }
                                    });
                                }
                            })();
                        }
                    }
                };

                ko.bindingHandlers['submit'] = {
                    'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
                        if (typeof valueAccessor() != "function") throw new Error("The value for a submit binding must be a function");
                        ko.utils.registerEventHandler(element, "submit", function(event) {
                            var handlerReturnValue;
                            var value = valueAccessor();
                            try {
                                handlerReturnValue = value.call(viewModel, element);
                            } finally {
                                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                    if (event.preventDefault) event.preventDefault();
                                    else event.returnValue = false;
                                }
                            }
                        });
                    }
                };

                ko.bindingHandlers['visible'] = {
                    'update': function(element, valueAccessor) {
                        var value = ko.utils.unwrapObservable(valueAccessor());
                        var isCurrentlyVisible = !(element.style.display == "none");
                        if (value && !isCurrentlyVisible) element.style.display = "";
                        else if ((!value) && isCurrentlyVisible) element.style.display = "none";
                    }
                }

                ko.bindingHandlers['enable'] = {
                    'update': function(element, valueAccessor) {
                        var value = ko.utils.unwrapObservable(valueAccessor());
                        if (value && element.disabled) element.removeAttribute("disabled");
                        else if ((!value) && (!element.disabled)) element.disabled = true;
                    }
                };

                ko.bindingHandlers['disable'] = {
                    'update': function(element, valueAccessor) {
                        ko.bindingHandlers['enable']['update'](element, function() {
                            return !ko.utils.unwrapObservable(valueAccessor())
                        });
                    }
                };

                function ensureDropdownSelectionIsConsistentWithModelValue(element, modelValue, preferModelValue) {
                    if (preferModelValue) {
                        if (modelValue !== ko.selectExtensions.readValue(element)) ko.selectExtensions.writeValue(element, modelValue);
                    }

                    // No matter which direction we're syncing in, we want the end result to be equality between dropdown value and model value.
                    // If they aren't equal, either we prefer the dropdown value, or the model value couldn't be represented, so either way,
                    // change the model value to match the dropdown.
                    if (modelValue !== ko.selectExtensions.readValue(element)) ko.utils.triggerEvent(element, "change");
                };

                ko.bindingHandlers['value'] = {
                    'init': function(element, valueAccessor, allBindingsAccessor) {
                        // Always catch "change" event; possibly other events too if asked
                        var eventsToCatch = ["change"];
                        var requestedEventsToCatch = allBindingsAccessor()["valueUpdate"];
                        if (requestedEventsToCatch) {
                            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                            requestedEventsToCatch = [requestedEventsToCatch];
                            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
                            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
                        }

                        var valueUpdateHandler = function() {
                                var modelValue = valueAccessor();
                                var elementValue = ko.selectExtensions.readValue(element);
                                ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'value', elementValue, /* checkIfDifferent: */ true);
                            }

                            // Workaround for https://github.com/SteveSanderson/knockout/issues/122
                            // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
                        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text" && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
                        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
                            var propertyChangedFired = false;
                            ko.utils.registerEventHandler(element, "propertychange", function() {
                                propertyChangedFired = true
                            });
                            ko.utils.registerEventHandler(element, "blur", function() {
                                if (propertyChangedFired) {
                                    propertyChangedFired = false;
                                    valueUpdateHandler();
                                }
                            });
                        }

                        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
                            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
                            // This is useful, for example, to catch "keydown" events after the browser has updated the control
                            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
                            var handler = valueUpdateHandler;
                            if (ko.utils.stringStartsWith(eventName, "after")) {
                                handler = function() {
                                    setTimeout(valueUpdateHandler, 0)
                                };
                                eventName = eventName.substring("after".length);
                            }
                            ko.utils.registerEventHandler(element, eventName, handler);
                        });
                    },
                    'update': function(element, valueAccessor) {
                        var valueIsSelectOption = ko.utils.tagNameLower(element) === "select";
                        var newValue = ko.utils.unwrapObservable(valueAccessor());
                        var elementValue = ko.selectExtensions.readValue(element);
                        var valueHasChanged = (newValue != elementValue);

                        // JavaScript's 0 == "" behavious is unfortunate here as it prevents writing 0 to an empty text box (loose equality suggests the values are the same).
                        // We don't want to do a strict equality comparison as that is more confusing for developers in certain cases, so we specifically special case 0 != "" here.
                        if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0")) valueHasChanged = true;

                        if (valueHasChanged) {
                            var applyValueAction = function() {
                                    ko.selectExtensions.writeValue(element, newValue);
                                };
                            applyValueAction();

                            // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
                            // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
                            // to apply the value as well.
                            var alsoApplyAsynchronously = valueIsSelectOption;
                            if (alsoApplyAsynchronously) setTimeout(applyValueAction, 0);
                        }

                        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
                        // because you're not allowed to have a model value that disagrees with a visible UI selection.
                        if (valueIsSelectOption && (element.length > 0)) ensureDropdownSelectionIsConsistentWithModelValue(element, newValue, /* preferModelValue */ false);
                    }
                };

                ko.bindingHandlers['options'] = {
                    'update': function(element, valueAccessor, allBindingsAccessor) {
                        if (ko.utils.tagNameLower(element) !== "select") throw new Error("options binding applies only to SELECT elements");

                        var selectWasPreviouslyEmpty = element.length == 0;
                        var previousSelectedValues = ko.utils.arrayMap(ko.utils.arrayFilter(element.childNodes, function(node) {
                            return node.tagName && (ko.utils.tagNameLower(node) === "option") && node.selected;
                        }), function(node) {
                            return ko.selectExtensions.readValue(node) || node.innerText || node.textContent;
                        });
                        var previousScrollTop = element.scrollTop;

                        var value = ko.utils.unwrapObservable(valueAccessor());
                        var selectedValue = element.value;

                        // Remove all existing <option>s.
                        // Need to use .remove() rather than .removeChild() for <option>s otherwise IE behaves oddly (https://github.com/SteveSanderson/knockout/issues/134)
                        while (element.length > 0) {
                            ko.cleanNode(element.options[0]);
                            element.remove(0);
                        }

                        if (value) {
                            var allBindings = allBindingsAccessor();
                            if (typeof value.length != "number") value = [value];
                            if (allBindings['optionsCaption']) {
                                var option = document.createElement("option");
                                ko.utils.setHtml(option, allBindings['optionsCaption']);
                                ko.selectExtensions.writeValue(option, undefined);
                                element.appendChild(option);
                            }
                            for (var i = 0, j = value.length; i < j; i++) {
                                var option = document.createElement("option");

                                // Apply a value to the option element
                                var optionValue = typeof allBindings['optionsValue'] == "string" ? value[i][allBindings['optionsValue']] : value[i];
                                optionValue = ko.utils.unwrapObservable(optionValue);
                                ko.selectExtensions.writeValue(option, optionValue);

                                // Apply some text to the option element
                                var optionsTextValue = allBindings['optionsText'];
                                var optionText;
                                if (typeof optionsTextValue == "function") optionText = optionsTextValue(value[i]); // Given a function; run it against the data value
                                else if (typeof optionsTextValue == "string") optionText = value[i][optionsTextValue]; // Given a string; treat it as a property name on the data value
                                else optionText = optionValue; // Given no optionsText arg; use the data value itself
                                if ((optionText === null) || (optionText === undefined)) optionText = "";

                                ko.utils.setTextContent(option, optionText);

                                element.appendChild(option);
                            }

                            // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
                            // That's why we first added them without selection. Now it's time to set the selection.
                            var newOptions = element.getElementsByTagName("option");
                            var countSelectionsRetained = 0;
                            for (var i = 0, j = newOptions.length; i < j; i++) {
                                if (ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[i])) >= 0) {
                                    ko.utils.setOptionNodeSelectionState(newOptions[i], true);
                                    countSelectionsRetained++;
                                }
                            }

                            element.scrollTop = previousScrollTop;

                            if (selectWasPreviouslyEmpty && ('value' in allBindings)) {
                                // Ensure consistency between model value and selected option.
                                // If the dropdown is being populated for the first time here (or was otherwise previously empty),
                                // the dropdown selection state is meaningless, so we preserve the model value.
                                ensureDropdownSelectionIsConsistentWithModelValue(element, ko.utils.unwrapObservable(allBindings['value']), /* preferModelValue */ true);
                            }

                            // Workaround for IE9 bug
                            ko.utils.ensureSelectElementIsRenderedCorrectly(element);
                        }
                    }
                };
                ko.bindingHandlers['options'].optionValueDomDataKey = '__ko.optionValueDomData__';

                ko.bindingHandlers['selectedOptions'] = {
                    getSelectedValuesFromSelectNode: function(selectNode) {
                        var result = [];
                        var nodes = selectNode.childNodes;
                        for (var i = 0, j = nodes.length; i < j; i++) {
                            var node = nodes[i],
                                tagName = ko.utils.tagNameLower(node);
                            if (tagName == "option" && node.selected) result.push(ko.selectExtensions.readValue(node));
                            else if (tagName == "optgroup") {
                                var selectedValuesFromOptGroup = ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(node);
                                Array.prototype.splice.apply(result, [result.length, 0].concat(selectedValuesFromOptGroup)); // Add new entries to existing 'result' instance
                            }
                        }
                        return result;
                    },
                    'init': function(element, valueAccessor, allBindingsAccessor) {
                        ko.utils.registerEventHandler(element, "change", function() {
                            var value = valueAccessor();
                            var valueToWrite = ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(this);
                            ko.jsonExpressionRewriting.writeValueToProperty(value, allBindingsAccessor, 'value', valueToWrite);
                        });
                    },
                    'update': function(element, valueAccessor) {
                        if (ko.utils.tagNameLower(element) != "select") throw new Error("values binding applies only to SELECT elements");

                        var newValue = ko.utils.unwrapObservable(valueAccessor());
                        if (newValue && typeof newValue.length == "number") {
                            var nodes = element.childNodes;
                            for (var i = 0, j = nodes.length; i < j; i++) {
                                var node = nodes[i];
                                if (ko.utils.tagNameLower(node) === "option") ko.utils.setOptionNodeSelectionState(node, ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0);
                            }
                        }
                    }
                };

                ko.bindingHandlers['text'] = {
                    'update': function(element, valueAccessor) {
                        ko.utils.setTextContent(element, valueAccessor());
                    }
                };

                ko.bindingHandlers['html'] = {
                    'init': function() {
                        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
                        return {
                            'controlsDescendantBindings': true
                        };
                    },
                    'update': function(element, valueAccessor) {
                        var value = ko.utils.unwrapObservable(valueAccessor());
                        ko.utils.setHtml(element, value);
                    }
                };

                ko.bindingHandlers['css'] = {
                    'update': function(element, valueAccessor) {
                        var value = ko.utils.unwrapObservable(valueAccessor() || {});
                        for (var className in value) {
                            if (typeof className == "string") {
                                var shouldHaveClass = ko.utils.unwrapObservable(value[className]);
                                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
                            }
                        }
                    }
                };

                ko.bindingHandlers['style'] = {
                    'update': function(element, valueAccessor) {
                        var value = ko.utils.unwrapObservable(valueAccessor() || {});
                        for (var styleName in value) {
                            if (typeof styleName == "string") {
                                var styleValue = ko.utils.unwrapObservable(value[styleName]);
                                element.style[styleName] = styleValue || ""; // Empty string removes the value, whereas null/undefined have no effect
                            }
                        }
                    }
                };

                ko.bindingHandlers['uniqueName'] = {
                    'init': function(element, valueAccessor) {
                        if (valueAccessor()) {
                            element.name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);

                            // Workaround IE 6/7 issue
                            // - https://github.com/SteveSanderson/knockout/issues/197
                            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
                            if (ko.utils.isIe6 || ko.utils.isIe7) element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
                        }
                    }
                };
                ko.bindingHandlers['uniqueName'].currentIndex = 0;

                ko.bindingHandlers['checked'] = {
                    'init': function(element, valueAccessor, allBindingsAccessor) {
                        var updateHandler = function() {
                                var valueToWrite;
                                if (element.type == "checkbox") {
                                    valueToWrite = element.checked;
                                } else if ((element.type == "radio") && (element.checked)) {
                                    valueToWrite = element.value;
                                } else {
                                    return; // "checked" binding only responds to checkboxes and selected radio buttons
                                }

                                var modelValue = valueAccessor();
                                if ((element.type == "checkbox") && (ko.utils.unwrapObservable(modelValue) instanceof Array)) {
                                    // For checkboxes bound to an array, we add/remove the checkbox value to that array
                                    // This works for both observable and non-observable arrays
                                    var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.unwrapObservable(modelValue), element.value);
                                    if (element.checked && (existingEntryIndex < 0)) modelValue.push(element.value);
                                    else if ((!element.checked) && (existingEntryIndex >= 0)) modelValue.splice(existingEntryIndex, 1);
                                } else {
                                    ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'checked', valueToWrite, true);
                                }
                            };
                        ko.utils.registerEventHandler(element, "click", updateHandler);

                        // IE 6 won't allow radio buttons to be selected unless they have a name
                        if ((element.type == "radio") && !element.name) ko.bindingHandlers['uniqueName']['init'](element, function() {
                            return true
                        });
                    },
                    'update': function(element, valueAccessor) {
                        var value = ko.utils.unwrapObservable(valueAccessor());

                        if (element.type == "checkbox") {
                            if (value instanceof Array) {
                                // When bound to an array, the checkbox being checked represents its value being present in that array
                                element.checked = ko.utils.arrayIndexOf(value, element.value) >= 0;
                            } else {
                                // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                                element.checked = value;
                            }
                        } else if (element.type == "radio") {
                            element.checked = (element.value == value);
                        }
                    }
                };

                var attrHtmlToJavascriptMap = {
                    'class': 'className',
                    'for': 'htmlFor'
                };
                ko.bindingHandlers['attr'] = {
                    'update': function(element, valueAccessor, allBindingsAccessor) {
                        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
                        for (var attrName in value) {
                            if (typeof attrName == "string") {
                                var attrValue = ko.utils.unwrapObservable(value[attrName]);

                                // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
                                // when someProp is a "no value"-like value (strictly null, false, or undefined)
                                // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
                                var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
                                if (toRemove) element.removeAttribute(attrName);

                                // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
                                // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
                                // but instead of figuring out the mode, we'll just set the attribute through the Javascript
                                // property for IE <= 8.
                                if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                                    attrName = attrHtmlToJavascriptMap[attrName];
                                    if (toRemove) element.removeAttribute(attrName);
                                    else element[attrName] = attrValue;
                                } else if (!toRemove) {
                                    element.setAttribute(attrName, attrValue.toString());
                                }
                            }
                        }
                    }
                };

                ko.bindingHandlers['hasfocus'] = {
                    'init': function(element, valueAccessor, allBindingsAccessor) {
                        var writeValue = function(valueToWrite) {
                                var modelValue = valueAccessor();
                                ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'hasfocus', valueToWrite, true);
                            };
                        ko.utils.registerEventHandler(element, "focus", function() {
                            writeValue(true)
                        });
                        ko.utils.registerEventHandler(element, "focusin", function() {
                            writeValue(true)
                        }); // For IE
                        ko.utils.registerEventHandler(element, "blur", function() {
                            writeValue(false)
                        });
                        ko.utils.registerEventHandler(element, "focusout", function() {
                            writeValue(false)
                        }); // For IE
                    },
                    'update': function(element, valueAccessor) {
                        var value = ko.utils.unwrapObservable(valueAccessor());
                        value ? element.focus() : element.blur();
                        ko.utils.triggerEvent(element, value ? "focusin" : "focusout"); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
                    }
                };

                // "with: someExpression" is equivalent to "template: { if: someExpression, data: someExpression }"
                ko.bindingHandlers['with'] = {
                    makeTemplateValueAccessor: function(valueAccessor) {
                        return function() {
                            var value = valueAccessor();
                            return {
                                'if': value,
                                'data': value,
                                'templateEngine': ko.nativeTemplateEngine.instance
                            }
                        };
                    },
                    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor));
                    },
                    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
                    }
                };
                ko.jsonExpressionRewriting.bindingRewriteValidators['with'] = false; // Can't rewrite control flow bindings
                ko.virtualElements.allowedBindings['with'] = true;

                // "if: someExpression" is equivalent to "template: { if: someExpression }"
                ko.bindingHandlers['if'] = {
                    makeTemplateValueAccessor: function(valueAccessor) {
                        return function() {
                            return {
                                'if': valueAccessor(),
                                'templateEngine': ko.nativeTemplateEngine.instance
                            }
                        };
                    },
                    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor));
                    },
                    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
                    }
                };
                ko.jsonExpressionRewriting.bindingRewriteValidators['if'] = false; // Can't rewrite control flow bindings
                ko.virtualElements.allowedBindings['if'] = true;

                // "ifnot: someExpression" is equivalent to "template: { ifnot: someExpression }"
                ko.bindingHandlers['ifnot'] = {
                    makeTemplateValueAccessor: function(valueAccessor) {
                        return function() {
                            return {
                                'ifnot': valueAccessor(),
                                'templateEngine': ko.nativeTemplateEngine.instance
                            }
                        };
                    },
                    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor));
                    },
                    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
                    }
                };
                ko.jsonExpressionRewriting.bindingRewriteValidators['ifnot'] = false; // Can't rewrite control flow bindings
                ko.virtualElements.allowedBindings['ifnot'] = true;

                // "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
                // "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
                ko.bindingHandlers['foreach'] = {
                    makeTemplateValueAccessor: function(valueAccessor) {
                        return function() {
                            var bindingValue = ko.utils.unwrapObservable(valueAccessor());

                            // If bindingValue is the array, just pass it on its own
                            if ((!bindingValue) || typeof bindingValue.length == "number") return {
                                'foreach': bindingValue,
                                'templateEngine': ko.nativeTemplateEngine.instance
                            };

                            // If bindingValue.data is the array, preserve all relevant options
                            return {
                                'foreach': bindingValue['data'],
                                'includeDestroyed': bindingValue['includeDestroyed'],
                                'afterAdd': bindingValue['afterAdd'],
                                'beforeRemove': bindingValue['beforeRemove'],
                                'afterRender': bindingValue['afterRender'],
                                'templateEngine': ko.nativeTemplateEngine.instance
                            };
                        };
                    },
                    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
                    },
                    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
                    }
                };
                ko.jsonExpressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
                ko.virtualElements.allowedBindings['foreach'] = true;
                // If you want to make a custom template engine,
                //
                // [1] Inherit from this class (like ko.nativeTemplateEngine does)
                // [2] Override 'renderTemplateSource', supplying a function with this signature:
                //
                //        function (templateSource, bindingContext, options) {
                //            // - templateSource.text() is the text of the template you should render
                //            // - bindingContext.$data is the data you should pass into the template
                //            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
                //            //     and bindingContext.$root available in the template too
                //            // - options gives you access to any other properties set on "data-bind: { template: options }"
                //            //
                //            // Return value: an array of DOM nodes
                //        }
                //
                // [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
                //
                //        function (script) {
                //            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
                //            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
                //        }
                //
                //     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
                //     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
                //     and then you don't need to override 'createJavaScriptEvaluatorBlock'.
                ko.templateEngine = function() {};

                ko.templateEngine.prototype['renderTemplateSource'] = function(templateSource, bindingContext, options) {
                    throw new Error("Override renderTemplateSource");
                };

                ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function(script) {
                    throw new Error("Override createJavaScriptEvaluatorBlock");
                };

                ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
                    // Named template
                    if (typeof template == "string") {
                        templateDocument = templateDocument || document;
                        var elem = templateDocument.getElementById(template);
                        if (!elem) throw new Error("Cannot find template with ID " + template);
                        return new ko.templateSources.domElement(elem);
                    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
                        // Anonymous template
                        return new ko.templateSources.anonymousTemplate(template);
                    } else throw new Error("Unknown template type: " + template);
                };

                ko.templateEngine.prototype['renderTemplate'] = function(template, bindingContext, options, templateDocument) {
                    var templateSource = this['makeTemplateSource'](template, templateDocument);
                    return this['renderTemplateSource'](templateSource, bindingContext, options);
                };

                ko.templateEngine.prototype['isTemplateRewritten'] = function(template, templateDocument) {
                    // Skip rewriting if requested
                    if (this['allowTemplateRewriting'] === false) return true;

                    // Perf optimisation - see below
                    var templateIsInExternalDocument = templateDocument && templateDocument != document;
                    if (!templateIsInExternalDocument && this.knownRewrittenTemplates && this.knownRewrittenTemplates[template]) return true;

                    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
                };

                ko.templateEngine.prototype['rewriteTemplate'] = function(template, rewriterCallback, templateDocument) {
                    var templateSource = this['makeTemplateSource'](template, templateDocument);
                    var rewritten = rewriterCallback(templateSource['text']());
                    templateSource['text'](rewritten);
                    templateSource['data']("isRewritten", true);

                    // Perf optimisation - for named templates, track which ones have been rewritten so we can
                    // answer 'isTemplateRewritten' *without* having to use getElementById (which is slow on IE < 8)
                    //
                    // Note that we only cache the status for templates in the main document, because caching on a per-doc
                    // basis complicates the implementation excessively. In a future version of KO, we will likely remove
                    // this 'isRewritten' cache entirely anyway, because the benefit is extremely minor and only applies
                    // to rewritable templates, which are pretty much deprecated since KO 2.0.
                    var templateIsInExternalDocument = templateDocument && templateDocument != document;
                    if (!templateIsInExternalDocument && typeof template == "string") {
                        this.knownRewrittenTemplates = this.knownRewrittenTemplates || {};
                        this.knownRewrittenTemplates[template] = true;
                    }
                };

                ko.exportSymbol('templateEngine', ko.templateEngine);

                ko.templateRewriting = (function() {
                    var memoizeDataBindingAttributeSyntaxRegex = /(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi;
                    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

                    function validateDataBindValuesForRewriting(keyValueArray) {
                        var allValidators = ko.jsonExpressionRewriting.bindingRewriteValidators;
                        for (var i = 0; i < keyValueArray.length; i++) {
                            var key = keyValueArray[i]['key'];
                            if (allValidators.hasOwnProperty(key)) {
                                var validator = allValidators[key];

                                if (typeof validator === "function") {
                                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                                    if (possibleErrorMessage) throw new Error(possibleErrorMessage);
                                } else if (!validator) {
                                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                                }
                            }
                        }
                    }

                    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, templateEngine) {
                        var dataBindKeyValueArray = ko.jsonExpressionRewriting.parseObjectLiteral(dataBindAttributeValue);
                        validateDataBindValuesForRewriting(dataBindKeyValueArray);
                        var rewrittenDataBindAttributeValue = ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(dataBindKeyValueArray);

                        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
                        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
                        // extra indirection.
                        var applyBindingsToNextSiblingScript = "ko.templateRewriting.applyMemoizedBindingsToNextSibling(function() { \
            return (function() { return { " + rewrittenDataBindAttributeValue + " } })() \
        })";
                        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
                    }

                    return {
                        ensureTemplateIsRewritten: function(template, templateEngine, templateDocument) {
                            if (!templateEngine['isTemplateRewritten'](template, templateDocument)) templateEngine['rewriteTemplate'](template, function(htmlString) {
                                return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                            }, templateDocument);
                        },

                        memoizeBindingAttributeSyntax: function(htmlString, templateEngine) {
                            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function() {
                                return constructMemoizedTagReplacement( /* dataBindAttributeValue: */ arguments[6], /* tagToRetain: */ arguments[1], templateEngine);
                            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                                return constructMemoizedTagReplacement( /* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", templateEngine);
                            });
                        },

                        applyMemoizedBindingsToNextSibling: function(bindings) {
                            return ko.memoization.memoize(function(domNode, bindingContext) {
                                if (domNode.nextSibling) ko.applyBindingsToNode(domNode.nextSibling, bindings, bindingContext);
                            });
                        }
                    }
                })();

                ko.exportSymbol('templateRewriting', ko.templateRewriting);
                ko.exportSymbol('templateRewriting.applyMemoizedBindingsToNextSibling', ko.templateRewriting.applyMemoizedBindingsToNextSibling); // Exported only because it has to be referenced by string lookup from within rewritten template
                (function() {
                    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
                    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
                    //
                    // Two are provided by default:
                    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
                    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
                    //                                           without reading/writing the actual element text content, since it will be overwritten
                    //                                           with the rendered template output.
                    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
                    // Template sources need to have the following functions:
                    //   text()             - returns the template text from your storage location
                    //   text(value)        - writes the supplied template text to your storage location
                    //   data(key)          - reads values stored using data(key, value) - see below
                    //   data(key, value)   - associates "value" with this template and the key "key". Is used to store information like "isRewritten".
                    //
                    // Optionally, template sources can also have the following functions:
                    //   nodes()            - returns a DOM element containing the nodes of this template, where available
                    //   nodes(value)       - writes the given DOM element to your storage location
                    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
                    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
                    //
                    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
                    // using and overriding "makeTemplateSource" to return an instance of your custom template source.
                    ko.templateSources = {};

                    // ---- ko.templateSources.domElement -----
                    ko.templateSources.domElement = function(element) {
                        this.domElement = element;
                    }

                    ko.templateSources.domElement.prototype['text'] = function( /* valueToWrite */ ) {
                        var tagNameLower = ko.utils.tagNameLower(this.domElement),
                            elemContentsProperty = tagNameLower === "script" ? "text" : tagNameLower === "textarea" ? "value" : "innerHTML";

                        if (arguments.length == 0) {
                            return this.domElement[elemContentsProperty];
                        } else {
                            var valueToWrite = arguments[0];
                            if (elemContentsProperty === "innerHTML") ko.utils.setHtml(this.domElement, valueToWrite);
                            else this.domElement[elemContentsProperty] = valueToWrite;
                        }
                    };

                    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */ ) {
                        if (arguments.length === 1) {
                            return ko.utils.domData.get(this.domElement, "templateSourceData_" + key);
                        } else {
                            ko.utils.domData.set(this.domElement, "templateSourceData_" + key, arguments[1]);
                        }
                    };

                    // ---- ko.templateSources.anonymousTemplate -----
                    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
                    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
                    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.
                    var anonymousTemplatesDomDataKey = "__ko_anon_template__";
                    ko.templateSources.anonymousTemplate = function(element) {
                        this.domElement = element;
                    }
                    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
                    ko.templateSources.anonymousTemplate.prototype['text'] = function( /* valueToWrite */ ) {
                        if (arguments.length == 0) {
                            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
                            if (templateData.textData === undefined && templateData.containerData) templateData.textData = templateData.containerData.innerHTML;
                            return templateData.textData;
                        } else {
                            var valueToWrite = arguments[0];
                            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {
                                textData: valueToWrite
                            });
                        }
                    };
                    ko.templateSources.domElement.prototype['nodes'] = function( /* valueToWrite */ ) {
                        if (arguments.length == 0) {
                            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
                            return templateData.containerData;
                        } else {
                            var valueToWrite = arguments[0];
                            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {
                                containerData: valueToWrite
                            });
                        }
                    };

                    ko.exportSymbol('templateSources', ko.templateSources);
                    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
                    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
                })();
                (function() {
                    var _templateEngine;
                    ko.setTemplateEngine = function(templateEngine) {
                        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine)) throw new Error("templateEngine must inherit from ko.templateEngine");
                        _templateEngine = templateEngine;
                    }

                    function invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, action) {
                        var node, nextInQueue = firstNode,
                            firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
                        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
                            nextInQueue = ko.virtualElements.nextSibling(node);
                            if (node.nodeType === 1 || node.nodeType === 8) action(node);
                        }
                    }

                    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
                        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
                        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
                        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
                        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
                        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)
                        if (continuousNodeArray.length) {
                            var firstNode = continuousNodeArray[0],
                                lastNode = continuousNodeArray[continuousNodeArray.length - 1];

                            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
                            // whereas a regular applyBindings won't introduce new memoized nodes
                            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                                ko.applyBindings(bindingContext, node);
                            });
                            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                                ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
                            });
                        }
                    }

                    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
                        return nodeOrNodeArray.nodeType ? nodeOrNodeArray : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0] : null;
                    }

                    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
                        options = options || {};
                        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                        var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
                        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
                        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
                        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

                        // Loosely check result is an array of DOM nodes
                        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number")) throw new Error("Template engine must return an array of DOM nodes");

                        var haveAddedNodesToParent = false;
                        switch (renderMode) {
                        case "replaceChildren":
                            ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                            haveAddedNodesToParent = true;
                            break;
                        case "replaceNode":
                            ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                            haveAddedNodesToParent = true;
                            break;
                        case "ignoreTargetNode":
                            break;
                        default:
                            throw new Error("Unknown renderMode: " + renderMode);
                        }

                        if (haveAddedNodesToParent) {
                            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
                            if (options['afterRender']) options['afterRender'](renderedNodesArray, bindingContext['$data']);
                        }

                        return renderedNodesArray;
                    }

                    ko.renderTemplate = function(template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
                        options = options || {};
                        if ((options['templateEngine'] || _templateEngine) == undefined) throw new Error("Set a template engine before calling renderTemplate");
                        renderMode = renderMode || "replaceChildren";

                        if (targetNodeOrNodeArray) {
                            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

                            var whenToDispose = function() {
                                    return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode);
                                }; // Passive disposal (on next evaluation)
                            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

                            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes

                            function() {
                                // Ensure we've got a proper binding context to work with
                                var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext)) ? dataOrBindingContext : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

                                // Support selecting template as a function of the data being rendered
                                var templateName = typeof(template) == 'function' ? template(bindingContext['$data']) : template;

                                var renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
                                if (renderMode == "replaceNode") {
                                    targetNodeOrNodeArray = renderedNodesArray;
                                    firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                                }
                            }, null, {
                                'disposeWhen': whenToDispose,
                                'disposeWhenNodeIsRemoved': activelyDisposeWhenNodeIsRemoved
                            });
                        } else {
                            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
                            return ko.memoization.memoize(function(domNode) {
                                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
                            });
                        }
                    };

                    ko.renderTemplateForEach = function(template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
                        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
                        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
                        var arrayItemContext;

                        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
                        var executeTemplateForArrayItem = function(arrayValue, index) {
                                // Support selecting template as a function of the data being rendered
                                var templateName = typeof(template) == 'function' ? template(arrayValue) : template;
                                arrayItemContext = parentBindingContext['createChildContext'](ko.utils.unwrapObservable(arrayValue));
                                arrayItemContext['$index'] = index;
                                return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
                            }

                            // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
                        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
                                activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
                                if (options['afterRender']) options['afterRender'](addedNodesArray, arrayValue);
                            };

                        return ko.dependentObservable(function() {
                            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
                            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                            unwrappedArray = [unwrappedArray];

                            // Filter out any entries marked as destroyed
                            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
                            });

                            ko.utils.setDomNodeChildrenFromArrayMapping(targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback);

                        }, null, {
                            'disposeWhenNodeIsRemoved': targetNode
                        });
                    };

                    var templateSubscriptionDomDataKey = '__ko__templateSubscriptionDomDataKey__';

                    function disposeOldSubscriptionAndStoreNewOne(element, newSubscription) {
                        var oldSubscription = ko.utils.domData.get(element, templateSubscriptionDomDataKey);
                        if (oldSubscription && (typeof(oldSubscription.dispose) == 'function')) oldSubscription.dispose();
                        ko.utils.domData.set(element, templateSubscriptionDomDataKey, newSubscription);
                    }

                    ko.bindingHandlers['template'] = {
                        'init': function(element, valueAccessor) {
                            // Support anonymous templates
                            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
                            if ((typeof bindingValue != "string") && (!bindingValue['name']) && (element.nodeType == 1 || element.nodeType == 8)) {
                                // It's an anonymous template - store the element contents, then clear the element
                                var templateNodes = element.nodeType == 1 ? element.childNodes : ko.virtualElements.childNodes(element),
                                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
                            }
                            return {
                                'controlsDescendantBindings': true
                            };
                        },
                        'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
                            var templateName;
                            var shouldDisplay = true;

                            if (typeof bindingValue == "string") {
                                templateName = bindingValue;
                            } else {
                                templateName = bindingValue['name'];

                                // Support "if"/"ifnot" conditions
                                if ('if' in bindingValue) shouldDisplay = shouldDisplay && ko.utils.unwrapObservable(bindingValue['if']);
                                if ('ifnot' in bindingValue) shouldDisplay = shouldDisplay && !ko.utils.unwrapObservable(bindingValue['ifnot']);
                            }

                            var templateSubscription = null;

                            if ((typeof bindingValue === 'object') && ('foreach' in bindingValue)) { // Note: can't use 'in' operator on strings
                                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                                var dataArray = (shouldDisplay && bindingValue['foreach']) || [];
                                templateSubscription = ko.renderTemplateForEach(templateName || element, dataArray, /* options: */ bindingValue, element, bindingContext);
                            } else {
                                if (shouldDisplay) {
                                    // Render once for this single data point (or use the viewModel if no data was provided)
                                    var innerBindingContext = (typeof bindingValue == 'object') && ('data' in bindingValue) ? bindingContext['createChildContext'](ko.utils.unwrapObservable(bindingValue['data'])) // Given an explitit 'data' value, we create a child binding context for it
                                    :
                                    bindingContext; // Given no explicit 'data' value, we retain the same binding context
                                    templateSubscription = ko.renderTemplate(templateName || element, innerBindingContext, /* options: */ bindingValue, element);
                                } else ko.virtualElements.emptyNode(element);
                            }

                            // It only makes sense to have a single template subscription per element (otherwise which one should have its output displayed?)
                            disposeOldSubscriptionAndStoreNewOne(element, templateSubscription);
                        }
                    };

                    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
                    ko.jsonExpressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
                        var parsedBindingValue = ko.jsonExpressionRewriting.parseObjectLiteral(bindingValue);

                        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown']) return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)
                        if (ko.jsonExpressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name")) return null; // Named templates can be rewritten, so return "no error"
                        return "This template engine does not support anonymous templates nested within its templates";
                    };

                    ko.virtualElements.allowedBindings['template'] = true;
                })();

                ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
                ko.exportSymbol('renderTemplate', ko.renderTemplate);

                (function() {
                    // Simple calculation based on Levenshtein distance.

                    function calculateEditDistanceMatrix(oldArray, newArray, maxAllowedDistance) {
                        var distances = [];
                        for (var i = 0; i <= newArray.length; i++)
                        distances[i] = [];

                        // Top row - transform old array into empty array via deletions
                        for (var i = 0, j = Math.min(oldArray.length, maxAllowedDistance); i <= j; i++)
                        distances[0][i] = i;

                        // Left row - transform empty array into new array via additions
                        for (var i = 1, j = Math.min(newArray.length, maxAllowedDistance); i <= j; i++) {
                            distances[i][0] = i;
                        }

                        // Fill out the body of the array
                        var oldIndex, oldIndexMax = oldArray.length,
                            newIndex, newIndexMax = newArray.length;
                        var distanceViaAddition, distanceViaDeletion;
                        for (oldIndex = 1; oldIndex <= oldIndexMax; oldIndex++) {
                            var newIndexMinForRow = Math.max(1, oldIndex - maxAllowedDistance);
                            var newIndexMaxForRow = Math.min(newIndexMax, oldIndex + maxAllowedDistance);
                            for (newIndex = newIndexMinForRow; newIndex <= newIndexMaxForRow; newIndex++) {
                                if (oldArray[oldIndex - 1] === newArray[newIndex - 1]) distances[newIndex][oldIndex] = distances[newIndex - 1][oldIndex - 1];
                                else {
                                    var northDistance = distances[newIndex - 1][oldIndex] === undefined ? Number.MAX_VALUE : distances[newIndex - 1][oldIndex] + 1;
                                    var westDistance = distances[newIndex][oldIndex - 1] === undefined ? Number.MAX_VALUE : distances[newIndex][oldIndex - 1] + 1;
                                    distances[newIndex][oldIndex] = Math.min(northDistance, westDistance);
                                }
                            }
                        }

                        return distances;
                    }

                    function findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray) {
                        var oldIndex = oldArray.length;
                        var newIndex = newArray.length;
                        var editScript = [];
                        var maxDistance = editDistanceMatrix[newIndex][oldIndex];
                        if (maxDistance === undefined) return null; // maxAllowedDistance must be too small
                        while ((oldIndex > 0) || (newIndex > 0)) {
                            var me = editDistanceMatrix[newIndex][oldIndex];
                            var distanceViaAdd = (newIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex] : maxDistance + 1;
                            var distanceViaDelete = (oldIndex > 0) ? editDistanceMatrix[newIndex][oldIndex - 1] : maxDistance + 1;
                            var distanceViaRetain = (newIndex > 0) && (oldIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex - 1] : maxDistance + 1;
                            if ((distanceViaAdd === undefined) || (distanceViaAdd < me - 1)) distanceViaAdd = maxDistance + 1;
                            if ((distanceViaDelete === undefined) || (distanceViaDelete < me - 1)) distanceViaDelete = maxDistance + 1;
                            if (distanceViaRetain < me - 1) distanceViaRetain = maxDistance + 1;

                            if ((distanceViaAdd <= distanceViaDelete) && (distanceViaAdd < distanceViaRetain)) {
                                editScript.push({
                                    status: "added",
                                    value: newArray[newIndex - 1]
                                });
                                newIndex--;
                            } else if ((distanceViaDelete < distanceViaAdd) && (distanceViaDelete < distanceViaRetain)) {
                                editScript.push({
                                    status: "deleted",
                                    value: oldArray[oldIndex - 1]
                                });
                                oldIndex--;
                            } else {
                                editScript.push({
                                    status: "retained",
                                    value: oldArray[oldIndex - 1]
                                });
                                newIndex--;
                                oldIndex--;
                            }
                        }
                        return editScript.reverse();
                    }

                    ko.utils.compareArrays = function(oldArray, newArray, maxEditsToConsider) {
                        if (maxEditsToConsider === undefined) {
                            return ko.utils.compareArrays(oldArray, newArray, 1) // First consider likely case where there is at most one edit (very fast)
                            ||
                            ko.utils.compareArrays(oldArray, newArray, 10) // If that fails, account for a fair number of changes while still being fast
                            ||
                            ko.utils.compareArrays(oldArray, newArray, Number.MAX_VALUE); // Ultimately give the right answer, even though it may take a long time
                        } else {
                            oldArray = oldArray || [];
                            newArray = newArray || [];
                            var editDistanceMatrix = calculateEditDistanceMatrix(oldArray, newArray, maxEditsToConsider);
                            return findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray);
                        }
                    };
                })();

                ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);

                (function() {
                    // Objective:
                    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
                    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
                    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
                    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
                    //   previously mapped - retain those nodes, and just insert/delete other ones
                    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
                    // You can use this, for example, to activate bindings on those nodes.

                    function fixUpVirtualElements(contiguousNodeArray) {
                        // Ensures that contiguousNodeArray really *is* an array of contiguous siblings, even if some of the interior
                        // ones have changed since your array was first built (e.g., because your array contains virtual elements, and
                        // their virtual children changed when binding was applied to them).
                        // This is needed so that we can reliably remove or update the nodes corresponding to a given array item
                        if (contiguousNodeArray.length > 2) {
                            // Build up the actual new contiguous node set
                            var current = contiguousNodeArray[0],
                                last = contiguousNodeArray[contiguousNodeArray.length - 1],
                                newContiguousSet = [current];
                            while (current !== last) {
                                current = current.nextSibling;
                                if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                                return;
                                newContiguousSet.push(current);
                            }

                            // ... then mutate the input array to match this.
                            // (The following line replaces the contents of contiguousNodeArray with newContiguousSet)
                            Array.prototype.splice.apply(contiguousNodeArray, [0, contiguousNodeArray.length].concat(newContiguousSet));
                        }
                    }

                    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
                        // Map this array value inside a dependentObservable so we re-map when any dependency changes
                        var mappedNodes = [];
                        var dependentObservable = ko.dependentObservable(function() {
                            var newMappedNodes = mapping(valueToMap, index) || [];

                            // On subsequent evaluations, just replace the previously-inserted DOM nodes
                            if (mappedNodes.length > 0) {
                                fixUpVirtualElements(mappedNodes);
                                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                                if (callbackAfterAddingNodes) callbackAfterAddingNodes(valueToMap, newMappedNodes);
                            }

                            // Replace the contents of the mappedNodes array, thereby updating the record
                            // of which nodes would be deleted if valueToMap was itself later removed
                            mappedNodes.splice(0, mappedNodes.length);
                            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
                        }, null, {
                            'disposeWhenNodeIsRemoved': containerNode,
                            'disposeWhen': function() {
                                return (mappedNodes.length == 0) || !ko.utils.domNodeIsAttachedToDocument(mappedNodes[0])
                            }
                        });
                        return {
                            mappedNodes: mappedNodes,
                            dependentObservable: dependentObservable
                        };
                    }

                    var lastMappingResultDomDataKey = "setDomNodeChildrenFromArrayMapping_lastMappingResult";

                    ko.utils.setDomNodeChildrenFromArrayMapping = function(domNode, array, mapping, options, callbackAfterAddingNodes) {
                        // Compare the provided array against the previous one
                        array = array || [];
                        options = options || {};
                        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
                        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
                        var lastArray = ko.utils.arrayMap(lastMappingResult, function(x) {
                            return x.arrayEntry;
                        });
                        var editScript = ko.utils.compareArrays(lastArray, array);

                        // Build the new mapping result
                        var newMappingResult = [];
                        var lastMappingResultIndex = 0;
                        var nodesToDelete = [];
                        var newMappingResultIndex = 0;
                        var nodesAdded = [];
                        var insertAfterNode = null;
                        for (var i = 0, j = editScript.length; i < j; i++) {
                            switch (editScript[i].status) {
                            case "retained":
                                // Just keep the information - don't touch the nodes
                                var dataToRetain = lastMappingResult[lastMappingResultIndex];
                                dataToRetain.indexObservable(newMappingResultIndex);
                                newMappingResultIndex = newMappingResult.push(dataToRetain);
                                if (dataToRetain.domNodes.length > 0) insertAfterNode = dataToRetain.domNodes[dataToRetain.domNodes.length - 1];
                                lastMappingResultIndex++;
                                break;

                            case "deleted":
                                // Stop tracking changes to the mapping for these nodes
                                lastMappingResult[lastMappingResultIndex].dependentObservable.dispose();

                                // Queue these nodes for later removal
                                fixUpVirtualElements(lastMappingResult[lastMappingResultIndex].domNodes);
                                ko.utils.arrayForEach(lastMappingResult[lastMappingResultIndex].domNodes, function(node) {
                                    nodesToDelete.push({
                                        element: node,
                                        index: i,
                                        value: editScript[i].value
                                    });
                                    insertAfterNode = node;
                                });
                                lastMappingResultIndex++;
                                break;

                            case "added":
                                var valueToMap = editScript[i].value;
                                var indexObservable = ko.observable(newMappingResultIndex);
                                var mapData = mapNodeAndRefreshWhenChanged(domNode, mapping, valueToMap, callbackAfterAddingNodes, indexObservable);
                                var mappedNodes = mapData.mappedNodes;

                                // On the first evaluation, insert the nodes at the current insertion point
                                newMappingResultIndex = newMappingResult.push({
                                    arrayEntry: editScript[i].value,
                                    domNodes: mappedNodes,
                                    dependentObservable: mapData.dependentObservable,
                                    indexObservable: indexObservable
                                });
                                for (var nodeIndex = 0, nodeIndexMax = mappedNodes.length; nodeIndex < nodeIndexMax; nodeIndex++) {
                                    var node = mappedNodes[nodeIndex];
                                    nodesAdded.push({
                                        element: node,
                                        index: i,
                                        value: editScript[i].value
                                    });
                                    if (insertAfterNode == null) {
                                        // Insert "node" (the newly-created node) as domNode's first child
                                        ko.virtualElements.prepend(domNode, node);
                                    } else {
                                        // Insert "node" into "domNode" immediately after "insertAfterNode"
                                        ko.virtualElements.insertAfter(domNode, node, insertAfterNode);
                                    }
                                    insertAfterNode = node;
                                }
                                if (callbackAfterAddingNodes) callbackAfterAddingNodes(valueToMap, mappedNodes, indexObservable);
                                break;
                            }
                        }

                        ko.utils.arrayForEach(nodesToDelete, function(node) {
                            ko.cleanNode(node.element)
                        });

                        var invokedBeforeRemoveCallback = false;
                        if (!isFirstExecution) {
                            if (options['afterAdd']) {
                                for (var i = 0; i < nodesAdded.length; i++)
                                options['afterAdd'](nodesAdded[i].element, nodesAdded[i].index, nodesAdded[i].value);
                            }
                            if (options['beforeRemove']) {
                                for (var i = 0; i < nodesToDelete.length; i++)
                                options['beforeRemove'](nodesToDelete[i].element, nodesToDelete[i].index, nodesToDelete[i].value);
                                invokedBeforeRemoveCallback = true;
                            }
                        }
                        if (!invokedBeforeRemoveCallback && nodesToDelete.length) {
                            for (var i = 0; i < nodesToDelete.length; i++) {
                                var element = nodesToDelete[i].element;
                                if (element.parentNode) element.parentNode.removeChild(element);
                            }
                        }

                        // Store a copy of the array items we just considered so we can difference it next time
                        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
                    }
                })();

                ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
                ko.nativeTemplateEngine = function() {
                    this['allowTemplateRewriting'] = false;
                }

                ko.nativeTemplateEngine.prototype = new ko.templateEngine();
                ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function(templateSource, bindingContext, options) {
                    var useNodesIfAvailable = !(ko.utils.ieVersion < 9),
                        // IE<9 cloneNode doesn't work properly
                        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
                        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

                    if (templateNodes) {
                        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
                    } else {
                        var templateText = templateSource['text']();
                        return ko.utils.parseHtmlFragment(templateText);
                    }
                };

                ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
                ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

                ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
                (function() {
                    ko.jqueryTmplTemplateEngine = function() {
                        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
                        // doesn't expose a version number, so we have to infer it.
                        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
                        // which KO internally refers to as version "2", so older versions are no longer detected.
                        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
                            if ((typeof(jQuery) == "undefined") || !(jQuery['tmpl'])) return 0;
                            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
                            try {
                                if (jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                                    return 2; // Final version of jquery.tmpl
                                }
                            } catch (ex) { /* Apparently not the version we were looking for */
                            }

                            return 1; // Any older version that we don't support
                        })();

                        function ensureHasReferencedJQueryTemplates() {
                            if (jQueryTmplVersion < 2) throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
                        }

                        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
                            return jQuery['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
                        }

                        this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
                            options = options || {};
                            ensureHasReferencedJQueryTemplates();

                            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
                            var precompiled = templateSource['data']('precompiled');
                            if (!precompiled) {
                                var templateText = templateSource['text']() || "";
                                // Wrap in "with($whatever.koBindingContext) { ... }"
                                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                                precompiled = jQuery['template'](null, templateText);
                                templateSource['data']('precompiled', precompiled);
                            }

                            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
                            var jQueryTemplateOptions = jQuery['extend']({
                                'koBindingContext': bindingContext
                            }, options['templateOptions']);

                            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
                            resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work
                            jQuery['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
                            return resultNodes;
                        };

                        this['createJavaScriptEvaluatorBlock'] = function(script) {
                            return "{{ko_code ((function() { return " + script + " })()) }}";
                        };

                        this['addTemplate'] = function(templateName, templateMarkup) {
                            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "</script>");
                        };

                        if (jQueryTmplVersion > 0) {
                            jQuery['tmpl']['tag']['ko_code'] = {
                                open: "__.push($1 || '');"
                            };
                            jQuery['tmpl']['tag']['ko_with'] = {
                                open: "with($1) {",
                                close: "} "
                            };
                        }
                    };

                    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();

                    // Use this one by default *only if jquery.tmpl is referenced*
                    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
                    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0) ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

                    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
                })();
            });
        })(window, document, navigator);
        

        /**
        *  @function {public} xRTML.Templating.? Set an object as observable
        *  @param {Object} obj Object to be observed
        */
        Templating.observable = function(obj){
            if (typeof(obj) === "object" && obj.constructor == Array)
                return _privateKo.observableArray(obj);
            
            if(typeof(obj) === "function")
                return _privateKo.computed(obj);

            return _privateKo.observable(obj);
        };

        /**
        *  @function {public} xRTML.Templating.? Add new binding.
        *  @param {Object} arg Structure with the binding attributes.
        *  @... {optional Object} viewModel
        *  @... {optional Object} node
        *  @... {optional Object} bindig
        */
        Templating.applyBindings = function(arg){            
            if (!arg.node) arg.node = window.document.body
    
            if (arg.binding) 
                _privateKo.applyBindingsToNode(arg.node, arg.binding, arg.viewModel);
            else
                _privateKo.applyBindings(arg.viewModel, arg.node);
        };
        
        /**
        *  @function {public} xRTML.Templating.? Inject a template script into the page.
        *  @param {Object} args The arguments to inject the template.
        *  @... {Object} target The selector of the DOM element where the script will be injected.
        *  @... {String} id The id of the template.
        *  @... {String} content The content of the template.
        */
        Templating.inject = function(args){
            var template = '<script id="'+args.id+'" type="text/html">';
                template+= args.content;
                template+= '</script>';

            if(typeof args.target == 'undefined' || args.target.toLowerCase() == "body" ) {
                // in order to prevent the body replacement we create a dummy div :X  ##### hammer hammer hammer hammer hammer #####
                var dummyDiv = document.createElement("div");
                dummyDiv.setAttribute("style","display:none;");
                document.body.appendChild(dummyDiv);
                _privateKo.utils.setHtml(dummyDiv, template);
            }else{
                var elm = xRTML.Sizzle(args.target)[0];
                _privateKo.utils.setHtml(elm, template);
            }
        };

        /**
        *  @function {public} xRTML.Templating.? Remove binding from node.
        *  @param {Object} node - HTML node
        */
        Templating.clearNode = function(node){
            _privateKo.cleanNode(node);
        };

        /**
        *  @property {public Object} xRTML.Templating.? The available binding handlers. Used to register custom bindings.
        */
        Templating.bindingHandlers = _privateKo.bindingHandlers;

    })(xRTML.Templating = xRTML.Templating || {});
    /**
    * @end
    */
})(window.xRTML = window.xRTML || {});
function guidGenerator() 
{
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

(function (xRTML, undefined) {
    (function (Metadata, undefined) {

        var Module = function(config)
        {
            var _self = this;
            var _name = config.name || '';
            var _namespace = config.namespace || '';
            var _description = config.description || '';
            var _properties = config.properties || undefined;
            var _methods = config.methods || undefined;
            var _events = config.events || undefined;
            var _classes = config.classes || undefined;
            var _modules = config.modules || undefined;

            this.Name = (function()
            {
                return _name;
            })();

            this.Namespace =  (function()
            {
                return _namespace;
            })();

            this.Description =  (function()
            {
                return _description;
            })();

            this.Properties =  (function()
            {
                return _properties;
            })();

            this.Methods =  (function()
            {
                return _methods;
            })();

            this.Events =  (function()
            {
                return _events;
            })();  

            this.Classes =  (function()
            {
                return _classes;
            })();

            this.Modules =  (function()
            {
                return _modules;
            })();   
        }

    	var Class = function(config)
    	{
            var _self = this;
    		var _name = config.name || '';
    		var _namespace = config.namespace || '';
    		var _base = config.base || undefined;
            var _subclasses = config.subclasses || undefined;
            var _constructors = config.constructors || undefined;
    		var _description = config.description || '';
    		var _properties = config.properties || undefined;
    		var _methods = config.methods || undefined;
    		var _events = config.events || undefined;

    		this.Name = (function()
    		{
    			return _name;
    		})();

    		this.Namespace =  (function()
    		{
    			return _namespace;
    		})();

    		this.Base =  (function()
    		{
    			return _base;
    		})();

            this.Subclasses =  (function()
            {
                return _subclasses;
            })();

    		this.Constructors =  (function()
    		{
    			return _constructors;
    		})();

    		this.Description =  (function()
    		{
    			return _description;
    		})();

    		this.Properties =  (function()
    		{
    			return _properties;
    		})();

    		this.Methods =  (function()
    		{
    			return _methods;
    		})();

    		this.Events =  (function()
    		{
    			return _events;
    		})();            

    		this.toString = function() {
	    		return (this.Namespace.length > 0 )? this.Namespace + '.' + this.Name : this.Name;
	    	}

            this.typeOf = config.typeOf || function() { return _self.toString(); }
    	}

    	var Property = function(config)
    	{
    		var _name = config.name || '';
    		var _description = config.description || '';
    		var _mandatory = config.mandatory || false;
    		var _type = config.type || undefined;

    		this.Name = (function()
    		{
    			return _name;
    		})();

    		this.Description = (function()
    		{
    			return _description;
    		})();

			this.Mandatory = (function()
    		{
    			return _mandatory;
    		})();

    		this.Type = (function()
    		{
    			return _type;
    		})();
    	}

    	var Method = function(config)
    	{
    		var _name = config.name || '';
    		var _description = config.description || '';
    		var _arguments = config.arguments || '';
    		var _return = config["return"] || undefined;
    		var _exceptions = config.exceptions || '';

    		this.Name = (function()
    		{
    			return _name;
    		})();

    		this.Description = (function()
    		{
    			return _description;
    		})();

    		this.Arguments = (function()
    		{
    			return _arguments;
    		})();

    		this.Return = (function()
    		{
    			return _return;
    		})();

    		this.Exceptions = (function()
    		{
    			return _exceptions;
    		})();
    	}

    	var Argument = function(config)
    	{
    		var _name = config.name || '';
    		var _description = config.description || '';
    		var _mandatory = config.mandatory || false;
    		var _type = config.type || undefined;

    		this.Name = (function()
    		{
    			return _name;
    		})();

    		this.Description = (function()
    		{
    			return _description;
    		})();

			this.Mandatory = (function()
    		{
    			return _mandatory;
    		})();

    		this.Type = (function()
    		{
    			return _type;
    		})();
    	}

        var Event = function(config)
        {
            var _name = config.name || '';
            var _handler = config.handler || undefined;

            this.Name = (function()
            {
                return _name;
            })();

            this.Handler = (function()
            {
                return _handler;
            })();
        }

        var Handler = function(config)
        {
            var _name = config.name || '';
            var _namespace = config.namespace || '';
            var _description = config.description || '';
            var _arguments = config.arguments || undefined;

            this.Name = (function()
            {
                return _name;
            })();

            this.Namespace = (function()
            {
                return _namespace;
            })();


            this.Description = (function()
            {
                return _description;
            })();

            this.Arguments = (function()
            {
                return _arguments;
            })();
        }

    	var _metadata = 
    	{
            'root': new Module(
                        {   
                            name: 'root',
                            classes: {
                                'String': new Class({ name: 'String', typeOf: function() { return "String"}}),
                                'Number': new Class({ name: 'String', typeOf: function() { return "Number"}}),
                                'Boolean': new Class({ name: 'String', typeOf: function() { return "Boolean"}}),
                                'Function': new Class({ name: 'String', typeOf: function() { return "Function"}}),
                                'Array': new Class({ name: 'String', typeOf: function() { return "Array"}}),
                                'Function': new Class({ name: 'String', typeOf: function() { return "Function"}}),
                                'Date': new Class({ name: 'String', typeOf: function() { return "Date"}}),
                                'Object': new Class({ name: 'String', typeOf: function() { return "Object"}}),
                                'RegExp': new Class({ name: 'String', typeOf: function() { return "RegExp"}}),
                                'Error': new Class({ name: 'String', typeOf: function() { return "Error"}})
                            },
                            modules: {                                
                                'xRTML': new Module(
                                            { 
                                                name: 'xRTML',
                                                modules: {
                                                    'Tags': new Module({name: 'Tags', classes: new Object()})
                                                }
                                            }
                                        ),
                                'Anonymous': new Module({name: 'Anonymous'})
                            }
                        }
                    )			
    	}

        var _unresolvedTypes = {}

        var addUnresolvedTypes = function(type,reference,propertyName)
        {
            if(!_unresolvedTypes[type]) _unresolvedTypes[type] = new Array();

            _unresolvedTypes[type].push({reference: reference, propertyName: propertyName});
        }

        Metadata.fixUnresolvedTypes = function()
        {
            for (var type in _unresolvedTypes) {
                var _type = getClassObject(type);

                if (_type)
                {
                    for (var i = 0; i < _unresolvedTypes[type].length; i++) {
                        _unresolvedTypes[type][i].reference[_unresolvedTypes[type][i].propertyName] = _type;
                    };

                    delete _unresolvedTypes[type];
                } 
            };          

            for (var type in _unresolvedTypes) {
                console.warn(type + ' -> ' + _unresolvedTypes[type].length);
            };          
        }

        var getModuleObject = function(namespace)
        {
            if(namespace == undefined || namespace.length == 0) return _metadata.root;

            var _namespace, _module, _separator = namespace.lastIndexOf('.');

            if (_separator === -1) {
                _module = namespace;              
            }
            else
            {
                _namespace = namespace.substring(0,_separator);
                _module = namespace.substring(_separator + 1);
            }

            var _moduleObj = _metadata.root;

            if (_namespace != undefined) {
                _moduleObj = getModuleObject(_namespace);
            }

            return _moduleObj.Modules[_module];
        }

        var getClassObject = function(namespace)
        {
            var _namespace, _class, _separator = namespace.lastIndexOf('.');

            if (_separator === -1) {
                _class = namespace;              
            }
            else
            {
                _namespace = namespace.substring(0,_separator);
                _class = namespace.substring(_separator + 1);
            }

            var _classObj = _metadata.root;

            if (_namespace != undefined) {
                _classObj = getModuleObject(_namespace);
            }

            return (_classObj)? _classObj.Classes[_class] : undefined;
        }

        Metadata.registerModule = function(config)
        {
            var _namespace, _module, _separator = config.name.lastIndexOf('.');

            if (_separator != -1) {
                config.namespace = config.name.substring(0,_separator);    
                config.name = config.name.substring(_separator + 1);            
            }

            //type
            var _type = new Module(
                {
                    name: config.name, 
                    namespace: config.namespace,
                    description: config.description
                }
            )

            var _module = getModuleObject(config.namespace);

            if (!_module.Modules) _module.Modules = {};

            _module.Modules[config.name] = _type;

            for (var i = 0; i < config.classes.length; i++) {
                this.registerClass(config.classes[i]);
            };

            //properties
            var _properties = {};

            for(var _propName in config.properties) {

                var _propType = undefined;

                if(config.properties[_propName].type instanceof String || typeof(config.properties[_propName].type) == 'string')    
                {
                    _propType = getClassObject(config.properties[_propName].type);
                }
                else
                {
                    _propType = this.registerClass(config.properties[_propName].type)
                }

                _properties[_propName] = new Property(
                    {
                        name: _propName, 
                        description: config.properties[_propName].description,
                        mandatory: config.properties[_propName].mandatory,
                        type: _propType                         
                    }
                );

                if (!_properties[_propName].Type)   addUnresolvedTypes(config.properties[_propName],_properties[_propName], 'Type');
            };

            //methods
            var _methods = {};

            for(var _methodName in config.methods) {

                var _arguments = {};

                for(var _argName in config.methods[_methodName].arguments) {

                    var _argType = undefined;

                    if(config.methods[_methodName].arguments[_argName].type instanceof String || typeof(config.methods[_methodName].arguments[_argName].type) == 'string')  
                    {
                        _argType = getClassObject(config.methods[_methodName].arguments[_argName].type);
                    }
                    else
                    {
                        _argType = this.registerClass(config.methods[_methodName].arguments[_argName].type)
                    }

                    _arguments[_argName] = new Argument(
                        {
                            name: _argName,
                            description: config.methods[_methodName].arguments[_argName].description,
                            mandatory: config.methods[_methodName].arguments[_argName].mandatory,
                            type: _argType
                        }
                    );

                    if (!_arguments[_argName].Type)   addUnresolvedTypes(config.methods[_methodName].arguments[_argName],_arguments[_argName], 'Type');
                }

                var _exceptions = {};
                
                for (var i = 0; i < config.methods[_methodName].exceptions.length; i++) {

                    if(config.methods[_methodName].exceptions[i] instanceof String || typeof(config.methods[_methodName].exceptions[i]) == 'string')    
                    {
                        var _exception = getClassObject(config.methods[_methodName].exceptions[i]);                                            

                        if (_exception != undefined)
                            _exceptions[_exception.toString()] = _exception;
                        else
                            throw 'Type ' + config.methods[_methodName].exceptions[i] + ' is not defined'
                    }
                    else
                    {   var _exception = this.registerClass(config.methods[_methodName].exceptions[i]);
                        _exceptions[_exception.toString()] = _exception;
                    }                   
                };

                var _method = 
                {
                    name: _methodName,
                    description: config.methods[_methodName].description,
                    arguments: _arguments,
                    exceptions: _exceptions
                };

                if(config.methods[_methodName]["return"]){

                    if(config.methods[_methodName]["return"] instanceof String || typeof(config.methods[_methodName]["return"]) == 'string')    
                    {
                        _method["return"] = getClassObject(config.methods[_methodName]["return"]);
                    }
                    else
                    {
                        _method["return"] = this.registerClass(config.methods[_methodName]["return"])
                    }
                }

                _methods[_methodName] = new Method(_method);

                if (config.methods[_methodName]["return"] && !_methods[_methodName].Return) addUnresolvedTypes(config.methods[_methodName]["return"],_methods[_methodName],"Return")
            }

            //events
            var _events = {};

            for(var _eventName in config.events) {

                var _eventHandler = undefined;

                if(config.events[_eventName].type instanceof String || typeof(config.events[_eventName].type) == 'string')    
                {
                    _eventHandler = getClassObject(config.events[_eventName].handler);
                }
                else
                {
                    _eventHandler = this.registerHandler(config.events[_eventName].handler)
                }

                _events[_eventName] = new Event(
                        {
                            name: _eventName,
                            description: config.events[_eventName].description,
                            handler: _eventHandler
                        }
                    );
            }            

            _type.Properties = _properties;
            _type.Methods = _methods;
            _type.Events = _events;

            return _type;
        }

        Metadata.registerClass = function(config) 
        {

            //Anonymous
            if (config.name == undefined) 
                config.name = guidGenerator();
            if (config.namespace == undefined) 
                config.namespace = 'Anonymous';

            //base type
            var _base = undefined;

            if (config["extends"]) {
                _base = getClassObject(config["extends"]);
            }
            
            var populateObject = function(obj) {
                var _ret = {};

                for (var _prop in obj) {
                    _ret[_prop] = obj[_prop];
                };

                return _ret;
            }

            //properties
            var _properties = (_base)? populateObject(_base.Properties) : {};

            for(var _propName in config.properties) {

                var _propType = undefined;

                if(config.properties[_propName].type instanceof String || typeof(config.properties[_propName].type) == 'string')    
                {
                    _propType = getClassObject(config.properties[_propName].type);
                }
                else
                {
                    _propType = this.registerClass(config.properties[_propName].type)
                }                

                _properties[_propName] = new Property(
                        {
                            name: _propName, 
                            description: config.properties[_propName].description,
                            mandatory: config.properties[_propName].mandatory,
                            type: _propType                         
                        }
                    );

                if (!_properties[_propName].Type)   addUnresolvedTypes(config.properties[_propName].type,_properties[_propName],'Type');
            };           //constructors
            var _constructors = (_base)? populateObject(_base.constructors) : {};

            for(var _methodName in config.constructors) {

                var _arguments = {};

                for(var _argName in config.constructors[_methodName].arguments) {

                    var _argType = undefined;

                    if(config.constructors[_methodName].arguments[_argName].type instanceof String || typeof(config.constructors[_methodName].arguments[_argName].type) == 'string')  
                    {
                        _argType = getClassObject(config.constructors[_methodName].arguments[_argName].type);
                    }
                    else
                    {
                        _argType = this.registerClass(config.constructors[_methodName].arguments[_argName].type)
                    }

                    _arguments[_argName] = new Argument(
                            {
                                name: _argName,
                                description: config.constructors[_methodName].arguments[_argName].description,
                                mandatory: config.constructors[_methodName].arguments[_argName].mandatory,
                                type: _argType
                            }
                        );

                    if (!_arguments[_argName].Type) addUnresolvedTypes(config.constructors[_methodName].arguments[_argName].type,_arguments[_argName],'Type');
                }

                var _exceptions = {};
                
                for (var i = 0; i < config.constructors[_methodName].exceptions.length; i++) {

                    if(config.constructors[_methodName].exceptions[i] instanceof String || typeof(config.constructors[_methodName].exceptions[i]) == 'string')    
                    {
                        var _exception = getClassObject(config.constructors[_methodName].exceptions[i]);
                        _exceptions[_exception.toString()] = _exception;
                        if (!_exceptions[_exception.toString()])    addUnresolvedTypes(config.constructors[_methodName].exceptions[i],_exceptions,_exception.toString());
                    }
                    else
                    {   var _exception = this.registerClass(config.constructors[_methodName].exceptions[i]);
                        _exceptions[_exception.toString()] = _exception;
                    }                   
                };

                var _method = 
                {
                    name: _methodName,
                    description: config.constructors[_methodName].description,
                    arguments: _arguments,
                    exceptions: _exceptions
                };

                if(config.constructors[_methodName]["return"]){

                    if(config.constructors[_methodName]["return"] instanceof String || typeof(config.constructors[_methodName]["return"]) == 'string')    
                    {
                        _method["return"] = getClassObject(config.constructors[_methodName]["return"]);
                    }
                    else
                    {
                        _method["return"] = this.registerClass(config.constructors[_methodName]["return"])
                    }
                }

                _constructors[_methodName] = new Method(_method);

                if (config.constructors[_methodName]["return"] && !_constructors[_methodName].Return) addUnresolvedTypes(config.constructors[_methodName]["return"],_constructors[_methodName],'Return');
            }

            //methods
            var _methods = (_base)? populateObject(_base.Methods) : {};

            for(var _methodName in config.methods) {

                var _arguments = {};

                for(var _argName in config.methods[_methodName].arguments) {

                    var _argType = undefined;

                    if(config.methods[_methodName].arguments[_argName].type instanceof String || typeof(config.methods[_methodName].arguments[_argName].type) == 'string')  
                    {
                        _argType = getClassObject(config.methods[_methodName].arguments[_argName].type);
                    }
                    else
                    {
                        _argType = this.registerClass(config.methods[_methodName].arguments[_argName].type)
                    }

                    _arguments[_argName] = new Argument(
                            {
                                name: _argName,
                                description: config.methods[_methodName].arguments[_argName].description,
                                mandatory: config.methods[_methodName].arguments[_argName].mandatory,
                                type: _argType
                            }
                        );

                    if (!_arguments[_argName].Type) addUnresolvedTypes(config.methods[_methodName].arguments[_argName].type,_arguments[_argName],'Type');
                }

                var _exceptions = {};
                
                for (var i = 0; i < config.methods[_methodName].exceptions.length; i++) {

                    if(config.methods[_methodName].exceptions[i] instanceof String || typeof(config.methods[_methodName].exceptions[i]) == 'string')    
                    {
                        var _exception = getClassObject(config.methods[_methodName].exceptions[i]);
                        _exceptions[_exception.toString()] = _exception;
                        if (!_exceptions[_exception.toString()])    addUnresolvedTypes(config.methods[_methodName].exceptions[i],_exceptions,_exception.toString());
                    }
                    else
                    {   var _exception = this.registerClass(config.methods[_methodName].exceptions[i]);
                        _exceptions[_exception.toString()] = _exception;
                    }                   
                };

                var _method = 
                {
                    name: _methodName,
                    description: config.methods[_methodName].description,
                    arguments: _arguments,
                    exceptions: _exceptions
                };

                if(config.methods[_methodName]["return"]){

                    if(config.methods[_methodName]["return"] instanceof String || typeof(config.methods[_methodName]["return"]) == 'string')    
                    {
                        _method["return"] = getClassObject(config.methods[_methodName]["return"]);
                    }
                    else
                    {
                        _method["return"] = this.registerClass(config.methods[_methodName]["return"])
                    }
                }

                _methods[_methodName] = new Method(_method);

                if (config.methods[_methodName]["return"] && !_methods[_methodName].Return) addUnresolvedTypes(config.methods[_methodName]["return"],_methods[_methodName],'Return');
            }

            //events
            var _events = (_base)? populateObject(_base.Events) : {};

            for(var _eventName in config.events) {

                var _eventHandler = undefined;

                if(config.events[_eventName].type instanceof String || typeof(config.events[_eventName].type) == 'string')    
                {
                    _eventHandler = getClassObject(config.events[_eventName].handler);
                }
                else
                {
                    _eventHandler = this.registerHandler(config.events[_eventName].handler)
                }

                _events[_eventName] = new Event(
                        {
                            name: _eventName,
                            description: config.events[_eventName].description,
                            handler: _eventHandler
                        }
                    );
            }

            //type
            var _type = new Class(
                {
                    name: config.name, 
                    namespace: config.namespace,
                    base: _base,
                    description: config.description,
                    properties: _properties,
                    constructors: _constructors,
                    methods: _methods,
                    events: _events
                }
            )

            if (config["extends"] && !_type.Base)   addUnresolvedTypes(config["extends"],_type,'Base');             

            var _module = getModuleObject(config.namespace);

            if (!_module.Classes) _module.Classes = {};

            _module.Classes[config.name] = _type;

            if (_base) {
                if(typeof _base.Subclasses == "undefined") _base.Subclasses = new Object();
                _base.Subclasses[_type.toString()] = _type;
                //getClassObject(_base.Namespace)[_base.Name] = _base; ??????????????????????????????????
            }

            return _type;
        }

        Metadata.registerHandler = function(handler) 
        {
            
            //Anonymous
            if (handler.name == undefined) 
                handler.name = guidGenerator();
            if (handler.namespace == undefined) 
                handler.namespace = 'Anonymous';

            //arguments
            var _arguments = {};

            for(var _argName in handler.arguments) {

                var _argType = undefined;

                if(handler.arguments[_argName].type instanceof String || typeof(handler.arguments[_argName].type) == 'string')  
                {
                    _argType = getClassObject(handler.arguments[_argName].type);
                }
                else
                {
                    _argType = this.registerClass(handler.arguments[_argName].type)
                }

                _arguments[_argName] = new Argument(
                        {
                            name: _argName,
                            description: handler.arguments[_argName].description,
                            mandatory: handler.arguments[_argName].mandatory,
                            type: _argType
                        }
                    );

                if (!_arguments[_argName].Type) addUnresolvedTypes(handler.arguments[_argName].type,_arguments[_argName], 'Type');
            }

            //handler
            var _handler = new Handler(
                {
                    name: handler.name, 
                    namespace: handler.namespace,
                    description: handler.description,
                    arguments: _arguments
                }
            )

            var _module = getModuleObject(handler.namespace);

            if (!_module.Classes) _module.Classes = {};

            _module.Classes[handler.name] = _handler;

            return _handler;
        }

        Metadata.getClass = function(type)
        {
            return getClassObject(type);
        }

        Metadata.getModule = function(type)
        {
            return (type)? getModuleObject(type) : _metadata.root;
        }

        Metadata.validateProperties = function(type,obj)
        {   
            var _type = (type instanceof String || typeof(type) == 'string')? getClassObject(type) : type;

            for(var prop in _type.Properties)
            {
                if(_type.Properties[prop].Mandatory == true && obj[prop] === undefined) return false;

                if(_type.Properties[prop].Mandatory == false && obj[prop] === undefined) continue;

                if(_type.Properties[prop].Type == Metadata.get('Object') && typeof(obj[prop]) == 'object') continue;

                if(_type.Properties[prop].Type == Metadata.get('String')) if (obj[prop] instanceof String || typeof(obj[prop]) == 'string') continue; else return false; 

                if(_type.Properties[prop].Type == Metadata.get('Number')) if (!isNaN(parseFloat(obj[prop])) && isFinite(obj[prop])) continue; else return false;

                if(_type.Properties[prop].Type == Metadata.get('Boolean')) if (obj[prop] instanceof Boolean || typeof(obj[prop]) == 'boolean')continue; else return false;

                if(_type.Properties[prop].Type == Metadata.get('Array')) if (typeof(obj[prop]) === "object" && obj[prop].constructor == Array) continue; else return false;

                if(_type.Properties[prop].Type == Metadata.get('Function')) if (obj[prop] instanceof Function) continue; else return false;

                if(Metadata.validateProperties(_type.Properties[prop].Type, obj[prop])) continue;

                return false;
            }

            return true;
        }

    })(xRTML.Metadata = xRTML.Metadata || {})
})(window.xRTML = window.xRTML || {});
/**
*  @module xRTML.Tags Holds all existing tags classes
*/
xRTML.TagManager.register({ name: 'Tag', 'abstract': true,
    struct: xRTML.Class.extend(new
    /**
    *  @class {private} xRTML.Tags.Tag Base class for all xRTML tags.
    */
    function () {

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event.
        */
        this.init = function (tagObject) {
            xRTML.Event.extend(this);

            var toFunction = xRTML.Common.Function.parse;
            this.bind({
                /**
                * Fired before the tag initializes.
                * @event evt_preInit
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target tag that raised this event.
                */
                preInit: toFunction(tagObject.attribute('onPreInit')),
                /*
                * Fired when the tag finishes initializing.
                * @event evt_postInit
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target tag that raised this event.
                */
                postInit: toFunction(tagObject.attribute('onPostInit')),
                /**
                * Fired when the tag's active state changes.
                * @event evt_active
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target tag that raised this event.
                */
                active: toFunction(tagObject.attribute('onActive')),
                /**
                * Fired before the tag processes an xRTML message.
                * @event evt_preProcess
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target tag that raised this event.
                */
                preProcess: toFunction(tagObject.attribute('onPreProcess')),
                /**
                * Fired when the tag finishes processing an xRTML message.
                * @event evt_postProcess
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target tag that raised this event.
                */
                postProcess: toFunction(tagObject.attribute('onPostProcess')),
                /**
                * Fired when the tag is deleted.
                * @event evt_dispose
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target tag that raised this event.
                */
                dispose: toFunction(tagObject.attribute('onDispose'))
            });

            this.fire({ preInit: {} });

            /**
            *  @property {String} internalId Identification of the tag, automatically generated.
            */
            this.internalId = xRTML.Common.Util.guidGenerator();

            /**
            *  @property {String} id Identification of the tag, assigned by the user.
            */
            this.id = tagObject.attribute('id') || this.internalId;

            /**
            *  @property {String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
            */
            this.connections = tagObject.attribute('connections') || [];

            /**
            *  @property {String} channelId Channel through which xRTML messages will be sent by this tag.
            */
            this.channelId = tagObject.attribute('channelId');

            /**
            *  @property {xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
            *  The tag will receive and process all xRTML messages that include these triggers.
            */
            this.triggers = tagObject.attribute('triggers') || [];

            /**
            *  @property {Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
            */
            this.receiveOwnMessages = !!tagObject.attribute('receiveOwnMessages');

            /**
            *  @property {Object} target Root HTML element the tag will interact with. Defaults to the web-page's body HTML element.
            */
            this.target = (function () {
                var target = xRTML.Sizzle(tagObject.attribute('target'));
                if (target.length == 0)
                    target.push(document.body);
                return target;
            })();

            /**
            *  @property {Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
            */
            this.active = tagObject.attribute('active') ? xRTML.Common.Converter.toBoolean(tagObject.attribute('active')) : true;
        };

        /**
        *  @function {public} ? Changes the active state of the tag.
        *  @param {Object} message struture with the definition of the xRTML message.
        *  @... {Boolean} active The new state of the tag.
        */
        this.activate = function (data) {
            this.active = xRTML.Common.Converter.toBoolean(data.active);
            this.fire({ active: { value: this.active} });
        };

        /**
        *  @function {public} ? Calls the appropriate action based on the received xRTML message.
        *  @param {Object} message struture with the definition of the xRTML message.
        *  @... {String} action The method of the tag that will be called.
        *  @... {Object} data The action related arguments.
        */
        this.process = function (data) { };

        /**
        *  @function {public} ? Sends an xRTML message using the channel and triggers of the tag.
        *  @param {Object} message struture with the definition of the xRTML message.
        *  @... {optional String} connectionId connection id.
        *  @... {optional String} channelId channel name.       
        *  @... {String} action The method of the tag that will be called.
        *  @... {Object} data The action related arguments.
        */
        this.sendMessage = function (message) {
            xRTML.ConnectionManager.sendMessage(
                {
                    connections: message.connectionId ? [message.connectionId] : this.connections,
                    channel: message.channel || this.channelId,
                    content: xRTML.MessageManager.create({ trigger: this.triggers, action: message.action, data: message.data, senderId: this.internalId })

                });
        };

        /**
        *  @function {public } ? Removes all references of the tag.
        *  This includes removing the tag's related HTML content from the page.
        */
        this.dispose = function () {
            /* do some cleanup. However this still requires garbage collection. */
            // remove reference to the DOM node target was pointing to.
            this.target = null;
            this.fire({ dispose: {} });
        };
    })
});

/**
* @end
*/
xRTML.TagManager.register({
    name: 'Media',
    'abstract': true,
    struct:
    /**
    *  Media file player.
    *  @class {private} xRTML.Tags.Media
    *  @extends xRTML.Tags.Tag
    */
    function () {

        var playNext = xRTML.Common.Function.proxy(function () {
            if (this.autoPlay && this.sources.next()) {
                this.play(this.sources.current());
            }
        }, this);

        var resumeQueue = xRTML.Common.Function.proxy(function () {
            if (this.autoPlay && this.sources.current()) {
                this.player.play(this.sources.current());
            }
            this.bind({
                'ended': resumeQueue
            });
            this.bind({
                'ended': playNext
            });
        }, this);

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event. 
        * @... {optional Number} width The width to apply to the media content.
        * @... {optional Number} height The height to apply to the media content.
        * @... {optional Boolean} autoPlay Tells whether the media file should start playing as soon as it is loaded. Defaults to true. 
        * @... {optional Boolean} loop Tells whether the media file should repeat after its finishes playing. 
        * @... {optional Boolean} controlsBar Toggles the display of the media player native control menu. Defaults to false. 
        * @... {optional Boolean} muted Toggles the media file sound. Defaults to false.  
        * @... {String} type The kind of player selected. The choices are: Youtube, HTML5 or Flash.
        * @... {String[]} formats The formats supported by the type of player.
        */
        this.init = function (tagObject) {

            this._super(tagObject);

            xRTML.Common.Validator.validateRequired({ target: this, prop: "channelId" });

            /**
            * @property {public Object} target The HTML element where the media content will be displayed. Defaults to body.
            */
            this.target = this.target[0];

            /**
            * @property {public Number} width The width to apply in the media content.
            */
            this.width = xRTML.Common.Converter.toNumber(tagObject.attribute('width')) || null;

            /**
            * @property {public Number} height The height to apply in the media content.
            */
            this.height = xRTML.Common.Converter.toNumber(tagObject.attribute('height')) || null;

            /**
            * @property {public Boolean} autoPlay Tells whether the media file should start playing as soon as it is loaded. Defaults to true.
            */
            this.autoPlay = typeof tagObject.attribute('autoPlay') == 'undefined' ? true : xRTML.Common.Converter.toBoolean(tagObject.attribute('autoPlay'));

            /**
            * @property {public Boolean} loop Tells whether the media file should repeat after its finishes playing.
            */
            this.loop = typeof tagObject.attribute('loop') == 'undefined' ? true : xRTML.Common.Converter.toBoolean(tagObject.attribute('loop'));

            /**
            * @property {public Boolean} controlsBar Toggles the display of the media player native control menu. Defaults to false.
            */
            this.controlsBar = xRTML.Common.Converter.toBoolean(tagObject.attribute('controlsBar')) || false;

            /**
            * @property {public Boolean} muted Toggles the media file sound. Defaults to false.
            */
            this.muted = xRTML.Common.Converter.toBoolean(tagObject.attribute('muted')) || false;

            /**
            * @property {public Boolean} loadStatus The loading status of the media content.
            */
            this.loadStatus = 0;

            /**
            * @property {public Object} sources The object that controls the media content.
            */
            this.sources = (function () {
                var container = [],
		        curr = -1;
                return {
                    current: function () {
                        return (container.length && curr != -1) != 0 ? container[curr] : null;
                    },
                    currentIndex: function () {
                        return curr;
                    },
                    next: function () {
                        curr = (++curr) < container.length ? curr : 0;
                        return container.length != 0 ? container[curr] : null;
                    },
                    previous: function () {
                        curr = --curr < 0 ? (container.length - 1) : curr;
                        return container.length != 0 ? container[curr] : null;
                    },
                    // add one or more sources in a certain position
                    insert: function (sources, idx) {
                        if (sources && idx > 0 && idx < (container.length + 1)) {
                            if (!(sources instanceof Array)) { sources = [sources]; }
                            // TODO: find a more suited way to do this
                            for (var i = sources.length - 1; i >= 0; --i) {
                                container.splice(idx, 0, sources[i]);
                            }
                            if (curr != -1 && idx < curr) curr += sources.length;
                        }
                    },
                    push: function (sources) {
                        if (sources) {
                            if (!(sources instanceof Array)) { sources = [sources]; }
                            container.push.apply(container, sources);
                        }
                    },
                    // remove source by index
                    removeAt: function (idx) {
                        var element = null;
                        if (idx >= 0 && idx < container.length) {
                            element = container.splice(idx, 1);
                            if (curr > container.length || idx < curr) --curr;
                        }
                        return element;
                    },
                    // remove this source
                    remove: function (source) {
                        for (var i = 0; i < container.length; ++i) {
                            var _source = container[i],
					        isEqual = true;
                            for (var attr in source) {
                                //if (source[attr] != _source[attr]) {
                                if (!xRTML.Common.Object.equals(source[attr], _source[attr])) {
                                    isEqual = false;
                                    break;
                                }
                            }
                            if (isEqual) {
                                return this.removeAt(i);
                            }
                        }
                        return null;
                    },
                    // remove source in the last position
                    pop: function () {
                        return this.removeAt(container.length - 1);
                    },
                    purge: function () {
                        container = [];
                        curr = -1;
                    },
                    length: function () {
                        return container.length;
                    }
                }
            })();

            var self = this; // Temp fix to know when a file finishes playing

            /**
            * @property {public Object} players The object containing the players available.
            */
            this.players = {};

            this.players.swf = function (config) {
                xRTML.Event.extend(this);

                xRTML.Common.DOM.loadScript({
                    url: 'http://code.xrtml.org/plugins/swfobject.js',
                    callback: xRTML.Common.Function.proxy(function () {
                        this.isReady = true;
                        this.fire({ ready: {} });
                    }, this)
                });

                this.isReady = false;
                this.id = xRTML.Common.Util.idGenerator();
                this.target = config.target;
                this.width = config.width;
                this.height = config.height;
                // formats that might be supported by the browsers (ignore config)
                this.supportedMedia = { swf: this.canPlayType("swf") };

                function loadedMetadataHandler(e) {
                    self.fire({ loadedmetadata: { event: e, target: self} });
                };
                this.bind({
                    loadedmetadata: loadedMetadataHandler
                });
            };
            this.players.swf.prototype = {
                play: function (source) {

                    if (!this.isReady) {
                        this.bind({
                            ready: xRTML.Common.Function.proxy(function () { this.play(source) }, this)
                        });
                        return;
                    }
                    // get the swf file
                    var filename = source.files['swf'];
                    if (filename) {
                        // remove the previous OBJECT element
                        if (xRTML.Sizzle(this.id + " object").length > 0) {
                            this.stop();
                        }
                        // HTML element the SWFObject is going to replace
                        var mediaContainer = document.createElement('span');
                        mediaContainer.id = this.id;
                        // append to html5 video tag
                        this.target.appendChild(mediaContainer);

                        var flashvars = {},
				            params = {
				                allowScriptAccess: "always",
				                play: "true",
				                loop: "true"
				            },
				            attributes = {
				                id: "FLVplayer_" + this.id,
				                name: "FLVplayer_" + this.id,
				                align: "middle"
				            },
				            outputStatus = xRTML.Common.Function.proxy(function (e) {
				                this.fire({ loadedmetadata: e });
				            }, this);

                        swfobject.embedSWF(filename,
				                this.id, 	 	// id
				                this.width, 	// width 
				                this.height, 	// height
				                "9.0.0", 		// version 
				                null, 			// expressInstallSwfurl 
				                flashvars, 		// flashvars  
				                params, 		// params 
				                attributes, 	// attributes
				                outputStatus); 	// callbackFn

                        // redefine restart (temp hammering)
                        this.restart = function () {
                            this.stop();
                            this.play(source);
                        }
                    }
                },
                isPlaying: function () {
                    return xRTML.Sizzle("#FLVplayer_" + this.id).length > 0;
                },
                stop: function () {
                    if (typeof swfobject != "undefined") {
                        swfobject.removeSWF("FLVplayer_" + this.id);
                    }
                },
                pause: function () { },
                restart: function () { },
                skip: function () { },
                mute: function () { },
                volume: function () { },
                canPlayExtension: function (ext) {
                    var type = this.supportedMedia[ext];
                    if (typeof type === 'undefined') {
                        return false;
                    }
                    return this.canPlayType(type);
                },
                canPlayType: function (type) {
                    return type === 'swf';
                },
                time: function () {
                    return {
                        current: 0,
                        duration: 0
                    };
                }
            };
            var MediaPlayer = function (config) {
                this.id = xRTML.Common.Util.idGenerator();
                var player = document.createElement(config.type);
                player.id = this.id;
                player.width = config.width;
                player.height = config.height;
                player.poster = config.poster;
                player.autoplay = config.autoPlay;
                player.loop = config.loop;
                player.muted = config.muted;
                player.controls = config.controls;
                this.addPlayerDOM = function () {
                    self.target.appendChild(player);

                    xRTML.Event.bind(player, {
                        progress: progressHandler
                    });

                    xRTML.Event.bind(player, {
                        loadedmetadata: loadedMetadataHandler
                    });

                    xRTML.Event.bind(player, {
                        timeupdate: timeUpdateHandler
                    });

                    xRTML.Event.bind(player, {
                        play: playHandler
                    });

                    xRTML.Event.bind(player, {
                        playing: playingHandler
                    });

                    xRTML.Event.bind(player, {
                        pause: pauseHandler
                    });

                    xRTML.Event.bind(player, {
                        ended: endedHandler
                    });
                };
                // add fallback to flash

                this.fallback = typeof self.players.swf === 'function' ? new self.players.swf(config) : self.players.swf;

                //this.fallback = new self.players.swf(config);
                // formats that might be supported by the browsers

                this.supportedMedia = {};
                for (var attr in config.formats) {
                    this.supportedMedia[attr] = player.canPlayType(config.formats[attr]) == "maybe" || player.canPlayType(config.formats[attr]) == "probably";
                };

                var parent = this;
                // monitors the progress of the data fetching
                function progressHandler(e) {
                    var endBuf = e.target.buffered.length != 0 ? e.target.buffered.end(0) : 0;
                    parent.loadStatus = parseInt(((endBuf / e.target.duration) * 100));
                };
                xRTML.Event.bind(player, {
                    progress: progressHandler
                });

                function loadedMetadataHandler(e) {
                    self.duration = e.target.duration;
                    self.currentTime = e.target.currentTime;

                    if (config.keepRatio) {
                        // set the correct aspect ratio of the video. Overrides the width and height specified by the user. (on-demand only)
                        e.target.height = e.target.videoHeight;
                        e.target.width = e.target.videoWidth;
                    }

                    if (e.target.paused) {
                        self.pause();
                    }
                    self.fire({ loadedmetadata: { event: e, target: self} });
                };
                xRTML.Event.bind(player, {
                    loadedmetadata: loadedMetadataHandler
                });

                function timeUpdateHandler(e) {
                    self.currentTime = e.target.currentTime;
                };
                xRTML.Event.bind(player, {
                    timeupdate: timeUpdateHandler
                });

                function playHandler(e) { }
                xRTML.Event.bind(player, {
                    play: playHandler
                });


                function playingHandler(e) { }
                xRTML.Event.bind(player, {
                    playing: playingHandler
                });

                function pauseHandler(e) { }
                xRTML.Event.bind(player, {
                    pause: pauseHandler
                });

                function endedHandler(e) {
                    //if (self.autoPlay && self.sources.next()) {
                    //parent.play(self.sources.current());
                    //}
                    self.fire('ended', { file: e });
                };
                xRTML.Event.bind(player, {
                    ended: endedHandler
                });

                // An error occured while fetching the media data.
                function errorHandler(e) {
                    if (e.target.error !== null) {
                        var error = '';
                        // video playback failed - show a message saying why
                        switch (e.target.error.code) {
                            case e.target.error.MEDIA_ERR_ABORTED:
                                error = 'You aborted the media playback.';
                                break;
                            case e.target.error.MEDIA_ERR_NETWORK:
                                error = 'A network error caused the media download to fail part-way.';
                                break;
                            case e.target.error.MEDIA_ERR_DECODE:
                                error = 'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.';
                                break;
                            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                error = 'The media could not be loaded, either because the server or network failed or because the format is not supported.';
                                break;
                            default:
                                error = 'An unknown error occurred.';
                                break;
                        }
                        xRTML.Error.raise({ code: xRTML.Error.Codes.UNEXPECTEDMEDIA, target: self, message: error, info: { className: 'xRTML.TagManager.Media', methodName: 'errorHandler (internal method, no docs available)'} });
                    }
                };

                xRTML.Event.bind(player, {
                    error: errorHandler
                });

                this.isReady = true;
            };
            MediaPlayer.prototype = {
                loadStatus: 0,
                play: function (source) {
                    for (var ext in source.files) {
                        if (this.supportedMedia[ext] === true) {
                            var player = document.getElementById(this.id);
                            if (!player) {
                                this.addPlayerDOM();
                                player = document.getElementById(this.id);
                            }
                            player.autoplay = source.autoPlay === player.autoplay ? player.autoplay : source.autoPlay;
                            player.loop = source.loop === player.loop ? player.loop : source.loop;
                            player.src = source.files[ext];
                            player.load();
                            player.play();
                            xRTML.Console.debug("Playing file: " + source.files[ext]);

                            // offset playback
                            if (source.offset) {
                                this.offset(source.offset.start, source.offset.end);
                            }
                            return;
                        }
                    }
                    // try fallback (only swf for now, so this check is ok)
                    if (this.fallback && source.files['swf']) {
                        this.fallback.play(source);
                    }
                    else {
                        // display format not supported
                        document.getElementById(this.id).innerHTML = "Your browser cannot play these movie types.";
                    }
                },
                stop: function () {
                    var mediaPlayer = document.getElementById(this.id);
                    mediaPlayer.currentTime = mediaPlayer.duration;
                },
                pause: function () {
                    var mediaPlayer = document.getElementById(this.id);
                    mediaPlayer.paused ? mediaPlayer.play() : mediaPlayer.pause();
                },
                restart: function () {
                    var mediaPlayer = document.getElementById(this.id);
                    mediaPlayer.currentTime = 0;
                },
                skip: function (time) {
                    var mediaPlayer = document.getElementById(this.id);
                    if (mediaPlayer.readyState >= mediaPlayer.HAVE_METADATA) {
                        mediaPlayer.currentTime = time;
                    }
                    else {
                        xRTML.Event.bind(mediaPlayer, {
                            loadedmetadata: function (e) {
                                e.target.currentTime = time;
                            }
                        });

                    }
                },
                mute: function () {
                    var mediaPlayer = document.getElementById(this.id);
                    mediaPlayer.muted = !mediaPlayer.muted;
                },
                volume: function (measure) {
                    var mediaPlayer = document.getElementById(this.id);
                    mediaPlayer.volume = measure / 100;
                },
                isPlaying: function () {
                    return document.getElementById(this.id).currentTime != 0;
                },
                canPlayExtension: function (ext) {
                    var type = this.supportedMedia[ext];
                    if (typeof type === 'undefined') {
                        return false;
                    }
                    return this.canPlayType(type);
                },
                canPlayType: function (type) {
                    var mediaPlayer = document.getElementById(this.id),
			        canPlay = mediaPlayer.canPlayType(type);
                    return ((canPlay == "maybe") || (canPlay == "probably"));
                },
                time: function () {
                    var mediaPlayer = document.getElementById(this.id);
                    return {
                        current: mediaPlayer.currentTime,
                        duration: mediaPlayer.duration
                    };
                },
                offset: function (start, end) {
                    var mediaPlayer = document.getElementById(this.id),
                	setOffset = function (e) {
                	    mediaPlayer.currentTime = start;
                	    var checkOffset = function () {
                	        if (mediaPlayer.currentTime >= end) {
                	            mediaPlayer.pause();
                	            xRTML.Event.unbind(mediaPlayer, {
                	                timeupdate: checkOffset
                	            });
                	        }
                	    };
                	    xRTML.Event.unbind(mediaPlayer, {
                	        timeupdate: checkOffset
                	    });

                	};

                    if (mediaPlayer.readyState >= mediaPlayer.HAVE_METADATA) {
                        setOffset();
                    }
                    else {
                        xRTML.Event.bind(mediaPlayer, {
                            loadedmetadata: setOffset
                        });
                    }
                }
            };

            this.bind({
                ended: playNext
            });

            var config = {
                type: tagObject.attribute('type') || {},
                formats: tagObject.attribute('formats') || {},
                target: this.target,
                width: this.width,
                height: this.height,
                poster: this.poster,
                autoPlay: this.autoPlay,
                loop: this.loop,
                controls: this.controlsBar,
                muted: this.muted,
                keepRatio: this.keepRatio
            };

            xRTML.Common.Function.proxy(function () {
                if (document.createElement(config.type).canPlayType) {
                    var mediaElement = document.createElement(config.type),
                    canPlay;

                    for (var format in config.formats) {
                        canPlay = mediaElement.canPlayType(config.formats[format]);
                        if ((canPlay == "maybe") || (canPlay == "probably")) {
                            this.players[format] = MediaPlayer;
                        }
                    }
                }
            }, this)();

            this.players.get = function (files) {
                for (var extension in files) {
                    // a player supports this media extension
                    if (this[extension]) {
                        // check if it's an instance
                        if (typeof this[extension] === 'function') {
                            this[extension] = new this[extension](config);
                        }
                        return this[extension];
                    }
                }
                // no player supports this file extension
            };
        };

        /**
        * @function {public void} ? Plays a media file. The file to be played might be contained in the xRTML Message or in the players' queue.
        * @param {optional Object} data The xRTML data representing the media file to be played. In case it's not specified it will play the next file in queue.
        * @...{String[]} files The different kinds of formats for the same media file.
        * @...{optional Boolean} playNow Tells if the player starts playing the media file at once or only after the current playback finishes.
        */
        this.play = function (data) {
            if (this.target.hasChildNodes()) {
                if (this.player) {
                    if (this.player.supportedMedia.swf) {
                        swfobject.removeSWF("FLVplayer_" + this.player.id);
                    } else if (this.player.supportedMedia.yt) {
                        swfobject.removeSWF("xrtml-video-ytplayer");
                    } else {
                        this.target.removeChild(this.target.lastChild);
                    }
                }
            }
            var source = null;
            // let's assume only one video to be played
            if (data) {
                source = data;
                if (data.playNow) {
                    this.player = this.players.get(data.files);
                    this.player.play(data);
                    // TODO: add an event listener that resumes queue play after this media finishes
                    this.unbind({
                        ended: playNext
                    });
                    this.bind({
                        ended: resumeQueue
                    });
                }
                else {
                    // insert after the current playing media ends
                    this.sources.insert(data, this.sources.currentIndex() + 1);
                }
            }
            else { // play from queue
                // if no media is playing start it
                if (this.sources.current() == null && this.sources.length() != 0) {
                    source = this.sources.next();
                }
                else { // otherwise just play current
                    this.sources.current().autoPlay = true;
                    source = this.sources.current();
                }
                this.player = this.players.get(source.files);
                this.player.play(source);
            }
            this.fire({
                play: { source: source }
            });
        };
        /**
        * @function {public void} ? Stops the media file currently playing. 
        */
        this.stop = function () {
            this.player.stop();
            this.fire({
                stop: {}
            });
        };
        /**
        * @function {public void} ? Pauses the media file currently playing. 
        */
        this.pause = function () {
            this.player.pause();
            this.fire({
                pause: {}
            });
        };
        /**
        * @function {public void} ? Restarts the media file currently playing. 
        */
        this.restart = function () {
            this.player.restart();
            this.fire({
                restart: {}
            });
        };
        /**
        * @function {public void} ? Mutes media file volume currently playing. 
        */
        this.mute = function () {
            this.player.mute();
            this.fire({
                mute: {}
            });
        };
        /**
        * @function {public void} ? Controls the volume of the media file currently being played. 
        * @param {Object} data The xRTML message data 
        * @... {Number} volume The value of the volume to be set.
        */
        this.volume = function (data) {
            if (data && data.volume) {
                var newVolume = typeof data.volume === 'string' ? parseInt(data.volume) : data.volume;
                if (newVolume > 100) {
                    newVolume = 100;
                }
                else if (newVolume < 0) {
                    newVolume = 0;
                }

                this.player.volume(newVolume);
                this.fire({
                    volume: { volume: newVolume }
                });
            }
        };
        /**
        * @function {public void} ? Controls the media file timeline currently playing. 
        * @param {Object} data The xRTML message data.
        * @...{Number} skip The value, in miliseconds, where the playback will be set in the timeline.
        */
        this.skip = function (data) {
            if (data && data.skip) {
                var skipValue = typeof data.skip === 'string' ? parseInt(data.skip) : data.skip;
                this.player.skip(skipValue);
                this.fire({
                    skip: { skip: skipValue }
                });
            }
        };
        /**
        * @function {public void} ? Places a media file in queue. 
        * @param {Object} data The xRTML message data containing the media file attributes.
        */
        this.queue = function (data) {
            if (data) {
                this.sources.push(data);
                this.fire({
                    queue: { sources: data }
                });
                if (this.autoPlay && !this.isPlaying()) {
                    // start playing from queue
                    this.play();
                }
            }
        };
        /**
        * @function {public void} ? Removes a media file from queue.
        * @param {Object} data The xRTML message data containing the media file attributes.
        */
        this.unqueue = function (data) {
            if (data) {
                this.sources.remove(data);
                this.fire({
                    unqueue: { source: data }
                });
            }
        };
        /**
        * @function {public void} ? Plays the next a media file in queue. 
        */
        this.next = function () {
            // start playing from queue
            this.play(this.sources.next());
        };
        /**
        * @function {public void} ? Plays the previous a media file in queue. 
        */
        this.previous = function () {
            this.play(this.sources.previous());
        };
        /**
        * @function {public void} ? Returns the file duration and current playback time
        */
        this.time = function () {
            return {
                duration: this.duration,
                currentTime: this.currentTime
            }
        };
        /**
        * @function {public void} ? Checks if some sort of media contents is being played back.
        */
        this.isPlaying = function () {
            return !!this.player && this.player.isPlaying();
        };
    }
});
xRTML.TagManager.register({
    name: 'Audio',
    base: 'Media',
    struct: 
    /**
    *  xRTML Tag for audio playback.
    *  @class {private} xRTML.Tags.Audio
    *  @extends xRTML.Tags.Media
    */ 
    function () {
        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event. 
        * @... {optional Number} width The width to apply to the media content.
        * @... {optional Number} height The height to apply to the media content.
        * @... {optional Boolean} autoPlay Tells whether the media file should start playing as soon as it is loaded. Defaults to true. 
        * @... {optional Boolean} loop Tells whether the media file should repeat after its finishes playing. 
        * @... {optional Boolean} controlsBar Toggles the display of the media player native control menu. Defaults to false. 
        * @... {optional Boolean} muted Toggles the media file sound. Defaults to false.  
        * @... {String} type The kind of player selected. The choices are: Youtube, HTML5 or Flash.
        * @... {String[]} formats The formats supported by the type of player.
        */
        this.init = function (tagObject) {
            tagObject.type = 'audio';
            tagObject.muted = false;
            tagObject.formats = {
                mp3: "audio/mpeg",
                ogg: "audio/ogg",
                aac: "audio/mp4",
                wav: "audio/wav",
                pcm: "audio/webm"
            };

            this._super(tagObject);

            xRTML.Common.Validator.validateRequired({ target: this, prop: "type" });
            xRTML.Common.Validator.validateRequired({ target: this, prop: "formats" });
        };
    }
});
xRTML.TagManager.register({
    name: 'Broadcast',
    struct:
    /**
    * Dispatches a message to all elements listening on the real-time channel.
    * @class {private} xRTML.Tags.Broadcast
    * @extends xRTML.Tags.Tag
    */
    function () {
        /**
        * Entity that holds the features of an xRTML message to be sent by the broadcast tag.
        * @class {private} xRTML.Tags.Broadcast.Dispatcher
        */
        /**
        * @constructor xRTML.Tags.Broadcast.Dispatcher Initializes a dispatcher by setting its attributes.
        * @param {Object} args Configuration of the dispatcher.
        * @... {optional String} senderId The sender id to use in the message. If not defined, defaults to the broadcast's id. 
        * @... {optional String} target The target HTMLElement. Must be specified along with the event attribute.
        * @... {optional String} event The type event of the dispatcher. Must be specified along with the target attribute.
        * @... {optional String} xrtmlmessage The xRTML message in JSON string format. 
        * @... {optional String} callback The name of the callback to create a message to send. 
        * @... {optional Number} interval The time between the messages.
        * @... {optional Number} limit The number of messages to send. Defaults to zero.
        * @... {optional String} messageSource Selector of the HTML element(s) containing the message to be sent.
        * @... {optional String} messageAttribute Name of the attribute that will contain the message inside the messageSource.
        */
        var Dispatcher = function (args) {

            xRTML.Event.extend(this);

            // reference to interval timer
            var sendingIntervalReference,
            //internal var to control the numer of messages sent
            messagesSent = 0;

            /**
            *   @property {String} senderId The sender id to use in the message.
            */
            this.senderId = args.attribute('senderId');

            /**
            *   @property {String} target The target HTMLElement.
            */
            this.target = xRTML.Sizzle(args.attribute('target'));

            /**
            *   @property {String} event The type event of the dispatcher.
            */
            this.event = args.attribute('event');

            /**
            *   @property {String} xrtmlmessage The xRTML message in JSON string format.
            */
            this.xrtmlmessage = args.attribute('xrtmlmessage');

            /**
            *   @property {String} callback The name of the callback to create a message to send.
            */
            this.callback = xRTML.Common.Function.parse(args.attribute('callback'));

            /**
            *   @property {Number} interval The time between the messages.
            */
            this.interval = args.attribute('interval');

            /**
            *   @property {Number} limit The number of messages to send.
            */
            this.limit = args.attribute('limit') || 0;

            /**
            *   @property {String} messageSource Selector of the HTML element(s) containing the message to be sent.
            */
            this.messageSource = xRTML.Sizzle(args.attribute('messageSource'));

            /**
            *   @property {String} messageAttribute Name of the attribute that will contain the message inside the messageSource.
            */
            this.messageAttribute = args.attribute('messageAttribute');

            var onMessage = args.attribute('onMessage')
            if (onMessage)
                this.bind({ message: onMessage });

            /**
            *   Sends the message configured for the dispatcher.
            *   @function {void} dispatchMessage
            */
            this.dispatchMessage = function () {

                var messages = [];

                if (this.messageSource.length > 0) {

                    var data = {};

                    if (typeof this.messageAttribute != "undefined") {
                        data[this.messageAttribute] = xRTML.Common.String.trim(this.messageSource[0][this.messageAttribute]);
                    } else {
                        data.content = xRTML.Common.String.trim(this.messageSource[0].value);
                    }

                    var msg = {
                        trigger: '',
                        action: '',
                        data: data,
                        senderId: this.senderId
                    };

                    messages.push(xRTML.MessageManager.create(msg));

                } else {

                    if (this.callback != null) {
                        var msg = this.callback();
                        msg.senderId = typeof msg.senderId == "undefined" ? this.senderId : msg.senderId;
                        messages.push(msg);
                    }

                    if (this.xrtmlmessage) {

                        try {
                            var msg = xRTML.JSON.parse(this.xrtmlmessage).xrtml;
                            messages.push(xRTML.MessageManager.create({
                                trigger: msg.trigger,
                                action: msg.action,
                                data: msg.data,
                                senderId: this.id
                            }));

                        } catch (err) {
                            xRTML.Error.raise({ code: xRTML.Error.Codes.JSON_PARSE, target: thisxRTML.Error.raise({ code: xRTML.Error.Codes.INVALID_DOM_ATTRIBUTE, target: this, info: { className: 'xRTML.Tags.' + this.name, methodName: 'dispatchMessage'} }) });
                        }
                    }
                }

                for (var i = 0; i < messages.length; ++i) {

                    if (messagesSent == this.limit && this.limit > 0) {
                        clearInterval(sendingIntervalReference);
                        return;
                    }

                    this.fire({
                        message: messages[i]
                    });
                    messagesSent++;

                }
            };

            if (this.target && this.event) {
                try {
                    var evt = {};
                    evt[this.event] = xRTML.Common.Function.proxy(this.dispatchMessage, this);
                    xRTML.Event.bind(this.target[0], evt);
                } catch (err) {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.NON_EXISTING_ELEMENT, target: thisxRTML.Error.raise({ code: xRTML.Error.Codes.INVALID_DOM_ATTRIBUTE, target: this, info: { className: 'xRTML.Tags.' + this.name, methodName: 'dispatchMessage'} }) });
                }

            } else {
                if (this.interval > 0) {
                    sendingIntervalReference = setInterval(xRTML.Common.Function.proxy(this.dispatchMessage, this), this.interval);
                } else {
                    this.dispatchMessage();
                }
            }
        };

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event.
        */
        this.init = function (tagObject) {
            this._super(tagObject);

            xRTML.Common.Validator.validateRequired({ target: this, prop: "channelId" });
            xRTML.Common.Validator.validateRequired({ target: this, prop: "connections" });
            xRTML.Common.Validator.validateRequired({ target: this, prop: "triggers" });

            this.receiveOwnMessages = false;

            var dispatcherElements = tagObject.attribute('dispatchers');

            for (var i = 0; i < dispatcherElements.length; ++i) {
                dispatcherElements[i].attribute = tagObject.attribute;
                dispatcherElements[i].senderId = this.id;
                dispatcherElements[i].onMessage = xRTML.Common.Function.proxy(this.sendMessage, this);
                new Dispatcher(dispatcherElements[i]);
            }
        };
    }
});
xRTML.TagManager.register({
    name: 'Chart',
    struct:
    /**
    *  xRTML Tag for displaying data visualizations in chart plotting.
    *  @class {private} xRTML.Tags.Chart
    *  @extends xRTML.Tags.Tag
    */
    function () {

        var Model = function (config) {
            try {
                xRTML.Event.extend(this);

                this.title = config.title ? config.title.text : null;
                this.subTitle = config.subTitle ? config.subTitle.text : null;
                this.series = xRTML.Templating.observable(new Array());

                this.dataValuesTotal = xRTML.Templating.observable(xRTML.Common.Function.proxy(function () {
                    var result = 0;
                    for (var i = 0; i < this.series().length; i++) {
                        result += (this.series()[i].value() || this.series()[i].value()[0]);
                    }
                    return result;
                }, this));

                this.updateSerie = function (position, value) {
                    this.series()[position].value(value);
                    this.fire({ serieUpdate: { serie: this.series()[position], index: position} });
                }
                this.updateSeries = function (series) {
                    this.series(new Array());
                    for (var i = 0; i < series.length; i++) {
                        this.series.push(new SeriesModel({ name: series[i].name, value: series[i].data[0] || series[i].data, type: series[i].type }, this.dataValuesTotal));
                    }
                    this.fire({ seriesUpdate: { series: this.series()} });
                }
                this.incrementSerie = function (position, incrementBy) {
                    this.series()[position].value(this.series()[position].value() + incrementBy);
                    this.fire({ serieUpdate: { serie: this.series()[position], index: position} });
                }
                if (config.series) {
                    this.updateSeries(config.series);
                }
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.UNEXPECTED, info: { className: 'xRTML.Tags.Chart', methodName: 'init', message: err.message } });
            }
        },
        SeriesModel = function (config, dataValuesTotal) {
            this.name = config.name;
            this.value = xRTML.Templating.observable(config.value);
            this.type = config.type;
            this.percentage = xRTML.Templating.observable(xRTML.Common.Function.proxy(function () {
                return this.value() / dataValuesTotal() * 100;
            }, this));
        },
        model,
        //Interface to accomodate highcharts api to update the chart. (TEMP FIX: Should be removed when the plugins system is implemented)
        HighChartsFacade = {
            column: {
                update: function (args) {
                    highChartsChart.series[args.index].data[0].update(parseInt(args.value()));
                },
                add: function (args) {
                    highChartsChart.series.push(args.serie);
                }
            },
            pie: {
                update: function (args) {
                    highChartsChart.series[0].data[args.index].update([args.name, args.value()]);
                },
                add: function (args) {
                    highChartsChart.series.push(args.serie);
                }
            }
        },
        //Reference ot the highcharts chart (also to be removed after plugins). Only used by the facade.
        highChartsChart,
        render = function () {

            model = new Model(this.settings);

            //TEMP FIX: This condition should be relegated to oblivion after the plugin system is in place.
            if (this.chartingPlatform == 'highcharts') {
                if (Highcharts) {
                    if (!this.settings.chart.events) this.settings.chart.events = {};
                    this.settings.chart.events.load = xRTML.Common.Function.proxy(function () {
                        this.fire({ rendered: {} });
                    }, this);
                    highChartsChart = new Highcharts.Chart(this.settings);
                    //Remove highstock and highcharts referrences!!
                    var highstockEls = xRTML.Sizzle('svg text tspan:contains("Highcharts") , svg text tspan:contains("Highstock")');
                    if (highstockEls) {
                        for (var i = 0, len = highstockEls.length; i < len; i++) {
                            highstockEls[i].style.display = 'none';
                        }
                    }
                    //Bind to model events to perform highcharts operations. (TEMP FIX: This code should be moved to a plugin)
                    this.bind({
                        serieUpdate: xRTML.Common.Function.proxy(function (e) {
                            HighChartsFacade[this.type].update({ index: e.index, name: e.serie.name, value: e.serie.value });
                        }, this),
                        seriesUpdate: xRTML.Common.Function.proxy(function (e) {
                            var series = [];
                            for (var i = 0; i < e.series.length; i++)
                                series.push({ type: e.series[i].type, name: e.series[i].name, data: [e.series[i].value()] });
                            this.settings.series = series;
                            highChartsChart = new Highcharts.Chart(this.settings);
                        }, this)
                    });
                }
                else {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.TAG_INVALID_CONFIG, target: this, info: { message: 'The chartingPlatform highcharts requires that the relevant libraries are imported.', className: 'xRTML.Tags.' + this.name, methodName: 'init'} });
                }
            } else {

                //Define a default template if one is not given by the user.
                if (typeof this.template == 'undefined') {

                    var defaultTemplate = '<div class="xrtml-chart">';
                    defaultTemplate += '<h1 data-bind="text:title"></h1>';
                    defaultTemplate += '<h2 data-bind="text:subTitle"></h2>';
                    defaultTemplate += '<div class="values">';
                    defaultTemplate += '    <ul class="graph" data-bind="foreach: series">';
                    defaultTemplate += '        <li><span data-bind="text:value, style:{ paddingTop: (percentage()*2)+\'px\' }"></span></li>';
                    defaultTemplate += '    </ul>';
                    defaultTemplate += '</div>';
                    defaultTemplate += '<div class="items">';
                    defaultTemplate += '    <strong>Items</strong>';
                    defaultTemplate += '    <ul data-bind="foreach: series">';
                    defaultTemplate += '        <li><span data-bind="text:name"></span></li>';
                    defaultTemplate += '    </ul>';
                    defaultTemplate += '    <ul data-bind="foreach: series">';
                    defaultTemplate += '        <li><span data-bind="text:Math.round( percentage() * Math.pow(10,0))/Math.pow(10,0)+\'%\'"></span></li>';
                    defaultTemplate += '    </ul>';
                    defaultTemplate += '</div>';
                    defaultTemplate += '</div>';

                    this.template = 'xRTML-Chart-Template';

                    xRTML.Templating.inject({
                        id: this.template,
                        content: defaultTemplate
                    });
                }

                xRTML.Templating.applyBindings({
                    node: this.targetElement,
                    binding: {
                        template: {
                            name: this.template,
                            data: model,
                            afterRender: xRTML.Common.Function.proxy(function (elements, data) {
                                this.fire({ rendered: {} });
                            }, this)
                        }
                    }
                });

                //Configure effects only if the type is not highcharts.
                this.bind({
                    serieUpdate: xRTML.Common.Function.proxy(function (e) {
                        this.runEffects({ element: xRTML.Sizzle(this.valuesTarget)[e.index] });
                    }, this)
                });
            }
        },
        bindHandlers = function (args) {
            //Fire model events on the Tag.
            model.bind({
                serieUpdate: xRTML.Common.Function.proxy(function (e) { this.fire({ serieUpdate: e }); }, this),
                seriesUpdate: xRTML.Common.Function.proxy(function (e) { this.fire({ seriesUpdate: e }); }, this)
            });
            //Bind event handlers
            model.bind({
                /**
                *   @event evt_serieUpdate Event dispatched when a serie of this chart has been updated.
                *   @param {Object} e An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.
                *   @... {Object} target The target object that fired the event.
                *   @... {Object} serie The serie that was updated.
                *   @... {Object} index The index of the serie that was updated in the series array.
                */
                serieUpdate: xRTML.Common.Function.parse(args.onSerieUpdate),
                /**
                *   @event evt_seriesUpdate Event dispatched when all the series of this chart have been updated.
                *   @param {Object} e An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.
                *   @... {Object} target The target object that fired the event.
                *   @... {Object} series The series that were updated.
                */
                seriesUpdate: xRTML.Common.Function.parse(args.onSeriesUpdate),
                /**
                *   @event evt_rendered Event dispatched when the chart has been rendered.
                *   @param {Object} e An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.
                *   @... {Object} target The target object that fired the event.
                */
                rendered: xRTML.Common.Function.parse(args.onRendered)
            });
        },
        storage;

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event.
        * @... {optional Object[]} effects The effects to run when an update on chart values occurs (currently only supported for htmlchart platform).
        * @... {optional Object} settings The settings to configure the chart.
        * @... {optional String} valuesTarget The selector for the chart values elements. This is necessary only if effects are configured in the tag and the charting platform is htmlchart. Defaults to '.values li span' which is the appropriate selector relative to the default template.
        * @... {optional String} type Defines if the chart is Bar, Line or Pie. This property is only used for plugins, the htmlchart will be based on the given template, hence can be of any type.
        * @... {optional String} chartingPlatform Identify the chart platform. Can be highcharts or htmlchart. Defaults to htmlchart.
        * @... {optional String} template The id of the template in the page. If this is not supplied then a default template will be used.
        * @... {optional String} storageId The id to the Storage component that is used by this tag to perform data related operations.
        * @... {optional String} storageKey The key that should be used to associate data in the Storage with this tag.
        */
        this.init = function (tagObject) {

            this._super(tagObject);

            //Prepare for effects
            /**
            *   @property {Array} effects The effects to run when an update on chart values occurs (currently only supported for htmlchart platform).
            */
            this.effects = tagObject.attribute('effects');
            xRTML.Effect.extend(this);

            /**
            *   @property {Object} settings The chart settings that were given to configure the chart.
            */
            this.settings = tagObject.attribute('settings');

            /**
            *   @property {HTMLElement} targetElement The HTML Element where the chart will be rendered. Defaults to the target defined in the config object
            */
            this.targetElement = (this.settings && this.settings.chart && this.settings.chart.renderTo) ? xRTML.Sizzle('#' + this.settings.chart.renderTo)[0] : (!!tagObject.attribute('target') ? this.target[0] : xRTML.Sizzle('#' + args.template)[0].parentNode.insertBefore(document.createElement("div"), xRTML.Sizzle('#' + args.template)[0]));

            /**
            *   @property {String} valuesTarget The selector for the chart values elements. This is necessary only if effects are configured in the tag and the charting platform is htmlchart. Defaults to '.values li span' which is the appropriate selector relative to the default template.
            */
            this.valuesTarget = tagObject.attribute('valuesTarget') || '.values li span';

            /**
            *   @property {String} type Defines if the chart is Bar, Line or Pie. This property is only used for plugins, the htmlchart will be based on the given template, hence can be of any type.
            */
            this.type = tagObject.attribute('type') ? tagObject.attribute('type') : ((this.settings && this.settings.chart && this.settings.chart.type) ? this.settings.chart.type : ((this.settings && this.settings.series && this.settings.series[0].type) ? this.settings.series[0].type : null));

            /**
            *   @property {String} chartingPlatform Identify the chart platform. Can be highcharts or htmlchart.
            */
            this.chartingPlatform = typeof tagObject.attribute('chartingPlatform') != 'undefined' ? tagObject.attribute('chartingPlatform') : 'htmlchart';

            /**
            *   @property {public String} template Structure that represents the markup the xRTML Chart should be displayed in the DOM. Defaults to xRTML-Chart-Template which represents this tag\'s default template.
            */
            this.template = tagObject.attribute('template');

            /**
            *   @property {String} storageId The id to the Storage component that is used by this tag to perform data related operations.
            */
            this.storageId = tagObject.attribute('storageId');
            /**
            *   @property {String} storageKey The key that should be used to associate data in the Storage with this tag.
            */
            this.storageKey = tagObject.attribute('storageKey');
            if (this.storageId) {
                storage = xRTML.StorageManager.getById(this.storageId);
            }

            var handlerConfig = {
                onSerieUpdate: tagObject.attribute('onSerieUpdate'),
                onSeriesUpdate: tagObject.attribute('onSeriesUpdate'),
                onRendered: tagObject.attribute('onRendered')
            }

            if (storage) {
                storage.get({ namespace: 'Charts', k: this.storageKey + '#settings' }, xRTML.Common.Function.proxy(function (result) {
                    if (result.success) {
                        this.settings = xRTML.JSON.parse(result.data.resultData);
                        render.call(this);
                        bindHandlers.call(this, handlerConfig);
                    }
                }, this));
            } else {
                render.call(this);
                bindHandlers.call(this, handlerConfig);
            }
        }

        /**
        *   Increments the value of one serie of data(e.g. in a simple bar chart, the serie is a collumn) by incrementing it's value by the given value.
        *   @param {Object} data An object containing the data for this function.
        *   @... {Number} index The index of the serie in to update in the array of series.
        *   @... {Number} incrementBy The value to increment by.
        *   @function {void} ?
        */
        this.increment = function (data) {
            model.incrementSerie(data.index, data.incrementBy);
        };

        /**
        *   Updates a data item value in a serie (e.g. in a simple bar chart, the serie is a collumn).
        *   @param {Object} data An object containing the data for this function.
        *   @... {Number} index The index of the serie in to update in the array of series.
        *   @... {Number} value The value to increment by.
        *   @function {void} ?
        */
        this.update = function (data) {
            model.updateSerie(data.index, data.value);
        };

        /**
        *   Updates all the data on this chart.
        *   @param {Object} data An object containing the data for this function.
        *   @... {Array} series The new series to update the chart with.
        *   @function {void} ?
        */
        this.updateSeries = function (data) {
            model.updateSeries(data.series);
        };
    }
});
xRTML.TagManager.register({
    name: 'Execute',
    struct:
    /**
    *  Class which designates the handling of a xRTML message to a callback method.
    *  @class {private} xRTML.Tags.Execute
    *  @extends xRTML.Tags.Tag
    */
    function () {

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event.
        * @... {optional Function} callback The function called each time the tag receives a message.
        */
        this.init = function (tagObject) {
            this._super(tagObject);

            /**
            *   @property {Function} callback The function called each time the tag receives a message.
            */
            this.callback = xRTML.Common.Function.parse(tagObject.attribute('callback'), "message");
        };

        /**
        * @function {public void} ? Ensures the proper function delegation. Works as an entry-point method whenever an assigned trigger is raised.
        * @param {Object} data The xRTML message data.
        * @... {String} callback Name of the function to be called by this action.
        */
        this.process = function (data) {
            // Check if a method to call was specified in the message
            var callback = data.callback ? xRTML.Common.Function.parse(data.callback, "data") : this.callback;
            // Check if function is well formed
            (typeof callback == 'function') ? callback(data) : xRTML.Error.raise({ code: xRTML.Error.Codes.TAG_PROCESS, target: this, info: { message: 'The property "callback" is not defined in the Tag nor in the message.', className: 'xRTML.Tags.' + this.name, methodName: 'process'} });
        };
    }
});
xRTML.TagManager.register({
    name: 'Placeholder',
    struct:
    /**
    *  Class which allows the placement of a media file in a user selected DOM element. 
    *  @class {private} xRTML.Tags.Placeholder
    *  @extends xRTML.Tags.Tag
    */
    function () {

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event.
        * @... {optional String} template Structure that represents the way the xRTML message should be displayed in the DOM.
        */
        this.init = function (tagObject) {
            this._super(tagObject);

            this.template = tagObject.attribute('template');
            if (!this.template) xRTML.Console.error('Placeholder tag requires one and only one xrtml:template tag.');
        };

        /**
        * Attaches the content from xRTML Message in the targeted DOM object.
        * @function {public void} ?
        * @param {Object} data The xRTML message data with the values that will compose/fill the template. Refer to current tag's template to find out about this object's structure.
        */
        this.insert = function (data) {
            try {
                xRTML.Templating.applyBindings({
                    node: this.target[0],
                    binding: { template: { name: this.template, data: data} }
                });
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'insert' } });
            }
        };
    }
}); 
xRTML.TagManager.register({ name: 'Poll',
    struct:
    /**
    *  Manages a real-time voting poll.
    *  @class {private} xRTML.Tags.Poll
    *  @extends xRTML.Tags.Tag
    */
    function () {

        /**
        * @class xRTML.Tags.Poll.VoteItem
        */
        /**
        * @property {Number} id Identification of the vote item.
        */
        /**
        * @property {String} name Description of what the vote item represents.
        */
        /**
        * @property {Number} data Number of votes.
        */
        /**
        * @constructor xRTML.Tags.Poll.VoteItem
        * @param args Structure with the vote item definition.
        * @...{optional Number} Id Identification of the vote item.
        * @...{String} name Description of what the vote item represents.
        * @...{optional Number} data Number of votes. Defaults to zero.
        */

        // persistence
        var Storage = function (settings) {
            var userId = settings.userId,
                storageKey = settings.storageKey,
                storageDAO = settings.id ? xRTML.StorageManager.getById(settings.id) : null,
                namespace = 'Polls';

            // saves a vote made by the user
            this.saveVote = function (index, fn) {
                //Increment the number of votes associated with the voting item.
                storageDAO.incr({ namespace: namespace, pair: { k: storageKey + '#items#' + index + '#data', v: 1} }, function (result) {
                    if (!result.success) {
                        xRTML.Console.error('There was an error while trying to increment the vote in the Storage.');
                    }
                });
                // set the number of votes this user has made
                storageDAO.incr({ namespace: namespace, pair: { k: storageKey + '#user#' + userId, v: 1} }, function (result) {
                    if (!result.success) {
                        xRTML.Console.error('There was an error while trying to increment the vote in the Storage.');
                    }
                });

                //TEMP FIX: Set the local number of votes here. Later when we have a local Storage provider this will change.
                setLocalUserVotes(userId, getLocalUserVotes(userId) + 1);
            };

            // get the number of votes the user has made in this poll
            this.getUserVotes = function (fn) {
                storageDAO.get({ namespace: namespace, k: storageKey + '#user#' + userId }, function (result) {
                    if (result.success) {
                        fn(result.data.resultData ? parseInt(result.data.resultData) : 0);
                    }
                });
            };

            this.saveVoteItems = function (voteItems) {
                storageDAO.set({ namespace: namespace, pair: { k: storageKey + '#itemCount', v: voteItems.length} }, function (result) {
                    if (result.success) {
                        // build keys
                        var keys = [];
                        for (var i = 0; i < voteItems.length; ++i) {
                            keys.push({ k: storageKey + '#items#' + i + '#id', v: voteItems[i].id || i }); // TEMP FIX: id is the index for now...
                            keys.push({ k: storageKey + '#items#' + i + '#name', v: voteItems[i].name });
                            keys.push({ k: storageKey + '#items#' + i + '#data', v: voteItems[i].data });
                        }

                        storageDAO.set({ namespace: namespace, pairs: keys }, function (result) {
                            if (!result.success) {
                                xRTML.Console.error('There was an error while trying to save the votes in the Storage.');
                            }
                        });
                    }
                });
            };

            // gets all voting items along with the votes made in this poll
            this.getVoteItems = function (fn) {
                storageDAO.get({ namespace: namespace, k: storageKey + '#itemCount' }, function (result) {
                    var voteItems = [];
                    if (result.success) {
                        if (result.data.resultData != null) {
                            var count = parseInt(result.data.resultData),
                                keys = [];
                            for (var i = 0; i < count; i++) {
                                keys.push(storageKey + '#items#' + i + '#id');
                                keys.push(storageKey + '#items#' + i + '#name');
                                keys.push(storageKey + '#items#' + i + '#data');
                            }

                            storageDAO.get({ namespace: namespace, ks: keys }, function (result) {
                                if (result.success && result.data.resultData != null) {
                                    if (result.data.resultData[0] != null) {
                                        for (var i = 0; i < result.data.resultData.length; i = i + 3) {
                                            voteItems.push({ id: result.data.resultData[i], name: result.data.resultData[i + 1], data: parseInt(result.data.resultData[i + 2]) });
                                        }
                                    }
                                    fn(voteItems);
                                }
                            });
                        }
                        else {
                            fn(voteItems);
                        }
                    }
                });
            };

        },
        storage,

        //Single voting item data model.
        VoteItemModel = function (config) {
            this.id = config.id || 0;
            this.name = config.name || "";
            this.data = xRTML.Templating.observable(config.data || 0);
            this.target = config.target || "";
        },

        //To allow the model to send messages.
        sendMessage,

        //Contains all the logic for this tag that as any impact on data (so that we can apply logic from the template).
        Model = function (config) {

            xRTML.Event.extend(this);

            votesAllowed = config.votesAllowed ? xRTML.Common.Converter.toNumber(config.votesAllowed) : 1;
            userVotes = xRTML.Templating.observable(!!config.userVotes ? Number(config.userVotes) : 0);
            this.canVote = xRTML.Templating.observable(function () {
                return votesAllowed > userVotes();
            });

            // when the owner of this tag presses a vote button
            this.voteClick = xRTML.Common.Function.proxy(function (item) {
                // first check if the user has reached the maximum number of votes
                if (this.canVote()) {
                    userVotes(userVotes() + 1);
                    // update series
                    item.data(item.data() + 1);
                    // send message
                    sendMessage({ action: 'vote', data: { i: item.id} });

                    // store vote
                    if (storage)
                        storage.saveVote(item.id);

                    // update chart
                    if (chart) {
                        chart.incrementSingleDataItem({ i: item.id, d: 0, v: 1 });
                    }
                    // notify a vote has been made
                    this.fire({
                        ownervote: { item: item, allowed: this.canVote(), index: item.id }
                    });
                }
            }, this);

            /**
            *   @property {public Number} voteItems The vote items configuration for this Poll.
            */
            this.voteItems = new Array();
            for (var i = 0; i < config.voteItems.length; ++i) {
                var voteItem = config.voteItems[i];
                voteItem.id = parseInt(i);
                // data is optional, set it to zero if non-existent or if it isn't a integer (default starting number of votes per user)
                if (typeof voteItem.data === "undefined" || isNaN(voteItem.data)) {
                    voteItem.data = 0;
                }
                this.voteItems.push(new VoteItemModel(config.voteItems[i]));
            }

            this.vote = function (index) {
                // update series
                this.voteItems[index].data(this.voteItems[index].data() + 1);

                // update chart
                if (chart) {
                    chart.incrementSingleDataItem({ i: index, d: 0, v: 1 });
                }

                // notify a vote has been made by a user
                this.fire({
                    vote: { item: this.voteItems[index], allowed: true, index: index }
                });
            };
        },
        model,
        applyBindings = function (args) {
            xRTML.Templating.applyBindings({
                node: args.targetNode,
                binding: {
                    template: {
                        name: args.template,
                        data: args.model,
                        afterRender: xRTML.Common.Function.proxy(function () { this.fire({ rendered: {} }); }, this)
                    }
                }
            });

            //Bind event handlers
            model.bind({
                /**
                *   @event xRTML.Tags.Poll.evt_vote Event dispatched when a vote occurs on any Poll tag.
                *   @param {Object} e An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.
                *   @... {Object} target The target object that fired the event.
                *   @... {Object} item The item being voted on.
                *   @... {Boolean} allowed The target object that fired the event.
                *   @... {Number} index The index of the item being voted on.
                */
                vote: xRTML.Common.Function.parse(args.onVote),
                /**
                *   @event xRTML.Tags.Poll.evt_ownerVote Event dispatched when a vote occurs on this Poll tag.
                *   @param {Object} e An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.
                *   @... {Object} target The target object that fired the event.
                *   @... {Object} item The item being voted on.
                *   @... {Boolean} allowed The target object that fired the event.
                *   @... {Number} index The index of the item being voted on.
                */
                ownervote: xRTML.Common.Function.parse(args.onOwnerVote),
                /**
                *   @event xRTML.Tags.Poll.evt_rendered Event dispatched when the tag template has been rendered.
                *   @param {Object} e An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.
                *   @... {Object} target The target object that fired the event.
                */
                rendered: xRTML.Common.Function.parse(args.onRendered)
            });

            //Fire model events on the Tag.
            model.bind({
                vote: xRTML.Common.Function.proxy(function (e) { this.fire({ vote: e }); }, this),
                ownervote: xRTML.Common.Function.proxy(function (e) { this.fire({ ownervote: e }); }, this)
            });
        },
        getOrSetUserId = function (pollId) {
            var userId;
            if (localStorage && (window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase().indexOf('ipad') < 0)) {
                userId = localStorage.getItem('d734h89nU_' + pollId) || (localStorage.setItem('d734h89nU_' + pollId, xRTML.Common.Util.idGenerator(), localStorage.getItem('d734h89nU_' + pollId)));
            } else {
                //Set a cookie with 10 years validity.
                userId = xRTML.Common.Cookie.getCookie({ name: 'd734h89nU_' + pollId }) || (xRTML.Common.Cookie.setCookie({ name: 'd734h89nU_' + pollId, expiry: new Date(new Date().getTime() + 315576000000) }), xRTML.Common.Cookie.getCookie({ name: 'd734h89nU_' + pollId }));
            }
            return userId;
        },
        getLocalUserVotes = function (userId) {
            var votes;
            if (localStorage && (window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase().indexOf('ipad') < 0)) {
                votes = localStorage.getItem('d734h89nV_' + userId) || 0;
            } else {
                votes = xRTML.Common.Cookie.getCookie({ name: 'd734h89nV_' + userId }) || 0;
            }
            return votes;
        },
        setLocalUserVotes = function (userId, numberOfVotes) {
            if (localStorage && (window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase().indexOf('ipad') < 0)) {
                localStorage.setItem('d734h89nV_' + userId, numberOfVotes);
            } else {
                xRTML.Common.Cookie.setCookie({ name: 'd734h89nV_' + userId, value: numberOfVotes });
            }
        },
        chart;

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event.
        * @... {optional Function} onActive Event handler for the active event.
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event.
        * @... {optional Function} onDispose Event handler for the dispose event.
        * @... {optional String} template Structure that represents the way the Shoutbox is displayed in the DOM.
        * @... {optional String} storageId The id to the Storage component that is used by this tag to perform data related operations.
        * @... {optional String} storageKey The key that should be used to associate data in the Storage with this tag.
        * @... {optional String} userId Identification of the user owner of this Poll.
        * @... {optional xRTML.Tags.Poll.VoteItem[]} voteItems Selection of subjects to be voted on.
        * @... {optional Boolean} votesAllowed Number of votes allowed per user. 
        * @... {optional Function} onVote Event handler for the userLogin event. 
        * @... {optional Function} onOwnerVote Event handler for the userLogin event. 
        * @... {optional Function} onRendered Event handler for the userLogin event. 
        */
        this.init = function (tagObject) {
            this._super(tagObject);

            /**
            *   @property {public String} storageId The id to the Storage component that is used by this tag to perform data related operations.
            */
            this.storageId = tagObject.attribute('storageId');
            /**
            *   @property {public String} storageKey The key that should be used to associate data in the Storage with this tag.
            */
            this.storageKey = tagObject.attribute('storageKey');
            if (this.storageId) {
                storage = new Storage({ id: this.storageId, storageKey: this.storageKey || this.id, userId: (tagObject.attribute('userId') || getOrSetUserId(this.id)) });
            }

            var template = tagObject.attribute('template'),
                targetNode = this.target[0];

            //If the user does not configure a target use the template position in the DOM.
            if (!targetNode) {
                if (typeof template != 'undefined') {
                    var targetParent = xRTML.Sizzle('#' + template)[0];
                    targetNode = targetParent.parentNode.insertBefore(document.createElement("div"), targetParent);
                }
                else {
                    // exception
                }
            }

            //Define a default template if one is not given by the user.
            if (typeof template == 'undefined') {
                var defaultTemplate = '<div class="poll" id="poll1">';
                defaultTemplate += '    <div class="hgroup">';
                defaultTemplate += '        <h2>Poll</h2>';
                defaultTemplate += '       <h6>Powered by IBT\'s xRTML</h6>';
                defaultTemplate += '    </div>';
                defaultTemplate += '    <div class="bars">';
                defaultTemplate += '        <div class="graph" data-bind="foreach: voteItems">';
                defaultTemplate += '            <span data-bind="text: data"></span>';
                defaultTemplate += '        </div>';
                defaultTemplate += '    </div>';
                defaultTemplate += '    <div class="labels" data-bind="foreach: voteItems">';
                defaultTemplate += '        <label data-bind="text: name"></label>';
                defaultTemplate += '    </div>';
                defaultTemplate += '    <div class="vote" data-bind="foreach: voteItems, visible: canVote()">';
                defaultTemplate += '        <a href="javascript:return false;" data-bind="click: $parent.voteClick">Vote</a>';
                defaultTemplate += '    </div>';
                defaultTemplate += '    <div class="vote" data-bind="visible: !canVote()">';
                defaultTemplate += '        <span>Cannot vote again.</span>';
                defaultTemplate += '    </div>';
                defaultTemplate += '</div>';

                template = 'xRTML-Poll-Template';

                xRTML.Templating.inject({
                    id: template,
                    content: defaultTemplate
                });
            }

            /**
            * @property {readonly Number} The number of votes a user is able to give.
            */
            this.votesAllowed = tagObject.attribute('votesAllowed') || 1;

            var userVoteItems = tagObject.attribute('voteItems');

            // try to get the items from storage
            if (storage) {
                //Get the user\'s number of votes using storage.
                storage.getUserVotes(xRTML.Common.Function.proxy(function (userVotes) {
                    // retrieve items from storage
                    storage.getVoteItems(xRTML.Common.Function.proxy(function (voteItems) {
                        //If the storage returns data create the model with this data, if not save the new configuration supplied by the user and use that data.                        
                        model = new Model({
                            voteItems: (voteItems && voteItems.length > 0) ? voteItems : (storage.saveVoteItems(userVoteItems), userVoteItems),
                            votesAllowed: this.votesAllowed,
                            userVotes: userVotes
                        });

                        applyBindings.call(this, {
                            targetNode: targetNode,
                            model: model,
                            template: template,
                            onVote: tagObject.attribute('onVote'),
                            onOwnerVote: tagObject.attribute('onOwnerVote'),
                            onRendered: tagObject.attribute('onRendered')
                        });

                    }, this));
                }, this));
            }
            //If there aren't any stored items use the ones configured by the user.
            else {
                //Build the model
                model = new Model({
                    voteItems: userVoteItems,
                    votesAllowed: this.votesAllowed,
                    userVotes: getLocalUserVotes(tagObject.attribute('userId') || getOrSetUserId(this.id))
                });

                applyBindings.call(this, {
                    targetNode: targetNode,
                    model: model,
                    template: template,
                    onVote: tagObject.attribute('onVote'),
                    onOwnerVote: tagObject.attribute('onOwnerVote'),
                    onRendered: tagObject.attribute('onRendered')
                });
            }

            // use chart
            var chartSettings = tagObject.attribute('chartSettings');
            if (chartSettings) {
                chart = xRTML.TagManager.create({
                    name: 'Chart',
                    settings: chartSettings,
                    chartingplatform: 'highcharts'
                });
            }

            sendMessage = xRTML.Common.Function.proxy(function (m) { this.sendMessage(m); }, this);
        };

        /**
        *   Votes on an item of this Poll.
        *   @function {public void} ?
        *   @param {Object} data The xRTML message data.
        *   @... {Number} i The index of the item to vote on.
        */
        this.vote = function (data) {
            model.vote(data.i);
        };
    }
});
xRTML.TagManager.register({
    name: 'Repeater',
    struct:
    /**
    *  Manages an array like element where content is displayed in a user defined structure each time this tag is triggered.
    *  @class {private} xRTML.Tags.Repeater
    *  @extends xRTML.Tags.Tag
    */
    function () {

        var Data = function (maxItems) {
            this.MaxItems = maxItems;

            this.Items = xRTML.Templating.observable(new Array());

            this.add = function (data, index, removeIndex) {
                if (this.Items().length == this.MaxItems) {
                    this.remove((!removeIndex) ? this.Items().length - 1 : removeIndex);
                }

                if (index === -1) {
                    this.Items.push(data);
                } else {
                    this.Items.splice(index, 0, data)
                }
            };

            this.update = function (data, index) {
                if (index < this.Items().length) {
                    this.remove(index);
                    this.add(data, index, -1)
                }
            };

            this.remove = function (index) {
                if (index == -1 || index > this.Items().length) {
                    index = this.Items().length - 1;
                }
                this.Items.splice(index, 1);
            };
        }

        var _data = undefined;

        var validateIndex = function (value) {
            if ((!isNaN(parseInt(value))) && isFinite(value) && value >= 0) return value;
            return undefined;
        }

        var integerConverter = function (value, defaultValue) {
            if ((!isNaN(parseFloat(value))) && isFinite(value) && value >= 0) {
                return parseInt(value);
            }

            return defaultValue;
        }

        var indexConverter = function (idx, defaultValue) {

            var ret = integerConverter(idx, undefined);

            if (ret) return ret;

            var indexMapper = { 'begin': 0, 'end': -1 };

            return indexMapper.hasOwnProperty(idx) ? indexMapper[idx] : defaultValue;
        };

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event. 
        * @... {String} template Structure that represents the way the xRTML message is displayed in the DOM.
        * @... {optional Object[]} effects The effects that will run each time an element is added.
        * @... {optional Integer} index Default position in the target element where the new message should be inserted. If no index is specified, it defaults to 'begin' (0).
        * @... {optional Integer} removeIndex . Default position in the target element to remove if maxItems is reached. If no index is specified, it defaults to 'end'.
        * @... {optional Integer} maxItems Total elements that the target is allowed to have. If exceeded a removal will occur each time a new element is added. Defaults to infinity.
        */
        this.init = function (tagObject) {
            this._super(tagObject);

            /**
            *   @property {public String} template Structure that represents the way the xRTML message should be displayed in the DOM.
            */
            this.template = tagObject.attribute('template');
            xRTML.Common.Validator.validateRequired({ target: this, prop: "template" });

            /**
            *   @property {public Array} effects The effects that will run on each template structure.
            */
            this.effects = tagObject.attribute('effects');
            xRTML.Effect.extend(this);

            /**
            *   @property {public Number} index Default position in the target element where the new message should be inserted. If not specified, it defaults to 'begin'.
            */
            this.index = indexConverter(tagObject.attribute('index'), 0);

            /**    
            *   @property {public Number} removeIndex Default position in the target element to remove if maxItems is reached. If not specified, it defaults to 'end'.
            */
            this.removeIndex = indexConverter(tagObject.attribute('removeIndex'), -1);

            /**
            *   @property {public Number} maxItems Total elements that the target is allowed to have. If exceeded a removal will occur each time a new element is added. If not specified, it defaults to infinity.
            */
            this.maxItems = integerConverter(tagObject.attribute('maxItems'), Number.POSITIVE_INFINITY);

            _data = new Data(this.maxItems);

            try {
                xRTML.Templating.applyBindings({
                    node: this.target[0],
                    binding: {
                        template:
                    {
                        name: this.template,
                        foreach: _data.Items,
                        afterRender: xRTML.Common.Function.proxy(
                            function (elements, data) {
                                for (var i = 0; i < elements.length; i++) {
                                    if (elements[i].nodeName != "#text") {
                                        this.runEffects({ element: elements[i] });
                                    }
                                };
                            },
                            this
                        )
                    }
                    }
                });

            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'init'} });
            }
        };

        /**
        * @function {public void} ? Adds an element at the position given by an index. If the index is not provided in the message, the index defined in the tag is used.
        * @param {Object} data The xRTML message data.
        * @... {optional Integer} index Position of the element in the current target.
        * @... {Object} content Values that will compose/fill the template. Refer to current tag's template to find out about this object's structure.
        */
        this.insert = function (data) {
            try {

                _data.add(data.content, indexConverter(data.index, this.index), indexConverter(data.removeIndex, this.removeIndex));
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'init'} });
            }
        };

        /**
        * @function {public void} ? Updates the corresponding element given by an index. If the index is not provided in the message, the index defined in the tag is used.
        * @param {Object} data The xRTML message data.
        * @... {optional Integer} index Position of the element in the current target.
        * @... {Object} content Values that will compose/fill the template. Refer to current tag's template to find out about this object's structure.
        */
        this.update = function (data) {
            try {
                // Stop all effects and clear the queue of effects. (if a previous effect is running needs to be stopped)
                this.effectManager.stopAllEffectsAndClearQueue();

                _data.update(data.content, indexConverter(data.index, this.index));

                // Run all effects added previously to the queue.
                this.effectManager.runAllEffects();
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'init'} });
            }
        };

        /**
        * @function {public void} ? Removes the corresponding element given by an index. If the remove index is not provided in the message, the remove index defined in the tag is used. 
        * @param {Object} data The xRTML message data.
        * @... {optional Integer} removeIndex Position of the element in the current target.
        */
        this.remove = function (data) {
            try {
                _data.remove(indexConverter(data.removeIndex, this.removeIndex));
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'init'} });
            }
        };
    }
});
xRTML.TagManager.register({
    name: 'Shoutbox',
    struct:
    /**
    *  @class {private} xRTML.Tags.Shoutbox Chat tag that allows people to quickly leave messages on the website without registration.
    *  @extends xRTML.Tags.Tag
    */
    function () {
        // User Model
        var User = function (u) {
            if (typeof u != 'undefined') {
                this.id = u.id ? u.id : xRTML.Common.Util.guidGenerator();
                this.name = typeof u.name != 'undefined' && u.name != "" ? xRTML.Templating.observable(u.name) : xRTML.Templating.observable("Write a username...");
                this.logged = typeof u.logged != 'undefined' ? xRTML.Templating.observable(u.logged) : xRTML.Templating.observable(false);
            } else {
                this.id = xRTML.Common.Util.guidGenerator();
                this.name = xRTML.Templating.observable("Write a username...");
                this.logged = xRTML.Templating.observable(false);
            }
            this.isTyping = xRTML.Templating.observable(false);
        },
        // Message Model
            Message = function (config) {
                this.content = config.content;
                this.name = config.name;
                this.date = config.date ? new Date(config.date) : new Date().toString();
            },
        // Controller of the shoutbox
            Model = function (args) {

                xRTML.Event.extend(this);

                this.shoutboxContainer = args.shoutboxContainer;

                var defaultElementStyle = xRTML.Common.DOM.getStyle({ element: this.shoutboxContainer, rule: "display" });
                // the owner user            
                this.owner = new User();
                // message history
                this.messages = xRTML.Templating.observable([]);
                // current users
                this.users = xRTML.Templating.observable([]);
                if (args.userData) {
                    // update owner based on the cookie data
                    this.owner.id = args.userData.id;
                    this.owner.name(args.userData.name);
                    this.owner.logged(true);
                    this.users.push(this.owner);
                    this.fire({ sendMessage: { action: "userLogin", data: { id: this.owner.id, name: this.owner.name(), logged: true}} });
                }
                // the message current message content
                this.messageContent = xRTML.Templating.observable("");
                // handler to the loggin button
                this.logIn = function () {
                    if (this.owner.name() != "" && this.owner.name() != "Write a username...") {
                        var id = xRTML.Common.Util.guidGenerator();
                        this.owner.id = id;
                        this.owner.logged(true);
                        this.users.push(this.owner);
                        xRTML.Common.Cookie.setCookie({
                            name: cookieName,
                            value: xRTML.JSON.stringify({
                                id: this.owner.id,
                                name: this.owner.name()
                            })
                        });
                        if (dataAccess) {
                            dataAccess.fire({
                                userLogin: {
                                    user: {
                                        id: this.owner.id,
                                        name: this.owner.name(),
                                        logged: true,
                                        isTyping: false
                                    }
                                }
                            });
                        }
                        this.fire({ sendMessage: { action: "userLogin", data: { id: this.owner.id, name: this.owner.name(), logged: true}} });
                    }
                    return true;
                };
                // handler to the loggout button
                this.logOut = function (e) {
                    this.owner.logged(false);
                    xRTML.Common.Cookie.deleteCookie({ name: cookieName });
                    if (dataAccess) {
                        dataAccess.fire({ userLogout: { user: this.owner} });
                    }
                    this.fire({ sendMessage: { action: "userLogout", data: { id: this.owner.id}} });
                    this.owner.name("Write a username...");
                    return true;
                };
                // gets the user by its id
                this.getUserById = function (id) {
                    var users = this.users();
                    for (var i = 0; i < users.length; ++i) {
                        if (users[i].id == id) {
                            return users[i];
                        }
                    }
                    return null;
                };
                // add new user
                this.newUser = function (u) {
                    var user = this.getUserById(u.id);
                    if (user != null) {
                        user = new User(u);
                    } else {
                        this.users.push(new User(u));
                    }
                };
                // remove user
                this.removeUser = function (id) {
                    this.users.remove(function (user) {
                        return user.id == id;
                    });
                };
                // string with the users currently typing
                this.usersTyping = xRTML.Templating.observable(xRTML.Common.Function.proxy(function () {
                    var usersTyping = "";
                    var users = this.users();
                    if (users.length == 0) {
                        return "";
                    }
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        if (user.id != this.owner.id && user.isTyping()) {
                            usersTyping += user.name() + ", ";
                        }
                    }
                    return usersTyping != "" ? usersTyping.slice(0, usersTyping.length - 2) : "";
                }, this));
                // saves a new message in the message array
                this.newMessage = function (m) {
                    this.messages.push(m);
                    if (xRTML.Common.DOM.getStyle({ element: this.shoutboxContainer, rule: "display" }) == "none") {
                        this.show();
                    }
                };
                // sends a new shout
                this.sendMessage = function (args) {
                    if (this.messageContent().length > 0) {
                        var message = new Message({
                            name: args.name || this.owner.name(),
                            content: args.content || this.messageContent()
                        });
                        this.newMessage(message);
                        this.fire({ sendMessage: { action: "post", data: message} });
                        if (dataAccess) {
                            dataAccess.fire({ messagePost: { message: { user: this.owner, content: message}} });
                        }
                        this.messageContent("");
                    }
                };
                // lastTyping value sent
                var lastTypingValue = false;
                //send typing message
                this.sendTypingMessage = function () {
                    if (lastTypingValue != this.owner.isTyping()) {
                        lastTypingValue = !lastTypingValue;
                        this.fire({ sendMessage: { action: "typing", data: { id: this.owner.id, name: this.owner.name(), logged: true, typing: this.owner.isTyping()}} });
                    }
                };
                // gets the array index of the user given its id
                this.getUserIndexById = function (id) {
                    var users = this.users();
                    for (var i = 0; i < users.length; ++i) {
                        if (users[i].id == id) {
                            return i;
                        }
                    }
                };
                //set user typing
                this.setUserTyping = function (message) {
                    var user = this.getUserById(message.id);
                    if (user) {
                        user.isTyping(message.typing);
                    }
                };
                //close the shoutbox
                this.close = function () {
                    this.shoutboxContainer.style.display = "none";
                    this.fire({ close: {} });
                    return true;
                };
                //show the shoutbox container
                this.show = function () {
                    this.shoutboxContainer.style.display = defaultElementStyle;
                    this.fire({ show: {} });
                };
            },
        // Custom Binding for typing detection
            UserTypingBinding = function () {
                // reference to the owner
                var owner;
                // time value to apply in the timeout
                var time;
                // reference to the timeout
                var timerReference = null;
                // reference to the model
                var model;

                return {
                    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        time = parseInt(valueAccessor());
                        owner = viewModel.owner;
                        model = viewModel;

                        xRTML.Event.bind(element, {
                            keypress: function (e) {
                                var evt = e ? e : event;
                                var elem = evt.srcElement ? evt.srcElement : evt.target;
                                // Firefox doesn't have the keycode attribute, that's why we need to do this check
                                var key = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
                                // user pressed the 'Enter' key (send message if it has content)                            
                                if (key == 13) {
                                    model.sendMessage({
                                        name: owner.name(),
                                        content: model.messageContent()
                                    });
                                    owner.isTyping(false);
                                    clearTimeout(timerReference);
                                    model.sendTypingMessage();
                                    return true;
                                }

                                owner.isTyping(true);
                                if (timerReference != null) {
                                    clearTimeout(timerReference);
                                }
                                timerReference = setTimeout(function () {
                                    owner.isTyping(false);
                                    timerReference = null;
                                    model.sendTypingMessage();
                                }, time);

                                return true;
                            },
                            keydown: function (e) {
                                var evt = e ? e : event;
                                var key = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
                                var elem = evt.srcElement ? evt.srcElement : evt.target;
                                // backspace
                                if (key == 8 || key == 46) {
                                    owner.isTyping(model.messageContent().length > 0);

                                    if (timerReference != null) {
                                        clearTimeout(timerReference);
                                    }

                                    timerReference = setTimeout(function () {
                                        owner.isTyping(false);
                                        timerReference = null;
                                    }, time);

                                }
                                return true;
                            },
                            keyup: function (e) {
                                var evt = e ? e : event;
                                var key = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
                                var elem = evt.srcElement ? evt.srcElement : evt.target;
                                model.messageContent(elem.value.replace(/[\n\r\t]/g, ''));
                                if (key == 8 || key == 46) {
                                    owner.isTyping(model.messageContent().length > 0);

                                    if (timerReference != null) {
                                        clearTimeout(timerReference);
                                        timerReference = null;
                                    }

                                    timerReference = setTimeout(function () {
                                        owner.isTyping(false);
                                        timerReference = null;
                                    }, time);
                                }

                                model.sendTypingMessage();

                                return true;
                            }
                        });
                    }
                }
            },
        //Data Access Object constructor for this tag. Provides methods to handle data specific to this tag's Model.
            DAO = function (args) {
                xRTML.Event.extend(this);

                //The Storage component used by this tag to perform data related operations.
                var storage = xRTML.StorageManager.getById(args.id),
                    storageKey = args.key;

                this.getAndUpdateUsers = function () {
                    storage.get({ namespace: 'Shoutbox', k: storageKey + '#usersCount' }, function (result) {
                        if (Number(result.data.resultData)) { //If length is 0(falsy) no need for extra requests.

                            //Prepare the keys to get all the users.                            
                            var ks = [];
                            for (var i = 1; i <= Number(result.data.resultData); i++)
                                ks.push(storageKey + '#users#' + i);

                            storage.get({ namespace: 'Shoutbox', ks: ks }, function (result) {
                                if (result.data.resultData) {
                                    //Got Users.
                                    for (var i = 0, len = result.data.resultData.length; i < len; i++) {
                                        if (result.data.resultData[i] != null) {
                                            model.newUser(xRTML.JSON.parse(result.data.resultData[i]));
                                        }
                                    }
                                }
                            });
                        }
                    });
                };

                this.getAndUpdateMessages = function () {
                    storage.get({ namespace: 'Shoutbox', k: storageKey + '#messagesCount' }, function (result) {
                        if (result.data.resultData) { //If length is 0(falsy) no need for extra requests.                            
                            //Prepare the keys to get all the messages.
                            var ks = [];
                            for (var i = 1; i <= Number(result.data.resultData); i++)
                                ks.push(storageKey + '#messages#' + i);

                            storage.get({ namespace: 'Shoutbox', ks: ks }, function (result) {
                                if (result.data.resultData) { //Got Messages.
                                    for (var i = 0, len = result.data.resultData.length; i < len; i++) {

                                        model.newMessage(new Message(xRTML.JSON.parse(result.data.resultData[i]).content));

                                    }
                                }
                            });
                        }
                    });
                };

                this.addUser = function (user) {
                    storage.incr({ namespace: 'Shoutbox', pair: { k: storageKey + '#usersCount', v: 1} }, function (result) {
                        storage.set({ namespace: 'Shoutbox', pair: { k: storageKey + '#users#' + result.data.resultData, v: xRTML.JSON.stringify(user)} }, function (result) { });
                    });
                };

                this.removeUser = function (userId) {
                    storage.get({ namespace: 'Shoutbox', k: storageKey + '#usersCount' }, function (result) {
                        storage.del({ namespace: 'Shoutbox', k: storageKey + '#users#' + (model.getUserIndexById(userId) + 1) }, function (result) { });
                        //storage.incr({ namespace: 'Shoutbox', pair: { k: storageKey + '#usersCount', v: -1} }, function (result) { });
                    });
                };

                this.addMessage = function (message) {
                    storage.incr({ namespace: 'Shoutbox', pair: { k: storageKey + '#messagesCount', v: 1} }, function (result) {
                        storage.set({ namespace: 'Shoutbox', pair: { k: storageKey + '#messages#' + result.data.resultData, v: xRTML.JSON.stringify(message)} }, function (result) { });
                    });
                }
            },
            model,
            cookieName,
            dataAccess;

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event. 
        * @... {optional String} template Structure that represents the way the Shoutbox is displayed in the DOM.
        * @... {optional String} storageId The id to the Storage component that is used by this tag to perform data related operations.
        * @... {optional String} storageKey The key that should be used to associate data in the Storage with this tag.
        * @... {optional Function} onMessage Event handler for the message event. 
        * @... {optional Function} onMessagePost Event handler for the messagePost event. 
        * @... {optional Function} onUserLogin Event handler for the userLogin event. 
        * @... {optional Function} onUserLogout Event handler for the userLogout event. 
        * @... {optional Function} onUserTyping Event handler for the userTyping event. 
        * @... {optional Function} onClose Event handler for the close event. 
        * @... {optional Function} onShow Event handler for the show event. 
        */
        this.init = function (tagObject) {

            this._super(tagObject);

            xRTML.Templating.bindingHandlers.userTypingBinding = new UserTypingBinding();

            /**
            *   @property {public String} template Structure that represents the way the xRTML Toast should be displayed in the DOM.
            */
            this.template = tagObject.attribute('template');
            if (!this.template) {
                var defaultTemplate = ' <div class="xRTML-Shoutbox">';
                defaultTemplate += '        <div class="xRTML-Shoutbox-Close" data-bind="click: close">X</div>';
                defaultTemplate += '        <div class="xRTML-Shoutbox-NotificationContainer" data-bind="visible: usersTyping().length > 0">';
                defaultTemplate += '            <span class="xRTML-Shoutbox-NotificationContainer-UsersTypingLabel">Users typing: </span>';
                defaultTemplate += '            <span class="xRTML-Shoutbox-NotificationContainer-UsersTyping" data-bind="text: usersTyping()"></span>';
                defaultTemplate += '        </div>';
                defaultTemplate += '        <div class="xRTML-Shoutbox-ShoutsContainer" data-bind="template: { name: \'xrtml-shouts-template\', foreach: messages }"></div>';
                defaultTemplate += '        <div class="xRTML-Shoutbox-LogInForm" data-bind="visible: !owner.logged()">';
                defaultTemplate += '            <input class="xRTML-Shoutbox-LogInForm-UserName" type="text" data-bind="value: owner.name"></input>';
                defaultTemplate += '            <input class="xRTML-Shoutbox-LogInForm-LogIn" type="button" value="Log In" data-bind="click: logIn"></input>';
                defaultTemplate += '        </div>';
                defaultTemplate += '        <div class="xRTML-Shoutbox-ShoutForm" data-bind="visible: owner.logged()">';
                defaultTemplate += '            <label class="xRTML-Shoutbox-ShoutForm-UserNameLabel" data-bind="text: owner.name()"></label>';
                defaultTemplate += '            <textarea class="xRTML-Shoutbox-ShoutForm-ShoutContent" data-bind="value: messageContent, userTypingBinding: 3000 " rows="1" cols="50"></textarea>';
                defaultTemplate += '            <input class="xRTML-Shoutbox-ShoutForm-Send" type="button" value="Send" data-bind="click: sendMessage"></input>';
                defaultTemplate += '            <input class="xRTML-Shoutbox-ShoutForm-LogOut" type="button" value="Log Out" data-bind="click: logOut"></input>';
                defaultTemplate += '        </div>';
                defaultTemplate += '    </div>';

                var defaultShoutsTemplate = '   <p class="xRTML-Shoutbox-Shout">';
                defaultShoutsTemplate += '          <strong class="xRTML-Shoutbox-Shout-UserName" data-bind="text: name"></strong>';
                defaultShoutsTemplate += '          <span class="xRTML-Shoutbox-Shout-Message" data-bind="text: content"></span>';
                defaultShoutsTemplate += '      <p>';

                xRTML.Templating.inject({
                    id: 'xrtml-shoutbox-template',
                    content: defaultTemplate
                });

                xRTML.Templating.inject({
                    id: 'xrtml-shouts-template',
                    content: defaultShoutsTemplate
                });

                this.template = 'xrtml-shoutbox-template';
            }

            /**
            *   @property {public String} storageId The id to the Storage component that is used by this tag to perform data related operations.
            */
            this.storageId = tagObject.attribute('storageid');

            /**
            *   @property {public String} storageKey The key that should be used to associate data in the Storage with this tag.
            */
            this.storageKey = tagObject.attribute('storagekey');

            if (this.storageId && this.storageKey) {
                dataAccess = new DAO({ id: this.storageId, key: this.storageKey });
                dataAccess.bind({
                    //After the tag has been initialized set the initial data.
                    requestData: function () {
                        dataAccess.getAndUpdateUsers();
                        dataAccess.getAndUpdateMessages();
                    },
                    //When a new message is posted persist it.
                    messagePost: xRTML.Common.Function.proxy(function (e) {
                        dataAccess.addMessage(e.message);
                        this.fire({ sendMessage: { action: 'post', data: e.message} });
                        this.fire({ messagePost: { message: e.message.content} });
                    }, this),

                    //When a user logs in persist the new user.
                    userLogin: function (e) {
                        dataAccess.addUser(e.user);
                    },
                    //When a user logs out remove the user.
                    userLogout: function (e) {
                        dataAccess.removeUser(e.user.id);
                    }
                });

                this.bind({
                    //After the tag has been initialized set the initial data.
                    postinit: function () {
                        dataAccess.fire({ requestData: {} });
                    }
                });
            }
            else {
                xRTML.Console.warn('Tag ' + this.name + ' ' + this.id + ': Storage was not configured. The data will not be persistent.');
            }

            // tag events
            var toFunction = xRTML.Common.Function.parse;
            this.bind({
                message: toFunction(tagObject.attribute('onMessage')),
                messagePost: toFunction(tagObject.attribute('onMessagePost')),
                userLogin: toFunction(tagObject.attribute('onUserLogin')),
                userLogout: toFunction(tagObject.attribute('onUserLogout')),
                userTyping: toFunction(tagObject.attribute('onUserTyping')),
                close: toFunction(tagObject.attribute('onClose')),
                show: toFunction(tagObject.attribute('onShow'))
            });

            cookieName = (function (cookiePrefix) {
                for (var i = 0; i < this.triggers.length; ++i) {
                    cookiePrefix += "_" + this.triggers[i].name;
                }
                return cookiePrefix;
            }).call(this, 'xRTMLShoutBox');

            // check to see if the user already has a cookie set. If so, it means he was already in a conversation
            var cookie = xRTML.Common.Cookie.getCookie({ name: cookieName });

            var args = { shoutboxContainer: this.target[0] };

            if (cookie) {
                args.userData = xRTML.JSON.parse(cookie);
            }
            model = new Model(args);

            model.bind({
                close: xRTML.Common.Function.proxy(function () {
                    this.fire({ close: {} });
                }, this),
                show: xRTML.Common.Function.proxy(function () {
                    this.fire({ show: {} });
                }, this),
                sendMessage: xRTML.Common.Function.proxy(function (e) {
                    this.sendMessage(e);
                }, this)
            });

            try {
                xRTML.Templating.applyBindings({
                    node: this.target[0],
                    binding: {
                        template: {
                            name: this.template,
                            data: model
                        }
                    }
                });
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'init'} });
            }
        };
        /**
        * @function {public} ? Notifies a message has been received.
        * @param {Object} data The xRTML message data.
        * @... {String} content Message written by the user.
        * @... {String} name User's name.
        * @... {optional String} date The date the message was written.
        */
        this.post = function (data) {
            try {
                model.newMessage(new Message(data));
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'post'} });
            }
            this.fire({ message: data });
        };
        /**
        * @function {public} ? Notifies of a user that has joined the conversation.
        * @param {Object} data The xRTML message data.
        * @... {optional String} id Identification of the tag owned by the user.
        * @... {optional String} name User's name.
        */
        this.userLogin = function (data) {
            var user = new User(data)
            try {
                model.newUser(user);
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'login'} });
            }
            this.fire({ userLogin: { user: { id: user.id, isTyping: user.isTyping(), logged: user.logged(), name: user.name()}} });
        };
        /**
        * @function {public} ? Notifies a user has left the conversation.
        * @param {Object} data The xRTML message data.
        * @... {String} id Identification of the tag owned by the user.
        */
        this.userLogout = function (message) {
            var user = model.getUserById(message.id);
            try {
                model.removeUser(message.id);
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'logout'} });
            }
            this.fire({ userLogout: { user: { id: user.id, isTyping: user.isTyping(), logged: user.logged(), name: user.name()}} });
        };
        /**
        * @function {public} ? Alerts all users when a user is typing a message.
        * @param {Object} data The xRTML message data.
        * @... {String} id Identification of the tag owned by the user.
        * @... {Boolean} typing Flag indicating if the user is writing.
        */
        this.typing = function (message) {
            var user = model.getUserById(message.id);
            if (user == null) {
                model.newUser({
                    id: message.id,
                    name: message.name,
                    logged: true
                });
            }
            try {
                model.setUserTyping(message);
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'typing'} });
            }
            var user = model.getUserById(message.id);
            this.fire({ userTyping: { user: { id: user.id, isTyping: user.isTyping(), logged: user.logged(), name: user.name()}} });
        };
        /**
        * @function {public} ? Log in the owner of the Shoutbox programmatically.        
        * @param {Object} args The arguments to perform the login.
        * @... {String} id Identification of user.
        * @... {String} name The name of the user.
        */
        this.login = function (args) {
            if (!model.owner || (model.owner && model.owner.logged())) {
                return;
            }
            model.owner.id = args.id;
            model.owner.name(args.name);
            model.owner.logged(true);
            model.users.push(model.owner);

            xRTML.Common.Cookie.setCookie({
                name: cookieName,
                value: xRTML.JSON.stringify({
                    id: model.owner.id,
                    name: model.owner.name()
                })
            });
            model.fire({ sendMessage: { action: "userLogin", data: { id: model.owner.id, name: model.owner.name(), logged: true}} });
            return;
        };

        /**
        * @function {public} ? Log out the owner of the Shoutbox programmatically.        
        */
        this.logout = function () {
            if (!model.owner || (model.owner && !model.owner.logged())) {
                return;
            }
            model.owner.logged(false);
            xRTML.Common.Cookie.deleteCookie({ name: cookieName });
            if (dataAccess) {
                dataAccess.fire({ userLogout: { user: model.owner} });
            }
            model.fire({ sendMessage: { action: "userLogout", data: { id: model.owner.id}} });
            model.owner.name("Write a username...");
            return;
        }
    }
});
xRTML.TagManager.register({
    name: 'Toast',
    struct:

    /**
    *  xRTML Tag for displaying toasts on the page. It uses TinyBox 2 to display banners. Its CSS and images will be used.
    *  @class {private} xRTML.Tags.Toast
    *  @extends xRTML.Tags.Tag
    */
    function () {

        var ToastModel = function (config) {

            var Banner = (function () {
                var TINY = {};
                TINY.box = function () {
                    var j, m, b, g, v, p = 0;
                    return {
                        show: function (o) {
                            v = { opacity: 70, close: 1, animate: 1, fixed: 1, mask: 1, maskid: '', boxid: '', topsplit: 2, url: 0, post: 0, height: 0, width: 0, html: 0, iframe: 0 };
                            for (s in o) { v[s] = o[s] }
                            if (!p) {
                                j = document.createElement('div'); j.className = 'xRTML-Toast-Banner';
                                p = document.createElement('div'); p.className = 'xRTML-Toast-Banner-Loading';
                                b = document.createElement('div'); b.className = 'xRTML-Toast-Banner-Content';
                                m = document.createElement('div'); m.className = 'xRTML-Toast-Banner-Mask';
                                g = document.createElement('div'); g.className = 'xRTML-Toast-Banner-Close'; g.v = 0;
                                document.body.appendChild(m); document.body.appendChild(j); j.appendChild(p); p.appendChild(b);
                                m.onclick = g.onclick = TINY.box.hide; window.onresize = TINY.box.resize
                            } else {
                                j.style.display = 'none'; clearTimeout(p.ah); if (g.v) { p.removeChild(g); g.v = 0 }
                            }
                            p.id = v.boxid; m.id = v.maskid; j.style.position = v.fixed ? 'fixed' : 'absolute';
                            if (v.html && !v.animate) {
                                p.style.backgroundImage = 'none'; b.innerHTML = v.html; b.style.display = '';
                                p.style.width = v.width ? v.width + 'px' : 'auto'; p.style.height = v.height ? v.height + 'px' : 'auto'
                            } else {
                                b.style.display = 'none';
                                if (!v.animate && v.width && v.height) {
                                    p.style.width = v.width + 'px'; p.style.height = v.height + 'px'
                                } else {
                                    p.style.width = p.style.height = '100px'
                                }
                            }
                            if (v.mask) { this.mask(); this.alpha(m, 1, v.opacity) } else { this.alpha(j, 1, 100) }
                            if (v.autohide) { p.ah = setTimeout(TINY.box.hide, 1000 * v.autohide) } else { document.onkeyup = TINY.box.esc }
                        },
                        fill: function (c, u, k, a, w, h) {
                            if (u) {
                                if (v.image) {
                                    var i = new Image(); i.onload = function () { w = w || i.width; h = h || i.height; TINY.box.psh(i, a, w, h) }; i.src = v.image
                                } else if (v.iframe) {
                                    this.psh('<iframe src="' + v.iframe + '" width="' + v.width + '" frameborder="0" height="' + v.height + '"></iframe>', a, w, h)
                                } else {
                                    var x = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                                    x.onreadystatechange = function () {
                                        if (x.readyState == 4 && x.status == 200) { p.style.backgroundImage = ''; TINY.box.psh(x.responseText, a, w, h) }
                                    };
                                    if (k) {
                                        x.open('POST', c, true); x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); x.send(k)
                                    } else {
                                        x.open('GET', c, true); x.send(null)
                                    }
                                }
                            } else {
                                this.psh(c, a, w, h)
                            }
                        },
                        psh: function (c, a, w, h) {
                            if (typeof c == 'object') { b.appendChild(c) } else { b.innerHTML = c }
                            var x = p.style.width, y = p.style.height;
                            if (!w || !h) {
                                p.style.width = w ? w + 'px' : ''; p.style.height = h ? h + 'px' : ''; b.style.display = '';
                                if (!h) { h = parseInt(b.offsetHeight) }
                                if (!w) { w = parseInt(b.offsetWidth) }
                                b.style.display = 'none'
                            }
                            p.style.width = x; p.style.height = y;
                            this.size(w, h, a)
                        },
                        esc: function (e) { e = e || window.event; if (e.keyCode == 27) { TINY.box.hide() } },
                        hide: function () {
                            if (xRTML.Sizzle("#xrtml-video-ytplayer").length > 0) {
                                swfobject.removeSWF("xrtml-video-ytplayer");
                            }
                            TINY.box.alpha(j, -1, 0, 3); document.onkeypress = null; if (v.closejs) { v.closejs() }
                            xRTML.Sizzle(".xRTML-Toast-Banner")[0].parentNode.removeChild(xRTML.Sizzle(".xRTML-Toast-Banner")[0]);
                            xRTML.Sizzle(".xRTML-Toast-Banner-Mask")[0].parentNode.removeChild(xRTML.Sizzle(".xRTML-Toast-Banner-Mask")[0]);

                        },
                        resize: function () { TINY.box.pos(); TINY.box.mask() },
                        mask: function () { m.style.height = this.total(1) + 'px'; m.style.width = this.total(0) + 'px' },
                        pos: function () {
                            var t;
                            if (typeof v.top != 'undefined') { t = v.top } else { t = (this.height() / v.topsplit) - (j.offsetHeight / 2); t = t < 20 ? 20 : t }
                            if (!v.fixed && !v.top) { t += this.top() }
                            j.style.top = t + 'px';
                            j.style.left = typeof v.left != 'undefined' ? v.left + 'px' : (this.width() / 2) - (j.offsetWidth / 2) + 'px'
                        },
                        alpha: function (e, d, a) {
                            clearInterval(e.ai);
                            if (d) { e.style.opacity = 0; e.style.filter = 'alpha(opacity=0)'; e.style.display = 'block'; TINY.box.pos() }
                            e.ai = setInterval(function () { TINY.box.ta(e, a, d) }, 20)
                        },
                        ta: function (e, a, d) {
                            var o = Math.round(e.style.opacity * 100);
                            if (o == a) {
                                clearInterval(e.ai);
                                if (d == -1) {
                                    e.style.display = 'none';
                                    e == j ? TINY.box.alpha(m, -1, 0, 2) : b.innerHTML = p.style.backgroundImage = ''
                                } else {
                                    if (e == m) {
                                        this.alpha(j, 1, 100)
                                    } else {
                                        j.style.filter = '';
                                        TINY.box.fill(v.html || v.url, v.url || v.iframe || v.image, v.post, v.animate, v.width, v.height)
                                    }
                                }
                            } else {
                                var n = a - Math.floor(Math.abs(a - o) * .5) * d;
                                e.style.opacity = n / 100; e.style.filter = 'alpha(opacity=' + n + ')'
                            }
                        },
                        size: function (w, h, a) {
                            if (a) {
                                clearInterval(p.si); var wd = parseInt(p.style.width) > w ? -1 : 1, hd = parseInt(p.style.height) > h ? -1 : 1;
                                p.si = setInterval(function () { TINY.box.ts(w, wd, h, hd) }, 20)
                            } else {
                                p.style.backgroundImage = 'none'; if (v.close) { p.appendChild(g); g.v = 1 }
                                p.style.width = w + 'px'; p.style.height = h + 'px'; b.style.display = ''; this.pos();
                                if (v.openjs) { v.openjs() }
                            }
                        },
                        ts: function (w, wd, h, hd) {
                            var cw = parseInt(p.style.width), ch = parseInt(p.style.height);
                            if (cw == w && ch == h) {
                                clearInterval(p.si); p.style.backgroundImage = 'none'; b.style.display = 'block'; if (v.close) { p.appendChild(g); g.v = 1 }
                                if (v.openjs) { v.openjs() }
                            } else {
                                if (cw != w) { p.style.width = (w - Math.floor(Math.abs(w - cw) * .6) * wd) + 'px' }
                                if (ch != h) { p.style.height = (h - Math.floor(Math.abs(h - ch) * .6) * hd) + 'px' }
                                this.pos()
                            }
                        },
                        top: function () { return document.documentElement.scrollTop || document.body.scrollTop },
                        width: function () { return self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth },
                        height: function () { return self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight },
                        total: function (d) {
                            var b = document.body, e = document.documentElement;
                            return d ? Math.max(Math.max(b.scrollHeight, e.scrollHeight), Math.max(b.clientHeight, e.clientHeight)) :
			Math.max(Math.max(b.scrollWidth, e.scrollWidth), Math.max(b.clientWidth, e.clientWidth))
                        }
                    }
                } ();
                xRTML.Event.extend(this);

                var privateShow = function (toast) {
                    tyniboxObj = {
                        autohide: toast.bannerAutoHide,
                        animate: true,
                        openjs: function (e) {
                            _model.bannerActive = true;
                            _model.fire({ bannerDisplay: { target: toast} });
                        },
                        closejs: function () {
                            _model.bannerActive = false;
                            _model.fire({ bannerClose: { target: toast} });
                        }
                    }

                    if (toast.bannerWidth) {
                        tyniboxObj.width = toast.bannerWidth;
                    }
                    if (toast.bannerHeight) {
                        tyniboxObj.height = toast.bannerHeight;
                    }

                    switch (toast.bannerType) {
                        default:
                        case "image":
                            {
                                tyniboxObj.image = toast.bannerUrl;
                                break;
                            }
                        case "html":
                            {
                                tyniboxObj.html = toast.bannerContent;
                                break;
                            }
                        case "iframe":
                            {
                                tyniboxObj.iframe = toast.bannerUrl;
                            }
                        case "flash":
                            {
                                var content = '<object type="application/x-shockwave-flash" data="' + toast.bannerUrl + '"';
                                if (toast.bannerWidth) {
                                    content += 'width="' + toast.bannerWidth + '"'
                                }
                                if (toast.bannerHeight) {
                                    content += 'height="' + toast.bannerHeight + '"'
                                }
                                content += '><param name="movie" value="' + toast.bannerUrl + '" />';

                                content += '</object>';
                                tyniboxObj.html = content;
                                break;
                            }
                        case "video":
                            {
                                if (typeof toast.bannerSource != 'undefined') {

                                    if (xRTML.Common.Array.contains({ items: xRTML.TagManager.getClasses(), obj: "Video" })) {

                                        var content = '<div id="xRTML-Toast-Banner-' + toast.id + '" ';

                                        var style = "";
                                        if (toast.bannerWidth) {
                                            style += "width:" + toast.bannerWidth + "px;"
                                        } else {
                                            style += "width: 400px;"
                                        }
                                        if (toast.bannerHeight) {
                                            style += "height:" + toast.bannerHeight + "px;";
                                        } else {
                                            style += "height: 400px;";
                                        }
                                        if (style != "") {
                                            content += 'style="' + style + '"';
                                        }

                                        content += '></div>';
                                        tyniboxObj.html = content;

                                        //instantiate video tag
                                        tyniboxObj.openjs = xRTML.Common.Function.proxy(function () {

                                            var videoJSON = {
                                                name: 'Video',
                                                controlsBar: false,
                                                target: "#xRTML-Toast-Banner-" + this.id,
                                                width: this.bannerWidth || 400,
                                                height: this.bannerHeight || 400,
                                                keepRatio: false
                                            };

                                            var tag = xRTML.TagManager.create(videoJSON);

                                            tag.play(toast.bannerSource);

                                            _model.fire({ bannerDisplay: { target: toast} });
                                        }, toast);
                                    } else {
                                        xRTML.Console.error('The xRTML video tag must be added in order to create video banners.');
                                    }
                                }
                                break;
                            }
                    }
                    TINY.box.show(tyniboxObj);
                };

                var privateHide = function () {
                    TINY.box.hide();
                };

                return {
                    show: privateShow,
                    hide: privateHide
                }
            })();

            this.id = xRTML.Common.Util.idGenerator();
            this.title = config.title;
            this.text = config.text;
            this.displayToast = config.displayToast;
            this.displayBanner = config.displayBanner;
            this.timeToLive = config.timeToLive;
            this.bannerType = config.bannerType;
            this.bannerUrl = config.bannerUrl;
            this.bannerContent = config.bannerContent;
            this.bannerWidth = config.bannerWidth;
            this.bannerHeight = config.bannerHeight;
            this.bannerAutoHide = config.bannerAutoHide;
            this.destinationUrl = config.destinationUrl;
            this.bannerSource = config.bannerSource;
            this.metaData = config.metaData;

            this.close = function (closedByTimeOut) {
                if (typeof closedByTimeOut != 'boolean') {
                    _model.destroy(this, false);
                } else {
                    _model.destroy(this, closedByTimeOut);
                }
                clearTimeout(this.timeoutReference);
            };

            this.showBanner = function () {
                if (this.displayToast) {
                    this.close(false);
                }
                if (this.displayBanner) {
                    Banner.show(this);
                    /*var tboxChilds = xRTML.Sizzle(".xRTML-Toast-Banner * :not(.xRTML-Toast-Banner-Close)");

                    var clickFunction = xRTML.Common.Function.proxy(function () {
                    Banner.hide();
                    this.openUrl();
                    for (var i = 0; i < tboxChilds.length; i++) {
                    xRTML.Event.unbind(tboxChilds[i], { click: clickFunction });
                    }
                    }, this);

                    for (var i = 0; i < tboxChilds.length; i++) {
                    xRTML.Event.bind(tboxChilds[i], { click: clickFunction });
                    }*/
                } else {
                    this.openUrl();
                }
            };

            if (this.displayToast) {
                this.timeoutReference = setTimeout(xRTML.Common.Function.proxy(function () {
                    this.close(true);
                }, this), this.timeToLive);
            }

            this.openUrl = function () {
                if (this.destinationUrl) {
                    window.open(this.destinationUrl, '_blank');
                    _model.fire({ urlOpen: { target: this} });
                }
            };
        };

        var Model = function () {

            xRTML.Event.extend(this);

            this.toasts = xRTML.Templating.observable(new Array());

            this.create = function (args) {
                var newToast = new ToastModel(args);

                if (args.displayToast) {
                    if (args.index == "end") {
                        this.toasts.push(newToast);
                    } else {
                        this.toasts.splice(0, 0, newToast);
                    }
                    this.fire({ toastDisplay: { target: newToast} });
                } else {
                    newToast.showBanner();
                }
            };

            this.destroy = function (toast, closedByTimeOut) {
                this.toasts.remove(toast);
                this.fire({ toastClose: { target: toast, closedByTimeOut: !!closedByTimeOut} });
            };

            this.bannerActive = false;
        };

        var _model = null;

        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event. 
        * @... {optional String} positionAt Defines where and how the toast should be positioned. The possible types are: coordinates, topleft, topright, bottomleft, bottomright. Defaults to bottomright. 
        * @... {optional String} template Structure that represents the way the xRTML Toast should be displayed in the DOM. Defaults to xRTML-Toast-Template.
        * @... {optional String[]} mediaUrls A list of urls for a notification sound in various formats (commonly one MP3 and one OGG would be configured so that most major browsers can play the notification).  
        * @... {optional Object[]} effects The effects that will run each time an element is added.
        * @... {optional Function} onToastDisplay Event handler assigned to the toastDisplay event.
        * @... {optional Function} onToastClose Event handler assigned to the toastClose event.
        * @... {optional Function} onBannerDisplay Event handler assigned to the bannerDisplay event. 
        * @... {optional Function} onBannerClose Event handler assigned to the bannerClose event.
        * @... {optional Function} onUrlOpen Event handler assigned to the urlOpen event.
        * @throws xRTMLError xRTML specific error containing name, cause and stack trace.
        */
        this.init = function (tagObject) {

            this._super(tagObject);
            /**
            *   @property {public String} positionAt Defines where and how the toast should be positioned. The possible types are: coordinates, topleft, topright, bottomleft, bottomright. Defaults to bottomright. 
            */
            this.positionAt = tagObject.attribute('positionAt');
            /**
            *   @property {public Array} mediaUrls A list of urls for a notification sound in various formats (commonly one MP3 and one OGG would be configured so that most major browsers can play the notification). 
            */
            this.mediaUrls = tagObject.attribute('mediaUrls');

            if (typeof this.mediaUrls != 'undefined') {

                if (xRTML.Common.Array.contains({ items: xRTML.TagManager.getClasses(), obj: "Audio" })) {

                    this.audioNotificationTag = xRTML.TagManager.create({
                        name: 'Audio',
                        controlsbar: false
                    });

                } else {
                    xRTML.Console.error('The xRTML Audio tag must be added in order to play audio notifications.');
                }
            }
            /**
            *   @property {public Object[]} effects  The effects that will run each time an toast is displayed.
            */
            this.effects = tagObject.attribute('effects');
            xRTML.Effect.extend(this);

            _model = new Model();

            this.toastContainer;

            if (this.target[0].tagName == "BODY") {
                this.toastContainer = document.createElement("div");
                this.toastContainer.setAttribute('id', 'xRTML-Toast-target');
                document.body.appendChild(this.toastContainer);
            } else {
                this.toastContainer = this.target[0];
            }

            /**
            *   @property {public String} template Structure that represents the way the xRTML Toast should be displayed in the DOM.
            */
            this.template = tagObject.attribute('template');

            if (!this.template) {
                var defaultTemplate = ' <div class="xRTML-Toast" data-bind="attr: { id: id }">';
                defaultTemplate += '        <div class="xRTML-Toast-Close" data-bind="click: close">X</div>';
                defaultTemplate += '        <div class="xRTML-Toast-Content" data-bind="click: showBanner">';
                defaultTemplate += '            <h3 class="xRTML-Toast-Content-Title" data-bind="text: title"></h3>';
                defaultTemplate += '            <span class="xRTML-Toast-Content-Message" data-bind="text: text"></span>';
                defaultTemplate += '        </div>';
                defaultTemplate += '    </div>';

                xRTML.Templating.inject({
                    id: 'xRTML-Toast-Template',
                    content: defaultTemplate
                });

                this.template = 'xRTML-Toast-Template';
            }

            try {
                xRTML.Templating.applyBindings({
                    node: this.toastContainer,
                    binding: {
                        template: {
                            name: this.template,
                            foreach: _model.toasts,
                            afterRender: xRTML.Common.Function.proxy(function (elements, data) {
                                for (var i = 0; i < elements.length; i++) {
                                    if (elements[i].nodeName != "#text") {
                                        this.runEffects({element:elements[i]});
                                    }
                                }
                            }, this)
                        }
                    }
                });
            } catch (err) {
                xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'init'} });
            }

            var positionToast = (function (toastTag) {

                var toastDiv = toastTag.toastContainer;
                toastDiv.style.position = 'fixed';

                switch (toastTag.positionAt) {
                    case 'topleft':
                        {
                            toastDiv.style.top = 15 + 'px';
                            toastDiv.style.left = 15 + 'px';
                            break;
                        }
                    case 'topright':
                        {
                            toastDiv.style.top = 15 + 'px';
                            toastDiv.style.right = 15 + 'px';
                            break;
                        }
                    case 'bottomleft':
                        {
                            toastDiv.style.bottom = 30 + 'px';
                            toastDiv.style.left = 15 + 'px';
                            break;
                        }
                    case 'bottomright':
                    default:
                        {
                            toastDiv.style.bottom = 30 + 'px';
                            toastDiv.style.right = 15 + 'px';
                            break;
                        }
                }
            })(this);

            // tag events
            var toFunction = xRTML.Common.Function.parse;
            this.bind({
                /**
                * Fired when a toast is displayed.
                * @event evt_toastDisplay
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target connection that raised this event.
                */
                toastDisplay: toFunction(tagObject.attribute('onToastDisplay')),
                /**
                * Fired when a toast is closed.
                * @event evt_toastClose
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target connection that raised this event.
                * @... {Boolean} closedByTimeOut Tells if the banner closed automatically or by user interaction.
                */
                toastClose: toFunction(tagObject.attribute('onToastClose')),
                /**
                * Fired when a banner is displayed.
                * @event evt_bannerDisplay
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target connection that raised this event.
                */
                bannerDisplay: toFunction(tagObject.attribute('onBannerDisplay')),
                /**
                * Fired when a banner closes.
                * @event evt_bannerClose
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target connection that raised this event.
                */
                bannerClose: toFunction(tagObject.attribute('onBannerClose')),
                /**
                * Fired when the toast or banner redirects the user to the destination url.
                * @event evt_urlOpen
                * @param {Object} e struture with the definition of the event's parameters.
                * @... {Object} target connection that raised this event.
                */
                urlOpen: toFunction(tagObject.attribute('onUrlOpen'))
            });

            _model.bind({
                toastDisplay: xRTML.Common.Function.proxy(function (e) {
                    this.fire({ toastDisplay: { target: e} });
                }, this),
                toastClose: xRTML.Common.Function.proxy(function (e) {
                    this.fire({ toastClose: { target: e} });
                }, this),
                bannerDisplay: xRTML.Common.Function.proxy(function (e) {
                    this.fire({ bannerDisplay: { target: e} });
                }, this),
                bannerClose: xRTML.Common.Function.proxy(function (e) {
                    this.fire({ bannerClose: { target: e} });
                }, this),
                urlOpen: xRTML.Common.Function.proxy(function (e) {
                    this.fire({ urlOpen: { target: e} });
                }, this)
            });

        };
        /**
        *  @function {public void} ? Process a message received on the connection and trigger associated with this Tag instance.
        *  @param {Object} message The xRTML message received.toast
        *  @... {String} title The title of the toast to be displayed.
        *  @... {String} text The text of the toast to be displayed.
        *  @... {String} destinationUrl The URL to open.
        *  @... {Number} timeToLive The display time of the toast.
        *  @... {Boolean} displayBanner Flag that defines if a banner will be displayed after the toast being clicked.
        *  @... {Object} metaData Object with any data.
        *  @... {String} bannerType The type of the banner that will be displayed. It can be a image, flash, html or a iframe.
        *  @... {String} bannerUrl The URL of the banner content. Used allong with image, flash, video or iframe banner type.
        *  @... {String} bannerContent The HTML content of the banner. Only used allong with html banners.
        *  @... {Object} bannerSource The video sources of the banner. Only used allong with video banners. In order to use video banners the xRTML Video tag (and media dependencies) must be added to the page.
        *  @... {Number} bannerHeight The height of the banner to be displayed.
        *  @... {Number} bannerWidth The width of the banner to be displayed.
        *  @... {Number} bannerAutoHide The display time of the banner. If not specified the banner will not close automatically.
        */
        this.process = function (data) {

            var args = {
                // Toast arguments
                title: data.title,
                text: data.text,
                destinationUrl: typeof data.destinationUrl != 'undefined' ? data.destinationUrl : false,
                timeToLive: data.timeToLive || 10000,
                displayToast: typeof data.displayToast != 'undefined' ? data.displayToast : true,
                displayBanner: typeof data.displayBanner != 'undefined' ? data.displayBanner : true,
                metaData: data.metaData,
                // Banner Arguments                
                bannerUrl: data.bannerUrl,
                bannerContent: data.bannerContent,
                bannerType: data.bannerType,
                bannerSource: data.bannerSource,
                bannerHeight: xRTML.Common.Converter.toNumber(data.bannerHeight),
                bannerWidth: xRTML.Common.Converter.toNumber(data.bannerWidth),
                bannerAutoHide: typeof data.bannerAutoHide != 'undefined' ? xRTML.Common.Converter.toNumber(data.bannerAutoHide) : false
            };

            if (this.positionAt == "topleft" || this.positionAt == "topright") {
                args.index = "begin";
            } else {
                args.index = "end";
            }

            if (_model.bannerActive) {

                var bufferProcess = xRTML.Common.Function.proxy(function () {
                    this.unbind({ bannerClose: bufferProcess });
                    this.process(data);
                }, this);

                this.bind({
                    bannerClose: bufferProcess
                });

            } else {

                try {
                    _model.create(args);
                } catch (err) {
                    xRTML.Error.raise({ code: xRTML.Error.Codes.TEMPLATING, target: this, info: { message: err.message, className: 'xRTML.Tags.' + this.name, methodName: 'process'} });
                }

                if (typeof this.audioNotificationTag != 'undefined') {
                    this.audioNotificationTag.play({ source: this.mediaUrls });
                }
            }
        };
    }
});
xRTML.TagManager.register({
    name: 'Video',
    base: 'Media',
    struct:
    /**
    *  xRTML Tag for playing videos.
    *  @class {private} xRTML.Tags.Video
    *  @extends xRTML.Tags.Media
    */
    function () {
        /**
        * @constructor {public} ? Initializes a tag by setting it attributes.
        * @param {Object} tagObject Configuration of the tag.
        * @... {optional String} id Identification of the tag, assigned by the user.
        * @... {optional String[]} connections Identification of the tag, assigned by the user. For tags that will send messages.
        * @... {optional String} channelId Channel through which xRTML messages will be sent by this tag.
        * @... {optional xRTML.MessageBroker.Trigger[]} triggers Array of triggers that will prompt the tag to take action.
        * @... {optional Boolean} receiveOwnMessages Indicates the reception of the xRTML messages sent by the tag itself.
        * @... {optional String} target The selector to find the target HTMLElement for this tag. The first position found will be used.
        * @... {optional Boolean} active Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true.
        * @... {optional Function} onPreInit Event handler for the {@link preInit} event.
        * @... {optional Function} onPostInit Event handler for the postInit event. 
        * @... {optional Function} onActive Event handler for the active event. 
        * @... {optional Function} onPreProcess Event handler for the preProcess event.
        * @... {optional Function} onPostProcess Event handler for the postProcess event. 
        * @... {optional Function} onDispose Event handler for the dispose event. 
        * @... {optional Number} width The width to apply to the media content.
        * @... {optional Number} height The height to apply to the media content.
        * @... {optional Boolean} autoPlay Tells whether the media file should start playing as soon as it is loaded. Defaults to true. 
        * @... {optional Boolean} loop Tells whether the media file should repeat after its finishes playing. 
        * @... {optional Boolean} controlsBar Toggles the display of the media player native control menu. Defaults to false. 
        * @... {optional Boolean} muted Toggles the media file sound. Defaults to false.  
        * @... {String} type The kind of player selected. The choices are: Youtube, HTML5 or Flash.
        * @... {String[]} formats The formats supported by the type of player.
        * @... {optional String} poster Path to the poster image of the player. Defaults to null.
        * @... {optional Boolean} keepRatio Tells if the tag keeps the video aspect ratio. Defaults to true.
        */
        this.init = function (tagObject) {
            /**
            *   @property {String} poster Path to the poster image of the player.
            */
            this.poster = tagObject.attribute('poster') || null;

            /**
            *   @property {Boolean} keepRatio Defines if the tag keeps the video aspect ratio. Defaults to true.
            */
            this.keepRatio = xRTML.Common.Converter.toBoolean(tagObject.attribute('keepRatio'));
            if (typeof this.keepRatio == 'undefined') this.keepRatio = true;

            tagObject.type = 'video';
            tagObject.formats = {
                mp4: "video/mp4",
                ogg: "video/ogg",
                webm: "video/webm",
                avi: "video/divx"
            };
            tagObject.keepratio = this.keepRatio;
            tagObject.poster = this.poster;

            this._super(tagObject);

            xRTML.Common.Validator.validateRequired({ target: this, prop: "type" });
            xRTML.Common.Validator.validateRequired({ target: this, prop: "formats" });

            var videoObj = this;

            // add YouTube video support
            this.players.yt = function (config) {

                xRTML.Event.extend(this);

                this.id = xRTML.Common.Util.idGenerator();
                this.config = config;
                this.supportedMedia = { yt: true };
                this.player = null;

                var self = this;

                window.onYouTubePlayerReady = function (playerId) {
                    self.player = document.getElementById("xrtml-video-ytplayer");
                    self.player.addEventListener("onStateChange", "onYouTubePlayerStateChange");
                    videoObj.dispatchEvent('onYouTubePlayerReady', { playerId: playerId });
                };

                function loadedMetadataHandler(e) {
                    videoObj.fire({ loadedmetadata: { event: e, target: self} });
                };
                this.bind({
                    loadedmetadata: loadedMetadataHandler
                });

                window.onYouTubePlayerStateChange = function (state) {
                    switch (state) {
                        // unstarted (ready to play?)                               
                        case -1:
                            videoObj.dispatchEvent('unstarted');
                            break;
                        // ended (check next in line)                                 
                        case 0:
                            videoObj.dispatchEvent('ended');
                            break;
                        // playing                                 
                        case 1:
                            videoObj.dispatchEvent('playing');
                            break;
                        // paused                                 
                        case 2:
                            videoObj.dispatchEvent('paused');
                            break;
                        // buffering                                 
                        case 3:
                            videoObj.dispatchEvent('buffering');
                            break;
                        // video cued  (ready to play)                               
                        case 5:
                            videoObj.dispatchEvent('videocued');
                            break;
                    };
                }
            };
            this.players.yt.prototype = {
                play: function (source) {
                    // parse url to get id
                    source.files.yt = source.files.yt.replace(/^[^v]+v.(.{11}).*/, "$1");
                    var params = "?autoplay=" + (!!this.config.autoplay || !!source.autoplay ? "1" : "0");
                    params += "&loop=" + (!!this.config.loop || !!source.loop ? "1" : "0");
                    params += "&controls=" + (!!this.config.controls || !!source.controls ? "1" : "0");
                    params += "&enablejsapi=1&playerapiid=ytplayer&version=3";

                    if (typeof swfobject === 'undefined') {

                        xRTML.Common.DOM.loadScript({
                            url: 'http://code.xrtml.org/plugins/swfobject.js',
                            callback: xRTML.Common.Function.proxy(function () {
                                swfobject.removeSWF("xrtml-video-ytplayer");
                                var mediaContainer = document.createElement('span');
                                mediaContainer.id = this.id;
                                // append to html5 video tag
                                videoObj.target.appendChild(mediaContainer);

                                var outputStatus = xRTML.Common.Function.proxy(function (e) {
                                    this.fire({ loadedmetadata: e });
                                }, this);

                                swfobject.embedSWF("http://www.youtube.com/v/" + source.files['yt'] + params,
                       	        this.id, !!this.config.width ? this.config.width : "425", !!this.config.height ? this.config.height : "356", "8", null, null, { allowScriptAccess: "always" }, { id: "xrtml-video-ytplayer" }, outputStatus);
                            }, this)
                        });

                    }
                    else {
                        swfobject.removeSWF("xrtml-video-ytplayer");
                        var mediaContainer = document.createElement('span');
                        mediaContainer.id = this.id;
                        // append to html5 video tag
                        videoObj.target.appendChild(mediaContainer);

                        var outputStatus = xRTML.Common.Function.proxy(function (e) {
                            this.fire({ loadedmetadata: e });
                        }, this);

                        swfobject.embedSWF("http://www.youtube.com/v/" + source.files['yt'] + params,
                       	this.id, !!this.config.width ? this.config.width : "425", !!this.config.height ? this.config.height : "356", "8", null, null, { allowScriptAccess: "always" }, { id: "xrtml-video-ytplayer" }, outputStatus);
                    }
                },
                stop: function () {
                    if (!this.isPlaying()) {
                        return;
                    }
                    this.player.stopVideo();
                },
                pause: function () {
                    this.isPlaying() ? this.player.pauseVideo() : this.player.playVideo();
                },
                restart: function () {
                    this.player.playVideo();
                },
                skip: function (time) {
                    this.player.seekTo(time, true);
                },
                mute: function () {
                    this.player.isMuted() ? this.player.unMute() : this.player.mute();
                },
                volume: function (vol) {
                    this.player.setVolume(vol);
                },
                isPlaying: function () {
                    if (this.player.getPlayerState) {
                        return this.player != null && this.player.getPlayerState() == 1;
                    }
                    // Most modern browsers support "postMessage", though Internet Explorer 7 does not support it. So we assume if there is player it is playing.
                    return true;
                },
                canPlayExtension: function () {
                },
                canPlayType: function (type) {
                    return type === 'yt';
                },
                time: function () {
                    return {
                        current: this.player.getCurrentTime(),
                        duration: this.player.getDuration()
                    }
                },
                offset: function () { }
            };
        };
    }
});

    var 
      _xRTML = {
      name: "xRTML",
      description: "",
      classes: [
        
      ],
      properties: {
      isReady: {
      modifier: "public",
      type: "Boolean",
      description: "Indicates if the xRTML is fully loaded."
    }
  ,lastestBuild: {
      modifier: "public",
      type: "String",
      description: "The date and time that the latest release build occured. The format is yyyy.MM.dd.HH.mm.ss"
    }
  ,version: {
      modifier: "public",
      type: "Number",
      description: "The current xRTML version. The xRTML Library versioning policy is roughly as follows: Major Version: When a major refactor to the framework occurs, or a major change in the philosophy of the Framework intents takes place. Minor Version: When minor features or significant fixes have been added. Revision: When minor bugs are fixed. The format is [Major Version number].[Minor Version number].[Revision number]"
    }
  
      },
      methods: {
      domLoaded: {
      modifier: "public",
      arguments: {
        
      },
      "return": "Boolean",
      exceptions: [],
      description: "Checks if the page is ready for manipulation."
    }
  ,ready: {
      modifier: "public",
      arguments: {
        fn: {
    type: "Function",
    description: "Called when xRTML has been initiated.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Event handler raised when the xRTML is fully loaded."
    }
  
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML);
  
    var 
      _xRTML_Common = {
      name: "xRTML.Common",
      description: "Provides a set of organized utility methods.",
      classes: [
            
    {
      "extends": undefined,
      name: "Array",
      name: "Array",
      namespace: "xRTML.Common",
      description: "Provides a set of methods to handle arrays.",
    properties: {
    
      },
      methods: {
      contains: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                items: {
    modifier: "public",
    type: "Array",
    description: "The array to searched in."
    }
  ,obj: {
    modifier: "public",
    type: "Object",
    description: "The object to search for."
    }
  
                }
              }
            ,
    description: "struture with arguments for the function.",
    mandatory: false
    }
  
      },
      "return": "Boolean",
      exceptions: [],
      description: "Check if an array contains the provided object."
    }
  ,forEach: {
      modifier: "public",
      arguments: {
        items: {
    type: "Array",
    description: "The array to be iterated through.",
    mandatory: false
    }
  ,fn: {
    type: "Function",
    description: "The function to be executed for each element contained in the array.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Iterates over each of the items of an array executing a function for each element."
    }
  ,indexOf: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                items: {
    modifier: "public",
    type: "Array",
    description: "The array to be searched in."
    }
  ,obj: {
    modifier: "public",
    type: "Object",
    description: "The object to be matched with."
    }
  ,start: {
    modifier: "public",
    type: "Number",
    description: "The index of the array from where the search should start."
    }
  
                }
              }
            ,
    description: "struture with arguments for the function.",
    mandatory: false
    }
  
      },
      "return": "Number",
      exceptions: [],
      description: "Searches for the index of the first occurrence of a specified object in the array."
    }
  ,isArray: {
      modifier: "public",
      arguments: {
        obj: {
    type: "Object",
    description: "The Object to be tested.",
    mandatory: false
    }
  
      },
      "return": "Boolean",
      exceptions: [],
      description: "Checks if the object is an array."
    }
  ,remove: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                items: {
    modifier: "public",
    type: "Array",
    description: "The array from where the elements will be removed."
    }
  ,from: {
    modifier: "public",
    type: "Number",
    description: "The index of the array from where the removal will begin."
    }
  ,to: {
    modifier: "public",
    type: "Number",
    description: "The index of the array where the removal will end."
    }
  
                }
              }
            ,
    description: "struture with arguments for the function.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Removes all the elements specified by the provided indexes."
    }
  ,removeObj: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                items: {
    modifier: "public",
    type: "Array",
    description: "The array from where the object will be removed."
    }
  ,obj: {
    modifier: "public",
    type: "Object",
    description: "The object to be removed."
    }
  
                }
              }
            ,
    description: "struture with arguments for the function.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Removes the first occurrence of the specified object."
    }
  ,some: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                items: {
    modifier: "public",
    type: "Array",
    description: "The array to searched in."
    }
  ,fn: {
    modifier: "public",
    type: "Function",
    description: "The function to apply for each item (the arguments that will be passed to this function are: currentItem, index, itemsArray)."
    }
  
                }
              }
            ,
    description: "struture with arguments for the function.",
    mandatory: false
    }
  
      },
      "return": "Boolean",
      exceptions: [],
      description: "This method will pass each element of the Array through the supplied function until true has been returned. If the function returns true some will in turn return true. If the entire array has been traversed and no true condition was found then some() will return false."
    }
  ,someIndex: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                items: {
    modifier: "public",
    type: "Array",
    description: "The array to be searched in."
    }
  ,fn: {
    modifier: "public",
    type: "Function",
    description: "The function to apply for each item (the arguments that will be passed to this function are: currentItem, index, itemsArray)."
    }
  ,start: {
    modifier: "public",
    type: "Number",
    description: "The index of the array from where the search should start."
    }
  
                }
              }
            ,
    description: "struture with arguments for the function.",
    mandatory: false
    }
  
      },
      "return": "Number",
      exceptions: [],
      description: "Searches for the index of the first occurrence of a specified object in the array. The evaluation if the object matches the search is specified by a Function."
    }
  
      },
      events: {
      
    }
    }
  ,    
    {
      "extends": undefined,
      name: "Converter",
      name: "Converter",
      namespace: "xRTML.Common",
      description: "Converts elements to the intended data types.",
    properties: {
    
      },
      methods: {
      toBoolean: {
      modifier: "public",
      arguments: {
        value: {
    type: "String",
    description: "The value to convert.",
    mandatory: false
    }
  
      },
      "return": "Boolean",
      exceptions: [],
      description: "Converts a String to a Boolean."
    }
  ,toNumber: {
      modifier: "public",
      arguments: {
        value: {
    type: "String",
    description: "The value to convert (mandatory).",
    mandatory: false
    }
  
      },
      "return": "Number",
      exceptions: [],
      description: "Converts a String to a Number. Calls Validator.validateNumber() to check for it's validity before casting."
    }
  
      },
      events: {
      
    }
    }
  ,    
    {
      "extends": undefined,
      name: "Cookie",
      name: "Cookie",
      namespace: "xRTML.Common",
      description: "Provides a set of methods to manage browsers' cookies.",
    properties: {
    
      },
      methods: {
      deleteCookie: {
      modifier: "public",
      arguments: {
        cookie: {
    type: 
              {
                properties: {
                name: {
    modifier: "public",
    type: "String",
    description: "The name of the stored cookie."
    }
  ,path: {
    modifier: "public",
    type: "String",
    description: "Specifies a path within the site to which the cookie applies. Only documents in this path will be able to retrieve the cookie. Usually this is left blank, meaning that only the path that set the cookie can retrieve it."
    }
  ,domain: {
    modifier: "public",
    type: "String",
    description: "Specifies a domain within which the cookie applies. Only websites in this domain will be able to retrieve the cookie. Usually this is left blank, meaning that only the domain that set the cookie can retrieve it."
    }
  ,secure: {
    modifier: "public",
    type: "String",
    description: "Indicates that the browser should use SSL when sending the cookie to the server. This flag is rarely used."
    }
  
                }
              }
            ,
    description: "structure with the cookie definition.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Removes a stored cookie."
    }
  ,getCookie: {
      modifier: "public",
      arguments: {
        cookie: {
    type: 
              {
                properties: {
                name: {
    modifier: "public",
    type: "String",
    description: "The name of the stored cookie."
    }
  
                }
              }
            ,
    description: "structure with the cookie definition.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Gets the value of a stored cookie."
    }
  ,setCookie: {
      modifier: "public",
      arguments: {
        cookie: {
    type: 
              {
                properties: {
                name: {
    modifier: "public",
    type: "String",
    description: "The name of the cookie."
    }
  ,value: {
    modifier: "public",
    type: "String",
    description: "The value of the cookie."
    }
  ,expires: {
    modifier: "public",
    type: "Date",
    description: "The expiration date of the cookie."
    }
  ,path: {
    modifier: "public",
    type: "String",
    description: "Specifies a path within the site to which the cookie applies. Only documents in this path will be able to retrieve the cookie. Usually this is left blank, meaning that only the path that set the cookie can retrieve it."
    }
  ,domain: {
    modifier: "public",
    type: "String",
    description: "Specifies a domain within which the cookie applies. Only websites in this domain will be able to retrieve the cookie. Usually this is left blank, meaning that only the domain that set the cookie can retrieve it."
    }
  ,secure: {
    modifier: "public",
    type: "String",
    description: "Indicates that the browser should use SSL when sending the cookie to the server. This flag is rarely used."
    }
  
                }
              }
            ,
    description: "structure with the cookie definition.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Adds or updates a cookie."
    }
  
      },
      events: {
      
    }
    }
  ,    
    {
      "extends": undefined,
      name: "DOM",
      name: "DOM",
      namespace: "xRTML.Common",
      description: "Provides a set of methods to handle the Document Object Model.",
    properties: {
    
      },
      methods: {
      browser: {
      modifier: "public",
      arguments: {
        
      },
      "return": "",
      exceptions: [],
      description: "Gets the name of the browser being used."
    }
  ,getStyle: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                element: {
    modifier: "public",
    type: "Object",
    description: "The element to retrieve the style property."
    }
  ,rule: {
    modifier: "public",
    type: "String",
    description: "The rule to search."
    }
  
                }
              }
            ,
    description: "Struture with arguments for the function.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Gets the current style property of an element."
    }
  ,getText: {
      modifier: "public",
      arguments: {
        element: {
    type: "Object",
    description: "DOM element to retrieve text from.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Gets the HTML contained within a DOM element."
    }
  ,loadScript: {
      modifier: "public",
      arguments: {
        resource: {
    type: 
              {
                properties: {
                url: {
    modifier: "public",
    type: "String",
    description: "The URL of the script to load."
    }
  ,callback: {
    modifier: "public",
    type: "Function",
    description: "The function to be called after the script is loaded."
    }
  
                }
              }
            ,
    description: "struture with arguments for the function.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Loads a script dynamically into the page."
    }
  ,setText: {
      modifier: "public",
      arguments: {
        element: {
    type: "Object",
    description: "DOM element to set text.",
    mandatory: false
    }
  ,text: {
    type: "String",
    description: "The text to set as the content of element.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Sets the HTML contained within a DOM element."
    }
  
      },
      events: {
      
    }
    }
  ,    
    {
      "extends": undefined,
      name: "Function",
      name: "Function",
      namespace: "xRTML.Common",
      description: "Provides a set of methods to handle functions.",
    properties: {
    
      },
      methods: {
      parse: {
      modifier: "public",
      arguments: {
        fnName: {
    type: "Function",
    description: "The name of the function.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Takes the name of a function and converts it into a function."
    }
  ,proxy: {
      modifier: "public",
      arguments: {
        fn: {
    type: "Function",
    description: "The function whose context will be changed.",
    mandatory: false
    }
  ,context: {
    type: "Object",
    description: "The object to which the context of the function should be set.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Returns a function with the given context."
    }
  
      },
      events: {
      
    }
    }
  ,    
    {
      "extends": undefined,
      name: "Object",
      name: "Object",
      namespace: "xRTML.Common",
      description: "Provides access to Object related operations.",
    properties: {
    
      },
      methods: {
      equals: {
      modifier: "public",
      arguments: {
        items: {
    type: 
              {
                properties: {
                o1: {
    modifier: "public",
    type: "Object",
    description: "Object to be compared with."
    }
  ,o2: {
    modifier: "public",
    type: "Object",
    description: "Object to be compared with."
    }
  
                }
              }
            ,
    description: "struture with the objects to be compared.",
    mandatory: false
    }
  
      },
      "return": "Boolean",
      exceptions: [],
      description: "Compares if two objects are equivalent."
    }
  ,insensitiveGetter: {
      modifier: "public",
      arguments: {
        obj: {
    type: "Object",
    description: "The target object.",
    mandatory: false
    }
  ,prop: {
    type: "String",
    description: "The name of the property to ge the value from.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Returns the value of a property in a case insensitive manner."
    }
  ,isObject: {
      modifier: "public",
      arguments: {
        obj: {
    type: "Object",
    description: "The Object to be tested.",
    mandatory: false
    }
  
      },
      "return": "Boolean",
      exceptions: [],
      description: "Checks if the object is of Object type."
    }
  
      },
      events: {
      
    }
    }
  ,    
    {
      "extends": undefined,
      name: "Request",
      name: "Request",
      namespace: "xRTML.Common",
      description: "Contains methods for performing HTTP and HTTPS requests.",
    properties: {
    
      },
      methods: {
      get: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                url: {
    modifier: "public",
    type: "String",
    description: "The URL for the request."
    }
  ,data: {
    modifier: "public",
    type: "Object",
    description: "The data to send through the request."
    }
  ,success: {
    modifier: "public",
    type: "Function",
    description: "A function that will be called after the request returns a successful response."
    }
  ,error: {
    modifier: "public",
    type: "Function",
    description: "A function that will be called after the request returns a erroneous response."
    }
  ,complete: {
    modifier: "public",
    type: "Function",
    description: "A function that will always be called after the request returns any response. The params passed to this handler will be result, error, status (will only receive status when available in the request object)"
    }
  ,async: {
    modifier: "public",
    type: "Boolean",
    description: "Identifies if the request is asynchronous, defaults to Asynchronous"
    }
  ,crossDomain: {
    modifier: "public",
    type: "Boolean",
    description: "Identifies if the request is to another domain. If this setting is enabled then the server-side controller should contain these headers: Content-Type: text/plain, Access-Control-Allow-Origin: *, Access-Control-Allow-Credentials: 'true', Access-Control-Allow-Methods: GET, OPTIONS, Access-Control-Max-Age: '60', Access-Control-Allow-Headers: X-Requested-With, Content-Type"
    }
  
                }
              }
            ,
    description: "Contains the arguments for this function.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Performs a GET request."
    }
  ,post: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                url: {
    modifier: "public",
    type: "String",
    description: "The URL for the request."
    }
  ,data: {
    modifier: "public",
    type: "Object",
    description: "The data to send through the request."
    }
  ,success: {
    modifier: "public",
    type: "Function",
    description: "A function that will be called after the request returns a successful response."
    }
  ,error: {
    modifier: "public",
    type: "Function",
    description: "A function that will be called after the request returns a erroneous response."
    }
  ,complete: {
    modifier: "public",
    type: "Function",
    description: "A function that will always be called after the request returns any response. The params passed to this handler will be result, error, status (will only receive status when available in the request object)"
    }
  ,async: {
    modifier: "public",
    type: "Boolean",
    description: "Identifies if the request is asynchronous, defaults to Asynchronous"
    }
  ,crossDomain: {
    modifier: "public",
    type: "Boolean",
    description: "Identifies if the request is to another domain. If this setting is enabled then the server-side controller should contain these headers: Content-Type: text/plain, Access-Control-Allow-Origin: *, Access-Control-Allow-Credentials: 'true', Access-Control-Allow-Methods: POST, OPTIONS, Access-Control-Max-Age: '60', Access-Control-Allow-Headers: X-Requested-With, Content-Type"
    }
  
                }
              }
            ,
    description: "Contains the arguments for this function.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Performs a POST request."
    }
  
      },
      events: {
      
    }
    }
  ,    
    {
      "extends": undefined,
      name: "String",
      name: "String",
      namespace: "xRTML.Common",
      description: "Provides a set of methods to handle functions.",
    properties: {
    
      },
      methods: {
      format: {
      modifier: "public",
      arguments: {
        text: {
    type: "String",
    description: "The target String.",
    mandatory: false
    }
  ,values: {
    type: "Array",
    description: "The list of values to replace the placeholders by the given positions in the array.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Formats a string by replacing placeholders identified by curly brackets and the position '{position}' with values passed in the values argument."
    }
  ,regexIndexOf: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                text: {
    modifier: "public",
    type: "String",
    description: "The target String."
    }
  ,regex: {
    modifier: "public",
    type: "RegExp",
    description: "The target RegExp."
    }
  ,startpos: {
    modifier: "public",
    type: "Number",
    description: "The position to start searching at."
    }
  
                }
              }
            ,
    description: "structure with the args definition.",
    mandatory: false
    }
  
      },
      "return": "Number",
      exceptions: [],
      description: "Finds the index of the provided regular expression."
    }
  ,regexReplaceAll: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                text: {
    modifier: "public",
    type: "String",
    description: "The target String."
    }
  ,regex: {
    modifier: "public",
    type: "RegExp",
    description: "The regex for the value to be replaced."
    }
  ,newtoken: {
    modifier: "public",
    type: "String",
    description: "The value to be replace instances of regex."
    }
  
                }
              }
            ,
    description: "structure with the args definition.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Replaces all occurences of a given token with the new token."
    }
  ,replaceAll: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                text: {
    modifier: "public",
    type: "String",
    description: "The target String."
    }
  ,token: {
    modifier: "public",
    type: "String",
    description: "The value to be replaced."
    }
  ,newtoken: {
    modifier: "public",
    type: "String",
    description: "The value to be replace instances of token."
    }
  
                }
              }
            ,
    description: "structure with the args definition.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Replaces all occurences of a token with the new token."
    }
  ,template: {
      modifier: "public",
      arguments: {
        text: {
    type: "String",
    description: "The target String.",
    mandatory: false
    }
  ,data: {
    type: "Object",
    description: "The values to replace the placeholders by the given properties' values.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Populates placeholders in a string with given data with values passed in the values argument."
    }
  ,trim: {
      modifier: "public",
      arguments: {
        text: {
    type: "String",
    description: "The target String.",
    mandatory: false
    }
  
      },
      "return": "Number",
      exceptions: [],
      description: "Removes all spaces from the string."
    }
  
      },
      events: {
      
    }
    }
  ,    
    {
      "extends": undefined,
      name: "Util",
      name: "Util",
      namespace: "xRTML.Common",
      description: "Provides miscellaneous methods for programming convenience.",
    properties: {
    
      },
      methods: {
      convertAttributeValueToJSON: {
      modifier: "public",
      arguments: {
        attributeValue: {
    type: "String",
    description: "The value to be converted.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Converts a string containing a structure similar to JSON to an object representing a JSON structure."
    }
  ,guidGenerator: {
      modifier: "public",
      arguments: {
        
      },
      "return": "",
      exceptions: [],
      description: "Generates a globally unique identifier."
    }
  ,idGenerator: {
      modifier: "public",
      arguments: {
        
      },
      "return": "",
      exceptions: [],
      description: "Generates a random identifier."
    }
  
      },
      events: {
      
    }
    }
  ,    
    {
      "extends": undefined,
      name: "Validator",
      name: "Validator",
      namespace: "xRTML.Common",
      description: "Validates that values fulfill specific conditions. Mainly that data types are valid.",
    properties: {
    
      },
      methods: {
      validateRequired: {
      modifier: "public",
      arguments: {
        prop: {
    type: "Object",
    description: "The name of the property to test.",
    mandatory: false
    }
  ,target: {
    type: "Object",
    description: "The target object to validate against.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Checks if the given value is not considered empty (falsy, different than 0 or an empty Array)."
    }
  ,validateType: {
      modifier: "public",
      arguments: {
        prop: {
    type: "Object",
    description: "The name of the property to test.",
    mandatory: false
    }
  ,type: {
    type: "Object",
    description: "The JavaScript type to test.",
    mandatory: false
    }
  ,target: {
    type: "Object",
    description: "The target object to validate against.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Checks if the given value is not of the specified type."
    }
  
      },
      events: {
      
    }
    }
  
      ],
      properties: {
      
      },
      methods: {
      
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_Common);
  
    var 
      _xRTML_Config = {
      name: "xRTML.Config",
      description: "Global configuration settings.",
      classes: [
        
      ],
      properties: {
      connectionAttempts: {
      modifier: "public",
      type: "Number",
      description: "Number of times a connection tag tries to perform a connect. This value is used by a connection if the 'connectAttempts' attribute is not set. Defaults to 5 attemps. {@default 5}"
    }
  ,connectionTimeout: {
      modifier: "public",
      type: "Number",
      description: "Maximum amount of time (miliseconds) a connection tag should take to perform a connect. This value is used by a connection if the 'timeout' attribute is not set. Defaults to 10000 miliseconds. {@default 10000 ms}"
    }
  ,debug: {
      modifier: "public",
      type: "Boolean",
      description: "Toggles debug specific messages to be displayed in the web-browsers console. Defaults to false. Should only be enabled for development or debugging purposes. {@default false}"
    }
  ,logLevel: {
      modifier: "public",
      type: "Number",
      description: "Sets which kind of logs are displayed. Possible values are: 0: error. Only error messages are diplayed. 1: warn. Displays warning and error messages. 2: info. Displays all types of log. Defaults to 'info'. {@default info}"
    }
  ,logLevels: {
      modifier: "public",
      type: "Object",
      description: "Allowed set of log levels."
    }
  ,remoteTrace: {
      modifier: "public",
      type: "Boolean",
      description: "Toggles remote tracing. Defaults to false. {@default false}"
    }
  ,throwErrors: {
      modifier: "public",
      type: "Boolean",
      description: "When set, exceptions may stop code execution, otherwise they're processed and only displayed in the console. Defaults to false. {@default false}"
    }
  
      },
      methods: {
      ortcLibrary: {
      modifier: "public",
      arguments: {
        url: {
    type: "String",
    description: "path of the ORTC library.",
    mandatory: false
    }
  ,callback: {
    type: "Function",
    description: "Function executed when the ORTC script is loaded.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Loads or displays the ORTC library."
    }
  
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_Config);
  
    var 
      _xRTML_ConnectionManager = {
      name: "xRTML.ConnectionManager",
      description: "Provides access to a data layer to manage the transmission and retrieval of information between the xRTML connections and the ORTC servers.",
      classes: [
            
    {
      "extends": undefined,
      name: "Channel",
      name: "Channel",
      namespace: "xRTML.ConnectionManager",
      description: "",
    properties: {
    connectionId: {
      modifier: "",
      type: "Number",
      description: "Id of the connection the channel is going to added to."
    }
  ,messageAdapter: {
      modifier: "",
      type: "Function",
      description: "Callback handler that allow changes to be made to the message. Like converting a message from an unknown source into an xRTML message. Called when a message arrives through the channel."
    }
  ,name: {
      modifier: "",
      type: "String",
      description: "Name of the channel."
    }
  ,onMessage: {
      modifier: "",
      type: "Function",
      description: "Event handler raised when a message arrives through the channel."
    }
  ,subscribe: {
      modifier: "",
      type: "Boolean",
      description: "Indicates if the channel is to be subscribed as soon as its added to the connection. Defaults to true."
    }
  ,subscribeOnReconnect: {
      modifier: "",
      type: "Boolean",
      description: "Indicates if the channels subscription is automatically made in case there's a reconnect. Defaults to true."
    }
  
      },
      methods: {
      
      },
      events: {
      evt_message: {
      description: "Fired when a subscribed channel receives a message.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  ,message: {
    modifier: "public",
    type: "String",
    description: "message that was received."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  
    }
    }
  ,    
    {
      "extends": undefined,
      name: "Connection",
      name: "Connection",
      namespace: "xRTML.ConnectionManager",
      description: "Represents a (ORTC) connection to a real-time comunication server.",
    properties: {
    announcementSubChannel: {
      modifier: "",
      type: "String",
      description: "The name of the announcement subchannel."
    }
  ,appKey: {
      modifier: "",
      type: "String",
      description: "Identifies the application using the ORTC API."
    }
  ,authToken: {
      modifier: "",
      type: "String",
      description: "Identifies a user belonging to the application using the ORTC API."
    }
  ,autoConnect: {
      modifier: "",
      type: "Boolean",
      description: "Indicates if a connection should be established implicitly after it's created. Defaults to true. {@default true}"
    }
  ,channels: {
      modifier: "",
      type: "xRTML.ConnectionManager.Channel",
      description: "Represents all the existing channels in the connection."
    }
  ,connectAttempts: {
      modifier: "",
      type: "Number",
      description: "Number of times a connection should attempt to be established. Defaults to the according Configuration connectionTimeout value. {@default @link{ xRTML.Config.connectionAttempts } }"
    }
  ,connectionAttemptsCounter: {
      modifier: "",
      type: "Number",
      description: "Number of connection attempts that have been made. {@default 0}"
    }
  ,id: {
      modifier: "",
      type: "String",
      description: "Identification of the connection, assigned by the user."
    }
  ,internalId: {
      modifier: "read",
      type: "String",
      description: "Identification of the connection, automatically generated."
    }
  ,isCluster: {
      modifier: "",
      type: "Boolean",
      description: "Indicates if connection should be made to a cluster server. Defaults to true. {@default true}"
    }
  ,messageAdapter: {
      modifier: "",
      type: "Function",
      description: "Callback method that allow changes to be made to the message. Called when a message arrives through any channel subscribed to this connection."
    }
  ,metadata: {
      modifier: "",
      type: "String",
      description: "Provides information about one or more aspects of the data associated with the connection."
    }
  ,sendInterval: {
      modifier: "",
      type: "Number",
      description: "Period of time in miliseconds between message send retries by the connection. Defaults to 1000 ms. {@default 1000 ms}"
    }
  ,sendRetries: {
      modifier: "",
      type: "Number",
      description: "Number of times a connection should try to send a message in case the first attempt fails. Defaults to 5. {@default 5}"
    }
  ,serverType: {
      modifier: "",
      type: "String",
      description: "Tells which library to be used by the ORTC client. Defaults to 'IbtRealTimeSJ'. {@default IbtRealTimeSJ}"
    }
  ,timeout: {
      modifier: "",
      type: "Number",
      description: "Period of time in miliseconds between connection attempts. Defaults to the according Configuration connectionTimeout value. {@default @link{ xRTML.Config.connectionTimeout } }"
    }
  ,url: {
      modifier: "",
      type: "String",
      description: "Path to the location of the real-time comunication server is located."
    }
  
      },
      methods: {
      active: {
      modifier: "public",
      arguments: {
        value: {
    type: "Boolean",
    description: "The new active state.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Changes the active state of the connection."
    }
  ,connect: {
      modifier: "",
      arguments: {
        credentials: {
    type: 
              {
                properties: {
                appKey: {
    modifier: "public",
    type: "String",
    description: "ORTC's application key"
    }
  ,authToken: {
    modifier: "public",
    type: "String",
    description: "ORTC's authentication key. Identifies a user using the application."
    }
  
                }
              }
            ,
    description: "structure with the credentials' attributes.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Establishes the connection to the ORTC server."
    }
  ,createChannel: {
      modifier: "",
      arguments: {
        c: {
    type: "xRTML.ConnectionManager.Channel",
    description: "The channel to be added.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Adds, but doesn't subscribe, a channel to the connection."
    }
  ,disconnect: {
      modifier: "",
      arguments: {
        
      },
      "return": undefined,
      exceptions: [],
      description: "Closes the connection to the ORTC server."
    }
  ,dispose: {
      modifier: "",
      arguments: {
        
      },
      "return": undefined,
      exceptions: [],
      description: "Disconnects and removes references to this Connection."
    }
  ,getAnnouncementSubChannel: {
      modifier: "",
      arguments: {
        
      },
      "return": "",
      exceptions: [],
      description: "Gets the client announcement subchannel."
    }
  ,getMetadata: {
      modifier: "",
      arguments: {
        
      },
      "return": "",
      exceptions: [],
      description: "Gets the information related to the connection."
    }
  ,isConnected: {
      modifier: "",
      arguments: {
        
      },
      "return": "Boolean",
      exceptions: [],
      description: "Checks if the connection to the ORTC server is established."
    }
  ,isCreated: {
      modifier: "",
      arguments: {
        
      },
      "return": "Boolean",
      exceptions: [],
      description: "Checks if the connection is initialized."
    }
  ,isSubscribed: {
      modifier: "",
      arguments: {
        channel: {
    type: "String",
    description: "Name of the channel.",
    mandatory: false
    }
  
      },
      "return": "Boolean",
      exceptions: [],
      description: "Checks if the connection has subscribed the channel."
    }
  ,process: {
      modifier: "",
      arguments: {
        data: {
    type: 
              {
                properties: {
                channel: {
    modifier: "public",
    type: "String",
    description: "Name of the channel from where the message arrived."
    }
  ,message: {
    modifier: "public",
    type: "String",
    description: "The received message."
    }
  
                }
              }
            ,
    description: "structure with the message attributes.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Receives messages that arrive through the subscribed channels. If it's an xRTML message it to all tags. Otherwise just notifies of a message arrival."
    }
  ,send: {
      modifier: "",
      arguments: {
        message: {
    type: 
              {
                properties: {
                channel: {
    modifier: "public",
    type: "String",
    description: "Name of the channel through which we're sending the message."
    }
  ,content: {
    modifier: "public",
    type: "String",
    description: "The xRTML message to be sent through the channel."
    }
  ,sendOnly: {
    modifier: "public",
    type: "Boolean",
    description: "Identifies if the message should be sent and discarded by the connection that sends it."
    }
  
                }
              }
            ,
    description: "structure with the message attributes.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Transmits a message through a channel."
    }
  ,setMetadata: {
      modifier: "",
      arguments: {
        metadata: {
    type: "String",
    description: "Information to store.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Associates information about the connection."
    }
  ,subscribe: {
      modifier: "",
      arguments: {
        channel: {
    type: "xRTML.ConnectionManager.Channel",
    description: "Channel the connection is going to subscribe.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Adds and subscribes a channel to the connection."
    }
  ,unsubscribe: {
      modifier: "",
      arguments: {
        name: {
    type: "String",
    description: "Name of the channel.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Unsubscribes a channel from the connection."
    }
  
      },
      events: {
      evt_channelcreate: {
      description: "Fired when a channel is added to the connection.",
      handler: {
        arguments: {
          channel: {
    type: "xRTML.ConnectionManager.Channel",
    description: "struture with the channel's definition.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_connect: {
      description: "Fired when the connection is established.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_create: {
      description: "Fired when the connection obtains an ORTC client.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_disconnect: {
      description: "Fired when there's a disconnection from the ORTC server.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_dispose: {
      description: "Fired when a connection is disposed.",
      handler: {
        arguments: {
                  
        }
      }
    }
  ,evt_exception: {
      description: "Fired when an ORTC related exception has occurred.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  ,channel: {
    modifier: "public",
    type: "String",
    description: "description of the raised exception."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_message: {
      description: "Fired when a connection receives a message through a subscribed channel.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  ,channel: {
    modifier: "public",
    type: "String",
    description: "name of the subscribed channel from where the message was received."
    }
  ,message: {
    modifier: "public",
    type: "String",
    description: "message that was received."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_reconnect: {
      description: "Fired when a connection to an ORTC server is reestablished.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_reconnecting: {
      description: "Fired when a connection to an ORTC server is in the process of being reestablished.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_subscribe: {
      description: "Fired when the connection has subscribed to a channel.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  ,channel: {
    modifier: "public",
    type: "String",
    description: "name of the subscribed channel."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_unsubscribe: {
      description: "Fired when the connection has unsubscribed a channel.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  ,channel: {
    modifier: "public",
    type: "String",
    description: "name of the subscribed channel."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_xrtmlmessage: {
      description: "Fired when a subscribed channel receives an xRTML message.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "connection that raised this event."
    }
  ,channel: {
    modifier: "public",
    type: "String",
    description: "name of the subscribed channel from where the xRTML message was received."
    }
  ,message: {
    modifier: "public",
    type: "Object",
    description: "xRTML message that was received."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  
    }
    }
  
      ],
      properties: {
      
      },
      methods: {
      add: {
      modifier: "public",
      arguments: {
        connection: {
    type: "xRTML.ConnectionManager.Connection",
    description: "structure with the xRTML connection object.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Adds an xRTML connection to the xRTML platform."
    }
  ,addChannel: {
      modifier: "public",
      arguments: {
        channel: {
    type: "xRTML.ConnectionManager.Channel",
    description: "structure with the channel definition.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Adds a channel to a connection."
    }
  ,create: {
      modifier: "public",
      arguments: {
        connection: {
    type: 
              {
                properties: {
                id: {
    modifier: "public",
    type: "String",
    description: "Connection's identification."
    }
  ,appKey: {
    modifier: "public",
    type: "String",
    description: "Identifies the application using the ORTC API. Optional only if attribute 'autoConnect' is set to false."
    }
  ,authToken: {
    modifier: "public",
    type: "String",
    description: "Identifies a user belonging to the application using the ORTC API. Optional only if attribute 'autoConnect' is set to false."
    }
  ,sendRetries: {
    modifier: "public",
    type: "Number",
    description: "Number of times a connection should try to send a message in case the first attempt fails. Defaults to 5."
    }
  ,sendInterval: {
    modifier: "public",
    type: "Number",
    description: "Period of time in miliseconds between message send retries by the connection. Defaults to 1000 ms."
    }
  ,timeout: {
    modifier: "public",
    type: "Number",
    description: "Maximum amount of time (miliseconds) a connection tag should take to perform a connect. Defaults to the according Config.connectionTimeout value."
    }
  ,connectAttempts: {
    modifier: "public",
    type: "Number",
    description: "Number of times a connection should try to issue a connect. Defaults to the according Config.connectionAttempts value."
    }
  ,autoConnect: {
    modifier: "public",
    type: "Boolean",
    description: "Indicates if a connection should be established implicitly after it's created. Defaults to true."
    }
  ,metadata: {
    modifier: "public",
    type: "String",
    description: "Provides information about one or more aspects of the data associated with the connection."
    }
  ,serverType: {
    modifier: "public",
    type: "String",
    description: "Tells which library to be used by the ORTC client. Defaults to 'IbtRealTimeSJ'."
    }
  ,url: {
    modifier: "public",
    type: "String",
    description: "Path to the location of the real-time comunication server is located. Optional if attribute 'autoConnect' is set to false."
    }
  ,isCluster: {
    modifier: "public",
    type: "Boolean",
    description: "Indicates if connection should be made to a cluster server. Default is true."
    }
  ,channels: {
    modifier: "public",
    type: "Channel",
    description: "Array of channels to be added to the connection."
    }
  ,oncreate: {
    modifier: "public",
    type: "Function",
    description: "Event handler raised when the connection is created."
    }
  ,onconnect: {
    modifier: "public",
    type: "Function",
    description: "Event handler raised when a connection is successfully established."
    }
  ,ondisconnect: {
    modifier: "public",
    type: "Function",
    description: "Event handler raised when the connection has lost comunication with the Online Realtime Communication (ORTC) server."
    }
  ,onsubscribe: {
    modifier: "public",
    type: "Function",
    description: "Event handler raised when a channel is subscribed."
    }
  ,onunsubscribe: {
    modifier: "public",
    type: "Function",
    description: "Event handler raised when a channel is unsubscribed."
    }
  ,onexception: {
    modifier: "public",
    type: "Function",
    description: "Event handler raised when there's an error performing ORTC related operations."
    }
  ,onreconnect: {
    modifier: "public",
    type: "Function",
    description: "Event handler raised when there's a reconnection to the ORTC servers."
    }
  ,onreconnecting: {
    modifier: "public",
    type: "Function",
    description: "Event handler raised when a reconnection to the ORTC servers is under way."
    }
  ,onmessage: {
    modifier: "public",
    type: "Function",
    description: "Event handler raised when a message arrives through any channel subscribed in this connection."
    }
  ,messageAdapter: {
    modifier: "public",
    type: "Function",
    description: "Callback method that allow changes to be made to the message. Called when a message arrives through any channel subscribed in this connection."
    }
  
                }
              }
            ,
    description: "structure with the connection attributes.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Creates a new connection based on a JSON object."
    }
  ,dispose: {
      modifier: "public",
      arguments: {
        id: {
    type: "String",
    description: "The id of the intended connection.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Removes all references of the specified Connection."
    }
  ,getById: {
      modifier: "public",
      arguments: {
        id: {
    type: "String",
    description: "The id of the intended connection.",
    mandatory: false
    }
  
      },
      "return": "Number",
      exceptions: [],
      description: "Gets a connection by its internal or user given id."
    }
  ,sendMessage: {
      modifier: "public",
      arguments: {
        message: {
    type: 
              {
                properties: {
                connections: {
    modifier: "public",
    type: "String",
    description: "Ids of the connections."
    }
  ,channel: {
    modifier: "public",
    type: "String",
    description: "Name of the channel."
    }
  ,content: {
    modifier: "public",
    type: "Object",
    description: "Message to be sent."
    }
  ,sendOnly: {
    modifier: "public",
    type: "Boolean",
    description: "Identifies if the message should be sent and discarded by the connection that sends it."
    }
  
                }
              }
            ,
    description: "struture with the definition of the message.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Sends a message through the specified connections and channel."
    }
  
      },
      events: {
      evt_connectioncreate: {
      description: "Fired when a connection is created.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "module that raised this event."
    }
  ,connection: {
    modifier: "public",
    type: "Object",
    description: "the connection that was created."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_connectiondispose: {
      description: "Fired when a connection is deleted.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "module that raised this event."
    }
  ,connection: {
    modifier: "public",
    type: "Object",
    description: "the connection that was deleted."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_xrtmlmessage: {
      description: "Fired when a connection receives an xRTML message.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "module that raised this event."
    }
  ,connection: {
    modifier: "public",
    type: "Object",
    description: "name of the connection that received the xRTML message."
    }
  ,channel: {
    modifier: "public",
    type: "String",
    description: "name of the connections subscribed channel through where the xRTML message was received."
    }
  ,message: {
    modifier: "public",
    type: "xRTML.MessageManager.Message",
    description: "trigger that was registered."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_ConnectionManager);
  
    var 
      _xRTML_DomParser = {
      name: "xRTML.DomParser",
      description: "Loads all the xRTML markup elements that are declared in the web pages' body into the xRTML framework.",
      classes: [
        
      ],
      properties: {
      
      },
      methods: {
      read: {
      modifier: "public",
      arguments: {
        
      },
      "return": "",
      exceptions: [],
      description: "Converts all the xRTML markup elements into object literals and delivers them to the specific modules."
    }
  
      },
      events: {
      evt_configLoad: {
      description: "Fired when the 'config' HTML element is read and the corresponding configuration tag is created. This includes the 'connections' and 'storage' HTML elements.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "module that raised this event."
    }
  ,config: {
    modifier: "public",
    type: "Object",
    description: "structure with the config definition."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_tagsLoad: {
      description: "Fired when the tags' HTML elements have been read and the corresponding objects have been created. This includes the 'connections' and 'storage' HTML elements.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "module that raised this event."
    }
  ,tags: {
    modifier: "public",
    type: "Object",
    description: "Array with the tags' objects. Each object contains the tag's initialization attributes."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_DomParser);
  
    var 
      _xRTML_Effect = {
      name: "xRTML.Effect",
      description: "Provides the ability for tags to run effects on HTML elements as configured by the tag and the effects collection of the tag configuration.",
      classes: [
        
      ],
      properties: {
      
      },
      methods: {
      extend: {
      modifier: "public",
      arguments: {
        target: {
    type: "Object",
    description: "Object to be added the effect capability.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Provides objects with the effect funcionality."
    }
  
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_Effect);
  
    var 
      _xRTML_Error = {
      name: "xRTML.Error",
      description: "Provides error type objects, methods and properties.",
      classes: [
            
    {
      "extends": undefined,
      name: "XRTMLError",
      name: "XRTMLError",
      namespace: "xRTML.Error",
      description: "xRTML specific error class.",
    properties: {
    info: {
      modifier: "",
      type: "Object",
      description: "The info properties associated with this error."
    }
  ,message: {
      modifier: "",
      type: "String",
      description: "The message for this error."
    }
  ,name: {
      modifier: "",
      type: "String",
      description: "The name of the error."
    }
  ,target: {
      modifier: "",
      type: "Object",
      description: "The object that caused the error."
    }
  ,type: {
      modifier: "",
      type: "String",
      description: "The error type."
    }
  
      },
      methods: {
      
      },
      events: {
      
    }
    }
  
      ],
      properties: {
      Codes: {
      modifier: "public",
      type: "Object",
      description: "Possible error codes."
    }
  
      },
      methods: {
      raise: {
      modifier: "public",
      arguments: {
        error: {
    type: "Object",
    description: "The arguments for the XRTMLError constructor.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Throws an error based on the given code."
    }
  
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_Error);
  
    var 
      _xRTML_Event = {
      name: "xRTML.Event",
      description: "Provides cross-browser support for events of HTML tags and supplies xRTML tags with event capabilities.",
      classes: [
        
      ],
      properties: {
      
      },
      methods: {
      bind: {
      modifier: "public",
      arguments: {
        element: {
    type: "Object",
    description: "The target whose events the handlers will be set .",
    mandatory: false
    }
  ,events: {
    type: "Objec",
    description: "The event handlers to be added to the element. Each attribute is the name of an event and the handler is its corresponding value.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Registers event handlers on the specified object's events."
    }
  ,extend: {
      modifier: "public",
      arguments: {
        target: {
    type: "Object",
    description: "Object to be added the event capability.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Provides objects with the event funcionality."
    }
  ,unbind: {
      modifier: "public",
      arguments: {
        element: {
    type: "Object",
    description: "The target whose events the handlers will be set .",
    mandatory: false
    }
  ,events: {
    type: "Objec",
    description: "The event handlers to be added to the element. Each attribute is the name of an event and the handler is its corresponding value.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Unregisters an event handler from the specified object's events"
    }
  
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_Event);
  
    var 
      _xRTML_MessageBroker = {
      name: "xRTML.MessageBroker",
      description: "Module in charge of routing incoming xRTML messages to their proper tags.",
      classes: [
            
    {
      "extends": undefined,
      name: "Trigger",
      name: "Trigger",
      namespace: "xRTML.MessageBroker",
      description: "Keyword that identifies which messages are meant for the existing tags.",
    properties: {
    name: {
      modifier: "public",
      type: "String",
      description: "name of the trigger."
    }
  
      },
      methods: {
      
      },
      events: {
      
    }
    }
  
      ],
      properties: {
      
      },
      methods: {
      
      },
      events: {
      evt_triggerRegister: {
      description: "Fired when a tag registers a trigger.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "module that raised this event."
    }
  ,trigger: {
    modifier: "public",
    type: "xRTML.MessageBroker.Trigger",
    description: "trigger that was registered."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_triggerUnregister: {
      description: "Fired when a tag unregisters a trigger.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "module that raised this event."
    }
  ,trigger: {
    modifier: "public",
    type: "xRTML.MessageBroker.Trigger",
    description: "trigger that was unregistered."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_MessageBroker);
  
    var 
      _xRTML_MessageManager = {
      name: "xRTML.MessageManager",
      description: "Deals with incoming and outgoing xRTML messages within the framework.",
      classes: [
            
    {
      "extends": undefined,
      name: "Message",
      name: "Message",
      namespace: "xRTML.MessageManager",
      description: "Object Representation of an xRTML message.",
    properties: {
    action: {
      modifier: "",
      type: "String",
      description: "name of the action refering to a method of a tag."
    }
  ,data: {
      modifier: "",
      type: "Object",
      description: "Message content regarding the action of the tag."
    }
  ,senderId: {
      modifier: "",
      type: "String",
      description: "Id of the tag that sent the message."
    }
  ,trigger: {
      modifier: "",
      type: "String",
      description: "name of the trigger."
    }
  
      },
      methods: {
      
      },
      events: {
      
    }
    }
  
      ],
      properties: {
      
      },
      methods: {
      create: {
      modifier: "public",
      arguments: {
        message: {
    type: "xRTML.MessageManager.Message",
    description: "xRTML message to be converted.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Creates an xRTML message."
    }
  ,isValid: {
      modifier: "public",
      arguments: {
        message: {
    type: "String",
    description: "String to be tested.",
    mandatory: false
    }
  
      },
      "return": "Boolean",
      exceptions: [],
      description: "Checks if the message is a valid xRTML message."
    }
  ,stringify: {
      modifier: "public",
      arguments: {
        message: {
    type: "xRTML.MessageManager.Message",
    description: "xRTML message to be converted.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Converts a xRTML message object into an xRTML message in the string format, to be sent through a connection."
    }
  ,toJson: {
      modifier: "public",
      arguments: {
        message: {
    type: "String",
    description: "String to be converted.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Converts a xRTML message, that arrived from a connection, in the string format into an xRTML message object."
    }
  
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_MessageManager);
  
    var 
      _xRTML_StorageManager = {
      name: "xRTML.StorageManager",
      description: "",
      classes: [
            
    {
      "extends": undefined,
      name: "BaseStorage",
      name: "BaseStorage",
      namespace: "xRTML.StorageManager",
      description: "Abstract class containing common properties and methods for storage types.",
    properties: {
    autoConnect: {
      modifier: "public",
      type: "Boolean",
      description: "Determines if the storage should be established implicitly after it's created. Defaults to true."
    }
  ,id: {
      modifier: "public",
      type: "String",
      description: "Unique identifier for this storage."
    }
  ,isReady: {
      modifier: "public",
      type: "String",
      description: "Specifies if the storage is ready to be used."
    }
  ,type: {
      modifier: "public",
      type: "String",
      description: "Tells which type of storage to be used. Defaults to KeyValuePairStorage."
    }
  
      },
      methods: {
      
      },
      events: {
      evt_exception: {
      description: "Event dispatched when the storage raises an exception.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "The target object that fired the event."
    }
  ,exception: {
    modifier: "public",
    type: "String",
    description: "The Exception raised."
    }
  
                }
              }
            ,
    description: "An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_ready: {
      description: "Event dispatched when the storage is ready to be used.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "The target object that fired the event."
    }
  
                }
              }
            ,
    description: "An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.",
    mandatory: false
    }
          
        }
      }
    }
  
    }
    }
  ,    
    {
      "extends": "xRTML.StorageManager.BaseStorage",
      name: "KeyValuePairStorage",
      name: "KeyValuePairStorage",
      namespace: "xRTML.StorageManager",
      description: "Class which allows performing data CRUD operations on simple key-value-pair data items.",
    properties: {
    baseUrl: {
      modifier: "public",
      type: "String",
      description: "The base URL to open connections to remote storage and to request sessions if necessary."
    }
  ,connectionId: {
      modifier: "public",
      type: "String",
      description: "The id of an existing Connection to be used by this storage (only necessary if a sessionId hasn't been obtained previously or if an existing Connection should be reused)"
    }
  ,operationsTimeout: {
      modifier: "public",
      type: "Number",
      description: "A timeout in milliseconds for operations requested to the remote storage. Defaults to 2000."
    }
  ,sessionId: {
      modifier: "public",
      type: "String",
      description: "The sessionId that will be used to identify this storage session with the server-side component."
    }
  
      },
      methods: {
      del: {
      modifier: "public",
      arguments: {
        query: {
    type: 
              {
                properties: {
                namespace: {
    modifier: "public",
    type: "Object",
    description: "A specific name-space that might have been used when persisting the data."
    }
  ,namespaceExpire: {
    modifier: "public",
    type: "Object",
    description: "Time in seconds for all the data stored in this namespace to expire (from the time this operation occurs). If a namespace is not specified the expire will be assigned to the global namespace for the Storage afecting ALL THE DATA. Defaults to 31556926 (1 year)."
    }
  ,k: {
    modifier: "public",
    type: "Object",
    description: "A key to identify the key to delete."
    }
  ,ks: {
    modifier: "public",
    type: "Array",
    description: "An array of keys to identify keys to delete."
    }
  
                }
              }
            ,
    description: "Contains the data to delete.",
    mandatory: false
    }
  ,callback: {
    type: 
              {
                properties: {
                success: {
    modifier: "public",
    type: "Boolean",
    description: "A Boolean that will be return as true if the operation is successful and false if an error occurred."
    }
  ,data: {
    modifier: "public",
    type: "Object",
    description: "The data returned from the remote storage if the operation was successful."
    }
  ,error: {
    modifier: "public",
    type: "Object",
    description: "The error returned from the remote storage if the operation was not successful."
    }
  
                }
              }
            ,
    description: "A function to be called when the operation completes.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Deletes one or more items from the remote storage."
    }
  ,get: {
      modifier: "public",
      arguments: {
        query: {
    type: 
              {
                properties: {
                namespace: {
    modifier: "public",
    type: "Object",
    description: "A specific name-space that might have been used when persisting the data."
    }
  ,namespaceExpire: {
    modifier: "public",
    type: "Object",
    description: "Time in seconds for all the data stored in this namespace to expire (from the time this operation occurs). If a namespace is not specified the expire will be assigned to the global namespace for the Storage afecting ALL THE DATA. Defaults to 31556926 (1 year)."
    }
  ,k: {
    modifier: "public",
    type: "Object",
    description: "A key to identify the value to fetch."
    }
  ,ks: {
    modifier: "public",
    type: "Array",
    description: "An array of keys to identify values to fetch."
    }
  
                }
              }
            ,
    description: "Contains the data to consult.",
    mandatory: false
    }
  ,callback: {
    type: 
              {
                properties: {
                success: {
    modifier: "public",
    type: "Boolean",
    description: "A Boolean that will be return as true if the operation is successful and false if an error occurred."
    }
  ,data: {
    modifier: "public",
    type: "Object",
    description: "The data returned from the remote storage if the operation was successful."
    }
  ,error: {
    modifier: "public",
    type: "Object",
    description: "The error returned from the remote storage if the operation was not successful."
    }
  
                }
              }
            ,
    description: "A function to be called when the operation completes.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Gets the value of one or more items from the remote storage."
    }
  ,incr: {
      modifier: "public",
      arguments: {
        data: {
    type: 
              {
                properties: {
                namespace: {
    modifier: "public",
    type: "Object",
    description: "A specific name-space to allow better data separation."
    }
  ,namespaceExpire: {
    modifier: "public",
    type: "Object",
    description: "Time in seconds for all the data stored in this namespace to expire (from the time this operation occurs). If a namespace is not specified the expire will be assigned to the global namespace for the Storage afecting ALL THE DATA. Defaults to 31556926 (1 year)."
    }
  ,pair: {
    modifier: "public",
    type: "Object",
    description: "A key-value pair of data to increment."
    }
  ,k: {
    modifier: "public",
    type: "String",
    description: "A key for the data to increment."
    }
  ,v: {
    modifier: "public",
    type: "Object",
    description: "The value to increment by associated with the key."
    }
  ,pairs: {
    modifier: "public",
    type: "Array",
    description: "An array of pairs of data to increment."
    }
  
                }
              }
            ,
    description: "Contains the data to persist.",
    mandatory: false
    }
  ,callback: {
    type: 
              {
                properties: {
                success: {
    modifier: "public",
    type: "Boolean",
    description: "A Boolean that will be return as true if the operation is successful and false if an error occurred."
    }
  ,data: {
    modifier: "public",
    type: "Object",
    description: "The data returned from the remote storage if the operation was successful."
    }
  ,error: {
    modifier: "public",
    type: "Object",
    description: "The error returned from the remote storage if the operation was not successful."
    }
  
                }
              }
            ,
    description: "A function to be called when the operation completes.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Increments the value of one or more items in the remote storage (only applicable for numbers)."
    }
  ,set: {
      modifier: "public",
      arguments: {
        data: {
    type: 
              {
                properties: {
                namespace: {
    modifier: "public",
    type: "Object",
    description: "A specific name-space to allow better data separation."
    }
  ,namespaceExpire: {
    modifier: "public",
    type: "Object",
    description: "Time in seconds for all the data stored in this namespace to expire (from the time this operation occurs). If a namespace is not specified the expire will be assigned to the global namespace for the Storage afecting ALL THE DATA. Defaults to 31556926 (1 year)."
    }
  ,pair: {
    modifier: "public",
    type: "Object",
    description: "A key-value pair of data to persist."
    }
  ,k: {
    modifier: "public",
    type: "String",
    description: "A key for the data to persist."
    }
  ,v: {
    modifier: "public",
    type: "Object",
    description: "The value to persist associated with the key."
    }
  ,pairs: {
    modifier: "public",
    type: "Array",
    description: "An array of pairs of data to persist."
    }
  
                }
              }
            ,
    description: "Contains the data to persist.",
    mandatory: false
    }
  ,callback: {
    type: 
              {
                properties: {
                success: {
    modifier: "public",
    type: "Boolean",
    description: "A Boolean that will be return as true if the operation is successful and false if an error occurred."
    }
  ,data: {
    modifier: "public",
    type: "Object",
    description: "The data returned from the remote storage if the operation was successful."
    }
  ,error: {
    modifier: "public",
    type: "Object",
    description: "The error returned from the remote storage if the operation was not successful."
    }
  
                }
              }
            ,
    description: "A function to be called when the operation completes.",
    mandatory: false
    }
  
      },
      "return": undefined,
      exceptions: [],
      description: "Creates or updates one or more items on the remote storage."
    }
  
      },
      events: {
      evt_session: {
      description: "Raised when a new session is obtained from the remote storage.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "The target object that fired the event."
    }
  ,sessionId: {
    modifier: "public",
    type: "Object",
    description: "The id of the session obtained."
    }
  
                }
              }
            ,
    description: "An object containing the information returned when the event occurs, such as its target and the relevant data associated with it.",
    mandatory: false
    }
          
        }
      }
    }
  
    }
    }
  
      ],
      properties: {
      
      },
      methods: {
      
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_StorageManager);
  
    var 
      _xRTML_TagManager = {
      name: "xRTML.TagManager",
      description: "Provides access to set of methods that allow the management of the xRTML tags.",
      classes: [
        
      ],
      properties: {
      
      },
      methods: {
      create: {
      modifier: "public",
      arguments: {
        tagObject: {
    type: 
              {
                properties: {
                name: {
    modifier: "public",
    type: "String",
    description: "Type of class that should be instantiated given this object's struture."
    }
  
                }
              }
            ,
    description: "structure containing the tag's definition that should be used for the tag's constructor (init function).",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Creates an instance of a tag."
    }
  ,getById: {
      modifier: "public",
      arguments: {
        id: {
    type: "Number",
    description: "The id of the intended tag.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Gets a tag by its internal or user given id."
    }
  ,getClasses: {
      modifier: "public",
      arguments: {
        
      },
      "return": "",
      exceptions: [],
      description: "Gets the names of all the registered tag classes."
    }
  ,register: {
      modifier: "public",
      arguments: {
        tagClass: {
    type: 
              {
                properties: {
                name: {
    modifier: "public",
    type: "String",
    description: "Type of class that should be instantiated given this object's struture."
    }
  ,base: {
    modifier: "public",
    type: "String",
    description: "Name of a tag's class from where this new class will extend. Defaults to Tag."
    }
  ,struct: {
    modifier: "public",
    type: "Function",
    description: "The class referring to a xRTML tag."
    }
  
                }
              }
            ,
    description: "structure with the tag class.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Registers an tag class."
    }
  
      },
      events: {
      evt_tagcreate: {
      description: "Fired when a tag is created.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "module that raised this event."
    }
  ,tag: {
    modifier: "public",
    type: "Object",
    description: "the created tag."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_tagdispose: {
      description: "Fired when a tag is disposed.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "module that raised this event."
    }
  ,tag: {
    modifier: "public",
    type: "Object",
    description: "the disposed tag."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_TagManager);
  
    var 
      _xRTML_Tags = {
      name: "xRTML.Tags",
      description: "Holds all existing tags classes",
      classes: [
            
    {
      "extends": undefined,
      name: "Tag",
      name: "Tag",
      namespace: "xRTML.Tags",
      description: "Base class for all xRTML tags.",
    properties: {
    active: {
      modifier: "",
      type: "Boolean",
      description: "Identifies if the tag is enabled to send and receive xRTML messages. Defaults to true."
    }
  ,channelId: {
      modifier: "",
      type: "String",
      description: "Channel through which xRTML messages will be sent by this tag."
    }
  ,connections: {
      modifier: "",
      type: "String",
      description: "Identification of the tag, assigned by the user. For tags that will send messages."
    }
  ,id: {
      modifier: "",
      type: "String",
      description: "Identification of the tag, assigned by the user."
    }
  ,internalId: {
      modifier: "",
      type: "String",
      description: "Identification of the tag, automatically generated."
    }
  ,receiveOwnMessages: {
      modifier: "",
      type: "Boolean",
      description: "Indicates the reception of the xRTML messages sent by the tag itself."
    }
  ,target: {
      modifier: "",
      type: "Object",
      description: "Root HTML element the tag will interact with. Defaults to the web-page's body HTML element."
    }
  ,triggers: {
      modifier: "",
      type: "xRTML.MessageBroker.Trigger",
      description: "Array of triggers that will prompt the tag to take action. The tag will receive and process all xRTML messages that include these triggers."
    }
  
      },
      methods: {
      activate: {
      modifier: "public",
      arguments: {
        message: {
    type: 
              {
                properties: {
                active: {
    modifier: "public",
    type: "Boolean",
    description: "The new state of the tag."
    }
  
                }
              }
            ,
    description: "struture with the definition of the xRTML message.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Changes the active state of the tag."
    }
  ,dispose: {
      modifier: "public",
      arguments: {
        
      },
      "return": "",
      exceptions: [],
      description: "Removes all references of the tag. This includes removing the tag's related HTML content from the page."
    }
  ,process: {
      modifier: "public",
      arguments: {
        message: {
    type: 
              {
                properties: {
                action: {
    modifier: "public",
    type: "String",
    description: "The method of the tag that will be called."
    }
  ,data: {
    modifier: "public",
    type: "Object",
    description: "The action related arguments."
    }
  
                }
              }
            ,
    description: "struture with the definition of the xRTML message.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Calls the appropriate action based on the received xRTML message."
    }
  ,sendMessage: {
      modifier: "public",
      arguments: {
        message: {
    type: 
              {
                properties: {
                connectionId: {
    modifier: "public",
    type: "String",
    description: "connection id."
    }
  ,channelId: {
    modifier: "public",
    type: "String",
    description: "channel name."
    }
  ,action: {
    modifier: "public",
    type: "String",
    description: "The method of the tag that will be called."
    }
  ,data: {
    modifier: "public",
    type: "Object",
    description: "The action related arguments."
    }
  
                }
              }
            ,
    description: "struture with the definition of the xRTML message.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Sends an xRTML message using the channel and triggers of the tag."
    }
  
      },
      events: {
      evt_active: {
      description: "Fired when the tag's active state changes.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "tag that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_dispose: {
      description: "Fired when the tag is deleted.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "tag that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_postProcess: {
      description: "Fired when the tag finishes processing an xRTML message.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "tag that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_preInit: {
      description: "Fired before the tag initializes.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "tag that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  ,evt_preProcess: {
      description: "Fired before the tag processes an xRTML message.",
      handler: {
        arguments: {
          e: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "tag that raised this event."
    }
  
                }
              }
            ,
    description: "struture with the definition of the event's parameters.",
    mandatory: false
    }
          
        }
      }
    }
  
    }
    }
  
      ],
      properties: {
      
      },
      methods: {
      
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_Tags);
  
    var 
      _xRTML_Templating = {
      name: "xRTML.Templating",
      description: "Provides access to a set of methods that allows the binding of UI attributes to a tag's model data.",
      classes: [
        
      ],
      properties: {
      bindingHandlers: {
      modifier: "public",
      type: "Object",
      description: "The available binding handlers. Used to register custom bindings."
    }
  
      },
      methods: {
      applyBindings: {
      modifier: "public",
      arguments: {
        arg: {
    type: 
              {
                properties: {
                viewModel: {
    modifier: "public",
    type: "Object",
    description: ""
    }
  ,node: {
    modifier: "public",
    type: "Object",
    description: ""
    }
  ,bindig: {
    modifier: "public",
    type: "Object",
    description: ""
    }
  
                }
              }
            ,
    description: "Structure with the binding attributes.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Add new binding."
    }
  ,clearNode: {
      modifier: "public",
      arguments: {
        node: {
    type: "Object",
    description: "- HTML node",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Remove binding from node."
    }
  ,inject: {
      modifier: "public",
      arguments: {
        args: {
    type: 
              {
                properties: {
                target: {
    modifier: "public",
    type: "Object",
    description: "The selector of the DOM element where the script will be injected."
    }
  ,id: {
    modifier: "public",
    type: "String",
    description: "The id of the template."
    }
  ,content: {
    modifier: "public",
    type: "String",
    description: "The content of the template."
    }
  
                }
              }
            ,
    description: "The arguments to inject the template.",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Inject a template script into the page."
    }
  ,observable: {
      modifier: "public",
      arguments: {
        obj: {
    type: "Object",
    description: "Object to be observed",
    mandatory: false
    }
  
      },
      "return": "",
      exceptions: [],
      description: "Set an object as observable"
    }
  
      },
      events: {
      
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_Templating);
  
    var 
      _xRTML_TraceMonitor = {
      name: "xRTML.TraceMonitor",
      description: "Monitors the flow of messages, DOM reading and tag and connection management, by logging messages to the web-browser console. It can, also, be set to perform remote debugging. Should only be enabled for development or debugging purposes.",
      classes: [
        
      ],
      properties: {
      
      },
      methods: {
      
      },
      events: {
      evt_ready: {
      description: "Fired when xRTML finished its initialization routine.",
      handler: {
        arguments: {
                  
        }
      }
    }
  
      }
    };

    xRTML.Metadata.registerModule(
      _xRTML_TraceMonitor);
  
