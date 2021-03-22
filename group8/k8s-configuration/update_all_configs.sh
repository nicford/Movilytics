echo "DEPLOYING API SECRETS"
kubectl apply -f api-secret.yaml
echo "DEPLOYING API"
kubectl apply -f api.yaml
echo "DEPLOYING BACKEND CONFIGURATION MAPPING"
kubectl apply -f backend-configmap.yaml
echo "DEPLOYING POSTGRES"
kubectl apply -f postgres.yaml
echo "DEPLOYING REDIS"
kubectl apply -f redis.yaml