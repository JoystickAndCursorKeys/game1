class Demo {


  initPlayBook(properties) {


    /* this defines the resolution of the collision box, in pixels */
    /* lower value mean, higher granularity, the maximum granularity is '1' */
    /* IMPORTANT: lower value means also more processing, and slower collision detection */

    this.collisionResolution = {
      xGranularity: 8,
      yGranularity: 8
    };


    this.loader = new DemoLoader(this, this.collisionResolution);

    this.width = properties.w;
    this.height = properties.h;


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

      /* Add simple sprite */
      var sprite = new Sprite(img, 0, this.height / 2);
      sprite.activate();

      /* set direction, for movement */
      sprite.setDXDY(2, 3);

      /* set boundary, and wrap in boundary */
      sprite.setBoundary(-img.w, -img.h, this.width + img.w, this.height + img.h);
      sprite.setBoundaryActionWrap();

      /* add some data to the sprite */
      sprite.setData({
        description: "this is my first sprite"
      });

      sprite.setType("sprite1");
      sprite.setColliding(true);

      /* second sprite */
      var sprite2 = new Sprite(img2, 0, this.height / 2);
      sprite2.activate();

      /* set direction, for movement */
      sprite2.setDXDY(2, -3);

      /* set boundary, and wrap in boundary */
      sprite2.setBoundary(-img2.w, -img2.h, this.width + img2.w, this.height + img2.h);
      sprite2.setBoundaryActionWrap();

      /* add some data to the sprite */
      sprite2.setData({
        description: "this is my second sprite"
      });

      sprite2.setType("sprite2");
      sprite2.setColliding(true);

      /* add sprites to sprite system */
      this.sprites.addSprite(sprite);
      this.sprites.addSprite(sprite2);

      this.collissionCount = 0;
    }
  }

  playHandle() {}


  playRun() {

    this.sprites.move();
    this.sprites.animate();
    var c = this.sprites.detectColissions();

    if (c.length > 0) {

      this.collissionCount++;
      console.log('collision ' + this.collissionCount );
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