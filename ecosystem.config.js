module.exports = {
  apps : [{
    name      : 'bot',
    script    : 'index.js',
    output: './logs/out.log',
    error: './logs/error.log',
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
      'post-deploy' : 'yarn install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
