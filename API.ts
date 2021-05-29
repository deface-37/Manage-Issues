const API_KEY = "Kn4oohzaRL-f2E5RrD-r"

const query = `query GetIssues($milestone: [String]!) {
  group(fullPath: "CAD") {
    issues(milestoneTitle: $milestone, assigneeUsernames: "malishevis") {
      nodes {
        iid
        id
        totalTimeSpent
        timeEstimate
        webUrl
        closedAt
      }
    }
  }
}`

/**
 * Возвращает список задач за выбранную веху
 * 
 * @param {string} milestone веха
 * @return {Array} массив задач
 */
function getIssues_(milestone) {
  const url = 'https://gitlab.office.ivtecon.ru/api/graphql'

  const gql = {
    query,
    variables: JSON.stringify({milestone})
    }

  let responce = UrlFetchApp.fetch(url, {
    headers: {
      'PRIVATE-TOKEN': API_KEY
    },
    method: 'post',
    payload: gql
  })

  const textData = responce.getContentText()
  const data = JSON.parse(textData)

  if (data.errors) {
    throw new Error(textData)
  }

  return data.data.group.issues.nodes
}