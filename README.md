# Link to app

[https://bcfoodapp.github.io/streetfoodlove/](https://bcfoodapp.github.io/streetfoodlove/)

Use an alternate Google account if you want to sign-in with Google! Do not use your main Google account as the app is not guaranteed to be secure.

# Document links

- [API doc](https://app.swaggerhub.com/apis-docs/foodapp/FoodApp/0.0.1)
- [Software Requirements Specification](https://bellevuec-my.sharepoint.com/:w:/g/personal/m_emura_bellevuecollege_edu/EfH0o_PF3dBOvJSqAym-jgoBQMhWPVSYoVgDfiq8IfQzGg?e=dEtOB3)
- [Software Design Document](https://bellevuec-my.sharepoint.com/:w:/g/personal/m_emura_bellevuecollege_edu/EaLhLJldsJ9JoaQXX4Ob-lcBbzh-COE8xMeDIyCE-DOaIQ?e=VDRNIS)
- [Software Testing Document](https://bellevuec-my.sharepoint.com/:x:/g/personal/m_emura_bellevuecollege_edu/EXV5H4hyfCpKl0935jg16JwBYKvP3tiAORWS7G8s41glgw?e=hznLLm)

# StreetFoodApp Dependencies
- MySQL Community Server 8.0
  - https://dev.mysql.com/downloads/mysql/
  - The root user password should be empty
    - If installation requires a password, you can set a temporary password, then remove the password later with `ALTER USER 'root'@'localhost' IDENTIFIED BY '';`
- Go 1.17
  - https://golang.org/dl/
- Node 17.1
  - https://nodejs.org/en/download/current/

# How to run
1. To initialize the database, go to `backend/reset_database` and run `go run .`
2. (Optional) [Configure AWS credentials](https://aws.github.io/aws-sdk-go-v2/docs/configuring-sdk/#specifying-credentials). If you do not do this, all AWS calls will fail.
3. Go to the `backend` folder in PowerShell and run the command `go run .`
  - Open your browser and go to http://localhost:8080/ to make sure it is working.
4. Go to the `app` folder, and install dependencies with `npm i`
5. Do `npm start` and wait for it to compile
6. With the backend server still running, go to http://localhost:3000/streetfoodlove/
  - Press ctrl-c to stop the server and npm

# To run in production

```
| home
|------cert.crt
|------cert.key
|------secrets.json
|------backend
```

1. As shown in the directory tree above, place the `.crt` and `.key` certificate files in the parent directory of `backend`.
2. Create a file named `secrets.json` with the schema given in `backend/database.Secrets`.
3. Clone just the `backend` directory to the same directory where the certificates are located.
4. Run the `backend` package, passing the environment variable `SECRETS_FILE` containing the path to the `secrets.json` file. For example:
  ```
  SECRETS_FILE=~/secrets.json sudo -E go run .
  ```