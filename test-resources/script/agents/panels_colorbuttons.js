class RawPalette {

	constructor() {
		this.colors = [];
	}

	getColorCount() {
		return this.colors.length;
	}

	getColor( i ) {
		return this.colors[ i ];
	}

	roundComponent( c ) {
			var c2 = Math.round( c );

			if( c2 > 255 ) { return 255; }
			if( c2 < 0   ) { return 0;   }

			return c2;
	}
}


class FadedPalette extends RawPalette {

	constructor( rgb1, rgb2, colorCount ) {
		super();
		this.colors = [];

		var r1 = rgb1.r;
		var g1 = rgb1.g;
		var b1 = rgb1.b;

		var r2 = rgb2.r;
		var g2 = rgb2.g;
		var b2 = rgb2.b;

		var rdelta = (r2 - r1) / colorCount;
		var gdelta = (g2 - g1) / colorCount;
		var bdelta = (b2 - b1) / colorCount;

		var r=r1;
		var g=g1;
		var b=b1;

		for( var i=0; i<colorCount; i++) {
				var rgb = {
						r: this.roundComponent( r ),
						g: this.roundComponent( g ),
						b: this.roundComponent( b )
					}

					r += rdelta;
					g += gdelta;
					b += bdelta;

					this.colors.push( rgb );
	  }
	}

}


class FadedPalette2 extends RawPalette {

	constructor( rgb1, rgb2, rgb3, colorCount ) {

		super();
		this.colors = [];
		var colorCountDiv2 = Math.round( colorCount / 2 );

		var r1 = rgb1.r;
		var g1 = rgb1.g;
		var b1 = rgb1.b;

		var r2 = rgb2.r;
		var g2 = rgb2.g;
		var b2 = rgb2.b;

		var rdelta = (r2 - r1) / colorCount;
		var gdelta = (g2 - g1) / colorCount;
		var bdelta = (b2 - b1) / colorCount;

		var rgb2b = {
				r: this.roundComponent( rgb2.r + rdelta),
				g: this.roundComponent( rgb2.g + gdelta),
				b: this.roundComponent( rgb2.b + bdelta )
		}

		var p1 = new FadedPalette( rgb1, rgb2, colorCountDiv2);
		var p2 = new FadedPalette( rgb2b, rgb3, colorCountDiv2);

		for( var i=0; i<p1.getColorCount(); i++) {
			this.colors.push ( p1.getColor( i ) );
		}
		for( var i=0; i<p2.getColorCount(); i++) {
			this.colors.push ( p2.getColor( i ) );
		}

	}


}

class PaletteImage extends RawPalette {

	constructor( url, colorW, notifyLoaded ) {

			super();
			this.url = url;
			this.img = new Image();

			this.colorW = colorW;

			var thisPalette = this;

			this.loaded = false;

			this.colors = [];

			this.notifyLoaded = notifyLoaded;

			this.imgonload = function(){

				var w = thisPalette.img.width;
				var h = thisPalette.img.height;

				thisPalette.iconCanvas = document.createElement('canvas');
				thisPalette.iconContext = thisPalette.iconCanvas.getContext('2d');

				thisPalette.iconCanvas.width = 	w;
				thisPalette.iconCanvas.height = 	h;

				thisPalette.iconContext.drawImage( thisPalette.img, 0, 0, w, h);

				thisPalette.xiconcount = w / thisPalette.colorW;

				for (var xicon = 0; xicon < thisPalette.xiconcount; xicon++) {

					var sx = xicon * thisPalette.colorW;
					var sy = 0;
					var imgdata = thisPalette.iconContext.getImageData(sx, sy, 1, 1);
					var sd  = imgdata.data;

					var col = { r: sd[0], g: sd[1], b: sd[2] };

					thisPalette.colors.push( col );

				}

				thisPalette.loaded = true;

				console.log( "NotifyLoadedObject = " + thisPalette.notifyLoaded.obj);
				console.log( "NotifyLoadedFunct = " + thisPalette.notifyLoaded.method);

				thisPalette.notifyLoaded.obj[thisPalette.notifyLoaded.method]( thisPalette );

			}

	}

	activateLoadingEvents() {

		//Onload event
		this.img.onload = this.imgonload;
		this.load();

	}

	load() {
		this.img.src = this.url;
	}
}

class ColorButtonRenderer {

	constructor ( ctx, r, g, b, xo, yo, w, h, txt ) {

		this.xo = xo;
		this.yo = yo;

		this.w = w;
		this.h = h;
		this.colorData = ctx.createImageData( w, h);

		this.txt = txt;

		this.setColor( {r: r, g: g, b: b} );
	}

	getColor() {
		return this.rgb;
	}

	setColor( rgb ) {

		this.rgb = {};
		this.rgb.r = rgb.r;
		this.rgb.g = rgb.g;
		this.rgb.b = rgb.b;

		var r = rgb.r;
		var g = rgb.g;
		var b = rgb.b;
		var xoffset = 0;
		var yoffset = 0;
		var rowoffset = this.w * 4;
		var offset;
		var d  = this.colorData.data;                        // only do this once per page

		for (var y = 0; y < this.h; y++) {

			xoffset = 0;
			for (var x = 0; x < this.w; x++) {
				offset = yoffset + xoffset;

				d[ offset + 0] = r;
				d[ offset + 1] = g;
				d[ offset + 2] = b;
				d[ offset + 3] = 255;

				xoffset += 4;

			}

			yoffset += rowoffset;
		}
	}

