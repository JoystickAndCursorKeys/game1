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
    var data = [];
    var id;

    id='res_boom';
    pictures[id]= 'res/img/flare-red.png';
    this.data[ id ]={ type: 'img',  bg: null };

    id='res_scatter';
    pictures[id]= 'res/img/scatterhuge.png';
    this.data[ id ]={ type: 'img',  bg:{r:0, g:0, b:0} };

    id='res_laser1';
    pictures[id]= 'res/img/laser_purple.png';
    this.data[ id ]={ type: 'img',  bg: { mode: 'lightness', factor: 3 } };

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

    id='res_tiles';
    pictures[id]= 'res/img/tiles.png';
    this.data[ id ]={ type: 'tiles', w: 24, h:24, bg: {r:56, g:24, b:48} };

    id='res_animsheet';
    pictures[id]= 'res/anim/bb.png';
    this.data[ id ]={ type: 'anim', w: 24, h:24, bg: {r:56, g:24, b:48} };

    //id='res_animdata';
    //data[id]= 'res/anim/bb.json';

    var audio = [];
    audio['laser'] = 'res/sfx/laser.mp3';
    audio['hit'] = 'res/sfx/explosion_small.wav';
    audio['destroy'] = 'res/sfx/explosion_big.wav';
    audio['collide'] = 'res/sfx/collision.wav';
    audio['die'] = 'res/sfx/die.wav';
    audio['money'] = 'res/sfx/money.wav';

    data['res_animdata'] = 'res/anim/bb.json';
    data['res_map1data'] = 'res/level/tmap1.json';


    return {  imgSrcArray: pictures, audioSrcArray: audio, dataSrcArray: data } ;


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
        else if( rd.type == 'tiles' ) {

          this.game[id]   = new Tiles(
              pic,
              rd.w, rd.h, rd.bg
            );
        }
        else if( rd.type == 'raw' ) {

          this.game[id]   = pic;
        }
    }
  }

  extractMazePos( map, charValue, list, clearValue ) {
    var value = list[charValue];
    var posArray = map.getTiles( value );
    map.replaceTiles( value, clearValue );
    return posArray[0];
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

      var txtmap = loadedResources.dataArray['res_map1data'].data.tiles;
      this.game.map1 = new Object();
      var map = this.game.map1;
      map.entities = new Array();
      map.tmap = new TileMap( 28, 20, 0);
      var list = new Array();
      list['#'] = 2;
      list['x'] = 9999;
      list['a'] = 10000;
      map.tmap.AppendTextMap( txtmap, ' ', list);

      //var posArray = this.game.map1.getTiles( 9999 );
      //this.game.map1playerpos = posArray[0];
      //this.game.map1.replaceTiles( 9999, 0 );

      map.posPlayer = this.extractMazePos(
        map.tmap,
        'x', list, 0 );

      map.entities.push(
        { id: "zomby", pos: this.extractMazePos( map.tmap, 'a', list, 0 ) } );

      var animData = loadedResources.dataArray['res_animdata'].data;
      animData.player.anim = this.normalizeAnimData( animData.player.anim, animData.rowLength );

      var arrayLength = animData.entities.length;
      for (var i = 0; i < arrayLength; i++) {
          var e = animData.entities[ i ];
          e.anim = this.normalizeAnimData( e.anim, animData.rowLength );
      }
      this.game.animData = animData;

    }
    if( stateName == 'loadLevel' ) {
      this.level.bg1  = loadedResources.imgArray['bg1.level'];
      this.level.bg2  = loadedResources.imgArray['bg2.level'];
      this.level.bg3  = loadedResources.imgArray['bg3.level'];
      this.level.bg4  = loadedResources.imgArray['bg4.level'];

    }
  }

  normalizeAnimData( ad, rowLen ) {

    var ad2 = new Object();
    ad2.l = this.normalizeAnimPos( ad.l, rowLen );
    ad2.r = this.normalizeAnimPos( ad.r, rowLen );
    ad2.u = this.normalizeAnimPos( ad.u, rowLen );
    ad2.d = this.normalizeAnimPos( ad.d, rowLen );

    return ad2;
  }

  normalizeAnimPos( ap, rowLen ) {
    var ap2Fro  = ap[0][1] + (ap[0][0] * rowLen);
    var ap2To   = ap[1][1] + (ap[1][0] * rowLen);

    return [ ap2Fro, ap2To ];
  }

}
