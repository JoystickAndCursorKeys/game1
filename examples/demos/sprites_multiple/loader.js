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
    pictureURLs[ id ] = 'ball.png';
    this.data[ id ] = { type: 'img',  bg: null };

    return {  imgSrcArray: pictureURLs, audioSrcArray: audioURLs } ;
  }


  signalResourcesLoaded( loadedResources, currentState ) {

    var imgarr = loadedResources.imgArray;
    var id;

    id = 'res_sprite';
    this.main[id]   = new SpriteImage( imgarr[ id ] , null,
            undefined );

  }


}
