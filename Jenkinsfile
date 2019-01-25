pipeline {
    agent none
    stages {
        stage('Lint') {
            agent { docker 'af560562826c' }
            steps {
                sh 'pythone3.6 -m venv venv'
                sh '. venv/bin/activate'
                sh 'venv/bin/pip install -r requirements.txt'
                sh 'venv/bin/pylint --load-plugins pylint_django TimeTracker/myapp/'
            }
         }
         //stage('Test') {
            //sh 'venv/bin/python3 TimeTracker/manage.py test TimeTracker/TimeTracker/tests'
          //  agent { docker 'testing_environment' }
           // steps {
            //    sh 'venv/bin/python3 TimeTracker/manage.py test TimeTracker/TimeTracker/tests'
            //}
         //}
    }
}
