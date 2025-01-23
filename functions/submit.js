export async function onRequestPost({ request, env }) {
  
  // Use this if the Worker is already handling the API
  const workerUrl = "https://sunnylx.com/temps";

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error connecting to the Worker", { status: 500 });
  }
}

