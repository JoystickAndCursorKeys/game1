class Demo {

  constructor( console ) {
    this.console = console;

    this.cat = [
      0, 0, 0, 0, 0, 0, 0, 65, 0, 0, 193, 128, 1, 227, 192, 1, 227, 192, 3, 247, 224,
      6, 62, 48, 12, 28, 24, 13, 157, 152, 221, 157, 157, 46, 62, 58, 23, 255, 244, 31, 255, 252,
      235, 247, 215, 23, 213, 236, 47, 227, 244, 199, 255, 243, 3, 255, 224, 1, 255, 192, 0, 0, 0

    ]
  }

  initPlayBook( properties ) {

    this.width = properties.w;
    this.height = properties.h;

    this.console.reset();
    this.programContext={};
    var p=this.programContext;

    p.m="\n***************************************\n\nThanks for watching.\nif you like this video\nplease like or subscribe\n\nif you have any ideas,\nfor this little project please comment\n\n***************************************\n";
    p.intro="¤\nlet's mix two worlds:\n\n   1.c64\n   2.javascript.\n\nwhy???\n\nwell......  why not :)\n\nhave fun watching!\n\n\b";

  }

  /*
		Loading
  */
  load(action, data) {

    if (action == 'GETURLS') {
      return;
    } else if (action == 'LOADED') {
      var loadedResources = data.resources;
    }
  }

  /*
	Playing the demo
  */
  play(action, data) {

    if (action == "INIT") {
        this.cursorCount = 1;
        var c = this.console;
        c.clearScreen();

        c.writeString("",true);
        c.writeString("    **** GAME1 C64 SCREEN DEMO ****",true);
        c.writeString("",true);
        c.writeString("     JAVASCRIPT-LIMITED EXPERIMENT",true);
        c.writeString("",true);
        c.writeString("ready", true);

        this.x=0; this.y=21;

        c.spriteFrame( 0, 0 );
        c.spriteCol(0,1);
        c.spritePos(0,100,100);

        for( var i=0; i<63; i++) {
            c.spritePoke(0,i,this.cat[i]);
        }
        c.spriteReFrame( 0,0 );
        //c.spriteEnable( 0, true );
    }
  }

  executeCommand( c, cmd ) {
    var w=40;
    var h=20;

    var cls=function() {c.clearScreen();};
    var color=function(x) {c.setColor(x);};
    var background=function(x) {c.setBGColor(x);};
    var border=function(x) {c.setBorderColor(x);};
    var cls=function() {c.clearScreen();};
    var cls=function() {c.clearScreen();};
    var spriteon=function(s,f) {c.spriteEnable( s, f );}
    var print=function(s) {
        for( var i=0; i<s.length; i++) {
            if( s[i] == '\n' ) {
                c.writeString("",true);
            }
            else if( s[i] == '¤' ) {
                c.clearScreen();
            }
            else {
                c.writeChar(s[i]);
            }

        }

      }
    var math=Math;
    var p=this.programContext;

    try {
      var result = eval(cmd);
      console.log( result +"" );
      if( result != undefined ) {
        c.writeString(result+"", true);
      }
    }
    catch (error) {
      console.log( error );
      c.writeString(error+"", true);
    }


  }

  playHandle( evt ) {
    if( evt.type == 'keydown' ) {

      //console.log(evt);

      var c = this.console;
      if( evt.key == "Enter") {
          c.clearCursor();
          var line=c.getCurrentLine();
          //console.log( line );
          c.writeString("", true);
          this.executeCommand( c, line );


      }
      else if( evt.key == "Backspace") {
          c.clearCursor();
          c.deleteChar();
      }
      else {
          if( evt.key.length == 1) {
            c.clearCursor();
            c.writeChar( evt.key );
          }

      }


    }
  }


  playRun() {

    var c = this.console;
    if(this.cursorCount++>15) {
      this.cursorCount = 0;

      c.blinkCursor();
    }

    this.x++;
    //this.y++;
    if(this.x>400) { this.x = 0;}
    if(this.y>250) { this.y = 0;}
    c.spritePos(0,this.x,this.y);

    return false;
  }


  playRender(context) {

    this.console.renderDisplay();

  }


}
