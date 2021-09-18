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
    console.log( data );
    if (action == "INIT") {
        this.cursorCount = 1;
        var c = this.console;
        c.clearScreen();
        c.writeString("ready", true);

        c.spriteFrame( 0, 0 );
        c.spriteCol(0,1);
        c.spritePos(0,100,100);

        for( var i=0; i<63; i++) {
            c.spritePoke(0,i,this.cat[i]);
        }
        c.spriteReFrame( 0,0 );
        c.spriteEnable( 0, true );

        this.x=0; this.y=21;
    }
  }

  playHandle() {}


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
