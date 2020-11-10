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

      console.log( data.currentState + " - geturls" );

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

  /*
	Playing the demo
  */
  play( action, data ) {
    if( action == "INIT") {
		this.sprites = new SpriteMover();

	  /* Add simple sprite */
    /* Note:
        do not forget to set >>type: 'anim', in the loader.js source file
        do not forget to set >>bg: {r:0, g:0, b:0}, in the loader.js source file
        do not forget to set >>w,h , in the loader.js source file (this.data[ id ] = ... )
    */

    var img = this.res_sprite;
    var sprite = new Sprite( img, this.width / 2, this.height / 2  );
    sprite.setFrameRange(0, 34);
    sprite.setCycleFrameRate( 1 );
    sprite.playAnim();

    sprite.activate();

    /* set direction, for movement */
    sprite.setDXDY( 0, 0 );

    /* set boundary, and wrap in boundary */
    sprite.setBoundary( -img.w, -img.h, this.width + img.w, this.height + img.h );
    sprite.setBoundaryActionWrap();

    /* add some data to the sprite */
    sprite.setData( { description: "this is my first sprite"} );

    /* add it */
    this.sprites.addSprite( sprite );
    }
  }

	playHandle() {
	}


    playRun() {

		this.sprites.move();
		this.sprites.animate();

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
		this.sprites.render( context );




	}


  /* Sprite creation utilities */
  addSprite( id, x, y, dx, dy ) {

    var def = this.spriteTypes[ id ];

    var sprite = new Sprite( def.image, x, y );
    sprite.setType( def.type );
    sprite.setColliding( def.colliding );

    var animSpeed = null;
    if( def.anim != null ) {
      animSpeed = def.anim.speed;
    }

    sprite.setData( { animSpeed:animSpeed ,  health: def.health, size: def.size, next: def.next , score: def.score } );

    this.sprites.addSprite( sprite );

    sprite.activate();
    sprite.setDXDY( dx, dy );

    var img = sprite.spriteImage;
    if( def.bound != null ) {

      sprite.setBoundary( -img.w,-img.h,this.width+img.w, this.height+img.h);

      if( def.bound == 'wrap' ) {
        sprite.setBoundaryActionWrap();
      }
      else if( def.bound == 'disappear' ) {
        sprite.setBoundaryActionDisappear();
      }

    }

    if( def.anim != null ) {
      if( def.anim.play ) {
        sprite.setFrameRange(def.anim.range[0], def.anim.range[1]);
        sprite.setCycleFrameRate( def.anim.speed );
        sprite.playAnim();
      }
      else {
        sprite.setFrameRange( 0, 0 );
        sprite.setCycleFrameRate( 0 );
        sprite.pauseAnim();
      }
    }

    return sprite;
  }
}
