

class shapes {
  constructor() {
  }

}

class picker {

    constructor( _paintContext ) {

		this.paintContext = _paintContext;
		this.x = 0;
		this.y = 0;
		this.color = 'fg';
	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}


	mouseDown( pState ) {

		this.color = 'fg';
		if( pState.mouseState.rightButton ) {
			this.color = 'bg';
		}
		return { painted: false, overlay: false };

	}

	mouseUp( pState ) {

		this.x = pState.mouseState.x;
		this.y = pState.mouseState.y;

		return { painted: false, x: this.x, y: this.y, overlay: false, color: this.color  };
	}

	mouseMove( pState ) {

		return { painted: false, overlay: false };
	}

}

class grabFunction {

    constructor( _paintContext, _overlay, _w, _h ) {

		this.paintContext = _paintContext;
		this.overlay = _overlay;
		this.w = _w;
		this.h = _h;

		this.x1 =0;
		this.y1 =0;

		this.x2 =1;
		this.y2 =1;

	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}


	mouseDown( pState ) {

		this.x1 = pState.mouseState.x;
		this.y1 = pState.mouseState.y;

		return { painted: false, overlay: false };

	}

	mouseUp( pState ) {

		return { painted: false, overlay: false };
	}

	mouseMove( pState ) {


		if( pState.mouseState.leftButton ) {

			this.overlay.clear();

			this.x2 = pState.mouseState.x;
			this.y2 = pState.mouseState.y;

			this.overlay.setRect( this.x1, this.y1, this.x2, this.y2 );

			return { painted: true, overlay: true };
		}
		else {
			this.overlay.clear();
		}
		return { painted: false, overlay: false };
	}

}


class magicAreaFunction  {

	constructor( paintContext, _overlay,  w, h, bus ) {

		this.paintContext = paintContext;
		this.w = w;
		this.h = h;
		this.stack = [];
		this.bus = bus;
    this.overlay = _overlay;

		this.counter = 0;
	}

	mouseDown( pState ) {

		this.mousedown = true;

		return { painted: true };
	}


	mouseMove( pState ) {

		return { painted: false };

	}

	mouseUp( pState ) {

		if( !this.mousedown ) {
			return { painted: false };
		}

		this.mousedown = false;

		var x = pState.mouseState.x;
		var y = pState.mouseState.y;

		var area = this.discoverArea( x, y );

		return { painted: true, area: area };
	}


	discoverArea( _x, _y ) {
		var x = _x;
		var y = _y;

		this.stack = [];
		var stack = this.stack;

		this.x0 = _x;
		this.y0 = _y;
		this.x1 = _x;
		this.y1 = _y;

		this.counter = 0;

		this.mask = new BitBuffer( this.w * this.h );
		this.pixelbuffer = this.paintContext.getImageData(0, 0, this.w, this.h);
		this.pixelbufferdata = this.pixelbuffer.data;

		this.fillBg = this.paintContext.getImageData(x, y, 1, 1).data;

		this.tryPush({ x: x  , y: y });

		var wait = 0;
		var maxStack = 0;

		var lines = [];
    var rows = [];

    for ( var xx=0; xx<this.w; xx++ ) {
		    rows[ xx ] = { use: false };
		}

		for ( var yy=0; yy<this.h; yy++ ) {
		    lines[ yy ] = { use: false };
		}

		while( stack.length > 0 && stack.length < 5000000 && this.counter < 5000000) {

			wait ++;
			if( wait > 10000 ) {
				wait = 0;
			}

			if( wait == 0) {
				console.log("stack" + stack.length + " count" + this.counter);
				//this.doStackDump();
			}

			var el = stack.pop();

			if( wait == 0 ) {
				console.log("el " + el.x + ", " + el.y);
			}

			x = el.x;
			y = el.y;

			this.counter ++;

			this.mask.setBit( x + (y * this.w) , true);

			lines[ y ].use = true;
      rows[ x ].use = true;

			this.tryPush({ x: x+1  , y: y });
			this.tryPush({ x: x-1  , y: y });
			this.tryPush({ x: x  , y: y+1 });
			this.tryPush({ x: x  , y: y-1 });

		}

		this.pixelbufferdata = null;
		this.pixelbuffer = null;

		var y0=-1;
    var y1 = -1;
		for ( var yy=0; yy<this.h; yy++ ) {
			if ( lines[ yy ].use ) {
				if( y0 == -1 && y1 == -1 ) { y0=yy; y1 = yy;}
        else {
          if( yy > y1 ) {
            y1 = yy;
          }
          else if( yy < y0 ) {
            y0 = yy;
          }
        }
			}
		}

    var x0=-1;
    var x1=-1;
		for ( var xx=0; xx<this.w; xx++ ) {
			if ( rows[ xx ].use ) {
				if( x0 == -1 && x1 == -1 ) { x0=xx; x1 = xx;}
        else {
          if( xx > x1 ) {
            x1 = xx;
          }
          else if( xx < x0 ) {
            x0 = xx;
          }
        }
			}
		}

		//this.mask = null;

		console.log( "area xy->xy=" + x0 + "," + x1 + "-" + y0 + "," + y1 );

		var mask = this.mask;
		this.mask = null;

		return { pixels: mask, w: this.w , sx0: x0, sx1: x1, sy0: y0, sy1:y1 };

	}

