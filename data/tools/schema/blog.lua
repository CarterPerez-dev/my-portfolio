--[[
  AngelaMos | 2025
  blog.lua - Blog model schema
]]

return {
  name = "Blog",
  fields = {
    "language",
    "title",
    "description",
    "external_url",
    "category",
    "tags",
    "thumbnail_url",
    "published_date",
    "read_time_minutes",
    "views_count",
    "display_order",
    "is_visible",
    "is_featured",
  },
  required = {
    "language",
    "title",
    "description",
    "external_url",
  },
  enums = {
    language = { "en", "es", "fr", "ar", "pt", "zh", "hi" },
    category = { "tutorial", "deep_dive", "career", "project", "opinion" },
  },
}
