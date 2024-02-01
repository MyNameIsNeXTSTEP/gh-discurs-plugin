const query = `{
    repository (name: "NextStepBlog", owner: "MyNameIsNeXTSTEP") {
        discussion (number: 23) {
            comments (first: 10) {
                nodes {
                    body
                }
            }
        }
    }
}
`;

// Test on https://docs.github.com/en/graphql/overview/explorer
const discussionComments = fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_FINE_GRAINED_TOKEN}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query })
}).then(resp => resp.json())

discussionComments.then(resp => console.log(resp.data.repository.discussion.comments.nodes));