class StateDefinitions {

  constructor ( demo ) {

    this.startPlaybook = "demo";

    /* -----------------------------------------------------
      Playbooks
       ----------------------------------------------------- */

    this.playbooks = {
        demo: { object: demo, enter: 'load', definition: this },
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
      Demo playbook
       ----------------------------------------------------- */

	/* no branch functions */

	/* demo playbook */
    var demoPlaybook = this.playbooks.demo;
    demoPlaybook.states = {
		
		/* Only load, play and repeat since this is a demo, not a game */
		
        'load':    { _type: "LOADSILENT",  next: 'play'},
        'play':    { _type: "PLAY", next: 'play' },
		
		
      } ;
  }
}
