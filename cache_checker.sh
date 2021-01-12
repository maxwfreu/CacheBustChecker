#!/bin/bash

# USAGE: sh cache_checker.sh -d ~/Workspace/KingStreetLabs

while getopts d: flag
do
    case "${flag}" in
        d) ksl_dir=${OPTARG};;
    esac
done

# Get directory of script and working directory
WORKING_DIR=`eval "pwd"`

# Set variables
diff_file_name='cache_bust_test_git_diff.txt'
diff_file_path="$WORKING_DIR/$diff_file_name"

echo "Generating git diff..."
eval "cd $ksl_dir" 
# Get git diff from all pushed changed
eval "git diff --name-only $current_commit master > $diff_file_path"
# Get git diff from non commited changed
eval "git diff --name-only >> $diff_file_path"

echo "Generating webpack build profile ..."
eval "webpack --profile --json > $WORKING_DIR/stats.json"

eval "cd $WORKING_DIR"

# Check if cache bust needed
eval "node $WORKING_DIR/cache_checker.js $diff_file_path"
# Remove git diff 
eval "rm -rf $WORKING_DIR/cache_bust_test_git_diff.txt"
eval "rm -rf $WORKING_DIR/stats.json"