	tryPush( el ) {

		if( el.x < 0 || el.y < 0 ) {
			//console.log("skipstack "+ el.x + " , " + el.y );
			return;
		}
		else if( el.x >= this.w || el.y >= this.h  ) {
			//console.log("skipstack "+ el.x + " , " + el.y );
			return;
		}

		if( ! this.isColor( el.x, el.y, this.fillBg ) ) {
			//console.log("skipstack wrong color "+ el.x + " , " + el.y );
			return;
		}

		if( this.mask.getBit( el.x + ( el.y * this.w ) ) ) {
			return;
		}

		this.stack.push( el );
	}

	doStackDump( ) {
		console.log( "StackDump==============================================" );
		for( var i=0; i<this.stack.length; i++ ) {
			console.log( "D:" + this.stack[ i ].x + "\t," + this.stack[ i ].y );
		}
	}

	isColor( x, y , bgColor ) {

		var offset = (4 * x ) + ( 4 * y * this.w );
		var pixels = this.pixelbufferdata;
		var pixel = [];
		pixel[ 0 ] = pixels[ offset+0 ];
		pixel[ 1 ] = pixels[ offset+1 ];
		pixel[ 2 ] = pixels[ offset+2 ];

		if( pixel[ 0] == bgColor[0] && pixel[1] == bgColor[1]  && pixel[2] == bgColor[2]  ) {
			return true;
		}
		return false;
	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}
}



class lineDF {

  constructor( _paintContext, _overlay  ) {

		this.paintContext = _paintContext;
		this.overlay = _overlay;
		this.brush = null;

    this.shapes = new Shapes();

	}


	getBrush( pState ) {
		var brush = pState.brush;
		if( pState.mouseState.rightButton ) {
			brush = pState.bgbrush;
		}
		return brush;
	}

	mouseDown( pState ) {

		this.x0 = pState.mouseState.x;
		this.y0 = pState.mouseState.y;

		return { painted: false, overlay: false };

	}

	mouseMove( pState ) {


		if( pState.mouseState.leftButton || pState.mouseState.rightButton ) {
			var linePoints = this.shapes.line( this.x0, this.y0, pState.mouseState.x, pState.mouseState.y );

			this.overlay.clearBrush();
			this.brush = this.getBrush( pState );

			for( var i = 0; i< linePoints.length; i++ ) {
				var p = linePoints[ i ];
				this.overlay.paintBrush( this.brush, p.x, p.y );
			}

			//pState.brush.draw( this.paintContext, pState.mouseState.x, pState.mouseState.y );

		}
		else {
			this.overlay.clearBrush();
			this.overlay.paintBrush( pState.brush, pState.mouseState.x, pState.mouseState.y );
			//this.overlay.paintBrush( pState.brush, pState.mouseState.y, pState.mouseState.x );

		}

		return { painted: false, overlay: true };
	}

	mouseUp( pState ) {

		this.overlay.clearBrush();

		var linePoints = this.shapes.line( this.x0, this.y0, pState.mouseState.x, pState.mouseState.y );


		if( this.brush == null ) {
			return { painted: false, overlay: false };
		}

		for( var i = 0; i< linePoints.length; i++ ) {
			var p = linePoints[ i ];

			this.brush.draw( this.paintContext, p.x, p.y );

		}

		return { true: false, overlay: false };
	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}

}


class ovalDF {

    constructor( _paintContext, _overlay  ) {

		this.paintContext = _paintContext;
		this.overlay = _overlay;
		this.brush = null;
    this.color = null;
    this.shapes = new Shapes();

    this.outline = true;
    this.fill = false;

	}

  getColor( pState ) {
    var color = pState.fgColor.getHTML();
    if( pState.mouseState.rightButton ) {
      color = pState.bgColor.getHTML();
    }
    return color;
  }

	getBrush( pState ) {
		var brush = pState.brush;
		if( pState.mouseState.rightButton ) {
			brush = pState.bgbrush;
		}
		return brush;
	}

	mouseDown( pState ) {

		this.x0 = pState.mouseState.x;
		this.y0 = pState.mouseState.y;

    this.fill = pState.shapeFill;
    this.outline = pState.shapeWithBrush;

    this.brush = this.getBrush( pState );
    this.color = this.getColor( pState );

		return { painted: false, overlay: false };

	}

