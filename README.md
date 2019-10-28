# bcs-central-grader


Draft design on moqups:

https://app.moqups.com/83pnXq1zws/view/page/aa9df7b72


Build out as a CLI with Inquirer first, then as a React app

Login (doing automatically for now, then allowing for input)

Dashboard
    View Cohorts assigned to you
        Need to filter out finished cohorts and cohorts you are a TA in
    See total number of grades open
        Sort by: Cohort, assignment, oldest/newest

Grades
    Sort by: Cohort, assignment, oldest/newest
    Highlight any with more than one comment (to help with tracking any changes made)
    List:
        Grade, Cohort, Student, Assignmemnt, Feedback, Date of Grade, Date of most recent feedback,
        feedback total