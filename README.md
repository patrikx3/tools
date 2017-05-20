[//]: #@corifeus-header

  [![Build Status](https://travis-ci.org/patrikx3/tools.svg?branch=master)](https://travis-ci.org/patrikx3/tools)  [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/patrikx3/tools/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/tools/?branch=master)  [![Code Coverage](https://scrutinizer-ci.com/g/patrikx3/tools/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/tools/?branch=master) 

  
[![NPM](https://nodei.co/npm/p3x-tools.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/p3x-tools/)
---

 
# Tools

## Issues / Support
This is an open source project. Time is a precious thing, so I have rarely time to give support and fix issues for someone else. I fix a bug, when I have an error that I need. If you got an issue, error or bug, I hope someone will have time to do it for you, otherwise, you are on your own.

Though, if I know the solution, I will tell you. Besides, core errors will be fixed by me.

***If you want to extend, fix bugs or add in new features, I promptly merge pull requests or you can become a ```patrikx3``` member.***

### Node Version Requirement 
``` 
>=7.8.0 
```  
   
### Built on Node 
``` 
v7.10.0
```   
   
The ```async``` and ```await``` keywords are required.

Install NodeJs:    
https://nodejs.org/en/download/package-manager/    
  
# Description  

                        
[//]: #@corifeus-header:end

## Install
```javascript
npm install -g p3x
p3x -h
p3x for -h 
p3x git -h 
p3x github -h 
p3x ncu -h 
p3x npm -h 
p3x rm -h 
```


## Examples
```javascript
p3x for node_modules 'echo $FOUND; ls -all'

p3x git each 'ls -all'

p3x npm unpublish --dry --username patrixk3 --search corifeus,p3x 

p3x rm --dry node_modules  
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
[**P3X-TOOLS**](https://patrikx3.github.com/tools) Build v1.1.53-83

[Corifeus](http://www.corifeus.tk) by [Patrik Laszlo](http://patrikx3.tk)


[//]: #@corifeus-footer:end