	mouseMove( pState ) {


		if( pState.mouseState.leftButton || pState.mouseState.rightButton ) {
			var ovalPoints = this.shapes.oval( this.x0, this.y0, pState.mouseState.x, pState.mouseState.y );

			this.overlay.clearBrush();

			for( var i = 0; i< ovalPoints.length; i++ ) {
				var p = ovalPoints[ i ];
				this.overlay.paintBrush( this.brush, p.x, p.y );
			}

		}
		else {
			this.overlay.clearBrush();
			this.overlay.paintBrush( pState.brush, pState.mouseState.x, pState.mouseState.y );

		}

		return { painted: false, overlay: true };
	}

	mouseUp( pState ) {

		this.overlay.clearBrush();

		var ovalPoints = this.shapes.oval( this.x0, this.y0, pState.mouseState.x, pState.mouseState.y );

		if( this.brush == null ) {
			return { painted: false, overlay: false };
		}


    if( this.fill ) {
      var lines = this.shapes.solid( ovalPoints );

      console.log( "minmaxY" + lines.miny + "," + lines.maxy) ;

      this.paintContext.globalAlpha = 1.0;
      this.paintContext.fillStyle = this.color;
      for( var y = lines.miny; y<= lines.maxy; y++ ) {
        var l = lines[ y ];

        this.paintContext.fillRect(l.minx-1, y-1 , (l.maxx - l.minx)+1, 1 );

      }
    }

    if( this.outline ) {
  		for( var i = 0; i< ovalPoints.length; i++ ) {
  			var p = ovalPoints[ i ];

  			this.brush.draw( this.paintContext, p.x, p.y );

  		}
    }

		return { painted: true, overlay: false };
	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}

}


class rectangleDF {

    constructor( _paintContext, _overlay  ) {

		this.paintContext = _paintContext;
		this.overlay = _overlay;
		this.brush = null;
    this.color = null;
    this.shapes = new Shapes();

    this.outline = true;
    this.fill = false;

	}


	getBrush( pState ) {
		var brush = pState.brush;
		if( pState.mouseState.rightButton ) {
			brush = pState.bgbrush;
		}
		return brush;
	}

  getColor( pState ) {
    var color = pState.fgColor.getHTML();
    if( pState.mouseState.rightButton ) {
      color = pState.bgColor.getHTML();
    }
    return color;
  }

	mouseDown( pState ) {

		this.x0 = pState.mouseState.x;
		this.y0 = pState.mouseState.y;

    this.fill = pState.shapeFill;
    this.outline = pState.shapeWithBrush;

    this.brush = this.getBrush( pState );
    this.color = this.getColor( pState );

		return { painted: false, overlay: false };

	}

	mouseMove( pState ) {


		if( pState.mouseState.leftButton || pState.mouseState.rightButton ) {
			var rectPoints = this.shapes.rect( this.x0, this.y0, pState.mouseState.x, pState.mouseState.y );

			this.overlay.clearBrush();

			for( var i = 0; i< rectPoints.length; i++ ) {
				var p = rectPoints[ i ];
				this.overlay.paintBrush( this.brush, p.x, p.y );
			}

		}
		else {
			this.overlay.clearBrush();
			this.overlay.paintBrush( pState.brush, pState.mouseState.x, pState.mouseState.y );

		}

		return { painted: false, overlay: true };
	}

	mouseUp( pState ) {

		this.overlay.clearBrush();

		var rectPoints = this.shapes.rect( this.x0, this.y0, pState.mouseState.x, pState.mouseState.y );

		if( this.brush == null ) {
			return { painted: false, overlay: false };
		}

    if( this.fill ) {
      var lines = this.shapes.solid( rectPoints );

      console.log( "minmaxY" + lines.miny + "," + lines.maxy) ;

      this.paintContext.globalAlpha = 1.0;
      this.paintContext.fillStyle = this.color;
      for( var y = lines.miny; y<= lines.maxy; y++ ) {
        var l = lines[ y ];
        this.paintContext.fillRect(l.minx-1, y-1 , (l.maxx - l.minx)+1, 1 );
      }
    }

    if( this.outline ) {
  		for( var i = 0; i< rectPoints.length; i++ ) {
  			var p = rectPoints[ i ];

  			this.brush.draw( this.paintContext, p.x, p.y );
  		}
    }
		return { painted: false, overlay: false };
	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}

}


class solidDF {

    constructor( paintContext, _overlay ) {

		this.paintContext = paintContext;
		this.overlay = _overlay;
		this.prefX = undefined;
		this.prefY = undefined;
    this.shapes = new Shapes();

	}

	getBrush( pState ) {
		var brush = pState.brush;
		if( pState.mouseState.rightButton ) {
			brush = pState.bgbrush;
		}
		return brush;
	}

