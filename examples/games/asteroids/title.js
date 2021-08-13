class Title {


  constructor ( game ) {
    this.game = game;
  }

  initPlayBook( properties ) {
    this.width =  properties.w;
    this.height = properties.h;
    return this.states;
  }


  /* Resources */

  /* Loading */
  setupBGRender( ctx ) {
    console.log("setupBGRender");
  }

  setupBGRun() {
    console.log("setupBGRun");
    return false;
  }

  /* Load */

  loadGetUrls() {

    var pictures = [];

    pictures['bar1']= 'res/img/pinkbar.png';
    pictures['title']= "res/img/title0.png";
    pictures['fontpurple']= "res/img/font/purple_medium1_20x20.png";
    pictures['fontchrome']= "res/img/font/chrome_medium1_28x35.bmp";

    var audio = [];
    audio['music'] = 'res/msx/echos.mp3';

    return  { imgSrcArray: pictures, audioSrcArray: audio } ;

  }


  load( action, data ) {

    if( action == 'GETURLS' ) {
      data.urls = this.loadGetUrls();
      return;
    }
    else if( action == 'LOADED' ) {

      var loadedResources = data.resources;
      this.endFlag = false;
      this.r = 0;
      this.lasX = 100;
      this.lasXdx = 20;

      this.bar1 = loadedResources.imgArray['bar1'];
      this.title = loadedResources.imgArray['title'];

      this.titlerenderW = this.title.width * 1.25;
      this.titlerenderH = this.title.height * 1.25;
      this.titlerenderX = (this.width - this.titlerenderW) / 2;
      this.titlerenderY = 25;


      this.music = loadedResources.audioArray['music'];

      this.font = new BlockFont(
          loadedResources.imgArray['fontpurple'],
          20,20, {r:0, g:0, b:0}
        );
      this.font2 = new BlockFont(
            loadedResources.imgArray['fontchrome'],
            28,35, {r:0, g:0, b:0}
          );

      console.log("setup_Init");
      this.playSound( this.music );

      this.barAngle = 0;
    }
  }

  /* Run */


  menuHandle( evt ) {

    console.log("menuHandle");
    if( evt.type == 'keyup' && evt.key == 'z') {
       this.endFlag = true;
    }
    else if( evt.type == 'keyup' && evt.key == ' ') {
       this.endFlag = true;
    }

  }

  menu( action ) {

  }

  menuRun() {

    if( this.endFlag ) {
      this.stopSound( this.music );
      return 'next';
    }

    this.lasX = this.lasX + this.lasXdx;
    if( this.lasXdx > 0 ) {
      if( this.lasX > this.width ) {
        this.lasXdx = this.lasXdx * -1;
      }
    }
    else {
      if( this.lasX < 0 ) {
        this.lasXdx = this.lasXdx * -1;
      }
    }

    return false;
  }


  menuRender( context ) {
    var r = this.r;
    r++;

    if( r>255 ) {
      r = 0;
    }
    this.r = r;

    context.fillStyle = 'rgba( 48,0,48,1)';
    context.fillRect(
      0,
      0,
      this.width,
      this.height
    );



    context.drawImage(
            this.title,
            this.titlerenderX, this.titlerenderY,
            this.titlerenderW, this.titlerenderH
          );

    str = 'LAST SCORE: ' + this.game.lastScore;
    x=this.font2.centerX( str, this.width );
    this.font2.drawString( context, x, 40 , str );

    var barY = (Math.sin( this.barAngle ) * 250) + 250;
    this.barAngle = this.barAngle + .05;

    var str = 'Fire to Start';
    var x=this.font2.centerX( str, this.width );
    context.drawImage(this.bar1,0,barY, this.width, 70 );
    this.font2.drawString( context, x, barY + 20 , str );



  }

  playSound( snd ) {
    snd.pause();
    snd.currentTime = 0;
    try {
      snd.play();
    }
    catch(err) {
      console.log(err);
    }
  }

  stopSound( snd ) {
    snd.pause();
  }

}