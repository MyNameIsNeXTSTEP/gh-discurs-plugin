const config = require('./config.json');

const query = `{
    repository (name: "${config.repositoryName}", owner: "${config.repositoryOwner}") {
        discussion (number: ${config.discussionNumber}) {
            comments (first: ${config.commentsFirstAmountToTake}) {
                nodes {
                    author {
                      login
                    }
                    body
                    createdAt
                    replies (first: 3) {
                        nodes {
                            author {
                                login
                            },
                            createdAt
                            body,
                        }
                    }
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

discussionComments.then(resp => {
    console.log(
        resp.data.repository.discussion.comments.nodes
    )
});