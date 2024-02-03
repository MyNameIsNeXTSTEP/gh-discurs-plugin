const config = require('./config.json');

const createDiscussionCommentGPLRequest = (comment) => `
    mutation {
        addDiscussionComment (
            input: {
                discussionId: "D_kwDOKGX-vM4AVrMs",
                body: "${comment}",
                clientMutationId: "NextStepBlog"
            }
        ) {
            comment {
                author {
                    login,
                },
                body
            }
        }
    }
`;

const repositoryDiscussionGPLRequest = `{
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
        discussionCategories(first: 10) {
            nodes {
                id # CategoryID
                name
            }
        }
    }
}`;

// const commentToPostInMutation = createDiscussionCommentGPLRequest('test comment from script');
const getDiscussionCategories = (resp) => resp.data.repository.discussionCategories.nodes;
const getDiscussionComments = (resp) => resp.data.repository.discussion.comments.nodes;

// Test on https://docs.github.com/en/graphql/overview/explorer
const discussionComments = fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: repositoryDiscussionGPLRequest })
}).then(resp => resp.json())

discussionComments.then(resp => {
    console.log(
        getDiscussionComments(resp)
    )
});