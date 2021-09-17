class Demo {


  initPlayBook(properties) {


    /* this defines the resolutions of the collision box, in pixels */
    /* lower value mean, higher granularity, the maximum granularity is '1' */
    /* Then we pass these on to the loader */
    /* IMPORTANT: lower value means also more processing, and slower collision detection */

    this.collisionResolution = { xGranularity: 8,
    						               yGranularity: 16 };

    this.collisionResolutionHiRes = { xGranularity: 2,
    						                      yGranularity: 4 };

    this.loader = new DemoLoader( this,
        this.collisionResolution,
        this.collisionResolutionHiRes );

    this.width = properties.w;
    this.height = properties.h;

    this.collideCount = 0;

  }

  /*
		Loading
  */
  load(action, data) {

    if (action == 'GETURLS') {

      console.log(data.currentState + " - geturls");

      data.urls = this.loader.gameGetResources();
      return;
    } else if (action == 'LOADED') {

      var loadedResources = data.resources;

      this.loader.signalResourcesLoaded(
        loadedResources,
        data.currentState);

    }
  }

  /*
	Playing the demo
  */
  play(action, data) {
    if (action == "INIT") {
      this.sprites = new SpriteMover();

      /* use images for sprites */
      var img = this.res_sprite;
      var img2 = this.res_ball;
      var img3 = this.res_ballhires;

      /* Add simple sprite */
      var sprite = new Sprite(img,  this.width * .6, this.height / 2);
      sprite.activate();

      /* set direction, for movement */
      sprite.setDXDY(-.3, 0);

      /* set boundary, and wrap in boundary */
      sprite.setBoundary(this.width *.25, this.height *.25,
            this.width *.75, this.height *.75 );

      sprite.setBoundaryActionWrap();

      /* add some data to the sprite */
      sprite.setData({
        description: "this is my first sprite"
      });

      sprite.setType("sprite1");
      sprite.setColliding(true);

      /**************** second sprite */
      var sprite2 = new Sprite(img2,  this.width * .4, this.height / 2);
      sprite2.activate();

      /* set direction, for movement */
      sprite2.setDXDY(.3, 0);

      /* set boundary, and wrap in boundary */
      sprite2.setBoundary(this.width *.25, this.height *.25,
            this.width *.75, this.height *.75 );
      sprite2.setBoundaryActionWrap();

      /* add some data to the sprite */
      sprite2.setData({
        description: "this is my second sprite"
      });

      sprite2.setType("sprite2");
      sprite2.setColliding(true);

      /**************** third sprite */
      var sprite3 = new Sprite(img3,  this.width * .4, this.height / 3);
      sprite3.activate();

      /* set direction, for movement */
      sprite3.setDXDY(.3, -.3);

      /* set boundary, and wrap in boundary */
      sprite3.setBoundary(this.width *.25, this.height *.25,
            this.width *.75, this.height *.75 );
      sprite3.setBoundaryActionWrap();

      /* add some data to the sprite */
      sprite3.setData({
        description: "this is my 3rd sprite"
      });

      sprite3.setType("sprite3");
      sprite3.setColliding(true);

      /**************** add sprites to sprite system */
      this.sprites.addSprite(sprite);
      this.sprites.addSprite(sprite2);
      this.sprites.addSprite(sprite3);
      this.collissionCount = 0;
    }
  }

  playHandle( evt ) {

    console.log( event );
    if( evt.keyCode == 32 && evt.type==='keydown' ) {
        CollisionBoxFactory_Debug_a260592cbef84c018c6f3f4eff1037a0 = !
          CollisionBoxFactory_Debug_a260592cbef84c018c6f3f4eff1037a0;
    }

  }




  playRun() {

    this.sprites.move();
    this.sprites.animate();
    var c = this.sprites.detectColissions();
    this.collideCount = 0;
    if (c.length > 0) {
      this.collideCount = c.length;

      this.collissionCount++;
      console.log('collision ' + this.collissionCount );
      console.log('collide array length' + c.length + ", see below for the collision array dump");
      console.log('collide array length' + c.length + ", see below for the collision array dump");
      console.log(c);
    }

    return false;
  }


  playRender(context) {
    context.fillStyle = 'rgba( 60,49,158,1)';
    context.fillRect(
      0,
      0,
      this.width,
      this.height
    );

    context.font = '12px arial';
    context.textBaseline  = 'top';
    context.fillStyle = 'rgba(255,255,255,1)';
    context.fillText( "Collision Count: " + this.collideCount + "   ",
          10,
          10
        );
    context.fillText( "Check console for debug information ",
          10,
          10+16
        );
    context.fillText( "Press space for showing colision boxes",
          10,
          10+32
        );



    this.sprites.render(context);
  }


  /* Sprite creation utilities */
  addSprite(id, x, y, dx, dy) {

    var def = this.spriteTypes[id];

    var sprite = new Sprite(def.image, x, y);
    sprite.setType(def.type);
    sprite.setColliding(def.colliding);

    var animSpeed = null;
    if (def.anim != null) {
      animSpeed = def.anim.speed;
    }

    sprite.setData({
      animSpeed: animSpeed,
      health: def.health,
      size: def.size,
      next: def.next,
      score: def.score
    });

    this.sprites.addSprite(sprite);

    sprite.activate();
    sprite.setDXDY(dx, dy);

    var img = sprite.spriteImage;
    if (def.bound != null) {

      sprite.setBoundary(-img.w, -img.h, this.width + img.w, this.height + img.h);

      if (def.bound == 'wrap') {
        sprite.setBoundaryActionWrap();
      } else if (def.bound == 'disappear') {
        sprite.setBoundaryActionDisappear();
      }

    }

    if (def.anim != null) {
      if (def.anim.play) {
        sprite.setFrameRange(def.anim.range[0], def.anim.range[1]);
        sprite.setCycleFrameRate(def.anim.speed);
        sprite.playAnim();
      } else {
        sprite.setFrameRange(0, 0);
        sprite.setCycleFrameRate(0);
        sprite.pauseAnim();
      }
    }

    return sprite;
  }

}
