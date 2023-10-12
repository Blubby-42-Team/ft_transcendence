#!/bin/bash

source "$(dirname "$0")/print.sh"
source "$(dirname "$0")/check_requirement.sh"

print_warn "Check dependencies"

check_requirement;