#!/bin/bash

source "$(dirname "$0")/print.sh"

g_user_shell=""

# Check if getent is available
if command -v getent &> /dev/null
then
    g_user_shell=$(getent passwd $(id -un) | awk -F : '{print $NF}')
else
    # macOS doesn't have getent, so we need to use an alternative method
    g_user_shell=$(awk -F: -v user=$(whoami) '\$1 == user {print $NF}' /etc/passwd)
fi

print_info "Check done in $g_user_shell"


g_require_node_v="v18"
g_cversion=""
g_soft=""

# Check if program exist with `$1 -v` and store in global `$g_cversion`
# Return 0 if ok or -1 if there is an error
check_program () {
	g_cversion=$($g_user_shell -c "$1 -v") && {
			print_info "Using $1 version $g_cversion";
			return 0;
		} || {
			print_error "$1 not found!";
			return 1;
		}
}

ask() {
	# call with a prompt string or use a default
	read -r -p "${1:-Are you sure? [y/N]} " response
	case "$response" in
		[yY][eE][sS]|[yY]) 
			return 0
			;;
		*)
			return 1
			;;
	esac
}

check_requirement () {
	# Check if node install and version

	g_soft=node
	check_program $g_soft || {
			print_error "You need to install nodejs $g_require_node_v"
			print_warn "Run:"
			print_warn "./tools/install_nvm.sh"
			print_warn "nvm install $g_require_node_v"
			return 1;
	}
	[[ $g_cversion == *"$g_require_node_v"* ]] && {
			print_info "$g_soft version ok";
		} || {
				print_error "You need to install nodejs $g_require_node_v"
			return 1;
		}

	# Check if npm is install
	g_soft=npm
	check_program $g_soft || {
		print_warn "Ignoring, but you will maybe need $g_soft";
	}

	# Check if nest is install
	g_soft=nest
	check_program $g_soft || {
		print_warn "Ignoring, but you will maybe need $g_soft";
		print_warn "Run:"
		print_warn "./ttools nest"
	}

	# Check if docker is install
	g_soft=docker
	check_program $g_soft || {
		print_warn "Ignoring, but you will maybe need $g_soft";
		print_warn "Run:"
		print_warn "./ttools docker"
	}
}
