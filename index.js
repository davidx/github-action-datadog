const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const key = core.getInput('datadog_api_key');
    const datadog_api_key = core.getInput('datadog_api_key');
    const parsley_environment = core.getInput('parsley_environment');
    const parsley_componentname = core.getInput('parsley_componentname');
    const event_title = core.getInput('event_title');
    const event_text = core.getInput('event_text');
    const event_priority = core.getInput('event_priority');
    const alert_type = core.getInput('alert_type');


    console.log(`Hello ${key} ${datadog_api_key} ${parsley_componentname}   ${parsley_environment}  ${event_title} ${event_text} ${event_priority} ${alert_type} `);
    const time = (new Date()).toTimeString();
    core.setOutput("datadog_response", key);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
