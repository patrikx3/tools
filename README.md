[//]: #@corifeus-header
  
[![NPM](https://nodei.co/npm/p3x-tools.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/p3x-tools/)

  

[![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://paypal.me/patrikx3) [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Corifeus @ Facebook](https://img.shields.io/badge/Facebook-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)  [![Build Status](https://api.travis-ci.com/patrikx3/tools.svg?branch=master)](https://travis-ci.com/patrikx3/tools) 
[![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m780749701-41bcade28c1ea8154eda7cca.svg)](https://uptimerobot.patrikx3.com/)

 


 
# 💣 Tools v2019.4.107  

  
🙏 This is an open-source project. Star this repository, if you like it, or even donate to maintain the servers and the development. Thank you so much!

Possible, this server, rarely, is down, please, hang on for 15-30 minutes and the server will be back up.

All my domains ([patrikx3.com](https://patrikx3.com) and [corifeus.com](https://corifeus.com)) could have minor errors, since I am developing in my free time. However, it is usually stable.

**Note about versioning:** Versions are cut in Major.Minor.Patch schema. Major is always the current year. Minor is either 4 (January - June) or 10 (July - December). Patch is incremental by every build. If there is a breaking change, it should be noted in the readme.

**Bugs are evident™ - MATRIX️**  
    

### Node Version Requirement 
``` 
>=10.13.0 
```  
   
### Built on Node 
``` 
v12.4.0
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


# Webpack repos
* gitlist
* redis-ui-material
* fortune-cookie
* corifeus-builder-angular
* sygnus ngivr builder webpack


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

Edit:  
```bash
touch /etc/sysctl.d/90-swappiness.conf
nano /etc/sysctl.d/90-swappiness.conf
```

```text
vm.swappiness=1
```

**sudo reboot**

# How To Configure a Mail Server Using Postfix, Dovecot, MySQL, and SpamAssassin and Sieve to move to Spam / Junk folder

https://superuser.com/questions/1248257/how-to-configure-a-mail-server-using-postfix-dovecot-mysql-and-spamassassin-a/1248470#1248470


This is how is solved it (it took 7 months):

```bash
apt install dovecot-sieve dovecot-managesieved
nano /etc/dovecot/conf.d/90-plugin.conf
```

## Add or set in:

```text
protocol lmtp {
        mail_plugins = $mail_plugins sieve
        auth_socket_path = /var/run/dovecot/auth-master
    }  
```

	
```text
nano /etc/dovecot/sieve.conf
```

## Add in

```text
require ["fileinto", "mailbox"];
    if header :contains "X-Spam-Flag" "YES" {
        # move mail into Folder Spam, create folder if not exists
        fileinto :create "Spam";
        stop;
    }
```

## Execute

```bash
sievec /etc/dovecot/sieve.conf
nano /etc/spamassassin/local.cf
```


Add in or set it, it's like this ( I think you don't need everythign else):

```text
report_safe             0
required_score          2.0
use_bayes               1
use_bayes_rules         1
bayes_auto_learn        1
skip_rbl_checks         0
use_razor2              1
use_pyzor               0

add_header all Status _YESNO_, score=_SCORE_ required=_REQD_ version=_VERSION_
bayes_ignore_header X-Bogosity
bayes_ignore_header X-Spam-Flag
bayes_ignore_header X-Spam-Status
```
	
## Edit a new file again

```bash
nano /etc/dovecot/conf.d/90-sieve.conf
```

Set this config, you don't need anything else:

```text
plugin {
    sieve = /etc/dovecot/sieve.conf
}
```
 		
Edit the mail boxes, so jo have Junk, I think jo just need add or uncomment the Junk setting:

```bash
nano /etc/dovecot/conf.d/15-mailboxes.conf 
```

## Add in this config

```text
namespace inbox {
  mailbox Drafts {
    auto = subscribe
    special_use = \Drafts
  }
  mailbox Junk {
    auto = subscribe
    special_use = \Junk
  }
  mailbox Trash {
    auto = subscribe
    special_use = \Trash
  }
  mailbox Sent {
    auto = subscribe
    special_use = \Sent
  }
}
```

My user for the e-mail server is ```vmail```, so do like this:

```bash
chmod ug+w /etc/dovecot
chmod ug+w /etc/dovecot/sieve.conf.svbin
```

```chown -R vmail:vmail /etc/dovecot```

Restart your mail server:

```bash
service postfix reload && service spamassassin restart && service dovecot restart
```

# GRUB for another menu once
Make sure `/etc/default/grub` has this:
```text
GRUB_DEFAULT=saved`
```

You can choose you menu like:
```bash
grep -i "menuentry '" /boot/grub/grub.cfg
```

The boot with your menu:
```bash
sudo -i
# my workstation boot from win
grub-reboot 2 
reboot
```

# Git synchronize
```bash
git submodule sync
```

# WINDOWS

## IIS Windows 10 Enterprise
For `IIS`, I have to use the current user `Domain user` both the web site and the application pools eg. `domain\user`.
  
We have to install the `urlrewrite2` module, I think it is here:
https://www.iis.net/downloads/microsoft/url-rewrite 
  
## ALT GR for IntelliJ Idea
https://intellij-support.jetbrains.com/hc/en-us/community/posts/115000803070/comments/115000663724  

The working solution is to add actionSystem.force.alt.gr=true to custom properties.   

## PHP.INI

```ini
extension_dir = "C:\php\php-7.2\ext"
fastcgi.impersonate = 1
cgi.fix_pathinfo = 0
cgi.force_redirect = 0
error_log=C:\php\php-7.2-error.log

extension=php_openssl.dll
extension=php_mbstring.dll
zend_extension=php_opcache.dll
extension=php_gd2.dll
extension=php_curl.dll
zend_extension=C:\php\xdebug\php_xdebug-2.7.0alpha1-7.2-vc15-nts-x86_64.dll
```    
    
[//]: #@corifeus-footer

---

[**P3X-TOOLS**](https://pages.corifeus.com/tools) Build v2019.4.107 

[![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com/?from=patrikx3)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/?from=patrikx3) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end
