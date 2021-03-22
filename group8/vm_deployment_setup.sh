# install docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
# configure docker permissions (https://docs.docker.com/engine/install/linux-postinstall/)
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker