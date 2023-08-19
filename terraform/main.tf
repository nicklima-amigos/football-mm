terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.70.0"
    }
  }
}

provider "azurerm" {
  features {}

  client_id       = var.agent_client_id
  client_secret   = var.agent_client_secret
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
}

resource "azurerm_resource_group" "football-mm" {
  name     = "football-mm"
  location = "West US"
}
