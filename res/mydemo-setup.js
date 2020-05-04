
var mydemoSetup = {
  startChapter: "title",
  chapters: {
    title: new DemoTitle(),
    level: new DemoGameLoop()
  }
};


/*
gameInit:     {  next: [ "gameLoading" ],       worker: new DemoGameLoop(), methodSuffic: true },
gameLoading:  {  next: [ "gameLoaded" ],        worker: new DemoGameLoop(), methodSuffic: true },
gameLoaded:   {  next: [ "gameLoaded" ],        worker: new DemoGameLoop(), methodSuffic: true },
levelInit:    {  next: [ "levelLoading" ],      worker: new DemoGameLoop(), methodSuffic: true },
levelLoading: {  next: [ "levelRun" ],          worker: new DemoGameLoop(), methodSuffic: true },
levelRun:     {  next: [ "levelEnd" ],          worker: new DemoGameLoop(), methodSuffic: true },
levelEnd:     {  next: [ "hiscores", "title" ], worker: new DemoGameLoop(), methodSuffic: true },
*/