	draw( context, x, y ) {

		context.putImageData( this.colorData, x + this.xo, y + this.yo );

		if( this.txt != null ) {
			context.font = '10px arial';
			context.textBaseline  = 'bottom';
			context.fillStyle = "#ffffff";
			context.fillText( this.txt,  x + this.xo + 4, y + this.yo + 11);

			context.fillStyle = "#000000";
			context.fillText( this.txt,  x + this.xo + 5, y + this.yo + 12);
		}
	}

}

class CurrentColorButtonRenderer {

	constructor ( ctx, r, g, b, xo, yo, w, h, mode ) {

		this.xo = xo;
		this.yo = yo;

		this.w = w;
		this.h = h;
		this.colorData = ctx.createImageData( w, h);

		this.mode = mode;
		this.setColor( {r: r, g: g, b: b} );


	}

	setColor( rgb ) {

		var xoffset = 0;
		var yoffset = 0;
		var rowoffset = this.w * 4;
		var offset;
		var d  = this.colorData.data;                        // only do this once per page

		var r = [];
		var g = [];
		var b = [];

		if( this.mode == 'fg' ) {
			r = [ rgb.r, 0, 128, 0 ];
			g = [ rgb.g, 0, 128, 0 ];
			b = [ rgb.b, 0, 128, 0 ];
		}
		else  {
			r = [ 128, 0 , rgb.r, 0];
			g = [ 128, 0 , rgb.g, 0];
			b = [ 128, 0 , rgb.b, 0];
		}

		var borderw = 6;
		var bordery = 0;

		var flip = 0;
		var flip2 = 0;

		for (var y = 0; y < this.h; y++) {

			bordery = 0;
			if( y < borderw || y >= (this.h - borderw) ) {
				bordery = 2;
			}
			else if( y == borderw || y == (this.h - borderw - 1) ) {
				bordery = 1;
			}

			xoffset = 0;
			for (var x = 0; x < this.w; x++) {

				var border = 0;

				flip = 1 - flip;
				if( flip == 1 ) {
					flip2 = 1 - flip2;
				}

				if( x < borderw || x >= (this.w - borderw) ) {
						border = 2;
				}
				else if( x == borderw || x == (this.w - borderw - 1) ) {
						border = 1;
				}

				if( bordery > border  ) {
					border = bordery;
				}

				if( ( ( border == 2 && this.mode == 'fg' ) || ( border == 0 && this.mode == 'bg' ) ) && flip2 == 0) {
					border = 3;
				}

				offset = yoffset + xoffset;

				d[ offset + 0] = r[ border ];
				d[ offset + 1] = g[ border ];
				d[ offset + 2] = b[ border ];
				d[ offset + 3] = 255;

				xoffset += 4;

			}

			yoffset += rowoffset;
		}
	}

	draw( context, x, y ) {

		context.putImageData( this.colorData, x + this.xo, y + this.yo );
	}

}

class CurrentColorsButtonRenderer {

	constructor ( ctx, xo, yo, w, h ) {

		this.xo = xo;
		this.yo = yo;

		this.w = w;
		this.h = h;
		this.colorData = ctx.createImageData( w, h);

		this.colors = [];
		this.colors[ 'fg' ] = {r: 255, g: 0, b: 255};
		this.colors[ 'bg' ] = {r: 0, g: 0, b: 0};

		this.render();
	}

	setColor( rgb, mode ) {

		this.colors[ mode ] = rgb;
		this.render();

	}

	render() {

		var xoffset = 0;
		var yoffset = 0;
		var rowoffset = this.w * 4;
		var offset;
		var d  = this.colorData.data;                        // only do this once per page

		var r0 = [];
		var g0 = [];
		var b0 = [];

		var r1 = [];
		var g1 = [];
		var b1 = [];

		var rgbF = this.colors[ 'fg' ];
		var rgbB = this.colors[ 'bg' ];

		var bgBW = 8;
		var bgBH = 8;

		xoffset = 0;
		yoffset = 0;
		for (var y = 0; y < this.h; y++) {

			xoffset = 0;
			for (var x = 0; x < this.w; x++) {

				offset = yoffset + xoffset;

				d[ offset + 0] = rgbB.r;
				d[ offset + 1] = rgbB.g;
				d[ offset + 2] = rgbB.b;
				d[ offset + 3] = 255;

				xoffset += 4;

			}

			yoffset += rowoffset;
		}

		xoffset = 0;
		yoffset = 0;
		yoffset += ( rowoffset * (bgBW - 1) );
		for (var y = bgBH-1; y < (this.h - (bgBH - 1)); y++) {

			xoffset = 0;
			xoffset += ( 4 * (bgBW -1) );
			for (var x = bgBW-1; x < (this.w - (bgBW -1)); x++) {

				offset = yoffset + xoffset;

				d[ offset + 0] = 0;
				d[ offset + 1] = 0;
				d[ offset + 2] = 0;
				d[ offset + 3] = 255;

				xoffset += 4;

			}

			yoffset += rowoffset;
		}

		xoffset = 0;
		yoffset = 0;
		yoffset += ( rowoffset * bgBW );
		for (var y = bgBH; y < (this.h - bgBH); y++) {

			xoffset = 0;
			xoffset += ( 4 * bgBW );
			for (var x = bgBW; x < (this.w - bgBW); x++) {

				offset = yoffset + xoffset;

				d[ offset + 0] = rgbF.r;
				d[ offset + 1] = rgbF.g;
				d[ offset + 2] = rgbF.b;
				d[ offset + 3] = 255;

				xoffset += 4;

			}

			yoffset += rowoffset;
		}

	}

	draw( context, x, y ) {

		context.putImageData( this.colorData, x + this.xo, y + this.yo );
	}

}
