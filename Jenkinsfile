pipeline {
  agent any

  stages {
    stage('Build Frontend') {
      steps {
        dir('weather-frontend') {
          bat 'npm ci'
          bat 'npm run build'
        }
      }
    }

    stage('Deploy Frontend to Tomcat') {
      steps {
        bat '''
        net stop Tomcat10

        if exist "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend" (
            rmdir /S /Q "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend"
        )
        mkdir "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend"
        xcopy /E /I /Y "weather-frontend\\dist\\*" "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend"

        echo === WEBAPPS AFTER FRONTEND ===
        dir "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps"
        '''
      }
    }

    stage('Build Backend (WAR)') {
      steps {
        dir('weather-backend') {
          bat 'mvn -B -DskipTests clean package'
          bat 'echo === TARGET CONTENTS === & dir target'
        }
      }
    }

    stage('Deploy Backend to Tomcat') {
      steps {
        bat '''
        if exist "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi.war" (
            del /Q "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi.war"
        )
        if exist "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi" (
            rmdir /S /Q "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi"
        )
        copy "weather-backend\\target\\springbootweatherapi.war" "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\"

        echo === WEBAPPS AFTER BACKEND COPY ===
        dir "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps"

        net start Tomcat10
        '''
      }
    }
  }

  post {
    success { echo 'Deployment Successful!' }
    failure { echo 'Pipeline Failed.' }
  }
}
