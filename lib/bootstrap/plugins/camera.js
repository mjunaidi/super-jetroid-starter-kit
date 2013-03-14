﻿ig.module(
    'bootstrap.plugins.camera'
)
    .requires(
    'impact.game',
    'impact.image'
)

    .defines(function () {

        ig.Game.inject({
            cameraFollow:null,
            lightOffset:{ x:0, y:0 },
            quakeTimer: new ig.Timer(),
            duration: 1,
            loadLevel:function (data) {
                this.parent(data);
                //TODO this is hardcoded
                this.mainMap = ig.game.getMapByName("main");
                var tileSize = this.mainMap.tilesize;
                this.screenBoundary = {
                    min:{ x:0, y:-tileSize * .5 },
                    max:{ x:(this.mainMap.width * tileSize) - ig.system.width, y:(this.mainMap.height * tileSize) - (tileSize) - ig.system.height }
                };

            },
            update:function () {

                // Update all entities and backgroundMaps
                this.parent();

                if (this.cameraFollow) {

                    this.screen.x = this.cameraFollow.pos.x - (ig.system.width * .5) + this.cameraFollow.size.x * .5;
                    this.screen.y = this.cameraFollow.pos.y - (ig.system.height * .5) - this.screenBoundary.min.y + this.cameraYOffset - 100;

                    if (this.screen.x < this.screenBoundary.min.x)
                        this.screen.x = this.screenBoundary.min.x;
                    else if (this.screen.x > this.screenBoundary.max.x)
                        this.screen.x = this.screenBoundary.max.x;
                    if (this.screen.y < 0)
                        this.screen.y = 0;

                    //TODO make sure this is good here
                    if (this.lightMask) {
                        this.lightOffset.x = (this.cameraFollow.pos.x - this.screen.x) - this.lightMask.width * .5;
                        this.lightOffset.y = (this.cameraFollow.pos.y - this.screen.y) - this.lightMask.height * .5;
                    }
                }

                if (!this.paused) {
                    // Handle screen shake
                    var delta = this.quakeTimer.delta();
                    
                    if (delta < -0.1) {
                        this.quakeRunning = true;
                        var s = this.strength * Math.pow(-delta / this.duration, 2);
                        if (s > 0.5) {
                            ig.game.screen.x += Math.random().map(0, 1, -s, s);
                            ig.game.screen.y += Math.random().map(0, 1, -s, s);
                        }
                    } else {
                        this.quakeRunning = false;
                    }
                }
            },
            draw:function () {
                this.parent();

                if (this.cameraFollow) {
                    // Draw light mask
                    if (this.lightMask)
                        this.lightMask.draw(this.lightOffset.x, this.lightOffset.y);
                }

            },
            shake: function (duration, strength, ignoreShakeLock) {

                this.duration = duration ? duration : 1;
                this.strength = strength ? strength : 3;

                if (!ignoreShakeLock && this.quakeRunning) {
                    return;
                }
                //this.enterSFX.play();
                this.quakeTimer.set(this.duration);
            }

        })

    });