class Demo {


  initPlayBook( properties ) {

	this.loader = new DemoLoader( this );

	this.width =  properties.w;
    this.height = properties.h;
    this.countMax = 100;
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

  /* Init Many Sprites function */
  initManySprites( fast ) {
    this.sprites = new SpriteMover();

	  this.spriteTypes = [];
		var st = this.spriteTypes;

		st['sprite'] = { type: 'sprite', health: undefined, size: undefined, colliding: false,
                next: null,
                bound: 'wrap',
                image: this.res_sprite,
                anim: null};


		/* Add simple moving sprite */
		var sprite;

    var x,y,dx,dy;

    for (var i = 0; i < 255; i++) {

        x = (Math.random() * (this.width + 25))-25;
        y = (Math.random() * (this.width + 25))-25;
        dx = (Math.random() * 6)-3;
        dy = (Math.random() * 6)-3;

        if( fast ) {
          dx = dx * 2;
          dy = dy * 4;
        }
        sprite = this.addSprite( 'sprite', x, y, dx, dy );

    }

  }
  /*
	Playing the demo
  */
  playFast( action, data ) {
    if( action == "INIT") {
      this.initManySprites( true );
      this.count = this.countMax;
    }
  }

	playFastHandle() {
	}


    playFastRun() {

		this.sprites.move();
		this.sprites.animate();

    this.count--;
    if( this.count <=0 ) {
      return 'goEnd';
    }
    return false;
  }


	playFastRender( context ) {
		context.fillStyle = 'rgba( 60,49,158,1)';
		context.fillRect(
		  0,
		  0,
		  this.width,
		  this.height
		);
		this.sprites.render( context );

    context.font = '18px arial';
    context.textBaseline  = 'top';
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fillText( "----------FAST",
          0,
          0
        );
	}


  playSlow( action, data ) {
    if( action == "INIT") {
      this.initManySprites( false );
      this.count = this.countMax;
    }
  }

	playSlowHandle() {
	}


    playSlowRun() {

      this.sprites.move();
  		this.sprites.animate();

      this.count--;
      if( this.count <=0 ) {
        return 'goFast';
      }

    return false;
  }


	playSlowRender( context ) {
		context.fillStyle = 'rgba( 60,49,158,1)';
		context.fillRect(
		  0,
		  0,
		  this.width,
		  this.height
		);
		this.sprites.render( context );

    context.font = '18px arial';
    context.textBaseline  = 'top';
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fillText( "----------SLOW",
          0,
          0
        );
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
      else if( def.bound == 'bound' ) {
        sprite.setBoundaryActionBound();
      }
      else if( def.bound == 'bounce' ) {
        sprite.setBoundaryActionBounce();
      }

      sprite.setBoundaryActionBounce();

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
