[//]: #@corifeus-header

  [![NPM](https://img.shields.io/npm/v/p3x-tools.svg)](https://www.npmjs.com/package/p3x-tools)  [![Donate for PatrikX3 / P3X](https://img.shields.io/badge/Donate-PatrikX3-003087.svg)](https://paypal.me/patrikx3) [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Corifeus @ Facebook](https://img.shields.io/badge/Facebook-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)  [![Uptime ratio (90 days)](https://network.corifeus.com/public/api/uptime-shield/31ad7a5c194347c33e5445dbaf8.svg)](https://network.corifeus.com/status/31ad7a5c194347c33e5445dbaf8)





# 💣 Tools v2025.4.122


  
🌌 **Bugs are evident™ - MATRIX️**  
🚧 **This project is under active development!**  
📢 **We welcome your feedback and contributions.**  
    



### NodeJS LTS is supported

### 🛠️ Built on NodeJs version

```txt
v22.13.1
```





# 📝 Description

                        
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
p3x ncu -u # updates recursive all packages
p3x git pull # recursive pull every folder
p3x git push # recursive push every folder
p3x git renew|truncate # remote all commits, from #1231 commit to #1
p3x git init repo-name # .git is not required, is auto added, post-update is generated so it is my own, specific for the patrikx3.com server git repo (it adds in the webhook), the names are only lower cased forcefully a-z, digit and dash.
```

and more ...

If you want the commands is serials, add the ```-s``` or ```--serial``` flag, otherwise all ```async```.

etc ...

# Dependencies Fix
[dependencies-fix.json](dependencies-fix.json)


# Webpack repos
* gitlist
* redis-ui-material
* fortune-cookie
* corifeus-builder-angular
* sygnus ngivr builder webpack


# Default excludes from GitHub:
[github.json](github.json)

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
GRUB_DEFAULT=saved
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


    
[//]: #@corifeus-footer

---

## 🚀 Quick and Affordable Web Development Services

If you want to quickly and affordably develop your next digital project, visit [corifeus.eu](https://corifeus.eu) for expert solutions tailored to your needs.

---

## 🌐 Powerful Online Networking Tool  

Discover the powerful and free online networking tool at [network.corifeus.com](https://network.corifeus.com).  

**🆓 Free**  
Designed for professionals and enthusiasts, this tool provides essential features for network analysis, troubleshooting, and management.  
Additionally, it offers tools for:  
- 📡 Monitoring TCP, HTTP, and Ping to ensure optimal network performance and reliability.  
- 📊 Status page management to track uptime, performance, and incidents in real time with customizable dashboards.  

All these features are completely free to use.  

---

## ❤️ Support Our Open-Source Project  
If you appreciate our work, consider ⭐ starring this repository or 💰 making a donation to support server maintenance and ongoing development. Your support means the world to us—thank you!  

---

### 🌍 About My Domains  
All my domains, including [patrikx3.com](https://patrikx3.com), [corifeus.eu](https://corifeus.eu), and [corifeus.com](https://corifeus.com), are developed in my spare time. While you may encounter minor errors, the sites are generally stable and fully functional.  

---

### 📈 Versioning Policy  
**Version Structure:** We follow a **Major.Minor.Patch** versioning scheme:  
- **Major:** 📅 Corresponds to the current year.  
- **Minor:** 🌓 Set as 4 for releases from January to June, and 10 for July to December.  
- **Patch:** 🔧 Incremental, updated with each build.  

**🚨 Important Changes:** Any breaking changes are prominently noted in the readme to keep you informed.

---


[**P3X-TOOLS**](https://corifeus.com/tools) Build v2025.4.122

 [![NPM](https://img.shields.io/npm/v/p3x-tools.svg)](https://www.npmjs.com/package/p3x-tools)  [![Donate for PatrikX3 / P3X](https://img.shields.io/badge/Donate-PatrikX3-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)





[//]: #@corifeus-footer:end
