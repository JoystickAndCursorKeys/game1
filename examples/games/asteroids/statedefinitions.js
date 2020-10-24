class StateDefinitions {

  constructor ( gameLoop, gameTitle ) {

    this.startPlaybook = "title";

    /* -----------------------------------------------------
      Playbooks
       ----------------------------------------------------- */

    this.playbooks = {
        title: { object: gameTitle, enter: 'load', definition: this },
        game:  { object: gameLoop,  enter: 'load',  definition: this  }
    };

    /* -----------------------------------------------------
      Global state setup
       ----------------------------------------------------- */

    this.stateTypes = {
      LOADSILENT:   ['LOAD'],
      PLAY:         ['INIT','CLEANUP','RENDER','PROCESS','HANDLEINPUT'],
      WATCH:        ['INIT','CLEANUP','RENDER','PROCESS'],
      INIT:         ['INIT'],
      BRANCH:       ['BRANCH']
    };

    this.stateMethodSuffix = {
      LSRENDER:     undefined,
      LSPROCESS:    undefined,
      RENDER:       'Render',
      PROCESS:      'Run',
      HANDLEINPUT:  'Handle'
    };

    /* -----------------------------------------------------
      Game playbook
       ----------------------------------------------------- */


     var game_looseLive_branchFunction =
       function ( playbookObject ) {

           if( playbookObject.lives <= 0) {

             playbookObject.lastScore = playbookObject.score;
             return 'goEndGame';
           }

           playbookObject.lives = playbookObject.lives - 1;

           //playbookObject.level.initPlayerExplosion();
           return 'continue';
         };

     var game_calculateHighScore_branchFunction =
       function ( playbookObject ) {
           //TODO, go through array, see if higher then lowest

           return 'goTitle';
         };

     var game_increaseLevel_branchFunction =
       function ( playbookObject ) {
         if( playbookObject.level.lCounter >= playbookObject.level.lMax ) {
           return 'goFinishedGame';
         }

         playbookObject.level.lCounter++;

         return 'goNextlevel';
         };


    var gamePlaybook = this.playbooks.game;
    gamePlaybook.states = {
        'load':                 { _type: "LOADSILENT",  next: 'loadLevel'},
        'loadLevel':                 { _type: "LOADSILENT",  next: 'level.init'},

        'finishScene':          { _type: "WATCH", next: 'enterHighscore'},
        'gameOverScene':          { _type: "WATCH", next: 'calculateHighScore'},

        'looseLive':          { _type: "BRANCH",
                                continue: 'level.playerInit',    goEndGame: { playBook: 'title' },
                                _branchFunction: game_looseLive_branchFunction } ,

        'calculateHighScore': { _type: "BRANCH",
                                goHiscore: 'inputHighscore',  goTitle: { playBook: 'title' },
                                _branchFunction: game_calculateHighScore_branchFunction } ,
        'increaseLevel':      { _type: "BRANCH",
                                goNextlevel: 'level.init',    goFinishedGame: 'gameCompletedScene',
                                _branchFunction: game_increaseLevel_branchFunction } ,

        'level.play':            { _type: "PLAY", goAbort: 'quitYN',       playerDies: 'level.dieScene',  levelcompleted: 'level.completedScene' },
        'level.load':            { _type: "LOADSILENT",  next: 'play'},
//        'level.initPlayer':      { _type: "INIT",  next: 'level.play'},
        'level.init':            { _type: "INIT",  next: 'level.playerInit'},
        'level.playerInit':      { _type: "INIT",  next: 'level.startScene'},
        'level.startScene':      { _type: "WATCH", next: 'level.play'},
        'level.completedScene':  { _type: "PLAY", next: 'increaseLevel' },
        'level.dieScene':        { _type: "WATCH", next: 'looseLive'},

        //'level.play':                 { _type: "PLAY", goAbort: 'quitYN',             playerDies: 'level.dieScene',  goLevelcompleted: 'levelCompletedScene' },
        //'paused':               { _type: "PLAY", continue: 'play' },
        //'inputHighscore':       { _type: "PLAY", goTitle: { playBook: 'title' } },
        //'quitYN':               { _type: "PLAY", continue: 'play',              goTitle: { playBook: 'title' } }
      } ;




      /* -----------------------------------------------------
        Title playbook
         ----------------------------------------------------- */
      var titlePlaybook = this.playbooks.title;
      titlePlaybook.states = {
          'load' :   { _type: "LOADSILENT", next: 'menu'},
          'menu'  :   { _type: "PLAY", next: { playBook: 'game' } }
      };
  }
}
