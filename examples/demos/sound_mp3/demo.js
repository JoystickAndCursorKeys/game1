class Demo {


  initPlayBook( properties ) {
	  this.loader = new DemoLoader( this );

	  this.width =  properties.w;
    this.height = properties.h;

  }

  /*
		Loading
  */
  load( action, data ) {

    if( action == 'GETURLS' ) {
      data.urls = this.loader.gameGetResources();
      return;
    }
    else if( action == 'LOADED' ) {

      var loadedResources = data.resources;

      this.loader.signalResourcesLoaded(
        loadedResources,
        data.currentState );
    }
  }

  playSound( snd ) {
    snd.pause();
    snd.currentTime = 0;
    snd.play();
  }

  /*
	Playing the demo, nothing for this example, as the audio plays once only
  */
  play( action, data ) { }
	playHandle( evt ) {
    if( evt.type == 'keyup' && evt.key == ' ') {
      this.playSound( this.audio );
    }
  }
  playRun() { return false; }
	playRender( context ) {
    context.font = '18px arial';
    context.textBaseline  = 'top';
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fillText( "press space bar to play audio",
          0,
          0
        );
  }

}
