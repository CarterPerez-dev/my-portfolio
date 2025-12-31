--[[
  AngelaMos | 2025
  project.lua - Project model schema
]]

return {
  name = "Project",
  fields = {
    "slug",
    "language",
    "title",
    "subtitle",
    "description",
    "technical_details",
    "tech_stack",
    "github_url",
    "demo_url",
    "website_url",
    "docs_url",
    "blog_url",
    "pypi_url",
    "npm_url",
    "ios_url",
    "android_url",
    "code_snippet",
    "code_language",
    "code_filename",
    "thumbnail_url",
    "banner_url",
    "screenshots",
    "stars_count",
    "forks_count",
    "downloads_count",
    "users_count",
    "display_order",
    "is_complete",
    "is_featured",
    "status",
    "start_date",
    "end_date",
  },
  required = {
    "slug",
    "language",
    "title",
    "description",
    "tech_stack",
  },
  enums = {
    language = { "en", "es", "fr", "ar", "pt", "zh", "hi" },
    status = { "active", "maintained", "archived", "deprecated" },
  },
}
