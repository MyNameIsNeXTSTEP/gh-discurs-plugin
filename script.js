document.getElementById('print-discussion-comments-btn').onclick = getComments;
document.getElementById('push-comment-btn').onclick = pushComment;
document.getElementById('clear-discussion-comments-btn').onclick = clearCommentsList;
const commentsList = document.getElementById('discussion-comments-list');

async function doRequest(token, reqBody) {
    return await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
        },
        body: reqBody
    }).then(resp => resp.json())
}

function clearCommentsList() {
    if (commentsList) {
        commentsList.innerHTML = '';
    }
};

function pushComment() {
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
    const reqBody = JSON.stringify({
        query: createDiscussionCommentGPLRequest(
            document.getElementById('comment-input').value
        )
    });
    doRequest('', reqBody)
    document.getElementById('comment-input').value = '';
};

function getComments() {
    const repositoryDiscussionGPLRequest = `{
        repository (name: "NextStepBlog", owner: "MyNameIsNeXTSTEP") {
            discussion (number: 23) {
                comments (first: 10) {
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
    const getCommentsFromResp = (resp) => resp.data.repository.discussion.comments.nodes;
    const reqBody = JSON.stringify({ query: repositoryDiscussionGPLRequest });
    const discussionComments = doRequest('', reqBody)

    discussionComments.then(resp => {
        console.log(getCommentsFromResp(resp));
        commentsList.innerHTML = getCommentsFromResp(resp).map(el => {
            return `
                <div class="comment">
                    <p class="comment-body">
                        ${el.body}
                    </p>
                    <span class="comment-author">
                        ${el.author.login}
                    </span>
                    <span class="comment-created-at">
                        ${el.createdAt}
                    </span>
                </div>
            `
        }).join('')
    });
};