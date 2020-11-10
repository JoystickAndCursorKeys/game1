class Title {

  initPlayBook( properties ) {

	   this.loader = new DemoLoader( this );

     this.width =  properties.w;
     this.height = properties.h;

     this.end = false;
  }

  /*
	Playing the demo title
  */
  main( action, data ) {
  }

	mainHandle( evt ) {
    if( evt.type == 'keyup' && evt.key == ' ') {
      this.end = true;
    }
	}

  mainRun() {
    if( this.end ) {
      return 'goNext';
    }
    return false;
  }

	mainRender( context ) {

    context.fillStyle = 'rgba( 60,49,158,1)';
    context.fillRect(
      0,
      0,
      this.width,
      this.height
    );
        
    context.font = '18px arial';
    context.textBaseline  = 'top';
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fillText( "press space bar to go to next playbook 'demo'",
          0,
          0
        );
	}

}
