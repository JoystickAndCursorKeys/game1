class DemoLoader {

  constructor ( demo, colRes, colResHires  ) {
    this.main = demo;
    this.data = [];

    this.collisBoxRes = colRes;
    this.collisBoxResHiRes = colResHires;
  }


  /* Resources */
  gameGetResources() {

    var pictureURLs = [];
    var audioURLs = [];
    var id;

    id = 'res_sprite';
    pictureURLs[ id ] = 'flagman.png';
    this.data[ id ] = { type: 'img',  bg: null };

    id = 'res_ball';
    pictureURLs[ id ] = 'ball.png';
    this.data[ id ] = { type: 'img',  bg: null };

    id = 'res_ballhires';
    pictureURLs[ id ] = 'ball.png';
    this.data[ id ] = { type: 'imghires',  bg: null };

    return {  imgSrcArray: pictureURLs, audioSrcArray: audioURLs } ;


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

          this.main[id] = new SpriteAnim( pic , rd.w, rd.h, rd.bg,
              this.collisBoxRes
            );
        }
        else if( rd.type == 'img' ) {

          this.main[id]   = new SpriteImage( pic , rd.bg,
              this.collisBoxRes );
        }
        else if( rd.type == 'imghires' ) {

          this.main[id]   = new SpriteImage( pic , rd.bg,
              this.collisBoxResHiRes );
        }
        else if( rd.type == 'font' ) {

          this.main[id]   = new BlockFont(
              pic,
              rd.w, rd.h, rd.bg
            );
        }
        else if( rd.type == 'raw' ) {

          this.main[id]   = pic;
        }
    }
  }

  signalResourcesLoaded( loadedResources, currentState ) {

    var imgarr = loadedResources.imgArray;
    this.handleDynamicLoadedResources(  loadedResources );

  }


}
