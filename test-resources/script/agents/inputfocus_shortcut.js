class ShortCuts {

  constructor() {

  }


  getLocalizedKeys() {
    var shortCuts = [];
    shortCuts = [];

    shortCuts['SHIFT-Digit1'] = { 0: 'PAINT', 1: 'TRANSFORMBRUSH', data: { tf: "TRIM" } };

    return shortCuts;
  }

  getKeys() {

    var shortCuts = [];
    shortCuts = [];

    //shortCuts['SHIFT-t'] = { 0: 'PAINT', 1: 'TRANSFORMBRUSH', data: { tf: "TRIM" } };
    shortCuts['SHIFT-f'] = { 0: 'PAINT', 1: 'TRANSFORMBRUSH', data: { tf: "FEATHER" } };
    shortCuts['SHIFT-x'] = { 0: 'PAINT', 1: 'TRANSFORMBRUSH', data: { tf: "FLIPX" } };
    shortCuts['SHIFT-y'] = { 0: 'PAINT', 1: 'TRANSFORMBRUSH', data: { tf: "FLIPY" } };
    shortCuts['SHIFT-r'] = { 0: 'PAINT', 1: 'TRANSFORMBRUSH', data: { tf: "ROTATE90DEG" } };
    shortCuts['SHIFT-a'] = { 0: 'PAINT', 1: 'TRANSFORMBRUSH', data: { tf: "MAKETRANSPARENT" } };
    shortCuts['SHIFT-s'] = { 0: 'PAINT', 1: 'TRANSFORMBRUSH', data: { tf: "TRIMALFA" } };
    shortCuts['SHIFT-c'] = { 0: 'PAINT', 1: 'TRANSFORMBRUSH', data: { tf: "COLORIZE" } };

    shortCuts['SHIFT-o'] = { 0:'IMPORT', 1:'LOAD', destination: 'ImportExport' };
    shortCuts['SHIFT-l'] = { 0:'IMPORT', 1:'LOAD', destination: 'ImportExport' };
    shortCuts['SHIFT-s'] = { 0:'PAINT', 1:'EXPORTIMAGE', data: { transparency: "none" } };

    shortCuts['DELETE'] = [ 'PAINT', 'CLEAR' ];
    shortCuts['BACKSPACE'] = 	[ 'PAINT', 'UNDO' ];
    shortCuts['SHIFT-BACKSPACE'] = 	[ 'PAINT', 'REDO' ];
    shortCuts['u'] = 			 [ 'PAINT', 'UNDO' ];
    shortCuts['SHIFT-u'] = [ 'PAINT', 'REDO' ];
    shortCuts['CTRL-z'] =  [ 'PAINT', 'UNDO' ];
    shortCuts['CTRL-y'] =  [ 'PAINT', 'REDO' ];

    shortCuts['p'] = { 0:'PANEL', 1:'SHORTCUT', destination: 'Panels', data: { buttonId: "palette:edit"} };
    shortCuts['g'] = { 0:'PANEL', 1:'SHORTCUT', destination: 'Panels', data: { buttonId: "grab:brush"} };

    shortCuts['z'] =        { 0:'PANEL', 1:'SHORTCUT', destination: 'Panels', data: { buttonId: 'mode.draw:simple'} };
    shortCuts['x'] =      { 0:'PANEL', 1:'SHORTCUT', destination: 'Panels', data: { buttonId: 'mode.draw:solid'} };
    shortCuts['c'] =        { 0:'PANEL', 1:'SHORTCUT', destination: 'Panels', data: { buttonId: 'mode.draw:line'} };
    shortCuts['v'] =        { 0:'PANEL', 1:'SHORTCUT', destination: 'Panels', data: { buttonId: 'mode.draw:oval'} };
    shortCuts['b'] =        { 0:'PANEL', 1:'SHORTCUT', destination: 'Panels', data: { buttonId: 'mode.draw:rectangle'} };
    shortCuts['n'] =        { 0:'PANEL', 1:'SHORTCUT', destination: 'Panels', data: { buttonId: 'mode.draw:spray'} };

    return shortCuts;
  }
}
