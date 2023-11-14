packer {
  required_plugins {
    ansible = {
      source  = "github.com/hashicorp/ansible"
      version = "~> 1"
    }
    azure = {
      source  = "github.com/hashicorp/azure"
      version = "~> 1"
    }
  }
}

variable "client_id" {
  type    = string
  default = env("ARM_CLIENT_ID")
}

variable "client_secret" {
  type    = string
  default = env("ARM_CLIENT_SECRET")
}

variable "subscription_id" {
  type    = string
  default = env("ARM_SUBSCRIPTION_ID")
}

variable "tenant_id" {
  type    = string
  default = env("ARM_TENANT_ID")
}

source "azure-arm" "image-football" {
  azure_tags = {
    dept = "engineering"
  }
  client_id                         = var.client_id
  client_secret                     = var.client_secret
  subscription_id                   = var.subscription_id
  tenant_id                         = var.tenant_id
  resource_group_name               = "football-mm"
  storage_account                   = "footballmmstorage"

  capture_container_name            = "images"
  capture_name_prefix               = "football-mm-packer"

  image_offer                       = "UbuntuServer"
  image_publisher                   = "Canonical"
  image_sku                         = "19.04"
  location                          = "East US"
  os_type                           = "Linux"
  temp_resource_group_name          = "packer-rg"
  vm_size                           = "Standard_DS2_v2"
}

build {
  sources = ["source.azure-arm.image-football"]

  provisioner "ansible" {
    playbook_file = "../ansible/playbooks/playbook.yml"
  }

}
