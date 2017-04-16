# chatbot

Facebook chatbot written in Node.js for Penn's services, such as dining, laundry, etc.

## Setup

To install and get started, run

    npm install
    npm start

## Deployment

The chatbot is currently deployed on Dokku, a self-hosted Heroku-like PaaS that
allows for easy development deploys. Ideally, this should be behind a Continuous
Integration server so only builds that pass can be deployed.

### Setup

To set up deploys from your individual developer machine, there are a few simple
steps both on the development machine and the Dokku server.

1. [Create an SSH key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#generating-a-new-ssh-key)
   on the local developer's machine.
2. Add the SSH *public* key (`~/.ssh/id_rsa.pub` usually) to the Dokku server
   with `dokku ssh-keys:add <name> <path_to_key>`.
3. Within the git repo on the local development machine, add the Dokku repo as a
   git remote: `git remote add dokku dokku@apps.pennlabs.org:chatbot`

**NOTE**: Deploy access to the Dokku server should be extremely limited and only
   provided to trusted users. Should a developer's SSH key be compromised or
   shit hits the fan, access should be revoked.

### Deploying

Once you've set all that up, deploying is super simple:

    git push dokku master

Note that Dokku works similarly to Heroku with buildpacks, so all requirements
have to be `package.json`, running the app happens with a `Procfile`, etc.
