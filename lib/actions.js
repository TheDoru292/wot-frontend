const backendURL = "http://localhost:3000";

export async function like(tweetId) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/tweet/${tweetId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function bookmark(tweetId) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/tweet/${tweetId}/bookmark`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function removeBookmark(tweetId) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/tweet/${tweetId}/bookmark`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function retweet(tweetId) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/tweet/${tweetId}/retweet`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function reply(tweetId, content) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/tweet/${tweetId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  }).then((res) => res.json());

  return data;
}

export async function deleteTweet(tweetId) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/tweet/${tweetId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function deleteComment(tweetId, commentId) {
  const token = localStorage.getItem("token");

  const data = await fetch(
    `${backendURL}/api/tweet/${tweetId}/comment/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());

  return data;
}

export async function follow(userHandle) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/user/${userHandle}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function unfollow(userHandle) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/user/${userHandle}/follow`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function getTweetLikes(tweetId) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/tweet/${tweetId}/like`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function getTweetRetweets(tweetId) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/tweet/${tweetId}/retweet`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function postTweet(content, giphyUrl) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/tweet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: content, giphyUrl }),
  }).then((res) => res.json());

  return data;
}

export async function getRightSidebarTags() {
  const data = await fetch(`${backendURL}/api/tag/popular`, {
    method: "GET",
  }).then((res) => res.json());

  return data;
}

export async function getTagsFromBackend() {
  const data = await fetch(`${backendURL}/api/tag/`, {
    method: "GET",
  }).then((res) => res.json());

  return data;
}

export async function getRightSidebarUsers(userHandle) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/user/${userHandle}/connect`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Limit: true,
    },
  }).then((res) => res.json());

  return data;
}

export async function getConnectUsers(userHandle) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/user/${userHandle}/connect`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function getUsersFollowing(userHandle) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/user/${userHandle}/following`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}

export async function getUsersFollowers(userHandle) {
  const token = localStorage.getItem("token");

  const data = await fetch(`${backendURL}/api/user/${userHandle}/followers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}
