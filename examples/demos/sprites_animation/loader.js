class DemoLoader {

  constructor ( demo ) {
    this.main = demo;
    this.data = [];

  }


  /* Resources */
  gameGetResources() {

    var pictureURLs = [];
    var audioURLs = [];
    var id;

    id = 'res_sprite';
    pictureURLs[ id ] = 'coin2.png';
    this.data[ id ] = { type: 'anim',  w:20, h:20, bg: {r:0, g:0, b:0} };

    return {  imgSrcArray: pictureURLs, audioSrcArray: audioURLs } ;


  }


  handleDynamicLoadedResources( loadedResources ) {
    var imgarr = loadedResources.imgArray;

    var pic;
    var rd;

    for (const id in imgarr) {

        pic = imgarr[ id ];
        rd = this.data[ id ];

        if( rd.type == 'anim' ) {

          this.main[id] = new SpriteAnim( pic , rd.w, rd.h, rd.bg,
              undefined
            );
        }
        else if( rd.type == 'img' ) {

          this.main[id]   = new SpriteImage( pic , rd.bg,
              undefined );
        }
    }
  }

  signalResourcesLoaded( loadedResources, currentState ) {

    var imgarr = loadedResources.imgArray;
    this.handleDynamicLoadedResources(  loadedResources );

  }


}
