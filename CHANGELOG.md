
# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased]

## [0.14.0] - 2018-04-17
### Changed
- Joystick input converted to chasing of the pointer.
- Respawn at pointer location.
- Crosshair cursor.
- General refactoring (encapsulation, arrow functions).

## [0.13.0] - 2017-05-10
### Added
- Simple background texture: Grid or dots.
- Player blob affected by friction.

### Changed
- Player has slightly higher maximum velocity than drone blobs to make game more enjoyable.
- Refactored to p5 instance mode, to be able to have several sketches running independently on webpage.
- Using javascript standard libs like Math when possible.

## [0.12.0] - 2016-12-21
### Added
- Respawns on tap when on touch device.

### Changed
- Stopped tracking concatenated js. Deployment is handled by git hooks post-commit and post-merge.
- Different respawn messages on touch and desktop.
- Any key respawns when dead.

## [0.11.0] - 2016-12-20
### Added
- Make input work for touch.

## [0.10.0] - 2016-12-20
### Added
- Make input work for touch.

## [0.9.0] - 2016-12-20
### Added
- Concatenated version of sketch js files.
- Index file for concat version.

### Changed
- File structure refactoring.

## [0.8.0] - 2016-12-20
### Added
- Respawn drones outside screen.

### Changed
- Smaller initial blobs.
- Player blob slightly bigger than most drone initial size.
- Larger span of initial drone sizes.
- Generate random vectors with perlin noise instead of UP/DOWN/LEFT/RIGHT.
- Refresh on resize.

## [0.7.0] - 2016-12-19
### Added
- Smoothfollow camera.
- Camera chasing faster with distance.
- Drawing gameboard edges.
- Area outside gameboard filled.
- Respawn player on space key down.
- Respawning on site of demise rather than in center of gameboard.
- Replace dead blobs.
- Constants class.
- Show respawn popup on demise.

## [0.6.0] - 2016-12-19
### Added
- Gameboard larger than window.
- Camera follows player blob.

### Changed
- Joystick revamped.

## [0.5.0] - 2016-12-19
### Added
- Visual joystick handling directional input on mouse down.

### Changed
- Input system refactoring.s
- Player blob and joystick more visually distinct.


## [0.4.0] - 2016-12-18
### Added
- Blobs affected by mass. Larger ones appear more sluggish.
- Manual input through arrow keys.
- Player blob.
- Erasing dead blobs from memory.
- Simple FIFO queue implemention.

## [0.3.0] - 2016-12-18
### Added
- Loosely coupled input module functionality.
- Random direction input module.

## [0.2.0] - 2016-12-18
### Added
- Blobs roam with random velocity and color, the larger eating the smaller on collision.
- Centering sketch in window with css.
- Eaten blobs are declared dead and are no longer updated or displayed.

## [0.1.0] - 2016-12-18
### Added
- Basic setup: Node, Gulp, Livereload, gitignore, Readme, Changelog.
