pipeline {
  agent any
  environment {
    TOMCAT_HOME = 'D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1'
    SERVICE_NAME = 'Tomcat10'              // <-- use the exact service name from step 2
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

    stage('Stop Tomcat10 (only if running)') {
      steps {
        bat """
        sc query "%SERVICE_NAME%" | find /I "RUNNING" >nul
        if %ERRORLEVEL%==0 (
          echo Stopping %SERVICE_NAME%...
          net stop "%SERVICE_NAME%" /y
        ) else (
          echo %SERVICE_NAME% is already stopped.
        )
        """
      }
    }

    stage('Deploy Frontend to Tomcat10') {
      steps {
        bat """
        if exist "%TOMCAT_HOME%\\webapps\\%FRONTEND_CTX%" rmdir /S /Q "%TOMCAT_HOME%\\webapps\\%FRONTEND_CTX%"
        mkdir "%TOMCAT_HOME%\\webapps\\%FRONTEND_CTX%"
        xcopy /E /I /Y "weather-frontend\\dist\\*" "%TOMCAT_HOME%\\webapps\\%FRONTEND_CTX%"
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

    stage('Deploy Backend to Tomcat10') {
      steps {
        bat """
        if exist "%TOMCAT_HOME%\\webapps\\%BACKEND_WAR%" del /Q "%TOMCAT_HOME%\\webapps\\%BACKEND_WAR%"
        if exist "%TOMCAT_HOME%\\webapps\\springbootweatherapi" rmdir /S /Q "%TOMCAT_HOME%\\webapps\\springbootweatherapi"
        copy "weather-backend\\target\\%BACKEND_WAR%" "%TOMCAT_HOME%\\webapps\\"
        dir "%TOMCAT_HOME%\\webapps"
        """
      }
    }

    stage('Start Tomcat10 (only if stopped)') {
      steps {
        bat """
        sc query "%SERVICE_NAME%" | find /I "RUNNING" >nul
        if %ERRORLEVEL%==0 (
          echo %SERVICE_NAME% already running.
        ) else (
          echo Starting %SERVICE_NAME%...
          net start "%SERVICE_NAME%" || (echo Ignoring non-zero code from net start & ver >nul)
        )
        """
      }
    }

    // Use PowerShell to avoid "Input redirection is not supported" from CMD 'timeout'
    stage('Wait for WAR to explode') {
      steps {
        powershell """
          $ctx = "$env:TOMCAT_HOME\\webapps\\springbootweatherapi\\WEB-INF"
          for ($i=0; $i -lt 60; $i++) {
            if (Test-Path $ctx) { Write-Host 'App exploded. Proceeding.'; exit 0 }
            Start-Sleep -Seconds 2
          }
          Write-Error 'WAR did not explode in time.'; exit 1
        """
      }
    }

    // Optional: health check (if actuator added)
    // stage('Health check') {
    //   steps {
    //     powershell 'Invoke-WebRequest http://localhost:8080/springbootweatherapi/actuator/health -UseBasicParsing | Out-Null'
    //   }
    // }
  }

  post {
    success { echo 'Deployment Successful!' }
    failure { echo 'Pipeline Failed.' }
  }
}
