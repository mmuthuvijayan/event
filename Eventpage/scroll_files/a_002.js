/* Detect-zoom
 * -----------
 * Cross Browser Zoom and Pixel Ratio Detector
 * Version 1.0.4 | Apr 1 2013
 * dual-licensed under the WTFPL and MIT license
 * Maintained by https://github/tombigel
 * Original developer https://github.com/yonran
 */

//AMD and CommonJS initialization copied from https://github.com/zohararad/audio5js
(function (root, ns, factory) {
    "use strict";

    if (typeof (module) !== 'undefined' && module.exports) { // CommonJS
        module.exports = factory(ns, root);
    } else if (typeof (define) === 'function' && define.amd) { // AMD
        define("factory", function () {
            return factory(ns, root);
        });
    } else {
        root[ns] = factory(ns, root);
    }

}(window, 'detectZoom', function () {

    /**
     * Use devicePixelRatio if supported by the browser
     * @return {Number}
     * @private
     */
    var devicePixelRatio = function () {
        return window.devicePixelRatio || 1;
    };

    /**
     * Fallback function to set default values
     * @return {Object}
     * @private
     */
    var fallback = function () {
        return {
            zoom: 1,
            devicePxPerCssPx: 1
        };
    };
    /**
     * IE 8 and 9: no trick needed!
     * TODO: Test on IE10 and Windows 8 RT
     * @return {Object}
     * @private
     **/
    var ie8 = function () {
        var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100) / 100;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * For IE10 we need to change our technique again...
     * thanks https://github.com/stefanvanburen
     * @return {Object}
     * @private
     */
    var ie10 = function () {
        var zoom = Math.round((document.documentElement.offsetHeight / window.innerHeight) * 100) / 100;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * Mobile WebKit
     * the trick: window.innerWIdth is in CSS pixels, while
     * screen.width and screen.height are in system pixels.
     * And there are no scrollbars to mess up the measurement.
     * @return {Object}
     * @private
     */
    var webkitMobile = function () {
        var deviceWidth = (Math.abs(window.orientation) == 90) ? screen.height : screen.width;
        var zoom = deviceWidth / window.innerWidth;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * Desktop Webkit
     * the trick: an element's clientHeight is in CSS pixels, while you can
     * set its line-height in system pixels using font-size and
     * -webkit-text-size-adjust:none.
     * device-pixel-ratio: http://www.webkit.org/blog/55/high-dpi-web-sites/
     *
     * Previous trick (used before http://trac.webkit.org/changeset/100847):
     * documentElement.scrollWidth is in CSS pixels, while
     * document.width was in system pixels. Note that this is the
     * layout width of the document, which is slightly different from viewport
     * because document width does not include scrollbars and might be wider
     * due to big elements.
     * @return {Object}
     * @private
     */
    var webkit = function () {
        var important = function (str) {
            return str.replace(/;/g, " !important;");
        };

        var div = document.createElement('div');
        div.innerHTML = "1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0";
        div.setAttribute('style', important('font: 100px/1em sans-serif; -webkit-text-size-adjust: none; text-size-adjust: none; height: auto; width: 1em; padding: 0; overflow: visible;'));

        // The container exists so that the div will be laid out in its own flow
        // while not impacting the layout, viewport size, or display of the
        // webpage as a whole.
        // Add !important and relevant CSS rule resets
        // so that other rules cannot affect the results.
        var container = document.createElement('div');
        container.setAttribute('style', important('width:0; height:0; overflow:hidden; visibility:hidden; position: absolute;'));
        container.appendChild(div);

        document.body.appendChild(container);
        var zoom = 1000 / div.clientHeight;
        zoom = Math.round(zoom * 100) / 100;
        document.body.removeChild(container);

        return{
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * no real trick; device-pixel-ratio is the ratio of device dpi / css dpi.
     * (Note that this is a different interpretation than Webkit's device
     * pixel ratio, which is the ratio device dpi / system dpi).
     *
     * Also, for Mozilla, there is no difference between the zoom factor and the device ratio.
     *
     * @return {Object}
     * @private
     */
    var firefox4 = function () {
        var zoom = mediaQueryBinarySearch('min--moz-device-pixel-ratio', '', 0, 10, 20, 0.0001);
        zoom = Math.round(zoom * 100) / 100;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom
        };
    };

    /**
     * Firefox 18.x
     * Mozilla added support for devicePixelRatio to Firefox 18,
     * but it is affected by the zoom level, so, like in older
     * Firefox we can't tell if we are in zoom mode or in a device
     * with a different pixel ratio
     * @return {Object}
     * @private
     */
    var firefox18 = function () {
        return {
            zoom: firefox4().zoom,
            devicePxPerCssPx: devicePixelRatio()
        };
    };

    /**
     * works starting Opera 11.11
     * the trick: outerWidth is the viewport width including scrollbars in
     * system px, while innerWidth is the viewport width including scrollbars
     * in CSS px
     * @return {Object}
     * @private
     */
    var opera11 = function () {
        var zoom = window.top.outerWidth / window.top.innerWidth;
        zoom = Math.round(zoom * 100) / 100;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * Use a binary search through media queries to find zoom level in Firefox
     * @param property
     * @param unit
     * @param a
     * @param b
     * @param maxIter
     * @param epsilon
     * @return {Number}
     */
    var mediaQueryBinarySearch = function (property, unit, a, b, maxIter, epsilon) {
        var matchMedia;
        var head, style, div;
        if (window.matchMedia) {
            matchMedia = window.matchMedia;
        } else {
            head = document.getElementsByTagName('head')[0];
            style = document.createElement('style');
            head.appendChild(style);

            div = document.createElement('div');
            div.className = 'mediaQueryBinarySearch';
            div.style.display = 'none';
            document.body.appendChild(div);

            matchMedia = function (query) {
                style.sheet.insertRule('@media ' + query + '{.mediaQueryBinarySearch ' + '{text-decoration: underline} }', 0);
                var matched = getComputedStyle(div, null).textDecoration == 'underline';
                style.sheet.deleteRule(0);
                return {matches: matched};
            };
        }
        var ratio = binarySearch(a, b, maxIter);
        if (div) {
            head.removeChild(style);
            document.body.removeChild(div);
        }
        return ratio;

        function binarySearch(a, b, maxIter) {
            var mid = (a + b) / 2;
            if (maxIter <= 0 || b - a < epsilon) {
                return mid;
            }
            var query = "(" + property + ":" + mid + unit + ")";
            if (matchMedia(query).matches) {
                return binarySearch(mid, b, maxIter - 1);
            } else {
                return binarySearch(a, mid, maxIter - 1);
            }
        }
    };

    /**
     * Generate detection function
     * @private
     */
    var detectFunction = (function () {
        var func = fallback;
        //IE8+
        if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
            func = ie8;
        }
        // IE10+ / Touch
        else if (window.navigator.msMaxTouchPoints) {
            func = ie10;
        }
        //Mobile Webkit
        else if ('orientation' in window && typeof document.body.style.webkitMarquee === 'string') {
            func = webkitMobile;
        }
        //WebKit
        else if (typeof document.body.style.webkitMarquee === 'string') {
            func = webkit;
        }
        //Opera
        else if (navigator.userAgent.indexOf('Opera') >= 0) {
            func = opera11;
        }
        //Last one is Firefox
        //FF 18.x
        else if (window.devicePixelRatio) {
            func = firefox18;
        }
        //FF 4.0 - 17.x
        else if (firefox4().zoom > 0.001) {
            func = firefox4;
        }

        return func;
    }());


    return ({

        /**
         * Ratios.zoom shorthand
         * @return {Number} Zoom level
         */
        zoom: function () {
            return detectFunction().zoom;
        },

        /**
         * Ratios.devicePxPerCssPx shorthand
         * @return {Number} devicePxPerCssPx level
         */
        device: function () {
            return detectFunction().devicePxPerCssPx;
        }
    });
}));

var wpcom_img_zoomer = {
        clientHintSupport: {
                gravatar: false,
                files: false,
                photon: false,
                mshots: false,
                staticAssets: false,
                latex: false,
                imgpress: false,
        },
	useHints: false,
	zoomed: false,
	timer: null,
	interval: 1000, // zoom polling interval in millisecond

	// Should we apply width/height attributes to control the image size?
	imgNeedsSizeAtts: function( img ) {
		// Do not overwrite existing width/height attributes.
		if ( img.getAttribute('width') !== null || img.getAttribute('height') !== null )
			return false;
		// Do not apply the attributes if the image is already constrained by a parent element.
		if ( img.width < img.naturalWidth || img.height < img.naturalHeight )
			return false;
		return true;
	},

        hintsFor: function( service ) {
                if ( this.useHints === false ) {
                        return false;
                }
                if ( this.hints() === false ) {
                        return false;
                }
                if ( typeof this.clientHintSupport[service] === "undefined" ) {
                        return false;
                }
                if ( this.clientHintSupport[service] === true ) {
                        return true;
                }
                return false;
        },

	hints: function() {
		try {
			var chrome = window.navigator.userAgent.match(/\sChrome\/([0-9]+)\.[.0-9]+\s/)
			if (chrome !== null) {
				var version = parseInt(chrome[1], 10)
				if (isNaN(version) === false && version >= 46) {
					return true
				}
			}
		} catch (e) {
			return false
		}
		return false
	},

	init: function() {
		var t = this;
		try{
			t.zoomImages();
			t.timer = setInterval( function() { t.zoomImages(); }, t.interval );
		}
		catch(e){
		}
	},

	stop: function() {
		if ( this.timer )
			clearInterval( this.timer );
	},

	getScale: function() {
		var scale = detectZoom.device();
		// Round up to 1.5 or the next integer below the cap.
		if      ( scale <= 1.0 ) scale = 1.0;
		else if ( scale <= 1.5 ) scale = 1.5;
		else if ( scale <= 2.0 ) scale = 2.0;
		else if ( scale <= 3.0 ) scale = 3.0;
		else if ( scale <= 4.0 ) scale = 4.0;
		else                     scale = 5.0;
		return scale;
	},

	shouldZoom: function( scale ) {
		var t = this;
		// Do not operate on hidden frames.
		if ( "innerWidth" in window && !window.innerWidth )
			return false;
		// Don't do anything until scale > 1
		if ( scale == 1.0 && t.zoomed == false )
			return false;
		return true;
	},

	zoomImages: function() {
		var t = this;
		var scale = t.getScale();
		if ( ! t.shouldZoom( scale ) ){
			return;
		}
		t.zoomed = true;
		// Loop through all the <img> elements on the page.
		var imgs = document.getElementsByTagName("img");

		for ( var i = 0; i < imgs.length; i++ ) {
			// Wait for original images to load
			if ( "complete" in imgs[i] && ! imgs[i].complete )
				continue;

			// Skip images that have srcset attributes.
			if ( imgs[i].hasAttribute('srcset') ) {
				continue;
			}

			// Skip images that don't need processing.
			var imgScale = imgs[i].getAttribute("scale");
			if ( imgScale == scale || imgScale == "0" )
				continue;

			// Skip images that have already failed at this scale
			var scaleFail = imgs[i].getAttribute("scale-fail");
			if ( scaleFail && scaleFail <= scale )
				continue;

			// Skip images that have no dimensions yet.
			if ( ! ( imgs[i].width && imgs[i].height ) )
				continue;

			// Skip images from Lazy Load plugins
			if ( ! imgScale && imgs[i].getAttribute("data-lazy-src") && (imgs[i].getAttribute("data-lazy-src") !== imgs[i].getAttribute("src")))
				continue;

			if ( t.scaleImage( imgs[i], scale ) ) {
				// Mark the img as having been processed at this scale.
				imgs[i].setAttribute("scale", scale);
			}
			else {
				// Set the flag to skip this image.
				imgs[i].setAttribute("scale", "0");
			}
		}
	},

	scaleImage: function( img, scale ) {
		var t = this;
		var newSrc = img.src;

                var isFiles = false;
                var isLatex = false;
                var isPhoton = false;

		// Skip slideshow images
		if ( img.parentNode.className.match(/slideshow-slide/) )
			return false;

		// Scale gravatars that have ?s= or ?size=
		if ( img.src.match( /^https?:\/\/([^\/]*\.)?gravatar\.com\/.+[?&](s|size)=/ ) ) {
                        if ( this.hintsFor( "gravatar" ) === true ) {
                                return false;
                        }
			newSrc = img.src.replace( /([?&](s|size)=)(\d+)/, function( $0, $1, $2, $3 ) {
				// Stash the original size
				var originalAtt = "originals",
				originalSize = img.getAttribute(originalAtt);
				if ( originalSize === null ) {
					originalSize = $3;
					img.setAttribute(originalAtt, originalSize);
					if ( t.imgNeedsSizeAtts( img ) ) {
						// Fix width and height attributes to rendered dimensions.
						img.width = img.width;
						img.height = img.height;
					}
				}
				// Get the width/height of the image in CSS pixels
				var size = img.clientWidth;
				// Convert CSS pixels to device pixels
				var targetSize = Math.ceil(img.clientWidth * scale);
				// Don't go smaller than the original size
				targetSize = Math.max( targetSize, originalSize );
				// Don't go larger than the service supports
				targetSize = Math.min( targetSize, 512 );
				return $1 + targetSize;
			});
		}

		// Scale mshots that have width
		else if ( img.src.match(/^https?:\/\/([^\/]+\.)*(wordpress|wp)\.com\/mshots\/.+[?&]w=\d+/) ) {
                        if ( this.hintsFor( "mshots" ) === true ) {
                                return false;
                        }
			newSrc = img.src.replace( /([?&]w=)(\d+)/, function($0, $1, $2) {
				// Stash the original size
				var originalAtt = 'originalw', originalSize = img.getAttribute(originalAtt);
				if ( originalSize === null ) {
					originalSize = $2;
					img.setAttribute(originalAtt, originalSize);
					if ( t.imgNeedsSizeAtts( img ) ) {
						// Fix width and height attributes to rendered dimensions.
						img.width = img.width;
						img.height = img.height;
					}
				}
				// Get the width of the image in CSS pixels
				var size = img.clientWidth;
				// Convert CSS pixels to device pixels
				var targetSize = Math.ceil(size * scale);
				// Don't go smaller than the original size
				targetSize = Math.max( targetSize, originalSize );
				// Don't go bigger unless the current one is actually lacking
				if ( scale > img.getAttribute("scale") && targetSize <= img.naturalWidth )
					targetSize = $2;
				if ( $2 != targetSize )
					return $1 + targetSize;
				return $0;
			});

			// Update height attribute to match width
			newSrc = newSrc.replace( /([?&]h=)(\d+)/, function($0, $1, $2) {
				if ( newSrc == img.src ) {
					return $0;
				}
				// Stash the original size
				var originalAtt = 'originalh', originalSize = img.getAttribute(originalAtt);
				if ( originalSize === null ) {
					originalSize = $2;
					img.setAttribute(originalAtt, originalSize);
				}
				// Get the height of the image in CSS pixels
				var size = img.clientHeight;
				// Convert CSS pixels to device pixels
				var targetSize = Math.ceil(size * scale);
				// Don't go smaller than the original size
				targetSize = Math.max( targetSize, originalSize );
				// Don't go bigger unless the current one is actually lacking
				if ( scale > img.getAttribute("scale") && targetSize <= img.naturalHeight )
					targetSize = $2;
				if ( $2 != targetSize )
					return $1 + targetSize;
				return $0;
			});
		}

		// Scale simple imgpress queries (s0.wp.com) that only specify w/h/fit
		else if ( img.src.match(/^https?:\/\/([^\/.]+\.)*(wp|wordpress)\.com\/imgpress\?(.+)/) ) {
                        if ( this.hintsFor( "imgpress" ) === true ) {
                                return false; 
                        }
			var imgpressSafeFunctions = ["zoom", "url", "h", "w", "fit", "filter", "brightness", "contrast", "colorize", "smooth", "unsharpmask"];
			// Search the query string for unsupported functions.
			var qs = RegExp.$3.split('&');
			for ( var q in qs ) {
				q = qs[q].split('=')[0];
				if ( imgpressSafeFunctions.indexOf(q) == -1 ) {
					return false;
				}
			}
			// Fix width and height attributes to rendered dimensions.
			img.width = img.width;
			img.height = img.height;
			// Compute new src
			if ( scale == 1 )
				newSrc = img.src.replace(/\?(zoom=[^&]+&)?/, '?');
			else
				newSrc = img.src.replace(/\?(zoom=[^&]+&)?/, '?zoom=' + scale + '&');
		}

		// Scale files.wordpress.com, LaTeX, or Photon images (i#.wp.com)
		else if (
			( isFiles = img.src.match(/^https?:\/\/([^\/]+)\.files\.wordpress\.com\/.+[?&][wh]=/) ) ||
			( isLatex = img.src.match(/^https?:\/\/([^\/.]+\.)*(wp|wordpress)\.com\/latex\.php\?(latex|zoom)=(.+)/) ) ||
			( isPhoton = img.src.match(/^https?:\/\/i[\d]{1}\.wp\.com\/(.+)/) )
		) {
                        if ( false !== isFiles && this.hintsFor( "files" ) === true ) {
                                return false
                        }
                        if ( false !== isLatex && this.hintsFor( "latex" ) === true ) {
                                return false
                        }
                        if ( false !== isPhoton && this.hintsFor( "photon" ) === true ) {
                                return false
                        }
			// Fix width and height attributes to rendered dimensions.
			img.width = img.width;
			img.height = img.height;
			// Compute new src
			if ( scale == 1 ) {
				newSrc = img.src.replace(/\?(zoom=[^&]+&)?/, '?');
			} else {
				newSrc = img.src;

				var url_var = newSrc.match( /([?&]w=)(\d+)/ );
				if ( url_var !== null && url_var[2] ) {
					newSrc = newSrc.replace( url_var[0], url_var[1] + img.width );
				}

				url_var = newSrc.match( /([?&]h=)(\d+)/ );
				if ( url_var !== null && url_var[2] ) {
					newSrc = newSrc.replace( url_var[0], url_var[1] + img.height );
				}

				var zoom_arg = '&zoom=2';
				if ( !newSrc.match( /\?/ ) ) {
					zoom_arg = '?zoom=2';
				}
				img.setAttribute( 'srcset', newSrc + zoom_arg + ' ' + scale + 'x' );
			}
		}

		// Scale static assets that have a name matching *-1x.png or *@1x.png
		else if ( img.src.match(/^https?:\/\/[^\/]+\/.*[-@]([12])x\.(gif|jpeg|jpg|png)(\?|$)/) ) {
                        if ( this.hintsFor( "staticAssets" ) === true ) {
                                return false; 
                        }
			// Fix width and height attributes to rendered dimensions.
			img.width = img.width;
			img.height = img.height;
			var currentSize = RegExp.$1, newSize = currentSize;
			if ( scale <= 1 )
				newSize = 1;
			else
				newSize = 2;
			if ( currentSize != newSize )
				newSrc = img.src.replace(/([-@])[12]x\.(gif|jpeg|jpg|png)(\?|$)/, '$1'+newSize+'x.$2$3');
		}

		else {
			return false;
		}

		// Don't set img.src unless it has changed. This avoids unnecessary reloads.
		if ( newSrc != img.src ) {
			// Store the original img.src
			var prevSrc, origSrc = img.getAttribute("src-orig");
			if ( !origSrc ) {
				origSrc = img.src;
				img.setAttribute("src-orig", origSrc);
			}
			// In case of error, revert img.src
			prevSrc = img.src;
			img.onerror = function(){
				img.src = prevSrc;
				if ( img.getAttribute("scale-fail") < scale )
					img.setAttribute("scale-fail", scale);
				img.onerror = null;
			};
			// Finally load the new image
			img.src = newSrc;
		}

		return true;
	}
};

wpcom_img_zoomer.init();
;
/* global pm, wpcom_reblog */

var jetpackLikesWidgetQueue = [];
var jetpackLikesWidgetBatch = [];
var jetpackLikesMasterReady = false;

function JetpackLikespostMessage( message, target ) {
	if ( 'string' === typeof message ){
		try {
			message = JSON.parse( message );
		} catch(e) {
			return;
		}
	}

	pm( {
		target: target,
		type: 'likesMessage',
		data: message,
		origin: '*'
	} );
}

function JetpackLikesBatchHandler() {
	var requests = [];
	jQuery( 'div.jetpack-likes-widget-unloaded' ).each( function() {
		if ( jetpackLikesWidgetBatch.indexOf( this.id ) > -1 ) {
			return;
		}
		jetpackLikesWidgetBatch.push( this.id );
		var regex = /like-(post|comment)-wrapper-(\d+)-(\d+)-(\w+)/,
			match = regex.exec( this.id ),
			info;

		if ( ! match || match.length !== 5 ) {
			return;
		}

		info = {
			blog_id: match[2],
			width:   this.width
		};

		if ( 'post' === match[1] ) {
			info.post_id = match[3];
		} else if ( 'comment' === match[1] ) {
			info.comment_id = match[3];
		}

		info.obj_id = match[4];

		requests.push( info );
	});

	if ( requests.length > 0 ) {
		JetpackLikespostMessage( { event: 'initialBatch', requests: requests }, window.frames['likes-master'] );
	}
}

function JetpackLikesMessageListener( event, message ) {
	var allowedOrigin, $container, $list, offset, rowLength, height, scrollbarWidth;

	if ( 'undefined' === typeof event.event ) {
		return;
	}

	// We only allow messages from one origin
	allowedOrigin = window.location.protocol + '//widgets.wp.com';
	if ( allowedOrigin !== message.origin ) {
		return;
	}

	if ( 'masterReady' === event.event ) {
		jQuery( document ).ready( function() {
			jetpackLikesMasterReady = true;

			var stylesData = {
					event: 'injectStyles'
				},
				$sdTextColor = jQuery( '.sd-text-color' ),
				$sdLinkColor = jQuery( '.sd-link-color' );

			if ( jQuery( 'iframe.admin-bar-likes-widget' ).length > 0 ) {
				JetpackLikespostMessage( { event: 'adminBarEnabled' }, window.frames[ 'likes-master' ] );

				stylesData.adminBarStyles = {
					background: jQuery( '#wpadminbar .quicklinks li#wp-admin-bar-wpl-like > a' ).css( 'background' ),
					isRtl: ( 'rtl' === jQuery( '#wpadminbar' ).css( 'direction' ) )
				};
			}

			// enable reblogs if we're on a single post page
			if ( jQuery( 'body' ).hasClass( 'single' ) ) {
				JetpackLikespostMessage( { event: 'reblogsEnabled' }, window.frames[ 'likes-master' ] );
			}

			if ( ! window.addEventListener ) {
				jQuery( '#wp-admin-bar-admin-bar-likes-widget' ).hide();
			}

			stylesData.textStyles = {
				color:          $sdTextColor.css( 'color' ),
				fontFamily:     $sdTextColor.css( 'font-family' ),
				fontSize:       $sdTextColor.css( 'font-size' ),
				direction:      $sdTextColor.css( 'direction' ),
				fontWeight:     $sdTextColor.css( 'font-weight' ),
				fontStyle:      $sdTextColor.css( 'font-style' ),
				textDecoration: $sdTextColor.css('text-decoration')
			};

			stylesData.linkStyles = {
				color:          $sdLinkColor.css('color'),
				fontFamily:     $sdLinkColor.css('font-family'),
				fontSize:       $sdLinkColor.css('font-size'),
				textDecoration: $sdLinkColor.css('text-decoration'),
				fontWeight:     $sdLinkColor.css( 'font-weight' ),
				fontStyle:      $sdLinkColor.css( 'font-style' )
			};

			JetpackLikespostMessage( stylesData, window.frames[ 'likes-master' ] );

			JetpackLikesBatchHandler();

			jQuery( document ).on( 'inview', 'div.jetpack-likes-widget-unloaded', function() {
				jetpackLikesWidgetQueue.push( this.id );
			});
		});
	}

	if ( 'showLikeWidget' === event.event ) {
		jQuery( '#' + event.id + ' .post-likes-widget-placeholder'  ).fadeOut( 'fast', function() {
			jQuery( '#' + event.id + ' .post-likes-widget' ).fadeIn( 'fast', function() {
				JetpackLikespostMessage( { event: 'likeWidgetDisplayed', blog_id: event.blog_id, post_id: event.post_id, obj_id: event.obj_id }, window.frames['likes-master'] );
			});
		});
	}

	if ( 'clickReblogFlair' === event.event ) {
		wpcom_reblog.toggle_reblog_box_flair( event.obj_id );
	}

	if ( 'showOtherGravatars' === event.event ) {
		$container = jQuery( '#likes-other-gravatars' );
		$list = $container.find( 'ul' );

		$container.hide();
		$list.html( '' );

		$container.find( '.likes-text span' ).text( event.total );

		jQuery.each( event.likers, function( i, liker ) {
			var element = jQuery( '<li><a><img /></a></li>' );
			element.addClass( liker.css_class );

			element.find( 'a' ).
				attr({
					href: liker.profile_URL,
					rel: 'nofollow',
					target: '_parent'
				}).
				addClass( 'wpl-liker' );

			element.find( 'img' ).
				attr({
					src: liker.avatar_URL,
					alt: liker.name
				}).
				css({
					width: '30px',
					height: '30px',
					paddingRight: '3px'
				});

			$list.append( element );
		} );

		offset = jQuery( '[name=\'' + event.parent + '\']' ).offset();

		$container.css( 'left', offset.left + event.position.left - 10 + 'px' );
		$container.css( 'top', offset.top + event.position.top - 33 + 'px' );

		rowLength = Math.floor( event.width / 37 );
		height = ( Math.ceil( event.likers.length / rowLength ) * 37 ) + 13;
		if ( height > 204 ) {
			height = 204;
		}

		$container.css( 'height', height + 'px' );
		$container.css( 'width', rowLength * 37 - 7 + 'px' );

		$list.css( 'width', rowLength * 37 + 'px' );

		$container.fadeIn( 'slow' );

		scrollbarWidth = $list[0].offsetWidth - $list[0].clientWidth;
		if ( scrollbarWidth > 0 ) {
			$container.width( $container.width() + scrollbarWidth );
			$list.width( $list.width() + scrollbarWidth );
		}
	}
}

pm.bind( 'likesMessage', JetpackLikesMessageListener );

jQuery( document ).click( function( e ) {
	var $container = jQuery( '#likes-other-gravatars' );

	if ( $container.has( e.target ).length === 0 ) {
		$container.fadeOut( 'slow' );
	}
});

function JetpackLikesWidgetQueueHandler() {
	var $wrapper, wrapperID, found;
	if ( ! jetpackLikesMasterReady ) {
		setTimeout( JetpackLikesWidgetQueueHandler, 500 );
		return;
	}

	if ( jetpackLikesWidgetQueue.length > 0 ) {
		// We may have a widget that needs creating now
		found = false;
		while( jetpackLikesWidgetQueue.length > 0 ) {
			// Grab the first member of the queue that isn't already loading.
			wrapperID = jetpackLikesWidgetQueue.splice( 0, 1 )[0];
			if ( jQuery( '#' + wrapperID ).hasClass( 'jetpack-likes-widget-unloaded' ) ) {
				found = true;
				break;
			}
		}
		if ( ! found ) {
			setTimeout( JetpackLikesWidgetQueueHandler, 500 );
			return;
		}
	} else if ( jQuery( 'div.jetpack-likes-widget-unloaded' ).length > 0 ) {
		// Grab any unloaded widgets for a batch request
		JetpackLikesBatchHandler();

		// Get the next unloaded widget
		wrapperID = jQuery( 'div.jetpack-likes-widget-unloaded' ).first()[0].id;
		if ( ! wrapperID ) {
			// Everything is currently loaded
			setTimeout( JetpackLikesWidgetQueueHandler, 500 );
			return;
		}
	}

	if ( 'undefined' === typeof wrapperID ) {
		setTimeout( JetpackLikesWidgetQueueHandler, 500 );
		return;
	}

	$wrapper = jQuery( '#' + wrapperID );
	$wrapper.find( 'iframe' ).remove();

	if ( $wrapper.hasClass( 'slim-likes-widget' ) ) {
		$wrapper.find( '.post-likes-widget-placeholder' ).after( '<iframe class="post-likes-widget jetpack-likes-widget" name="' + $wrapper.data( 'name' ) + '" height="22px" width="68px" frameBorder="0" scrolling="no" src="' + $wrapper.data( 'src' ) + '"></iframe>' );
	} else {
		$wrapper.find( '.post-likes-widget-placeholder' ).after( '<iframe class="post-likes-widget jetpack-likes-widget" name="' + $wrapper.data( 'name' ) + '" height="55px" width="100%" frameBorder="0" src="' + $wrapper.data( 'src' ) + '"></iframe>' );
	}

	$wrapper.removeClass( 'jetpack-likes-widget-unloaded' ).addClass( 'jetpack-likes-widget-loading' );

	$wrapper.find( 'iframe' ).load( function( e ) {
		var $iframe = jQuery( e.target );
		$wrapper.removeClass( 'jetpack-likes-widget-loading' ).addClass( 'jetpack-likes-widget-loaded' );

		JetpackLikespostMessage( { event: 'loadLikeWidget', name: $iframe.attr( 'name' ), width: $iframe.width() }, window.frames[ 'likes-master' ] );

		if ( $wrapper.hasClass( 'slim-likes-widget' ) ) {
			$wrapper.find( 'iframe' ).Jetpack( 'resizeable' );
		}
	});
	setTimeout( JetpackLikesWidgetQueueHandler, 250 );
}
JetpackLikesWidgetQueueHandler();
;
/*! Facebook-Newsroom - v0.0.1 */
/*!
* jQuery Cycle2; build: v20131022
* http://jquery.malsup.com/cycle2/
* Copyright (c) 2013 M. Alsup; Dual licensed: MIT/GPL
*/
/*! core engine; version: 20131003 */
!function(e) {
    "use strict";
    function t(e) {
        return (e || "").toLowerCase();
    }
    var i = "20131003";
    e.fn.cycle = function(i) {
        var n;
        return 0 !== this.length || e.isReady ? this.each(function() {
            var n, s, o, c, r = e(this), l = e.fn.cycle.log;
            if (!r.data("cycle.opts")) {
                (r.data("cycle-log") === !1 || i && i.log === !1 || s && s.log === !1) && (l = e.noop), 
                l("--c2 init--"), n = r.data();
                for (var a in n) n.hasOwnProperty(a) && /^cycle[A-Z]+/.test(a) && (c = n[a], o = a.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, t), 
                l(o + ":", c, "(" + typeof c + ")"), n[o] = c);
                s = e.extend({}, e.fn.cycle.defaults, n, i || {}), s.timeoutId = 0, s.paused = s.paused || !1, 
                s.container = r, s._maxZ = s.maxZ, s.API = e.extend({
                    _container: r
                }, e.fn.cycle.API), s.API.log = l, s.API.trigger = function(e, t) {
                    return s.container.trigger(e, t), s.API;
                }, r.data("cycle.opts", s), r.data("cycle.API", s.API), s.API.trigger("cycle-bootstrap", [ s, s.API ]), 
                s.API.addInitialSlides(), s.API.preInitSlideshow(), s.slides.length && s.API.initSlideshow();
            }
        }) : (n = {
            s: this.selector,
            c: this.context
        }, e.fn.cycle.log("requeuing slideshow (dom not ready)"), e(function() {
            e(n.s, n.c).cycle(i);
        }), this);
    }, e.fn.cycle.API = {
        opts: function() {
            return this._container.data("cycle.opts");
        },
        addInitialSlides: function() {
            var t = this.opts(), i = t.slides;
            t.slideCount = 0, t.slides = e(), i = i.jquery ? i : t.container.find(i), t.random && i.sort(function() {
                return Math.random() - .5;
            }), t.API.add(i);
        },
        preInitSlideshow: function() {
            var t = this.opts();
            t.API.trigger("cycle-pre-initialize", [ t ]);
            var i = e.fn.cycle.transitions[t.fx];
            i && e.isFunction(i.preInit) && i.preInit(t), t._preInitialized = !0;
        },
        postInitSlideshow: function() {
            var t = this.opts();
            t.API.trigger("cycle-post-initialize", [ t ]);
            var i = e.fn.cycle.transitions[t.fx];
            i && e.isFunction(i.postInit) && i.postInit(t);
        },
        initSlideshow: function() {
            var t, i = this.opts(), n = i.container;
            i.API.calcFirstSlide(), "static" == i.container.css("position") && i.container.css("position", "relative"), 
            e(i.slides[i.currSlide]).css("opacity", 1).show(), i.API.stackSlides(i.slides[i.currSlide], i.slides[i.nextSlide], !i.reverse), 
            i.pauseOnHover && (i.pauseOnHover !== !0 && (n = e(i.pauseOnHover)), n.hover(function() {
                i.API.pause(!0);
            }, function() {
                i.API.resume(!0);
            })), i.timeout && (t = i.API.getSlideOpts(i.currSlide), i.API.queueTransition(t, t.timeout + i.delay)), 
            i._initialized = !0, i.API.updateView(!0), i.API.trigger("cycle-initialized", [ i ]), 
            i.API.postInitSlideshow();
        },
        pause: function(t) {
            var i = this.opts(), n = i.API.getSlideOpts(), s = i.hoverPaused || i.paused;
            t ? i.hoverPaused = !0 : i.paused = !0, s || (i.container.addClass("cycle-paused"), 
            i.API.trigger("cycle-paused", [ i ]).log("cycle-paused"), n.timeout && (clearTimeout(i.timeoutId), 
            i.timeoutId = 0, i._remainingTimeout -= e.now() - i._lastQueue, (0 > i._remainingTimeout || isNaN(i._remainingTimeout)) && (i._remainingTimeout = void 0)));
        },
        resume: function(e) {
            var t = this.opts(), i = !t.hoverPaused && !t.paused;
            e ? t.hoverPaused = !1 : t.paused = !1, i || (t.container.removeClass("cycle-paused"), 
            0 === t.slides.filter(":animated").length && t.API.queueTransition(t.API.getSlideOpts(), t._remainingTimeout), 
            t.API.trigger("cycle-resumed", [ t, t._remainingTimeout ]).log("cycle-resumed"));
        },
        add: function(t, i) {
            var n, s = this.opts(), o = s.slideCount, c = !1;
            "string" == e.type(t) && (t = e.trim(t)), e(t).each(function() {
                var t, n = e(this);
                i ? s.container.prepend(n) : s.container.append(n), s.slideCount++, t = s.API.buildSlideOpts(n), 
                s.slides = i ? e(n).add(s.slides) : s.slides.add(n), s.API.initSlide(t, n, --s._maxZ), 
                n.data("cycle.opts", t), s.API.trigger("cycle-slide-added", [ s, t, n ]);
            }), s.API.updateView(!0), c = s._preInitialized && 2 > o && s.slideCount >= 1, c && (s._initialized ? s.timeout && (n = s.slides.length, 
            s.nextSlide = s.reverse ? n - 1 : 1, s.timeoutId || s.API.queueTransition(s)) : s.API.initSlideshow());
        },
        calcFirstSlide: function() {
            var e, t = this.opts();
            e = parseInt(t.startingSlide || 0, 10), (e >= t.slides.length || 0 > e) && (e = 0), 
            t.currSlide = e, t.reverse ? (t.nextSlide = e - 1, 0 > t.nextSlide && (t.nextSlide = t.slides.length - 1)) : (t.nextSlide = e + 1, 
            t.nextSlide == t.slides.length && (t.nextSlide = 0));
        },
        calcNextSlide: function() {
            var e, t = this.opts();
            t.reverse ? (e = 0 > t.nextSlide - 1, t.nextSlide = e ? t.slideCount - 1 : t.nextSlide - 1, 
            t.currSlide = e ? 0 : t.nextSlide + 1) : (e = t.nextSlide + 1 == t.slides.length, 
            t.nextSlide = e ? 0 : t.nextSlide + 1, t.currSlide = e ? t.slides.length - 1 : t.nextSlide - 1);
        },
        calcTx: function(t, i) {
            var n, s = t;
            return i && s.manualFx && (n = e.fn.cycle.transitions[s.manualFx]), n || (n = e.fn.cycle.transitions[s.fx]), 
            n || (n = e.fn.cycle.transitions.fade, s.API.log('Transition "' + s.fx + '" not found.  Using fade.')), 
            n;
        },
        prepareTx: function(e, t) {
            var i, n, s, o, c, r = this.opts();
            return 2 > r.slideCount ? void (r.timeoutId = 0) : (!e || r.busy && !r.manualTrump || (r.API.stopTransition(), 
            r.busy = !1, clearTimeout(r.timeoutId), r.timeoutId = 0), void (r.busy || (0 !== r.timeoutId || e) && (n = r.slides[r.currSlide], 
            s = r.slides[r.nextSlide], o = r.API.getSlideOpts(r.nextSlide), c = r.API.calcTx(o, e), 
            r._tx = c, e && void 0 !== o.manualSpeed && (o.speed = o.manualSpeed), r.nextSlide != r.currSlide && (e || !r.paused && !r.hoverPaused && r.timeout) ? (r.API.trigger("cycle-before", [ o, n, s, t ]), 
            c.before && c.before(o, n, s, t), i = function() {
                r.busy = !1, r.container.data("cycle.opts") && (c.after && c.after(o, n, s, t), 
                r.API.trigger("cycle-after", [ o, n, s, t ]), r.API.queueTransition(o), r.API.updateView(!0));
            }, r.busy = !0, c.transition ? c.transition(o, n, s, t, i) : r.API.doTransition(o, n, s, t, i), 
            r.API.calcNextSlide(), r.API.updateView()) : r.API.queueTransition(o))));
        },
        doTransition: function(t, i, n, s, o) {
            var c = t, r = e(i), l = e(n), a = function() {
                l.animate(c.animIn || {
                    opacity: 1
                }, c.speed, c.easeIn || c.easing, o);
            };
            l.css(c.cssBefore || {}), r.animate(c.animOut || {}, c.speed, c.easeOut || c.easing, function() {
                r.css(c.cssAfter || {}), c.sync || a();
            }), c.sync && a();
        },
        queueTransition: function(t, i) {
            var n = this.opts(), s = void 0 !== i ? i : t.timeout;
            return 0 === n.nextSlide && 0 === --n.loop ? (n.API.log("terminating; loop=0"), 
            n.timeout = 0, s ? setTimeout(function() {
                n.API.trigger("cycle-finished", [ n ]);
            }, s) : n.API.trigger("cycle-finished", [ n ]), void (n.nextSlide = n.currSlide)) : void (s && (n._lastQueue = e.now(), 
            void 0 === i && (n._remainingTimeout = t.timeout), n.paused || n.hoverPaused || (n.timeoutId = setTimeout(function() {
                n.API.prepareTx(!1, !n.reverse);
            }, s))));
        },
        stopTransition: function() {
            var e = this.opts();
            e.slides.filter(":animated").length && (e.slides.stop(!1, !0), e.API.trigger("cycle-transition-stopped", [ e ])), 
            e._tx && e._tx.stopTransition && e._tx.stopTransition(e);
        },
        advanceSlide: function(e) {
            var t = this.opts();
            return clearTimeout(t.timeoutId), t.timeoutId = 0, t.nextSlide = t.currSlide + e, 
            0 > t.nextSlide ? t.nextSlide = t.slides.length - 1 : t.nextSlide >= t.slides.length && (t.nextSlide = 0), 
            t.API.prepareTx(!0, e >= 0), !1;
        },
        buildSlideOpts: function(i) {
            var n, s, o = this.opts(), c = i.data() || {};
            for (var r in c) c.hasOwnProperty(r) && /^cycle[A-Z]+/.test(r) && (n = c[r], s = r.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, t), 
            o.API.log("[" + (o.slideCount - 1) + "]", s + ":", n, "(" + typeof n + ")"), c[s] = n);
            c = e.extend({}, e.fn.cycle.defaults, o, c), c.slideNum = o.slideCount;
            try {
                delete c.API, delete c.slideCount, delete c.currSlide, delete c.nextSlide, delete c.slides;
            } catch (l) {}
            return c;
        },
        getSlideOpts: function(t) {
            var i = this.opts();
            void 0 === t && (t = i.currSlide);
            var n = i.slides[t], s = e(n).data("cycle.opts");
            return e.extend({}, i, s);
        },
        initSlide: function(t, i, n) {
            var s = this.opts();
            i.css(t.slideCss || {}), n > 0 && i.css("zIndex", n), isNaN(t.speed) && (t.speed = e.fx.speeds[t.speed] || e.fx.speeds._default), 
            t.sync || (t.speed = t.speed / 2), i.addClass(s.slideClass);
        },
        updateView: function(e, t) {
            var i = this.opts();
            if (i._initialized) {
                var n = i.API.getSlideOpts(), s = i.slides[i.currSlide];
                !e && t !== !0 && (i.API.trigger("cycle-update-view-before", [ i, n, s ]), 0 > i.updateView) || (i.slideActiveClass && i.slides.removeClass(i.slideActiveClass).eq(i.currSlide).addClass(i.slideActiveClass), 
                e && i.hideNonActive && i.slides.filter(":not(." + i.slideActiveClass + ")").hide(), 
                0 === i.updateView && setTimeout(function() {
                    i.API.trigger("cycle-update-view", [ i, n, s, e ]);
                }, n.speed / (i.sync ? 2 : 1)), 0 !== i.updateView && i.API.trigger("cycle-update-view", [ i, n, s, e ]), 
                e && i.API.trigger("cycle-update-view-after", [ i, n, s ]));
            }
        },
        getComponent: function(t) {
            var i = this.opts(), n = i[t];
            return "string" == typeof n ? /^\s*[\>|\+|~]/.test(n) ? i.container.find(n) : e(n) : n.jquery ? n : e(n);
        },
        stackSlides: function(t, i, n) {
            var s = this.opts();
            t || (t = s.slides[s.currSlide], i = s.slides[s.nextSlide], n = !s.reverse), e(t).css("zIndex", s.maxZ);
            var o, c = s.maxZ - 2, r = s.slideCount;
            if (n) {
                for (o = s.currSlide + 1; r > o; o++) e(s.slides[o]).css("zIndex", c--);
                for (o = 0; s.currSlide > o; o++) e(s.slides[o]).css("zIndex", c--);
            } else {
                for (o = s.currSlide - 1; o >= 0; o--) e(s.slides[o]).css("zIndex", c--);
                for (o = r - 1; o > s.currSlide; o--) e(s.slides[o]).css("zIndex", c--);
            }
            e(i).css("zIndex", s.maxZ - 1);
        },
        getSlideIndex: function(e) {
            return this.opts().slides.index(e);
        }
    }, e.fn.cycle.log = function() {
        window.console && console.log && console.log("[cycle2] " + Array.prototype.join.call(arguments, " "));
    }, e.fn.cycle.version = function() {
        return "Cycle2: " + i;
    }, e.fn.cycle.transitions = {
        custom: {},
        none: {
            before: function(e, t, i, n) {
                e.API.stackSlides(i, t, n), e.cssBefore = {
                    opacity: 1,
                    display: "block"
                };
            }
        },
        fade: {
            before: function(t, i, n, s) {
                var o = t.API.getSlideOpts(t.nextSlide).slideCss || {};
                t.API.stackSlides(i, n, s), t.cssBefore = e.extend(o, {
                    opacity: 0,
                    display: "block"
                }), t.animIn = {
                    opacity: 1
                }, t.animOut = {
                    opacity: 0
                };
            }
        },
        fadeout: {
            before: function(t, i, n, s) {
                var o = t.API.getSlideOpts(t.nextSlide).slideCss || {};
                t.API.stackSlides(i, n, s), t.cssBefore = e.extend(o, {
                    opacity: 1,
                    display: "block"
                }), t.animOut = {
                    opacity: 0
                };
            }
        },
        scrollHorz: {
            before: function(e, t, i, n) {
                e.API.stackSlides(t, i, n);
                var s = e.container.css("overflow", "hidden").width();
                e.cssBefore = {
                    left: n ? s : -s,
                    top: 0,
                    opacity: 1,
                    display: "block"
                }, e.cssAfter = {
                    zIndex: e._maxZ - 2,
                    left: 0
                }, e.animIn = {
                    left: 0
                }, e.animOut = {
                    left: n ? -s : s
                };
            }
        }
    }, e.fn.cycle.defaults = {
        allowWrap: !0,
        autoSelector: ".cycle-slideshow[data-cycle-auto-init!=false]",
        delay: 0,
        easing: null,
        fx: "fade",
        hideNonActive: !0,
        loop: 0,
        manualFx: void 0,
        manualSpeed: void 0,
        manualTrump: !0,
        maxZ: 100,
        pauseOnHover: !1,
        reverse: !1,
        slideActiveClass: "cycle-slide-active",
        slideClass: "cycle-slide",
        slideCss: {
            position: "absolute",
            top: 0,
            left: 0
        },
        slides: "> img",
        speed: 500,
        startingSlide: 0,
        sync: !0,
        timeout: 4e3,
        updateView: 0
    }, e(document).ready(function() {
        e(e.fn.cycle.defaults.autoSelector).cycle();
    });
}(jQuery), /*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130304 */
function(e) {
    "use strict";
    function t(t, n) {
        var s, o, c, r = n.autoHeight;
        if ("container" == r) o = e(n.slides[n.currSlide]).outerHeight(), n.container.height(o); else if (n._autoHeightRatio) n.container.height(n.container.width() / n._autoHeightRatio); else if ("calc" === r || "number" == e.type(r) && r >= 0) {
            if (c = "calc" === r ? i(t, n) : r >= n.slides.length ? 0 : r, c == n._sentinelIndex) return;
            n._sentinelIndex = c, n._sentinel && n._sentinel.remove(), s = e(n.slides[c].cloneNode(!0)), 
            s.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"), 
            s.css({
                position: "static",
                visibility: "hidden",
                display: "block"
            }).prependTo(n.container).addClass("cycle-sentinel cycle-slide").removeClass("cycle-slide-active"), 
            s.find("*").css("visibility", "hidden"), n._sentinel = s;
        }
    }
    function i(t, i) {
        var n = 0, s = -1;
        return i.slides.each(function(t) {
            var i = e(this).height();
            i > s && (s = i, n = t);
        }), n;
    }
    function n(t, i, n, s) {
        var o = e(s).outerHeight(), c = i.sync ? i.speed / 2 : i.speed;
        i.container.animate({
            height: o
        }, c);
    }
    function s(i, o) {
        o._autoHeightOnResize && (e(window).off("resize orientationchange", o._autoHeightOnResize), 
        o._autoHeightOnResize = null), o.container.off("cycle-slide-added cycle-slide-removed", t), 
        o.container.off("cycle-destroyed", s), o.container.off("cycle-before", n), o._sentinel && (o._sentinel.remove(), 
        o._sentinel = null);
    }
    e.extend(e.fn.cycle.defaults, {
        autoHeight: 0
    }), e(document).on("cycle-initialized", function(i, o) {
        function c() {
            t(i, o);
        }
        var r, l = o.autoHeight, a = e.type(l), d = null;
        ("string" === a || "number" === a) && (o.container.on("cycle-slide-added cycle-slide-removed", t), 
        o.container.on("cycle-destroyed", s), "container" == l ? o.container.on("cycle-before", n) : "string" === a && /\d+\:\d+/.test(l) && (r = l.match(/(\d+)\:(\d+)/), 
        r = r[1] / r[2], o._autoHeightRatio = r), "number" !== a && (o._autoHeightOnResize = function() {
            clearTimeout(d), d = setTimeout(c, 50);
        }, e(window).on("resize orientationchange", o._autoHeightOnResize)), setTimeout(c, 30));
    });
}(jQuery), /*! caption plugin for Cycle2;  version: 20130306 */
function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {
        caption: "> .cycle-caption",
        captionTemplate: "{{slideNum}} / {{slideCount}}",
        overlay: "> .cycle-overlay",
        overlayTemplate: "<div>{{title}}</div><div>{{desc}}</div>",
        captionModule: "caption"
    }), e(document).on("cycle-update-view", function(t, i, n, s) {
        "caption" === i.captionModule && e.each([ "caption", "overlay" ], function() {
            var e = this, t = n[e + "Template"], o = i.API.getComponent(e);
            o.length && t ? (o.html(i.API.tmpl(t, n, i, s)), o.show()) : o.hide();
        });
    }), e(document).on("cycle-destroyed", function(t, i) {
        var n;
        e.each([ "caption", "overlay" ], function() {
            var e = this, t = i[e + "Template"];
            i[e] && t && (n = i.API.getComponent("caption"), n.empty());
        });
    });
}(jQuery), /*! command plugin for Cycle2;  version: 20130707 */
function(e) {
    "use strict";
    var t = e.fn.cycle;
    e.fn.cycle = function(i) {
        var n, s, o, c = e.makeArray(arguments);
        return "number" == e.type(i) ? this.cycle("goto", i) : "string" == e.type(i) ? this.each(function() {
            var r;
            return n = i, o = e(this).data("cycle.opts"), void 0 === o ? void t.log('slideshow must be initialized before sending commands; "' + n + '" ignored') : (n = "goto" == n ? "jump" : n, 
            s = o.API[n], e.isFunction(s) ? (r = e.makeArray(c), r.shift(), s.apply(o.API, r)) : void t.log("unknown command: ", n));
        }) : t.apply(this, arguments);
    }, e.extend(e.fn.cycle, t), e.extend(t.API, {
        next: function() {
            var e = this.opts();
            if (!e.busy || e.manualTrump) {
                var t = e.reverse ? -1 : 1;
                e.allowWrap === !1 && e.currSlide + t >= e.slideCount || (e.API.advanceSlide(t), 
                e.API.trigger("cycle-next", [ e ]).log("cycle-next"));
            }
        },
        prev: function() {
            var e = this.opts();
            if (!e.busy || e.manualTrump) {
                var t = e.reverse ? 1 : -1;
                e.allowWrap === !1 && 0 > e.currSlide + t || (e.API.advanceSlide(t), e.API.trigger("cycle-prev", [ e ]).log("cycle-prev"));
            }
        },
        destroy: function() {
            this.stop();
            var t = this.opts(), i = e.isFunction(e._data) ? e._data : e.noop;
            clearTimeout(t.timeoutId), t.timeoutId = 0, t.API.stop(), t.API.trigger("cycle-destroyed", [ t ]).log("cycle-destroyed"), 
            t.container.removeData(), i(t.container[0], "parsedAttrs", !1), t.retainStylesOnDestroy || (t.container.removeAttr("style"), 
            t.slides.removeAttr("style"), t.slides.removeClass(t.slideActiveClass)), t.slides.each(function() {
                e(this).removeData(), i(this, "parsedAttrs", !1);
            });
        },
        jump: function(e) {
            var t, i = this.opts();
            if (!i.busy || i.manualTrump) {
                var n = parseInt(e, 10);
                if (isNaN(n) || 0 > n || n >= i.slides.length) return void i.API.log("goto: invalid slide index: " + n);
                if (n == i.currSlide) return void i.API.log("goto: skipping, already on slide", n);
                i.nextSlide = n, clearTimeout(i.timeoutId), i.timeoutId = 0, i.API.log("goto: ", n, " (zero-index)"), 
                t = i.currSlide < i.nextSlide, i.API.prepareTx(!0, t);
            }
        },
        stop: function() {
            var t = this.opts(), i = t.container;
            clearTimeout(t.timeoutId), t.timeoutId = 0, t.API.stopTransition(), t.pauseOnHover && (t.pauseOnHover !== !0 && (i = e(t.pauseOnHover)), 
            i.off("mouseenter mouseleave")), t.API.trigger("cycle-stopped", [ t ]).log("cycle-stopped");
        },
        reinit: function() {
            var e = this.opts();
            e.API.destroy(), e.container.cycle();
        },
        remove: function(t) {
            for (var i, n, s = this.opts(), o = [], c = 1, r = 0; s.slides.length > r; r++) i = s.slides[r], 
            r == t ? n = i : (o.push(i), e(i).data("cycle.opts").slideNum = c, c++);
            n && (s.slides = e(o), s.slideCount--, e(n).remove(), t == s.currSlide ? s.API.advanceSlide(1) : s.currSlide > t ? s.currSlide-- : s.currSlide++, 
            s.API.trigger("cycle-slide-removed", [ s, t, n ]).log("cycle-slide-removed"), s.API.updateView());
        }
    }), e(document).on("click.cycle", "[data-cycle-cmd]", function(t) {
        t.preventDefault();
        var i = e(this), n = i.data("cycle-cmd"), s = i.data("cycle-context") || ".cycle-slideshow";
        e(s).cycle(n, i.data("cycle-arg"));
    });
}(jQuery), /*! hash plugin for Cycle2;  version: 20130905 */
function(e) {
    "use strict";
    function t(t, i) {
        var n;
        return t._hashFence ? void (t._hashFence = !1) : (n = window.location.hash.substring(1), 
        void t.slides.each(function(s) {
            if (e(this).data("cycle-hash") == n) {
                if (i === !0) t.startingSlide = s; else {
                    var o = s > t.currSlide;
                    t.nextSlide = s, t.API.prepareTx(!0, o);
                }
                return !1;
            }
        }));
    }
    e(document).on("cycle-pre-initialize", function(i, n) {
        t(n, !0), n._onHashChange = function() {
            t(n, !1);
        }, e(window).on("hashchange", n._onHashChange);
    }), e(document).on("cycle-update-view", function(e, t, i) {
        i.hash && "#" + i.hash != window.location.hash && (t._hashFence = !0, window.location.hash = i.hash);
    }), e(document).on("cycle-destroyed", function(t, i) {
        i._onHashChange && e(window).off("hashchange", i._onHashChange);
    });
}(jQuery), /*! loader plugin for Cycle2;  version: 20131020 */
function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {
        loader: !1
    }), e(document).on("cycle-bootstrap", function(t, i) {
        function n(t, n) {
            function o(t) {
                var o;
                "wait" == i.loader ? (r.push(t), 0 === a && (r.sort(c), s.apply(i.API, [ r, n ]), 
                i.container.removeClass("cycle-loading"))) : (o = e(i.slides[i.currSlide]), s.apply(i.API, [ t, n ]), 
                o.show(), i.container.removeClass("cycle-loading"));
            }
            function c(e, t) {
                return e.data("index") - t.data("index");
            }
            var r = [];
            if ("string" == e.type(t)) t = e.trim(t); else if ("array" === e.type(t)) for (var l = 0; t.length > l; l++) t[l] = e(t[l])[0];
            t = e(t);
            var a = t.length;
            a && (i.eventualSlideCount = i.slideCount + a, t.hide().appendTo("body").each(function(t) {
                function c() {
                    0 === --l && (--a, o(d));
                }
                var l = 0, d = e(this), u = d.is("img") ? d : d.find("img");
                return d.data("index", t), u = u.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])'), 
                u.length ? (l = u.length, void u.each(function() {
                    this.complete ? c() : e(this).load(function() {
                        c();
                    }).error(function() {
                        0 === --l && (i.API.log("slide skipped; img not loaded:", this.src), 0 === --a && "wait" == i.loader && s.apply(i.API, [ r, n ]));
                    });
                })) : (--a, void r.push(d));
            }), a && i.container.addClass("cycle-loading"));
        }
        var s;
        i.loader && (s = i.API.add, i.API.add = n);
    });
}(jQuery), /*! pager plugin for Cycle2;  version: 20130525 */
function(e) {
    "use strict";
    function t(t, i, n) {
        var s, o = t.API.getComponent("pager");
        o.each(function() {
            var o = e(this);
            if (i.pagerTemplate) {
                var c = t.API.tmpl(i.pagerTemplate, i, t, n[0]);
                s = e(c).appendTo(o);
            } else s = o.children().eq(t.slideCount - 1);
            s.on(t.pagerEvent, function(e) {
                e.preventDefault(), t.API.page(o, e.currentTarget);
            });
        });
    }
    function i(e, t) {
        var i = this.opts();
        if (!i.busy || i.manualTrump) {
            var n = e.children().index(t), s = n, o = s > i.currSlide;
            i.currSlide != s && (i.nextSlide = s, i.API.prepareTx(!0, o), i.API.trigger("cycle-pager-activated", [ i, e, t ]));
        }
    }
    e.extend(e.fn.cycle.defaults, {
        pager: "> .cycle-pager",
        pagerActiveClass: "cycle-pager-active",
        pagerEvent: "click.cycle",
        pagerTemplate: "<span>&bull;</span>"
    }), e(document).on("cycle-bootstrap", function(e, i, n) {
        n.buildPagerLink = t;
    }), e(document).on("cycle-slide-added", function(e, t, n, s) {
        t.pager && (t.API.buildPagerLink(t, n, s), t.API.page = i);
    }), e(document).on("cycle-slide-removed", function(t, i, n) {
        if (i.pager) {
            var s = i.API.getComponent("pager");
            s.each(function() {
                var t = e(this);
                e(t.children()[n]).remove();
            });
        }
    }), e(document).on("cycle-update-view", function(t, i) {
        var n;
        i.pager && (n = i.API.getComponent("pager"), n.each(function() {
            e(this).children().removeClass(i.pagerActiveClass).eq(i.currSlide).addClass(i.pagerActiveClass);
        }));
    }), e(document).on("cycle-destroyed", function(e, t) {
        var i = t.API.getComponent("pager");
        i && (i.children().off(t.pagerEvent), t.pagerTemplate && i.empty());
    });
}(jQuery), /*! prevnext plugin for Cycle2;  version: 20130709 */
function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {
        next: "> .cycle-next",
        nextEvent: "click.cycle",
        disabledClass: "disabled",
        prev: "> .cycle-prev",
        prevEvent: "click.cycle",
        swipe: !1
    }), e(document).on("cycle-initialized", function(e, t) {
        if (t.API.getComponent("next").on(t.nextEvent, function(e) {
            e.preventDefault(), t.API.next();
        }), t.API.getComponent("prev").on(t.prevEvent, function(e) {
            e.preventDefault(), t.API.prev();
        }), t.swipe) {
            var i = t.swipeVert ? "swipeUp.cycle" : "swipeLeft.cycle swipeleft.cycle", n = t.swipeVert ? "swipeDown.cycle" : "swipeRight.cycle swiperight.cycle";
            t.container.on(i, function() {
                t.API.next();
            }), t.container.on(n, function() {
                t.API.prev();
            });
        }
    }), e(document).on("cycle-update-view", function(e, t) {
        if (!t.allowWrap) {
            var i = t.disabledClass, n = t.API.getComponent("next"), s = t.API.getComponent("prev"), o = t._prevBoundry || 0, c = void 0 !== t._nextBoundry ? t._nextBoundry : t.slideCount - 1;
            t.currSlide == c ? n.addClass(i).prop("disabled", !0) : n.removeClass(i).prop("disabled", !1), 
            t.currSlide === o ? s.addClass(i).prop("disabled", !0) : s.removeClass(i).prop("disabled", !1);
        }
    }), e(document).on("cycle-destroyed", function(e, t) {
        t.API.getComponent("prev").off(t.nextEvent), t.API.getComponent("next").off(t.prevEvent), 
        t.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle");
    });
}(jQuery), /*! progressive loader plugin for Cycle2;  version: 20130315 */
function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {
        progressive: !1
    }), e(document).on("cycle-pre-initialize", function(t, i) {
        if (i.progressive) {
            var n, s, o = i.API, c = o.next, r = o.prev, l = o.prepareTx, a = e.type(i.progressive);
            if ("array" == a) n = i.progressive; else if (e.isFunction(i.progressive)) n = i.progressive(i); else if ("string" == a) {
                if (s = e(i.progressive), n = e.trim(s.html()), !n) return;
                if (/^(\[)/.test(n)) try {
                    n = e.parseJSON(n);
                } catch (d) {
                    return void o.log("error parsing progressive slides", d);
                } else n = n.split(RegExp(s.data("cycle-split") || "\n")), n[n.length - 1] || n.pop();
            }
            l && (o.prepareTx = function(e, t) {
                var s, o;
                return e || 0 === n.length ? void l.apply(i.API, [ e, t ]) : void (t && i.currSlide == i.slideCount - 1 ? (o = n[0], 
                n = n.slice(1), i.container.one("cycle-slide-added", function(e, t) {
                    setTimeout(function() {
                        t.API.advanceSlide(1);
                    }, 50);
                }), i.API.add(o)) : t || 0 !== i.currSlide ? l.apply(i.API, [ e, t ]) : (s = n.length - 1, 
                o = n[s], n = n.slice(0, s), i.container.one("cycle-slide-added", function(e, t) {
                    setTimeout(function() {
                        t.currSlide = 1, t.API.advanceSlide(-1);
                    }, 50);
                }), i.API.add(o, !0)));
            }), c && (o.next = function() {
                var e = this.opts();
                if (n.length && e.currSlide == e.slideCount - 1) {
                    var t = n[0];
                    n = n.slice(1), e.container.one("cycle-slide-added", function(e, t) {
                        c.apply(t.API), t.container.removeClass("cycle-loading");
                    }), e.container.addClass("cycle-loading"), e.API.add(t);
                } else c.apply(e.API);
            }), r && (o.prev = function() {
                var e = this.opts();
                if (n.length && 0 === e.currSlide) {
                    var t = n.length - 1, i = n[t];
                    n = n.slice(0, t), e.container.one("cycle-slide-added", function(e, t) {
                        t.currSlide = 1, t.API.advanceSlide(-1), t.container.removeClass("cycle-loading");
                    }), e.container.addClass("cycle-loading"), e.API.add(i, !0);
                } else r.apply(e.API);
            });
        }
    });
}(jQuery), /*! tmpl plugin for Cycle2;  version: 20121227 */
function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {
        tmplRegex: "{{((.)?.*?)}}"
    }), e.extend(e.fn.cycle.API, {
        tmpl: function(t, i) {
            var n = RegExp(i.tmplRegex || e.fn.cycle.defaults.tmplRegex, "g"), s = e.makeArray(arguments);
            return s.shift(), t.replace(n, function(t, i) {
                var n, o, c, r, l = i.split(".");
                for (n = 0; s.length > n; n++) if (c = s[n]) {
                    if (l.length > 1) for (r = c, o = 0; l.length > o; o++) c = r, r = r[l[o]] || i; else r = c[i];
                    if (e.isFunction(r)) return r.apply(c, s);
                    if (void 0 !== r && null !== r && r != i) return r;
                }
                return i;
            });
        }
    });
}(jQuery), /* Plugin for Cycle2; Copyright (c) 2012 M. Alsup; v20140128 */
function(e) {
    "use strict";
    e.event.special.swipe = e.event.special.swipe || {
        scrollSupressionThreshold: 10,
        durationThreshold: 1e3,
        horizontalDistanceThreshold: 30,
        verticalDistanceThreshold: 75,
        setup: function() {
            var i = e(this);
            i.bind("touchstart", function(t) {
                function n(i) {
                    if (r) {
                        var t = i.originalEvent.touches ? i.originalEvent.touches[0] : i;
                        s = {
                            time: new Date().getTime(),
                            coords: [ t.pageX, t.pageY ]
                        }, Math.abs(r.coords[0] - s.coords[0]) > e.event.special.swipe.scrollSupressionThreshold && i.preventDefault();
                    }
                }
                var s, o = t.originalEvent.touches ? t.originalEvent.touches[0] : t, r = {
                    time: new Date().getTime(),
                    coords: [ o.pageX, o.pageY ],
                    origin: e(t.target)
                };
                i.bind("touchmove", n).one("touchend", function() {
                    i.unbind("touchmove", n), r && s && s.time - r.time < e.event.special.swipe.durationThreshold && Math.abs(r.coords[0] - s.coords[0]) > e.event.special.swipe.horizontalDistanceThreshold && Math.abs(r.coords[1] - s.coords[1]) < e.event.special.swipe.verticalDistanceThreshold && r.origin.trigger("swipe").trigger(r.coords[0] > s.coords[0] ? "swipeleft" : "swiperight"), 
                    r = s = void 0;
                });
            });
        }
    }, e.event.special.swipeleft = e.event.special.swipeleft || {
        setup: function() {
            e(this).bind("swipe", e.noop);
        }
    }, e.event.special.swiperight = e.event.special.swiperight || e.event.special.swipeleft;
}(jQuery);;
/*! Facebook-Newsroom - v0.0.1 */
/*
Copyright 2012 Igor Vaynberg

Version: 3.4.8 Timestamp: Thu May  1 09:50:32 EDT 2014

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
!function($) {
    "undefined" == typeof $.fn.each2 && $.extend($.fn, {
        /*
            * 4-10 times faster .each replacement
            * use it carefully, as it overrides jQuery context of element on each iteration
            */
        each2: function(c) {
            for (var j = $([ 0 ]), i = -1, l = this.length; ++i < l && (j.context = j[0] = this[i]) && c.call(j[0], i, j) !== !1; ) ;
            return this;
        }
    });
}(jQuery), function($, undefined) {
    "use strict";
    function reinsertElement(element) {
        var placeholder = $(document.createTextNode(""));
        element.before(placeholder), placeholder.before(element), placeholder.remove();
    }
    function stripDiacritics(str) {
        // Used 'uni range + named function' from http://jsperf.com/diacritics/18
        function match(a) {
            return DIACRITICS[a] || a;
        }
        return str.replace(/[^\u0000-\u007E]/g, match);
    }
    function indexOf(value, array) {
        for (var i = 0, l = array.length; l > i; i += 1) if (equal(value, array[i])) return i;
        return -1;
    }
    function measureScrollbar() {
        var $template = $(MEASURE_SCROLLBAR_TEMPLATE);
        $template.appendTo("body");
        var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
        };
        return $template.remove(), dim;
    }
    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        // Check whether 'a' or 'b' is a string (primitive or object).
        // The concatenation of an empty string (+'') converts its argument to a string's primitive.
        // a+'' - in case 'a' is a String object
        return a === b ? !0 : a === undefined || b === undefined ? !1 : null === a || null === b ? !1 : a.constructor === String ? a + "" == b + "" : b.constructor === String ? b + "" == a + "" : !1;
    }
    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (null === string || string.length < 1) return [];
        for (val = string.split(separator), i = 0, l = val.length; l > i; i += 1) val[i] = $.trim(val[i]);
        return val;
    }
    function getSideBorderPadding(element) {
        return element.outerWidth(!1) - element.width();
    }
    function installKeyUpChangeEvent(element) {
        var key = "keyup-change-value";
        element.on("keydown", function() {
            $.data(element, key) === undefined && $.data(element, key, element.val());
        }), element.on("keyup", function() {
            var val = $.data(element, key);
            val !== undefined && element.val() !== val && ($.removeData(element, key), element.trigger("keyup-change"));
        });
    }
    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
        element.on("mousemove", function(e) {
            var lastpos = lastMousePosition;
            (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) && $(e.target).trigger("mousemove-filtered", e);
        });
    }
    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function() {
            var args = arguments;
            window.clearTimeout(timeout), timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }
    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function(e) {
            element.trigger("scroll-debounced", e);
        });
        element.on("scroll", function(e) {
            indexOf(e.target, element.get()) >= 0 && notify(e);
        });
    }
    function focus($el) {
        $el[0] !== document.activeElement && /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var range, el = $el[0], pos = $el.val().length;
            $el.focus();
            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            var isVisible = el.offsetWidth > 0 || el.offsetHeight > 0;
            isVisible && el === document.activeElement && (/* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
            el.setSelectionRange ? el.setSelectionRange(pos, pos) : el.createTextRange && (range = el.createTextRange(), 
            range.collapse(!1), range.select()));
        }, 0);
    }
    function getCursorInfo(el) {
        el = $(el)[0];
        var offset = 0, length = 0;
        if ("selectionStart" in el) offset = el.selectionStart, length = el.selectionEnd - offset; else if ("selection" in document) {
            el.focus();
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length, sel.moveStart("character", -el.value.length), 
            offset = sel.text.length - length;
        }
        return {
            offset: offset,
            length: length
        };
    }
    function killEvent(event) {
        event.preventDefault(), event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault(), event.stopImmediatePropagation();
    }
    function measureTextWidth(e) {
        if (!sizer) {
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $(document.createElement("div")).css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px",
                display: "none",
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textTransform,
                whiteSpace: "nowrap"
            }), sizer.attr("class", "select2-sizer"), $("body").append(sizer);
        }
        return sizer.text(e.val()), sizer.width();
    }
    function syncCssClasses(dest, src, adapter) {
        var classes, adapted, replacements = [];
        classes = dest.attr("class"), classes && (classes = "" + classes, // for IE which returns object
        $(classes.split(" ")).each2(function() {
            0 === this.indexOf("select2-") && replacements.push(this);
        })), classes = src.attr("class"), classes && (classes = "" + classes, // for IE which returns object
        $(classes.split(" ")).each2(function() {
            0 !== this.indexOf("select2-") && (adapted = adapter(this), adapted && replacements.push(adapted));
        })), dest.attr("class", replacements.join(" "));
    }
    function markMatch(text, term, markup, escapeMarkup) {
        var match = stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())), tl = term.length;
        return 0 > match ? void markup.push(escapeMarkup(text)) : (markup.push(escapeMarkup(text.substring(0, match))), 
        markup.push("<span class='select2-match'>"), markup.push(escapeMarkup(text.substring(match, match + tl))), 
        markup.push("</span>"), void markup.push(escapeMarkup(text.substring(match + tl, text.length))));
    }
    function defaultEscapeMarkup(markup) {
        var replace_map = {
            "\\": "&#92;",
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#47;"
        };
        return String(markup).replace(/[&<>"'\/\\]/g, function(match) {
            return replace_map[match];
        });
    }
    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration parameters
     * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
        handler = null, quietMillis = options.quietMillis || 100, ajaxUrl = options.url, self = this;
        return function(query) {
            window.clearTimeout(timeout), timeout = window.setTimeout(function() {
                var data = options.data, // ajax data function
                url = ajaxUrl, // ajax url string or function
                transport = options.transport || $.fn.select2.ajaxDefaults.transport, // deprecated - to be removed in 4.0  - use params instead
                deprecated = {
                    type: options.type || "GET",
                    // set type of request (GET or POST)
                    cache: options.cache || !1,
                    jsonpCallback: options.jsonpCallback || undefined,
                    dataType: options.dataType || "json"
                }, params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);
                data = data ? data.call(self, query.term, query.page, query.context) : null, url = "function" == typeof url ? url.call(self, query.term, query.page, query.context) : url, 
                handler && "function" == typeof handler.abort && handler.abort(), options.params && ($.isFunction(options.params) ? $.extend(params, options.params.call(self)) : $.extend(params, options.params)), 
                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    success: function(data) {
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        var results = options.results(data, query.page);
                        query.callback(results);
                    }
                }), handler = transport.call(self, params);
            }, quietMillis);
        };
    }
    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used it is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var // data elements
        dataText, tmp, data = options, text = function(item) {
            return "" + item.text;
        };
        // function used to retrieve the text portion of a data item that is matched against the search
        $.isArray(data) && (tmp = data, data = {
            results: tmp
        }), $.isFunction(data) === !1 && (tmp = data, data = function() {
            return tmp;
        });
        var dataItem = data();
        // if text is not a function we assume it to be a key name
        // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
        return dataItem.text && (text = dataItem.text, $.isFunction(text) || (dataText = dataItem.text, 
        text = function(item) {
            return item[dataText];
        })), function(query) {
            var process, t = query.term, filtered = {
                results: []
            };
            return "" === t ? void query.callback(data()) : (process = function(datum, collection) {
                var group, attr;
                if (datum = datum[0], datum.children) {
                    group = {};
                    for (attr in datum) datum.hasOwnProperty(attr) && (group[attr] = datum[attr]);
                    group.children = [], $(datum.children).each2(function(i, childDatum) {
                        process(childDatum, group.children);
                    }), (group.children.length || query.matcher(t, text(group), datum)) && collection.push(group);
                } else query.matcher(t, text(datum), datum) && collection.push(datum);
            }, $(data().results).each2(function(i, datum) {
                process(datum, filtered.results);
            }), void query.callback(filtered));
        };
    }
    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function(query) {
            var t = query.term, filtered = {
                results: []
            }, result = isFunc ? data(query) : data;
            $.isArray(result) && ($(result).each(function() {
                var isObject = this.text !== undefined, text = isObject ? this.text : this;
                ("" === t || query.matcher(t, text)) && filtered.results.push(isObject ? this : {
                    id: this,
                    text: this
                });
            }), query.callback(filtered));
        };
    }
    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return !0;
        if (!formatter) return !1;
        if ("string" == typeof formatter) return !0;
        throw new Error(formatterName + " must be a string, function, or falsy value");
    }
    function evaluate(val) {
        if ($.isFunction(val)) {
            var args = Array.prototype.slice.call(arguments, 1);
            return val.apply(null, args);
        }
        return val;
    }
    function countResults(results) {
        var count = 0;
        return $.each(results, function(i, item) {
            item.children ? count += countResults(item.children) : count++;
        }), count;
    }
    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var // check for whether a token we extracted represents a duplicate selected choice
        token, // token
        index, // position at which the separator was found
        i, l, // looping variables
        separator, original = input, // store the original so we can compare and know if we need to tell the search to update its text
        dupe = !1;
        // the matched separator
        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;
        for (;;) {
            for (index = -1, i = 0, l = opts.tokenSeparators.length; l > i && (separator = opts.tokenSeparators[i], 
            index = input.indexOf(separator), !(index >= 0)); i++) ;
            if (0 > index) break;
            if (// did not find any token separator in the input string, bail
            token = input.substring(0, index), input = input.substring(index + separator.length), 
            token.length > 0 && (token = opts.createSearchChoice.call(this, token, selection), 
            token !== undefined && null !== token && opts.id(token) !== undefined && null !== opts.id(token))) {
                for (dupe = !1, i = 0, l = selection.length; l > i; i++) if (equal(opts.id(token), opts.id(selection[i]))) {
                    dupe = !0;
                    break;
                }
                dupe || selectCallback(token);
            }
        }
        return original !== input ? input : void 0;
    }
    function cleanupJQueryElements() {
        var self = this;
        Array.prototype.forEach.call(arguments, function(element) {
            self[element].remove(), self[element] = null;
        });
    }
    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function() {};
        return constructor.prototype = new SuperClass(), constructor.prototype.constructor = constructor, 
        constructor.prototype.parent = SuperClass.prototype, constructor.prototype = $.extend(constructor.prototype, methods), 
        constructor;
    }
    /*global document, window, jQuery, console */
    if (window.Select2 === undefined) {
        var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer, $document, scrollBarDimensions, lastMousePosition = {
            x: 0,
            y: 0
        }, KEY = {
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            HOME: 36,
            END: 35,
            BACKSPACE: 8,
            DELETE: 46,
            isArrow: function(k) {
                switch (k = k.which ? k.which : k) {
                  case KEY.LEFT:
                  case KEY.RIGHT:
                  case KEY.UP:
                  case KEY.DOWN:
                    return !0;
                }
                return !1;
            },
            isControl: function(e) {
                var k = e.which;
                switch (k) {
                  case KEY.SHIFT:
                  case KEY.CTRL:
                  case KEY.ALT:
                    return !0;
                }
                return e.metaKey ? !0 : !1;
            },
            isFunctionKey: function(k) {
                return k = k.which ? k.which : k, k >= 112 && 123 >= k;
            }
        }, MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>", DIACRITICS = {
            "Ⓐ": "A",
            "Ａ": "A",
            "À": "A",
            "Á": "A",
            "Â": "A",
            "Ầ": "A",
            "Ấ": "A",
            "Ẫ": "A",
            "Ẩ": "A",
            "Ã": "A",
            "Ā": "A",
            "Ă": "A",
            "Ằ": "A",
            "Ắ": "A",
            "Ẵ": "A",
            "Ẳ": "A",
            "Ȧ": "A",
            "Ǡ": "A",
            "Ä": "A",
            "Ǟ": "A",
            "Ả": "A",
            "Å": "A",
            "Ǻ": "A",
            "Ǎ": "A",
            "Ȁ": "A",
            "Ȃ": "A",
            "Ạ": "A",
            "Ậ": "A",
            "Ặ": "A",
            "Ḁ": "A",
            "Ą": "A",
            "Ⱥ": "A",
            "Ɐ": "A",
            "Ꜳ": "AA",
            "Æ": "AE",
            "Ǽ": "AE",
            "Ǣ": "AE",
            "Ꜵ": "AO",
            "Ꜷ": "AU",
            "Ꜹ": "AV",
            "Ꜻ": "AV",
            "Ꜽ": "AY",
            "Ⓑ": "B",
            "Ｂ": "B",
            "Ḃ": "B",
            "Ḅ": "B",
            "Ḇ": "B",
            "Ƀ": "B",
            "Ƃ": "B",
            "Ɓ": "B",
            "Ⓒ": "C",
            "Ｃ": "C",
            "Ć": "C",
            "Ĉ": "C",
            "Ċ": "C",
            "Č": "C",
            "Ç": "C",
            "Ḉ": "C",
            "Ƈ": "C",
            "Ȼ": "C",
            "Ꜿ": "C",
            "Ⓓ": "D",
            "Ｄ": "D",
            "Ḋ": "D",
            "Ď": "D",
            "Ḍ": "D",
            "Ḑ": "D",
            "Ḓ": "D",
            "Ḏ": "D",
            "Đ": "D",
            "Ƌ": "D",
            "Ɗ": "D",
            "Ɖ": "D",
            "Ꝺ": "D",
            "Ǳ": "DZ",
            "Ǆ": "DZ",
            "ǲ": "Dz",
            "ǅ": "Dz",
            "Ⓔ": "E",
            "Ｅ": "E",
            "È": "E",
            "É": "E",
            "Ê": "E",
            "Ề": "E",
            "Ế": "E",
            "Ễ": "E",
            "Ể": "E",
            "Ẽ": "E",
            "Ē": "E",
            "Ḕ": "E",
            "Ḗ": "E",
            "Ĕ": "E",
            "Ė": "E",
            "Ë": "E",
            "Ẻ": "E",
            "Ě": "E",
            "Ȅ": "E",
            "Ȇ": "E",
            "Ẹ": "E",
            "Ệ": "E",
            "Ȩ": "E",
            "Ḝ": "E",
            "Ę": "E",
            "Ḙ": "E",
            "Ḛ": "E",
            "Ɛ": "E",
            "Ǝ": "E",
            "Ⓕ": "F",
            "Ｆ": "F",
            "Ḟ": "F",
            "Ƒ": "F",
            "Ꝼ": "F",
            "Ⓖ": "G",
            "Ｇ": "G",
            "Ǵ": "G",
            "Ĝ": "G",
            "Ḡ": "G",
            "Ğ": "G",
            "Ġ": "G",
            "Ǧ": "G",
            "Ģ": "G",
            "Ǥ": "G",
            "Ɠ": "G",
            "Ꞡ": "G",
            "Ᵹ": "G",
            "Ꝿ": "G",
            "Ⓗ": "H",
            "Ｈ": "H",
            "Ĥ": "H",
            "Ḣ": "H",
            "Ḧ": "H",
            "Ȟ": "H",
            "Ḥ": "H",
            "Ḩ": "H",
            "Ḫ": "H",
            "Ħ": "H",
            "Ⱨ": "H",
            "Ⱶ": "H",
            "Ɥ": "H",
            "Ⓘ": "I",
            "Ｉ": "I",
            "Ì": "I",
            "Í": "I",
            "Î": "I",
            "Ĩ": "I",
            "Ī": "I",
            "Ĭ": "I",
            "İ": "I",
            "Ï": "I",
            "Ḯ": "I",
            "Ỉ": "I",
            "Ǐ": "I",
            "Ȉ": "I",
            "Ȋ": "I",
            "Ị": "I",
            "Į": "I",
            "Ḭ": "I",
            "Ɨ": "I",
            "Ⓙ": "J",
            "Ｊ": "J",
            "Ĵ": "J",
            "Ɉ": "J",
            "Ⓚ": "K",
            "Ｋ": "K",
            "Ḱ": "K",
            "Ǩ": "K",
            "Ḳ": "K",
            "Ķ": "K",
            "Ḵ": "K",
            "Ƙ": "K",
            "Ⱪ": "K",
            "Ꝁ": "K",
            "Ꝃ": "K",
            "Ꝅ": "K",
            "Ꞣ": "K",
            "Ⓛ": "L",
            "Ｌ": "L",
            "Ŀ": "L",
            "Ĺ": "L",
            "Ľ": "L",
            "Ḷ": "L",
            "Ḹ": "L",
            "Ļ": "L",
            "Ḽ": "L",
            "Ḻ": "L",
            "Ł": "L",
            "Ƚ": "L",
            "Ɫ": "L",
            "Ⱡ": "L",
            "Ꝉ": "L",
            "Ꝇ": "L",
            "Ꞁ": "L",
            "Ǉ": "LJ",
            "ǈ": "Lj",
            "Ⓜ": "M",
            "Ｍ": "M",
            "Ḿ": "M",
            "Ṁ": "M",
            "Ṃ": "M",
            "Ɱ": "M",
            "Ɯ": "M",
            "Ⓝ": "N",
            "Ｎ": "N",
            "Ǹ": "N",
            "Ń": "N",
            "Ñ": "N",
            "Ṅ": "N",
            "Ň": "N",
            "Ṇ": "N",
            "Ņ": "N",
            "Ṋ": "N",
            "Ṉ": "N",
            "Ƞ": "N",
            "Ɲ": "N",
            "Ꞑ": "N",
            "Ꞥ": "N",
            "Ǌ": "NJ",
            "ǋ": "Nj",
            "Ⓞ": "O",
            "Ｏ": "O",
            "Ò": "O",
            "Ó": "O",
            "Ô": "O",
            "Ồ": "O",
            "Ố": "O",
            "Ỗ": "O",
            "Ổ": "O",
            "Õ": "O",
            "Ṍ": "O",
            "Ȭ": "O",
            "Ṏ": "O",
            "Ō": "O",
            "Ṑ": "O",
            "Ṓ": "O",
            "Ŏ": "O",
            "Ȯ": "O",
            "Ȱ": "O",
            "Ö": "O",
            "Ȫ": "O",
            "Ỏ": "O",
            "Ő": "O",
            "Ǒ": "O",
            "Ȍ": "O",
            "Ȏ": "O",
            "Ơ": "O",
            "Ờ": "O",
            "Ớ": "O",
            "Ỡ": "O",
            "Ở": "O",
            "Ợ": "O",
            "Ọ": "O",
            "Ộ": "O",
            "Ǫ": "O",
            "Ǭ": "O",
            "Ø": "O",
            "Ǿ": "O",
            "Ɔ": "O",
            "Ɵ": "O",
            "Ꝋ": "O",
            "Ꝍ": "O",
            "Ƣ": "OI",
            "Ꝏ": "OO",
            "Ȣ": "OU",
            "Ⓟ": "P",
            "Ｐ": "P",
            "Ṕ": "P",
            "Ṗ": "P",
            "Ƥ": "P",
            "Ᵽ": "P",
            "Ꝑ": "P",
            "Ꝓ": "P",
            "Ꝕ": "P",
            "Ⓠ": "Q",
            "Ｑ": "Q",
            "Ꝗ": "Q",
            "Ꝙ": "Q",
            "Ɋ": "Q",
            "Ⓡ": "R",
            "Ｒ": "R",
            "Ŕ": "R",
            "Ṙ": "R",
            "Ř": "R",
            "Ȑ": "R",
            "Ȓ": "R",
            "Ṛ": "R",
            "Ṝ": "R",
            "Ŗ": "R",
            "Ṟ": "R",
            "Ɍ": "R",
            "Ɽ": "R",
            "Ꝛ": "R",
            "Ꞧ": "R",
            "Ꞃ": "R",
            "Ⓢ": "S",
            "Ｓ": "S",
            "ẞ": "S",
            "Ś": "S",
            "Ṥ": "S",
            "Ŝ": "S",
            "Ṡ": "S",
            "Š": "S",
            "Ṧ": "S",
            "Ṣ": "S",
            "Ṩ": "S",
            "Ș": "S",
            "Ş": "S",
            "Ȿ": "S",
            "Ꞩ": "S",
            "Ꞅ": "S",
            "Ⓣ": "T",
            "Ｔ": "T",
            "Ṫ": "T",
            "Ť": "T",
            "Ṭ": "T",
            "Ț": "T",
            "Ţ": "T",
            "Ṱ": "T",
            "Ṯ": "T",
            "Ŧ": "T",
            "Ƭ": "T",
            "Ʈ": "T",
            "Ⱦ": "T",
            "Ꞇ": "T",
            "Ꜩ": "TZ",
            "Ⓤ": "U",
            "Ｕ": "U",
            "Ù": "U",
            "Ú": "U",
            "Û": "U",
            "Ũ": "U",
            "Ṹ": "U",
            "Ū": "U",
            "Ṻ": "U",
            "Ŭ": "U",
            "Ü": "U",
            "Ǜ": "U",
            "Ǘ": "U",
            "Ǖ": "U",
            "Ǚ": "U",
            "Ủ": "U",
            "Ů": "U",
            "Ű": "U",
            "Ǔ": "U",
            "Ȕ": "U",
            "Ȗ": "U",
            "Ư": "U",
            "Ừ": "U",
            "Ứ": "U",
            "Ữ": "U",
            "Ử": "U",
            "Ự": "U",
            "Ụ": "U",
            "Ṳ": "U",
            "Ų": "U",
            "Ṷ": "U",
            "Ṵ": "U",
            "Ʉ": "U",
            "Ⓥ": "V",
            "Ｖ": "V",
            "Ṽ": "V",
            "Ṿ": "V",
            "Ʋ": "V",
            "Ꝟ": "V",
            "Ʌ": "V",
            "Ꝡ": "VY",
            "Ⓦ": "W",
            "Ｗ": "W",
            "Ẁ": "W",
            "Ẃ": "W",
            "Ŵ": "W",
            "Ẇ": "W",
            "Ẅ": "W",
            "Ẉ": "W",
            "Ⱳ": "W",
            "Ⓧ": "X",
            "Ｘ": "X",
            "Ẋ": "X",
            "Ẍ": "X",
            "Ⓨ": "Y",
            "Ｙ": "Y",
            "Ỳ": "Y",
            "Ý": "Y",
            "Ŷ": "Y",
            "Ỹ": "Y",
            "Ȳ": "Y",
            "Ẏ": "Y",
            "Ÿ": "Y",
            "Ỷ": "Y",
            "Ỵ": "Y",
            "Ƴ": "Y",
            "Ɏ": "Y",
            "Ỿ": "Y",
            "Ⓩ": "Z",
            "Ｚ": "Z",
            "Ź": "Z",
            "Ẑ": "Z",
            "Ż": "Z",
            "Ž": "Z",
            "Ẓ": "Z",
            "Ẕ": "Z",
            "Ƶ": "Z",
            "Ȥ": "Z",
            "Ɀ": "Z",
            "Ⱬ": "Z",
            "Ꝣ": "Z",
            "ⓐ": "a",
            "ａ": "a",
            "ẚ": "a",
            "à": "a",
            "á": "a",
            "â": "a",
            "ầ": "a",
            "ấ": "a",
            "ẫ": "a",
            "ẩ": "a",
            "ã": "a",
            "ā": "a",
            "ă": "a",
            "ằ": "a",
            "ắ": "a",
            "ẵ": "a",
            "ẳ": "a",
            "ȧ": "a",
            "ǡ": "a",
            "ä": "a",
            "ǟ": "a",
            "ả": "a",
            "å": "a",
            "ǻ": "a",
            "ǎ": "a",
            "ȁ": "a",
            "ȃ": "a",
            "ạ": "a",
            "ậ": "a",
            "ặ": "a",
            "ḁ": "a",
            "ą": "a",
            "ⱥ": "a",
            "ɐ": "a",
            "ꜳ": "aa",
            "æ": "ae",
            "ǽ": "ae",
            "ǣ": "ae",
            "ꜵ": "ao",
            "ꜷ": "au",
            "ꜹ": "av",
            "ꜻ": "av",
            "ꜽ": "ay",
            "ⓑ": "b",
            "ｂ": "b",
            "ḃ": "b",
            "ḅ": "b",
            "ḇ": "b",
            "ƀ": "b",
            "ƃ": "b",
            "ɓ": "b",
            "ⓒ": "c",
            "ｃ": "c",
            "ć": "c",
            "ĉ": "c",
            "ċ": "c",
            "č": "c",
            "ç": "c",
            "ḉ": "c",
            "ƈ": "c",
            "ȼ": "c",
            "ꜿ": "c",
            "ↄ": "c",
            "ⓓ": "d",
            "ｄ": "d",
            "ḋ": "d",
            "ď": "d",
            "ḍ": "d",
            "ḑ": "d",
            "ḓ": "d",
            "ḏ": "d",
            "đ": "d",
            "ƌ": "d",
            "ɖ": "d",
            "ɗ": "d",
            "ꝺ": "d",
            "ǳ": "dz",
            "ǆ": "dz",
            "ⓔ": "e",
            "ｅ": "e",
            "è": "e",
            "é": "e",
            "ê": "e",
            "ề": "e",
            "ế": "e",
            "ễ": "e",
            "ể": "e",
            "ẽ": "e",
            "ē": "e",
            "ḕ": "e",
            "ḗ": "e",
            "ĕ": "e",
            "ė": "e",
            "ë": "e",
            "ẻ": "e",
            "ě": "e",
            "ȅ": "e",
            "ȇ": "e",
            "ẹ": "e",
            "ệ": "e",
            "ȩ": "e",
            "ḝ": "e",
            "ę": "e",
            "ḙ": "e",
            "ḛ": "e",
            "ɇ": "e",
            "ɛ": "e",
            "ǝ": "e",
            "ⓕ": "f",
            "ｆ": "f",
            "ḟ": "f",
            "ƒ": "f",
            "ꝼ": "f",
            "ⓖ": "g",
            "ｇ": "g",
            "ǵ": "g",
            "ĝ": "g",
            "ḡ": "g",
            "ğ": "g",
            "ġ": "g",
            "ǧ": "g",
            "ģ": "g",
            "ǥ": "g",
            "ɠ": "g",
            "ꞡ": "g",
            "ᵹ": "g",
            "ꝿ": "g",
            "ⓗ": "h",
            "ｈ": "h",
            "ĥ": "h",
            "ḣ": "h",
            "ḧ": "h",
            "ȟ": "h",
            "ḥ": "h",
            "ḩ": "h",
            "ḫ": "h",
            "ẖ": "h",
            "ħ": "h",
            "ⱨ": "h",
            "ⱶ": "h",
            "ɥ": "h",
            "ƕ": "hv",
            "ⓘ": "i",
            "ｉ": "i",
            "ì": "i",
            "í": "i",
            "î": "i",
            "ĩ": "i",
            "ī": "i",
            "ĭ": "i",
            "ï": "i",
            "ḯ": "i",
            "ỉ": "i",
            "ǐ": "i",
            "ȉ": "i",
            "ȋ": "i",
            "ị": "i",
            "į": "i",
            "ḭ": "i",
            "ɨ": "i",
            "ı": "i",
            "ⓙ": "j",
            "ｊ": "j",
            "ĵ": "j",
            "ǰ": "j",
            "ɉ": "j",
            "ⓚ": "k",
            "ｋ": "k",
            "ḱ": "k",
            "ǩ": "k",
            "ḳ": "k",
            "ķ": "k",
            "ḵ": "k",
            "ƙ": "k",
            "ⱪ": "k",
            "ꝁ": "k",
            "ꝃ": "k",
            "ꝅ": "k",
            "ꞣ": "k",
            "ⓛ": "l",
            "ｌ": "l",
            "ŀ": "l",
            "ĺ": "l",
            "ľ": "l",
            "ḷ": "l",
            "ḹ": "l",
            "ļ": "l",
            "ḽ": "l",
            "ḻ": "l",
            "ſ": "l",
            "ł": "l",
            "ƚ": "l",
            "ɫ": "l",
            "ⱡ": "l",
            "ꝉ": "l",
            "ꞁ": "l",
            "ꝇ": "l",
            "ǉ": "lj",
            "ⓜ": "m",
            "ｍ": "m",
            "ḿ": "m",
            "ṁ": "m",
            "ṃ": "m",
            "ɱ": "m",
            "ɯ": "m",
            "ⓝ": "n",
            "ｎ": "n",
            "ǹ": "n",
            "ń": "n",
            "ñ": "n",
            "ṅ": "n",
            "ň": "n",
            "ṇ": "n",
            "ņ": "n",
            "ṋ": "n",
            "ṉ": "n",
            "ƞ": "n",
            "ɲ": "n",
            "ŉ": "n",
            "ꞑ": "n",
            "ꞥ": "n",
            "ǌ": "nj",
            "ⓞ": "o",
            "ｏ": "o",
            "ò": "o",
            "ó": "o",
            "ô": "o",
            "ồ": "o",
            "ố": "o",
            "ỗ": "o",
            "ổ": "o",
            "õ": "o",
            "ṍ": "o",
            "ȭ": "o",
            "ṏ": "o",
            "ō": "o",
            "ṑ": "o",
            "ṓ": "o",
            "ŏ": "o",
            "ȯ": "o",
            "ȱ": "o",
            "ö": "o",
            "ȫ": "o",
            "ỏ": "o",
            "ő": "o",
            "ǒ": "o",
            "ȍ": "o",
            "ȏ": "o",
            "ơ": "o",
            "ờ": "o",
            "ớ": "o",
            "ỡ": "o",
            "ở": "o",
            "ợ": "o",
            "ọ": "o",
            "ộ": "o",
            "ǫ": "o",
            "ǭ": "o",
            "ø": "o",
            "ǿ": "o",
            "ɔ": "o",
            "ꝋ": "o",
            "ꝍ": "o",
            "ɵ": "o",
            "ƣ": "oi",
            "ȣ": "ou",
            "ꝏ": "oo",
            "ⓟ": "p",
            "ｐ": "p",
            "ṕ": "p",
            "ṗ": "p",
            "ƥ": "p",
            "ᵽ": "p",
            "ꝑ": "p",
            "ꝓ": "p",
            "ꝕ": "p",
            "ⓠ": "q",
            "ｑ": "q",
            "ɋ": "q",
            "ꝗ": "q",
            "ꝙ": "q",
            "ⓡ": "r",
            "ｒ": "r",
            "ŕ": "r",
            "ṙ": "r",
            "ř": "r",
            "ȑ": "r",
            "ȓ": "r",
            "ṛ": "r",
            "ṝ": "r",
            "ŗ": "r",
            "ṟ": "r",
            "ɍ": "r",
            "ɽ": "r",
            "ꝛ": "r",
            "ꞧ": "r",
            "ꞃ": "r",
            "ⓢ": "s",
            "ｓ": "s",
            "ß": "s",
            "ś": "s",
            "ṥ": "s",
            "ŝ": "s",
            "ṡ": "s",
            "š": "s",
            "ṧ": "s",
            "ṣ": "s",
            "ṩ": "s",
            "ș": "s",
            "ş": "s",
            "ȿ": "s",
            "ꞩ": "s",
            "ꞅ": "s",
            "ẛ": "s",
            "ⓣ": "t",
            "ｔ": "t",
            "ṫ": "t",
            "ẗ": "t",
            "ť": "t",
            "ṭ": "t",
            "ț": "t",
            "ţ": "t",
            "ṱ": "t",
            "ṯ": "t",
            "ŧ": "t",
            "ƭ": "t",
            "ʈ": "t",
            "ⱦ": "t",
            "ꞇ": "t",
            "ꜩ": "tz",
            "ⓤ": "u",
            "ｕ": "u",
            "ù": "u",
            "ú": "u",
            "û": "u",
            "ũ": "u",
            "ṹ": "u",
            "ū": "u",
            "ṻ": "u",
            "ŭ": "u",
            "ü": "u",
            "ǜ": "u",
            "ǘ": "u",
            "ǖ": "u",
            "ǚ": "u",
            "ủ": "u",
            "ů": "u",
            "ű": "u",
            "ǔ": "u",
            "ȕ": "u",
            "ȗ": "u",
            "ư": "u",
            "ừ": "u",
            "ứ": "u",
            "ữ": "u",
            "ử": "u",
            "ự": "u",
            "ụ": "u",
            "ṳ": "u",
            "ų": "u",
            "ṷ": "u",
            "ṵ": "u",
            "ʉ": "u",
            "ⓥ": "v",
            "ｖ": "v",
            "ṽ": "v",
            "ṿ": "v",
            "ʋ": "v",
            "ꝟ": "v",
            "ʌ": "v",
            "ꝡ": "vy",
            "ⓦ": "w",
            "ｗ": "w",
            "ẁ": "w",
            "ẃ": "w",
            "ŵ": "w",
            "ẇ": "w",
            "ẅ": "w",
            "ẘ": "w",
            "ẉ": "w",
            "ⱳ": "w",
            "ⓧ": "x",
            "ｘ": "x",
            "ẋ": "x",
            "ẍ": "x",
            "ⓨ": "y",
            "ｙ": "y",
            "ỳ": "y",
            "ý": "y",
            "ŷ": "y",
            "ỹ": "y",
            "ȳ": "y",
            "ẏ": "y",
            "ÿ": "y",
            "ỷ": "y",
            "ẙ": "y",
            "ỵ": "y",
            "ƴ": "y",
            "ɏ": "y",
            "ỿ": "y",
            "ⓩ": "z",
            "ｚ": "z",
            "ź": "z",
            "ẑ": "z",
            "ż": "z",
            "ž": "z",
            "ẓ": "z",
            "ẕ": "z",
            "ƶ": "z",
            "ȥ": "z",
            "ɀ": "z",
            "ⱬ": "z",
            "ꝣ": "z"
        };
        $document = $(document), nextUid = function() {
            var counter = 1;
            return function() {
                return counter++;
            };
        }(), $document.on("mousemove", function(e) {
            lastMousePosition.x = e.pageX, lastMousePosition.y = e.pageY;
        }), AbstractSelect2 = clazz(Object, {
            // abstract
            bind: function(func) {
                var self = this;
                return function() {
                    func.apply(self, arguments);
                };
            },
            // abstract
            init: function(opts) {
                var results, search, resultsSelector = ".select2-results";
                // prepare options
                this.opts = opts = this.prepareOpts(opts), this.id = opts.id, // destroy if called on an existing component
                opts.element.data("select2") !== undefined && null !== opts.element.data("select2") && opts.element.data("select2").destroy(), 
                this.container = this.createContainer(), this.liveRegion = $("<span>", {
                    role: "status",
                    "aria-live": "polite"
                }).addClass("select2-hidden-accessible").appendTo(document.body), this.containerId = "s2id_" + (opts.element.attr("id") || "autogen" + nextUid()), 
                this.containerEventName = this.containerId.replace(/([.])/g, "_").replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, "\\$1"), 
                this.container.attr("id", this.containerId), this.container.attr("title", opts.element.attr("title")), 
                this.body = $("body"), syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass), 
                this.container.attr("style", opts.element.attr("style")), this.container.css(evaluate(opts.containerCss)), 
                this.container.addClass(evaluate(opts.containerCssClass)), this.elementTabIndex = this.opts.element.attr("tabindex"), 
                // swap container for the element
                this.opts.element.data("select2", this).attr("tabindex", "-1").before(this.container).on("click.select2", killEvent), 
                // do not leak click events
                this.container.data("select2", this), this.dropdown = this.container.find(".select2-drop"), 
                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass), 
                this.dropdown.addClass(evaluate(opts.dropdownCssClass)), this.dropdown.data("select2", this), 
                this.dropdown.on("click", killEvent), this.results = results = this.container.find(resultsSelector), 
                this.search = search = this.container.find("input.select2-input"), this.queryCount = 0, 
                this.resultsPage = 0, this.context = null, // initialize the container
                this.initContainer(), this.container.on("click", killEvent), installFilteredMouseMove(this.results), 
                this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent)), 
                this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function(event) {
                    this._touchEvent = !0, this.highlightUnderEvent(event);
                })), this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved)), 
                this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved)), 
                // Waiting for a click event on touch devices to select option and hide dropdown
                // otherwise click will be triggered on an underlying element
                this.dropdown.on("click", this.bind(function(event) {
                    this._touchEvent && (this._touchEvent = !1, this.selectHighlighted());
                })), installDebouncedScroll(80, this.results), this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded)), 
                // do not propagate change event from the search field out of the component
                $(this.container).on("change", ".select2-input", function(e) {
                    e.stopPropagation();
                }), $(this.dropdown).on("change", ".select2-input", function(e) {
                    e.stopPropagation();
                }), // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
                $.fn.mousewheel && results.mousewheel(function(e, delta, deltaX, deltaY) {
                    var top = results.scrollTop();
                    deltaY > 0 && 0 >= top - deltaY ? (results.scrollTop(0), killEvent(e)) : 0 > deltaY && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height() && (results.scrollTop(results.get(0).scrollHeight - results.height()), 
                    killEvent(e));
                }), installKeyUpChangeEvent(search), search.on("keyup-change input paste", this.bind(this.updateResults)), 
                search.on("focus", function() {
                    search.addClass("select2-focused");
                }), search.on("blur", function() {
                    search.removeClass("select2-focused");
                }), this.dropdown.on("mouseup", resultsSelector, this.bind(function(e) {
                    $(e.target).closest(".select2-result-selectable").length > 0 && (this.highlightUnderEvent(e), 
                    this.selectHighlighted(e));
                })), // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
                // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
                // dom it will trigger the popup close, which is not what we want
                // focusin can cause focus wars between modals and select2 since the dropdown is outside the modal.
                this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function(e) {
                    e.stopPropagation();
                }), this.nextSearchTerm = undefined, $.isFunction(this.opts.initSelection) && (// initialize selection based on the current value of the source element
                this.initSelection(), // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource()), null !== opts.maximumInputLength && this.search.attr("maxlength", opts.maximumInputLength);
                var disabled = opts.element.prop("disabled");
                disabled === undefined && (disabled = !1), this.enable(!disabled);
                var readonly = opts.element.prop("readonly");
                readonly === undefined && (readonly = !1), this.readonly(readonly), // Calculate size of scrollbar
                scrollBarDimensions = scrollBarDimensions || measureScrollbar(), this.autofocus = opts.element.prop("autofocus"), 
                opts.element.prop("autofocus", !1), this.autofocus && this.focus(), this.search.attr("placeholder", opts.searchInputPlaceholder);
            },
            // abstract
            destroy: function() {
                var element = this.opts.element, select2 = element.data("select2");
                this.close(), this.propertyObserver && (this.propertyObserver.disconnect(), this.propertyObserver = null), 
                select2 !== undefined && (select2.container.remove(), select2.liveRegion.remove(), 
                select2.dropdown.remove(), element.removeClass("select2-offscreen").removeData("select2").off(".select2").prop("autofocus", this.autofocus || !1), 
                this.elementTabIndex ? element.attr({
                    tabindex: this.elementTabIndex
                }) : element.removeAttr("tabindex"), element.show()), cleanupJQueryElements.call(this, "container", "liveRegion", "dropdown", "results", "search");
            },
            // abstract
            optionToData: function(element) {
                return element.is("option") ? {
                    id: element.prop("value"),
                    text: element.text(),
                    element: element.get(),
                    css: element.attr("class"),
                    disabled: element.prop("disabled"),
                    locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), !0)
                } : element.is("optgroup") ? {
                    text: element.attr("label"),
                    children: [],
                    element: element.get(),
                    css: element.attr("class")
                } : void 0;
            },
            // abstract
            prepareOpts: function(opts) {
                var element, select, idKey, ajaxUrl, self = this;
                if (element = opts.element, "select" === element.get(0).tagName.toLowerCase() && (this.select = select = opts.element), 
                select && // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each([ "id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags" ], function() {
                    if (this in opts) throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                }), opts = $.extend({}, {
                    populateResults: function(container, results, query) {
                        var populate, id = this.opts.id, liveRegion = this.liveRegion;
                        (populate = function(results, container, depth) {
                            var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;
                            for (results = opts.sortResults(results, container, query), i = 0, l = results.length; l > i; i += 1) result = results[i], 
                            disabled = result.disabled === !0, selectable = !disabled && id(result) !== undefined, 
                            compound = result.children && result.children.length > 0, node = $("<li></li>"), 
                            node.addClass("select2-results-dept-" + depth), node.addClass("select2-result"), 
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable"), 
                            disabled && node.addClass("select2-disabled"), compound && node.addClass("select2-result-with-children"), 
                            node.addClass(self.opts.formatResultCssClass(result)), node.attr("role", "presentation"), 
                            label = $(document.createElement("div")), label.addClass("select2-result-label"), 
                            label.attr("id", "select2-result-label-" + nextUid()), label.attr("role", "option"), 
                            formatted = opts.formatResult(result, label, query, self.opts.escapeMarkup), formatted !== undefined && (label.html(formatted), 
                            node.append(label)), compound && (innerContainer = $("<ul></ul>"), innerContainer.addClass("select2-result-sub"), 
                            populate(result.children, innerContainer, depth + 1), node.append(innerContainer)), 
                            node.data("select2-data", result), container.append(node);
                            liveRegion.text(opts.formatMatches(results.length));
                        })(results, container, 0);
                    }
                }, $.fn.select2.defaults, opts), "function" != typeof opts.id && (idKey = opts.id, 
                opts.id = function(e) {
                    return e[idKey];
                }), $.isArray(opts.element.data("select2Tags"))) {
                    if ("tags" in opts) throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                    opts.tags = opts.element.data("select2Tags");
                }
                if (select ? (opts.query = this.bind(function(query) {
                    var children, placeholderOption, process, data = {
                        results: [],
                        more: !1
                    }, term = query.term;
                    process = function(element, collection) {
                        var group;
                        element.is("option") ? query.matcher(term, element.text(), element) && collection.push(self.optionToData(element)) : element.is("optgroup") && (group = self.optionToData(element), 
                        element.children().each2(function(i, elm) {
                            process(elm, group.children);
                        }), group.children.length > 0 && collection.push(group));
                    }, children = element.children(), // ignore the placeholder option if there is one
                    this.getPlaceholder() !== undefined && children.length > 0 && (placeholderOption = this.getPlaceholderOption(), 
                    placeholderOption && (children = children.not(placeholderOption))), children.each2(function(i, elm) {
                        process(elm, data.results);
                    }), query.callback(data);
                }), // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id = function(e) {
                    return e.id;
                }) : "query" in opts || ("ajax" in opts ? (ajaxUrl = opts.element.data("ajax-url"), 
                ajaxUrl && ajaxUrl.length > 0 && (opts.ajax.url = ajaxUrl), opts.query = ajax.call(opts.element, opts.ajax)) : "data" in opts ? opts.query = local(opts.data) : "tags" in opts && (opts.query = tags(opts.tags), 
                opts.createSearchChoice === undefined && (opts.createSearchChoice = function(term) {
                    return {
                        id: $.trim(term),
                        text: $.trim(term)
                    };
                }), opts.initSelection === undefined && (opts.initSelection = function(element, callback) {
                    var data = [];
                    $(splitVal(element.val(), opts.separator)).each(function() {
                        var obj = {
                            id: this,
                            text: this
                        }, tags = opts.tags;
                        $.isFunction(tags) && (tags = tags()), $(tags).each(function() {
                            return equal(this.id, obj.id) ? (obj = this, !1) : void 0;
                        }), data.push(obj);
                    }), callback(data);
                }))), "function" != typeof opts.query) throw "query function not defined for Select2 " + opts.element.attr("id");
                if ("top" === opts.createSearchChoicePosition) opts.createSearchChoicePosition = function(list, item) {
                    list.unshift(item);
                }; else if ("bottom" === opts.createSearchChoicePosition) opts.createSearchChoicePosition = function(list, item) {
                    list.push(item);
                }; else if ("function" != typeof opts.createSearchChoicePosition) throw "invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
                return opts;
            },
            /**
         * Monitor the original element for changes and update select2 accordingly
         */
            // abstract
            monitorSource: function() {
                var sync, observer, el = this.opts.element;
                el.on("change.select2", this.bind(function(e) {
                    this.opts.element.data("select2-change-triggered") !== !0 && this.initSelection();
                })), sync = this.bind(function() {
                    // sync enabled state
                    var disabled = el.prop("disabled");
                    disabled === undefined && (disabled = !1), this.enable(!disabled);
                    var readonly = el.prop("readonly");
                    readonly === undefined && (readonly = !1), this.readonly(readonly), syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass), 
                    this.container.addClass(evaluate(this.opts.containerCssClass)), syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass), 
                    this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));
                }), // IE8-10 (IE9/10 won't fire propertyChange via attachEventListener)
                el.length && el[0].attachEvent && el.each(function() {
                    this.attachEvent("onpropertychange", sync);
                }), // safari, chrome, firefox, IE11
                observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver, 
                observer !== undefined && (this.propertyObserver && (delete this.propertyObserver, 
                this.propertyObserver = null), this.propertyObserver = new observer(function(mutations) {
                    mutations.forEach(sync);
                }), this.propertyObserver.observe(el.get(0), {
                    attributes: !0,
                    subtree: !1
                }));
            },
            // abstract
            triggerSelect: function(data) {
                var evt = $.Event("select2-selecting", {
                    val: this.id(data),
                    object: data
                });
                return this.opts.element.trigger(evt), !evt.isDefaultPrevented();
            },
            /**
         * Triggers the change event on the source element
         */
            // abstract
            triggerChange: function(details) {
                details = details || {}, details = $.extend({}, details, {
                    type: "change",
                    val: this.val()
                }), // prevents recursive triggering
                this.opts.element.data("select2-change-triggered", !0), this.opts.element.trigger(details), 
                this.opts.element.data("select2-change-triggered", !1), // some validation frameworks ignore the change event and listen instead to keyup, click for selects
                // so here we trigger the click event manually
                this.opts.element.click(), // ValidationEngine ignores the change event and listens instead to blur
                // so here we trigger the blur event manually if so desired
                this.opts.blurOnChange && this.opts.element.blur();
            },
            //abstract
            isInterfaceEnabled: function() {
                return this.enabledInterface === !0;
            },
            // abstract
            enableInterface: function() {
                var enabled = this._enabled && !this._readonly, disabled = !enabled;
                return enabled === this.enabledInterface ? !1 : (this.container.toggleClass("select2-container-disabled", disabled), 
                this.close(), this.enabledInterface = enabled, !0);
            },
            // abstract
            enable: function(enabled) {
                enabled === undefined && (enabled = !0), this._enabled !== enabled && (this._enabled = enabled, 
                this.opts.element.prop("disabled", !enabled), this.enableInterface());
            },
            // abstract
            disable: function() {
                this.enable(!1);
            },
            // abstract
            readonly: function(enabled) {
                enabled === undefined && (enabled = !1), this._readonly !== enabled && (this._readonly = enabled, 
                this.opts.element.prop("readonly", enabled), this.enableInterface());
            },
            // abstract
            opened: function() {
                return this.container.hasClass("select2-dropdown-open");
            },
            // abstract
            positionDropdown: function() {
                var bodyOffset, above, changeDirection, css, resultsListNode, $dropdown = this.dropdown, offset = this.container.offset(), height = this.container.outerHeight(!1), width = this.container.outerWidth(!1), dropHeight = $dropdown.outerHeight(!1), $window = $(window), windowWidth = $window.width(), windowHeight = $window.height(), viewPortRight = $window.scrollLeft() + windowWidth, viewportBottom = $window.scrollTop() + windowHeight, dropTop = offset.top + height, dropLeft = offset.left, enoughRoomBelow = viewportBottom >= dropTop + dropHeight, enoughRoomAbove = offset.top - dropHeight >= $window.scrollTop(), dropWidth = $dropdown.outerWidth(!1), enoughRoomOnRight = viewPortRight >= dropLeft + dropWidth, aboveNow = $dropdown.hasClass("select2-drop-above");
                // always prefer the current above/below alignment, unless there is not enough room
                aboveNow ? (above = !0, !enoughRoomAbove && enoughRoomBelow && (changeDirection = !0, 
                above = !1)) : (above = !1, !enoughRoomBelow && enoughRoomAbove && (changeDirection = !0, 
                above = !0)), //if we are changing direction we need to get positions when dropdown is hidden;
                changeDirection && ($dropdown.hide(), offset = this.container.offset(), height = this.container.outerHeight(!1), 
                width = this.container.outerWidth(!1), dropHeight = $dropdown.outerHeight(!1), viewPortRight = $window.scrollLeft() + windowWidth, 
                viewportBottom = $window.scrollTop() + windowHeight, dropTop = offset.top + height, 
                dropLeft = offset.left, dropWidth = $dropdown.outerWidth(!1), enoughRoomOnRight = viewPortRight >= dropLeft + dropWidth, 
                $dropdown.show(), // fix so the cursor does not move to the left within the search-textbox in IE
                this.focusSearch()), this.opts.dropdownAutoWidth ? (resultsListNode = $(".select2-results", $dropdown)[0], 
                $dropdown.addClass("select2-drop-auto-width"), $dropdown.css("width", ""), // Add scrollbar width to dropdown if vertical scrollbar is present
                dropWidth = $dropdown.outerWidth(!1) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width), 
                dropWidth > width ? width = dropWidth : dropWidth = width, dropHeight = $dropdown.outerHeight(!1), 
                enoughRoomOnRight = viewPortRight >= dropLeft + dropWidth) : this.container.removeClass("select2-drop-auto-width"), 
                //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
                //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body.scrollTop(), "enough?", enoughRoomAbove);
                // fix positioning when body has an offset and is not position: static
                "static" !== this.body.css("position") && (bodyOffset = this.body.offset(), dropTop -= bodyOffset.top, 
                dropLeft -= bodyOffset.left), enoughRoomOnRight || (dropLeft = offset.left + this.container.outerWidth(!1) - dropWidth), 
                css = {
                    left: dropLeft,
                    width: width
                }, above ? (css.top = offset.top - dropHeight, css.bottom = "auto", this.container.addClass("select2-drop-above"), 
                $dropdown.addClass("select2-drop-above")) : (css.top = dropTop, css.bottom = "auto", 
                this.container.removeClass("select2-drop-above"), $dropdown.removeClass("select2-drop-above")), 
                css = $.extend(css, evaluate(this.opts.dropdownCss)), $dropdown.css(css);
            },
            // abstract
            shouldOpen: function() {
                var event;
                return this.opened() ? !1 : this._enabled === !1 || this._readonly === !0 ? !1 : (event = $.Event("select2-opening"), 
                this.opts.element.trigger(event), !event.isDefaultPrevented());
            },
            // abstract
            clearDropdownAlignmentPreference: function() {
                // clear the classes used to figure out the preference of where the dropdown should be opened
                this.container.removeClass("select2-drop-above"), this.dropdown.removeClass("select2-drop-above");
            },
            /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
            // abstract
            open: function() {
                return this.shouldOpen() ? (this.opening(), !0) : !1;
            },
            /**
         * Performs the opening of the dropdown
         */
            // abstract
            opening: function() {
                var mask, cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid;
                this.container.addClass("select2-dropdown-open").addClass("select2-container-active"), 
                this.clearDropdownAlignmentPreference(), this.dropdown[0] !== this.body.children().last()[0] && this.dropdown.detach().appendTo(this.body), 
                // create the dropdown mask if doesn't already exist
                mask = $("#select2-drop-mask"), 0 == mask.length && (mask = $(document.createElement("div")), 
                mask.attr("id", "select2-drop-mask").attr("class", "select2-drop-mask"), mask.hide(), 
                mask.appendTo(this.body), mask.on("mousedown touchstart click", function(e) {
                    // Prevent IE from generating a click event on the body
                    reinsertElement(mask);
                    var self, dropdown = $("#select2-drop");
                    dropdown.length > 0 && (self = dropdown.data("select2"), self.opts.selectOnBlur && self.selectHighlighted({
                        noFocus: !0
                    }), self.close(), e.preventDefault(), e.stopPropagation());
                })), // ensure the mask is always right before the dropdown
                this.dropdown.prev()[0] !== mask[0] && this.dropdown.before(mask), // move the global id to the correct dropdown
                $("#select2-drop").removeAttr("id"), this.dropdown.attr("id", "select2-drop"), // show the elements
                mask.show(), this.positionDropdown(), this.dropdown.show(), this.positionDropdown(), 
                this.dropdown.addClass("select2-drop-active");
                // attach listeners to events that can change the position of the container and thus require
                // the position of the dropdown to be updated as well so it does not come unglued from the container
                var that = this;
                this.container.parents().add(window).each(function() {
                    $(this).on(resize + " " + scroll + " " + orient, function(e) {
                        that.opened() && that.positionDropdown();
                    });
                });
            },
            // abstract
            close: function() {
                if (this.opened()) {
                    var cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid;
                    // unbind event listeners
                    this.container.parents().add(window).each(function() {
                        $(this).off(scroll).off(resize).off(orient);
                    }), this.clearDropdownAlignmentPreference(), $("#select2-drop-mask").hide(), this.dropdown.removeAttr("id"), 
                    // only the active dropdown has the select2-drop id
                    this.dropdown.hide(), this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active"), 
                    this.results.empty(), this.clearSearch(), this.search.removeClass("select2-active"), 
                    this.opts.element.trigger($.Event("select2-close"));
                }
            },
            /**
         * Opens control, sets input value, and updates results.
         */
            // abstract
            externalSearch: function(term) {
                this.open(), this.search.val(term), this.updateResults(!1);
            },
            // abstract
            clearSearch: function() {},
            //abstract
            getMaximumSelectionSize: function() {
                return evaluate(this.opts.maximumSelectionSize);
            },
            // abstract
            ensureHighlightVisible: function() {
                var children, index, child, hb, rb, y, more, results = this.results;
                if (index = this.highlight(), !(0 > index)) {
                    if (0 == index) // if the first element is highlighted scroll all the way to the top,
                    // that way any unselectable headers above it will also be scrolled
                    // into view
                    return void results.scrollTop(0);
                    children = this.findHighlightableChoices().find(".select2-result-label"), child = $(children[index]), 
                    hb = child.offset().top + child.outerHeight(!0), // if this is the last child lets also make sure select2-more-results is visible
                    index === children.length - 1 && (more = results.find("li.select2-more-results"), 
                    more.length > 0 && (hb = more.offset().top + more.outerHeight(!0))), rb = results.offset().top + results.outerHeight(!0), 
                    hb > rb && results.scrollTop(results.scrollTop() + (hb - rb)), y = child.offset().top - results.offset().top, 
                    // make sure the top of the element is visible
                    0 > y && "none" != child.css("display") && results.scrollTop(results.scrollTop() + y);
                }
            },
            // abstract
            findHighlightableChoices: function() {
                return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
            },
            // abstract
            moveHighlight: function(delta) {
                for (var choices = this.findHighlightableChoices(), index = this.highlight(); index > -1 && index < choices.length; ) {
                    index += delta;
                    var choice = $(choices[index]);
                    if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                        this.highlight(index);
                        break;
                    }
                }
            },
            // abstract
            highlight: function(index) {
                var choice, data, choices = this.findHighlightableChoices();
                // ensure assistive technology can determine the active choice
                return 0 === arguments.length ? indexOf(choices.filter(".select2-highlighted")[0], choices.get()) : (index >= choices.length && (index = choices.length - 1), 
                0 > index && (index = 0), this.removeHighlight(), choice = $(choices[index]), choice.addClass("select2-highlighted"), 
                this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id")), 
                this.ensureHighlightVisible(), this.liveRegion.text(choice.text()), data = choice.data("select2-data"), 
                void (data && this.opts.element.trigger({
                    type: "select2-highlight",
                    val: this.id(data),
                    choice: data
                })));
            },
            removeHighlight: function() {
                this.results.find(".select2-highlighted").removeClass("select2-highlighted");
            },
            touchMoved: function() {
                this._touchMoved = !0;
            },
            clearTouchMoved: function() {
                this._touchMoved = !1;
            },
            // abstract
            countSelectableResults: function() {
                return this.findHighlightableChoices().length;
            },
            // abstract
            highlightUnderEvent: function(event) {
                var el = $(event.target).closest(".select2-result-selectable");
                if (el.length > 0 && !el.is(".select2-highlighted")) {
                    var choices = this.findHighlightableChoices();
                    this.highlight(choices.index(el));
                } else 0 == el.length && // if we are over an unselectable item remove all highlights
                this.removeHighlight();
            },
            // abstract
            loadMoreIfNeeded: function() {
                var below, results = this.results, more = results.find("li.select2-more-results"), // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1, self = this, term = this.search.val(), context = this.context;
                0 !== more.length && (below = more.offset().top - results.offset().top - results.height(), 
                below <= this.opts.loadMorePadding && (more.addClass("select2-active"), this.opts.query({
                    element: this.opts.element,
                    term: term,
                    page: page,
                    context: context,
                    matcher: this.opts.matcher,
                    callback: this.bind(function(data) {
                        // ignore a response if the select2 has been closed before it was received
                        self.opened() && (self.opts.populateResults.call(this, results, data.results, {
                            term: term,
                            page: page,
                            context: context
                        }), self.postprocessResults(data, !1, !1), data.more === !0 ? (more.detach().appendTo(results).text(evaluate(self.opts.formatLoadMore, page + 1)), 
                        window.setTimeout(function() {
                            self.loadMoreIfNeeded();
                        }, 10)) : more.remove(), self.positionDropdown(), self.resultsPage = page, self.context = data.context, 
                        this.opts.element.trigger({
                            type: "select2-loaded",
                            items: data
                        }));
                    })
                })));
            },
            /**
         * Default tokenizer function which does nothing
         */
            tokenize: function() {},
            /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
            // abstract
            updateResults: function(initial) {
                function postRender() {
                    search.removeClass("select2-active"), self.positionDropdown(), results.find(".select2-no-results,.select2-selection-limit,.select2-searching").length ? self.liveRegion.text(results.text()) : self.liveRegion.text(self.opts.formatMatches(results.find(".select2-result-selectable").length));
                }
                function render(html) {
                    results.html(html), postRender();
                }
                var data, input, // sequence number used to drop out-of-order responses
                queryNumber, search = this.search, results = this.results, opts = this.opts, self = this, term = search.val(), lastTerm = $.data(this.container, "select2-last-term");
                // prevent duplicate queries against the same term
                if ((initial === !0 || !lastTerm || !equal(term, lastTerm)) && ($.data(this.container, "select2-last-term", term), 
                initial === !0 || this.showSearchInput !== !1 && this.opened())) // if the search is currently hidden we do not alter the results
                {
                    queryNumber = ++this.queryCount;
                    var maxSelSize = this.getMaximumSelectionSize();
                    if (maxSelSize >= 1 && (data = this.data(), $.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig"))) return void render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, maxSelSize) + "</li>");
                    if (search.val().length < opts.minimumInputLength) return render(checkFormatter(opts.formatInputTooShort, "formatInputTooShort") ? "<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, search.val(), opts.minimumInputLength) + "</li>" : ""), 
                    void (initial && this.showSearch && this.showSearch(!0));
                    if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) return void render(checkFormatter(opts.formatInputTooLong, "formatInputTooLong") ? "<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, search.val(), opts.maximumInputLength) + "</li>" : "");
                    opts.formatSearching && 0 === this.findHighlightableChoices().length && render("<li class='select2-searching'>" + evaluate(opts.formatSearching) + "</li>"), 
                    search.addClass("select2-active"), this.removeHighlight(), // give the tokenizer a chance to pre-process the input
                    input = this.tokenize(), input != undefined && null != input && search.val(input), 
                    this.resultsPage = 1, opts.query({
                        element: opts.element,
                        term: search.val(),
                        page: this.resultsPage,
                        context: null,
                        matcher: opts.matcher,
                        callback: this.bind(function(data) {
                            var def;
                            // default choice
                            // ignore old responses
                            if (queryNumber == this.queryCount) {
                                // ignore a response if the select2 has been closed before it was received
                                if (!this.opened()) return void this.search.removeClass("select2-active");
                                if (// save context, if any
                                this.context = data.context === undefined ? null : data.context, // create a default choice and prepend it to the list
                                this.opts.createSearchChoice && "" !== search.val() && (def = this.opts.createSearchChoice.call(self, search.val(), data.results), 
                                def !== undefined && null !== def && self.id(def) !== undefined && null !== self.id(def) && 0 === $(data.results).filter(function() {
                                    return equal(self.id(this), self.id(def));
                                }).length && this.opts.createSearchChoicePosition(data.results, def)), 0 === data.results.length && checkFormatter(opts.formatNoMatches, "formatNoMatches")) return void render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, search.val()) + "</li>");
                                results.empty(), self.opts.populateResults.call(this, results, data.results, {
                                    term: search.val(),
                                    page: this.resultsPage,
                                    context: null
                                }), data.more === !0 && checkFormatter(opts.formatLoadMore, "formatLoadMore") && (results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(evaluate(opts.formatLoadMore, this.resultsPage)) + "</li>"), 
                                window.setTimeout(function() {
                                    self.loadMoreIfNeeded();
                                }, 10)), this.postprocessResults(data, initial), postRender(), this.opts.element.trigger({
                                    type: "select2-loaded",
                                    items: data
                                });
                            }
                        })
                    });
                }
            },
            // abstract
            cancel: function() {
                this.close();
            },
            // abstract
            blur: function() {
                // if selectOnBlur == true, select the currently highlighted option
                this.opts.selectOnBlur && this.selectHighlighted({
                    noFocus: !0
                }), this.close(), this.container.removeClass("select2-container-active"), // synonymous to .is(':focus'), which is available in jquery >= 1.6
                this.search[0] === document.activeElement && this.search.blur(), this.clearSearch(), 
                this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
            },
            // abstract
            focusSearch: function() {
                focus(this.search);
            },
            // abstract
            selectHighlighted: function(options) {
                if (this._touchMoved) return void this.clearTouchMoved();
                var index = this.highlight(), highlighted = this.results.find(".select2-highlighted"), data = highlighted.closest(".select2-result").data("select2-data");
                data ? (this.highlight(index), this.onSelect(data, options)) : options && options.noFocus && this.close();
            },
            // abstract
            getPlaceholder: function() {
                var placeholderOption;
                // jquery 1.4 compat
                return this.opts.element.attr("placeholder") || this.opts.element.attr("data-placeholder") || this.opts.element.data("placeholder") || this.opts.placeholder || ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
            },
            // abstract
            getPlaceholderOption: function() {
                if (this.select) {
                    var firstOption = this.select.children("option").first();
                    if (this.opts.placeholderOption !== undefined) //Determine the placeholder option based on the specified placeholderOption setting
                    return "first" === this.opts.placeholderOption && firstOption || "function" == typeof this.opts.placeholderOption && this.opts.placeholderOption(this.select);
                    if ("" === $.trim(firstOption.text()) && "" === firstOption.val()) //No explicit placeholder option specified, use the first if it's blank
                    return firstOption;
                }
            },
            /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
            // abstract
            initContainerWidth: function() {
                function resolveContainerWidth() {
                    var style, attrs, matches, i, l, attr;
                    if ("off" === this.opts.width) return null;
                    if ("element" === this.opts.width) return 0 === this.opts.element.outerWidth(!1) ? "auto" : this.opts.element.outerWidth(!1) + "px";
                    if ("copy" === this.opts.width || "resolve" === this.opts.width) {
                        if (// check if there is inline style on the element that contains width
                        style = this.opts.element.attr("style"), style !== undefined) for (attrs = style.split(";"), 
                        i = 0, l = attrs.length; l > i; i += 1) if (attr = attrs[i].replace(/\s/g, ""), 
                        matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i), 
                        null !== matches && matches.length >= 1) return matches[1];
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        return "resolve" === this.opts.width ? (style = this.opts.element.css("width"), 
                        style.indexOf("%") > 0 ? style : 0 === this.opts.element.outerWidth(!1) ? "auto" : this.opts.element.outerWidth(!1) + "px") : null;
                    }
                    return $.isFunction(this.opts.width) ? this.opts.width() : this.opts.width;
                }
                var width = resolveContainerWidth.call(this);
                null !== width && this.container.css("width", width);
            }
        }), SingleSelect2 = clazz(AbstractSelect2, {
            // single
            createContainer: function() {
                var container = $(document.createElement("div")).attr({
                    "class": "select2-container"
                }).html([ "<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>", "   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>", "   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>", "</a>", "<label for='' class='select2-offscreen'></label>", "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />", "<div class='select2-drop select2-display-none'>", "   <div class='select2-search'>", "       <label for='' class='select2-offscreen'></label>", "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'", "       aria-autocomplete='list' />", "   </div>", "   <ul class='select2-results' role='listbox'>", "   </ul>", "</div>" ].join(""));
                return container;
            },
            // single
            enableInterface: function() {
                this.parent.enableInterface.apply(this, arguments) && this.focusser.prop("disabled", !this.isInterfaceEnabled());
            },
            // single
            opening: function() {
                var el, range, len;
                this.opts.minimumResultsForSearch >= 0 && this.showSearch(!0), this.parent.opening.apply(this, arguments), 
                this.showSearchInput !== !1 && // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                // all other browsers handle this just fine
                this.search.val(this.focusser.val()), this.opts.shouldFocusInput(this) && (this.search.focus(), 
                // move the cursor to the end after focussing, otherwise it will be at the beginning and
                // new text will appear *before* focusser.val()
                el = this.search.get(0), el.createTextRange ? (range = el.createTextRange(), range.collapse(!1), 
                range.select()) : el.setSelectionRange && (len = this.search.val().length, el.setSelectionRange(len, len))), 
                // initializes search's value with nextSearchTerm (if defined by user)
                // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
                "" === this.search.val() && this.nextSearchTerm != undefined && (this.search.val(this.nextSearchTerm), 
                this.search.select()), this.focusser.prop("disabled", !0).val(""), this.updateResults(!0), 
                this.opts.element.trigger($.Event("select2-open"));
            },
            // single
            close: function() {
                this.opened() && (this.parent.close.apply(this, arguments), this.focusser.prop("disabled", !1), 
                this.opts.shouldFocusInput(this) && this.focusser.focus());
            },
            // single
            focus: function() {
                this.opened() ? this.close() : (this.focusser.prop("disabled", !1), this.opts.shouldFocusInput(this) && this.focusser.focus());
            },
            // single
            isFocused: function() {
                return this.container.hasClass("select2-container-active");
            },
            // single
            cancel: function() {
                this.parent.cancel.apply(this, arguments), this.focusser.prop("disabled", !1), this.opts.shouldFocusInput(this) && this.focusser.focus();
            },
            // single
            destroy: function() {
                $("label[for='" + this.focusser.attr("id") + "']").attr("for", this.opts.element.attr("id")), 
                this.parent.destroy.apply(this, arguments), cleanupJQueryElements.call(this, "selection", "focusser");
            },
            // single
            initContainer: function() {
                var selection, elementLabel, container = this.container, dropdown = this.dropdown, idSuffix = nextUid();
                this.opts.minimumResultsForSearch < 0 ? this.showSearch(!1) : this.showSearch(!0), 
                this.selection = selection = container.find(".select2-choice"), this.focusser = container.find(".select2-focusser"), 
                // add aria associations
                selection.find(".select2-chosen").attr("id", "select2-chosen-" + idSuffix), this.focusser.attr("aria-labelledby", "select2-chosen-" + idSuffix), 
                this.results.attr("id", "select2-results-" + idSuffix), this.search.attr("aria-owns", "select2-results-" + idSuffix), 
                // rewrite labels from original element to focusser
                this.focusser.attr("id", "s2id_autogen" + idSuffix), elementLabel = $("label[for='" + this.opts.element.attr("id") + "']"), 
                this.focusser.prev().text(elementLabel.text()).attr("for", this.focusser.attr("id"));
                // Ensure the original element retains an accessible name
                var originalTitle = this.opts.element.attr("title");
                this.opts.element.attr("title", originalTitle || elementLabel.text()), this.focusser.attr("tabindex", this.elementTabIndex), 
                // write label for search field using the label from the focusser element
                this.search.attr("id", this.focusser.attr("id") + "_search"), this.search.prev().text($("label[for='" + this.focusser.attr("id") + "']").text()).attr("for", this.search.attr("id")), 
                this.search.on("keydown", this.bind(function(e) {
                    if (this.isInterfaceEnabled()) {
                        if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) // prevent the page from scrolling
                        return void killEvent(e);
                        switch (e.which) {
                          case KEY.UP:
                          case KEY.DOWN:
                            return this.moveHighlight(e.which === KEY.UP ? -1 : 1), void killEvent(e);

                          case KEY.ENTER:
                            return this.selectHighlighted(), void killEvent(e);

                          case KEY.TAB:
                            return void this.selectHighlighted({
                                noFocus: !0
                            });

                          case KEY.ESC:
                            return this.cancel(e), void killEvent(e);
                        }
                    }
                })), this.search.on("blur", this.bind(function(e) {
                    // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                    // without this the search field loses focus which is annoying
                    document.activeElement === this.body.get(0) && window.setTimeout(this.bind(function() {
                        this.opened() && this.search.focus();
                    }), 0);
                })), this.focusser.on("keydown", this.bind(function(e) {
                    if (this.isInterfaceEnabled() && e.which !== KEY.TAB && !KEY.isControl(e) && !KEY.isFunctionKey(e) && e.which !== KEY.ESC) {
                        if (this.opts.openOnEnter === !1 && e.which === KEY.ENTER) return void killEvent(e);
                        if (e.which == KEY.DOWN || e.which == KEY.UP || e.which == KEY.ENTER && this.opts.openOnEnter) {
                            if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
                            return this.open(), void killEvent(e);
                        }
                        return e.which == KEY.DELETE || e.which == KEY.BACKSPACE ? (this.opts.allowClear && this.clear(), 
                        void killEvent(e)) : void 0;
                    }
                })), installKeyUpChangeEvent(this.focusser), this.focusser.on("keyup-change input", this.bind(function(e) {
                    if (this.opts.minimumResultsForSearch >= 0) {
                        if (e.stopPropagation(), this.opened()) return;
                        this.open();
                    }
                })), selection.on("mousedown touchstart", "abbr", this.bind(function(e) {
                    this.isInterfaceEnabled() && (this.clear(), killEventImmediately(e), this.close(), 
                    this.selection.focus());
                })), selection.on("mousedown touchstart", this.bind(function(e) {
                    // Prevent IE from generating a click event on the body
                    reinsertElement(selection), this.container.hasClass("select2-container-active") || this.opts.element.trigger($.Event("select2-focus")), 
                    this.opened() ? this.close() : this.isInterfaceEnabled() && this.open(), killEvent(e);
                })), dropdown.on("mousedown touchstart", this.bind(function() {
                    this.opts.shouldFocusInput(this) && this.search.focus();
                })), selection.on("focus", this.bind(function(e) {
                    killEvent(e);
                })), this.focusser.on("focus", this.bind(function() {
                    this.container.hasClass("select2-container-active") || this.opts.element.trigger($.Event("select2-focus")), 
                    this.container.addClass("select2-container-active");
                })).on("blur", this.bind(function() {
                    this.opened() || (this.container.removeClass("select2-container-active"), this.opts.element.trigger($.Event("select2-blur")));
                })), this.search.on("focus", this.bind(function() {
                    this.container.hasClass("select2-container-active") || this.opts.element.trigger($.Event("select2-focus")), 
                    this.container.addClass("select2-container-active");
                })), this.initContainerWidth(), this.opts.element.addClass("select2-offscreen"), 
                this.setPlaceholder();
            },
            // single
            clear: function(triggerChange) {
                var data = this.selection.data("select2-data");
                if (data) {
                    // guard against queued quick consecutive clicks
                    var evt = $.Event("select2-clearing");
                    if (this.opts.element.trigger(evt), evt.isDefaultPrevented()) return;
                    var placeholderOption = this.getPlaceholderOption();
                    this.opts.element.val(placeholderOption ? placeholderOption.val() : ""), this.selection.find(".select2-chosen").empty(), 
                    this.selection.removeData("select2-data"), this.setPlaceholder(), triggerChange !== !1 && (this.opts.element.trigger({
                        type: "select2-removed",
                        val: this.id(data),
                        choice: data
                    }), this.triggerChange({
                        removed: data
                    }));
                }
            },
            /**
         * Sets selection based on source element's value
         */
            // single
            initSelection: function() {
                if (this.isPlaceholderOptionSelected()) this.updateSelection(null), this.close(), 
                this.setPlaceholder(); else {
                    var self = this;
                    this.opts.initSelection.call(null, this.opts.element, function(selected) {
                        selected !== undefined && null !== selected && (self.updateSelection(selected), 
                        self.close(), self.setPlaceholder(), self.nextSearchTerm = self.opts.nextSearchTerm(selected, self.search.val()));
                    });
                }
            },
            isPlaceholderOptionSelected: function() {
                var placeholderOption;
                return this.getPlaceholder() === undefined ? !1 : (placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected") || "" === this.opts.element.val() || this.opts.element.val() === undefined || null === this.opts.element.val();
            },
            // single
            prepareOpts: function() {
                var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
                // install the selection initializer
                // install default initSelection when applied to hidden input and data is local
                return "select" === opts.element.get(0).tagName.toLowerCase() ? opts.initSelection = function(element, callback) {
                    var selected = element.find("option").filter(function() {
                        return this.selected && !this.disabled;
                    });
                    // a single select box always has a value, no need to null check 'selected'
                    callback(self.optionToData(selected));
                } : "data" in opts && (opts.initSelection = opts.initSelection || function(element, callback) {
                    var id = element.val(), match = null;
                    opts.query({
                        matcher: function(term, text, el) {
                            var is_match = equal(id, opts.id(el));
                            return is_match && (match = el), is_match;
                        },
                        callback: $.isFunction(callback) ? function() {
                            callback(match);
                        } : $.noop
                    });
                }), opts;
            },
            // single
            getPlaceholder: function() {
                // if a placeholder is specified on a single select without a valid placeholder option ignore it
                // if a placeholder is specified on a single select without a valid placeholder option ignore it
                return this.select && this.getPlaceholderOption() === undefined ? undefined : this.parent.getPlaceholder.apply(this, arguments);
            },
            // single
            setPlaceholder: function() {
                var placeholder = this.getPlaceholder();
                if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {
                    // check for a placeholder option if attached to a select
                    if (this.select && this.getPlaceholderOption() === undefined) return;
                    this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder)), 
                    this.selection.addClass("select2-default"), this.container.removeClass("select2-allowclear");
                }
            },
            // single
            postprocessResults: function(data, initial, noHighlightUpdate) {
                var selected = 0, self = this;
                // hide the search box if this is the first we got the results and there are enough of them for search
                if (// find the selected element in the result list
                this.findHighlightableChoices().each2(function(i, elm) {
                    return equal(self.id(elm.data("select2-data")), self.opts.element.val()) ? (selected = i, 
                    !1) : void 0;
                }), // and highlight it
                noHighlightUpdate !== !1 && (initial === !0 && selected >= 0 ? this.highlight(selected) : this.highlight(0)), 
                initial === !0) {
                    var min = this.opts.minimumResultsForSearch;
                    min >= 0 && this.showSearch(countResults(data.results) >= min);
                }
            },
            // single
            showSearch: function(showSearchInput) {
                this.showSearchInput !== showSearchInput && (this.showSearchInput = showSearchInput, 
                this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput), 
                this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput), 
                //add "select2-with-searchbox" to the container if search box is shown
                $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput));
            },
            // single
            onSelect: function(data, options) {
                if (this.triggerSelect(data)) {
                    var old = this.opts.element.val(), oldData = this.data();
                    this.opts.element.val(this.id(data)), this.updateSelection(data), this.opts.element.trigger({
                        type: "select2-selected",
                        val: this.id(data),
                        choice: data
                    }), this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val()), this.close(), 
                    options && options.noFocus || !this.opts.shouldFocusInput(this) || this.focusser.focus(), 
                    equal(old, this.id(data)) || this.triggerChange({
                        added: data,
                        removed: oldData
                    });
                }
            },
            // single
            updateSelection: function(data) {
                var formatted, cssClass, container = this.selection.find(".select2-chosen");
                this.selection.data("select2-data", data), container.empty(), null !== data && (formatted = this.opts.formatSelection(data, container, this.opts.escapeMarkup)), 
                formatted !== undefined && container.append(formatted), cssClass = this.opts.formatSelectionCssClass(data, container), 
                cssClass !== undefined && container.addClass(cssClass), this.selection.removeClass("select2-default"), 
                this.opts.allowClear && this.getPlaceholder() !== undefined && this.container.addClass("select2-allowclear");
            },
            // single
            val: function() {
                var val, triggerChange = !1, data = null, self = this, oldData = this.data();
                if (0 === arguments.length) return this.opts.element.val();
                if (val = arguments[0], arguments.length > 1 && (triggerChange = arguments[1]), 
                this.select) this.select.val(val).find("option").filter(function() {
                    return this.selected;
                }).each2(function(i, elm) {
                    return data = self.optionToData(elm), !1;
                }), this.updateSelection(data), this.setPlaceholder(), triggerChange && this.triggerChange({
                    added: data,
                    removed: oldData
                }); else {
                    // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                    if (!val && 0 !== val) return void this.clear(triggerChange);
                    if (this.opts.initSelection === undefined) throw new Error("cannot call val() if initSelection() is not defined");
                    this.opts.element.val(val), this.opts.initSelection(this.opts.element, function(data) {
                        self.opts.element.val(data ? self.id(data) : ""), self.updateSelection(data), self.setPlaceholder(), 
                        triggerChange && self.triggerChange({
                            added: data,
                            removed: oldData
                        });
                    });
                }
            },
            // single
            clearSearch: function() {
                this.search.val(""), this.focusser.val("");
            },
            // single
            data: function(value) {
                var data, triggerChange = !1;
                return 0 === arguments.length ? (data = this.selection.data("select2-data"), data == undefined && (data = null), 
                data) : (arguments.length > 1 && (triggerChange = arguments[1]), void (value ? (data = this.data(), 
                this.opts.element.val(value ? this.id(value) : ""), this.updateSelection(value), 
                triggerChange && this.triggerChange({
                    added: value,
                    removed: data
                })) : this.clear(triggerChange)));
            }
        }), MultiSelect2 = clazz(AbstractSelect2, {
            // multi
            createContainer: function() {
                var container = $(document.createElement("div")).attr({
                    "class": "select2-container select2-container-multi"
                }).html([ "<ul class='select2-choices'>", "  <li class='select2-search-field'>", "    <label for='' class='select2-offscreen'></label>", "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>", "  </li>", "</ul>", "<div class='select2-drop select2-drop-multi select2-display-none'>", "   <ul class='select2-results'>", "   </ul>", "</div>" ].join(""));
                return container;
            },
            // multi
            prepareOpts: function() {
                var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
                // TODO validate placeholder is a string if specified
                // install the selection initializer
                // install default initSelection when applied to hidden input and data is local
                return "select" === opts.element.get(0).tagName.toLowerCase() ? opts.initSelection = function(element, callback) {
                    var data = [];
                    element.find("option").filter(function() {
                        return this.selected && !this.disabled;
                    }).each2(function(i, elm) {
                        data.push(self.optionToData(elm));
                    }), callback(data);
                } : "data" in opts && (opts.initSelection = opts.initSelection || function(element, callback) {
                    var ids = splitVal(element.val(), opts.separator), matches = [];
                    opts.query({
                        matcher: function(term, text, el) {
                            var is_match = $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                            return is_match && matches.push(el), is_match;
                        },
                        callback: $.isFunction(callback) ? function() {
                            for (var ordered = [], i = 0; i < ids.length; i++) for (var id = ids[i], j = 0; j < matches.length; j++) {
                                var match = matches[j];
                                if (equal(id, opts.id(match))) {
                                    ordered.push(match), matches.splice(j, 1);
                                    break;
                                }
                            }
                            callback(ordered);
                        } : $.noop
                    });
                }), opts;
            },
            // multi
            selectChoice: function(choice) {
                var selected = this.container.find(".select2-search-choice-focus");
                selected.length && choice && choice[0] == selected[0] || (selected.length && this.opts.element.trigger("choice-deselected", selected), 
                selected.removeClass("select2-search-choice-focus"), choice && choice.length && (this.close(), 
                choice.addClass("select2-search-choice-focus"), this.opts.element.trigger("choice-selected", choice)));
            },
            // multi
            destroy: function() {
                $("label[for='" + this.search.attr("id") + "']").attr("for", this.opts.element.attr("id")), 
                this.parent.destroy.apply(this, arguments), cleanupJQueryElements.call(this, "searchContainer", "selection");
            },
            // multi
            initContainer: function() {
                var selection, selector = ".select2-choices";
                this.searchContainer = this.container.find(".select2-search-field"), this.selection = selection = this.container.find(selector);
                var _this = this;
                this.selection.on("click", ".select2-search-choice:not(.select2-locked)", function(e) {
                    //killEvent(e);
                    _this.search[0].focus(), _this.selectChoice($(this));
                }), // rewrite labels from original element to focusser
                this.search.attr("id", "s2id_autogen" + nextUid()), this.search.prev().text($("label[for='" + this.opts.element.attr("id") + "']").text()).attr("for", this.search.attr("id")), 
                this.search.on("input paste", this.bind(function() {
                    this.isInterfaceEnabled() && (this.opened() || this.open());
                })), this.search.attr("tabindex", this.elementTabIndex), this.keydowns = 0, this.search.on("keydown", this.bind(function(e) {
                    if (this.isInterfaceEnabled()) {
                        ++this.keydowns;
                        var selected = selection.find(".select2-search-choice-focus"), prev = selected.prev(".select2-search-choice:not(.select2-locked)"), next = selected.next(".select2-search-choice:not(.select2-locked)"), pos = getCursorInfo(this.search);
                        if (selected.length && (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                            var selectedChoice = selected;
                            return e.which == KEY.LEFT && prev.length ? selectedChoice = prev : e.which == KEY.RIGHT ? selectedChoice = next.length ? next : null : e.which === KEY.BACKSPACE ? this.unselect(selected.first()) && (this.search.width(10), 
                            selectedChoice = prev.length ? prev : next) : e.which == KEY.DELETE ? this.unselect(selected.first()) && (this.search.width(10), 
                            selectedChoice = next.length ? next : null) : e.which == KEY.ENTER && (selectedChoice = null), 
                            this.selectChoice(selectedChoice), killEvent(e), void (selectedChoice && selectedChoice.length || this.open());
                        }
                        if ((e.which === KEY.BACKSPACE && 1 == this.keydowns || e.which == KEY.LEFT) && 0 == pos.offset && !pos.length) return this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last()), 
                        void killEvent(e);
                        if (this.selectChoice(null), this.opened()) switch (e.which) {
                          case KEY.UP:
                          case KEY.DOWN:
                            return this.moveHighlight(e.which === KEY.UP ? -1 : 1), void killEvent(e);

                          case KEY.ENTER:
                            return this.selectHighlighted(), void killEvent(e);

                          case KEY.TAB:
                            return this.selectHighlighted({
                                noFocus: !0
                            }), void this.close();

                          case KEY.ESC:
                            return this.cancel(e), void killEvent(e);
                        }
                        if (e.which !== KEY.TAB && !KEY.isControl(e) && !KEY.isFunctionKey(e) && e.which !== KEY.BACKSPACE && e.which !== KEY.ESC) {
                            if (e.which === KEY.ENTER) {
                                if (this.opts.openOnEnter === !1) return;
                                if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
                            }
                            this.open(), (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) && // prevent the page from scrolling
                            killEvent(e), e.which === KEY.ENTER && // prevent form from being submitted
                            killEvent(e);
                        }
                    }
                })), this.search.on("keyup", this.bind(function(e) {
                    this.keydowns = 0, this.resizeSearch();
                })), this.search.on("blur", this.bind(function(e) {
                    this.container.removeClass("select2-container-active"), this.search.removeClass("select2-focused"), 
                    this.selectChoice(null), this.opened() || this.clearSearch(), e.stopImmediatePropagation(), 
                    this.opts.element.trigger($.Event("select2-blur"));
                })), this.container.on("click", selector, this.bind(function(e) {
                    this.isInterfaceEnabled() && ($(e.target).closest(".select2-search-choice").length > 0 || (this.selectChoice(null), 
                    this.clearPlaceholder(), this.container.hasClass("select2-container-active") || this.opts.element.trigger($.Event("select2-focus")), 
                    this.open(), this.focusSearch(), e.preventDefault()));
                })), this.container.on("focus", selector, this.bind(function() {
                    this.isInterfaceEnabled() && (this.container.hasClass("select2-container-active") || this.opts.element.trigger($.Event("select2-focus")), 
                    this.container.addClass("select2-container-active"), this.dropdown.addClass("select2-drop-active"), 
                    this.clearPlaceholder());
                })), this.initContainerWidth(), this.opts.element.addClass("select2-offscreen"), 
                // set the placeholder if necessary
                this.clearSearch();
            },
            // multi
            enableInterface: function() {
                this.parent.enableInterface.apply(this, arguments) && this.search.prop("disabled", !this.isInterfaceEnabled());
            },
            // multi
            initSelection: function() {
                if ("" === this.opts.element.val() && "" === this.opts.element.text() && (this.updateSelection([]), 
                this.close(), // set the placeholder if necessary
                this.clearSearch()), this.select || "" !== this.opts.element.val()) {
                    var self = this;
                    this.opts.initSelection.call(null, this.opts.element, function(data) {
                        data !== undefined && null !== data && (self.updateSelection(data), self.close(), 
                        // set the placeholder if necessary
                        self.clearSearch());
                    });
                }
            },
            // multi
            clearSearch: function() {
                var placeholder = this.getPlaceholder(), maxWidth = this.getMaxSearchWidth();
                placeholder !== undefined && 0 === this.getVal().length && this.search.hasClass("select2-focused") === !1 ? (this.search.val(placeholder).addClass("select2-default"), 
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"))) : this.search.val("").width(10);
            },
            // multi
            clearPlaceholder: function() {
                this.search.hasClass("select2-default") && this.search.val("").removeClass("select2-default");
            },
            // multi
            opening: function() {
                this.clearPlaceholder(), // should be done before super so placeholder is not used to search
                this.resizeSearch(), this.parent.opening.apply(this, arguments), this.focusSearch(), 
                // initializes search's value with nextSearchTerm (if defined by user)
                // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
                "" === this.search.val() && this.nextSearchTerm != undefined && (this.search.val(this.nextSearchTerm), 
                this.search.select()), this.updateResults(!0), this.opts.shouldFocusInput(this) && this.search.focus(), 
                this.opts.element.trigger($.Event("select2-open"));
            },
            // multi
            close: function() {
                this.opened() && this.parent.close.apply(this, arguments);
            },
            // multi
            focus: function() {
                this.close(), this.search.focus();
            },
            // multi
            isFocused: function() {
                return this.search.hasClass("select2-focused");
            },
            // multi
            updateSelection: function(data) {
                var ids = [], filtered = [], self = this;
                // filter out duplicates
                $(data).each(function() {
                    indexOf(self.id(this), ids) < 0 && (ids.push(self.id(this)), filtered.push(this));
                }), data = filtered, this.selection.find(".select2-search-choice").remove(), $(data).each(function() {
                    self.addSelectedChoice(this);
                }), self.postprocessResults();
            },
            // multi
            tokenize: function() {
                var input = this.search.val();
                input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts), 
                null != input && input != undefined && (this.search.val(input), input.length > 0 && this.open());
            },
            // multi
            onSelect: function(data, options) {
                this.triggerSelect(data) && (this.addSelectedChoice(data), this.opts.element.trigger({
                    type: "selected",
                    val: this.id(data),
                    choice: data
                }), // keep track of the search's value before it gets cleared
                this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val()), this.clearSearch(), 
                this.updateResults(), (this.select || !this.opts.closeOnSelect) && this.postprocessResults(data, !1, this.opts.closeOnSelect === !0), 
                this.opts.closeOnSelect ? (this.close(), this.search.width(10)) : this.countSelectableResults() > 0 ? (this.search.width(10), 
                this.resizeSearch(), this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize() ? // if we reached max selection size repaint the results so choices
                // are replaced with the max selection reached message
                this.updateResults(!0) : // initializes search's value with nextSearchTerm and update search result
                this.nextSearchTerm != undefined && (this.search.val(this.nextSearchTerm), this.updateResults(), 
                this.search.select()), this.positionDropdown()) : (// if nothing left to select close
                this.close(), this.search.width(10)), // since its not possible to select an element that has already been
                // added we do not need to check if this is a new element before firing change
                this.triggerChange({
                    added: data
                }), options && options.noFocus || this.focusSearch());
            },
            // multi
            cancel: function() {
                this.close(), this.focusSearch();
            },
            addSelectedChoice: function(data) {
                var formatted, cssClass, enableChoice = !data.locked, enabledItem = $("<li class='select2-search-choice'>    <div></div>    <a href='#' class='select2-search-choice-close' tabindex='-1'></a></li>"), disabledItem = $("<li class='select2-search-choice select2-locked'><div></div></li>"), choice = enableChoice ? enabledItem : disabledItem, id = this.id(data), val = this.getVal();
                formatted = this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup), 
                formatted != undefined && choice.find("div").replaceWith("<div>" + formatted + "</div>"), 
                cssClass = this.opts.formatSelectionCssClass(data, choice.find("div")), cssClass != undefined && choice.addClass(cssClass), 
                enableChoice && choice.find(".select2-search-choice-close").on("mousedown", killEvent).on("click dblclick", this.bind(function(e) {
                    this.isInterfaceEnabled() && (this.unselect($(e.target)), this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"), 
                    killEvent(e), this.close(), this.focusSearch());
                })).on("focus", this.bind(function() {
                    this.isInterfaceEnabled() && (this.container.addClass("select2-container-active"), 
                    this.dropdown.addClass("select2-drop-active"));
                })), choice.data("select2-data", data), choice.insertBefore(this.searchContainer), 
                val.push(id), this.setVal(val);
            },
            // multi
            unselect: function(selected) {
                var data, index, val = this.getVal();
                if (selected = selected.closest(".select2-search-choice"), 0 === selected.length) throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
                if (data = selected.data("select2-data")) {
                    var evt = $.Event("select2-removing");
                    if (evt.val = this.id(data), evt.choice = data, this.opts.element.trigger(evt), 
                    evt.isDefaultPrevented()) return !1;
                    for (;(index = indexOf(this.id(data), val)) >= 0; ) val.splice(index, 1), this.setVal(val), 
                    this.select && this.postprocessResults();
                    return selected.remove(), this.opts.element.trigger({
                        type: "select2-removed",
                        val: this.id(data),
                        choice: data
                    }), this.triggerChange({
                        removed: data
                    }), !0;
                }
            },
            // multi
            postprocessResults: function(data, initial, noHighlightUpdate) {
                var val = this.getVal(), choices = this.results.find(".select2-result"), compound = this.results.find(".select2-result-with-children"), self = this;
                choices.each2(function(i, choice) {
                    var id = self.id(choice.data("select2-data"));
                    indexOf(id, val) >= 0 && (choice.addClass("select2-selected"), // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected"));
                }), compound.each2(function(i, choice) {
                    // hide an optgroup if it doesn't have any selectable children
                    choice.is(".select2-result-selectable") || 0 !== choice.find(".select2-result-selectable:not(.select2-selected)").length || choice.addClass("select2-selected");
                }), -1 == this.highlight() && noHighlightUpdate !== !1 && self.highlight(0), //If all results are chosen render formatNoMatches
                !this.opts.createSearchChoice && !choices.filter(".select2-result:not(.select2-selected)").length > 0 && (!data || data && !data.more && 0 === this.results.find(".select2-no-results").length) && checkFormatter(self.opts.formatNoMatches, "formatNoMatches") && this.results.append("<li class='select2-no-results'>" + evaluate(self.opts.formatNoMatches, self.search.val()) + "</li>");
            },
            // multi
            getMaxSearchWidth: function() {
                return this.selection.width() - getSideBorderPadding(this.search);
            },
            // multi
            resizeSearch: function() {
                var minimumWidth, left, maxWidth, containerLeft, searchWidth, sideBorderPadding = getSideBorderPadding(this.search);
                minimumWidth = measureTextWidth(this.search) + 10, left = this.search.offset().left, 
                maxWidth = this.selection.width(), containerLeft = this.selection.offset().left, 
                searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding, minimumWidth > searchWidth && (searchWidth = maxWidth - sideBorderPadding), 
                40 > searchWidth && (searchWidth = maxWidth - sideBorderPadding), 0 >= searchWidth && (searchWidth = minimumWidth), 
                this.search.width(Math.floor(searchWidth));
            },
            // multi
            getVal: function() {
                var val;
                return this.select ? (val = this.select.val(), null === val ? [] : val) : (val = this.opts.element.val(), 
                splitVal(val, this.opts.separator));
            },
            // multi
            setVal: function(val) {
                var unique;
                this.select ? this.select.val(val) : (unique = [], // filter out duplicates
                $(val).each(function() {
                    indexOf(this, unique) < 0 && unique.push(this);
                }), this.opts.element.val(0 === unique.length ? "" : unique.join(this.opts.separator)));
            },
            // multi
            buildChangeDetails: function(old, current) {
                // remove intersection from each array
                for (var current = current.slice(0), old = old.slice(0), i = 0; i < current.length; i++) for (var j = 0; j < old.length; j++) equal(this.opts.id(current[i]), this.opts.id(old[j])) && (current.splice(i, 1), 
                i > 0 && i--, old.splice(j, 1), j--);
                return {
                    added: current,
                    removed: old
                };
            },
            // multi
            val: function(val, triggerChange) {
                var oldData, self = this;
                if (0 === arguments.length) return this.getVal();
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (oldData = this.data(), oldData.length || (oldData = []), !val && 0 !== val) return this.opts.element.val(""), 
                this.updateSelection([]), this.clearSearch(), void (triggerChange && this.triggerChange({
                    added: this.data(),
                    removed: oldData
                }));
                if (// val is a list of ids
                this.setVal(val), this.select) this.opts.initSelection(this.select, this.bind(this.updateSelection)), 
                triggerChange && this.triggerChange(this.buildChangeDetails(oldData, this.data())); else {
                    if (this.opts.initSelection === undefined) throw new Error("val() cannot be called if initSelection() is not defined");
                    this.opts.initSelection(this.opts.element, function(data) {
                        var ids = $.map(data, self.id);
                        self.setVal(ids), self.updateSelection(data), self.clearSearch(), triggerChange && self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                    });
                }
                this.clearSearch();
            },
            // multi
            onSortStart: function() {
                if (this.select) throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
                // collapse search field into 0 width so its container can be collapsed as well
                this.search.width(0), // hide the container
                this.searchContainer.hide();
            },
            // multi
            onSortEnd: function() {
                var val = [], self = this;
                // show search and move it to the end of the list
                this.searchContainer.show(), // make sure the search container is the last item in the list
                this.searchContainer.appendTo(this.searchContainer.parent()), // since we collapsed the width in dragStarted, we resize it here
                this.resizeSearch(), // update selection
                this.selection.find(".select2-search-choice").each(function() {
                    val.push(self.opts.id($(this).data("select2-data")));
                }), this.setVal(val), this.triggerChange();
            },
            // multi
            data: function(values, triggerChange) {
                var ids, old, self = this;
                return 0 === arguments.length ? this.selection.children(".select2-search-choice").map(function() {
                    return $(this).data("select2-data");
                }).get() : (old = this.data(), values || (values = []), ids = $.map(values, function(e) {
                    return self.opts.id(e);
                }), this.setVal(ids), this.updateSelection(values), this.clearSearch(), triggerChange && this.triggerChange(this.buildChangeDetails(old, this.data())), 
                void 0);
            }
        }), $.fn.select2 = function() {
            var opts, select2, method, value, multiple, args = Array.prototype.slice.call(arguments, 0), allowedMethods = [ "val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search" ], valueMethods = [ "opened", "isFocused", "container", "dropdown" ], propertyMethods = [ "val", "data" ], methodsMap = {
                search: "externalSearch"
            };
            return this.each(function() {
                if (0 === args.length || "object" == typeof args[0]) opts = 0 === args.length ? {} : $.extend({}, args[0]), 
                opts.element = $(this), "select" === opts.element.get(0).tagName.toLowerCase() ? multiple = opts.element.prop("multiple") : (multiple = opts.multiple || !1, 
                "tags" in opts && (opts.multiple = multiple = !0)), select2 = multiple ? new window.Select2["class"].multi() : new window.Select2["class"].single(), 
                select2.init(opts); else {
                    if ("string" != typeof args[0]) throw "Invalid arguments to select2 plugin: " + args;
                    if (indexOf(args[0], allowedMethods) < 0) throw "Unknown method: " + args[0];
                    if (value = undefined, select2 = $(this).data("select2"), select2 === undefined) return;
                    if (method = args[0], "container" === method ? value = select2.container : "dropdown" === method ? value = select2.dropdown : (methodsMap[method] && (method = methodsMap[method]), 
                    value = select2[method].apply(select2, args.slice(1))), indexOf(args[0], valueMethods) >= 0 || indexOf(args[0], propertyMethods) >= 0 && 1 == args.length) return !1;
                }
            }), value === undefined ? this : value;
        }, // plugin defaults, accessible to users
        $.fn.select2.defaults = {
            width: "copy",
            loadMorePadding: 0,
            closeOnSelect: !0,
            openOnEnter: !0,
            containerCss: {},
            dropdownCss: {},
            containerCssClass: "",
            dropdownCssClass: "",
            formatResult: function(result, container, query, escapeMarkup) {
                var markup = [];
                return markMatch(result.text, query.term, markup, escapeMarkup), markup.join("");
            },
            formatSelection: function(data, container, escapeMarkup) {
                return data ? escapeMarkup(data.text) : undefined;
            },
            sortResults: function(results, container, query) {
                return results;
            },
            formatResultCssClass: function(data) {
                return data.css;
            },
            formatSelectionCssClass: function(data, container) {
                return undefined;
            },
            formatMatches: function(matches) {
                return matches + " results are available, use up and down arrow keys to navigate.";
            },
            formatNoMatches: function() {
                return "No matches found";
            },
            formatInputTooShort: function(input, min) {
                var n = min - input.length;
                return "Please enter " + n + " or more character" + (1 == n ? "" : "s");
            },
            formatInputTooLong: function(input, max) {
                var n = input.length - max;
                return "Please delete " + n + " character" + (1 == n ? "" : "s");
            },
            formatSelectionTooBig: function(limit) {
                return "You can only select " + limit + " item" + (1 == limit ? "" : "s");
            },
            formatLoadMore: function(pageNumber) {
                return "Loading more results…";
            },
            formatSearching: function() {
                return "Searching…";
            },
            minimumResultsForSearch: 0,
            minimumInputLength: 0,
            maximumInputLength: null,
            maximumSelectionSize: 0,
            id: function(e) {
                return e == undefined ? null : e.id;
            },
            matcher: function(term, text) {
                return stripDiacritics("" + text).toUpperCase().indexOf(stripDiacritics("" + term).toUpperCase()) >= 0;
            },
            separator: ",",
            tokenSeparators: [],
            tokenizer: defaultTokenizer,
            escapeMarkup: defaultEscapeMarkup,
            blurOnChange: !1,
            selectOnBlur: !1,
            adaptContainerCssClass: function(c) {
                return c;
            },
            adaptDropdownCssClass: function(c) {
                return null;
            },
            nextSearchTerm: function(selectedObject, currentSearchTerm) {
                return undefined;
            },
            searchInputPlaceholder: "",
            createSearchChoicePosition: "top",
            shouldFocusInput: function(instance) {
                // Attempt to detect touch devices
                var supportsTouchEvents = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
                // Only devices which support touch events should be special cased
                // Only devices which support touch events should be special cased
                return supportsTouchEvents && instance.opts.minimumResultsForSearch < 0 ? !1 : !0;
            }
        }, $.fn.select2.ajaxDefaults = {
            transport: $.ajax,
            params: {
                type: "GET",
                cache: !1,
                dataType: "json"
            }
        }, // exports
        window.Select2 = {
            query: {
                ajax: ajax,
                local: local,
                tags: tags
            },
            util: {
                debounce: debounce,
                markMatch: markMatch,
                escapeMarkup: defaultEscapeMarkup,
                stripDiacritics: stripDiacritics
            },
            "class": {
                "abstract": AbstractSelect2,
                single: SingleSelect2,
                multi: MultiSelect2
            }
        };
    }
}(jQuery);;
/*! Facebook-Newsroom - v0.0.1 */
/**
 * @class Placeholder
 *
 * @author Beyond Consultancy <dev@bynd.com>
 * @docauthor Matt Shelley <mshelley@bynd.com>
 * @docauthor Brian Rhode <brian@bynd.com>
 *
 * Placeholder plugin
 */
var FBNR = FBNR || {};

!function($) {
    FBNR.Placeholder = function() {
        return {
            /**
			 * Standard init
			 */
            init: function() {
                var me = this;
                // Check if we need it
                ($("html").hasClass("ie7") || $("html").hasClass("ie8") || $("html").hasClass("ie9")) && (me.addEventListeners(), 
                me._removeForValidation());
            },
            /**
			 * TODO:
			 */
            addEventListeners: function() {
                $("[placeholder]").focus(function() {
                    var input = $(this);
                    input.val() === input.attr("placeholder") && (input.val(""), input.removeClass("placeholder"));
                }).blur(function() {
                    var input = $(this);
                    ("" === input.val() || input.val() === input.attr("placeholder")) && (input.addClass("placeholder"), 
                    input.val(input.attr("placeholder")));
                }).blur();
            },
            /**
			 * TODO:
			 */
            _removeForValidation: function() {
                $("[placeholder]").parents("form").submit(function() {
                    $(this).find("[placeholder]").each(function() {
                        var input = $(this);
                        input.val() === input.attr("placeholder") && input.val("");
                    });
                });
            }
        };
    }(), $(document).ready(function() {
        FBNR.Placeholder.init();
    });
}(jQuery);;
/*!
Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.1.0
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/

(function() {
  var $, AbstractChosen, Chosen, SelectParser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: this.escapeExpression(group.label),
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    SelectParser.prototype.escapeExpression = function(text) {
      var map, unsafe_chars;
      if ((text == null) || text === false) {
        return "";
      }
      if (!/[\&\<\>\"\'\`]/.test(text)) {
        return text;
      }
      map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
      return text.replace(unsafe_chars, function(chr) {
        return map[chr] || "&amp;";
      });
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
    }

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      return this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout((function() {
            return _this.container_mousedown();
          }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container || Modernizr && Modernizr.touch) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, _i, _len, _ref;
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else {
          content += this.result_add_option(data);
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(data.text);
          }
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.style.cssText = option.style;
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.search_text;
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      var group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      group_el = document.createElement("li");
      group_el.className = "group-result";
      group_el.innerHTML = group.search_text;
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function() {
      var result, _i, _len, _ref, _results;
      _ref = this.results_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        if (result.selected) {
          _results.push(result.selected = false);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function() {
      var escapedSearchText, option, regex, regexAnchor, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.get_search_text();
      escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      regexAnchor = this.search_contains ? "" : "^";
      regex = new RegExp(regexAnchor + escapedSearchText, 'i');
      zregex = new RegExp(escapedSearchText, 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option.search_match = false;
        results_group = null;
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          if (!(option.group && !this.group_search)) {
            option.search_text = option.group ? option.label : option.html;
            option.search_match = this.search_string_match(option.search_text, regex);
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (searchText.length) {
                startpos = option.search_text.search(zregex);
                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && searchText.length) {
        this.update_results_content("");
        return this.no_results(searchText);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var part, parts, _i, _len;
      if (regex.test(search_string)) {
        return true;
      } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
        parts = search_string.replace(/\[|\]/g, "").split(" ");
        if (parts.length) {
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            if (regex.test(part)) {
              return true;
            }
          }
        }
      }
    };

    AbstractChosen.prototype.choices_count = function() {
      var option, _i, _len, _ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function(evt) {
      var _this = this;
      return setTimeout((function() {
        return _this.results_search();
      }), 50);
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function(evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function(evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function(evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function(element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.browser_is_supported = function() {
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Android/i.test(window.navigator.userAgent)) {
        if (/Mobile/i.test(window.navigator.userAgent)) {
          return false;
        }
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy' && chosen) {
          chosen.destroy();
        } else if (!chosen) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(_super) {
    __extends(Chosen, _super);

    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'style': "width: " + (this.container_width()) + ";",
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      if (this.is_multiple) {
        this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
      } else {
        this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      this.set_label_behavior();
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.bind('mousedown.chosen', function(evt) {
        _this.container_mousedown(evt);
      });
      this.container.bind('mouseup.chosen', function(evt) {
        _this.container_mouseup(evt);
      });
      this.container.bind('mouseenter.chosen', function(evt) {
        _this.mouse_enter(evt);
      });
      this.container.bind('mouseleave.chosen', function(evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.bind('mouseup.chosen', function(evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.bind('mouseover.chosen', function(evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.bind('mouseout.chosen', function(evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
        _this.search_results_mousewheel(evt);
      });
      this.search_results.bind('touchstart.chosen', function(evt) {
        _this.search_results_touchstart(evt);
      });
      this.search_results.bind('touchmove.chosen', function(evt) {
        _this.search_results_touchmove(evt);
      });
      this.search_results.bind('touchend.chosen', function(evt) {
        _this.search_results_touchend(evt);
      });
      this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("chosen:open.chosen", function(evt) {
        _this.container_mousedown(evt);
      });
      this.form_field_jq.bind("chosen:close.chosen", function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('blur.chosen', function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('keyup.chosen', function(evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.bind('keydown.chosen', function(evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.bind('focus.chosen', function(evt) {
        _this.input_focus(evt);
      });
      this.search_field.bind('cut.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      this.search_field.bind('paste.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.bind('click.chosen', function(evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.bind('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chosen-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus.chosen", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chosen-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus.chosen", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      if (!this.is_disabled) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta;
      if (evt.originalEvent) {
        delta = -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      var active_container;
      active_container = $(evt.target).closest('.chosen-container');
      if (active_container.length && this.container[0] === active_container[0]) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chosen-with-drop");
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      var _this = this;
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.bind('click.chosen', function(evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link,
        _this = this;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + item.html + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.bind('click.chosen', function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(item.text);
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").text(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_text = function() {
      if (this.search_field.val() === this.default_text) {
        return "";
      } else {
        return $('<div/>').text($.trim(this.search_field.val())).html();
      }
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this
      });
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref1;
      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        f_width = this.container.outerWidth();
        if (w > f_width - 10) {
          w = f_width - 10;
        }
        return this.search_field.css({
          'width': w + 'px'
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

}).call(this);
;
/*
 * Scroller Plugin [Formstone Library]
 * @author Ben Plum
 * @version 0.6.4
 *
 * Copyright © 2013 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
 
if(jQuery)(function(d){function p(b){b=d.extend({},g,b||{});for(var a=d(this),c=0,e=a.length;c<e;c++)q(a.eq(c),b);return a}function q(b,a){if(!b.data("scroller")){d.extend(a,b.data("scroller-options"));var c;c='<div class="scroller-bar"><div class="scroller-track"><div class="scroller-handle">';c+="</div></div></div>";a.paddingRight=parseInt(b.css("padding-right"),10);a.paddingBottom=parseInt(b.css("padding-bottom"),10);b.addClass(a.customClass+" scroller").wrapInner('<div class="scroller-content" />').prepend(c); a.horizontal&&b.addClass("scroller-horizontal");a=d.extend({$scroller:b,$content:b.find(".scroller-content"),$bar:b.find(".scroller-bar"),$track:b.find(".scroller-track"),$handle:b.find(".scroller-handle")},a);a.$content.on("scroll.scroller",a,l);a.$scroller.on("mousedown.scroller",".scroller-track",a,r).on("mousedown.scroller",".scroller-handle",a,s).data("scroller",a);h.reset.apply(b,[a]);d(window).one("load",function(){h.reset.apply(b,[a])})}}function l(b){b.preventDefault();b.stopPropagation(); b=b.data;if(!0==b.horizontal){var a=b.$content.scrollLeft();0>a&&(a=0);a/=b.scrollRatio;a>b.handleBounds.right&&(a=b.handleBounds.right);b.$handle.css({left:a})}else a=b.$content.scrollTop(),0>a&&(a=0),a/=b.scrollRatio,a>b.handleBounds.bottom&&(a=b.handleBounds.bottom),b.$handle.css({top:a})}function r(b){b.preventDefault();b.stopPropagation();var a=b.data,c=a.$track.offset();!0==a.horizontal?(a.mouseStart=b.pageX,a.handleLeft=b.pageX-c.left-a.handleWidth/2,k.apply(a.$scroller,[a,a.handleLeft])): (a.mouseStart=b.pageY,a.handleTop=b.pageY-c.top-a.handleHeight/2,k.apply(a.$scroller,[a,a.handleTop]));a.$scroller.data("scroller",a);a.$content.off(".scroller");d("body").on("mousemove.scroller",a,m).on("mouseup.scroller",a,n)}function s(b){b.preventDefault();b.stopPropagation();var a=b.data;!0==a.horizontal?(a.mouseStart=b.pageX,a.handleLeft=parseInt(a.$handle.css("left"),10)):(a.mouseStart=b.pageY,a.handleTop=parseInt(a.$handle.css("top"),10));a.$scroller.data("scroller",a);a.$content.off(".scroller"); d("body").on("mousemove.scroller",a,m).on("mouseup.scroller",a,n)}function m(b){b.preventDefault();b.stopPropagation();var a=b.data,c=0;!0==a.horizontal?(b=a.mouseStart-b.pageX,c=a.handleLeft-b):(b=a.mouseStart-b.pageY,c=a.handleTop-b);k.apply(a.$scroller,[a,c])}function n(b){b.preventDefault();b.stopPropagation();b=b.data;b.$content.on("scroll.scroller",b,l);d("body").off(".scroller")}function k(b,a){if(!0==b.horizontal){a<b.handleBounds.left&&(a=b.handleBounds.left);a>b.handleBounds.right&&(a=b.handleBounds.right); var c=Math.round(a*b.scrollRatio);b.$handle.css({left:a});b.$content.scrollLeft(c)}else a<b.handleBounds.top&&(a=b.handleBounds.top),a>b.handleBounds.bottom&&(a=b.handleBounds.bottom),c=Math.round(a*b.scrollRatio),b.$handle.css({top:a}),b.$content.scrollTop(c)}var g={customClass:"",duration:0,handleSize:!1,horizontal:!1,trackMargin:0},h={defaults:function(b){g=d.extend(g,b||{});return d(this)},destroy:function(){return d(this).each(function(b){if(b=d(this).data("scroller"))b.$scroller.removeClass(b.customClass).removeClass("scroller").removeClass("scroller-active"), b.$content.replaceWith(b.$content.html()),b.$bar.remove(),b.$content.off(".scroller"),b.$scroller.off(".scroller").removeData("scroller")})},scroll:function(b,a){return d(this).each(function(a){a=d(this).data("scroller");var e=e||g.duration;if("number"!=typeof b){var f=d(b);0<f.length?(f=f.position(),b=!0==a.horizontal?f.left+a.$content.scrollLeft():f.top+a.$content.scrollTop()):b=a.$content.scrollTop()}!0==a.horizontal?a.$content.stop().animate({scrollLeft:b},e):a.$content.stop().animate({scrollTop:b}, e)})},reset:function(b){return d(this).each(function(a){a=b||d(this).data("scroller");if("undefined"!=typeof a){a.$scroller.addClass("scroller-setup");if(!0==a.horizontal)a.barHeight=a.$content[0].offsetHeight-a.$content[0].clientHeight,a.frameWidth=a.$content.outerWidth(),a.trackWidth=a.frameWidth-2*a.trackMargin,a.scrollWidth=a.$content[0].scrollWidth,a.ratio=a.trackWidth/a.scrollWidth,a.trackRatio=a.trackWidth/a.scrollWidth,a.handleWidth=a.handleSize?a.handleSize:a.trackWidth*a.trackRatio,a.scrollRatio= (a.scrollWidth-a.frameWidth)/(a.trackWidth-a.handleWidth),a.handleBounds={left:0,right:a.trackWidth-a.handleWidth},a.$scroller.data("scroller",a),a.$content.css({paddingBottom:a.barHeight+a.paddingBottom}),a.$content.scrollLeft(),a.scrollWidth<=a.frameWidth?a.$scroller.removeClass("scroller-active"):a.$scroller.addClass("scroller-active"),a.$bar.css({width:a.frameWidth}),a.$track.css({width:a.trackWidth,marginLeft:a.trackMargin,marginRight:a.trackMargin}),a.$handle.css({width:a.handleWidth});else{a.barWidth= a.$content[0].offsetWidth-a.$content[0].clientWidth;a.frameHeight=a.$content.outerHeight();a.trackHeight=a.frameHeight-2*a.trackMargin;a.scrollHeight=a.$content[0].scrollHeight;a.ratio=a.trackHeight/a.scrollHeight;a.trackRatio=a.trackHeight/a.scrollHeight;a.handleHeight=a.handleSize?a.handleSize:a.trackHeight*a.trackRatio;a.scrollRatio=(a.scrollHeight-a.frameHeight)/(a.trackHeight-a.handleHeight);a.handleBounds={top:0,bottom:a.trackHeight-a.handleHeight};a.$scroller.data("scroller",a);var c=a.$content.scrollTop()* a.ratio;a.scrollHeight<=a.frameHeight?a.$scroller.removeClass("scroller-active"):a.$scroller.addClass("scroller-active");a.$bar.css({height:a.frameHeight});a.$track.css({height:a.trackHeight,marginBottom:a.trackMargin,marginTop:a.trackMargin});a.$handle.css({height:a.handleHeight})}k.apply(a.$scroller,[a,c]);a.$scroller.removeClass("scroller-setup")}})}};d.fn.scroller=function(b){return h[b]?h[b].apply(this,Array.prototype.slice.call(arguments,1)):"object"!==typeof b&&b?this:p.apply(this,arguments)}})(jQuery);;
/*! Facebook-Newsroom - v0.0.1 */
/**
 * Global Newsroom JavaScript
 */
!function($) {
    function getAndroidVersion(ua) {
        ua = ua || navigator.userAgent;
        var match = ua.match(/Android\s([0-9\.]*)/);
        return match ? match[1] : !1;
    }
    /**
	 * Responsive helper / debug info.  Triggered by adding ?responsive_helper to URL.
	 */
    if ($(function() {
        function disableScroll(ev) {
            ev.preventDefault();
        }
        // reposition like box (required if there is content above the primary header)
        // like the language notice.
        function positionLikeButton() {
            // must use arbitrary number here since page can be loaded at any width
            // if loaded at mobile width, like button will be position (static) in footer
            var newsroom_like_top = 20, $header_primary = $("#header-primary"), $newsroom_like = $("#newsroom-like");
            $newsroom_like.css({
                top: newsroom_like_top + $header_primary.offset().top
            });
        }
        function hideChosenMenu() {
            $chosen_select.trigger("chosen:close.chosen"), $("body").unbind("click", hideChosenMenu);
        }
        var $menu_toggle = $("#primary-menu-toggle"), $menu = $("#header-2");
        $menu.height();
        /**
		 * Show/hide responsive menu.  Note: we temporarily disable the "touchmove" event because
		 * there is a bug if the menu is triggered and the page is scrolled at the same time.
		 * See FN-251
		 */
        $menu_toggle.on("click", function() {
            var $this = $(this);
            $(document).bind("touchmove", disableScroll), $this.is(".open") && !$menu.is(":animated") ? ($menu.slideUp("slow", function() {
                $(document).unbind("touchmove", disableScroll);
            }), $this.removeClass("open")) : ($menu.slideDown("slow", function() {
                $(document).unbind("touchmove", disableScroll);
            }), $this.addClass("open"));
        }), $(window).resize(positionLikeButton), positionLikeButton();
        //console.log($newsroom_like.position().top + $header_primary.offset().top);
        //$('#newsroom-like');
        /**
		 * Set up Chosen and make sure the dialog closes if touching elsewhere.
		 */
        var $chosen_select = $(".chosen-select");
        $chosen_select.chosen({
            disable_search_threshold: 20
        }), Modernizr && Modernizr.touch && $chosen_select.on("chosen:showing_dropdown", function() {
            $("body").bind("click", hideChosenMenu);
        });
        // Blur the search bar on resize.  On tablet orientation change,
        // if on search, the keyboard can remain open. FN-216
        //Need to conditionally load menu if search bar is active... ?
        var $search_text = $("#search");
        $(window).on("resize", function() {
            $search_text.is(":visible") || $search_text.blur();
        });
        var androidVersion = getAndroidVersion();
        // Don't initialize for android 4 or less.
        (!androidVersion || parseInt(androidVersion) > 4) && $(".select2").select2({
            minimumResultsForSearch: -1
        }), $(".select2").on("change", function() {
            //alert( $(this).val() );
            var href = $(this).val();
            window.location = href;
        }), // prevents keyboard from popping up on iOS when select is touched
        $(".select2 input").prop("readonly", !0), // Localization notice close button
        $(".page-notice .close").on("click", function() {
            $(this).parents(".page-notice").hide(), positionLikeButton();
        });
    }), /**
	 * Select box navigation that is shown on News page for mobile
	 */
    $(".responsive-nav select").on("change", function() {
        var $this = $(this), href = $this.find("option:selected").attr("value");
        href && (window.location = href);
    }), $("#responsive").length) {
        var $responsive_dimensions = $("#responsive-dimensions"), w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0), h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        $responsive_dimensions.html(w + " x " + h), $(window).on("resize", function() {
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0), h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            $responsive_dimensions.html(w + " x " + h);
        });
    }
}(jQuery), function($) {
    jQuery.fn.autoResizeFbPost = function() {
        var fixWidth = function($container, $clonedContainer, doParse) {
            // should we call FB.XFBML.parse? we don't want to do this at page load because it will happen automatically
            doParse = "undefined" == typeof doParse ? !0 : doParse;
            var updatedWidth = $container.width();
            // update all div.fb-post with correct width of container
            $clonedContainer.find("div.fb-post").each(function() {
                $(this).attr("data-width", updatedWidth);
            }), // update all fb:post with correct width
            $clonedContainer.find("fb\\:post").each(function() {
                $(this).attr("width", updatedWidth);
            }), // update page with adjusted markup
            $container.html($clonedContainer.html()), doParse && FB && FB.XFBML && FB.XFBML.parse && FB.XFBML.parse();
        };
        return this.each(function() {
            var $container = $(this), $clonedContainer = $container.clone();
            // make sure there is a .fb-post element before we set up event handlers
            if (!$container.find("div.fb-post").length) return !1;
            // execute once (document.ready) and do not call FB.XFBML.parse()
            fixWidth($container, $clonedContainer, !1);
        });
    }, jQuery(function() {
        $(".post-content").autoResizeFbPost();
    });
}(jQuery);;
/*! Facebook-Newsroom - v0.0.1 */
/**
 * @class Analytics
 *
 * @author Beyond Consultancy <dev@bynd.com>
 * @docauthor Matt Shelley <mshelley@bynd.com>
 * @docauthor Brian Rhode <brian@bynd.com>
 *
 * Custom tracking via Google Analytics
 */
var Analytics = function() {};

!function($) {
    Analytics.prototype = {
        config: {
            default_account: "UA-47542077-1",
            default_class: ".ga",
            default_event: "click"
        },
        /**
		 * Kick things off
		 */
        init: function() {
            var me = this;
            return me.addListeners(), me;
        },
        /**
		 * addListeners :: Add our event listeners
		 */
        addListeners: function() {
            var me = this, trackableItems = $(me.config.default_class), itemCount = trackableItems.size(), i = 0;
            /**
			 * @event {Event}
			 * Gather all of our elements that have our tracking class on it
			 * and track the event based on the data-attributes
			 */
            for (i; itemCount > i; i++) {
                var eventItem = trackableItems[i];
                eventItem.addEventListener("click", me.trackEvent, !1);
            }
        },
        /**
		 * We have clicked an item which we would like to track, lets pull off the necessary
		 * data-attributes or use defaults and track a custom event
		 *
		 * @param {Event} e
		 */
        trackEvent: function(e) {
            var currentTarget = e.target, target = (currentTarget.nodeName.toLowerCase(), $(e.target)), thisEvent = {
                method: "send",
                type: "event",
                category: target.attr("data-ga-category") || "default_category",
                action: target.attr("data-ga-action") || "default_action",
                label: target.attr("data-ga-label") || null,
                opt_value: target.attr("data-ga-value") || null
            };
            try {
                // var thisEvent = ;
                ga(thisEvent.method, thisEvent.type, thisEvent.category, thisEvent.action, thisEvent.label, thisEvent.opt_value), 
                console.log("Event successfully tracked: ", thisEvent);
            } catch (error) {
                console.error("Failed to track event: ", error);
            }
        }
    }, $(document).ready(function() {
        var analytics = new Analytics();
        analytics.init();
    });
}(jQuery);;
/*! Facebook-Newsroom - v0.0.1 */
/*! jQuery UI - v1.10.4 - 2014-04-18
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.tooltip.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */
!function(e, t) {
    function i(t, i) {
        var s, a, o, r = t.nodeName.toLowerCase();
        return "area" === r ? (s = t.parentNode, a = s.name, t.href && a && "map" === s.nodeName.toLowerCase() ? (o = e("img[usemap=#" + a + "]")[0], 
        !!o && n(o)) : !1) : (/input|select|textarea|button|object/.test(r) ? !t.disabled : "a" === r ? t.href || i : i) && n(t);
    }
    function n(t) {
        return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function() {
            return "hidden" === e.css(this, "visibility");
        }).length;
    }
    var s = 0, a = /^ui-id-\d+$/;
    e.ui = e.ui || {}, e.extend(e.ui, {
        version: "1.10.4",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    }), e.fn.extend({
        focus: function(t) {
            return function(i, n) {
                return "number" == typeof i ? this.each(function() {
                    var t = this;
                    setTimeout(function() {
                        e(t).focus(), n && n.call(t);
                    }, i);
                }) : t.apply(this, arguments);
            };
        }(e.fn.focus),
        scrollParent: function() {
            var t;
            return t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"));
            }).eq(0) : this.parents().filter(function() {
                return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"));
            }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t;
        },
        zIndex: function(i) {
            if (i !== t) return this.css("zIndex", i);
            if (this.length) for (var n, s, a = e(this[0]); a.length && a[0] !== document; ) {
                if (n = a.css("position"), ("absolute" === n || "relative" === n || "fixed" === n) && (s = parseInt(a.css("zIndex"), 10), 
                !isNaN(s) && 0 !== s)) return s;
                a = a.parent();
            }
            return 0;
        },
        uniqueId: function() {
            return this.each(function() {
                this.id || (this.id = "ui-id-" + ++s);
            });
        },
        removeUniqueId: function() {
            return this.each(function() {
                a.test(this.id) && e(this).removeAttr("id");
            });
        }
    }), e.extend(e.expr[":"], {
        data: e.expr.createPseudo ? e.expr.createPseudo(function(t) {
            return function(i) {
                return !!e.data(i, t);
            };
        }) : function(t, i, n) {
            return !!e.data(t, n[3]);
        },
        focusable: function(t) {
            return i(t, !isNaN(e.attr(t, "tabindex")));
        },
        tabbable: function(t) {
            var n = e.attr(t, "tabindex"), s = isNaN(n);
            return (s || n >= 0) && i(t, !s);
        }
    }), e("<a>").outerWidth(1).jquery || e.each([ "Width", "Height" ], function(i, n) {
        function s(t, i, n, s) {
            return e.each(a, function() {
                i -= parseFloat(e.css(t, "padding" + this)) || 0, n && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0), 
                s && (i -= parseFloat(e.css(t, "margin" + this)) || 0);
            }), i;
        }
        var a = "Width" === n ? [ "Left", "Right" ] : [ "Top", "Bottom" ], o = n.toLowerCase(), r = {
            innerWidth: e.fn.innerWidth,
            innerHeight: e.fn.innerHeight,
            outerWidth: e.fn.outerWidth,
            outerHeight: e.fn.outerHeight
        };
        e.fn["inner" + n] = function(i) {
            return i === t ? r["inner" + n].call(this) : this.each(function() {
                e(this).css(o, s(this, i) + "px");
            });
        }, e.fn["outer" + n] = function(t, i) {
            return "number" != typeof t ? r["outer" + n].call(this, t) : this.each(function() {
                e(this).css(o, s(this, t, !0, i) + "px");
            });
        };
    }), e.fn.addBack || (e.fn.addBack = function(e) {
        return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function(t) {
        return function(i) {
            return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this);
        };
    }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), 
    e.support.selectstart = "onselectstart" in document.createElement("div"), e.fn.extend({
        disableSelection: function() {
            return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(e) {
                e.preventDefault();
            });
        },
        enableSelection: function() {
            return this.unbind(".ui-disableSelection");
        }
    }), e.extend(e.ui, {
        plugin: {
            add: function(t, i, n) {
                var s, a = e.ui[t].prototype;
                for (s in n) a.plugins[s] = a.plugins[s] || [], a.plugins[s].push([ i, n[s] ]);
            },
            call: function(e, t, i) {
                var n, s = e.plugins[t];
                if (s && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType) for (n = 0; s.length > n; n++) e.options[s[n][0]] && s[n][1].apply(e.element, i);
            }
        },
        hasScroll: function(t, i) {
            if ("hidden" === e(t).css("overflow")) return !1;
            var n = i && "left" === i ? "scrollLeft" : "scrollTop", s = !1;
            return t[n] > 0 ? !0 : (t[n] = 1, s = t[n] > 0, t[n] = 0, s);
        }
    });
}(jQuery), function(t, e) {
    var i = 0, s = Array.prototype.slice, n = t.cleanData;
    t.cleanData = function(e) {
        for (var i, s = 0; null != (i = e[s]); s++) try {
            t(i).triggerHandler("remove");
        } catch (o) {}
        n(e);
    }, t.widget = function(i, s, n) {
        var o, a, r, h, l = {}, c = i.split(".")[0];
        i = i.split(".")[1], o = c + "-" + i, n || (n = s, s = t.Widget), t.expr[":"][o.toLowerCase()] = function(e) {
            return !!t.data(e, o);
        }, t[c] = t[c] || {}, a = t[c][i], r = t[c][i] = function(t, i) {
            return this._createWidget ? (arguments.length && this._createWidget(t, i), e) : new r(t, i);
        }, t.extend(r, a, {
            version: n.version,
            _proto: t.extend({}, n),
            _childConstructors: []
        }), h = new s(), h.options = t.widget.extend({}, h.options), t.each(n, function(i, n) {
            return t.isFunction(n) ? (l[i] = function() {
                var t = function() {
                    return s.prototype[i].apply(this, arguments);
                }, e = function(t) {
                    return s.prototype[i].apply(this, t);
                };
                return function() {
                    var i, s = this._super, o = this._superApply;
                    return this._super = t, this._superApply = e, i = n.apply(this, arguments), this._super = s, 
                    this._superApply = o, i;
                };
            }(), e) : (l[i] = n, e);
        }), r.prototype = t.widget.extend(h, {
            widgetEventPrefix: a ? h.widgetEventPrefix || i : i
        }, l, {
            constructor: r,
            namespace: c,
            widgetName: i,
            widgetFullName: o
        }), a ? (t.each(a._childConstructors, function(e, i) {
            var s = i.prototype;
            t.widget(s.namespace + "." + s.widgetName, r, i._proto);
        }), delete a._childConstructors) : s._childConstructors.push(r), t.widget.bridge(i, r);
    }, t.widget.extend = function(i) {
        for (var n, o, a = s.call(arguments, 1), r = 0, h = a.length; h > r; r++) for (n in a[r]) o = a[r][n], 
        a[r].hasOwnProperty(n) && o !== e && (i[n] = t.isPlainObject(o) ? t.isPlainObject(i[n]) ? t.widget.extend({}, i[n], o) : t.widget.extend({}, o) : o);
        return i;
    }, t.widget.bridge = function(i, n) {
        var o = n.prototype.widgetFullName || i;
        t.fn[i] = function(a) {
            var r = "string" == typeof a, h = s.call(arguments, 1), l = this;
            return a = !r && h.length ? t.widget.extend.apply(null, [ a ].concat(h)) : a, r ? this.each(function() {
                var s, n = t.data(this, o);
                return n ? t.isFunction(n[a]) && "_" !== a.charAt(0) ? (s = n[a].apply(n, h), s !== n && s !== e ? (l = s && s.jquery ? l.pushStack(s.get()) : s, 
                !1) : e) : t.error("no such method '" + a + "' for " + i + " widget instance") : t.error("cannot call methods on " + i + " prior to initialization; attempted to call method '" + a + "'");
            }) : this.each(function() {
                var e = t.data(this, o);
                e ? e.option(a || {})._init() : t.data(this, o, new n(a, this));
            }), l;
        };
    }, t.Widget = function() {}, t.Widget._childConstructors = [], t.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: !1,
            create: null
        },
        _createWidget: function(e, s) {
            s = t(s || this.defaultElement || this)[0], this.element = t(s), this.uuid = i++, 
            this.eventNamespace = "." + this.widgetName + this.uuid, this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), 
            this.bindings = t(), this.hoverable = t(), this.focusable = t(), s !== this && (t.data(s, this.widgetFullName, this), 
            this._on(!0, this.element, {
                remove: function(t) {
                    t.target === s && this.destroy();
                }
            }), this.document = t(s.style ? s.ownerDocument : s.document || s), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), 
            this._create(), this._trigger("create", null, this._getCreateEventData()), this._init();
        },
        _getCreateOptions: t.noop,
        _getCreateEventData: t.noop,
        _create: t.noop,
        _init: t.noop,
        destroy: function() {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), 
            this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), 
            this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), 
            this.focusable.removeClass("ui-state-focus");
        },
        _destroy: t.noop,
        widget: function() {
            return this.element;
        },
        option: function(i, s) {
            var n, o, a, r = i;
            if (0 === arguments.length) return t.widget.extend({}, this.options);
            if ("string" == typeof i) if (r = {}, n = i.split("."), i = n.shift(), n.length) {
                for (o = r[i] = t.widget.extend({}, this.options[i]), a = 0; n.length - 1 > a; a++) o[n[a]] = o[n[a]] || {}, 
                o = o[n[a]];
                if (i = n.pop(), 1 === arguments.length) return o[i] === e ? null : o[i];
                o[i] = s;
            } else {
                if (1 === arguments.length) return this.options[i] === e ? null : this.options[i];
                r[i] = s;
            }
            return this._setOptions(r), this;
        },
        _setOptions: function(t) {
            var e;
            for (e in t) this._setOption(e, t[e]);
            return this;
        },
        _setOption: function(t, e) {
            return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!e).attr("aria-disabled", e), 
            this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), 
            this;
        },
        enable: function() {
            return this._setOption("disabled", !1);
        },
        disable: function() {
            return this._setOption("disabled", !0);
        },
        _on: function(i, s, n) {
            var o, a = this;
            "boolean" != typeof i && (n = s, s = i, i = !1), n ? (s = o = t(s), this.bindings = this.bindings.add(s)) : (n = s, 
            s = this.element, o = this.widget()), t.each(n, function(n, r) {
                function h() {
                    return i || a.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof r ? a[r] : r).apply(a, arguments) : e;
                }
                "string" != typeof r && (h.guid = r.guid = r.guid || h.guid || t.guid++);
                var l = n.match(/^(\w+)\s*(.*)$/), c = l[1] + a.eventNamespace, u = l[2];
                u ? o.delegate(u, c, h) : s.bind(c, h);
            });
        },
        _off: function(t, e) {
            e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, 
            t.unbind(e).undelegate(e);
        },
        _delay: function(t, e) {
            function i() {
                return ("string" == typeof t ? s[t] : t).apply(s, arguments);
            }
            var s = this;
            return setTimeout(i, e || 0);
        },
        _hoverable: function(e) {
            this.hoverable = this.hoverable.add(e), this._on(e, {
                mouseenter: function(e) {
                    t(e.currentTarget).addClass("ui-state-hover");
                },
                mouseleave: function(e) {
                    t(e.currentTarget).removeClass("ui-state-hover");
                }
            });
        },
        _focusable: function(e) {
            this.focusable = this.focusable.add(e), this._on(e, {
                focusin: function(e) {
                    t(e.currentTarget).addClass("ui-state-focus");
                },
                focusout: function(e) {
                    t(e.currentTarget).removeClass("ui-state-focus");
                }
            });
        },
        _trigger: function(e, i, s) {
            var n, o, a = this.options[e];
            if (s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), 
            i.target = this.element[0], o = i.originalEvent) for (n in o) n in i || (i[n] = o[n]);
            return this.element.trigger(i, s), !(t.isFunction(a) && a.apply(this.element[0], [ i ].concat(s)) === !1 || i.isDefaultPrevented());
        }
    }, t.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(e, i) {
        t.Widget.prototype["_" + e] = function(s, n, o) {
            "string" == typeof n && (n = {
                effect: n
            });
            var a, r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : e;
            n = n || {}, "number" == typeof n && (n = {
                duration: n
            }), a = !t.isEmptyObject(n), n.complete = o, n.delay && s.delay(n.delay), a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue(function(i) {
                t(this)[e](), o && o.call(s[0]), i();
            });
        };
    });
}(jQuery), function(t) {
    var e = !1;
    t(document).mouseup(function() {
        e = !1;
    }), t.widget("ui.mouse", {
        version: "1.10.4",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var e = this;
            this.element.bind("mousedown." + this.widgetName, function(t) {
                return e._mouseDown(t);
            }).bind("click." + this.widgetName, function(i) {
                return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), 
                i.stopImmediatePropagation(), !1) : void 0;
            }), this.started = !1;
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
        },
        _mouseDown: function(i) {
            if (!e) {
                this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i;
                var s = this, n = 1 === i.which, a = "string" == typeof this.options.cancel && i.target.nodeName ? t(i.target).closest(this.options.cancel).length : !1;
                return n && !a && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, 
                this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    s.mouseDelayMet = !0;
                }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, 
                !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === t.data(i.target, this.widgetName + ".preventClickEvent") && t.removeData(i.target, this.widgetName + ".preventClickEvent"), 
                this._mouseMoveDelegate = function(t) {
                    return s._mouseMove(t);
                }, this._mouseUpDelegate = function(t) {
                    return s._mouseUp(t);
                }, t(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), 
                i.preventDefault(), e = !0, !0)) : !0;
            }
        },
        _mouseMove: function(e) {
            return t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button ? this._mouseUp(e) : this._mouseStarted ? (this._mouseDrag(e), 
            e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, 
            this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted);
        },
        _mouseUp: function(e) {
            return t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), 
            this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), 
            this._mouseStop(e)), !1;
        },
        _mouseDistanceMet: function(t) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance;
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet;
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0;
        }
    });
}(jQuery), function(t, e) {
    function i(t, e, i) {
        return [ parseFloat(t[0]) * (p.test(t[0]) ? e / 100 : 1), parseFloat(t[1]) * (p.test(t[1]) ? i / 100 : 1) ];
    }
    function s(e, i) {
        return parseInt(t.css(e, i), 10) || 0;
    }
    function n(e) {
        var i = e[0];
        return 9 === i.nodeType ? {
            width: e.width(),
            height: e.height(),
            offset: {
                top: 0,
                left: 0
            }
        } : t.isWindow(i) ? {
            width: e.width(),
            height: e.height(),
            offset: {
                top: e.scrollTop(),
                left: e.scrollLeft()
            }
        } : i.preventDefault ? {
            width: 0,
            height: 0,
            offset: {
                top: i.pageY,
                left: i.pageX
            }
        } : {
            width: e.outerWidth(),
            height: e.outerHeight(),
            offset: e.offset()
        };
    }
    t.ui = t.ui || {};
    var a, o = Math.max, r = Math.abs, l = Math.round, h = /left|center|right/, c = /top|center|bottom/, u = /[\+\-]\d+(\.[\d]+)?%?/, d = /^\w+/, p = /%$/, f = t.fn.position;
    t.position = {
        scrollbarWidth: function() {
            if (a !== e) return a;
            var i, s, n = t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"), o = n.children()[0];
            return t("body").append(n), i = o.offsetWidth, n.css("overflow", "scroll"), s = o.offsetWidth, 
            i === s && (s = n[0].clientWidth), n.remove(), a = i - s;
        },
        getScrollInfo: function(e) {
            var i = e.isWindow || e.isDocument ? "" : e.element.css("overflow-x"), s = e.isWindow || e.isDocument ? "" : e.element.css("overflow-y"), n = "scroll" === i || "auto" === i && e.width < e.element[0].scrollWidth, a = "scroll" === s || "auto" === s && e.height < e.element[0].scrollHeight;
            return {
                width: a ? t.position.scrollbarWidth() : 0,
                height: n ? t.position.scrollbarWidth() : 0
            };
        },
        getWithinInfo: function(e) {
            var i = t(e || window), s = t.isWindow(i[0]), n = !!i[0] && 9 === i[0].nodeType;
            return {
                element: i,
                isWindow: s,
                isDocument: n,
                offset: i.offset() || {
                    left: 0,
                    top: 0
                },
                scrollLeft: i.scrollLeft(),
                scrollTop: i.scrollTop(),
                width: s ? i.width() : i.outerWidth(),
                height: s ? i.height() : i.outerHeight()
            };
        }
    }, t.fn.position = function(e) {
        if (!e || !e.of) return f.apply(this, arguments);
        e = t.extend({}, e);
        var a, p, g, m, v, _, b = t(e.of), y = t.position.getWithinInfo(e.within), k = t.position.getScrollInfo(y), w = (e.collision || "flip").split(" "), D = {};
        return _ = n(b), b[0].preventDefault && (e.at = "left top"), p = _.width, g = _.height, 
        m = _.offset, v = t.extend({}, m), t.each([ "my", "at" ], function() {
            var t, i, s = (e[this] || "").split(" ");
            1 === s.length && (s = h.test(s[0]) ? s.concat([ "center" ]) : c.test(s[0]) ? [ "center" ].concat(s) : [ "center", "center" ]), 
            s[0] = h.test(s[0]) ? s[0] : "center", s[1] = c.test(s[1]) ? s[1] : "center", t = u.exec(s[0]), 
            i = u.exec(s[1]), D[this] = [ t ? t[0] : 0, i ? i[0] : 0 ], e[this] = [ d.exec(s[0])[0], d.exec(s[1])[0] ];
        }), 1 === w.length && (w[1] = w[0]), "right" === e.at[0] ? v.left += p : "center" === e.at[0] && (v.left += p / 2), 
        "bottom" === e.at[1] ? v.top += g : "center" === e.at[1] && (v.top += g / 2), a = i(D.at, p, g), 
        v.left += a[0], v.top += a[1], this.each(function() {
            var n, h, c = t(this), u = c.outerWidth(), d = c.outerHeight(), f = s(this, "marginLeft"), _ = s(this, "marginTop"), x = u + f + s(this, "marginRight") + k.width, C = d + _ + s(this, "marginBottom") + k.height, M = t.extend({}, v), T = i(D.my, c.outerWidth(), c.outerHeight());
            "right" === e.my[0] ? M.left -= u : "center" === e.my[0] && (M.left -= u / 2), "bottom" === e.my[1] ? M.top -= d : "center" === e.my[1] && (M.top -= d / 2), 
            M.left += T[0], M.top += T[1], t.support.offsetFractions || (M.left = l(M.left), 
            M.top = l(M.top)), n = {
                marginLeft: f,
                marginTop: _
            }, t.each([ "left", "top" ], function(i, s) {
                t.ui.position[w[i]] && t.ui.position[w[i]][s](M, {
                    targetWidth: p,
                    targetHeight: g,
                    elemWidth: u,
                    elemHeight: d,
                    collisionPosition: n,
                    collisionWidth: x,
                    collisionHeight: C,
                    offset: [ a[0] + T[0], a[1] + T[1] ],
                    my: e.my,
                    at: e.at,
                    within: y,
                    elem: c
                });
            }), e.using && (h = function(t) {
                var i = m.left - M.left, s = i + p - u, n = m.top - M.top, a = n + g - d, l = {
                    target: {
                        element: b,
                        left: m.left,
                        top: m.top,
                        width: p,
                        height: g
                    },
                    element: {
                        element: c,
                        left: M.left,
                        top: M.top,
                        width: u,
                        height: d
                    },
                    horizontal: 0 > s ? "left" : i > 0 ? "right" : "center",
                    vertical: 0 > a ? "top" : n > 0 ? "bottom" : "middle"
                };
                u > p && p > r(i + s) && (l.horizontal = "center"), d > g && g > r(n + a) && (l.vertical = "middle"), 
                l.important = o(r(i), r(s)) > o(r(n), r(a)) ? "horizontal" : "vertical", e.using.call(this, t, l);
            }), c.offset(t.extend(M, {
                using: h
            }));
        });
    }, t.ui.position = {
        fit: {
            left: function(t, e) {
                var i, s = e.within, n = s.isWindow ? s.scrollLeft : s.offset.left, a = s.width, r = t.left - e.collisionPosition.marginLeft, l = n - r, h = r + e.collisionWidth - a - n;
                e.collisionWidth > a ? l > 0 && 0 >= h ? (i = t.left + l + e.collisionWidth - a - n, 
                t.left += l - i) : t.left = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionWidth : n : l > 0 ? t.left += l : h > 0 ? t.left -= h : t.left = o(t.left - r, t.left);
            },
            top: function(t, e) {
                var i, s = e.within, n = s.isWindow ? s.scrollTop : s.offset.top, a = e.within.height, r = t.top - e.collisionPosition.marginTop, l = n - r, h = r + e.collisionHeight - a - n;
                e.collisionHeight > a ? l > 0 && 0 >= h ? (i = t.top + l + e.collisionHeight - a - n, 
                t.top += l - i) : t.top = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionHeight : n : l > 0 ? t.top += l : h > 0 ? t.top -= h : t.top = o(t.top - r, t.top);
            }
        },
        flip: {
            left: function(t, e) {
                var i, s, n = e.within, a = n.offset.left + n.scrollLeft, o = n.width, l = n.isWindow ? n.scrollLeft : n.offset.left, h = t.left - e.collisionPosition.marginLeft, c = h - l, u = h + e.collisionWidth - o - l, d = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0, p = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0] ? -e.targetWidth : 0, f = -2 * e.offset[0];
                0 > c ? (i = t.left + d + p + f + e.collisionWidth - o - a, (0 > i || r(c) > i) && (t.left += d + p + f)) : u > 0 && (s = t.left - e.collisionPosition.marginLeft + d + p + f - l, 
                (s > 0 || u > r(s)) && (t.left += d + p + f));
            },
            top: function(t, e) {
                var i, s, n = e.within, a = n.offset.top + n.scrollTop, o = n.height, l = n.isWindow ? n.scrollTop : n.offset.top, h = t.top - e.collisionPosition.marginTop, c = h - l, u = h + e.collisionHeight - o - l, d = "top" === e.my[1], p = d ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0, f = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1] ? -e.targetHeight : 0, g = -2 * e.offset[1];
                0 > c ? (s = t.top + p + f + g + e.collisionHeight - o - a, t.top + p + f + g > c && (0 > s || r(c) > s) && (t.top += p + f + g)) : u > 0 && (i = t.top - e.collisionPosition.marginTop + p + f + g - l, 
                t.top + p + f + g > u && (i > 0 || u > r(i)) && (t.top += p + f + g));
            }
        },
        flipfit: {
            left: function() {
                t.ui.position.flip.left.apply(this, arguments), t.ui.position.fit.left.apply(this, arguments);
            },
            top: function() {
                t.ui.position.flip.top.apply(this, arguments), t.ui.position.fit.top.apply(this, arguments);
            }
        }
    }, function() {
        var e, i, s, n, a, o = document.getElementsByTagName("body")[0], r = document.createElement("div");
        e = document.createElement(o ? "div" : "body"), s = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        }, o && t.extend(s, {
            position: "absolute",
            left: "-1000px",
            top: "-1000px"
        });
        for (a in s) e.style[a] = s[a];
        e.appendChild(r), i = o || document.documentElement, i.insertBefore(e, i.firstChild), 
        r.style.cssText = "position: absolute; left: 10.7432222px;", n = t(r).offset().left, 
        t.support.offsetFractions = n > 10 && 11 > n, e.innerHTML = "", i.removeChild(e);
    }();
}(jQuery), function(t) {
    t.widget("ui.draggable", t.ui.mouse, {
        version: "1.10.4",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {
            "original" !== this.options.helper || /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative"), 
            this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), 
            this._mouseInit();
        },
        _destroy: function() {
            this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), 
            this._mouseDestroy();
        },
        _mouseCapture: function(e) {
            var i = this.options;
            return this.helper || i.disabled || t(e.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(e), 
            this.handle ? (t(i.iframeFix === !0 ? "iframe" : i.iframeFix).each(function() {
                t("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1e3
                }).css(t(this).offset()).appendTo("body");
            }), !0) : !1);
        },
        _mouseStart: function(e) {
            var i = this.options;
            return this.helper = this._createHelper(e), this.helper.addClass("ui-draggable-dragging"), 
            this._cacheHelperProportions(), t.ui.ddmanager && (t.ui.ddmanager.current = this), 
            this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), 
            this.offsetParent = this.helper.offsetParent(), this.offsetParentCssPosition = this.offsetParent.css("position"), 
            this.offset = this.positionAbs = this.element.offset(), this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            }, this.offset.scroll = !1, t.extend(this.offset, {
                click: {
                    left: e.pageX - this.offset.left,
                    top: e.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }), this.originalPosition = this.position = this._generatePosition(e), this.originalPageX = e.pageX, 
            this.originalPageY = e.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), 
            this._setContainment(), this._trigger("start", e) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), 
            t.ui.ddmanager && !i.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this._mouseDrag(e, !0), 
            t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e), !0);
        },
        _mouseDrag: function(e, i) {
            if ("fixed" === this.offsetParentCssPosition && (this.offset.parent = this._getParentOffset()), 
            this.position = this._generatePosition(e), this.positionAbs = this._convertPositionTo("absolute"), 
            !i) {
                var s = this._uiHash();
                if (this._trigger("drag", e, s) === !1) return this._mouseUp({}), !1;
                this.position = s.position;
            }
            return this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), 
            this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), 
            t.ui.ddmanager && t.ui.ddmanager.drag(this, e), !1;
        },
        _mouseStop: function(e) {
            var i = this, s = !1;
            return t.ui.ddmanager && !this.options.dropBehaviour && (s = t.ui.ddmanager.drop(this, e)), 
            this.dropped && (s = this.dropped, this.dropped = !1), "original" !== this.options.helper || t.contains(this.element[0].ownerDocument, this.element[0]) ? ("invalid" === this.options.revert && !s || "valid" === this.options.revert && s || this.options.revert === !0 || t.isFunction(this.options.revert) && this.options.revert.call(this.element, s) ? t(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                i._trigger("stop", e) !== !1 && i._clear();
            }) : this._trigger("stop", e) !== !1 && this._clear(), !1) : !1;
        },
        _mouseUp: function(e) {
            return t("div.ui-draggable-iframeFix").each(function() {
                this.parentNode.removeChild(this);
            }), t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e), t.ui.mouse.prototype._mouseUp.call(this, e);
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), 
            this;
        },
        _getHandle: function(e) {
            return this.options.handle ? !!t(e.target).closest(this.element.find(this.options.handle)).length : !0;
        },
        _createHelper: function(e) {
            var i = this.options, s = t.isFunction(i.helper) ? t(i.helper.apply(this.element[0], [ e ])) : "clone" === i.helper ? this.element.clone().removeAttr("id") : this.element;
            return s.parents("body").length || s.appendTo("parent" === i.appendTo ? this.element[0].parentNode : i.appendTo), 
            s[0] === this.element[0] || /(fixed|absolute)/.test(s.css("position")) || s.css("position", "absolute"), 
            s;
        },
        _adjustOffsetFromHelper: function(e) {
            "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = {
                left: +e[0],
                top: +e[1] || 0
            }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), 
            "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top);
        },
        _getParentOffset: function() {
            var e = this.offsetParent.offset();
            return "absolute" === this.cssPosition && this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), 
            e.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && t.ui.ie) && (e = {
                top: 0,
                left: 0
            }), {
                top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            };
        },
        _getRelativeOffset: function() {
            if ("relative" === this.cssPosition) {
                var t = this.element.position();
                return {
                    top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                };
            }
            return {
                top: 0,
                left: 0
            };
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            };
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },
        _setContainment: function() {
            var e, i, s, n = this.options;
            return n.containment ? "window" === n.containment ? void (this.containment = [ t(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, t(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, t(window).scrollLeft() + t(window).width() - this.helperProportions.width - this.margins.left, t(window).scrollTop() + (t(window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top ]) : "document" === n.containment ? void (this.containment = [ 0, 0, t(document).width() - this.helperProportions.width - this.margins.left, (t(document).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top ]) : n.containment.constructor === Array ? void (this.containment = n.containment) : ("parent" === n.containment && (n.containment = this.helper[0].parentNode), 
            i = t(n.containment), s = i[0], void (s && (e = "hidden" !== i.css("overflow"), 
            this.containment = [ (parseInt(i.css("borderLeftWidth"), 10) || 0) + (parseInt(i.css("paddingLeft"), 10) || 0), (parseInt(i.css("borderTopWidth"), 10) || 0) + (parseInt(i.css("paddingTop"), 10) || 0), (e ? Math.max(s.scrollWidth, s.offsetWidth) : s.offsetWidth) - (parseInt(i.css("borderRightWidth"), 10) || 0) - (parseInt(i.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (e ? Math.max(s.scrollHeight, s.offsetHeight) : s.offsetHeight) - (parseInt(i.css("borderBottomWidth"), 10) || 0) - (parseInt(i.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom ], 
            this.relative_container = i))) : void (this.containment = null);
        },
        _convertPositionTo: function(e, i) {
            i || (i = this.position);
            var s = "absolute" === e ? 1 : -1, n = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent;
            return this.offset.scroll || (this.offset.scroll = {
                top: n.scrollTop(),
                left: n.scrollLeft()
            }), {
                top: i.top + this.offset.relative.top * s + this.offset.parent.top * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top) * s,
                left: i.left + this.offset.relative.left * s + this.offset.parent.left * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left) * s
            };
        },
        _generatePosition: function(e) {
            var i, s, n, a, o = this.options, r = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, l = e.pageX, h = e.pageY;
            return this.offset.scroll || (this.offset.scroll = {
                top: r.scrollTop(),
                left: r.scrollLeft()
            }), this.originalPosition && (this.containment && (this.relative_container ? (s = this.relative_container.offset(), 
            i = [ this.containment[0] + s.left, this.containment[1] + s.top, this.containment[2] + s.left, this.containment[3] + s.top ]) : i = this.containment, 
            e.pageX - this.offset.click.left < i[0] && (l = i[0] + this.offset.click.left), 
            e.pageY - this.offset.click.top < i[1] && (h = i[1] + this.offset.click.top), e.pageX - this.offset.click.left > i[2] && (l = i[2] + this.offset.click.left), 
            e.pageY - this.offset.click.top > i[3] && (h = i[3] + this.offset.click.top)), o.grid && (n = o.grid[1] ? this.originalPageY + Math.round((h - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY, 
            h = i ? n - this.offset.click.top >= i[1] || n - this.offset.click.top > i[3] ? n : n - this.offset.click.top >= i[1] ? n - o.grid[1] : n + o.grid[1] : n, 
            a = o.grid[0] ? this.originalPageX + Math.round((l - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX, 
            l = i ? a - this.offset.click.left >= i[0] || a - this.offset.click.left > i[2] ? a : a - this.offset.click.left >= i[0] ? a - o.grid[0] : a + o.grid[0] : a)), 
            {
                top: h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top),
                left: l - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left)
            };
        },
        _clear: function() {
            this.helper.removeClass("ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), 
            this.helper = null, this.cancelHelperRemoval = !1;
        },
        _trigger: function(e, i, s) {
            return s = s || this._uiHash(), t.ui.plugin.call(this, e, [ i, s ]), "drag" === e && (this.positionAbs = this._convertPositionTo("absolute")), 
            t.Widget.prototype._trigger.call(this, e, i, s);
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            };
        }
    }), t.ui.plugin.add("draggable", "connectToSortable", {
        start: function(e, i) {
            var s = t(this).data("ui-draggable"), n = s.options, a = t.extend({}, i, {
                item: s.element
            });
            s.sortables = [], t(n.connectToSortable).each(function() {
                var i = t.data(this, "ui-sortable");
                i && !i.options.disabled && (s.sortables.push({
                    instance: i,
                    shouldRevert: i.options.revert
                }), i.refreshPositions(), i._trigger("activate", e, a));
            });
        },
        stop: function(e, i) {
            var s = t(this).data("ui-draggable"), n = t.extend({}, i, {
                item: s.element
            });
            t.each(s.sortables, function() {
                this.instance.isOver ? (this.instance.isOver = 0, s.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, 
                this.shouldRevert && (this.instance.options.revert = this.shouldRevert), this.instance._mouseStop(e), 
                this.instance.options.helper = this.instance.options._helper, "original" === s.options.helper && this.instance.currentItem.css({
                    top: "auto",
                    left: "auto"
                })) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", e, n));
            });
        },
        drag: function(e, i) {
            var s = t(this).data("ui-draggable"), n = this;
            t.each(s.sortables, function() {
                var a = !1, o = this;
                this.instance.positionAbs = s.positionAbs, this.instance.helperProportions = s.helperProportions, 
                this.instance.offset.click = s.offset.click, this.instance._intersectsWith(this.instance.containerCache) && (a = !0, 
                t.each(s.sortables, function() {
                    return this.instance.positionAbs = s.positionAbs, this.instance.helperProportions = s.helperProportions, 
                    this.instance.offset.click = s.offset.click, this !== o && this.instance._intersectsWith(this.instance.containerCache) && t.contains(o.instance.element[0], this.instance.element[0]) && (a = !1), 
                    a;
                })), a ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = t(n).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", !0), 
                this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function() {
                    return i.helper[0];
                }, e.target = this.instance.currentItem[0], this.instance._mouseCapture(e, !0), 
                this.instance._mouseStart(e, !0, !0), this.instance.offset.click.top = s.offset.click.top, 
                this.instance.offset.click.left = s.offset.click.left, this.instance.offset.parent.left -= s.offset.parent.left - this.instance.offset.parent.left, 
                this.instance.offset.parent.top -= s.offset.parent.top - this.instance.offset.parent.top, 
                s._trigger("toSortable", e), s.dropped = this.instance.element, s.currentItem = s.element, 
                this.instance.fromOutside = s), this.instance.currentItem && this.instance._mouseDrag(e)) : this.instance.isOver && (this.instance.isOver = 0, 
                this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", e, this.instance._uiHash(this.instance)), 
                this.instance._mouseStop(e, !0), this.instance.options.helper = this.instance.options._helper, 
                this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), 
                s._trigger("fromSortable", e), s.dropped = !1);
            });
        }
    }), t.ui.plugin.add("draggable", "cursor", {
        start: function() {
            var e = t("body"), i = t(this).data("ui-draggable").options;
            e.css("cursor") && (i._cursor = e.css("cursor")), e.css("cursor", i.cursor);
        },
        stop: function() {
            var e = t(this).data("ui-draggable").options;
            e._cursor && t("body").css("cursor", e._cursor);
        }
    }), t.ui.plugin.add("draggable", "opacity", {
        start: function(e, i) {
            var s = t(i.helper), n = t(this).data("ui-draggable").options;
            s.css("opacity") && (n._opacity = s.css("opacity")), s.css("opacity", n.opacity);
        },
        stop: function(e, i) {
            var s = t(this).data("ui-draggable").options;
            s._opacity && t(i.helper).css("opacity", s._opacity);
        }
    }), t.ui.plugin.add("draggable", "scroll", {
        start: function() {
            var e = t(this).data("ui-draggable");
            e.scrollParent[0] !== document && "HTML" !== e.scrollParent[0].tagName && (e.overflowOffset = e.scrollParent.offset());
        },
        drag: function(e) {
            var i = t(this).data("ui-draggable"), s = i.options, n = !1;
            i.scrollParent[0] !== document && "HTML" !== i.scrollParent[0].tagName ? (s.axis && "x" === s.axis || (i.overflowOffset.top + i.scrollParent[0].offsetHeight - e.pageY < s.scrollSensitivity ? i.scrollParent[0].scrollTop = n = i.scrollParent[0].scrollTop + s.scrollSpeed : e.pageY - i.overflowOffset.top < s.scrollSensitivity && (i.scrollParent[0].scrollTop = n = i.scrollParent[0].scrollTop - s.scrollSpeed)), 
            s.axis && "y" === s.axis || (i.overflowOffset.left + i.scrollParent[0].offsetWidth - e.pageX < s.scrollSensitivity ? i.scrollParent[0].scrollLeft = n = i.scrollParent[0].scrollLeft + s.scrollSpeed : e.pageX - i.overflowOffset.left < s.scrollSensitivity && (i.scrollParent[0].scrollLeft = n = i.scrollParent[0].scrollLeft - s.scrollSpeed))) : (s.axis && "x" === s.axis || (e.pageY - t(document).scrollTop() < s.scrollSensitivity ? n = t(document).scrollTop(t(document).scrollTop() - s.scrollSpeed) : t(window).height() - (e.pageY - t(document).scrollTop()) < s.scrollSensitivity && (n = t(document).scrollTop(t(document).scrollTop() + s.scrollSpeed))), 
            s.axis && "y" === s.axis || (e.pageX - t(document).scrollLeft() < s.scrollSensitivity ? n = t(document).scrollLeft(t(document).scrollLeft() - s.scrollSpeed) : t(window).width() - (e.pageX - t(document).scrollLeft()) < s.scrollSensitivity && (n = t(document).scrollLeft(t(document).scrollLeft() + s.scrollSpeed)))), 
            n !== !1 && t.ui.ddmanager && !s.dropBehaviour && t.ui.ddmanager.prepareOffsets(i, e);
        }
    }), t.ui.plugin.add("draggable", "snap", {
        start: function() {
            var e = t(this).data("ui-draggable"), i = e.options;
            e.snapElements = [], t(i.snap.constructor !== String ? i.snap.items || ":data(ui-draggable)" : i.snap).each(function() {
                var i = t(this), s = i.offset();
                this !== e.element[0] && e.snapElements.push({
                    item: this,
                    width: i.outerWidth(),
                    height: i.outerHeight(),
                    top: s.top,
                    left: s.left
                });
            });
        },
        drag: function(e, i) {
            var s, n, a, o, r, l, h, c, u, d, p = t(this).data("ui-draggable"), g = p.options, f = g.snapTolerance, m = i.offset.left, _ = m + p.helperProportions.width, v = i.offset.top, b = v + p.helperProportions.height;
            for (u = p.snapElements.length - 1; u >= 0; u--) r = p.snapElements[u].left, l = r + p.snapElements[u].width, 
            h = p.snapElements[u].top, c = h + p.snapElements[u].height, r - f > _ || m > l + f || h - f > b || v > c + f || !t.contains(p.snapElements[u].item.ownerDocument, p.snapElements[u].item) ? (p.snapElements[u].snapping && p.options.snap.release && p.options.snap.release.call(p.element, e, t.extend(p._uiHash(), {
                snapItem: p.snapElements[u].item
            })), p.snapElements[u].snapping = !1) : ("inner" !== g.snapMode && (s = f >= Math.abs(h - b), 
            n = f >= Math.abs(c - v), a = f >= Math.abs(r - _), o = f >= Math.abs(l - m), s && (i.position.top = p._convertPositionTo("relative", {
                top: h - p.helperProportions.height,
                left: 0
            }).top - p.margins.top), n && (i.position.top = p._convertPositionTo("relative", {
                top: c,
                left: 0
            }).top - p.margins.top), a && (i.position.left = p._convertPositionTo("relative", {
                top: 0,
                left: r - p.helperProportions.width
            }).left - p.margins.left), o && (i.position.left = p._convertPositionTo("relative", {
                top: 0,
                left: l
            }).left - p.margins.left)), d = s || n || a || o, "outer" !== g.snapMode && (s = f >= Math.abs(h - v), 
            n = f >= Math.abs(c - b), a = f >= Math.abs(r - m), o = f >= Math.abs(l - _), s && (i.position.top = p._convertPositionTo("relative", {
                top: h,
                left: 0
            }).top - p.margins.top), n && (i.position.top = p._convertPositionTo("relative", {
                top: c - p.helperProportions.height,
                left: 0
            }).top - p.margins.top), a && (i.position.left = p._convertPositionTo("relative", {
                top: 0,
                left: r
            }).left - p.margins.left), o && (i.position.left = p._convertPositionTo("relative", {
                top: 0,
                left: l - p.helperProportions.width
            }).left - p.margins.left)), !p.snapElements[u].snapping && (s || n || a || o || d) && p.options.snap.snap && p.options.snap.snap.call(p.element, e, t.extend(p._uiHash(), {
                snapItem: p.snapElements[u].item
            })), p.snapElements[u].snapping = s || n || a || o || d);
        }
    }), t.ui.plugin.add("draggable", "stack", {
        start: function() {
            var e, i = this.data("ui-draggable").options, s = t.makeArray(t(i.stack)).sort(function(e, i) {
                return (parseInt(t(e).css("zIndex"), 10) || 0) - (parseInt(t(i).css("zIndex"), 10) || 0);
            });
            s.length && (e = parseInt(t(s[0]).css("zIndex"), 10) || 0, t(s).each(function(i) {
                t(this).css("zIndex", e + i);
            }), this.css("zIndex", e + s.length));
        }
    }), t.ui.plugin.add("draggable", "zIndex", {
        start: function(e, i) {
            var s = t(i.helper), n = t(this).data("ui-draggable").options;
            s.css("zIndex") && (n._zIndex = s.css("zIndex")), s.css("zIndex", n.zIndex);
        },
        stop: function(e, i) {
            var s = t(this).data("ui-draggable").options;
            s._zIndex && t(i.helper).css("zIndex", s._zIndex);
        }
    });
}(jQuery), function(t) {
    function e(e, i) {
        var s = (e.attr("aria-describedby") || "").split(/\s+/);
        s.push(i), e.data("ui-tooltip-id", i).attr("aria-describedby", t.trim(s.join(" ")));
    }
    function i(e) {
        var i = e.data("ui-tooltip-id"), s = (e.attr("aria-describedby") || "").split(/\s+/), n = t.inArray(i, s);
        -1 !== n && s.splice(n, 1), e.removeData("ui-tooltip-id"), s = t.trim(s.join(" ")), 
        s ? e.attr("aria-describedby", s) : e.removeAttr("aria-describedby");
    }
    var s = 0;
    t.widget("ui.tooltip", {
        version: "1.10.4",
        options: {
            content: function() {
                var e = t(this).attr("title") || "";
                return t("<a>").text(e).html();
            },
            hide: !0,
            items: "[title]:not([disabled])",
            position: {
                my: "left top+15",
                at: "left bottom",
                collision: "flipfit flip"
            },
            show: !0,
            tooltipClass: null,
            track: !1,
            close: null,
            open: null
        },
        _create: function() {
            this._on({
                mouseover: "open",
                focusin: "open"
            }), this.tooltips = {}, this.parents = {}, this.options.disabled && this._disable();
        },
        _setOption: function(e, i) {
            var s = this;
            return "disabled" === e ? (this[i ? "_disable" : "_enable"](), void (this.options[e] = i)) : (this._super(e, i), 
            void ("content" === e && t.each(this.tooltips, function(t, e) {
                s._updateContent(e);
            })));
        },
        _disable: function() {
            var e = this;
            t.each(this.tooltips, function(i, s) {
                var n = t.Event("blur");
                n.target = n.currentTarget = s[0], e.close(n, !0);
            }), this.element.find(this.options.items).addBack().each(function() {
                var e = t(this);
                e.is("[title]") && e.data("ui-tooltip-title", e.attr("title")).attr("title", "");
            });
        },
        _enable: function() {
            this.element.find(this.options.items).addBack().each(function() {
                var e = t(this);
                e.data("ui-tooltip-title") && e.attr("title", e.data("ui-tooltip-title"));
            });
        },
        open: function(e) {
            var i = this, s = t(e ? e.target : this.element).closest(this.options.items);
            s.length && !s.data("ui-tooltip-id") && (s.attr("title") && s.data("ui-tooltip-title", s.attr("title")), 
            s.data("ui-tooltip-open", !0), e && "mouseover" === e.type && s.parents().each(function() {
                var e, s = t(this);
                s.data("ui-tooltip-open") && (e = t.Event("blur"), e.target = e.currentTarget = this, 
                i.close(e, !0)), s.attr("title") && (s.uniqueId(), i.parents[this.id] = {
                    element: this,
                    title: s.attr("title")
                }, s.attr("title", ""));
            }), this._updateContent(s, e));
        },
        _updateContent: function(t, e) {
            var i, s = this.options.content, n = this, o = e ? e.type : null;
            return "string" == typeof s ? this._open(e, t, s) : (i = s.call(t[0], function(i) {
                t.data("ui-tooltip-open") && n._delay(function() {
                    e && (e.type = o), this._open(e, t, i);
                });
            }), void (i && this._open(e, t, i)));
        },
        _open: function(i, s, n) {
            function o(t) {
                l.of = t, a.is(":hidden") || a.position(l);
            }
            var a, r, h, l = t.extend({}, this.options.position);
            if (n) {
                if (a = this._find(s), a.length) return void a.find(".ui-tooltip-content").html(n);
                s.is("[title]") && (i && "mouseover" === i.type ? s.attr("title", "") : s.removeAttr("title")), 
                a = this._tooltip(s), e(s, a.attr("id")), a.find(".ui-tooltip-content").html(n), 
                this.options.track && i && /^mouse/.test(i.type) ? (this._on(this.document, {
                    mousemove: o
                }), o(i)) : a.position(t.extend({
                    of: s
                }, this.options.position)), a.hide(), this._show(a, this.options.show), this.options.show && this.options.show.delay && (h = this.delayedShow = setInterval(function() {
                    a.is(":visible") && (o(l.of), clearInterval(h));
                }, t.fx.interval)), this._trigger("open", i, {
                    tooltip: a
                }), r = {
                    keyup: function(e) {
                        if (e.keyCode === t.ui.keyCode.ESCAPE) {
                            var i = t.Event(e);
                            i.currentTarget = s[0], this.close(i, !0);
                        }
                    },
                    remove: function() {
                        this._removeTooltip(a);
                    }
                }, i && "mouseover" !== i.type || (r.mouseleave = "close"), i && "focusin" !== i.type || (r.focusout = "close"), 
                this._on(!0, s, r);
            }
        },
        close: function(e) {
            var s = this, n = t(e ? e.currentTarget : this.element), o = this._find(n);
            this.closing || (clearInterval(this.delayedShow), n.data("ui-tooltip-title") && n.attr("title", n.data("ui-tooltip-title")), 
            i(n), o.stop(!0), this._hide(o, this.options.hide, function() {
                s._removeTooltip(t(this));
            }), n.removeData("ui-tooltip-open"), this._off(n, "mouseleave focusout keyup"), 
            n[0] !== this.element[0] && this._off(n, "remove"), this._off(this.document, "mousemove"), 
            e && "mouseleave" === e.type && t.each(this.parents, function(e, i) {
                t(i.element).attr("title", i.title), delete s.parents[e];
            }), this.closing = !0, this._trigger("close", e, {
                tooltip: o
            }), this.closing = !1);
        },
        _tooltip: function(e) {
            var i = "ui-tooltip-" + s++, n = t("<div>").attr({
                id: i,
                role: "tooltip"
            }).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " + (this.options.tooltipClass || ""));
            return t("<div>").addClass("ui-tooltip-content").appendTo(n), n.appendTo(this.document[0].body), 
            this.tooltips[i] = e, n;
        },
        _find: function(e) {
            var i = e.data("ui-tooltip-id");
            return i ? t("#" + i) : t();
        },
        _removeTooltip: function(t) {
            t.remove(), delete this.tooltips[t.attr("id")];
        },
        _destroy: function() {
            var e = this;
            t.each(this.tooltips, function(i, s) {
                var n = t.Event("blur");
                n.target = n.currentTarget = s[0], e.close(n, !0), t("#" + i).remove(), s.data("ui-tooltip-title") && (s.attr("title", s.data("ui-tooltip-title")), 
                s.removeData("ui-tooltip-title"));
            });
        }
    });
}(jQuery), function(t, e) {
    var i = "ui-effects-";
    t.effects = {
        effect: {}
    }, function(t, e) {
        function i(t, e, i) {
            var s = u[e.type] || {};
            return null == t ? i || !e.def ? null : e.def : (t = s.floor ? ~~t : parseFloat(t), 
            isNaN(t) ? e.def : s.mod ? (t + s.mod) % s.mod : 0 > t ? 0 : t > s.max ? s.max : t);
        }
        function s(i) {
            var s = h(), n = s._rgba = [];
            return i = i.toLowerCase(), f(l, function(t, a) {
                var o, r = a.re.exec(i), l = r && a.parse(r), h = a.space || "rgba";
                return l ? (o = s[h](l), s[c[h].cache] = o[c[h].cache], n = s._rgba = o._rgba, !1) : e;
            }), n.length ? ("0,0,0,0" === n.join() && t.extend(n, a.transparent), s) : a[i];
        }
        function n(t, e, i) {
            return i = (i + 1) % 1, 1 > 6 * i ? t + 6 * (e - t) * i : 1 > 2 * i ? e : 2 > 3 * i ? t + 6 * (e - t) * (2 / 3 - i) : t;
        }
        var a, o = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor", r = /^([\-+])=\s*(\d+\.?\d*)/, l = [ {
            re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function(t) {
                return [ t[1], t[2], t[3], t[4] ];
            }
        }, {
            re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function(t) {
                return [ 2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4] ];
            }
        }, {
            re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
            parse: function(t) {
                return [ parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16) ];
            }
        }, {
            re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
            parse: function(t) {
                return [ parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16) ];
            }
        }, {
            re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            space: "hsla",
            parse: function(t) {
                return [ t[1], t[2] / 100, t[3] / 100, t[4] ];
            }
        } ], h = t.Color = function(e, i, s, n) {
            return new t.Color.fn.parse(e, i, s, n);
        }, c = {
            rgba: {
                props: {
                    red: {
                        idx: 0,
                        type: "byte"
                    },
                    green: {
                        idx: 1,
                        type: "byte"
                    },
                    blue: {
                        idx: 2,
                        type: "byte"
                    }
                }
            },
            hsla: {
                props: {
                    hue: {
                        idx: 0,
                        type: "degrees"
                    },
                    saturation: {
                        idx: 1,
                        type: "percent"
                    },
                    lightness: {
                        idx: 2,
                        type: "percent"
                    }
                }
            }
        }, u = {
            "byte": {
                floor: !0,
                max: 255
            },
            percent: {
                max: 1
            },
            degrees: {
                mod: 360,
                floor: !0
            }
        }, d = h.support = {}, p = t("<p>")[0], f = t.each;
        p.style.cssText = "background-color:rgba(1,1,1,.5)", d.rgba = p.style.backgroundColor.indexOf("rgba") > -1, 
        f(c, function(t, e) {
            e.cache = "_" + t, e.props.alpha = {
                idx: 3,
                type: "percent",
                def: 1
            };
        }), h.fn = t.extend(h.prototype, {
            parse: function(n, o, r, l) {
                if (n === e) return this._rgba = [ null, null, null, null ], this;
                (n.jquery || n.nodeType) && (n = t(n).css(o), o = e);
                var u = this, d = t.type(n), p = this._rgba = [];
                return o !== e && (n = [ n, o, r, l ], d = "array"), "string" === d ? this.parse(s(n) || a._default) : "array" === d ? (f(c.rgba.props, function(t, e) {
                    p[e.idx] = i(n[e.idx], e);
                }), this) : "object" === d ? (n instanceof h ? f(c, function(t, e) {
                    n[e.cache] && (u[e.cache] = n[e.cache].slice());
                }) : f(c, function(e, s) {
                    var a = s.cache;
                    f(s.props, function(t, e) {
                        if (!u[a] && s.to) {
                            if ("alpha" === t || null == n[t]) return;
                            u[a] = s.to(u._rgba);
                        }
                        u[a][e.idx] = i(n[t], e, !0);
                    }), u[a] && 0 > t.inArray(null, u[a].slice(0, 3)) && (u[a][3] = 1, s.from && (u._rgba = s.from(u[a])));
                }), this) : e;
            },
            is: function(t) {
                var i = h(t), s = !0, n = this;
                return f(c, function(t, a) {
                    var o, r = i[a.cache];
                    return r && (o = n[a.cache] || a.to && a.to(n._rgba) || [], f(a.props, function(t, i) {
                        return null != r[i.idx] ? s = r[i.idx] === o[i.idx] : e;
                    })), s;
                }), s;
            },
            _space: function() {
                var t = [], e = this;
                return f(c, function(i, s) {
                    e[s.cache] && t.push(i);
                }), t.pop();
            },
            transition: function(t, e) {
                var s = h(t), n = s._space(), a = c[n], o = 0 === this.alpha() ? h("transparent") : this, r = o[a.cache] || a.to(o._rgba), l = r.slice();
                return s = s[a.cache], f(a.props, function(t, n) {
                    var a = n.idx, o = r[a], h = s[a], c = u[n.type] || {};
                    null !== h && (null === o ? l[a] = h : (c.mod && (h - o > c.mod / 2 ? o += c.mod : o - h > c.mod / 2 && (o -= c.mod)), 
                    l[a] = i((h - o) * e + o, n)));
                }), this[n](l);
            },
            blend: function(e) {
                if (1 === this._rgba[3]) return this;
                var i = this._rgba.slice(), s = i.pop(), n = h(e)._rgba;
                return h(t.map(i, function(t, e) {
                    return (1 - s) * n[e] + s * t;
                }));
            },
            toRgbaString: function() {
                var e = "rgba(", i = t.map(this._rgba, function(t, e) {
                    return null == t ? e > 2 ? 1 : 0 : t;
                });
                return 1 === i[3] && (i.pop(), e = "rgb("), e + i.join() + ")";
            },
            toHslaString: function() {
                var e = "hsla(", i = t.map(this.hsla(), function(t, e) {
                    return null == t && (t = e > 2 ? 1 : 0), e && 3 > e && (t = Math.round(100 * t) + "%"), 
                    t;
                });
                return 1 === i[3] && (i.pop(), e = "hsl("), e + i.join() + ")";
            },
            toHexString: function(e) {
                var i = this._rgba.slice(), s = i.pop();
                return e && i.push(~~(255 * s)), "#" + t.map(i, function(t) {
                    return t = (t || 0).toString(16), 1 === t.length ? "0" + t : t;
                }).join("");
            },
            toString: function() {
                return 0 === this._rgba[3] ? "transparent" : this.toRgbaString();
            }
        }), h.fn.parse.prototype = h.fn, c.hsla.to = function(t) {
            if (null == t[0] || null == t[1] || null == t[2]) return [ null, null, null, t[3] ];
            var e, i, s = t[0] / 255, n = t[1] / 255, a = t[2] / 255, o = t[3], r = Math.max(s, n, a), l = Math.min(s, n, a), h = r - l, c = r + l, u = .5 * c;
            return e = l === r ? 0 : s === r ? 60 * (n - a) / h + 360 : n === r ? 60 * (a - s) / h + 120 : 60 * (s - n) / h + 240, 
            i = 0 === h ? 0 : .5 >= u ? h / c : h / (2 - c), [ Math.round(e) % 360, i, u, null == o ? 1 : o ];
        }, c.hsla.from = function(t) {
            if (null == t[0] || null == t[1] || null == t[2]) return [ null, null, null, t[3] ];
            var e = t[0] / 360, i = t[1], s = t[2], a = t[3], o = .5 >= s ? s * (1 + i) : s + i - s * i, r = 2 * s - o;
            return [ Math.round(255 * n(r, o, e + 1 / 3)), Math.round(255 * n(r, o, e)), Math.round(255 * n(r, o, e - 1 / 3)), a ];
        }, f(c, function(s, n) {
            var a = n.props, o = n.cache, l = n.to, c = n.from;
            h.fn[s] = function(s) {
                if (l && !this[o] && (this[o] = l(this._rgba)), s === e) return this[o].slice();
                var n, r = t.type(s), u = "array" === r || "object" === r ? s : arguments, d = this[o].slice();
                return f(a, function(t, e) {
                    var s = u["object" === r ? t : e.idx];
                    null == s && (s = d[e.idx]), d[e.idx] = i(s, e);
                }), c ? (n = h(c(d)), n[o] = d, n) : h(d);
            }, f(a, function(e, i) {
                h.fn[e] || (h.fn[e] = function(n) {
                    var a, o = t.type(n), l = "alpha" === e ? this._hsla ? "hsla" : "rgba" : s, h = this[l](), c = h[i.idx];
                    return "undefined" === o ? c : ("function" === o && (n = n.call(this, c), o = t.type(n)), 
                    null == n && i.empty ? this : ("string" === o && (a = r.exec(n), a && (n = c + parseFloat(a[2]) * ("+" === a[1] ? 1 : -1))), 
                    h[i.idx] = n, this[l](h)));
                });
            });
        }), h.hook = function(e) {
            var i = e.split(" ");
            f(i, function(e, i) {
                t.cssHooks[i] = {
                    set: function(e, n) {
                        var a, o, r = "";
                        if ("transparent" !== n && ("string" !== t.type(n) || (a = s(n)))) {
                            if (n = h(a || n), !d.rgba && 1 !== n._rgba[3]) {
                                for (o = "backgroundColor" === i ? e.parentNode : e; ("" === r || "transparent" === r) && o && o.style; ) try {
                                    r = t.css(o, "backgroundColor"), o = o.parentNode;
                                } catch (l) {}
                                n = n.blend(r && "transparent" !== r ? r : "_default");
                            }
                            n = n.toRgbaString();
                        }
                        try {
                            e.style[i] = n;
                        } catch (l) {}
                    }
                }, t.fx.step[i] = function(e) {
                    e.colorInit || (e.start = h(e.elem, i), e.end = h(e.end), e.colorInit = !0), t.cssHooks[i].set(e.elem, e.start.transition(e.end, e.pos));
                };
            });
        }, h.hook(o), t.cssHooks.borderColor = {
            expand: function(t) {
                var e = {};
                return f([ "Top", "Right", "Bottom", "Left" ], function(i, s) {
                    e["border" + s + "Color"] = t;
                }), e;
            }
        }, a = t.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [ null, null, null, 0 ],
            _default: "#ffffff"
        };
    }(jQuery), function() {
        function i(e) {
            var i, s, n = e.ownerDocument.defaultView ? e.ownerDocument.defaultView.getComputedStyle(e, null) : e.currentStyle, a = {};
            if (n && n.length && n[0] && n[n[0]]) for (s = n.length; s--; ) i = n[s], "string" == typeof n[i] && (a[t.camelCase(i)] = n[i]); else for (i in n) "string" == typeof n[i] && (a[i] = n[i]);
            return a;
        }
        function s(e, i) {
            var s, n, o = {};
            for (s in i) n = i[s], e[s] !== n && (a[s] || (t.fx.step[s] || !isNaN(parseFloat(n))) && (o[s] = n));
            return o;
        }
        var n = [ "add", "remove", "toggle" ], a = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
        t.each([ "borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle" ], function(e, i) {
            t.fx.step[i] = function(t) {
                ("none" !== t.end && !t.setAttr || 1 === t.pos && !t.setAttr) && (jQuery.style(t.elem, i, t.end), 
                t.setAttr = !0);
            };
        }), t.fn.addBack || (t.fn.addBack = function(t) {
            return this.add(null == t ? this.prevObject : this.prevObject.filter(t));
        }), t.effects.animateClass = function(e, a, o, r) {
            var l = t.speed(a, o, r);
            return this.queue(function() {
                var a, o = t(this), r = o.attr("class") || "", h = l.children ? o.find("*").addBack() : o;
                h = h.map(function() {
                    var e = t(this);
                    return {
                        el: e,
                        start: i(this)
                    };
                }), a = function() {
                    t.each(n, function(t, i) {
                        e[i] && o[i + "Class"](e[i]);
                    });
                }, a(), h = h.map(function() {
                    return this.end = i(this.el[0]), this.diff = s(this.start, this.end), this;
                }), o.attr("class", r), h = h.map(function() {
                    var e = this, i = t.Deferred(), s = t.extend({}, l, {
                        queue: !1,
                        complete: function() {
                            i.resolve(e);
                        }
                    });
                    return this.el.animate(this.diff, s), i.promise();
                }), t.when.apply(t, h.get()).done(function() {
                    a(), t.each(arguments, function() {
                        var e = this.el;
                        t.each(this.diff, function(t) {
                            e.css(t, "");
                        });
                    }), l.complete.call(o[0]);
                });
            });
        }, t.fn.extend({
            addClass: function(e) {
                return function(i, s, n, a) {
                    return s ? t.effects.animateClass.call(this, {
                        add: i
                    }, s, n, a) : e.apply(this, arguments);
                };
            }(t.fn.addClass),
            removeClass: function(e) {
                return function(i, s, n, a) {
                    return arguments.length > 1 ? t.effects.animateClass.call(this, {
                        remove: i
                    }, s, n, a) : e.apply(this, arguments);
                };
            }(t.fn.removeClass),
            toggleClass: function(i) {
                return function(s, n, a, o, r) {
                    return "boolean" == typeof n || n === e ? a ? t.effects.animateClass.call(this, n ? {
                        add: s
                    } : {
                        remove: s
                    }, a, o, r) : i.apply(this, arguments) : t.effects.animateClass.call(this, {
                        toggle: s
                    }, n, a, o);
                };
            }(t.fn.toggleClass),
            switchClass: function(e, i, s, n, a) {
                return t.effects.animateClass.call(this, {
                    add: i,
                    remove: e
                }, s, n, a);
            }
        });
    }(), function() {
        function s(e, i, s, n) {
            return t.isPlainObject(e) && (i = e, e = e.effect), e = {
                effect: e
            }, null == i && (i = {}), t.isFunction(i) && (n = i, s = null, i = {}), ("number" == typeof i || t.fx.speeds[i]) && (n = s, 
            s = i, i = {}), t.isFunction(s) && (n = s, s = null), i && t.extend(e, i), s = s || i.duration, 
            e.duration = t.fx.off ? 0 : "number" == typeof s ? s : s in t.fx.speeds ? t.fx.speeds[s] : t.fx.speeds._default, 
            e.complete = n || i.complete, e;
        }
        function n(e) {
            return !e || "number" == typeof e || t.fx.speeds[e] ? !0 : "string" != typeof e || t.effects.effect[e] ? t.isFunction(e) ? !0 : "object" != typeof e || e.effect ? !1 : !0 : !0;
        }
        t.extend(t.effects, {
            version: "1.10.4",
            save: function(t, e) {
                for (var s = 0; e.length > s; s++) null !== e[s] && t.data(i + e[s], t[0].style[e[s]]);
            },
            restore: function(t, s) {
                var n, a;
                for (a = 0; s.length > a; a++) null !== s[a] && (n = t.data(i + s[a]), n === e && (n = ""), 
                t.css(s[a], n));
            },
            setMode: function(t, e) {
                return "toggle" === e && (e = t.is(":hidden") ? "show" : "hide"), e;
            },
            getBaseline: function(t, e) {
                var i, s;
                switch (t[0]) {
                  case "top":
                    i = 0;
                    break;

                  case "middle":
                    i = .5;
                    break;

                  case "bottom":
                    i = 1;
                    break;

                  default:
                    i = t[0] / e.height;
                }
                switch (t[1]) {
                  case "left":
                    s = 0;
                    break;

                  case "center":
                    s = .5;
                    break;

                  case "right":
                    s = 1;
                    break;

                  default:
                    s = t[1] / e.width;
                }
                return {
                    x: s,
                    y: i
                };
            },
            createWrapper: function(e) {
                if (e.parent().is(".ui-effects-wrapper")) return e.parent();
                var i = {
                    width: e.outerWidth(!0),
                    height: e.outerHeight(!0),
                    "float": e.css("float")
                }, s = t("<div></div>").addClass("ui-effects-wrapper").css({
                    fontSize: "100%",
                    background: "transparent",
                    border: "none",
                    margin: 0,
                    padding: 0
                }), n = {
                    width: e.width(),
                    height: e.height()
                }, a = document.activeElement;
                try {
                    a.id;
                } catch (o) {
                    a = document.body;
                }
                return e.wrap(s), (e[0] === a || t.contains(e[0], a)) && t(a).focus(), s = e.parent(), 
                "static" === e.css("position") ? (s.css({
                    position: "relative"
                }), e.css({
                    position: "relative"
                })) : (t.extend(i, {
                    position: e.css("position"),
                    zIndex: e.css("z-index")
                }), t.each([ "top", "left", "bottom", "right" ], function(t, s) {
                    i[s] = e.css(s), isNaN(parseInt(i[s], 10)) && (i[s] = "auto");
                }), e.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                })), e.css(n), s.css(i).show();
            },
            removeWrapper: function(e) {
                var i = document.activeElement;
                return e.parent().is(".ui-effects-wrapper") && (e.parent().replaceWith(e), (e[0] === i || t.contains(e[0], i)) && t(i).focus()), 
                e;
            },
            setTransition: function(e, i, s, n) {
                return n = n || {}, t.each(i, function(t, i) {
                    var a = e.cssUnit(i);
                    a[0] > 0 && (n[i] = a[0] * s + a[1]);
                }), n;
            }
        }), t.fn.extend({
            effect: function() {
                function e(e) {
                    function s() {
                        t.isFunction(a) && a.call(n[0]), t.isFunction(e) && e();
                    }
                    var n = t(this), a = i.complete, r = i.mode;
                    (n.is(":hidden") ? "hide" === r : "show" === r) ? (n[r](), s()) : o.call(n[0], i, s);
                }
                var i = s.apply(this, arguments), n = i.mode, a = i.queue, o = t.effects.effect[i.effect];
                return t.fx.off || !o ? n ? this[n](i.duration, i.complete) : this.each(function() {
                    i.complete && i.complete.call(this);
                }) : a === !1 ? this.each(e) : this.queue(a || "fx", e);
            },
            show: function(t) {
                return function(e) {
                    if (n(e)) return t.apply(this, arguments);
                    var i = s.apply(this, arguments);
                    return i.mode = "show", this.effect.call(this, i);
                };
            }(t.fn.show),
            hide: function(t) {
                return function(e) {
                    if (n(e)) return t.apply(this, arguments);
                    var i = s.apply(this, arguments);
                    return i.mode = "hide", this.effect.call(this, i);
                };
            }(t.fn.hide),
            toggle: function(t) {
                return function(e) {
                    if (n(e) || "boolean" == typeof e) return t.apply(this, arguments);
                    var i = s.apply(this, arguments);
                    return i.mode = "toggle", this.effect.call(this, i);
                };
            }(t.fn.toggle),
            cssUnit: function(e) {
                var i = this.css(e), s = [];
                return t.each([ "em", "px", "%", "pt" ], function(t, e) {
                    i.indexOf(e) > 0 && (s = [ parseFloat(i), e ]);
                }), s;
            }
        });
    }(), function() {
        var e = {};
        t.each([ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function(t, i) {
            e[i] = function(e) {
                return Math.pow(e, t + 2);
            };
        }), t.extend(e, {
            Sine: function(t) {
                return 1 - Math.cos(t * Math.PI / 2);
            },
            Circ: function(t) {
                return 1 - Math.sqrt(1 - t * t);
            },
            Elastic: function(t) {
                return 0 === t || 1 === t ? t : -Math.pow(2, 8 * (t - 1)) * Math.sin((80 * (t - 1) - 7.5) * Math.PI / 15);
            },
            Back: function(t) {
                return t * t * (3 * t - 2);
            },
            Bounce: function(t) {
                for (var e, i = 4; ((e = Math.pow(2, --i)) - 1) / 11 > t; ) ;
                return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2);
            }
        }), t.each(e, function(e, i) {
            t.easing["easeIn" + e] = i, t.easing["easeOut" + e] = function(t) {
                return 1 - i(1 - t);
            }, t.easing["easeInOut" + e] = function(t) {
                return .5 > t ? i(2 * t) / 2 : 1 - i(-2 * t + 2) / 2;
            };
        });
    }();
}(jQuery), function(t) {
    var e = /up|down|vertical/, i = /up|left|vertical|horizontal/;
    t.effects.effect.blind = function(s, n) {
        var a, o, r, l = t(this), h = [ "position", "top", "bottom", "left", "right", "height", "width" ], c = t.effects.setMode(l, s.mode || "hide"), u = s.direction || "up", d = e.test(u), p = d ? "height" : "width", f = d ? "top" : "left", g = i.test(u), m = {}, v = "show" === c;
        l.parent().is(".ui-effects-wrapper") ? t.effects.save(l.parent(), h) : t.effects.save(l, h), 
        l.show(), a = t.effects.createWrapper(l).css({
            overflow: "hidden"
        }), o = a[p](), r = parseFloat(a.css(f)) || 0, m[p] = v ? o : 0, g || (l.css(d ? "bottom" : "right", 0).css(d ? "top" : "left", "auto").css({
            position: "absolute"
        }), m[f] = v ? r : o + r), v && (a.css(p, 0), g || a.css(f, r + o)), a.animate(m, {
            duration: s.duration,
            easing: s.easing,
            queue: !1,
            complete: function() {
                "hide" === c && l.hide(), t.effects.restore(l, h), t.effects.removeWrapper(l), n();
            }
        });
    };
}(jQuery), function(t) {
    t.effects.effect.bounce = function(e, i) {
        var s, n, a, o = t(this), r = [ "position", "top", "bottom", "left", "right", "height", "width" ], l = t.effects.setMode(o, e.mode || "effect"), h = "hide" === l, c = "show" === l, u = e.direction || "up", d = e.distance, p = e.times || 5, f = 2 * p + (c || h ? 1 : 0), g = e.duration / f, m = e.easing, v = "up" === u || "down" === u ? "top" : "left", _ = "up" === u || "left" === u, b = o.queue(), y = b.length;
        for ((c || h) && r.push("opacity"), t.effects.save(o, r), o.show(), t.effects.createWrapper(o), 
        d || (d = o["top" === v ? "outerHeight" : "outerWidth"]() / 3), c && (a = {
            opacity: 1
        }, a[v] = 0, o.css("opacity", 0).css(v, _ ? 2 * -d : 2 * d).animate(a, g, m)), h && (d /= Math.pow(2, p - 1)), 
        a = {}, a[v] = 0, s = 0; p > s; s++) n = {}, n[v] = (_ ? "-=" : "+=") + d, o.animate(n, g, m).animate(a, g, m), 
        d = h ? 2 * d : d / 2;
        h && (n = {
            opacity: 0
        }, n[v] = (_ ? "-=" : "+=") + d, o.animate(n, g, m)), o.queue(function() {
            h && o.hide(), t.effects.restore(o, r), t.effects.removeWrapper(o), i();
        }), y > 1 && b.splice.apply(b, [ 1, 0 ].concat(b.splice(y, f + 1))), o.dequeue();
    };
}(jQuery), function(t) {
    t.effects.effect.clip = function(e, i) {
        var s, n, a, o = t(this), r = [ "position", "top", "bottom", "left", "right", "height", "width" ], l = t.effects.setMode(o, e.mode || "hide"), h = "show" === l, c = e.direction || "vertical", u = "vertical" === c, d = u ? "height" : "width", p = u ? "top" : "left", f = {};
        t.effects.save(o, r), o.show(), s = t.effects.createWrapper(o).css({
            overflow: "hidden"
        }), n = "IMG" === o[0].tagName ? s : o, a = n[d](), h && (n.css(d, 0), n.css(p, a / 2)), 
        f[d] = h ? a : 0, f[p] = h ? 0 : a / 2, n.animate(f, {
            queue: !1,
            duration: e.duration,
            easing: e.easing,
            complete: function() {
                h || o.hide(), t.effects.restore(o, r), t.effects.removeWrapper(o), i();
            }
        });
    };
}(jQuery), function(t) {
    t.effects.effect.drop = function(e, i) {
        var s, n = t(this), a = [ "position", "top", "bottom", "left", "right", "opacity", "height", "width" ], o = t.effects.setMode(n, e.mode || "hide"), r = "show" === o, l = e.direction || "left", h = "up" === l || "down" === l ? "top" : "left", c = "up" === l || "left" === l ? "pos" : "neg", u = {
            opacity: r ? 1 : 0
        };
        t.effects.save(n, a), n.show(), t.effects.createWrapper(n), s = e.distance || n["top" === h ? "outerHeight" : "outerWidth"](!0) / 2, 
        r && n.css("opacity", 0).css(h, "pos" === c ? -s : s), u[h] = (r ? "pos" === c ? "+=" : "-=" : "pos" === c ? "-=" : "+=") + s, 
        n.animate(u, {
            queue: !1,
            duration: e.duration,
            easing: e.easing,
            complete: function() {
                "hide" === o && n.hide(), t.effects.restore(n, a), t.effects.removeWrapper(n), i();
            }
        });
    };
}(jQuery), function(t) {
    t.effects.effect.explode = function(e, i) {
        function s() {
            b.push(this), b.length === u * d && n();
        }
        function n() {
            p.css({
                visibility: "visible"
            }), t(b).remove(), g || p.hide(), i();
        }
        var a, o, r, l, h, c, u = e.pieces ? Math.round(Math.sqrt(e.pieces)) : 3, d = u, p = t(this), f = t.effects.setMode(p, e.mode || "hide"), g = "show" === f, m = p.show().css("visibility", "hidden").offset(), v = Math.ceil(p.outerWidth() / d), _ = Math.ceil(p.outerHeight() / u), b = [];
        for (a = 0; u > a; a++) for (l = m.top + a * _, c = a - (u - 1) / 2, o = 0; d > o; o++) r = m.left + o * v, 
        h = o - (d - 1) / 2, p.clone().appendTo("body").wrap("<div></div>").css({
            position: "absolute",
            visibility: "visible",
            left: -o * v,
            top: -a * _
        }).parent().addClass("ui-effects-explode").css({
            position: "absolute",
            overflow: "hidden",
            width: v,
            height: _,
            left: r + (g ? h * v : 0),
            top: l + (g ? c * _ : 0),
            opacity: g ? 0 : 1
        }).animate({
            left: r + (g ? 0 : h * v),
            top: l + (g ? 0 : c * _),
            opacity: g ? 1 : 0
        }, e.duration || 500, e.easing, s);
    };
}(jQuery), function(t) {
    t.effects.effect.fade = function(e, i) {
        var s = t(this), n = t.effects.setMode(s, e.mode || "toggle");
        s.animate({
            opacity: n
        }, {
            queue: !1,
            duration: e.duration,
            easing: e.easing,
            complete: i
        });
    };
}(jQuery), function(t) {
    t.effects.effect.fold = function(e, i) {
        var s, n, a = t(this), o = [ "position", "top", "bottom", "left", "right", "height", "width" ], r = t.effects.setMode(a, e.mode || "hide"), l = "show" === r, h = "hide" === r, c = e.size || 15, u = /([0-9]+)%/.exec(c), d = !!e.horizFirst, p = l !== d, f = p ? [ "width", "height" ] : [ "height", "width" ], g = e.duration / 2, m = {}, v = {};
        t.effects.save(a, o), a.show(), s = t.effects.createWrapper(a).css({
            overflow: "hidden"
        }), n = p ? [ s.width(), s.height() ] : [ s.height(), s.width() ], u && (c = parseInt(u[1], 10) / 100 * n[h ? 0 : 1]), 
        l && s.css(d ? {
            height: 0,
            width: c
        } : {
            height: c,
            width: 0
        }), m[f[0]] = l ? n[0] : c, v[f[1]] = l ? n[1] : 0, s.animate(m, g, e.easing).animate(v, g, e.easing, function() {
            h && a.hide(), t.effects.restore(a, o), t.effects.removeWrapper(a), i();
        });
    };
}(jQuery), function(t) {
    t.effects.effect.highlight = function(e, i) {
        var s = t(this), n = [ "backgroundImage", "backgroundColor", "opacity" ], a = t.effects.setMode(s, e.mode || "show"), o = {
            backgroundColor: s.css("backgroundColor")
        };
        "hide" === a && (o.opacity = 0), t.effects.save(s, n), s.show().css({
            backgroundImage: "none",
            backgroundColor: e.color || "#ffff99"
        }).animate(o, {
            queue: !1,
            duration: e.duration,
            easing: e.easing,
            complete: function() {
                "hide" === a && s.hide(), t.effects.restore(s, n), i();
            }
        });
    };
}(jQuery), function(t) {
    t.effects.effect.pulsate = function(e, i) {
        var s, n = t(this), a = t.effects.setMode(n, e.mode || "show"), o = "show" === a, r = "hide" === a, l = o || "hide" === a, h = 2 * (e.times || 5) + (l ? 1 : 0), c = e.duration / h, u = 0, d = n.queue(), p = d.length;
        for ((o || !n.is(":visible")) && (n.css("opacity", 0).show(), u = 1), s = 1; h > s; s++) n.animate({
            opacity: u
        }, c, e.easing), u = 1 - u;
        n.animate({
            opacity: u
        }, c, e.easing), n.queue(function() {
            r && n.hide(), i();
        }), p > 1 && d.splice.apply(d, [ 1, 0 ].concat(d.splice(p, h + 1))), n.dequeue();
    };
}(jQuery), function(t) {
    t.effects.effect.puff = function(e, i) {
        var s = t(this), n = t.effects.setMode(s, e.mode || "hide"), a = "hide" === n, o = parseInt(e.percent, 10) || 150, r = o / 100, l = {
            height: s.height(),
            width: s.width(),
            outerHeight: s.outerHeight(),
            outerWidth: s.outerWidth()
        };
        t.extend(e, {
            effect: "scale",
            queue: !1,
            fade: !0,
            mode: n,
            complete: i,
            percent: a ? o : 100,
            from: a ? l : {
                height: l.height * r,
                width: l.width * r,
                outerHeight: l.outerHeight * r,
                outerWidth: l.outerWidth * r
            }
        }), s.effect(e);
    }, t.effects.effect.scale = function(e, i) {
        var s = t(this), n = t.extend(!0, {}, e), a = t.effects.setMode(s, e.mode || "effect"), o = parseInt(e.percent, 10) || (0 === parseInt(e.percent, 10) ? 0 : "hide" === a ? 0 : 100), r = e.direction || "both", l = e.origin, h = {
            height: s.height(),
            width: s.width(),
            outerHeight: s.outerHeight(),
            outerWidth: s.outerWidth()
        }, c = {
            y: "horizontal" !== r ? o / 100 : 1,
            x: "vertical" !== r ? o / 100 : 1
        };
        n.effect = "size", n.queue = !1, n.complete = i, "effect" !== a && (n.origin = l || [ "middle", "center" ], 
        n.restore = !0), n.from = e.from || ("show" === a ? {
            height: 0,
            width: 0,
            outerHeight: 0,
            outerWidth: 0
        } : h), n.to = {
            height: h.height * c.y,
            width: h.width * c.x,
            outerHeight: h.outerHeight * c.y,
            outerWidth: h.outerWidth * c.x
        }, n.fade && ("show" === a && (n.from.opacity = 0, n.to.opacity = 1), "hide" === a && (n.from.opacity = 1, 
        n.to.opacity = 0)), s.effect(n);
    }, t.effects.effect.size = function(e, i) {
        var s, n, a, o = t(this), r = [ "position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity" ], l = [ "position", "top", "bottom", "left", "right", "overflow", "opacity" ], h = [ "width", "height", "overflow" ], c = [ "fontSize" ], u = [ "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom" ], d = [ "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight" ], p = t.effects.setMode(o, e.mode || "effect"), f = e.restore || "effect" !== p, g = e.scale || "both", m = e.origin || [ "middle", "center" ], v = o.css("position"), _ = f ? r : l, b = {
            height: 0,
            width: 0,
            outerHeight: 0,
            outerWidth: 0
        };
        "show" === p && o.show(), s = {
            height: o.height(),
            width: o.width(),
            outerHeight: o.outerHeight(),
            outerWidth: o.outerWidth()
        }, "toggle" === e.mode && "show" === p ? (o.from = e.to || b, o.to = e.from || s) : (o.from = e.from || ("show" === p ? b : s), 
        o.to = e.to || ("hide" === p ? b : s)), a = {
            from: {
                y: o.from.height / s.height,
                x: o.from.width / s.width
            },
            to: {
                y: o.to.height / s.height,
                x: o.to.width / s.width
            }
        }, ("box" === g || "both" === g) && (a.from.y !== a.to.y && (_ = _.concat(u), o.from = t.effects.setTransition(o, u, a.from.y, o.from), 
        o.to = t.effects.setTransition(o, u, a.to.y, o.to)), a.from.x !== a.to.x && (_ = _.concat(d), 
        o.from = t.effects.setTransition(o, d, a.from.x, o.from), o.to = t.effects.setTransition(o, d, a.to.x, o.to))), 
        ("content" === g || "both" === g) && a.from.y !== a.to.y && (_ = _.concat(c).concat(h), 
        o.from = t.effects.setTransition(o, c, a.from.y, o.from), o.to = t.effects.setTransition(o, c, a.to.y, o.to)), 
        t.effects.save(o, _), o.show(), t.effects.createWrapper(o), o.css("overflow", "hidden").css(o.from), 
        m && (n = t.effects.getBaseline(m, s), o.from.top = (s.outerHeight - o.outerHeight()) * n.y, 
        o.from.left = (s.outerWidth - o.outerWidth()) * n.x, o.to.top = (s.outerHeight - o.to.outerHeight) * n.y, 
        o.to.left = (s.outerWidth - o.to.outerWidth) * n.x), o.css(o.from), ("content" === g || "both" === g) && (u = u.concat([ "marginTop", "marginBottom" ]).concat(c), 
        d = d.concat([ "marginLeft", "marginRight" ]), h = r.concat(u).concat(d), o.find("*[width]").each(function() {
            var i = t(this), s = {
                height: i.height(),
                width: i.width(),
                outerHeight: i.outerHeight(),
                outerWidth: i.outerWidth()
            };
            f && t.effects.save(i, h), i.from = {
                height: s.height * a.from.y,
                width: s.width * a.from.x,
                outerHeight: s.outerHeight * a.from.y,
                outerWidth: s.outerWidth * a.from.x
            }, i.to = {
                height: s.height * a.to.y,
                width: s.width * a.to.x,
                outerHeight: s.height * a.to.y,
                outerWidth: s.width * a.to.x
            }, a.from.y !== a.to.y && (i.from = t.effects.setTransition(i, u, a.from.y, i.from), 
            i.to = t.effects.setTransition(i, u, a.to.y, i.to)), a.from.x !== a.to.x && (i.from = t.effects.setTransition(i, d, a.from.x, i.from), 
            i.to = t.effects.setTransition(i, d, a.to.x, i.to)), i.css(i.from), i.animate(i.to, e.duration, e.easing, function() {
                f && t.effects.restore(i, h);
            });
        })), o.animate(o.to, {
            queue: !1,
            duration: e.duration,
            easing: e.easing,
            complete: function() {
                0 === o.to.opacity && o.css("opacity", o.from.opacity), "hide" === p && o.hide(), 
                t.effects.restore(o, _), f || ("static" === v ? o.css({
                    position: "relative",
                    top: o.to.top,
                    left: o.to.left
                }) : t.each([ "top", "left" ], function(t, e) {
                    o.css(e, function(e, i) {
                        var s = parseInt(i, 10), n = t ? o.to.left : o.to.top;
                        return "auto" === i ? n + "px" : s + n + "px";
                    });
                })), t.effects.removeWrapper(o), i();
            }
        });
    };
}(jQuery), function(t) {
    t.effects.effect.shake = function(e, i) {
        var s, n = t(this), a = [ "position", "top", "bottom", "left", "right", "height", "width" ], o = t.effects.setMode(n, e.mode || "effect"), r = e.direction || "left", l = e.distance || 20, h = e.times || 3, c = 2 * h + 1, u = Math.round(e.duration / c), d = "up" === r || "down" === r ? "top" : "left", p = "up" === r || "left" === r, f = {}, g = {}, m = {}, v = n.queue(), _ = v.length;
        for (t.effects.save(n, a), n.show(), t.effects.createWrapper(n), f[d] = (p ? "-=" : "+=") + l, 
        g[d] = (p ? "+=" : "-=") + 2 * l, m[d] = (p ? "-=" : "+=") + 2 * l, n.animate(f, u, e.easing), 
        s = 1; h > s; s++) n.animate(g, u, e.easing).animate(m, u, e.easing);
        n.animate(g, u, e.easing).animate(f, u / 2, e.easing).queue(function() {
            "hide" === o && n.hide(), t.effects.restore(n, a), t.effects.removeWrapper(n), i();
        }), _ > 1 && v.splice.apply(v, [ 1, 0 ].concat(v.splice(_, c + 1))), n.dequeue();
    };
}(jQuery), function(t) {
    t.effects.effect.slide = function(e, i) {
        var s, n = t(this), a = [ "position", "top", "bottom", "left", "right", "width", "height" ], o = t.effects.setMode(n, e.mode || "show"), r = "show" === o, l = e.direction || "left", h = "up" === l || "down" === l ? "top" : "left", c = "up" === l || "left" === l, u = {};
        t.effects.save(n, a), n.show(), s = e.distance || n["top" === h ? "outerHeight" : "outerWidth"](!0), 
        t.effects.createWrapper(n).css({
            overflow: "hidden"
        }), r && n.css(h, c ? isNaN(s) ? "-" + s : -s : s), u[h] = (r ? c ? "+=" : "-=" : c ? "-=" : "+=") + s, 
        n.animate(u, {
            queue: !1,
            duration: e.duration,
            easing: e.easing,
            complete: function() {
                "hide" === o && n.hide(), t.effects.restore(n, a), t.effects.removeWrapper(n), i();
            }
        });
    };
}(jQuery), function(t) {
    t.effects.effect.transfer = function(e, i) {
        var s = t(this), n = t(e.to), a = "fixed" === n.css("position"), o = t("body"), r = a ? o.scrollTop() : 0, l = a ? o.scrollLeft() : 0, h = n.offset(), c = {
            top: h.top - r,
            left: h.left - l,
            height: n.innerHeight(),
            width: n.innerWidth()
        }, u = s.offset(), d = t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({
            top: u.top - r,
            left: u.left - l,
            height: s.innerHeight(),
            width: s.innerWidth(),
            position: a ? "fixed" : "absolute"
        }).animate(c, e.duration, e.easing, function() {
            d.remove(), i();
        });
    };
}(jQuery);;
/*! Facebook-Newsroom - v0.0.1 */
/*
 * iosSlider - http://iosscripts.com/iosslider/
 * 
 * Touch Enabled, Responsive jQuery Horizontal Content Slider/Carousel/Image Gallery Plugin
 *
 * A jQuery plugin which allows you to integrate a customizable, cross-browser 
 * content slider into your web presence. Designed for use as a content slider, carousel, 
 * scrolling website banner, or image gallery.
 * 
 * Copyright (c) 2013 Marc Whitbread
 * 
 * Version: v1.3.41 (04/16/2014)
 * Minimum requirements: jQuery v1.4+
 *
 * Advanced requirements:
 * 1) jQuery bind() click event override on slide requires jQuery v1.6+
 *
 * Terms of use:
 *
 * 1) iosSlider is licensed under the Creative Commons – Attribution-NonCommercial 3.0 License.
 * 2) You may use iosSlider free for personal or non-profit purposes, without restriction.
 *	  Attribution is not required but always appreciated. For commercial projects, you
 *	  must purchase a license. You may download and play with the script before deciding to
 *	  fully implement it in your project. Making sure you are satisfied, and knowing iosSlider
 *	  is the right script for your project is paramount.
 * 3) You are not permitted to make the resources found on iosscripts.com available for
 *    distribution elsewhere "as is" without prior consent. If you would like to feature
 *    iosSlider on your site, please do not link directly to the resource zip files. Please
 *    link to the appropriate page on iosscripts.com where users can find the download.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 */
!function($) {
    /* global variables */
    var scrollbarNumber = 0, xScrollDistance = 0, yScrollDistance = 0, scrollIntervalTime = 10, scrollbarDistance = 0, isTouch = "ontouchstart" in window || navigator.msMaxTouchPoints > 0, supportsOrientationChange = "onorientationchange" in window, isWebkit = !1, has3DTransform = !1, isIe7 = !1, isIe8 = !1, isIe9 = !1, isIe = !1, isGecko = !1, grabOutCursor = "move", grabInCursor = "move", onChangeEventLastFired = new Array(), autoSlideTimeouts = new Array(), iosSliders = new Array(), iosSliderSettings = new Array(), isEventCleared = new Array(), slideTimeouts = new Array(), activeChildOffsets = new Array(), activeChildInfOffsets = new Array(), infiniteSliderOffset = new Array(), sliderMin = new Array(), sliderMax = new Array(), sliderAbsMax = new Array(), touchLocks = new Array(), helpers = {
        showScrollbar: function(settings, scrollbarClass) {
            settings.scrollbarHide && $("." + scrollbarClass).css({
                opacity: settings.scrollbarOpacity,
                filter: "alpha(opacity:" + 100 * settings.scrollbarOpacity + ")"
            });
        },
        hideScrollbar: function(settings, scrollTimeouts, j, distanceOffsetArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber) {
            if (settings.scrollbar && settings.scrollbarHide) for (var i = j; j + 25 > i; i++) scrollTimeouts[scrollTimeouts.length] = helpers.hideScrollbarIntervalTimer(scrollIntervalTime * i, distanceOffsetArray[j], (j + 24 - i) / 24, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings);
        },
        hideScrollbarInterval: function(newOffset, opacity, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings) {
            scrollbarDistance = -1 * newOffset / sliderMax[sliderNumber] * (stageWidth - scrollMargin - scrollBorder - scrollbarWidth), 
            helpers.setSliderOffset("." + scrollbarClass, scrollbarDistance), $("." + scrollbarClass).css({
                opacity: settings.scrollbarOpacity * opacity,
                filter: "alpha(opacity:" + settings.scrollbarOpacity * opacity * 100 + ")"
            });
        },
        slowScrollHorizontalInterval: function(node, slideNodes, newOffset, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, activeChildOffset, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, endOffset, settings) {
            if (settings.infiniteSlider) {
                if (newOffset <= -1 * sliderMax[sliderNumber] || newOffset <= -1 * sliderAbsMax[sliderNumber]) {
                    var scrollerWidth = $(node).width();
                    if (newOffset <= -1 * sliderAbsMax[sliderNumber]) {
                        var sum = -1 * originalOffsets[0];
                        $(slideNodes).each(function(i) {
                            helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset), i < childrenOffsets.length && (childrenOffsets[i] = -1 * sum), 
                            sum += slideNodeOuterWidths[i];
                        }), newOffset += -1 * childrenOffsets[0], sliderMin[sliderNumber] = -1 * childrenOffsets[0] + centeredSlideOffset, 
                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                        infiniteSliderOffset[sliderNumber] = 0;
                    }
                    for (;newOffset <= -1 * sliderMax[sliderNumber]; ) {
                        var lowSlideNumber = 0, lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), "x");
                        $(slideNodes).each(function(i) {
                            helpers.getSliderOffset(this, "x") < lowSlideOffset && (lowSlideOffset = helpers.getSliderOffset(this, "x"), 
                            lowSlideNumber = i);
                        });
                        var tempOffset = sliderMin[sliderNumber] + scrollerWidth;
                        helpers.setSliderOffset($(slideNodes)[lowSlideNumber], tempOffset), sliderMin[sliderNumber] = -1 * childrenOffsets[1] + centeredSlideOffset, 
                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                        childrenOffsets.splice(0, 1), childrenOffsets.splice(childrenOffsets.length, 0, -1 * tempOffset + centeredSlideOffset), 
                        infiniteSliderOffset[sliderNumber]++;
                    }
                }
                if (newOffset >= -1 * sliderMin[sliderNumber] || newOffset >= 0) {
                    var scrollerWidth = $(node).width();
                    if (newOffset > 0) {
                        var sum = -1 * originalOffsets[0];
                        for ($(slideNodes).each(function(i) {
                            helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset), i < childrenOffsets.length && (childrenOffsets[i] = -1 * sum), 
                            sum += slideNodeOuterWidths[i];
                        }), newOffset -= -1 * childrenOffsets[0], sliderMin[sliderNumber] = -1 * childrenOffsets[0] + centeredSlideOffset, 
                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                        infiniteSliderOffset[sliderNumber] = numberOfSlides; -1 * childrenOffsets[0] - scrollerWidth + centeredSlideOffset > 0; ) {
                            var highSlideNumber = 0, highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), "x");
                            $(slideNodes).each(function(i) {
                                helpers.getSliderOffset(this, "x") > highSlideOffset && (highSlideOffset = helpers.getSliderOffset(this, "x"), 
                                highSlideNumber = i);
                            });
                            var tempOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                            helpers.setSliderOffset($(slideNodes)[highSlideNumber], tempOffset), childrenOffsets.splice(0, 0, -1 * tempOffset + centeredSlideOffset), 
                            childrenOffsets.splice(childrenOffsets.length - 1, 1), sliderMin[sliderNumber] = -1 * childrenOffsets[0] + centeredSlideOffset, 
                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                            infiniteSliderOffset[sliderNumber]--, activeChildOffsets[sliderNumber]++;
                        }
                    }
                    for (;newOffset > -1 * sliderMin[sliderNumber]; ) {
                        var highSlideNumber = 0, highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), "x");
                        $(slideNodes).each(function(i) {
                            helpers.getSliderOffset(this, "x") > highSlideOffset && (highSlideOffset = helpers.getSliderOffset(this, "x"), 
                            highSlideNumber = i);
                        });
                        var tempOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                        helpers.setSliderOffset($(slideNodes)[highSlideNumber], tempOffset), childrenOffsets.splice(0, 0, -1 * tempOffset + centeredSlideOffset), 
                        childrenOffsets.splice(childrenOffsets.length - 1, 1), sliderMin[sliderNumber] = -1 * childrenOffsets[0] + centeredSlideOffset, 
                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                        infiniteSliderOffset[sliderNumber]--;
                    }
                }
            }
            var slideChanged = !1, newChildOffset = helpers.calcActiveOffset(settings, newOffset, childrenOffsets, stageWidth, infiniteSliderOffset[sliderNumber], numberOfSlides, activeChildOffset, sliderNumber), tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
            if (settings.infiniteSlider ? tempOffset != activeChildInfOffsets[sliderNumber] && (slideChanged = !0) : newChildOffset != activeChildOffsets[sliderNumber] && (slideChanged = !0), 
            slideChanged) {
                var args = new helpers.args("change", settings, node, $(node).children(":eq(" + tempOffset + ")"), tempOffset, endOffset);
                $(node).parent().data("args", args), "" != settings.onSlideChange && settings.onSlideChange(args);
            }
            if (activeChildOffsets[sliderNumber] = newChildOffset, activeChildInfOffsets[sliderNumber] = tempOffset, 
            newOffset = Math.floor(newOffset), helpers.setSliderOffset(node, newOffset), settings.scrollbar) {
                scrollbarDistance = Math.floor((-1 * newOffset - sliderMin[sliderNumber] + centeredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageWidth - scrollMargin - scrollbarWidth));
                var width = scrollbarWidth - scrollBorder;
                newOffset >= -1 * sliderMin[sliderNumber] + centeredSlideOffset ? (width = scrollbarWidth - scrollBorder - -1 * scrollbarDistance, 
                helpers.setSliderOffset($("." + scrollbarClass), 0), $("." + scrollbarClass).css({
                    width: width + "px"
                })) : newOffset <= -1 * sliderMax[sliderNumber] + 1 ? (width = scrollbarStageWidth - scrollMargin - scrollBorder - scrollbarDistance, 
                helpers.setSliderOffset($("." + scrollbarClass), scrollbarDistance), $("." + scrollbarClass).css({
                    width: width + "px"
                })) : (helpers.setSliderOffset($("." + scrollbarClass), scrollbarDistance), $("." + scrollbarClass).css({
                    width: width + "px"
                }));
            }
        },
        slowScrollHorizontal: function(node, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings) {
            var nodeOffset = helpers.getSliderOffset(node, "x"), distanceOffsetArray = new Array(), xScrollDistanceArray = new Array(), snapDirection = 0, maxSlideVelocity = 25 / 1024 * stageWidth;
            frictionCoefficient = settings.frictionCoefficient, elasticFrictionCoefficient = settings.elasticFrictionCoefficient, 
            snapFrictionCoefficient = settings.snapFrictionCoefficient, xScrollDistance > settings.snapVelocityThreshold && settings.snapToChildren && !snapOverride ? snapDirection = 1 : xScrollDistance < -1 * settings.snapVelocityThreshold && settings.snapToChildren && !snapOverride && (snapDirection = -1), 
            -1 * maxSlideVelocity > xScrollDistance ? xScrollDistance = -1 * maxSlideVelocity : xScrollDistance > maxSlideVelocity && (xScrollDistance = maxSlideVelocity), 
            $(node)[0] !== $(currentEventNode)[0] && (snapDirection = -1 * snapDirection, xScrollDistance = -2 * xScrollDistance);
            var tempInfiniteSliderOffset = infiniteSliderOffset[sliderNumber];
            if (settings.infiniteSlider) var tempSliderMin = sliderMin[sliderNumber], tempSliderMax = sliderMax[sliderNumber];
            for (var tempChildrenOffsets = new Array(), tempSlideNodeOffsets = new Array(), i = 0; i < childrenOffsets.length; i++) tempChildrenOffsets[i] = childrenOffsets[i], 
            i < slideNodes.length && (tempSlideNodeOffsets[i] = helpers.getSliderOffset($(slideNodes[i]), "x"));
            for (;xScrollDistance > 1 || -1 > xScrollDistance; ) {
                if (xScrollDistance *= frictionCoefficient, nodeOffset += xScrollDistance, (nodeOffset > -1 * sliderMin[sliderNumber] || nodeOffset < -1 * sliderMax[sliderNumber]) && !settings.infiniteSlider && (xScrollDistance *= elasticFrictionCoefficient, 
                nodeOffset += xScrollDistance), settings.infiniteSlider) {
                    if (-1 * tempSliderMax >= nodeOffset) {
                        for (var scrollerWidth = $(node).width(), lowSlideNumber = 0, lowSlideOffset = tempSlideNodeOffsets[0], i = 0; i < tempSlideNodeOffsets.length; i++) tempSlideNodeOffsets[i] < lowSlideOffset && (lowSlideOffset = tempSlideNodeOffsets[i], 
                        lowSlideNumber = i);
                        var newOffset = tempSliderMin + scrollerWidth;
                        tempSlideNodeOffsets[lowSlideNumber] = newOffset, tempSliderMin = -1 * tempChildrenOffsets[1] + centeredSlideOffset, 
                        tempSliderMax = tempSliderMin + scrollerWidth - stageWidth, tempChildrenOffsets.splice(0, 1), 
                        tempChildrenOffsets.splice(tempChildrenOffsets.length, 0, -1 * newOffset + centeredSlideOffset), 
                        tempInfiniteSliderOffset++;
                    }
                    if (nodeOffset >= -1 * tempSliderMin) {
                        for (var scrollerWidth = $(node).width(), highSlideNumber = 0, highSlideOffset = tempSlideNodeOffsets[0], i = 0; i < tempSlideNodeOffsets.length; i++) tempSlideNodeOffsets[i] > highSlideOffset && (highSlideOffset = tempSlideNodeOffsets[i], 
                        highSlideNumber = i);
                        var newOffset = tempSliderMin - slideNodeOuterWidths[highSlideNumber];
                        tempSlideNodeOffsets[highSlideNumber] = newOffset, tempChildrenOffsets.splice(0, 0, -1 * newOffset + centeredSlideOffset), 
                        tempChildrenOffsets.splice(tempChildrenOffsets.length - 1, 1), tempSliderMin = -1 * tempChildrenOffsets[0] + centeredSlideOffset, 
                        tempSliderMax = tempSliderMin + scrollerWidth - stageWidth, tempInfiniteSliderOffset--;
                    }
                }
                distanceOffsetArray[distanceOffsetArray.length] = nodeOffset, xScrollDistanceArray[xScrollDistanceArray.length] = xScrollDistance;
            }
            var slideChanged = !1, newChildOffset = helpers.calcActiveOffset(settings, nodeOffset, tempChildrenOffsets, stageWidth, tempInfiniteSliderOffset, numberOfSlides, activeChildOffsets[sliderNumber], sliderNumber), tempOffset = (newChildOffset + tempInfiniteSliderOffset + numberOfSlides) % numberOfSlides;
            if (settings.snapToChildren && (settings.infiniteSlider ? tempOffset != activeChildInfOffsets[sliderNumber] && (slideChanged = !0) : newChildOffset != activeChildOffsets[sliderNumber] && (slideChanged = !0), 
            0 > snapDirection && !slideChanged ? (newChildOffset++, newChildOffset >= childrenOffsets.length && !settings.infiniteSlider && (newChildOffset = childrenOffsets.length - 1)) : snapDirection > 0 && !slideChanged && (newChildOffset--, 
            0 > newChildOffset && !settings.infiniteSlider && (newChildOffset = 0))), settings.snapToChildren || (nodeOffset > -1 * sliderMin[sliderNumber] || nodeOffset < -1 * sliderMax[sliderNumber]) && !settings.infiniteSlider) {
                for ((nodeOffset > -1 * sliderMin[sliderNumber] || nodeOffset < -1 * sliderMax[sliderNumber]) && !settings.infiniteSlider ? distanceOffsetArray.splice(0, distanceOffsetArray.length) : (distanceOffsetArray.splice(.1 * distanceOffsetArray.length, distanceOffsetArray.length), 
                nodeOffset = distanceOffsetArray.length > 0 ? distanceOffsetArray[distanceOffsetArray.length - 1] : nodeOffset); nodeOffset < tempChildrenOffsets[newChildOffset] - .5 || nodeOffset > tempChildrenOffsets[newChildOffset] + .5; ) nodeOffset = (nodeOffset - tempChildrenOffsets[newChildOffset]) * snapFrictionCoefficient + tempChildrenOffsets[newChildOffset], 
                distanceOffsetArray[distanceOffsetArray.length] = nodeOffset;
                distanceOffsetArray[distanceOffsetArray.length] = tempChildrenOffsets[newChildOffset];
            }
            var jStart = 1;
            distanceOffsetArray.length % 2 != 0 && (jStart = 0);
            for (var j = 0; j < scrollTimeouts.length; j++) clearTimeout(scrollTimeouts[j]);
            for (var endOffset = (newChildOffset + tempInfiniteSliderOffset + numberOfSlides) % numberOfSlides, lastCheckOffset = 0, j = jStart; j < distanceOffsetArray.length; j += 2) (j == jStart || Math.abs(distanceOffsetArray[j] - lastCheckOffset) > 1 || j >= distanceOffsetArray.length - 2) && (lastCheckOffset = distanceOffsetArray[j], 
            scrollTimeouts[scrollTimeouts.length] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * j, node, slideNodes, distanceOffsetArray[j], scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, newChildOffset, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, endOffset, settings));
            var slideChanged = !1, tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
            settings.infiniteSlider ? tempOffset != activeChildInfOffsets[sliderNumber] && (slideChanged = !0) : newChildOffset != activeChildOffsets[sliderNumber] && (slideChanged = !0), 
            "" != settings.onSlideComplete && distanceOffsetArray.length > 1 && (scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (j + 1), settings, node, $(node).children(":eq(" + tempOffset + ")"), endOffset, sliderNumber)), 
            scrollTimeouts[scrollTimeouts.length] = helpers.updateBackfaceVisibilityTimer(scrollIntervalTime * (j + 1), slideNodes, sliderNumber, numberOfSlides, settings), 
            slideTimeouts[sliderNumber] = scrollTimeouts, helpers.hideScrollbar(settings, scrollTimeouts, j, distanceOffsetArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber);
        },
        onSlideComplete: function(settings, node, slideNode, newChildOffset, sliderNumber) {
            var args = (onChangeEventLastFired[sliderNumber] != newChildOffset ? !0 : !1, new helpers.args("complete", settings, $(node), slideNode, newChildOffset, newChildOffset));
            $(node).parent().data("args", args), "" != settings.onSlideComplete && settings.onSlideComplete(args), 
            onChangeEventLastFired[sliderNumber] = newChildOffset;
        },
        getSliderOffset: function(node, xy) {
            var sliderOffset = 0;
            if (xy = "x" == xy ? 4 : 5, !has3DTransform || isIe7 || isIe8) sliderOffset = parseInt($(node).css("left"), 10); else {
                for (var transformArray, transforms = new Array("-webkit-transform", "-moz-transform", "transform"), i = 0; i < transforms.length; i++) if (void 0 != $(node).css(transforms[i]) && $(node).css(transforms[i]).length > 0) {
                    transformArray = $(node).css(transforms[i]).split(",");
                    break;
                }
                sliderOffset = void 0 == transformArray[xy] ? 0 : parseInt(transformArray[xy], 10);
            }
            return sliderOffset;
        },
        setSliderOffset: function(node, sliderOffset) {
            sliderOffset = parseInt(sliderOffset, 10), !has3DTransform || isIe7 || isIe8 ? $(node).css({
                left: sliderOffset + "px"
            }) : $(node).css({
                msTransform: "matrix(1,0,0,1," + sliderOffset + ",0)",
                webkitTransform: "matrix(1,0,0,1," + sliderOffset + ",0)",
                MozTransform: "matrix(1,0,0,1," + sliderOffset + ",0)",
                transform: "matrix(1,0,0,1," + sliderOffset + ",0)"
            });
        },
        setBrowserInfo: function() {
            null != navigator.userAgent.match("WebKit") ? (isWebkit = !0, grabOutCursor = "-webkit-grab", 
            grabInCursor = "-webkit-grabbing") : null != navigator.userAgent.match("Gecko") ? (isGecko = !0, 
            grabOutCursor = "-moz-grab", grabInCursor = "-moz-grabbing") : null != navigator.userAgent.match("MSIE 7") ? (isIe7 = !0, 
            isIe = !0) : null != navigator.userAgent.match("MSIE 8") ? (isIe8 = !0, isIe = !0) : null != navigator.userAgent.match("MSIE 9") && (isIe9 = !0, 
            isIe = !0);
        },
        has3DTransform: function() {
            var has3D = !1, testElement = $("<div />").css({
                msTransform: "matrix(1,1,1,1,1,1)",
                webkitTransform: "matrix(1,1,1,1,1,1)",
                MozTransform: "matrix(1,1,1,1,1,1)",
                transform: "matrix(1,1,1,1,1,1)"
            });
            //bug in v21+ which does not render slides properly in 3D
            return "" == testElement.attr("style") ? has3D = !1 : isGecko && parseInt(navigator.userAgent.split("/")[3], 10) >= 21 ? has3D = !1 : void 0 != testElement.attr("style") && (has3D = !0), 
            has3D;
        },
        getSlideNumber: function(slide, sliderNumber, numberOfSlides) {
            return (slide - infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
        },
        calcActiveOffset: function(settings, offset, childrenOffsets, stageWidth, infiniteSliderOffset, numberOfSlides, activeChildOffset, sliderNumber) {
            var newChildOffset, isFirst = !1, arrayOfOffsets = new Array();
            offset > childrenOffsets[0] && (newChildOffset = 0), offset < childrenOffsets[childrenOffsets.length - 1] && (newChildOffset = numberOfSlides - 1);
            for (var i = 0; i < childrenOffsets.length; i++) childrenOffsets[i] <= offset && childrenOffsets[i] > offset - stageWidth && (isFirst || childrenOffsets[i] == offset || (arrayOfOffsets[arrayOfOffsets.length] = childrenOffsets[i - 1]), 
            arrayOfOffsets[arrayOfOffsets.length] = childrenOffsets[i], isFirst = !0);
            0 == arrayOfOffsets.length && (arrayOfOffsets[0] = childrenOffsets[childrenOffsets.length - 1]);
            for (var distance = stageWidth, closestChildOffset = 0, i = 0; i < arrayOfOffsets.length; i++) {
                var newDistance = Math.abs(offset - arrayOfOffsets[i]);
                distance > newDistance && (closestChildOffset = arrayOfOffsets[i], distance = newDistance);
            }
            for (var i = 0; i < childrenOffsets.length; i++) closestChildOffset == childrenOffsets[i] && (newChildOffset = i);
            return newChildOffset;
        },
        changeSlide: function(slide, node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {
            helpers.autoSlidePause(sliderNumber);
            for (var j = 0; j < scrollTimeouts.length; j++) clearTimeout(scrollTimeouts[j]);
            var steps = Math.ceil(settings.autoSlideTransTimer / 10) + 1, startOffset = helpers.getSliderOffset(node, "x"), endOffset = childrenOffsets[slide], offsetDiff = endOffset - startOffset, direction = slide - (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
            if (settings.infiniteSlider) {
                slide = (slide - infiniteSliderOffset[sliderNumber] + 2 * numberOfSlides) % numberOfSlides;
                var appendArray = !1;
                0 == slide && 2 == numberOfSlides && (slide = numberOfSlides, childrenOffsets[slide] = childrenOffsets[slide - 1] - $(slideNodes).eq(0).outerWidth(!0), 
                appendArray = !0), endOffset = childrenOffsets[slide], offsetDiff = endOffset - startOffset;
                var offsets = new Array(childrenOffsets[slide] - $(node).width(), childrenOffsets[slide] + $(node).width());
                appendArray && childrenOffsets.splice(childrenOffsets.length - 1, 1);
                for (var i = 0; i < offsets.length; i++) Math.abs(offsets[i] - startOffset) < Math.abs(offsetDiff) && (offsetDiff = offsets[i] - startOffset);
            }
            0 > offsetDiff && -1 == direction ? offsetDiff += $(node).width() : offsetDiff > 0 && 1 == direction && (offsetDiff -= $(node).width());
            var t, nextStep, stepArray = new Array();
            helpers.showScrollbar(settings, scrollbarClass);
            for (var i = 0; steps >= i; i++) t = i, t /= steps, t--, nextStep = startOffset + offsetDiff * (Math.pow(t, 5) + 1), 
            stepArray[stepArray.length] = nextStep;
            for (var tempOffset = (slide + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides, lastCheckOffset = 0, i = 0; i < stepArray.length; i++) if ((0 == i || Math.abs(stepArray[i] - lastCheckOffset) > 1 || i >= stepArray.length - 2) && (lastCheckOffset = stepArray[i], 
            scrollTimeouts[i] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * (i + 1), node, slideNodes, stepArray[i], scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, tempOffset, settings)), 
            0 == i && "" != settings.onSlideStart) {
                var tempOffset2 = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
                settings.onSlideStart(new helpers.args("start", settings, node, $(node).children(":eq(" + tempOffset2 + ")"), tempOffset2, slide));
            }
            var slideChanged = !1;
            settings.infiniteSlider ? tempOffset != activeChildInfOffsets[sliderNumber] && (slideChanged = !0) : slide != activeChildOffsets[sliderNumber] && (slideChanged = !0), 
            slideChanged && "" != settings.onSlideComplete && (scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (i + 1), settings, node, $(node).children(":eq(" + tempOffset + ")"), tempOffset, sliderNumber)), 
            /*scrollTimeouts[scrollTimeouts.length] = setTimeout(function() {
				activeChildOffsets[sliderNumber] = activeChildOffsets[sliderNumber];
			}, scrollIntervalTime * (i + 1));*/
            slideTimeouts[sliderNumber] = scrollTimeouts, helpers.hideScrollbar(settings, scrollTimeouts, i, stepArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber), 
            helpers.autoSlide(node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
        },
        changeOffset: function(endOffset, node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {
            helpers.autoSlidePause(sliderNumber);
            for (var j = 0; j < scrollTimeouts.length; j++) clearTimeout(scrollTimeouts[j]);
            settings.infiniteSlider || (endOffset = endOffset > -1 * sliderMin[sliderNumber] + centeredSlideOffset ? -1 * sliderMin[sliderNumber] + centeredSlideOffset : endOffset, 
            endOffset = endOffset < -1 * sliderMax[sliderNumber] ? -1 * sliderMax[sliderNumber] : endOffset);
            var steps = Math.ceil(settings.autoSlideTransTimer / 10) + 1, startOffset = helpers.getSliderOffset(node, "x"), slide = (helpers.calcActiveOffset(settings, endOffset, childrenOffsets, stageWidth, infiniteSliderOffset, numberOfSlides, activeChildOffsets[sliderNumber], sliderNumber) + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides, testOffsets = childrenOffsets.slice();
            if (settings.snapToChildren && !settings.infiniteSlider) endOffset = childrenOffsets[slide]; else if (settings.infiniteSlider && settings.snapToChildren) {
                for (;endOffset >= testOffsets[0]; ) testOffsets.splice(0, 0, testOffsets[numberOfSlides - 1] + $(node).width()), 
                testOffsets.splice(numberOfSlides, 1);
                for (;endOffset <= testOffsets[numberOfSlides - 1]; ) testOffsets.splice(numberOfSlides, 0, testOffsets[0] - $(node).width()), 
                testOffsets.splice(0, 1);
                slide = helpers.calcActiveOffset(settings, endOffset, testOffsets, stageWidth, infiniteSliderOffset, numberOfSlides, activeChildOffsets[sliderNumber], sliderNumber), 
                endOffset = testOffsets[slide];
            }
            var t, nextStep, offsetDiff = endOffset - startOffset, stepArray = new Array();
            helpers.showScrollbar(settings, scrollbarClass);
            for (var i = 0; steps >= i; i++) t = i, t /= steps, t--, nextStep = startOffset + offsetDiff * (Math.pow(t, 5) + 1), 
            stepArray[stepArray.length] = nextStep;
            for (var tempOffset = (slide + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides, lastCheckOffset = 0, i = 0; i < stepArray.length; i++) if ((0 == i || Math.abs(stepArray[i] - lastCheckOffset) > 1 || i >= stepArray.length - 2) && (lastCheckOffset = stepArray[i], 
            scrollTimeouts[i] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * (i + 1), node, slideNodes, stepArray[i], scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, tempOffset, settings)), 
            0 == i && "" != settings.onSlideStart) {
                var tempOffset = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
                settings.onSlideStart(new helpers.args("start", settings, node, $(node).children(":eq(" + tempOffset + ")"), tempOffset, slide));
            }
            var slideChanged = !1;
            settings.infiniteSlider ? tempOffset != activeChildInfOffsets[sliderNumber] && (slideChanged = !0) : slide != activeChildOffsets[sliderNumber] && (slideChanged = !0), 
            slideChanged && "" != settings.onSlideComplete && (scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (i + 1), settings, node, $(node).children(":eq(" + tempOffset + ")"), tempOffset, sliderNumber)), 
            slideTimeouts[sliderNumber] = scrollTimeouts, helpers.hideScrollbar(settings, scrollTimeouts, i, stepArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber), 
            helpers.autoSlide(node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
        },
        autoSlide: function(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {
            return iosSliderSettings[sliderNumber].autoSlide ? (helpers.autoSlidePause(sliderNumber), 
            void (autoSlideTimeouts[sliderNumber] = setTimeout(function() {
                !settings.infiniteSlider && activeChildOffsets[sliderNumber] > childrenOffsets.length - 1 && (activeChildOffsets[sliderNumber] = activeChildOffsets[sliderNumber] - numberOfSlides);
                var nextSlide = activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + 1;
                helpers.changeSlide(nextSlide, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings), 
                helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
            }, settings.autoSlideTimer + settings.autoSlideTransTimer))) : !1;
        },
        autoSlidePause: function(sliderNumber) {
            clearTimeout(autoSlideTimeouts[sliderNumber]);
        },
        isUnselectable: function(node, settings) {
            return "" != settings.unselectableSelector && 1 == $(node).closest(settings.unselectableSelector).length ? !0 : !1;
        },
        /* timers */
        slowScrollHorizontalIntervalTimer: function(scrollIntervalTime, node, slideNodes, step, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, endOffset, settings) {
            var scrollTimeout = setTimeout(function() {
                helpers.slowScrollHorizontalInterval(node, slideNodes, step, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, endOffset, settings);
            }, scrollIntervalTime);
            return scrollTimeout;
        },
        onSlideCompleteTimer: function(scrollIntervalTime, settings, node, slideNode, slide, scrollbarNumber) {
            var scrollTimeout = setTimeout(function() {
                helpers.onSlideComplete(settings, node, slideNode, slide, scrollbarNumber);
            }, scrollIntervalTime);
            return scrollTimeout;
        },
        hideScrollbarIntervalTimer: function(scrollIntervalTime, newOffset, opacity, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings) {
            var scrollTimeout = setTimeout(function() {
                helpers.hideScrollbarInterval(newOffset, opacity, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings);
            }, scrollIntervalTime);
            return scrollTimeout;
        },
        updateBackfaceVisibilityTimer: function(scrollIntervalTime, slideNodes, sliderNumber, numberOfSlides, settings) {
            var scrollTimeout = setTimeout(function() {
                helpers.updateBackfaceVisibility(slideNodes, sliderNumber, numberOfSlides, settings);
            }, scrollIntervalTime);
            return scrollTimeout;
        },
        updateBackfaceVisibility: function(slideNodes, sliderNumber, numberOfSlides, settings) {
            //loop through buffered slides
            for (var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides, usedSlideArray = Array(), i = 0; i < 2 * settings.hardwareAccelBuffer; i++) {
                var slide_eq = helpers.mod(slide + i - settings.hardwareAccelBuffer, numberOfSlides);
                //check if backface visibility applied
                if ("visible" == $(slideNodes).eq(slide_eq).css("-webkit-backface-visibility")) {
                    usedSlideArray[usedSlideArray.length] = slide_eq;
                    var eq_h = helpers.mod(slide_eq + 2 * settings.hardwareAccelBuffer, numberOfSlides), eq_l = helpers.mod(slide_eq - 2 * settings.hardwareAccelBuffer, numberOfSlides);
                    //buffer backface visibility
                    $(slideNodes).eq(slide_eq).css("-webkit-backface-visibility", "hidden"), -1 == usedSlideArray.indexOf(eq_l) && $(slideNodes).eq(eq_l).css("-webkit-backface-visibility", ""), 
                    -1 == usedSlideArray.indexOf(eq_h) && $(slideNodes).eq(eq_h).css("-webkit-backface-visibility", "");
                }
            }
        },
        mod: function(x, mod) {
            var rem = x % mod;
            return 0 > rem ? rem + mod : rem;
        },
        args: function(func, settings, node, activeSlideNode, newChildOffset, targetSlideOffset) {
            this.prevSlideNumber = void 0 == $(node).parent().data("args") ? void 0 : $(node).parent().data("args").prevSlideNumber, 
            this.prevSlideObject = void 0 == $(node).parent().data("args") ? void 0 : $(node).parent().data("args").prevSlideObject, 
            this.targetSlideNumber = targetSlideOffset + 1, this.targetSlideObject = $(node).children(":eq(" + targetSlideOffset + ")"), 
            this.slideChanged = !1, "load" == func ? (this.targetSlideNumber = void 0, this.targetSlideObject = void 0) : "start" == func ? (this.targetSlideNumber = void 0, 
            this.targetSlideObject = void 0) : "change" == func ? (this.slideChanged = !0, this.prevSlideNumber = void 0 == $(node).parent().data("args") ? settings.startAtSlide : $(node).parent().data("args").currentSlideNumber, 
            this.prevSlideObject = $(node).children(":eq(" + this.prevSlideNumber + ")")) : "complete" == func && (this.slideChanged = $(node).parent().data("args").slideChanged), 
            this.settings = settings, this.data = $(node).parent().data("iosslider"), this.sliderObject = node, 
            this.sliderContainerObject = $(node).parent(), this.currentSlideObject = activeSlideNode, 
            this.currentSlideNumber = newChildOffset + 1, this.currentSliderOffset = -1 * helpers.getSliderOffset(node, "x");
        },
        preventDrag: function(event) {
            event.preventDefault();
        },
        preventClick: function(event) {
            return event.stopImmediatePropagation(), !1;
        },
        enableClick: function() {
            return !0;
        }
    };
    helpers.setBrowserInfo();
    var methods = {
        init: function(options, node) {
            has3DTransform = helpers.has3DTransform();
            var settings = $.extend(!0, {
                elasticPullResistance: .6,
                frictionCoefficient: .92,
                elasticFrictionCoefficient: .6,
                snapFrictionCoefficient: .92,
                snapToChildren: !1,
                snapSlideCenter: !1,
                startAtSlide: 1,
                scrollbar: !1,
                scrollbarDrag: !1,
                scrollbarHide: !0,
                scrollbarPaging: !1,
                scrollbarLocation: "top",
                scrollbarContainer: "",
                scrollbarOpacity: .4,
                scrollbarHeight: "4px",
                scrollbarBorder: "0",
                scrollbarMargin: "5px",
                scrollbarBackground: "#000",
                scrollbarBorderRadius: "100px",
                scrollbarShadow: "0 0 0 #000",
                scrollbarElasticPullResistance: .9,
                desktopClickDrag: !1,
                keyboardControls: !1,
                tabToAdvance: !1,
                responsiveSlideContainer: !0,
                responsiveSlides: !0,
                navSlideSelector: "",
                navPrevSelector: "",
                navNextSelector: "",
                autoSlideToggleSelector: "",
                autoSlide: !1,
                autoSlideTimer: 5e3,
                autoSlideTransTimer: 750,
                autoSlideHoverPause: !0,
                infiniteSlider: !1,
                snapVelocityThreshold: 5,
                slideStartVelocityThreshold: 0,
                horizontalSlideLockThreshold: 5,
                verticalSlideLockThreshold: 3,
                hardwareAccelBuffer: 5,
                stageCSS: {
                    position: "relative",
                    top: "0",
                    left: "0",
                    overflow: "hidden",
                    zIndex: 1
                },
                unselectableSelector: "",
                onSliderLoaded: "",
                onSliderUpdate: "",
                onSliderResize: "",
                onSlideStart: "",
                onSlideChange: "",
                onSlideComplete: ""
            }, options);
            return void 0 == node && (node = this), $(node).each(function(i) {
                function init() {
                    helpers.autoSlidePause(sliderNumber), anchorEvents = $(scrollerNode).find("a"), 
                    onclickEvents = $(scrollerNode).find("[onclick]"), allScrollerNodeChildren = $(scrollerNode).find("*"), 
                    $(stageNode).css("width", ""), $(stageNode).css("height", ""), $(scrollerNode).css("width", ""), 
                    slideNodes = $(scrollerNode).children().not("script").get(), slideNodeWidths = new Array(), 
                    slideNodeOuterWidths = new Array(), settings.responsiveSlides && $(slideNodes).css("width", ""), 
                    sliderMax[sliderNumber] = 0, childrenOffsets = new Array(), containerWidth = $(stageNode).parent().width(), 
                    stageWidth = $(stageNode).outerWidth(!0), settings.responsiveSlideContainer && (stageWidth = $(stageNode).outerWidth(!0) > containerWidth ? containerWidth : $(stageNode).width()), 
                    $(stageNode).css({
                        position: settings.stageCSS.position,
                        top: settings.stageCSS.top,
                        left: settings.stageCSS.left,
                        overflow: settings.stageCSS.overflow,
                        zIndex: settings.stageCSS.zIndex,
                        webkitPerspective: 1e3,
                        webkitBackfaceVisibility: "hidden",
                        msTouchAction: "pan-y",
                        width: stageWidth
                    }), $(settings.unselectableSelector).css({
                        cursor: "default"
                    });
                    for (var j = 0; j < slideNodes.length; j++) {
                        slideNodeWidths[j] = $(slideNodes[j]).width(), slideNodeOuterWidths[j] = $(slideNodes[j]).outerWidth(!0);
                        var newWidth = slideNodeOuterWidths[j];
                        settings.responsiveSlides && (slideNodeOuterWidths[j] > stageWidth ? (newWidth = stageWidth + -1 * (slideNodeOuterWidths[j] - slideNodeWidths[j]), 
                        slideNodeWidths[j] = newWidth, slideNodeOuterWidths[j] = stageWidth) : newWidth = slideNodeWidths[j], 
                        $(slideNodes[j]).css({
                            width: newWidth
                        })), $(slideNodes[j]).css({
                            overflow: "hidden",
                            position: "absolute"
                        }), childrenOffsets[j] = -1 * sliderMax[sliderNumber], sliderMax[sliderNumber] = sliderMax[sliderNumber] + newWidth + (slideNodeOuterWidths[j] - slideNodeWidths[j]);
                    }
                    settings.snapSlideCenter && (centeredSlideOffset = .5 * (stageWidth - slideNodeOuterWidths[0]), 
                    settings.responsiveSlides && slideNodeOuterWidths[0] > stageWidth && (centeredSlideOffset = 0)), 
                    sliderAbsMax[sliderNumber] = 2 * sliderMax[sliderNumber];
                    for (var j = 0; j < slideNodes.length; j++) helpers.setSliderOffset($(slideNodes[j]), -1 * childrenOffsets[j] + sliderMax[sliderNumber] + centeredSlideOffset), 
                    childrenOffsets[j] = childrenOffsets[j] - sliderMax[sliderNumber];
                    if (!settings.infiniteSlider && !settings.snapSlideCenter) {
                        for (var i = 0; i < childrenOffsets.length && !(childrenOffsets[i] <= -1 * (2 * sliderMax[sliderNumber] - stageWidth)); i++) lastChildOffset = i;
                        childrenOffsets.splice(lastChildOffset + 1, childrenOffsets.length), childrenOffsets[childrenOffsets.length] = -1 * (2 * sliderMax[sliderNumber] - stageWidth);
                    }
                    for (var i = 0; i < childrenOffsets.length; i++) originalOffsets[i] = childrenOffsets[i];
                    if (isFirstInit && (iosSliderSettings[sliderNumber].startAtSlide = iosSliderSettings[sliderNumber].startAtSlide > childrenOffsets.length ? childrenOffsets.length : iosSliderSettings[sliderNumber].startAtSlide, 
                    settings.infiniteSlider ? (iosSliderSettings[sliderNumber].startAtSlide = (iosSliderSettings[sliderNumber].startAtSlide - 1 + numberOfSlides) % numberOfSlides, 
                    activeChildOffsets[sliderNumber] = iosSliderSettings[sliderNumber].startAtSlide) : (iosSliderSettings[sliderNumber].startAtSlide = iosSliderSettings[sliderNumber].startAtSlide - 1 < 0 ? childrenOffsets.length - 1 : iosSliderSettings[sliderNumber].startAtSlide, 
                    activeChildOffsets[sliderNumber] = iosSliderSettings[sliderNumber].startAtSlide - 1), 
                    activeChildInfOffsets[sliderNumber] = activeChildOffsets[sliderNumber]), sliderMin[sliderNumber] = sliderMax[sliderNumber] + centeredSlideOffset, 
                    $(scrollerNode).css({
                        position: "relative",
                        cursor: grabOutCursor,
                        webkitPerspective: "0",
                        webkitBackfaceVisibility: "hidden",
                        width: sliderMax[sliderNumber] + "px"
                    }), scrollerWidth = sliderMax[sliderNumber], sliderMax[sliderNumber] = 2 * sliderMax[sliderNumber] - stageWidth + 2 * centeredSlideOffset, 
                    shortContent = stageWidth > scrollerWidth + centeredSlideOffset || 0 == stageWidth ? !0 : !1, 
                    shortContent && $(scrollerNode).css({
                        cursor: "default"
                    }), containerHeight = $(stageNode).parent().outerHeight(!0), stageHeight = $(stageNode).height(), 
                    settings.responsiveSlideContainer && (stageHeight = stageHeight > containerHeight ? containerHeight : stageHeight), 
                    $(stageNode).css({
                        height: stageHeight
                    }), helpers.setSliderOffset(scrollerNode, childrenOffsets[activeChildOffsets[sliderNumber]]), 
                    settings.infiniteSlider && !shortContent) {
                        for (var currentScrollOffset = helpers.getSliderOffset($(scrollerNode), "x"), count = (infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides * -1; 0 > count; ) {
                            var lowSlideNumber = 0, lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), "x");
                            $(slideNodes).each(function(i) {
                                helpers.getSliderOffset(this, "x") < lowSlideOffset && (lowSlideOffset = helpers.getSliderOffset(this, "x"), 
                                lowSlideNumber = i);
                            });
                            var newOffset = sliderMin[sliderNumber] + scrollerWidth;
                            helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset), sliderMin[sliderNumber] = -1 * childrenOffsets[1] + centeredSlideOffset, 
                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                            childrenOffsets.splice(0, 1), childrenOffsets.splice(childrenOffsets.length, 0, -1 * newOffset + centeredSlideOffset), 
                            count++;
                        }
                        for (;-1 * childrenOffsets[0] - scrollerWidth + centeredSlideOffset > 0 && settings.snapSlideCenter && isFirstInit; ) {
                            var highSlideNumber = 0, highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), "x");
                            $(slideNodes).each(function(i) {
                                helpers.getSliderOffset(this, "x") > highSlideOffset && (highSlideOffset = helpers.getSliderOffset(this, "x"), 
                                highSlideNumber = i);
                            });
                            var newOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                            helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset), childrenOffsets.splice(0, 0, -1 * newOffset + centeredSlideOffset), 
                            childrenOffsets.splice(childrenOffsets.length - 1, 1), sliderMin[sliderNumber] = -1 * childrenOffsets[0] + centeredSlideOffset, 
                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                            infiniteSliderOffset[sliderNumber]--, activeChildOffsets[sliderNumber]++;
                        }
                        for (;currentScrollOffset <= -1 * sliderMax[sliderNumber]; ) {
                            var lowSlideNumber = 0, lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), "x");
                            $(slideNodes).each(function(i) {
                                helpers.getSliderOffset(this, "x") < lowSlideOffset && (lowSlideOffset = helpers.getSliderOffset(this, "x"), 
                                lowSlideNumber = i);
                            });
                            var newOffset = sliderMin[sliderNumber] + scrollerWidth;
                            helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset), sliderMin[sliderNumber] = -1 * childrenOffsets[1] + centeredSlideOffset, 
                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                            childrenOffsets.splice(0, 1), childrenOffsets.splice(childrenOffsets.length, 0, -1 * newOffset + centeredSlideOffset), 
                            infiniteSliderOffset[sliderNumber]++, activeChildOffsets[sliderNumber]--;
                        }
                    }
                    return helpers.setSliderOffset(scrollerNode, childrenOffsets[activeChildOffsets[sliderNumber]]), 
                    helpers.updateBackfaceVisibility(slideNodes, sliderNumber, numberOfSlides, settings), 
                    settings.desktopClickDrag || $(scrollerNode).css({
                        cursor: "default"
                    }), settings.scrollbar && ($("." + scrollbarBlockClass).css({
                        margin: settings.scrollbarMargin,
                        overflow: "hidden",
                        display: "none"
                    }), $("." + scrollbarBlockClass + " ." + scrollbarClass).css({
                        border: settings.scrollbarBorder
                    }), scrollMargin = parseInt($("." + scrollbarBlockClass).css("marginLeft")) + parseInt($("." + scrollbarBlockClass).css("marginRight")), 
                    scrollBorder = parseInt($("." + scrollbarBlockClass + " ." + scrollbarClass).css("borderLeftWidth"), 10) + parseInt($("." + scrollbarBlockClass + " ." + scrollbarClass).css("borderRightWidth"), 10), 
                    scrollbarStageWidth = "" != settings.scrollbarContainer ? $(settings.scrollbarContainer).width() : stageWidth, 
                    scrollbarWidth = stageWidth / scrollerWidth * (scrollbarStageWidth - scrollMargin), 
                    settings.scrollbarHide || (scrollbarStartOpacity = settings.scrollbarOpacity), $("." + scrollbarBlockClass).css({
                        position: "absolute",
                        left: 0,
                        width: scrollbarStageWidth - scrollMargin + "px",
                        margin: settings.scrollbarMargin
                    }), "top" == settings.scrollbarLocation ? $("." + scrollbarBlockClass).css("top", "0") : $("." + scrollbarBlockClass).css("bottom", "0"), 
                    $("." + scrollbarBlockClass + " ." + scrollbarClass).css({
                        borderRadius: settings.scrollbarBorderRadius,
                        background: settings.scrollbarBackground,
                        height: settings.scrollbarHeight,
                        width: scrollbarWidth - scrollBorder + "px",
                        minWidth: settings.scrollbarHeight,
                        border: settings.scrollbarBorder,
                        webkitPerspective: 1e3,
                        webkitBackfaceVisibility: "hidden",
                        position: "relative",
                        opacity: scrollbarStartOpacity,
                        filter: "alpha(opacity:" + 100 * scrollbarStartOpacity + ")",
                        boxShadow: settings.scrollbarShadow
                    }), helpers.setSliderOffset($("." + scrollbarBlockClass + " ." + scrollbarClass), Math.floor((-1 * childrenOffsets[activeChildOffsets[sliderNumber]] - sliderMin[sliderNumber] + centeredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageWidth - scrollMargin - scrollbarWidth))), 
                    $("." + scrollbarBlockClass).css({
                        display: "block"
                    }), scrollbarNode = $("." + scrollbarBlockClass + " ." + scrollbarClass), scrollbarBlockNode = $("." + scrollbarBlockClass)), 
                    settings.scrollbarDrag && !shortContent && $("." + scrollbarBlockClass + " ." + scrollbarClass).css({
                        cursor: grabOutCursor
                    }), settings.infiniteSlider && (infiniteSliderWidth = (sliderMax[sliderNumber] + stageWidth) / 3), 
                    "" != settings.navSlideSelector && $(settings.navSlideSelector).each(function(j) {
                        $(this).css({
                            cursor: "pointer"
                        }), $(this).unbind(clickEvent).bind(clickEvent, function(e) {
                            "touchstart" == e.type ? $(this).unbind("click.iosSliderEvent") : $(this).unbind("touchstart.iosSliderEvent"), 
                            clickEvent = e.type + ".iosSliderEvent", helpers.changeSlide(j, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                        });
                    }), "" != settings.navPrevSelector && ($(settings.navPrevSelector).css({
                        cursor: "pointer"
                    }), $(settings.navPrevSelector).unbind(clickEvent).bind(clickEvent, function(e) {
                        "touchstart" == e.type ? $(this).unbind("click.iosSliderEvent") : $(this).unbind("touchstart.iosSliderEvent"), 
                        clickEvent = e.type + ".iosSliderEvent";
                        var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
                        (slide > 0 || settings.infiniteSlider) && helpers.changeSlide(slide - 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                    })), "" != settings.navNextSelector && ($(settings.navNextSelector).css({
                        cursor: "pointer"
                    }), $(settings.navNextSelector).unbind(clickEvent).bind(clickEvent, function(e) {
                        "touchstart" == e.type ? $(this).unbind("click.iosSliderEvent") : $(this).unbind("touchstart.iosSliderEvent"), 
                        clickEvent = e.type + ".iosSliderEvent";
                        var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
                        (slide < childrenOffsets.length - 1 || settings.infiniteSlider) && helpers.changeSlide(slide + 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                    })), settings.autoSlide && !shortContent && "" != settings.autoSlideToggleSelector && ($(settings.autoSlideToggleSelector).css({
                        cursor: "pointer"
                    }), $(settings.autoSlideToggleSelector).unbind(clickEvent).bind(clickEvent, function(e) {
                        "touchstart" == e.type ? $(this).unbind("click.iosSliderEvent") : $(this).unbind("touchstart.iosSliderEvent"), 
                        clickEvent = e.type + ".iosSliderEvent", isAutoSlideToggleOn ? (helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings), 
                        isAutoSlideToggleOn = !1, $(settings.autoSlideToggleSelector).removeClass("on")) : (helpers.autoSlidePause(sliderNumber), 
                        isAutoSlideToggleOn = !0, $(settings.autoSlideToggleSelector).addClass("on"));
                    })), helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings), 
                    $(stageNode).bind("mouseleave.iosSliderEvent", function() {
                        return isAutoSlideToggleOn ? !0 : void helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                    }), $(stageNode).bind("touchend.iosSliderEvent", function() {
                        return isAutoSlideToggleOn ? !0 : void helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                    }), settings.autoSlideHoverPause && $(stageNode).bind("mouseenter.iosSliderEvent", function() {
                        helpers.autoSlidePause(sliderNumber);
                    }), $(stageNode).data("iosslider", {
                        obj: $this,
                        settings: settings,
                        scrollerNode: scrollerNode,
                        slideNodes: slideNodes,
                        numberOfSlides: numberOfSlides,
                        centeredSlideOffset: centeredSlideOffset,
                        sliderNumber: sliderNumber,
                        originalOffsets: originalOffsets,
                        childrenOffsets: childrenOffsets,
                        sliderMax: sliderMax[sliderNumber],
                        scrollbarClass: scrollbarClass,
                        scrollbarWidth: scrollbarWidth,
                        scrollbarStageWidth: scrollbarStageWidth,
                        stageWidth: stageWidth,
                        scrollMargin: scrollMargin,
                        scrollBorder: scrollBorder,
                        infiniteSliderOffset: infiniteSliderOffset[sliderNumber],
                        infiniteSliderWidth: infiniteSliderWidth,
                        slideNodeOuterWidths: slideNodeOuterWidths,
                        shortContent: shortContent
                    }), isFirstInit = !1, !0;
                }
                scrollbarNumber++;
                var sliderNumber = scrollbarNumber, scrollTimeouts = new Array();
                iosSliderSettings[sliderNumber] = $.extend({}, settings), sliderMin[sliderNumber] = 0, 
                sliderMax[sliderNumber] = 0;
                var scrollbarNode, scrollbarBlockNode, scrollbarStageWidth, scrollbarWidth, containerWidth, containerHeight, stageWidth, stageHeight, scrollMargin, scrollBorder, lastTouch, childrenOffsets, slideNodes, slideNodeWidths, slideNodeOuterWidths, infiniteSliderWidth, xCurrentScrollRate = new Array(0, 0), yCurrentScrollRate = new Array(0, 0), scrollbarBlockClass = "scrollbarBlock" + scrollbarNumber, scrollbarClass = "scrollbar" + scrollbarNumber, centeredSlideOffset = 0, stageNode = $(this), isFirstInit = !0, newChildOffset = -1, originalOffsets = (new Array(), 
                new Array()), scrollbarStartOpacity = 0, xScrollStartPosition = 0, yScrollStartPosition = 0, currentTouches = 0, scrollerNode = $(this).children(":first-child"), numberOfSlides = $(scrollerNode).children().not("script").length, xScrollStarted = !1, lastChildOffset = 0, isMouseDown = !1, currentSlider = void 0;
                infiniteSliderOffset[sliderNumber] = 0;
                var shortContent = !1;
                onChangeEventLastFired[sliderNumber] = -1;
                var isAutoSlideToggleOn = !1;
                iosSliders[sliderNumber] = stageNode, isEventCleared[sliderNumber] = !1;
                var currentEventNode, scrollerWidth, anchorEvents, onclickEvents, allScrollerNodeChildren, preventXScroll = !1, snapOverride = !1, clickEvent = "touchstart.iosSliderEvent click.iosSliderEvent";
                touchLocks[sliderNumber] = !1, slideTimeouts[sliderNumber] = new Array(), settings.scrollbarDrag && (settings.scrollbar = !0, 
                settings.scrollbarHide = !1);
                var $this = $(this), data = $this.data("iosslider");
                if (void 0 != data) return !0;
                Math.floor(12317 * Math.random());
                if (//$(scrollerNode).parent().append("<i class = 'i" + xClass + "'></i>").append("<i class = 'i" + xClass + "'></i>");
                //$('.i' + xClass).css({ position: 'absolute', right: '10px', bottom: '10px', zIndex: 1000, fontStyle: 'normal', background: '#fff', opacity: 0.2 }).eq(1).css({ bottom: 'auto', right: 'auto', top: '10px', left: '10px' });
                //for(var i = 0; i < xArray.length; i++) { $('.i' + xClass).html($('.i' + xClass).html() + xArray[i]); }
                parseInt($().jquery.split(".").join(""), 10) >= 14.2 ? $(this).delegate("img", "dragstart.iosSliderEvent", function(event) {
                    event.preventDefault();
                }) : $(this).find("img").bind("dragstart.iosSliderEvent", function(event) {
                    event.preventDefault();
                }), settings.infiniteSlider && (settings.scrollbar = !1), settings.infiniteSlider && 1 == numberOfSlides && (settings.infiniteSlider = !1), 
                settings.scrollbar && ("" != settings.scrollbarContainer ? $(settings.scrollbarContainer).append("<div class = '" + scrollbarBlockClass + "'><div class = '" + scrollbarClass + "'></div></div>") : $(scrollerNode).parent().append("<div class = '" + scrollbarBlockClass + "'><div class = '" + scrollbarClass + "'></div></div>")), 
                !init()) return !0;
                $(this).find("a").bind("mousedown", helpers.preventDrag), $(this).find("[onclick]").bind("click", helpers.preventDrag).each(function() {
                    $(this).data("onclick", this.onclick);
                });
                var newChildOffset = helpers.calcActiveOffset(settings, helpers.getSliderOffset($(scrollerNode), "x"), childrenOffsets, stageWidth, infiniteSliderOffset[sliderNumber], numberOfSlides, void 0, sliderNumber), tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides, args = new helpers.args("load", settings, scrollerNode, $(scrollerNode).children(":eq(" + tempOffset + ")"), tempOffset, tempOffset);
                if ($(stageNode).data("args", args), "" != settings.onSliderLoaded && settings.onSliderLoaded(args), 
                onChangeEventLastFired[sliderNumber] = tempOffset, settings.scrollbarPaging && settings.scrollbar && !shortContent && ($(scrollbarBlockNode).css("cursor", "pointer"), 
                $(scrollbarBlockNode).bind("click.iosSliderEvent", function(e) {
                    this == e.target && (e.pageX > $(scrollbarNode).offset().left ? methods.nextPage(stageNode) : methods.prevPage(stageNode));
                })), iosSliderSettings[sliderNumber].responsiveSlides || iosSliderSettings[sliderNumber].responsiveSlideContainer) {
                    var orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
                    $(window).bind(orientationEvent + ".iosSliderEvent-" + sliderNumber, function() {
                        if (!init()) return !0;
                        var args = $(stageNode).data("args");
                        "" != settings.onSliderResize && settings.onSliderResize(args);
                    });
                }
                if (!settings.keyboardControls && !settings.tabToAdvance || shortContent || $(document).bind("keydown.iosSliderEvent", function(e) {
                    if (!isIe7 && !isIe8) var e = e.originalEvent;
                    if (touchLocks[sliderNumber]) return !0;
                    if (37 == e.keyCode && settings.keyboardControls) {
                        e.preventDefault();
                        var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
                        (slide > 0 || settings.infiniteSlider) && helpers.changeSlide(slide - 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                    } else if (39 == e.keyCode && settings.keyboardControls || 9 == e.keyCode && settings.tabToAdvance) {
                        e.preventDefault();
                        var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
                        (slide < childrenOffsets.length - 1 || settings.infiniteSlider) && helpers.changeSlide(slide + 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                    }
                }), isTouch || settings.desktopClickDrag) {
                    var touchStartFlag = !1, touchEndFlag = !1, touchSelection = $(scrollerNode), touchSelectionMove = $(scrollerNode), isUnselectable = !1;
                    settings.scrollbarDrag && (touchSelection = touchSelection.add(scrollbarNode), touchSelectionMove = touchSelectionMove.add(scrollbarBlockNode)), 
                    $(touchSelection).bind("mousedown.iosSliderEvent touchstart.iosSliderEvent", function(e) {
                        if (//if scroll starts, unbind dom from slider touch override
                        $(window).one("scroll.iosSliderEvent", function(e) {
                            touchStartFlag = !1;
                        }), touchStartFlag) return !0;
                        if (touchStartFlag = !0, touchEndFlag = !1, "touchstart" == e.type ? $(touchSelectionMove).unbind("mousedown.iosSliderEvent") : $(touchSelectionMove).unbind("touchstart.iosSliderEvent"), 
                        touchLocks[sliderNumber] || shortContent) return touchStartFlag = !1, xScrollStarted = !1, 
                        !0;
                        if (isUnselectable = helpers.isUnselectable(e.target, settings)) return touchStartFlag = !1, 
                        xScrollStarted = !1, !0;
                        if (currentEventNode = $(this)[0] === $(scrollbarNode)[0] ? scrollbarNode : scrollerNode, 
                        !isIe7 && !isIe8) var e = e.originalEvent;
                        if (helpers.autoSlidePause(sliderNumber), allScrollerNodeChildren.unbind(".disableClick"), 
                        "touchstart" == e.type) eventX = e.touches[0].pageX, eventY = e.touches[0].pageY; else {
                            if (window.getSelection) window.getSelection().empty ? window.getSelection().empty() : window.getSelection().removeAllRanges && window.getSelection().removeAllRanges(); else if (document.selection) if (isIe8) try {
                                document.selection.empty();
                            } catch (e) {} else document.selection.empty();
                            eventX = e.pageX, eventY = e.pageY, isMouseDown = !0, currentSlider = scrollerNode, 
                            $(this).css({
                                cursor: grabInCursor
                            });
                        }
                        xCurrentScrollRate = new Array(0, 0), yCurrentScrollRate = new Array(0, 0), xScrollDistance = 0, 
                        xScrollStarted = !1;
                        for (var j = 0; j < scrollTimeouts.length; j++) clearTimeout(scrollTimeouts[j]);
                        var scrollPosition = helpers.getSliderOffset(scrollerNode, "x");
                        scrollPosition > -1 * sliderMin[sliderNumber] + centeredSlideOffset + scrollerWidth ? (scrollPosition = -1 * sliderMin[sliderNumber] + centeredSlideOffset + scrollerWidth, 
                        helpers.setSliderOffset($("." + scrollbarClass), scrollPosition), $("." + scrollbarClass).css({
                            width: scrollbarWidth - scrollBorder + "px"
                        })) : scrollPosition < -1 * sliderMax[sliderNumber] && (scrollPosition = -1 * sliderMax[sliderNumber], 
                        helpers.setSliderOffset($("." + scrollbarClass), scrollbarStageWidth - scrollMargin - scrollbarWidth), 
                        $("." + scrollbarClass).css({
                            width: scrollbarWidth - scrollBorder + "px"
                        }));
                        var scrollbarSubtractor = $(this)[0] === $(scrollbarNode)[0] ? sliderMin[sliderNumber] : 0;
                        xScrollStartPosition = -1 * (helpers.getSliderOffset(this, "x") - eventX - scrollbarSubtractor), 
                        yScrollStartPosition = -1 * (helpers.getSliderOffset(this, "y") - eventY), xCurrentScrollRate[1] = eventX, 
                        yCurrentScrollRate[1] = eventY, snapOverride = !1;
                    }), $(document).bind("touchmove.iosSliderEvent mousemove.iosSliderEvent", function(e) {
                        if (!isIe7 && !isIe8) var e = e.originalEvent;
                        if (touchLocks[sliderNumber] || shortContent || isUnselectable || !touchStartFlag) return !0;
                        var edgeDegradation = 0;
                        if ("touchmove" == e.type) eventX = e.touches[0].pageX, eventY = e.touches[0].pageY; else {
                            if (window.getSelection) window.getSelection().empty || window.getSelection().removeAllRanges && window.getSelection().removeAllRanges(); else if (document.selection) if (isIe8) try {
                                document.selection.empty();
                            } catch (e) {} else document.selection.empty();
                            if (eventX = e.pageX, eventY = e.pageY, !isMouseDown) return !0;
                            if (!isIe && ("undefined" != typeof e.webkitMovementX || "undefined" != typeof e.webkitMovementY) && 0 === e.webkitMovementY && 0 === e.webkitMovementX) return !0;
                        }
                        if (xCurrentScrollRate[0] = xCurrentScrollRate[1], xCurrentScrollRate[1] = eventX, 
                        xScrollDistance = (xCurrentScrollRate[1] - xCurrentScrollRate[0]) / 2, yCurrentScrollRate[0] = yCurrentScrollRate[1], 
                        yCurrentScrollRate[1] = eventY, yScrollDistance = (yCurrentScrollRate[1] - yCurrentScrollRate[0]) / 2, 
                        !xScrollStarted) {
                            var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides, args = new helpers.args("start", settings, scrollerNode, $(scrollerNode).children(":eq(" + slide + ")"), slide, void 0);
                            $(stageNode).data("args", args), "" != settings.onSlideStart && settings.onSlideStart(args);
                        }
                        if ((yScrollDistance > settings.verticalSlideLockThreshold || yScrollDistance < -1 * settings.verticalSlideLockThreshold) && "touchmove" == e.type && !xScrollStarted && (preventXScroll = !0), 
                        (xScrollDistance > settings.horizontalSlideLockThreshold || xScrollDistance < -1 * settings.horizontalSlideLockThreshold) && "touchmove" == e.type && e.preventDefault(), 
                        (xScrollDistance > settings.slideStartVelocityThreshold || xScrollDistance < -1 * settings.slideStartVelocityThreshold) && (xScrollStarted = !0), 
                        xScrollStarted && !preventXScroll) {
                            var scrollPosition = helpers.getSliderOffset(scrollerNode, "x"), scrollbarSubtractor = $(currentEventNode)[0] === $(scrollbarNode)[0] ? sliderMin[sliderNumber] : centeredSlideOffset, scrollbarMultiplier = $(currentEventNode)[0] === $(scrollbarNode)[0] ? (sliderMin[sliderNumber] - sliderMax[sliderNumber] - centeredSlideOffset) / (scrollbarStageWidth - scrollMargin - scrollbarWidth) : 1, elasticPullResistance = $(currentEventNode)[0] === $(scrollbarNode)[0] ? settings.scrollbarElasticPullResistance : settings.elasticPullResistance, snapCenteredSlideOffset = settings.snapSlideCenter && $(currentEventNode)[0] === $(scrollbarNode)[0] ? 0 : centeredSlideOffset, snapCenteredSlideOffsetScrollbar = settings.snapSlideCenter && $(currentEventNode)[0] === $(scrollbarNode)[0] ? centeredSlideOffset : 0;
                            if ("touchmove" == e.type && (currentTouches != e.touches.length && (xScrollStartPosition = -1 * scrollPosition + eventX), 
                            currentTouches = e.touches.length), settings.infiniteSlider) {
                                if (scrollPosition <= -1 * sliderMax[sliderNumber]) {
                                    var scrollerWidth = $(scrollerNode).width();
                                    if (scrollPosition <= -1 * sliderAbsMax[sliderNumber]) {
                                        var sum = -1 * originalOffsets[0];
                                        $(slideNodes).each(function(i) {
                                            helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset), i < childrenOffsets.length && (childrenOffsets[i] = -1 * sum), 
                                            sum += slideNodeOuterWidths[i];
                                        }), xScrollStartPosition -= -1 * childrenOffsets[0], sliderMin[sliderNumber] = -1 * childrenOffsets[0] + centeredSlideOffset, 
                                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                                        infiniteSliderOffset[sliderNumber] = 0;
                                    } else {
                                        var lowSlideNumber = 0, lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), "x");
                                        $(slideNodes).each(function(i) {
                                            helpers.getSliderOffset(this, "x") < lowSlideOffset && (lowSlideOffset = helpers.getSliderOffset(this, "x"), 
                                            lowSlideNumber = i);
                                        });
                                        var newOffset = sliderMin[sliderNumber] + scrollerWidth;
                                        helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset), sliderMin[sliderNumber] = -1 * childrenOffsets[1] + centeredSlideOffset, 
                                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                                        childrenOffsets.splice(0, 1), childrenOffsets.splice(childrenOffsets.length, 0, -1 * newOffset + centeredSlideOffset), 
                                        infiniteSliderOffset[sliderNumber]++;
                                    }
                                }
                                if (scrollPosition >= -1 * sliderMin[sliderNumber] || scrollPosition >= 0) {
                                    var scrollerWidth = $(scrollerNode).width();
                                    if (scrollPosition >= 0) {
                                        var sum = -1 * originalOffsets[0];
                                        for ($(slideNodes).each(function(i) {
                                            helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset), i < childrenOffsets.length && (childrenOffsets[i] = -1 * sum), 
                                            sum += slideNodeOuterWidths[i];
                                        }), xScrollStartPosition += -1 * childrenOffsets[0], sliderMin[sliderNumber] = -1 * childrenOffsets[0] + centeredSlideOffset, 
                                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                                        infiniteSliderOffset[sliderNumber] = numberOfSlides; -1 * childrenOffsets[0] - scrollerWidth + centeredSlideOffset > 0; ) {
                                            var highSlideNumber = 0, highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), "x");
                                            $(slideNodes).each(function(i) {
                                                helpers.getSliderOffset(this, "x") > highSlideOffset && (highSlideOffset = helpers.getSliderOffset(this, "x"), 
                                                highSlideNumber = i);
                                            });
                                            var newOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                                            helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset), childrenOffsets.splice(0, 0, -1 * newOffset + centeredSlideOffset), 
                                            childrenOffsets.splice(childrenOffsets.length - 1, 1), sliderMin[sliderNumber] = -1 * childrenOffsets[0] + centeredSlideOffset, 
                                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                                            infiniteSliderOffset[sliderNumber]--, activeChildOffsets[sliderNumber]++;
                                        }
                                    } else {
                                        var highSlideNumber = 0, highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), "x");
                                        $(slideNodes).each(function(i) {
                                            helpers.getSliderOffset(this, "x") > highSlideOffset && (highSlideOffset = helpers.getSliderOffset(this, "x"), 
                                            highSlideNumber = i);
                                        });
                                        var newOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                                        helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset), childrenOffsets.splice(0, 0, -1 * newOffset + centeredSlideOffset), 
                                        childrenOffsets.splice(childrenOffsets.length - 1, 1), sliderMin[sliderNumber] = -1 * childrenOffsets[0] + centeredSlideOffset, 
                                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth, 
                                        infiniteSliderOffset[sliderNumber]--;
                                    }
                                }
                            } else {
                                var scrollerWidth = $(scrollerNode).width();
                                scrollPosition > -1 * sliderMin[sliderNumber] + centeredSlideOffset && (edgeDegradation = (sliderMin[sliderNumber] + -1 * (xScrollStartPosition - scrollbarSubtractor - eventX + snapCenteredSlideOffset) * scrollbarMultiplier - scrollbarSubtractor) * elasticPullResistance * -1 / scrollbarMultiplier), 
                                scrollPosition < -1 * sliderMax[sliderNumber] && (edgeDegradation = (sliderMax[sliderNumber] + snapCenteredSlideOffsetScrollbar + -1 * (xScrollStartPosition - scrollbarSubtractor - eventX) * scrollbarMultiplier - scrollbarSubtractor) * elasticPullResistance * -1 / scrollbarMultiplier);
                            }
                            if (helpers.setSliderOffset(scrollerNode, -1 * (xScrollStartPosition - scrollbarSubtractor - eventX - edgeDegradation) * scrollbarMultiplier - scrollbarSubtractor + snapCenteredSlideOffsetScrollbar), 
                            settings.scrollbar) {
                                helpers.showScrollbar(settings, scrollbarClass), scrollbarDistance = Math.floor((xScrollStartPosition - eventX - edgeDegradation - sliderMin[sliderNumber] + snapCenteredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageWidth - scrollMargin - scrollbarWidth) * scrollbarMultiplier);
                                var width = scrollbarWidth;
                                0 >= scrollbarDistance ? (width = scrollbarWidth - scrollBorder - -1 * scrollbarDistance, 
                                helpers.setSliderOffset($("." + scrollbarClass), 0), $("." + scrollbarClass).css({
                                    width: width + "px"
                                })) : scrollbarDistance >= scrollbarStageWidth - scrollMargin - scrollBorder - scrollbarWidth ? (width = scrollbarStageWidth - scrollMargin - scrollBorder - scrollbarDistance, 
                                helpers.setSliderOffset($("." + scrollbarClass), scrollbarDistance), $("." + scrollbarClass).css({
                                    width: width + "px"
                                })) : helpers.setSliderOffset($("." + scrollbarClass), scrollbarDistance);
                            }
                            "touchmove" == e.type && (lastTouch = e.touches[0].pageX);
                            var slideChanged = !1, newChildOffset = helpers.calcActiveOffset(settings, -1 * (xScrollStartPosition - eventX - edgeDegradation), childrenOffsets, stageWidth, infiniteSliderOffset[sliderNumber], numberOfSlides, void 0, sliderNumber), tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
                            if (settings.infiniteSlider ? tempOffset != activeChildInfOffsets[sliderNumber] && (slideChanged = !0) : newChildOffset != activeChildOffsets[sliderNumber] && (slideChanged = !0), 
                            slideChanged) {
                                activeChildOffsets[sliderNumber] = newChildOffset, activeChildInfOffsets[sliderNumber] = tempOffset, 
                                snapOverride = !0;
                                var args = new helpers.args("change", settings, scrollerNode, $(scrollerNode).children(":eq(" + tempOffset + ")"), tempOffset, tempOffset);
                                $(stageNode).data("args", args), "" != settings.onSlideChange && settings.onSlideChange(args), 
                                helpers.updateBackfaceVisibility(slideNodes, sliderNumber, numberOfSlides, settings);
                            }
                        }
                    });
                    var eventObject = $(window);
                    if (isIe8 || isIe7) var eventObject = $(document);
                    $(touchSelection).bind("touchcancel.iosSliderEvent touchend.iosSliderEvent", function(e) {
                        var e = e.originalEvent;
                        if (touchEndFlag) return !1;
                        if (touchEndFlag = !0, touchLocks[sliderNumber] || shortContent) return !0;
                        if (isUnselectable) return !0;
                        if (0 != e.touches.length) for (var j = 0; j < e.touches.length; j++) e.touches[j].pageX == lastTouch && helpers.slowScrollHorizontal(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings); else helpers.slowScrollHorizontal(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);
                        return preventXScroll = !1, touchStartFlag = !1, !0;
                    }), $(eventObject).bind("mouseup.iosSliderEvent-" + sliderNumber, function(e) {
                        if (xScrollStarted ? anchorEvents.unbind("click.disableClick").bind("click.disableClick", helpers.preventClick) : anchorEvents.unbind("click.disableClick").bind("click.disableClick", helpers.enableClick), 
                        onclickEvents.each(function() {
                            this.onclick = function(event) {
                                return xScrollStarted ? !1 : void ($(this).data("onclick") && $(this).data("onclick").call(this, event || window.event));
                            }, this.onclick = $(this).data("onclick");
                        }), parseFloat($().jquery) >= 1.8 ? allScrollerNodeChildren.each(function() {
                            var clickObject = $._data(this, "events");
                            if (void 0 != clickObject && void 0 != clickObject.click && "iosSliderEvent" != clickObject.click[0].namespace) {
                                if (!xScrollStarted) return !1;
                                $(this).one("click.disableClick", helpers.preventClick);
                                var handlers = $._data(this, "events").click, handler = handlers.pop();
                                handlers.splice(0, 0, handler);
                            }
                        }) : parseFloat($().jquery) >= 1.6 && allScrollerNodeChildren.each(function() {
                            var clickObject = $(this).data("events");
                            if (void 0 != clickObject && void 0 != clickObject.click && "iosSliderEvent" != clickObject.click[0].namespace) {
                                if (!xScrollStarted) return !1;
                                $(this).one("click.disableClick", helpers.preventClick);
                                var handlers = $(this).data("events").click, handler = handlers.pop();
                                handlers.splice(0, 0, handler);
                            }
                        }), !isEventCleared[sliderNumber]) {
                            if (shortContent) return !0;
                            if (settings.desktopClickDrag && $(scrollerNode).css({
                                cursor: grabOutCursor
                            }), settings.scrollbarDrag && $(scrollbarNode).css({
                                cursor: grabOutCursor
                            }), isMouseDown = !1, void 0 == currentSlider) return !0;
                            helpers.slowScrollHorizontal(currentSlider, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings), 
                            currentSlider = void 0;
                        }
                        preventXScroll = !1, touchStartFlag = !1;
                    });
                }
            });
        },
        destroy: function(clearStyle, node) {
            return void 0 == node && (node = this), $(node).each(function() {
                var $this = $(this), data = $this.data("iosslider");
                if (void 0 == data) return !1;
                void 0 == clearStyle && (clearStyle = !0), helpers.autoSlidePause(data.sliderNumber), 
                isEventCleared[data.sliderNumber] = !0, $(window).unbind(".iosSliderEvent-" + data.sliderNumber), 
                $(document).unbind(".iosSliderEvent-" + data.sliderNumber), $(document).unbind("keydown.iosSliderEvent"), 
                $(this).unbind(".iosSliderEvent"), $(this).children(":first-child").unbind(".iosSliderEvent"), 
                $(this).children(":first-child").children().unbind(".iosSliderEvent"), $(data.settings.scrollbarBlockNode).unbind(".iosSliderEvent"), 
                clearStyle && ($(this).attr("style", ""), $(this).children(":first-child").attr("style", ""), 
                $(this).children(":first-child").children().attr("style", ""), $(data.settings.navSlideSelector).attr("style", ""), 
                $(data.settings.navPrevSelector).attr("style", ""), $(data.settings.navNextSelector).attr("style", ""), 
                $(data.settings.autoSlideToggleSelector).attr("style", ""), $(data.settings.unselectableSelector).attr("style", "")), 
                data.settings.scrollbar && $(".scrollbarBlock" + data.sliderNumber).remove();
                for (var scrollTimeouts = slideTimeouts[data.sliderNumber], i = 0; i < scrollTimeouts.length; i++) clearTimeout(scrollTimeouts[i]);
                $this.removeData("iosslider"), $this.removeData("args");
            });
        },
        update: function(node) {
            return void 0 == node && (node = this), $(node).each(function() {
                var $this = $(this), data = $this.data("iosslider");
                if (void 0 == data) return !1;
                data.settings.startAtSlide = $this.data("args").currentSlideNumber, methods.destroy(!1, this), 
                1 != data.numberOfSlides && data.settings.infiniteSlider && (data.settings.startAtSlide = (activeChildOffsets[data.sliderNumber] + 1 + infiniteSliderOffset[data.sliderNumber] + data.numberOfSlides) % data.numberOfSlides), 
                methods.init(data.settings, this);
                var args = new helpers.args("update", data.settings, data.scrollerNode, $(data.scrollerNode).children(":eq(" + (data.settings.startAtSlide - 1) + ")"), data.settings.startAtSlide - 1, data.settings.startAtSlide - 1);
                $(data.stageNode).data("args", args), "" != data.settings.onSliderUpdate && data.settings.onSliderUpdate(args);
            });
        },
        addSlide: function(slideNode, slidePosition) {
            return this.each(function() {
                var $this = $(this), data = $this.data("iosslider");
                return void 0 == data ? !1 : (0 == $(data.scrollerNode).children().length ? ($(data.scrollerNode).append(slideNode), 
                $this.data("args").currentSlideNumber = 1) : data.settings.infiniteSlider ? (1 == slidePosition ? $(data.scrollerNode).children(":eq(0)").before(slideNode) : $(data.scrollerNode).children(":eq(" + (slidePosition - 2) + ")").after(slideNode), 
                infiniteSliderOffset[data.sliderNumber] < -1 && activeChildOffsets[data.sliderNumber]--, 
                $this.data("args").currentSlideNumber >= slidePosition && activeChildOffsets[data.sliderNumber]++) : (slidePosition <= data.numberOfSlides ? $(data.scrollerNode).children(":eq(" + (slidePosition - 1) + ")").before(slideNode) : $(data.scrollerNode).children(":eq(" + (slidePosition - 2) + ")").after(slideNode), 
                $this.data("args").currentSlideNumber >= slidePosition && $this.data("args").currentSlideNumber++), 
                $this.data("iosslider").numberOfSlides++, void methods.update(this));
            });
        },
        removeSlide: function(slideNumber) {
            return this.each(function() {
                var $this = $(this), data = $this.data("iosslider");
                return void 0 == data ? !1 : ($(data.scrollerNode).children(":eq(" + (slideNumber - 1) + ")").remove(), 
                activeChildOffsets[data.sliderNumber] > slideNumber - 1 && activeChildOffsets[data.sliderNumber]--, 
                $this.data("iosslider").numberOfSlides--, void methods.update(this));
            });
        },
        goToSlide: function(slide, node) {
            return void 0 == node && (node = this), $(node).each(function() {
                var $this = $(this), data = $this.data("iosslider");
                return void 0 == data || data.shortContent ? !1 : (slide = slide > data.childrenOffsets.length ? data.childrenOffsets.length - 1 : slide - 1, 
                void helpers.changeSlide(slide, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterWidths, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings));
            });
        },
        prevSlide: function() {
            return this.each(function() {
                var $this = $(this), data = $this.data("iosslider");
                if (void 0 == data || data.shortContent) return !1;
                var slide = (activeChildOffsets[data.sliderNumber] + infiniteSliderOffset[data.sliderNumber] + data.numberOfSlides) % data.numberOfSlides;
                (slide > 0 || data.settings.infiniteSlider) && helpers.changeSlide(slide - 1, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterWidths, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings), 
                activeChildOffsets[data.sliderNumber] = slide;
            });
        },
        nextSlide: function() {
            return this.each(function() {
                var $this = $(this), data = $this.data("iosslider");
                if (void 0 == data || data.shortContent) return !1;
                var slide = (activeChildOffsets[data.sliderNumber] + infiniteSliderOffset[data.sliderNumber] + data.numberOfSlides) % data.numberOfSlides;
                (slide < data.childrenOffsets.length - 1 || data.settings.infiniteSlider) && helpers.changeSlide(slide + 1, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterWidths, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings), 
                activeChildOffsets[data.sliderNumber] = slide;
            });
        },
        prevPage: function(node) {
            return void 0 == node && (node = this), $(node).each(function() {
                var $this = $(this), data = $this.data("iosslider");
                if (void 0 == data) return !1;
                var newOffset = helpers.getSliderOffset(data.scrollerNode, "x") + data.stageWidth;
                helpers.changeOffset(newOffset, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterWidths, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
            });
        },
        nextPage: function(node) {
            return void 0 == node && (node = this), $(node).each(function() {
                var $this = $(this), data = $this.data("iosslider");
                if (void 0 == data) return !1;
                var newOffset = helpers.getSliderOffset(data.scrollerNode, "x") - data.stageWidth;
                helpers.changeOffset(newOffset, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterWidths, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
            });
        },
        lock: function() {
            return this.each(function() {
                var $this = $(this), data = $this.data("iosslider");
                return void 0 == data || data.shortContent ? !1 : ($(data.scrollerNode).css({
                    cursor: "default"
                }), void (touchLocks[data.sliderNumber] = !0));
            });
        },
        unlock: function() {
            return this.each(function() {
                var $this = $(this), data = $this.data("iosslider");
                return void 0 == data || data.shortContent ? !1 : ($(data.scrollerNode).css({
                    cursor: grabOutCursor
                }), void (touchLocks[data.sliderNumber] = !1));
            });
        },
        getData: function() {
            return this.each(function() {
                var $this = $(this), data = $this.data("iosslider");
                return void 0 == data || data.shortContent ? !1 : data;
            });
        },
        autoSlidePause: function() {
            return this.each(function() {
                var $this = $(this), data = $this.data("iosslider");
                return void 0 == data || data.shortContent ? !1 : (iosSliderSettings[data.sliderNumber].autoSlide = !1, 
                helpers.autoSlidePause(data.sliderNumber), data);
            });
        },
        autoSlidePlay: function() {
            return this.each(function() {
                var $this = $(this), data = $this.data("iosslider");
                return void 0 == data || data.shortContent ? !1 : (iosSliderSettings[data.sliderNumber].autoSlide = !0, 
                helpers.autoSlide($(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterWidths, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings), 
                data);
            });
        }
    };
    /* public functions */
    $.fn.iosSlider = function(method) {
        return methods[method] ? methods[method].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof method && method ? void $.error("invalid method call!") : methods.init.apply(this, arguments);
    };
}(jQuery);;
/*! Facebook-Newsroom - v0.0.1 */
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
        return (t /= d / 2) < 1 ? c / 2 * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
        return (t /= d / 2) < 1 ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d) {
        return (t /= d / 2) < 1 ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d) {
        return (t /= d / 2) < 1 ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
        return 0 == t ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
        return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d) {
        return 0 == t ? b : t == d ? b + c : (t /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (t - 1)) + b : c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
        return (t /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - t * t) - 1) + b : c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (0 == t) return b;
        if (1 == (t /= d)) return b + c;
        if (p || (p = .3 * d), a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (0 == t) return b;
        if (1 == (t /= d)) return b + c;
        if (p || (p = .3 * d), a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (0 == t) return b;
        if (2 == (t /= d / 2)) return b + c;
        if (p || (p = d * (.3 * 1.5)), a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return 1 > t ? -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b : a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function(x, t, b, c, d, s) {
        return void 0 == s && (s = 1.70158), c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(x, t, b, c, d, s) {
        return void 0 == s && (s = 1.70158), c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        return void 0 == s && (s = 1.70158), (t /= d / 2) < 1 ? c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b : c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
        return (t /= d) < 1 / 2.75 ? c * (7.5625 * t * t) + b : 2 / 2.75 > t ? c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b : 2.5 / 2.75 > t ? c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b : c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
    },
    easeInOutBounce: function(x, t, b, c, d) {
        return d / 2 > t ? .5 * jQuery.easing.easeInBounce(x, 2 * t, 0, c, d) + b : .5 * jQuery.easing.easeOutBounce(x, 2 * t - d, 0, c, d) + .5 * c + b;
    }
});;
/*! Facebook-Newsroom - v0.0.1 */
/**
 * @class Company
 *
 * @author Beyond Consultancy <dev@bynd.com>
 * @docauthor Brian Rhode <brian@bynd.com>
 * @docauthor Matt Shelley <mshelley@bynd.com>
 *
 * Facebook Newsroom Company Page
 */
var FBNR = FBNR || {};

!function($) {
    FBNR.Company = function() {
        var scrollerInitialized = !1;
        return {
            /**
			 * Standard init
			 */
            init: function() {
                this.initCultureSlider(), this.initNav();
            },
            initNav: function() {
                $("#company-nav a").on("mousedown", function() {
                    var $this = $(this), href = $this.attr("href"), hrefTop = $(href).offset().top;
                    //alert(href);
                    $("html, body").animate({
                        scrollTop: hrefTop - 40
                    }, 500);
                }).click(!1);
            },
            initializeScroller: function() {
                $("#scroll").css("height", $("#key-facts").height()).scroller(), scrollerInitialized = !0;
            },
            /**
			 * TODO:
			 */
            setTimelineHeight: function() {
                var $keyfacts = $("#key-facts"), $timeline = $("#timeline ul");
                $timeline.height($keyfacts.height() - 160);
            },
            /**
			 * TODO:
			 */
            initCultureSlider: function() {
                var $cultureSlider = $(".featured-carousel");
                $cultureSlider.cycle({
                    log: !1,
                    timeout: 5e3,
                    speed: 1e3,
                    manualSpeed: 600,
                    // speed for a manual page
                    fx: "fade",
                    pauseOnHover: !0,
                    slides: "> div",
                    pager: "~ .featured-carousel-pager",
                    next: "~ .featured-carousel-next",
                    prev: "~ .featured-carousel-prev",
                    swipe: !0
                }).cycle("pause");
                // reveal "next" button on image hover and trigger next slide on image click
                var $slide_image = $(".slide"), $slide_next = $(".featured-carousel-next, .featured-carousel-prev");
                $slide_image.length > 1 && $slide_image.click(function() {
                    $cultureSlider.cycle("next");
                }).css({
                    cursor: "pointer"
                }).hover(function() {
                    $slide_next.addClass("active");
                }, function() {
                    $slide_next.removeClass("active");
                });
            }
        };
    }(), $(document).ready(function() {
        FBNR.Company.init();
    });
}(jQuery);;
/*! Facebook-Newsroom - v0.0.1 */
/**
 * @class Timeline
 *
 * @author Beyond Consultancy <dev@bynd.com>
 * @docauthor Brian Rohde <brian@bynd.com>
 *
 * Facebook Newsroom Timeline Module
 */
var FBNR = FBNR || {};

!function($) {
    FBNR.Timeline = function() {
        /**
		 * Store positions of ticks so we don't have to query the DOM
		 * Note: if the Bar needs to become responsive, we will have to refresh
		 * the positioning stored in ticks[]
		 */
        function _cacheTickPositions() {
            $ticks.each(function(index) {
                var $this = $(this);
                _ticks[index] = $this.position().left;
            });
        }
        /**
		 * iosSlider - onSlideChange callback
		 * Update draggable position and reveal/hide previous + next buttons as necessary
		 */
        function _onSlideChange(args) {
            var index = args.currentSlideNumber - 1, $relatedTick = $ticks.eq(index), leftPos = $relatedTick.position().left;
            // update draggable position?
            updateDraggable && $draggable.stop().animate({
                left: leftPos
            }, {
                duration: 200
            }), // show/hide prev/next controls
            1 == args.currentSlideNumber ? $prev.css({
                opacity: 0,
                cursor: "default"
            }) : $prev.css({
                opacity: 1,
                cursor: "pointer"
            }), args.currentSlideNumber == $timeline_carousel.data("iosslider").numberOfSlides ? $next.css({
                opacity: 0,
                cursor: "default"
            }) : $next.css({
                opacity: 1,
                cursor: "pointer"
            });
        }
        /**
		 * Draggable - start event handler
		 *
		 * Prevent iosSlider onSlideChange from updating draggable position
		 * Initialize timer to update carousel positioning
		 */
        function _onDragStart() {
            clearTimeout(updateDraggableTimeout), updateDraggable = !1, // carousel update timer
            updateDraggableInterval = setInterval(_moveDraggableToClosestTick, 200);
        }
        /**
		 * Draggable - stop event handler
		 *
		 * Re-enable iosSlider onSlideChange to update draggable position
		 */
        function _onDragStop() {
            clearTimeout(updateDraggableTimeout), updateDraggableTimeout = setTimeout(function() {
                updateDraggable = !0;
            }, 1e3), // disable carousel update timer
            clearInterval(updateDraggableInterval), // do one last update since user is done dragging
            _moveDraggableToClosestTick();
            // moveTo gets set to the left position of the closest tick
            // (User has completed dragging here)
            var leftPos = $draggable.data("moveTo");
            leftPos && ($draggable.stop().animate({
                left: leftPos
            }, {
                duration: 200
            }), $draggable.removeData("moveTo")), $handle.removeClass("hover");
        }
        /**
		 * Move draggable to the closest tick
		 */
        function _moveDraggableToClosestTick() {
            var leftPos = $draggable.position().left, closest = null, closestIdx = null;
            // Loop through ticks array (which contains saved positions)
            // to find the closest one.
            $.each(_ticks, function(index) {
                (null === closest || Math.abs(this - leftPos) < Math.abs(closest - leftPos)) && (closest = this, 
                closestIdx = index);
            }), // store position of where draggable should move to
            // (used in stop event handler)
            $draggable.data("moveTo", closest), // tell iosSlider to go to the slide
            $timeline_carousel.iosSlider("goToSlide", closestIdx + 1);
        }
        /**
		 * Move draggable to the current slide
		 */
        function _moveDraggableToCurrentPosition() {
            var currentData = $timeline_carousel.data("args"), currentSlide = currentData.currentSlideNumber, leftPos = _ticks[currentSlide - 1];
            $draggable.css("left", leftPos);
        }
        /**
		 * Next event handler 
		 *
		 * Advance iosSlider 3 slides at a time
		 */
        function _next() {
            var initData = $timeline_carousel.data("iosslider"), currentData = $timeline_carousel.data("args"), numberOfSlides = initData.numberOfSlides, currentSlide = currentData.currentSlideNumber, goTo = currentSlide + 3;
            // cannot go to a slide beyond total number of slides
            goTo > numberOfSlides && (goTo = numberOfSlides), $timeline_carousel.iosSlider("goToSlide", goTo);
        }
        /**
		 * Previous event handler 
		 *
		 * Move back iosSlider 3 slides at a time
		 */
        function _prev() {
            var initData = $timeline_carousel.data("iosslider"), currentData = $timeline_carousel.data("args"), currentSlide = (initData.numberOfSlides, 
            currentData.currentSlideNumber);
            if (1 == currentSlide) return !1;
            var goTo = currentSlide - 3;
            // cannot go to a slide beyond total number of slides
            0 >= goTo && (goTo = 1), $timeline_carousel.iosSlider("goToSlide", goTo);
        }
        /**
		 * Related Articles event handler
		 */
        function _relatedArticleOpen() {
            var $this = $(this), $related = $this.parent().siblings(".timeline-carousel--item-related");
            return $related.fadeIn("fast"), !1;
        }
        /**
		 * Close Related Articles event handler
		 */
        function _relatedArticleClose() {
            var $this = $(this), $related = $this.parent().parent();
            return $related.fadeOut("fast"), !1;
        }
        /**
		 * Year click event handler
		 */
        function _onYearClick() {
            var year = $(this).text(), $first_milestone = $carousel_items.filter('[data-year="' + year + '"]');
            // make sure there is a milestone for the year
            if (!$first_milestone.length) return !1;
            var index = $carousel_items.index($first_milestone);
            return $timeline_carousel.iosSlider("goToSlide", index + 1), !1;
        }
        /**
		 * Initialize / put it all together
		 */
        function init() {
            // Year labels ( e.g., 2004, 2005, 2006 )
            $timeline_years = $(".timeline-line--years"), $timeline_years_li = $timeline_years.find("li"), 
            // Top level selector for the carousel.
            $timeline_carousel = $(".timeline-carousel"), // Individual slides for the carousel
            $carousel_items = $(".timeline-carousel--item"), // Timeline bar
            $timeline_bar = $(".timeline-line--bar"), // Tick in the bar to indicate every milestone
            $ticks = $timeline_bar.find(".timeline-line--tick"), // jQuery UI - draggable element
            $draggable = $(".timeline-line--slider"), // jQuery UI - handle for the draggable element
            $handle = $(".timeline-line--slider-handle"), // Next and previous buttons 
            $next = $(".timeline-carousel--next"), $prev = $(".timeline-carousel--prev"), _cacheTickPositions(), 
            // on window resize, re-update saved tick positions
            $(window).resize(function() {
                _cacheTickPositions(), _moveDraggableToCurrentPosition();
            }), // Distribute Year labels evenly across page
            $timeline_years_li.css({
                width: 1 / $timeline_years_li.length * 100 + "%"
            }), // Initialize iosSlider
            $timeline_carousel.iosSlider({
                snapToChildren: !0,
                desktopClickDrag: !0,
                snapSlideCenter: !0,
                onSlideChange: _onSlideChange,
                startAtSlide: $carousel_items.length - 1
            }), // Navigate to a milestone if the corresponding tick is clicked
            $timeline_bar.on("mousedown", ".timeline-line--tick", function() {
                var index = $ticks.index(this);
                $timeline_carousel.iosSlider("goToSlide", index + 1);
            }), // Initialize draggable
            $draggable.draggable({
                axis: "x",
                containment: "parent",
                handle: ".timeline-line--slider-handle",
                start: _onDragStart,
                stop: _onDragStop
            }), // Draggable handle effects
            $handle.hover(function() {
                $(this).addClass("hover");
            }, function() {
                $(this).removeClass("hover");
            }).on("mousedown", function() {
                $(this).addClass("press");
            }).on("mouseup", function() {
                $(this).removeClass("press");
            });
            // Initialize tooltips
            var $tooltip_arrow = $('<span class="tooltip-arrow"></span').appendTo("body");
            Modernizr.touch || $(document).tooltip({
                items: ".timeline-line--tick",
                position: {
                    my: "center bottom-22",
                    at: "left bottom",
                    collision: "flipfit"
                },
                show: !1,
                // no transition
                hide: !1,
                // no transition
                content: function() {
                    // prevent tooltip when dragging slider
                    if ($draggable.is(".ui-draggable-dragging")) return !1;
                    var index = ($(this), $ticks.index(this)), $carousel_item = $carousel_items.eq(index), img = $carousel_item.find("img.timeline-carousel--item-img").attr("src"), d = $carousel_item.find("p.date").text(), milestone = $carousel_item.find(".timeline-carousel--item-milestone").text(), html = '<div class="timeline-carousel--tooltip">';
                    return img && (html += '<img src="' + img + '" />'), html += '<p class="date">' + d + '</p><div class="milestone">' + milestone + "</div></div>";
                },
                create: function(event, ui) {},
                open: function(event, ui) {
                    var el = $.data(this, "ui-tooltip").tooltips[ui.tooltip[0].id][0], position = $(el).offset(), tooltip_position = ui.tooltip.offset(), tooltip_bottom = tooltip_position.top + ui.tooltip.height();
                    // don't show arrow if the tooltip is coming up below the timeline
                    // don't show arrow if the tooltip is coming up below the timeline
                    return position.top < tooltip_position.top ? ($tooltip_arrow.hide(), !1) : void $tooltip_arrow.css({
                        top: tooltip_bottom + 18,
                        left: position.left - 6
                    }).stop(!0).show();
                },
                close: function(event, ui) {
                    $tooltip_arrow.hide();
                }
            }), // Initialize next and previous buttons
            $next.on("mousedown", _next).click(!1), $prev.on("mousedown", _prev).click(!1), 
            $timeline_carousel.on("click", ".related", _relatedArticleOpen).on("click", ".related-close", _relatedArticleClose), 
            // Initialize year click event
            $timeline_years.on("click", "li", _onYearClick), _moveDraggableToCurrentPosition();
        }
        // Year labels ( e.g., 2004, 2005, 2006 )
        var $timeline_years, $timeline_years_li, // Top level selector for the carousel.
        $timeline_carousel, // Individual slides for the carousel
        $carousel_items, // Timeline bar
        $timeline_bar, // Tick in the bar to indicate every milestone
        $ticks, // jQuery UI - draggable element
        $draggable, // jQuery UI - handle for the draggable element
        $handle, // Next and previous buttons 
        $next, $prev, // After draggable has finished
        updateDraggableTimeout, // Used to update draggable positioning
        updateDraggableInterval, // Storage of tick positions (so we don't have to keep querying DOM)
        _ticks = [], // Should ios Slider update draggable position?
        // This gets changed to false when the draggable is used
        updateDraggable = !0;
        return {
            init: init
        };
    }(), $(function() {
        FBNR.Timeline.init();
    });
}(jQuery), /*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
function($) {
    /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
    function simulateMouseEvent(event, simulatedType) {
        // Ignore multi-touch events
        if (!(event.originalEvent.touches.length > 1)) {
            event.preventDefault();
            var touch = event.originalEvent.changedTouches[0], simulatedEvent = document.createEvent("MouseEvents");
            // Initialize the simulated mouse event using the touch event's coordinates
            simulatedEvent.initMouseEvent(simulatedType, // type
            !0, // bubbles                    
            !0, // cancelable                 
            window, // view                       
            1, // detail                     
            touch.screenX, // screenX                    
            touch.screenY, // screenY                    
            touch.clientX, // clientX                    
            touch.clientY, // clientY                    
            !1, // ctrlKey                    
            !1, // altKey                     
            !1, // shiftKey                   
            !1, // metaKey                    
            0, // button                     
            null), // Dispatch the simulated event to the target element
            event.target.dispatchEvent(simulatedEvent);
        }
    }
    // Ignore browsers without touch support
    if (// Detect touch support
    $.support.touch = "ontouchend" in document, $.support.touch) {
        var touchHandled, mouseProto = $.ui.mouse.prototype, _mouseInit = mouseProto._mouseInit, _mouseDestroy = mouseProto._mouseDestroy;
        /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
        mouseProto._touchStart = function(event) {
            var self = this;
            // Ignore the event if another widget is already being handled
            !touchHandled && self._mouseCapture(event.originalEvent.changedTouches[0]) && (// Set the flag to prevent other widgets from inheriting the touch event
            touchHandled = !0, // Track movement to determine if interaction was a click
            self._touchMoved = !1, // Simulate the mouseover event
            simulateMouseEvent(event, "mouseover"), // Simulate the mousemove event
            simulateMouseEvent(event, "mousemove"), // Simulate the mousedown event
            simulateMouseEvent(event, "mousedown"));
        }, /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
        mouseProto._touchMove = function(event) {
            // Ignore event if not handled
            touchHandled && (// Interaction was not a click
            this._touchMoved = !0, // Simulate the mousemove event
            simulateMouseEvent(event, "mousemove"));
        }, /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
        mouseProto._touchEnd = function(event) {
            // Ignore event if not handled
            touchHandled && (// Simulate the mouseup event
            simulateMouseEvent(event, "mouseup"), // Simulate the mouseout event
            simulateMouseEvent(event, "mouseout"), // If the touch interaction did not move, it should trigger a click
            this._touchMoved || // Simulate the click event
            simulateMouseEvent(event, "click"), // Unset the flag to allow other widgets to inherit the touch event
            touchHandled = !1);
        }, /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
        mouseProto._mouseInit = function() {
            var self = this;
            // Delegate the touch handlers to the widget's element
            self.element.bind({
                touchstart: $.proxy(self, "_touchStart"),
                touchmove: $.proxy(self, "_touchMove"),
                touchend: $.proxy(self, "_touchEnd")
            }), // Call the original $.ui.mouse init method
            _mouseInit.call(self);
        }, /**
   * Remove the touch event handlers
   */
        mouseProto._mouseDestroy = function() {
            var self = this;
            // Delegate the touch handlers to the widget's element
            self.element.unbind({
                touchstart: $.proxy(self, "_touchStart"),
                touchmove: $.proxy(self, "_touchMove"),
                touchend: $.proxy(self, "_touchEnd")
            }), // Call the original $.ui.mouse destroy method
            _mouseDestroy.call(self);
        };
    }
}(jQuery);;
(function() {
	var ajaxurl = window.ajaxurl || '/wp-admin/admin-ajax.php',
		data = window.wpcomVipAnalytics,
		dataQs, percent;

	if ( typeof XMLHttpRequest === 'undefined' ) {
		return;
	}

	if ( ! data ) {
		return;
	}

	percent = ~~data.percentToTrack;
	if ( percent && percent < 100 && ( ~~( ( Math.random() * 100 ) + 1 ) > percent ) ) {
		return;
	}

	dataQs = 'action=wpcom_vip_analytics';

	for ( var key in data ) {
		if ( key === 'percentToTrack' ) {
			continue;
		}
		if ( data.hasOwnProperty( key ) ) {
			dataQs += '&' +
				encodeURIComponent( key ).replace(/%20/g, '+' ) + '=' +
				encodeURIComponent( data[key] ).replace(/%20/g, '+' );
		}
	}

	function sendInfo() {
		var xhr = new XMLHttpRequest();
		xhr.open( 'POST', ajaxurl, true );
		xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
		xhr.send( dataQs );
	}

	// Delay for some time after the document is ready to ping
	function docReady() {
		setTimeout( function() {
			sendInfo();
		}, 1500 );
	}

	if ( document.readyState === 'complete' ) {
		docReady.apply();
	}
	else if ( document.addEventListener ) {
		document.addEventListener( 'DOMContentLoaded', docReady, false );
	}
	else if ( document.attachEvent ) {
		document.attachEvent( 'onreadystatechange', docReady );
	}
})();
;
/***
 * Warning: This file is remotely enqueued in Jetpack's Masterbar module.
 * Changing it will also affect Jetpack sites.
 */
jQuery( document ).ready( function( $, wpcom ) {
	var masterbar,
		menupops = $( 'li#wp-admin-bar-blog.menupop, li#wp-admin-bar-newdash.menupop, li#wp-admin-bar-my-account.menupop' ),
		newmenu = $( '#wp-admin-bar-new-post-types' );

	// Unbind hoverIntent, we want clickable menus.
	menupops
		.unbind( 'mouseenter mouseleave' )
		.removeProp( 'hoverIntent_t' )
		.removeProp( 'hoverIntent_s' )
		.on( 'mouseover', function(e) {
			var li = $(e.target).closest( 'li.menupop' );
			menupops.not(li).removeClass( 'ab-hover' );
			li.toggleClass( 'ab-hover' );
		} )
		.on( 'click touchstart', function(e) {
			var $target = $( e.target );

			if ( masterbar.focusSubMenus( $target ) ) {
				return;
			}

			e.preventDefault();
			masterbar.toggleMenu( $target );
		} );

	masterbar = {
		focusSubMenus: function( $target ) {
			// Handle selection of menu items
			if ( ! $target.closest( 'ul' ).hasClass( 'ab-top-menu' ) ) {
				$target
					.closest( 'li' );

				return true;
			}

			return false;
		},

		toggleMenu: function( $target ) {
			var $li = $target.closest( 'li.menupop' ),
				$html = $( 'html' );

			$( 'body' ).off( 'click.ab-menu' );
			$( '#wpadminbar li.menupop' ).not($li).removeClass( 'ab-active wpnt-stayopen wpnt-show' );

			if ( $li.hasClass( 'ab-active' ) ) {
				$li.removeClass( 'ab-active' );
				$html.removeClass( 'ab-menu-open' );
			} else {
				$li.addClass( 'ab-active' );
				$html.addClass( 'ab-menu-open' );

				$( 'body' ).on( 'click.ab-menu', function( e ) {
					if ( ! $( e.target ).parents( '#wpadminbar' ).length ) {
						e.preventDefault();
						masterbar.toggleMenu( $li );
						$( 'body' ).off( 'click.ab-menu' );
					}
				} );
			}
		}
	};
} );;
/*globals JSON */
( function( $ ) {
	var eventName = 'wpcom_masterbar_click';

	var linksTracksEvents = {
		//top level items
		'wp-admin-bar-blog'                        : 'my_sites',
		'wp-admin-bar-newdash'                     : 'reader',
		'wp-admin-bar-ab-new-post'                 : 'write_button',
		'wp-admin-bar-my-account'                  : 'my_account',
		'wp-admin-bar-notes'                       : 'notifications',
		//my sites - top items
		'wp-admin-bar-switch-site'                 : 'my_sites_switch_site',
		'wp-admin-bar-blog-info'                   : 'my_sites_site_info',
		'wp-admin-bar-site-view'                   : 'my_sites_view_site',
		'wp-admin-bar-blog-stats'                  : 'my_sites_site_stats',
		'wp-admin-bar-plan'                        : 'my_sites_plan',
		'wp-admin-bar-plan-badge'                  : 'my_sites_plan_badge',
		//my sites - manage
		'wp-admin-bar-edit-page'                   : 'my_sites_manage_site_pages',
		'wp-admin-bar-new-page-badge'              : 'my_sites_manage_add_page',
		'wp-admin-bar-edit-post'                   : 'my_sites_manage_blog_posts',
		'wp-admin-bar-new-post-badge'              : 'my_sites_manage_add_post',
		'wp-admin-bar-edit-attachment'             : 'my_sites_manage_media',
		'wp-admin-bar-new-attachment-badge'        : 'my_sites_manage_add_media',
		'wp-admin-bar-comments'                    : 'my_sites_manage_comments',
		'wp-admin-bar-edit-jetpack-testimonial'    : 'my_sites_manage_testimonials',
		'wp-admin-bar-new-jetpack-testimonial'     : 'my_sites_manage_add_testimonial',
		'wp-admin-bar-edit-jetpack-portfolio'      : 'my_sites_manage_portfolio',
		'wp-admin-bar-new-jetpack-portfolio'       : 'my_sites_manage_add_portfolio',
		//my sites - personalize
		'wp-admin-bar-themes'                      : 'my_sites_personalize_themes',
		'wp-admin-bar-cmz'                         : 'my_sites_personalize_themes_customize',
		//my sites - configure
		'wp-admin-bar-sharing'                     : 'my_sites_configure_sharing',
		'wp-admin-bar-people'                      : 'my_sites_configure_people',
		'wp-admin-bar-people-add'                  : 'my_sites_configure_people_add_button',
		'wp-admin-bar-plugins'                     : 'my_sites_configure_plugins',
		'wp-admin-bar-domains'                     : 'my_sites_configure_domains',
		'wp-admin-bar-domains-add'                 : 'my_sites_configure_add_domain',
		'wp-admin-bar-blog-settings'               : 'my_sites_configure_settings',
		'wp-admin-bar-legacy-dashboard'            : 'my_sites_configure_wp_admin',
		//reader
		'wp-admin-bar-followed-sites'              : 'reader_followed_sites',
		'wp-admin-bar-reader-followed-sites-manage': 'reader_manage_followed_sites',
		'wp-admin-bar-discover-discover'           : 'reader_discover',
		'wp-admin-bar-discover-search'             : 'reader_search',
		'wp-admin-bar-my-activity-my-likes'        : 'reader_my_likes',
		//account
		'wp-admin-bar-user-info'                   : 'my_account_user_name',
		// account - profile
		'wp-admin-bar-my-profile'                  : 'my_account_profile_my_profile',
		'wp-admin-bar-account-settings'            : 'my_account_profile_account_settings',
		'wp-admin-bar-billing'                     : 'my_account_profile_manage_purchases',
		'wp-admin-bar-security'                    : 'my_account_profile_security',
		'wp-admin-bar-notifications'               : 'my_account_profile_notifications',
		//account - special
		'wp-admin-bar-get-apps'                    : 'my_account_special_get_apps',
		'wp-admin-bar-next-steps'                  : 'my_account_special_next_steps',
		'wp-admin-bar-help'                        : 'my_account_special_help',
	};

	var notesTracksEvents = {
		openSite: function( data ) {
			return {
				clicked: 'masterbar_notifications_panel_site',
				site_id: data.siteId
			};
		},
		openPost: function( data ) {
			return {
				clicked: 'masterbar_notifications_panel_post',
				site_id: data.siteId,
				post_id: data.postId
			};
		},
		openComment: function( data ) {
			return {
				clicked: 'masterbar_notifications_panel_comment',
				site_id: data.siteId,
				post_id: data.postId,
				comment_id: data.commentId
			};
		}
	};

	function recordTracksEvent( eventProps ) {
		eventProps = eventProps || {};
		window._tkq = window._tkq || [];
		window._tkq.push( [ 'recordEvent', eventName, eventProps ] );
	}

	function parseJson( s, defaultValue ) {
		try {
			return JSON.parse( s );
		} catch ( e ) {
			return defaultValue;
		}
	}

	$( document ).ready( function() {
		var trackableLinks = '.mb-trackable .ab-item:not(div),' +
			'#wp-admin-bar-notes .ab-item,' +
			'#wp-admin-bar-user-info .ab-item,' +
			'.mb-trackable .ab-secondary';

		$( trackableLinks ).on( 'click touchstart', function( e ) {
			var $target = $( e.target ),
				$parent = $target.closest( 'li' );

			if ( ! $parent ) {
				return;
			}

			var trackingId = $target.attr( 'ID' ) || $parent.attr( 'ID' );

			if ( ! linksTracksEvents.hasOwnProperty( trackingId ) ) {
				return;
			}

			var eventProps = { 'clicked': linksTracksEvents[ trackingId ] };

			recordTracksEvent( eventProps );
		} );
	} );

	// listen for postMessage events from the notifications iframe
	$( window ).on( 'message', function( e ) {
		var event = ! e.data && e.originalEvent.data ? e.originalEvent : e;
		if ( event.origin !== 'https://widgets.wp.com' ) {
			return;
		}

		var data = ( 'string' === typeof event.data ) ? parseJson( event.data, {} ) : event.data;
		if ( 'notesIframeMessage' !== data.type ) {
			return;
		}

		var eventData = notesTracksEvents[ data.action ];
		if ( ! eventData ) {
			return;
		}

		recordTracksEvent( eventData( data ) );
	} );

} )( jQuery );
;
