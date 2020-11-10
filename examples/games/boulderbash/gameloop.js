class GameLoop {

  constructor () {
    this.level = new GameLevel( this );
    this.loader = new GameLoader( this, this.level );
    this.lastScore = 0;
  }

  initPlayBook( properties ) {
    this.width =  properties.w;
    this.height = properties.h;
    return this.states;
  }

  // setup game ------------------------------------------------------
  load( action, data ) {

    if( action == 'GETURLS' ) {

      console.log( data.currentState + " - geturls" );

      data.urls = this.loader.gameGetResources();
      return;
    }
    else if( action == 'LOADED' ) {

      var loadedResources = data.resources;

      this.loader.signalResourcesLoaded(
        loadedResources,
        data.currentState );

        this.level.lMax = 10;
        this.level.lCounter = 0;
        this.score  = 0;
        this.lives = 3;


    }
  }

  // setup level ------------------------------------------------------
  loadLevel( action, data ) {
    if( action == 'GETURLS' ) {
      console.log( data.currentState + " - geturls" );

      data.urls = this.loader.levelGetResources();
    }
    else if( action == 'LOADED' ) {

      var loadedResources = data.resources;

      this.loader.signalResourcesLoaded( loadedResources, data.currentState );

      //this.level.init();

    }
  }

  preparePlayer( setupState, state, loadedResources ) {

    console.log("set up next life");
    this.level.preparePlayer();
    return null;

  }



  dieSceneRun() {

    if( this.level.ended() ) {
      return "next";
    }

    this.level.dieProcess();

    return false;

  }

  dieSceneStart() {
    this.level.dieInit()
  }


  dieSceneRender( context ) {
    this.level.render( context );
  }


  /* End Level */
  levelGetEndAction() {

    if( this.endType == 'die' ) {
      if( this.lives == 0 ) {
        this.lastScore = this.score;
        return { nextChapter: "title" };
      }
      else {
        return { next: "levelDie" };
      }
    }
    else if ( this.endType == 'interupted' ) {

      this.lastScore = this.score;
      return { nextChapter: "title" };

    }
    else if ( this.endType == 'completed' ) {

      var lvl = this.levelCount++;
      return { next: "levelCompleted" };

    }

    throw "unknown endType " + endType;

    //return { next: "levelGetResources" };
  }

}
