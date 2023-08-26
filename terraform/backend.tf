terraform {
  backend "azurerm" {
    resource_group_name  = "football-mm"
    storage_account_name = "footballmm"
    container_name       = "football-container"
    key                  = "terraform.tfstate"
  }
}