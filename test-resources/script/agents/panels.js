
class 	InfoRenderer {

	constructor ( ctx, xo, yo, w, h, name ) {

		this.xo = xo;
		this.yo = yo;

		this.w = w;
		this.h = h;

		this.mouseXPos = 0;
		this.mouseYPos = 0;
		this.imgW = 1024;
		this.imgH = 768;
		this.mode = 'draw';
		this.undoBuffer = 0;
		this.zoomFactor = 1;
		this.brushw = 1;
		this.brushh = 1;
		this.imageName = name;

	}

	draw( ctx, x, y ) {

	  var size = 9;
		var line = 0;
	  var xoff = 4;
	  var yoff = 4 + (size);

	  ctx.font = size + 'px arial';
	  ctx.textBaseline  = 'bottom';
	  ctx.fillStyle = "#000000";

	  var info =  this.imgW + 'x' + this.imgH + '       ' + '(' + this.mouseXPos + ', ' + this.mouseYPos + ')';
		ctx.fillText( this.imageName, 	x + xoff , y + yoff + (size * line) ); line++;
	  ctx.fillText( info, 						x + xoff , y + yoff + (size * line) ); line++;
		ctx.fillText( 'brush: ' + this.brushw + "x" + this.brushh , x + xoff , y + yoff + (size * line) );line++;
	  ctx.fillText( 'tool: ' + this.mode + '    undo: ' + this.undoBuffer , x + xoff , y + yoff + (size * line));line++;
		ctx.fillText( 'zoom: ' + this.zoomFactor, x + xoff , y + yoff + (size * line) );line++;

	}
}


class PanelsAgent {

	getId() {
		return 'Panels';
	}

	initColors() {
		this.cblack = { r:  0,g:  0,b:  0};
		this.cred   = { r:255,g:  0,b:  0};
		this.cgreen = { r:  0,g:255,b:  0};
		this.cblue  = { r:  0,g:  0,b:255};
		this.cyellow  = { r:255,g:255,b:  0};
		this.ccyan    = { r:  0,g:255,b:255};
		this.cpurple  = { r:255,g:  0,b:255};
		this.cwhite = { r:255,g:255,b:255};
	}

