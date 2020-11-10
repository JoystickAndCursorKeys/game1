class Demo {


  initPlayBook( properties ) {

	  this.width =  properties.w;
    this.height = properties.h;

  }

  /*
		Loading
  */

  /* Resources */
  gameGetResources() {

    var pictureURLs = [];
    var audioURLs = [];
    var dataURLs = [];
    var id;

    id = 'res_text';
    dataURLs[ id ] = 'test.txt';

    return {  imgSrcArray: pictureURLs, audioSrcArray: audioURLs, dataSrcArray: dataURLs } ;
  }

  signalResourcesLoaded( loadedResources, currentState ) {

      var dataarr = loadedResources.dataArray;
      var id;

      id = 'res_text';
      this[ id ]   = dataarr[ id ].data;

  }


  load( action, data ) {

    if( action == 'GETURLS' ) {

      console.log( data.currentState + " - geturls" );

      data.urls = this.gameGetResources();
      return;
    }
    else if( action == 'LOADED' ) {

      var loadedResources = data.resources;

      this.signalResourcesLoaded(
        loadedResources,
        data.currentState );

    }
  }

  /*
	Playing the demo
  */
  play( action, data ) {
    if( action == "INIT") {}
  }

	playHandle() {
	}


  playRun() {
	  return false;
  }


	playRender( context ) {
		context.fillStyle = 'rgba( 60,49,158,1)';
		context.fillRect(
		  0,
		  0,
		  this.width,
		  this.height
		);

    context.font = '12px arial';
    context.textBaseline  = 'top';
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fillText( "loadable data: " + this.res_text,
          0,
          0
        );
	}

}
