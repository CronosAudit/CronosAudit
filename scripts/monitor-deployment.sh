#!/bin/bash

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check status of deployment
check_deployment() {
    local app_name=$1
    local resource_group="cronos-rg"
    
    echo -e "${BLUE}Checking deployment status for $app_name...${NC}"
    
    # Get app state
    local app_state=$(az webapp show \
        --resource-group $resource_group \
        --name $app_name \
        --query "state" -o tsv)
    
    # Get last deployment time
    local last_deploy=$(az webapp deployment list \
        --resource-group $resource_group \
        --name $app_name \
        --query "[0].received_time" -o tsv)
    
    echo -e "${GREEN}App State: $app_state${NC}"
    echo -e "${GREEN}Last Deployment: $last_deploy${NC}"
    
    # Get recent logs
    echo -e "\n${BLUE}Recent Application Logs:${NC}"
    az webapp log tail \
        --resource-group $resource_group \
        --name $app_name \
        --lines 20
}

# Monitor application health
monitor_health() {
    local app_name=$1
    local url="https://$app_name.azurewebsites.net/api/health"
    
    echo -e "${BLUE}Monitoring $url...${NC}"
    
    for i in {1..5}; do
        echo -e "\n${YELLOW}Check $i:${NC}"
        curl -s -w "\nStatus: %{http_code}\n" $url | jq . 2>/dev/null || curl -s -w "\nStatus: %{http_code}\n" $url
        sleep 10
    done
}

# Rollback deployment
rollback_deployment() {
    local app_name=$1
    local resource_group="cronos-rg"
    
    echo -e "${YELLOW}Rolling back deployment for $app_name...${NC}"
    
    # Get previous deployment
    local deployments=$(az webapp deployment list \
        --resource-group $resource_group \
        --name $app_name \
        --query "[0:2]" -o json)
    
    echo "$deployments" | jq .
    
    echo -e "${YELLOW}To rollback, use:${NC}"
    echo "az webapp deployment slot swap --resource-group $resource_group --name $app_name --slot staging"
}

# Show help
show_help() {
    cat << EOF
${BLUE}Cronos Audit - Deployment Monitor${NC}

Usage: ./scripts/monitor-deployment.sh [command] [app-name]

Commands:
  ${GREEN}status${NC} [app-name]     Check deployment status
  ${GREEN}health${NC} [app-name]     Monitor application health
  ${GREEN}rollback${NC} [app-name]   Rollback deployment

Examples:
  ./scripts/monitor-deployment.sh status cronos-audit-staging
  ./scripts/monitor-deployment.sh health cronos-audit-prod
  ./scripts/monitor-deployment.sh rollback cronos-audit-staging

EOF
}

# Main
case "${1:-help}" in
    status)
        if [ -z "$2" ]; then
            echo "App name required"
            show_help
            exit 1
        fi
        check_deployment "$2"
        ;;
    health)
        if [ -z "$2" ]; then
            echo "App name required"
            show_help
            exit 1
        fi
        monitor_health "$2"
        ;;
    rollback)
        if [ -z "$2" ]; then
            echo "App name required"
            show_help
            exit 1
        fi
        rollback_deployment "$2"
        ;;
    help)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