  constructor( _bus, _constants, _SCRW, _SCRH, _viewprio ) {

		this.bus = _bus;
		this.SCRW = _SCRW;
		this.SCRH = _SCRH;
		this.viewPriority  = _viewprio;
		this.hidePanelFlag = false;
		this.brushIsImage = false
		this.panelW = 1024;
		this.lastFunction = [];
		this.lastFunctionParam = [];
		this.lastFunctionButton = [];
		this.lastFunctionOptions = [];
		this.tilesW = 30;
		this.tilesH = 25;
		this.autoBrushShape = 'rnd';
		this.constants = _constants;
		this.toolOps = [];

		/* Build */
		var gw = 30;
		var gh = 25;

		this.colorBox = new ColorBox();

		var panelsManager = new PanelsManager( _SCRW, _SCRH, gh, gw );
		this.panelsManager = panelsManager;

		this.updateScreenHandlerRec = { obj: this, method: 'signalScreenUpdate' };
		this.changeResolutionHandlerRec = { obj: this, method: 'changePictureResolution' };

		var mainBP = new ButtonPanel( "buttons", this.panelW,80,gw,gh, this.updateScreenHandlerRec.obj, 'signalScreenUpdate' );

		var id=0;
		var b=[];


		//Colors
		this.hsv_S = 1;
		this.hsv_V = 1;

		this.colrenderers = [];
		this.bcols = [];
		this.colbuttons = [];

		var colbuttw_f = 0.7;
		//var colbuttw_i = Math.round( colbuttw_f );
		var colbuttw2  = Math.round( colbuttw_f * gw);
		var cxoff = 0;
		var cyoff = 0;
		var cxw = colbuttw2-0;
		var cxh = (gh)-0;

		this.buttn_maxcol = 32;
		this.buttn_huefact = 360 / (this.buttn_maxcol + 1);

		this.colorsRenderer = ( new CurrentColorsButtonRenderer ( mainBP.getContext(), cxoff,cyoff,gw,cxh ) );
		this.infoRenderer = ( new InfoRenderer ( mainBP.getContext(), cxoff,cyoff,gw,cxh, _constants.initialImageName ) );

		this.infoRenderer.imgW = _SCRW;
		this.infoRenderer.imgH = _SCRH;

		this.initColors();

		this.fgColor = this.cwhite;
		this.bgColor = this.cblack;

		this.colorMode = 'fg';

		this.updatePaletteRec = { obj: this, method: 'changePalette' };
		this.defaultPalette = new PaletteImage( "res/img/palette/default.png" , 1, this.updatePaletteRec );

		var rgb;
		for (var i = 0; i < this.buttn_maxcol; i++) {
			this.colrenderers[i] = ( new ColorButtonRenderer ( mainBP.getContext(), 0, 0, 0, cxoff,cyoff,cxw,cxh, i.toString(16)) );
			this.bcols.push( { r: 0, g: 0, b: 0 } );
		}

		var iisButtons = new IconImageStrip( "res/img/button/icons.png", 30, 25, true, this.updateScreenHandlerRec );
		this.iisButtons = iisButtons;

		var iisButtons1b = new IconImageStrip( "res/img/button/icons1b.png", 30, 25, true, this.updateScreenHandlerRec );
		this.iisButtons1b = iisButtons1b;

		var panelIcons = [];

		panelIcons['disk'	] = new PanelIcon( iisButtons, 0 );
		panelIcons['save'	] = new PanelIcon( iisButtons, 1 );
		panelIcons['load'	] = new PanelIcon( iisButtons, 2 );
		panelIcons['mode'	] = new PanelIcon( iisButtons, 3 );
		panelIcons['gear'	] = new PanelIcon( iisButtons, 4 );
		panelIcons['pbucket'] = new PanelIcon( iisButtons, 5 );
		panelIcons['draw'	] = new PanelIcon( iisButtons, 6 );
		panelIcons['drawsolid'	] = new PanelIcon( iisButtons, 7 );
		panelIcons['line'	] = new PanelIcon( iisButtons, 8 );
		panelIcons['capture'] = new PanelIcon( iisButtons, 9 );
		panelIcons['clear']   = new PanelIcon( iisButtons, 10 );
		panelIcons['pbucketselect'] = new PanelIcon( iisButtons, 11 );
		panelIcons['brush2pic'] = new PanelIcon( iisButtons, 12 );
		panelIcons['undo'] = new PanelIcon( iisButtons, 13 );
		panelIcons['picker'] = new PanelIcon( iisButtons, 14 );
		panelIcons['rectangle'] = new PanelIcon( iisButtons, 15 );
		panelIcons['oval'] = new PanelIcon( iisButtons, 16 );
		panelIcons['redo'] = new PanelIcon( iisButtons, 17 );
		panelIcons['resize'] = new PanelIcon( iisButtons, 18 );
		panelIcons['flipy'] = new PanelIcon( iisButtons, 19 );
		panelIcons['flipx'] = new PanelIcon( iisButtons, 20 );
		panelIcons['trim'] = new PanelIcon( iisButtons, 21 );
		panelIcons['feather'] = new PanelIcon( iisButtons, 22 );
		panelIcons['magicbrush'] = new PanelIcon( iisButtons, 23 );
		panelIcons['tiles'] = new PanelIcon( iisButtons, 24 );
		panelIcons['rotatebrush90'] = new PanelIcon( iisButtons, 25 );
		panelIcons['picturebrush'] = new PanelIcon( iisButtons, 26 );
		panelIcons['spray'] = new PanelIcon( iisButtons, 27 );
		panelIcons['palette'] = new PanelIcon( iisButtons, 28 );
		panelIcons['paletteedit'] = new PanelIcon( iisButtons, 29 );
		panelIcons['brushtools'] = new PanelIcon( iisButtons1b, 0 );
		panelIcons['magic'] = new PanelIcon( iisButtons1b, 1 );
		panelIcons['view'] = new PanelIcon( iisButtons1b, 2 );
		panelIcons['magnify'] = new PanelIcon( iisButtons1b, 3 );
		panelIcons['colorize'] = new PanelIcon( iisButtons1b, 4 );
		panelIcons['transparent'] = new PanelIcon( iisButtons1b, 5 );
		panelIcons['dontmagnify'] = new PanelIcon( iisButtons1b, 6 );
		panelIcons['togglefilloff'] = new PanelIcon( iisButtons1b, 7 );
		panelIcons['togglefillon'] = new PanelIcon( iisButtons1b,  8 );
		panelIcons['togglefillonnobrush'] = new PanelIcon( iisButtons1b,  9 );
		panelIcons['brushsettings'] = new PanelIcon( iisButtons1b,  10 );
		panelIcons['gradient'] = new PanelIcon( iisButtons1b,  11 );
		panelIcons['copyto'] = new PanelIcon( iisButtons1b,  12 );
		panelIcons['gray'] = new PanelIcon( iisButtons1b,  13 );
		panelIcons['sepia'] = new PanelIcon( iisButtons1b,  14 );
		panelIcons['softenbrush'] = new PanelIcon( iisButtons1b,  15 );
		panelIcons['figure-normal'] = new PanelIcon( iisButtons1b,  16 );
		panelIcons['figure-light'] = new PanelIcon( iisButtons1b,  17 );
		panelIcons['figure-dark'] = new PanelIcon( iisButtons1b,  18 );
		panelIcons['figure-colorize'] = new PanelIcon( iisButtons1b,  19 );
		panelIcons['figure-resize'] = new PanelIcon( iisButtons1b,  20 );

		var row;
		var buttonDefs;
		row=0;

		buttonDefs = [];

		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['load'], txt:"Load" }, 	 		  callfunction: [this, 'load'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['save'], txt:"Save" },    		  callfunction: [this, 'saveQuick'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_SEPARATOR, render: null, callfunction: null } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['save'], txt:"Save with Options" },    		  callfunction: [this, 'save'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_SEPARATOR, render: null, callfunction: null } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['brush2pic'], txt:"Load From Brush"  },     		  callfunction: [this, 'brush2pic'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_SEPARATOR, render: null, callfunction: null } );
		buttonDefs.push( { type: PPAINTR_BTYPE_SEPARATOR, render: null, callfunction: null } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['resize'], txt:"Resize Picture"  },     		  callfunction: [this, 'resize'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['clear'], txt:"Clear Picture"  },     		  callfunction: [this, 'clear'] } );

		var menubutton = new ToolButton( id++, PANEL_LEFTALIGN,row, 3, 1,  PPAINTR_BTYPE_CLICK, {txt:"File" ,ico: panelIcons['disk']},  null, null,null );
		var menumanager =  new MenuManager( "menu:manage1",  gw * 5.5, gh,
									buttonDefs, this.updateScreenHandlerRec.obj, this.updateScreenHandlerRec.method );
		menubutton.addMenuManager( menumanager );
		b.push( menubutton );



		/*-------------------------*/
				buttonDefs = [];
				buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['figure-normal'], txt:"Normal" },    		  callfunction: [this, 'setDrawModeNormal'] } );
				buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['figure-colorize'], txt:"Colorize" }, 	 		  callfunction: [this, 'setDrawModeColorize'] } );
				buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['figure-light'], txt:"Lighten"  },     		  callfunction: [this, 'setDrawModeLighten'] } );
				buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['figure-dark'], txt:"Darken"  },     		  callfunction: [this, 'setDrawModeDarken'] } );
				var menubutton = new ToolButton( id++, PANEL_LEFTALIGN,row, 3, 1,  PPAINTR_BTYPE_CLICK, {txt:"Mode" ,ico: panelIcons['mode']},  null, null,null );
				var menumanager =  new MenuManager( "menu:manage4",  gw * 5, gh,
											buttonDefs, this.updateScreenHandlerRec.obj, this.updateScreenHandlerRec.method );
				menubutton.addMenuManager( menumanager );
				b.push( menubutton );
		/*-------------------------*/



		b.push( new Separator( id++, PANEL_LEFTALIGN, row ) );


		var iisButtons2 = new IconImageStrip( "res/img/button/brushicons-round.png", 30, 25, true, this.updateScreenHandlerRec );
		this.iisButtons2 = iisButtons2;

		panelIcons['brushround1'	] = new PanelIcon( iisButtons2, 0 );
		panelIcons['brushround5'	] = new PanelIcon( iisButtons2, 2 );
		panelIcons['brushround13'	] = new PanelIcon( iisButtons2, 6 );
		panelIcons['brushround23'	] = new PanelIcon( iisButtons2, 11 );

		var iisButtons3 = new IconImageStrip( "res/img/button/brushicons-square.png", 30, 25, true, this.updateScreenHandlerRec );
		this.iisButtons3 = iisButtons3;

		panelIcons['brushsqr3'	] = new PanelIcon( iisButtons3, 1 );
		panelIcons['brushsqr9'	] = new PanelIcon( iisButtons3, 4 );
		panelIcons['brushsqr15'	] = new PanelIcon( iisButtons3, 7 );
		panelIcons['brushsqr23'	] = new PanelIcon( iisButtons3, 11 );

		b.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['clear']},  null, this, 'clear' ));
		b.push( new ToolButton( 'action.picture:undo', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['undo']},  null, this,   'undo' ));
		b.push( new ToolButton( 'action.picture:redo', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['redo']},  null, this,   'redo' ));


		b.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		buttonDefs = [];

		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['flipx'], txt:"FlipX" },    		 callfunction: [this, 'flipX'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['flipy'], txt:"FlipY"},    		   callfunction: [this, 'flipY'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['rotatebrush90'], txt:"Rotate90" }, callfunction: [this, 'rotatebrush90'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['figure-resize'], txt:"Scale..." }, callfunction: [this, 'scaleBrush'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_SEPARATOR, render: null, callfunction: null } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['feather'], txt:"Feather" },    	 callfunction: [this, 'feather'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['trim'], txt:"Trim" },    		   callfunction: [this, 'trim'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_SEPARATOR, render: null, callfunction: null } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['colorize'], txt:"Set Color" },    	 callfunction: [this, 'colorize'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['transparent'], txt:"More Transparent" },   callfunction: [this, 'makeTransparent'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['softenbrush'], txt:"Soften" },   callfunction: [this, 'softenBrush'] } );

		var menubutton = new ToolButton( id++, PANEL_LEFTALIGN,row, 3, 1,  PPAINTR_BTYPE_CLICK, { txt: 'Modify', ico: panelIcons['brushsettings']},  null, null,null );
		var menumanager =  new MenuManager( "menu:manage4b",  gw * 5, gh,
									buttonDefs, this.updateScreenHandlerRec.obj, this.updateScreenHandlerRec.method );
		menubutton.addMenuManager( menumanager );
		b.push( menubutton );

		b.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		var hook = new Hook( id++, PANEL_LEFTALIGN, row );
		b.push( hook );

		mainBP.makeAttachedSubPanel( "brushes", hook );

		var bb = [];

		bb.push( new ToolButton( "grab:brush", PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['capture']}  ,  null, this, 'grabBrush' ));
		bb.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['magicbrush']}  ,  null, this, 'magicGrabBrush' ));

		bb.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		bb.push( new ToolButton( "brushtype:grab", PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['picturebrush']},  'brushform', this, "useImageBrush" ));

		bb.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		bb.push( new ToolButton( 'brushform:pixel', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['brushround1']},  'brushform', this, 'b1' ));
		bb.push( new ToolButton( 'brushform:rnd', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['brushround13']}, 'brushform', this,  'bround' ));
		bb.push( new ToolButton( 'brushform:sqr', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['brushsqr15']}, 'brushform', this,  'bsqr' ));
		bb.push( new ToolButton( 'brushform:softrnd', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['softenbrush']}, 'brushform', this,  'bsoftround' ));

		bb.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		this.valueAutoBrushSize = new SliderButtonValue( 16, 2, 64, 1 );
		var autoBrushSizeHandler = { obj: this, method: 'autoBrushSizeHandler' }
		bb.push(
				new SliderButton( "SizeSlider" + id++,
					PANEL_LEFTALIGN,row,
					4, .8,
					PPAINTR_BTYPE_HSLIDER,
					this.valueAutoBrushSize,  'AUTOBRUSHSIZE', autoBrushSizeHandler ));

