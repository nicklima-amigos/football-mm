output "public_ip_address" {
  description = "value of the public ip address"
  value       = azurerm_public_ip.public_ip.ip_address
}
