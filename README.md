[//]: #@corifeus-header

[![Build Status](https://travis-ci.org/patrikx3/tools.svg?branch=master)](https://travis-ci.org/patrikx3/tools)  [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/patrikx3/tools/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/tools/?branch=master) [![Code Coverage](https://scrutinizer-ci.com/g/patrikx3/tools/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/tools/?branch=master)  [![Trello](https://img.shields.io/badge/Trello-p3x-026aa7.svg)](https://trello.com/b/gqKHzZGy/p3x)

  
[![NPM](https://nodei.co/npm/p3x-tools.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/p3x-tools/)
------

# NPM Tools

### Node Version Requirement 
``` >=7.8.0 ```  
   
The ```async``` and ```await``` keywords are required.

# Description


[//]: #@corifeus-header:end

## Install
```javascript
npm install -g p3x-tools
p3x-tools -h
p3x-tools forr -h 
p3x-tools rmdirr -h 
p3x-tools unpublish -h 
```

## Examples
```javascript
p3x-tools forr node_modules 'echo $FOUND; ls -all'

p3x-tools unpublish --dry --username patrixk3 --search corifeus,p3x 

p3x-tools rmdirr --dry node_modules  
```

**It is used for primarily Unix/BSD/Linux/OSX, using Bash.**

* Functions
  * NPM find (recursive)
  * NPM remove resursive delete directories
  * NPM unpublish packages (able to keep only the latest version by minor version)
    * Major.Minor.Commit-Build
      * So instead
        * 4.1.55-44
        * 4.1.54-33
        * 4.0.53-32
        * 4.0.52-30
        * 1.3.44-23
        * 1.3.40-20
        * 1.3.28-10
        * 1.3.22-9
        * 1.3.21-8
        * 1.2.20-7
        * 1.1.10-5
        * 1.0.9-5
      * Becomes
        * 4.1.55-44
        * 4.0.53-32
        * 1.3.44-23
        * 1.2.20-7
        * 1.1.10-5
        * 1.0.9-5

# Docs

## Unpublish

Version: ```Major.Minor.Commit-Build```

1. unpublish all, keep all last minor versions
1. corifeus - ```publish all```
1. p3x-systemd-manager - ```ncu -a, publish```
1. p3x-angular-compile - ```ncu -a, publish```
1. p3x-aes-folder - ```ncu -a, publish```
1. server-scripts - ```ncu -a```
1. linux-defaults - ```ncu -a```
1. corifeus - ```ncu -a```

[//]: #@corifeus-footer

---
[**P3X-TOOLS**](https://patrikx3.github.com/tools) Build v1.1.21-2 on 5/9/2017, 8:49:10 PM

by [Patrik Laszlo](http://patrikx3.tk) 

[//]: #@corifeus-footer:end
