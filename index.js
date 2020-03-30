const core = require("@actions/core");
const github = require("@actions/github");
const httpm = require("@actions/http-client");

const run = async () => {
    const datadog_api_key = core.getInput("datadog_api_key");
    const datadog_uri = "https://api.datadoghq.com/api/v1/series?api_key=" + datadog_api_key
    // const parsley_componentname = core.getInput("parsley_componentname");
    // const parsley_environment = core.getInput("parsley_environment");
    const parsley_componentname = 'cicd_test'
    const parsley_environment = 'staging'

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    // core.debug("github payload")
    //
    //   core.debug(payload)

    const reponame = payload['full_name']
    const branchname = payload['ref'].split('/').pop();
    const gitsha = payload['after'] // confirm
    const gitauthor = payload['commits'][0]['author']['username']
// ]github payload
//   ##[debug]{
//     ##[debug]  "after": "97b3bdc201a2cd1564faeed121acaefba96df1d6",
//         ##[debug]  "base_ref": null,
//         ##[debug]  "before": "1eeafd235b361ad68a24a32b76807de926041373",
//         ##[debug]  "commits": [
//       ##[debug]    {
//       ##[debug]      "author": {
//       ##[debug]        "email": "davidx@gmail.com",
//           ##[debug]        "name": "David Andersen",
//           ##[debug]        "username": "davidx"
//       ##[debug]      },

    const event_title = "Deploy event for " + parsley_componentname + " in env: " + parsley_environment
    const event_text = "Deploy event for " + parsley_componentname + " in env: " + parsley_environment
    const event_priority = "normal"

    const http = new httpm.HttpClient("http-client-tests");

    const parsley_tags = [
        "environment:" + parsley_environment + " ",
        "componentname:" + parsley_componentname + " ",
        "reponame:" + reponame + " ",
        "branchname:" + branchname + " ",
        "gitsha" + gitsha + " ",
        "gitauthor" + gitauthor + " "
    ]

    const current_time = Math.round((new Date()).getTime() / 1000);

    let datadog_metric_payload = JSON.stringify({
        series: [
            {
                metric: "com.parsleyhealth.cicd.deploy",
                points: [[current_time, 1]],
                type: "count",
                interval: 20,
                host: "cicd.parsleyhealth.com",
                tags: parsley_tags
            }
        ]
    });

    let datadog_event_payload = JSON.stringify({
        title: "Deploy event for " + parsley_componentname,
        text: "Deploy event for " + parsley_componentname,
        priority: "normal",
        tags: parsley_tags
    });

    core.debug(datadog_metric_payload)
    const response = await http.post(datadog_uri, datadog_metric_payload);
    const body = await response.readBody();
    core.debug(body);
};

run();
