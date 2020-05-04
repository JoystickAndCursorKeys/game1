const NOSTATECHANGE = 99999;

class GameState {

  constructor ( config, properties ) {
    this.chapters = config.chapters;
    this.properties = properties;

    this.gotoChapter( config.startChapter, this.properties );
  }

  getClass() {
    var myClass = this.chapters[ this.chapterId ];
    if( myClass == undefined ) { return undefined; }

    return myClass;
  }

  getCurrentChapterId() {
    return this.chapterId;
  }

  getCurrentChapter() {
      var currentChapter = this.chapters[ this.chapterId ];

      return currentChapter;
  }

  gotoChapter( newChapter, properties ) {

    console.log( "----------------" );
    console.log( "Goto Chapter "+ newChapter );

      if( this.chapters[ newChapter ] == undefined ) {
        return "error";
      }

      this.chapterId = newChapter;

      if( this.getClass() != null ) {
        var myClass = this.getClass();

        myClass.initChapter( properties );
        this.states = myClass.getStates();

        this.initState( this.states.startState );

      }

      return null;
  }

  initState( stateId ) {

    console.log( "----------------" );
    console.log( "Init State "+ stateId );
    this.stateId = stateId;
    this.state = this.states.list[ this.stateId ];
    var state = this.state;

    /*active*/
    this.methodRender = state.methodRender;
    this.methodProcess = state.methodProcess;
    this.methodEvents = state.methodEvents;

    /*passive*/
    this.methodPassive = state.methodPassive;

    if( !this.state.active ) {

      if( this.methodRender != undefined ) {
        throw "invalid combination: !this.state.active && this.methodRender for " & this.chapterId + ':' + this.stateId;
      }

      if( this.methodProcess != undefined ) {
        throw "invalid combination: !this.state.active && this.methodProcess for " & this.chapterId + ':' + this.stateId;
      }

      if( this.methodEvents != undefined ) {
        throw "invalid combination: !this.state.active && this.methodEvents for " & this.chapterId + ':' + this.stateId;
      }

      if( this.methodPassive == undefined  ) {
        throw "invalid combination: !this.state.active && this.methodPassive==undefined for " & this.chapterId + ':' + this.stateId;
      }

      this.doPassiveState();
    }
    else {
      if( this.methodPassive != undefined ) {
        throw "invalid combination: this.state.active && this.methodPassive for " & this.chapterId + ':' + this.stateId;
      }

      if( this.methodRender == undefined && this.methodProcess == undefined && this.methodEvents == undefined) {
        throw "invalid combination: !this.state.active && this.methodRender==undefined && this.methodProcess==undefined && this.methodEvents==undefined for " & this.chapterId + ':' + this.stateId;
      }
    }
  }

  doPassiveState() {

      console.log( "executing passive " + this.getClass().constructor.name + "." + this.methodPassive  + "()" );
      var result = this.getClass()[ this.methodPassive ]();

      if( result == undefined ) {
        this.initState( this.state.next );
      }
      else if( result.next != undefined ) {
        this.initState( result.next );
      }
      else if( result.resources != undefined ) {
        this.loadResources( result.resources );
      }
      else if( result.nextChapter != undefined ) {
        this.gotoChapter( result.nextChapter, this.properties );
      }
      else {
        this.initState( this.state.next );
      }


  }


