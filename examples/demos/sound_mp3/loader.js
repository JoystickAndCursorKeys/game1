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

    id = 'res_knock';
    audioURLs[ id ] = 'knock.mp3';

    return {  imgSrcArray: pictureURLs, audioSrcArray: audioURLs } ;


  }


  signalResourcesLoaded( loadedResources, currentState ) {

    var imgarr = loadedResources.imgArray;

    /* Set the result in the classObject of the main program */
    this.main.audio = loadedResources.audioArray['res_knock'];

  }


}
