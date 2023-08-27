variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "football-mm"
}

variable "vm_admin_username" {
  description = "Admin username for the virtual machine"
  type        = string
  default     = "Devops"
}

variable "vm_admin_password" {
  description = "Admin password for the virtual machine"
  type        = string
  default     = "Admin123"
}