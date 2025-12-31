#!/usr/bin/env luajit
--[[
  AngelaMos | 2025
  lint.lua - Validate JSON seed files against model schemas

  Usage:
    luajit lint.lua                     # Lint all seed files
    luajit lint.lua projects            # Lint only projects
    luajit lint.lua --file path/to.json # Lint single file
]]

local json = require("cjson")

local COLORS = {
  red    = "\27[31m",
  green  = "\27[32m",
  yellow = "\27[33m",
  blue   = "\27[34m",
  cyan   = "\27[36m",
  reset  = "\27[0m",
  bold   = "\27[1m",
  dim    = "\27[2m",
}

local function color(c, text)
  return COLORS[c] .. text .. COLORS.reset
end

local SCHEMAS = {
  projects       = require("schema.project"),
  experiences    = require("schema.experience"),
  certifications = require("schema.certification"),
  blogs          = require("schema.blog"),
}

local function set_from_list(list)
  local s = {}
  for _, v in ipairs(list) do s[v] = true end
  return s
end

local function read_file(path)
  local f = io.open(path, "r")
  if not f then return nil end
  local content = f:read("*a")
  f:close()
  return content
end

local function get_json_keys(obj)
  local keys = {}
  for k, _ in pairs(obj) do
    keys[#keys + 1] = k
  end
  return keys
end

local function find_similar(word, valid_fields)
  local best_match, best_score = nil, 0
  local w_lower = word:lower()

  for field, _ in pairs(valid_fields) do
    local f_lower = field:lower()
    local score = 0

    if w_lower == f_lower then
      return field, 100
    end

    if w_lower:find(f_lower, 1, true) or f_lower:find(w_lower, 1, true) then
      score = score + 50
    end

    local common = 0
    for i = 1, math.min(#word, #field) do
      if word:sub(i, i) == field:sub(i, i) then
        common = common + 1
      end
    end
    score = score + (common / math.max(#word, #field)) * 30

    if w_lower:gsub("_", "") == f_lower:gsub("_", "") then
      score = score + 40
    end

    if score > best_score then
      best_score = score
      best_match = field
    end
  end

  return best_match, best_score
end

local function lint_file(path, schema)
  local content = read_file(path)
  if not content then
    return nil, "Could not read file"
  end

  local ok, data = pcall(json.decode, content)
  if not ok then
    return nil, "Invalid JSON: " .. tostring(data)
  end

  local valid_set = set_from_list(schema.fields)
  local required_set = set_from_list(schema.required)
  local json_keys = get_json_keys(data)
  local json_set = set_from_list(json_keys)

  local errors = {}
  local warnings = {}

  for _, key in ipairs(json_keys) do
    if not valid_set[key] then
      local similar, score = find_similar(key, valid_set)
      if score > 40 then
        errors[#errors + 1] = {
          type = "typo",
          field = key,
          suggestion = similar,
          score = score,
        }
      else
        errors[#errors + 1] = {
          type = "unknown",
          field = key,
        }
      end
    end
  end

  for field, _ in pairs(required_set) do
    if not json_set[field] then
      errors[#errors + 1] = {
        type = "missing_required",
        field = field,
      }
    elseif data[field] == nil or data[field] == json.null then
      errors[#errors + 1] = {
        type = "null_required",
        field = field,
      }
    end
  end

  for field, _ in pairs(valid_set) do
    if not json_set[field] and not required_set[field] then
      warnings[#warnings + 1] = {
        type = "missing_optional",
        field = field,
      }
    end
  end

  if schema.enums then
    for field, valid_values in pairs(schema.enums) do
      local value = data[field]
      if value ~= nil and value ~= json.null then
        local valid_set_enum = set_from_list(valid_values)
        if not valid_set_enum[value] then
          errors[#errors + 1] = {
            type = "invalid_enum",
            field = field,
            value = tostring(value),
            valid = valid_values,
          }
        end
      end
    end
  end

  return {
    path = path,
    schema = schema.name,
    errors = errors,
    warnings = warnings,
    field_count = #json_keys,
    expected_count = #schema.fields,
  }
end

local function print_result(result)
  local icon = #result.errors == 0 and color("green", "✓") or color("red", "✗")
  print(string.format("\n%s %s", icon, color("bold", result.path)))
  print(string.format("  Schema: %s | Fields: %d/%d",
    color("cyan", result.schema),
    result.field_count,
    result.expected_count))

  if #result.errors > 0 then
    print(color("red", "  Errors:"))
    for _, err in ipairs(result.errors) do
      if err.type == "typo" then
        print(string.format("    %s '%s' → did you mean '%s'?",
          color("yellow", "TYPO"),
          color("red", err.field),
          color("green", err.suggestion)))
      elseif err.type == "unknown" then
        print(string.format("    %s '%s' does not exist in model",
          color("red", "UNKNOWN"),
          err.field))
      elseif err.type == "missing_required" then
        print(string.format("    %s '%s' is required",
          color("red", "MISSING"),
          err.field))
      elseif err.type == "null_required" then
        print(string.format("    %s '%s' cannot be null",
          color("red", "NULL"),
          err.field))
      elseif err.type == "invalid_enum" then
        print(string.format("    %s '%s' has invalid value '%s'",
          color("yellow", "ENUM"),
          err.field,
          color("red", err.value)))
        print(string.format("           valid: %s",
          color("green", table.concat(err.valid, ", "))))
      end
    end
  end

  if #result.warnings > 0 and #result.warnings <= 10 then
    print(color("yellow", "  Optional fields not present:"))
    local fields = {}
    for _, w in ipairs(result.warnings) do
      fields[#fields + 1] = w.field
    end
    print("    " .. color("dim", table.concat(fields, ", ")))
  end
end

local function scan_directory(base_path)
  local files = {}
  local handle = io.popen('find "' .. base_path .. '" -name "*.json" -type f 2>/dev/null')
  if handle then
    for line in handle:lines() do
      files[#files + 1] = line
    end
    handle:close()
  end
  return files
end

local function detect_schema(path)
  if path:find("/projects/") then return SCHEMAS.projects end
  if path:find("/experiences/") then return SCHEMAS.experiences end
  if path:find("/certifications/") then return SCHEMAS.certifications end
  if path:find("/blogs/") then return SCHEMAS.blogs end
  return nil
end

local function main(args)
  local data_path = "../data"

  local script_dir = arg[0]:match("(.*/)")
  if script_dir then
    data_path = script_dir .. "../data"
  end

  print(color("bold", "\n━━━ Seed File Linter ━━━"))
  print(color("dim", "Validating JSON against model schemas\n"))

  local filter = args[1]
  local single_file = nil

  if filter == "--file" then
    single_file = args[2]
    if not single_file then
      print(color("red", "Error: --file requires a path"))
      os.exit(1)
    end
  end

  local total_errors = 0
  local total_files = 0

  if single_file then
    local schema = detect_schema(single_file)
    if not schema then
      print(color("yellow", "Could not detect schema from path. Trying all..."))
      for name, s in pairs(SCHEMAS) do
        local result = lint_file(single_file, s)
        if result then
          print_result(result)
        end
      end
    else
      local result, err = lint_file(single_file, schema)
      if result then
        print_result(result)
        total_errors = total_errors + #result.errors
      elseif err then
        print(color("red", "✗ " .. single_file))
        print("  " .. err)
        total_errors = total_errors + 1
      end
    end
    total_files = 1
  else
    local files = scan_directory(data_path)

    for _, file_path in ipairs(files) do
      local schema = detect_schema(file_path)

      if schema then
        local should_process = true
        if filter then
          should_process = file_path:find("/" .. filter .. "/")
        end

        if should_process then
          local result, err = lint_file(file_path, schema)
          if result then
            print_result(result)
            total_errors = total_errors + #result.errors
            total_files = total_files + 1
          elseif err then
            print(color("red", "✗ " .. file_path))
            print("  " .. err)
            total_errors = total_errors + 1
            total_files = total_files + 1
          end
        end
      end
    end
  end

  print(string.format("\n%s Files: %d | Errors: %d",
    color("bold", "━━━ Summary ━━━"),
    total_files,
    total_errors))

  if total_errors > 0 then
    print(color("red", "Fix errors before seeding!"))
    os.exit(1)
  else
    print(color("green", "All files valid!"))
  end
end

main(arg)