/*
		var bb2 = [];
		mainBP.makeAttachedSubPanel( "brushops", hook );

		bb2.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['capture']}  ,  null, this, 'grabBrush' ));
		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['magicbrush']}  ,  null, this, 'magicGrabBrush' ));

		bb2.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['flipx']}  ,  null, this, 'flipX' ));
		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['flipy']}  ,  null, this, 'flipY' ));
		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['rotatebrush90']}  ,  null, this, 'rotatebrush90' ));
		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['figure-resize']}  ,  null, this, 'scaleBrush' ));

		bb2.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['feather']}  ,  null, this, 'feather' ));
		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['trim']}  ,  null, this, 'trim' ));

		bb2.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['colorize']}  ,  null, this, 'colorize' ));
		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['transparent']}  ,  null, this, 'makeTransparent' ));
		bb2.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['softenbrush']}  ,  null, this, 'softenBrush' ));
*/

		row = 1;
/*---------------------*/

		buttonDefs = [];
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['tiles'], txt:"Tiles On/Off" },    		  	 callfunction: [this, 'flipTiles'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['tiles'], txt:"Tiles Size" },    		  	 callfunction: [this, 'tilesSettings'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_SEPARATOR, render: null, callfunction: null } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['magnify'], txt:"Zoom x4" },      callfunction: [this, 'zoomX4'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['magnify'], txt:"Zoom x8" },      callfunction: [this, 'zoomX8'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['magnify'], txt:"Zoom x16" },     callfunction: [this, 'zoomX16'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['dontmagnify'], txt:"No Zoom" },      callfunction: [this, 'zoomX1'] } );


		var menubutton = new ToolButton( id++, PANEL_LEFTALIGN,row, 3, 1,  PPAINTR_BTYPE_CLICK, {txt:"View" ,ico: panelIcons['view']},  null, null,null );
		var menumanager =  new MenuManager( "menu:manage2",  gw * 5, gh,
									buttonDefs, this.updateScreenHandlerRec.obj, this.updateScreenHandlerRec.method );
		menubutton.addMenuManager( menumanager );
		b.push( menubutton );

		/*---------------*/
		buttonDefs = [];
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['flipx'], txt:"FlipX"  },     		  callfunction: [this, 'effectFlipX'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['flipy'], txt:"FlipY"  },     		  callfunction: [this, 'effectFlipY'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['rotatebrush90'], txt:"90 Degrees"  },     		  callfunction: [this, 'effectRotate90'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_SEPARATOR, render: null, callfunction: null } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['gray'], txt:"Grayscale" },    		  callfunction: [this, 'effectBnW'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['sepia'], txt:"Sepia" }, 	 		  callfunction: [this, 'effectSepia'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['trim'], txt:"Trim"  },     		  callfunction: [this, 'effectDePixel'] } );
		var menubutton = new ToolButton( id++, PANEL_LEFTALIGN,row, 3, 1,  PPAINTR_BTYPE_CLICK, {txt:"Effect" ,ico: panelIcons['magic']},  null, null,null );
		var menumanager =  new MenuManager( "menu:manage3",  gw * 5, gh,
									buttonDefs, this.updateScreenHandlerRec.obj, this.updateScreenHandlerRec.method );
		menubutton.addMenuManager( menumanager );
		b.push( menubutton );
		/*-------------------------*/

		b.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		//buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: {ico: panelIcons['tiles'], txt:"Grid On/Off" },    		  	 callfunction: [this, 'tilesSettings'] } );
		b.push( new ToolButton( 'mode.view:dummy', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['tiles']},  'tiles', this, 'flipTiles' ));

		b.push( new ToolButton( 'mode.view:magnify', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['magnify']},  'drawmode', this, 'zoomRelative' ));
		b.push( new ToolButton( 'mode.view:dontmagnify', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['dontmagnify']},  null, this, 'zoomX1' ));



		b.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		b.push( new ToolButton( 'mode.draw:solid', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['drawsolid']}  ,  'drawmode', this, 'setModeDrawSolid' ));
		b.push( new ToolButton( 'mode.draw:line', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['line']}  ,  'drawmode', this, 'setModeLine' ));
		b.push( new ToolButton( 'mode.draw:simple', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['draw']}  ,  'drawmode', this, 'setModeDraw' ));
		b.push( new ToolButton( 'mode.draw:spray', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['spray']}  ,  'drawmode', this, 'setModeSpray' ));

		this.toolOps['mode.draw:solid'] = null;
		this.toolOps['mode.draw:line'] = null;
		this.toolOps['mode.draw:simple'] = null;
		this.toolOps['mode.draw:spray'] = null;

		b.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		b.push( new ToolButton( 'mode.draw:rectangle', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['rectangle']}  ,  'drawmode', this, 'setModeRectangle' ));
		b.push( new ToolButton( 'mode.draw:oval', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['oval']}  ,  'drawmode', this, 'setModeOval' ));

		b.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		b.push( new ToolButton( 'mode.draw:pbucket', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['pbucket']}  ,  'drawmode', this, 'setModeFill' ));
		b.push( new ToolButton( 'mode.draw:pbucketselect', PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_TOGGLE, {ico: panelIcons['pbucketselect']}  ,  'drawmode', this, 'setModeFill2' ));

		this.toolOps['mode.draw:pbucket'] = null;
		this.toolOps['mode.draw:pbucketselect'] = null;

		b.push( new Separator( id++, PANEL_LEFTALIGN, row ) );

		var optionsAnchor = new Hook( id++, PANEL_LEFTALIGN, row );
		b.push( optionsAnchor );

		//---------------
		mainBP.makeAttachedSubPanel( "sprayops", optionsAnchor );
		this.toolOps['mode.draw:spray'] = "sprayops";

		var optionsspray = [];

		this.valueSpraySize = new SliderButtonValue( 16, 3, 256, 5 );
		var spraySizeHandler = { obj: this, method: 'spraySizeHandler' }
		optionsspray.push(
				new SliderButton( "SpraySizeSlider" + id++,
					PANEL_LEFTALIGN,0,
					4, .8,
					PPAINTR_BTYPE_HSLIDER,
					this.valueSpraySize,  'AUTOBRUSHSIZE', spraySizeHandler ));

		//------------

		mainBP.makeAttachedSubPanel( "shapeops", optionsAnchor );
		this.toolOps['mode.draw:rectangle'] = "shapeops";
		this.toolOps['mode.draw:oval'] = "shapeops";

		var optionsshape = [];

		this.toggleFillModeButton = new ToolButton( 'toggle:fill', PANEL_LEFTALIGN,0, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['togglefilloff']}  ,  null, this, 'toggleFillMode' );
		optionsshape.push( this.toggleFillModeButton );
		this.toggleFillModeFlag = 0;
		this.toggleFillOffIcon = panelIcons['togglefilloff'];
		this.toggleFillOnIcon = panelIcons['togglefillon'];
		this.toggleFillOnIconNoBrush = panelIcons['togglefillonnobrush'];

		//-------------

		this.infoArea = new ToolButton( id++, PANEL_RIGHTALIGN,row-1, 5, 2,  PPAINTR_BTYPE_INFOAREA, {robj: this.infoRenderer },  null, null, null )
		this.infoArea.noborder = true;
		b.push( this.infoArea );

		mainBP.setButtons( b, 'root' );
		mainBP.setButtons( bb, 'brushes' );
		//mainBP.setButtons( bb2, 'brushops' );
		mainBP.setButtons( optionsspray, 'sprayops' );
		mainBP.setButtons( optionsshape, 'shapeops' );

		mainBP.subPanelSetActiveState("brushops", false);

		mainBP.placeButtons();
		mainBP.selectToggleButton( 'drawmode', 'mode.draw:solid');
		mainBP.selectToggleButton( 'brushform', 'brushform:pixel');
		this.lastBrushSizeButton = mainBP.getToggleButtonId( 'brushform' );
		mainBP.updateRender();

		this.mainBP = mainBP;
		this.setModeDrawSolid();

		panelsManager.addPanel( mainBP );

		b = [];
		row = 0;
		var colBP = new ButtonPanel( "colors",
					this.panelW,30,
					gw,gh,
					this.updateScreenHandlerRec.obj, this.updateScreenHandlerRec.method
					);

		this.buttnCurrentColors = new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_INFOAREA, {robj: this.colorsRenderer },  null, null, null );
		this.buttnCurrentColors.noborder = true;
		b.push( this.buttnCurrentColors );

		b.push( new ToolButton( id++, PANEL_LEFTALIGN,row, 1, 1,  PPAINTR_BTYPE_CLICK, {ico: panelIcons['picker']},  null, this, 'picker' ));

		for (var i = 0; i < this.bcols.length; i++) {

			var buttn = new ToolButton( id++, PANEL_LEFTALIGN,row, colbuttw_f, 1,  PPAINTR_BTYPE_TOGGLE,
								{robj: this.colrenderers[i]},  'colors', this, 'col' + i );
			buttn.noborder = true;
			this.colbuttons[ i ] = buttn;
			b.push( buttn );

		}

		buttonDefs = [];
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Grays" },      callfunction: [this, 'makePalleteGrays'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Reds" },    		callfunction: [this, 'makePalleteReds'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Greens" }, 	 	callfunction: [this, 'makePalleteGreens'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Blues" },    	callfunction: [this, 'makePalleteBlues'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Purples" },    callfunction: [this, 'makePalletePurples'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Yellows" },    callfunction: [this, 'makePalleteYellows'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Cyans" },    	callfunction: [this, 'makePalleteCyans'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Orange/Browns" },    callfunction: [this, 'makePalleteOranges'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Rainbow" },    callfunction: [this, 'makePalleteRainbow'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Dark Rainbow" },    callfunction: [this, 'makePalleteDark'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Pastel" },    callfunction: [this, 'makePalletePastel'] } );
		buttonDefs.push( { type: PPAINTR_BTYPE_CLICK, render: { txt:"Default" },    callfunction: [this, 'makePalleteDefault'] } );

		b.push( new ToolButton( 'palette:edit', PANEL_LEFTALIGN,row, 2.75, 1,  PPAINTR_BTYPE_CLICK, {txt:"Edit" ,ico: panelIcons['paletteedit']},  'Edit', this, 'editPalette' ));

		b.push( new Separator( id++, PANEL_LEFTALIGN, row ) );
		var quickpalette = new ToolButton( id++, PANEL_LEFTALIGN,row, 3, 1,  PPAINTR_BTYPE_CLICK, {txt:"Select" ,ico: panelIcons['palette']},  null, null,null );
		menumanager =  new MenuManager( "menu:managequickpalette",  gw * 5, gh,
									buttonDefs, this.updateScreenHandlerRec.obj, this.updateScreenHandlerRec.method );
		quickpalette.addMenuManager( menumanager );
		b.push( quickpalette );

		colBP.setButtons( b, "root" );
		colBP.placeButtons();

		this.colorsPanel = colBP;
		panelsManager.addPanel( colBP );

		panelsManager.centerHPanel( this.colorsPanel );
		panelsManager.centerHPanel( this.mainBP );
		panelsManager.calculate();

		/* Self register */
		this.bus.register( this, [ "APPMOUSE", "APPKEYBOARD", "PANEL" ], this.getId() );

		this.panelIcons = panelIcons;
	}

