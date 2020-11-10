class GameLevel {

  constructor(game) {
    this.game = game;
    this.endFlag = false;
    this.endType = undefined;
  }

  ended() {
    return this.endFlag;
  }

  getEndType() {
    return this.endType;
  }

  init() {

    this.width = this.game.width;
    this.height = this.game.height;

    this.endFlag = false;
    this.endType = undefined;

    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

    this.lastDirection = null;

    this.playerDamage = 25;
    this.playerDamageIncrease = 20;

    this.spriteTypes = [];
    var st = this.spriteTypes;


    st['player'] = {
      type: 'player',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'wrap',
      image: this.game.res_animsheet,
      anim: {
        play: false
      }
    };

    st['zomby'] = {
      type: 'enemy',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'wrap',
      image: this.game.res_animsheet,
      anim: {
        play: false
      }
    };

    st['explosion'] = {
      type: 'explosion',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'disappear',
      image: this.game.res_boom,
      anim: null
    };

    st['scatter'] = {
      type: 'explosion',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'disappear',
      image: this.game.res_scatter,
      anim: null
    };

    st['debris'] = {
      type: 'debris',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'disappear',
      image: this.game.res_debris1,
      anim: {
        play: true,
        speed: 1,
        range: [0, 34]
      }
    };

    st['coin'] = {
      type: 'coin',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'disappear',
      image: this.game.res_coin,
      anim: {
        play: true,
        speed: 1,
        range: [0, 34]
      }
    };


    //this.bg = new BlockImage( this.bg1 );

    this.sprites = new SpriteMover();

    var player = this.addSprite('player', this.width / 2, this.height / 2, 0, 0);
    this.player = player;

    var levelMod = (this.lCounter) % 4;
    if (levelMod == 0) {
      this.bg = this.bg1;
    } else if (levelMod == 1) {
      this.bg = this.bg2;
    } else if (levelMod == 2) {
      this.bg = this.bg3;
    } else if (levelMod == 3) {
      this.bg = this.bg4;
    }

    var map = this.game.map1;

    this.map = map.tmap;
    this.playerPos = map.posPlayer;
    this.player.x = 12 + (this.playerPos[0] * 24);
    this.player.y = 12 + (this.playerPos[1] * 24);

    var imgXO = 2;
    var imgYRowSize = 14;
    var startF, endF;
    var anim;

    this.playerAnim = this.game.animData.player.anim;


    var player = this.addSprite('player', this.width / 2, this.height / 2, 0, 0);
    this.zombyAnim = this.game.animData.entities[0].anim;
    var zombyPos = map.entities[0].pos;

  }



  playerInit() {

    console.log("playerInit");

    this.playerDamage = 0;
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      fire: false,
      end: false
    };

    this.angle = 0;
    this.speed = 0;
    this.angle = 0;
    this.endFlag = false;
    this.lastDirection = 'left';

    var imgXO = 2;
    var imgYRowSize = 14;

    var startFrame = imgXO + (imgYRowSize * 3);
    var endFrame = imgXO + 1 + (imgYRowSize * 3);

    this.player.setFrame(startFrame);
    this.player.resetEffects();
    this.player.setFrameRange(startFrame, endFrame);
    this.player.setCycleFrameRate(.2);
    this.player.playAnim();

    this.player.getData().intend = {
      left: false,
      right: false,
      up: false,
      down: false
    };

    this.player.getData().anim = this.playerAnim;


  }

  playSound(snd) {
    snd.pause();
    snd.currentTime = 0;
    snd.play();
  }

  stopSound(snd) {
    snd.pause();
  }

  degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  clearIntend(i) {
    i.up = false;
    i.down = false;
    i.right = false;
    i.left = false;
  }

  setIntend(i, l, r, u, d) {
    i.up = u;
    i.down = d;
    i.right = r;
    i.left = l;
    i.age = 0;
  }


  playHandleInput() {

    var input = this.input;
    var dx = 0;
    var dy = 0;

    //console.log( "handleInput");
    if (input.end) {
      this.endFlag = true;
      this.endType = 'interupted';
      this.game.lives = 0;
      console.log("endFlag!");
      return;
    }

    var imgXO = 2;
    var imgYRowSize = 14;
    var startFrame, endFrame;
    var intend = this.player.getData().intend;

    if (input.left) {
      this.setIntend(intend, true, false, false, false);
    }
    if (input.right) {
      this.setIntend(intend, false, true, false, false);
    }
    if (input.up) {
      this.setIntend(intend, false, false, true, false);
    }
    if (input.down) {
      this.setIntend(intend, false, false, false, true);
    }

    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      fire: false,
      end: false
    };



  }


  /*
  the "cutscene" for when a level is completed
  */
  completedScene() {
    this.nextLevelCounter = 250;
    this.endFlag = false;

  }

  completedSceneHandle(evt) {
    this.playHandle(evt);
  }


  completedSceneRun() {

    this.playHandleInput();
    this.input.fire = false;

    this.playRunProcessor();

    this.nextLevelCounter--;
    if (this.nextLevelCounter > 0) {
      return false;
    }

    return "next";
  }

  completedSceneRender(context) {
    this.playRender(context);

    var shortCounter = Math.ceil(this.nextLevelCounter / 10);
    var str = 'WARP IN: ' + shortCounter;
    var x = this.game.res_font2.centerX(str, this.width);
    this.game.res_font2.drawString(context, x, 250, str);

  }

  /*
  the "cutscene" for when a player starts
  */
  startScene() {
    this.nextLevelCounter = 150;
    this.endFlag = false;

  }

  /*startSceneHandle( evt ) {
    this.playHandle(evt);
  }*/


  startSceneRun() {

    this.playHandleInput();
    this.input.fire = false;


    this.playRunProcessor2(false);

    this.nextLevelCounter--;
    if (this.nextLevelCounter > 0) {
      return false;
    }

    return "next";
  }

  startSceneRender(context) {
    this.playRender(context);

    var shortCounter = Math.ceil(this.nextLevelCounter / 50);
    var str = 'START IN: ' + shortCounter;
    var x = this.game.res_font2.centerX(str, this.width);
    this.game.res_font2.drawString(context, x, 250, str);

  }



  /*
  the "cutscene" for when a player dies
  */
  dieScene() {

    //Init
    this.dieCounter = 75;
    this.endFlag = false;

    this.playSound(this.game.audioDestroy);

  }

  dieSceneRender(context) {
    this.playRender(context);
  }


  dieSceneRun() {

    this.dieCounter--;
    if (this.dieCounter <= 0) {
      return 'next';
    }

    return false;
  }


  /* Run Level */
  playHandle(evt) {

    var input = this.input;
    input.fire = false;
    input.end = false;

    if (evt.type == 'keyup' && evt.key == 'Escape') {
      input.end = true;
    } else if (evt.type == 'keyup' && evt.key == 'z') {
      input.fire = true;
    } else if (evt.type == 'keyup' && evt.key == ' ') {
      input.fire = true;
    } else if (evt.type == 'keydown' && evt.key == 'ArrowLeft') {
      input.left = true;
    } else if (evt.type == 'keydown' && evt.key == 'ArrowRight') {
      input.right = true;
    } else if (evt.type == 'keyup' && evt.key == 'ArrowLeft') {
      input.left = false;
    } else if (evt.type == 'keyup' && evt.key == 'ArrowRight') {
      input.right = false;
    } else if (evt.type == 'keydown' && evt.key == 'ArrowDown') {
      input.down = true;
    } else if (evt.type == 'keydown' && evt.key == 'ArrowUp') {
      input.up = true;
    } else if (evt.type == 'keyup' && evt.key == 'ArrowDown') {
      input.down = false;
    } else if (evt.type == 'keyup' && evt.key == 'ArrowUp') {
      input.up = false;
    }

  }

  play(action, data) {
    if (action == "INIT") {
      console.log("play.init");
    }
  }

  playRun() {

    if (this.ended()) {
      //this.endType = this.level.getEndType();
      return this.endType;
    }

    this.playHandleInput();
    this.input.fire = false;

    this.playRunProcessor();

    return false;
  }


  playRender(context) {
    this.render(context);
  }


  playRunProcessor() {
    this.playRunProcessor2(true);
  }

  playRunProcessor2(normal) {

    var rad = this.degrees_to_radians(this.angle * 4);

    if (normal) {

      this.moveSprites();
      this.collide();
    }
    this.sprites.animate();

  }


  moveSprites() {

    for( var i=0; i<5; i++) {
      this.moveSprite(this.player);
    }

  }

  moveSprite(s) {

    var data = s.getData();
    var intend = data.intend;
    var dx = data.dx;
    var dy = data.dy;
    var speed = 1;

    var startFrame, endFrame;
    var xy = s.getXY();

    var changeDirection = 'n';

    var moveOnIntend = false; /* opposite is move by inertia */

    if ((dx >0 && !intend.left) || (intend.right ) ) {
      if (this.passable( xy, 'r' , speed )) {

        dx = speed;
        dy = 0;
        if( intend.right ) { moveOnIntend = true; }

        if (this.lastDirection != 'right') {

          this.lastDirection = 'right';
          changeDirection = 'r';
        }
        intend.right = false;
      }
      else {
        dx=0;
      }

    }
    else if ((dx <0 && !intend.right) || (intend.left ) ) {
      if (this.passable(xy, 'l', speed )) {
        dx = -speed;
        dy = 0;
        if( intend.left ) { moveOnIntend = true; }

        if (this.lastDirection != 'left') {

          this.lastDirection = 'left';
          changeDirection = 'l';

        }
        intend.left = false;
      }
      else {
        dx=0;
      }

    }

    if( !moveOnIntend ) {
      if ((dy <0 && !intend.down) || (intend.up ) ) {
        if (this.passable(xy, 'u', speed)) {
          dy = -speed;
          dx = 0;

          if (this.lastDirection != 'up') {

            this.lastDirection = 'up';
            changeDirection = 'u';

          }
          intend.up = false;
        }
        else {
          dy=0;
        }

      } else if ((dy >0 && !intend.up) || (intend.down ) ) {
        if (this.passable(xy, 'd', speed)) {
          dy = speed;
          dx = 0;

          if (this.lastDirection != 'down') {

            this.lastDirection = 'down';
            changeDirection = 'd';

          }
          intend.down = false;
        }
        else {
          dy=0;
        }

      }
    }

    if( changeDirection != 'n' ) {
      this.changeDirectionAnimation( changeDirection, s  );
    }

    data.dx = dx;
    data.dy = dy;

    data.intend.age++;
    if( data.intend.age > 50 ) {
      this.clearIntend( data.intend );
    }

    s.addXY(dx, dy);

    //this.player.setDXDY(dx, dy);
  }

  changeDirectionAnimation( d, s ) {
    var f;
    var a = s.getData().anim;
    if( d == 'l') { f = a.l; }
    else if( d == 'r') { f = a.r; }
    else if( d == 'u') { f = a.u; }
    else if( d == 'd') { f = a.d; }

    s.setFrame( f[ 0 ] );
    s.setFrameRange( f[ 0 ], f[ 1 ] );
    s.playAnim();
  }

  passable( xy, dir, speed ) {

    var x,y;
    if( dir == 'u' ) {
      x=xy[0];
      y=xy[1] - 12 - speed;
      return this.passable2( x-12 , y ) && this.passable2( x+11 , y );
    }
    else if( dir == 'd' ) {
      x=xy[0];
      y=xy[1] + 11 + speed;
      return this.passable2( x-12 , y ) && this.passable2( x+11 , y );
    }
    else if( dir == 'l' ) {
      x=xy[0] - 12 - speed;
      y=xy[1];
      return this.passable2( x, y-12 ) && this.passable2( x, y+11 );
    }
    else if( dir == 'r' ) {
      x=xy[0] + 11 + speed;
      y=xy[1];
      return this.passable2( x, y-12 ) && this.passable2( x, y+11 );;
    }

    return false;
  }

  passable2( x, y ) {

    var X,Y;
    X = Math.floor(x / 24);
    Y = Math.floor(y / 24);

    var t = this.map.getTile( X, Y ); //this.getTile( X, Y );

    return t == 0;

  }

  collideWithWalls() {
    //this.sprites.getSprites( type )

  }

  collideWithWallsSimpleSprite(x, y) {
    var offset = 12;
    var tilex0y0 = this.getTile(x - offset, y - offset);
    var tilex1y0 = this.getTile(x + offset, y - offset);
    var tilex0y1 = this.getTile(x - offset, y + offset);
    var tilex1y1 = this.getTile(x + offset, y + offset);
  }

  collide() {

    var c = this.sprites.detectColissions();

    if (c.length > 0) {
      console.log('collide ' + c.length);
      console.log(c);

      for (var i = 0; i < c.length; i++) {
        var collision = this.sortCollistion(c[i]);

        var a = collision[0];
        var b = collision[1];

        if (a.type == 'asteroid' && b.type == 'bullet') {} else if (a.type == 'asteroid' && b.type == 'player') {
          /*          console.log( "boom!!" + this.lastDirection);

                    this.playerDamage+=15;

                    b.addXY( a.dx*15, a.dy*15);

                    b.setDXDY( a.dx*15, a.dy*15 );

                    this.playSound( this.game.audioCollide );

                    if( this.playerDamage >= 100 ) {

                        this.endFlag = true;
                        this.endType = 'playerDies';
                        return;

                    }
                    */
        }

      }
    }
  }

  countSprites(type) {
    return this.sprites.countSprites(type);
  }

  sortCollistion(c) {
    var a, b;
    a = c[0];
    b = c[1];

    if (a.type > b.type) {
      return [b, a];
    }

    return [a, b];
  }

  playSound(snd) {
    snd.pause();
    //var x = snd.playbackRate;
    //snd.playbackRate = .25;
    snd.currentTime = 0;
    snd.play();
  }


  render(context) {

    var intend = this.player.getData().intend;
    context.drawImage(this.bg, 0, 0, this.width, this.height);
    this.game.res_tiles.drawTiles(context, 0, 0, this.map.data);

    var str, x;
    str = 'SCORE: ' + this.game.score;
    x = this.game.res_font2.centerX(str, this.width);
    this.game.res_font2.drawString(context, x, 10, str);


    str = 'LEVEL: ' + this.lCounter + "    LIVES: " + this.game.lives;
    x = this.game.res_font2.centerX(str, this.width);
    this.game.res_font2.drawString(context, x, 35, str);

    var str, x,y=40;
    str = 'I.l: ' + intend.left; y+=10;
    this.game.res_font2.drawString(context, 0, y, str);
    str = 'I.r: ' + intend.right; y+=10;
    this.game.res_font2.drawString(context, 0, y, str);
    str = 'I.u: ' + intend.up; y+=10;
    this.game.res_font2.drawString(context, 0, y, str);
    str = 'I.d: ' + intend.down; y+=10;
    this.game.res_font2.drawString(context, 0, y, str);

    str = 'dx: ' + this.player.data.dx; y+=10;
    this.game.res_font2.drawString(context, 0, y, str);
    str = 'dy: ' + this.player.data.dy; y+=10;
    this.game.res_font2.drawString(context, 0, y, str);

    this.sprites.render(context);

  }

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
      score: def.score,
      subType1: def.subtype1,
      subType2: def.subtype2,
      intend: {
        left: false,
        right: false,
        up: false,
        down: false
      },
      lastDirection: null,
      dx: 0,
      dy: 0
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
