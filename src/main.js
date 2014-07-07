define(function(require, exports, module) {
    // Requires
    var Engine     = require('famous/core/Engine');
    var Surface    = require('famous/core/Surface');
    var Modifier   = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var RenderNode = require('famous/core/RenderNode');
    var KeyCodes   = require('famous/utilities/KeyCodes');
    var ScrollSync = require('famous/inputs/ScrollSync');

    // Main Context
    var mainContext = Engine.createContext();
    var mainX = 0;
    var mainY = 0;
    var mainZ = 0;
    var mainScroll = new ScrollSync();

    mainContext.setPerspective(1000);

    var nodeOfSquares = new RenderNode();

    var translationModifier = new Modifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      transform: Transform.translate(mainX, mainY, mainZ)
    });

    // Individuals
    var square = new Surface({
      size: [300, 300],
      classes: ['double-sided'],
      content: 'Hello Famo.us',
      properties: {
        fontSize: '40px',
        lineHeight: '300px',
        textAlign: 'center'
      }
    });
    nodeOfSquares.add(square);

    // Main controls -- translation
    Engine.on('keypress', function(keyPressed) {
      // W = 119, A = 97, S = 115, D = 100
      // console.log(keyPressed.charCode);
      if(keyPressed.charCode === 96) {
        // console.log("TILDA");
        Engine.pipe(mainScroll);
        mainScroll.on('update', function(data) {
            console.log(data.delta)
            if(data.delta[1] > 0) {
                mainZ+=data.delta[1]/10
                translationModifier.setTransform(function() {
                        return Transform.translate(mainX, mainY, mainZ);
                });
            } else if(data.delta[1] < 0) {
                mainZ+=data.delta[1]/10
                translationModifier.setTransform(function() {
                        return Transform.translate(mainX, mainY, mainZ);
                });
            } else {
                translationModifier.setTransform(function() {
                        return Transform.translate(mainX, mainY, mainZ);
                });
            }
            if(data.delta[0] > 0) {
                mainX+=data.delta[0]/50
                translationModifier.setTransform(function() {
                    return Transform.translate(mainX, mainY, mainZ);
                });
            } else if(data.delta[0] < 0) {
                mainX+=data.delta[0]/50
                translationModifier.setTransform(function() {
                    return Transform.translate(mainX, mainY, mainZ);
                });
            } else {
                translationModifier.setTransform(function() {
                    return Transform.translate(mainX, mainY, mainZ);
                });
            }
            Engine.unpipe(mainScroll);
        });
      }
    });




    mainContext.add(translationModifier).add(nodeOfSquares);

});
