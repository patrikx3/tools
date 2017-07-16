[//]: #@corifeus-header

  [![Build Status](https://travis-ci.org/patrikx3/tools.svg?branch=master)](https://travis-ci.org/patrikx3/tools)  [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/patrikx3/tools/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/tools/?branch=master)  [![Code Coverage](https://scrutinizer-ci.com/g/patrikx3/tools/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/tools/?branch=master) 

  
[![NPM](https://nodei.co/npm/p3x-tools.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/p3x-tools/)
---

 
# Tools

This is an open source project. Just code.

### Node Version Requirement 
``` 
>=7.8.0 
```  
   
### Built on Node 
``` 
v8.1.4
```   
   
The ```async``` and ```await``` keywords are required.

Install NodeJs:    
https://nodejs.org/en/download/package-manager/    

# Description  

                        
[//]: #@corifeus-header:end

This is an internal tool program (```p3x```) to manage a recursive async and serial command for NPM packages.  

# Examples

All folders exclude ```node_modules``` and ```bower_components``` except it is included.

```bash
p3x docker clean # delete images the have exited
p3x docker clear # delete all images in docker
p3x pkg yarn install | <command> # installs recursive every project that has a package.json
p3x build yarn install  | <command>  # install recursive every package that has a corifeus-builder
p3x npm unpublish # unpublish every package from NPM except the last Minor version (Major.Minor.Build-Commit)
p3x link # links every recursive given package together
p3x git <command> # you can execute a command on every git dir, recursive
p3x rm <folder> # remove recursive the given folder
p3x ncu -a # updates recursive all packages
p3x git pull # recursive pull every folder
p3x git push # recursive push every folder
```

If you want the commands is serials, add the ```-s``` or ```--serial``` flag, otherwise all ```async```.

etc ...


# Default excludes for CDN:
http://cdn.corifeus.com/git/corifeus-app-web-pages/src/json/settings.json

http://cdn.corifeus.com/git/tools/src/command/github.js

# Github fork upstream

1. Clone your fork:

```bash
git clone git@github.com:YOUR-USERNAME/YOUR-FORKED-REPO.git
```

1. Add remote from original repository in your forked repository: 

```bash
cd into/cloned/fork-repo  
git remote add upstream git://github.com/ORIGINAL-DEV-USERNAME/REPO-YOU-FORKED-FROM.git  
git fetch upstream  
```

1. Updating your fork from original repo to keep up with their changes:

```bash
git pull upstream master
```
    
    
[//]: #@corifeus-footer

---

[**P3X-TOOLS**](https://pages.corifeus.com/tools) Build v1.1.114-62

[Corifeus](http://www.corifeus.com) by [Patrik Laszlo](http://patrikx3.com)

[//]: #@corifeus-footer:end
