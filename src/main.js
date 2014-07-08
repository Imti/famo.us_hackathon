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
    var ImageSurface = require('famous/surfaces/ImageSurface');

    // Main Context
    var mainContext = Engine.createContext();
    var mainX = 0;
    var mainY = 0;
    var mainZ = 10;
    var mainScroll = new ScrollSync();

    mainContext.setPerspective(500);

    var nodeOfSquares = new RenderNode();
    var surfaces = [];

    var translationModifier = new Modifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      transform: Transform.translate(mainX, mainY, mainZ)
    });

    // Individuals
    var cohortFriend = ['imtiazmaj', 'adam.price.1257', 'albreyb', 'agugel', 
      'anthony.zavadil', 'Grimi94', 'austentalbot', 'dhfromkorea', 'forest.toney',
      'forrest.thomas.14', 'gjtrowbridge', 'jake.adams.777', 'jake.harclerode',
      'jyothers', 'jasen.lew', 'justin.cheung.543', 'kevin1liang', 'kia.fathi',
      'craftjk', 'larry.may', 'mason.hargrove.9', 'neiljlobo', 'praur',
      'roger.goldfinger', '584970081'];

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

    for(var i = 0; i < 300; i++) {
      var link = 'http://graph.facebook.com/' + cohortFriend[i%cohortFriend.length] + '/picture?type=large';
      squareModifier = new Modifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5],
        transform: Transform.translate(Math.random() * 20000 - 10000, Math.random() * 20000 - 10000, Math.random() * 20000 - 10000),
      });

      square = new ImageSurface({
        size: [300, 300],
        classes: ['double-sided'],
        content: link
      });

      surfaces.push({square: squareModifier})
      nodeOfSquares.add(squareModifier).add(square);
    }

    // Moving individual squares
    move()

    Timer.setInterval(function() {
      move()
    }, 5000)

    function move() {
      for(var i = 0; i < surfaces.length; i++) {
        tempPeriod = Math.random() * 25000;
        //console.log(tempPeriod);
        surfaces[i].square.setTransform(Transform.translate(Math.random() * 20000 - 10000, Math.random() * 20000 - 10000, Math.random() * 20000 - 10000), {duration: tempPeriod})
      }
    }

    Engine.pipe(squareScroll);

    // Switch controls when tilda lifted
    Engine.on('keyup', function() {
      console.log('keyup');
      Engine.unpipe(mainScroll);
      Engine.pipe(squareScroll);
    });

    // Rotation
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
      if(keyPressed.charCode === 96) {
        Engine.unpipe(squareScroll);
        Engine.pipe(mainScroll);
        mainScroll.on('update', function(data) {
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
