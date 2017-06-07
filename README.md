# Devapt - Developpers Tools Application

Current version: 1.0.0
Please see the develop branch for current development.



## What is it?

Developpers Tools application helps you to develop applications using devapt features and provides:
* logs viewer
* buses messages spy
* metrics monitoring
* runtime settings display
* physical and logical topology display
* more: coming soon



## USAGE
Get package source:
```
mkdir devapt-app-devtools
cd devapt-app-devtools
git init
git remote add origin https://github.com/lucbories/devapt-app-devtools.git
git pull origin master
```


Edit "start_node.cmd" and remove "OPENSHIFT_BINDINGS" variable if needed.


Get dependencies packages and run application:
```
cd devapt-app-devtools
npm install
npm start
```

An express server is now listening on port 8081 by default.
Connect to http://mydomain/devtools/ on a browser.

Navigate into menus:
* Runtime: server application settings and state
  * All settings
* Monitor
  * Logical Topology
  * Physical Topology
  * Logs
  * Messages
  * Metrics
* State: browser application state (coming soon)
* API (coming soon)
* Crud (coming soon)



## LICENCE

See [LICENSE](https://github.com/lucbories/devapt-app-devtools/tree/master/LICENSE)



## BUGS

See [ISSUES](https://github.com/lucbories/devapt-app-devtools/issues)



## Technical details

devapt-app-devtools use devapt and devapt-devtools packages.



## Installation


Please see the file called INSTALL.md.


## Contacts

To subscribe to news or report a bug or contribute to the project, use the project website at https://github.com/lucbories/devapt-app-devtools.
