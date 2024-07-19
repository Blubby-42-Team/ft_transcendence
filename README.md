# ft_transcendence

This project is the last of our common core cursus, we had to create a full SPA that allow user to play Pong in multiplayer. All the project has to be done in TypeScript and should be deployed in container.

Some other requirement was :

- Using an **SQL** database and **avoid SQL injection**.
- User **password should be store as hash**
- API should validate data
- User need to login/register with a **OAUTH2** provider
- User should be able to **set a 2FA** on his account
- User can **invite friend to play** or **join a match making game**
- **Private and public chatroom** with **administrator permission** and the ability to **protect room with password**
- User can **add**, **remove** or **block user and friend**


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
