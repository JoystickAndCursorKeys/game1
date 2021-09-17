class DemoLoader {

  constructor ( demo ) {
    this.main = demo;
    this.layers = this.main.layers;

    this.data = [];

    this.magic = new SpriteImageMagic();


  }


  /* Resources */
  gameGetResources() {

    var pictureURLs = [];
    var audioURLs = [];
    var id, effectPercentage;

    id = 'res_sprite_';

    for( var i=0; i<this.layers; i++) {

      effectPercentage = 1- ( (i+1) / this.layers)

      pictureURLs[ id + i ] = 'flagman.png';

      this.data[ id + i ] = { type: 'img',
        postProcess: [
          { f:this.magic.scale, par: 1-(((1)-i)/this.layers) },
          { f:this.magic.colorize, par:
              {
                effect: effectPercentage,
                r: 0, g:0, b:128
              }
          }
        ]
      };
    }
    return {  imgSrcArray: pictureURLs, audioSrcArray: audioURLs } ;
  }


  signalResourcesLoaded( loadedResources, currentState ) {

    var imgarr = loadedResources.imgArray;
    var id;

    for( var i=0; i<this.layers; i++) {
      id = 'res_sprite_' + i;
      this.main[id]   = new SpriteImage( imgarr[ id ] , this.data[ id ].postProcess,
              undefined );
    }
  }

}
