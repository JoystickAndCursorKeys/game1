class Demo {

  constructor ( demo ) {
    this.layers = 4;
  }


  initPlayBook( properties ) {

	this.loader = new DemoLoader( this );
  this.sprites = new SpriteLayers( this.layers );

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
  		//this.sprites = new SpriteMover();

  	   this.spriteTypes = [];
  		var st = this.spriteTypes;


  //{ f:this.magic.scale, par: 0.5 },


      for( var i=0; i<this.layers; i++) {
        st['sprite_'+i] =
                    { type: 'sprite', health: undefined, size: undefined, colliding: false,
                    next: null,
                    bound: 'wrap',
                    image: this['res_sprite_'+i],
                    anim: null};
      }



  		/* Add simple moving sprite */
  		var sprite;

      var x,y,dx,dy, l0, l,yspacing, xspacing;

      yspacing = 150 / this.layers;

      for( l=0; l<this.layers; l++) {
        var n=Math.ceil( (((this.layers-l)) / this.layers) * 10 );
        xspacing = (this.width + this['res_sprite_'+l].w ) / n;
        x = -xspacing/2;
        for( var s=0; s<n; s++) {

          y = this.height/2 + (l*yspacing);
          dx = l+1/5;
          dy = 0;

          sprite = this.addSprite( 'sprite_' + l, x, y, dx, dy, l );
          x += xspacing;
        }
      }
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
  addSprite( id, x, y, dx, dy, l  ) {

    console.log( this );
    var def = this.spriteTypes[ id ];

    var sprite = new Sprite( def.image, x, y );
    sprite.setType( def.type );
    sprite.setColliding( def.colliding );

    var animSpeed = null;
    if( def.anim != null ) {
      animSpeed = def.anim.speed;
    }

    sprite.setData( { animSpeed:animSpeed ,  health: def.health, size: def.size, next: def.next , score: def.score } );

    this.sprites.addSprite( sprite, l );

    sprite.activate();
    sprite.setDXDY( dx, dy );

    var img = sprite.spriteImage;
    if( def.bound != null ) {

      sprite.setBoundary( -img.w/2,-img.h/2,this.width+img.w/2, this.height+img.h/2);

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
