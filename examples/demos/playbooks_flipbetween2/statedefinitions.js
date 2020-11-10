class StateDefinitions {

  constructor ( title, demo ) {

    this.startPlaybook = "title";

    /* -----------------------------------------------------
      Playbooks
       ----------------------------------------------------- */

    this.playbooks = {
        title: { object: title, enter: 'main', definition: this },
        demo: { object: demo, enter: 'load', definition: this },
    };

    /* -----------------------------------------------------
      Global state setup
       ----------------------------------------------------- */

    this.stateTypes = {
      LOADSILENT:   ['LOAD'],
      PLAY:         ['INIT','CLEANUP','RENDER','PROCESS','HANDLEINPUT'],
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
    var book;
    book = this.playbooks.title;
    book.states = {
		    /* Only load, play and repeat since this is a demo, not a game */
        'main':    { _type: "PLAY", goNext: { playBook: 'demo' } },
      } ;

    book = this.playbooks.demo;
    book.states = {
		    /* Load, playslow and playquick and repeat since this is a demo, not a game */
        'load':    { _type: "LOADSILENT",  next: 'playSlow'},
        'playSlow':    { _type: "PLAY", goFast: 'playFast' },
        'playFast':    { _type: "PLAY", goEnd: { playBook: 'title' } },
      } ;

  }
}
