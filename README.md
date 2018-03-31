[//]: #@corifeus-header

  [![Build Status](https://travis-ci.org/patrikx3/tools.svg?branch=master)](https://travis-ci.org/patrikx3/tools)  [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/patrikx3/tools/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/tools/?branch=master)  [![Code Coverage](https://scrutinizer-ci.com/g/patrikx3/tools/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/tools/?branch=master) 

  
[![NPM](https://nodei.co/npm/p3x-tools.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/p3x-tools/)
---

 
# Tools v1.3.205-396  

This is an open-source project. Star this repository if you like it, or even donate!  Thank you so much! :)

I run my own server with dynamic IP address so it may happen that the server can not be reachable for about max 5 minutes due to the dynamic DNS. The server may also be unreachable when I backup the SSD with Clonzilla (very rarely) or an electrical issue (but this should not happen again). When the server is down, please hang on for 5-30 minutes and the server will be back up.

All my domains (patrikx3.com and corifeus.com) could have errors since I am developing in my free time. However, it is usually stable.


### Node Version Requirement 
``` 
>=8.9.0 
```  
   
### Built on Node 
``` 
v9.10.1
```   
   
The ```async``` and ```await``` keywords are required.

Install NodeJs:    
https://nodejs.org/en/download/package-manager/    



# Description  

                        
[//]: #@corifeus-header:end


This is an internal tool program (```p3x```) to manage a recursive async and serial command for NPM packages.  


# Install

```bash
sudo npm install -g p3x-tools --unsafe-perm=true --allow-root
```


# Examples

All folders exclude ```node_modules``` and ```bower_components``` except it is included.

```bash
p3x docker clean # delete images the have exited
p3x docker clear # delete all images in docker
p3x docker free # delete exited containers
p3x pkg yarn install | <command> # installs recursive every project that has a package.json
p3x build yarn install  | <command>  # install recursive every package that has a corifeus-builder
p3x npm unpublish # unpublish every package from NPM except the last Minor version (Major.Minor.Build-Commit)
p3x link # links every recursive given package together
p3x git <command> # you can execute a command on every git dir, recursive
p3x rm <folder> # remove recursive the given folder
p3x ncu -a # updates recursive all packages
p3x git pull # recursive pull every folder
p3x git push # recursive push every folder
p3x git renew|truncate # remote all commits, from #1231 commit to #1
p3x git init repo-name # .git is not required, is auto added, post-update is generated so it is my own, specific for the patrikx3.com server git repo (it adds in the webhook), the names are only lower cased forcefully a-z, digit and dash.
```

and more ...

If you want the commands is serials, add the ```-s``` or ```--serial``` flag, otherwise all ```async```.

etc ...

# Dependencies Fix
http://cdn.corifeus.com/git/tools/dependencies-fix.json

# Default excludes from GitHub:
http://cdn.corifeus.com/git/tools/github.json

# Github fork upstream

1 . Clone your fork:

```bash
git clone git@github.com:YOUR-USERNAME/YOUR-FORKED-REPO.git
```

2 . Add remote from original repository in your forked repository: 

```bash
cd into/cloned/fork-repo  
git remote add upstream https://github.com/ORIGINAL-DEV-USERNAME/REPO-YOU-FORKED-FROM.git  
git fetch upstream  
```

3 . Updating your fork from original repo to keep up with their changes:

```bash
git pull upstream master
git merge upstream/master
git push

# or
git checkout dev
git pull upstream dev
git merge upstream/dev
git push
```
    
# Warning / deprecate
```js
npm deprecate <pkg>[@<version>] <message>
// or better
npm deprecate my-thing@"< 0.2.3" "critical bug fixed in v0.2.3"
```    
    
# Really make a bare repo to smaller

https://stackoverflow.com/questions/2116778/reduce-git-repository-size  
https://stackoverflow.com/questions/3797907/how-to-remove-unused-objects-from-a-git-repository/14729486#14729486  
```bash
git gc --prune=now --aggressive
```    

# Show available versions on NPM

```bash
# for example
npm show p3x-angular-compile versions --json
```

    
# Verdaccio NPM fix

https://github.com/verdaccio/verdaccio/issues/577

```text
docker run --rm -it node:9.2.0-alpine sh
/ # npm login --registry https://npm.company.com
Username: admin
Password:
Email: (this IS public) admin@company.com
Logged in as admin on https://npm.company.com/.
/ # cat ~/.npmrc
//npm.company.com/:_authToken=Rwl9t+GHjlgP+brFJ6WycIe1y6r3Z+ShUEqsLusmFC11w3n6ex8JdmkMoKv/0U/D
/ #
```
    
Another solution is like this:

```text
# project .npmrc
registry = "https://registry.acmeco.com"
ca = null
always-auth = true
```    

# Swap for Docker

https://askubuntu.com/questions/417215/how-does-kernel-support-swap-limit

Edit:

```bash
sudo nano /etc/default/grub
```

Like:

```text
GRUB_CMDLINE_LINUX="cgroup_enable=memory swapaccount=1" 
```

Update:

```bash
sudo update-grub
```

    
[//]: #@corifeus-footer

---

[**P3X-TOOLS**](https://pages.corifeus.com/tools) Build v1.3.205-396 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## Sponsor

[![JetBrains](https://www.patrikx3.com/images/jetbrains-logo.svg)](https://www.jetbrains.com/)
  
 

[//]: #@corifeus-footer:end
