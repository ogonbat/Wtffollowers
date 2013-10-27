require "bundler/capistrano"
set :user, 'ubuntu'
set :domain, 'ec2-54-200-176-6.us-west-2.compute.amazonaws.com'
set :application, "wtffollowers.com"

set :rvm_type, :user
set :rvm_ruby_string, 'ruby-2.0.0-p247'
require 'rvm/capistrano'

#set :repository, "#{user}@#{domain}:/home/#{user}/git/#{application}.git"
set :repository, "https://github.com/ogonbat/Wtffollowers.git"
set :deploy_to, "/home/#{user}/deploy/#{application}"

# set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

role :web, domain                          # Your HTTP server, Apache/etc
role :app, domain                          # This may be the same as your `Web` server
role :db,  domain, :primary => true # This is where Rails migrations will run

set :deploy_via, :remote_cache
set :scm, 'git'
set :branch, 'master'
set :scm_verbose, true
set :use_sudo, false
set :normalize_asset_timestamps, false
set :rails_env, :production