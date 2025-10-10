pipeline {
  agent any
  environment {
    TOMCAT_HOME = 'D:\\Program Files\\Apache Software Foundation\\Tomcat 9.0'
    SERVICE_NAME = 'Tomcat9'
    FRONTEND_CTX = 'reactweatherfrontend'
    BACKEND_WAR  = 'springbootweatherapi.war'
  }

  stages {
    stage('Build Frontend') {
      steps {
        dir('weather-frontend') {
          bat 'npm ci'
          bat 'npm run build'
        }
      }
    }

    stage('Deploy Frontend to Tomcat9') {
      steps {
        bat """
        net stop %SERVICE_NAME%

        if exist "%TOMCAT_HOME%\\webapps\\%FRONTEND_CTX%" (
            rmdir /S /Q "%TOMCAT_HOME%\\webapps\\%FRONTEND_CTX%"
        )
        mkdir "%TOMCAT_HOME%\\webapps\\%FRONTEND_CTX%"
        xcopy /E /I /Y "weather-frontend\\dist\\*" "%TOMCAT_HOME%\\webapps\\%FRONTEND_CTX%"

        echo === WEBAPPS AFTER FRONTEND ===
        dir "%TOMCAT_HOME%\\webapps"
        """
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

    stage('Deploy Backend to Tomcat9') {
      steps {
        bat """
        if exist "%TOMCAT_HOME%\\webapps\\%BACKEND_WAR%" del /Q "%TOMCAT_HOME%\\webapps\\%BACKEND_WAR%"
        if exist "%TOMCAT_HOME%\\webapps\\springbootweatherapi" rmdir /S /Q "%TOMCAT_HOME%\\webapps\\springbootweatherapi"
        copy "weather-backend\\target\\%BACKEND_WAR%" "%TOMCAT_HOME%\\webapps\\"

        echo === WEBAPPS AFTER BACKEND COPY ===
        dir "%TOMCAT_HOME%\\webapps"

        net start %SERVICE_NAME%
        """
      }
    }
  }

  post {
    success { echo 'Deployment Successful!' }
    failure { echo 'Pipeline Failed.' }
  }
}
