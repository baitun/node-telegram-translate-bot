module.exports = {
  apps : [{
    name      : 'translate_bot',
    script    : 'index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'savin',
      host : 'node3.ortant.ru',
      ref  : 'origin/master',
      repo : 'git@bitbucket.org:savinyurii/translate_bot.git',
      path : '/home/projects/savin/translate_bot/',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
