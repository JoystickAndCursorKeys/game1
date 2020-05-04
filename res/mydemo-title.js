class DemoTitle {

  constructor () {
    this.states = new DemoTitleStates();
  }

  /* mandatory methods */
  getStates() {
    return this.states;
  }

  signalResourcesLoaded( loadedResources, stateName  ) {

    console.log( "game/level loaded now " + stateName);
    this.bg = loadedResources.imgArray['bg'];
    this.ball = loadedResources.imgArray['ball'];
    this.audio = loadedResources.audioArray['test'];

    this.font = new BlockFont(
        loadedResources.imgArray['fontpurple'],
        20,20, {r:0, g:0, b:0}
      );

  }

  initChapter( properties ) {

    this.width =  properties.w;
    this.height = properties.h;

    return this.states;
  }

  /* stated defined methods*/
  titleGetResources() {
    var pictures = [];
    pictures['bg']= 'space2g.png';
    pictures['ball']= "fireball.png";
    pictures['fontpurple']= "purplefont_20x20.png";

    var audio = [];
    audio['test'] = 'laser.mp3';

    return { resources: { imgSrcArray: pictures, audioSrcArray: audio } }
  }

  titleLoadingRender( ctx ) {
    console.log("titleLoadingRender");
  }

  titleLoadingProcess() {
    console.log("titleLoadingProcess");
    return { endState: false };
  }

  titleInit() {
    console.log("titleInit");
    this.endFlag = false;
    this.r = 0;
  }

  titleRunHandle( evt ) {

    if( evt.type == 'keyup' && evt.key == 'p') {
       this.audio.pause();
       this.audio.currentTime = 0;      
       this.audio.play();
    }
    if( evt.type == 'keyup' && evt.key == 's') {
       this.audio.pause();
       this.audio.currentTime = 0;
    }
    else if( evt.type == 'keyup' && evt.key == ' ') {
       this.endFlag = true;
    }

  }

  titleRunProcess() {

    if( this.endFlag ) {
      this.audio.pause();
      return { endState: true }
    }
    return { endState: false };
  }

  titleRunRender( context ) {
    var r = this.r;
    r++;

    if( r>255 ) {
      r = 0;
    }
    this.r = r;

    context.drawImage(this.bg,0,0);

    context.fillStyle = "white";		context.font = 'normal  ' + 10 + 'px Verdana';
		context.fillText( 'title', 12,58);

    this.font.drawString( context, 10, 10 , "hello world!");

  }

  titleGetEndAction() {
    this.level ++;
    return { nextChapter: "level" };
  }

}
