#!/bin/bash

source "$(dirname "$0")/print.sh"

g_user_shell=$SHELL

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

		print_error "You need $g_soft $g_require_node_v!";

		ask "Install $g_soft $g_require_node_v with nvm?" && {
			print_warn "TODO install $g_soft"
			##WIP
		} || {
			print_error "You need to install $g_soft $g_require_node_v!"
			return 1;
		}
	}
	[[ $g_cversion == *"$g_require_node_v"* ]] && {
			print_info "$g_soft version ok";
		} || {
			print_error "Wrong $g_soft version, please use $g_require_node_v";
			print_warn "use: nvm install 18";
			return 1;
		}


	# Check if npm is install
	g_soft=npm
	check_program $g_soft || {
		print_warn "Ignoring, but you will maybe need $g_soft";
		ask "Install $g_soft?" && {
			print_warn "TODO install $g_soft"
			##WIP
		} || {
			print_warn "You need to install $g_soft!"
		}
	}

	# Check if nest is install
	g_soft=nest
	check_program $g_soft || {
		print_warn "Ignoring, but you will maybe need $g_soft";
		ask "Install $g_soft?" && {
			print_warn "TODO install $g_soft"
			##WIP
		} || {
			print_warn "You need to install $g_soft!"
		}
	}

	# Check if docker is install
	g_soft=docker
	check_program $g_soft || {
		print_warn "Ignoring, but you will maybe need $g_soft";
		ask "Install $g_soft?" && {
			print_warn "TODO install $g_soft"
			##WIP
		} || {
			print_warn "You need to install $g_soft!"
		}
	}
}