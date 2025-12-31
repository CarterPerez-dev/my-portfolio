#!/usr/bin/env luajit
--[[
  AngelaMos | 2025
  escape.lua - Convert markdown to JSON-escaped string

  Usage:
    luajit escape.lua input.md              # Print to stdout
    luajit escape.lua input.md output.txt   # Write to file
    luajit escape.lua input.md --clip       # Copy to clipboard (requires xclip)
]]

local json = require("cjson")

local function read_file(path)
  local f = io.open(path, "r")
  if not f then
    io.stderr:write("Error: Could not open " .. path .. "\n")
    os.exit(1)
  end
  local content = f:read("*a")
  f:close()
  return content
end

local function write_file(path, content)
  local f = io.open(path, "w")
  if not f then
    io.stderr:write("Error: Could not write to " .. path .. "\n")
    os.exit(1)
  end
  f:write(content)
  f:close()
end

local function to_clipboard(content)
  local handle = io.popen("xclip -selection clipboard", "w")
  if handle then
    handle:write(content)
    handle:close()
    return true
  end
  return false
end

local function main(args)
  if #args < 1 then
    print("Usage: luajit escape.lua <input.md> [output.txt | --clip]")
    print("")
    print("Converts markdown file to JSON-escaped string")
    print("")
    print("Examples:")
    print("  luajit escape.lua README.md")
    print("  luajit escape.lua README.md escaped.txt")
    print("  luajit escape.lua README.md --clip")
    os.exit(1)
  end

  local input_path = args[1]
  local output_arg = args[2]

  local content = read_file(input_path)
  local escaped = json.encode(content)

  if not output_arg then
    print(escaped)
  elseif output_arg == "--clip" then
    if to_clipboard(escaped) then
      print("Copied to clipboard! (" .. #escaped .. " chars)")
    else
      io.stderr:write("Error: xclip not available\n")
      print(escaped)
    end
  else
    write_file(output_arg, escaped)
    print("Written to " .. output_arg .. " (" .. #escaped .. " chars)")
  end
end

main(arg)
