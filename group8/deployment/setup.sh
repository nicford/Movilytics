# install docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
# install docker compose
sudo apt  install docker-compose
# install node and npm
sudo apt install nodejs npm -y
sudo npm install -g @angular/cli


# configure docker permissions (https://docs.docker.com/engine/install/linux-postinstall/) (do this step last)
# sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
