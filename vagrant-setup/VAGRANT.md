WHAT IS VAGRANT
=================

A virtualbox manager for development.


INSTALL VAGRANT
==================

First install VirtualBox:
https://www.virtualbox.org/wiki/Downloads

Then after installation install the Extension Pack you can find
on the same page. <--- Install Extenstion Pack.

After installing the extensions then you need to install Vagrant:
https://www.vagrantup.com/downloads.html

Then you need to install a Vagrant plugin by running the following command:

vagrant plugin install vagrant-hostmanager


SET UP DEV VAGRANT BOX (after you do the installation above)
======================

* vagrant up
* vagrant ssh

  cd doorway/config
* cp local.settings.sample.js local.settings.js
* -- edit `local.settings.js` with correct configuration settings

* cd doorway/api
* yarn
* yarn start:dev
* cd
* cd doorway/web
* yarn
* yarn build
* yarn start:dev
* cd
* pm2 save
* pm2 startup # run command this command returns

open website: http://10.10.10.10/
