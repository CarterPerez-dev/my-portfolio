--[[
  AngelaMos | 2025
  experience.lua - Experience model schema
]]

return {
  name = "Experience",
  fields = {
    "language",
    "company",
    "company_url",
    "company_logo_url",
    "location",
    "role",
    "department",
    "employment_type",
    "start_date",
    "end_date",
    "is_current",
    "description",
    "responsibilities",
    "achievements",
    "tech_stack",
    "display_order",
    "is_visible",
  },
  required = {
    "language",
    "company",
    "role",
    "start_date",
    "description",
  },
  enums = {
    language = { "en", "es", "fr", "ar", "pt", "zh", "hi" },
    employment_type = { "full_time", "part_time", "contract", "freelance", "internship" },
  },
}
