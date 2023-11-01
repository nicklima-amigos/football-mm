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

resource "azurerm_virtual_network" "main" {
  name                = "football-network"
  address_space       = ["10.0.0.0/16"]
  location            = var.location
  resource_group_name = var.resource_group_name
}

resource "azurerm_subnet" "internal" {
  name                 = "internal"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_public_ip" "public_ip" {
  name                = "mypublicip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Dynamic"
}

resource "azurerm_network_interface" "main" {
  name                = "football-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "testconfiguration1"
    subnet_id                     = azurerm_subnet.internal.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.public_ip.id
  }
}

data "azurerm_ssh_public_key" "ssh_pub_key" {
  name                = "azure-key-vm"
  resource_group_name = var.resource_group_name
}

resource "azurerm_image" "packer_image" {
  name                = "PackerImageFootball"
  resource_group_name = var.resource_group_name
  location            = var.location

  os_disk {
    os_type  = "Linux"
    blob_uri = ""
  }
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

    # Referência à imagem criada pelo Packer
    image_uri = azurerm_image.packer_image.id
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

  tags = {
    environment = "staging"
  }
}
