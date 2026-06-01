#!/bin/bash

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI is not installed. Install it from https://learn.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Variables
RESOURCE_GROUP="cronos-rg"
APP_NAME_STAGING="cronos-audit-staging"
APP_NAME_PROD="cronos-audit-prod"
REGION="eastus"
SKU="B2"

echo "🚀 Setting up Azure resources for Cronos Audit..."

# Login to Azure
az login

# Create resource group
echo "Creating resource group..."
az group create \
    --name $RESOURCE_GROUP \
    --location $REGION

# Create App Service Plan
echo "Creating App Service Plan..."
az appservice plan create \
    --name "cronos-plan" \
    --resource-group $RESOURCE_GROUP \
    --sku $SKU \
    --is-linux

# Create Staging App Service
echo "Creating Staging App Service..."
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan "cronos-plan" \
    --name $APP_NAME_STAGING \
    --runtime "NODE|20-lts"

# Create Production App Service
echo "Creating Production App Service..."
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan "cronos-plan" \
    --name $APP_NAME_PROD \
    --runtime "NODE|20-lts"

# Configure staging app settings
echo "Configuring Staging environment variables..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME_STAGING \
    --settings \
        NODE_ENV="staging" \
        SCM_COMMAND_IDLE_TIMEOUT="300"

# Configure production app settings
echo "Configuring Production environment variables..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME_PROD \
    --settings \
        NODE_ENV="production" \
        SCM_COMMAND_IDLE_TIMEOUT="300"

# Generate publish profiles
echo "Generating publish profiles..."
mkdir -p .azure

az webapp deployment list-publishing-profiles \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME_STAGING \
    --query "[0]" \
    --output json > .azure/publish-profile-staging.json

az webapp deployment list-publishing-profiles \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME_PROD \
    --query "[0]" \
    --output json > .azure/publish-profile-prod.json

echo "✅ Azure resources created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Add these GitHub secrets:"
echo "   - AZURE_SUBSCRIPTION_ID: $(az account show --query id -o tsv)"
echo "   - AZURE_APP_NAME_STAGING: $APP_NAME_STAGING"
echo "   - AZURE_PUBLISH_PROFILE_STAGING: (content of .azure/publish-profile-staging.json)"
echo "   - AZURE_APP_NAME_PRODUCTION: $APP_NAME_PROD"
echo "   - AZURE_PUBLISH_PROFILE_PRODUCTION: (content of .azure/publish-profile-prod.json)"
echo ""
echo "2. Configure environment variables in Azure Portal"
echo "3. Enable continuous deployment if needed"
