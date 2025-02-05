echo "========== Login into AKS Cluster =========="
export AAD_SERVICE_PRINCIPAL_CLIENT_ID=$ARM_AKS_SERVICE_PRINCIPAL_ID
export AAD_SERVICE_PRINCIPAL_CLIENT_SECRET=$ARM_AKS_SERVICE_PRINCIPAL_KEY
export KUBECONFIG=$HOME/.kube/config
kubelogin convert-kubeconfig -l azurecli

echo "========== Define SERVICE_NAME variable key vaults =========="
SERVICE_NAME=${BUILD_REPOSITORY_NAME/incursor-back-/}

echo "========== Copy templates =========="
cp -r $SYSTEM_DEFAULTWORKINGDIRECTORY/$BUILD_REPOSITORY_NAME/.cicd/templates/ $SYSTEM_DEFAULTWORKINGDIRECTORY/incursor-back/helm/templates/

echo "========== Deleted secrets for key vaults =========="
kubectl delete secret kv-secrets-$SERVICE_NAME --namespace $FFD_AKS_NAMESPACE
kubectl delete secretproviderclass $SERVICE_NAME --namespace $FFD_AKS_NAMESPACE

echo "========== Upgrade Helm Chart =========="
HELM_CHART_PATH=$SYSTEM_DEFAULTWORKINGDIRECTORY/incursor-back/helm
HELM_PACKAGE_PATH=$SYSTEM_DEFAULTWORKINGDIRECTORY/microservices-nestjs-1.0.2.tgz
VALUES_HELM_PATH=$SYSTEM_DEFAULTWORKINGDIRECTORY/$BUILD_REPOSITORY_NAME/.cicd/values.yaml
helm package \
  --app-version="$IMAGE_VERSION" \
  --namespace="$FFD_AKS_NAMESPACE" \
  "$HELM_CHART_PATH" | \
    helm upgrade --namespace="$FFD_AKS_NAMESPACE" \
      --values $VALUES_HELM_PATH \
      --set namespace="$FFD_AKS_NAMESPACE" \
      --set replicaCount=$REPLICA_COUNT \
      \
      --set image.repository="$DOCKER_REGISTRY_DNS/$DOCKER_NAMESPACE/$SERVICE_NAME" \
      --set image.tag="$IMAGE_VERSION" \
      \
      --set keyVault.name="$ARM_KV_NAME" \
      --set keyVault.tenantId="$ARM_TENANT_ID" \
      --set keyVault.managedIdentityClientId="$ARM_KV_MANAGED_IDENTITY" \
      \
      --set ingress.hostname="$FFD_SERVICE_HOST_NAME" \
      --set ingress.redirectSSL="$FFD_INGRESS_REDIRECT_SSL" \
      --set ingress.privateIp="$FFD_INGRESS_PRIVATE_IP" \
      --set ingress.frontendPort=$FFD_INGRESS_FRONTEND_PORT \
      \
      --set autoscaling.enabled="$K8S_HPA_ENABLE" \
      \
      --set env.FINERACT_API_URLS="$FINERACT_API_URLS" \
      --set env.FINERACT_API_URL="$FINERACT_API_URL" \
      --set env.FINERACT_API_PROVIDER="$FINERACT_API_PROVIDER" \
      --set env.FINERACT_API_VERSION="$FINERACT_API_VERSION" \
      --set env.FINERACT_PLATFORM_TENANT_IDENTIFIER="$FINERACT_PLATFORM_TENANT_IDENTIFIER" \
      --set env.MIFOS_DEFAULT_LANGUAGE="$MIFOS_DEFAULT_LANGUAGE" \
      --set env.MIFOS_SUPPORTED_LANGUAGES="$MIFOS_SUPPORTED_LANGUAGES" \
      --set env.FINERACT_AZURE_AD_APP_CLIENT_ID="$FINERACT_AZURE_AD_APP_CLIENT_ID" \
      --set env.FINERACT_AZURE_AD_TENANT_ID="$FINERACT_AZURE_AD_TENANT_ID" \
      --set env.FINERACT_AZURE_AD_REDIRECT_URL="$FINERACT_AZURE_AD_REDIRECT_URL" \
      --set env.FINERACT_AZURE_AD_CODE_CHALLENGE="$FINERACT_AZURE_AD_CODE_CHALLENGE" \
      --set env.FINERACT_AZURE_AD_SSO_ENABLED="$FINERACT_AZURE_AD_SSO_ENABLED" \
      \
      --set deployment.useSpotNode="false" \
      \
      --set nodeSelector.agentpool="$ARM_AKS_AGENT_POOL" \
      --set podDisruptionBudgets.enabled="$ENABLED_POD_DISRUPTION_BUDGETS" \
      \
      --set resources.limits.cpu="$POD_LIMITS_CPU" \
      --set resources.limits.memory="$POD_LIMITS_MEMORY" \
      --set resources.requests.cpu="$POD_REQUESTS_CPU" \
      --set resources.requests.memory="$POD_REQUESTS_MEMORY" \
      \
      --wait \
      --debug \
      --install $SERVICE_NAME $HELM_PACKAGE_PATH
