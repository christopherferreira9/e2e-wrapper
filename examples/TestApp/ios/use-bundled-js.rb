#!/usr/bin/env ruby
require 'xcodeproj'

# Path to your .xcodeproj file
project_path = 'TestApp.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Find the main target
target = project.targets.find { |t| t.name == 'TestApp' }
if !target
  puts "Could not find target 'TestApp'"
  exit 1
end

# Create or find a group for bundle assets
bundle_group = project.main_group.find_subpath('bundle', true)

# Add the bundle file to the project
bundle_file_path = '../bundle/index.ios.jsbundle'
bundle_ref = bundle_group.new_file(bundle_file_path)

# Find the build phase that copies bundle resources
resources_phase = target.build_phases.find { |phase| phase.is_a?(Xcodeproj::Project::Object::PBXResourcesBuildPhase) }

# Add the file reference to the resources build phase
resources_phase.add_file_reference(bundle_ref)

puts "Added bundle file to Xcode project"

# Save the project
project.save 