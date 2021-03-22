# NOTE: before

## stage 1, build projects

# 1.1 build frontend
echo "STAGE 1.1: STARTED BUILDING FRONTEND"
ng build ucl-imdb --prod --buildOptimizer --extractLicenses --no-namedChunks --optimization --outputHashing=all --no-sourceMap --no-vendorChunk
echo "SUCCESSFULLY FINISHED BUILDING FRONTEND"

# 1.2 build API
echo "STAGE 1.2: STARTED BUILDING API"
ng build api --prod --extractLicenses --generatePackageJson --optimization     # TODO: specify number of workers and memory limit
echo "SUCCESSFULLY FINISHED BUILDING API"


## stage 2, build docker images

# stage 2.1: build api image
echo "STAGE 2.1: STARTED BUILDING API DOCKER IMAGE"
docker build -t api-group8 --target production --no-cache -f apps/api/Dockerfile .
echo "STAGE 2.1: SUCCESSFULLY FINISHED BUILDING API DOCKER IMAGE"

# stage 2.2: build database image
echo "STAGE 2.2: STARTED BUILDING DATABASE DOCKER IMAGE"
cd apps/db
docker build -t postgres-group8:latest --no-cache .
cd ../..
echo "STAGE 2.2: SUCCESSFULLY FINISHED BUILDING DATABASE DOCKER IMAGE"


## stage 3: Deploy to kubernetes
echo "STAGE 3: DEPLOY TO KUBERNETES"
cd k8s-configuration
./update_all_configs.sh     # update deployments
./restart_all_deployments.sh