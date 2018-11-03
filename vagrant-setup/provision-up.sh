#!/bin/bash

mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default0
cat /home/vagrant/doorway/vagrant-setup/nginx/default | tail -n +4 | head -n -1 > /etc/nginx/sites-available/default
service nginx restart

mv /home/vagrant/doorway/vagrant-setup/dotfiles/.profile /home/vagrant
mv /home/vagrant/doorway/vagrant-setup/dotfiles/.bashrc /home/vagrant
mv /home/vagrant/doorway/vagrant-setup/dotfiles/.screenrc /home/vagrant

echo "## up provisioning finished ##"
