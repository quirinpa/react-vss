#!/bin/sh
test -z "$PREF" && PREF=../../apps
test -z "$APP" && APP=ide
npm link ../scripts ../sub $PREF/$APP/node_modules/react