/*
	setPanelBrushModify( bid ) {
		this.mainBP.subPanelSetActiveState("brushes", false);
		this.mainBP.subPanelSetActiveState("brushops", true);

	}

	setPanelBrushSelect( bid ) {
		this.mainBP.subPanelSetActiveState("brushops", false);
		this.mainBP.subPanelSetActiveState("brushes", true);
	}
*/


	toggleFillMode( bid ) {

		this.toggleFillModeFlag += 1;
		if( this.toggleFillModeFlag >2 ) { this.toggleFillModeFlag = 0; }

		if( this.toggleFillModeFlag == 0 ) {
				this.toggleFillModeButton.changeIcon( this.toggleFillOffIcon );
		} else if( this.toggleFillModeFlag == 1 ) {
				this.toggleFillModeButton.changeIcon( this.toggleFillOnIcon );
		} else  {
				this.toggleFillModeButton.changeIcon( this.toggleFillOnIconNoBrush );
		}

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'SETSHAPEFILL';
		sig.data = {};
		sig.data.fill = this.toggleFillModeFlag == 1 || this.toggleFillModeFlag == 2;
		sig.data.brush = this.toggleFillModeFlag == 0 || this.toggleFillModeFlag == 1;
		sig.destination = 'Paint';

		this.bus.post( sig );
	}

	makePalleteDefault( bid ) {
		this.changePalette( this.defaultPalette );
	}

	makeFadedPalette( rgb1, rgb2 ) {
		var pal =
			new FadedPalette(
					rgb1,
					rgb2,
					this.buttn_maxcol
			);

			this.changePalette( pal );
	}

	makeFadedPalette2( rgb1, rgb2, rgb3 ) {
		var pal =
			new FadedPalette2(
					rgb1,
					rgb2,
					rgb3,
					this.buttn_maxcol
			);

			this.changePalette( pal );
	}


	makePalleteGrays( bid ) {
		this.makeFadedPalette( this.cblack, this.cwhite );
	}
	makePalleteReds( bid ) {
		this.makeFadedPalette2( this.cblack, this.cred, this.cwhite );
	}
	makePalleteGreens( bid ) {
		this.makeFadedPalette2( this.cblack, this.cgreen, this.cwhite );
	}
	makePalleteBlues( bid ) {
		this.makeFadedPalette2( this.cblack, this.cblue, this.cwhite );
	}
	makePalletePurples( bid ) {
		this.makeFadedPalette2( this.cblack, this.cpurple, this.cwhite );
	}
	makePalleteYellows( bid ) {
		this.makeFadedPalette2( this.cblack, this.cyellow, this.cwhite );
	}
	makePalleteCyans( bid ) {
		this.makeFadedPalette2( this.cblack, this.ccyan, this.cwhite );
	}
	makePalleteOranges( bid ) {
		this.makeFadedPalette2(
			this.cblack,
		 	{
				r:255,
				g:128,
				b:  0
			}, this.cwhite);
	}


	makePalleteDark( bid ) {
		var pal = new RawPalette();

		for (var i = 0; i < this.buttn_maxcol; i++) {
			var hue = i * this.buttn_huefact;
			var rgb = this.colorBox.HSVtoRGB( Math.round(hue), 1, 0.5 );

			pal.colors.push( rgb );
		}

		this.changePalette( pal );
	}

	makePalletePastel( bid ) {
		var pal = new RawPalette();

		for (var i = 0; i < this.buttn_maxcol; i++) {
			var hue = i * this.buttn_huefact;
			var rgb = this.colorBox.HSVtoRGB( Math.round(hue), 0.3, 1 );

			pal.colors.push( rgb );
		}

		this.changePalette( pal );
	}


	makePalleteRainbow( bid ) {
		var pal = new RawPalette();

		for (var i = 0; i < this.buttn_maxcol; i++) {
			var hue = i * this.buttn_huefact;
			var rgb = this.colorBox.HSVtoRGB( Math.round(hue), this.hsv_S, this.hsv_V);

			pal.colors.push( rgb );
		}

		this.changePalette( pal );
	}

	changePalette( palette ) {
		console.log( "Palette updated");

		for (var i = 0; i < this.buttn_maxcol && i < palette.getColorCount(); i++) {
			var rgb = palette.getColor( i );

			this.bcols[i].r = rgb.r;
			this.bcols[i].g = rgb.g;
			this.bcols[i].b = rgb.b;

			this.colrenderers[ i ].setColor( rgb );
			this.colbuttons[ i ].renderButton( );
		}

		this.signalScreenUpdate();
	}

	editPalette( bid ) {

		var cols = [];
		for( var i=0; i<this.bcols.length; i++ ) {
			var rgb2 = {};
			rgb2.r = this.bcols[i].r;
			rgb2.g = this.bcols[i].g;
			rgb2.b = this.bcols[i].b;

			cols.push( rgb2 );
		}

		new paletteEditDialog(
			this.panelsManager,
			{obj: this, method: 'editPaletteDone' },
			this.updateScreenHandlerRec,
			this.panelIcons,
			cols
		).popUp();

		this.panelsManager.calculate();

	}


	editPaletteDone( newPaletteRGB ) {

		for( var i=0; i<this.bcols.length; i++ ) {

			this.bcols[i].r = newPaletteRGB[i].r;
			this.bcols[i].g = newPaletteRGB[i].g;
			this.bcols[i].b = newPaletteRGB[i].b;

			this.colrenderers[ i ].setColor( this.bcols[i] );
			this.colbuttons[ i ].renderButton( );

		}

		this.signalScreenUpdate();
	}



	changePictureResolution( result ) {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'RESIZE';
		sig.data = result;

		this.bus.post( sig );

	}


	/* Browser events */
	handleEvent(evt) {
		/* Nothing Here, Input only from App, see handleInputSignal */

	}

	activate() {
		this.iisButtons.activateLoadingEvents();
		this.iisButtons1b.activateLoadingEvents();
		this.iisButtons2.activateLoadingEvents();
		this.iisButtons3.activateLoadingEvents();
		this.defaultPalette.activateLoadingEvents();
		//TODO this.updateScreenHandlerRec = { obj: null, method: null };

	}


	/* App events */
	handleInputSignal( sig ) {
		/* Nothing Here, Input only from browser, see handleEvent */

		//console.log( "got signal ");
		//console.log( sig );

		if( sig[ 0 ] == 'PANEL' && sig[1] == 'SHORTCUT' ) {
			console.log("Doing shortcut button "  + sig.data.buttonId );
			this.panelsManager.handlePanelsAutoClickEvent(
					sig.data.buttonId
				);
		}
		else if( sig[ 0 ] == 'APPMOUSE' && sig[1] == 'UP' ) {
			this.panelsManager.handlePanelsClickEvent( sig.data.appPos, sig.data.buttonId );
			this.panelsManager.handlePanelMouseUpEvent( sig.data.appPos, sig.data.buttonId );
		}
		else if( sig[ 0 ] == 'APPMOUSE' && sig[1] == 'MOVE' ) {
			this.panelsManager.handlePanelMouseMoveEvent( sig.data.appPos, sig.data.buttonId );
		}
		else if( sig[ 0 ] == 'APPMOUSE' && sig[1] == 'DOWN' ) {
			this.panelsManager.handlePanelMouseDownEvent( sig.data.appPos, sig.data.buttonId );
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'TOGGLE' ) {
			this.toggleHidePanelMode();
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'PAINTMODE' ) {

			this.handlePanelsAutoClickEvent( 'mode:draw' );
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'BRUSHMODEGRAB' ) {

			console.log("debug: why is image brush not recognized when wanting to load from brush");
			this.panelsManager.handlePanelsAutoClickEvent( 'brushtype:grab' );
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'SETCOLOR' ) {

			this.setColorRGB2( sig.data, 'fg' );
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'SETBGCOLOR' ) {

			this.setColorRGB2( sig.data, 'bg' );
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'UNDOINFO' ) {

			this.infoRenderer.undoBuffer = Math.ceil(sig.data / 1024 ) + 'kb';
			this.infoArea.renderButton();
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'NAMEINFO' ) {
			this.infoRenderer.imageName = sig.data;
			this.infoArea.renderButton();
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'BRUSHINFO' ) {

			this.infoRenderer.brushw = sig.data.w;
			this.infoRenderer.brushh = sig.data.h;

			console.log( "BRUSHINFO " + this.infoRenderer.brushw + ", " + this.infoRenderer.brushh);
			this.infoArea.renderButton();
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'ZOOMINFO' ) {

			this.infoRenderer.zoomFactor = sig.data;
			this.infoArea.renderButton();
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'DIMENSIONSINFO' ) {

			this.infoRenderer.imgW = sig.data.w;
			this.infoRenderer.imgH = sig.data.h;
			this.infoArea.renderButton();
		}
		else if( sig[ 0 ] == 'PANEL' && sig[1] == 'COORDINFO' ) {

			this.infoRenderer.mouseXPos = sig.data.x;
			this.infoRenderer.mouseYPos = sig.data.y;
			this.infoArea.renderButton();
		}
	}

	signalScreenUpdate() {
		var sig = [];

		sig[0] = "SCREENUPDATER";
		sig[1] = "REFRESH";

		this.bus.post( sig );
	}

	handleFocusSignal( sig ) {
		return true;
	}

	render( _context, _updateArea ) {

		this.panelsManager.render( _context );

	}

	isDialogOpen() {

		return this.panelsManager.isDialogOpen();

	}

	hidePanel() {

		if( this.isDialogOpen() ) {
			return;
		}
		this.hidePanelFlag = true;
		this.updatePanelsActiveState( this.hidePanelFlag );

		this.signalScreenUpdate();

	}

	toggleHidePanelMode() {

		this.hidePanelFlag = !this.hidePanelFlag;

		if( this.hidePanelFlag == true )  {
			if( this.isDialogOpen() ) {
				this.hidePanelFlag = false;
				return;
			}
		}

		this.updatePanelsActiveState( !this.hidePanelFlag );
		this.signalScreenUpdate();

	}

	updatePanelsActiveState( state ) {

		var panelsManager = this.panelsManager;
		var panels = panelsManager.panels;

		for (var i = 0; i < panels.length; i++) {
			if( state == true ) {
				if( panels[ i ].isDialog == false ) {
					panels[ i ].active = true;
				}
			}
			else {
				panels[ i ].active = state;
			}
		}
	}

	isVisible() {
		return !this.hidePanelFlag;
	}

	isMouseOver( pos ) {

		if( this.isDialogOpen() ) { return true; }
		return this.findMouseEventPanel( pos ) != null;
	}

	getViewPriority() {
		return this.viewPriority;
	}

	findMouseEventPanel( pos ) {

		return this.panelsManager.findMouseEventPanel( pos );

	}




	resize() {

		new SelectResolutionDialog(
			this.panelsManager,
			this.changeResolutionHandlerRec,
			this.updateScreenHandlerRec
		).popUp();

		this.panelsManager.calculate();

	}


	handlePanelsClickEvent( pos, buttonId ) {

		this.panelsManager.handlePanelsClickEvent( ( pos, buttonId ) );
	}

	handlePanelsAutoClickEvent( name ) {

		this.panelsManager.handlePanelsAutoClickEvent( name );

	}

	getpanelsManager() {

		return this.panelsManager;

	}


	hideBrush() {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'HIDEBRUSH';
		sig.data = null;

		this.bus.post( sig );

	}


	brush2picOk() {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'BRUSH2PIC';
		sig.data = null;

		this.bus.post( sig );

	}

	doNothing() {
	}

	brush2pic() {

		if( this.brushIsImage ) {
			var okCallback = { obj: this, method: 'brush2picOk' };

			var dialog = new YesNoDialog(
				this.panelsManager,
				"Your image will be overwritten by your image-brush.\nUndo will not work.\nContinue?",
				okCallback,
				this.updateScreenHandlerRec
			);

			dialog.popUp();
			this.panelsManager.calculate();
		}
		else {
			var okCallback = { obj: this, method: 'doNothing' };

			var dialog = new YesNoDialog(
				this.panelsManager,
				"Please select an image-brush, before you try to convert load your image from your brush!",
				okCallback,
				this.updateScreenHandlerRec
			);

			dialog.popUp();
			this.panelsManager.calculate();
		}
	}

	load() {
		var sig = [];
		sig[0] = 'IMPORT';
		sig[1] = 'LOAD';
		sig.data = null;

		this.bus.post( sig );
	}

	save() {

		new SavePictureOptionsDialog(
			this.panelsManager,
			{ obj: this, method: 'intSave' },
			this.updateScreenHandlerRec
		).popUp();

		this.panelsManager.calculate();

	}

	saveQuick() {
		this.intSave( { transparency: "none" });
	}

	intSave( options ) {

				var sig = [];
				sig[0] = 'PAINT';
				sig[1] = 'EXPORTIMAGE';
				sig.data = options;
				sig.data.bgcolor = this.bgColor;

				console.log( "export" );
				console.log( sig.data );

				this.bus.post( sig );
	}



	zoomX1() {
		this.resetDrawFunction();

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'ZOOMX';
		sig.data = 1;

		this.bus.post( sig );
	}

	zoomX4() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'ZOOMX';
		sig.data = 4;

		this.bus.post( sig );
	}

	zoomX8() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'ZOOMX';
		sig.data = 8;

		this.bus.post( sig );
	}

	zoomX16() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'ZOOMX';
		sig.data = 16;

		this.bus.post( sig );
	}

	zoomRelative() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'ZOOMRELATIVE';
		sig.data = null;

		this.bus.post( sig );
	}


	clear() {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'CLEAR';
		sig.data = null;

		this.bus.post( sig );

	}


	undo() {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'UNDO';
		sig.data = null;

		this.bus.post( sig );

	}

	redo() {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'REDO';
		sig.data = null;

		this.bus.post( sig );

	}

	setDrawModeColorize( bid ) {
		this.setDrawMode( 'color' );
	}

	setDrawModeNormal( bid ) {
		this.setDrawMode( 'normal' );
	}

	setDrawModeLighten( bid ) {
		this.setDrawMode( 'lighten' );
	}

	setDrawModeDarken( bid ) {
		this.setDrawMode( 'darken' );
	}


	setDrawMode(  mode ) {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'SETMODE';
		sig.data = { mode: mode  };

		this.bus.post( sig );

	}

	colorizeBrush( _r, _g, _b) {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'SETBRUSHCOLOR';
		sig.data = { r: _r, g: _g, b: _b };

		this.bus.post( sig );

	}

	colorizeFill( _r, _g, _b) {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'SETBGCOLOR';
		sig.data = { r: _r, g: _g, b: _b };

		this.bus.post( sig );

	}

	setFGColorMode() {
		this.colorMode='fg';
	}

	setBGColorMode() {
		this.colorMode='bg';
	}


	setColor( index, colorMode ) {

		var rgb0 = this.bcols[ index ];
		var rgb1 = [];

		rgb1[ 0 ] = rgb0.r;
		rgb1[ 1 ] = rgb0.g;
		rgb1[ 2 ] = rgb0.b;

		this.setColorRGB2( rgb1, colorMode );

	}

	setColorRGB2( col, colorMode ) {

		this.colorsRenderer.setColor( { r: col[0],g: col[1], b: col[2] }, colorMode );
		this.buttnCurrentColors.renderButton();

		if( colorMode == 'fg' ) {
			this.fgColor = { r: col[0],g: col[1], b: col[2] };
			this.colorizeBrush( col[0], col[1], col[2] );
		}
		else {
			this.bgColor = { r: col[0],g: col[1], b: col[2] };
			this.colorizeFill( col[0], col[1], col[2] );
		}
	}

	setDrawFunctionOptions( buttonId ) {

		console.log( "setDrawFunctionOptions");
		console.log( this.toolOps );

		var found = false;
		const keys = Object.keys( this.toolOps )
		for (const key of keys) {
		  if( key == buttonId ) {
				found = true;
			}
		}

		if( found ) {


			for (const key of keys) {

				var panel =  this.toolOps [ key ];
				if( panel != null ) {

						this.mainBP.subPanelSetActiveState( panel ,
								false );
				}
			}

			for (const key of keys) {

				var panel =  this.toolOps [ key ];

				if( panel != null && key == buttonId ) {

						this.mainBP.subPanelSetActiveState( panel ,
								true );

				}
			}

		}
		//this.mainBP.subPanelSetActiveState("brushes", false);
		//this.mainBP.subPanelSetActiveState("brushops", true);


	}

	resetDrawFunction(   ) {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'SETFUNCTION';
		sig.data = { name: this.lastFunction[ 'draw' ], param: this.lastFunctionParam[ 'draw' ] };
		sig.destination = 'Paint';
		this.bus.post( sig );

		this.infoRenderer.mode = this.lastFunction[ 'draw' ];
		this.infoArea.renderButton();

		this.mainBP.selectToggleButton( 'drawmode', this.lastFunctionButton[ 'draw' ]);
		this.mainBP.updateRender();

		console.log( "select toggle " + this.lastFunctionButton[ 'draw' ]);

		this.defaultPointer();
	}

	setFunction( name, param, type  ) {

		var buttonId = 'mode.' + type +':' + name;
		console.log( "setFunction buttonid=" + buttonId);

		var magnifyButtonId = 'mode.view:magnify';

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'SETFUNCTION';
		sig.data = { name: name, param: param };
		sig.destination = 'Paint';

		this.infoRenderer.mode = name;
		this.infoArea.renderButton();

		this.lastFunction[ type ] = name;
 		this.lastFunctionParam[ type ] = param;
		this.lastFunctionButton[ type ] = buttonId;

		this.setDrawFunctionOptions( buttonId );

		this.bus.post( sig );

		if( type != 'draw' ) {
			this.lastBrushSizeButton = this.mainBP.getToggleButtonId( 'brushform' );
			this.mainBP.clearToggleButtons( 'brushform' );
			this.mainBP.updateRender();
		}
		else {
					console.log( "restore brushsize button is " + this.lastBrushSizeButton );
					this.mainBP.selectToggleButton( 'brushform', this.lastBrushSizeButton );
					this.mainBP.updateRender();
		}


	}

	scaleBrush( bid ) {
			new brushScaleDialog(
					this.panelsManager,
					{ obj: this, method: 'scaleBrushOk'},
					this.updateScreenHandlerRec,
					this.infoRenderer.brushw,
					this.infoRenderer.brushh
				).popUp();
	}

	scaleBrushOk( result ) {

				console.log("scaleBrushOk");
				console.log( result );

				var sig = [];
				sig[0] = 'PAINT';
				sig[1] = 'TRANSFORMBRUSH';
				sig.data = { tf: "SCALE", options: { w: result.brushW ,h: result.brushH } };
				sig.destination = 'Paint';

				this.bus.post( sig );

	}


	tilesSettings() {
		new tilesSettingsDialog(
				this.panelsManager,
				{ obj: this, method: 'tilesSettingsOk'},
				this.updateScreenHandlerRec,
				this.tilesW,
				this.tilesH
			).popUp();
	}

	tilesSettingsOk( result ) {

			console.log("tilesSettingsOk");
			console.log( result );

			this.tilesW = result.tilesW;
			this.tilesH = result.tilesH;

			var sig = [];
			sig[0] = 'PAINT';
			sig[1] = 'SETTILESIZE';
			sig.data = result;

			this.bus.post( sig );

	}


	flipTiles() {
		this.grid = ! this.grid;

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'FLIPTILES';
		sig.data = null;
		sig.destination = 'Paint';
		this.bus.post( sig );

	}


	setModeSpray(  ) {
		this.setFunction( 'spray', undefined, "draw" );
		this.defaultPointer();
	}


	setModeDraw(  ) {
		this.setFunction( 'simple', undefined, "draw" );
		this.defaultPointer();
	}

	setModeDrawSolid(  ) {
		this.setFunction( 'solid', undefined, "draw" );
		this.defaultPointer();
	}

	setModeLine(  ) {
		this.setFunction( 'line', undefined, "draw" );
		this.defaultPointer();
	}

	setModeRectangle(  ) {
		this.setFunction( 'rectangle', undefined, "draw" );
		this.defaultPointer();
	}

	setModeOval(  ) {
		this.setFunction( 'oval', undefined, "draw" );
		this.defaultPointer();
	}

	grabBrush(  ) {

		this.hideBrush();
		this.setFunction( 'grabbrush', undefined, "brush" );

	}

	magicGrabBrush(  ) {

		hideBrush();
		this.setFunction( 'magicgrabbrush', undefined, "brush" );

	}