	mouseDown( pState ) {

		var brush = this.getBrush( pState );
		brush.draw( this.paintContext, pState.mouseState.x, pState.mouseState.y );

		this.prefX = pState.mouseState.x;
		this.prefY = pState.mouseState.y;

		return { painted: true, overlay: false };

	}

	mouseUp( pState ) {
		this.prefX = undefined;
		this.prefY = undefined;

		return { painted: false, overlay: false };
	}

	mouseMove( pState ) {


		if( pState.mouseState.leftButton || pState.mouseState.rightButton ) {

			var brush = this.getBrush( pState );

			if( this.prefX == undefined ) { this.prefX = pState.mouseState.x; this.prefY = pState.mouseState.y;}


      var linePoints = this.shapes.line( this.prefX, this.prefY, pState.mouseState.x, pState.mouseState.y );

			for( var i = 0; i< linePoints.length; i++ ) {
				var p = linePoints[ i ];
        brush.draw( this.paintContext, p.x, p.y );
			}

			this.prefX = pState.mouseState.x;
			this.prefY = pState.mouseState.y;

			this.overlay.clearBrush();

			return { painted: true, overlay: false };
		}

		this.overlay.clearBrush();
		this.overlay.paintBrush( pState.brush, pState.mouseState.x, pState.mouseState.y );

		return { painted: false, overlay: true };
	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}

}


class sprayDF {

    constructor( _paintContext, _overlay ) {

		this.paintContext = _paintContext;
		this.overlay = _overlay;
    this.size = 20;
    this.size2 = this.size / 2;

	}


  setSize( size ) {
    this.size = size;
    this.size2 = this.size / 2;
  }

	getBrush( pState ) {
		var brush = pState.brush;
		if( pState.mouseState.rightButton ) {
			brush = pState.bgbrush;
		}
		return brush;
	}

	mouseDown( pState ) {

		var brush = this.getBrush( pState );

    var xoff = Math.floor(Math.random() * this.size) - this.size2;
    var yoff = Math.floor(Math.random() * this.size) - this.size2;

		brush.draw( this.paintContext, pState.mouseState.x + xoff, pState.mouseState.y + yoff );

		return { painted: true, overlay: false };

	}

	mouseUp( pState ) {
		return { painted: false, overlay: false };
	}

	mouseMove( pState ) {

    var xoff = Math.floor(Math.random() * this.size) - this.size2;
    var yoff = Math.floor(Math.random() * this.size) - this.size2;

		if( pState.mouseState.leftButton ||  pState.mouseState.rightButton ) {

			var brush = this.getBrush( pState );

			brush.draw( this.paintContext, pState.mouseState.x + xoff, pState.mouseState.y + yoff);

			this.overlay.clearBrush();

			return { painted: true, overlay: false };
		}

		this.overlay.clearBrush();
		this.overlay.paintBrush( pState.brush, pState.mouseState.x + xoff, pState.mouseState.y + yoff );

		return { painted: false, overlay: true };
	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}

}

class simpleDF {

    constructor( _paintContext, _overlay ) {

		this.paintContext = _paintContext;
		this.overlay = _overlay;

	}


	getBrush( pState ) {
		var brush = pState.brush;
		if( pState.mouseState.rightButton ) {
			brush = pState.bgbrush;
		}
		return brush;
	}

	mouseDown( pState ) {

		var brush = this.getBrush( pState );
		brush.draw( this.paintContext, pState.mouseState.x, pState.mouseState.y );

		return { painted: true, overlay: false };

	}

	mouseUp( pState ) {
		return { painted: false, overlay: false };
	}

	mouseMove( pState ) {



		if( pState.mouseState.leftButton ||  pState.mouseState.rightButton ) {

			var brush = this.getBrush( pState );

			brush.draw( this.paintContext, pState.mouseState.x, pState.mouseState.y );

			this.overlay.clearBrush();

			return { painted: true, overlay: false };
		}

		this.overlay.clearBrush();
		this.overlay.paintBrush( pState.brush, pState.mouseState.x, pState.mouseState.y );

		return { painted: false, overlay: true };
	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}

}


class selectPointDF {

  constructor( _paintContext, _overlay ) {

		this.paintContext = _paintContext;
		this.overlay = _overlay;
    this.id = "none";

	}

  setFunctionId( id ) {
    this.id = id;
  }

  setFunctionData( data ) {
    this.fdata = data;
  }

	mouseDown( pState ) {

		return { painted: false, overlay: false };

	}

	mouseUp( pState ) {
				return { painted: false, x: pState.mouseState.x, y: pState.mouseState.y, overlay: false, functionId: this.id, functionData: this.fdata   };
	}

	mouseMove( pState ) {

    return { painted: false, overlay: false };
	}

	setPaintingDimensions( _w, _h ) {
		this.w = _w;
		this.h = _h;
	}

}
