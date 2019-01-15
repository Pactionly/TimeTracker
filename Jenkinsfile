#!groovy
node('Django_slave') {
    try {
        stage 'Checkout'
          checkout scm
          sh 'git log HEAD^..HEAD --pretty="%h %an - %s" > GIT_CHANGES'
          def lastChanges = readFile('GIT_CHANGES')

        stage 'Test'
            sh 'python3.6 -m venv venv'
            sh '. venv/bin/activate'
            sh 'venv/bin/pip install -r requirements.txt'
            sh 'venv/bin/python3 TimeTracker/manage.py test --testrunner=djtrump.tests.test_runners.NoDbTestRunner'
    }

    catch (err) {
        throw err
    }
}
