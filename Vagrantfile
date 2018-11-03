# encoding: utf-8
# -*- mode: ruby -*-
# vi: set ft=ruby :

#----- config ----#

VM_NAME = 'doorway'
VM_PATH = '/home/vagrant/' + VM_NAME

VM_BOX = 'ubuntu/bionic64'
VM_MEMORY = 4096

# IP Address for the host only network, change it to anything you like.
# It is recommended that you keep it within the IPv4 private network range
IP_ADDRESS = "10.10.10.10"

#----- setup ----#

Vagrant.configure(2) do |config|
  config.vm.box = VM_BOX
  config.vm.hostname = VM_NAME
  config.vm.network :private_network, ip: IP_ADDRESS

  # Set VM name in Virtualbox
  config.vm.provider "virtualbox" do |v|
    v.name = VM_NAME
    v.memory = VM_MEMORY
    v.customize ["modifyvm", :id, "--uartmode1", "disconnected"]
  end

  # Disable default Vagrant folder, use a unique path per project
  config.vm.synced_folder ".", VM_PATH, create: true, type: "rsync", rsync__auto: true, rsync__args: ["--verbose", "--archive", "-z", "--copy-links", "--rsync-path='sudo rsync'", "--perms"], rsync__exclude: [".git/", ".vagrant/", "Vagrantfile", "node_modules", "static/gen"]

  # Forward nginx, mysql and redis ports
  config.vm.network "forwarded_port", guest: 80, host: 6676, auto_correct: true
  config.vm.network "forwarded_port", guest: 3306, host: 6677, auto_correct: true
  config.vm.network "forwarded_port", guest: 6379, host: 6679, auto_correct: true

  # Install mysql and redis servers
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y software-properties-common
    apt-get install -y curl wget vim git
    curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
    apt-get install -y nodejs
    npm install -g yarn
    npm install -g pm2
    apt-get install -y nginx
    apt-get install -y redis-server
    debconf-set-selections <<< "mysql-server mysql-server/root_password password root"
    debconf-set-selections <<< "mysql-server mysql-server/root_password_again password root"
    apt-get install -qq mysql-server
    MYSQL=`which mysql`
    Q1="GRANT ALL ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;"
    Q2="FLUSH PRIVILEGES;"
    SQL="${Q1}${Q2}"
    $MYSQL -uroot -proot -e "$SQL"
    apt-get update
    apt-get upgrade -y
    apt-get autoremove -y
    runuser -l vagrant -c 'mkdir /home/vagrant/bin'
    $MYSQL -uroot -proot -e "create database doorway;create database doorway_test"
    $MYSQL -uroot -proot doorway < /home/vagrant/doorway/vagrant-setup/mysql/sitedb.sql
    $MYSQL -uroot -proot doorway_test < /home/vagrant/doorway/vagrant-setup/mysql/sitedb.sql
    echo "## shell provisioning finished ##"
  SHELL

  config.vm.provision "shell", :args => "background", run: "always" do |s|
    s.path = "vagrant-setup/provision-up.sh"
  end
end
