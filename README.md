# ft_transcendence

## Dev

Before starting to dev run `./ttools` to be sure that you have all the requirement and good version.

## Install node with nvm

Run `./ttools node` to install `nvm`.
Be sure to add env in your .bashrc (bash) or .zshrc (zsh). Add these line at the end of your config file.

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

Dont forget to restart your terminal and now you can install node v18.
```sh
nvm install v18
```

## Install python with pyenv

Install pyenv and read carefully the end message of the installer.

```sh
curl https://pyenv.run | bash

```

And install python 3.11

```sh
pyenv install 3.11
```
