--[[
  AngelaMos | 2025
  certification.lua - Certification model schema
]]

return {
  name = "Certification",
  fields = {
    "language",
    "name",
    "issuer",
    "issuer_url",
    "issuer_logo_url",
    "credential_id",
    "verification_url",
    "date_obtained",
    "expiry_date",
    "is_expired",
    "badge_image_url",
    "category",
    "display_order",
    "is_visible",
  },
  required = {
    "language",
    "name",
    "issuer",
    "date_obtained",
  },
  enums = {
    language = { "en", "es", "fr", "ar", "pt", "zh", "hi" },
    category = { "security", "cloud", "programming", "networking", "database", "devops" },
  },
}
