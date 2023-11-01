terraform {
  backend "azurerm" {
    resource_group_name  = "football-mm"
    storage_account_name = "footballmmstorage"
    container_name       = "football-container"
    key                  = "terraform.tfstate"
    use_oidc             = true

  }
}