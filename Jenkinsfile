pipeline {
    agent any

    stages {

        // ===== FRONTEND BUILD =====
        stage('Build Frontend') {
            steps {
                dir('weather-frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        // ===== FRONTEND DEPLOY =====
        stage('Deploy Frontend to Tomcat') {
            steps {
                bat '''
                if exist "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend" (
                    rmdir /S /Q "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend"
                )
                mkdir "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend"
                xcopy /E /I /Y weather-frontend\\dist\\* "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\reactweatherfrontend"
                '''
            }
        }

        // ===== BACKEND BUILD =====
        stage('Build Backend') {
            steps {
                dir('weather-backend') {
                    bat 'mvn clean package'
                }
            }
        }

        // ===== BACKEND DEPLOY =====
        stage('Deploy Backend to Tomcat') {
            steps {
                bat '''
                if exist "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi.war" (
                    del /Q "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi.war"
                )
                if exist "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi" (
                    rmdir /S /Q "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\springbootweatherapi"
                )
                copy "weather-backend\\target\\*.war" "D:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\"
                '''
            }
        }

    }

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Pipeline Failed.'
        }
    }
}