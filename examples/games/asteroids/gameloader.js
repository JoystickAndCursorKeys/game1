class GameLoader {

  constructor ( game, level ) {
    this.game = game;
    this.level = level;
    this.data = [];


    this.collisBoxRes = {
      xGranularity: 8,
      yGranularity: 8
    }
  }


  /* Resources */

  gameGetResources() {

    var pictures = [];
    var id;

    var asteroidSets = ["rnd" ,"flt","blood", "strange"];
    var bgCols = [];
    bgCols['rnd'] = {r:0, g:192, b:0};
    bgCols['flt'] = {r:0, g:198, b:0};
    bgCols['blood'] = {r:191, g:0, b:0};
    bgCols['strange'] = {r:191, g:0, b:0};

    for( var i=0; i<asteroidSets.length; i++ ) {
      var rockID = asteroidSets[ i ];

      var bgColor = bgCols[ rockID ];

      id = 'res_rock_' + rockID + '_100';
      pictures[ id ]= 'res/img/anim/rock.'+rockID+'.100.png';
      this.data[ id ]={  type: 'anim',   w:100, h:100, bg: bgColor };

      id = 'res_rock_' + rockID + '_50';
      pictures[ id ]= 'res/img/anim/rock.'+rockID+'.50.png';
      this.data[ id ]={ type: 'anim',  w:50, h:50, bg: bgColor };

      id = 'res_rock_' + rockID + '_25';
      pictures[ id ]= 'res/img/anim/rock.'+rockID+'.25.png';
      this.data[ id ]={ type: 'anim',  w:25, h:25, bg: bgColor };


    }


    id = 'res_coin';
    pictures[ id ]= 'res/img/anim/coin.png';
    this.data[ id ]={ type: 'anim', w:20, h:20, bg:{r:255, g:0, b:255} };

    id = 'res_debris1';
    pictures[ id ]= 'res/img/anim/debris25.png';
    this.data[ id ]={ type: 'anim', w:10, h:10, bg:{r:255, g:0, b:255} };

    id = 'res_ship';
    pictures[ id ]= 'res/img/anim/ship.png';
    this.data[ id ]={ type: 'anim',  w:50, h:50, bg:{r:0, g:255, b:255} };

    id='res_boom';
    pictures[id]= 'res/img/flare-red.png';
    this.data[ id ]={ type: 'img',  bg: null };

    id='res_scatter';
    pictures[id]= 'res/img/scatterhuge.png';
    this.data[ id ]={ type: 'img',  bg:{r:0, g:0, b:0} };

    id='res_laser1';
    pictures[id]= 'res/img/laser_purple.png';
    this.data[ id ]={ type: 'img',  bg: { mode: 'lightness', factor: 3 } };

    id='res_thrust';
    pictures[id]= 'res/img/blink3.png';
    this.data[ id ]={ type: 'img',  bg: { mode: 'lightness', factor: 1 } };

    id='res_font1';
    pictures[id]= 'res/img/font/sunset_medium1_36x45.png';
    this.data[ id ]= { type: 'font',  w:36, h:45, bg: {r:0, g:0, b:0} };

    id='res_font2';
    pictures[id]= 'res/img/font/neon1_small_15x15.png';
    this.data[ id ]={ type: 'font',  w:15, h:15, bg: {r:0, g:0, b:0} };

    id='res_font3';
    pictures[id]= 'res/img/font/greendawn_medium1_36x45.png';
    this.data[ id ]={ type: 'font',  w:36, h:45, bg: {r:0, g:0, b:0} };

    id='res_bar1';
    pictures[id]= 'res/img/bar1.jpg';
    this.data[ id ]={ type: 'raw' };

    id='res_bar2';
    pictures[id]= 'res/img/bar2.jpg';
    this.data[ id ]={ type: 'raw' };

    var audio = [];
    audio['laser'] = 'res/sfx/laser.mp3';
    audio['hit'] = 'res/sfx/explosion_small.wav';
    audio['destroy'] = 'res/sfx/explosion_big.wav';
    audio['collide'] = 'res/sfx/collision.wav';
    audio['die'] = 'res/sfx/die.wav';
    audio['money'] = 'res/sfx/money.wav';

    return {  imgSrcArray: pictures, audioSrcArray: audio } ;


  }

  levelGetResources() {
    var pictures = [];
    pictures['bg1.level']= "res/img/bg/bg1.png";
    pictures['bg2.level']= "res/img/bg/bg2.png";
    pictures['bg3.level']= "res/img/bg/bg3.png";
    pictures['bg4.level']= "res/img/bg/bg4.png";

    return { imgSrcArray: pictures };
  }

  handleDynamicLoadedResources( loadedResources ) {
    var imgarr = loadedResources.imgArray;

    var pic;
    var rd;

    for (const id in imgarr) {
        console.log(`imgArray::${id}: ${imgarr[id]}`);


        pic = imgarr[ id ];
        rd = this.data[ id ];

        if( rd.type == 'anim' ) {

          this.game[id] = new SpriteAnim( pic , rd.w, rd.h, rd.bg,
              this.collisBoxRes
            );
        }
        else if( rd.type == 'img' ) {

          this.game[id]   = new SpriteImage( pic , rd.bg,
              this.collisBoxRes );
        }
        else if( rd.type == 'font' ) {

          this.game[id]   = new BlockFont(
              pic,
              rd.w, rd.h, rd.bg
            );
        }
        else if( rd.type == 'raw' ) {

          this.game[id]   = pic;
        }
    }
  }

  signalResourcesLoaded( loadedResources, stateName  ) {
    console.log( "game/level loaded now state:" + stateName);

    var imgarr = loadedResources.imgArray;

    if( stateName == 'load' ) {

      this.handleDynamicLoadedResources(  loadedResources );

      this.game.audioLaser = loadedResources.audioArray['laser'];
      this.game.audioHit = loadedResources.audioArray['hit'];
      this.game.audioDestroy = loadedResources.audioArray['destroy'];
      this.game.audioCollide = loadedResources.audioArray['collide'];
      this.game.audioDie = loadedResources.audioArray['die'];
      this.game.audioMoney = loadedResources.audioArray['money'];

    }
    if( stateName == 'loadLevel' ) {
      this.level.bg1  = loadedResources.imgArray['bg1.level'];
      this.level.bg2  = loadedResources.imgArray['bg2.level'];
      this.level.bg3  = loadedResources.imgArray['bg3.level'];
      this.level.bg4  = loadedResources.imgArray['bg4.level'];

    }
  }


}
