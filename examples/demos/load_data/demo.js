class Demo {


  initPlayBook( properties ) {

	  this.width =  properties.w;
    this.height = properties.h;

  }

  /* Loading
     "GETURLS" means, collect URLs to load
     "LOADED" means, handle the loaded resources, and intialize the apropriate variables
  */
  load( action, data ) {

    if( action == 'GETURLS' ) {

      console.log( data.currentState + " - geturls" );

      var dataURLs = [];

      dataURLs[ 'res_text' ] = 'textdata.txt';
      dataURLs[ 'res_json' ] = 'structuraldata.json';

      data.urls = {  imgSrcArray: [], audioSrcArray: [], dataSrcArray: dataURLs };

      return;
    }
    else if( action == 'LOADED' ) {

      var loadedResources = data.resources;
      var dataarr = loadedResources.dataArray;
      var id;

      id = 'res_text';
      this[ id ]   = dataarr[ id ].data;

      id = 'res_json';
      this[ id ]   = dataarr[ id ].data;
    }
  }

  /*
	Playing the demo
  */
  play( action, data ) {
    if( action == "INIT") {}
  }
	playHandle() {}
  playRun() { return false; }


	playRender( context ) {

    /* Render the loaded results */

    /* Clear Screen */
		context.fillStyle = 'rgba( 60,49,158,1)';
		context.fillRect(
		  0,
		  0,
		  this.width,
		  this.height
		);

    /* Set Font */
    context.font = '12px arial';
    context.textBaseline  = 'top';
    context.fillStyle = 'rgba(0,0,0,1)';

    /* Print Loaded text */
    context.fillText( "loaded data: " + this.res_text,
          10,
          0
        );

    /* Print Loaded JSON */
    var y=20;
    for (var i = 0; i < this.res_json.greetings.length; i++) {
      context.fillText( "loaded json data: " + this.res_json.greetings[ i ],
                10,
                y
              );
      y += 15;

    }
	}
}
