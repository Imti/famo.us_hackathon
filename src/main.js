define(function(require, exports, module) {
    // Requires
    var Engine     = require('famous/core/Engine');
    var Surface    = require('famous/core/Surface');
    var Modifier   = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var RenderNode = require('famous/core/RenderNode');
    var KeyCodes   = require('famous/utilities/KeyCodes');
    var Timer      = require('famous/utilities/Timer');
    var ScrollSync = require('famous/inputs/ScrollSync');
    var Quaternion = require('famous/math/Quaternion');
    // var InfiniteScroll = require('famous-infinitescroll.js');
    var TransitionableTransform = require("famous/transitions/TransitionableTransform");

    // Main Context
    var mainContext = Engine.createContext();
    var mainX = 0;
    var mainY = 0;
    var mainZ = 10;
    var mainScroll = new ScrollSync();
    var transitionableTransform = new TransitionableTransform();

    mainContext.setPerspective(1000);

    var nodeOfSquares = new RenderNode();
    var surfaces = [];

    var translationModifier = new Modifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      transform: Transform.translate(mainX, mainY, mainZ)
    });

    // Individuals
    var squareScroll = new ScrollSync();
    var quaternion = new Quaternion(10, 0, 0, 0);
    var smallQuaternion = new Quaternion(10, 0, 0, 0);

    var rotationModifier = new Modifier({
      origin: [0, 0],
      align: [0, 0]
    });

    rotationModifier.setTransform(function() {
      return quaternion.getTransform();
    });

    Engine.on('prerender', function() {
      quaternion = quaternion.multiply(smallQuaternion);
    });

    var square = new Surface({
      size: [3000, 3000],
      classes: ['double-sided'],
      content: 'Hello Famo.us',
      properties: {
        fontSize: '400px',
        lineHeight: '3000px',
        textAlign: 'center'
      },
      transform: Transform.translate(0, 0, 0)
    });

    var squareModifier = new Modifier({
      origin: [Math.random() * 2 - 1, Math.random() * 2 - 1],
      align: [Math.random() * 2 - 1, Math.random() * 2 - 1],
      transform: Transform.translate(0, 0, 0)
    });

    for(var i = 0; i < 800; i++) {
      squareModifier = new Modifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5],
        transform: Transform.translate(Math.random() * 100000 - 50000, Math.random() * 100000 - 50000, Math.random() * 100000 - 50000),
      });

      square = new Surface({
        size: [100, 100],
        classes: ['double-sided'],
        content: 'Hello Famo.us',
        properties: {
          fontSize: '10px',
          lineHeight: '100px',
          textAlign: 'center'
        },
      });

      surfaces.push({square: squareModifier})
      nodeOfSquares.add(squareModifier).add(square);
    }

    var randomPeriod = function() {
      return Math.random() * 10000 - 1000;
    }
    Timer.setInterval(function() {
      for(var i = 0; i < surfaces.length; i++) {
        var tempPeriod = randomPeriod();
        console.log(tempPeriod);
        surfaces[i].square.setTransform(Transform.translate(Math.random() * 10000 - 5000, Math.random() * 10000 - 5000, Math.random() * 10000 - 5000), {duration: tempPeriod})
      }
    }, 1000)


    // nodeOfSquares.add(square);
    Engine.pipe(squareScroll);

    Engine.on('keyup', function() {
      console.log('keyup');
      Engine.unpipe(mainScroll);
      Engine.pipe(squareScroll);
    });

    squareScroll.on('update', function(data) {
      if(data.delta[0] < 0) {
        smallQuaternion.y += data.delta[0];
        if(smallQuaternion.y > 0) smallQuaternion.y = -50;
      }
      if(data.delta[0] > 0) {
        smallQuaternion.y += data.delta[0];
        if(smallQuaternion.y < 0) smallQuaternion.y = 50;
      }
      if(data.delta[1] < 0) {
        smallQuaternion.x += data.delta[1];
        if(smallQuaternion.x > 0) smallQuaternion.x = -50;
      }
      if(data.delta[1] > 0) {
        smallQuaternion.x += data.delta[1];
        if(smallQuaternion.x < 0) smallQuaternion.x = 50;
      }

      smallQuaternion.x = smallQuaternion.x/10;
      smallQuaternion.y = smallQuaternion.y/10;
    });

    squareScroll.on('end', function(data) {
      smallQuaternion.x = 0;
      smallQuaternion.y = 0;
    });



    // Main controls -- translation
    Engine.on('keypress', function(keyPressed) {
      // if(keyPressed.charCode = 119) {
      //   mainY+=100;
      //     translationModifier.setTransform(function() {
      //       return Transform.translate(mainX, mainY, mainZ);
      //   });
      // }
      // console.log('keypress')
      // W = 119, A = 97, S = 115, D = 100
      // console.log(keyPressed.charCode);
      if(keyPressed.charCode === 96) {
        // console.log("TILDA");
        Engine.unpipe(squareScroll);
        Engine.pipe(mainScroll);
        mainScroll.on('update', function(data) {
            // console.log(data.delta)
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
        });
      }
    });

    mainContext.add(translationModifier).add(rotationModifier).add(nodeOfSquares);

});
