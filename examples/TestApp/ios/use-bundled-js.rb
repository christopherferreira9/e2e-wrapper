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

# Find the build phase that copies bundle resources
resources_phase = target.build_phases.find { |phase| phase.is_a?(Xcodeproj::Project::Object::PBXResourcesBuildPhase) }

# Add the bundle file to the resources build phase
bundle_ref = project.new_file('bundle/index.ios.jsbundle')
resources_phase.add_file_reference(bundle_ref)

# Also add the assets
assets_dir = project.new_group('bundle')
bundle_ref.parent = assets_dir

# Save the project
project.save 