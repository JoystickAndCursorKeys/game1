class DemoGameLoopStates {

  constructor () {

    this.startState=     'gameGetResources';

    this.list= {
      gameGetResources:
      {
          active: false,
          methodPassive: 'gameGetResources',
          next: 'gameLoading'
      },
      gameLoading:
      {
          active: true,
          methodRender: 'gameLoadingRender',
          methodProcess: 'gameLoadingProcess',
          next: 'gameInit'
      },

      gameInit:
      {
          active: false,
          methodPassive: 'gameInit',
          next: 'levelGetResources'
      },

      levelGetResources: {
        active: false,
        methodPassive: 'levelGetResources',
        next: 'levelLoading'
      },

      levelLoading:      {
        active: true ,
        methodRender: 'levelLoadingRender',
        methodProcess: 'levelLoadingProcess',
        next: 'levelInit'
      },

      levelInit:      {
        active: false,
        methodPassive: 'levelInit',
        next: 'levelRun'
      },

      levelRun:          {
        active: true ,
        methodRender: 'levelRunRender',
        methodEvents: 'levelRunHandle',
        methodProcess: 'levelRunProcess',
        next: 'levelEnd'
      },

      levelEnd:          {
        active: false,
        methodPassive: 'levelGetEndAction'
      }
    }
  }
}
