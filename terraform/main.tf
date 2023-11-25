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
  use_oidc = true
}


resource "azurerm_resource_group" "football_mm" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_storage_account" "football_storage_account" {
  name                     = "footballmmstorage"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = var.account_tier
  account_replication_type = var.account_replication_type

}

data "azurerm_ssh_public_key" "ssh_pub_key" {
  name                = "azure-key-vm"
  resource_group_name = var.resource_group_name
}


resource "azurerm_virtual_machine" "main" {
  name                  = "football-vm"
  location              = var.location
  resource_group_name   = var.resource_group_name
  network_interface_ids = [azurerm_network_interface.main.id]
  vm_size               = "Standard_DS1_v2"

  storage_os_disk {
    name              = "myosdisk1"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
  os_profile {
    computer_name  = "hostname"
    admin_username = var.vm_admin_username
    admin_password = var.vm_admin_password
  }
  os_profile_linux_config {
    disable_password_authentication = true
    ssh_keys {
      key_data = data.azurerm_ssh_public_key.ssh_pub_key.public_key
      path     = "/home/${var.vm_admin_username}/.ssh/authorized_keys"
    }
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nginx",
      "sudo systemctl start nginx",
      "sudo systemctl enable nginx",
      "sudo apt-get install docker.io -y"
      
    ]
  }

  tags = {
    environment = "staging"
  }
}
