// This file handles POST requests to the /submit endpoint.

export const onRequestPost = async ({ request, env }) => {
  const defaultData = { temperatures: [] };

  // Helper functions to interact with KV storage
  const getCache = async (key) => await env.TEMPERATURES.get(key);
  const setCache = async (key, data) => await env.TEMPERATURES.put(key, data);

  try {
    // Get the client's IP address
    const ip = request.headers.get("CF-Connecting-IP");
    if (!ip) throw new Error("CF-Connecting-IP header is missing");

    console.log("Processing POST request from IP:", ip);

    // Generate a cache key based on the IP address
    const cacheKey = `data-${ip}`;
    const cache = await getCache(cacheKey);

    // Parse cache or use default data
    let data = cache ? JSON.parse(cache) : defaultData;

    // Parse the body of the request
    const body = await request.json();
    console.log("Request body:", body);

    // Validate and process the data
    if (body.temperature && body.time) {
      // Add the new temperature reading
      data.temperatures.push({
        temperature: parseFloat(body.temperature),
        time: body.time,
      });

      // Save the updated data back to KV
      await setCache(cacheKey, JSON.stringify(data));
      console.log("Temperature added successfully");

      return new Response("Temperature added", { status: 201 });
    } else {
      throw new Error("Invalid JSON body: missing 'temperature' or 'time'");
    }
  } catch (error) {
    console.error("Error in onRequestPost:", error.message);
    return new Response(error.message, { status: 400 });
  }
};
