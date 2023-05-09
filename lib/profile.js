const backendURL = "https://wot-backend-production.up.railway.app";

export async function getAllProfileUrl() {
  const data = await fetch(`${backendURL}/api/user`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${process.env.TOKEN}`,
    },
  }).then((res) => res.json());

  const mappedData = data.users.map((user) => {
    return {
      params: {
        id: user.handle,
      },
    };
  });

  return mappedData;
}
