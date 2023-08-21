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
  features {}
  skip_provider_registration=true
}

resource "azurerm_resource_group" "football-mm" {
  name     = "football-mm-test"
  location = "East US"
}

resource "azurerm_virtual_network" "main" {
  name                = "football-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.football-mm.location
  resource_group_name = azurerm_resource_group.football-mm.name
}

resource "azurerm_virtual_machine" "main" {
  name                  = "football-vm"
  location              = azurerm_resource_group.football-mm.location
  resource_group_name   = azurerm_resource_group.football-mm.name
  network_interface_ids = [azurerm_network_interface.main.id]
  vm_size               = "Standard_DS1_v2"

  # Uncomment this line to delete the OS disk automatically when deleting the VM
  # delete_os_disk_on_termination = true

  # Uncomment this line to delete the data disks automatically when deleting the VM
  # delete_data_disks_on_termination = true

  storage_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts"
    version   = "latest"
  }
  storage_os_disk {
    name              = "myosdisk1"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
  os_profile {
    computer_name  = "hostname"
    admin_username = "admin"
    admin_password = "Admin"
  }
  os_profile_linux_config {
    disable_password_authentication = false
  }
  tags = {
    environment = "staging"
  }
}