  loadResources( resources ) {

    var myClass = this.getClass();

    var myArray, myDestArray, myState;
    var imgState, audioState;
    imgState = { count:0 };
    audioState = { count:0 };

    imgState.load = false;
    audioState.load = false;

    if( resources == undefined ) {
      this.initState( this.state.next );
      return;
    }

    myArray = resources.imgSrcArray;
    myState = imgState;
    if( myArray  != undefined ) {
      myState.keys = Object.keys( myArray );
      myState.urls = myArray;
      myState.count = myState.keys.length;
      if( myState.count > 0 ) {
        myState.load = true;
      }
    }

    myArray = resources.audioSrcArray;
    myState = audioState;
    if( myArray  != undefined ) {
      myState.keys = Object.keys( myArray );
      myState.urls = myArray;
      myState.count = myState.keys.length;
      if( myState.count > 0 ) {
        myState.load = true;
      }
    }


    this.loadedCount = 0;
    this.loadingCount = imgState.count + audioState.count;

    if( this.loadingCount == 0 ) {
      this.initState( this.state.next );
      return;
    }

    var loadedResources = {};
    loadedResources.imgArray = [];
    loadedResources.audioArray = [];

    myArray = resources.imgSrcArray;
    myDestArray = loadedResources.imgArray;
    myState = imgState;
    for( var i=0; i<myState.count; i++ )  {
      var key = myState.keys[i];
      var url = myArray[ key ];

      var obj = new Image();
      obj.id = myClass.constructor.name+ '.i.' + url;

      myDestArray[key ] = obj;
  	}

    myArray = resources.audioSrcArray;
    myDestArray = loadedResources.audioArray;
    myState = audioState;
    for( var i=0; i<myState.count; i++ )  {
      var key = myState.keys[i];
      var url = myArray[ key ];

      var obj = new Audio();
      obj.style="display:none";
      obj.id = myClass.constructor.name+'.a.' + url;

      myDestArray[ key ] = obj;
  	}


    this.initState( this.state.next );
    var __this = this;
    var urls, count, res, keys;
    var srcArrays = [ resources.imgSrcArray, resources.audioSrcArray  ];
    var dstArrays = [ loadedResources.imgArray, loadedResources.audioArray ];
    var states = [ imgState, audioState ];

    for( var h=0; h<srcArrays.length; h++ )  {

      myArray = srcArrays[ h ];
      myDestArray = dstArrays[ h ];
      myState = states[ h ];

      console.log("h=" + h);
      console.log(myState);

      for( var i=0; i<myState.count; i++ )  {
        var key = myState.keys[i];
        var url = myState.urls[ key ];

        console.log(key + ":" + url + " " + i);
        res = myDestArray[ key ];

        if( h==0 ) {
          res.onload = function ( evt ) {
            __this.onLoadedResource( evt, myClass, loadedResources );
          }
        }
        else
        {
          res.onloadeddata = function ( evt ) {
            __this.onLoadedResource( evt,  myClass, loadedResources );
          }

        }

        res.src = url;

    	}
    }
  }

  onLoadedResource( evt, myClass, loadedResources ) {

    console.log("resource is loaded " + evt.currentTarget.id );
    this.loadedCount ++;
    console.log("resources loaded " + this.loadedCount );
    console.log("resources to be loaded " + this.loadingCount );
    if( this.loadedCount == this.loadingCount ) {
      console.log("all loaded, signalling");
      myClass.signalResourcesLoaded( loadedResources , this.stateId);
      console.log("goto next state " + this.state.next);
      this.initState(this.state.next );
    }
  }


  gotoNextState() {

      this.initState( this.state.next );
      return null;
  }

  handleEvent( evt ) {

    console.log( "handleEvent" );
    console.log( evt );

      var myClass = this.getClass();
      try {
        if( this.methodEvents != undefined ) {
          myClass[ this.methodEvents ]( evt );
        }
      }
      catch ( except ) {
        var err = {};
        err.message="Exception[" +
        myClass.constructor.name +  "." + this.methodEvents + "(...) at chapter '" + this.getCurrentChapterId()+ "']:" + except.message;
        err.exception = except;
        err.myClass = myClass;

        throw err;
      }

  }

  renderFrame( ctx ) {

    var myClass = this.getClass();

    if( myClass == undefined ) {
      throw "game1.state[" + this.getCurrentChapterId() + "]."+this.methodRender+":Cannot execute, 'myClassUndefined' for chapter '" + this.getCurrentChapterId() +"'";
    }

    try {
      if( this.methodRender != undefined ) {
        myClass[this.methodRender]( ctx );
      }
    }
    catch ( except ) {
      var err = {};
      err.message="Exception[" +
          myClass.constructor.name +  "." + this.methodRender + "(...) at chapter '" + this.getCurrentChapterId()+ "']:" + except.message;
      err.exception = except;
      err.myClass = myClass;
      throw err;
    }

  }

  processIteration () {

    var myClass = this.getClass();

    if( myClass == undefined ) {
      throw "game1.state[" + this.getCurrentChapterId() + "].processIteration:Cannot execute, 'myClassUndefined' for chapter '" + this.getCurrentChapterId() +"'";
    }

    var stateChange = { endState: false };
    try {
      if( this.methodProcess != undefined ) {
        stateChange = myClass[this.methodProcess]();
      }
    }
    catch ( except ) {
      var err = {};
      err.message="Exception[" +
          myClass.constructor.name +  ".cycle(...) at chapter '" + this.getCurrentChapterId()+ "']:" + except.message;
      err.exception = except;
      err.myClass = myClass;
      throw err;
    }

    if( stateChange.endState  ) {
        this.initState( this.state.next );
    }
  }
}