effectRotate90() {
	var sig = [];
	sig[0] = 'PAINT';
	sig[1] = 'TRANSFORMPICTURE';
	sig.data = { tf: "ROTATE90DEG" };
	sig.destination = 'Paint';

	this.bus.post( sig );

}


effectSepia() {

	var sig = [];
	sig[0] = 'PAINT';
	sig[1] = 'TRANSFORMPICTURE';
	sig.data = { tf: "SEPIA" };
	sig.destination = 'Paint';

	this.bus.post( sig );
}


effectBnW() {

	var sig = [];
	sig[0] = 'PAINT';
	sig[1] = 'TRANSFORMPICTURE';
	sig.data = { tf: "BLACKANDWHITE" };
	sig.destination = 'Paint';

	this.bus.post( sig );
}

effectDePixel() {

	var sig = [];
	sig[0] = 'PAINT';
	sig[1] = 'TRANSFORMPICTURE';
	sig.data = { tf: "TRIM2" };
	sig.destination = 'Paint';

	this.bus.post( sig );

}


effectFlipX() {
	var sig = [];
	sig[0] = 'PAINT';
	sig[1] = 'TRANSFORMPICTURE';
	sig.data = { tf: "FLIPX" };
	sig.destination = 'Paint';

	this.bus.post( sig );

}

