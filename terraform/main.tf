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
  skip_provider_registration=true
}

resource "azurerm_resource_group" "football-mm" {
  name     = "football-mm2"
  location = "West US"
}
