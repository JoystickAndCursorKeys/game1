class DemoTitleStates {

  constructor () {

    this.startState=     'titleGetResources';

    this.list= {
      titleGetResources:
      {
          active: false,
          methodPassive: 'titleGetResources',
          next: 'titleLoading'
      },
      titleLoading:
      {
          active: true,
          methodRender: 'titleLoadingRender',
          methodProcess: 'titleLoadingProcess',
          next: 'titleInit'
      },

      titleInit:
      {
          active: false,
          methodPassive: 'titleInit',
          next: 'titleRun'
      },

      titleRun:          {
        active: true ,
        methodRender: 'titleRunRender',
        methodEvents: 'titleRunHandle',
        methodProcess: 'titleRunProcess',
        next: 'titleEnd'
      },

      titleEnd:          {
        active: false,
        methodPassive: 'titleGetEndAction'
      }
    }
  }
}
