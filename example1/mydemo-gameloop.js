class DemoGameLoop {

  constructor () {
    this.states = new DemoGameLoopStates();
  }

  getStates() {
    return this.states;
  }

  initChapter( properties ) {
    this.width =  properties.w;
    this.height = properties.h;
    return this.states;
  }

  /* Resources */
  signalResourcesLoaded( loadedResources, stateName  ) {
    console.log( "game/level loaded now state:" + stateName);
    if( stateName == 'gameLoading' ) {
      this.bg = loadedResources.imgArray['bg'];
      this.ball = loadedResources.imgArray['ball'];
    }
  }

  gameGetResources() {
    var pictures = [];
    pictures['bg']= 'example1/img/space2g.png';
    pictures['ball']= "example1/img/fireball.png";

    return { resources: { imgSrcArray: pictures } }
  }

  levelGetResources() {
    var pictures = [];
    pictures['bglevel']= 'example1/img/space2g.png';
    pictures['balllevel']= "example1/img/fireball.png";

    return { resources: { imgSrcArray: pictures } }
  }

  /* Loading game */
  gameLoadingRender( ctx ) {
    console.log("gameLoadingRender");
  }

  gameLoadingProcess() {
    console.log("gameLoadingProcess");
    return { endState: false };
  }

  /* Init game */
  gameInit() {
    console.log("gameInit");
    this.level = 1;
  }

  /* levelLoadingProcess Level */
  levelLoadingRender( ctx ) {
    console.log("LevelLoadingRender");
  }

  levelLoadingProcess() {
    console.log("LevelLoadingProcess");

    return { endState: false };
  }

  /* Init Level */
  levelInit() {
    console.log("levelInit");
    this.x = 150;
    this.y = 150;
    this.dx = 0;
    this.dy = 0;
    this.r = 0;
    this.endFlag = false;
  }

  /* Run Level */
  levelRunHandle( evt ) {

    if( evt.type == 'keyup' && evt.key == 'x') {
       this.endFlag = true;
    }
    else if( evt.type == 'keydown' && evt.key == 'ArrowLeft') {
       this.dx = -4;
    }
    else if( evt.type == 'keydown' && evt.key == 'ArrowRight') {
       this.dx = 4;
    }
    else if( evt.type == 'keydown' && evt.key == 'ArrowDown') {
       this.dy = 4;
    }
    else if( evt.type == 'keydown' && evt.key == 'ArrowUp') {
       this.dy = -4;
    }
  }

  levelRunProcess() {

    if( this.endFlag ) {
      return { endState: true }
    }

    this.x+= this.dx;
    this.dx = this.dx * .98;
    this.y+= this.dy;
    this.dy = this.dy * .98;

    if( this.x < 0 ) {
      this.x = 0;
      this.dx = 0;
    }
    else if( this.x >= this.width ) {
      this.x = this.width-1;
      this.dx = 0;
    }

    if( this.y < 0 ) {
      this.y = 0;
      this.dy = 0;
    }
    else if( this.y >= this.height ) {
      this.y = this.height-1;
      this.dy = 0;
    }

    //return NOSTATECHANGE;
    return { endState: false };
  }

  levelRunRender( context ) {
    var r = this.r;
    r++;

    if( r>255 ) {
      r = 0;
    }
    this.r = r;

    context.fillStyle = 'rgba( 60,49,158,1)';
    context.fillRect(
      0,
      0,
      this.width,
      this.height
    );

    context.fillStyle = "rgba("+r+","+r+","+r+",1)";

    for( var i=0; i<500; i++) {
      var j = i/2;
      var k =i/6;

      context.drawImage( this.ball,
        this.mod(this.x + (j * r / 8), this.width),
        this.mod( this.y + (j*r) , this.height)
      );
    }
    context.fillStyle = "black";
		context.font = 'normal  ' + 10 + 'px Verdana';
		context.fillText( this.x+","+this.y, 12,18);
    context.fillText( this.width+","+this.height, 12,38);
    context.fillText( this.level, 12,58);
  }


  /* End Level */
  levelGetEndAction() {
    this.level ++;

    if( this.level >5 ) {
      return { nextChapter: "title" };
    }
    return { next: "levelGetResources" };
  }

  /* Helper */
  mod( a, b) {
    var a2 = a;
    while( a2 >= b ) {
      a2 -= b;
    }
    return a2;
  }

}