class Boot {
	constructor ( _renderCanvasId, _SCRW, _SCRH, gameConfig ) {

    		/* Prevent reload, without confirmation */
    		window.onbeforeunload = function() {
      		return "";
    		}

    		document.addEventListener('contextmenu', event => event.preventDefault());


    		this.renderCanvasId = _renderCanvasId;
    		this.renderCanvas = document.getElementById( _renderCanvasId );

    		this.renderCanvas.style.touchAction = "none";

    		this.renderCanvas.id     = "ApplicationCanvas";
    		this.SCRW = _SCRW;
    		this.SCRH = _SCRH;

        this.properties = {};
        this.properties.w = _SCRW;
        this.properties.h = _SCRH;

    		this.sizeCanvas( this.SCRW, this.SCRH );
    		this.renderContext = this.renderCanvas.getContext('2d');

        this.renderContext.fillStyle = 'rgba(100,100,150,1)';
        this.renderContext.fillRect(
          0,
          0,
          _SCRW,
          _SCRH
        );

        this.state = new GameState ( gameConfig, this.properties );

        var __this = this;
        this.renderTimer = setInterval(
          function() {
            try {
              __this.state.renderFrame( __this.renderContext );
            }
            catch(except) {
              clearInterval( __this.loopTimer );
              clearInterval( __this.renderTimer );

              __this.logException( except );
              }
          }
          , 20
        );

        this.loopTimer = setInterval(
          function() {
            try {
              __this.state.processIteration();
            }
            catch(except) {
              clearInterval( __this.loopTimer );
              clearInterval( __this.renderTimer );

              __this.logException( except );
              }
          }
          , 20
        );


        this.renderCanvas.addEventListener("keyup", this.state, true);
        this.renderCanvas.addEventListener("keydown", this.state, true);

  }



  doException( obj ) {

    clearInterval( this.loopTimer );
    clearInterval( this.renderTimer );
    this.logException( obj );

  }

  logException( obj ) {

    var cause = obj;

    if( obj.message != undefined ) {
      cause = obj.message;
    }
    var parts = cause.split(":");

    var consoletext = 'Zen! Exception ('+parts[0]+') => ' + parts[1];
    var text1 = 'Exception: ' + parts[1];
    var text2 = 'From ('+parts[0]+')';

    console.error( consoletext );
    if( obj.exception.stack != undefined ) {
      console.log( obj.exception.stack );
      console.log( obj.myClass);
    }

    var  flip = 0;
    var __this = this;
    var bwidth = 8;
    var yoffset = 16;

    var errorTimer = setInterval(
      function() {
      var line;
      flip ++;

      if( flip <= 4  ) {
        __this.renderContext.fillStyle = 'rgba(255,100,0,1)';
      }
      else {
        __this.renderContext.fillStyle = 'rgba(0 ,0,0,1)';
      }
      if( flip == 8 ) { flip =0; }

      __this.renderContext.fillRect(
        0,
        0,
        __this.SCRW,
        105
      );

      __this.renderContext.fillStyle = 'rgba(0,0,0,1)';
      __this.renderContext.fillRect(
        bwidth,
        bwidth,
        __this.SCRW - (bwidth*2),
        105-(bwidth*2)
      );

      __this.renderContext.font = '15px arial';
      __this.renderContext.textBaseline  = 'top';
      __this.renderContext.fillStyle = "rgba(255,100,000,1)";

      line = 0;
      __this.renderContext.fillText( "Game1 Zen Exception",
          bwidth + 5,bwidth + 5 + (yoffset * line)
        );

      line++;
      __this.renderContext.fillText( text1,
          bwidth + 5,bwidth + 5 + (yoffset * line)
        );

      line++;
      __this.renderContext.fillText( text2,
            bwidth + 5,bwidth + 5 + (yoffset * line)
          );

      line++;
      __this.renderContext.fillText( "Check console for more information.",
                bwidth + 5,bwidth + 5 + (yoffset * line)
              );


      __this.renderContext.fillStyle = "rgba(100,255,100,1)";
      line++;
      __this.renderContext.fillText( "Fix the bug, and return to the light :)",
              bwidth + 5,bwidth + 5 + (yoffset * line)
              );


        },
        300
      );
  }

  sizeCanvas( w, h )
  {

    this.renderCanvas.width  = w;
    this.renderCanvas.height = h;

  }
}

/*
class GameUtil {

  constructor() {

    this.utildata = {};
    this.utildata.signals = [];
    this.NOSTATECHANGE = NOSTATECHANGE;

  }

  clearSignals() {
      if( this.utildata.signals > 0 ) {
        this.utildata.signals = [];
      }
  }

  waitSignal() {
      return this.utildata.signals.length > 0;
  }

  pushSignal( sig ) {

      this.utildata.signals.push( sig );
  }

  popSignal(  ) {

      return this.utildata.signals.pop();

  }

}
*/
