
# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased]

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