{
  "apps": [
    {
      "name": "miseda-notificari-api",
      "script": "./server/index.js",
      "cwd": "/var/www/misedainspectsrl.ro",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "development",
        "PORT": "5000"
      },
      "env_production": {
        "NODE_ENV": "production",
        "PORT": "5000"
      },
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
      "error_file": "/var/log/pm2/miseda-notificari-error.log",
      "out_file": "/var/log/pm2/miseda-notificari-out.log",
      "log_file": "/var/log/pm2/miseda-notificari-combined.log",
      "merge_logs": true,
      "max_memory_restart": "1G",
      "node_args": "--max_old_space_size=1024",
      "watch": false,
      "ignore_watch": [
        "node_modules",
        "uploads",
        "logs"
      ],
      "restart_delay": 1000,
      "max_restarts": 10,
      "min_uptime": "10s"
    }
  ]
}
