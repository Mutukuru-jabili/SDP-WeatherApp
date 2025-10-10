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
        if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend" (
            rmdir /S /Q "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend"
        )
        mkdir "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend"
        xcopy /E /I /Y "weather-frontend\\dist\\*" "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend"
        '''
      }
    }

    stage('Build Backend (WAR)') {
      steps {
        dir('weather-backend') {
          bat 'mvn -B -DskipTests clean package'
          bat 'dir target'   // should show springbootweatherapi.war
        }
      }
    }

    stage('Deploy Backend to Tomcat') {
      steps {
        bat '''
        if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi.war" (
            del /Q "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi.war"
        )
        if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi" (
            rmdir /S /Q "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi"
        )
        copy "weather-backend\\target\\springbootweatherapi.war" "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\"
        '''
      }
    }
  }

  post {
    success { echo 'Deployment Successful!' }
    failure { echo 'Pipeline Failed.' }
  }
}