effectFlipY() {
	var sig = [];
	sig[0] = 'PAINT';
	sig[1] = 'TRANSFORMPICTURE';
	sig.data = { tf: "FLIPY" };
	sig.destination = 'Paint';

	this.bus.post( sig );
}

	flipX() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'TRANSFORMBRUSH';
		sig.data = { tf: "FLIPX" };
		sig.destination = 'Paint';

		this.bus.post( sig );

	}


	flipY() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'TRANSFORMBRUSH';
		sig.data = { tf: "FLIPY" };
		sig.destination = 'Paint';

		this.bus.post( sig );

	}


	softenBrush() {
			var sig = [];
			sig[0] = 'PAINT';
			sig[1] = 'TRANSFORMBRUSH';
			sig.data = { tf: "TRIMALFA" };
			sig.destination = 'Paint';

			this.bus.post( sig );

		}

	trim() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'TRANSFORMBRUSH';
		sig.data = { tf: "TRIM" };
		sig.destination = 'Paint';

		this.bus.post( sig );

	}

	feather() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'TRANSFORMBRUSH';
		sig.data = { tf: "FEATHER" };
		sig.destination = 'Paint';

		this.bus.post( sig );

	}

	makeTransparent() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'TRANSFORMBRUSH';
		sig.data = { tf: "MAKETRANSPARENT" };
		sig.destination = 'Paint';

		this.bus.post( sig );

	}

	colorize() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'TRANSFORMBRUSH';
		sig.data = { tf: "COLORIZE" };
		sig.destination = 'Paint';

		this.bus.post( sig );

	}

	rotatebrush90() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'TRANSFORMBRUSH';
		sig.data = { tf: "ROTATE90DEG" };
		sig.destination = 'Paint';

		this.bus.post( sig );

	}


	picker() {
		this.setFunction( 'picker', this.colorMode, "color" );

		var sig2 = [];
		sig2[0] = "SCREENUPDATER";
		sig2[1] = "PICKERPOINTER";
		sig2.data = undefined;
		this.bus.post( sig2 );

	}

	defaultPointer(  ) {

		var sig = [];
		sig[0] = 'SCREENUPDATER';
		sig[1] = 'PAINTMOUSEPOINTER';
		sig.data = undefined;
		//sig.destination = 'ScreenUpdater';
		this.bus.post( sig );

	}


	setModeFill( buttonMode ) {

		var sig = [];
		sig[0] = 'SCREENUPDATER';
		sig[1] = 'FILLPOINTER';
		sig.data = undefined;
		//sig.destination = 'ScreenUpdater';
		this.bus.post( sig );

		this.setFunction( 'fill', undefined, "fill" );


		this.setDrawFunctionOptions( 'mode.draw:pbucket' );
	}

	setModeFill2( buttonMode ) {

		var sig = [];
		sig[0] = 'SCREENUPDATER';
		sig[1] = 'FILLPOINTER';
		sig.data = undefined;
		//sig.destination = 'ScreenUpdater';
		this.bus.post( sig );

		this.setFunction( 'grabfillbrush', undefined, "fill" );

		this.setDrawFunctionOptions( 'mode.draw:pbucketselect' );

	}

	useImageBrush() {
		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'USEIMAGEBRUSH';
		sig.data = null;
		sig.destination = 'Paint';

		this.bus.post( sig );

		this.brushIsImage = true;

		this.lastBrushSizeButton = this.mainBP.getToggleButtonId( 'brushform' );
		this.resetDrawFunction();
	}

	setBrush(_type, _size) {

		var sig = [];
		sig[0] = 'PAINT';
		sig[1] = 'SETBRUSH';
		sig.data = { size: _size, type: _type };
		sig.destination = 'Paint';

		this.bus.post( sig );

		var sig = [];
		sig[0] = 'SCREENUPDATER';
		sig[1] = 'PAINTMOUSEPOINTER';
		sig.data = undefined;
		this.bus.post( sig );

		this.brushIsImage = false;

		this.lastBrushSizeButton = this.mainBP.getToggleButtonId( 'brushform' );

		this.resetDrawFunction();

	}



	autoBrushSizeHandler( sig, slidervalue ) {


			var brushform = this.mainBP.getToggleButtonId( 'brushform' );
			if( brushform == "brushtype:grab" ) {
				this.panelsManager.handlePanelsAutoClickEvent( 'brushform:' + this.autoBrushShape);
			}
			else if( brushform == "brushform:pixel" ) {
				this.panelsManager.handlePanelsAutoClickEvent( 'brushform:' + this.autoBrushShape);
			}


			var size = this.valueAutoBrushSize.getValue();
			this.setBrush( this.autoBrushShape, size );


	}


	spraySizeHandler( sig, slidervalue ) {


			var size = this.valueSpraySize.getValue();

			var sig = [];
			sig[0] = 'PAINT';
			sig[1] = 'SETSPRAYOPTIONS';
			sig.data = { size: size };
			sig.destination = 'Paint';

			this.bus.post( sig );


	}



	bsoftround( bid ) {
		this.autoBrushShape = 'softrnd';
		var size = this.valueAutoBrushSize.getValue();
		this.setBrush( this.autoBrushShape, size );
	}

	bround( bid ) {
		this.autoBrushShape = 'rnd';
		var size = this.valueAutoBrushSize.getValue();
		this.setBrush( this.autoBrushShape, size );
	}

	bsqr( bid ) {
		this.autoBrushShape = 'sqr';
		var size = this.valueAutoBrushSize.getValue();
		this.setBrush( this.autoBrushShape, size );
	}

	b1() {
		this.autoBrushShape = 'rnd';
		var size = 1;
		this.setBrush( this.autoBrushShape, size );
	 }


	/* set colour functions */
	col0( deviceButtonId ) { this.setColor( 0 ,this.bidToColId( deviceButtonId ));	}
	col1( deviceButtonId ) { this.setColor( 1 ,this.bidToColId( deviceButtonId ));	}
	col2( deviceButtonId ) { this.setColor( 2 ,this.bidToColId( deviceButtonId ));	}
	col3( deviceButtonId ) { this.setColor( 3 ,this.bidToColId( deviceButtonId ));	}
	col4( deviceButtonId ) { this.setColor( 4 ,this.bidToColId( deviceButtonId ));	}
	col5( deviceButtonId ) { this.setColor( 5 ,this.bidToColId( deviceButtonId ));	}
	col6( deviceButtonId ) { this.setColor( 6 ,this.bidToColId( deviceButtonId ));	}
	col7( deviceButtonId ) { this.setColor( 7 ,this.bidToColId( deviceButtonId ));	}
	col8( deviceButtonId ) { this.setColor( 8 ,this.bidToColId( deviceButtonId ));	}
	col9( deviceButtonId ) { this.setColor( 9 ,this.bidToColId( deviceButtonId ));	}
	col10( deviceButtonId ) { this.setColor(10 ,this.bidToColId( deviceButtonId ));	}
	col11( deviceButtonId ) { this.setColor(11 ,this.bidToColId( deviceButtonId ));	}
	col12( deviceButtonId ) { this.setColor(12 ,this.bidToColId( deviceButtonId ));	}
	col13( deviceButtonId ) { this.setColor(13 ,this.bidToColId( deviceButtonId ));	}
	col14( deviceButtonId ) { this.setColor(14 ,this.bidToColId( deviceButtonId ));	}
	col15( deviceButtonId ) { this.setColor(15 ,this.bidToColId( deviceButtonId ));	}
	col16( deviceButtonId ) { this.setColor(16 ,this.bidToColId( deviceButtonId ));	}
	col17( deviceButtonId ) { this.setColor(17 ,this.bidToColId( deviceButtonId ));	}
	col18( deviceButtonId ) { this.setColor(18 ,this.bidToColId( deviceButtonId ));	}
	col19( deviceButtonId ) { this.setColor(19 ,this.bidToColId( deviceButtonId ));	}
	col20( deviceButtonId ) { this.setColor(20 ,this.bidToColId( deviceButtonId ));	}
	col21( deviceButtonId ) { this.setColor(21 ,this.bidToColId( deviceButtonId ));	}
	col22( deviceButtonId ) { this.setColor(22 ,this.bidToColId( deviceButtonId ));	}
	col23( deviceButtonId ) { this.setColor(23 ,this.bidToColId( deviceButtonId ));	}
	col24( deviceButtonId ) { this.setColor(24 ,this.bidToColId( deviceButtonId ));	}
	col25( deviceButtonId ) { this.setColor(25 ,this.bidToColId( deviceButtonId ));	}
	col26( deviceButtonId ) { this.setColor(26 ,this.bidToColId( deviceButtonId ));	}
	col27( deviceButtonId ) { this.setColor(27 ,this.bidToColId( deviceButtonId ));	}
	col28( deviceButtonId ) { this.setColor(28 ,this.bidToColId( deviceButtonId ));	}
	col29( deviceButtonId ) { this.setColor(29 ,this.bidToColId( deviceButtonId ));	}
	col30( deviceButtonId ) { this.setColor(30 ,this.bidToColId( deviceButtonId ));	}
	col31( deviceButtonId ) { this.setColor(31 ,this.bidToColId( deviceButtonId ));	}

	bidToColId( deviceButtonId ) {
		if( deviceButtonId == 'left' ) {
			return 'fg';
		}
		return 'bg';
	}
}
