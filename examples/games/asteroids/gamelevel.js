class GameLevel {

  constructor( game ) {
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

    st['asteroidrnd100'] = { type: 'asteroid', subtype1: '100', subtype2:'round', health: 3, size: 100, colliding: true,
                next: 'asteroidrnd50',
                score: 1,
                bound: 'wrap',
                image: this.game.res_rock_rnd_100,
                anim: {play: true, speed: 1, range: [0, 34] }};

    st['asteroidrnd50'] = { type: 'asteroid', subtype1: '50', subtype2:'round', health: 2, size: 50, colliding: true,
                next: 'asteroidrnd25',
                score: 2,
                bound: 'wrap',
                image: this.game.res_rock_rnd_50,
                anim: {play: true, speed: 1, range: [0, 34] }};

    st['asteroidrnd25'] = { type: 'asteroid', subtype1: '25', subtype2:'round', health: 1, size: 25, colliding: true,
                next: null,
                score: 4,
                bound: 'wrap',
                image: this.game.res_rock_rnd_25,
                anim: {play: true, speed: 1, range: [0, 34] }};

    st['asteroidblood100'] = { type: 'asteroid', subtype1: '100', subtype2:'blood', health: 4, size: 100, colliding: true,
                next: 'asteroidblood50',
                score: 2,
                bound: 'wrap',
                image: this.game.res_rock_blood_100,
                anim: {play: true, speed: 1, range: [0, 34] }};

    st['asteroidblood50'] = { type: 'asteroid', subtype1: '50', subtype2:'blood', health: 3, size: 50, colliding: true,
                next: 'asteroidblood25',
                score: 4,
                bound: 'wrap',
                image: this.game.res_rock_blood_50,
                anim: {play: true, speed: 1, range: [0, 34] }};

    st['asteroidblood25'] = { type: 'asteroid', subtype1: '25', subtype2:'blood', health: 2, size: 25, colliding: true,
                next: null,
                score: 8,
                bound: 'wrap',
                image: this.game.res_rock_blood_25,
                anim: {play: true, speed: 1, range: [0, 34] }};

    st['asteroidflt100'] = { type: 'asteroid', subtype1: '100', subtype2:'flat', health: 5, size: 100, colliding: true,
                next: 'asteroidflt50',
                score: 4,
                bound: 'wrap',
                image: this.game.res_rock_flt_100,
                anim: {play: true, speed: 1, range: [0, 34] }};

    st['asteroidflt50'] = { type: 'asteroid', subtype1: '50', subtype2:'flat', health: 4, size: 50, colliding: true,
                next: 'asteroidflt25',
                score: 8,
                bound: 'wrap',
                image: this.game.res_rock_flt_50,
                anim: {play: true, speed: 1, range: [0, 34] }};

    st['asteroidflt25'] = { type: 'asteroid', subtype1: '25', subtype2:'flat', health: 3, size: 25, colliding: true,
                next: null,
                score: 16,
                bound: 'wrap',
                image: this.game.res_rock_flt_25,
                anim: {play: true, speed: 1, range: [0, 34] }};

    this.magnetic = [];
    var roundF = .33, bloodF = .5, flatF = 1;
    this.magnetic['round_100'] = 1  * roundF;
    this.magnetic['round_50'] = .5  * roundF;
    this.magnetic['round_25'] = .25 * roundF;
    this.magnetic['blood_100'] = 1  * bloodF;
    this.magnetic['blood_50'] = .5  * bloodF;
    this.magnetic['blood_25'] = .25 * bloodF;
    this.magnetic['flat_100'] = 1   * flatF;
    this.magnetic['flat_50'] = .5   * flatF;
    this.magnetic['flat_25'] = .25  * flatF;

    st['player'] = { type: 'player', health: undefined, size: undefined, colliding: true,
                next: null,
                bound: 'wrap',
                image: this.game.res_ship,
                anim: { play: false }};

    st['laser1'] = { type: 'bullet', health: undefined, size: undefined, colliding: true,
                next: null,
                bound: 'disappear',
                image: this.game.res_laser1,
                anim: null};

    st['thrust'] = { type: 'debris', health: undefined, size: undefined, colliding: false,
                next: null,
                bound: 'disappear',
                image: this.game.res_thrust,
                anim: null};

    st['explosion'] = { type: 'explosion', health: undefined, size: undefined, colliding: false,
                next: null,
                bound: 'disappear',
                image: this.game.res_boom,
                anim: null};

    st['scatter'] = { type: 'explosion', health: undefined, size: undefined, colliding: false,
                next: null,
                bound: 'disappear',
                image: this.game.res_scatter,
                anim: null};

    st['debris'] = { type: 'debris', health: undefined, size: undefined, colliding: false,
                next: null,
                bound: 'disappear',
                image: this.game.res_debris1,
                anim: {play: true, speed: 1, range: [0, 34] }};

    st['coin'] = { type: 'coin', health: undefined, size: undefined, colliding: true,
                next: null,
                bound: 'disappear',
                image: this.game.res_coin,
                anim: {play: true, speed: 1, range: [0, 34] }};


    //this.bg = new BlockImage( this.bg1 );

    this.sprites = new SpriteMover();

    var player = this.addSprite( 'player', this.width/2, this.height/2 , .1, .1 );
    this.player = player;

    var asteroidSets = ["rnd", "flt" ,"blood", "strange"];

    for( var i=0; i< (this.lCounter+2); i++) {
      var set =  asteroidSets[ Math.round(Math.random() * 2)];
      var x = (Math.random() * (this.width + 25))-25;
      var y = (Math.random() * (this.width + 25))-25;
      var dx = (Math.random() * 6)-3;
      var dy = (Math.random() * 6)-3;

      var asteroid = this.addSprite( 'asteroid'+set+'100', x, y, dx, dy );
    }


    this.updateLists();

    var levelMod = (this.lCounter ) % 4;
    if( levelMod == 0 ) {
      this.bg = this.bg1;
    }
    else if( levelMod == 1 ) {
      this.bg = this.bg2;
    }
    else if( levelMod == 2 ) {
      this.bg = this.bg3;
    }
    else if( levelMod == 3 ) {
      this.bg = this.bg4;
    }

    //this.preparePlayer( );

  }


  updateLists() {
    this.asteroids = this.sprites.getSprites("asteroid");
  }


  playerInit() {

      console.log("playerInit");

      this.playerDamage = 0;
      this.input={
        left: false,
        right: false,
        up: false,
        down: false,
        fire: false,
        end: false
      };

      this.lastDirection = 'right';
      this.angle = 0;
      this.speed = 0;
      this.angle = 0;
      this.endFlag = false;

      this.player.setFrame( this.angle );
      this.player.resetEffects();


  }

  playSound( snd ) {
    snd.pause();
    snd.currentTime = 0;
    snd.play();
  }

  stopSound( snd ) {
    snd.pause();
  }



  degrees_to_radians(degrees)
  {
    var pi = Math.PI;
    return degrees * (pi/180);
  }

  playHandleInput() {

    var input = this.input;
    var dx = 0;
    var dy = 0;

    //console.log( "handleInput");
    if( input.end) {
       this.endFlag = true;
       this.endType = 'interupted';
       this.game.lives = 0;
       console.log( "endFlag!");
       return;
    }

    if( input.right ) {
        //dx = -speed;
        this.angle --;
        if( this.angle < 0) { this.angle = 89; }

        //if( this.lastDirection != 'left' ) {
          this.player.setFrame( this.angle );
          //this.lastDirection = 'left';
        //}
    }
    else if( input.left ) {
      //dx = -speed;
      this.angle ++;
      if( this.angle >89) { this.angle = 0; }

      //if( this.lastDirection != 'left' ) {
        this.player.setFrame( this.angle );
        //this.lastDirection = 'left';
      //}
    }

    if( input.up ) {
      if( this.speed   <= .1 ) {
        this.speed = 1;
      }
      this.speed = this.speed * 1.1;
      if( this.speed > 8) {
        this.speed = 8;
      }

      var exhaust =
            this.addSprite( 'thrust',
            Math.round( this.player.x ),
            Math.round( this.player.y ) , -1, -1 );


      exhaust.setFadeFactor(.8);
      exhaust.setScaleFactor(1.01);
      exhaust.setCompositeOperation("lighten");
      exhaust.setTimer( 20 );

      var rad = this.degrees_to_radians( ((this.angle) * 4 ) + 180);
      var dx = Math.sin( rad ) * 10;
      var dy = Math.cos( rad ) * 10;
      exhaust.addXY( dx*4, dy*4);
      exhaust.setDXDY( ((Math.random() * 50)-25)/10 ,((Math.random() * 50)-25)/10);

    }
    else if( input.down ) {
      this.speed *= 0.8;
    }



    if( input.fire ) {

      console.log( "fire!!" + this.lastDirection);

      var bullet = this.addSprite( 'laser1', this.player.x, this.player.y, -1, -1 );
      //var bullet = new Sprite( this.game.laser1, this.player.x, this.player.y  );

      var rad = this.degrees_to_radians( this.angle * 4);
      var dx = Math.sin( rad ) * 10;
      var dy = Math.cos( rad ) * 10;
      bullet.addXY( dx*5, dy*5);
      bullet.setDXDY( dx,dy);
      bullet.setCompositeOperation("lighten");

      this.playSound( this.game.audioLaser );

    }
  }


  /*
  the "cutscene" for when a level is completed
  */

  completedScene() {
    this.nextLevelCounter = 250;
    this.endFlag = false;

  }

  completedSceneHandle( evt ) {
    this.playHandle(evt);
  }


  completedSceneRun() {

    this.playHandleInput();
    this.input.fire = false;


    this.playRunProcessor();

    this.nextLevelCounter--;
    if( this.nextLevelCounter > 0 ) {
      return false;
    }

    return "next";
  }

  completedSceneRender( context ) {
    this.playRender( context );

    var shortCounter = Math.ceil( this.nextLevelCounter / 10 );
    var str = 'WARP IN: ' + shortCounter;
    var x=this.game.res_font2.centerX( str, this.width );
    this.game.res_font2.drawString( context, x, 250 , str );

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


    this.playRunProcessor2( false );

    this.nextLevelCounter--;
    if( this.nextLevelCounter > 0 ) {
      return false;
    }

    return "next";
  }

  startSceneRender( context ) {
    this.playRender( context );

    var shortCounter = Math.ceil( this.nextLevelCounter / 50 );
    var str = 'START IN: ' + shortCounter;
    var x=this.game.res_font2.centerX( str, this.width );
    this.game.res_font2.drawString( context, x, 250 , str );

  }



  /*
  the "cutscene" for when a player dies
  */
  dieScene() {

    this.dieCounter = 75;
    this.endFlag = false;

    this.player.setFadeFactor(.991);
    //this.player.setScaleFactor( .91 );

    this.playSound( this.game.audioDestroy );

    var xoff;
    var yoff;
    var dx;
    var dy;

    for( var i=0; i<10; i++) {

        xoff = (Math.random() * 50)-25;
        yoff = (Math.random() * 50)-25;
        dx =  xoff / 5;
        dy =  yoff / 5;

        var explosion =
              this.addSprite( 'explosion',
              Math.round( this.player.x+xoff ),
              Math.round( this.player.y+yoff ) , -1, -1 );

        explosion.addXY( dx*2, dy*2);
        explosion.setDXDY( dx, dy);
        explosion.setFadeFactor(.98);

    }

    xoff = 0;
    yoff = 0;
    dx =  0;
    dy =  0;

    var explosion =
          this.addSprite( 'scatter',
          Math.round( this.player.x+xoff ),
          Math.round( this.player.y+yoff ) , -1, -1 );

    //explosion.addXY( dx*2, dy*2);
    explosion.setDXDY( dx, dy);
    explosion.setFadeFactor(.97);
    explosion.setScaleFactor(1.01);

  }

  dieSceneRender( context ) {
      this.playRender( context );
  }


  dieSceneRun() {

    this.dieCounter --;
    if( this.dieCounter<=0) {
      return 'next';
    }

    this.angle+=4;
    if( this.angle >89) { this.angle = 0; }
    this.player.setFrame( this.angle );

    var rad = this.degrees_to_radians( this.angle * 4);
    this.speed *= .9;
    var dx = Math.sin( rad ) * this.speed;
    var dy = Math.cos( rad ) * this.speed;
    this.player.setDXDY( dx, dy );

    this.sprites.move();
    this.sprites.animate();

    return false;
  }


  /* Run Level */
  playHandle( evt ) {

      var input = this.input;
      input.fire = false;
      input.end = false;

      if( evt.type == 'keyup' && evt.key == 'Escape') {
         input.end = true;
      }
      else if( evt.type == 'keyup' && evt.key == 'z') {
        input.fire = true;
      }
      else if( evt.type == 'keyup' && evt.key == ' ') {
        input.fire = true;
      }
      else if( evt.type == 'keydown' && evt.key == 'ArrowLeft') {
         input.left = true;
       }
       else if( evt.type == 'keydown' && evt.key == 'ArrowRight') {
         input.right = true;
       }
       else if( evt.type == 'keyup' && evt.key == 'ArrowLeft') {
         input.left = false;
       }
       else if( evt.type == 'keyup' && evt.key == 'ArrowRight') {
         input.right = false;
       }
       else if( evt.type == 'keydown' && evt.key == 'ArrowDown') {
          input.down = true;
       }
       else if( evt.type == 'keydown' && evt.key == 'ArrowUp') {
          input.up = true;
       }
       else if( evt.type == 'keyup' && evt.key == 'ArrowDown') {
          input.down = false;
       }
       else if( evt.type == 'keyup' && evt.key == 'ArrowUp') {
          input.up = false;
       }

  }

  play( action, data ) {
    if( action == "INIT") {
      console.log("play.init");
    }
  }

  playRun() {

    if( this.ended() ) {
      //this.endType = this.level.getEndType();
      return this.endType;
    }

    this.playHandleInput();
    this.input.fire = false;

    this.playRunProcessor();

    return false;
  }


  playRender( context ) {
    this.render( context );
  }


  playRunProcessor() {
    this.playRunProcessor2( true ) ;
  }

  playRunProcessor2( normal ) {

    var rad = this.degrees_to_radians( this.angle * 4);
    var dx = Math.sin( rad ) * this.speed;
    var dy = Math.cos( rad ) * this.speed;

    var ast = this.asteroids;
    var i;
    for (i = 0; i < ast.length; i=i+1) {
        var sprite = ast[ i ];
        var newdx = (this.player.x - sprite.x) / 100;
        var newdy = (this.player.y - sprite.y) / 100;

        var mag;
        var notMag;

        if( normal )  {
          var magKey = sprite.data.subType2 + "_" + sprite.data.subType1;
          var magnetic = this.magnetic[ magKey ];
          //console.log( magKey + " -> " + magnetic );

          var mag = magnetic * 0.005;
          var notMag = 1 - mag;
        }
        else {
          var mag = - 0.5;
          var notMag = 1 + mag;
        }

        sprite.dx = notMag * sprite.dx + mag * newdx;
        sprite.dy = notMag * sprite.dy + mag * newdy;
    }


    this.player.setDXDY( dx, dy );

    var input = this.input;
    if(! ( input.left || input.right || input.up || input.down  )) {
      this.speed *= .9;
      var dx = Math.sin( rad ) * this.speed;
      var dy = Math.cos( rad ) * this.speed;
      this.player.setDXDY( dx, dy );
    }

    this.sprites.move();

    if( normal ) {

        this.collide();
    }
    this.sprites.animate();

  }

  collide() {

    var c = this.sprites.detectColissions();

    if( c.length > 0 ) {
      console.log( 'collide ' + c.length );
      console.log( c );

      for( var i=0; i< c.length; i++ ) {
        var collision = this.sortCollistion( c[i] );

        var a = collision[ 0 ];
        var b = collision[ 1 ];

        if( a.type == 'asteroid' && b.type == 'bullet' )
        {
          console.log( "boom!!" + this.lastDirection);
          b.deactivate();
          this.game.score += a.data.score;
          a.data.health--;
          if( a.data.health == 0) {
            a.deactivate();


            if( a.data.size == 100 ) {
              var asteroid = this.addSprite( a.data.next , a.x, a.y, 1, 1 );
              var asteroid = this.addSprite( a.data.next , a.x, a.y, -1, 1 );
            }
            else if( a.data.size == 50 ) {
              var asteroid = this.addSprite( a.data.next , a.x+5, a.y, 1, 1 );
              var asteroid = this.addSprite( a.data.next , a.x-5, a.y, -1, 1 );
              var asteroid = this.addSprite( a.data.next , a.x-5, a.y, 1, -1 );
            }
            else if( a.data.size == 25 ) {
              var object = this.addSprite( "coin" , a.x, a.y, 1, 1 );

            }

            if( this.countSprites( "asteroid") == 0 ) {
                this.endFlag = true;
                this.endType = 'levelcompleted';
                return;
            }

            var explosion = this.addSprite( 'explosion', b.x, b.y, -1, -1 );

            var rad = this.degrees_to_radians( this.angle * 4);
            var dx = Math.sin( rad ) * 1;
            var dy = Math.cos( rad ) * 1;
            explosion.addXY( dx*2, dy*2);
            explosion.setDXDY( dx,dy);
            explosion.setFadeFactor(.94);
            explosion.setScaleFactor(1.03);
            explosion.setCompositeOperation("lighten");

            this.playSound( this.game.audioDestroy );
          }
          else {

            for( var no=0; no<5; no++ ) {

              var explosion = this.addSprite( 'debris', b.x, b.y, -1, -1 );

              var rad = this.degrees_to_radians( Math.random() * 360 );
              var speed  = Math.random() * 10;
              var dx = Math.sin( rad ) * speed;
              var dy = Math.cos( rad ) * speed;
              explosion.addXY( dx*2, dy*2);
              explosion.setDXDY( dx,dy);

            }
            a.data.animSpeed *= .7;
            a.setCycleFrameRate( a.data.animSpeed );
            this.playSound( this.game.audioHit );
          }

          this.updateLists();
        }
        else if( a.type == 'asteroid' && b.type == 'player' )
        {
          console.log( "boom!!" + this.lastDirection);

          this.playerDamage+=15;

          b.addXY( a.dx*15, a.dy*15);

          b.setDXDY( a.dx*15, a.dy*15 );

          this.playSound( this.game.audioCollide );

          if( this.playerDamage >= 100 ) {

              this.endFlag = true;
              this.endType = 'playerDies';
              return;

          }
        }
        else if( a.type == 'coin' && b.type == 'player' )
        {
          console.log( "boom!!" + this.lastDirection);

          this.playSound( this.game.audioMoney );

          a.deactivate();

          this.game.score += 50;

          this.updateLists();
      }
      else if( a.type == 'asteroid' && b.type == 'asteroid' )
      {
        console.log( "boom asteroid!!" + this.lastDirection);

        this.playSound( this.game.audioCollide );

        var newdxb = (b.x - a.x) / 20;
        var newdyb = (b.y - a.y) / 20;

        var newdxa = (a.x - b.x) / 20;
        var newdya = (a.y - b.y) / 20;

        a.dx = newdxa;
        a.dy = newdya;
        a.x += 5 * a.dx;
        a.y += 5 * a.dy;

        b.dx = newdxb;
        b.dy = newdyb;
        b.x += 5 * b.dx;
        b.y += 5 * b.dy;

        for( var no=0; no<5; no++ ) {

          var explosion = this.addSprite( 'debris', b.x, b.y, -1, -1 );

          var rad = this.degrees_to_radians( Math.random() * 360 );
          var speed  = Math.random() * 10;
          var dx = Math.sin( rad ) * speed;
          var dy = Math.cos( rad ) * speed;
          explosion.addXY( dx*2, dy*2);
          explosion.setDXDY( dx,dy);
        }
      }
    }
   }
  }

  countSprites( type ) {
    return this.sprites.countSprites( type );
  }

  sortCollistion( c ) {
    var a,b;
    a = c[0];
    b = c[1];

    if( a.type > b.type ) {
      return [ b, a];
    }

    return [a,b];
  }

  playSound( snd ) {
    snd.pause();
    //var x = snd.playbackRate;
    //snd.playbackRate = .25;
    snd.currentTime = 0;
    snd.play();
  }


  drawBar( context, y  ) {

    var w = this.game.res_bar1.width;
    var x = Math.round ( (this.width / 2) - (w/2) );

    var w1 = Math.round( ( this.playerDamage/100) * w );
    var w2 = w - w1;

    context.drawImage( this.game.res_bar1, x, y );
    context.drawImage( this.game.res_bar2, w1, 0, w2, this.game.res_bar2.height, x+w1, y, w2, this.game.res_bar2.height );

  }



  render( context ) {

    context.drawImage(this.bg,0,0, this.width, this.height);

    var str, x;
    str = 'SCORE: ' + this.game.score;
    x=this.game.res_font2.centerX( str, this.width );
    this.game.res_font2.drawString( context, x, 10 , str );


    str = 'LEVEL: ' + this.lCounter + "    LIVES: " + this.game.lives;
    x=this.game.res_font2.centerX( str, this.width );
    this.game.res_font2.drawString( context, x, 35 , str );

    this.sprites.render( context );

    this.drawBar( context, this.height - 50 );

  }

  addSprite( id, x, y, dx, dy ) {

    var def = this.spriteTypes[ id ];

    var sprite = new Sprite( def.image, x, y );
    sprite.setType( def.type );
    sprite.setColliding( def.colliding );

    var animSpeed = null;
    if( def.anim != null ) {
      animSpeed = def.anim.speed;
    }

    sprite.setData( {
        animSpeed:animSpeed ,  health: def.health, size: def.size, next: def.next , score: def.score,
        subType1: def.subtype1, subType2: def.subtype2
      } );

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
